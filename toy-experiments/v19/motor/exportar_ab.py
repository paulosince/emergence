"""V0.19 — exporta o teste A × B (90 s, ouvido E) para a página. Princípio do visualizador: só o que o motor registrou.

Lê dados/teste-A-esq.npz e dados/teste-B-esq.npz e grava visual/teste-ab.bin + visual/teste-ab.json.
Por condição:
- Upros do nervo: ponto transdutivo de origem e as marcas de crescimento registradas pelo motor (a cada 1/10 do nervo);
- Uints: cubo, instante de nascimento, se está fora da folha;
- ramos: cubo de origem (ponta da Upro de entrada ou Uint), Uint de destino, comprimento no motor (cubos), se é variante,
  instante em que chegou e passou a funcionar;
- passos de crescimento de cada ramo (instante e passo s de L), exatamente como o motor registrou;
- disparos (instante e Uint).
O traçado curvo da página é desenho: o motor guarda comprimento e atraso, não o caminho."""
import json, pathlib
import numpy as np

AQUI = pathlib.Path(__file__).resolve().parent

def main():
    blob = bytearray(); meta = {"condicoes": {}}
    def poe(nome, arr):
        while len(blob) % 4: blob.append(0)
        meta[nome] = dict(off=len(blob), n=int(arr.size), tipo=str(arr.dtype)); blob.extend(np.ascontiguousarray(arr).tobytes())
    for c in ("A", "B"):
        d = np.load(AQUI / "dados" / f"teste-{c}-esq.npz"); res = json.loads(str(d["resumo"]))[0]
        N = int(d["N"]); xf = int(d["xfolha"])
        ex, ey, ez = d["ex"], d["ey"], d["ez"]; nU = len(ex)
        p = c + "_"
        poe(p + "u_xyz", np.stack([ex, ey, ez], 1).astype(np.int16)); poe(p + "u_t", d["log_u"][:, 0].astype(np.float32))
        src, dst, L, sem, born = d["r_src"], d["r_dst"], d["r_len"], d["r_sem"], d["r_born"]
        px, py, pz = d["pxe"], d["py"], d["pz"]
        sx = np.where(src < N, px[np.minimum(src, N - 1)], ex[np.maximum(src - N, 0)])
        sy = np.where(src < N, py[np.minimum(src, N - 1)], ey[np.maximum(src - N, 0)])
        sz = np.where(src < N, pz[np.minimum(src, N - 1)], ez[np.maximum(src - N, 0)])
        poe(p + "r_src", np.stack([sx, sy, sz], 1).astype(np.int16)); poe(p + "r_dst", (dst - N).astype(np.int32))
        poe(p + "r_len", np.minimum(L, 255).astype(np.uint8)); poe(p + "r_sem", sem.astype(np.uint8)); poe(p + "r_born", born.astype(np.float32))
        S = d["log_s"]; o = np.argsort(S[:, 0], kind="stable")
        poe(p + "s_t", S[o, 0].astype(np.float32)); poe(p + "s_r", S[o, 1].astype(np.int32)); poe(p + "s_k", S[o, 2].astype(np.uint8))
        F = d["log_f"]; poe(p + "f_t", F[:, 0].astype(np.float32)); poe(p + "f_u", F[:, 1].astype(np.int32))
        LT = d["log_t"]; o = np.lexsort((LT[:, 0], LT[:, 1]))
        poe(p + "n_p", LT[o, 1].astype(np.uint16)); poe(p + "n_t", LT[o, 0].astype(np.float32)); poe(p + "n_fr", np.round(LT[o, 2] * 10).astype(np.uint8))
        k = res["contadores"]; fora = np.abs(ex) < abs(xf)
        integrou_fora = int(((d["u_nin"] > 0) & fora).sum())
        meta["condicoes"][c] = dict(n_uints=int(nU), n_ramos=int(len(src)), n_passos=int(len(S)), n_disparos=int(len(F)), xfolha=xf,
                                   uints_fora_da_folha=int(fora.sum()), uints_fora_que_dispararam=integrou_fora,
                                   buscas_com_fora_admissivel=k.get("busca com cubo admissível fora da folha", 0),
                                   escolhas_fora=k.get("Uint escolhida fora da folha", 0),
                                   sem_cubo=k.get("busca sem cubo admissível (sem Uint)", 0),
                                   profundidade_max=int(abs(xf) - np.abs(ex).min()) if nU else 0, dur=res["dur"], contadores=k)
    meta.update(ouvido="esq", nervo=790, n_pontos=int(N))
    vis = AQUI.parent / "visual"
    (vis / "teste-ab.bin").write_bytes(bytes(blob)); (vis / "teste-ab.json").write_text(json.dumps(meta, ensure_ascii=False))
    print(len(blob) / 1e6, "MB", {c: {k: v for k, v in m.items() if k != "contadores"} for c, m in meta["condicoes"].items()})

if __name__ == "__main__":
    main()
