"""Diagnóstico (pedido do responsável, 18/11: "Os dois"): só medidas. A punição da quase-sincronia é a causa do colapso com 8 fibras?
Mesmo modelo do registro limite-fibra.md, sementes 281-290 (já vistas), grave e agudo: com e sem a punição, em 1 fibra, 8 fibras sem limite
e 8 fibras com limite de 150/s. Uso: ../../../../venv-nb/bin/python -I diagnostico_punicao.py  (gera diagnostico-punicao-saida.txt)"""
import os, sys, statistics as st
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_fibras as fib
from confirmacao_correcoes import CONJ
from passo1_limiar_janela import sucesso
BASE = dict(RET=True, DURO=True, LE=0.30, LI=0.30, ESP=60.0, SIL=2000.0, RELOG=True, PART=True, NPART=100)
EST = {"1 fibra": dict(FIB=1), "8 fibras": dict(FIB=8), "8 fibras + limite 150": dict(FIB=8, LIMF=True, RMAX=150.0)}
def job(a):
    e, pun, f, s = a
    y = fib.rodar("I0", f, s, CUR=True, hist=True, PUNI=pun, **BASE, **EST[e], **CONJ["B"])
    return e, pun, f, s, sucesso(y, f), y["classe"], y["diag_forca_ganha"][0], y["diag_forca_perdida"][0], y["ramos"]
if __name__ == "__main__":
    for e in EST: fib.rodar("I0", "grave", 1, dur=200.0, CUR=True, PUNI=False, **BASE, **EST[e])
    G = [(e, pun, f, s) for e in EST for pun in (True, False) for f in ("grave", "agudo") for s in range(281, 291)]
    with Pool(2) as p: R = p.map(job, G)
    out = []
    for e in EST:
        for pun in (True, False):
            for f in ("grave", "agudo"):
                v = [r for r in R if r[0] == e and r[1] == pun and r[2] == f]
                out.append(f"{e:22s} punição={'sim' if pun else 'não'} {f:6s} sucesso {sum(r[4] for r in v)}/10 colapsos {sum(r[5]=='colapso' for r in v)} "
                           f"| ep1 ganha {st.median(r[6] for r in v):.1f} perdida {st.median(r[7] for r in v):.1f} | ramos {st.median(r[8] for r in v)}")
    open("diagnostico-punicao-saida.txt", "w").write("\n".join(out) + "\n"); print("\n".join(out))
