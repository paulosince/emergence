// Pre-registered Phase 1 criteria (docs/preregistration-v1.md), computed from
// per-seed statistics. Thresholds are PARAMETERS so that a sensitivity grid
// can be reported without changing the confirmatory decision.
import { permutationTest, spearman } from '../bench/stats.js';

// Holm–Bonferroni: returns, for each p, whether it is rejected at family alpha.
export function holm(ps, alpha) {
  const order = ps.map((p, i) => [p, i]).sort((a, b) => a[0] - b[0]);
  const reject = new Array(ps.length).fill(false);
  for (let k = 0; k < order.length; k++) {
    if (order[k][0] < alpha / (order.length - k)) reject[order[k][1]] = true; else break;
  }
  return reject;
}

// D3a/b: per seed, Spearman between unit delay and height with permutation p.
export function d3Seeds(perSeed, { permutations = 2000 } = {}) {
  return perSeed.map(({ seed, heights, delays }) => {
    const t = permutationTest(heights, delays, { seed, permutations });
    return { seed, n: heights.length, rho: t.observed, p: t.p };
  });
}
export function d3aDecision(stats, { rhoMin = 0.6, alpha = 0.01, seedsRequired = 8 } = {}) {
  const rej = holm(stats.map(s => s.p), alpha);
  const ok = stats.map((s, i) => Math.abs(s.rho) >= rhoMin && rej[i]);
  return { passedSeeds: ok.filter(Boolean).length, pass: ok.filter(Boolean).length >= seedsRequired };
}
export function d3bDecision(stats, { rhoMax = 0.2, seedsRequired = 8 } = {}) {
  const ok = stats.map(s => Math.abs(s.rho) < rhoMax);
  return { passedSeeds: ok.filter(Boolean).length, pass: ok.filter(Boolean).length >= seedsRequired };
}
// D3c is only meaningful when D3a passed: there must be an effect to retain.
export function d3cDecision(original, equalized, { retainMin = 0.8, primaryPass } = {}) {
  if (typeof primaryPass !== 'boolean') throw new TypeError('D3c requires the D3a decision (primaryPass)');
  const mean = a => a.reduce((s, x) => s + Math.abs(x.rho), 0) / a.length;
  const ratio = mean(original) ? mean(equalized) / mean(original) : 0;
  return { retained: ratio, applicable: primaryPass, pass: primaryPass && ratio >= retainMin };
}
// D2: per seed, observed consolidated-unit count vs surrogate counts.
export function d2Decision(perSeed, { ratioMin = 2, seedsRequired = 8 } = {}) {
  const ok = perSeed.map(({ observed, nulls }) => {
    const mean = nulls.reduce((s, x) => s + x, 0) / nulls.length;
    return observed > Math.max(...nulls) && (mean === 0 ? observed > 0 : observed / mean >= ratioMin);
  });
  return { passedSeeds: ok.filter(Boolean).length, pass: ok.filter(Boolean).length >= seedsRequired };
}
// D5: persistence of earlier units and creation rate after a new regime.
export function d5Decision({ before, after, rateBefore, rateAfter }, { persistMin = 0.8, rateMin = 0.1 } = {}) {
  const persist = before.length ? before.filter(k => after.includes(k)).length / before.length : 0;
  const rate = rateBefore ? rateAfter / rateBefore : 0;
  return { persist, rate, pass: persist >= persistMin && rate >= rateMin };
}
export { spearman };
