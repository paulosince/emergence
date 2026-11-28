"""V0.19 — coordenadas candidatas da entrada auditiva compacta (proposta de Paulo e Clara, 28/11:
proposta-coordenadas-auditivas.md). Parametrização da Claudia, A REVISAR pelo responsável. Só geometria: nada aqui
altera o motor nem a V0.18.

Três conjuntos de coordenadas por ouvido:
1. ORIGEM na Utrd: a faixa existente (V0.18, ordem de banda, posição e sensibilidade) disposta numa espiral 3D aberta.
   A espiral só organiza a origem: com percurso comum, não muda nenhum atraso.
2. CHEGADA das Upros: meia-esfera de raio R por ouvido, face plana voltada para o nervo, cúpula para dentro da cabeça.
   Eixo tonotópico tangente à face plana (y, o mesmo nos dois ouvidos: espelho só em x). Cada banda recebe um trecho do
   eixo proporcional ao seu número de pontos (fatias de mesma espessura não cabem nas pontas). Dentro da fatia (meio
   disco): posição fina da banda -> ângulo; sensibilidade -> raio (uniforme em área); a espessura da fatia é percorrida em
   sequência quase uniforme. Cada ponto ocupa o cubo livre da fatia mais próximo do seu alvo (preenche a fatia inteira,
   sem amontoar nas pontas).
   Um ponto de chegada por Upro.
3. TERRITÓRIOS: centros das Ustr numa grade regular de coordenadas inteiras (passos 3 x 4 x 3 em t, n, v) dentro do volume;
   cada chegada pertence à Ustr de centro mais próximo (empate: menor índice entre todas as empatadas). Territórios exclusivos, sem comunicação entre Ustr [R].
Percurso: comprimento comum de PERCURSO cubos para todas as Upros (atrasos iguais, como no histórico).
"""
import numpy as np
from scipy.spatial import cKDTree

MEIA_DIST = 2500
PERCURSO = 263               # [R, sugestão de Paulo: ~1/3 de 790] comprimento comum do percurso das Upros de entrada
R = 44                       # [E] raio da meia-esfera (cubos): ~8 cubos por ponto de chegada
GRADE_USTR = (3, 3, 3)       # [R 28/11] grade de Ustr 3 x 3 x 3 (passo ímpar: sem empates de plano), ~1 Ustr por 3,2 pontos; antes 3 x 4 x 3
VOLTAS = 2.5                 # [E] voltas da espiral (cóclea humana tem ~2,5 voltas; de memória, a conferir)
R_BASE, R_APICE, ALTURA = 1.0, 0.45, 100   # [E] raio relativo base/ápice (escalado para caber os cubos da faixa) e altura (cubos)
D_FACE = 50                  # [R 28/11, "~50"] distância (cubos) do plano da base da espiral até a face plana da meia-esfera, rumo ao centro (antes 120 [E])
RHO_MODIOLO, R_NERVO = 12, 10   # [E] desenho: raio do eixo da espiral onde as Upros de uma banda se juntam (Cpro) e raio do nervo

def espiral(x, y, z, banda, lado):
    """Origem de cada ponto na espiral: posição ao longo da faixa (y, da base ao ápice) -> comprimento de arco; a coluna de
    sensibilidade (z) desloca o ponto na direção radial (largura da faixa)."""
    s = (y.max() - y).astype(float)                    # 0 = base = extremo agudo (como na cóclea); cresce até o ápice (graves)
    Ltot = s.max() + 1
    th = np.linspace(0, 2 * np.pi * VOLTAS, 20001)
    def comp(esc):
        r = esc * (R_BASE + (R_APICE - R_BASE) * th / th[-1]); h = ALTURA * th / th[-1]
        dr = np.gradient(r, th); dh = np.gradient(h, th)
        return np.concatenate(([0], np.cumsum(np.sqrt(r[1:] ** 2 + dr[1:] ** 2 + dh[1:] ** 2) * np.diff(th)))), r, h
    lo, hi = 1.0, 1000.0
    for _ in range(60):
        md = (lo + hi) / 2; L, _, _ = comp(md)
        lo, hi = (md, hi) if L[-1] < Ltot else (lo, md)
    L, r, h = comp((lo + hi) / 2)
    tt = np.interp(s, L, th); rr = np.interp(s, L, r) + (z - z.min() - 7.5); hh = np.interp(s, L, h)
    ox = lado * (MEIA_DIST - ALTURA + hh)              # [R 28/11] base (agudos) voltada para o núcleo, ápice para fora (como o nervo saindo pela base do modíolo)
    oy = rr * np.cos(tt); oz = rr * np.sin(tt)
    return np.stack([ox, oy, oz], 1), float(r[0]), float(r[-1])

def _t_de_fracao(f):
    """Posição t no eixo tonotópico (−R..R) em que o volume da meia-esfera à esquerda é a fração f."""
    V = lambda t: (R ** 2 * (t + R) - (t ** 3 + R ** 3) / 3) / (4 * R ** 3 / 3)
    lo, hi = -R * np.ones_like(f), R * np.ones_like(f)
    for _ in range(60):
        md = (lo + hi) / 2; m = V(md) < f; lo = np.where(m, md, lo); hi = np.where(m, hi, md)
    return (lo + hi) / 2

def grade_ustr(config="333"):
    """Centros das Ustr em coordenadas inteiras (t, n, v), passos 3 x 4 x 3, sem arredondamento (revisão de 28/11).
    t e v: ..., -3, 0, 3, ... (simétricos em torno do meio); n: 'regular' = 2, 6, 10, ... (primeira camada a 2 cubos da face
    plana, metade do passo); 'face' = 0, 4, 8, ... (uma camada de centros na própria face)."""
    st, sn, sv = (3, 4, 3) if config in ("regular", "face") else GRADE_USTR      # 'regular'/'face': a grade anterior, para comparação
    n0 = {"regular": 2, "face": 0, "333": 1}[config]          # '333': passo ímpar em n, primeira camada em n = 1 (cobre n = 0, 1, 2)
    tt = np.arange(-(R // st) * st, R + 1, st); vv = np.arange(-(R // sv) * sv, R + 1, sv); nn = np.arange(n0, R + 1, sn)
    T_, N_, V_ = np.meshgrid(tt, nn, vv, indexing="ij")
    U = np.stack([T_.ravel(), N_.ravel(), V_.ravel()], 1)
    return U[(U ** 2).sum(1) <= R * R]

def territorio(U, pts):
    """Ustr de centro mais próximo; empate na distância: o menor índice entre TODAS as empatadas."""
    arv = cKDTree(U.astype(float)); k = 8
    while True:
        d, i = arv.query(pts.astype(float), k=min(k, len(U)))
        dm = d[:, :1]; emp = np.isclose(d, dm, rtol=0, atol=1e-9)
        if not emp[:, -1].any() or k >= len(U): break
        k *= 2
    return np.where(emp, i, len(U) + 1).min(1)

def compacta(x, y, z, banda, lado, config="333"):
    """Chegadas na meia-esfera. Devolve (xyz inteiros no Sdom, t, n, v, fatias por banda, Ustr xyz, território por ponto)."""
    N = len(x); nb = int(banda.max()) + 1; cnt = np.bincount(banda, minlength=nb)
    f = np.concatenate(([0], np.cumsum(cnt))) / N
    tb = _t_de_fracao(f)                                # limites das fatias
    xf = lado * (MEIA_DIST - ALTURA - D_FACE)           # face plana, D_FACE além da base da espiral; n cresce para dentro (x -> 0)
    U = grade_ustr(config)
    ocup = set(map(tuple, U))
    col = z - z.min()
    T = np.zeros(N, int); Nn = np.zeros(N, int); Vv = np.zeros(N, int)
    for b in range(nb):
        idx = np.where(banda == b)[0]; t0, t1 = tb[b], tb[b + 1]
        # cubos livres da fatia (dentro do volume, n >= 0, sem Ustr), em coordenadas normalizadas do meio disco
        tt = np.arange(int(np.floor(t0)), int(np.ceil(t1)) + 1)
        cand = [(t, n, v) for t in tt if t0 <= t + 0.5 and t - 0.5 < t1 for n in range(0, R + 1) for v in range(-R, R + 1)
                if t * t + n * n + v * v <= R * R and (t, n, v) not in ocup]
        cand = np.array(cand, float)
        rmax = np.sqrt(np.maximum(R ** 2 - cand[:, 0] ** 2, 1.0))
        rho = np.hypot(cand[:, 1], cand[:, 2]); phi = np.arctan2(cand[:, 1], cand[:, 2])     # phi em [0, pi]
        espc = max(t1 - t0, 1.0)
        Cn = np.stack([(cand[:, 0] - t0) / espc, phi / np.pi, (rho / rmax) ** 2], 1)
        # alvo de cada ponto: posição fina -> ângulo; sensibilidade -> raio (uniforme em área); camadas pela ordem
        alvos, ordem = [], []
        for c in range(16):
            ic = idx[col[idx] == c]; ic = ic[np.argsort(y[ic])]; Lc = len(ic)
            for i, pnt in enumerate(ic):
                alvos.append(((((i * 16 + c) * 0.618) % 1.0), (i + 0.5) / max(Lc, 1), (c + 0.5) / 16)); ordem.append(pnt)
        alvos = np.array(alvos); livre = np.ones(len(cand), bool); arv = cKDTree(Cn * [0.5, 1.0, 1.0])
        for a, pnt in zip(alvos, ordem):                      # cada ponto pega o cubo livre mais próximo do seu alvo
            k = 16
            while True:
                dd, ii = arv.query(a * [0.5, 1.0, 1.0], k=min(k, len(cand)))
                ii = np.atleast_1d(ii); ok = ii[livre[ii]]
                if len(ok): q = ok[0]; break
                k *= 4
            livre[q] = False; T[pnt], Nn[pnt], Vv[pnt] = cand[q].astype(int); ocup.add(tuple(cand[q].astype(int)))
    terr = territorio(U, np.stack([T, Nn, Vv], 1))
    xyz = np.stack([xf - lado * Nn, T, Vv], 1)                       # Sdom: x pelo eixo normal, y = t, z = v
    uxyz = np.stack([xf - lado * U[:, 1], U[:, 0], U[:, 2]], 1)
    return dict(xyz=xyz, t=T, n=Nn, v=Vv, fatias=tb, ustr=uxyz, U=U, terr=terr, xf=xf)


def rota(org, che, banda, lado, compacta):
    """Pontos de controle do DESENHO de cada Upro do nervo (o motor não tem trajeto; só o comprimento de condução):
    origem -> Cpro da banda (as Upros de uma banda se juntam) -> nervo (as Cpro seguem juntas, em ordem tonotópica) ->
    leque até a chegada. Compacta: a Cpro se forma no eixo da espiral (modíolo) e as Cpro saem juntas pela base, rumo à
    face da meia-esfera. Faixa: cada Cpro corre reta da faixa até a zona de entrada, sem se unir às outras.
    Devolve (N, 5, 3) em cubos."""
    s_in = -lado; nb = int(banda.max()) + 1; N = len(org); C = np.zeros((N, 5, 3))
    C[:, 0] = org; C[:, 4] = che
    if compacta:
        th = np.arctan2(org[:, 2], org[:, 1]); xb = lado * (MEIA_DIST - ALTURA)
        cb = np.bincount(banda, np.cos(th), nb); sb = np.bincount(banda, np.sin(th), nb); tb = np.arctan2(sb, cb)
        xm = np.bincount(banda, org[:, 0], nb) / np.bincount(banda, minlength=nb)
        tm = np.bincount(banda, che[:, 1], nb) / np.bincount(banda, minlength=nb)     # t médio das chegadas da banda
        lane = tm * R_NERVO / R
        xf = lado * (MEIA_DIST - ALTURA - D_FACE)
        C[:, 1] = np.stack([xm[banda], RHO_MODIOLO * np.cos(tb[banda]), RHO_MODIOLO * np.sin(tb[banda])], 1)
        C[:, 2] = np.stack([np.full(N, xb + s_in * 2), lane[banda], np.zeros(N)], 1)
        C[:, 3] = np.stack([np.full(N, xf - s_in * 6), lane[banda], np.zeros(N)], 1)
    else:
        ym = np.bincount(banda, org[:, 1], nb) / np.bincount(banda, minlength=nb); zm = org[:, 2].mean()
        C[:, 1] = np.stack([org[:, 0] + s_in * 15, ym[banda], np.full(N, zm)], 1)
        C[:, 3] = np.stack([che[:, 0] - s_in * 15, ym[banda], np.full(N, zm)], 1)
        C[:, 2] = (C[:, 1] + C[:, 3]) / 2
    return C
