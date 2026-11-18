"""Registro prévio depressao-nb.md (RASCUNHO: só rodar depois da aprovação do responsável).
8 fibras + limite (150, 300/s) com a depressão NB (A = 0,005; 0,02) no lugar da punição; comparação: sem punição nem depressão (limite 150/s)
e o modelo atual de 1 fibra com a punição antiga. Sem inibição. Degrau 1, grave e agudo, sementes 311-340.
Uso: ../../../../venv-nb/bin/python -I depressao_nb.py  (gera depressao-nb-saida.csv)"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_fibras as fib
from confirmacao_correcoes import CONJ
from replicacao_b import wilson
from passo1_limiar_janela import sucesso

SEM = list(range(311, 341))
BASE = dict(RET=True, DURO=True, LE=0.30, LI=0.30, ESP=60.0, SIL=2000.0, RELOG=True, PART=True, NPART=100)
F8 = dict(FIB=8, LIMF=True)
KW = {"a_lim150_A0005": dict(F8, RMAX=150.0, PUNI=False, LTDN=True, ALTD=0.005),
      "b_lim150_A002": dict(F8, RMAX=150.0, PUNI=False, LTDN=True, ALTD=0.02),
      "c_lim300_A0005": dict(F8, RMAX=300.0, PUNI=False, LTDN=True, ALTD=0.005),
      "d_lim300_A002": dict(F8, RMAX=300.0, PUNI=False, LTDN=True, ALTD=0.02),
      "e_lim150_sem_depressao": dict(F8, RMAX=150.0, PUNI=False),
      "f_atual_1fibra": dict(FIB=1)}

def job(a):
    m, f, s = a
    y = fib.rodar("I0", f, s, CUR=True, hist=True, **BASE, **KW[m], **CONJ["B"])
    for c in ("diag_e1", "diag_e2", "diag_et", "alcance"): y.pop(c)
    return dict(cond=m, faixa=f, semente=s, sucesso=sucesso(y, f), classe=y["classe"], disparos=sum(y["disparos_por_uint"]),
                eliminados=y["eliminados"], ramos=y["ramos"], disparos_silencio_por_uint=y["disparos_silencio"],
                forca_ganha=y["diag_forca_ganha"], forca_perdida=y["diag_forca_perdida"])

if __name__ == "__main__":
    for m in KW: fib.rodar("I0", "grave", 1, dur=200.0, CUR=True, **BASE, **KW[m])
    G = [(m, f, s) for m in KW for f in ("grave", "agudo") for s in SEM]
    assert len(G) == 360
    with Pool(2) as p: R = p.map(job, G)
    with open("depressao-nb-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    for m in KW:
        for f in ("grave", "agudo"):
            v = [r for r in R if r["cond"] == m and r["faixa"] == f]; k = sum(r["sucesso"] for r in v)
            sil = sorted(x / 2.0 for r in v for x in r["disparos_silencio_por_uint"])
            print(m, f, "sucesso", k, "/ 30", "IC95%", wilson(k, 30), "| colapsos", sum(r["classe"] == "colapso" for r in v),
                  "| ramos (med)", sorted(r["ramos"] for r in v)[15], "| silêncio/Uint (med)", sil[len(sil) // 2] if sil else "-")
