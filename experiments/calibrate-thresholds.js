// Threshold calibration for pre-registration v1 (P0.7). Uses ONLY control
// engines (never the MCM): a positive control that is designed to track the
// referent (OracleIntervalControl), and two negative controls (TEMPO fixed
// nodes; oracle with random delays). A threshold is useful only if the
// positive control passes and the negative controls fail.
// Usage: node experiments/calibrate-thresholds.js [--json] [--seeds=10]
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { episodicHeights } from '../src/world/episodic-drops.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { ExecutionController } from '../src/runtime/execution-controller.js';
import { TempoFixedNodesControl } from '../src/engines/tempo-fixed-nodes-control.js';
import { OracleIntervalControl } from '../src/engines/oracle-interval-control.js';
import { replayIncidences } from '../src/research/bench/replay.js';
import { circularShift } from '../src/research/bench/surrogates.js';
import { d3Seeds, d3aDecision, d3bDecision, d3cDecision, d2Decision, d5Decision } from '../src/research/criteria/phase1.js';

const SEEDS = Number(process.argv.find(a => a.startsWith('--seeds='))?.split('=')[1] ?? 10);
const FAST = { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } };
const EQ = { s0: { periodMs: 1, latencyMs: 3 }, s1: { periodMs: 1, latencyMs: 3 }, s2: { periodMs: 1, latencyMs: 3 } };
const MAP = { s0: 0, s1: 1, s2: 2 };
const ENGINES = {
  oracle: seed => new OracleIntervalControl({ seed }),
  'oracle-random': seed => new OracleIntervalControl({ randomDelays: true, seed }),
  tempo: seed => new TempoFixedNodesControl({ nodeCount: 3, transducerNodes: MAP, seed }),
};

// Per-episode delay of the engine's responding unit (oracle) or relation (TEMPO).
function perEpisode(kind, seed, scenarioOptions) {
  const { world, ...cfg } = createEpisodicDropScenario({ ...scenarioOptions, sensorOverrides: scenarioOptions.sensorOverrides ?? FAST });
  const eps = world.describe().episodes, E = world.describe().episodeMs, heights = [], delays = [];
  if (kind === 'tempo') {
    const c = new ExecutionController({ ...cfg, engine: ENGINES.tempo(seed) }).start();
    for (const e of eps) {
      c.advanceTo(Math.min(c.endTimeMs, (e.index + 1) * E - 1));
      const r = c.engineSnapshot().relations.filter(x => x.source === 0 && x.target === 1).sort((a, b) => b.weight - a.weight)[0];
      if (r) { heights.push(e.heightM); delays.push(r.traversalMs); }
      if (c.state !== 'running') break;
    }
    return { heights, delays, final: c.state === 'completed' ? c.result() : null };
  }
  const r = runExperiment({ ...cfg, engine: ENGINES[kind](seed) });
  for (const e of eps) {
    const d = r.trace.find(t => t.type === 'engine.event' && t.detail.type === 'unit.discharge' &&
      t.timeMs >= e.index * E && t.timeMs < (e.index + 1) * E);
    if (d) { heights.push(e.heightM); delays.push(d.detail.delayMs); }
  }
  return { heights, delays, final: r };
}
const unitCount = (kind, snap) => kind === 'tempo' ? snap.relations.length : snap.units.length;

const out = {};
for (const kind of Object.keys(ENGINES)) {
  const variable = [], fixed = [], equal = [], d2 = [], d5 = [];
  for (let seed = 1; seed <= SEEDS; seed++) {
    const v = perEpisode(kind, seed, { episodes: 40, scheduleSeed: seed });
    variable.push({ seed, heights: v.heights, delays: v.delays });
    const f = perEpisode(kind, seed, { heightsM: new Array(40).fill(1.4) });
    // fixed height: correlate delay with the (tiny jittered) episode index heights; height constant -> rho ~ 0
    fixed.push({ seed, heights: f.heights.map((h, i) => h + i * 1e-9), delays: f.delays });
    const q = perEpisode(kind, seed, { episodes: 40, scheduleSeed: seed, sensorOverrides: EQ });
    equal.push({ seed, heights: q.heights, delays: q.delays });
    // D2: units on real stream vs 30 circular-shift surrogates
    const { world, ...cfg } = createEpisodicDropScenario({ episodes: 40, scheduleSeed: seed, sensorOverrides: FAST });
    const real = runExperiment({ ...cfg, engine: ENGINES[kind](seed) });
    const nulls = [];
    for (let s = 0; s < 30; s++) {
      const sur = circularShift(real.incidences, { horizonMs: cfg.endTimeMs, seed: 1000 * seed + s }).incidences;
      nulls.push(unitCount(kind, replayIncidences(ENGINES[kind](seed), sur, { endTimeMs: cfg.endTimeMs }).finalSnapshot));
    }
    d2.push({ seed, observed: unitCount(kind, real.finalSnapshot), nulls });
    // D5: regime A U(0.8,2.0) then B U(2.0,3.0)
    const A = episodicHeights({ episodes: 40, minHeightM: 0.8, maxHeightM: 2.0, scheduleSeed: seed });
    const B = episodicHeights({ episodes: 40, minHeightM: 2.0, maxHeightM: 3.0, scheduleSeed: seed + 500 });
    const { world: w5, ...c5 } = createEpisodicDropScenario({ heightsM: [...A, ...B], sensorOverrides: FAST });
    const ctl = new ExecutionController({ ...c5, engine: ENGINES[kind](seed) }).start();
    ctl.advanceTo(40 * 3000 - 1);
    const keysOf = s => kind === 'tempo' ? s.relations.map(r => r.source + '>' + r.target) : s.units.map(u => u.key);
    const before = keysOf(ctl.engineSnapshot()), nA = before.length;
    ctl.runToEnd();
    const after = keysOf(ctl.result().finalSnapshot);
    const created = kind === 'tempo' ? null : ctl.result().trace.filter(t => t.detail?.type === 'unit.created');
    const rateBefore = created ? created.filter(t => t.timeMs < 120000).length : nA;
    const rateAfter = created ? created.filter(t => t.timeMs >= 120000).length : Math.max(0, after.length - nA);
    d5.push(d5Decision({ before, after, rateBefore, rateAfter }));
  }
  const sv = d3Seeds(variable), sf = d3Seeds(fixed), se = d3Seeds(equal);
  out[kind] = {
    d3aStats: sv.map(s => ({ seed: s.seed, rho: +s.rho.toFixed(3), p: +s.p.toFixed(4), n: s.n })),
    d3a: d3aDecision(sv), d3b: d3bDecision(sf), d3c: d3cDecision(sv, se), d2: d2Decision(d2),
    d2Example: { observed: d2[0].observed, nullMax: Math.max(...d2[0].nulls), nullMean: d2[0].nulls.reduce((a, b) => a + b, 0) / 30 },
    d5: { pass: d5.filter(x => x.pass).length >= Math.ceil(0.8 * SEEDS), persistMean: d5.reduce((a, x) => a + x.persist, 0) / SEEDS,
      rateMean: d5.reduce((a, x) => a + x.rate, 0) / SEEDS },
    grid: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map(rhoMin => ({ rhoMin,
      bySeedsRequired: Object.fromEntries([6, 7, 8, 9, 10].map(k => [k, d3aDecision(sv, { rhoMin, seedsRequired: k }).pass])) })),
  };
}
if (process.argv.includes('--json')) console.log(JSON.stringify(out, null, 2));
else for (const [k, v] of Object.entries(out)) {
  console.log('\n==', k);
  console.log(' D3a', JSON.stringify(v.d3a), 'rho', v.d3aStats.map(s => s.rho).join(' '), '| p', v.d3aStats.map(s => s.p).join(' '));
  console.log(' D3b', JSON.stringify(v.d3b), ' D3c', JSON.stringify(v.d3c));
  console.log(' D2 ', JSON.stringify(v.d2), JSON.stringify(v.d2Example));
  console.log(' D5 ', JSON.stringify(v.d5));
  console.log(' grade D3a (ρ mínimo × sementes exigidas 6..10):');
  for (const g of v.grid) console.log('   ρ≥' + g.rhoMin, Object.values(g.bySeedsRequired).map(x => x ? 'P' : '·').join(' '));
}
