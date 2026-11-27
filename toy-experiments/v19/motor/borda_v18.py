"""V0.19 — saída da borda da V0.18 para um trecho de gravação (calculada uma vez e reaproveitada: decisão de 24/11).

Só importa os módulos da V0.18 (leitura); nada nela é alterado. O cache do numba vai para /tmp (não escreve na pasta da V0.18).
Uso: python borda_v18.py <gravacao> <inicio_s> <dur_s> <apelido>
Grava motor/dados/borda-<apelido>-<inicio>-<dur>.npz com, por ouvido: instante (s), faixa, ponto (posto na faixa), magnitude."""
import os, sys, json, time, pathlib
os.environ.setdefault("NUMBA_CACHE_DIR", "/tmp/numba-v19")
import numpy as np

AQUI = pathlib.Path(__file__).resolve().parent
V18 = AQUI.parents[1] / "v18" / "borda"
sys.path.insert(0, str(V18))
import cena, coclea, pontos, motor   # V0.18

def rodar(grav, ini, dur, apelido):
    par = json.loads((V18 / "calibracao.json").read_text())["parametros"]
    P = pontos.construir()
    t0 = time.time()
    mic, _, nivel = cena.microfones(ini, dur, grav, cru=True)
    aten = coclea.atenuacao_reflexo(nivel)
    out = {}
    for ear in ("esq", "dir"):
        D = coclea.comando(mic[ear], reflexo_db=aten)
        B = motor.Borda(P, par)
        ev = B.rodar(D, 0.0, cap=2_000_000)
        T = np.concatenate([e[0] for e in ev]); F = np.concatenate([np.full(len(e[0]), b, np.int8) for b, e in enumerate(ev)])
        K = np.concatenate([e[1] for e in ev]).astype(np.int16); M = np.concatenate([e[2] for e in ev]).astype(np.float32)
        o = np.argsort(T, kind="stable")
        out[ear] = (T[o], F[o], K[o], M[o])
        print(ear, f"{len(T):,} incidências", f"{time.time() - t0:.1f} s", flush=True)
    dados = AQUI / "dados"; dados.mkdir(exist_ok=True)
    nome = dados / f"borda-{apelido}-{ini:g}-{dur:g}.npz"
    np.savez(nome, **{f"{e}_{c}": v for e in out for c, v in zip("tfkm", out[e])}, ini=ini, dur=dur, gravacao=str(grav))
    return nome

if __name__ == "__main__":
    print("gravado", rodar(sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), sys.argv[4]))
