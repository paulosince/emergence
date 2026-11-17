"""Etapa B do registro prévio pcrt-incidencias.md, com o conjunto escolhido pelo responsável em 17/11/2026
(competição ligada ao disparo, largura 1,0 ms, X = 10 s; quase-acerto 0,75; janela do acerto recente 60 s; sem enfraquecimento):
notas e período fixo; I0 e I1; grave e agudo; 10 sementes = 80 execuções.
Uso: ../../../../venv-nb/bin/python -I etapa_b.py  (gera etapa-b-saida.csv)"""
import csv, os, sys, time, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
from motor_eventos import rodar

def job(a):
    faixa, fixo, cond, s = a
    t = time.time(); r = rodar(cond, faixa, s, Q=0.75, JAN=60_000.0, COMP=True, TAUC=1.0, XNH=10_000.0, cond_fixo=fixo); r["segundos"] = round(time.time() - t, 3)
    for k in ("insumo_pcrt_por_episodio", "parte_forca_regiao", "ramos_na_regiao"): r[k] = " ".join(map(str, r[k]))
    return r

if __name__ == "__main__":
    rodar("I1", "grave", 1, dur=200.0, COMP=True)
    grade = list(itertools.product(("grave", "agudo"), (False, True), ("I0", "I1"), range(1, 11)))
    t0 = time.time()
    with Pool(2) as p: R = p.map(job, grade)
    with open("etapa-b-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    print("execuções:", len(R), "tempo total (s):", round(time.time() - t0, 1))
