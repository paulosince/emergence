"""Motor rápido (numba) do par de vias — mesma dinâmica de inibicao.py / inibicao_fiel.py (referência em Python puro).
Engenharia, não ciência: nenhuma regra nova. Validado contra as execuções de referência por valida_motor_par.py.
Uso: importar `rodar_rapido(cfg)` com o Python do ambiente venv-nb (numba)."""
import numpy as np
from numba import njit

W, TAU, FAV, LIM, TOTAL = 0.21, 0.30, 0.3, 1.5, 1.0
DMIN, DMAX, NINI, PASSO, DEDUP, NQUASE = 0.5, 20.0, 6, 0.10, 0.02, 5
EST_SEP, EST_F, SOME = 120_000.0, 0.5, 600_000.0
DELTA, JIT = 0.458, 0.02
CICLO, NEP = 180_000.0, 5
HEXC = 5 * TAU
MAXR = 512

# ---------------- Upro como arrays ----------------
@njit(cache=True)
def _init(f0, d, f, first, last, nasc, est):
    for k in range(NINI):
        d[k] = DMIN * (DMAX / DMIN) ** (k / (NINI - 1)); f[k] = f0
        first[k] = np.nan; last[k] = np.nan; nasc[k] = 0.0; est[k] = False
    return NINI

@njit(cache=True)
def _marcar(i, t, f, first, last, est):
    if np.isnan(first[i]): first[i] = t
    last[i] = t
    if (not est[i]) and t - first[i] >= EST_SEP and f[i] >= EST_F: est[i] = True

@njit(cache=True)
def _conservar(n, f, prot):
    tot = 0.0
    for i in range(n): tot += f[i]
    if tot <= TOTAL: return
    livre = 0.0
    for i in range(n):
        if not prot[i]: livre += f[i]
    if livre > 0:
        k = max(0.0, (livre - (tot - TOTAL)) / livre)
        for i in range(n):
            if not prot[i]: f[i] = f[i] * k

@njit(cache=True)
def _brotar(i, t, f0, n, d, f, first, last, nasc, est, prot):
    for s in (1.0 + PASSO, 1.0 - PASSO):
        nd = d[i] * s
        if DMIN <= nd <= DMAX and n < MAXR:
            ok = True
            for x in range(n):
                if not (abs(d[x] - nd) > DEDUP * nd): ok = False; break
            if ok:
                d[n] = nd; f[n] = f0; first[n] = np.nan; last[n] = np.nan; nasc[n] = t; est[n] = False
                n += 1
    for x in range(n): prot[x] = False
    # novos = os que acabaram de entrar (nasc == t e sem first): marcados pela posição
    return n

@njit(cache=True)
def _decair(n, dt, meia, f, est):
    k = 2.0 ** (-dt / meia)
    for i in range(n):
        if not est[i]: f[i] = f[i] * k

@njit(cache=True)
def _podar(t, n, d, f, first, last, nasc, est):
    m = 0
    for i in range(n):
        ref = nasc[i] if np.isnan(last[i]) else last[i]
        if est[i] or (t - ref) < SOME:
            d[m] = d[i]; f[m] = f[i]; first[m] = first[i]; last[m] = last[i]; nasc[m] = nasc[i]; est[m] = est[i]; m += 1
    return m

@njit(cache=True)
def _achar(d, n, v):
    for x in range(n):
        if d[x] == v: return x
    return -1

@njit(cache=True)
def _estado(m, off0, tau0, off1, tau1):
    return off0 + m * (off1 - off0), tau0 + m * (tau1 - tau0)

@njit(cache=True)
def _V(T, t_a, a, fa, nA, tA, t_b, b, fb, nB, tB, razao, off, tau, H):
    exc = 0.0; inh = 0.0
    lo = T - 21.0 - H; hi = T + 1.0
    for src in range(2):
        tt = tA if src == 0 else tB
        dd = a if src == 0 else b
        ww = fa if src == 0 else fb
        nr = nA if src == 0 else nB
        k0 = np.searchsorted(tt, lo); k1 = np.searchsorted(tt, hi)
        for k in range(k0, k1):
            for r in range(nr):
                x = tt[k] + dd[r]
                dx = T - x
                if dx >= 0 and dx <= HEXC: exc += ww[r] * np.exp(-dx / TAU)
                if razao != 0.0:
                    di = T - (x + off)
                    if di >= 0 and di <= 5 * tau: inh += -razao * ww[r] * np.exp(-di / tau)
    return exc + inh

@njit(cache=True)
def _rodar(trensA, trensB, ini, fim, dur, DF, F0, MEIA, FBROTO, razao, off0, tau0, off1, tau1, mmodo, nmeio):
    dA = np.zeros(MAXR); fA = np.zeros(MAXR); firA = np.zeros(MAXR); lasA = np.zeros(MAXR); nasA = np.zeros(MAXR); estA = np.zeros(MAXR, np.bool_)
    dB = np.zeros(MAXR); fB = np.zeros(MAXR); firB = np.zeros(MAXR); lasB = np.zeros(MAXR); nasB = np.zeros(MAXR); estB = np.zeros(MAXR, np.bool_)
    nA = _init(F0, dA, fA, firA, lasA, nasA, estA); nB = _init(F0, dB, fB, firB, lasB, nasB, estB)
    protA = np.zeros(MAXR, np.bool_); protB = np.zeros(MAXR, np.bool_)
    qk1 = np.zeros(200000); qk2 = np.zeros(200000); qv = np.zeros(200000, np.int64); nq = 0
    ck = np.zeros(100000); cv = np.zeros(100000, np.int64); nc = 0
    tau_max = max(tau0, tau1) if razao != 0.0 else TAU
    H = max(HEXC, 5 * tau_max)
    nac = 0; disparos = 0
    for ep in range(NEP):
        t0 = ep * CICLO
        if ep:
            _decair(nA, CICLO - dur, MEIA, fA, estA); _decair(nB, CICLO - dur, MEIA, fB, estB)
        tA = trensA[ini[ep]:fim[ep]]; tB = trensB[ini[ep]:fim[ep]]; n = tA.size
        nc = 0; disparos = 0; ultimo_fav = -1e18
        for idx in range(n):
            t = tA[idx]
            dtp = tA[idx] - tA[idx - 1] if idx else 0.0
            a = dA[:nA].copy(); b = dB[:nB].copy(); fa = fA[:nA].copy(); fb = fB[:nB].copy()
            na = nA; nb = nB
            gapm = np.empty((na, nb)); kkm = np.empty((na, nb), np.int64)
            for i in range(na):
                for j in range(nb):
                    alvo = t + a[i] - b[j]
                    k = np.searchsorted(tB, alvo)
                    if k < 1: k = 1
                    if k > n - 1: k = n - 1
                    kk = k if abs(tB[k] - alvo) < abs(tB[k - 1] - alvo) else k - 1
                    kkm[i, j] = kk; gapm[i, j] = abs(tB[kk] - alvo)
            hit = np.zeros((na, nb), np.bool_)
            if mmodo == 0: m = 0.0
            elif mmodo == 1: m = 1.0
            else: m = 1.0 - 2.0 ** (-nac / nmeio)
            off, tau = _estado(m, off0, tau0, off1, tau1)
            algum_ok = False; maxT = -1e18; algum_lim = False
            for i in range(na):
                for j in range(nb):
                    if gapm[i, j] <= W:
                        T = max(t + a[i], tB[kkm[i, j]] + b[j])
                        V = _V(T, t, a, fa, na, tA, 0.0, b, fb, nb, tB, razao, off, tau, H)
                        if V >= FAV:
                            hit[i, j] = True; algum_ok = True
                            if T > maxT: maxT = T
                        if V >= LIM: algum_lim = True
            if algum_ok: ultimo_fav = maxT
            if algum_lim: disparos += 1
            hA = np.zeros(na, np.bool_); hB = np.zeros(nb, np.bool_); qualquer = False
            for i in range(na):
                for j in range(nb):
                    if hit[i, j]: hA[i] = True; hB[j] = True; qualquer = True
            if qualquer: nac += 1
            # A
            for i in range(nA):
                if hA[i]:
                    fA[i] = min(TOTAL, fA[i] + DF); _marcar(i, t, fA, firA, lasA, estA)
                elif not estA[i]:
                    dt_ = (t + a[i]) - ultimo_fav
                    if W < dt_ <= 3 * W: fA[i] = max(0.0, fA[i] - 1.05 * DF)
            for i in range(nA): protA[i] = hA[i]
            _conservar(nA, fA, protA); _decair(nA, dtp, MEIA, fA, estA)
            # B
            tbi = tB[min(idx, n - 1)]
            for j in range(nB):
                if hB[j]:
                    fB[j] = min(TOTAL, fB[j] + DF); _marcar(j, t, fB, firB, lasB, estB)
                elif not estB[j]:
                    dt_ = (tbi + b[j]) - ultimo_fav
                    if W < dt_ <= 3 * W: fB[j] = max(0.0, fB[j] - 1.05 * DF)
            for j in range(nB): protB[j] = hB[j]
            _conservar(nB, fB, protB); _decair(nB, dtp, MEIA, fB, estB)
            # crédito
            if ep == NEP - 1 and idx >= n - 200:
                for i in range(na):
                    for j in range(nb):
                        if hit[i, j]:
                            o = np.round(a[i] - b[j], 2); pos = -1
                            for c in range(nc):
                                if ck[c] == o: pos = c; break
                            if pos < 0: ck[nc] = o; cv[nc] = 1; nc += 1
                            else: cv[pos] += 1
            # quase-acertos
            for i in range(na):
                for j in range(nb):
                    g = gapm[i, j]
                    if g > W and g <= 3 * W:
                        k1 = np.round(a[i], 4); k2 = np.round(b[j], 4); pos = -1
                        for q in range(nq):
                            if qk1[q] == k1 and qk2[q] == k2: pos = q; break
                        if pos < 0: qk1[nq] = k1; qk2[nq] = k2; qv[nq] = 1; pos = nq; nq += 1
                        else: qv[pos] += 1
                        if qv[pos] >= NQUASE:
                            qv[pos] = 0
                            ia = _achar(dA, nA, a[i])
                            if ia >= 0 and fA[ia] >= FBROTO:
                                n0 = nA; nA = _brotar(ia, t, F0, nA, dA, fA, firA, lasA, nasA, estA, protA)
                                for x in range(nA): protA[x] = x >= n0
                                _conservar(nA, fA, protA)
                            ib = _achar(dB, nB, b[j])
                            if ib >= 0 and fB[ib] >= FBROTO:
                                n0 = nB; nB = _brotar(ib, t, F0, nB, dB, fB, firB, lasB, nasB, estB, protB)
                                for x in range(nB): protB[x] = x >= n0
                                _conservar(nB, fB, protB)
            if nA + nB > 300: break
        tf = t0 + dur
        nA = _podar(tf, nA, dA, fA, firA, lasA, nasA, estA); nB = _podar(tf, nB, dB, fB, firB, lasB, nasB, estB)
    return dA[:nA].copy(), fA[:nA].copy(), dB[:nB].copy(), fB[:nB].copy(), ck[:nc].copy(), cv[:nc].copy(), disparos, nac

# ---------------- trens (idênticos a mapa.trem / inibicao.trem) ----------------
FAIXA = {"grave": (2.5, 8.0), "agudo": (0.6, 0.9)}

def trens(semente, faixa, dur, cond_fixo=False):
    rng = np.random.default_rng(semente); TA, TB, ini, fim = [], [], [], []; pos = 0
    for ep in range(NEP):
        t0 = ep * CICLO
        if cond_fixo:
            base = np.arange(0, dur, 5.0)
        else:
            lo, hi = FAIXA[faixa]; base = []; t = 0.0
            while t < dur:
                p = rng.uniform(lo, hi); base.extend(np.arange(t, min(t + 250.0, dur), p)); t += 250.0
            base = np.array(base)
        a = t0 + base + rng.normal(0, JIT, base.size); b = t0 + base + DELTA + rng.normal(0, JIT, base.size)
        TA.append(a); TB.append(b); ini.append(pos); pos += a.size; fim.append(pos)
    return np.concatenate(TA), np.concatenate(TB), np.array(ini), np.array(fim)

INIB = {  # nome: (razão, off0, tau0, off1, tau1, modo de maturidade)
    "I0": (0.0, 0.0, TAU, 0.0, TAU, 0),
    "I1": (0.5, W, 0.30, W, 0.30, 0),
    "I2": (0.5, -0.3, 0.30, -0.3, 0.30, 0),
    "I3": (0.5, -0.3, 1.5, -0.3, 1.5, 0),
    "F": (0.77, 2.7, 4.0, -0.3, 1.5, 2),
    "F-imatura": (0.77, 2.7, 4.0, -0.3, 1.5, 0),
    "F-madura": (0.77, 2.7, 4.0, -0.3, 1.5, 1),
}

def rodar_rapido(cond, faixa, semente, dur=10_000.0, DF=0.0065, F0=0.15, MEIA=300_000.0, FBROTO=0.30, nmeio=100.0, cond_fixo=False):
    tA, tB, ini, fim = trens(semente, faixa, dur, cond_fixo)
    razao, o0, t0_, o1, t1_, mm = INIB[cond]
    dA, fA, dB, fB, ck, cv, disparos, nac = _rodar(tA, tB, ini, fim, dur, DF, F0, MEIA, FBROTO, razao, o0, t0_, o1, t1_, mm, nmeio)
    cred = {float(o): int(v) for o, v in zip(ck, cv)}
    tot = sum(cred.values()); ver = sum(v for o, v in cred.items() if abs(o - DELTA) <= W) / tot if tot else 0.0
    perto = [(abs(o - DELTA), v) for o, v in cred.items() if abs(o - DELTA) <= W]
    if perto:
        x = np.array([p for p, _ in perto]); q = np.array([v for _, v in perto], float)
        mu = (x * q).sum() / q.sum(); disp = float(np.sqrt(((x - mu) ** 2 * q).sum() / q.sum()))
    else:
        disp = None
    topA = dA[int(np.argmax(fA))] if dA.size else None; topB = dB[int(np.argmax(fB))] if dB.size else None
    par_ok = topA is not None and topB is not None and abs(topA - topB - DELTA) <= W and fA.max() > 0.05 and fB.max() > 0.05
    nram = dA.size + dB.size
    if tot == 0: classe = "colapso"
    elif nram > 100 or len(cred) > 200: classe = "explosao"
    elif ver >= 0.6 and par_ok: classe = "selecao"
    else: classe = "difuso"
    return dict(cond=cond, faixa=faixa, semente=semente, classe=classe, ramos=nram, relacoes=len(cred),
                credito_verdadeiro=round(ver, 3), dispersao_ms=None if disp is None else round(disp, 4),
                par_mais_forte_verdadeiro=bool(par_ok), maxfA=round(float(fA.max()), 3) if fA.size else 0,
                maxfB=round(float(fB.max()), 3) if fB.size else 0, disparos_ultimo_ep=int(disparos), acertos=int(nac))
