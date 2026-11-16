"""Caracterização da gravação (observador, fora do sistema). Uso:
python3 -I caracterizar_gravacao.py arquivo.ogg
Requer ffmpeg e numpy. Não altera o arquivo."""
import subprocess, sys, numpy as np
path = sys.argv[1]; sr = 44100
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-acodec", "pcm_f32le",
                      "-ar", str(sr), "-ac", "2", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(np.float64)
L, R = x[:, 0], x[:, 1]; M = (L + R) / 2; S = (L - R) / 2
db = lambda v: 20 * np.log10(v + 1e-12)
print(f"duração {len(L)/sr:.2f} s; pico {np.abs(x).max():.3f}")
print(f"correlação E×D {np.corrcoef(L, R)[0, 1]:.3f}; lateral/central {db(np.sqrt((S**2).mean())) - db(np.sqrt((M**2).mean())):.1f} dB")
N = len(M); P = np.abs(np.fft.rfft(M * np.hanning(N)))**2; f = np.fft.rfftfreq(N, 1/sr)
for a, b in [(0, 50), (50, 150), (150, 2400), (2400, 4000), (4000, 8000), (8000, 22050)]:
    m = (f >= a) & (f < b); print(f"energia {a}-{b} Hz: {100*P[m].sum()/P.sum():.2f}%")
w = sr // 2; n = len(M) // w; e = db(np.sqrt((M[:n*w].reshape(n, w)**2).mean(1))); e -= e.max()
print(f"janelas de 0,5 s: mediana {np.median(e):.1f} dB; p5 {np.percentile(e, 5):.1f} dB; abaixo de -30 dB: {100*np.mean(e < -30):.1f}%")
w2 = sr // 10; t = M[-15*sr:]; k = len(t) // w2; g = db(np.sqrt((t[:k*w2].reshape(k, w2)**2).mean(1))) - db(np.sqrt((M[:n*w].reshape(n, w)**2).mean(1))).max()
print("últimos 15 s, nível a cada 1 s (dB do máximo):", [round(v, 1) for v in g[::10]])
