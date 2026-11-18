"""MOTOR COM VÁRIAS FIBRAS POR OUVIDO (passos 2+3, registro a aprovar): F fibras por ouvido, cada uma com tremor e atividade
espontânea próprios; cada Uint alcança 2-4 fibras por lado (ALC, dado); Upros pertencem a uma fibra. Com F = 1 e sem espontânea,
reproduz motor_rapido. --- derivado de motor_rapido.py ---
MOTOR RÁPIDO (otimização, fase 1; plano em otimizacao-fase1.md). EXATO: listas por fibra, acerto recente restrito, sem laço morto de proteção.
ESTAT (OPT=2): decaimento sob demanda e eliminação a cada 1 ms. --- derivado de motor_correcoes.py ---
Motor com as correções 1, 2 e 8 (registro prévio: correcoes-mapa.md, aprovado em 17/11/2026), derivado de motor_estrutura.py.
1: recurso local por lado da Uint (gasto ao fortalecer, reposto com constante TAUR), sem soma imposta, teto 1,0 por ramo.
2: eliminação competitiva (força < TETA x máxima do mesmo lado, por TEL ms contínuos).
8: disparo probabilístico p = min(1, (V/1,5)^NEXP), intervalo mínimo de uma janela.
--- texto original abaixo ---

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
BCAP = 8192
DEDUPU = 0.02


@njit(cache=True)
def _nova_upro(b, s, d, kk, unica, F0, DMAXR, t, UD, UA, nU, R_s, R_u, R_k, R_d, R_f, R_fi, R_la, R_na, R_es, R_q, nR, K, R_b, ALC):
    """Cria uma Upro da fibra b (lado s) com atraso d; ramos para as Uints que a fibra alcança (ou só para kk, se unica)."""
    if not (DMIN <= d <= DMAX): return nR, False
    for u in range(nU[b]):
        if UA[b, u] and (unica == 0 or _upro_alvo(u, b, kk, R_b, R_u, R_k, nR)):
            if abs(UD[b, u] - d) <= DEDUPU * d: return nR, False
    if nU[b] >= MAXU: return nR, False
    u = nU[b]; UD[b, u] = d; UA[b, u] = True; nU[b] += 1
    k0 = kk if unica else 0; k1 = kk + 1 if unica else K
    for k in range(k0, k1):
        if nR >= MAXRAM: break
        if not ALC[b, k]: continue
        R_s[nR] = s; R_b[nR] = b; R_u[nR] = u; R_k[nR] = k; R_d[nR] = np.random.uniform(0.0, DMAXR); R_f[nR] = F0
        R_fi[nR] = np.nan; R_la[nR] = np.nan; R_na[nR] = t; R_es[nR] = False; R_q[nR] = 0; nR += 1
    return nR, True


@njit(cache=True)
def _upro_alvo(u, b, kk, R_b, R_u, R_k, nR):
    for r in range(nR):
        if R_b[r] == b and R_u[r] == u and R_k[r] == kk: return True
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
def _rodar(INC_T, INC_B, ini, fim, NF, FPO, ALC, dur, semente, K, unica, DF, F0, MEIA, FBROTO, razao, off, taui, Q, JAN, VIZ, EST, DMAXR, RC, TAUR, TETA, TEL, NEXP, DLT, MAT, TAUJ, NMEIO, MMEIA, OPT, CUR, DLT2, RET, LE, LI, DURO, RELOG, DEP, PART, NPART, INHP, INH_T, INH_K, iniI, fimI, RI, DI, FI, PUNI, LTDN, ALTD, FORCAF, TFIB):
    np.random.seed(semente)
    UD = np.zeros((NF, MAXU)); UA = np.zeros((NF, MAXU), np.bool_); nU = np.zeros(NF, np.int64); R_b = np.zeros(MAXRAM, np.int64)
    R_s = np.zeros(MAXRAM, np.int64); R_u = np.zeros(MAXRAM, np.int64); R_k = np.zeros(MAXRAM, np.int64)
    R_d = np.zeros(MAXRAM); R_f = np.zeros(MAXRAM); R_fi = np.full(MAXRAM, np.nan); R_la = np.full(MAXRAM, np.nan)
    R_na = np.zeros(MAXRAM); R_es = np.zeros(MAXRAM, np.bool_); R_q = np.zeros(MAXRAM, np.int64)
    prot = np.zeros(MAXRAM, np.bool_); R_ok = np.ones(MAXRAM, np.bool_); R_bx = np.full(MAXRAM, np.nan)
    RCk = np.full((K, 2), RC)   # estoque por lado: proporcional às fibras que alcançam o lado (FORCAF)
    if FORCAF:
        for k in range(K):
            for b in range(NF): RCk[k, b // FPO] += TFIB if ALC[b, k] else 0.0
            RCk[k, 0] -= RC; RCk[k, 1] -= RC
    RS = RCk.copy(); tRS = np.zeros((K, 2)); fmx = np.zeros((K, 2))
    mat = np.zeros(K); tmat = np.zeros(K); passo_m = 1.0 / (1.0 / (1.0 - 0.5 ** (1.0 / NMEIO)))
    HB = 5.0 * max(TAUJ, TAU) if MAT else HEXC
    LF = np.zeros((NF, MAXRAM), np.int64); nLF = np.zeros(NF, np.int64); nR_lf = -1
    LS = np.zeros((2, MAXRAM), np.int64); nLS = np.zeros(2, np.int64)
    R_td = np.zeros(MAXRAM); t_elim = -1e18
    R_pf = np.zeros(MAXRAM, np.int64); nf = np.zeros(K, np.int64)   # participação (PART): último disparo da Uint em que o ramo foi integrado
    # fila por cursor (CUR): uma entrada na fila por incidência e tipo; ramos da incidência guardados em anel, ordenados pela chegada
    CUR = CUR and not MAT
    SO = np.zeros((NF, MAXRAM), np.int64); RING = 1 << 20; MSK = RING - 1
    RA = np.zeros(RING); RR = np.zeros(RING, np.int64); RW = np.zeros(RING); RE = np.zeros(RING, np.int64); pos = 0; estouro = False
    nR = 0; elim = 0; podas = 0; sdif = np.zeros(K); ndif = np.zeros(K, np.int64); hdif = np.zeros((K, 4001), np.int64)
    for b in range(NF):
        for i in range(NINI):
            d = DMIN * (DMAX / DMIN) ** (i / (NINI - 1))
            nR, _ = _nova_upro(b, b // FPO, d, 0, 0, F0, DMAXR, 0.0, UD, UA, nU, R_s, R_u, R_k, R_d, R_f, R_fi, R_la, R_na, R_es, R_q, nR, K, R_b, ALC)
    ht = np.zeros(HCAP); hk = np.zeros(HCAP, np.int64); hs = np.zeros(HCAP, np.int64); hr = np.zeros(HCAP, np.int64)
    hi = np.zeros(HCAP, np.int64); hw = np.zeros(HCAP)
    bt = np.zeros((K, BCAP)); bs = np.zeros((K, BCAP), np.int64); br = np.zeros((K, BCAP), np.int64); bi = np.zeros((K, BCAP), np.int64)
    bq = np.zeros((K, BCAP), np.bool_); bf = np.zeros((K, BCAP), np.bool_)
    b0 = np.zeros(K, np.int64); b1 = np.zeros(K, np.int64)
    exc = np.zeros(K); inh = np.zeros(K); tl = np.zeros(K)
    # janela retangular (RET): cada chegada vale inteira por LE (excitação) ou LI (inibição) e depois sai
    RBM = (1 << 12) - 1; eT = np.zeros((K, RBM + 1)); eW = np.zeros((K, RBM + 1)); iT = np.zeros((K, RBM + 1)); iW = np.zeros((K, RBM + 1))
    ra0 = np.zeros(K, np.int64); ra1 = np.zeros(K, np.int64); ri0 = np.zeros(K, np.int64); ri1 = np.zeros(K, np.int64)
    hT = np.zeros((K, RBM + 1)); h0 = np.zeros(K, np.int64); h1 = np.zeros(K, np.int64); pI = 0; fI = 0   # inibição de caminho próprio (rampa + platô)
    ufav = np.full(K, -1e18); udisp = np.full(K, -1e18)
    disp = np.zeros(K, np.int64); hv = np.zeros(K, np.int64); ht_ = np.zeros(K, np.int64)
    integ = np.zeros(INC_T.size, np.bool_); insumo = np.zeros(NEP, np.int64)
    tdec = 0.0; parou = False; estab = 0; novas = 0; nac = 0
    nev = np.zeros(NEP, np.int64); nram = np.zeros(NEP, np.int64)   # medida de custo (não altera nada)
    dsil = np.zeros(K, np.int64)   # disparos no trecho de silêncio do último episódio (só medida)
    dfd = np.zeros((2, NEP))   # diagnóstico: força ganha nos acertos e perdida na punição da quase-sincronia, por episódio
    e1 = np.zeros((K, NEP), np.int64); e2 = np.zeros((K, NEP), np.int64); et = np.zeros((K, NEP), np.int64)   # diagnóstico por episódio (só medida)
    for ep in range(NEP):
        nh = 0
        for k in range(K): b0[k] = 0; b1[k] = 0
        ia = ini[ep]; fa = fim[ep]; ultimo = ep == NEP - 1
        if INHP: pI = iniI[ep]; fI = fimI[ep]
        while True:
            tinc = INC_T[ia] if ia < fa else 1e300; tev = ht[0] if nh > 0 else 1e300
            if tinc == 1e300 and tev == 1e300: break
            if tinc <= tev:
                fbi = INC_B[ia]; s = fbi // FPO; t = tinc; idx = ia; ia += 1
                if nR != nR_lf:   # listas de ramos por fibra (mesma ordem de índices)
                    for z in range(NF): nLF[z] = 0
                    nLS[0] = 0; nLS[1] = 0
                    for r in range(nR):
                        z = R_b[r]; LF[z, nLF[z]] = r; nLF[z] += 1
                        z = R_s[r]; LS[z, nLS[z]] = r; nLS[z] += 1
                    nR_lf = nR
                    if CUR:
                        for z in range(NF):
                            ch = np.empty(nLF[z])
                            for ii in range(nLF[z]):
                                r = LF[z, ii]; ch[ii] = UD[z, R_u[r]] + R_d[r]
                            oo = np.argsort(ch, kind='mergesort')
                            for ii in range(nLF[z]): SO[z, ii] = LF[z, oo[ii]]
                if s == 0 and OPT < 2:
                    kd = 2.0 ** (-(t - tdec) / MEIA)
                    for r in range(nR):
                        if not R_es[r]: R_f[r] *= kd
                    tdec = t
                if s == 0 and (OPT < 2 or t - t_elim >= 1.0):
                    t_elim = t
                    if OPT >= 2:
                        for r in range(nR):
                            if (not R_es[r]) and t > R_td[r]: R_f[r] *= 2.0 ** (-(t - R_td[r]) / MEIA)
                            R_td[r] = t
                    if PART:   # eliminação por não participação: a Uint disparou NPART vezes sem integrar o ramo
                        for r in range(nR):
                            if R_ok[r] and (not R_es[r]) and nf[R_k[r]] - R_pf[r] >= NPART: R_ok[r] = False; elim += 1
                    # correção 2: eliminação competitiva por lado de Uint
                    for kk in range(K * (1 - PART)):
                        fmx[kk, 0] = 0.0; fmx[kk, 1] = 0.0
                    for r in range(nR * (1 - PART)):
                        if R_ok[r] and R_f[r] > fmx[R_k[r], R_s[r]]: fmx[R_k[r], R_s[r]] = R_f[r]
                    for r in range(nR * (1 - PART)):
                        if R_ok[r] and not R_es[r]:
                            if R_f[r] < TETA * fmx[R_k[r], R_s[r]]:
                                ta = t - ep * (CICLO - DEP) if RELOG else t   # relógio só com mundo (RELOG) ou absoluto
                                if np.isnan(R_bx[r]): R_bx[r] = ta
                                elif ta - R_bx[r] >= TEL: R_ok[r] = False; elim += 1
                            else:
                                R_bx[r] = np.nan
                gid = idx
                if CUR:
                    base = pos
                    for ii in range(nLF[fbi]):
                        r = SO[fbi, ii]
                        if R_ok[r]:
                            if OPT >= 2 and (not R_es[r]) and t > R_td[r]:
                                R_f[r] *= 2.0 ** (-(t - R_td[r]) / MEIA); R_td[r] = t
                            a = t + UD[fbi, R_u[r]] + R_d[r]; j = pos
                            while j > base and RA[(j - 1) & MSK] > a:
                                RA[j & MSK] = RA[(j - 1) & MSK]; RR[j & MSK] = RR[(j - 1) & MSK]; RW[j & MSK] = RW[(j - 1) & MSK]; j -= 1
                            RA[j & MSK] = a; RR[j & MSK] = r; RW[j & MSK] = R_f[r]; pos += 1
                    if pos > base:
                        for j in range(base, pos): RE[j & MSK] = pos
                        nh = _push(nh, ht, hk, hs, hr, hi, hw, RA[base & MSK], 0, s, base, gid, 0.0)
                        if razao != 0.0:
                            nh = _push(nh, ht, hk, hs, hr, hi, hw, RA[base & MSK] + off, 1, s, base, gid, 0.0)
                    continue
                for ii in range(nLF[fbi]):
                    r = LF[fbi, ii]
                    if R_ok[r]:
                        if OPT >= 2 and (not R_es[r]) and t > R_td[r]:
                            R_f[r] *= 2.0 ** (-(t - R_td[r]) / MEIA); R_td[r] = t
                        a = t + UD[fbi, R_u[r]] + R_d[r]; w = R_f[r]
                        nh = _push(nh, ht, hk, hs, hr, hi, hw, a, 0, s, r, gid, w)
                        if MAT:
                            kk = R_k[r]; mm = mat[kk] * 2.0 ** (-(t - tmat[kk]) / MMEIA)
                            offm = 2.7 + mm * (-0.3 - 2.7)
                            nh = _push(nh, ht, hk, hs, hr, hi, hw, a + offm, 1, s, r, gid, -0.77 * w)
                        elif razao != 0.0:
                            nh = _push(nh, ht, hk, hs, hr, hi, hw, a + off, 1, s, r, gid, -razao * w)
                continue
            nh, T, kind, s, r, gid, w = _pop(nh, ht, hk, hs, hr, hi, hw)
            nev[ep] += 1
            if CUR:
                pp = r; q0 = pp & MSK
                if pos - pp >= RING: estouro = True
                r = RR[q0]
                if kind == 1: w = -razao * RW[q0]
                if pp + 1 < RE[q0]:
                    tn = RA[(pp + 1) & MSK]
                    if kind == 1: tn = tn + off
                    nh = _push(nh, ht, hk, hs, hr, hi, hw, tn, kind, s, pp + 1, gid, 0.0)
            if not R_ok[r]: continue
            k = R_k[r]
            if MAT:
                mat[k] *= 2.0 ** (-(T - tmat[k]) / MMEIA); tmat[k] = T
                tauE = TAUJ + mat[k] * (TAU - TAUJ); tauI = 4.0 + mat[k] * (1.5 - 4.0)
                exc[k] *= np.exp(-(T - tl[k]) / tauE); inh[k] *= np.exp(-(T - tl[k]) / tauI)
            elif not RET:
                exc[k] *= np.exp(-(T - tl[k]) / TAU)
                if razao != 0.0: inh[k] *= np.exp(-(T - tl[k]) / taui)
            tl[k] = T
            if RET:
                while ra0[k] < ra1[k] and T - eT[k, ra0[k] & RBM] >= LE:
                    exc[k] -= eW[k, ra0[k] & RBM]; ra0[k] += 1
                if ra0[k] == ra1[k]: exc[k] = 0.0
                while ri0[k] < ri1[k] and T - iT[k, ri0[k] & RBM] >= LI:
                    inh[k] -= iW[k, ri0[k] & RBM]; ri0[k] += 1
                if ri0[k] == ri1[k]: inh[k] = 0.0
            if kind == 1:
                if RET:
                    iT[k, ri1[k] & RBM] = T; iW[k, ri1[k] & RBM] = w; ri1[k] += 1
                inh[k] += w; continue
            if OPT >= 2 and (not R_es[r]) and T > R_td[r]:
                R_f[r] *= 2.0 ** (-(T - R_td[r]) / MEIA); R_td[r] = T
            w = R_f[r]; exc[k] += w; V = exc[k] + inh[k]
            if INHP:
                while pI < fI and INH_T[pI] <= T:
                    k2 = INH_K[pI]; hT[k2, h1[k2] & RBM] = INH_T[pI]; h1[k2] += 1; pI += 1
                while h0[k] < h1[k] and T - hT[k, h0[k] & RBM] >= DI: h0[k] += 1
                sI = 0.0
                for jj in range(h0[k], h1[k]):
                    dt = T - hT[k, jj & RBM]; sI += FI * (dt / RI if dt < RI else 1.0)
                V -= sI
            if RET:
                eT[k, ra1[k] & RBM] = T; eW[k, ra1[k] & RBM] = w; ra1[k] += 1
            while b0[k] < b1[k] and bt[k, b0[k] % BCAP] < T - HB: b0[k] += 1
            p = b1[k] % BCAP; bt[k, p] = T; bs[k, p] = s; br[k, p] = r; bi[k, p] = gid; bq[k, p] = False; bf[k, p] = False; b1[k] += 1
            if b1[k] - b0[k] >= BCAP: b0[k] = b1[k] - BCAP + 1
            coinc = False; j = b1[k] - 2
            while j >= b0[k] and bt[k, j % BCAP] >= T - W:
                if bs[k, j % BCAP] != s: coinc = True; break
                j -= 1
            if coinc and V >= FAV:
                ufav[k] = T; nac += 1
                if MAT: mat[k] += (1.0 - mat[k]) * passo_m
                j = b1[k] - 1
                while j >= b0[k] and bt[k, j % BCAP] >= T - W:
                    q = j % BCAP
                    if j == b1[k] - 1 or bs[k, q] != s:
                        rr = br[k, q]; prot[rr] = True
                        if not bf[k, q]:
                            bf[k, q] = True
                            zs = R_s[rr]
                            if OPT >= 2 and (not R_es[rr]) and T > R_td[rr]:
                                R_f[rr] *= 2.0 ** (-(T - R_td[rr]) / MEIA); R_td[rr] = T
                            RS[k, zs] = RCk[k, zs] - (RCk[k, zs] - RS[k, zs]) * np.exp(-(T - tRS[k, zs]) / TAUR); tRS[k, zs] = T
                            g = min(DF * RS[k, zs] / RCk[k, zs], 1.0 - R_f[rr])
                            if FORCAF:   # teto por fibra: soma dos ramos da mesma fibra nesta Uint <= TFIB
                                sf = 0.0; bb = R_b[rr]
                                for ii in range(nLF[bb]):
                                    x = LF[bb, ii]
                                    if R_ok[x] and R_k[x] == k: sf += R_f[x]
                                g = min(g, TFIB - sf)
                            if g > 0.0: R_f[rr] += g; RS[k, zs] -= g; dfd[0, ep] += g
                            if np.isnan(R_fi[rr]): R_fi[rr] = T
                            R_la[rr] = T
                            if (not R_es[rr]) and T - R_fi[rr] >= EST_SEP and R_f[rr] >= EST_F:
                                R_es[rr] = True; estab += 1
                        if bs[k, q] != s:
                            ra = r if s == 0 else rr; rb = rr if s == 0 else r
                            dif0 = (UD[R_b[ra], R_u[ra]] + R_d[ra]) - (UD[R_b[rb], R_u[rb]] + R_d[rb]); et[k, ep] += 1
                            if abs(dif0 - DLT) <= W: e1[k, ep] += 1
                            if abs(dif0 - DLT2) <= W: e2[k, ep] += 1
                        if ultimo and bs[k, q] != s:
                            ra = r if s == 0 else rr; rb = rr if s == 0 else r
                            dif = (UD[R_b[ra], R_u[ra]] + R_d[ra]) - (UD[R_b[rb], R_u[rb]] + R_d[rb])
                            ht_[k] += 1; sdif[k] += dif; ndif[k] += 1
                            bdx = int(round((dif + 20.0) * 100.0))
                            if 0 <= bdx < 4001: hdif[k, bdx] += 1
                            if abs(dif - DLT) <= W: hv[k] += 1
                    j -= 1
            elif LTDN:   # depressão NB: chegada 1-3 janelas depois do DISPARO da Uint perde uma fração da própria força
                if (not R_es[r]) and W < T - udisp[k] <= 3 * W:
                    dfd[1, ep] += ALTD * R_f[r]; R_f[r] -= ALTD * R_f[r]
            elif PUNI and (not R_es[r]) and W < T - ufav[k] <= 3 * W:
                dfd[1, ep] += min(R_f[r], 1.05 * DF); R_f[r] = max(0.0, R_f[r] - 1.05 * DF)
            disparou = False
            if DURO:
                if T - udisp[k] > W and V >= LIM: disparou = True
            elif T - udisp[k] > W and V > 0.0:
                pd = min(1.0, (V / LIM) ** NEXP)
                if np.random.random() < pd: disparou = True
            if disparou:
                if ultimo: disp[k] += 1
                if ultimo and T > (NEP - 1) * CICLO + dur: dsil[k] += 1
                udisp[k] = T
                if PART:
                    nf[k] += 1; j = b1[k] - 1
                    while j >= b0[k] and T - bt[k, j % BCAP] < LE:
                        R_pf[br[k, j % BCAP]] = nf[k]; j -= 1
                j = b1[k] - 1
                while j >= b0[k]:
                    integ[bi[k, j % BCAP]] = True; j -= 1
            elif V < LIM and V >= Q * LIM:
                j = b1[k] - 1
                while j >= b0[k]:
                    q = j % BCAP
                    if not bq[k, q]:
                        bq[k, q] = True; rr = br[k, q]; zz = R_s[rr]
                        tot_rr = UD[R_b[rr], R_u[rr]] + R_d[rr]; rec = False
                        for ii in range(nLS[zz]):
                            x = LS[zz, ii]
                            if R_k[x] == k and (not np.isnan(R_la[x])) and T - R_la[x] <= JAN:
                                if abs(UD[R_b[x], R_u[x]] + R_d[x] - tot_rr) <= VIZ: rec = True; break
                        if rec:
                            R_q[rr] += 1
                            if OPT >= 2 and (not R_es[rr]) and T > R_td[rr]:
                                R_f[rr] *= 2.0 ** (-(T - R_td[rr]) / MEIA); R_td[rr] = T
                            if R_q[rr] >= NQUASE and R_f[rr] >= FBROTO:
                                R_q[rr] = 0; n0 = nR; dU = UD[R_b[rr], R_u[rr]]; brr = R_b[rr]
                                for fac in (1.0 + PASSO, 1.0 - PASSO):
                                    nR, ok = _nova_upro(brr, zz, dU * fac, k, unica, F0, DMAXR, T, UD, UA, nU, R_s, R_u, R_k, R_d, R_f, R_fi, R_la, R_na, R_es, R_q, nR, K, R_b, ALC)
                                    if ok: novas += 1
                                for x in range(n0, nR): R_ok[x] = True; R_bx[x] = np.nan; R_td[x] = T; R_pf[x] = nf[R_k[x]]
                    j -= 1
            if nR > LIMRAM:
                parou = True; break
        cont = 0
        for x in range(ini[ep], fim[ep]):
            if not integ[x]: cont += 1
        insumo[ep] = cont
        tf = ep * CICLO + dur; m = 0
        for r in range(nR):
            ref = R_na[r] if np.isnan(R_la[r]) else R_la[r]
            vivo = R_es[r] or (tf - ref) < SOME
            if R_ok[r] and not vivo: podas += 1
            if R_ok[r] and vivo:
                R_s[m] = R_s[r]; R_b[m] = R_b[r]; R_u[m] = R_u[r]; R_k[m] = R_k[r]; R_d[m] = R_d[r]; R_f[m] = R_f[r]
                R_fi[m] = R_fi[r]; R_la[m] = R_la[r]; R_na[m] = R_na[r]; R_es[m] = R_es[r]; R_q[m] = R_q[r]
                R_ok[m] = True; R_bx[m] = R_bx[r]; R_td[m] = R_td[r]; R_pf[m] = R_pf[r]; m += 1
        nR = m; nR_lf = -1; nram[ep] = nR   # ramos que seguem para o episódio seguinte (depois da poda)
        for z in range(NF):
            for u in range(nU[z]): UA[z, u] = False
        for r in range(nR): UA[R_b[r], R_u[r]] = True
        for k in range(K): exc[k] = 0.0; inh[k] = 0.0; ra0[k] = ra1[k]; ri0[k] = ri1[k]; h0[k] = h1[k]
        if parou: break
    if OPT >= 2:
        tfim = (NEP - 1) * CICLO + dur
        for r in range(nR):
            if (not R_es[r]) and tfim > R_td[r]: R_f[r] *= 2.0 ** (-(tfim - R_td[r]) / MEIA)
    return (R_s[:nR].copy(), R_b[:nR].copy(), R_u[:nR].copy(), R_k[:nR].copy(), R_d[:nR].copy(), R_f[:nR].copy(), UD.copy(), UA.copy(),
            disp, hv, ht_, insumo, parou or estouro, estab, novas, nac, elim, podas, RS.copy(), sdif, ndif, hdif, mat.copy(), nev, nram, e1, e2, et, dsil, dfd)


def trens_2(semente, faixa, dur, d1=DELTA, d2=-DELTA):
    """Degrau 2 (rascunho, a aprovar): duas fontes independentes, cada uma com seu ritmo sorteado na faixa e sua relação
    verdadeira (B chega d depois de A; d < 0: B chega antes). Os trens de cada fibra são a união ordenada das duas fontes."""
    from motor_eventos import FAIXA, JIT
    rng = np.random.default_rng(semente); TA, TB, ini, fim = [], [], [], []; pos = 0
    for ep in range(NEP):
        t0 = ep * CICLO; a_ep, b_ep = [], []
        for d in (d1, d2):
            lo, hi = FAIXA[faixa]; base = []; t = 0.0
            while t < dur:
                p = rng.uniform(lo, hi); base.extend(np.arange(t + rng.uniform(0, lo), min(t + 250.0, dur), p)); t += 250.0
            base = np.array(base)
            a_ep.append(t0 + base + rng.normal(0, JIT, base.size)); b_ep.append(t0 + base + d + rng.normal(0, JIT, base.size))
        a = np.sort(np.concatenate(a_ep)); b = np.sort(np.concatenate(b_ep))
        TA.append(a); TB.append(b); ini.append(pos); pos += a.size; fim.append(pos)
    return np.concatenate(TA), np.concatenate(TB), np.array(ini), np.array(fim)


def _limita(cand_mundo, cand_esp, p, ABS, TREC, rng):
    """Limite por fibra: cada ciclo do mundo é candidato com chance p (acaso físico do sensor); o espontâneo também é candidato;
    depois o refratário: rejeita se < ABS do último disparo aceito; senão aceita com chance 1 - exp(-(dt - ABS)/TREC)."""
    w = cand_mundo[rng.random(cand_mundo.size) < p]
    c = np.sort(np.concatenate((w, cand_esp))); out = []; ult = -1e18
    for t in c:
        dt = t - ult
        if dt < ABS: continue
        if rng.random() < 1.0 - np.exp(-(dt - ABS) / TREC): out.append(t); ult = t
    return np.array(out)


def trens_fibras(semente, faixa, dur, F, taxa, sil=2000.0, delta=DELTA, NINH=None, LATI=0.2, ESPI=60.0, LIMF=False, RMAX=300.0, ABS=0.4, TREC=0.4):
    """F fibras por ouvido. O mundo (ritmo e relação) é o mesmo de trens_d; a fibra 0 de cada ouvido recebe o mesmo tremor de
    trens_d, as outras um tremor próprio (gerador separado). Atividade espontânea por fibra (Poisson, `taxa`/s; mesmo gerador e
    ordem de trens_esp quando F = 1), com `sil` ms de silêncio no fim de cada episódio se taxa > 0.
    Devolve o fluxo único de incidências ordenado (tempos, fibra), com início e fim por episódio. Fibras 0..F-1: ouvido A; F..2F-1: B.
    Empates: fibra de menor índice primeiro (A antes de B, como no motor de duas fibras)."""
    from motor_eventos import FAIXA, JIT
    rng = np.random.default_rng(semente); rj = np.random.default_rng(semente + 3_000_017); re = np.random.default_rng(semente + 1_000_003)
    T, B, ini, fim = [], [], [], []; pos = 0; durt = dur + (sil if taxa > 0 else 0.0)
    ri = np.random.default_rng(semente + 4_000_037); IT, IK, iini, ifim = [], [], [], []; ipos = 0
    rl = np.random.default_rng(semente + 6_000_101)
    for ep in range(NEP):
        t0 = ep * CICLO; lo, hi = FAIXA[faixa]; base = []; t = 0.0
        while t < dur:
            p = rng.uniform(lo, hi); base.extend(np.arange(t, min(t + 250.0, dur), p)); t += 250.0
        base = np.array(base)
        a0 = t0 + base + rng.normal(0, JIT, base.size); b0 = t0 + base + delta + rng.normal(0, JIT, base.size)
        fibs = [None] * (2 * F); fibs[0] = a0; fibs[F] = b0
        for f in range(1, F):
            fibs[f] = t0 + base + rj.normal(0, JIT, base.size); fibs[F + f] = t0 + base + delta + rj.normal(0, JIT, base.size)
        if LIMF:   # limite por fibra: chance por ciclo para a taxa sustentada RMAX, mais o refratário (gerador próprio)
            pc = min(1.0, RMAX * (dur / max(base.size, 1)) / 1000.0)
            for f in range(2 * F):
                esp = t0 + rl.uniform(0.0, durt, rl.poisson(taxa * durt / 1000.0)) if taxa > 0 else np.zeros(0)
                fibs[f] = _limita(fibs[f], esp, pc, ABS, TREC, rl)
        elif taxa > 0:
            for f in list(range(F)) + list(range(F, 2 * F)):
                n = re.poisson(taxa * durt / 1000.0); fibs[f] = np.sort(np.concatenate((fibs[f], t0 + re.uniform(0.0, durt, n))))
        tt = np.concatenate(fibs); bb = np.concatenate([np.full(x.size, f, np.int64) for f, x in enumerate(fibs)])
        o = np.lexsort((bb, tt)); T.append(tt[o]); B.append(bb[o]); ini.append(pos); pos += tt.size; fim.append(pos)
        if NINH is not None:   # fibras inibitórias próprias de cada Uint (caminho próprio): mundo do seu lado + LATI + tremor + espontânea
            it_, ik_ = [], []
            for k in range(NINH.shape[0]):
                for lado in range(2):
                    for j in range(NINH[k, lado]):
                        x = t0 + base + (delta if lado else 0.0) + LATI + ri.normal(0, JIT, base.size)
                        if ESPI > 0: x = np.concatenate((x, t0 + ri.uniform(0.0, durt, ri.poisson(ESPI * durt / 1000.0))))
                        it_.append(x); ik_.append(np.full(x.size, k, np.int64))
            tt2 = np.concatenate(it_); kk2 = np.concatenate(ik_); o2 = np.argsort(tt2, kind="stable")
            IT.append(tt2[o2]); IK.append(kk2[o2]); iini.append(ipos); ipos += tt2.size; ifim.append(ipos)
    if NINH is None:
        return np.concatenate(T), np.concatenate(B), np.array(ini), np.array(fim)
    return (np.concatenate(T), np.concatenate(B), np.array(ini), np.array(fim), np.concatenate(IT), np.concatenate(IK), np.array(iini), np.array(ifim))


def alcance(semente, F, K, amin=2, amax=4):
    """Dado anatômico: cada Uint alcança de amin a amax fibras de cada ouvido (sorteio uniforme, sem repetição). Com F = 1, todas."""
    ALC = np.zeros((2 * F, K), np.bool_)
    if F == 1: ALC[:, :] = True; return ALC
    rng = np.random.default_rng(semente + 2_000_003)
    for k in range(K):
        for lado in range(2):
            n = min(F, int(rng.integers(amin, amax + 1)))
            for f in rng.choice(F, n, replace=False): ALC[lado * F + f, k] = True
    return ALC


def trens_esp(semente, faixa, dur, taxa, sil=2000.0, delta=DELTA):
    """Passo 2: o mundo igual ao de trens_d (mesma sequência aleatória) e, em cada fibra, incidências espontâneas
    (Poisson, `taxa` por segundo, independentes entre fibras e do mundo) de t0 até t0 + dur + sil, com um trecho de
    silêncio de `sil` ms no fim de cada episódio. Gerador próprio para o espontâneo (o mundo não muda).
    Devolve TA, TB, iniA, fimA, iniB, fimB."""
    TA, TB, ini, fim = trens_d(semente, faixa, dur, False, delta)
    rng = np.random.default_rng(semente + 1_000_003); out = ([], []); idx = ([], [], [], []); pos = [0, 0]
    for ep in range(NEP):
        t0 = ep * CICLO
        for z, fib in enumerate((TA, TB)):
            n = rng.poisson(taxa * (dur + sil) / 1000.0); esp = t0 + rng.uniform(0.0, dur + sil, n)
            e = np.sort(np.concatenate((fib[ini[ep]:fim[ep]], esp)))
            out[z].append(e); idx[2 * z].append(pos[z]); pos[z] += e.size; idx[2 * z + 1].append(pos[z])
    return (np.concatenate(out[0]), np.concatenate(out[1]), np.array(idx[0]), np.array(idx[1]), np.array(idx[2]), np.array(idx[3]))


def trens_d(semente, faixa, dur, cond_fixo=False, delta=DELTA):
    """Igual a motor_eventos.trens, com a relação verdadeira (delta) como parâmetro (controle da preferência da estrutura).
    Com delta = DELTA, idêntico ao original (mesma sequência aleatória)."""
    from motor_eventos import FAIXA, JIT
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
        a = t0 + base + rng.normal(0, JIT, base.size); b = t0 + base + delta + rng.normal(0, JIT, base.size)
        TA.append(a); TB.append(b); ini.append(pos); pos += a.size; fim.append(pos)
    return np.concatenate(TA), np.concatenate(TB), np.array(ini), np.array(fim)


INIB = {"I0": (0.0, 0.0, TAU), "I1": (0.5, W, 0.30)}


def rodar(cond, faixa, semente, K=8, unica=False, dur=10_000.0, cond_fixo=False, DF=0.0065, F0=0.15, MEIA=300_000.0,
          FBROTO=0.30, Q=0.75, JAN=60_000.0, VIZ=0.20, EST=1.0, DMAXR=0.2, RC=1.0, TAUR=60_000.0, TETA=0.25, TEL=60_000.0, NEXP=8.0, hist=False, delta=DELTA, MAT=False, TAUJ=1.0, NMEIO=100.0, MMEIA=3_600_000.0, OPT=1, CUR=False, RET=False, LE=0.30, LI=0.30, DURO=False, ESP=0.0, SIL=2000.0, FIB=1, AMIN=2, AMAX=4, RELOG=False, PART=False, NPART=1000, INHP=False, NIMIN=2, NIMAX=3, LATI=0.2, ESPI=60.0, RI=1.0, DI=3.0, FI=0.5, LIMF=False, RMAX=300.0, ABS=0.4, TREC=0.4, PUNI=True, LTDN=False, ALTD=0.01, FORCAF=False, TFIB=0.5, FINI=0.43):
    F = int(FIB)
    if INHP:
        rI = np.random.default_rng(semente + 5_000_011); NINH = rI.integers(NIMIN, NIMAX + 1, size=(K, 2))
        INC_T, INC_B, ini, fim, INH_T, INH_K, iniI, fimI = trens_fibras(semente, faixa, dur, F, ESP, SIL, delta, NINH, LATI, ESPI)
    else:
        INC_T, INC_B, ini, fim = trens_fibras(semente, faixa, dur, F, ESP, SIL, delta, LIMF=LIMF, RMAX=RMAX, ABS=ABS, TREC=TREC)
        INH_T = np.zeros(1); INH_K = np.zeros(1, np.int64); iniI = np.zeros(NEP, np.int64); fimI = np.zeros(NEP, np.int64)
    ALC = alcance(semente, F, K, AMIN, AMAX)
    razao, off, taui = INIB[cond]
    if FORCAF: F0 = FINI * TFIB / NINI   # força inicial por fibra (fração do teto), dividida entre os ramos da fibra na Uint
    (Rs, Rb, Ru, Rk, Rd, Rf, UD, UA, disp, hv, ht, insumo, parou, estab, novas, nac, elim, podas, RS, sdif, ndif, hdif, matf, nev, nram, e1, e2, et, dsil, dfd) = _rodar(
        INC_T, INC_B, ini, fim, 2 * F, F, ALC, dur, semente, K, 1 if unica else 0, DF, F0, MEIA, FBROTO, razao, off, taui, Q, JAN, VIZ, EST, DMAXR,
        RC, TAUR, TETA, TEL, NEXP, delta, 1 if MAT else 0, TAUJ, NMEIO, MMEIA, OPT, CUR, -1e9, RET, LE, LI, DURO, RELOG, dur + (SIL if ESP > 0 else 0.0), 1 if PART else 0, NPART, 1 if INHP else 0, INH_T, INH_K, iniI, fimI, RI, DI, FI, 1 if PUNI else 0, 1 if LTDN else 0, ALTD, 1 if FORCAF else 0, TFIB)
    sint = []; presa = []; pares = []
    for k in range(K):
        frac = hv[k] / ht[k] if ht[k] else 0.0
        if disp[k] >= 100 and frac >= 0.6: sint.append(k)  # relação: o delta do mundo
        if disp[k] >= 100 and frac < 0.2: presa.append(k)
    for k in sint:   # par mais forte da Uint (para ver se as cópias se separam)
        a = [i for i in range(Rs.size) if Rk[i] == k and Rs[i] == 0]; b = [i for i in range(Rs.size) if Rk[i] == k and Rs[i] == 1]
        if a and b:
            ia = max(a, key=lambda i: Rf[i]); ib = max(b, key=lambda i: Rf[i])
            pares.append((round(float(UD[Rb[ia], Ru[ia]]), 3), round(float(UD[Rb[ib], Ru[ib]]), 3)))
    if parou: classe = "explosao"
    elif ht.sum() == 0: classe = "colapso"
    elif sint and not presa: classe = "selecao"
    else: classe = "difuso"
    pref = [round(float(sdif[k] / ndif[k]), 3) for k in sint if ndif[k]]
    def _med(h):
        c = np.cumsum(h); i = int(np.searchsorted(c, c[-1] / 2.0)); return round(i / 100.0 - 20.0, 2)
    pref_med = [_med(hdif[k]) for k in sint if hdif[k].sum()]
    ramos_lado = [int(((Rk == k) & (Rs == z)).sum()) for k in range(K) for z in range(2)]
    return dict(diag_forca_ganha=[round(float(x), 2) for x in dfd[0]], diag_forca_perdida=[round(float(x), 2) for x in dfd[1]], disparos_silencio=[int(x) for x in dsil], diag_e1=e1, diag_e2=e2, diag_et=et, eventos_por_episodio=[int(x) for x in nev], ramos_fim_episodio=[int(x) for x in nram], incidencias_por_episodio=[int(fim[e] - ini[e]) for e in range(len(ini))], alcance=ALC.copy(),
                cond=cond, faixa=faixa, semente=semente, fixo=cond_fixo, unica=unica, K=K, RC=RC, TAUR=TAUR, TETA=TETA, TEL=TEL, NEXP=NEXP,
                classe=classe, diferenca_preferida_sintonizadas=pref, diferenca_preferida_mediana_sintonizadas=pref_med,
                espalhamento_preferida=round(float(np.std(pref)), 4) if len(pref) > 1 else 0.0,
                ramos_por_lado_mediana=float(np.median(ramos_lado)), recurso_medio_fim=round(float(RS.mean()), 3),
                eliminados=int(elim), podados=int(podas), maturidade_media=round(float(matf.mean()), 3), uints_maduras=int((matf >= 0.9).sum()), **({'hist_dif': hdif} if hist else {}),
                uints_sintonizadas=len(sint), uints_presas_no_acaso=len(presa), pares_upro_das_sintonizadas=sorted(set(pares)),
                caminhos_distintos=len(set(pares)), disparos_por_uint=[int(x) for x in disp],
                parte_verdadeira_por_uint=[round(float(hv[k] / ht[k]), 3) if ht[k] else 0.0 for k in range(K)],
                upros=(int(UA[:F].sum()), int(UA[F:].sum())), ramos=int(Rs.size), forca_total=round(float(Rf.sum()), 3),
                forca_max=round(float(Rf.max()), 3) if Rf.size else 0.0, upros_novas=int(novas), estabilizacoes=int(estab),
                acertos=int(nac), insumo_pcrt_por_episodio=[int(x) for x in insumo], interrompida_limite=bool(parou))
