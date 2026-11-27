"""V0.19 — exporta para a página o estado do Sdom ao fim de cada apresentação (princípio do visualizador: só o que o motor
registrou). Lê dados/sessoes-<ouvido>.npz dos dois ouvidos e grava visual/sessoes.bin + visual/sessoes.json.

Por ouvido:
- Uints: cubo, apresentação em que nasceu, disparos em cada apresentação;
- ramos que funcionam: cubo de origem, Uint de destino, apresentação em que passou a funcionar, e em quais apresentações
  participou de algum disparo (bit por apresentação).
O motor guarda o comprimento do ramo, não o traçado: aqui o ramo é desenhado reto, da origem à Uint (as variantes, mais
longas, ficam sobre a mesma reta)."""
import json, pathlib
import numpy as np

AQUI = pathlib.Path(__file__).resolve().parent

def main():
    blob = bytearray(); meta = {"ouvidos": {}}
    def poe(nome, arr):
        while len(blob) % 4: blob.append(0)
        meta[nome] = dict(off=len(blob), n=int(arr.size), tipo=str(arr.dtype)); blob.extend(np.ascontiguousarray(arr).tobytes())
    for ouv in ("esq", "dir"):
        d = np.load(AQUI / "dados" / f"sessoes-{ouv}.npz")
        res = json.loads(str(d["resumo"])); NA = len(res); N = int(d["N"])
        ini = np.array([r["inicio"] for r in res]); fim = ini + np.array([r["dur"] for r in res])
        def apresentacao(t):
            a = np.searchsorted(ini, t, side="right") - 1
            return np.clip(a, 0, NA - 1).astype(np.uint8)
        ex, ey, ez = d["ex"], d["ey"], d["ez"]; nU = len(ex)
        u_ap = apresentacao(d["log_u"][:, 0])
        fires = np.zeros((NA, nU), np.uint16); prev = np.zeros(nU, np.int64)
        for a in range(NA):
            cum = d[f"ap{a + 1}_u_nin"].astype(np.int64); c = np.zeros(nU, np.int64); c[:len(cum)] = cum
            fires[a] = np.minimum(c - prev, 65535); prev = c
        ok = d["r_ok"] == 1
        src, dst = d["r_src"][ok], d["r_dst"][ok]
        px, py, pz = d["px"], d["py"], d["pz"]
        sx = np.where(src < N, px[np.minimum(src, N - 1)], ex[np.maximum(src - N, 0)])
        sy = np.where(src < N, py[np.minimum(src, N - 1)], ey[np.maximum(src - N, 0)])
        sz = np.where(src < N, pz[np.minimum(src, N - 1)], ez[np.maximum(src - N, 0)])
        r_ap = apresentacao(d["r_born"][ok])
        uso = np.zeros(ok.sum(), np.uint8); prevp = np.zeros(len(ok), np.int64)
        for a in range(NA):
            cum = d[f"ap{a + 1}_r_part"].astype(np.int64); c = np.zeros(len(ok), np.int64); c[:len(cum)] = cum
            uso |= (((c - prevp)[ok] > 0).astype(np.uint8) << a); prevp = c
        p = f"{ouv}_"
        poe(p + "u_xyz", np.stack([ex, ey, ez], 1).astype(np.int16)); poe(p + "u_ap", u_ap); poe(p + "u_fires", fires)
        poe(p + "r_src", np.stack([sx, sy, sz], 1).astype(np.int16)); poe(p + "r_dst", (dst - N).astype(np.int32))
        poe(p + "r_ap", r_ap); poe(p + "r_uso", uso)
        meta["ouvidos"][ouv] = dict(n_uints=int(nU), n_ramos=int(ok.sum()), apresentacoes=res)
    vis = AQUI.parent / "visual"
    (vis / "sessoes.bin").write_bytes(bytes(blob)); (vis / "sessoes.json").write_text(json.dumps(meta, ensure_ascii=False))
    print(len(blob) / 1e6, "MB", {o: (m["n_uints"], m["n_ramos"]) for o, m in meta["ouvidos"].items()})

if __name__ == "__main__":
    main()
