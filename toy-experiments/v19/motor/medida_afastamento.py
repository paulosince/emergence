"""V0.19 — registro por afastamento entre bandas, para os braços do teste de 60 s (pedido de Paulo, 28/11).

Para cada braço e cada afastamento entre bandas (|banda a − banda b| = 0, 1, 2, ...), conta três coisas, só entre
chegadas (pontas das Upros do nervo) que dividem um território de Ustr:
- disponíveis: pares possíveis no território (geometria; não depende do som);
- ambas prontas: pares cujas duas Upros terminaram de crescer até o fim do trecho;
- coincidiram: pares em que o motor registrou coincidência e criou a Uint (p_a, p_b; primeira vez do par).
Também dá o instante em que cada contagem começa (primeira Upro pronta do par; primeira coincidência).
Uso: python medida_afastamento.py <prefixo> <braco> [<braco> ...]   (lê dados/<prefixo>-<braco>-esq.npz)"""
import json, pathlib, sys
import numpy as np

AQUI = pathlib.Path(__file__).resolve().parent


def medir(arq):
    d = np.load(arq)
    N = int(d["N"]); banda = d["banda"].astype(np.int64); pu = d["pu"].astype(np.int64)
    lt = d["log_t"]; pronta = np.full(N, np.inf)
    m = lt[:, 2] >= 1.0 - 1e-9
    for t, e in zip(lt[m, 0], lt[m, 1].astype(np.int64)):
        if e < N and t < pronta[e]:
            pronta[e] = t
    disp, ambas, t_ambas = {}, {}, {}
    ordem = np.argsort(pu, kind="stable"); pu_o = pu[ordem]
    cortes = np.flatnonzero(np.diff(pu_o)) + 1
    for g in np.split(ordem, cortes):
        if len(g) < 2:
            continue
        a, b = np.triu_indices(len(g), 1); a, b = g[a], g[b]
        af = np.abs(banda[a] - banda[b]); tp = np.maximum(pronta[a], pronta[b])
        for k in np.unique(af):
            s = af == k; k = int(k)
            disp[k] = disp.get(k, 0) + int(s.sum())
            ok = np.isfinite(tp[s]); ambas[k] = ambas.get(k, 0) + int(ok.sum())
            if ok.any():
                t_ambas[k] = min(t_ambas.get(k, np.inf), float(tp[s][ok].min()))
    pa, pb, pt = d["p_a"].astype(np.int64), d["p_b"].astype(np.int64), d["p_t"]
    s = (pa < N) & (pb < N)
    af = np.abs(banda[pa[s]] - banda[pb[s]]); tt = pt[s]
    coinc = {int(k): int((af == k).sum()) for k in np.unique(af)}
    t_coinc = {int(k): float(tt[af == k].min()) for k in np.unique(af)}
    ks = sorted(set(disp) | set(coinc))
    linhas = [dict(afastamento=k, disponiveis=disp.get(k, 0), ambas_prontas=ambas.get(k, 0), coincidiram=coinc.get(k, 0),
                   primeira_ambas_prontas_s=round(t_ambas[k], 3) if k in t_ambas else None,
                   primeira_coincidencia_s=round(t_coinc[k], 3) if k in t_coinc else None) for k in ks]
    return dict(braco=str(d["braco"]), nervo=int(d["nervo"]), upros_prontas=int(np.isfinite(pronta).sum()), chegadas=N,
                pares_com_uint_fora_das_chegadas=int((~s).sum()), por_afastamento=linhas)


if __name__ == "__main__":
    pre = sys.argv[1]; res = [medir(AQUI / "dados" / f"{pre}-{b}-esq.npz") for b in sys.argv[2:]]
    for r in res:
        print(f"\n{r['braco']}: nervo {r['nervo']} cubos; Upros prontas {r['upros_prontas']} de {r['chegadas']}; "
              f"pares que envolvem Uint {r['pares_com_uint_fora_das_chegadas']}")
        print("  afast  disponíveis  ambas prontas  coincidiram  1ª ambas (s)  1ª coincid. (s)")
        for l in r["por_afastamento"]:
            print(f"  {l['afastamento']:5d}  {l['disponiveis']:11d}  {l['ambas_prontas']:13d}  {l['coincidiram']:11d}  "
                  f"{l['primeira_ambas_prontas_s']!s:>12}  {l['primeira_coincidencia_s']!s:>15}")
    (AQUI / "dados" / f"{pre}-afastamento.json").write_text(json.dumps(res, ensure_ascii=False, indent=1))
