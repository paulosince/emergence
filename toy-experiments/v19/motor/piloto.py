"""V0.19 — piloto do motor mínimo: mede a velocidade (decisão de 24/11: peça inteira ou trechos, depois de um piloto de 10 s).
Uso: python piloto.py <borda.npz> <ouvido: esq|dir> <duração simulada em s>
Grava motor/dados/piloto-<ouvido>-<dur>.npz e imprime contadores e tempo de máquina."""
import os, sys, time, json, pathlib
os.environ.setdefault("NUMBA_CACHE_DIR", "/tmp/numba-v19")
import numpy as np
from numba import types
from numba.typed import Dict

AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI))
import instante_zero as iz, sdom
sys.path.insert(0, str(AQUI.parents[1] / "v18" / "borda"))
import pontos, motor as m18

MAXU, MAXP, MAXR = 100_000, 1_000_000, 4_000_000

def preparar(lado):
    P = pontos.construir()
    x, y, z, banda, posto = iz.faixa(P, lado)
    ux, uy, uz = iz.ustr(x, y, z, lado)
    cap = np.array([len(p["limiar_db"]) for p in P]); off = np.concatenate(([0], np.cumsum(cap)[:-1]))
    return P, x, y, z, banda, posto, ux, uy, uz, off

def rodar(arq, ouvido, dur):
    lado = -1 if ouvido == "esq" else 1
    P, x, y, z, banda, posto, ux, uy, uz, off = preparar(lado)
    N, NU = len(x), len(ux)
    B = np.load(arq)
    t_, f_, k_, m_ = B[f"{ouvido}_t"], B[f"{ouvido}_f"], B[f"{ouvido}_k"], B[f"{ouvido}_m"]
    sel = t_ <= dur
    ev_t = t_[sel].astype(np.float64); ev_p = (off[f_[sel].astype(np.int64)] + k_[sel]).astype(np.int64); ev_m = m_[sel].astype(np.float64)
    # índice do ponto (banda, posto) → posição: faixa() concatena por banda na ordem do posto
    assert np.all(off[banda] + posto == np.arange(N))
    # territórios: bloco 2 × 2 de cada Ustr
    bu_y = (uy - 1) // 2; bu_z = (uz - 1) // 2
    by0, bz0 = bu_y.min(), bu_z.min()
    BU = np.full((bu_y.max() - by0 + 1, bu_z.max() - bz0 + 1), -1, np.int64); BU[bu_y - by0, bu_z - bz0] = np.arange(NU)
    pu = BU[y // 2 - by0, z // 2 - bz0]; assert (pu >= 0).all()
    E = N + MAXU
    ex = np.zeros(E, np.int64); ey = np.zeros(E, np.int64); ez = np.zeros(E, np.int64); eu = np.full(E, -1, np.int64)
    ex[:N], ey[:N], ez[:N], eu[:N] = x, y, z, pu
    mem = np.full((NU, sdom.MAXM), -1, np.int64); nmem = np.zeros(NU, np.int64)
    for i in range(N):
        U = pu[i]; mem[U, nmem[U]] = i; nmem[U] += 1
    pslot = np.full((NU, sdom.MAXM, sdom.MAXM), -1, np.int32)
    lastf = np.full(E, -1e9)
    cubos = Dict.empty(key_type=types.int64, value_type=types.int64)
    for i in range(N): cubos[int(sdom._chave(int(x[i]), int(y[i]), int(z[i])))] = i
    for U in range(NU): cubos[int(sdom._chave(int(ux[U]), int(uy[U]), int(uz[U])))] = -2 - U
    p_a = np.zeros(MAXP, np.int64); p_b = np.zeros(MAXP, np.int64); p_u = np.zeros(MAXP, np.int64); p_cnt = np.zeros(MAXP, np.int64)
    p_dmin = np.zeros(MAXP); p_dmax = np.zeros(MAXP); p_r0 = np.zeros(MAXP, np.int64); p_r1 = np.zeros(MAXP, np.int64)
    p_nv = np.zeros(MAXP, np.int64); p_vr = np.zeros((MAXP, sdom.MAXVAR), np.int64)
    r_src = np.zeros(MAXR, np.int64); r_dst = np.zeros(MAXR, np.int64); r_len = np.zeros(MAXR, np.int64); r_atr = np.zeros(MAXR)
    r_f = np.zeros(MAXR); r_ok = np.zeros(MAXR, np.int8); r_part = np.zeros(MAXR, np.int64); r_sem = np.zeros(MAXR, np.int8)
    r_head = np.full(E, -1, np.int64); r_next = np.full(MAXR, -1, np.int64); r_born = np.full(MAXR, -1.0)
    a_head = np.full(E, -1, np.int64); a_next = np.full(MAXR, -1, np.int64)
    R = sdom.RING
    u_ring_t = np.full((MAXU, R), -1e9); u_ring_a = np.zeros((MAXU, R)); u_ring_r = np.zeros((MAXU, R), np.int64); u_ring_i = np.zeros((MAXU, R), np.int64)
    u_rn = np.zeros(E, np.int64); u_refr = np.full(E, -1.0); u_pend = np.full(E, -1.0); u_last = np.full(E, -1.0)
    u_q = np.ones(E); u_s = np.ones(E); u_qt = np.zeros(E); u_nin = np.zeros(E, np.int64)
    integ = np.zeros(1 << 24, np.int8)
    cont = np.zeros(len(sdom.CONTADORES), np.int64)
    ser = np.zeros((int(dur) + 2, 5))
    log_r = np.zeros((MAXR, 5)); log_u = np.zeros((MAXU, 5)); log_s = np.zeros((8_000_000, 3)); log_f = np.zeros((2_000_000, 2))
    par = json.loads((AQUI.parents[1] / "v18" / "borda" / "calibracao.json").read_text())["parametros"]
    PG = m18.lambdas(1.0, par["tcG"], par["tdG"], par["MG"])
    H = sdom.HCAP
    heap = [np.empty(H), np.empty(H, np.int8), np.empty(H, np.int64), np.empty(H, np.int64), np.empty(H, np.int64), np.empty(H)]
    glob = np.array([0, 0, 1 << 40], np.int64)
    # janela de observação (V19_OBS = "x0,x1,y0,y1,z0,z1,t0,t1" em cubos e s): registra cada chegada nas Uints de lá, para a página
    obs = np.array([float(v) for v in os.environ.get("V19_OBS", "0,0,0,0,0,0,1e18,1e18").split(",")])
    log_c = np.zeros((3_000_000, 4))
    t0 = time.time()
    ne, npar, nr = sdom.simular(ev_t, ev_p, ev_m, lado, x, y, z, pu, ux, uy, uz, BU, by0, bz0, PG, par["fG"],
                                ex, ey, ez, eu, mem, nmem, pslot, lastf, cubos,
                                p_a, p_b, p_u, p_cnt, p_dmin, p_dmax, p_r0, p_r1, p_nv, p_vr,
                                r_src, r_dst, r_len, r_atr, r_f, r_ok, r_part, r_sem, r_head, r_next, r_born, a_head, a_next,
                                u_ring_t, u_ring_a, u_ring_r, u_ring_i, u_rn, u_refr, u_pend, u_last, u_q, u_s, u_qt, u_nin,
                                integ, cont, ser, log_r, log_u, log_s, log_f, float(dur), sdom.J_RAPIDA,
                                *heap, glob, float(ev_t[0]), N, 0, 0, obs, log_c, np.zeros(E, np.int64), np.zeros((1, 3)), np.zeros(MAXR, np.int64))
    seg = time.time() - t0
    nU = ne - N
    res = dict(ouvido=ouvido, dur_simulada_s=dur, tempo_maquina_s=round(seg, 1), segundos_por_segundo=round(seg / dur, 2),
               incidencias_borda=int(len(ev_t)), uints=int(nU), pares=int(npar), ramos=int(nr),
               ramos_funcionando=int(r_ok[:nr].sum()), contadores={k: int(v) for k, v in zip(sdom.CONTADORES, cont)},
               uints_que_dispararam=int((u_nin[N:ne] > 0).sum()), provisorio=sdom.PROVISORIO)
    if nr:
        ok = r_ok[:nr] == 1
        res["ramos_comprimento_cubos"] = {str(L): int(((r_len[:nr] == L) & ok).sum()) for L in range(1, 12) if ((r_len[:nr] == L) & ok).any()}
        res["forca_ramos"] = dict(min=float(r_f[:nr][ok].min()) if ok.any() else None, max=float(r_f[:nr][ok].max()) if ok.any() else None)
    # carga das Ustr: fracassos por segundo (para calibrar o teto de divisão)
    np.savez_compressed(AQUI / "dados" / f"piloto-{ouvido}-{dur:g}.npz", ser=ser, log_r=log_r[:min(cont[6], MAXR)], log_u=log_u[:nU],
                        ex=ex[N:ne], ey=ey[N:ne], ez=ez[N:ne], r_src=r_src[:nr], r_dst=r_dst[:nr], r_len=r_len[:nr], r_ok=r_ok[:nr],
                        r_born=r_born[:nr], r_f=r_f[:nr], r_part=r_part[:nr], u_nin=u_nin[N:ne], N=N, log_s=log_s[:cont[15]], log_f=log_f[:min(cont[12], len(log_f))], px=x, py=y, pz=z, r_atr=r_atr[:nr], r_sem=r_sem[:nr], log_c=log_c[:min(cont[16], len(log_c))], obs=obs)
    return res

if __name__ == "__main__":
    r = rodar(sys.argv[1], sys.argv[2], float(sys.argv[3]))
    print(json.dumps(r, ensure_ascii=False, indent=1))
