"""Diagnóstico pedido pelo responsável (17/11/2026), em paralelo à etapa B:
(1) por que a seleção no grave subiu de 4/10 (etapa A) para 8/10 com a competição ligada ao disparo;
(2) por que o agudo colapsa com ela. Mesmo conjunto da etapa B; retratos ao fim de cada episódio."""
import os, sys, csv
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from motor_eventos import rodar, DELTA, W

def ep_resumo(r):
    snD, snF, snN = r["retratos"]; out = []
    for ep in range(snN.shape[0]):
        nA, nB = snN[ep]; fA, fB = snF[ep, 0, :nA], snF[ep, 1, :nB]
        out.append((int(nA), int(nB), round(float(fA.sum()), 3), round(float(fB.sum()), 3), round(float(fA.max()) if nA else 0, 3)))
    return out

if __name__ == "__main__":
    rodar("I1", "grave", 1, dur=200.0, COMP=True)
    print("(1) grave, notas, I1 — semente: classe [crédito, par mais forte verdadeiro] sem competição -> com competição")
    for s in range(1, 11):
        a = rodar("I1", "grave", s, Q=0.75, JAN=60_000.0)
        b = rodar("I1", "grave", s, Q=0.75, JAN=60_000.0, COMP=True, TAUC=1.0, XNH=10_000.0)
        print(f"  {s:2d}: {a['classe']:8s} [{a['credito_verdadeiro']}, {a['par_mais_forte_verdadeiro']}] maxf {max(a['maxfA'],a['maxfB'])}  ->  "
              f"{b['classe']:8s} [{b['credito_verdadeiro']}, {b['par_mais_forte_verdadeiro']}] maxf {max(b['maxfA'],b['maxfB'])}")
    print("(2) agudo, notas, I1 — por episódio: (ramos A, ramos B, soma das forças A, soma B, força máxima A)")
    for s in (1, 2, 3):
        for comp in (False, True):
            r = rodar("I1", "agudo", s, Q=0.75, JAN=60_000.0, COMP=comp, TAUC=1.0, XNH=10_000.0, retratos=True)
            print(f"  semente {s} competição={comp} classe={r['classe']} disparos_último={r['disparos_ultimo_ep']} fortalec={r['fortalecimentos_disparo']} enfraq={r['enfraquecimentos_disparo']}")
            print("     ", ep_resumo(r), "insumo:", r["insumo_pcrt_por_episodio"])
