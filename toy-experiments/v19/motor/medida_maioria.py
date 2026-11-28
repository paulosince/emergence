"""V0.19 — "em sua maioria" medido pelas malhas percorridas [R 27/11].
Por apresentação: das passagens de incidências por ramos (cada chegada por um ramo conta uma passagem), a fração por
ramos que já existiam (funcionavam) antes daquela apresentação começar. Mais onde pararam as que não integraram.
Medida em passagens por ramo (uma incidência que desce por 5 ramos conta 5 passagens)."""
import json, sys, pathlib, os
PRE = os.environ.get("V19_PREFIXO", "")   # "" = planar; "vol" = volumétrico
import numpy as np
AQUI = pathlib.Path(__file__).resolve().parent
def medir(ouv):
    d = np.load(AQUI / "dados" / (f"{PRE}-sessoes-{ouv}.npz" if PRE else f"sessoes-{ouv}.npz")); res = json.loads(str(d["resumo"]))
    born = d["r_born"]; nr = len(born); prev = np.zeros(nr, np.int64); out = []
    for a, r in enumerate(res):
        c = np.zeros(nr, np.int64); x = d[f"ap{a+1}_rch"]; c[:len(x)] = x; dc = c - prev; prev = c
        antigos = (born >= 0) & (born < r["inicio"])
        k = {**r["contadores"]}
        for novo, velho in [("entrou na Upro do nervo", "entrou na fibra"), ("parou sem ramo adiante (ponta da Upro ou Uint)", "parou sem ramo adiante (ponta da fibra ou Uint)"), ("parou no ponto (Upro ainda crescendo)", "parou no ponto (fibra ainda crescendo)")]:
            k.setdefault(velho, k.get(novo, 0))   # planar (nomes antigos) ou volumétrico (nomes corrigidos em 28/11)
        tot = max(1, dc.sum())
        out.append(dict(ap=a + 1, gravacao=r["gravacao"].replace("satie-gymnopedie1-", ""), passagens=int(dc.sum()),
                        passagens_por_ramos_antigos=float(dc[antigos].sum() / tot),
                        entrou_na_upro_do_nervo=k["entrou na fibra"], desceu_por_ramos=k["desceu por ramos"],
                        integrou=k["incidências que integraram (desceram por ramo)"],
                        parou_numa_uint_sem_integrar=k["parou numa Uint sem integrar"],
                        parou_sem_ramo_adiante=k["parou sem ramo adiante (ponta da fibra ou Uint)"],
                        parou_no_ponto_upro_crescendo=k["parou no ponto (fibra ainda crescendo)"], emissoes=k["emissões"]))
    return out
if __name__ == "__main__":
    for o in sys.argv[1:]:
        for x in medir(o): print(o, json.dumps(x, ensure_ascii=False))
