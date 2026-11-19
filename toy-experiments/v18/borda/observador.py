"""V0.18 — observador externo (prova necessária), PRELIMINAR: os critérios de "suficiente" ainda não foram definidos.
Para cada comparação, classifica as repetições pelo vizinho mais próximo, deixando uma de fora (as repetições variam
±0,5 dB, ±0,5° e na fase). Acerto de 100% = as duas condições são sempre separáveis; 50% = acaso.
Leituras: "onde" = quantas incidências em cada ponto transdutivo (vetor de 21.731 por ouvido);
"quando" = envoltória das incidências no tempo (bins de 1 ms) ou atraso entre ouvidos."""
import os, glob, json
import numpy as np
import pontos, coclea

AQUI = os.path.dirname(os.path.abspath(__file__))
CAT = json.load(open(os.path.join(AQUI, "..", "estimulos", "bateria", "catalogo.json")))["trechos"]
P = pontos.construir(); CAP = np.array([len(p["limiar_db"]) for p in P]); OFF = np.r_[0, np.cumsum(CAP)]; NP = OFF[-1]
FC = coclea.centros()

def eventos(g, e):
    fs = sorted(glob.glob(os.path.join(AQUI, "bateria", g, f"{e}-*.npz")))
    z = [np.load(f) for f in fs]
    t = np.concatenate([x["tus"] for x in z]).astype(np.int64); f = np.concatenate([x["f"] for x in z]).astype(np.int64)
    k = np.concatenate([x["k"] for x in z]).astype(np.int64)
    o = np.argsort(t, kind="stable"); return t[o], f[o], k[o]

def janela(ev, a, b):
    t = ev[0]; i0, i1 = np.searchsorted(t, int(a * 1e6)), np.searchsorted(t, int(b * 1e6)); return t[i0:i1], ev[1][i0:i1], ev[2][i0:i1]

def onde(ev, tr, pos=0.02):
    t, f, k = janela(ev, tr["inicio"], tr["fim"] + pos)
    return np.sqrt(np.bincount(OFF[f] + k, minlength=NP).astype(float))

def quando(ev, tr, a, b, passo=1e-3):
    t, f, k = janela(ev, tr["inicio"] + a, tr["inicio"] + b)
    return np.sqrt(np.bincount(((t - int((tr["inicio"] + a) * 1e6)) // int(passo * 1e6)).astype(int), minlength=int(round((b - a) / passo)) + 1)[:int(round((b - a) / passo))].astype(float))

def dist(x, y):
    x = x - x.mean(); y = y - y.mean(); d = np.linalg.norm(x) * np.linalg.norm(y)
    return 1.0 if d == 0 else 1 - float(x @ y) / d

def acerto(A, B):
    X = A + B; lab = [0] * len(A) + [1] * len(B); ok = 0
    for i in range(len(X)):
        d = [dist(X[i], X[j]) if j != i else np.inf for j in range(len(X))]
        ok += lab[int(np.argmin(d))] == lab[i]
    return ok / len(X)

res = {}
# 1. Tom e semitom (onde)
g = "3-tom-e-semitom"; ev = eventos(g, "esq"); tr = [t for t in CAT if t["grupo"] == g]; r = {}
for f0 in (250, 1000, 4000):
    for d in ("0,2%", "0,5%", "1%", "semitom"):
        A = [onde(ev, t) for t in tr if t["papel"] == "referencia" and t["delta"] == d and abs(t["f"] - f0) < 1]
        B = [onde(ev, t) for t in tr if t["papel"] == "comparacao" and t["delta"] == d and abs(t["f"] / f0 - 1) < 0.2]
        r[f"{f0} Hz {d}"] = acerto(A, B)
res["tom e semitom (onde)"] = r; print("tom e semitom:", r)
del ev
# 2. Intensidade (onde)
g = "2-intensidade"; ev = eventos(g, "esq"); tr = [t for t in CAT if t["grupo"] == g]; r = {}
for f in (1000, 4000):
    for base in (40, 70):
        A = [onde(ev, t) for t in tr if t["f"] == f and t["base"] == base and t["delta_db"] == 0]
        for d in (0.5, 1, 2, 3, 6):
            B = [onde(ev, t) for t in tr if t["f"] == f and t["base"] == base and t["delta_db"] == d]
            r[f"{f} Hz {base} dB +{d} dB"] = acerto(A, B)
res["intensidade (onde)"] = r; print("intensidade:", r)
del ev
# 3. Tempo: pausa (quando, 0,25–0,40 s do trecho) e ordem dos inícios (onde+quando nos primeiros 60 ms, por faixa)
g = "4-tempo"; ev = eventos(g, "esq"); tr = [t for t in CAT if t["grupo"] == g]; r = {}
for port in ("ruido", "tom1k"):
    A = [quando(ev, t, 0.25, 0.40) for t in tr if t.get("teste") == "pausa" and t["portador"] == port and t["pausa_ms"] == 0]
    for gm in (1, 2, 3, 5, 10, 20):
        B = [quando(ev, t, 0.25, 0.40) for t in tr if t.get("teste") == "pausa" and t["portador"] == port and t["pausa_ms"] == gm]
        r[f"pausa {gm} ms ({'ruído' if port == 'ruido' else 'tom 1 kHz'})"] = acerto(A, B)
def inicio_por_faixa(t0):
    t, f, k = janela(ev, t0["inicio"], t0["inicio"] + 0.06)
    b = ((t - int(t0["inicio"] * 1e6)) // 1000).astype(int)
    return np.sqrt(np.bincount(f * 60 + np.minimum(b, 59), minlength=64 * 60).astype(float))
for a in (2, 5, 10, 20, 40):
    A = [inicio_por_faixa(t) for t in tr if t.get("teste") == "assincronia" and t["assincronia_ms"] == a and t["ordem"] == "500 primeiro"]
    B = [inicio_por_faixa(t) for t in tr if t.get("teste") == "assincronia" and t["assincronia_ms"] == a and t["ordem"] == "2000 primeiro"]
    r[f"ordem com {a} ms"] = acerto(A, B)
res["tempo"] = r; print("tempo:", r)
del ev
# 4. Direção: atraso entre ouvidos (faixas até 1,2 kHz) e diferença de pontos ativos
g = "5-direcao"; E = {e: eventos(g, e) for e in ("esq", "dir")}; tr = [t for t in CAT if t["grupo"] == g]; r = {}; itd = {}
baixas = np.where(FC <= 1200)[0]
def atraso(t0):
    h = {}
    for e in E:
        t, f, k = janela(E[e], t0["inicio"] + 0.05, t0["fim"]); m = np.isin(f, baixas)
        h[e] = np.bincount(((t[m] - int((t0["inicio"] + 0.05) * 1e6)) // 10).astype(int), minlength=30000)[:30000].astype(float)
    a, b = h["esq"] - h["esq"].mean(), h["dir"] - h["dir"].mean(); L = 100
    cc = np.fft.irfft(np.conj(np.fft.rfft(a, 60000)) * np.fft.rfft(b, 60000))
    v = np.r_[cc[-L:], cc[:L + 1]]; return (np.argmax(v) - L) * 10.0          # µs; >0 = direito atrasado
for port in ("ruido", "tom500"):
    for az in (0, 1, 2, 5, 10, 20, 45, 90):
        itd[(port, az)] = [atraso(t) for t in tr if t["portador"] == port and t["azimute_nominal"] == az]
    for az in (1, 2, 5, 10, 20):
        A = [np.array([x]) for x in itd[(port, 0)]]; B = [np.array([x]) for x in itd[(port, az)]]
        a, b = np.array(itd[(port, 0)]), np.array(itd[(port, az)])
        r[f"{'ruído' if port == 'ruido' else 'tom 500 Hz'} 0° × {az}°"] = float(np.mean([abs(x - a).min() > 0 for x in b]) if False else (1.0 if b.min() > a.max() or b.max() < a.min() else 0.5 + 0.5 * np.mean([(x > a.max()) or (x < a.min()) for x in b])))
res["direção (atraso entre ouvidos)"] = r
res["atrasos_us"] = {f"{p} {az}°": [round(x) for x in v] for (p, az), v in itd.items()}
print("direção:", r); print({k: v for k, v in res["atrasos_us"].items()})
del E
# 5. Vogais (onde): /a/ × /i/ × /u/, por par
g = "6-voz"; ev = eventos(g, "esq"); tr = [t for t in CAT if t["grupo"] == g]; r = {}
for f0 in (120, 220):
    V = {v: [onde(ev, t) for t in tr if t.get("vogal") == v and t["f0"] == f0] for v in ("a", "i", "u")}
    for x, y in (("a", "i"), ("a", "u"), ("i", "u")):
        r[f"/{x}/ × /{y}/ em {f0} Hz"] = acerto(V[x], V[y])
res["vogais (onde)"] = r; print("vogais:", r)
json.dump(res, open(os.path.join(AQUI, "observador-preliminar.json"), "w"), indent=1, ensure_ascii=False)
