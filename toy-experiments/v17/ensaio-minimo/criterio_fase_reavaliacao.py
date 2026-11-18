"""Registro criterio-fase.md (aprovado em 18/11/2026). Reavaliação com o critério de fase: (a) modelo atual (com força por fibra),
(b) sem força por fibra, (c) referência antiga (1 fibra, sorteio, plano B). Sementes 371-400, grave e agudo.
Uso: ../../../../venv-nb/bin/python -I criterio_fase_reavaliacao.py  (gera criterio-fase-saida.csv)"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_fibras as fib
from confirmacao_correcoes import CONJ
from replicacao_b import wilson
from criterio_fase import sucesso_fase

SEM = list(range(371, 401))
NOVO = dict(RET=True, DURO=True, LE=0.30, LI=0.30, ESP=60.0, SIL=2000.0, RELOG=True, PART=True, NPART=100,
            FIB=8, LIMF=True, RMAX=300.0, PUNI=False, LTDN=True, ALTD=0.02)
KW = {"a_atual_forca_fibra": ("I0", dict(NOVO, FORCAF=True)), "b_sem_forca_fibra": ("I0", dict(NOVO)), "c_referencia_antiga": ("I1", dict(FIB=1))}

def job(a):
    m, f, s = a
    cond, kw = KW[m]
    y = fib.rodar(cond, f, s, CUR=True, **kw, **CONJ["B"])
    ok, si, pr, U = sucesso_fase(y["fase_acertos"], y["disparos_por_uint"])
    return dict(cond=m, faixa=f, semente=s, classe=y["classe"], sucesso_grave=(y["classe"] == "selecao"), sucesso_fase=ok, sintonizadas=si, presas=pr,
                R=[u["R"] for u in U], fase=[u["fase"] for u in U], disparos=[u["disp"] for u in U])

if __name__ == "__main__":
    for m in KW: fib.rodar(KW[m][0], "grave", 1, dur=200.0, CUR=True, **KW[m][1])
    G = [(m, f, s) for m in KW for f in ("grave", "agudo") for s in SEM]
    assert len(G) == 180
    with Pool(2) as p: R = p.map(job, G)
    with open("criterio-fase-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    import statistics as st
    for m in KW:
        for f in ("grave", "agudo"):
            v = [r for r in R if r["cond"] == m and r["faixa"] == f]
            kg = sum(r["sucesso_grave"] for r in v); kf = sum(r["sucesso_fase"] for r in v)
            Rs = [x for r in v for x, d in zip(r["R"], r["disparos"]) if d >= 100]
            print(m, f, "| critério antigo do grave:", kg, "/ 30 | critério de fase:", kf, "/ 30", wilson(kf, 30),
                  "| R mediano (Uints >= 100 disparos):", round(st.median(Rs), 3) if Rs else "-")
