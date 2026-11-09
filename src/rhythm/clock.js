// Clock units of Goodwin type (docs/pacemakers-v0.1.md, section 6; approved
// 09/11/2026). Model of Gonze, Bernard, Waltermann, Kramer and Herzel (2005):
// X clock mRNA, Y clock protein, Z nuclear repressor, V neuropeptide; Hill
// repression (n = 4) with Michaelis-Menten degradation; coupling by the mean
// field F of V; light L added to X transcription. Equations reconstructed from
// the text and parameter table (images not readable); the reconstruction
// reproduces the published periods (isolated ~23.5 h; coupled population
// ~26.5 h) -> tests/clock.test.js.
// The clock is NOT a regulated variable: no set point, no error correction.
import { makeRng } from '../../vendor/tempo/core/rng.js';

export const GONZE_2005 = Object.freeze({ v1: 0.7, K1: 1, n: 4, v2: 0.35, K2: 1, k3: 0.7, v4: 0.35, K4: 1,
  k5: 0.7, v6: 0.35, K6: 1, k7: 0.35, v8: 1, K8: 1, vc: 0.4, Kc: 1, K: 0.5 });
const RATES = ['v1', 'v2', 'k3', 'v4', 'k5', 'v6', 'k7', 'v8'];

function deriv(s, F, L, p, linearDegradation) {
  const [X, Y, Z, V] = s;
  const deg = (v, x, K) => linearDegradation ? (v / K) * x : (v * x) / (K + x);
  return [
    p.v1 * p.K1 ** p.n / (p.K1 ** p.n + Z ** p.n) - deg(p.v2, X, p.K2) + (p.vc * p.K * F) / (p.Kc + p.K * F) + L,
    p.k3 * X - deg(p.v4, Y, p.K4),
    p.k5 * Y - deg(p.v6, Z, p.K6),
    p.k7 * X - deg(p.v8, V, p.K8),
  ];
}

// Ensemble of clock units. timeScale > 1 compresses the day (all rates
// multiplied), for fast tests; shape of the cycle is unchanged.
export function createClockEnsemble({ cells = 20, seed = 1, periodSd = 0.05, coupled = true,
  linearDegradation = false, timeScale = 1, stepHours = 0.02, params = GONZE_2005 } = {}) {
  const rng = makeRng(seed);
  const units = Array.from({ length: cells }, () => {
    const tau = 1 + periodSd * rng.normal(), p = { ...params };
    for (const k of RATES) p[k] = (p[k] / tau) * timeScale;
    return { p, tau, s: [rng.random(), rng.random(), 2 * rng.random(), 0.1 * rng.random()] };
  });
  let tH = 0, light = 0;
  const meanV = () => units.reduce((a, u) => a + u.s[3], 0) / units.length;
  function step(h) {
    const F = coupled ? meanV() : 0;
    for (const u of units) {
      const f = x => deriv(x, F, light * timeScale, u.p, linearDegradation);
      const a = f(u.s), b = f(u.s.map((x, i) => x + (h / 2) * a[i])), c = f(u.s.map((x, i) => x + (h / 2) * b[i])),
        d = f(u.s.map((x, i) => x + h * c[i]));
      u.s = u.s.map((x, i) => Math.max(0, x + (h / 6) * (a[i] + 2 * b[i] + 2 * c[i] + d[i])));
    }
    tH += h;
  }
  return {
    get timeHours() { return tH; },
    setLight(L) { if (!(L >= 0)) throw new RangeError('light must be >= 0'); light = L; },
    advanceTo(targetH) {
      if (targetH < tH) throw new RangeError('Clock time reversal');
      while (targetH - tH > 1e-12) step(Math.min(stepHours, targetH - tH));
    },
    meanX() { return units.reduce((a, u) => a + u.s[0], 0) / units.length; },
    unitX() { return units.map(u => u.s[0]); },
    intrinsicFactors() { return units.map(u => u.tau); },
    snapshot() { return { timeHours: tH, light, units: units.map(u => ({ tau: u.tau, state: [...u.s] })) }; },
  };
}

// Peak times of a sampled signal (local maxima), for period measurement.
export function peakTimes(times, values, { after = 0 } = {}) {
  const out = [];
  for (let i = 1; i < values.length - 1; i++) if (times[i] > after && values[i] > values[i - 1] && values[i] >= values[i + 1]) out.push(times[i]);
  return out;
}
export const meanPeriod = peaks => peaks.length < 2 ? null : (peaks[peaks.length - 1] - peaks[0]) / (peaks.length - 1);
