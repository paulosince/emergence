"""Quadro de exemplo do vídeo da V0.17 (só para avaliar o visual).
REAL: o som (gravação original, sem alterações) e a atividade dos 64 canais de cada orelha no instante t
      (energia por faixa ERB, canal esquerdo e direito da gravação, sem a acústica da sala).
ILUSTRATIVO: as Uint, os ramos e as unidades inibitórias (a V0.17 ainda não foi implementada).
Posições pela regra das coordenadas constitutivas: canais pela anatomia (proposta: duas espirais cocleares,
10 cm entre as orelhas); unidades nascem perto das fontes (centroide + dispersão com semente).
Uso: python3 -I quadro_exemplo.py [t_segundos]"""
import subprocess, sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from scipy.signal import spectrogram

AUDIO = "../estimulo/Toccata_et_Fugue_BWV565.ogg"
T = float(sys.argv[1]) if len(sys.argv) > 1 else 62.4
ZOOM = len(sys.argv) > 2 and sys.argv[2] == "zoom"
SR = 22050
BG, FG = "#07080b", "#c9d1d9"

raw = subprocess.run(["ffmpeg", "-v", "quiet", "-i", AUDIO, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"],
                     capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2)

# 64 faixas ERB entre 50 Hz e 8 kHz
def erb_space(lo, hi, n):
    e = lambda f: 21.4 * np.log10(1 + 0.00437 * f)
    inv = lambda E: (10 ** (E / 21.4) - 1) / 0.00437
    return inv(np.linspace(e(lo), e(hi), n))
FB = erb_space(50, 8000, 64)

def energia(canal, t, janela=0.05):
    i0 = int((t - janela / 2) * SR); seg = x[max(0, i0): i0 + int(janela * SR), canal]
    spec = np.abs(np.fft.rfft(seg * np.hanning(seg.size))) ** 2; f = np.fft.rfftfreq(seg.size, 1 / SR)
    bw = 24.7 * (4.37 * FB / 1000 + 1)
    e = np.array([spec[(f > fc - bw_ / 2) & (f < fc + bw_ / 2)].sum() for fc, bw_ in zip(FB, bw)])
    e = 10 * np.log10(e + 1e-12); return np.clip((e - (e.max() - 50)) / 50, 0, 1)

# anatomia proposta: espiral coclear (base = agudos, ápice = graves), 2,5 voltas, mm
def coclea(cx, lado):
    k = np.arange(64)[::-1] / 63.0                      # 0 = grave (ápice), 1 = agudo (base)
    th = (1 - k) * 2.5 * 2 * np.pi; r = 1.0 + 3.5 * k
    return np.c_[cx + lado * 3 * (1 - k), r * np.cos(th), r * np.sin(th) + 3 * (1 - k)]
PL, PR = coclea(-50, -1), coclea(50, 1)
EL, ER = energia(0, T), energia(1, T)

rng = np.random.default_rng(7)
# ILUSTRATIVO: Uint que juntam a mesma faixa (ou vizinha) das duas orelhas
uints = []
for b in rng.choice(np.arange(4, 60), 34, replace=False):
    b2 = int(np.clip(b + rng.integers(-1, 2), 0, 63))
    pos = (PL[b] + PR[b2]) / 2 + rng.normal(0, 2.0, 3)
    estavel = rng.random() < 0.4; ativo = min(EL[b], ER[b2]) > 0.55
    uints.append((b, b2, pos, estavel, ativo, 0.2 + 0.8 * rng.random()))
inibs = [(u, (PL[u[0]] + PR[u[1]]) / 2 * 0.6 + np.array([0, 0, -6]) + rng.normal(0, 2.0, 3)) for u in uints[::4]]

fig = plt.figure(figsize=(12.8, 7.2), dpi=100, facecolor=BG)
ax = fig.add_axes([0.0, 0.22, 1.0, 0.78], projection="3d", facecolor=BG)
ax.set_axis_off(); ax.view_init(elev=18, azim=-62)
if ZOOM:
    ax.set_xlim(-9, 9); ax.set_ylim(-6, 6); ax.set_zlim(-10, 8); ax.set_box_aspect((1.6, 1, 1)); ax.view_init(elev=14, azim=-58)
else:
    ax.set_xlim(-60, 60); ax.set_ylim(-30, 30); ax.set_zlim(-15, 20); ax.set_box_aspect((2, 1, 0.6))
cor_faixa = plt.cm.turbo(np.linspace(0.05, 0.95, 64))
for P, E in ((PL, EL), (PR, ER)):
    ax.plot(*P.T, color="#30363d", lw=0.8)
    ax.scatter(*P.T, marker="s", s=10 + 40 * E, c=cor_faixa, alpha=None, edgecolors="none", depthshade=False)
    ax.scatter(*P.T, marker="s", s=60 * E ** 2, c="white", alpha=0.25, edgecolors="none", depthshade=False)
for b, b2, pos, est, ativo, f in uints:
    for P, k in ((PL, b), (PR, b2)):
        q = P[k] if not ZOOM else pos + (P[k] - pos) * min(1.0, 9.5 / max(1e-9, abs(P[k][0] - pos[0])))
        ax.plot(*np.c_[q, pos], color="#58a6ff" if est else "#d29922", lw=0.4 + 1.2 * f, alpha=0.15 + 0.45 * f)
    c = "#39c5cf" if est else "#e3b341"
    if ativo: ax.scatter(*pos, s=900 if ZOOM else 260, c="white", alpha=0.18, edgecolors="none", depthshade=False)
    ax.scatter(*pos, s=(140 if est else 70) if ZOOM else (45 if est else 22), c=c, edgecolors="white" if ativo else "none", linewidths=0.8, depthshade=False)
for u, p in inibs:
    ax.scatter(*p, marker="v", s=90 if ZOOM else 30, c="#db61a2", depthshade=False)
    ax.plot(*np.c_[p, u[2]], color="#db61a2", lw=0.7, ls=(0, (2, 2)), alpha=0.8)

fig.text(0.015, 0.965, "ILUSTRAÇÃO — estrutura do Sdom fictícia; som e atividade dos canais reais", color="#f85149", fontsize=10, weight="bold")
fig.text(0.015, 0.935, f"EMERGENCE V0.17  ·  execução 1 de 3  ·  {int(T // 60):02d}:{T % 60:04.1f}  ·  Bach, Tocata e Fuga BWV 565 (A. Moïra, domínio público)", color=FG, fontsize=10)
if ZOOM:
    fig.text(0.04, 0.80, "câmera aproximada no meio da cabeça:\nos ramos vêm das orelhas,\nfora do quadro (5 cm de cada lado)", color=FG, fontsize=8)
else:
  fig.text(0.04, 0.80, "orelha esquerda\n(64 faixas, cor = frequência,\nbrilho = atividade agora)", color=FG, fontsize=8)
  fig.text(0.86, 0.80, "orelha direita", color=FG, fontsize=8)
leg = [("#e3b341", "o", "Uint em formação"), ("#39c5cf", "o", "Uint estável"), ("white", "o", "disparando agora (halo)"),
       ("#db61a2", "v", "unidade inibitória"), ("#58a6ff", "_", "ramos (espessura = força)")]
for k, (c, m, t) in enumerate(leg):
    fig.text(0.80, 0.42 - k * 0.035, ("●" if m == "o" else "▼" if m == "v" else "—") + "  " + t, color=c if c != "white" else FG, fontsize=9)

# faixa inferior: espectrograma real, ±4 s, com cursor
ax2 = fig.add_axes([0.06, 0.04, 0.88, 0.16], facecolor=BG)
i0, i1 = int((T - 4) * SR), int((T + 4) * SR); mono = x[i0:i1].mean(1)
f, tt, S = spectrogram(mono, SR, nperseg=1024, noverlap=768)
ax2.pcolormesh(tt + T - 4, f, 10 * np.log10(S + 1e-12), shading="auto", cmap="magma", vmin=-110, vmax=-30)
ax2.set_yscale("symlog", linthresh=200); ax2.set_ylim(50, 8000)
ax2.axvline(T, color="white", lw=1.2)
ax2.tick_params(colors=FG, labelsize=7); [s.set_color("#30363d") for s in ax2.spines.values()]
ax2.set_ylabel("Hz", color=FG, fontsize=8); ax2.set_xlabel("tempo na peça (s) — o cursor é o agora", color=FG, fontsize=8)
fig.savefig("quadro-exemplo-zoom.png" if ZOOM else "quadro-exemplo.png", facecolor=BG)
print("ok quadro-exemplo.png", T)
