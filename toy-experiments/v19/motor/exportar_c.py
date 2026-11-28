"""V0.19 — exporta o teste de 60 s dos três braços (faixa 790, faixa 263, compacta 263; ouvido E) para a página.
Princípio do visualizador: só o que o motor registrou, mais a geometria dada no instante zero.

Lê dados/<prefixo>-<braco>-esq.npz e grava visual/<prefixo>-<braco>.bin (um por braço) + visual/<prefixo>.json. Por braço:
- origem de cada Upro do nervo (ponto transdutivo): na faixa, a própria faixa; na compacta, a espiral aberta
  (coordenadas.espiral). É geometria do instante zero: o motor não usa a posição da origem, porque o nervo é só um
  comprimento de condução (nervo cubos), sem trajeto;
- chegada de cada Upro (ponta, de onde saem os ramos) e as marcas de crescimento do nervo (a cada ~1/10 e ao ficar pronta);
- Ustr que o motor usa (zona de entrada) e o território de cada chegada;
- Uints, ramos, passos de crescimento, pares (primeira coincidência) e disparos, como no exportar_ab.py;
- a medida por afastamento entre bandas (medida_afastamento.py);
- pontos de controle do desenho de cada Upro do nervo (coordenadas.rota): origem -> Cpro da banda -> nervo -> leque.
O traçado curvo da página é desenho: o motor guarda comprimento e atraso, não o caminho."""
import json, pathlib
import numpy as np
import coordenadas as co, medida_afastamento as ma

AQUI = pathlib.Path(__file__).resolve().parent
BRACOS = ("faixa790", "faixa263", "compacta263")


def passagens(d, todas):
    """Como medida_maioria.py [R 27/11]: por apresentação, passagens de incidências por ramos (cada chegada por um ramo conta
    uma) e a fração por ramos que já funcionavam antes daquela apresentação começar."""
    born = d["r_born"]; nr = len(born); prev = np.zeros(nr, np.int64); out = []
    for a, r in enumerate(todas):
        c = np.zeros(nr, np.int64); x = d[f"ap{a + 1}_rch"]; c[:len(x)] = x; dc = c - prev; prev = c
        antigos = (born >= 0) & (born < r["inicio"]); tot = int(dc.sum())
        out.append(dict(gravacao=r["gravacao"].replace("satie-gymnopedie1-", "").capitalize(), passagens=tot,
                        fracao_por_ramos_antigos=float(dc[antigos].sum() / max(1, tot))))
    return out


def main(pre="teste-c"):
    blobs = {}; meta = {"bracos": {}}
    def poe(nome, arr):
        blob = blobs[nome.split("_")[0]]
        while len(blob) % 4: blob.append(0)
        meta[nome] = dict(off=len(blob), n=int(arr.size), tipo=str(arr.dtype)); blob.extend(np.ascontiguousarray(arr).tobytes())
    for b in BRACOS:
        arq = AQUI / "dados" / f"{pre}-{b}-esq.npz"
        if not arq.exists():
            continue
        d = np.load(arq); todas = json.loads(str(d["resumo"])); res = todas[0]; N = int(d["N"]); lado = -1
        p = b + "_"; blobs[b] = bytearray()
        if int(d["modo"]) == 1:
            org, _, _ = co.espiral(d["px"], d["py"], d["pz"], d["banda"], lado)
        else:
            org = np.stack([d["px"], d["py"], d["pz"]], 1)
        poe(p + "o_xyz", org.astype(np.float32))
        pxe, pye, pze = d["pxe"], d["pye"], d["pze"]
        # desenho do nervo [R 28/11]: origem -> Cpro da banda -> nervo (Cpro juntas, ordem tonotópica) -> leque até a chegada
        ctl = co.rota(org.astype(float), np.stack([pxe, pye, pze], 1).astype(float), d["banda"].astype(np.int64), lado, int(d["modo"]) == 1)
        poe(p + "n_ctl", ctl.astype(np.float32))
        poe(p + "c_xyz", np.stack([pxe, pye, pze], 1).astype(np.int16)); poe(p + "banda", d["banda"].astype(np.uint8))
        poe(p + "g_xyz", np.stack([d["ux"], d["uy"], d["uz"]], 1).astype(np.int16))
        ex, ey, ez = d["ex"], d["ey"], d["ez"]; nU = len(ex)
        poe(p + "u_xyz", np.stack([ex, ey, ez], 1).astype(np.int16)); poe(p + "u_t", d["log_u"][:nU, 0].astype(np.float32))
        src, dst, L, sem, born = d["r_src"], d["r_dst"], d["r_len"], d["r_sem"], d["r_born"]
        sx = np.where(src < N, pxe[np.minimum(src, N - 1)], ex[np.maximum(src - N, 0)])
        sy = np.where(src < N, pye[np.minimum(src, N - 1)], ey[np.maximum(src - N, 0)])
        sz = np.where(src < N, pze[np.minimum(src, N - 1)], ez[np.maximum(src - N, 0)])
        poe(p + "r_src", np.stack([sx, sy, sz], 1).astype(np.int16)); poe(p + "r_dst", (dst - N).astype(np.int32))
        poe(p + "r_len", np.minimum(L, 255).astype(np.uint8)); poe(p + "r_born", born.astype(np.float32))
        S = d["log_s"]; o = np.argsort(S[:, 0], kind="stable")
        poe(p + "s_t", S[o, 0].astype(np.float32)); poe(p + "s_r", S[o, 1].astype(np.int32)); poe(p + "s_k", S[o, 2].astype(np.uint8))
        F = d["log_f"]; poe(p + "f_t", F[:, 0].astype(np.float32)); poe(p + "f_u", F[:, 1].astype(np.int32))
        pt, pu = d["p_t"], d["p_u"] - N; o2 = np.argsort(pt, kind="stable")
        poe(p + "p_t", pt[o2].astype(np.float32)); poe(p + "p_u", pu[o2].astype(np.int32))
        LT = d["log_t"]; o = np.lexsort((LT[:, 0], LT[:, 1]))
        poe(p + "n_p", LT[o, 1].astype(np.uint16)); poe(p + "n_t", LT[o, 0].astype(np.float32)); poe(p + "n_fr", np.where(LT[o, 2] >= 1 - 1e-9, 10, np.minimum(9, np.round(LT[o, 2] * 10))).astype(np.uint8))   # 10 = pronta (só quando o motor marca 1,0)
        xf = int(d["xfolha"]); fora = lado * ex < lado * xf
        reuso = int((pt > d["log_u"][pu, 0] + 1e-12).sum()) if len(pt) else 0
        meta["bracos"][b] = dict(nervo=int(d["nervo"]), modo=int(d["modo"]), xlim=xf, n_uints=int(nU), n_ramos=int(len(src)),
                                 n_passos=int(len(S)), n_disparos=int(len(F)), pares=int(len(pt)), pares_que_reutilizaram_uint=reuso,
                                 uints_para_dentro=int(fora.sum()), n_ustr=int(len(d["ux"])), dur=res["dur"],
                                 afastamento=ma.medir(arq)["por_afastamento"], passagens=passagens(d, todas) if len(todas) > 1 else None)
        meta["apresentacoes"] = [dict(gravacao=a["gravacao"].replace("satie-gymnopedie1-", "").capitalize(), inicio=a["inicio"], dur=a["dur"]) for a in todas]
        meta["fim"] = todas[-1]["inicio"] + todas[-1]["dur"]
    meta.update(ouvido="esq", n_pontos=int(N), cubo_s=0.02e-3 / 0.3)
    vis = AQUI.parent / "visual"
    for b, blob in blobs.items(): (vis / f"{pre}-{b}.bin").write_bytes(bytes(blob))   # um arquivo por braço (o celular carrega só o aberto)
    (vis / f"{pre}.json").write_text(json.dumps(meta, ensure_ascii=False))
    print({b: round(len(x) / 1e6, 1) for b, x in blobs.items()}, "MB", {b: {k: v for k, v in m.items() if k != "afastamento"} for b, m in meta["bracos"].items()})


if __name__ == "__main__":
    import sys
    main(*(sys.argv[1:2]))
