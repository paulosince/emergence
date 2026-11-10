// Controls of the version-2 mechanisms (EXPLORATORY: not pre-registered; serves
// to check that each mechanism does what it claims before pre-registration v2).
// Worlds: fixed height, 3-height cycle, random heights, and the fixed world with
// shuffled intervals (structure destroyed). Variants: full engine and one
// ablation per mechanism. 600 s, seeds 1..5.
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { replayIncidences } from '../src/research/bench/replay.js';
import { intervalShuffle } from '../src/research/bench/surrogates.js';
import { ConstitutiveEngineV2 } from '../src/engines/constitutive/engine-v2.js';
import { OracleIntervalControl } from '../src/engines/oracle-interval-control.js';

const FAST = { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } }, EPI = 200, SEEDS = [1, 2, 3, 4, 5], FIFTHS = 5;
const VARIANTS = {
  completo: {},
  semFortalecimento: { potentiationRate: 0 },
  semIncidenciaTardia: { depressionRate: 0, delayAdjustRate: 0 },
  semInibicao: { inhibitoryGain: 0 },
  semPortao: { gating: false },
};
const CACHE = new Map(); // fixed and cycle worlds do not depend on the seed (world simulation is the slow part)
const worldInc = (name, seed) => {
  const key = name.startsWith('aleatoria') ? name + seed : name.replace('-embaralhada', '');
  if (!CACHE.has(key)) CACHE.set(key, buildWorld(name, seed));
  const w = CACHE.get(key);
  return name.endsWith('-embaralhada') ? { inc: intervalShuffle(w.inc, { seed }).incidences, endTimeMs: w.endTimeMs } : w;
};
const buildWorld = (name, seed) => {
  const hs = { fixa: new Array(EPI).fill(1.4), ciclo: Array.from({ length: EPI }, (_, k) => [1.0, 1.5, 2.0][k % 3]) }[name.replace('-embaralhada', '')];
  const sc = hs ? createEpisodicDropScenario({ heightsM: hs, sensorOverrides: FAST, maxEvents: 1e7 })
    : createEpisodicDropScenario({ episodes: EPI, scheduleSeed: seed, sensorOverrides: FAST, maxEvents: 1e7 });
  const { world, ...cfg } = sc;
  let inc = runExperiment({ ...cfg, engine: new OracleIntervalControl() }).incidences;
  return { inc, endTimeMs: cfg.endTimeMs };
};
function run(inc, endTimeMs, seed, overrides) {
  const r = replayIncidences(new ConstitutiveEngineV2({ seed, substrateSize: 10000, substrateSideUm: 400 * Math.cbrt(10), ...overrides }), inc, { endTimeMs });
  const fifth = endTimeMs / FIFTHS, f = Array.from({ length: FIFTHS }, () => ({ created: 0, firings: 0, surprises: 0 }));
  const episodes = new Map(); // 3-s windows: units firing per window (co-firing)
  for (const e of r.events) {
    const d = e.detail, k = Math.min(FIFTHS - 1, Math.floor(e.timeMs / fifth));
    if (d.type === 'unit.created') f[k].created++;
    if (d.type === 'unit.discharge' && !d.intrinsic) {
      f[k].firings++; if (d.surprise) f[k].surprises++;
      const w = Math.floor(e.timeMs / 3000); if (!episodes.has(w)) episodes.set(w, new Set()); episodes.get(w).add(d.unit);
    }
  }
  const s = r.finalSnapshot, gains = s.units.flatMap(u => u.gains);
  return { fifths: f.map(x => ({ created: x.created, surpriseRate: x.firings ? +(x.surprises / x.firings).toFixed(3) : null })),
    units: s.units.length, firings: s.stats.firings, surpriseRate: s.surpriseRate === null ? null : +s.surpriseRate.toFixed(3),
    confirmations: s.stats.confirmations, late: s.stats.late, delayAdjusts: s.stats.delayAdjusts,
    meanGain: gains.length ? +(gains.reduce((a, b) => a + b, 0) / gains.length).toFixed(3) : null,
    coFiring: s.units.length && episodes.size ? +([...episodes.values()].reduce((a, x) => a + x.size, 0) / episodes.size / s.units.length).toFixed(3) : null };
}
const WORLDS = ['fixa', 'ciclo', 'aleatoria', 'fixa-embaralhada'];
const results = {};
for (const seed of SEEDS) for (const w of WORLDS) {
  const { inc, endTimeMs } = worldInc(w, seed);
  for (const [v, o] of Object.entries(VARIANTS)) {
    if (v !== 'completo' && w !== 'fixa') continue; // ablations on the fixed world only
    const t0 = Date.now();
    (results[w + '/' + v] ??= []).push({ seed, ...run(inc, endTimeMs, seed, o) });
    console.error(`seed ${seed} ${w}/${v} ${Date.now() - t0} ms`);
  }
}
const mean = a => { const x = a.filter(v => v !== null); return x.length ? +(x.reduce((s, v) => s + v, 0) / x.length).toFixed(3) : null; };
const summary = Object.fromEntries(Object.entries(results).map(([k, rs]) => [k, {
  units: mean(rs.map(r => r.units)), firings: mean(rs.map(r => r.firings)), surpriseRate: mean(rs.map(r => r.surpriseRate)),
  surpriseFirstFifth: mean(rs.map(r => r.fifths[0].surpriseRate)), surpriseLastFifth: mean(rs.map(r => r.fifths[FIFTHS - 1].surpriseRate)),
  createdFirstFifth: mean(rs.map(r => r.fifths[0].created)), createdLastFifth: mean(rs.map(r => r.fifths[FIFTHS - 1].created)),
  meanGain: mean(rs.map(r => r.meanGain)), late: mean(rs.map(r => r.late)), delayAdjusts: mean(rs.map(r => r.delayAdjusts)), coFiring: mean(rs.map(r => r.coFiring)) }]));
console.log(JSON.stringify({ exploratory: true, seeds: SEEDS, seconds: 600, summary, results }, null, 2));
