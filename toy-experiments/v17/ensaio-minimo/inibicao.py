"""Ensaio da inibição pré-alimentada (registro prévio em inibicao-prealimentada.md, aprovado em 16/11/2026).
Mesma dinâmica de mapa.py (conjunto da D25), com:
  - quatro condições de inibição (I0 nenhuma; I1 uma janela depois, 0,30 ms; I2 0,3 ms antes, 0,30 ms; I3 0,3 ms antes, 1,5 ms);
  - duas faixas de período (grave 2,5–8 ms; agudo 0,6–0,9 ms);
  - chegadas escolhidas por tempo (não pelas 5 últimas), com limite de soma de 5 constantes da inibição;
  - medida nova: dispersão dos acertos em torno de Δ.
Uso: python3 -I inibicao.py [DUR_ms]   (gera inibicao-saida.csv)"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
from multiprocessing import Pool
from mapa import Upro, W, TAU, FAV, LIM, TOTAL, NQUASE, DELTA, JIT, CICLO, NEP

INH = -0.5
DF, MODO, F0, MEIA, FBROTO = 0.0065, "S", 0.15, 300_000.0, 0.30   # conjunto da D25
COND = {  # nome: (deslocamento da inibição em relação à chegada, constante da inibição)
    "I0": None,
    "I1": (+W, 0.30),
    "I2": (-0.3, 0.30),
    "I3": (-0.3, 1.5),
}
FAIXA = {"grave": (2.5, 8.0), "agudo": (0.6, 0.9)}
HEXC = 5 * TAU          # limite de soma da excitação (1,5 ms, como antes)

def inibicao(T, arr, w, cond):
    """Soma inibitória em cada instante T (vetor) de chegadas arr com pesos w. Cada chegada traz a sua inibição
    no instante arr + deslocamento, decaindo com a constante da condição; nenhum efeito antes dela nem após 5 constantes."""
    c = COND[cond]
    if c is None:
        return np.zeros(len(T))
    off, tau = c
    d = np.asarray(T)[:, None] - (np.asarray(arr)[None, :] + off)
    return np.where((d >= 0) & (d <= 5 * tau), INH * np.asarray(w)[None, :] * np.exp(-np.clip(d, 0, None) / tau), 0).sum(1)

def excitacao(T, arr, w):
    d = np.asarray(T)[:, None] - np.asarray(arr)[None, :]
    return np.where((d >= 0) & (d <= HEXC), np.asarray(w)[None, :] * np.exp(-np.clip(d, 0, None) / TAU), 0).sum(1)

def trem(rng, faixa, t0, dur):
    lo, hi = FAIXA[faixa]; base = []; t = 0.0
    while t < dur:
        p = rng.uniform(lo, hi); base.extend(np.arange(t, min(t + 250.0, dur), p)); t += 250.0
    base = np.array(base)
    return t0 + base + rng.normal(0, JIT, base.size), t0 + base + DELTA + rng.normal(0, JIT, base.size)

def rodar(args):
    cond, faixa, semente, dur = args
    rng = np.random.default_rng(semente); A, B = Upro(F0), Upro(F0); quase = {}
    c = COND[cond]; H = max(HEXC, 5 * c[1]) if c else HEXC
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
                V = excitacao(T, arr, w) + inibicao(T, arr, w, cond)
                ok = V >= FAV; hit[ci[ok], cj[ok]] = True
                if ok.any(): ultimo_fav = T[ok].max()
                disparos += bool((V >= LIM).any())
            hA = set(np.nonzero(hit.any(1))[0]); hB = set(np.nonzero(hit.any(0))[0])
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
    return dict(cond=cond, faixa=faixa, semente=semente, dur_ms=dur, classe=classe, ramos=nram, relacoes=len(cred),
                credito_verdadeiro=round(ver, 3), dispersao_ms=None if disp is None else round(disp, 4),
                par_mais_forte_verdadeiro=par_ok, maxfA=round(max(A.f), 3) if A.f else 0,
                maxfB=round(max(B.f), 3) if B.f else 0, disparos_ultimo_ep=disparos)

if __name__ == "__main__":
    dur = float(sys.argv[1]) if len(sys.argv) > 1 else 10_000.0
    grade = [(c, f, s, dur) for f in ("grave", "agudo") for c in ("I0", "I1", "I2", "I3") for s in range(1, 11)]
    with Pool(2) as pool, open("inibicao-saida.csv", "w", newline="") as fh:
        wr = None
        for k, r in enumerate(pool.imap_unordered(rodar, grade)):
            if wr is None: wr = csv.DictWriter(fh, fieldnames=list(r)); wr.writeheader()
            wr.writerow(r); fh.flush()
            print(f"{k+1}/{len(grade)} {r['faixa']} {r['cond']} semente={r['semente']}: {r['classe']} cred={r['credito_verdadeiro']} disp={r['dispersao_ms']} tiros={r['disparos_ultimo_ep']}", flush=True)
