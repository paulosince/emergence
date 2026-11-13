// Calibração única dos limiares das vias (D16), feita antes de qualquer execução e registrada.
// Regra: θ0 = 0,2 × pico da resposta retificada de um ressonador a um tom nominal na sua frequência
// central; θ1 = θ0·10^(1/2) e θ2 = θ0·10 (degraus de 10 dB, D4). Assim o nível nominal ultrapassa
// θ0 e θ1 (0,63 do pico), não alcança θ2 (2,0 do pico), e A+ (+12 dB, ×3,98) alcança θ2.
import { writeFileSync } from 'node:fs';
import { FS, NOMINAL_AMP, BG_NOISE_RMS } from './world.js';
import { bandpassCoeffs, bandCenter, N_BANDS } from './utrd.js';
import { stream, gaussian } from './rng.js';

function peakResponse(f0, fTone, amp, seconds = 0.3) {
  const c = bandpassCoeffs(f0);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0, peak = 0;
  const n = Math.round(seconds * FS);
  for (let i = 0; i < n; i++) {
    const x = amp * Math.sin((2 * Math.PI * fTone * i) / FS);
    const y = c.b0 * x + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    if (i > n / 2 && y > peak) peak = y;
  }
  return peak;
}
function noisePeak(f0, seconds = 5) {
  const c = bandpassCoeffs(f0), r = stream('calibration', 'noise');
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0, peak = 0;
  for (let i = 0; i < seconds * FS; i++) {
    const x = BG_NOISE_RMS * gaussian(r);
    const y = c.b0 * x + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    if (y > peak) peak = y;
  }
  return peak;
}

const peaks = Array.from({ length: N_BANDS }, (_, k) => peakResponse(bandCenter(k), bandCenter(k), NOMINAL_AMP));
const ref = peaks.reduce((a, b) => a + b, 0) / peaks.length;
const th0 = 0.2 * ref;
const thresholds = [th0, th0 * Math.sqrt(10), th0 * 10];
const noise = Array.from({ length: N_BANDS }, (_, k) => noisePeak(bandCenter(k)));
const out = {
  date: new Date().toISOString(),
  rule: 'θ0 = 0,2 × média dos picos de resposta a tom nominal na frequência central; degraus de 10 dB',
  nominalAmp: NOMINAL_AMP,
  peaksAtCF: peaks.map((p) => +p.toFixed(6)),
  reference: +ref.toFixed(6),
  thresholds: thresholds.map((x) => +x.toFixed(6)),
  backgroundNoiseRms: BG_NOISE_RMS,
  backgroundNoisePeakPerBand5s: noise.map((p) => +p.toFixed(6)),
  checks: {
    nominalCrossesTheta0: ref > thresholds[0],
    nominalCrossesTheta1: ref > thresholds[1],
    nominalBelowTheta2: ref < thresholds[2],
    plus12dbCrossesTheta2: ref * 10 ** (12 / 20) > thresholds[2],
    noiseBelowTheta0: Math.max(...noise) < thresholds[0],
  },
};
writeFileSync(new URL('../calibration.json', import.meta.url), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
