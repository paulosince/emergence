"""V0.18 — prepara os dados da interface (cóclea em luz) a partir de eventos-*.npz.
Saída em visual/: grade-esq.bin, grade-dir.bin (uint8; quadros de 5 ms × 64 faixas × 16 colunas por faixa, colunas em ordem
de limiar), pontos-<faixa>.bin (incidências individuais de três faixas em destaque, numa janela), audio.ogg (microfones), meta.json."""
import os, sys, json, subprocess, numpy as np
import cena, coclea, pontos

z = np.load(sys.argv[1] if len(sys.argv) > 1 else "eventos-0-10.npz")
ini, dur = float(z["ini"]), float(z["dur"]); cap = z["cap"]; fc = z["fc"]
OUT = "visual"; os.makedirs(OUT, exist_ok=True)
FR = 0.005; NF = int(round(dur / FR)); SUB = 16; TETO = 212.0      # teto teórico da Utrd (4 pontos / 16,5 ms com reserva cheia)
P = pontos.construir()
meta = dict(ini=ini, dur=dur, quadro=FR, quadros=NF, sub=SUB, fc=fc.tolist(), cap=cap.tolist(),
            areas=[[int((p["area"] == a).sum()) for a in (1, 2, 3)] for p in P])
for e in ("esq", "dir"):
    t, f, k, m = z[e + "_t"], z[e + "_f"].astype(np.int64), z[e + "_k"].astype(np.int64), z[e + "_m"].astype(np.float64)
    fr = np.minimum((t / FR).astype(np.int64), NF - 1)
    sub = (k * SUB) // cap[f]
    idx = (fr * 64 + f) * SUB + sub
    G = np.bincount(idx, weights=m, minlength=NF * 64 * SUB)
    npont = np.array([[np.sum((np.arange(c) * SUB) // c == s) for s in range(SUB)] for c in cap], float)   # pontos por coluna
    G = G.reshape(NF, 64, SUB) / (npont[None] * FR * TETO)
    (np.clip(G, 0, 1) * 255).round().astype(np.uint8).tofile(f"{OUT}/grade-{e}.bin")
# incidências individuais: três faixas em destaque, janela com um ataque
DEST = [int(np.argmin(abs(fc - x))) for x in (200, 1000, 4000)]
J0, J1 = 5.0, 6.5
meta["destaque"] = dict(faixas=DEST, janela=[J0, J1])
for b in DEST:
    partes = []; cont = []
    for e in ("esq", "dir"):
        t, f, k, m = z[e + "_t"], z[e + "_f"], z[e + "_k"], z[e + "_m"]
        s = (f == b) & (t >= J0) & (t < J1)
        partes += [(t[s] - J0).astype(np.float32).tobytes(), k[s].astype(np.uint16).tobytes(), (m[s] * 255).round().astype(np.uint8).tobytes()]
        cont.append(int(s.sum()))
    with open(f"{OUT}/pontos-{b}.bin", "wb") as fh:
        fh.write(np.array(cont, np.uint32).tobytes())
        for e_i in range(2):
            fh.write(partes[3 * e_i]); fh.write(partes[3 * e_i + 1]); fh.write(partes[3 * e_i + 2])
    meta.setdefault("destaque_n", {})[str(b)] = cont
# áudio dos dois microfones (estéreo), normalizado só para ouvir
mic, _ = cena.microfones(ini, dur)
x = np.stack([mic["esq"], mic["dir"]], 1); x = (x / np.abs(x).max() * 0.9).astype(np.float32)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", "48000", "-ac", "2", "-i", "-", "-c:a", "libvorbis", "-q:a", "4", f"{OUT}/audio.ogg"],
               input=x.tobytes(), check=True)
json.dump(meta, open(f"{OUT}/meta.json", "w"))
print({fn: os.path.getsize(f"{OUT}/{fn}") for fn in os.listdir(OUT)})
