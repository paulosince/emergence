"""Diagnóstico (18/11, pedido do responsável: "antes de falar se uma Uint dispara, o que foi criado?"). Só medidas.
Descreve o que existe e o que foi criado no modelo atual (8 fibras, limite 300/s, depressão NB, força por fibra, sem inibição)
e no mesmo modelo sem força por fibra. Sementes 371-376, grave e agudo.
Uso: ../../../../venv-nb/bin/python -I diagnostico_malha.py  (gera diagnostico-malha-saida.txt)"""
import os, sys, statistics as st
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import numpy as np
import motor_fibras as fib
from confirmacao_correcoes import CONJ
NOVO = dict(RET=True, DURO=True, LE=0.30, LI=0.30, ESP=60.0, SIL=2000.0, RELOG=True, PART=True, NPART=100,
            FIB=8, LIMF=True, RMAX=300.0, PUNI=False, LTDN=True, ALTD=0.02)
V = {"atual (com força por fibra)": dict(FORCAF=True), "sem força por fibra": dict()}
SEM = list(range(371, 377))

def job(a):
    v, f, s = a
    import motor_fibras as m
    orig = m._rodar; g = {}
    def esp(*x, **k):
        r = orig(*x, **k); g["r"] = r; return r
    m._rodar = esp
    try: y = m.rodar("I0", f, s, CUR=True, **NOVO, **V[v], **CONJ["B"])
    finally: m._rodar = orig
    Rs, Rb, Ru, Rk, Rd, Rf, UD, UA = g["r"][:8]
    # incidências do mundo e espontâneas (episódio 1): com som (0-10 s) e no silêncio (10-12 s)
    T, B, ini, fim = fib.trens_fibras(s, f, 10_000.0, 8, 60.0, 2000.0, LIMF=True, RMAX=300.0, notas=[])
    t = T[ini[0]:fim[0]]; som = int((t < 10_000.0).sum()); sil = int((t >= 10_000.0).sum())
    # estrutura final
    ramos_upro = [int(((Rb == b) & (Ru == u)).sum()) for b in range(16) for u in range(UA.shape[1]) if UA[b, u]]
    por_uint = []
    for k in range(8):
        for lado in range(2):
            mk = (Rk == k) & (Rs == lado); w = np.sort(Rf[mk])[::-1]
            if w.size == 0: por_uint.append((0, 0.0, 0.0, 0)); continue
            fortes = int((w >= 0.5 * w[0]).sum())
            por_uint.append((int(w.size), float(w.sum()), float(w[0] / w.sum()) if w.sum() > 0 else 0.0, fortes))
    # o mesmo Upro é o mais forte do seu lado em várias Uints?
    dono = {}
    for k in range(8):
        for lado in range(2):
            mk = np.where((Rk == k) & (Rs == lado))[0]
            if mk.size: i = mk[np.argmax(Rf[mk])]; dono.setdefault((int(Rb[i]), int(Ru[i])), []).append(k)
    compart = max(len(v_) for v_ in dono.values()) if dono else 0
    return dict(v=v, f=f, s=s, alc=y["alcance"], upros_ini=96, upros_novas=y["upros_novas"], upros_vivas=sum(y["upros"]),
                ramos_ep=y["ramos_fim_episodio"], ramos_fim=y["ramos"], elim=y["eliminados"], podas=y["podados"],
                inc_ep=y["incidencias_por_episodio"], insumo=y["insumo_pcrt_por_episodio"], chegadas=y["eventos_por_episodio"],
                som=som, sil=sil, ramos_upro=ramos_upro, por_uint=por_uint, compart=compart, disp=sum(y["disparos_por_uint"]))

if __name__ == "__main__":
    for v in V: fib.rodar("I0", "grave", 1, dur=200.0, CUR=True, **NOVO, **V[v])
    R = Pool(2).map(job, [(v, f, s) for v in V for f in ("grave", "agudo") for s in SEM])
    a = R[0]["alc"]; out = ["ALCANCE (dado, semente 371): fibras de cada lado que cada Uint alcança: " +
                            "; ".join(f"Uint {k}: A{int(a[:8, k].sum())}/B{int(a[8:, k].sum())}" for k in range(8)),
                            "Uints alcançadas por fibra (semente 371): " + " ".join(str(int(a[b].sum())) for b in range(16))]
    for v in V:
        for f in ("grave", "agudo"):
            r = [x for x in R if x["v"] == v and x["f"] == f]; md = lambda L: st.median(L)
            pu = [q for x in r for q in x["por_uint"]]
            out.append(f"\n== {v} | {f} ==")
            out.append(f"incidências por episódio (todas as 16 fibras): {md([x['inc_ep'][0] for x in r]):.0f}; com som (10 s): {md([x['som'] for x in r]):.0f}"
                       f" = {md([x['som'] for x in r]) / 16 / 10:.0f}/s por fibra; no silêncio (2 s): {md([x['sil'] for x in r]):.0f} = {md([x['sil'] for x in r]) / 16 / 2:.0f}/s por fibra")
            out.append(f"chegadas a ramos por episódio: " + " ".join(f"{md([x['chegadas'][e] for x in r]):.0f}" for e in range(5)))
            out.append(f"incidências sem integração (insumo da Pcrt), por episódio: " + " ".join(f"{md([x['insumo'][e] for x in r]):.0f}" for e in range(5)))
            out.append(f"Upros: iniciais 96 (6 por fibra); novas criadas pela Pcrt {md([x['upros_novas'] for x in r]):.0f} (mín {min(x['upros_novas'] for x in r)}, máx {max(x['upros_novas'] for x in r)}); vivas no fim {md([x['upros_vivas'] for x in r]):.0f}")
            out.append(f"ramos vivos ao fim de cada episódio: " + " ".join(f"{md([x['ramos_ep'][e] for x in r]):.0f}" for e in range(5)) +
                       f" | eliminados por não participar {md([x['elim'] for x in r]):.0f} | podados por não acertar {md([x['podas'] for x in r]):.0f}")
            out.append(f"ramos por Upro viva (mediana; mín-máx): {md([q for x in r for q in x['ramos_upro']]):.0f} ({min(q for x in r for q in x['ramos_upro'])}-{max(q for x in r for q in x['ramos_upro'])})")
            out.append(f"por lado de Uint: ramos {md([q[0] for q in pu]):.0f} | força somada {md([q[1] for q in pu]):.2f} | maior ramo / soma {md([q[2] for q in pu]):.2f}"
                       f" | ramos com ≥ metade do maior {md([q[3] for q in pu]):.0f}")
            out.append(f"maior número de lados de Uint em que a MESMA Upro tem o ramo mais forte (mediana entre sementes): {md([x['compart'] for x in r]):.0f}")
            out.append(f"disparos (5 episódios, 8 Uints): {md([x['disp'] for x in r]):.0f}")
    open("diagnostico-malha-saida.txt", "w").write("\n".join(out) + "\n"); print("\n".join(out))
