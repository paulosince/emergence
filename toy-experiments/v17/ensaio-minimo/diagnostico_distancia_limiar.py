"""Diagnóstico (18/11, "Pesquise e meça"): só medidas. Quanto o V chega perto do limiar (1,5), com e sem teto por fibra?
Mede no último episódio, com som: histograma do V em cada chegada (faixas de 0,1) e o maior V de cada Uint.
Sementes 371-376, grave e agudo, variantes: nenhuma / só teto / as três.
Uso: ../../../../venv-nb/bin/python -I diagnostico_distancia_limiar.py  (gera diagnostico-distancia-limiar-saida.txt)"""
import os, sys, statistics as st
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import numpy as np
import motor_fibras as fib
from confirmacao_correcoes import CONJ
NOVO = dict(RET=True, DURO=True, LE=0.30, LI=0.30, ESP=60.0, SIL=2000.0, RELOG=True, PART=True, NPART=100,
            FIB=8, LIMF=True, RMAX=300.0, PUNI=False, LTDN=True, ALTD=0.02)
V = {"nenhuma": dict(), "só teto": dict(FTETO=True), "as três": dict(FORCAF=True)}
def job(a):
    v, f, s = a
    y = fib.rodar("I0", f, s, CUR=True, **NOVO, **V[v], **CONJ["B"])
    return v, f, s, y["hist_V"], y["vmax_uint"]
if __name__ == "__main__":
    for v in V: fib.rodar("I0", "grave", 1, dur=200.0, CUR=True, **NOVO, **V[v])
    G = [(v, f, s) for v in V for f in ("grave", "agudo") for s in range(371, 377)]
    with Pool(2) as p: R = p.map(job, G)
    out = []
    for v in V:
        for f in ("grave", "agudo"):
            r = [x for x in R if x[0] == v and x[1] == f]
            h = sum(x[3] for x in r); n = h.sum(); vm = [float(q) for x in r for q in x[4]]
            fr = lambda i: 100.0 * h[i:].sum() / n if n else 0.0
            out.append(f"{v:9s} {f:6s} | chegadas {int(n)} | V≥0,9: {fr(9):.3f}% | V≥1,2: {fr(12):.3f}% | V≥1,5 (dispara): {fr(15):.3f}%"
                       f" | maior V por Uint: mediana {st.median(vm):.2f}, mín {min(vm):.2f}, máx {max(vm):.2f}")
    out.append("histograma somado (faixas de 0,1; a última é ≥ 1,5):")
    for v in V:
        for f in ("grave", "agudo"):
            h = sum(x[3] for x in R if x[0] == v and x[1] == f)
            out.append(f"  {v:9s} {f:6s} " + " ".join(str(int(q)) for q in h))
    open("diagnostico-distancia-limiar-saida.txt", "w").write("\n".join(out) + "\n"); print("\n".join(out))
