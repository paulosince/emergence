"""Registro prévio forca-fibra.md (RASCUNHO: só rodar depois da aprovação do responsável).
Força por fibra (teto 0,5; estoque proporcional; força inicial 0,43 do teto) contra o modelo atual (8 fibras, limite 300/s, depressão NB A=0,02),
sem inibição. Degrau 1, grave e agudo, sementes 341-370. Uso: ../../../../venv-nb/bin/python -I forca_fibra.py  (gera forca-fibra-saida.csv)"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_fibras as fib
from confirmacao_correcoes import CONJ
from replicacao_b import wilson
from passo1_limiar_janela import sucesso

SEM = list(range(341, 371))
BASE = dict(RET=True, DURO=True, LE=0.30, LI=0.30, ESP=60.0, SIL=2000.0, RELOG=True, PART=True, NPART=100,
            FIB=8, LIMF=True, RMAX=300.0, PUNI=False, LTDN=True, ALTD=0.02)
KW = {"a_forca_por_fibra": dict(FORCAF=True), "b_atual": dict(FORCAF=False)}

def job(a):
    m, f, s = a
    y = fib.rodar("I0", f, s, CUR=True, hist=True, **BASE, **KW[m], **CONJ["B"])
    for c in ("diag_e1", "diag_e2", "diag_et", "alcance"): y.pop(c)
    d = y["disparos_por_uint"]
    return dict(cond=m, faixa=f, semente=s, sucesso=sucesso(y, f), classe=y["classe"], disparos_por_uint=d,
                dispara=max(d) >= 100, eliminados=y["eliminados"], ramos=y["ramos"], forca_total=y["forca_total"],
                disparos_silencio_por_uint=y["disparos_silencio"], forca_ganha=y["diag_forca_ganha"], forca_perdida=y["diag_forca_perdida"])

if __name__ == "__main__":
    for m in KW: fib.rodar("I0", "grave", 1, dur=200.0, CUR=True, **BASE, **KW[m])
    G = [(m, f, s) for m in KW for f in ("grave", "agudo") for s in SEM]
    assert len(G) == 120
    with Pool(2) as p: R = p.map(job, G)
    with open("forca-fibra-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    for m in KW:
        for f in ("grave", "agudo"):
            v = [r for r in R if r["cond"] == m and r["faixa"] == f]; k = sum(r["sucesso"] for r in v)
            sil = sorted(x / 2.0 for r in v for x in r["disparos_silencio_por_uint"])
            print(m, f, "sucesso", k, "/ 30", "IC95%", wilson(k, 30), "| colapsos", sum(r["classe"] == "colapso" for r in v),
                  "| dispara (>=100)", sum(r["dispara"] for r in v), "/ 30 | disparos totais (med)", sorted(sum(r["disparos_por_uint"]) for r in v)[15],
                  "| silêncio/Uint (med)", sil[len(sil) // 2] if sil else "-")
