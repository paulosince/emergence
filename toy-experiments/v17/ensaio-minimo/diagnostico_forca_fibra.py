"""Diagnóstico (18/11, "Fica e investigo"): só medidas. Qual das três peças da força por fibra emudece o agudo?
Sementes 371-376 (já vistas), agudo e grave: só teto; só estoque proporcional; só força inicial; as três; nenhuma.
Uso: ../../../../venv-nb/bin/python -I diagnostico_forca_fibra.py  (gera diagnostico-forca-fibra-saida.txt)"""
import os, sys, statistics as st
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_fibras as fib
from confirmacao_correcoes import CONJ
from criterio_fase import sucesso_fase
NOVO = dict(RET=True, DURO=True, LE=0.30, LI=0.30, ESP=60.0, SIL=2000.0, RELOG=True, PART=True, NPART=100,
            FIB=8, LIMF=True, RMAX=300.0, PUNI=False, LTDN=True, ALTD=0.02)
V = {"nenhuma": dict(), "só teto": dict(FTETO=True), "só estoque": dict(FEST=True), "só força inicial": dict(FINIF=True),
     "teto + estoque": dict(FTETO=True, FEST=True), "as três": dict(FORCAF=True)}
def job(a):
    v, f, s = a
    y = fib.rodar("I0", f, s, CUR=True, **NOVO, **V[v], **CONJ["B"])
    ok, si, pr, U = sucesso_fase(y["fase_acertos"], y["disparos_por_uint"])
    return v, f, s, ok if f == "agudo" else y["classe"] == "selecao", sum(y["disparos_por_uint"]), y["forca_total"], y["diag_forca_ganha"][1]
if __name__ == "__main__":
    for v in V: fib.rodar("I0", "grave", 1, dur=200.0, CUR=True, **NOVO, **V[v])
    G = [(v, f, s) for v in V for f in ("grave", "agudo") for s in range(371, 377)]
    with Pool(2) as p: R = p.map(job, G)
    out = []
    for v in V:
        for f in ("grave", "agudo"):
            r = [x for x in R if x[0] == v and x[1] == f]
            out.append(f"{v:18s} {f:6s} sucesso {sum(x[3] for x in r)}/6 | disparos (med) {st.median(x[4] for x in r)} | força total (med) {st.median(x[5] for x in r)} | ganho ep2 (med) {st.median(x[6] for x in r)}")
    open("diagnostico-forca-fibra-saida.txt", "w").write("\n".join(out) + "\n"); print("\n".join(out))
