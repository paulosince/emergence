"""Diagnóstico (18/11, "Confirmar a causa antes"): só medidas, nada muda no modelo.
Hipótese do impasse: com o teto por fibra, cada fibra enche o teto (0,5) mas a força fica espalhada pelos seus ramos
(atrasos variados); no agudo a fibra pula ciclos, a soma coincidente não chega ao limiar, a Uint não dispara e nada tira
força dos ramos errados.
Mede no estado final, por par (Uint, fibra): número de ramos, soma, maior ramo e concentração (maior / soma);
por Uint: V potencial = soma dos maiores ramos de cada fibra (teto do que chega junto, se todas dispararem no mesmo ciclo
e no ramo mais forte); e, do mundo, a fração de ciclos em que cada fibra dispara (episódio 1, com som).
Sementes 371-376, grave e agudo, variantes: nenhuma / só teto / as três.
Uso: ../../../../venv-nb/bin/python -I diagnostico_teto_impasse.py  (gera diagnostico-teto-impasse-saida.txt)"""
import os, sys, statistics as st
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import numpy as np
import motor_fibras as fib
from confirmacao_correcoes import CONJ
NOVO = dict(RET=True, DURO=True, LE=0.30, LI=0.30, ESP=60.0, SIL=2000.0, RELOG=True, PART=True, NPART=100,
            FIB=8, LIMF=True, RMAX=300.0, PUNI=False, LTDN=True, ALTD=0.02)
V = {"nenhuma": dict(), "só teto": dict(FTETO=True), "as três": dict(FORCAF=True)}
REF = None  # ramos guardados pela rodada (ver _estado)

def _estado(s, f, v):
    """Roda e devolve os ramos finais. Usa o motor interno para ter lado, fibra, Uint e força de cada ramo."""
    import motor_fibras as m
    orig = m._rodar; guard = {}
    def esp(*a, **k):
        r = orig(*a, **k); guard["r"] = r; return r
    m._rodar = esp
    try:
        y = m.rodar("I0", f, s, CUR=True, **NOVO, **V[v], **CONJ["B"])
    finally:
        m._rodar = orig
    Rs, Rb, Ru, Rk, Rd, Rf = guard["r"][:6]
    return y, Rs, Rb, Rk, Rf

def fracao_ciclos(s, f):
    notas = []
    T, B, ini, fim = fib.trens_fibras(s, f, 10_000.0, 8, 60.0, 2000.0, LIMF=True, RMAX=300.0, notas=notas)
    t = T[ini[0]:fim[0]]; b = B[ini[0]:fim[0]]; som = t < 10_000.0
    ciclos = sum(250.0 / p for (t0, p) in notas if t0 < 10_000.0)
    return [float((b[som] == x).sum()) / ciclos for x in range(16)]

def job(a):
    v, f, s = a
    y, Rs, Rb, Rk, Rf = _estado(s, f, v)
    par = []; vpot = []
    for k in range(8):
        mx = 0.0
        for b in np.unique(Rb[Rk == k]):
            m_ = (Rk == k) & (Rb == b); w = Rf[m_]
            if w.size == 0: continue
            par.append((int(w.size), float(w.sum()), float(w.max()), float(w.max() / w.sum()) if w.sum() > 0 else 0.0))
            mx += float(w.max())
        vpot.append(mx)
    return v, f, s, sum(y["disparos_por_uint"]), par, vpot

if __name__ == "__main__":
    for v in V: fib.rodar("I0", "grave", 1, dur=200.0, CUR=True, **NOVO, **V[v])
    out = []
    for f in ("grave", "agudo"):
        fr = [x for s in range(371, 377) for x in fracao_ciclos(s, f)]
        out.append(f"{f}: fração de ciclos em que cada fibra dispara (com som): mediana {st.median(fr):.3f}, mín {min(fr):.3f}, máx {max(fr):.3f}")
    G = [(v, f, s) for v in V for f in ("grave", "agudo") for s in range(371, 377)]
    with Pool(2) as p: R = p.map(job, G)
    for v in V:
        for f in ("grave", "agudo"):
            r = [x for x in R if x[0] == v and x[1] == f]
            par = [q for x in r for q in x[4]]; vp = [q for x in r for q in x[5]]
            out.append(f"{v:9s} {f:6s} | disparos (med) {st.median(x[3] for x in r)} | pares Uint-fibra {len(par)} | ramos por par (med) {st.median(q[0] for q in par)}"
                       f" | soma por fibra (med) {st.median(q[1] for q in par):.3f} | maior ramo (med) {st.median(q[2] for q in par):.3f}"
                       f" | concentração maior/soma (med) {st.median(q[3] for q in par):.2f} | V potencial por Uint (med) {st.median(vp):.2f} (mín {min(vp):.2f}, máx {max(vp):.2f})")
    open("diagnostico-teto-impasse-saida.txt", "w").write("\n".join(out) + "\n"); print("\n".join(out))
