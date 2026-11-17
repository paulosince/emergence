"""Diagnóstico do degrau 2 (pedido do responsável, 17/11: "Os dois"). Só medidas, nada muda no modelo.
Mesmas execuções do ensaio (grave, duas fontes, sementes 101-130). Por Uint e episódio: relação dominante dos acertos
(Δ1, Δ2 ou nenhuma) — para ver se "quem chega primeiro leva tudo" e quando; e os pares de Upros das Uints sintonizadas no fim
(destino compartilhado: muitas Uints servidas pelo mesmo par de Upros?).
Uso: ../../../../venv-nb/bin/python -I diagnostico_duas_relacoes.py  (gera diagnostico-duas-relacoes-saida.txt)"""
import csv, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_rapido as rap
from confirmacao_correcoes import CONJ
from ensaio_duas_relacoes import classifica, D1, D2, SEM

def job(s):
    y = rap.rodar("I1", "grave", s, CUR=True, hist=True, delta=D1, duas=(D1, D2), **CONJ["B"])
    e1, e2, et = y.pop("diag_e1"), y.pop("diag_e2"), y.pop("diag_et")
    traj = []
    for k in range(e1.shape[0]):
        t = ""
        for ep in range(e1.shape[1]):
            if et[k, ep] < 20: t += "_"
            elif e1[k, ep] / et[k, ep] >= 0.6: t += "1"
            elif e2[k, ep] / et[k, ep] >= 0.6: t += "2"
            else: t += "."
        traj.append(t)
    s1, s2, pr = classifica(y)
    return s, s1, s2, pr, traj, y["pares_upro_das_sintonizadas"]

if __name__ == "__main__":
    rap.rodar("I1", "grave", 1, dur=200.0, CUR=True)
    with Pool(2) as p: R = p.map(job, SEM)
    ref = {int(r["semente"]): (int(r["uints_d1"]), int(r["uints_d2"]), int(r["presas"])) for r in csv.DictReader(open("duas-relacoes-saida.csv")) if r["cond"] == "duas" and r["faixa"] == "grave"}
    out = []
    iguais = sum(ref[s] == (a, b, c) for s, a, b, c, _, _ in R)
    out.append(f"conferência: {iguais}/30 sementes com a mesma contagem do ensaio (a medida não altera o modelo)")
    out.append("legenda por Uint (5 episódios): 1 = acertos dominados por Δ1; 2 = por Δ2; . = misto; _ = < 20 acertos")
    prim = {"mesma": 0, "diferente": 0}; ep_prim = []
    for s, a, b, c, traj, pares in R:
        out.append(f"semente {s}: Δ1={a} Δ2={b} presas={c} | " + " ".join(traj) + f" | pares de Upros distintos nas sintonizadas: {len(pares)}")
        firsts = [(t.find(x), x) for t in traj for x in "12" if t.find(x) >= 0]
        if firsts:
            e0 = min(f for f, _ in firsts); ep_prim.append(e0 + 1)
            first_rel = {x for f, x in firsts if f == e0}
            later = {x for f, x in firsts if f > e0}
            prim["mesma" if (len(first_rel) == 1 and later <= first_rel) else "diferente"] += 1
    out.append(f"sementes em que todas as Uints que se sintonizaram depois seguiram a relação da primeira: {prim['mesma']} de {sum(prim.values())}")
    out.append(f"episódio da primeira sintonia (contagem): " + str({e: ep_prim.count(e) for e in sorted(set(ep_prim))}))
    open("diagnostico-duas-relacoes-saida.txt", "w").write("\n".join(out) + "\n"); print("\n".join(out))
