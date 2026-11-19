"""V0.18 — roda a bateria de testes na borda auditiva. Uso: python rodar_bateria.py [grupo ...]
Para cada grupo grava em bateria/ (ignorado pelo git): eventos-<grupo>.npz (incidências: µs desde o início, faixa,
ponto, magnitude ×255, por ouvido) e, para a página, em visual/bateria/<grupo>/ os mesmos formatos das obras."""
import os, sys, json, time, subprocess
import numpy as np
import cena, coclea, pontos, motor

AQUI = os.path.dirname(os.path.abspath(__file__))
BAT = os.path.join(AQUI, "..", "estimulos", "bateria")
OUT = os.path.join(AQUI, "bateria"); os.makedirs(OUT, exist_ok=True)
FS = 48000; PEDACO = 10.0; FR = 0.005; SUB = 16; TETO = 212.0
par = json.load(open(os.path.join(AQUI, "calibracao.json")))["parametros"]
P = pontos.construir(); CAP = np.array([len(p["limiar_db"]) for p in P]); FC = coclea.centros()
CAT = json.load(open(os.path.join(BAT, "catalogo.json")))["trechos"]
GRUPOS = sorted({t["grupo"] for t in CAT})

def gz(caminho, dados):
    import gzip
    with gzip.open(caminho, "wb", compresslevel=9) as f: f.write(dados)

def ouvidos_do_grupo(g):
    x = np.fromfile(os.path.join(BAT, f"bateria-{g}.f32"), np.float32).astype(np.float64)
    B = np.fromfile(os.path.join(BAT, f"bateria-{g}-B.f32"), np.float32).astype(np.float64) if g.startswith("7-") else None
    n = len(x) + FS // 100; ear = {"esq": np.zeros(n), "dir": np.zeros(n)}
    for t in [t for t in CAT if t["grupo"] == g]:
        i0, i1 = int(round(t["inicio"] * FS)), int(round(t["fim"] * FS))
        for src, az in ((x, t["azimute"]),) + (((B, t["azimute_B"]),) if B is not None else ()):
            o = cena.fonte_virtual(np.r_[src[i0:i1], np.zeros(FS // 100)], az)
            for e in ear: ear[e][i0:i0 + len(o[e])] += o[e]
    return ear

def rodar(g):
    t_ini = time.time()
    ear = ouvidos_do_grupo(g); n = len(ear["esq"]); dur = n / FS
    nivel = cena.nivel_reflexo(ear); aten_max = 0.0       # atenuação calculada por pedaço (economiza memória)
    NF = int(np.ceil(dur / FR)); grade = {}
    dd = os.path.join(OUT, g); os.makedirs(dd, exist_ok=True)
    nfp = int(PEDACO / FR) + 2
    for e in ("esq", "dir"):
        C = coclea.CocleaContinua(); B = motor.Borda(P, par)
        G = np.zeros(NF * 64 * SUB, np.float32); total = 0
        for ci, a in enumerate(range(0, n, int(PEDACO * FS))):
            b = min(n, a + int(PEDACO * FS))
            at = coclea.atenuacao_reflexo(nivel[a:b]); aten_max = max(aten_max, float(at.max()))
            D = C.processar(ear[e][a:b], at); del at
            out = B.rodar(D, a / FS, cap=4_000_000); del D
            f0 = int(a / FS / FR); Gl = np.zeros(nfp * 64 * SUB); partes = []
            for fx, (tt, kk, mm) in enumerate(out):
                if len(tt) == 0: continue
                fr = np.clip(np.minimum((tt / FR).astype(np.int64), NF - 1) - f0, 0, None); sub = (kk.astype(np.int64) * SUB) // CAP[fx]
                Gl += np.bincount((fr * 64 + fx) * SUB + sub, weights=mm, minlength=nfp * 64 * SUB)[:nfp * 64 * SUB]
                partes.append((np.round(tt * 1e6).astype(np.uint32), np.full(len(tt), fx, np.uint8), kk.astype(np.uint16), np.round(mm * 255).astype(np.uint8)))
            m = min(nfp, NF - f0); G[f0 * 64 * SUB:(f0 + m) * 64 * SUB] += Gl[:m * 64 * SUB].astype(np.float32)
            if partes:
                T = np.concatenate([p[0] for p in partes]); o = np.argsort(T, kind="stable"); total += len(T)
                np.savez_compressed(os.path.join(dd, f"{e}-{ci:03d}.npz"), tus=T[o], f=np.concatenate([p[1] for p in partes])[o],
                                    k=np.concatenate([p[2] for p in partes])[o], m255=np.concatenate([p[3] for p in partes])[o])
            del out, partes
        npont = np.array([[np.sum((np.arange(c) * SUB) // c == s) for s in range(SUB)] for c in CAP], np.float32)
        grade[e] = np.clip(G.reshape(NF, 64, SUB) / (npont[None] * FR * TETO), 0, 1); del G
        print(f"  {g} {e}: {total:,} incidências, {time.time() - t_ini:.0f} s")
    json.dump(dict(dur=dur, aten_max=aten_max, pedaco_s=PEDACO), open(os.path.join(dd, "info.json"), "w"))
    # dados da página (mesmos formatos das obras)
    vd = os.path.join(AQUI, "visual", "bateria", g); os.makedirs(vd, exist_ok=True)
    for e in ("esq", "dir"):
        gz(os.path.join(vd, f"grade-{e}.bin.gz"), (grade[e] * 255).round().astype(np.uint8).tobytes())
    ec = coclea.E(FC); st = ec[1] - ec[0]; fe = coclea.Einv(np.r_[ec[0] - st / 2, (ec[:-1] + ec[1:]) / 2, ec[-1] + st / 2])
    NFFT = 4096; w = np.hanning(NFFT); ff = np.fft.rfftfreq(NFFT, 1 / FS); grupo = np.searchsorted(fe, ff, side="right") - 1; ok = (grupo >= 0) & (grupo < 64)
    for e in ("esq", "dir"):
        x = np.r_[np.zeros(NFFT), ear[e], np.zeros(NFFT)]; S = np.zeros((NF, 64))
        for f_ in range(NF):
            c = NFFT + int(round((f_ + 0.5) * FR * FS))
            pw = 2 * np.abs(np.fft.rfft(x[c - NFFT // 2:c + NFFT // 2] * w)) ** 2 / (NFFT * np.sum(w ** 2))
            S[f_] = np.bincount(grupo[ok], weights=pw[ok], minlength=64)
        db = 10 * np.log10(S + 1e-30) - 20 * np.log10(20e-6)
        gz(os.path.join(vd, f"som-{e}.bin.gz"), (np.clip(db, 0, 90) / 90 * 255).round().astype(np.uint8).tobytes())
    y = np.stack([ear["esq"], ear["dir"]], 1); y = (y / np.abs(y).max() * 0.9).astype(np.float32)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", "48000", "-ac", "2", "-i", "-", "-c:a", "libvorbis", "-q:a", "3",
                    os.path.join(vd, "audio.ogg")], input=y.tobytes(), check=True)
    trechos = [dict(t, inicio=t["inicio"], fim=t["fim"]) for t in CAT if t["grupo"] == g]
    meta = dict(ini=0.0, dur=dur, quadro=FR, quadros=NF, sub=SUB, fc=FC.tolist(), cap=CAP.tolist(), som_db_max=90,
                verde_p99=int(max(1, np.percentile((np.concatenate([grade[e].ravel() for e in grade]) * 255)[np.concatenate([grade[e].ravel() for e in grade]) > 0], 99))),
                destaque=dict(faixas=[], janela=[0, 0]), trechos=trechos, aten_max=aten_max)
    json.dump(meta, open(os.path.join(vd, "meta.json"), "w"), default=float)
    print(f"  {g}: pronto em {time.time() - t_ini:.0f} s (atenuação máx {aten_max:.1f} dB)")

for g in (sys.argv[1:] or GRUPOS):
    rodar(g)
