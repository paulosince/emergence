"""V0.18 — cena: sinais nos dois microfones (física do mundo; não é o sistema).
Sala de 2 × 2 × 3 m da V0.17, dois alto-falantes, robô parado, SEM reflexões (decisão de 18/11).
Cabeça esférica de 10 cm (Brown & Duda 1998, como na V0.17; aproximação declarada da caixa de 8 × 10 × 9 cm).
Calibração de nível: o trecho mais forte da peça inteira (janela RMS de 125 ms no microfone mais próximo) = 85 dB SPL.
Fórmulas da cabeça copiadas de ../v17/ensaio-minimo/sinais_microfones.py (fontes declaradas lá)."""
import os, subprocess
import numpy as np
from scipy.signal import resample_poly, bilinear, lfilter

C, A = 343.0, 0.05
FS_IN, FS = 44100, 48000
HEAD = np.array([0.6, 1.0, 0.355]); NEAR = np.array([0.0, 1.0, 0.355]); FAR = np.array([2.0, 1.0, 0.355])
EARS = {"esq": -100.0, "dir": +100.0}
P_REF = 20e-6                     # Pa
PICO_DB = 85.0                    # decisão de 18/11
JANELA_PICO = 0.125               # s (RMS "rápido" de medidor de nível; escolha declarada do assistente)
SENSIB_MIC_DB = 0.0               # responsável, 19/11: a redução de sensibilidade passou para os limiares, por área (ver pontos.py)
REFL_SUBIDA, REFL_DESCIDA = 0.050, 0.200   # s; latência do reflexo 25–150 ms (fonte secundária, baixa confiança); assistente
AQUI = os.path.dirname(os.path.abspath(__file__))
GRAVACAO = os.path.join(AQUI, "..", "..", "v17", "estimulo", "Toccata_et_Fugue_BWV565.ogg")

def azimute(src):
    v = src - HEAD; return np.degrees(np.arctan2(v[0], v[1]))

def sombra(x, theta_rel):
    alfa = 1.05 + 0.95 * np.cos(np.radians(theta_rel / 150.0 * 180.0))
    w0 = C / A
    b, a = bilinear([alfa / (2 * w0), 1.0], [1 / (2 * w0), 1.0], FS)
    return lfilter(b, a, x)

def woodworth(theta_rel):
    th = np.radians(abs(theta_rel))
    return (-A * np.cos(th) / C) if th < np.pi / 2 else (A / C) * (th - np.pi / 2)

def atrasar(x, d):
    n = int(np.floor(d * FS)); fr = d * FS - n
    y = np.zeros_like(x); y[n:] = (1 - fr) * x[:len(x) - n]
    y[n + 1:] += fr * x[:len(x) - n - 1]; return y

def ouvidos(sinais):
    out = {}
    for ear, ang in EARS.items():
        acc = 0
        for s, src in sinais:
            r = np.linalg.norm(src - HEAD); rel = ((azimute(src) - ang + 180) % 360) - 180
            acc = acc + atrasar(sombra(s, rel), r / C + woodworth(rel)) / r
        out[ear] = acc
    return out

def ler(inicio=None, dur=None, gravacao=None):
    cmd = ["ffmpeg", "-v", "error"]
    if inicio is not None: cmd += ["-ss", str(inicio)]
    if dur is not None: cmd += ["-t", str(dur)]
    cmd += ["-i", gravacao or GRAVACAO, "-f", "f32le", "-acodec", "pcm_f32le", "-ac", "2", "-"]
    raw = subprocess.run(cmd, capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)
    return [resample_poly(x[:, i], 160, 147) for i in (0, 1)]       # 44,1 -> 48 kHz

def ganho_calibracao(gravacao=None):
    """Ganho (Pa por unidade digital) que leva o trecho mais forte da peça inteira a 85 dB SPL no microfone mais próximo.
    Mesma regra para toda gravação (decisão de 18/11 para o Bach, estendida às outras obras: escolha declarada)."""
    nome = "" if gravacao is None else "-" + os.path.splitext(os.path.basename(gravacao))[0]
    cache = os.path.join(AQUI, f"ganho-calibracao{nome}.txt")
    if os.path.exists(cache): return float(open(cache).read().split()[0])
    L, R = ler(gravacao=gravacao)
    o = ouvidos([(L, NEAR), (R, FAR)])
    n = int(JANELA_PICO * FS); best = 0.0
    for ear in o:
        x2 = o[ear] ** 2; cs = np.concatenate(([0.0], np.cumsum(x2)))
        rms = np.sqrt((cs[n:] - cs[:-n]) / n); best = max(best, rms.max())
    g = P_REF * 10 ** (PICO_DB / 20) / best
    open(cache, "w").write(f"{float(g)!r} Pa/unidade; RMS máximo (125 ms) = {float(best)!r} unidades; pico = {PICO_DB} dB SPL\n")
    return g

def nivel_reflexo(o):
    """Nível (dB SPL) que comanda a atenuação para som forte: RMS de 125 ms do ouvido mais forte (som real, antes do
    microfone), com subida e descida lentas (primeira ordem). Bilateral."""
    n = int(JANELA_PICO * FS); best = None
    for v in o.values():
        cs = np.concatenate(([0.0], np.cumsum(v ** 2))); i = np.arange(len(v))
        rms = np.sqrt(np.maximum(cs[i + 1] - cs[np.maximum(i + 1 - n, 0)], 0) / n)
        best = rms if best is None else np.maximum(best, rms)
    L = 20 * np.log10(best / P_REF + 1e-12)
    out = np.empty_like(L); y = L[0]; au, ad = np.exp(-1 / (REFL_SUBIDA * FS)), np.exp(-1 / (REFL_DESCIDA * FS))
    from numba import njit
    @njit(cache=False)
    def suaviza(L, out, au, ad):
        y = L[0]
        for k in range(len(L)):
            a = au if L[k] > y else ad
            y = a * y + (1 - a) * L[k]; out[k] = y
        return out
    return suaviza(L, out, au, ad)

def microfones(inicio, dur, gravacao=None, cru=False):
    """Pressão (Pa) nos dois microfones, 48 kHz, para o trecho [inicio, inicio + dur) da gravação; canal esquerdo no
    alto-falante próximo. Já inclui a sensibilidade do microfone (−10 dB). Com cru=True, devolve também o nível do reflexo."""
    g = ganho_calibracao(gravacao)
    L, R = ler(inicio, dur, gravacao)
    o = {k: v * g for k, v in ouvidos([(L, NEAR), (R, FAR)]).items()}
    s = 10 ** (SENSIB_MIC_DB / 20)
    mic = {k: v * s for k, v in o.items()}
    if cru: return mic, (L * g, R * g), nivel_reflexo(o)
    return mic, (L * g, R * g)
