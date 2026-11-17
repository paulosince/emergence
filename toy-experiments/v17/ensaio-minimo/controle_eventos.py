"""Controle de código do motor por eventos (registro prévio pcrt-incidencias.md, seção 5), com o brotamento DESLIGADO
nos dois motores: motor antigo (motor_par, portão de broto 99 = nunca brota) x motor por eventos (BROTO=False).
Uso: ../../../../venv-nb/bin/python -I controle_eventos.py  (gera controle-eventos-saida.csv)"""
import csv, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from motor_par import rodar_rapido, trens as trens_par
from motor_eventos import rodar, trens as trens_ev

CAMPOS = ("classe", "ramos", "relacoes", "credito_verdadeiro", "acertos", "maxfA", "maxfB", "disparos_ultimo_ep")
if __name__ == "__main__":
    for f in ("grave", "agudo"):
        a = trens_par(3, f, 10_000.0); b = trens_ev(3, f, 10_000.0)
        assert all(np.array_equal(x, y) for x, y in zip(a, b)), "trens diferentes"
    rodar_rapido("I1", "grave", 1, dur=200.0, FBROTO=99.0); rodar("I1", "grave", 1, dur=200.0, BROTO=False)
    linhas = []
    for cond in ("I0", "I1"):
        for s in range(1, 11):
            t = time.time(); x = rodar_rapido(cond, "grave", s, FBROTO=99.0); ta = time.time() - t
            t = time.time(); y = rodar(cond, "grave", s, BROTO=False); tb = time.time() - t
            linhas.append({"cond": cond, "semente": s, **{f"antigo_{k}": x[k] for k in CAMPOS}, "antigo_s": round(ta, 2),
                           **{f"novo_{k}": y[k] for k in CAMPOS}, "novo_s": round(tb, 3)})
            print(cond, s, x["classe"], y["classe"], x["credito_verdadeiro"], y["credito_verdadeiro"], x["acertos"], y["acertos"], round(ta, 1), round(tb, 2), flush=True)
    with open("controle-eventos-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(linhas[0])); w.writeheader(); w.writerows(linhas)
