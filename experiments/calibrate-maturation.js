// Calibration of the maturation criterion with controls (no candidate engine).
// Worlds = sequences of lived delays from the drops world physics (impact time
// after release for each height). Controls predict the next delay; a
// prediction fails if it misses the actual delay by more than the tolerance.
//   positive  'sequence-learner': learns next delay given the last 3 (online table)
//   negative  'frozen':           predicts the first delay forever (no learning)
//   negative  'random-guess':     predicts a random delay in the physical range
//   negative  'create-always':    never predicts (no expectations); creates a unit per episode
import { makeRng } from '../vendor/tempo/core/rng.js';
import { maturationSeed, maturationDecision } from '../src/research/criteria/maturation.js';

const G = 9.81, delay = h => Math.sqrt(2 * h / G) * 1000, TOL = 0.05;
const EPI = 200, WIN = 20;
function worlds(seed) {
  const r = makeRng(1000 + seed), cyc = Array.from({ length: EPI }, (_, k) => [1.0, 1.5, 2.0][k % 3]);
  const sh = cyc.slice(); for (let i = sh.length - 1; i > 0; i--) { const j = Math.floor(r.random() * (i + 1)); [sh[i], sh[j]] = [sh[j], sh[i]]; }
  return { fixed: new Array(EPI).fill(1.4), cycle: cyc, cycleShuffled: sh, random: Array.from({ length: EPI }, () => 0.8 + 1.2 * r.random()) };
}
const CONTROLS = {
  'sequence-learner': () => { const table = new Map(), seen = []; return { predict: () => { const k = seen.slice(-3).join(); return table.has(k) ? table.get(k) : (seen.length ? seen[seen.length - 1] : null); }, learn: d => { const k = seen.slice(-3).join(); table.set(k, d); seen.push(Math.round(d)); }, creates: d => !seen.includes(Math.round(d)) }; },
  frozen: () => { let first = null; return { predict: () => first, learn: d => { if (first === null) first = d; }, creates: () => false }; },
  'random-guess': seed => { const r = makeRng(seed + 77); return { predict: () => delay(0.8 + 1.2 * r.random()), learn: () => {}, creates: () => false }; },
  'create-always': () => ({ predict: () => null, learn: () => {}, creates: () => true }),
};
function run(kind, seed) {
  const out = {};
  for (const [name, hs] of Object.entries(worlds(seed))) {
    const c = CONTROLS[kind](seed), wins = [];
    hs.forEach((h, k) => {
      if (k % WIN === 0) wins.push({ failures: 0, fulfilled: 0, created: 0 });
      const w = wins[wins.length - 1], d = delay(h), pr = c.predict();
      if (c.creates(d)) w.created++;
      if (pr !== null) { if (Math.abs(pr - d) <= Math.max(2, TOL * d)) w.fulfilled++; else w.failures++; }
      c.learn(d);
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
