"""V0.18 — observador do teste de ordem dos inícios (plano de extensão, teste 2). Critério do responsável (19/11):
"suficiente" = ordem certa a partir de 20 ms, em todas as repetições, nas duas ordens.
Para cada trecho e cada tom: escolhe uma faixa que responde mais a esse tom que ao outro (afastada meio ERB para o lado
oposto ao outro tom) e acha o início como o instante de maior subida da taxa de incidências (janelas de 2 ms antes e
depois), nos primeiros 80 ms. Assincronia estimada = início(B) − início(A), descontada a média da condição de 0 ms
(o observador conhece as latências próprias de cada faixa). Ordem certa = sinal da assincronia estimada igual ao real.
Saída: observador-ordem.json"""
import os, json, glob
import numpy as np
import coclea

AQUI = os.path.dirname(os.path.abspath(__file__))
G = "9-ordem-dos-inicios"
CAT = [t for t in json.load(open(os.path.join(AQUI, "..", "estimulos", "bateria", "catalogo.json")))["trechos"] if t["grupo"] == G]
FC = coclea.centros(); ERB = coclea.ERB
res = {}
for ouvido in ("esq", "dir"):
    fs = sorted(glob.glob(os.path.join(AQUI, "bateria", G, f"{ouvido}-*.npz"))); z = [np.load(f) for f in fs]
    EV = {k: np.concatenate([q[k] for q in z]) for k in ("tus", "f")}
    def faixa_para(f, outro):
        alvo = f - 0.5 * ERB(f) if outro > f else f + 0.5 * ERB(f)
        return int(np.argmin(abs(FC - alvo)))
    def inicio(tr, fx):
        a, b = np.searchsorted(EV["tus"], [tr["inicio"] * 1e6, (tr["inicio"] + 0.08) * 1e6])
        t = EV["tus"][a:b][EV["f"][a:b] == fx] / 1e6 - tr["inicio"]
        if len(t) < 5: return np.nan
        grade = np.arange(0.0, 0.08, 0.0001); c = np.searchsorted(np.sort(t), grade)
        w = 20                                                  # 2 ms em passos de 0,1 ms
        antes = c[w:-w] - c[:-2 * w]; depois = c[2 * w:] - c[w:-w]
        return float(grade[w:-w][np.argmax(depois - antes)])
    linhas = {}
    for par_, lugar in (("500-2000", "mesmo lugar"), ("1000-1200", "mesmo lugar"), ("500-2000", "lugares diferentes")):
        trs = [t for t in CAT if t["par"] == par_ and t["lugar"] == lugar]
        fa, fb = trs[0]["fA"], trs[0]["fB"]; xa, xb = faixa_para(fa, fb), faixa_para(fb, fa)
        est = {}
        for t in trs:
            d = inicio(t, xb) - inicio(t, xa)
            est.setdefault((t["assincronia_ms"], t["ordem"]), []).append(d * 1000)
        base = np.nanmean(est[(0, "A primeiro")] + est[(0, "B primeiro")])
        tab = {}
        for ass in (0, 1, 2, 3, 5, 7, 10, 20, 40):
            for ordem in ("A primeiro", "B primeiro"):
                v = np.array(est[(ass, ordem)]) - base
                real = ass if ordem == "A primeiro" else -ass
                certos = int(np.sum(np.sign(v) == np.sign(real))) if ass > 0 else None
                tab[f"{ass} ms, {ordem}"] = dict(estimada_ms=[float(x) for x in v], media=float(np.nanmean(v)), dp=float(np.nanstd(v)),
                                                 certos=certos, de=len(v))
        menor = None
        for ass in (1, 2, 3, 5, 7, 10, 20, 40):
            if all(tab[f"{a2} ms, {o}"]["certos"] == tab[f"{a2} ms, {o}"]["de"] for a2 in (1, 2, 3, 5, 7, 10, 20, 40) if a2 >= ass for o in ("A primeiro", "B primeiro")):
                menor = ass; break
        linhas[f"{par_} ({lugar})"] = dict(faixas=[int(xa), int(xb)], fc_faixas=[float(FC[xa]), float(FC[xb])], base_ms=float(base),
                                           tabela=tab, menor_assincronia_ordem_sempre_certa_ms=menor,
                                           suficiente_20ms=bool(menor is not None and menor <= 20))
    res[ouvido] = linhas
json.dump(res, open(os.path.join(AQUI, "observador-ordem.json"), "w"), indent=1, default=float)
for o, ls in res.items():
    for k, l in ls.items():
        print(o, k, "| faixas", [round(x) for x in l["fc_faixas"]], "| menor ass. sempre certa:", l["menor_assincronia_ordem_sempre_certa_ms"], "ms | suficiente:", l["suficiente_20ms"])
        print("    ", [(kk, round(v["media"], 2), round(v["dp"], 2), v["certos"]) for kk, v in l["tabela"].items() if kk.endswith("A primeiro")])
