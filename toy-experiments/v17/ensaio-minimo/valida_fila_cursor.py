"""Prova de igualdade da fila por cursor (motor_rapido, OPT=1, CUR=True) contra motor_correcoes: sementes 31-40, grave e agudo.
Uso: ../../../../venv-nb/bin/python -I valida_fila_cursor.py  (gera valida-fila-cursor-saida.csv)"""
import csv, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_correcoes as ref, motor_rapido as rap
from confirmacao_correcoes import CONJ
CAMPOS = ("classe", "ramos", "acertos", "disparos_por_uint", "parte_verdadeira_por_uint", "forca_total", "eliminados", "upros_novas")

def job(a):
    f, s = a
    t = time.time(); x = ref.rodar("I1", f, s, **CONJ["B"]); tr = time.time() - t
    t = time.time(); y = rap.rodar("I1", f, s, OPT=1, CUR=True, **CONJ["B"]); tn = time.time() - t
    return dict(faixa=f, semente=s, igual=all(str(x[c]) == str(y[c]) for c in CAMPOS), ramos=x["ramos"], tempo_ref=round(tr, 3), tempo_novo=round(tn, 3))

if __name__ == "__main__":
    ref.rodar("I1", "grave", 1, dur=200.0); rap.rodar("I1", "grave", 1, dur=200.0, CUR=True)
    with Pool(2) as p: R = p.map(job, [(f, s) for f in ("grave", "agudo") for s in range(31, 41)])
    assert len(R) == 20
    with open("valida-fila-cursor-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    for f in ("grave", "agudo"):
        v = [r for r in R if r["faixa"] == f]
        print(f, "idênticas", sum(r["igual"] for r in v), "/", len(v), "| tempo médio ref", round(sum(r["tempo_ref"] for r in v) / 10, 2),
              "novo", round(sum(r["tempo_novo"] for r in v) / 10, 2), "| ganho", round(sum(r["tempo_ref"] for r in v) / sum(r["tempo_novo"] for r in v), 2), "x")
