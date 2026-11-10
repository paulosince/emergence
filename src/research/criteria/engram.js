// Engram-style criteria (docs/engram-criteria-v0.1.md), replacing D2, D4, D5
// of pre-registration v1 after calibration showed them defective.
//   D2-R  specific reactivation (observational criterion): in held-out test
//         episodes, the unit that responds is the one that responded, during
//         encoding, to the nearest content; tested against a permutation of
//         the content-responder pairing (removes trivial reactivation that
//         is the same for every content).
//   D4-S  specific loss of function: removing a unit impairs retrieval of
//         ITS content beyond removing a random unit, and leaves other
//         contents intact. Only applicable if D2-R passed (an engram must be
//         shown before its removal means anything; Han et al. 2009 design).
//   D5-D  persistence, dormancy and ecphory: regime A, then B, then A again;
//         A's units survive B and are reactivated by A' (D2-R logic).
import { makeRng } from '../../../vendor/tempo/core/rng.js';
import { holm } from './phase1.js';

function nearest(encH, encR, h) {
  let best = -1, d = Infinity;
  for (let i = 0; i < encH.length; i++) if (encR[i] != null && Math.abs(encH[i] - h) < d) { d = Math.abs(encH[i] - h); best = i; }
  return best;
}
// Fraction of test episodes whose responder equals the responder of the
// nearest-content encoding episode. Missing responders count as misses.
export function reactivationRate({ encH, encR, testH, testR }) {
  if (!testH.length) return 0;
  let hits = 0;
  for (let j = 0; j < testH.length; j++) {
    const i = nearest(encH, encR, testH[j]);
    if (i >= 0 && testR[j] != null && testR[j] === encR[i]) hits++;
  }
  return hits / testH.length;
}
export function reactivationTest(data, { permutations = 2000, seed = 0 } = {}) {
  const observed = reactivationRate(data), rng = makeRng(seed), h = data.testH.slice();
  let geq = 0, sum = 0;
  for (let k = 0; k < permutations; k++) {
    for (let i = h.length - 1; i > 0; i--) { const j = Math.floor(rng.random() * (i + 1)); [h[i], h[j]] = [h[j], h[i]]; }
    const x = reactivationRate({ ...data, testH: h });
    sum += x; if (x >= observed) geq++;
  }
  return { observed, nullMean: sum / permutations, p: (geq + 1) / (permutations + 1) };
}
export function d2rDecision(perSeed, { alpha = 0.01, seedsRequired = 8, minGain = 0.2 } = {}) {
  const rej = holm(perSeed.map(s => s.p), alpha);
  const ok = perSeed.map((s, i) => rej[i] && s.observed - s.nullMean >= minGain);
  return { passedSeeds: ok.filter(Boolean).length, pass: ok.filter(Boolean).length >= seedsRequired };
}
// Content of unit u in the test half: test episodes whose nearest-content
// encoding episode had responder u. Retrieval = fraction of them answered by u.
export function contentOf(u, { encH, encR, testH }) {
  const idx = [];
  for (let j = 0; j < testH.length; j++) { const i = nearest(encH, encR, testH[j]); if (i >= 0 && encR[i] === u) idx.push(j); }
  return idx;
}
export const retrieval = (u, idx, testR) => idx.length ? idx.filter(j => testR[j] === u).length / idx.length : 0;
// perSeed: [{ units: [{ effect, nullMax, specificity }] }]
export function d4sDecision(perSeed, { d2rPass, unitShare = 0.7, specificityMin = 0.9, seedsRequired = 8 } = {}) {
  if (typeof d2rPass !== 'boolean') throw new TypeError('D4-S requires the D2-R decision (d2rPass)');
  const ok = perSeed.map(s => {
    if (!s.units.length) return false;
    const passed = s.units.filter(u => u.effect > u.nullMax).length;
    const spec = s.units.reduce((a, u) => a + u.specificity, 0) / s.units.length;
    return passed >= Math.ceil(unitShare * s.units.length) && spec >= specificityMin;
  });
  const n = ok.filter(Boolean).length;
  return { passedSeedsUnconditional: n, applicable: d2rPass, pass: d2rPass && n >= seedsRequired };
}
// perSeed: [{ persist, rate, ecphory: {observed, nullMean, p} }]
export function d5dDecision(perSeed, { persistMin = 0.8, rateMin = 0.1, alpha = 0.01, minGain = 0.2, seedsRequired = 8 } = {}) {
  const rej = holm(perSeed.map(s => s.ecphory.p), alpha);
  const ok = perSeed.map((s, i) => s.persist >= persistMin && s.rate >= rateMin && rej[i] && s.ecphory.observed - s.ecphory.nullMean >= minGain);
  return { passedSeeds: ok.filter(Boolean).length, pass: ok.filter(Boolean).length >= seedsRequired };
}
