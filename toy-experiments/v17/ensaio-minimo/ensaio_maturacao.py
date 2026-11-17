"""Registro prévio maturacao.md (aprovado em 17/11/2026): conjunto B + maturação; TAUJ {0,6;1,0;1,5 ms} x NMEIO {30;100;300} x MMEIA {300 s; 3.600 s};
grave (classe de Δ) e agudo (seleção em fase), notas, sementes 21-30; mais a referência B sem maturação (I1). 400 execuções.
Uso: ../../../../venv-nb/bin/python -I ensaio_maturacao.py  (gera maturacao-saida.csv)"""
import csv, os, sys, time, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from multiprocessing import Pool
from motor_correcoes import rodar
from confirmacao_correcoes import CONJ
from ensaio_fase_preferencia import frac_fase

def job(a):
    mat, tauj, nmeio, mmeia, faixa, s = a
    t = time.time()
    r = rodar("I1", faixa, s, hist=True, MAT=mat, TAUJ=tauj, NMEIO=nmeio, MMEIA=mmeia, **CONJ["B"]); dt = round(time.time() - t, 2)
    H = r.pop("hist_dif"); disp = r["disparos_por_uint"]
    ff = [frac_fase(H[k], 0.458) for k in range(H.shape[0])]
    sf = sum(1 for k in range(len(ff)) if disp[k] >= 100 and ff[k] >= 0.6); pr = sum(1 for k in range(len(ff)) if disp[k] >= 100 and ff[k] < 0.2)
    out = dict(maturacao=mat, TAUJ=tauj, NMEIO=nmeio, MMEIA=mmeia, faixa=faixa, semente=s, classe=r["classe"],
               selecao_fase=bool(sf >= 1 and pr == 0), uints_sintonizadas=r["uints_sintonizadas"], presas=r["uints_presas_no_acaso"],
               pref_mediana=str(r["diferenca_preferida_mediana_sintonizadas"]), maturidade_media=r["maturidade_media"], uints_maduras=r["uints_maduras"],
               ramos=r["ramos"], forca_total=r["forca_total"], eliminados=r["eliminados"], disparos=str(disp), segundos=dt)
    return out

if __name__ == "__main__":
    rodar("I1", "grave", 1, dur=200.0, MAT=True)
    g = [(True, a, b, c, f, s) for a in (0.6, 1.0, 1.5) for b in (30.0, 100.0, 300.0) for c in (300_000.0, 3_600_000.0) for f in ("grave", "agudo") for s in range(21, 31)]
    g += [(False, 1.0, 100.0, 3_600_000.0, f, s) for f in ("grave", "agudo") for s in range(21, 31)]
    t0 = time.time()
    with Pool(2) as p: R = p.map(job, g)
    with open("maturacao-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    print("execuções:", len(R), "tempo total (s):", round(time.time() - t0, 1))
