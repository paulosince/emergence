"""Critério de fase do agudo (aprovado pelo responsável em 18/11/2026; investigacao-criterio-agudo.md).
Para cada Uint: R = |média de e^{i·fase}| dos acertos do último episódio, fase = 2π(diferença − Δ)/T da nota do momento;
Rayleigh p ≈ exp(−n·R²) (aproximação para n grande). Sintonizada: ≥100 disparos, p < 0,01 e |fase média| < π/4.
Presa: ≥100 disparos e p ≥ 0,01. Sucesso: ≥1 sintonizada e nenhuma presa."""
import numpy as np

def por_uint(fa, disp):
    out = []
    for k in range(fa.shape[1]):
        c, s_, n = fa[0, k], fa[1, k], fa[2, k]
        if n < 1: out.append(dict(R=0.0, fase=0.0, n=0, p=1.0, disp=int(disp[k]))); continue
        R = float(np.hypot(c, s_) / n); p = float(np.exp(-n * R * R)); out.append(dict(R=round(R, 3), fase=round(float(np.arctan2(s_, c)), 3), n=int(n), p=p, disp=int(disp[k])))
    return out

def sucesso_fase(fa, disp):
    U = por_uint(fa, disp)
    sint = sum(1 for u in U if u["disp"] >= 100 and u["p"] < 0.01 and abs(u["fase"]) < np.pi / 4)
    presa = sum(1 for u in U if u["disp"] >= 100 and u["p"] >= 0.01)
    return sint >= 1 and presa == 0, sint, presa, U
