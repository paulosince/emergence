"""Passo 2 — registro prévio passo2-espontanea.md (RASCUNHO: só rodar depois da aprovação do responsável).
(a) passo 2 = passo 1 + atividade espontânea 60/s por fibra (com 2 s de silêncio no fim de cada episódio); (b) passo 1; (c) referência B.
Degrau 1, grave e agudo, sementes 161-190. Uso: ../../../../venv-nb/bin/python -I passo2_espontanea.py  (gera passo2-saida.csv)"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_rapido as rap
from confirmacao_correcoes import CONJ
from replicacao_b import wilson
from passo1_limiar_janela import sucesso

SEM = list(range(161, 191))
KW = {"passo2": dict(RET=True, DURO=True, LE=0.30, LI=0.30, ESP=60.0, SIL=2000.0),
      "passo1": dict(RET=True, DURO=True, LE=0.30, LI=0.30), "referencia": {}}

def job(a):
    m, f, s = a
    y = rap.rodar("I1", f, s, CUR=True, hist=True, **KW[m], **CONJ["B"])
    for c in ("diag_e1", "diag_e2", "diag_et"): y.pop(c)
    return dict(motor=m, faixa=f, semente=s, sucesso=sucesso(y, f), classe=y["classe"], disparos=sum(y["disparos_por_uint"]),
                disparos_silencio_por_uint=y["disparos_silencio"], ramos=y["ramos"], upros_novas=y["upros_novas"],
                eventos=sum(y["eventos_por_episodio"]))

if __name__ == "__main__":
    for m in KW: rap.rodar("I1", "grave", 1, dur=200.0, CUR=True, **KW[m])
    G = [(m, f, s) for m in KW for f in ("grave", "agudo") for s in SEM]
    assert len(G) == 180
    with Pool(2) as p: R = p.map(job, G)
    with open("passo2-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    for m in KW:
        for f in ("grave", "agudo"):
            v = [r for r in R if r["motor"] == m and r["faixa"] == f]; k = sum(r["sucesso"] for r in v)
            sil = sorted(x / 2.0 for r in v for x in r["disparos_silencio_por_uint"])
            print(m, f, "sucesso", k, "/ 30", "IC95%", wilson(k, 30), "| colapsos", sum(r["classe"] == "colapso" for r in v),
                  "| disparo no silêncio por Uint (mediana, /s)", sil[len(sil) // 2] if sil else "-")
