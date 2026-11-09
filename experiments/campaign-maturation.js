// Campaign: maturation criterion (pre-registration, deviation 2) on the
// constitutive engine. Worlds: fixed height, 3-height cycle, random heights;
// 600 s (200 episodes); windows of 60 s; 10 seeds.
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { replayIncidences } from '../src/research/bench/replay.js';
import { ConstitutiveEngine } from '../src/engines/constitutive/engine.js';
import { OracleIntervalControl } from '../src/engines/oracle-interval-control.js';
import { maturationSeed, maturationDecision } from '../src/research/criteria/maturation.js';

const FAST = { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } }, EPI = 200, WIN = 60000;
const SIZE = Number(process.argv.find(a => a.startsWith('--size='))?.split('=')[1] ?? 10000);
const worldHeights = seed => ({ fixed: new Array(EPI).fill(1.4), cycle: Array.from({ length: EPI }, (_, k) => [1.0, 1.5, 2.0][k % 3]), random: null });
const seeds = [];
for (let seed = 1; seed <= 10; seed++) {
  const out = {};
  for (const [name, hs] of Object.entries(worldHeights(seed))) {
    const { world, ...cfg } = hs ? createEpisodicDropScenario({ heightsM: hs, sensorOverrides: FAST, maxEvents: 1e7 })
      : createEpisodicDropScenario({ episodes: EPI, scheduleSeed: seed, sensorOverrides: FAST, maxEvents: 1e7 });
    const inc = runExperiment({ ...cfg, engine: new OracleIntervalControl() }).incidences;
    const r = replayIncidences(new ConstitutiveEngine({ seed, substrateSize: SIZE, substrateSideUm: 400 * Math.cbrt(SIZE / 1000) }), inc, { endTimeMs: cfg.endTimeMs });
    const n = Math.ceil(cfg.endTimeMs / WIN), w = Array.from({ length: n }, () => ({ surpriseSum: 0, firings: 0, created: 0 }));
    for (const e of r.events) { const k = Math.min(n - 1, Math.floor(e.timeMs / WIN)), d = e.detail;
      if (d.type === 'unit.created') w[k].created++;
      else if (d.type === 'unit.discharge' && d.surprise !== null && d.surprise !== undefined) { w[k].surpriseSum += d.surprise; w[k].firings++; } }
    out[name] = w;
  }
  seeds.push({ seed, ...maturationSeed(out), windows: Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.map(x => x.firings ? +(x.surpriseSum / x.firings).toFixed(3) : null)])) });
}
const res = { substrate: SIZE, decision: maturationDecision(seeds), seeds };
console.log(JSON.stringify(res, null, 2));
