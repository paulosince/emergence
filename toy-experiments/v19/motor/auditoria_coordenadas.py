"""V0.19 — auditoria geométrica ANTES DO SOM da entrada auditiva (proposta-coordenadas-auditivas.md, 28/11).
Compara a projeção em faixa (a histórica, igual a 790 ou a 263 cubos: muda só o atraso) com a projeção compacta
(coordenadas.py). Só geometria: oportunidades de encontro, não coincidências. Ouvido E (o D é espelho em x).
Saídas: ../visual/auditoria/*.png, ../visual/auditoria/auditoria.json e ../auditoria-coordenadas.md (tabelas)."""
import json, pathlib, sys
import numpy as np
AQUI = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(AQUI.parents[1] / "v18" / "borda"))
import instante_zero as iz, pontos, coordenadas as co
from scipy.spatial import cKDTree
import matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt

OUT = AQUI.parent / "visual" / "auditoria"; OUT.mkdir(parents=True, exist_ok=True)
CUBO_S = 0.02e-3 / 0.3

def medir(terr, banda, xyz, nb):
    N = len(terr); T = int(terr.max()) + 1
    cnt = np.zeros((T, nb), int); np.add.at(cnt, (terr, banda), 1)
    pres = (cnt > 0).astype(int)
    compart = pres.T @ pres                                   # territórios com Upros das duas bandas
    np.fill_diagonal(compart, (cnt >= 2).sum(0))              # diagonal: ≥ 2 Upros distintas da mesma banda
    pares = cnt.T @ cnt; np.fill_diagonal(pares, (cnt * (cnt - 1) // 2).sum(0))
    por_terr = np.bincount(terr, minlength=T)
    parceiros = por_terr[terr] - 1                            # outras Upros no mesmo território
    pb = []
    for b in range(nb):
        m = banda == b; tb = np.unique(terr[m])
        outras = np.where(pres[tb].sum(0) > 0)[0]
        pb.append(dict(banda=b, pontos=int(m.sum()), ustr_acessiveis=int(len(tb)), parceiros_por_upro=round(float(parceiros[m].mean()), 2),
                       bandas_parceiras=int(len(outras)) - int(compart[b, b] == 0), afastamento_max=int(np.abs(outras - b).max()) if len(outras) else 0))
    # vizinhança espacial: distância ao vizinho mais próximo e bandas distintas a até 3 cubos ("direções disponíveis")
    tree = cKDTree(xyz.astype(float)); dnn = tree.query(xyz.astype(float), k=2)[0][:, 1]
    viz = tree.query_ball_point(xyz.astype(float), r=3.0)
    nband3 = np.array([len(set(banda[v])) - 1 for v in viz])
    for b in range(nb):
        m = banda == b; pb[b]["dist_vizinho_med"] = round(float(np.median(dnn[m])), 2); pb[b]["bandas_a_3_cubos"] = round(float(nband3[m].mean()), 2)
    afast = np.abs(np.subtract.outer(np.arange(nb), np.arange(nb)))
    tot_pares = int(np.triu(pares).sum())
    resumo = dict(upros=N, territorios_com_upro=int((por_terr > 0).sum()), upros_por_territorio_med=float(np.median(por_terr[por_terr > 0])),
                  upros_por_territorio_max=int(por_terr.max()), pares_possiveis=tot_pares,
                  pares_mesma_banda=int(np.trace(pares)), pares_bandas_vizinhas=int(np.triu(pares * (afast == 1)).sum()),
                  pares_afastamento_2_ou_mais=int(np.triu(pares * (afast >= 2)).sum()), afastamento_max=int(afast[np.triu(compart) > 0].max()),
                  bandas_sem_parceiro=int(sum(1 for d in pb if d["parceiros_por_upro"] == 0)),
                  parceiros_por_upro_med=round(float(np.median(parceiros)), 2), dist_vizinho_med=round(float(np.median(dnn)), 2),
                  bandas_a_3_cubos_med=round(float(np.mean(nband3)), 2))
    return dict(resumo=resumo, por_banda=pb, compartilhados=compart.tolist(), pares=pares.tolist())

def main():
    P = pontos.construir(); lado = -1
    x, y, z, banda, _ = iz.faixa(P, lado); nb = int(banda.max()) + 1
    # faixa (histórica): ponta da Upro com o mesmo (y, z) da origem; território = bloco 2 x 2 em (y, z)
    blocos = np.stack([y // 2, z // 2], 1); _, terr_f = np.unique(blocos, axis=0, return_inverse=True); terr_f = terr_f.ravel()
    faixa_xyz = np.stack([np.full(len(x), lado * (iz.MEIA_DIST - 263)), y, z], 1)
    A = medir(terr_f, banda, faixa_xyz, nb)
    # compacta
    g = co.compacta(x, y, z, banda, lado); orig, rb, ra = co.espiral(x, y, z, banda, lado)
    B = medir(g["terr"], banda, g["xyz"], nb)
    dist = np.linalg.norm(orig - g["xyz"], axis=1)
    percurso = dict(comprimento_comum=co.PERCURSO, reacessos_para_crescer=12 * co.PERCURSO, atraso_ms=round(co.PERCURSO * CUBO_S * 1e3, 2),
                    distancia_entre_pontas_min=round(float(dist.min()), 1), distancia_entre_pontas_med=round(float(np.median(dist)), 1),
                    distancia_entre_pontas_max=round(float(dist.max()), 1), cabe=bool(dist.max() <= co.PERCURSO),
                    nota="Com comprimento comum, todas as Upros têm o mesmo atraso (dispersão zero). Se o comprimento fosse a distância entre as pontas, a dispersão seria a da linha acima.")
    if True:  # dispersão hipotética, se o comprimento fosse a distância entre as pontas
        percurso["se_fosse_distancia_atraso_ms_min_max"] = [round(float(dist.min() * CUBO_S * 1e3), 2), round(float(dist.max() * CUBO_S * 1e3), 2)]
    params = dict(R=co.R, grade_ustr=co.GRADE_USTR, voltas=co.VOLTAS, raio_espiral_base=round(rb), raio_espiral_apice=round(ra), altura_espiral=co.ALTURA,
                  face_plana_x=int(g["xf"]), n_ustr=int(len(g["ustr"])), upros_por_ustr=round(len(x) / len(g["ustr"]), 2),
                  volume_cubos=int(round(2 / 3 * np.pi * co.R ** 3)), cubos_por_ponto=round(2 / 3 * np.pi * co.R ** 3 / len(x), 1),
                  espessura_fatias_min_max=[round(float(np.diff(g["fatias"]).min()), 2), round(float(np.diff(g["fatias"]).max()), 2)],
                  meio_da_faixa="centro da sequência das 64 bandas (ordem da V0.18)")
    json.dump(dict(parametros=params, percurso=percurso, faixa=A, compacta=B), open(OUT / "auditoria.json", "w"), ensure_ascii=False)
    # figuras: vista lateral (x horizontal, y vertical) e de frente (y, z), escala comum; matrizes
    cmap = plt.get_cmap("turbo"); cor = cmap(banda / (nb - 1))
    fig, ax = plt.subplots(1, 2, figsize=(14, 7), facecolor="#05080b")
    for a in ax: a.set_facecolor("#05080b"); a.tick_params(colors="#9fb0ab"); [s.set_color("#2a3a3e") for s in a.spines.values()]
    ax[0].scatter(x * 0.02, y * 0.02, s=0.3, c=cor); ax[0].scatter(faixa_xyz[:, 0] * 0.02, y * 0.02, s=0.3, c=cor)
    ax[0].scatter(np.full(len(np.unique(blocos, axis=0)), lado * (iz.MEIA_DIST - 263 - 1)) * 0.02, np.unique(blocos, axis=0)[:, 0] * 2 * 0.02 + 0.02, s=0.2, c="#a26b80")
    ax[0].set_title("Faixa: origem (x = −50 mm) e chegada (263 cubos adiante); Ustr em rosa", color="#e9fbe4", fontsize=10)
    ax[1].scatter(orig[:, 0] * 0.02, orig[:, 1] * 0.02, s=0.3, c=cor, alpha=0.6); ax[1].scatter(g["xyz"][:, 0] * 0.02, g["xyz"][:, 1] * 0.02, s=0.6, c=cor)
    ax[1].scatter(g["ustr"][:, 0] * 0.02, g["ustr"][:, 1] * 0.02, s=0.3, c="#a26b80", alpha=0.5)
    ax[1].set_title("Compacta: espiral (origem) e meia-esfera (chegadas); Ustr em rosa", color="#e9fbe4", fontsize=10)
    for a in ax: a.set_xlabel("x (mm): lateral → centro da cabeça", color="#9fb0ab"); a.set_ylabel("y (mm): eixo tonotópico", color="#9fb0ab"); a.set_aspect("equal")
    lim_y = (y.min() * 0.02 - 0.5, y.max() * 0.02 + 0.5); ax[0].set_ylim(lim_y); ax[1].set_ylim(lim_y)
    ax[0].set_xlim(-50.6, -44.0); ax[1].set_xlim(-50.6, -44.0)
    fig.suptitle("Auditoria antes do som · ouvido E · mesma escala nos dois painéis · cor = banda (grave → agudo)", color="#e9fbe4")
    fig.savefig(OUT / "vista-lateral.png", dpi=130, bbox_inches="tight", facecolor=fig.get_facecolor()); plt.close(fig)
    fig = plt.figure(figsize=(7, 7), facecolor="#05080b"); a = fig.add_subplot(projection="3d"); a.set_facecolor("#05080b")
    a.scatter(orig[:, 0] * 0.02, orig[:, 2] * 0.02, orig[:, 1] * 0.02, s=0.2, c=cor, alpha=0.5); a.scatter(g["xyz"][:, 0] * 0.02, g["xyz"][:, 2] * 0.02, g["xyz"][:, 1] * 0.02, s=0.4, c=cor)
    a.set_title("Compacta em 3D: espiral (origem) e meia-esfera (chegadas)", color="#e9fbe4", fontsize=10); a.set_box_aspect((1, 1, 1))
    for ax_ in (a.xaxis, a.yaxis, a.zaxis): ax_.set_pane_color((0.02, 0.03, 0.04, 1)); ax_.label.set_color("#9fb0ab")
    a.tick_params(colors="#9fb0ab"); fig.savefig(OUT / "compacta-3d.png", dpi=130, bbox_inches="tight", facecolor=fig.get_facecolor()); plt.close(fig)
    fig, ax = plt.subplots(1, 2, figsize=(13, 6), facecolor="#05080b")
    for a, D, tit in ((ax[0], A, "Faixa"), (ax[1], B, "Compacta")):
        M = np.array(D["pares"], float); im = a.imshow(np.log10(M + 1), cmap="magma", origin="lower", vmin=0, vmax=np.log10(np.array(B["pares"]).max() + 1))
        a.set_title(f"{tit}: pares possíveis por par de bandas (log10)", color="#e9fbe4", fontsize=10); a.tick_params(colors="#9fb0ab")
        a.set_xlabel("banda", color="#9fb0ab"); a.set_ylabel("banda", color="#9fb0ab")
    fig.colorbar(im, ax=ax, shrink=0.8).ax.tick_params(colors="#9fb0ab")
    fig.savefig(OUT / "matrizes.png", dpi=130, bbox_inches="tight", facecolor=fig.get_facecolor()); plt.close(fig)
    print(json.dumps(dict(parametros=params, percurso=percurso, faixa=A["resumo"], compacta=B["resumo"]), ensure_ascii=False, indent=1))

if __name__ == "__main__":
    main()
