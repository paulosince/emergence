"""Validação da fase 1 (otimizacao-fase1.md): (1) exato — motor_rapido OPT=1 vs motor_correcoes, sementes 31-40, grave e agudo;
(2) estatístico — OPT=2 vs referência, sementes 61-90, grave (Δ) e agudo (fase); (3) tempos na mesma máquina.
Uso: ../../../../venv-nb/bin/python -I valida_motor_rapido.py  (gera valida-motor-rapido-saida.csv)"""
import csv, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_correcoes as ref, motor_rapido as rap
from confirmacao_correcoes import CONJ
from ensaio_fase_preferencia import frac_fase
from replicacao_b import wilson

CAMPOS = ("classe", "ramos", "acertos", "disparos_por_uint", "parte_verdadeira_por_uint", "forca_total", "eliminados", "upros_novas")

def sucesso(r, faixa):
    H = r.pop("hist_dif"); disp = r["disparos_por_uint"]
    if faixa == "grave": return r["classe"] == "selecao"
    ff = [frac_fase(H[k], 0.458) for k in range(H.shape[0])]
    sf = sum(1 for k in range(8) if disp[k] >= 100 and ff[k] >= 0.6); pr = sum(1 for k in range(8) if disp[k] >= 100 and ff[k] < 0.2)
    return sf >= 1 and pr == 0

def job(a):
    modo, faixa, s = a
    t = time.time(); x = ref.rodar("I1", faixa, s, hist=True, **CONJ["B"]); tr = time.time() - t
    t = time.time(); y = rap.rodar("I1", faixa, s, hist=True, OPT=(1 if modo == "exato" else 2), **CONJ["B"]); tn = time.time() - t
    igual = all(str(x[c]) == str(y[c]) for c in CAMPOS)
    return dict(modo=modo, faixa=faixa, semente=s, igual=igual, sucesso_ref=sucesso(x, faixa), sucesso_novo=sucesso(y, faixa),
                tempo_ref=round(tr, 3), tempo_novo=round(tn, 3))

if __name__ == "__main__":
    ref.rodar("I1", "grave", 1, dur=200.0); rap.rodar("I1", "grave", 1, dur=200.0, OPT=1); rap.rodar("I1", "grave", 1, dur=200.0, OPT=2)
    g = [("exato", f, s) for f in ("grave", "agudo") for s in range(31, 41)] + [("estatistico", f, s) for f in ("grave", "agudo") for s in range(61, 91)]
    with Pool(2) as p: R = p.map(job, g)
    with open("valida-motor-rapido-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    for modo in ("exato", "estatistico"):
        for f in ("grave", "agudo"):
            v = [r for r in R if r["modo"] == modo and r["faixa"] == f]
            kr = sum(r["sucesso_ref"] for r in v); kn = sum(r["sucesso_novo"] for r in v)
            tr = sum(r["tempo_ref"] for r in v); tn = sum(r["tempo_novo"] for r in v)
            print(modo, f, "idênticas", sum(r["igual"] for r in v), "/", len(v), "| sucesso ref", kr, "novo", kn, "IC95% ref", wilson(kr, len(v)), "| ganho", round(tr / tn, 2), "x")
