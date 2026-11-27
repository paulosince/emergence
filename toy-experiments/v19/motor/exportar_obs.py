"""V0.19 — exporta a janela de observação do piloto: cada incidência que desceu por um ramo até uma Uint da janela
(instante de chegada, ramo, amplitude) e a soma da Uint em cada chegada. A página faz o fóton andar pelo ramo de
(chegada − atraso do ramo) até a chegada: o atraso é o do motor (comprimento × 66,7 µs). Só desenho do que o motor registrou.
Uso: python exportar_obs.py <t0> <t1>   →  visual/obs-esq.bin + visual/obs-esq.json"""
import sys, json, pathlib
import numpy as np
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from exportar_visual import bezier, comprimento
AQUI = pathlib.Path(__file__).resolve().parent

def main(t0, t1):
    d = np.load(AQUI / "dados" / "piloto-esq-10.npz"); N = int(d["N"])
    C = d["log_c"]; sel = (C[:, 0] >= t0) & (C[:, 0] <= t1); C = C[sel]
    rr = C[:, 1].astype(np.int64); usados, inv = np.unique(rr, return_inverse=True)
    src, dst, L, sem, atr = d["r_src"][usados], d["r_dst"][usados], d["r_len"][usados], d["r_sem"][usados], d["r_atr"][usados]
    px, py, pz, ex, ey, ez = d["px"], d["py"], d["pz"], d["ex"], d["ey"], d["ez"]
    s3 = np.stack([np.where(src < N, a[np.minimum(src, N - 1)], b[np.maximum(src - N, 0)]) for a, b in ((px, ex), (py, ey), (pz, ez))], 1).astype(float)
    d3 = np.stack([ex[dst - N], ey[dst - N], ez[dst - N]], 1).astype(float)
    reta = np.linalg.norm(d3 - s3, axis=1); Lg = np.abs(d3 - s3).max(1); alvo = reta * L / np.maximum(Lg, 1)
    dv = (d3 - s3) / np.maximum(reta, 1e-9)[:, None]; nr = np.cross(dv, [0.0, 1.0, 0.0])
    f = np.linalg.norm(nr, axis=1) < 1e-6; nr[f] = np.cross(dv[f], [1.0, 0.0, 0.0]); nr /= np.linalg.norm(nr, axis=1)[:, None]
    mid = (s3 + d3) / 2; h = np.zeros(len(L)); var = (sem == 1) & (alvo > reta + 1e-6)
    lo, hi = np.zeros(var.sum()), np.full(var.sum(), 20.0)
    for _ in range(30):
        md = (lo + hi) / 2; Lc = comprimento(s3[var], mid[var] + nr[var] * md[:, None], d3[var])
        hi = np.where(Lc > alvo[var], md, hi); lo = np.where(Lc > alvo[var], lo, md)
    h[var] = (lo + hi) / 2; ctl = mid + nr * h[:, None]
    geo = np.concatenate([s3, ctl, d3], 1).astype(np.float32)          # por ramo: origem, controle, destino (cubos)
    ud, uinv = np.unique(dst, return_inverse=True)                     # Uints da janela
    o = np.argsort(C[:, 0], kind="stable")
    blob = bytearray(); meta = {}
    def poe(n, a):
        while len(blob) % 4: blob.append(0)
        meta[n] = dict(off=len(blob), n=int(a.size), tipo=str(a.dtype)); blob.extend(np.ascontiguousarray(a).tobytes())
    poe("r_geo", geo); poe("r_atr", atr.astype(np.float32)); poe("r_u", uinv.astype(np.int32)); poe("u_id", (ud - N).astype(np.int32))
    poe("c_t", C[o, 0].astype(np.float32)); poe("c_r", inv[o].astype(np.int32)); poe("c_a", C[o, 2].astype(np.float32)); poe("c_v", C[o, 3].astype(np.float32))
    F = d["log_f"]; fs = np.isin(F[:, 1].astype(np.int64), ud - N) & (F[:, 0] >= t0) & (F[:, 0] <= t1)
    poe("f_t", F[fs, 0].astype(np.float32)); poe("f_u", F[fs, 1].astype(np.int32))
    meta.update(t0=t0, t1=t1, n_chegadas=int(len(C)), n_ramos=int(len(usados)), n_uints=int(len(ud)), janela=[float(v) for v in d["obs"]])
    vis = AQUI.parent / "visual"; (vis / "obs-esq.bin").write_bytes(bytes(blob)); (vis / "obs-esq.json").write_text(json.dumps(meta))
    print({k: meta[k] for k in ("n_chegadas", "n_ramos", "n_uints")}, len(blob) / 1e6, "MB")

if __name__ == "__main__":
    main(float(sys.argv[1]), float(sys.argv[2]))
