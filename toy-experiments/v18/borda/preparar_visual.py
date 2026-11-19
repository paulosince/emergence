"""V0.18 — prepara os dados da interface (cóclea em luz) a partir de eventos-*.npz.
Saída em visual/: grade-esq.bin, grade-dir.bin (uint8; quadros de 5 ms × 64 faixas × 16 colunas por faixa, colunas em ordem
de limiar), pontos-<faixa>.bin (incidências individuais de três faixas em destaque, numa janela), audio.ogg (microfones), meta.json."""
import os, sys, json, subprocess, numpy as np
import cena, coclea, pontos

z = np.load(sys.argv[1] if len(sys.argv) > 1 else "eventos-0-10.npz")
ini, dur = float(z["ini"]), float(z["dur"]); cap = z["cap"]; fc = z["fc"]
OUT = sys.argv[2] if len(sys.argv) > 2 else "visual"; os.makedirs(OUT, exist_ok=True)
GRAV = str(z["gravacao"]) if "gravacao" in z.files and str(z["gravacao"]) else None
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
if len(sys.argv) > 3:
    # janela dada; faixas em destaque = a mais ativa (ouvido esquerdo) nas regiões grave (<400 Hz), média (400 Hz–2 kHz) e aguda (>2 kHz)
    J0 = float(sys.argv[3]); J1 = J0 + 1.5
    t, f = z["esq_t"], z["esq_f"]; n = np.bincount(f[(t >= J0) & (t < J1)], minlength=64)
    DEST = []
    for lo, hi in ((0, 400), (400, 2000), (2000, 1e9)):
        idx = np.where((fc >= lo) & (fc < hi))[0]; DEST.append(int(idx[np.argmax(n[idx])]))
else:
    DEST = [int(np.argmin(abs(fc - x))) for x in (200, 1000, 4000)]
    J0, J1 = 5.0, 6.5
meta["destaque"] = dict(faixas=DEST, janela=[J0, J1])
meta["area_pontos"] = {str(b): "".join(str(int(a)) for a in P[b]["area"]) for b in DEST}   # área de cada ponto, em ordem de limiar
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
# som chegando a cada faixa (espectro da gravação no microfone, ANTES da cóclea): dB SPL por faixa, quadros de 5 ms
mic, _ = cena.microfones(ini, dur, GRAV)
ec = coclea.E(fc); st = ec[1] - ec[0]; fe = coclea.Einv(np.r_[ec[0] - st / 2, (ec[:-1] + ec[1:]) / 2, ec[-1] + st / 2])
NFFT = 4096; w = np.hanning(NFFT); ff = np.fft.rfftfreq(NFFT, 1 / 48000)
grupo = np.searchsorted(fe, ff, side="right") - 1
for e in ("esq", "dir"):
    x = np.r_[np.zeros(NFFT), mic[e], np.zeros(NFFT)]
    S = np.zeros((NF, 64))
    for f_ in range(NF):
        c = NFFT + int(round((f_ + 0.5) * FR * 48000))
        pw = 2 * np.abs(np.fft.rfft(x[c - NFFT // 2:c + NFFT // 2] * w)) ** 2 / (NFFT * np.sum(w ** 2))
        ok = (grupo >= 0) & (grupo < 64)
        S[f_] = np.bincount(grupo[ok], weights=pw[ok], minlength=64)
    db = 10 * np.log10(S + 1e-30) - 20 * np.log10(20e-6) - cena.SENSIB_MIC_DB    # som real no ouvido (antes do microfone)
    (np.clip(db, 0, 90) / 90 * 255).round().astype(np.uint8).tofile(f"{OUT}/som-{e}.bin")
meta["som_db_max"] = 90
# escala de exibição do verde: percentil 99 da grade
gg = np.concatenate([np.fromfile(f"{OUT}/grade-{e}.bin", np.uint8) for e in ("esq", "dir")])
meta["verde_p99"] = int(np.percentile(gg[gg > 0], 99))
# áudio dos dois microfones (estéreo), normalizado só para ouvir
x = np.stack([mic["esq"], mic["dir"]], 1); x = (x / np.abs(x).max() * 0.9).astype(np.float32)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", "48000", "-ac", "2", "-i", "-", "-c:a", "libvorbis", "-q:a", "4", f"{OUT}/audio.ogg"],
               input=x.tobytes(), check=True)
json.dump(meta, open(f"{OUT}/meta.json", "w"))
import base64
for fn in os.listdir(OUT):
    if fn.endswith(".bin") or fn.endswith(".ogg"):
        json.dump({"base64": base64.b64encode(open(f"{OUT}/{fn}", "rb").read()).decode()}, open(f"{OUT}/{fn.replace('.', '-')}.json", "w"))
print({fn: os.path.getsize(f"{OUT}/{fn}") for fn in os.listdir(OUT)})
