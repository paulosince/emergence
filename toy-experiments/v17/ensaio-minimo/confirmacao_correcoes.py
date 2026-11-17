"""Confirmação do registro prévio correcoes-mapa.md: conjuntos A, B e C escolhidos pelo responsável (17/11/2026);
grave e agudo x notas e período fixo x I1 x 10 sementes = 40 por conjunto (120).
Uso: ../../../../venv-nb/bin/python -I confirmacao_correcoes.py  (gera confirmacao-correcoes-saida.csv)"""
import csv, os, sys, time, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
from motor_correcoes import rodar

CONJ = {"A": dict(TAUR=60_000.0, RC=1.0, TETA=0.25, TEL=60_000.0, NEXP=8.0),
        "B": dict(TAUR=60_000.0, RC=1.0, TETA=0.50, TEL=60_000.0, NEXP=16.0),
        "C": dict(TAUR=300_000.0, RC=2.0, TETA=0.25, TEL=10_000.0, NEXP=4.0)}

def job(a):
    nome, faixa, fixo, s = a
    t = time.time(); r = rodar("I1", faixa, s, cond_fixo=fixo, **CONJ[nome]); r["segundos"] = round(time.time() - t, 2); r["conjunto"] = nome
    for k, v in list(r.items()):
        if isinstance(v, (list, tuple)): r[k] = str(v)
    return r

if __name__ == "__main__":
    rodar("I1", "grave", 1, dur=200.0)
    grade = list(itertools.product("ABC", ("grave", "agudo"), (False, True), range(1, 11)))
    t0 = time.time()
    with Pool(2) as p: R = p.map(job, grade)
    with open("confirmacao-correcoes-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    print("execuções:", len(R), "tempo total (s):", round(time.time() - t0, 1))
