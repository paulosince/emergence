"""Ensaio mínimo, parte 1 — sinais nos microfones (controle de engenharia, observador).
Uso: python3 -I sinais_microfones.py ../estimulo/Toccata_et_Fugue_BWV565.ogg
Geometria das decisões D14/D19 (16/11/2026). Sem reflexões (subexperimento a).
Cabeça: modelo esférico de Brown e Duda (1998): filtro de sombra de 1 polo e 1 zero,
alfa(theta) = 1,05 + 0,95 cos(theta/150° · 180°), omega0 = c/a, orelhas a ±100°;
atraso em torno da esfera pela fórmula de Woodworth. Fórmulas tiradas de fonte secundária
(patente US 8270616, que cita o artigo) e de extração parcial do artigo: verificar no original."""
import subprocess, sys, numpy as np
from scipy.signal import resample_poly, bilinear, lfilter, butter, sosfiltfilt

C, A = 343.0, 0.05            # velocidade do som (m/s); raio da cabeça = metade da distância entre microfones
FS_IN, FS = 44100, 48000
HEAD = np.array([0.6, 1.0, 0.355]); NEAR = np.array([0.0, 1.0, 0.355]); FAR = np.array([2.0, 1.0, 0.355])
# Robô de lado: frente apontando para +y; orelha esquerda para -x (voltada ao alto-falante próximo).
EARS = {"esq": -100.0, "dir": +100.0}   # ângulo da orelha em relação à frente (graus); azimute positivo = direita

def azimute(src):
    v = src - HEAD; return np.degrees(np.arctan2(v[0], v[1]))   # 0° = frente (+y); +90° = direita (+x)

def sombra(x, theta_rel):
    alfa = 1.05 + 0.95 * np.cos(np.radians(theta_rel / 150.0 * 180.0))
    w0 = C / A
    b, a = bilinear([alfa / (2 * w0), 1.0], [1 / (2 * w0), 1.0], FS)
    return lfilter(b, a, x)

def woodworth(theta_rel):
    """Atraso extra (s) de uma orelha em relação ao centro da cabeça, por ângulo relativo à orelha."""
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

def medir(o, nome):
    e, d = o["esq"], o["dir"]
    bp = lambda x, lo, hi: sosfiltfilt(butter(4, [lo, hi], btype="band", fs=FS, output="sos"), x)
    lo_e, lo_d = bp(e, 300, 800), bp(d, 300, 800)
    m = int(0.002 * FS); cc = [np.dot(lo_e[m:-m], np.roll(lo_d, k)[m:-m]) for k in range(-m, m + 1)]
    k = int(np.argmax(cc)) - m
    ild = lambda lo, hi: 20 * np.log10(np.std(bp(e, lo, hi)) / np.std(bp(d, lo, hi)))
    print(f"{nome}: atraso da orelha direita em relação à esquerda (300–800 Hz) = {-1000*k/FS:+.3f} ms; "
          f"diferença de nível esq−dir: 500 Hz–1 kHz {ild(500,1000):+.1f} dB; 2–4 kHz {ild(2000,4000):+.1f} dB; 4–8 kHz {ild(4000,7900):+.1f} dB")

raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", "200", "-t", "10", "-i", sys.argv[1], "-f", "f32le",
                      "-acodec", "pcm_f32le", "-ac", "2", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)
L, R = (resample_poly(x[:, i], 160, 147) for i in (0, 1))   # 44,1 -> 48 kHz
print(f"azimutes: próximo {azimute(NEAR):+.0f}°, distante {azimute(FAR):+.0f}°; "
      f"distâncias {np.linalg.norm(NEAR-HEAD):.2f} m e {np.linalg.norm(FAR-HEAD):.2f} m")
print(f"Woodworth a 90°: {1000*(A/C)*(np.pi/2+1):.3f} ms; linha reta entre microfones: {1000*2*A/C:.3f} ms")
medir(ouvidos([(L, NEAR)]), "só o próximo (canal E)")
medir(ouvidos([(R, FAR)]), "só o distante (canal D)")
medir(ouvidos([(L, NEAR), (R, FAR)]), "os dois juntos")
