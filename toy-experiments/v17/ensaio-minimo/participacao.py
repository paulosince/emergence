"""Registro prévio participacao.md (RASCUNHO: só rodar depois da aprovação do responsável).
Eliminação por não participação (N = 100, 1000) no modelo atual (passo 1 + espontânea, relógio corrigido), 1 fibra (julgado) e
8 fibras (descritivo); referência: critério antigo com relógio corrigido. Degrau 1, grave e agudo, sementes 221-250.
Uso: ../../../../venv-nb/bin/python -I participacao.py  (gera participacao-saida.csv)"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_fibras as fib
from confirmacao_correcoes import CONJ
from replicacao_b import wilson
from passo1_limiar_janela import sucesso

SEM = list(range(221, 251))
BASE = dict(RET=True, DURO=True, LE=0.30, LI=0.30, ESP=60.0, SIL=2000.0, RELOG=True)
KW = {"a_N100": dict(FIB=1, PART=True, NPART=100), "b_N1000": dict(FIB=1, PART=True, NPART=1000), "c_referencia": dict(FIB=1),
      "d_8fibras_N100": dict(FIB=8, PART=True, NPART=100), "e_8fibras_N1000": dict(FIB=8, PART=True, NPART=1000)}

def job(a):
    m, f, s = a
    y = fib.rodar("I1", f, s, CUR=True, hist=True, **BASE, **KW[m], **CONJ["B"])
    for c in ("diag_e1", "diag_e2", "diag_et", "alcance"): y.pop(c)
    return dict(cond=m, faixa=f, semente=s, sucesso=sucesso(y, f), classe=y["classe"], disparos=sum(y["disparos_por_uint"]),
                eliminados=y["eliminados"], ramos=y["ramos"], forca_total=y["forca_total"], disparos_silencio_por_uint=y["disparos_silencio"])

if __name__ == "__main__":
    for m in KW: fib.rodar("I1", "grave", 1, dur=200.0, CUR=True, **BASE, **KW[m])
    G = [(m, f, s) for m in KW for f in ("grave", "agudo") for s in SEM]
    assert len(G) == 300
    with Pool(2) as p: R = p.map(job, G)
    with open("participacao-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    for m in KW:
        for f in ("grave", "agudo"):
            v = [r for r in R if r["cond"] == m and r["faixa"] == f]; k = sum(r["sucesso"] for r in v)
            sil = sorted(x / 2.0 for r in v for x in r["disparos_silencio_por_uint"])
            print(m, f, "sucesso", k, "/ 30", "IC95%", wilson(k, 30), "| colapsos", sum(r["classe"] == "colapso" for r in v),
                  "| eliminados (med)", sorted(r["eliminados"] for r in v)[15], "| ramos (med)", sorted(r["ramos"] for r in v)[15],
                  "| silêncio/Uint (med)", sil[len(sil) // 2] if sil else "-")
