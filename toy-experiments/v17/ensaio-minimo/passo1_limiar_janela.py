"""Passo 1 — registro prévio passo1-limiar-janela.md (APROVADO em 17/11/2026).
Limiar duro + janela retangular (LE = LI = 0,30 ms) contra a referência (conjunto B com sorteio), degrau 1, grave e agudo,
sementes 131-160. Motor: motor_rapido com fila por cursor.
Uso: ../../../../venv-nb/bin/python -I passo1_limiar_janela.py  (gera passo1-saida.csv)"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_rapido as rap
from confirmacao_correcoes import CONJ
from ensaio_fase_preferencia import frac_fase
from replicacao_b import wilson

SEM = list(range(131, 161))

def sucesso(y, faixa):
    H = y.pop("hist_dif"); disp = y["disparos_por_uint"]
    if faixa == "grave": return y["classe"] == "selecao"
    ff = [frac_fase(H[k], 0.458) for k in range(H.shape[0])]
    sf = sum(1 for k in range(8) if disp[k] >= 100 and ff[k] >= 0.6); pr = sum(1 for k in range(8) if disp[k] >= 100 and ff[k] < 0.2)
    return sf >= 1 and pr == 0

def job(a):
    motor, f, s = a
    kw = dict(RET=True, DURO=True, LE=0.30, LI=0.30) if motor == "passo1" else {}
    y = rap.rodar("I1", f, s, CUR=True, hist=True, **kw, **CONJ["B"])
    e1, et = y.pop("diag_e1"), y.pop("diag_et"); y.pop("diag_e2")
    prim = next((ep + 1 for ep in range(et.shape[1]) if et[:, ep].sum() > 0), 0)
    return dict(motor=motor, faixa=f, semente=s, sucesso=sucesso(y, f), classe=y["classe"], disparos=sum(y["disparos_por_uint"]),
                ramos=y["ramos"], upros_novas=y["upros_novas"], episodio_primeiro_acerto=prim)

if __name__ == "__main__":
    rap.rodar("I1", "grave", 1, dur=200.0, CUR=True); rap.rodar("I1", "grave", 1, dur=200.0, CUR=True, RET=True, DURO=True)
    G = [(m, f, s) for m in ("passo1", "referencia") for f in ("grave", "agudo") for s in SEM]
    assert len(G) == 120
    with Pool(2) as p: R = p.map(job, G)
    with open("passo1-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    for m in ("passo1", "referencia"):
        for f in ("grave", "agudo"):
            v = [r for r in R if r["motor"] == m and r["faixa"] == f]; k = sum(r["sucesso"] for r in v)
            print(m, f, "sucesso", k, "/ 30", "IC95%", wilson(k, 30), "| colapsos", sum(r["classe"] == "colapso" for r in v),
                  "| sem acerto nenhum", sum(r["episodio_primeiro_acerto"] == 0 for r in v))
