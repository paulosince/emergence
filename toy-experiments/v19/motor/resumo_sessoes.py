"""V0.19 — números por apresentação do ensaio com as gravações completas (descritivo; não é o critério de "em sua maioria")."""
import json, sys, pathlib
import numpy as np
AQUI = pathlib.Path(__file__).resolve().parent
def resumo(ouv):
    d = np.load(AQUI / "dados" / f"sessoes-{ouv}.npz"); res = json.loads(str(d["resumo"])); N = int(d["N"])
    ini = np.array([r["inicio"] for r in res]); nU = len(d["ex"]); ub = np.searchsorted(ini, d["log_u"][:, 0], side="right") - 1
    ok = d["r_ok"] == 1; rb = np.searchsorted(ini, d["r_born"], side="right") - 1
    out = []; prevu = np.zeros(nU, np.int64); prevr = np.zeros(len(ok), np.int64)
    for a, r in enumerate(res):
        cu = np.zeros(nU, np.int64); x = d[f"ap{a+1}_u_nin"]; cu[:len(x)] = x; f = cu - prevu; prevu = cu
        cr = np.zeros(len(ok), np.int64); y = d[f"ap{a+1}_r_part"]; cr[:len(y)] = y; pr = cr - prevr; prevr = cr
        c = r["contadores"]
        out.append(dict(ap=a + 1, gravacao=r["gravacao"].replace("satie-gymnopedie1-", ""), dur=round(r["dur"], 1), uints_total=r["uints"],
                        uints_novas=r["uints_novas"], ramos_novos=r["ramos_novos"], disparos=int(f.sum()),
                        disparos_de_uints_antigas=float(f[ub < a].sum() / max(1, f.sum())),
                        uints_antigas_que_dispararam=int(((f > 0) & (ub < a)).sum()), uints_antigas=int((ub < a).sum()),
                        participacoes_de_ramos_antigos=float(pr[rb < a].sum() / max(1, pr.sum())),
                        integradas=1 - (c["fracassos"] + c.get("incidências que expiraram no ponto (fibra crescendo)", 0)) / max(1, c["emissões"]),
                        expiraram_no_ponto=c.get("incidências que expiraram no ponto (fibra crescendo)", 0) / max(1, c["emissões"]),
                        fibras_completas=int((d[f"ap{a+1}_tr"] >= int(d["tr_passos"])).sum()) if f"ap{a+1}_tr" in d.files else None))
    return out
if __name__ == "__main__":
    for o in sys.argv[1:]:
        for x in resumo(o): print(o, json.dumps(x, ensure_ascii=False))
