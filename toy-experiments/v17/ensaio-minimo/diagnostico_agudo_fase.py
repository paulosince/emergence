"""Diagnóstico (17/11/2026) da confirmação das correções: no agudo, as Uints "presas no acaso" disparam em relações
equivalentes de fase (Δ ± período, período 0,6–0,9 ms) ou em acaso de verdade? Conjunto A, I1, notas, sementes 1-3.
Contagem dos acertos do último episódio por faixa de diferença de atraso (A − B), somando as 8 Uints."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from motor_correcoes import rodar, DELTA, W

def faixas(h):
    x = np.arange(4001) / 100.0 - 20.0; tot = h.sum()
    def frac(lo, hi): return round(float(h[(x >= lo) & (x <= hi)].sum() / tot), 3) if tot else 0.0
    return {"Δ (0,458 ± 0,21)": frac(DELTA - W, DELTA + W),
            "Δ − período (−0,44 a −0,14) ± 0,21": frac(DELTA - 0.9 - W, DELTA - 0.6 + W),
            "Δ + período (1,06 a 1,36) ± 0,21": frac(DELTA + 0.6 - W, DELTA + 0.9 + W),
            "Δ ± 2 períodos": round(frac(DELTA - 1.8 - W, DELTA - 1.2 + W) + frac(DELTA + 1.2 - W, DELTA + 1.8 + W), 3)}

if __name__ == "__main__":
    for s in (1, 2, 3):
        for f in ("agudo", "grave"):
            r = rodar("I1", f, s, TAUR=60_000.0, RC=1.0, TETA=0.25, TEL=60_000.0, NEXP=8.0, hist=True)
            print(f, "semente", s, r["classe"], "presas", r["uints_presas_no_acaso"], faixas(r["hist_dif"].sum(axis=0)))
