"""V0.19 — motor dos três braços do teste de 60 s (autorizado por Paulo em 28/11, 14:52+): faixa 790, faixa 263 e
compacta 263, todos com a regra B (Uint candidata na superfície de entrada ou para dentro da cabeça).
Diferenças em relação a sdom_ab.py (que fica intacto):
- o comprimento do nervo é parâmetro (nervo): TR_PASSOS = 12 × nervo reacessos; atraso = nervo × 66,7 µs (condução, sem
  trajetória discreta);
- modo 0 (faixa): territórios da Uint nova como no histórico (bloco 2 × 2 mais próximo);
  modo 1 (compacta): Ustr numa grade regular 3 × 3 × 3; a Uint nova pertence à Ustr de centro mais próximo; empate na
  distância → menor índice entre as empatadas (mesma regra das chegadas, coordenadas.territorio);
- a regra B usa xlim: na faixa, o primeiro plano atrás das pontas; na compacta, a face plana (n = 0).
O resto (coincidência, criação, crescimento, plasticidade 0,0065 e 1/60) é o do ensaio planar."""

"""V0.19 — comparação A × B (pré-registro em ../preregistro-folha-x-profundidade.md, proposta do responsável de 28/11):
mesmo motor planar do ensaio com o nervo (790 cubos; ganho +0,0065; punição 1/60), mudando SÓ a busca da Uint candidata:
- caixa de busca: em cada eixo, de piso(ponto médio) − 3 a teto(ponto médio) + 3, inclusive (referência: ponto médio dos
  dois emissores);
- condição A (cond = 1), folha fixa: só cubos da caixa no plano da folha (xfolha: primeiro plano de cubos atrás das
  pontas das Upros de entrada, rumo ao centro da cabeça), para todas as gerações;
- condição B (cond = 2), profundidade local: cubos da caixa na folha ou mais para dentro da cabeça;
- mesmas regras de ocupação (Ustr e Uints ocupam cubo; o cubo de uma Uint existente é reutilizado), pontuação e desempate;
- sem cubo admissível: registra e encerra a tentativa sem criar Uint.
Contadores novos: buscas sem cubo admissível; buscas com cubo admissível fora da folha; Uint escolhida fora da folha.
Também guarda o instante de criação de cada par (p_t) para rastrear a origem dos encontros.

[Vocabulário, 28/11: aqui "fibra" quer dizer cada Upro do nervo (sentido neurobiológico de axônio). No oficial, a
fibra é o Cpro, o feixe das Upros de uma faixa. Os nomes dos contadores ficam como estão para ler os dados já gravados.]

V0.19 — motor mínimo do Sdom: formação das primeiras malhas a partir das incidências da borda da V0.18.

Escopo [R 24/11]: só a formação das primeiras malhas, sem processos posteriores (sem poda, sem Utad, sem troca de sinal,
sem crescimento lento). Tudo excita. Determinístico [R 20/11; mantido em 27/11].

Regras usadas (toy-experiments/v19/decisoes-em-construcao.md e estado-e-orientacoes.md):
- espaço em cubos de 20 µm; velocidade basal 0,3 m/s (≈ 66,7 µs por cubo) [R];
- fracasso = incidência que expirou sem integrar; a Ustr registra os fracassos do seu território [R];
- território: partição por proximidade (no instante zero, o bloco 2 × 2 de pontos da Ustr) [R]; condição "sem relações" [R];
- coincidência: dois fracassos na janela de integração da Uint, comparados só dentro do território [R];
- alcance só local [R 27/11];
- Uint candidata no cubo livre mais próximo do par, do lado de dentro, caminhos o mais iguais possível [R 27/11];
- crescimento por coincidência: cada ramo cresce 1 cubo a cada ~12 coincidências do par e só funciona quando chega [R 27/11];
- exuberância pela incerteza: diferença de chegada estável → 1 candidata; variável → variantes espalhadas pela faixa
  observada (≥ 1 cubo entre elas); integrou → o par para de ganhar candidatas [R 27/11];
- Uint: limiar 1,5; 0,6 ms da chegada ao disparo; refratariedade 0,5 ms; um só conjunto de parâmetros [R 24/11];
- regra do ramo: promoção por participação na janela de integração do disparo; punição de uma fração da própria força
  para chegadas até ~34 ms depois do disparo; eliminação após 1.000 disparos sem participar — na V0.19 só observada
  (contada), sem remover [R 24/11: "fica estruturalmente, e vemos se será chamada"];
- Upros que saem de Uints: reserva de efeito da V0.18 [R 24/11];
- força inicial do ramo = 1,5 / 4,6 ≈ 0,33 (fibra jovem, Kladisios, Fischer e Felmy 2020); chegada = força × magnitude [R 27/11].

PROVISÓRIO NO PILOTO [A] (não decidido; a levar ao responsável): ver a lista PROVISORIO abaixo.
"""
import numpy as np
from numba import njit

CUBO_S = 0.02e-3 / 0.3            # s por cubo à velocidade basal (≈ 66,7 µs)
# Nervo [R 27/11]: a fibra é a Upro que nasce no ponto transdutivo (a vaga) quando chega estímulo, e cresce até a zona de
# entrada do núcleo: 790 cubos (15,8 mm, comprimento medido no gato, Rattay et al. 2013), 1 cubo a cada ~12 reacessos do
# ponto (a mesma regra de crescimento dos ramos). Velocidade basal (sem mielina; a Utad fica para a próxima versão): ~53 ms.
NERVO = 790
TR_PASSOS = 12 * NERVO
TR_S = NERVO * CUBO_S

# ---- números aprovados ----
LIMIAR, T_DISPARO, REFR_UINT = 1.5, 0.6e-3, 0.5e-3
J_RAPIDA, J_LENTA = 0.3e-3, 0.9e-3
PASSO_COINC = 12                  # coincidências por cubo de crescimento [R 27/11]
PUN_JANELA, ELIM_N = 34e-3, 1000

# ---- PROVISÓRIO no piloto [A] ----
PROVISORIO = {
    "janela de coincidência da Ustr": "0,3 ms (a componente rápida)",
    "forma da janela de integração": "chegada vale 1 até 0,3 ms e 0,5 de 0,3 a 0,9 ms",
    "ganho por participação": "+0,0065 (V0.17)",
    "fração da punição": "1/60 da própria força por chegada tardia",
    "Uint no cubo escolhido já ocupado por outra Uint": "reutiliza a mesma Uint (convergência)",
    "variantes": "ramo do emissor que chega antes, alongado em j cubos (j inteiro na faixa observada de diferenças)",
    "teto de variantes por par": "8",
}
import os
FORCA0 = float(os.environ.get("V19_FORCA0", str(1.5 / 4.6)))   # [R 27/11] fibra jovem ≈ 1/4,6 do limiar (Kladisios et al. 2020); variável de ambiente só para ensaios (usar outro NUMBA_CACHE_DIR)
GANHO, FRAC_PUN, MAXVAR = 0.0065, 1.0 / 60.0, 8

MAXM = 32          # membros por território (pontos + Uints)
RING = 64          # chegadas guardadas por Uint
HCAP = 1 << 22     # capacidade do heap de eventos

# ---------------- heap: (instante, tipo, a, b, c, w) ----------------
@njit(cache=True)
def _push(n, ht, hk, ha, hb, hc, hw, t, k, a, b, c, w):
    j = n
    ht[j] = t; hk[j] = k; ha[j] = a; hb[j] = b; hc[j] = c; hw[j] = w
    while j > 0:
        p = (j - 1) >> 1
        if ht[p] <= ht[j]:
            break
        ht[p], ht[j] = ht[j], ht[p]; hk[p], hk[j] = hk[j], hk[p]; ha[p], ha[j] = ha[j], ha[p]
        hb[p], hb[j] = hb[j], hb[p]; hc[p], hc[j] = hc[j], hc[p]; hw[p], hw[j] = hw[j], hw[p]
        j = p
    return n + 1

@njit(cache=True)
def _pop(n, ht, hk, ha, hb, hc, hw):
    t = ht[0]; k = hk[0]; a = ha[0]; b = hb[0]; c = hc[0]; w = hw[0]
    n -= 1
    ht[0] = ht[n]; hk[0] = hk[n]; ha[0] = ha[n]; hb[0] = hb[n]; hc[0] = hc[n]; hw[0] = hw[n]
    j = 0
    while True:
        l = 2 * j + 1; r = l + 1; m = j
        if l < n and ht[l] < ht[m]: m = l
        if r < n and ht[r] < ht[m]: m = r
        if m == j:
            break
        ht[m], ht[j] = ht[j], ht[m]; hk[m], hk[j] = hk[j], hk[m]; ha[m], ha[j] = ha[j], ha[m]
        hb[m], hb[j] = hb[j], hb[m]; hc[m], hc[j] = hc[j], hc[m]; hw[m], hw[j] = hw[j], hw[m]
        j = m
    return n, t, k, a, b, c, w

@njit(cache=True)
def _chave(x, y, z):
    return ((x + 8192) << 28) | ((y + 8192) << 14) | (z + 8192)

@njit(cache=True)
def _reserva(q, s, dt, P):
    """Reserva de efeito da V0.18 (Q = 1): estado depois de dt sem gastos (mesma fórmula fechada de v18/borda/motor.py)."""
    if dt <= 0.0:
        return q, s
    a11, a12, a21, a22, l1, l2 = P[0], P[1], P[2], P[3], P[4], P[5]
    e1, e2 = np.exp(l1 * dt), np.exp(l2 * dt)
    c0 = (l1 * e2 - l2 * e1) / (l1 - l2); c1 = (e1 - e2) / (l1 - l2)
    y0, y1 = q - 1.0, s - 1.0
    return 1.0 + c0 * y0 + c1 * (a11 * y0 + a12 * y1), 1.0 + c0 * y1 + c1 * (a21 * y0 + a22 * y1)

@njit(cache=True)
def simular(ev_t, ev_p, ev_m, lado, px, py, pz, pu, ux, uy, uz, BU, by0, bz0, PG, fG,
            nervo, modo, LUT, la0,
            ex, ey, ez, eu, mem, nmem, pslot, lastf, cubos,
            p_a, p_b, p_u, p_cnt, p_dmin, p_dmax, p_r0, p_r1, p_nv, p_vr,
            r_src, r_dst, r_len, r_atr, r_f, r_ok, r_part, r_sem, r_head, r_next, r_born, a_head, a_next,
            u_ring_t, u_ring_a, u_ring_r, u_ring_i, u_rn, u_refr, u_pend, u_last, u_q, u_s, u_qt, u_nin,
            integ, cont, ser, log_r, log_u, log_s, log_f, t_fim, W, ht, hk, ha, hb, hc, hw, glob, t_ini, ne0, npar0, nr0, obs, log_c, tr_cnt, log_t, r_ch,
            cond, xfolha, p_t):
    """Processa um ouvido. Emissores: pontos 0..N-1; Uints N.. . Devolve (n_emissores, n_pares, n_ramos)."""
    N = px.shape[0]
    TRP = 12 * nervo; TRS = nervo * CUBO_S; MRC = max(1, TRP // 10)
    ne = ne0; npar = npar0; nr = nr0          # o Sdom continua de onde parou (não zera entre apresentações)
    nev = ev_t.shape[0]
    MASK = integ.shape[0] - 1                 # anel de marcas de integração (potência de 2)
    nh = glob[0]
    base_id = glob[1]
    t = 0.0; tipo = 0; a = 0; b = 0; c = 0; w = 0.0; e = 0; m = 0.0; iid = 0; fr_t = 0.0; fr_e = 0
    iu_next = glob[2]              # ids das incidências emitidas por Uints (faixa própria)
    j = 0
    seg = 0
    while t_ini + seg + 1.0 <= (ev_t[0] if nev > 0 else t_ini):
        seg += 1
    while True:
        if nh >= HCAP - 1000:
            cont[14] += 1
            break
        # próximo evento: emissão da borda ou do heap
        tb = ev_t[j] if j < nev else 1e18
        th = ht[0] if nh > 0 else 1e18
        if tb >= 1e17 and th >= 1e17:
            break
        if tb > t_fim and th > t_fim:
            break                  # o resto do heap fica para a próxima chamada
        if tb <= th:
            t = tb; tipo = 9; e = np.int64(ev_p[j]); m = np.float64(ev_m[j]); iid = base_id + j; j += 1
        else:
            nh, t, tk, a, b, c, w = _pop(nh, ht, hk, ha, hb, hc, hw)
            tipo = np.int64(tk)
        while t >= t_ini + seg + 1.0 and seg < ser.shape[0] - 1:      # série por segundo
            ser[seg, 0] = ne - N; ser[seg, 1] = nr; ser[seg, 2] = cont[6]; ser[seg, 3] = cont[3]; ser[seg, 4] = cont[1]
            seg += 1
        if tipo == 9 or tipo == 3:
            # ---- emissão (borda: tipo 9; Uint: tipo 3) ----
            if tipo == 3:
                e = a; m = w; iid = c
                if e >= N:
                    cont[0] += 1
            else:
                integ[iid & MASK] = 0
                cont[0] += 1
                # ---- a fibra (Upro do ponto transdutivo): cresce com os reacessos; depois leva a incidência até a ponta ----
                if tr_cnt[e] < TRP:
                    tr_cnt[e] += 1
                    cont[17] += 1              # incidência que expirou no próprio ponto (a fibra ainda não chegou ao núcleo)
                    if (tr_cnt[e] % MRC == 0 or tr_cnt[e] == TRP) and cont[18] < log_t.shape[0]:   # marca a fibra pronta (1,0) mesmo quando TRP não é múltiplo
                        log_t[cont[18], 0] = t; log_t[cont[18], 1] = e; log_t[cont[18], 2] = tr_cnt[e] / TRP
                        cont[18] += 1
                    continue
                cont[22] += 1                  # incidência que entrou na fibra (caminho percorrido)
                nh = _push(nh, ht, hk, ha, hb, hc, hw, t + TRS, 3, e, 0, iid, m)
                continue
            r = r_head[e]
            if r < 0:
                # sem ramo adiante: a incidência parou aqui (na ponta da fibra, ou na Uint que a emitiu) sem integrar;
                # a Ustr do território registra (incidência que não integrou)
                cont[20] += 1
                fr_t = t; fr_e = e
                tipo = 7
            else:
                dmax = 0.0
                cont[21] += 1                      # incidência que desceu por ramos (caminho percorrido)
                while r >= 0:
                    nh = _push(nh, ht, hk, ha, hb, hc, hw, t + r_atr[r], 0, r_dst[r], r, iid, m * r_f[r])
                    if r_atr[r] > dmax: dmax = r_atr[r]
                    r = r_next[r]
                nh = _push(nh, ht, hk, ha, hb, hc, hw, t + dmax + J_LENTA + 1e-9, 2, e, iid, 0, t)
                continue
        if tipo == 2:
            # ---- verificação de fracasso de uma incidência que desceu por ramos ----
            if integ[b & MASK] != 0:
                cont[2] += 1
                continue
            cont[19] += 1                          # parou numa Uint sem integrar
            fr_t = w; fr_e = a; tipo = 7
        if tipo == 7:
            # ---- fracasso: a Ustr compara com os fracassos vivos dos outros membros do território ----
            cont[1] += 1
            U = eu[fr_e]
            k = 0
            for s0 in range(nmem[U]):
                if mem[U, s0] == fr_e:
                    k = s0
                    break
            cont[4] += 1   # comparações feitas: uma por fracasso (custo linear)
            for s1 in range(nmem[U]):
                if s1 == k:
                    continue
                e2 = mem[U, s1]
                d = fr_t - lastf[e2]
                if d > W or d < -W:
                    continue
                # ---- coincidência do par (fr_e, e2) ----
                cont[3] += 1
                lo = k if k < s1 else s1; hi = s1 if k < s1 else k
                pi = pslot[U, lo, hi]
                ea = mem[U, lo]; eb = mem[U, hi]
                dab = (fr_t - lastf[e2]) if fr_e == eb else (lastf[e2] - fr_t)     # chegada de b − chegada de a
                if pi < 0 and (ne >= ex.shape[0] - 1 or npar >= p_a.shape[0] - 1 or nr >= r_src.shape[0] - 4 - MAXVAR):
                    cont[11] += 1          # capacidade esgotada: não cria (contado)
                    continue
                if pi < 0:
                    # primeira coincidência: Uint candidata no cubo livre mais próximo, do lado de dentro
                    xa = ex[ea]; ya = ey[ea]; za = ez[ea]; xb = ex[eb]; yb = ey[eb]; zb = ez[eb]
                    mx = (xa + xb) * 0.5; my = (ya + yb) * 0.5; mz = (za + zb) * 0.5
                    best = 1e18; bx = np.int64(0); byy = np.int64(0); bzz = np.int64(0); bocc = np.int64(-1)
                    fora_adm = False
                    for cx in range(int(np.floor(mx)) - 3, int(np.ceil(mx)) + 4):
                        if cond == 1:
                            if cx != xfolha:
                                continue                 # A: só a folha
                        else:
                            if lado * cx > lado * xfolha:
                                continue                 # B: a folha ou mais para dentro da cabeça
                        for cy in range(int(np.floor(my)) - 3, int(np.ceil(my)) + 4):
                            for cz in range(int(np.floor(mz)) - 3, int(np.ceil(mz)) + 4):
                                kk = _chave(cx, cy, cz)
                                occ = np.int64(-1)
                                if kk in cubos:
                                    occ = np.int64(cubos[kk])
                                if occ >= 0 and occ < N:
                                    continue           # ocupado por ponto (não acontece aqui: as pontas ficam fora da caixa admissível)
                                if occ <= -2:
                                    continue           # ocupado por Ustr
                                if cx != xfolha:
                                    fora_adm = True
                                d1 = np.sqrt((cx - xa) ** 2 + (cy - ya) ** 2 + (cz - za) ** 2)
                                d2 = np.sqrt((cx - xb) ** 2 + (cy - yb) ** 2 + (cz - zb) ** 2)
                                sc = abs(d1 - d2) * 1000.0 + (d1 + d2)
                                if sc < best - 1e-9:
                                    best = sc; bx = cx; byy = cy; bzz = cz; bocc = occ
                    if fora_adm:
                        cont[24] += 1          # B: a busca admitiu ao menos um cubo fora da folha
                    if best >= 1e17:
                        cont[23] += 1          # nenhum cubo admissível: encerra a tentativa sem criar Uint
                        continue
                    if bx != xfolha:
                        cont[25] += 1          # a escolha caiu fora da folha
                    uint = np.int64(0)
                    if bocc >= N:
                        uint = bocc                     # reutiliza a Uint que já está ali (provisório)
                    else:
                        uint = ne; ne += 1
                        ex[uint] = bx; ey[uint] = byy; ez[uint] = bzz
                        cubos[_chave(bx, byy, bzz)] = uint
                        bu = -1; bd = 1e18
                        if modo == 1:
                            # compacta: Ustr de centro mais próximo na grade 3 x 3 x 3; empate -> menor índice
                            kx = int(np.floor((bx - la0[0]) / 3.0 + 0.5)); ky = int(np.floor((byy - la0[1]) / 3.0 + 0.5)); kz = int(np.floor((bzz - la0[2]) / 3.0 + 0.5))
                            for ox in range(-2, 3):
                                for oy in range(-2, 3):
                                    for oz in range(-2, 3):
                                        ix = kx + ox; iy = ky + oy; iz = kz + oz
                                        if ix < 0 or iy < 0 or iz < 0 or ix >= LUT.shape[0] or iy >= LUT.shape[1] or iz >= LUT.shape[2]:
                                            continue
                                        uu = LUT[ix, iy, iz]
                                        if uu < 0:
                                            continue
                                        dd = (ux[uu] - bx) ** 2 + (uy[uu] - byy) ** 2 + (uz[uu] - bzz) ** 2
                                        if dd < bd or (dd == bd and uu < bu):
                                            bd = dd; bu = uu
                        bby = (byy - 1) // 2; bbz = (bzz - 1) // 2
                        for oy in range(-4 if modo == 0 else 0, 5 if modo == 0 else 0):
                            for oz in range(-4, 5):
                                iy = bby + oy - by0; iz = bbz + oz - bz0
                                if iy < 0 or iz < 0 or iy >= BU.shape[0] or iz >= BU.shape[1]:
                                    continue
                                uu = BU[iy, iz]
                                if uu < 0:
                                    continue
                                dd = (ux[uu] - bx) ** 2 + (uy[uu] - byy) ** 2 + (uz[uu] - bzz) ** 2
                                if dd < bd:
                                    bd = dd; bu = uu
                        eu[uint] = bu
                        if bu >= 0 and nmem[bu] < MAXM:
                            mem[bu, nmem[bu]] = uint; nmem[bu] += 1
                        else:
                            cont[11] += 1
                        u_q[uint] = 1.0; u_s[uint] = 1.0; u_qt[uint] = 0.0
                        u_refr[uint] = -1.0; u_pend[uint] = -1.0; u_last[uint] = -1.0
                        lu = uint - N
                        if lu < log_u.shape[0]:
                            log_u[lu, 0] = t; log_u[lu, 1] = bx; log_u[lu, 2] = byy; log_u[lu, 3] = bzz
                            log_u[lu, 4] = 1.0 if (ea >= N or eb >= N) else 0.0
                    pi = npar; npar += 1
                    pslot[U, lo, hi] = pi
                    p_t[pi] = t
                    p_a[pi] = ea; p_b[pi] = eb; p_u[pi] = uint; p_cnt[pi] = 0
                    p_dmin[pi] = dab; p_dmax[pi] = dab; p_nv[pi] = 0
                    # ramos-base (de a e de b para a Uint), compartilhados se já existirem
                    for q2 in range(2):
                        src = ea if q2 == 0 else eb
                        rr = -1
                        # procura ramo-base já existente (src → uint, sem alongamento) entre os ramos do emissor
                        x9 = a_head[src]
                        while x9 >= 0:
                            if r_dst[x9] == uint and r_sem[x9] == 0:
                                rr = x9
                                break
                            x9 = a_next[x9]
                        if rr < 0:
                            rr = nr; nr += 1
                            L = max(abs(ex[src] - ex[uint]), abs(ey[src] - ey[uint]), abs(ez[src] - ez[uint]))
                            de = np.sqrt((ex[src] - ex[uint]) ** 2 + (ey[src] - ey[uint]) ** 2 + (ez[src] - ez[uint]) ** 2)
                            r_src[rr] = src; r_dst[rr] = uint; r_len[rr] = L; r_atr[rr] = de * CUBO_S
                            r_f[rr] = FORCA0; r_ok[rr] = 0; r_part[rr] = 0; r_sem[rr] = 0; r_next[rr] = -1; r_born[rr] = -1.0
                            a_next[rr] = a_head[src]; a_head[src] = rr
                        if q2 == 0:
                            p_r0[pi] = rr
                        else:
                            p_r1[pi] = rr
                    cont[5] += 1
                # ---- crescimento e exuberância ----
                p_cnt[pi] += 1
                if dab < p_dmin[pi]: p_dmin[pi] = dab
                if dab > p_dmax[pi]: p_dmax[pi] = dab
                supr = r_part[p_r0[pi]] > 0 or r_part[p_r1[pi]] > 0
                if supr:
                    cont[10] += 1
                cn = p_cnt[pi]
                if cn % PASSO_COINC == 0:
                    stp = cn // PASSO_COINC
                    for q2 in range(2 + p_nv[pi]):
                        rr = p_r0[pi] if q2 == 0 else (p_r1[pi] if q2 == 1 else p_vr[pi, q2 - 2])
                        if r_ok[rr] == 0 and stp <= r_len[rr] and cont[15] < log_s.shape[0]:
                            log_s[cont[15], 0] = t; log_s[cont[15], 1] = rr; log_s[cont[15], 2] = stp
                            cont[15] += 1
                for q2 in range(2):
                    rr = p_r0[pi] if q2 == 0 else p_r1[pi]
                    if r_ok[rr] == 0 and cn >= PASSO_COINC * max(r_len[rr], 1):
                        r_ok[rr] = 1; r_born[rr] = t
                        r_next[rr] = r_head[r_src[rr]]; r_head[r_src[rr]] = rr
                        cont[6] += 1
                        lr = cont[6] - 1
                        if lr < log_r.shape[0]:
                            log_r[lr, 0] = t; log_r[lr, 1] = rr; log_r[lr, 2] = r_src[rr]; log_r[lr, 3] = r_dst[rr]; log_r[lr, 4] = r_len[rr]
                # variantes: só depois dos ramos-base, se a diferença de chegada variou ≥ 1 cubo e o par não integrou
                if (not supr) and r_ok[p_r0[pi]] == 1 and r_ok[p_r1[pi]] == 1 and p_nv[pi] < MAXVAR:
                    jlo = int(np.round(p_dmin[pi] / CUBO_S)); jhi = int(np.round(p_dmax[pi] / CUBO_S))
                    if jhi - jlo >= 1:
                        for jj in range(jlo, jhi + 1):
                            if jj == 0 or p_nv[pi] >= MAXVAR or nr >= r_src.shape[0] - 2:
                                continue
                            src = p_a[pi] if jj > 0 else p_b[pi]     # b chega depois (jj>0): alonga o ramo de a
                            base = p_r0[pi] if jj > 0 else p_r1[pi]
                            Lv = r_len[base] + abs(jj)
                            ja = False
                            for vv in range(p_nv[pi]):
                                x9 = p_vr[pi, vv]
                                if r_src[x9] == src and r_len[x9] == Lv:
                                    ja = True
                                    break
                            if ja:
                                continue
                            rr = nr; nr += 1
                            r_src[rr] = src; r_dst[rr] = p_u[pi]; r_len[rr] = Lv
                            r_atr[rr] = r_atr[base] + abs(jj) * CUBO_S
                            r_f[rr] = FORCA0; r_ok[rr] = 0; r_part[rr] = 0; r_sem[rr] = 1; r_next[rr] = -1; r_born[rr] = -1.0
                            a_next[rr] = a_head[src]; a_head[src] = rr
                            p_vr[pi, p_nv[pi]] = rr; p_nv[pi] += 1
                            cont[7] += 1
                            for stp in range(1, min(cn // PASSO_COINC, Lv) + 1):
                                if cont[15] < log_s.shape[0]:
                                    log_s[cont[15], 0] = t; log_s[cont[15], 1] = rr; log_s[cont[15], 2] = stp
                                    cont[15] += 1
                    for vv in range(p_nv[pi]):
                        rr = p_vr[pi, vv]
                        if r_ok[rr] == 0 and cn >= PASSO_COINC * r_len[rr]:
                            r_ok[rr] = 1; r_born[rr] = t
                            r_next[rr] = r_head[r_src[rr]]; r_head[r_src[rr]] = rr
                            cont[6] += 1
                            lr = cont[6] - 1
                            if lr < log_r.shape[0]:
                                log_r[lr, 0] = t; log_r[lr, 1] = rr; log_r[lr, 2] = r_src[rr]; log_r[lr, 3] = r_dst[rr]; log_r[lr, 4] = r_len[rr]
            if fr_t > lastf[fr_e]:
                lastf[fr_e] = fr_t
            continue
        if tipo == 0:
            # ---- chegada numa Uint ----
            u = a; r = b; iid = c; amp = w
            r_ch[r] += 1                           # chegada por este ramo (para medir quais malhas são percorridas)
            # punição: chegada depois do disparo, até 34 ms
            if u_last[u] >= 0.0 and t > u_last[u] and t - u_last[u] <= PUN_JANELA:
                r_f[r] -= FRAC_PUN * r_f[r]
                cont[9] += 1
            # guarda no anel
            pos = u_rn[u] % RING
            u_ring_t[u - N, pos] = t; u_ring_a[u - N, pos] = amp; u_ring_r[u - N, pos] = r; u_ring_i[u - N, pos] = iid
            u_rn[u] += 1
            # janela de observação (só registro para a página; não muda nada na dinâmica)
            if obs[6] <= t <= obs[7] and obs[0] <= ex[u] <= obs[1] and obs[2] <= ey[u] <= obs[3] and obs[4] <= ez[u] <= obs[5]:
                if cont[16] < log_c.shape[0]:
                    vv = 0.0
                    nn2 = min(u_rn[u], RING)
                    for q4 in range(nn2):
                        dt2 = t - u_ring_t[u - N, q4]
                        if dt2 >= 0.0 and dt2 <= J_LENTA:
                            vv += u_ring_a[u - N, q4] * (1.0 if dt2 <= J_RAPIDA else 0.5)
                    log_c[cont[16], 0] = t; log_c[cont[16], 1] = r; log_c[cont[16], 2] = amp; log_c[cont[16], 3] = vv
                cont[16] += 1
            if t < u_refr[u] or u_pend[u] >= 0.0:
                continue
            v = 0.0
            nn = min(u_rn[u], RING)
            for q3 in range(nn):
                dt = t - u_ring_t[u - N, q3]
                if dt < 0.0 or dt > J_LENTA:
                    continue
                v += u_ring_a[u - N, q3] * (1.0 if dt <= J_RAPIDA else 0.5)
            if v >= LIMIAR:
                # integração: participam as chegadas na janela; disparo 0,6 ms depois
                for q3 in range(nn):
                    dt = t - u_ring_t[u - N, q3]
                    if dt < 0.0 or dt > J_LENTA:
                        continue
                    rq = u_ring_r[u - N, q3]
                    r_part[rq] += 1; r_f[rq] += GANHO
                    integ[u_ring_i[u - N, q3] & MASK] = 1
                    cont[8] += 1
                u_pend[u] = t + T_DISPARO
                nh = _push(nh, ht, hk, ha, hb, hc, hw, t + T_DISPARO, 1, u, 0, 0, 0.0)
            continue
        if tipo == 1:
            # ---- disparo da Uint: emite pela sua Upro (reserva de efeito da V0.18) ----
            u = a
            u_pend[u] = -1.0; u_refr[u] = t + REFR_UINT; u_last[u] = t; u_nin[u] += 1
            if cont[12] < log_f.shape[0]:
                log_f[cont[12], 0] = t; log_f[cont[12], 1] = u - N
            cont[12] += 1
            q, s = _reserva(u_q[u], u_s[u], t - u_qt[u], PG)
            m = q
            u_q[u] = q - fG * q; u_s[u] = s; u_qt[u] = t
            iid = iu_next; iu_next += 1
            integ[iid & MASK] = 0
            nh = _push(nh, ht, hk, ha, hb, hc, hw, t, 3, u, 0, iid, m)
            continue
    ser[seg, 0] = ne - N; ser[seg, 1] = nr; ser[seg, 2] = cont[6]; ser[seg, 3] = cont[3]; ser[seg, 4] = cont[1]
    glob[0] = nh; glob[1] = base_id + nev; glob[2] = iu_next
    return ne, npar, nr

CONTADORES = ["emissões", "incidências que não integraram", "incidências que integraram (desceram por ramo)", "coincidências", "comparações",
              "pares", "ramos que passaram a funcionar", "variantes criadas", "participações (promoções)", "punições",
              "coincidências em pares já integrados (sem novas candidatas)", "sem lugar (território cheio ou capacidade esgotada)",
              "disparos de Uint", "incidências de Uint sem id (capacidade)", "heap cheio", "passos de crescimento registrados", "chegadas na janela de observação", "parou no ponto (fibra ainda crescendo)", "marcas de crescimento das fibras", "parou numa Uint sem integrar", "parou sem ramo adiante (ponta da fibra ou Uint)", "desceu por ramos", "entrou na fibra", "busca sem cubo admissível (sem Uint)", "busca com cubo admissível fora da folha", "Uint escolhida fora da folha"]
