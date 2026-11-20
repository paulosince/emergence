"""V0.18 — observador do teste de duas fontes simultâneas (plano de extensão, teste 3). Critério do responsável (20/11):
"suficiente" = as incidências permitem DETECTAR "duas fontes" (como o humano, que relata duas fontes em 89,5% das vezes
com elas em lados opostos e em 12,5% com elas no mesmo lugar; Schwartz, McDermott e Shinn-Cunningham 2012).
Detector [A]: em janelas de 50 ms (a partir de 50 ms do início), estima a diferença de chegada em cada faixa até 1,2 kHz
(correlação cruzada esq × dir, ±0,7 ms) e procura a melhor divisão das faixas em dois grupos (peso = número de
incidências). Diz "duas fontes" se os centros dos dois grupos diferem mais de 100 µs e cada grupo tem ao menos 15% do peso.
Saída: observador-duas-fontes.json"""
import os, json, glob
import numpy as np
import coclea

AQUI = os.path.dirname(os.path.abspath(__file__))
G = "10-duas-fontes-ampliado"
CAT = [t for t in json.load(open(os.path.join(AQUI, "..", "estimulos", "bateria", "catalogo.json")))["trechos"] if t["grupo"] == G]
FC = coclea.centros(); BAIXAS = np.where(FC <= 1200)[0]
EV = {}
for e in ("esq", "dir"):
    fs = sorted(glob.glob(os.path.join(AQUI, "bateria", G, f"{e}-*.npz"))); z = [np.load(f) for f in fs]
    EV[e] = {k: np.concatenate([q[k] for q in z]) for k in ("tus", "f")}
B_US, LAG = 5, 700

def itd_faixas(t0, t1):
    out = []
    for fx in BAIXAS:
        h = {}
        for e in EV:
            a, b = np.searchsorted(EV[e]["tus"], np.array([t0 * 1e6, t1 * 1e6]).astype(np.uint32)); t = EV[e]["tus"][a:b][EV[e]["f"][a:b] == fx]
            h[e] = np.bincount(((t - t0 * 1e6) / B_US).astype(int), minlength=int((t1 - t0) * 1e6 / B_US) + 2).astype(float)
        n = min(len(h["esq"]), len(h["dir"])); w = h["esq"][:n].sum() + h["dir"][:n].sum()
        if h["esq"][:n].sum() < 20 or h["dir"][:n].sum() < 20: continue
        x, y = h["esq"][:n] - h["esq"][:n].mean(), h["dir"][:n] - h["dir"][:n].mean()
        cc = np.fft.irfft(np.conj(np.fft.rfft(x, 2 * n)) * np.fft.rfft(y, 2 * n)); L = LAG // B_US
        v = np.r_[cc[-L:], cc[:L + 1]]; out.append((int(fx), float((np.argmax(v) - L) * B_US), float(w)))
    return out

def duas(itds, dmin=100.0, pmin=0.15):
    if len(itds) < 2: return False, None
    v = np.array([x[1] for x in itds]); w = np.array([x[2] for x in itds]); o = np.argsort(v); v, w = v[o], w[o]
    melhor = None
    for i in range(1, len(v)):
        w1, w2 = w[:i].sum(), w[i:].sum(); c1, c2 = np.average(v[:i], weights=w[:i]), np.average(v[i:], weights=w[i:])
        var = (np.sum(w[:i] * (v[:i] - c1) ** 2) + np.sum(w[i:] * (v[i:] - c2) ** 2))
        if melhor is None or var < melhor[0]: melhor = (var, c1, c2, w1 / w.sum(), w2 / w.sum())
    _, c1, c2, p1, p2 = melhor
    return bool(abs(c2 - c1) > dmin and min(p1, p2) >= pmin), dict(centros_us=[float(c1), float(c2)], pesos=[float(p1), float(p2)])

res = {}
for t in CAT:
    chave = f'{t["teste"]} | {t.get("separacao", t.get("fonteA", ""))} | {t["lugar"]}'
    jan = np.arange(t["inicio"] + 0.05, t["fim"] - 0.05, 0.05)
    decis = []; exemplo = None
    for j in jan:
        d, info = duas(itd_faixas(j, j + 0.05)); decis.append(d); exemplo = exemplo or info
    r = res.setdefault(chave, dict(janelas=0, duas=0, exemplo=None, por_repeticao=[]))
    r["janelas"] += len(decis); r["duas"] += int(sum(decis)); r["exemplo"] = r["exemplo"] or exemplo
    r["por_repeticao"].append(float(np.mean(decis)) if decis else 0.0)
for k, r in res.items():
    r["fracao_duas"] = r["duas"] / max(r["janelas"], 1)
    # por apresentação (como no experimento humano): "duas fontes" se a maioria das janelas disser duas [A]
    r["apresentacoes_duas"] = int(sum(f > 0.5 for f in r["por_repeticao"])); r["apresentacoes"] = len(r["por_repeticao"])
json.dump(res, open(os.path.join(AQUI, "observador-duas-fontes.json"), "w"), indent=1)
for k, r in res.items():
    print(f'{k:62s} janelas: {100 * r["fracao_duas"]:5.1f}% de {r["janelas"]} | apresentações: {r["apresentacoes_duas"]}/{r["apresentacoes"]} | por rep.: {[round(f, 2) for f in r["por_repeticao"]]}')
