"""Motor por eventos do par de vias — Pcrt restrita às incidências (registro prévio: pcrt-incidencias.md, aprovado em 17/11/2026).

Separação (decisões do responsável, 17/11/2026):
  * Dinâmica do Sdom: cada incidência desce por cada ramo da sua Upro e vira uma chegada na Uint
    (instante + atraso do ramo, peso = força atual do ramo). A Uint mantém a excitação e a inibição
    como somas que decaem continuamente (exponencial exata, sem corte em 5 constantes de tempo).
    Acerto: na chegada, há chegada da outra Upro a no máximo uma janela (W) antes e a soma >= favorecimento.
    Disparo (integração): soma >= limiar. A incidência é integrada se uma chegada dela participou de um disparo.
  * Quase-acerto: a soma fica em [q * limiar, limiar) sem disparar. Avaliado pela própria Uint.
    Cada ramo que contribuiu: se ele ou um vizinho da mesma Upro (|atraso - atraso'| <= VIZ) acertou há
    menos de JAN ms, conta um quase-acerto (5 contagens e força >= portão => brota); se não (isolado),
    perde 1,05 x ganho no subteste com enfraquecimento.
  * Pcrt: recebe as incidências sem integração. No par de vias a estrutura (1 Uint, 6+6 ramos) já é dada,
    então aqui a Pcrt só é contada (insumo), sem constituir nada.
Iguais ao motor antigo: força inicial, ganho, meia-vida, conservação da força total, estabilização,
poda, enfraquecimento por sincronia, inibição I0/I1, trens de pulsos, crédito e classes.
Engenharia (não regra): contagem de disparos com intervalo mínimo de W entre disparos contados."""
import numpy as np
from numba import njit

W, TAU, FAV, LIM, TOTAL = 0.21, 0.30, 0.3, 1.5, 1.0
DMIN, DMAX, NINI, PASSO, DEDUP, NQUASE = 0.5, 20.0, 6, 0.10, 0.02, 5
EST_SEP, EST_F, SOME = 120_000.0, 0.5, 600_000.0
DELTA, JIT = 0.458, 0.02
CICLO, NEP = 180_000.0, 5
HEXC = 5 * TAU
MAXR = 512
HCAP = 1 << 19
BCAP = 1 << 14


# ---------------- heap de eventos (tempo, tipo, fonte, ramo, incidência, peso) ----------------
@njit(cache=True)
def _push(n, ht, hk, hs, hr, hi, hw, t, k, s, r, i, w):
    j = n
    ht[j] = t; hk[j] = k; hs[j] = s; hr[j] = r; hi[j] = i; hw[j] = w
    while j > 0:
        p = (j - 1) >> 1
        if ht[p] <= ht[j]: break
        ht[p], ht[j] = ht[j], ht[p]; hk[p], hk[j] = hk[j], hk[p]; hs[p], hs[j] = hs[j], hs[p]
        hr[p], hr[j] = hr[j], hr[p]; hi[p], hi[j] = hi[j], hi[p]; hw[p], hw[j] = hw[j], hw[p]
        j = p
    return n + 1


@njit(cache=True)
def _pop(n, ht, hk, hs, hr, hi, hw):
    t = ht[0]; k = hk[0]; s = hs[0]; r = hr[0]; i = hi[0]; w = hw[0]
    n -= 1
    ht[0] = ht[n]; hk[0] = hk[n]; hs[0] = hs[n]; hr[0] = hr[n]; hi[0] = hi[n]; hw[0] = hw[n]
    j = 0
    while True:
        a = 2 * j + 1; b = a + 1; m = j
        if a < n and ht[a] < ht[m]: m = a
        if b < n and ht[b] < ht[m]: m = b
        if m == j: break
        ht[m], ht[j] = ht[j], ht[m]; hk[m], hk[j] = hk[j], hk[m]; hs[m], hs[j] = hs[j], hs[m]
        hr[m], hr[j] = hr[j], hr[m]; hi[m], hi[j] = hi[j], hi[m]; hw[m], hw[j] = hw[j], hw[m]
        j = m
    return n, t, k, s, r, i, w


# ---------------- ramos ----------------
@njit(cache=True)
def _init(f0, d, f, first, last, nasc, est):
    for k in range(NINI):
        d[k] = DMIN * (DMAX / DMIN) ** (k / (NINI - 1)); f[k] = f0
        first[k] = np.nan; last[k] = np.nan; nasc[k] = 0.0; est[k] = False
    return NINI


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
def _brotar(i, t, f0, n, d, f, first, last, nasc, est):
    for s in (1.0 + PASSO, 1.0 - PASSO):
        nd = d[i] * s
        if DMIN <= nd <= DMAX and n < MAXR:
            ok = True
            for x in range(n):
                if not (abs(d[x] - nd) > DEDUP * nd): ok = False; break
            if ok:
                d[n] = nd; f[n] = f0; first[n] = np.nan; last[n] = np.nan; nasc[n] = t; est[n] = False
                n += 1
    return n


@njit(cache=True)
def _podar(t, n, d, f, first, last, nasc, est, q):
    m = 0
    for i in range(n):
        ref = nasc[i] if np.isnan(last[i]) else last[i]
        if est[i] or (t - ref) < SOME:
            d[m] = d[i]; f[m] = f[i]; first[m] = first[i]; last[m] = last[i]; nasc[m] = nasc[i]; est[m] = est[i]; q[m] = q[i]; m += 1
    return m


@njit(cache=True)
def _recente(src, r, T, JAN, VIZ, dA, nA, lasA, dB, nB, lasB):
    d = dA if src == 0 else dB
    las = lasA if src == 0 else lasB
    nn = nA if src == 0 else nB
    for x in range(nn):
        if abs(d[x] - d[r]) <= VIZ and (not np.isnan(las[x])) and T - las[x] <= JAN:
            return True
    return False


# ---------------- execução ----------------
@njit(cache=True)
def _rodar(trensA, trensB, ini, fim, dur, DF, F0, MEIA, FBROTO, razao, off, taui, Q, JAN, VIZ, ENFQ, BROTO):
    D = np.zeros((2, MAXR)); Fo = np.zeros((2, MAXR)); FI = np.full((2, MAXR), np.nan); LA = np.full((2, MAXR), np.nan)
    NA = np.zeros((2, MAXR)); ES = np.zeros((2, MAXR), np.bool_); QC = np.zeros((2, MAXR), np.int64)
    prot = np.zeros(MAXR, np.bool_)
    nr = np.zeros(2, np.int64)
    for s in range(2):
        nr[s] = _init(F0, D[s], Fo[s], FI[s], LA[s], NA[s], ES[s])
    ht = np.zeros(HCAP); hk = np.zeros(HCAP, np.int64); hs = np.zeros(HCAP, np.int64); hr = np.zeros(HCAP, np.int64)
    hi = np.zeros(HCAP, np.int64); hw = np.zeros(HCAP)
    bt = np.zeros(BCAP); bs = np.zeros(BCAP, np.int64); br = np.zeros(BCAP, np.int64); bi = np.zeros(BCAP, np.int64)
    bq = np.zeros(BCAP, np.bool_); bf = np.zeros(BCAP, np.bool_)
    ck = np.zeros(200000); cv = np.zeros(200000, np.int64)
    nA_tot = trensA.size
    integ = np.zeros(2 * nA_tot, np.bool_)                # incidência integrada (A: idx; B: nA_tot + idx)
    exc = 0.0; inh = 0.0; tlast = 0.0; tdec = 0.0
    ultimo_fav = -1e18; ultimo_disp = -1e18
    nac = 0; disparos = 0; estab = 0; quase_broto = 0; quase_iso = 0; brotos = 0
    insumo = np.zeros(NEP, np.int64); nc = 0; parou = False
    snD = np.zeros((NEP, 2, MAXR)); snF = np.zeros((NEP, 2, MAXR)); snN = np.zeros((NEP, 2), np.int64)
    bloq = 0   # quase-acerto com acerto recente e 5 contagens, mas força abaixo do portão (só medida)
    tcred = trensA[fim[NEP - 1] - 200] if fim[NEP - 1] - 200 >= ini[NEP - 1] else trensA[ini[NEP - 1]]
    for ep in range(NEP):
        nh = 0; b0 = 0; b1 = 0
        ia = ini[ep]; ib = ini[ep]; fa = fim[ep]
        ultimo_ep = ep == NEP - 1
        while True:
            # próxima incidência (A ou B) ou próximo evento do heap
            tia = trensA[ia] if ia < fa else 1e300
            tib = trensB[ib] if ib < fa else 1e300
            tinc = min(tia, tib)
            tev = ht[0] if nh > 0 else 1e300
            if tinc == 1e300 and tev == 1e300: break
            if tinc <= tev:
                s = 0 if tia <= tib else 1
                t = tia if s == 0 else tib
                idx = ia if s == 0 else ib
                if s == 0: ia += 1
                else: ib += 1
                if s == 0:   # decaimento dos instáveis, no ritmo das incidências de A (como no motor antigo)
                    k = 2.0 ** (-(t - tdec) / MEIA)
                    for z in range(2):
                        for x in range(nr[z]):
                            if not ES[z, x]: Fo[z, x] *= k
                    tdec = t
                gid = idx if s == 0 else nA_tot + idx
                for r in range(nr[s]):
                    w = Fo[s, r]
                    nh = _push(nh, ht, hk, hs, hr, hi, hw, t + D[s, r], 0, s, r, gid, w)
                    if razao != 0.0:
                        nh = _push(nh, ht, hk, hs, hr, hi, hw, t + D[s, r] + off, 1, s, r, gid, -razao * w)
                continue
            nh, T, kind, s, r, gid, w = _pop(nh, ht, hk, hs, hr, hi, hw)
            exc *= np.exp(-(T - tlast) / TAU)
            if razao != 0.0: inh *= np.exp(-(T - tlast) / taui)
            tlast = T
            if kind == 1:
                inh += w
                continue
            w = Fo[s, r]
            exc += w
            V = exc + inh
            # memória curta de chegadas (ordenada no tempo)
            while b0 < b1 and bt[b0 % BCAP] < T - HEXC: b0 += 1
            p = b1 % BCAP; bt[p] = T; bs[p] = s; br[p] = r; bi[p] = gid; bq[p] = False; bf[p] = False; b1 += 1
            if b1 - b0 >= BCAP: b0 = b1 - BCAP + 1
            # coincidência: chegada da outra Upro a no máximo W antes
            coinc = False
            j = b1 - 2
            while j >= b0 and bt[j % BCAP] >= T - W:
                if bs[j % BCAP] != s: coinc = True; break
                j -= 1
            acerto = coinc and V >= FAV
            if acerto:
                ultimo_fav = T; nac += 1
                for z in range(2):
                    for x in range(nr[z]): prot[x] = False
                # reforça o ramo que chegou e os da outra Upro dentro de W
                j = b1 - 1
                while j >= b0 and bt[j % BCAP] >= T - W:
                    q = j % BCAP
                    if (j == b1 - 1 or bs[q] != s) and not bf[q]:
                        bf[q] = True                                   # cada chegada reforça no máximo uma vez
                        zz = bs[q]; xx = br[q]
                        Fo[zz, xx] = min(TOTAL, Fo[zz, xx] + DF)
                        if np.isnan(FI[zz, xx]): FI[zz, xx] = T
                        LA[zz, xx] = T
                        if (not ES[zz, xx]) and T - FI[zz, xx] >= EST_SEP and Fo[zz, xx] >= EST_F:
                            ES[zz, xx] = True; estab += 1
                        if ultimo_ep and T >= tcred and bs[q] != s:
                            ra = r if s == 0 else xx
                            rb = xx if s == 0 else r
                            o = np.round(D[0, ra] - D[1, rb], 2); pos = -1
                            for c in range(nc):
                                if ck[c] == o: pos = c; break
                            if pos < 0 and nc < ck.size: ck[nc] = o; cv[nc] = 1; nc += 1
                            elif pos >= 0: cv[pos] += 1
                    j -= 1
                for z in range(2):
                    for x in range(nr[z]): prot[x] = False
                    j = b1 - 1
                    while j >= b0 and bt[j % BCAP] >= T - W:
                        q = j % BCAP
                        if bs[q] == z and (j == b1 - 1 or bs[q] != s): prot[br[q]] = True
                        j -= 1
                    _conservar(nr[z], Fo[z], prot)
            elif (not ES[s, r]) and W < T - ultimo_fav <= 3 * W:
                Fo[s, r] = max(0.0, Fo[s, r] - 1.05 * DF)      # enfraquecimento por sincronia
            if V >= LIM:
                if T - ultimo_disp > W:
                    if ultimo_ep: disparos += 1
                ultimo_disp = T
                j = b1 - 1
                while j >= b0:
                    integ[bi[j % BCAP]] = True; j -= 1
            elif BROTO and V >= Q * LIM:
                # quase-acerto: cada ramo que contribuiu (chegadas em HEXC ainda não usadas num quase-acerto)
                j = b1 - 1
                while j >= b0:
                    q = j % BCAP
                    if not bq[q]:
                        bq[q] = True
                        zz = bs[q]; xx = br[q]
                        if _recente(zz, xx, T, JAN, VIZ, D[0], nr[0], LA[0], D[1], nr[1], LA[1]):
                            quase_broto += 1
                            QC[zz, xx] += 1
                            if QC[zz, xx] >= NQUASE and Fo[zz, xx] < FBROTO: bloq += 1
                            if QC[zz, xx] >= NQUASE and Fo[zz, xx] >= FBROTO:
                                QC[zz, xx] = 0
                                n0 = nr[zz]
                                nr[zz] = _brotar(xx, T, F0, nr[zz], D[zz], Fo[zz], FI[zz], LA[zz], NA[zz], ES[zz])
                                brotos += nr[zz] - n0
                                for x in range(nr[zz]): prot[x] = x >= n0
                                _conservar(nr[zz], Fo[zz], prot)
                        else:
                            quase_iso += 1
                            if ENFQ and not ES[zz, xx]:
                                Fo[zz, xx] = max(0.0, Fo[zz, xx] - 1.05 * DF)
                    j -= 1
            if nr[0] + nr[1] > 300:
                parou = True; break
        # fim do episódio: insumo da Pcrt (incidências sem integração) e poda
        cont = 0
        for x in range(ini[ep], fim[ep]):
            if not integ[x]: cont += 1
            if not integ[nA_tot + x]: cont += 1
        insumo[ep] = cont
        for z in range(2):
            snN[ep, z] = nr[z]
            for x in range(nr[z]): snD[ep, z, x] = D[z, x]; snF[ep, z, x] = Fo[z, x]
        tf = ep * CICLO + dur
        for z in range(2):
            nr[z] = _podar(tf, nr[z], D[z], Fo[z], FI[z], LA[z], NA[z], ES[z], QC[z])
        exc = 0.0; inh = 0.0
        if parou: break
    return (D[0, :nr[0]].copy(), Fo[0, :nr[0]].copy(), D[1, :nr[1]].copy(), Fo[1, :nr[1]].copy(),
            ck[:nc].copy(), cv[:nc].copy(), disparos, nac, estab, quase_broto, quase_iso, brotos, insumo, parou, snD, snF, snN, bloq)


# ---------------- trens (idênticos a motor_par.trens / inibicao.trem) ----------------
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


INIB = {"I0": (0.0, 0.0, TAU), "I1": (0.5, W, 0.30)}


def rodar(cond, faixa, semente, Q=0.75, JAN=60_000.0, ENFQ=False, BROTO=True, VIZ=0.20,
          dur=10_000.0, DF=0.0065, F0=0.15, MEIA=300_000.0, FBROTO=0.30, cond_fixo=False, retratos=False):
    tA, tB, ini, fim = trens(semente, faixa, dur, cond_fixo)
    razao, off, taui = INIB[cond]
    (dA, fA, dB, fB, ck, cv, disparos, nac, estab, qb, qi, brotos, insumo, parou, snD, snF, snN, bloq) = _rodar(
        tA, tB, ini, fim, dur, DF, F0, MEIA, FBROTO, razao, off, taui, Q, JAN, VIZ, ENFQ, BROTO)
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
    elif parou or nram > 100 or len(cred) > 200: classe = "explosao"
    elif ver >= 0.6 and par_ok: classe = "selecao"
    else: classe = "difuso"
    return dict(cond=cond, faixa=faixa, semente=semente, fixo=cond_fixo, Q=Q, JAN=JAN, ENFQ=ENFQ, classe=classe,
                ramos=nram, relacoes=len(cred), credito_verdadeiro=round(ver, 3),
                dispersao_ms=None if disp is None else round(disp, 4), par_mais_forte_verdadeiro=bool(par_ok),
                maxfA=round(float(fA.max()), 3) if fA.size else 0, maxfB=round(float(fB.max()), 3) if fB.size else 0,
                disparos_ultimo_ep=int(disparos), acertos=int(nac), estabilizacoes=int(estab),
                quase_com_acerto_recente=int(qb), quase_isolados=int(qi), ramos_brotados=int(brotos),
                insumo_pcrt_por_episodio=[int(x) for x in insumo], interrompida_300=bool(parou),
                bloqueados_portao=int(bloq), **({"retratos": (snD, snF, snN)} if retratos else {}))
