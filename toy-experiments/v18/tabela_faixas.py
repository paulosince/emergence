"""V0.18 — tabela das 64 faixas da cóclea (proposta para revisão do responsável; nada aqui é especificação aprovada).
Para cada faixa: frequência central (escala ERB, 50 Hz a 8 kHz), zero (limiar humano interpolado/extrapolado),
capacidade (Upros por fibra, perfil humano) e as vagas de limiar (convolução, decisão B).
Gera tabela-faixas.csv e tabela-faixas.png. Uso: python3 tabela_faixas.py"""
import csv, math
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# --- cóclea: 64 faixas ERB (Glasberg & Moore 1990: E = 21,4·log10(4,37·f/1000 + 1); fórmula de memória, padrão da área)
E = lambda f: 21.4 * np.log10(4.37 * f / 1000 + 1)
Einv = lambda e: (10 ** (e / 21.4) - 1) * 1000 / 4.37
ec = np.linspace(E(50), E(8000), 64); fc = Einv(ec)
step = ec[1] - ec[0]; fe = Einv(np.concatenate(([ec[0] - step / 2], (ec[:-1] + ec[1:]) / 2, [ec[-1] + step / 2])))

# --- zero de cada faixa: limiar humano (ISO 2003, tabela reproduzida em GreenFacts): interpolação em log da frequência;
#     abaixo de 250 Hz, extrapolação linear com a inclinação de 250-500 Hz (perda declarada; provavelmente subestima)
fiso = np.array([250, 500, 1000, 2000, 4000, 8000.0]); tiso = np.array([12, 5, 2, -2, -5, 13.0])
lf = np.log2(fc)
zero = np.interp(lf, np.log2(fiso), tiso)
inc = (tiso[1] - tiso[0]) / (np.log2(500) - np.log2(250)); baixo = fc < 250
zero[baixo] = tiso[0] + inc * (lf[baixo] - np.log2(250))

# --- capacidade: posição na cóclea (Greenwood 1990, humano: f = 165,4·(10^(2,1x) − 0,88); constantes de memória, padrão da área)
X = lambda f: np.log10(f / 165.4 + 0.88) / 2.1
dx = np.diff(X(fe)); xc = X(fc)
ihc = 3500 * dx                                     # ~3.000-3.500 células ciliadas internas, densidade suposta uniforme
porcel = 6.5 + (14 - 6.5) * np.sin(np.pi * xc)      # 6,5 nas pontas, 14 no meio (Nadol 1988; Viana et al. 2015); forma suposta
cap = np.round(ihc * porcel).astype(int)

# --- vagas de limiar dentro da faixa (decisão B: limiares ⊛ crescimento de cada fibra); formas realistas + S, 30/30/50 dB
dd = 0.01; x = np.arange(-20, 160, dd)
def gauss(m, s): g = np.exp(-0.5 * ((x - m) / s) ** 2) * (x >= 0); return g / (g.sum() * dd)
def logn(s0, med, sg):
    y = np.where(x > s0, x - s0, 1e-9); g = np.exp(-0.5 * ((np.log(y) - np.log(med - s0)) / sg) ** 2) / y * (x > s0); return g / (g.sum() * dd)
def kern(D):
    s = D / (2 * np.log(9)); r = 1 / (1 + np.exp(-(x - D / 2) / s)); k = np.gradient(r, dd); k[x < 0] = 0; return k / (k.sum() * dd)
def conv(a, b): i0 = np.argmin(abs(x)); return (np.convolve(a, b) * dd)[i0:i0 + x.size]
f = 0.61 * conv(gauss(3, 3), kern(30)) + 0.23 * conv(gauss(8, 4), kern(30)) + 0.16 * conv(logn(12, 35, 0.5), kern(50))
C = np.cumsum(f) * dd; C /= C[-1]
def vagas(n): return np.interp((np.arange(n) + 0.5) / n, C, x)   # dB acima do zero da faixa

# --- tabela
with open("tabela-faixas.csv", "w", newline="") as fh:
    w = csv.writer(fh); w.writerow(["faixa", "freq_central_Hz", "zero_dB_SPL", "zero_origem", "celulas_ciliadas", "fibras_por_celula", "capacidade_Upros", "vaga_mais_baixa_dB_SPL", "vaga_mais_alta_dB_SPL"])
    for i in range(64):
        v = vagas(cap[i]) + zero[i]
        w.writerow([i + 1, round(fc[i], 1), round(zero[i], 1), "extrapolado" if baixo[i] else "interpolado", round(ihc[i], 1), round(porcel[i], 1), cap[i], round(v.min(), 1), round(v.max(), 1)])
print("capacidade: mín", cap.min(), "máx", cap.max(), "total por ouvido", cap.sum(), "| zero: mín", round(zero.min(), 1), "máx", round(zero.max(), 1))

# --- figura (paleta de referência: azul série 1, laranja série 2, aqua série 3; texto em tinta neutra)
B1, O2, A3, TXT, TX2, GRID, SURF = "#2a78d6", "#eb6834", "#1baf7a", "#0b0b0b", "#52514e", "#e6e5e1", "#fcfcfb"
plt.rcParams.update({"font.family": "DejaVu Sans", "font.size": 10, "axes.edgecolor": TX2, "axes.labelcolor": TXT,
                     "xtick.color": TX2, "ytick.color": TX2, "axes.spines.top": False, "axes.spines.right": False})
fig, ax = plt.subplots(2, 2, figsize=(12, 8.6), facecolor=SURF)
for a in ax.flat: a.set_facecolor(SURF); a.grid(True, color=GRID, lw=0.8); a.set_axisbelow(True)
tk = [50, 100, 250, 500, 1000, 2000, 4000, 8000]; tl = ["50", "100", "250", "500", "1k", "2k", "4k", "8k"]

a = ax[0, 0]
a.plot(fc[~baixo], zero[~baixo], color=B1, lw=2, label="interpolado (entre pontos humanos)")
a.plot(fc[baixo | (np.roll(baixo, 1))], zero[baixo | (np.roll(baixo, 1))], color=B1, lw=2, ls="--", label="extrapolado (abaixo de 250 Hz)")
a.scatter(fiso, tiso, s=60, color=O2, zorder=3, edgecolor=SURF, lw=2, label="limiar humano (ISO 2003)")
a.set_xscale("log"); a.set_xticks(tk); a.set_xticklabels(tl); a.set_xlabel("frequência (Hz)"); a.set_ylabel("dB SPL")
a.set_title("1. O zero de cada faixa (limiar de audição)", loc="left", color=TXT, fontsize=11.5)
a.legend(frameon=False, fontsize=9, labelcolor=TX2)

a = ax[0, 1]
a.bar(np.arange(1, 65), cap, color=B1, width=0.8, edgecolor=SURF, lw=0.5)
a.set_xlabel("faixa (1 = 50 Hz … 64 = 8 kHz)"); a.set_ylabel("Upros (capacidade)")
a.set_title(f"2. Capacidade por fibra: {cap.min()} a {cap.max()} Upros", loc="left", color=TXT, fontsize=11.5)
im = int(np.argmax(cap)); a.annotate(f"pico ≈ {fc[im]:.0f} Hz", (im + 1, cap[im]), xytext=(im - 22, cap[im] + 15), color=TX2, fontsize=9,
                                    arrowprops=dict(arrowstyle="-", color=TX2, lw=0.8))
a.set_ylim(0, cap.max() * 1.15)

a = ax[1, 0]
lv = np.arange(-10, 151, 1.0); H = np.zeros((lv.size - 1, 64))
for i in range(64): H[:, i] = np.histogram(vagas(cap[i]) + zero[i], bins=lv)[0]
from matplotlib.colors import LinearSegmentedColormap
cm = LinearSegmentedColormap.from_list("azul", [SURF, "#cde2fb", "#86b6ef", "#3987e5", "#1c5cab", "#0d366b"])
pc = a.pcolormesh(fe, lv, H, cmap=cm, shading="flat")
a.set_xscale("log"); a.set_xticks(tk); a.set_xticklabels(tl); a.set_ylim(-10, 150)
a.set_xlabel("frequência (Hz)"); a.set_ylabel("limiar da vaga (dB SPL)")
a.set_title("3. Frequência × decibéis: vagas de limiar por faixa", loc="left", color=TXT, fontsize=11.5)
cb = fig.colorbar(pc, ax=a, pad=0.01); cb.set_label("vagas por dB", color=TX2); cb.outline.set_visible(False)

a = ax[1, 1]
for cor, alvo in ((B1, 100), (O2, 1000), (A3, 4000)):
    i = int(np.argmin(abs(fc - alvo))); v = np.sort(vagas(cap[i]) + zero[i]); L = np.arange(-10, 141, 0.5)
    n = np.searchsorted(v, L, side="right"); a.plot(L, n, color=cor, lw=2, label=f"faixa de {fc[i]:.0f} Hz")
    a.text(L[-1] + 2, n[-1], f"{fc[i]:.0f} Hz", color=TXT, fontsize=9, va="center")
a.legend(frameon=False, fontsize=9, labelcolor=TX2, loc="lower right"); a.set_xlim(-10, 160); a.set_xlabel("nível do som na faixa (dB SPL)"); a.set_ylabel("Upros ativas (se todas criadas)")
a.set_title("4. Recrutamento: quantas Upros um som aciona", loc="left", color=TXT, fontsize=11.5)

fig.suptitle("V0.18 — Cóclea: 64 faixas (proposta para revisão)", x=0.01, ha="left", fontsize=14, color=TXT, fontweight="bold")
fig.text(0.01, 0.005, "Fontes: limiar humano ISO 2003 (pontos de 250 Hz a 8 kHz); fibras por célula ciliada: Nadol 1988, Viana et al. 2015; limiares por grupo: Liberman 1978 (gato, adaptação); "
         "crescimento por fibra 30/30/50 dB (gato, adaptação). Formas simplificadas e declaradas na investigação.", fontsize=7.5, color=TX2, wrap=True)
fig.tight_layout(rect=(0, 0.03, 1, 0.96)); fig.savefig("tabela-faixas.png", dpi=150, facecolor=SURF)
