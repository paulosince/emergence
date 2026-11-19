"""V0.18 — conferências do observador no teste de 10 s (fora do robô; não alteram nada). Uso: python conferencias.py eventos-0-10.npz
Medidas descritivas apenas: os critérios de "suficiente" são do responsável e ainda não foram fixados."""
import sys, json, numpy as np
import matplotlib; matplotlib.use("Agg"); import matplotlib.pyplot as plt
from scipy.signal import stft, sosfilt
import cena, coclea, pontos

z = np.load(sys.argv[1]); ini, dur = float(z["ini"]), float(z["dur"]); fc = z["fc"]; cap = z["cap"]
P = pontos.construir()
ev = {e: (z[e + "_t"], z[e + "_f"].astype(int), z[e + "_k"].astype(int), z[e + "_m"]) for e in ("esq", "dir")}
res = {}

# 1. Diferença de chegada (faixas graves, abaixo da janela de fase): correlação cruzada dos trens esq × dir por faixa
lag_max, bin_s = 1.0e-3, 10e-6
nb = int(dur / bin_s) + 1; L = int(lag_max / bin_s)
itd = []
for b in range(64):
    if fc[b] > 1200: break
    h = {}
    for e in ev:
        t, f = ev[e][0], ev[e][1]
        h[e] = np.bincount((t[f == b] / bin_s).astype(int), minlength=nb)[:nb].astype(float)
    if h["esq"].sum() < 100 or h["dir"].sum() < 100:
        itd.append((float(fc[b]), None, None)); continue
    he, hd = h["esq"] - h["esq"].mean(), h["dir"] - h["dir"].mean()
    F = np.fft.rfft(he, 2 * nb); G = np.fft.rfft(hd, 2 * nb)
    cc = np.fft.irfft(np.conj(F) * G)              # cc[k] > 0: direito atrasado k bins
    lags = np.r_[np.arange(0, L + 1), np.arange(-L, 0)]
    v = np.r_[cc[:L + 1], cc[-L:]]
    k = lags[np.argmax(v)]
    itd.append((float(fc[b]), float(k * bin_s * 1e3), float(v.max() / np.sqrt((he ** 2).sum() * (hd ** 2).sum()))))
res["diferenca_de_chegada"] = dict(descricao="atraso do ouvido direito em relação ao esquerdo (ms) no pico da correlação; >0 = esquerdo primeiro",
                                   esperado_alto_falante_proximo_ms=None, por_faixa=[dict(fc=a, atraso_ms=b, correlacao=c) for a, b, c in itd])
# atraso físico esperado (cabeça esférica): próximo à esquerda
ang = {e: ((cena.azimute(cena.NEAR) - a + 180) % 360) - 180 for e, a in cena.EARS.items()}
r = np.linalg.norm(cena.NEAR - cena.HEAD)
exp_near = (cena.woodworth(ang["dir"]) - cena.woodworth(ang["esq"])) * 1e3
angf = {e: ((cena.azimute(cena.FAR) - a + 180) % 360) - 180 for e, a in cena.EARS.items()}
exp_far = (cena.woodworth(angf["dir"]) - cena.woodworth(angf["esq"])) * 1e3
res["diferenca_de_chegada"]["esperado_alto_falante_proximo_ms"] = exp_near
res["diferenca_de_chegada"]["esperado_alto_falante_distante_ms"] = exp_far

# 2. Diferença de volume: pontos ativos (≥1 incidência em 50 ms) esq − dir, por faixa
jan = 0.05; nj = int(dur / jan)
ativos = {}
for e in ev:
    t, f, k, _ = ev[e]
    j = np.minimum((t / jan).astype(int), nj - 1)
    key = np.unique((j * 64 + f) * 1000 + k)
    A = np.bincount(key // 1000, minlength=nj * 64).reshape(nj, 64)
    ativos[e] = A
dif = (ativos["esq"] - ativos["dir"]).mean(0)
res["diferenca_de_volume"] = dict(descricao="média, em janelas de 50 ms, de (pontos ativos à esquerda − à direita), por faixa",
                                  por_faixa=[dict(fc=float(fc[b]), esq_menos_dir=float(dif[b]), frac_ativos_esq=float(ativos['esq'][:, b].mean() / cap[b]),
                                                  frac_ativos_dir=float(ativos['dir'][:, b].mean() / cap[b])) for b in range(64)])

# 3. Notas e ritmo: energia da gravação (canal do alto-falante próximo, espectro independente da cóclea) × pontos ativos
GRAV = str(z["gravacao"]) if "gravacao" in z.files and str(z["gravacao"]) else None
mic, (Lsrc, Rsrc) = cena.microfones(ini, dur, GRAV)
fs = cena.FS; nper = int(jan * fs)
fr, tt, S = stft(mic["esq"], fs=fs, nperseg=4096, noverlap=4096 - nper, boundary=None, padded=False)
ec = coclea.E(fc); step = ec[1] - ec[0]; fe = coclea.Einv(np.r_[ec[0] - step / 2, (ec[:-1] + ec[1:]) / 2, ec[-1] + step / 2])
Eb = np.array([(abs(S[(fr >= fe[b]) & (fr < fe[b + 1])]) ** 2).sum(0) for b in range(64)])      # (64, frames)
cent = tt - 2048 / fs + jan / 2                                                                     # alinhar frames ao centro das janelas
jj = np.clip(((tt) / jan).astype(int), 0, nj - 1)
corr = []
for b in range(64):
    x = 10 * np.log10(Eb[b] + 1e-20); y = ativos["esq"][jj, b].astype(float)
    if y.std() == 0 or x.std() == 0: corr.append(None); continue
    rx, ry = np.argsort(np.argsort(x)), np.argsort(np.argsort(y))
    corr.append(float(np.corrcoef(rx, ry)[0, 1]))
res["notas_e_ritmo"] = dict(descricao="correlação de postos (Spearman), por faixa, entre energia da faixa no espectro da gravação e pontos ativos (ouvido esquerdo), janelas de 50 ms",
                            por_faixa=[dict(fc=float(fc[b]), spearman=corr[b]) for b in range(64)])

# 4. Ataques: incidências em janelas de 5 ms, soma de todas as faixas; razão entre o pico logo após um aumento de energia e o nível 50-100 ms depois
j5 = 0.005; n5 = int(dur / j5)
tot = np.bincount(np.minimum((ev["esq"][0] / j5).astype(int), n5 - 1), minlength=n5)
env = np.array([np.sqrt(np.mean(mic["esq"][i * int(j5 * fs):(i + 1) * int(j5 * fs)] ** 2)) for i in range(n5)])
lv = 20 * np.log10(env + 1e-12)
on = np.where((lv[4:] - lv[:-4] > 6) & (lv[4:] > lv.max() - 40))[0] + 4
on = on[np.r_[True, np.diff(on) > 40]]                   # ataques separados por ≥200 ms
raz = [float(tot[o:o + 4].max() / max(tot[o + 10:o + 20].mean(), 1)) for o in on if o + 20 < n5]
res["ataques"] = dict(descricao="ataques = subida ≥6 dB da energia em 20 ms; razão pico (0–20 ms) / sustentado (50–100 ms) do total de incidências do ouvido esquerdo",
                      n_ataques=len(raz), instantes_s=[float(o * j5) for o in on], razoes=raz)

# 5. Perdas
cont = {e: z[e + "_cont"] for e in ev}
H = np.abs(np.polyval([1], 0))
from scipy.signal import sosfreqz
_, hf = sosfreqz(coclea._SOS_FASE, worN=fc, fs=fs)
res["perdas"] = dict(descricao="por faixa: emitidas pela Utrd, repassadas, bloqueadas pela janela de refratariedade, tentativas sem reserva; janela de fase = ganho da oscilação (fase) na frequência central",
                     por_faixa=[dict(fc=float(fc[b]), emitidas=int(cont['esq'][b, 0]), repassadas=int(cont['esq'][b, 1]), bloq_refratariedade=int(cont['esq'][b, 2]),
                                     tentativas_sem_reserva=int(cont['esq'][b, 3]), ganho_fase_dB=float(20 * np.log10(abs(hf[b]))),
                                     magnitude_media=float(ev['esq'][3][ev['esq'][1] == b].mean()) if np.any(ev['esq'][1] == b) else None) for b in range(64)])
json.dump(res, open(sys.argv[1].replace(".npz", "-conferencias.json").replace("eventos", "conferencias"), "w"), indent=1)

# figura
fig, ax = plt.subplots(5, 1, figsize=(10, 15), constrained_layout=True)
x = [a for a, b, c in itd if b is not None]; y = [b for a, b, c in itd if b is not None]
ax[0].semilogx(x, y, "o-"); ax[0].axhline(exp_near, color="g", ls="--", label=f"alto-falante próximo ({exp_near:+.2f} ms)")
ax[0].axhline(exp_far, color="r", ls="--", label=f"distante ({exp_far:+.2f} ms)"); ax[0].legend(); ax[0].set_ylabel("atraso dir − esq (ms)")
ax[0].set_title("1. Diferença de chegada (faixas até 1,2 kHz)")
ax[1].semilogx(fc, dif, "o-"); ax[1].axhline(0, color="k", lw=.5); ax[1].set_ylabel("pontos ativos esq − dir"); ax[1].set_title("2. Diferença de volume")
ax[2].semilogx(fc, [c if c is not None else np.nan for c in corr], "o-"); ax[2].set_ylim(-0.2, 1); ax[2].set_ylabel("Spearman"); ax[2].set_title("3. Notas e ritmo: energia × pontos ativos")
im = ax[3].imshow(ativos["esq"].T / cap[:, None], aspect="auto", origin="lower", extent=[ini, ini + dur, 0, 64], cmap="magma", vmin=0, vmax=1)
ax[3].set_ylabel("faixa"); ax[3].set_title("Fração de pontos transdutivos ativos (ouvido esquerdo, 50 ms)"); fig.colorbar(im, ax=ax[3])
tb = np.arange(n5) * j5 + ini
ax[4].plot(tb, tot / j5 / 1e6, lw=.6); [ax[4].axvline(ini + o * j5, color="r", lw=.5, alpha=.5) for o in on]
ax[4].set_ylabel("milhões de incidências/s"); ax[4].set_xlabel("tempo (s)"); ax[4].set_title("4. Ataques (linhas vermelhas = ataques na gravação)")
for a in ax[:3]: a.set_xlabel("frequência central (Hz)")
fig.savefig(sys.argv[1].replace(".npz", "-conferencias.png").replace("eventos", "conferencias"), dpi=110)
print(json.dumps({k: (v if k in ("ataques",) else "ok") for k, v in res.items()}, indent=0)[:1500])
print("ITD:", [(round(a), b) for a, b, c in itd])
print("corr:", np.round([c if c is not None else np.nan for c in corr], 2))
