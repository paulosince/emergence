"""Registro prévio sem-planob.md (APROVADO em 18/11/2026).
Modelo atual (passo 1 + espontânea + relógio corrigido + participação N=100) sem inibição (I0) contra com o plano B (I1).
Degrau 1, grave e agudo, sementes 251-280. Uso: ../../../../venv-nb/bin/python -I sem_planob.py  (gera sem-planob-saida.csv)"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_fibras as fib
from confirmacao_correcoes import CONJ
from replicacao_b import wilson
from passo1_limiar_janela import sucesso

SEM = list(range(251, 281))
BASE = dict(RET=True, DURO=True, LE=0.30, LI=0.30, ESP=60.0, SIL=2000.0, RELOG=True, FIB=1, PART=True, NPART=100)
COND = {"a_sem_inibicao": "I0", "b_plano_B": "I1"}

def job(a):
    m, f, s = a
    y = fib.rodar(COND[m], f, s, CUR=True, hist=True, **BASE, **CONJ["B"])
    for c in ("diag_e1", "diag_e2", "diag_et", "alcance"): y.pop(c)
    return dict(cond=m, faixa=f, semente=s, sucesso=sucesso(y, f), classe=y["classe"], disparos=sum(y["disparos_por_uint"]),
                eliminados=y["eliminados"], ramos=y["ramos"], disparos_silencio_por_uint=y["disparos_silencio"],
                forca_ganha=y["diag_forca_ganha"], forca_perdida=y["diag_forca_perdida"])

if __name__ == "__main__":
    for m in COND: fib.rodar(COND[m], "grave", 1, dur=200.0, CUR=True, **BASE)
    G = [(m, f, s) for m in COND for f in ("grave", "agudo") for s in SEM]
    assert len(G) == 120
    with Pool(2) as p: R = p.map(job, G)
    with open("sem-planob-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    for m in COND:
        for f in ("grave", "agudo"):
            v = [r for r in R if r["cond"] == m and r["faixa"] == f]; k = sum(r["sucesso"] for r in v)
            sil = sorted(x / 2.0 for r in v for x in r["disparos_silencio_por_uint"])
            print(m, f, "sucesso", k, "/ 30", "IC95%", wilson(k, 30), "| colapsos", sum(r["classe"] == "colapso" for r in v),
                  "| ramos (med)", sorted(r["ramos"] for r in v)[15], "| silêncio/Uint (med, /s)", sil[len(sil) // 2] if sil else "-")
