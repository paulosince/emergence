"""Registro prévio fase-e-preferencia.md (aprovado em 17/11/2026).
(1) Agudo, notas, I1, sementes 11-20, conjuntos A/B/C: critério de fase (Δ e Δ ± k·T, T em 0,6–0,9 ms, k = 1, 2).
(2) Controle da preferência da estrutura: grave, notas e período fixo, Δ em {0,458; 1,5; 3,0}, conjuntos A/B/C, sementes 1-10.
Também reclassifica (exploratório) a confirmação já vista (agudo, sementes 1-10).
Uso: ../../../../venv-nb/bin/python -I ensaio_fase_preferencia.py"""
import csv, os, sys, time, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from multiprocessing import Pool
from motor_correcoes import rodar, W
from confirmacao_correcoes import CONJ

X = np.arange(4001) / 100.0 - 20.0

def frac_fase(h, d):
    m = np.abs(X - d) <= W
    for k in (1, 2):
        for sg in (-1, 1):
            lo = d + sg * k * 0.6; hi = d + sg * k * 0.9
            a, b = min(lo, hi) - W, max(lo, hi) + W
            m |= (X >= a) & (X <= b)
    tot = h.sum(); return float(h[m].sum() / tot) if tot else 0.0

def frac_em(h, c):
    tot = h.sum(); return float(h[np.abs(X - c) <= W].sum() / tot) if tot else 0.0

def job(a):
    tipo, nome, faixa, fixo, delta, s = a
    t = time.time(); r = rodar("I1", faixa, s, cond_fixo=fixo, hist=True, delta=delta, **CONJ[nome]); dt = round(time.time() - t, 2)
    H = r.pop("hist_dif"); disp = r["disparos_por_uint"]
    out = dict(tipo=tipo, conjunto=nome, faixa=faixa, fixo=fixo, delta=delta, semente=s, classe=r["classe"],
               uints_sintonizadas=r["uints_sintonizadas"], presas=r["uints_presas_no_acaso"],
               pref_mediana=str(r["diferenca_preferida_mediana_sintonizadas"]), segundos=dt)
    if tipo.startswith("fase"):
        ff = [frac_fase(H[k], delta) for k in range(H.shape[0])]
        sf = sum(1 for k in range(len(ff)) if disp[k] >= 100 and ff[k] >= 0.6); pr = sum(1 for k in range(len(ff)) if disp[k] >= 100 and ff[k] < 0.2)
        out.update(sintonizadas_fase=sf, presas_fase=pr, selecao_fase=bool(sf >= 1 and pr == 0), frac_fase_mediana=round(float(np.median(ff)), 3))
    else:
        Ht = H.sum(axis=0)
        out.update(frac_delta=round(frac_em(Ht, delta), 3), frac_menos5=round(frac_em(Ht, delta - 5.0), 3), frac_mais5=round(frac_em(Ht, delta + 5.0), 3))
    return out

if __name__ == "__main__":
    rodar("I1", "grave", 1, dur=200.0)
    g1 = [("fase", n, "agudo", False, 0.458, s) for n in "ABC" for s in range(11, 21)]
    g0 = [("fase-exploratorio", n, "agudo", False, 0.458, s) for n in "ABC" for s in range(1, 11)]
    g2 = [("preferencia", n, "grave", fx, d, s) for n in "ABC" for fx in (False, True) for d in (0.458, 1.5, 3.0) for s in range(1, 11)]
    t0 = time.time()
    with Pool(2) as p: R = p.map(job, g1 + g0 + g2)
    for r in R:
        if r["tipo"] == "fase-exploratorio": r["tipo"] = "fase-exploratorio"
    for nome, rows in (("fase", [r for r in R if r["tipo"].startswith("fase")]), ("preferencia", [r for r in R if r["tipo"] == "preferencia"])):
        with open(f"{nome}-saida.csv", "w", newline="") as fh:
            w = csv.DictWriter(fh, fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
    print("execuções:", len(R), "tempo total (s):", round(time.time() - t0, 1))
