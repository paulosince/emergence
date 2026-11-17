"""Degrau 2 da escada — registro prévio duas-relacoes.md (APROVADO em 17/11/2026).
Duas fontes independentes, Δ1 = +0,458 e Δ2 = -0,458 ms, grave (julgado) e agudo (descritivo), conjunto B, I1, sementes 101-130.
Controle: só a fonte 1 (Δ1), mesmas sementes, grave. Motor: motor_rapido com fila por cursor (idêntico à referência).
Uso: ../../../../venv-nb/bin/python -I ensaio_duas_relacoes.py  (gera duas-relacoes-saida.csv)"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_rapido as rap
from confirmacao_correcoes import CONJ
from ensaio_fase_preferencia import frac_em
from replicacao_b import wilson

D1, D2 = 0.458, -0.458
SEM = list(range(101, 131))

def classifica(y):
    H = y.pop("hist_dif"); disp = y["disparos_por_uint"]; s1 = s2 = pr = 0
    for k in range(H.shape[0]):
        if disp[k] < 100: continue
        f1 = frac_em(H[k], D1); f2 = frac_em(H[k], D2)
        if f1 >= 0.6: s1 += 1
        elif f2 >= 0.6: s2 += 1
        elif f1 + f2 < 0.2: pr += 1
    return s1, s2, pr

def job(a):
    cond, f, s = a
    y = rap.rodar("I1", f, s, CUR=True, hist=True, duas=((D1, D2) if cond == "duas" else None), **CONJ["B"])
    s1, s2, pr = classifica(y)
    ok = (s1 >= 1 and s2 >= 1 and pr == 0) if cond == "duas" else (s1 >= 1 and pr == 0)
    return dict(cond=cond, faixa=f, semente=s, uints_d1=s1, uints_d2=s2, presas=pr, sucesso=ok, ramos=y["ramos"], classe=y["classe"])

if __name__ == "__main__":
    rap.rodar("I1", "grave", 1, dur=200.0, CUR=True)
    G = [("duas", f, s) for f in ("grave", "agudo") for s in SEM] + [("uma", "grave", s) for s in SEM]
    assert len(G) == 90
    with Pool(2) as p: R = p.map(job, G)
    with open("duas-relacoes-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    for c, f in (("duas", "grave"), ("uma", "grave"), ("duas", "agudo")):
        v = [r for r in R if r["cond"] == c and r["faixa"] == f]; k = sum(r["sucesso"] for r in v)
        print(c, f, "sucesso", k, "/", len(v), "IC95%", wilson(k, len(v)),
              "| Uints Δ1", sum(r["uints_d1"] for r in v), "Δ2", sum(r["uints_d2"] for r in v), "presas", sum(r["presas"] for r in v))
