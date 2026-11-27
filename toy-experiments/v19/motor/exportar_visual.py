"""V0.19 — exporta para a página o que o motor constituiu no piloto (princípio do visualizador: a página só desenha o que
está nos registros do motor).

Uso: python exportar_visual.py <ouvido>  →  visual/piloto-<ouvido>.bin e visual/piloto-<ouvido>.json
Conteúdo (tudo vindo de motor/dados/piloto-<ouvido>-10.npz):
- Uints: instante de nascimento (ms) e cubo;
- passos de crescimento de cada ramo: instante (ms) e o trecho (do passo s−1 ao passo s, de L);
- disparos de Uint: instante (ms) e qual Uint.
O motor guarda o COMPRIMENTO de cada ramo (em cubos), não o traçado. Ramo-base: desenhado em linha reta. Variante (mais longa
que a reta): desenhada em arco com o mesmo excesso de comprimento; o arco é desenho, o comprimento é do motor."""
import sys, json, pathlib
import numpy as np

AQUI = pathlib.Path(__file__).resolve().parent
SUB = 8                                          # resolução do desenho: 1/8 de cubo

def bezier(P0, C, P1, u):
    u = u[..., None]
    return (1 - u) ** 2 * P0 + 2 * (1 - u) * u * C + u ** 2 * P1

def comprimento(P0, C, P1, n=16):
    u = np.linspace(0, 1, n + 1)
    pts = bezier(P0[:, None, :], C[:, None, :], P1[:, None, :], u[None, :])
    return np.linalg.norm(np.diff(pts, axis=1), axis=2).sum(1)

def main(ouvido):
    d = np.load(AQUI / "dados" / f"piloto-{ouvido}-10.npz")
    N = int(d["N"])
    px, py, pz = d["px"], d["py"], d["pz"]
    ux, uy, uz = d["ex"], d["ey"], d["ez"]
    src, dst, L, sem = d["r_src"], d["r_dst"], d["r_len"], d["r_sem"]
    cx = np.where(src < N, px[np.minimum(src, N - 1)], ux[np.maximum(src - N, 0)])
    cy = np.where(src < N, py[np.minimum(src, N - 1)], uy[np.maximum(src - N, 0)])
    cz = np.where(src < N, pz[np.minimum(src, N - 1)], uz[np.maximum(src - N, 0)])
    P0 = np.stack([cx, cy, cz], 1).astype(float)
    P1 = np.stack([ux[dst - N], uy[dst - N], uz[dst - N]], 1).astype(float)
    reta = np.linalg.norm(P1 - P0, axis=1)
    Lg = np.abs(P1 - P0).max(1)                                   # passos da reta (como no motor)
    alvo = reta * np.where(Lg > 0, L / np.maximum(Lg, 1), 1.0)    # mesmo excesso relativo de comprimento
    dirv = (P1 - P0) / np.maximum(reta, 1e-9)[:, None]
    nrm = np.cross(dirv, np.array([0.0, 1.0, 0.0]))
    fraco = np.linalg.norm(nrm, axis=1) < 1e-6
    nrm[fraco] = np.cross(dirv[fraco], np.array([1.0, 0.0, 0.0]))
    nrm /= np.linalg.norm(nrm, axis=1)[:, None]
    mid = (P0 + P1) / 2
    h = np.zeros(len(L)); var = (sem == 1) & (alvo > reta + 1e-6)
    lo, hi = np.zeros(var.sum()), np.full(var.sum(), 20.0)
    for _ in range(30):                                           # bisseção: altura do arco que dá o comprimento-alvo
        md = (lo + hi) / 2
        Lc = comprimento(P0[var], mid[var] + nrm[var] * md[:, None], P1[var])
        hi = np.where(Lc > alvo[var], md, hi); lo = np.where(Lc > alvo[var], lo, md)
    h[var] = (lo + hi) / 2
    C = mid + nrm * h[:, None]
    S = d["log_s"]; t, rr, st = S[:, 0], S[:, 1].astype(np.int64), S[:, 2]
    Lr = np.maximum(L[rr], 1)
    a = bezier(P0[rr], C[rr], P1[rr], (st - 1) / Lr); b = bezier(P0[rr], C[rr], P1[rr], st / Lr)
    seg = np.round(np.concatenate([a, b], 1) * SUB).astype(np.int16)   # x0 y0 z0 x1 y1 z1 em 1/8 de cubo
    tms = np.round(t * 1000).astype(np.uint16)
    o = np.argsort(tms, kind="stable"); seg, tms, eh_var = seg[o], tms[o], sem[rr][o].astype(np.uint8)
    lu = d["log_u"]; un = np.round(lu[:, 0] * 1000).astype(np.uint16)
    uxyz = np.stack([ux, uy, uz], 1).astype(np.int16)
    F = d["log_f"]; ft = np.round(F[:, 0] * 1000).astype(np.uint16); fu = F[:, 1].astype(np.uint16)
    ok = d["r_ok"] == 1; tfun = np.sort(np.round(d["r_born"][ok] * 1000)).astype(np.uint16)
    partes = [("u_t", un), ("u_xyz", uxyz), ("s_t", tms), ("s_seg", seg), ("s_var", eh_var), ("f_t", ft), ("f_u", fu), ("r_fun_t", tfun)]
    off, meta, blob = 0, {}, bytearray()
    for nome, arr in partes:
        b_ = np.ascontiguousarray(arr).tobytes()
        while len(blob) % 4: blob.append(0)
        meta[nome] = dict(off=len(blob), n=int(arr.size), tipo=str(arr.dtype)); blob += b_
    meta.update(sub=SUB, ouvido=ouvido, n_uints=int(len(un)), n_passos=int(len(tms)), n_disparos=int(len(ft)), n_ramos_funcionando=int(len(tfun)),
                fonte="motor/dados/piloto-%s-10.npz (motor/sdom.py, piloto de 10 s)" % ouvido)
    vis = AQUI.parent / "visual"
    (vis / f"piloto-{ouvido}.bin").write_bytes(bytes(blob))
    (vis / f"piloto-{ouvido}.json").write_text(json.dumps(meta))
    print(meta, len(blob) / 1e6, "MB")

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "esq")
