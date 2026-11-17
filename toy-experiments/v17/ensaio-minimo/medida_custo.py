"""Medida de custo ao longo do aprendizado (fila aprovada em 17/11): eventos por segundo simulado em cada episódio, ramos ao fim
de cada episódio e tempo por evento. Motor: motor_rapido com fila por cursor (exato). Sementes 61-70, grave e agudo, conjunto B, I1.
Uso: ../../../../venv-nb/bin/python -I medida_custo.py  (gera medida-custo-saida.csv)"""
import csv, os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import motor_rapido as rap
from confirmacao_correcoes import CONJ

def job(a):
    f, s = a
    t = time.time(); y = rap.rodar("I1", f, s, OPT=1, CUR=True, **CONJ["B"]); dt = time.time() - t
    return dict(faixa=f, semente=s, tempo_s=round(dt, 3), classe=y["classe"], eventos=y["eventos_por_episodio"],
                ramos=y["ramos_fim_episodio"], incidencias=y["incidencias_por_episodio"])

if __name__ == "__main__":
    rap.rodar("I1", "grave", 1, dur=200.0, CUR=True)
    with Pool(2) as p: R = p.map(job, [(f, s) for f in ("grave", "agudo") for s in range(61, 71)])
    assert len(R) == 20
    with open("medida-custo-saida.csv", "w", newline="") as fh:
        w = csv.DictWriter(fh, fieldnames=list(R[0])); w.writeheader(); w.writerows(R)
    for f in ("grave", "agudo"):
        v = [r for r in R if r["faixa"] == f]; ev = sum(sum(r["eventos"]) for r in v); tt = sum(r["tempo_s"] for r in v)
        print(f, "ns por evento", round(tt / ev * 1e9, 1))
        for e in range(5):
            evs = sorted(r["eventos"][e] / 10.0 for r in v); rms = sorted(r["ramos"][e] for r in v); inc = sorted(r["incidencias"][e] / 10.0 for r in v)
            print("  episódio", e + 1, "| eventos/s simulado: mediana", int(evs[5]), "faixa", int(evs[0]), "-", int(evs[-1]),
                  "| ramos ao fim: mediana", rms[5], "faixa", rms[0], "-", rms[-1], "| incidências/s", int(inc[5]))
