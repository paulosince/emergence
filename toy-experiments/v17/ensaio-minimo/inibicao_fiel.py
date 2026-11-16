"""Ensaio da inibição pré-alimentada fiel (registro prévio em inibicao-fiel.md, aprovado em 16/11/2026).
Mesma dinâmica de inibicao.py (grave), com inibição que amadurece com os acertos da Uint.
Uso: python3 -I inibicao_fiel.py   (gera inibicao-fiel-saida.csv)"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from multiprocessing import Pool
from mapa import Upro, W, TAU, FAV, LIM, TOTAL, NQUASE, DELTA, JIT, CICLO, NEP
from inibicao import excitacao, trem, HEXC, DF, MODO, F0, MEIA, FBROTO

RAZAO = 0.77                       # inibição = 0,77 da excitação que a recruta (E:I = 1,3)
OFF_IMAT, TAU_IMAT = 2.7, 4.0      # imatura: 2,7 ms depois, decaimento 4 ms
OFF_MAD, TAU_MAD = -0.3, 1.5       # madura: 0,3 ms antes, decaimento 1,5 ms
N_MEIO = 100.0                     # metade do caminho com 100 acertos

def maturidade(cond, n):
    if cond == "F-imatura": return 0.0
    if cond == "F-madura": return 1.0
    return 1.0 - 2.0 ** (-n / N_MEIO)

def estado(m):
    return OFF_IMAT + m * (OFF_MAD - OFF_IMAT), TAU_IMAT + m * (TAU_MAD - TAU_IMAT)

def inib_fiel(T, arr, w, m):
    off, tau = estado(m)
    d = np.asarray(T)[:, None] - (np.asarray(arr)[None, :] + off)
    return np.where((d >= 0) & (d <= 5 * tau), -RAZAO * np.asarray(w)[None, :] * np.exp(-np.clip(d, 0, None) / tau), 0).sum(1)

def rodar(args):
    cond, semente, dur = args; faixa = "grave"
    rng = np.random.default_rng(semente); A, B = Upro(F0), Upro(F0); quase = {}
    H = max(HEXC, 5 * TAU_IMAT); nac = 0
    for ep in range(NEP):
        t0 = ep * CICLO
        if ep: A.decair(CICLO - dur, MEIA); B.decair(CICLO - dur, MEIA)
        tA, tB = trem(rng, faixa, t0, dur); n = tA.size
        cred = {}; disparos = 0; ultimo_fav = -1e18
        for idx, t in enumerate(tA):
            dtp = tA[idx] - tA[idx - 1] if idx else 0.0
            a = np.array(A.d); b = np.array(B.d); fa = np.array(A.f); fb = np.array(B.f)
            alvo = (t + a)[:, None] - b[None, :]
            k = np.clip(np.searchsorted(tB, alvo), 1, n - 1)
            kk = np.where(np.abs(tB[k] - alvo) < np.abs(tB[k - 1] - alvo), k, k - 1)
            gap = np.abs(tB[kk] - alvo)
            coinc = gap <= W; near = (gap > W) & (gap <= 3 * W)
            hit = np.zeros_like(coinc); ci, cj = np.nonzero(coinc)
            if ci.size:
                T = np.maximum(t + a[ci], tB[kk[ci, cj]] + b[cj])
                lo_t, hi_t = T.min() - 21.0 - H, T.max() + 1.0           # chegadas escolhidas por tempo
                ma = np.arange(np.searchsorted(tA, lo_t), np.searchsorted(tA, hi_t))
                mb = np.arange(np.searchsorted(tB, lo_t), np.searchsorted(tB, hi_t))
                arr = np.concatenate([(tA[ma][:, None] + a[None, :]).ravel(), (tB[mb][:, None] + b[None, :]).ravel()])
                w = np.concatenate([np.tile(fa, ma.size), np.tile(fb, mb.size)])
                sel = (arr >= lo_t + 21.0 - 0.5) & (arr <= hi_t + 0.5)   # só o que pode atuar em algum T
                arr, w = arr[sel], w[sel]
                m = maturidade(cond, nac); V = excitacao(T, arr, w) + inib_fiel(T, arr, w, m)
                ok = V >= FAV; hit[ci[ok], cj[ok]] = True
                if ok.any(): ultimo_fav = T[ok].max()
                disparos += bool((V >= LIM).any())
            hA = set(np.nonzero(hit.any(1))[0]); hB = set(np.nonzero(hit.any(0))[0])
            if hit.any(): nac += 1
            for U, hs, chegadas in ((A, hA, t + a), (B, hB, tB[min(idx, n - 1)] + b)):
                for i in range(len(U.d)):
                    if i in hs:
                        U.f[i] = min(TOTAL, U.f[i] + DF); U.marcar(i, t)
                    elif not U.est[i]:
                        dt_ = chegadas[i] - ultimo_fav
                        if W < dt_ <= 3 * W: U.f[i] = max(0.0, U.f[i] - 1.05 * DF)
                U.conservar(hs); U.decair(dtp, MEIA)
            if ep == NEP - 1 and idx >= n - 200:
                for i, j in zip(*np.nonzero(hit)):
                    o = round(a[i] - b[j], 2); cred[o] = cred.get(o, 0) + 1
            for i, j in zip(*np.nonzero(near)):
                key = (round(a[i], 4), round(b[j], 4)); quase[key] = quase.get(key, 0) + 1
                if quase[key] >= NQUASE:
                    quase[key] = 0
                    if a[i] in A.d and A.f[A.d.index(a[i])] >= FBROTO: A.brotar(A.d.index(a[i]), t, F0)
                    if b[j] in B.d and B.f[B.d.index(b[j])] >= FBROTO: B.brotar(B.d.index(b[j]), t, F0)
            if len(A.d) + len(B.d) > 300: break
        tf = t0 + dur; A.podar(tf); B.podar(tf)
    tot = sum(cred.values()); ver = sum(v for o, v in cred.items() if abs(o - DELTA) <= W) / tot if tot else 0.0
    perto = [(abs(o - DELTA), v) for o, v in cred.items() if abs(o - DELTA) <= W]
    if perto:
        x = np.array([p for p, _ in perto]); q = np.array([v for _, v in perto], float)
        m = (x * q).sum() / q.sum(); disp = float(np.sqrt(((x - m) ** 2 * q).sum() / q.sum()))
    else:
        disp = None
    topA = A.d[int(np.argmax(A.f))] if A.d else None; topB = B.d[int(np.argmax(B.f))] if B.d else None
    par_ok = topA is not None and topB is not None and abs(topA - topB - DELTA) <= W and max(A.f) > 0.05 and max(B.f) > 0.05
    nram = len(A.d) + len(B.d)
    if tot == 0: classe = "colapso"
    elif nram > 100 or len(cred) > 200: classe = "explosao"
    elif ver >= 0.6 and par_ok: classe = "selecao"
    else: classe = "difuso"
    mf = maturidade(cond, nac); off, tau = estado(mf)
    return dict(cond=cond, faixa=faixa, acertos=nac, maturidade=round(mf, 3), atraso_inib_ms=round(off, 3), decaimento_inib_ms=round(tau, 3), semente=semente, dur_ms=dur, classe=classe, ramos=nram, relacoes=len(cred),
                credito_verdadeiro=round(ver, 3), dispersao_ms=None if disp is None else round(disp, 4),
                par_mais_forte_verdadeiro=par_ok, maxfA=round(max(A.f), 3) if A.f else 0,
                maxfB=round(max(B.f), 3) if B.f else 0, disparos_ultimo_ep=disparos)

if __name__ == "__main__":
    grade = [(c, s, 10_000.0) for c in ("F", "F-imatura", "F-madura") for s in range(1, 11)]
    with Pool(2) as pool, open("inibicao-fiel-saida.csv", "w", newline="") as fh:
        wr = None
        for k, r in enumerate(pool.imap_unordered(rodar, grade)):
            if wr is None: wr = csv.DictWriter(fh, fieldnames=list(r)); wr.writeheader()
            wr.writerow(r); fh.flush()
            print(f"{k+1}/{len(grade)} {r['cond']} semente={r['semente']}: {r['classe']} cred={r['credito_verdadeiro']} disp={r['dispersao_ms']} m={r['maturidade']} acertos={r['acertos']}", flush=True)
