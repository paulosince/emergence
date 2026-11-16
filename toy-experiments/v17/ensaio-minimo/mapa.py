"""Mapa de sensibilidade do par de vias (controle de engenharia). Faixas e classificação em mapa-faixas.md,
registradas antes da execução. Uso: python3 -I mapa.py  (gera mapa-saida.csv)
Mesma dinâmica da rodada 3 (par_de_vias_v3.py), parametrizada."""
import csv, itertools, sys
import numpy as np
from multiprocessing import Pool

W, TAU, FAV, LIM, INH, TOTAL = 0.21, 0.30, 0.3, 1.5, -0.5, 1.0
DMIN, DMAX, NINI, PASSO, DEDUP, NQUASE = 0.5, 20.0, 6, 0.10, 0.02, 5
EST_SEP, EST_F, SOME = 120_000.0, 0.5, 600_000.0
DELTA, JIT = 0.458, 0.02
DUR, CICLO, NEP = 10_000.0, 180_000.0, 5

class Upro:
    def __init__(s, f0):
        s.d = [DMIN * (DMAX / DMIN) ** (k / (NINI - 1)) for k in range(NINI)]
        n = NINI; s.f = [f0] * n; s.first = [None] * n; s.last = [None] * n; s.nasc = [0.0] * n; s.est = [False] * n
    def marcar(s, i, t):
        if s.first[i] is None: s.first[i] = t
        s.last[i] = t
        if not s.est[i] and t - s.first[i] >= EST_SEP and s.f[i] >= EST_F: s.est[i] = True
    def conservar(s, prot):
        tot = sum(s.f)
        if tot <= TOTAL: return
        livre = sum(f for i, f in enumerate(s.f) if i not in prot)
        if livre > 0:
            k = max(0.0, (livre - (tot - TOTAL)) / livre)
            s.f = [f if i in prot else f * k for i, f in enumerate(s.f)]
    def brotar(s, i, t, f0):
        novos = []
        for nd in (s.d[i] * (1 + PASSO), s.d[i] * (1 - PASSO)):
            if DMIN <= nd <= DMAX and all(abs(x - nd) > DEDUP * nd for x in s.d):
                s.d.append(nd); s.f.append(f0); s.first.append(None); s.last.append(None); s.nasc.append(t); s.est.append(False)
                novos.append(len(s.d) - 1)
        s.conservar(set(novos))
    def decair(s, dt, meia):
        k = 2 ** (-dt / meia); s.f = [f if s.est[i] else f * k for i, f in enumerate(s.f)]
    def podar(s, t):
        keep = [i for i in range(len(s.d)) if s.est[i] or (t - (s.last[i] if s.last[i] is not None else s.nasc[i])) < SOME]
        for nome in ("d", "f", "first", "last", "nasc", "est"):
            v = getattr(s, nome); setattr(s, nome, [v[i] for i in keep])

def trem(rng, cond, t0):
    if cond == "fixo":
        base = np.arange(0, DUR, 5.0)
    else:
        base = []; t = 0.0
        while t < DUR:
            p = rng.uniform(2.5, 8.0); base.extend(np.arange(t, min(t + 250.0, DUR), p)); t += 250.0
        base = np.array(base)
    return t0 + base + rng.normal(0, JIT, base.size), t0 + base + DELTA + rng.normal(0, JIT, base.size)

def rodar(args):
    cond, DF, modo, f0, meia, fbroto = args[:6]; semente = args[6] if len(args) > 6 else 1
    rng = np.random.default_rng(semente); A, B = Upro(f0), Upro(f0); quase = {}
    for ep in range(NEP):
        t0 = ep * CICLO
        if ep: A.decair(CICLO - DUR, meia); B.decair(CICLO - DUR, meia)
        tA, tB = trem(rng, cond, t0); n = tA.size
        cred = {}; disparos = 0; ultimo_fav = -1e18
        for idx, t in enumerate(tA):
            dtp = tA[idx] - tA[idx - 1] if idx else 0.0
            a = np.array(A.d); b = np.array(B.d); fa = np.array(A.f); fb = np.array(B.f)
            alvo = (t + a)[:, None] - b[None, :]
            k = np.clip(np.searchsorted(tB, alvo), 1, n - 1)
            kk = np.where(np.abs(tB[k] - alvo) < np.abs(tB[k - 1] - alvo), k, k - 1)
            gap = np.abs(tB[kk] - alvo)
            coinc = gap <= W; near = (gap > W) & (gap <= 3 * W)
            ma = np.arange(max(0, idx - 4), idx + 1)
            arr = np.concatenate([(tA[ma][:, None] + a[None, :]).ravel()])
            w = np.tile(fa, ma.size)
            lo, hi = np.searchsorted(tB, t - 21), np.searchsorted(tB, t + 21); mb = np.arange(lo, hi)
            arr = np.concatenate([arr, (tB[mb][:, None] + b[None, :]).ravel()]); w = np.concatenate([w, np.tile(fb, mb.size)])
            hit = np.zeros_like(coinc); ci, cj = np.nonzero(coinc); favT = []
            if ci.size:
                T = np.maximum(t + a[ci], tB[kk[ci, cj]] + b[cj]); dtx = T[:, None] - arr[None, :]
                exc = np.where((dtx >= 0) & (dtx <= 1.5), w * np.exp(-np.clip(dtx, 0, None) / TAU), 0).sum(1)
                dti = dtx - W
                inh = np.where((dti >= 0) & (dti <= 1.5), INH * w * np.exp(-np.clip(dti, 0, None) / TAU), 0).sum(1)
                V = exc + inh; ok = V >= FAV; hit[ci[ok], cj[ok]] = True
                if ok.any(): ultimo_fav = T[ok].max()
                disparos += bool((V >= LIM).any())
            hA = set(np.nonzero(hit.any(1))[0]); hB = set(np.nonzero(hit.any(0))[0])
            for U, hs, chegadas in ((A, hA, t + a), (B, hB, tB[min(idx, n - 1)] + b)):
                for i in range(len(U.d)):
                    if i in hs:
                        U.f[i] = min(TOTAL, U.f[i] + DF); U.marcar(i, t)
                    elif not U.est[i]:
                        if modo == "S":
                            dt_ = chegadas[i] - ultimo_fav
                            if W < dt_ <= 3 * W: U.f[i] = max(0.0, U.f[i] - 1.05 * DF)
                        else:
                            U.f[i] = max(0.0, U.f[i] - (0.05 if modo == "C1" else 0.154) * DF)
                U.conservar(hs); U.decair(dtp, meia)
            if ep == NEP - 1 and idx >= n - 200:
                for i, j in zip(*np.nonzero(hit)):
                    o = round(a[i] - b[j], 2); cred[o] = cred.get(o, 0) + 1
            for i, j in zip(*np.nonzero(near)):
                key = (round(a[i], 4), round(b[j], 4)); quase[key] = quase.get(key, 0) + 1
                if quase[key] >= NQUASE:
                    quase[key] = 0
                    if a[i] in A.d and A.f[A.d.index(a[i])] >= fbroto: A.brotar(A.d.index(a[i]), t, f0)
                    if b[j] in B.d and B.f[B.d.index(b[j])] >= fbroto: B.brotar(B.d.index(b[j]), t, f0)
            if len(A.d) + len(B.d) > 300: break           # explosão evidente: interrompe para poupar tempo
        tf = t0 + DUR; A.podar(tf); B.podar(tf)
    tot = sum(cred.values()); ver = sum(v for o, v in cred.items() if abs(o - DELTA) <= W) / tot if tot else 0.0
    topA = A.d[int(np.argmax(A.f))] if A.d else None; topB = B.d[int(np.argmax(B.f))] if B.d else None
    par_ok = topA is not None and topB is not None and abs(topA - topB - DELTA) <= W and max(A.f) > 0.05 and max(B.f) > 0.05
    nram = len(A.d) + len(B.d)
    if tot == 0: classe = "colapso"
    elif nram > 100 or len(cred) > 200: classe = "explosao"
    elif ver >= 0.6 and par_ok: classe = "selecao"
    else: classe = "difuso"
    return dict(semente=semente, cond=cond, DF=DF, modo=modo, f0=f0, meia_s=meia / 1000, fbroto=fbroto, classe=classe, ramos=nram,
                relacoes=len(cred), credito_verdadeiro=round(ver, 3), par_mais_forte_verdadeiro=par_ok,
                maxfA=round(max(A.f), 3) if A.f else 0, maxfB=round(max(B.f), 3) if B.f else 0, disparos_ultimo_ep=disparos)

if __name__ == "__main__":
    grade = []
    for cond, DF, modo, f0, meia in itertools.product(("fixo", "notas"), (0.0065, 0.02, 0.065), ("S", "C1", "C2"),
                                                      (0.10, 0.15), (30_000.0, 300_000.0)):
        for fbroto in (f0, 0.30):
            grade.append((cond, DF, modo, f0, meia, fbroto))
    with Pool(2) as pool, open("mapa-saida.csv", "w", newline="") as fh:
        wr = None
        for k, r in enumerate(pool.imap_unordered(rodar, grade)):
            if wr is None: wr = csv.DictWriter(fh, fieldnames=list(r)); wr.writeheader()
            wr.writerow(r); fh.flush(); print(f"{k+1}/{len(grade)} {r['cond']} DF={r['DF']} {r['modo']} f0={r['f0']} meia={r['meia_s']} broto={r['fbroto']}: {r['classe']}", flush=True)
