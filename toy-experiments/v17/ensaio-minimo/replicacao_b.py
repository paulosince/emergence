"""Registro prévio replicacao-b.md (aprovado em 17/11/2026): conjunto B, I1, sem maturação; grave (classe Δ) e agudo (seleção em fase),
notas, sementes 31-60 (60 execuções). Uso: ../../../../venv-nb/bin/python -I replicacao_b.py  (gera replicacao-b-saida.csv)"""
import csv, os, sys, time, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
from motor_correcoes import rodar
from confirmacao_correcoes import CONJ
from ensaio_fase_preferencia import frac_fase

def job(a):
    faixa, s = a
    r = rodar("I1", faixa, s, hist=True, **CONJ["B"]); H = r.pop("hist_dif"); disp = r["disparos_por_uint"]
    ff = [frac_fase(H[k], 0.458) for k in range(H.shape[0])]
    sf = sum(1 for k in range(8) if disp[k] >= 100 and ff[k] >= 0.6); pr = sum(1 for k in range(8) if disp[k] >= 100 and ff[k] < 0.2)
    return dict(faixa=faixa, semente=s, classe=r["classe"], selecao_fase=bool(sf >= 1 and pr == 0),
                sucesso=(r["classe"] == "selecao") if faixa == "grave" else bool(sf >= 1 and pr == 0),
                uints_sintonizadas=r["uints_sintonizadas"], presas=r["uints_presas_no_acaso"], ramos=r["ramos"])

def wilson(k, n, z=1.96):
    p = k / n; d = 1 + z * z / n; c = p + z * z / (2 * n); m = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))
    return round((c - m) / d, 3), round((c + m) / d, 3)

if __name__ == "__main__":
    rodar("I1", "grave", 1, dur=200.0)
    g = [(f, s) for f in ("grave", "agudo") for s in range(31, 61)]
    assert len(g) == 60
    t0 = time.time()
    with Pool(2) as p: R = p.map(job, g)
    with open("replicacao-b-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    for f in ("grave", "agudo"):
        k = sum(r["sucesso"] for r in R if r["faixa"] == f); print(f, k, "/30", "IC95%", wilson(k, 30))
    print("tempo (s):", round(time.time() - t0, 1))
