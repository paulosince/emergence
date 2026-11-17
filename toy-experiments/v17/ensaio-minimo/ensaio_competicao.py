"""Ensaio do adendo competicao-disparo.md (aprovado em 17/11/2026): grave e agudo, notas, I1, 10 sementes,
largura da janela do disparo (0,30; 1,0 ms) x fase não hebbiana X (10; 60 s). Fixos: Q 0,75; janela do acerto recente 60 s; sem enfraquecimento.
Uso: ../../../../venv-nb/bin/python -I ensaio_competicao.py  (gera competicao-saida.csv)"""
import csv, os, sys, time, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
from motor_eventos import rodar

def job(a):
    faixa, TAUC, XNH, s = a
    t = time.time(); r = rodar("I1", faixa, s, Q=0.75, JAN=60_000.0, COMP=True, TAUC=TAUC, XNH=XNH); r["segundos"] = round(time.time() - t, 3)
    r["insumo_pcrt_por_episodio"] = " ".join(map(str, r["insumo_pcrt_por_episodio"]))
    r["parte_forca_regiao"] = " ".join(map(str, r["parte_forca_regiao"])); r["ramos_na_regiao"] = " ".join(map(str, r["ramos_na_regiao"]))
    return r

if __name__ == "__main__":
    rodar("I1", "grave", 1, dur=200.0, COMP=True)
    grade = list(itertools.product(("grave", "agudo"), (0.30, 1.0), (10_000.0, 60_000.0), range(1, 11)))
    t0 = time.time()
    with Pool(2) as p: R = p.map(job, grade)
    with open("competicao-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    print("execuções:", len(R), "tempo total (s):", round(time.time() - t0, 1))
