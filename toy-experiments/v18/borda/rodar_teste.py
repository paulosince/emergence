"""V0.18 — teste na borda auditiva. Uso: python rodar_teste.py [inicio_s] [dur_s] [gravacao] [apelido]
Grava eventos-<inicio>-<dur>.npz (instante, faixa, ponto, magnitude, por ouvido) e contadores de perdas."""
import sys, json, time, numpy as np
import cena, coclea, pontos, motor

ini = float(sys.argv[1]) if len(sys.argv) > 1 else 0.0
dur = float(sys.argv[2]) if len(sys.argv) > 2 else 10.0
grav = sys.argv[3] if len(sys.argv) > 3 else None
apelido = sys.argv[4] if len(sys.argv) > 4 else ""
par = json.load(open("calibracao.json"))["parametros"]
P = pontos.construir()
t0 = time.time()
mic, _ = cena.microfones(ini, dur, grav)
out = {}; cont = {}
for ear in ("esq", "dir"):
    D = coclea.comando(mic[ear])
    B = motor.Borda(P, par)
    ev = B.rodar(D, 0.0, cap=2_000_000)
    T = np.concatenate([e[0] for e in ev]); F = np.concatenate([np.full(len(e[0]), b, np.int8) for b, e in enumerate(ev)])
    K = np.concatenate([e[1] for e in ev]).astype(np.int16); M = np.concatenate([e[2] for e in ev])
    o = np.argsort(T, kind="stable")
    out[ear] = (T[o], F[o], K[o], M[o]); cont[ear] = B.cont.copy()
    print(ear, f"{len(T):,} incidências repassadas", f"{time.time()-t0:.1f} s")
nome = f"eventos-{apelido + '-' if apelido else ''}{ini:g}-{dur:g}.npz"
np.savez_compressed(nome, **{f"{e}_{c}": v for e in out for c, v in zip("tfkm", out[e])},
                    **{f"{e}_cont": cont[e] for e in cont}, ini=ini, dur=dur, gravacao=str(grav or ""), apelido=apelido,
                    cap=np.array([len(p["limiar_db"]) for p in P]), fc=coclea.centros())
print("gravado", nome)
