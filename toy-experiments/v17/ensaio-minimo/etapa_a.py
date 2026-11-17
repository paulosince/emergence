"""Etapa A do registro prévio pcrt-incidencias.md (aprovado em 17/11/2026): grave, notas, I1, 10 sementes,
faixa do quase-acerto (0,50/0,75/0,90 do limiar) x janela do acerto recente (10/60/600 s) x enfraquecimento do isolado (sem/com).
Uso: ../../../../venv-nb/bin/python -I etapa_a.py  (gera etapa-a-saida.csv)"""
import csv, os, sys, time, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
from motor_eventos import rodar

def job(a):
    Q, JAN, ENFQ, s = a
    t = time.time(); r = rodar("I1", "grave", s, Q=Q, JAN=JAN, ENFQ=ENFQ); r["segundos"] = round(time.time() - t, 3)
    r["insumo_pcrt_por_episodio"] = " ".join(map(str, r["insumo_pcrt_por_episodio"])); return r

if __name__ == "__main__":
    rodar("I1", "grave", 1, dur=200.0)
    grade = list(itertools.product((0.50, 0.75, 0.90), (10_000.0, 60_000.0, 600_000.0), (False, True), range(1, 11)))
    t0 = time.time()
    with Pool(2) as p: R = p.map(job, grade)
    with open("etapa-a-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    print("execuções:", len(R), "tempo total (s):", round(time.time() - t0, 1))
