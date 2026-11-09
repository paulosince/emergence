// Surrogate incidence streams (P0.4): researcher-side nulls built from a
// recorded stream. Each preserves some properties and destroys others; the
// manifest of each surrogate states which.
import { makeRng } from '../../../vendor/tempo/core/rng.js';

const byChannel = incidences => {
  const m = new Map();
  for (const i of incidences) (m.get(i.transducerId) ?? m.set(i.transducerId, []).get(i.transducerId)).push(i);
  return m;
};
const finalize = (list, kind) => list
  .sort((a, b) => a.arrivedAtMs - b.arrivedAtMs || (a.transducerId < b.transducerId ? -1 : 1))
  .map((x, k) => Object.freeze({ ...x, incidenceId: kind + '-' + (k + 1) }));

// Circular shift per channel: preserves each channel's count, values and
// internal timing (autocorrelation); destroys cross-channel timing.
export function circularShift(incidences, { horizonMs, seed = 0 } = {}) {
  if (!Number.isFinite(horizonMs) || horizonMs <= 0) throw new RangeError('horizonMs required');
  const rng = makeRng(seed), out = [];
  for (const [, list] of [...byChannel(incidences)].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    const shift = rng.uniform(0, horizonMs);
    for (const i of list) {
      const lag = i.arrivedAtMs - i.observedAtMs;
      const arrived = (i.arrivedAtMs + shift) % horizonMs;
      out.push({ ...i, arrivedAtMs: arrived, observedAtMs: Math.max(0, arrived - lag) });
    }
  }
  return { incidences: finalize(out, 'cs'), preserves: ['per-channel count', 'per-channel values', 'per-channel internal timing'],
    destroys: ['cross-channel timing'] };
}

// Interval shuffle per channel: preserves count, values (in order) and the
// distribution of inter-incidence intervals; destroys internal timing order
// and cross-channel timing.
export function intervalShuffle(incidences, { seed = 0 } = {}) {
  const rng = makeRng(seed), out = [];
  for (const [, list] of [...byChannel(incidences)].sort((a, b) => (a[0] < b[0] ? -1 : 1))) {
    const t = list.map(i => i.arrivedAtMs);
    const gaps = t.slice(1).map((x, k) => x - t[k]);
    for (let k = gaps.length - 1; k > 0; k--) { const j = Math.floor(rng.random() * (k + 1)); [gaps[k], gaps[j]] = [gaps[j], gaps[k]]; }
    let cur = t[0];
    list.forEach((i, k) => {
      if (k > 0) cur += gaps[k - 1];
      const lag = i.arrivedAtMs - i.observedAtMs;
      out.push({ ...i, arrivedAtMs: cur, observedAtMs: Math.max(0, cur - lag) });
    });
  }
  return { incidences: finalize(out, 'is'), preserves: ['per-channel count', 'per-channel values order', 'interval distribution'],
    destroys: ['per-channel temporal order of intervals', 'cross-channel timing'] };
}

// Channel-label permutation: preserves the whole timing structure; destroys
// the correspondence between channel identity and its source.
export function channelPermutation(incidences, { seed = 0 } = {}) {
  const rng = makeRng(seed);
  const ids = [...new Set(incidences.map(i => i.transducerId))].sort();
  const perm = ids.slice();
  for (let k = perm.length - 1; k > 0; k--) { const j = Math.floor(rng.random() * (k + 1)); [perm[k], perm[j]] = [perm[j], perm[k]]; }
  const map = Object.fromEntries(ids.map((id, k) => [id, perm[k]]));
  return { incidences: finalize(incidences.map(i => ({ ...i, transducerId: map[i.transducerId] })), 'cp'),
    mapping: map, preserves: ['all timing'], destroys: ['channel identity to source correspondence'] };
}
