"""Ensaio do registro prévio estrutura-ramos.md (aprovado em 17/11/2026).
Forma principal: grave e agudo x notas e período fixo, I1, 10 sementes (80). Subteste uma Upro por Uint: grave e agudo, notas, I1 (20).
Uso: ../../../../venv-nb/bin/python -I ensaio_estrutura.py  (gera estrutura-saida.csv)"""
import csv, os, sys, time, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
from motor_estrutura import rodar

def job(a):
    faixa, fixo, unica, s = a
    t = time.time(); r = rodar("I1", faixa, s, unica=unica, cond_fixo=fixo); r["segundos"] = round(time.time() - t, 2)
    for k in ("pares_upro_das_sintonizadas", "disparos_por_uint", "parte_verdadeira_por_uint", "upros", "insumo_pcrt_por_episodio"):
        r[k] = str(r[k])
    return r

if __name__ == "__main__":
    rodar("I1", "grave", 1, dur=200.0); rodar("I1", "grave", 1, dur=200.0, unica=True)
    grade = list(itertools.product(("grave", "agudo"), (False, True), (False,), range(1, 11)))
    grade += list(itertools.product(("grave", "agudo"), (False,), (True,), range(1, 11)))
    t0 = time.time()
    with Pool(2) as p: R = p.map(job, grade)
    with open("estrutura-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    print("execuções:", len(R), "tempo total (s):", round(time.time() - t0, 1))
