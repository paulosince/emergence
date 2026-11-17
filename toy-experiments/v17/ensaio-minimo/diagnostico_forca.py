"""Diagnóstico pedido pelo responsável (17/11/2026): a força do ramo verdadeiro está sendo dividida com os vizinhos?
Condição da etapa A: grave, notas, I1, quase-acerto 0,75, janela 60 s, sem enfraquecimento; e o controle sem brotamento.
Retrato ao fim de cada episódio (antes da poda). "Ramo verdadeiro": ramo de A (de B) que forma, com algum ramo de B (de A),
diferença de atraso a até uma janela de Δ = 0,458 ms."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from motor_eventos import rodar, DELTA, W

def resumo(r):
    snD, snF, snN = r["retratos"]; out = []
    for ep in range(snN.shape[0]):
        nA, nB = snN[ep]; dA, fA, dB, fB = snD[ep, 0, :nA], snF[ep, 0, :nA], snD[ep, 1, :nB], snF[ep, 1, :nB]
        if nA == 0 or nB == 0: out.append(None); continue
        verA = np.array([np.any(np.abs(a - dB - DELTA) <= W) for a in dA]); verB = np.array([np.any(np.abs(dA - b - DELTA) <= W) for b in dB])
        out.append(dict(ramos=(int(nA), int(nB)), ver=(int(verA.sum()), int(verB.sum())),
                        parte_ver=(round(float(fA[verA].sum() / max(fA.sum(), 1e-12)), 2), round(float(fB[verB].sum() / max(fB.sum(), 1e-12)), 2)),
                        total=(round(float(fA.sum()), 2), round(float(fB.sum()), 2)),
                        max_ver=(round(float(fA[verA].max()) if verA.any() else 0, 3), round(float(fB[verB].max()) if verB.any() else 0, 3))))
    return out

if __name__ == "__main__":
    rodar("I1", "grave", 1, dur=200.0)
    for s in range(1, 11):
        for broto in (True, False):
            r = rodar("I1", "grave", s, Q=0.75, JAN=60_000.0, BROTO=broto, retratos=True)
            print(f"semente {s} broto={broto} classe={r['classe']} bloqueados_portao={r['bloqueados_portao']} brotados={r['ramos_brotados']}")
            for ep, x in enumerate(resumo(r)): print("   ep", ep + 1, x)
