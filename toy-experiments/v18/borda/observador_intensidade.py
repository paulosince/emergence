"""V0.18 — observador do teste de intensidade (plano de extensão, teste 1). Critério do responsável (19/11): "suficiente" =
a menor diferença de volume separável é de até 2 dB.
Para cada trecho (ouvido esquerdo, de 20 ms após o início até o fim do som), mede:
  pontos ativos (total e por área), incidências, soma das magnitudes, latência (mediana da primeira incidência de cada
  ponto ativo, em relação ao início) e o padrão completo (contagem por ponto).
"Separa" [A]: |média(Δ) − média(0)| > 2 × maior desvio-padrão das repetições; no padrão completo, menor distância entre
condições > maior distância entre repetições. Saída: observador-intensidade.json"""
import os, json, glob
import numpy as np
import pontos

AQUI = os.path.dirname(os.path.abspath(__file__))
G = "8-intensidade-ampliada"
CAT = [t for t in json.load(open(os.path.join(AQUI, "..", "estimulos", "bateria", "catalogo.json")))["trechos"] if t["grupo"] == G]
P = pontos.construir(); CAP = np.array([len(p["limiar_db"]) for p in P]); OFF = np.r_[0, np.cumsum(CAP)[:-1]]
AREA = np.concatenate([p["area"] for p in P]); NTOT = int(CAP.sum())
fs = sorted(glob.glob(os.path.join(AQUI, "bateria", G, "esq-*.npz"))); z = [np.load(f) for f in fs]
EV = {k: np.concatenate([q[k] for q in z]) for k in ("tus", "f", "k", "m255")}

def medidas(tr):
    a, b = np.searchsorted(EV["tus"], [tr["inicio"] * 1e6, (tr["fim"] + 0.01) * 1e6])
    t, f, k, m = EV["tus"][a:b], EV["f"][a:b].astype(int), EV["k"][a:b].astype(int), EV["m255"][a:b] / 255.0
    idx = OFF[f] + k
    cont = np.bincount(idx, minlength=NTOT)
    ativos = cont > 0
    # latência: primeira incidência de cada ponto ativo
    primeira = np.full(NTOT, np.nan); o = np.argsort(t, kind="stable"); u, i0 = np.unique(idx[o], return_index=True)
    primeira[u] = (t[o][i0] - tr["inicio"] * 1e6) / 1000.0
    sust = t >= (tr["inicio"] + 0.02) * 1e6
    return dict(ativos=int(ativos.sum()), ativos_a1=int((ativos & (AREA == 1)).sum()), ativos_a2=int((ativos & (AREA == 2)).sum()),
                ativos_a3=int((ativos & (AREA == 3)).sum()), incidencias=int(sust.sum()), magnitude=float(m[sust].sum()),
                latencia_ms=float(np.nanmedian(primeira)) if ativos.any() else np.nan), cont.astype(float)

res = {}
CAMPOS = ("ativos", "ativos_a1", "ativos_a2", "ativos_a3", "incidencias", "magnitude", "latencia_ms")
for port in ("tom250", "tom1000", "tom4000", "ruido"):
    for base in (40, 70, 85):
        cond = {}
        for d in (0, 0.5, 1, 2, 3, 6):
            trs = [t for t in CAT if t["portador"] == port and t["base"] == base and t["delta_db"] == d]
            ms = [medidas(t) for t in trs]
            cond[d] = dict(valores={c: [x[0][c] for x in ms] for c in CAMPOS}, padroes=[x[1] for x in ms])
        linha = {}
        for c in CAMPOS:
            v0 = np.array(cond[0]["valores"][c], float)
            sep = {}
            for d in (0.5, 1, 2, 3, 6):
                v = np.array(cond[d]["valores"][c], float)
                sd = max(np.nanstd(v), np.nanstd(v0), 1e-9)
                sep[d] = bool(abs(np.nanmean(v) - np.nanmean(v0)) > 2 * sd)
            menor = next((d for d in (0.5, 1, 2, 3, 6) if sep[d]), None)
            linha[c] = dict(media_por_delta={str(d): float(np.nanmean(cond[d]["valores"][c])) for d in cond}, separa=sep, menor_delta_db=menor)
        def dist(a, b): return float(np.linalg.norm(a - b))
        R0 = cond[0]["padroes"]; sepp = {}
        for d in (0.5, 1, 2, 3, 6):
            R = cond[d]["padroes"]
            dentro = [dist(R0[i], R0[j]) for i in range(5) for j in range(i + 1, 5)] + [dist(R[i], R[j]) for i in range(5) for j in range(i + 1, 5)]
            entre = [dist(x, y) for x in R0 for y in R]
            sepp[d] = bool(min(entre) > max(dentro))
        linha["padrao_completo"] = dict(separa=sepp, menor_delta_db=next((d for d in (0.5, 1, 2, 3, 6) if sepp[d]), None))
        melhor = [linha[c]["menor_delta_db"] for c in list(CAMPOS) + ["padrao_completo"] if linha[c]["menor_delta_db"] is not None]
        linha["menor_delta_qualquer_medida"] = min(melhor) if melhor else None
        linha["suficiente_ate_2dB"] = bool(linha["menor_delta_qualquer_medida"] is not None and linha["menor_delta_qualquer_medida"] <= 2)
        res[f"{port} @ {base} dB"] = linha
json.dump(res, open(os.path.join(AQUI, "observador-intensidade.json"), "w"), indent=1, default=float)
for k, l in res.items():
    print(f"{k:16s} | qualquer: {l['menor_delta_qualquer_medida']} dB | suficiente: {l['suficiente_ate_2dB']} | " +
          " ".join(f"{c}={l[c]['menor_delta_db']}" for c in list(CAMPOS) + ["padrao_completo"]))
