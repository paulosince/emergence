"""V0.18 — primeiras medidas do observador na bateria (descritivas; prova necessária, não suficiente).
Lê as incidências guardadas em bateria/<grupo>/ e mede, com a variação entre repetições como referência:
  1. Direção (grupo 5): diferença de chegada estimada pela correlação cruzada esq × dir, faixas até 1,2 kHz.
  2. Tom e semitom (grupo 3): (a) lugar: distância entre os padrões de pontos ativos; (b) tempo: período estimado pela
     autocorrelação das incidências nas faixas perto da frequência (só onde há travamento de fase).
  3. Pausa (grupo 4a): queda de incidências na janela da pausa, comparada com a condição sem pausa.
Saída: observador-bateria.json"""
import os, json, glob
import numpy as np
import coclea, pontos

AQUI = os.path.dirname(os.path.abspath(__file__))
BAT = os.path.join(AQUI, "bateria")
CAT = json.load(open(os.path.join(AQUI, "..", "estimulos", "bateria", "catalogo.json")))["trechos"]
FC = coclea.centros(); P = pontos.construir(); CAP = np.array([len(p["limiar_db"]) for p in P])
A, C = 0.05, 343.0

def carregar(g, e):
    fs = sorted(glob.glob(os.path.join(BAT, g, f"{e}-*.npz"))); z = [np.load(f) for f in fs]
    return {k: np.concatenate([q[k] for q in z]) for k in ("tus", "f", "k", "m255")}

def recorte(ev, ini, fim, faixas=None):
    a, b = np.searchsorted(ev["tus"], [ini * 1e6, fim * 1e6])
    s = slice(a, b); t, f, k = ev["tus"][s], ev["f"][s], ev["k"][s]
    if faixas is not None:
        m = np.isin(f, faixas); t, f, k = t[m], f[m], k[m]
    return t, f, k

res = {}
# ---------- 1. Direção ----------
ee = {e: carregar("5-direcao", e) for e in ("esq", "dir")}
baixas = np.where(FC <= 1200)[0]
def atraso(tr):
    lag_max, b = 1000, 5          # µs
    tot = None
    for fx in baixas:
        h = {}
        for e in ee:
            t, f, k = recorte(ee[e], tr["inicio"] + 0.02, tr["fim"], [fx])
            h[e] = np.bincount(((t - tr["inicio"] * 1e6) / b).astype(int), minlength=int((tr["fim"] - tr["inicio"]) * 1e6 / b) + 10).astype(float)
        n = min(len(h["esq"]), len(h["dir"])); x, y = h["esq"][:n] - h["esq"][:n].mean(), h["dir"][:n] - h["dir"][:n].mean()
        if x.std() == 0 or y.std() == 0: continue
        F = np.fft.rfft(x, 2 * n); G = np.fft.rfft(y, 2 * n); cc = np.fft.irfft(np.conj(F) * G)
        L = lag_max // b; v = np.r_[cc[-L:], cc[:L + 1]]
        tot = v if tot is None else tot + v
    lags = np.arange(-lag_max // b, lag_max // b + 1) * b
    i = int(np.argmax(tot));
    if 0 < i < len(tot) - 1:
        d = (tot[i - 1] - tot[i + 1]) / (2 * (tot[i - 1] - 2 * tot[i] + tot[i + 1])); return float(lags[i] + d * b)
    return float(lags[i])
dirres = {}
for port in ("ruido", "tom500"):
    linhas = {}
    for az in (0, 1, 2, 5, 10, 20, 45, 90):
        trs = [t for t in CAT if t["grupo"] == "5-direcao" and t["portador"] == port and t["azimute_nominal"] == az]
        lg = [atraso(t) for t in trs]
        esperado = [(A / C) * (np.radians(t["azimute"]) + np.sin(np.radians(t["azimute"]))) * 1e6 for t in trs]
        linhas[az] = dict(atraso_us=lg, media=float(np.mean(lg)), dp=float(np.std(lg)), esperado_us=float(np.mean(esperado)))
    base = linhas[0]
    for az, l in linhas.items():
        l["separa_de_0"] = bool(abs(l["media"] - base["media"]) > 2 * max(l["dp"], base["dp"], 1.0))
    dirres[port] = linhas
res["direcao"] = dirres

# ---------- 2. Tom e semitom ----------
ee = {e: carregar("3-tom-e-semitom", e) for e in ("esq",)}
def padrao(tr):
    t, f, k = recorte(ee["esq"], tr["inicio"] + 0.03, tr["fim"])
    v = np.zeros(int(CAP.sum())); off = np.r_[0, np.cumsum(CAP)[:-1]]
    np.add.at(v, off[f.astype(int)] + k.astype(int), 1.0); return v
def periodo(tr):
    f0 = tr["f"]; fx = int(np.argmin(abs(FC - f0))); faixas = list(range(max(0, fx - 2), min(64, fx + 3)))
    t, f, k = recorte(ee["esq"], tr["inicio"] + 0.03, tr["fim"], faixas)
    if len(t) < 50: return None
    b = 2.0; h = np.bincount(((t - t.min()) / b).astype(int)).astype(float); h -= h.mean()
    ac = np.fft.irfft(np.abs(np.fft.rfft(h, 2 * len(h))) ** 2)[:len(h)]
    T0 = 1e6 / f0; lo, hi = int(0.8 * T0 / b), int(1.2 * T0 / b) + 1
    if hi >= len(ac) - 1: return None
    i = lo + int(np.argmax(ac[lo:hi]))
    d = (ac[i - 1] - ac[i + 1]) / (2 * (ac[i - 1] - 2 * ac[i] + ac[i + 1])); return float((i + d) * b)
freqres = {}
for f0 in (250, 1000, 4000):
    linhas = {}
    for delta in ("0,2%", "0,5%", "1%", "semitom", "tom"):
        trs = [t for t in CAT if t["grupo"] == "3-tom-e-semitom" and round(t["f"] if t["papel"] == "referencia" else 0) == f0 and t["delta"] == delta and t["papel"] == "referencia"]
        cmp_ = [t for t in CAT if t["grupo"] == "3-tom-e-semitom" and t["delta"] == delta and t["papel"] == "comparacao" and any(abs(t["inicio"] - r["fim"] - 0.2) < 1e-6 for r in trs)]
        R = [padrao(t) for t in trs]; Q = [padrao(t) for t in cmp_]
        dist = lambda a, b: float(np.linalg.norm(a / max(a.sum(), 1) - b / max(b.sum(), 1)))
        dentro = [dist(R[i], R[j]) for i in range(len(R)) for j in range(i + 1, len(R))] + [dist(Q[i], Q[j]) for i in range(len(Q)) for j in range(i + 1, len(Q))]
        entre = [dist(r, q) for r in R for q in Q]
        pr = [periodo(t) for t in trs]; pq = [periodo(t) for t in cmp_]
        tempo = None
        if all(p is not None for p in pr + pq):
            fr = 1e6 / np.array(pr); fq = 1e6 / np.array(pq)
            tempo = dict(f_ref=float(fr.mean()), dp_ref=float(fr.std()), f_cmp=float(fq.mean()), dp_cmp=float(fq.std()),
                         separa=bool(abs(fq.mean() - fr.mean()) > 2 * max(fr.std(), fq.std(), 1e-9)))
        linhas[delta] = dict(lugar=dict(dentro_max=float(max(dentro)), entre_min=float(min(entre)), separa=bool(min(entre) > max(dentro))), tempo=tempo)
    freqres[f0] = linhas
res["tom_e_semitom"] = freqres

# ---------- 3. Pausa ----------
ee = {"esq": carregar("4-tempo", "esq")}
gapres = {}
for port in ("ruido", "tom1k"):
    def conta(tr, gap_ms):
        meio = tr["inicio"] + 0.3 + gap_ms / 2000.0; w = max(gap_ms, 1.0) / 1000.0 + 0.001
        t, f, k = recorte(ee["esq"], meio - w / 2, meio + w / 2); return len(t) / w
    base = [conta(t, 1) for t in CAT if t["grupo"] == "4-tempo" and t.get("teste") == "pausa" and t["portador"] == port and t["pausa_ms"] == 0]
    linhas = {}
    for gms in (1, 2, 3, 5, 10, 20):
        trs = [t for t in CAT if t["grupo"] == "4-tempo" and t.get("teste") == "pausa" and t["portador"] == port and t["pausa_ms"] == gms]
        v = [conta(t, gms) for t in trs]
        linhas[gms] = dict(taxa_na_pausa=float(np.mean(v)), dp=float(np.std(v)), taxa_sem_pausa=float(np.mean(base)), dp_sem=float(np.std(base)),
                           queda=float(1 - np.mean(v) / np.mean(base)), separa=bool(np.mean(base) - np.mean(v) > 2 * max(np.std(v), np.std(base))))
    gapres[port] = linhas
res["pausa"] = gapres
json.dump(res, open(os.path.join(AQUI, "observador-bateria.json"), "w"), indent=1)

for port, l in res["direcao"].items():
    print("DIREÇÃO", port, [(az, round(v["media"], 1), round(v["dp"], 1), round(v["esperado_us"], 1), v["separa_de_0"]) for az, v in l.items()])
for f0, l in res["tom_e_semitom"].items():
    print("FREQ", f0, [(d, v["lugar"]["separa"], round(v["lugar"]["entre_min"] / max(v["lugar"]["dentro_max"], 1e-12), 2),
                        (v["tempo"]["separa"], round(v["tempo"]["f_ref"], 2), round(v["tempo"]["dp_ref"], 2), round(v["tempo"]["f_cmp"], 2)) if v["tempo"] else None) for d, v in l.items()])
for port, l in res["pausa"].items():
    print("PAUSA", port, [(g, round(v["queda"], 2), v["separa"]) for g, v in l.items()])
