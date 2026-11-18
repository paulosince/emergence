"""Diagnóstico (18/11, "Sim, medir antes"): só medidas. O agudo aprende a fase, ou ela já vem dos atrasos iniciais?
Fase dos acertos por episódio (1 a 5), por Uint, no modelo adotado (sem força por fibra), sementes 371-400 (as do critério).
Por episódio: acertos; Uints com ≥100 acertos; dessas, R mediano, |fase| mediana e fração com p < 0,01 e |fase| < π/4.
Confere que o último episódio reproduz o resultado da reavaliação (critério de fase).
Uso: ../../../../venv-nb/bin/python -I diagnostico_fase_episodios.py  (gera diagnostico-fase-episodios-saida.txt)"""
import os, sys, statistics as st
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from multiprocessing import Pool
import numpy as np
import motor_fibras as fib
from confirmacao_correcoes import CONJ
from criterio_fase import sucesso_fase
NOVO = dict(RET=True, DURO=True, LE=0.30, LI=0.30, ESP=60.0, SIL=2000.0, RELOG=True, PART=True, NPART=100,
            FIB=8, LIMF=True, RMAX=300.0, PUNI=False, LTDN=True, ALTD=0.02)
SEM = list(range(371, 401))
def job(s):
    y = fib.rodar("I0", "agudo", s, CUR=True, **NOVO, **CONJ["B"])
    ok = sucesso_fase(y["fase_acertos"], y["disparos_por_uint"])[0]
    igual = bool(np.allclose(y["fase_acertos"], y["fase_por_episodio"][-1]))
    return s, ok, igual, y["fase_por_episodio"]
if __name__ == "__main__":
    fib.rodar("I0", "grave", 1, dur=200.0, CUR=True, **NOVO)
    with Pool(2) as p: R = p.map(job, SEM)
    out = [f"último episódio: sucesso pelo critério {sum(x[1] for x in R)}/30; fase do último episódio igual à medida antiga: {all(x[2] for x in R)}"]
    for ep in range(5):
        Rs, fs, boa, tot, nac = [], [], 0, 0, 0
        for _, _, _, F in R:
            c, s_, n = F[ep]
            nac += int(n.sum())
            for k in range(n.size):
                if n[k] < 100: continue
                r = float(np.hypot(c[k], s_[k]) / n[k]); f = float(np.arctan2(s_[k], c[k])); p = float(np.exp(-n[k] * r * r))
                Rs.append(r); fs.append(abs(f)); tot += 1; boa += (p < 0.01 and abs(f) < np.pi / 4)
        out.append(f"episódio {ep + 1}: acertos {nac} | Uints com ≥100 acertos {tot} | R mediano {st.median(Rs) if Rs else 0:.3f}"
                   f" | |fase| mediana {st.median(fs) if fs else 0:.3f} rad | em fase (p<0,01 e |fase|<π/4) {boa}/{tot}")
    open("diagnostico-fase-episodios-saida.txt", "w").write("\n".join(out) + "\n"); print("\n".join(out))
