"""V0.18 — cóclea (parte da Utrd, hardware): 64 faixas gamatone de 4ª ordem na escala ERB (50 Hz a 8 kHz),
retificação de meia onda e janela de fase (filtro de 2ª ordem, canto em 1,2 kHz).
Saída: o "sinal de comando" de cada faixa, em Pa equivalentes ao pico de um tom na frequência central da faixa
(assim, o limiar de um ponto transdutivo em dB SPL compara direto com o sinal)."""
import numpy as np
from scipy.signal import butter, sosfilt, oaconvolve

FS = 48000
N_FAIXAS = 64
F_MIN, F_MAX = 50.0, 8000.0
CANTO_FASE = 1200.0       # Hz (decisão de 18/11)
P_REF = 20e-6

E = lambda f: 21.4 * np.log10(4.37 * f / 1000 + 1)            # Glasberg & Moore 1990
Einv = lambda e: (10 ** (e / 21.4) - 1) * 1000 / 4.37

def centros():
    return Einv(np.linspace(E(F_MIN), E(F_MAX), N_FAIXAS))

_SOS_FASE = butter(2, CANTO_FASE, btype="low", fs=FS, output="sos")

ERB = lambda f: 24.7 * (4.37 * f / 1000 + 1)                   # Glasberg & Moore 1990

def _filtros():
    """Resposta ao impulso gamatone de 4ª ordem (Patterson): t³·e^(−2π·1,019·ERB·t)·cos(2πft), causal (FIR), até a
    envoltória cair a ~1e-5 do pico. (A versão IIR de alta ordem é numericamente instável nos graves a 48 kHz.)"""
    out = []
    for f in centros():
        bw = 1.019 * ERB(f); dur = 25.0 / (2 * np.pi * bw)
        t = np.arange(int(np.ceil(dur * FS))) / FS
        h = t ** 3 * np.exp(-2 * np.pi * bw * t) * np.cos(2 * np.pi * f * t)
        H = abs(np.sum(h * np.exp(-2j * np.pi * f * t)))
        out.append(h / H)                                       # ganho 1 na frequência central
    return out

def filtrar(i, x):
    return oaconvolve(x, filtros()[i])[:len(x)]

_FILTROS = None
_KAPPA = None

def _kappa():
    """Pico estacionário do sinal de comando para um tom de amplitude 1 na frequência central de cada faixa."""
    global _KAPPA
    if _KAPPA is None:
        t = np.arange(int(0.3 * FS)) / FS; k = []
        for i, f in enumerate(centros()):
            y = filtrar(i, np.sin(2 * np.pi * f * t))
            d = sosfilt(_SOS_FASE, np.maximum(y, 0.0))
            k.append(d[int(0.2 * FS):].max())
        _KAPPA = np.array(k)
    return _KAPPA

def filtros():
    global _FILTROS
    if _FILTROS is None: _FILTROS = _filtros()
    return _FILTROS

def comando(p):
    """p: pressão (Pa) num microfone. Devolve matriz (64, n): sinal de comando de cada faixa em Pa de pico equivalentes."""
    kap = _kappa(); out = np.empty((N_FAIXAS, len(p)))
    for i in range(N_FAIXAS):
        y = filtrar(i, p)
        out[i] = sosfilt(_SOS_FASE, np.maximum(y, 0.0)) / kap[i]
    return out

def limiar_pa(db_spl):
    """Limiar de um ponto transdutivo (dB SPL de um tom) em Pa de pico."""
    return P_REF * 10 ** (np.asarray(db_spl) / 20) * np.sqrt(2)
