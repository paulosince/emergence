"""Valida motor_par.py contra as execuções de referência (Python puro). Uso: ../../../../venv-nb/bin/python -I valida_motor_par.py"""
import csv, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
from motor_par import rodar_rapido

def ref():
    rows = [r for r in csv.DictReader(open("inibicao-saida.csv")) if r["faixa"] == "grave"]
    rows += [dict(r, faixa="grave") for r in csv.DictReader(open("inibicao-fiel-saida.csv"))]
    return rows

def job(r):
    t = time.time(); x = rodar_rapido(r["cond"], "grave", int(r["semente"])); return r, x, time.time() - t

if __name__ == "__main__":
    rodar_rapido("I0", "grave", 1, dur=500.0)   # compila
    R = ref(); campos = ("classe", "ramos", "relacoes", "credito_verdadeiro", "dispersao_ms", "disparos_ultimo_ep")
    iguais = 0; difs = []; tt = 0
    with Pool(2) as p:
        for r, x, dt in p.imap_unordered(job, R):
            tt += dt
            d = [c for c in campos if str(x[c] if x[c] is not None else "") != str(r[c] if r[c] not in (None, "None") else "")]
            if d: difs.append((r["cond"], r["semente"], {c: (r[c], x[c]) for c in d}))
            else: iguais += 1
    print(f"idênticas em todos os campos: {iguais}/{len(R)}; tempo total de CPU {tt:.0f} s")
    for d in sorted(difs): print("DIF", d)
