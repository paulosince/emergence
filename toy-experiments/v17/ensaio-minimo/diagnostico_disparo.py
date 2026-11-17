"""Diagnóstico do disparo (pedido do responsável, 17/11/2026): com a força da região verdadeira somando ~1,0 por Upro,
qual é o pico da soma na Uint para UM pulso isolado (A em 0, B em Δ), dados os ramos ao fim do 5º episódio?
Excitação: soma de f·exp(-(T-x)/τ) das chegadas; inibição I1: -0,5·f·exp(-(T-x-W)/0,30) a partir de x+W. Sem ruído."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from motor_eventos import rodar, DELTA, W, TAU, LIM

def pico(dA, fA, dB, fB, inib=True):
    x = np.concatenate([dA, DELTA + dB]); f = np.concatenate([fA, fB])
    T = np.linspace(0, 25, 25001); V = np.zeros_like(T)
    for xi, fi in zip(x, f):
        m = T >= xi; V[m] += fi * np.exp(-(T[m] - xi) / TAU)
        if inib:
            m2 = T >= xi + W; V[m2] += -0.5 * fi * np.exp(-(T[m2] - xi - W) / 0.30)
    k = int(np.argmax(V)); return float(V[k]), float(T[k])

if __name__ == "__main__":
    rodar("I1", "grave", 1, dur=200.0)
    for s in range(1, 11):
        r = rodar("I1", "grave", s, Q=0.75, JAN=60_000.0, retratos=True); snD, snF, snN = r["retratos"]; ep = 4
        nA, nB = snN[ep]; dA, fA, dB, fB = snD[ep, 0, :nA], snF[ep, 0, :nA], snD[ep, 1, :nB], snF[ep, 1, :nB]
        verA = np.array([np.any(np.abs(a - dB - DELTA) <= W) for a in dA]); verB = np.array([np.any(np.abs(dA - b - DELTA) <= W) for b in dB])
        v, t = pico(dA, fA, dB, fB); vs, _ = pico(dA, fA, dB, fB, inib=False)
        espA = dA[verA].max() - dA[verA].min() if verA.any() else 0; espB = dB[verB].max() - dB[verB].min() if verB.any() else 0
        # mesma força total da região, se estivesse toda no par verdadeiro mais forte
        pares = [(fA[i] + fB[j], i, j) for i in range(nA) for j in range(nB) if abs(dA[i] - dB[j] - DELTA) <= W]
        _, iA, iB = max(pares)
        vc, _ = pico(np.array([dA[iA]]), np.array([fA[verA].sum()]), np.array([dB[iB]]), np.array([fB[verB].sum()]))
        print(f"semente {s:2d} classe={r['classe']:8s} pico={v:.3f} (sem inibição {vs:.3f}) | espalhamento dos atrasos A={espA:.3f} B={espB:.3f} ms | se concentrada: {vc:.3f} | limiar {LIM}")
