"""Passos 2+3 — registro prévio passo23-fibras.md (RASCUNHO: só rodar depois da aprovação do responsável).
Condições: (a) 8 fibras + alcance 2-4 + espontânea 60/s; (b) 8 fibras sem espontânea; (c) passo 2; (d) passo 1. Degrau 1,
grave e agudo, sementes 191-220, sobre o passo 1 (limiar duro, janela retangular 0,30 ms). Motor: motor_fibras.
Uso: ../../../../venv-nb/bin/python -I passo23_fibras.py  (gera passo23-saida.csv)"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_fibras as fib
from confirmacao_correcoes import CONJ
from replicacao_b import wilson
from passo1_limiar_janela import sucesso

SEM = list(range(191, 221))
BASE = dict(RET=True, DURO=True, LE=0.30, LI=0.30)
KW = {"a_fibras_espontanea": dict(FIB=8, ESP=60.0), "b_fibras": dict(FIB=8), "c_passo2": dict(FIB=1, ESP=60.0), "d_passo1": dict(FIB=1)}

def job(a):
    m, f, s = a
    y = fib.rodar("I1", f, s, CUR=True, hist=True, **BASE, **KW[m], **CONJ["B"])
    for c in ("diag_e1", "diag_e2", "diag_et"): y.pop(c)
    alc = y.pop("alcance")
    return dict(cond=m, faixa=f, semente=s, sucesso=sucesso(y, f), classe=y["classe"], disparos=sum(y["disparos_por_uint"]),
                disparos_silencio_por_uint=y["disparos_silencio"], ramos=y["ramos"], upros_novas=y["upros_novas"],
                eliminados=y["eliminados"], fibras_por_uint=[int(x) for x in alc.sum(axis=0)], eventos=sum(y["eventos_por_episodio"]))

if __name__ == "__main__":
    for m in KW: fib.rodar("I1", "grave", 1, dur=200.0, CUR=True, **BASE, **KW[m])
    G = [(m, f, s) for m in KW for f in ("grave", "agudo") for s in SEM]
    assert len(G) == 240
    with Pool(2) as p: R = p.map(job, G)
    with open("passo23-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    for m in KW:
        for f in ("grave", "agudo"):
            v = [r for r in R if r["cond"] == m and r["faixa"] == f]; k = sum(r["sucesso"] for r in v)
            sil = sorted(x / 2.0 for r in v for x in r["disparos_silencio_por_uint"])
            print(m, f, "sucesso", k, "/ 30", "IC95%", wilson(k, 30), "| colapsos", sum(r["classe"] == "colapso" for r in v),
                  "| silêncio por Uint (mediana, /s)", sil[len(sil) // 2] if sil else "-")
