// Calibration of the maturation criterion (deviation 2) with controls.
// Episodes produce lived delays from the drops physics. A control keeps units
// (one per delay, tolerance 5%); when a unit exists for the delay it FIRES with
// surprise = 1 - preparation (preparation = first-afferent weight).
//   positive  'strengthening':  relation weight grows with each firing (0.3 + 0.12 per level, max level 5)
//   negative  'frozen':         weight never grows
//   negative  'random-prep':    preparation drawn at random at each firing
//   negative  'create-always':  never reuses a unit (no firings)
import { makeRng } from '../vendor/tempo/core/rng.js';
import { maturationSeed, maturationDecision } from '../src/research/criteria/maturation.js';

const G = 9.81, delay = h => Math.sqrt(2 * h / G) * 1000, TOL = 0.05, EPI = 200, WIN = 20;
const worlds = seed => { const r = makeRng(1000 + seed);
  return { fixed: new Array(EPI).fill(1.4), cycle: Array.from({ length: EPI }, (_, k) => [1.0, 1.5, 2.0][k % 3]), random: Array.from({ length: EPI }, () => 0.8 + 1.2 * r.random()) }; };
const CONTROLS = {
  strengthening: () => ({ grow: true }), frozen: () => ({ grow: false }),
  'random-prep': seed => ({ rnd: makeRng(seed + 99) }), 'create-always': () => ({ never: true }),
};
function run(kind, seed) {
  const out = {};
  for (const [name, hs] of Object.entries(worlds(seed))) {
    const c = CONTROLS[kind](seed), units = [], wins = [];
    hs.forEach((h, k) => {
      if (k % WIN === 0) wins.push({ surpriseSum: 0, firings: 0, created: 0 });
      const w = wins[wins.length - 1], d = delay(h);
      const u = c.never ? null : units.find(x => Math.abs(x.d - d) <= Math.max(2, TOL * x.d));
      if (!u) { units.push({ d, level: 0 }); w.created++; return; }
      const prep = c.rnd ? c.rnd.random() : Math.min(0.95, 0.3 + 0.12 * u.level);
      w.surpriseSum += 1 - prep; w.firings++;
      if (c.grow && u.level < 5) u.level++;
    });
    out[name] = wins;
  }
  return out;
}
const res = {};
for (const kind of Object.keys(CONTROLS)) {
  const seeds = Array.from({ length: 10 }, (_, i) => maturationSeed(run(kind, i + 1)));
  res[kind] = { decision: maturationDecision(seeds), example: seeds[0] };
}
if (process.argv.includes('--json')) console.log(JSON.stringify(res, null, 2));
else for (const [k, v] of Object.entries(res)) console.log(k, JSON.stringify(v.decision), JSON.stringify(v.example.parts ?? v.example.reason), JSON.stringify(v.example.final ?? ''));
