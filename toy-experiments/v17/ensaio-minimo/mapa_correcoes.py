"""Triagem do registro prévio correcoes-mapa.md (aprovado em 17/11/2026): grave, notas, I1, sementes 1-3,
TAUR {10,60,300 s} x RC {0,5;1,0;2,0} x TETA {0,10;0,25;0,50} x TEL {10,60,300 s} x NEXP {4,8,16} = 729 execuções.
Uso: ../../../../venv-nb/bin/python -I mapa_correcoes.py  (gera mapa-correcoes-saida.csv)"""
import csv, os, sys, time, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
from motor_correcoes import rodar

def job(a):
    TAUR, RC, TETA, TEL, NEXP, s = a
    t = time.time(); r = rodar("I1", "grave", s, TAUR=TAUR, RC=RC, TETA=TETA, TEL=TEL, NEXP=NEXP); r["segundos"] = round(time.time() - t, 2)
    for k, v in list(r.items()):
        if isinstance(v, (list, tuple)): r[k] = str(v)
    return r

if __name__ == "__main__":
    rodar("I1", "grave", 1, dur=200.0)
    grade = list(itertools.product((10_000.0, 60_000.0, 300_000.0), (0.5, 1.0, 2.0), (0.10, 0.25, 0.50), (10_000.0, 60_000.0, 300_000.0), (4.0, 8.0, 16.0), (1, 2, 3)))
    t0 = time.time()
    with Pool(2) as p: R = p.map(job, grade, chunksize=4)
    with open("mapa-correcoes-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    print("execuções:", len(R), "tempo total (s):", round(time.time() - t0, 1))
