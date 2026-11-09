// Maturation criterion (pre-registration, approved 09/11/2026), with the
// measure made explicit for calibration: per window, the FRACTION OF
// EXPECTATIONS THAT FAILED = failures / (failures + fulfilments). A window
// without expectations is undefined (a system that never predicts cannot pass).
import { spearman } from '../bench/stats.js';

export function failureFraction(w) { const n = w.failures + w.fulfilled; return n ? w.failures / n : null; }

// worlds: { fixed, cycle, cycleShuffled, random } -> arrays of windows
// {failures, fulfilled, created}. Returns per-seed decision.
export function maturationSeed(worlds, { finalMax = 0.05, slopeMax = -0.5 } = {}) {
  const f = k => worlds[k].map(failureFraction), last = a => a[a.length - 1];
  const fixed = f('fixed'), cycle = f('cycle'), shuf = f('cycleShuffled'), rnd = f('random');
  if ([fixed, cycle, shuf, rnd].some(a => a.some(x => x === null))) return { pass: false, reason: 'window without expectations' };
  const createdLast2 = worlds.fixed.slice(-2).reduce((a, w) => a + w.created, 0);
  const a = last(fixed) <= finalMax && createdLast2 === 0;
  const idx = cycle.map((_, i) => i);
  const b = last(cycle) <= finalMax || spearman(idx, cycle) <= slopeMax;
  const c = last(fixed) < last(cycle) + 1e-12 && last(cycle) <= last(rnd);
  const d = last(cycle) < last(shuf);
  return { pass: a && b && c && d, parts: { fixedMatures: a, cycleImproves: b, orderedByRandomness: c, beatsShuffled: d },
    final: { fixed: last(fixed), cycle: last(cycle), cycleShuffled: last(shuf), random: last(rnd) } };
}
export function maturationDecision(seeds, { seedsRequired = 8 } = {}) {
  const passed = seeds.filter(s => s.pass).length;
  return { passedSeeds: passed, pass: passed >= seedsRequired };
}
