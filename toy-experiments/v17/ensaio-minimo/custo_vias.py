"""Ensaio mínimo, parte 3 — quantas incidências as 384 vias produzem (estimativa de custo).
Uso: python3 -I custo_vias.py ../estimulo/Toccata_et_Fugue_BWV565.ogg
Usa os sinais nos microfones da parte 1 (sem reflexões). 64 faixas ERB de 50 Hz a 8 kHz (gamatone),
3 limiares por faixa a 10 dB um do outro. Abaixo de 2,4 kHz emite no ciclo (cruzamento ascendente
do sinal retificado); acima, pelo envelope (retificação + passa-baixas de 300 Hz). Refratariedade 1 ms.
CALIBRAÇÃO PROVISÓRIA [A], só para estimar custo: o 1º limiar de cada faixa é o percentil 90 da
saída retificada daquela faixa no trecho. Não é a calibração da V0.17 (ainda não decidida)."""
import sys, numpy as np
sys.path.insert(0, ".")
from scipy.signal import gammatone, lfilter, butter, sosfilt
import importlib.util
spec = importlib.util.spec_from_file_location("m", "sinais_microfones.py")
src = open("sinais_microfones.py", encoding="utf-8").read().split("print(f\"azimutes")[0]
ns = {}; exec(compile(src, "sinais_microfones.py", "exec"), ns)
o = ns["ouvidos"]([(ns["L"], ns["NEAR"]), (ns["R"], ns["FAR"])]); FS = ns["FS"]
erb = lambda f: 21.4 * np.log10(1 + 0.00437 * f); inv = lambda e: (10 ** (e / 21.4) - 1) / 0.00437
cfs = inv(np.linspace(erb(50), erb(8000), 64))
lp = butter(2, 300, fs=FS, output="sos"); total = 0; por_faixa = []
for ear in ("esq", "dir"):
    x = o[ear]; dur = len(x) / FS
    for cf in cfs:
        b, a = gammatone(cf, "iir", fs=FS); y = np.maximum(lfilter(b, a, x), 0)
        if cf > 2400: y = sosfilt(lp, y)
        th0 = np.percentile(y, 90); n_faixa = 0
        for th in (th0, th0 * 10 ** 0.5, th0 * 10):
            up = np.nonzero((y[1:] >= th) & (y[:-1] < th))[0]
            last, n = -1e9, 0
            for i in up:
                if i - last >= FS * 0.001: n += 1; last = i
            n_faixa += n
        por_faixa.append(n_faixa / dur); total += n_faixa
print(f"duração {dur:.1f} s; incidências por segundo (384 vias): {total/dur:,.0f}")
pf = np.array(por_faixa); print(f"por via de faixa (soma dos 3 limiares): mediana {np.median(pf):.0f}/s, máx {pf.max():.0f}/s")
taxa = total / dur
print(f"comparações da Pcrt por segundo, se cada incidência for comparada com as das outras vias nos 20 ms anteriores: ~{taxa*taxa*0.02:,.0f}")
