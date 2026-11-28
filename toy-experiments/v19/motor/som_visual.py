"""V0.19 — som para a página nos estudos dos braços: alto-falantes, microfones, fios e cóclea acesa, como na demonstração da
V0.18 (preparar_visual.py e canais_satie.py), para o trecho inteiro de cada gravação.

Uso: python som_visual.py <gravação> <dur> [<gravação> <dur> ...]
Por gravação, grava visual/som/<nome>-<dur>.bin + .json, com quadros de 10 ms (a V0.18 usa 5 ms; 10 ms para caber no celular):
- grade-esq (uint8; quadros × 64 faixas × 16 colunas): incidências do ouvido E, da borda da V0.18 com a cóclea contínua (a
  mesma entrada do motor no modo "continua"). Mesma normalização da V0.18 (teto teórico de 212 incidências/s por ponto);
- som-esq, som-dir (uint8; quadros × 64): espectro no microfone antes da cóclea, dB SPL 0–90 (como a V0.18);
- canais (uint8; 2 × quadros): nível de cada canal da gravação na fonte (como canais_satie.py; trecho mais forte = 85 dB).
Só o ouvido E tem incidências: os braços simulam só o ouvido esquerdo."""
import sys, json, pathlib, subprocess
import numpy as np
import teste_c as tc                      # mesma calibração e mesma borda do executor
from teste_c import cena, coclea, pontos, m18, V18

FR, SUB, TETO, NFFT = 0.010, 16, 212.0, 4096
VIS = tc.AQUI.parent / "visual" / "som"; VIS.mkdir(exist_ok=True)


def canais(grav, dur, NF):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(grav), "-f", "f32le", "-ac", "2", "-ar", "48000", "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
    w = int(0.125 * 48000); k = np.ones(w) / w
    G = 85.0 - 20 * np.log10(max(np.sqrt(np.convolve(x[:, c] ** 2, k, "valid")).max() for c in (0, 1)))
    out = np.zeros((2, NF), np.uint8); n = int(FR * 48000)
    for c in (0, 1):
        seg = x[:NF * n, c]; seg = np.pad(seg, (0, NF * n - len(seg)))
        db = 20 * np.log10(np.sqrt((seg.reshape(NF, n) ** 2).mean(1)) + 1e-12) + G
        out[c] = np.round(np.clip(db, 0, 90) / 90 * 255)
    return out


def main(pares):
    P = pontos.construir(); par = json.loads((V18 / "calibracao.json").read_text())["parametros"]
    cap = np.array([len(p["limiar_db"]) for p in P])
    npont = np.array([[np.sum((np.arange(c) * SUB) // c == s) for s in range(SUB)] for c in cap], float)
    for grav, dur in pares:
        grav = pathlib.Path(grav).resolve(); dur = float(dur); NF = int(round(dur / FR)); nome = grav.stem.replace("satie-gymnopedie1-", "")
        mic, _, nivel = cena.microfones(0.0, dur, str(grav), cru=True)
        # incidências do ouvido E (borda da V0.18 + cóclea contínua, em pedaços de 20 s)
        B = m18.Borda(P, par); CC = coclea.CocleaContinua(); G = np.zeros(NF * 64 * SUB); ini = 0.0
        while ini < dur - 1e-6:
            fim = min(ini + 20.0, dur); i0, i1 = int(round(ini * cena.FS)), min(int(round(fim * cena.FS)), len(nivel))
            D = CC.processar(mic["esq"][i0:i1], reflexo_db=coclea.atenuacao_reflexo(nivel[i0:i1]))
            for b, (t, k, m) in enumerate(B.rodar(D, ini)):
                fr = np.minimum((np.asarray(t) / FR).astype(np.int64), NF - 1); sub = (np.asarray(k, np.int64) * SUB) // cap[b]
                G += np.bincount((fr * 64 + b) * SUB + sub, weights=np.asarray(m, float), minlength=NF * 64 * SUB)
            ini = fim
        G = G.reshape(NF, 64, SUB) / (npont[None] * FR * TETO)
        grade = np.round(np.clip(G, 0, 1) * 255).astype(np.uint8)
        # espectro no microfone (antes da cóclea), como a V0.18
        fc = coclea.centros(); ec = coclea.E(fc); st = ec[1] - ec[0]
        fe = coclea.Einv(np.r_[ec[0] - st / 2, (ec[:-1] + ec[1:]) / 2, ec[-1] + st / 2])
        w = np.hanning(NFFT); ff = np.fft.rfftfreq(NFFT, 1 / 48000); grupo = np.searchsorted(fe, ff, side="right") - 1; ok = (grupo >= 0) & (grupo < 64)
        som = {}
        for e in ("esq", "dir"):
            x = np.r_[np.zeros(NFFT), mic[e], np.zeros(NFFT)]; S = np.zeros((NF, 64))
            for f_ in range(NF):
                c = NFFT + int(round((f_ + 0.5) * FR * 48000))
                pw = 2 * np.abs(np.fft.rfft(x[c - NFFT // 2:c + NFFT // 2] * w)) ** 2 / (NFFT * np.sum(w ** 2))
                S[f_] = np.bincount(grupo[ok], weights=pw[ok], minlength=64)
            db = 10 * np.log10(S + 1e-30) - 20 * np.log10(20e-6) - cena.SENSIB_MIC_DB
            som[e] = np.round(np.clip(db, 0, 90) / 90 * 255).astype(np.uint8)
        can = canais(grav, dur, NF)
        blob = bytearray(); meta = dict(gravacao=nome, dur=dur, quadro=FR, quadros=NF, sub=SUB, som_db_max=90)
        for k_, a in (("grade_esq", grade), ("som_esq", som["esq"]), ("som_dir", som["dir"]), ("canais", can)):
            meta[k_] = dict(off=len(blob), n=int(a.size)); blob.extend(np.ascontiguousarray(a).tobytes())
        gg = grade[grade > 0]; meta["verde_p99"] = int(np.percentile(gg, 99)) if gg.size else 255
        base = VIS / f"{nome}-{int(dur)}"
        base.with_suffix(".bin").write_bytes(bytes(blob)); base.with_suffix(".json").write_text(json.dumps(meta))
        print(nome, round(len(blob) / 1e6, 1), "MB", "p99", meta["verde_p99"])


if __name__ == "__main__":
    a = sys.argv[1:]; main(list(zip(a[0::2], a[1::2])))
