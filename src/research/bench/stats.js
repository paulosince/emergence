// Researcher-side statistics for the evaluation bench (P0.4). Deterministic:
// every randomized procedure takes an explicit seed.
import { makeRng } from '../../../vendor/tempo/core/rng.js';

export function ranks(a) {
  const o = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]);
  const r = new Array(a.length);
  for (let k = 0; k < o.length;) {           // average ranks for ties
    let j = k; while (j + 1 < o.length && o[j + 1][0] === o[k][0]) j++;
    const avg = (k + j) / 2;
    for (let m = k; m <= j; m++) r[o[m][1]] = avg;
    k = j + 1;
  }
  return r;
}
export function pearson(a, b) {
  const n = a.length; if (n !== b.length || n < 2) throw new RangeError('need paired samples (n>=2)');
  const ma = a.reduce((s, x) => s + x, 0) / n, mb = b.reduce((s, x) => s + x, 0) / n;
  let num = 0, da = 0, db = 0;
  for (let i = 0; i < n; i++) { num += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; }
  return da && db ? num / Math.sqrt(da * db) : 0;
}
export const spearman = (a, b) => pearson(ranks(a), ranks(b));

function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
// Two-sided permutation test for an association statistic (default Spearman).
export function permutationTest(a, b, { stat = spearman, permutations = 2000, seed = 0 } = {}) {
  const observed = stat(a, b), rng = makeRng(seed);
  let extreme = 0;
  for (let k = 0; k < permutations; k++) if (Math.abs(stat(a, shuffle(b, rng))) >= Math.abs(observed)) extreme++;
  return { observed, p: (extreme + 1) / (permutations + 1), permutations };
}
// Observed value against a null sample: empirical one-sided p (greater) and z.
export function compareToNull(observed, nullSamples) {
  const n = nullSamples.length; if (!n) throw new RangeError('empty null sample');
  const mean = nullSamples.reduce((s, x) => s + x, 0) / n;
  const sd = Math.sqrt(nullSamples.reduce((s, x) => s + (x - mean) ** 2, 0) / Math.max(1, n - 1));
  const geq = nullSamples.filter(x => x >= observed).length;
  // Degenerate null (zero variance): z is +/-Infinity when the observation
  // differs from the constant null, 0 when equal. pGreater is floored at
  // 1/(n+1): resolution is limited by the number of null samples.
  const z = sd ? (observed - mean) / sd : (observed === mean ? 0 : Math.sign(observed - mean) * Infinity);
  return { observed, nullMean: mean, nullSd: sd, z, nullMax: Math.max(...nullSamples),
    pGreater: (geq + 1) / (n + 1), pFloor: 1 / (n + 1), n };
}
// Percentile bootstrap CI of the mean.
export function bootstrapMeanCI(values, { resamples = 2000, alpha = 0.05, seed = 0 } = {}) {
  const rng = makeRng(seed), n = values.length; if (!n) throw new RangeError('empty sample');
  const means = [];
  for (let k = 0; k < resamples; k++) { let s = 0; for (let i = 0; i < n; i++) s += values[Math.floor(rng.random() * n)]; means.push(s / n); }
  means.sort((x, y) => x - y);
  return { mean: values.reduce((s, x) => s + x, 0) / n,
    low: means[Math.floor((alpha / 2) * resamples)], high: means[Math.ceil((1 - alpha / 2) * resamples) - 1] };
}
