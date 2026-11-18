"""Registro prévio limite-fibra.md (APROVADO em 18/11/2026).
8 fibras por ouvido + alcance 2-4 + limite por fibra (150, 300/s) contra 8 fibras sem limite e o modelo atual (1 fibra), sem inibição.
Degrau 1, grave e agudo, sementes 281-310. Uso: ../../../../venv-nb/bin/python -I limite_fibra.py  (gera limite-fibra-saida.csv)"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_fibras as fib
from confirmacao_correcoes import CONJ
from replicacao_b import wilson
from passo1_limiar_janela import sucesso

SEM = list(range(281, 311))
BASE = dict(RET=True, DURO=True, LE=0.30, LI=0.30, ESP=60.0, SIL=2000.0, RELOG=True, PART=True, NPART=100)
KW = {"a_8fibras_lim150": dict(FIB=8, LIMF=True, RMAX=150.0), "b_8fibras_lim300": dict(FIB=8, LIMF=True, RMAX=300.0),
      "c_8fibras_sem_limite": dict(FIB=8), "d_atual_1fibra": dict(FIB=1)}

def job(a):
    m, f, s = a
    y = fib.rodar("I0", f, s, CUR=True, hist=True, **BASE, **KW[m], **CONJ["B"])
    for c in ("diag_e1", "diag_e2", "diag_et", "alcance"): y.pop(c)
    return dict(cond=m, faixa=f, semente=s, sucesso=sucesso(y, f), classe=y["classe"], disparos=sum(y["disparos_por_uint"]),
                eliminados=y["eliminados"], ramos=y["ramos"], disparos_silencio_por_uint=y["disparos_silencio"],
                incidencias=y["incidencias_por_episodio"], forca_ganha=y["diag_forca_ganha"], forca_perdida=y["diag_forca_perdida"])

if __name__ == "__main__":
    for m in KW: fib.rodar("I0", "grave", 1, dur=200.0, CUR=True, **BASE, **KW[m])
    G = [(m, f, s) for m in KW for f in ("grave", "agudo") for s in SEM]
    assert len(G) == 240
    with Pool(2) as p: R = p.map(job, G)
    with open("limite-fibra-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    for m in KW:
        for f in ("grave", "agudo"):
            v = [r for r in R if r["cond"] == m and r["faixa"] == f]; k = sum(r["sucesso"] for r in v)
            print(m, f, "sucesso", k, "/ 30", "IC95%", wilson(k, 30), "| colapsos", sum(r["classe"] == "colapso" for r in v),
                  "| ramos (med)", sorted(r["ramos"] for r in v)[15])
