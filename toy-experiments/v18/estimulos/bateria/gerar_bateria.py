"""V0.18 — bateria de estímulos de teste da borda auditiva (proposta do assistente, a aprovar pelo responsável).
Sons sintéticos com resposta conhecida + dois trechos de voz (LibriVox, domínio público).

Cada estímulo é gravado como sinal de UMA fonte, em pascal, com o nível dado no ponto da cabeça (campo livre, antes da
cabeça). A posição da fonte (azimute) vai no catálogo; a cena aplica cabeça, distância e ouvidos na hora de rodar.

Saída: bateria-<grupo>.wav (48 kHz, float32, mono) + catalogo.json (cada trecho: início, fim, grupo, parâmetros) e
uma prévia para ouvir: previa-<grupo>.ogg (normalizada só para ouvir).
Uso: python gerar_bateria.py"""
import json, os, subprocess
import numpy as np

FS = 48000
P_REF = 20e-6
RNG = np.random.default_rng(1918)
AQUI = os.path.dirname(os.path.abspath(__file__))
REP = 5                                      # repetições de cada condição
JIT_DB, JIT_AZ = 0.5, 0.5                    # variação pequena entre repetições: ±0,5 dB, ±0,5° e fase inicial ao acaso

def pa(db): return P_REF * 10 ** (db / 20)   # RMS em Pa

def rampa(x, ms):
    n = int(ms * 1e-3 * FS)
    if n == 0: return x
    w = np.sin(np.linspace(0, np.pi / 2, n)) ** 2
    x = x.copy(); x[:n] *= w; x[-n:] *= w[::-1]; return x

def tom(f, db, dur, fase=None, r=5.0):
    t = np.arange(int(dur * FS)) / FS
    fase = RNG.uniform(0, 2 * np.pi) if fase is None else fase
    return rampa(np.sqrt(2) * pa(db) * np.sin(2 * np.pi * f * t + fase), r)

def ruido(db, dur, r=5.0):
    x = RNG.standard_normal(int(dur * FS))
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / FS); X[f > 10000] = 0; x = np.fft.irfft(X, len(x))
    return rampa(pa(db) * x / np.sqrt(np.mean(x ** 2)), r)

def silencio(dur): return np.zeros(int(dur * FS))

class Grupo:
    def __init__(self, nome): self.nome, self.partes, self.cat, self.t = nome, [], [], 0.0
    def add(self, x, **meta):
        self.cat.append(dict(grupo=self.nome, inicio=self.t, fim=self.t + len(x) / FS, **meta))
        self.partes.append(x); self.t += len(x) / FS
    def pausa(self, dur): self.partes.append(silencio(dur)); self.t += dur
    def sinal(self): return np.concatenate(self.partes)

def jit(): return RNG.uniform(-JIT_DB, JIT_DB), RNG.uniform(-JIT_AZ, JIT_AZ)

grupos = []

# 1. Tons puros: mapa de resposta e reprodutibilidade
g = Grupo("1-tons-puros")
for f in (125, 250, 500, 1000, 2000, 4000, 8000):
    for db in (30, 50, 70, 85):
        for r in range(REP):
            dj, aj = jit(); g.add(tom(f, db + dj, 0.3), f=f, db=db + dj, db_nominal=db, azimute=aj, rep=r); g.pausa(0.3)
grupos.append(g)

# 2. Intensidade fina
g = Grupo("2-intensidade")
for f in (1000, 4000):
    for base in (40, 70):
        for d in (0, 0.5, 1, 2, 3, 6):
            for r in range(REP):
                _, aj = jit(); g.add(tom(f, base + d, 0.3), f=f, db=base + d, base=base, delta_db=d, azimute=aj, rep=r); g.pausa(0.3)
grupos.append(g)

# 3. Tom e semitom: pares referência → comparação
g = Grupo("3-tom-e-semitom")
DELTAS = {"0,2%": 1.002, "0,5%": 1.005, "1%": 1.01, "semitom": 2 ** (1 / 12), "tom": 2 ** (2 / 12), "quinta": 1.5, "oitava": 2.0}
for f0 in (250, 1000, 4000):
    for nome, k in DELTAS.items():
        for r in range(REP):
            dj, aj = jit()
            g.add(tom(f0, 60 + dj, 0.3), f=f0, db=60 + dj, papel="referencia", delta=nome, azimute=aj, rep=r); g.pausa(0.2)
            dj2, _ = jit()
            g.add(tom(f0 * k, 60 + dj2, 0.3), f=f0 * k, db=60 + dj2, papel="comparacao", delta=nome, azimute=aj, rep=r); g.pausa(0.4)
grupos.append(g)

# 4. Separação no tempo
g = Grupo("4-tempo")
for portador in ("ruido", "tom1k"):                         # 4a. pausa no meio do som
    for gap_ms in (0, 1, 2, 3, 5, 10, 20):
        for r in range(REP):
            dj, aj = jit(); m = 0.3
            a = ruido(60 + dj, m, r=0.5) if portador == "ruido" else tom(1000, 60 + dj, m, r=0.5)
            b = ruido(60 + dj, m, r=0.5) if portador == "ruido" else tom(1000, 60 + dj, m, r=0.5)
            x = np.concatenate([a, silencio(gap_ms / 1000), b]) if gap_ms else np.concatenate([a, b]) if portador == "ruido" else tom(1000, 60 + dj, 2 * m, r=0.5)
            g.add(x, teste="pausa", portador=portador, pausa_ms=gap_ms, db=60 + dj, azimute=aj, rep=r); g.pausa(0.4)
for ass_ms in (0, 2, 5, 10, 20, 40):                       # 4b. dois inícios quase juntos, nas duas ordens
    for ordem in ("500 primeiro", "2000 primeiro"):
        for r in range(REP):
            dj, aj = jit(); n = int(ass_ms / 1000 * FS)
            a, b = tom(500, 60 + dj, 0.3), tom(2000, 60 + dj, 0.3)
            x = np.zeros(len(a) + n)
            if ordem == "500 primeiro": x[:len(a)] += a; x[n:n + len(b)] += b
            else: x[:len(b)] += b; x[n:n + len(a)] += a
            g.add(x, teste="assincronia", assincronia_ms=ass_ms, ordem=ordem, db=60 + dj, azimute=aj, rep=r); g.pausa(0.4)
for taxa in (2, 5, 10, 20, 50):                            # 4c. ritmo: pulsos de 1 kHz, 10 ms
    dj, aj = jit(); x = np.zeros(int(2.0 * FS)); p = tom(1000, 60 + dj, 0.010, r=2.0)
    for k in range(int(2.0 * taxa)): i = int(k / taxa * FS); x[i:i + len(p)] += p[:len(x) - i]
    g.add(x, teste="ritmo", pulsos_por_s=taxa, db=60 + dj, azimute=aj); g.pausa(0.5)
grupos.append(g)

# 5. Direção (fonte virtual a 1 m, no plano dos ouvidos; azimute positivo = para a esquerda)
g = Grupo("5-direcao")
for portador in ("ruido", "tom500"):
    for az in (0, 1, 2, 5, 10, 20, 45, 90):
        for r in range(REP):
            dj, aj = jit()
            x = ruido(60 + dj, 0.3) if portador == "ruido" else tom(500, 60 + dj, 0.3)
            g.add(x, portador=portador, azimute=az + aj, azimute_nominal=az, db=60 + dj, rep=r); g.pausa(0.3)
grupos.append(g)

# 6. Voz: vogais sintéticas (verdade conhecida) + dois trechos reais
g = Grupo("6-voz")
FORM = {  # formantes F1, F2, F3 (Hz): Peterson e Barney 1952, médias de homens e mulheres (de memória, a conferir)
    ("a", 120): (730, 1090, 2440), ("i", 120): (270, 2290, 3010), ("u", 120): (300, 870, 2240),
    ("a", 220): (850, 1220, 2810), ("i", 220): (310, 2790, 3310), ("u", 220): (370, 950, 2670)}
def vogal(v, f0, db, dur=0.4):
    n = int(dur * FS); x = np.zeros(n); per = FS / f0
    for k in range(int(n / per)): x[int(k * per)] = 1.0                    # pulsos glotais
    from scipy.signal import lfilter
    x = lfilter([1.0], [1, -1.9 * np.exp(-2 * np.pi * 100 / FS), 0.9 * np.exp(-4 * np.pi * 100 / FS)], x)   # inclinação da fonte
    x = np.diff(x, prepend=0.0)                                              # radiação nos lábios (+6 dB/oitava)
    for F, B in zip(FORM[(v, f0)], (60, 90, 150)):                           # ressonadores em cascata, ganho 1 em 0 Hz (Klatt 1980)
        rr = np.exp(-np.pi * B / FS); th = 2 * np.pi * F / FS; Bk = 2 * rr * np.cos(th); Ck = -rr * rr
        x = lfilter([1 - Bk - Ck], [1, -Bk, -Ck], x)
    x = rampa(x, 20.0); return pa(db) * x / np.sqrt(np.mean(x ** 2))
for f0 in (120, 220):
    for v in ("a", "i", "u"):
        for r in range(REP):
            dj, aj = jit(); g.add(vogal(v, f0, 65 + dj), teste="vogal", vogal=v, f0=f0, db=65 + dj, azimute=aj, rep=r); g.pausa(0.3)
def ler_mp3(nome, ini, dur, db):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(ini), "-t", str(dur), "-i", os.path.join(AQUI, "..", nome),
                          "-f", "f32le", "-ac", "1", "-ar", str(FS), "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32).astype(np.float64)
    return rampa(pa(db) * x / np.sqrt(np.mean(x ** 2)), 10.0)
for nome, ini in (("voz-machado-advertencia-librivox.mp3", 20.0), ("voz-azevedo-filha-do-patrao-librivox.mp3", 30.0)):
    g.add(ler_mp3(nome, ini, 10.0, 65), teste="fala", arquivo=nome, trecho_s=[ini, ini + 10], db=65, azimute=0.0); g.pausa(0.5)
grupos.append(g)

# 7. Duas fontes ao mesmo tempo (posições diferentes)
g = Grupo("7-duas-fontes")
for r in range(REP):
    a, b = tom(500, 60, 1.0), tom(600, 60, 1.0)
    g.add(a, teste="dois-tons", fonte="500 Hz", azimute=30.0, par=r); g.cat[-1]["simultaneo_com_proximo"] = True
    g.t -= 1.0; g.partes.pop(); g.add(b, teste="dois-tons", fonte="600 Hz", azimute=-30.0, par=r)
    g.partes[-1] = a + b; g.pausa(0.5)          # o arquivo mono guarda a soma só para ouvir; a cena usa as fontes separadas
grupos.append(g)

cat = []
for g in grupos:
    x = g.sinal().astype(np.float32)
    x.tofile(os.path.join(AQUI, f"bateria-{g.nome}.f32"))       # Pa, 48 kHz, float32 cru
    y = (x / np.abs(x).max() * 0.8).astype(np.float32)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(FS), "-ac", "1", "-i", "-", "-c:a", "libvorbis", "-q:a", "4",
                    os.path.join(AQUI, f"previa-{g.nome}.ogg")], input=y.tobytes(), check=True)
    cat += g.cat
    print(f"{g.nome}: {len(g.cat)} trechos, {g.t:.1f} s")
json.dump(dict(fs=FS, unidade="Pa no ponto da cabeça (campo livre)", repeticoes=REP, variacao=dict(db=JIT_DB, azimute_graus=JIT_AZ, fase="ao acaso"),
               trechos=cat), open(os.path.join(AQUI, "catalogo.json"), "w"), indent=1, default=float)
print("total:", round(sum(g.t for g in grupos), 1), "s")
