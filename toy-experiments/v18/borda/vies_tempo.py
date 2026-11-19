"""V0.18 — investigação do viés do código de tempo (plano de extensão, seção 4). Tom sintético direto na cóclea (sem cabeça),
1 s, 60 dB; compara estimadores do período a partir das incidências das faixas perto da frequência."""
import json, numpy as np
import coclea, pontos, motor
FS = 48000; P = pontos.construir(); FC = coclea.centros()
par = json.load(open("calibracao.json"))["parametros"]
def tom(f, db, dur): t = np.arange(int(dur * FS)) / FS; return coclea.limiar_pa(db) * np.sin(2 * np.pi * f * t)
def incid(f, db=60.0, dur=1.0, par=par, faixas=None):
    D = coclea.comando(tom(f, db, dur)); fx = int(np.argmin(abs(FC - f)))
    faixas = faixas or list(range(max(0, fx - 2), min(64, fx + 3)))
    B = motor.Borda([P[b] for b in faixas], par); ev = B.rodar(D[faixas], 0.0)
    return [(e[0], e[1]) for e in ev], D[fx]
def est_autocorr(ts, f0, b=2e-6):
    t = np.concatenate(ts); t = t[t > 0.1]; t = t[t < 1.0]; h = np.bincount(((t - t.min()) / b).astype(int)).astype(float); h -= h.mean()
    ac = np.fft.irfft(np.abs(np.fft.rfft(h, 2 * len(h))) ** 2)[:len(h)]; T0 = 1 / f0; lo, hi = int(0.8 * T0 / b), int(1.2 * T0 / b)
    i = lo + int(np.argmax(ac[lo:hi])); return 1 / (i * b)
def est_isi_mesmo_ponto(ev, f0):
    T0 = 1 / f0; vals = []
    for t, k in ev:
        for kk in np.unique(k):
            tt = t[(k == kk) & (t > 0.1)]
            if len(tt) < 3: continue
            d = np.diff(tt); n = np.round(d / T0); m = n >= 1; vals += list(d[m] / n[m])
    return 1 / np.median(vals) if vals else None
def est_fase(ts, f0):
    t = np.concatenate(ts); t = t[t > 0.1]; fs = np.linspace(0.95 * f0, 1.05 * f0, 4001)
    vs = np.abs(np.exp(2j * np.pi * np.outer(fs, t[:20000])).sum(1)); return fs[np.argmax(vs)]
res = {}
for f0 in (250.0, 1000.0):
    ev, d = incid(f0); ts = [e[0] for e in ev]
    pk = np.where((d[1:-1] > d[:-2]) & (d[1:-1] >= d[2:]) & (d[1:-1] > 0.5 * d.max()))[0] + 1
    f_cmd = 1 / np.median(np.diff(pk / FS)[pk[1:] / FS > 0.1])
    res[f0] = dict(autocorr=est_autocorr(ts, f0), isi_mesmo_ponto=est_isi_mesmo_ponto(ev, f0), fase=est_fase(ts, f0), picos_do_comando=f_cmd,
                   n_incid=int(sum(len(x) for x in ts)))
    # reserva da Utrd sempre cheia (teste de código): tcU minúsculo
    evc, _ = incid(f0, dur=0.3, par=dict(par, tau0U=1e-4, tcU=1e-4, tcU3=1e-4, dtauU=0.0, MU=1e9)); tsc = [e[0] for e in evc]
    res[f0]["autocorr_reserva_cheia"] = est_autocorr(tsc, f0); res[f0]["fase_reserva_cheia"] = est_fase(tsc, f0)
    print(f0, {k: (round(v, 3) if isinstance(v, float) else v) for k, v in res[f0].items()})
json.dump(res, open("vies-tempo.json", "w"), indent=1)
