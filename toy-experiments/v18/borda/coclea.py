"""V0.18 — cóclea (parte da Utrd, hardware): 64 faixas gamatone de 4ª ordem na escala ERB (50 Hz a 8 kHz),
[19/11, proposta a aprovar] atenuação para som forte (como o reflexo do ouvido médio) e compressão (como a da cóclea humana),
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

# ---- Compressão (19/11; responsável: "um pouco de cada"; números: proposta do assistente a aprovar) ----
# Linear até o joelho, depois 0,25 dB/dB, de forma instantânea na saída de cada faixa (como o "broken-stick" dos modelos
# de dupla via). Inclinação 0,2–0,3 dB/dB em todas as frequências centrais de 500 a 8000 Hz (Lopez-Poveda, Plack e Meddis
# 2003, texto integral via extração automática); joelho a 30 dB acima do zero da faixa (Plack e O'Hanlon 2003 observaram
# compressão a 30 dB acima do limiar; o joelho exato não é medido ali: escolha do assistente).
COMPR_INCL = 0.25
COMPR_JOELHO_DB = 30.0

def zeros():
    from pontos import FISO, TISO
    return np.interp(np.log2(centros()), np.log2(FISO), TISO)

def comprimir(y, i):
    kp = P_REF * 10 ** ((zeros()[i] + COMPR_JOELHO_DB) / 20) * np.sqrt(2)
    a = np.abs(y); m = a > kp
    out = y.copy(); out[m] = np.sign(y[m]) * kp * (a[m] / kp) ** COMPR_INCL
    return out

# ---- Atenuação para som forte (como o reflexo do ouvido médio; proposta do assistente a aprovar) ----
# Limiar 80 dB SPL (faixa humana 70–100 dB SPL; sons largos baixam o limiar). Em 500 Hz e abaixo: começa no limiar, cresce
# 0,7 dB por dB e chega a 20 dB; em 2 kHz: começa 10 dB acima do limiar, chega a ~10 dB (Bell's palsy, resumo, Acta
# Otolaryngol 1978); em 1,45 kHz, 0–6 dB a 16 dB acima do limiar (Acta Otolaryngol 1968, resumo). Acima de 4 kHz: zero
# (o reflexo "protege sobretudo os graves"; número do assistente). Bilateral: comandado pelo ouvido mais forte.
REFL_LIMIAR = 70.0   # responsável, 19/11: ponta baixa da faixa humana (70–100 dB SPL)
_RF = np.log2([500.0, 2000.0, 4000.0])
def atenuacao_reflexo(nivel_db):
    """nivel_db: (n,) nível que comanda o reflexo. Devolve (64, n) atenuação em dB."""
    lf = np.log2(centros())
    amax = np.interp(lf, _RF, [20.0, 10.0, 0.0]); atraso = np.interp(lf, _RF, [0.0, 10.0, 10.0]); incl = np.interp(lf, _RF, [0.7, 0.5, 0.5])
    ex = np.maximum(nivel_db[None, :] - REFL_LIMIAR - atraso[:, None], 0.0)
    return np.minimum(incl[:, None] * ex, amax[:, None])

def comando(p, reflexo_db=None, compressao=False):   # compressão retirada pelo responsável em 19/11 (os limiares já a incluem)
    """p: pressão (Pa) num microfone. reflexo_db: (64, n) atenuação do reflexo, ou None.
    Devolve matriz (64, n): sinal de comando de cada faixa em Pa de pico equivalentes."""
    kap = _kappa(); out = np.empty((N_FAIXAS, len(p)))
    for i in range(N_FAIXAS):
        y = filtrar(i, p)
        if reflexo_db is not None: y = y * 10 ** (-reflexo_db[i] / 20)
        if compressao: y = comprimir(y, i)
        out[i] = sosfilt(_SOS_FASE, np.maximum(y, 0.0)) / kap[i]
    return out

def limiar_pa(db_spl):
    """Limiar de um ponto transdutivo (dB SPL de um tom) em Pa de pico."""
    return P_REF * 10 ** (np.asarray(db_spl) / 20) * np.sqrt(2)

class CocleaContinua:
    """A mesma cóclea, processando um sinal longo em pedaços com continuidade exata (histórico dos filtros e estado da
    janela de fase guardados entre pedaços)."""
    def __init__(self):
        self.H = max(len(h) for h in filtros()); self.hist = np.zeros(self.H)
        self.zi = [np.zeros((_SOS_FASE.shape[0], 2)) for _ in range(N_FAIXAS)]
    def processar(self, x, reflexo_db=None):
        kap = _kappa(); xx = np.concatenate([self.hist, x]); out = np.empty((N_FAIXAS, len(x)))
        for i in range(N_FAIXAS):
            y = oaconvolve(xx, filtros()[i])[self.H:self.H + len(x)]
            if reflexo_db is not None: y = y * 10 ** (-reflexo_db[i] / 20)
            z, self.zi[i] = sosfilt(_SOS_FASE, np.maximum(y, 0.0), zi=self.zi[i])
            out[i] = z / kap[i]
        self.hist = xx[-self.H:]
        return out
