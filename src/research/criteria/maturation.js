// Maturation criterion (pre-registration; deviation 2 approved 09/11/2026).
// Measure: per window, MEAN SURPRISE PER FIRING, surprise = 1 - preparation of
// the integrating unit at the moment it fires (CLEAR: firing without
// preparation). A window without firings is undefined (cannot pass).
// Components: (a) fixed-height world matures (final surprise within margin of
// the minimum possible, and no creation in the last two windows); (b) worlds
// with structure (fixed, cycle) improve: final within margin OR Spearman
// (window x surprise) <= slopeMax; (c) ordered by randomness: fixed <= cycle <= random.
// The former 'cycle below shuffled cycle' component was removed: preparation
// is relational, not sequential (sequence order is a projection-level property).
import { spearman } from '../bench/stats.js';

export const meanSurprise = w => (w.firings ? w.surpriseSum / w.firings : null);

export function maturationSeed(worlds, { minSurprise = 0.1, margin = 0.05, slopeMax = -0.5 } = {}) {
  const f = k => worlds[k].map(meanSurprise), last = a => a[a.length - 1];
  const fixed = f('fixed'), cycle = f('cycle'), rnd = f('random');
  const lastDefined = a => [...a].reverse().find(x => x !== null) ?? null;
  if ([fixed, cycle].some(a => a.some(x => x === null)) || lastDefined(rnd) === null) return { pass: false, reason: 'window without firings' };
  const ok = a => last(a) <= minSurprise + margin || spearman(a.map((_, i) => i), a) <= slopeMax;
  const a = last(fixed) <= minSurprise + margin && worlds.fixed.slice(-2).reduce((s, w) => s + w.created, 0) === 0;
  const b = ok(fixed) && ok(cycle);
  const c = last(fixed) <= last(cycle) + 1e-9 && last(cycle) <= lastDefined(rnd) + 1e-9;
  return { pass: a && b && c, parts: { fixedMatures: a, structuredImprove: b, orderedByRandomness: c },
    final: { fixed: last(fixed), cycle: last(cycle), random: lastDefined(rnd) } };
}
export function maturationDecision(seeds, { seedsRequired = 8 } = {}) {
  const passed = seeds.filter(s => s.pass).length;
  return { passedSeeds: passed, pass: passed >= seedsRequired };
}
