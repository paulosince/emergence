"""V0.19 — nível de cada canal da gravação (Alciatore), para as ondas dos alto-falantes na interface.
Como na cena da V0.18: canal esquerdo no alto-falante próximo (à esquerda do robô), direito no distante (à direita).
Saída: visual/v18-satie/canais.bin (uint8; 2 × 2000 quadros de 5 ms, de 9 a 19 s; dB SPL na fonte relativo, 0–90 → 0–255)
Calibração (escolha do assistente, só para exibir): o trecho mais forte da peça inteira (RMS em 125 ms, canal mais forte) = 85 dB."""
import subprocess, numpy as np, pathlib
AQUI = pathlib.Path(__file__).resolve().parent
ARQ = AQUI.parent / "estimulos" / "satie-gymnopedie1-alciatore.ogg"
FS = 48000
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(ARQ), "-f", "f32le", "-ac", "2", "-ar", str(FS), "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
w = int(0.125 * FS); k = np.ones(w) / w
pico = max(np.sqrt(np.convolve(x[:, c] ** 2, k, "valid")).max() for c in (0, 1))
G = 85.0 - 20 * np.log10(pico)
ini, dur, fr = 9.0, 10.0, 0.005
out = np.zeros((2, int(round(dur / fr))), np.uint8)
for c in (0, 1):
    for q in range(out.shape[1]):
        a = int((ini + q * fr) * FS); seg = x[a:a + int(fr * FS), c]
        db = 20 * np.log10(np.sqrt(np.mean(seg ** 2)) + 1e-12) + G
        out[c, q] = int(round(np.clip(db, 0, 90) / 90 * 255))
dest = AQUI.parent / "visual" / "v18-satie" / "canais.bin"
out.tofile(dest)
print("canais:", out.shape, "dB médio E/D:", (out.mean(1) / 255 * 90).round(1), "→", dest)
