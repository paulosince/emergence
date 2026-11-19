"""V0.18 — pontos transdutivos de cada Cpro (dados da Utrd; hardware).
Mesmas contas de ../tabela_faixas.py (zero ISO 389-7 interpolado; capacidade de Wu et al. 2019; limiares pela convolução).
Áreas de intensidade transdutiva: por posição no Cpro (61% mais sensíveis = área 1; 23% seguintes = área 2; 16% = área 3),
simplificação declarada (a convolução mistura os grupos). Janela de refratariedade sorteada uma vez por ponto: 0,39 ms ± 50%."""
import numpy as np
from coclea import centros, E, Einv, N_FAIXAS, F_MIN, F_MAX

FISO = np.array([20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 750, 800, 1000, 1250, 1500, 1600, 2000,
                 2500, 3000, 3150, 4000, 5000, 6000, 6300, 8000, 9000, 10000, 11200, 12500, 14000, 16000.0])
TISO = np.array([78.5, 68.7, 59.5, 51.1, 44.0, 37.5, 31.5, 26.5, 22.1, 17.9, 14.4, 11.4, 8.6, 6.2, 4.4, 3.0, 2.4, 2.2, 2.4, 3.5, 2.4, 1.7, -1.3,
                 -4.2, -5.8, -6.0, -5.4, -1.5, 4.3, 6.0, 12.6, 13.9, 13.9, 13.0, 12.3, 18.4, 40.2])
FW = np.array([0.17, 0.24, 0.35, 0.49, 0.70, 0.98, 1.4, 2.0, 2.8, 3.9, 5.6, 8.0, 11.0, 16.0]) * 1000
VW = np.array([3.7, 6.8, 7.6, 8.7, 10.2, 10.2, 10.4, 10.1, 9.0, 8.2, 7.1, 5.7, 4.2, 1.2])
REFR_MEIO, REFR_VAR = 0.39e-3, 0.5
# Sensibilidade por área (responsável, 19/11): limiares sobem 20 dB na área sensível, 10 dB na intermediária e nada na de
# som forte. O robô deixa de ouvir os sons mais fracos e mantém a resolução nos fortes. As áreas são atribuídas antes do
# deslocamento (pela posição na convolução); depois os pontos são reordenados pelo novo limiar.
DESLOC_AREA_DB = {1: 20.0, 2: 10.0, 3: 0.0}
SEMENTE = 18

def _curva_vagas():
    dd = 0.01; x = np.arange(-20, 160, dd)
    def gauss(m, s): g = np.exp(-0.5 * ((x - m) / s) ** 2) * (x >= 0); return g / (g.sum() * dd)
    def logn(s0, med, sg):
        y = np.where(x > s0, x - s0, 1e-9); g = np.exp(-0.5 * ((np.log(y) - np.log(med - s0)) / sg) ** 2) / y * (x > s0); return g / (g.sum() * dd)
    def kern(D):
        s = D / (2 * np.log(9)); r = 1 / (1 + np.exp(-(x - D / 2) / s)); k = np.gradient(r, dd); k[x < 0] = 0; return k / (k.sum() * dd)
    def conv(a, b): i0 = np.argmin(abs(x)); return (np.convolve(a, b) * dd)[i0:i0 + x.size]
    f = 0.61 * conv(gauss(3, 3), kern(30)) + 0.23 * conv(gauss(8, 4), kern(30)) + 0.16 * conv(logn(12, 35, 0.5), kern(50))
    C = np.cumsum(f) * dd; C /= C[-1]
    return x, C

def construir():
    """Lista de 64 dicionários: zero (dB SPL), limiares (dB SPL, crescentes), área (1-3), refratariedade (s)."""
    fc = centros(); ec = E(fc); step = ec[1] - ec[0]
    fe = Einv(np.concatenate(([ec[0] - step / 2], (ec[:-1] + ec[1:]) / 2, [ec[-1] + step / 2])))
    zero = np.interp(np.log2(fc), np.log2(FISO), TISO)
    porcel = np.interp(np.log2(fc), np.log2(FW), VW)
    ihc_mm = 101.22 - 9.0935 * np.log10(fc / 1000)
    X = lambda f: np.log10(f / 165.4 + 0.88) / 2.1
    cap = np.floor(ihc_mm * np.diff(X(fe)) * 35.0 * porcel).astype(int)
    x, C = _curva_vagas(); rng = np.random.default_rng(SEMENTE); out = []
    for i in range(N_FAIXAS):
        n = cap[i]; lim = np.interp((np.arange(n) + 0.5) / n, C, x) + zero[i]
        area = np.where(np.arange(n) < 0.61 * n, 1, np.where(np.arange(n) < 0.84 * n, 2, 3)).astype(np.int8)
        refr = REFR_MEIO * (1 + REFR_VAR * (2 * rng.random(n) - 1))
        lim = lim + np.array([DESLOC_AREA_DB[int(a)] for a in area])
        o = np.argsort(lim, kind="stable"); lim, area, refr = lim[o], area[o], refr[o]
        out.append(dict(fc=fc[i], zero=zero[i], limiar_db=lim, area=area, refr=refr))
    return out

if __name__ == "__main__":
    P = construir(); print("capacidade total:", sum(len(p["limiar_db"]) for p in P), "| faixa 1:", len(P[0]["limiar_db"]), "| faixa 64:", len(P[-1]["limiar_db"]))
