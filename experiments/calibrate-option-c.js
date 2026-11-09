// Calibration of option (c) for pre-registration v1: drop D2 and support H1
// with D3a + D4 (causal removal). Question: do D3a and D4 TOGETHER accept the
// positive control and reject every negative control, including the
// 'create always' control that D2 was meant to catch?
// D4 outcome (PROVISIONAL operationalization, to be approved by the
// researcher): REUSE AFTER REMOVAL = number of discharges after the removal
// time that go to units constituted before it. Secondary: units created after.
// Usage: node experiments/calibrate-option-c.js [--json] [--seeds=10]
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { OracleIntervalControl } from '../src/engines/oracle-interval-control.js';
import { TempoFixedNodesControl } from '../src/engines/tempo-fixed-nodes-control.js';
import { replayIncidences } from '../src/research/bench/replay.js';
import { causalRemovalTest } from '../src/research/bench/causal.js';
import { d3Seeds, d3aDecision } from '../src/research/criteria/phase1.js';

const SEEDS = Number(process.argv.find(a => a.startsWith('--seeds='))?.split('=')[1] ?? 10);
const FAST = { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } };
const REMOVE_AT = 20 * 3000;           // start of episode 20 of 40
const CONSOLIDATED = 3, TARGETS = 10, RANDOM = 30;
const ENGINES = {
  oracle: seed => new OracleIntervalControl({ seed }),
  'oracle-random': seed => new OracleIntervalControl({ randomDelays: true, seed }),
  'oracle-create-always': seed => new OracleIntervalControl({ createAlways: true, seed }),
  tempo: seed => new TempoFixedNodesControl({ nodeCount: 3, transducerNodes: { s0: 0, s1: 1, s2: 2 }, seed }),
};

const out = {};
const streams = [];
for (let seed = 1; seed <= SEEDS; seed++) {
  const { world, ...cfg } = createEpisodicDropScenario({ episodes: 40, scheduleSeed: seed, sensorOverrides: FAST });
  const r = runExperiment({ ...cfg, engine: new OracleIntervalControl({ seed }) });
  streams.push({ seed, incidences: r.incidences, endTimeMs: cfg.endTimeMs, eps: world.describe().episodes, E: world.describe().episodeMs });
}
for (const kind of Object.keys(ENGINES)) {
  const make = ENGINES[kind];
  if (typeof make(1).ablate !== 'function') { out[kind] = { d4: { testable: false, reason: 'engine declares no ablate(unitKey)' } }; continue; }
  const variable = [], seeds = [];
  for (const s of streams) {
    const intact = replayIncidences(make(s.seed), s.incidences, { endTimeMs: s.endTimeMs });
    const heights = [], delays = [];
    for (const e of s.eps) {
      const d = intact.events.find(t => t.detail.type === 'unit.discharge' && t.timeMs >= e.index * s.E && t.timeMs < (e.index + 1) * s.E);
      if (d) { heights.push(e.heightM); delays.push(d.detail.delayMs); }
    }
    variable.push({ seed: s.seed, heights, delays });
    const pre = replayIncidences(make(s.seed), s.incidences.filter(i => i.arrivedAtMs < REMOVE_AT), { endTimeMs: REMOVE_AT - 1 }).finalSnapshot.units;
    const preKeys = new Set(pre.map(u => u.key));
    const reuse = r => r.events.filter(t => t.timeMs >= REMOVE_AT && t.detail.type === 'unit.discharge' && preKeys.has(t.detail.unit)).length;
    const created = r => r.events.filter(t => t.timeMs >= REMOVE_AT && t.detail.type === 'unit.created').length;
    const targets = pre.filter(u => u.discharges >= CONSOLIDATED).sort((a, b) => a.createdAtMs - b.createdAtMs).slice(0, TARGETS);
    const units = [];
    for (const [k, t] of targets.entries()) {
      const args = { makeEngine: () => make(s.seed), incidences: s.incidences, endTimeMs: s.endTimeMs, removeAtMs: REMOVE_AT,
        target: t.key, candidates: pre.map(u => u.key), randomRemovals: RANDOM, seed: 7000 * s.seed + k };
      const a = causalRemovalTest({ ...args, outcome: reuse });
      const b = causalRemovalTest({ ...args, outcome: created });
      units.push({ key: t.key, discharges: t.discharges, reuseEffect: a.targetEffect, reuseNullMax: a.null.nullMax,
        passed: a.targetEffect > a.null.nullMax, createdEffect: b.targetEffect, createdNullMax: b.null.nullMax });
    }
    const passedUnits = units.filter(u => u.passed).length;
    // per seed: >= 70% of the available targets (pre-registered 7 of 10); no consolidated unit = fail
    seeds.push({ seed: s.seed, preUnits: pre.length, consolidated: targets.length, passedUnits,
      pass: targets.length > 0 && passedUnits >= Math.ceil(0.7 * targets.length), units });
  }
  const d3a = d3aDecision(d3Seeds(variable));
  const d4 = { testable: true, passedSeeds: seeds.filter(x => x.pass).length, pass: seeds.filter(x => x.pass).length >= Math.ceil(0.8 * SEEDS) };
  out[kind] = { d3a, d4, optionC: d3a.pass && d4.pass, seeds };
}
if (process.argv.includes('--json')) console.log(JSON.stringify(out, null, 2));
else for (const [k, v] of Object.entries(out)) {
  console.log('\n==', k, '| D3a', JSON.stringify(v.d3a ?? null), '| D4', JSON.stringify(v.d4), '| (c) H1 apoiada:', v.optionC ?? 'n/a');
  for (const s of v.seeds ?? []) console.log(`  semente ${s.seed}: unidades ${s.preUnits}, consolidadas ${s.consolidated}, passam ${s.passedUnits}`,
    s.units.map(u => `${u.reuseEffect}>${u.reuseNullMax}${u.passed ? '✓' : '·'}`).join(' '));
}
