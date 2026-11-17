"""Motor da estrutura fibra / Upro com várias cabeças / estoque na Uint (registro prévio: estrutura-ramos.md, aprovado em 17/11/2026).

Estrutura: cada fibra (A, B) tem Upros (atraso grande); cada Upro tem ramos, um por Uint de destino (forma principal: K Uints)
ou um só (subteste "uma Upro por Uint"); o ramo soma um atraso pequeno (dado, sorteado 0–0,2 ms) e tem a força.
Dinâmica por eventos, como motor_eventos.py, agora com K Uints. Competição: estoque por lado de cada Uint (soma <= 1,0).
Pcrt: Upro nova a ±10% do atraso grande de uma Upro cujo ramo teve quase-acerto perto de acerto recente (5 contagens, força >= portão).
Continua: quase-acerto >= Q x limiar sem disparar; integrada = fez a Uint disparar; inibição I1; decaimento; estabilização; poda."""
import numpy as np
from numba import njit
from motor_eventos import _push, _pop, trens, W, TAU, FAV, LIM, DMIN, DMAX, NINI, PASSO, NQUASE, EST_SEP, EST_F, SOME, DELTA, CICLO, NEP, HEXC

MAXU = 1024           # Upros por fibra (capacidade)
MAXRAM = 4096         # ramos (capacidade); limite de engenharia do registro: 2.000
LIMRAM = 2000
HCAP = 1 << 21
BCAP = 2048
DEDUPU = 0.02


@njit(cache=True)
def _nova_upro(s, d, kk, unica, F0, DMAXR, t, UD, UA, nU, R_s, R_u, R_k, R_d, R_f, R_fi, R_la, R_na, R_es, R_q, nR, K):
    """Cria uma Upro da fibra s com atraso d; ramos para todas as K Uints (ou só para kk, se unica)."""
    if not (DMIN <= d <= DMAX): return nR, False
    for u in range(nU[s]):
        if UA[s, u] and (unica == 0 or _upro_alvo(u, s, kk, R_s, R_u, R_k, nR)):
            if abs(UD[s, u] - d) <= DEDUPU * d: return nR, False
    if nU[s] >= MAXU: return nR, False
    u = nU[s]; UD[s, u] = d; UA[s, u] = True; nU[s] += 1
    k0 = kk if unica else 0; k1 = kk + 1 if unica else K
    for k in range(k0, k1):
        if nR >= MAXRAM: break
        R_s[nR] = s; R_u[nR] = u; R_k[nR] = k; R_d[nR] = np.random.uniform(0.0, DMAXR); R_f[nR] = F0
        R_fi[nR] = np.nan; R_la[nR] = np.nan; R_na[nR] = t; R_es[nR] = False; R_q[nR] = 0; nR += 1
    return nR, True


@njit(cache=True)
def _upro_alvo(u, s, kk, R_s, R_u, R_k, nR):
    for r in range(nR):
        if R_s[r] == s and R_u[r] == u and R_k[r] == kk: return True
    return False


@njit(cache=True)
def _conservar_lado(k, s, R_s, R_k, R_f, prot, nR, EST):
    tot = 0.0; livre = 0.0
    for r in range(nR):
        if R_k[r] == k and R_s[r] == s:
            tot += R_f[r]
            if not prot[r]: livre += R_f[r]
    if tot <= EST or livre <= 0: return
    f = max(0.0, (livre - (tot - EST)) / livre)
    for r in range(nR):
        if R_k[r] == k and R_s[r] == s and not prot[r]: R_f[r] *= f


@njit(cache=True)
def _rodar(trensA, trensB, ini, fim, dur, semente, K, unica, DF, F0, MEIA, FBROTO, razao, off, taui, Q, JAN, VIZ, EST, DMAXR):
    np.random.seed(semente)
    UD = np.zeros((2, MAXU)); UA = np.zeros((2, MAXU), np.bool_); nU = np.zeros(2, np.int64)
    R_s = np.zeros(MAXRAM, np.int64); R_u = np.zeros(MAXRAM, np.int64); R_k = np.zeros(MAXRAM, np.int64)
    R_d = np.zeros(MAXRAM); R_f = np.zeros(MAXRAM); R_fi = np.full(MAXRAM, np.nan); R_la = np.full(MAXRAM, np.nan)
    R_na = np.zeros(MAXRAM); R_es = np.zeros(MAXRAM, np.bool_); R_q = np.zeros(MAXRAM, np.int64)
    prot = np.zeros(MAXRAM, np.bool_)
    nR = 0
    for s in range(2):
        for i in range(NINI):
            d = DMIN * (DMAX / DMIN) ** (i / (NINI - 1))
            if unica:
                for k in range(K):
                    u = nU[s]; UD[s, u] = d; UA[s, u] = True; nU[s] += 1
                    R_s[nR] = s; R_u[nR] = u; R_k[nR] = k; R_d[nR] = np.random.uniform(0.0, DMAXR); R_f[nR] = F0
                    R_fi[nR] = np.nan; R_la[nR] = np.nan; R_na[nR] = 0.0; R_es[nR] = False; R_q[nR] = 0; nR += 1
            else:
                nR, _ = _nova_upro(s, d, 0, 0, F0, DMAXR, 0.0, UD, UA, nU, R_s, R_u, R_k, R_d, R_f, R_fi, R_la, R_na, R_es, R_q, nR, K)
    ht = np.zeros(HCAP); hk = np.zeros(HCAP, np.int64); hs = np.zeros(HCAP, np.int64); hr = np.zeros(HCAP, np.int64)
    hi = np.zeros(HCAP, np.int64); hw = np.zeros(HCAP)
    bt = np.zeros((K, BCAP)); bs = np.zeros((K, BCAP), np.int64); br = np.zeros((K, BCAP), np.int64); bi = np.zeros((K, BCAP), np.int64)
    bq = np.zeros((K, BCAP), np.bool_); bf = np.zeros((K, BCAP), np.bool_)
    b0 = np.zeros(K, np.int64); b1 = np.zeros(K, np.int64)
    exc = np.zeros(K); inh = np.zeros(K); tl = np.zeros(K)
    ufav = np.full(K, -1e18); udisp = np.full(K, -1e18)
    disp = np.zeros(K, np.int64); hv = np.zeros(K, np.int64); ht_ = np.zeros(K, np.int64)
    nA_tot = trensA.size
    integ = np.zeros(2 * nA_tot, np.bool_); insumo = np.zeros(NEP, np.int64)
    tdec = 0.0; parou = False; estab = 0; novas = 0; nac = 0
    for ep in range(NEP):
        nh = 0
        for k in range(K): b0[k] = 0; b1[k] = 0
        ia = ini[ep]; ib = ini[ep]; fa = fim[ep]; ultimo = ep == NEP - 1
        while True:
            tia = trensA[ia] if ia < fa else 1e300
            tib = trensB[ib] if ib < fa else 1e300
            tinc = min(tia, tib); tev = ht[0] if nh > 0 else 1e300
            if tinc == 1e300 and tev == 1e300: break
            if tinc <= tev:
                s = 0 if tia <= tib else 1; t = tia if s == 0 else tib; idx = ia if s == 0 else ib
                if s == 0: ia += 1
                else: ib += 1
                if s == 0:
                    kd = 2.0 ** (-(t - tdec) / MEIA)
                    for r in range(nR):
                        if not R_es[r]: R_f[r] *= kd
                    tdec = t
                gid = idx if s == 0 else nA_tot + idx
                for r in range(nR):
                    if R_s[r] == s:
                        a = t + UD[s, R_u[r]] + R_d[r]; w = R_f[r]
                        nh = _push(nh, ht, hk, hs, hr, hi, hw, a, 0, s, r, gid, w)
                        if razao != 0.0:
                            nh = _push(nh, ht, hk, hs, hr, hi, hw, a + off, 1, s, r, gid, -razao * w)
                continue
            nh, T, kind, s, r, gid, w = _pop(nh, ht, hk, hs, hr, hi, hw)
            k = R_k[r]
            exc[k] *= np.exp(-(T - tl[k]) / TAU)
            if razao != 0.0: inh[k] *= np.exp(-(T - tl[k]) / taui)
            tl[k] = T
            if kind == 1:
                inh[k] += w; continue
            w = R_f[r]; exc[k] += w; V = exc[k] + inh[k]
            while b0[k] < b1[k] and bt[k, b0[k] % BCAP] < T - HEXC: b0[k] += 1
            p = b1[k] % BCAP; bt[k, p] = T; bs[k, p] = s; br[k, p] = r; bi[k, p] = gid; bq[k, p] = False; bf[k, p] = False; b1[k] += 1
            if b1[k] - b0[k] >= BCAP: b0[k] = b1[k] - BCAP + 1
            coinc = False; j = b1[k] - 2
            while j >= b0[k] and bt[k, j % BCAP] >= T - W:
                if bs[k, j % BCAP] != s: coinc = True; break
                j -= 1
            if coinc and V >= FAV:
                ufav[k] = T; nac += 1
                for x in range(nR): prot[x] = False
                j = b1[k] - 1
                while j >= b0[k] and bt[k, j % BCAP] >= T - W:
                    q = j % BCAP
                    if j == b1[k] - 1 or bs[k, q] != s:
                        rr = br[k, q]; prot[rr] = True
                        if not bf[k, q]:
                            bf[k, q] = True
                            R_f[rr] = min(1.0, R_f[rr] + DF)
                            if np.isnan(R_fi[rr]): R_fi[rr] = T
                            R_la[rr] = T
                            if (not R_es[rr]) and T - R_fi[rr] >= EST_SEP and R_f[rr] >= EST_F:
                                R_es[rr] = True; estab += 1
                        if ultimo and bs[k, q] != s:
                            ra = r if s == 0 else rr; rb = rr if s == 0 else r
                            dif = (UD[0, R_u[ra]] + R_d[ra]) - (UD[1, R_u[rb]] + R_d[rb])
                            ht_[k] += 1
                            if abs(dif - DELTA) <= W: hv[k] += 1
                    j -= 1
                _conservar_lado(k, 0, R_s, R_k, R_f, prot, nR, EST); _conservar_lado(k, 1, R_s, R_k, R_f, prot, nR, EST)
            elif (not R_es[r]) and W < T - ufav[k] <= 3 * W:
                R_f[r] = max(0.0, R_f[r] - 1.05 * DF)
            if V >= LIM:
                if T - udisp[k] > W and ultimo: disp[k] += 1
                udisp[k] = T
                j = b1[k] - 1
                while j >= b0[k]:
                    integ[bi[k, j % BCAP]] = True; j -= 1
            elif V >= Q * LIM:
                j = b1[k] - 1
                while j >= b0[k]:
                    q = j % BCAP
                    if not bq[k, q]:
                        bq[k, q] = True; rr = br[k, q]; zz = R_s[rr]
                        tot_rr = UD[zz, R_u[rr]] + R_d[rr]; rec = False
                        for x in range(nR):
                            if R_s[x] == zz and R_k[x] == k and (not np.isnan(R_la[x])) and T - R_la[x] <= JAN:
                                if abs(UD[zz, R_u[x]] + R_d[x] - tot_rr) <= VIZ: rec = True; break
                        if rec:
                            R_q[rr] += 1
                            if R_q[rr] >= NQUASE and R_f[rr] >= FBROTO:
                                R_q[rr] = 0; n0 = nR; dU = UD[zz, R_u[rr]]
                                for fac in (1.0 + PASSO, 1.0 - PASSO):
                                    nR, ok = _nova_upro(zz, dU * fac, k, unica, F0, DMAXR, T, UD, UA, nU, R_s, R_u, R_k, R_d, R_f, R_fi, R_la, R_na, R_es, R_q, nR, K)
                                    if ok: novas += 1
                                for x in range(nR): prot[x] = x >= n0
                                for kk in range(K):
                                    _conservar_lado(kk, zz, R_s, R_k, R_f, prot, nR, EST)
                    j -= 1
            if nR > LIMRAM:
                parou = True; break
        cont = 0
        for x in range(ini[ep], fim[ep]):
            if not integ[x]: cont += 1
            if not integ[nA_tot + x]: cont += 1
        insumo[ep] = cont
        tf = ep * CICLO + dur; m = 0
        for r in range(nR):
            ref = R_na[r] if np.isnan(R_la[r]) else R_la[r]
            if R_es[r] or (tf - ref) < SOME:
                R_s[m] = R_s[r]; R_u[m] = R_u[r]; R_k[m] = R_k[r]; R_d[m] = R_d[r]; R_f[m] = R_f[r]
                R_fi[m] = R_fi[r]; R_la[m] = R_la[r]; R_na[m] = R_na[r]; R_es[m] = R_es[r]; R_q[m] = R_q[r]; m += 1
        nR = m
        for s in range(2):
            for u in range(nU[s]): UA[s, u] = False
        for r in range(nR): UA[R_s[r], R_u[r]] = True
        for k in range(K): exc[k] = 0.0; inh[k] = 0.0
        if parou: break
    return (R_s[:nR].copy(), R_u[:nR].copy(), R_k[:nR].copy(), R_d[:nR].copy(), R_f[:nR].copy(), UD.copy(), UA.copy(),
            disp, hv, ht_, insumo, parou, estab, novas, nac)


INIB = {"I0": (0.0, 0.0, TAU), "I1": (0.5, W, 0.30)}


def rodar(cond, faixa, semente, K=8, unica=False, dur=10_000.0, cond_fixo=False, DF=0.0065, F0=0.15, MEIA=300_000.0,
          FBROTO=0.30, Q=0.75, JAN=60_000.0, VIZ=0.20, EST=1.0, DMAXR=0.2):
    tA, tB, ini, fim = trens(semente, faixa, dur, cond_fixo)
    razao, off, taui = INIB[cond]
    (Rs, Ru, Rk, Rd, Rf, UD, UA, disp, hv, ht, insumo, parou, estab, novas, nac) = _rodar(
        tA, tB, ini, fim, dur, semente, K, 1 if unica else 0, DF, F0, MEIA, FBROTO, razao, off, taui, Q, JAN, VIZ, EST, DMAXR)
    sint = []; presa = []; pares = []
    for k in range(K):
        frac = hv[k] / ht[k] if ht[k] else 0.0
        if disp[k] >= 100 and frac >= 0.6: sint.append(k)
        if disp[k] >= 100 and frac < 0.2: presa.append(k)
    for k in sint:   # par mais forte da Uint (para ver se as cópias se separam)
        a = [i for i in range(Rs.size) if Rk[i] == k and Rs[i] == 0]; b = [i for i in range(Rs.size) if Rk[i] == k and Rs[i] == 1]
        if a and b:
            ia = max(a, key=lambda i: Rf[i]); ib = max(b, key=lambda i: Rf[i])
            pares.append((round(float(UD[0, Ru[ia]]), 3), round(float(UD[1, Ru[ib]]), 3)))
    if parou: classe = "explosao"
    elif ht.sum() == 0: classe = "colapso"
    elif sint and not presa: classe = "selecao"
    else: classe = "difuso"
    return dict(cond=cond, faixa=faixa, semente=semente, fixo=cond_fixo, unica=unica, K=K, classe=classe,
                uints_sintonizadas=len(sint), uints_presas_no_acaso=len(presa), pares_upro_das_sintonizadas=sorted(set(pares)),
                caminhos_distintos=len(set(pares)), disparos_por_uint=[int(x) for x in disp],
                parte_verdadeira_por_uint=[round(float(hv[k] / ht[k]), 3) if ht[k] else 0.0 for k in range(K)],
                upros=(int(UA[0].sum()), int(UA[1].sum())), ramos=int(Rs.size), forca_total=round(float(Rf.sum()), 3),
                forca_max=round(float(Rf.max()), 3) if Rf.size else 0.0, upros_novas=int(novas), estabilizacoes=int(estab),
                acertos=int(nac), insumo_pcrt_por_episodio=[int(x) for x in insumo], interrompida_limite=bool(parou))
