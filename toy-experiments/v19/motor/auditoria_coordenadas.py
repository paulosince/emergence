"""V0.19 — auditoria geométrica ANTES DO SOM da entrada auditiva (proposta-coordenadas-auditivas.md; revisão pedida
pelo responsável em 28/11, 14:37). Só geometria: oportunidades de encontro, não coincidências. Ouvido E (D = espelho em x).
Configurações: faixa (histórica: igual a 790 e a 263; muda só o atraso) e compacta com a grade de Ustr 'regular'
(primeira camada a 2 cubos da face) e, para comparação, 'face' (camada de centros na própria face).
Saídas: ../visual/auditoria/*.png, ../visual/auditoria/auditoria.json."""
import json, pathlib, sys
import numpy as np
AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parents[1] / "v18" / "borda"))
import instante_zero as iz, pontos, coordenadas as co
from scipy.spatial import cKDTree
import matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt

OUT = AQUI.parent / "visual" / "auditoria"; OUT.mkdir(parents=True, exist_ok=True)
CUBO_S = 0.02e-3 / 0.3
SOBRE = 9                     # território "sobrecarregado": 9 ou mais chegadas

def medir(terr, banda, xyz, nb, nterr):
    N = len(terr)
    cnt = np.zeros((nterr, nb), int); np.add.at(cnt, (terr, banda), 1)
    pres = (cnt > 0).astype(int)
    compart = pres.T @ pres; np.fill_diagonal(compart, (cnt >= 2).sum(0))
    pares = cnt.T @ cnt; np.fill_diagonal(pares, (cnt * (cnt - 1) // 2).sum(0))
    ocup = np.bincount(terr, minlength=nterr)
    parceiros = ocup[terr] - 1
    # duas medidas distintas: bandas comparáveis no território da mesma Ustr × bandas a até 3 cubos
    comp_terr = pres.sum(1)[terr] - 1                          # outras bandas presentes no território da chegada
    tree = cKDTree(xyz.astype(float)); dnn = tree.query(xyz.astype(float), k=2)[0][:, 1]
    viz = tree.query_ball_point(xyz.astype(float), r=3.0); nband3 = np.array([len(set(banda[v])) - 1 for v in viz])
    pb = []
    for b in range(nb):
        m = banda == b; tb = np.unique(terr[m]); outras = np.where(pres[tb].sum(0) > 0)[0]
        pb.append(dict(banda=b, pontos=int(m.sum()), ustr_acessiveis=int(len(tb)), parceiros_por_upro=round(float(parceiros[m].mean()), 2),
                       bandas_parceiras=int(len(outras)) - int(compart[b, b] == 0), afastamento_max=int(np.abs(outras - b).max()) if len(outras) else 0,
                       bandas_comparaveis_no_territorio=round(float(comp_terr[m].mean()), 2), bandas_a_3_cubos=round(float(nband3[m].mean()), 2),
                       dist_vizinho_med=round(float(np.median(dnn[m])), 2)))
    afast = np.abs(np.subtract.outer(np.arange(nb), np.arange(nb)))
    tot = int(np.triu(pares).sum())
    resumo = dict(upros=N, ustr=int(nterr), territorios_com_upro=int((ocup > 0).sum()), territorios_vazios=int((ocup == 0).sum()),
                  ocupacao_mediana=float(np.median(ocup[ocup > 0])), ocupacao_max=int(ocup.max()),
                  distribuicao_ocupacao={int(k): int(v) for k, v in enumerate(np.bincount(ocup)) if v},
                  pares_possiveis=tot, pares_mesma_banda=int(np.trace(pares)), pares_bandas_vizinhas=int(np.triu(pares * (afast == 1)).sum()),
                  pares_afastamento_2_ou_mais=int(np.triu(pares * (afast >= 2)).sum()), afastamento_max=int(afast[np.triu(compart) > 0].max()),
                  pares_por_afastamento={int(k): int(np.triu(pares * (afast == k)).sum()) for k in range(int(afast[np.triu(compart) > 0].max()) + 1)},
                  parceiros_por_upro_med=float(np.median(parceiros)),
                  bandas_comparaveis_no_territorio_media=round(float(comp_terr.mean()), 2), bandas_a_3_cubos_media=round(float(nband3.mean()), 2),
                  dist_vizinho_med=float(np.median(dnn)))
    return dict(resumo=resumo, por_banda=pb, pares=pares.tolist(), compartilhados=compart.tolist()), ocup, cnt

def sobrecarga(ocup, cnt, U, R):
    """Cruza cada território sobrecarregado com as bandas que recebe e com a distância do centro à face plana (n) e à
    superfície curva (R − |centro|). Fração dos pares possíveis que esses territórios concentram."""
    s = np.where(ocup >= SOBRE)[0]; pares_t = ocup * (ocup - 1) // 2
    face = U[:, 1].astype(float); curva = R - np.sqrt((U.astype(float) ** 2).sum(1))
    linhas = [dict(ocupacao=int(ocup[u]), bandas=[int(b) for b in np.where(cnt[u] > 0)[0]], t=int(U[u, 0]), n=int(U[u, 1]), v=int(U[u, 2]),
                   dist_face=round(float(face[u]), 1), dist_curva=round(float(curva[u]), 1)) for u in s]
    perto = lambda arr, lim: int((arr[s] <= lim).sum())
    return dict(n=int(len(s)), fracao_dos_pares=round(float(pares_t[s].sum() / max(1, pares_t.sum())), 4), pares_neles=int(pares_t[s].sum()),
                com_banda_0=int(sum(1 for l in linhas if 0 in l["bandas"])), so_banda_0=int(sum(1 for l in linhas if l["bandas"] == [0])),
                com_banda_63=int(sum(1 for l in linhas if 63 in l["bandas"])),
                centro_a_ate_2_cubos_da_face=perto(face, 2), centro_a_ate_2_cubos_da_curva=perto(curva, 2),
                ocupacao_media_geral=round(float(ocup[ocup > 0].mean()), 2), territorios=linhas)

def main():
    P = pontos.construir(); lado = -1
    x, y, z, banda, _ = iz.faixa(P, lado); nb = int(banda.max()) + 1
    blocos = np.stack([y // 2, z // 2], 1); ub, terr_f = np.unique(blocos, axis=0, return_inverse=True); terr_f = terr_f.ravel()
    faixa_xyz = np.stack([np.full(len(x), lado * (iz.MEIA_DIST - co.PERCURSO)), y, z], 1)
    res = {}; mats = {}
    res["faixa"], ocf, _ = medir(terr_f, banda, faixa_xyz, nb, len(ub)); mats["Faixa (790 e 263)"] = np.array(res["faixa"]["pares"])
    geo = {}
    for cfg in ("333", "regular", "face"):
        g = co.compacta(x, y, z, banda, lado, cfg); geo[cfg] = g
        r, oc, cnt = medir(g["terr"], banda, g["xyz"], nb, len(g["U"]))
        r["sobrecarga"] = sobrecarga(oc, cnt, g["U"], co.R)
        r["grade"] = dict(config=cfg, primeira_camada_n=int(g["U"][:, 1].min()), passos=co.GRADE_USTR, n_ustr=int(len(g["U"])))
        res["compacta_" + cfg] = r; mats[f"Compacta · {cfg.replace('333', '3×3×3').replace('regular', '3×4×3').replace('face', '3×4×3 face')}"] = np.array(r["pares"])
    # percurso: comprimento de condução × trajetória discreta realizável (regra do motor: passo de 1 cubo em 26 vizinhos)
    g = geo["333"]; orig, rb, ra = co.espiral(x, y, z, banda, lado)
    eu = np.linalg.norm(orig - g["xyz"], axis=1); cheb = np.abs(np.round(orig) - g["xyz"]).max(1)
    res["percurso"] = dict(comprimento_comum=co.PERCURSO, reacessos_para_crescer=12 * co.PERCURSO, atraso_ms=round(co.PERCURSO * CUBO_S * 1e3, 2),
                           distancia_euclidiana_min_med_max=[round(float(eu.min()), 1), round(float(np.median(eu)), 1), round(float(eu.max()), 1)],
                           passos_minimos_chebyshev_max=int(cheb.max()), realizavel_em_263_passos=bool(cheb.max() <= co.PERCURSO))
    res["parametros"] = dict(R=co.R, passos_ustr=co.GRADE_USTR, voltas=co.VOLTAS, raio_espiral_base=round(rb), raio_espiral_apice=round(ra),
                             altura_espiral=co.ALTURA, face_plana_x=int(g["xf"]), volume_cubos=int(round(2 / 3 * np.pi * co.R ** 3)),
                             espessura_fatias_min_max=[round(float(np.diff(g["fatias"]).min()), 2), round(float(np.diff(g["fatias"]).max()), 2)])
    json.dump(res, open(OUT / "auditoria.json", "w"), ensure_ascii=False)
    # matrizes na mesma escala
    vmax = max(np.log10(M.max() + 1) for M in mats.values())
    fig, ax = plt.subplots(1, len(mats), figsize=(6 * len(mats), 6), facecolor="#05080b")
    for a, (tit, M) in zip(ax, mats.items()):
        im = a.imshow(np.log10(M + 1), cmap="magma", origin="lower", vmin=0, vmax=vmax); a.set_title(f"{tit}: pares possíveis (log10)", color="#e9fbe4", fontsize=10)
        a.tick_params(colors="#9fb0ab"); a.set_xlabel("banda", color="#9fb0ab"); a.set_ylabel("banda", color="#9fb0ab")
    fig.colorbar(im, ax=ax, shrink=0.8).ax.tick_params(colors="#9fb0ab")
    fig.savefig(OUT / "matrizes.png", dpi=120, bbox_inches="tight", facecolor=fig.get_facecolor()); plt.close(fig)
    # distribuição das ocupações
    fig, a = plt.subplots(figsize=(8, 4), facecolor="#05080b"); a.set_facecolor("#05080b")
    for nome, cor_ in (("faixa", "#8fa09b"), ("compacta_333", "#39ff14"), ("compacta_regular", "#b45cff"), ("compacta_face", "#3d7bff")):
        d = res[nome]["resumo"]["distribuicao_ocupacao"]; ks = sorted(d); a.plot(ks, [d[k] for k in ks], "-o", ms=3, color=cor_, label=nome.replace("_", " · "))
    a.set_yscale("log"); a.set_xlabel("chegadas por território", color="#9fb0ab"); a.set_ylabel("territórios", color="#9fb0ab"); a.tick_params(colors="#9fb0ab")
    a.legend(facecolor="#0b1114", labelcolor="#e9fbe4"); a.set_title("Distribuição das ocupações", color="#e9fbe4")
    fig.savefig(OUT / "ocupacoes.png", dpi=120, bbox_inches="tight", facecolor=fig.get_facecolor()); plt.close(fig)
    # vistas (grade regular)
    cmap = plt.get_cmap("turbo"); cor = cmap(banda / (nb - 1))
    fig, ax = plt.subplots(1, 2, figsize=(14, 7), facecolor="#05080b")
    for a in ax: a.set_facecolor("#05080b"); a.tick_params(colors="#9fb0ab"); [s_.set_color("#2a3a3e") for s_ in a.spines.values()]
    ax[0].scatter(x * 0.02, y * 0.02, s=0.3, c=cor); ax[0].scatter(faixa_xyz[:, 0] * 0.02, y * 0.02, s=0.3, c=cor)
    ax[0].set_title("Faixa: origem (x = −50 mm) e chegada (263 cubos adiante)", color="#e9fbe4", fontsize=10)
    ax[1].scatter(orig[:, 0] * 0.02, orig[:, 1] * 0.02, s=0.3, c=cor, alpha=0.6); ax[1].scatter(g["xyz"][:, 0] * 0.02, g["xyz"][:, 1] * 0.02, s=0.6, c=cor)
    ax[1].scatter(g["ustr"][:, 0] * 0.02, g["ustr"][:, 1] * 0.02, s=0.3, c="#a26b80", alpha=0.5)
    ax[1].set_title("Compacta: espiral (origem) e meia-esfera (chegadas); Ustr em rosa", color="#e9fbe4", fontsize=10)
    for a in ax: a.set_xlabel("x (mm): lateral → centro da cabeça", color="#9fb0ab"); a.set_ylabel("y (mm): eixo tonotópico", color="#9fb0ab"); a.set_aspect("equal"); a.set_ylim(y.min() * 0.02 - 0.5, y.max() * 0.02 + 0.5); a.set_xlim(-50.6, -44.0)
    fig.suptitle("Auditoria antes do som · ouvido E · mesma escala · cor = banda (grave → agudo)", color="#e9fbe4")
    fig.savefig(OUT / "vista-lateral.png", dpi=120, bbox_inches="tight", facecolor=fig.get_facecolor()); plt.close(fig)
    out = {k: (v["resumo"] if isinstance(v, dict) and "resumo" in v else v) for k, v in res.items()}
    for k in ("compacta_333", "compacta_regular", "compacta_face"): out[k + "_sobrecarga"] = {kk: vv for kk, vv in res[k]["sobrecarga"].items() if kk != "territorios"}
    print(json.dumps(out, ensure_ascii=False, indent=1))

if __name__ == "__main__":
    main()
