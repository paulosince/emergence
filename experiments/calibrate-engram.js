// Calibration of the engram-style criteria D2-R, D4-S, D5-D
// (docs/engram-criteria-v0.1.md) against one positive and three negative
// controls. Valid criterion: positive passes, every negative fails.
// Usage: node experiments/calibrate-engram.js [--json] [--seeds=10] [--no-tempo]
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { episodicHeights } from '../src/world/episodic-drops.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { ExecutionController } from '../src/runtime/execution-controller.js';
import { ConstitutiveEngine } from '../src/engines/constitutive/engine.js';
import { GwrComparator } from '../src/engines/comparators/gwr.js';
import { OracleIntervalControl } from '../src/engines/oracle-interval-control.js';
import { TempoFixedNodesControl } from '../src/engines/tempo-fixed-nodes-control.js';
import { replayIncidences } from '../src/research/bench/replay.js';
import { makeRng } from '../vendor/tempo/core/rng.js';
import { reactivationTest, d2rDecision, contentOf, retrieval, d4sDecision, d5dDecision } from '../src/research/criteria/engram.js';

const SEEDS = Number(process.argv.find(a => a.startsWith('--seeds='))?.split('=')[1] ?? 10);
const FAST = { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } };
const E = 3000, N = 40, HALF = 20, RANDOM = 30, TARGETS = 10, PERM = 2000;
const ENGINES = {
  constitutive: seed => new ConstitutiveEngine({ seed, substrateSize: 10000, substrateSideUm: 860 }),
  gwr: () => new GwrComparator(),

  oracle: seed => new OracleIntervalControl({ seed }),
  'oracle-random': seed => new OracleIntervalControl({ randomDelays: true, seed }),
  'oracle-create-always': seed => new OracleIntervalControl({ createAlways: true, seed }),
  tempo: seed => new TempoFixedNodesControl({ nodeCount: 3, transducerNodes: { s0: 0, s1: 1, s2: 2 }, seed }),
};
const ONLY = process.argv.find(a => a.startsWith('--only='))?.split('=')[1]?.split(',');
const KINDS = Object.keys(ENGINES).filter(k => !(k === 'tempo' && process.argv.includes('--no-tempo'))).filter(k => !ONLY || ONLY.includes(k));

// Responder of each episode: first discharging unit (oracle family) or the
// strongest 0->1 relation at the episode end (TEMPO emits no unit events).
const respondersFromEvents = (events, n) => Array.from({ length: n }, (_, k) =>
  events.find(t => t.detail.type === 'unit.discharge' && t.timeMs >= k * E && t.timeMs < (k + 1) * E)?.detail.unit ?? null);
function tempoResponders(heights, seed) {
  const { world, ...cfg } = createEpisodicDropScenario({ heightsM: heights, sensorOverrides: FAST, maxEvents: 10000000 });
  const c = new ExecutionController({ ...cfg, engine: ENGINES.tempo(seed) }).start(), R = [];
  const keysAtStart = [];
  for (let k = 0; k < heights.length; k++) {
    c.advanceTo(Math.min(c.endTimeMs, (k + 1) * E - 1));
    const r = c.engineSnapshot().relations.filter(x => x.source === 0 && x.target === 1).sort((a, b) => b.weight - a.weight)[0];
    R.push(r ? `${r.source}>${r.target}` : null);
    if (k === 39) keysAtStart.push(...c.engineSnapshot().relations.map(x => `${x.source}>${x.target}`));
    if (c.state !== 'running') break;
  }
  const keysEnd = c.engineSnapshot().relations.map(x => `${x.source}>${x.target}`);
  return { R, keysA: keysAtStart, keysB: keysEnd };
}
const stream = heights => {
  const { world, ...cfg } = createEpisodicDropScenario({ heightsM: heights, sensorOverrides: FAST, maxEvents: 10000000 });
  const r = runExperiment({ ...cfg, engine: new OracleIntervalControl() });
  return { incidences: r.incidences, endTimeMs: cfg.endTimeMs };
};

const data = [];
for (let seed = 1; seed <= SEEDS; seed++) {
  const H = episodicHeights({ episodes: N, scheduleSeed: seed });
  const A = H, B = episodicHeights({ episodes: N, minHeightM: 2.0, maxHeightM: 3.0, scheduleSeed: seed + 500 });
  const A2 = episodicHeights({ episodes: N, scheduleSeed: seed + 900 });
  data.push({ seed, H, ABA: [...A, ...B, ...A2], s1: stream(H), s5: stream([...A, ...B, ...A2]) });
}
const out = {};
for (const kind of KINDS) {
  const make = ENGINES[kind], d2 = [], d4 = [], d5 = [];
  for (const s of data) {
    // ---- D2-R
    let R;
    if (kind === 'tempo') R = tempoResponders(s.H, s.seed).R;
    else R = respondersFromEvents(replayIncidences(make(s.seed), s.s1.incidences, { endTimeMs: s.s1.endTimeMs }).events, N);
    const split = { encH: s.H.slice(0, HALF), encR: R.slice(0, HALF), testH: s.H.slice(HALF), testR: R.slice(HALF) };
    d2.push({ seed: s.seed, ...reactivationTest(split, { permutations: PERM, seed: 31 * s.seed }) });
    // ---- D4-S (needs ablate)
    if (typeof make(1).ablate === 'function') {
      const runWith = removed => {
        const e = make(s.seed); let done = removed == null;
        const r = replayIncidences(e, s.s1.incidences, { endTimeMs: s.s1.endTimeMs,
          onDelivered: (i, eng) => { if (!done && i.arrivedAtMs >= HALF * E) { eng.ablate(removed); done = true; } } });
        return respondersFromEvents(r.events, N).slice(HALF);
      };
      const pre = [...new Set(split.encR.filter(x => x != null))];
      const targets = pre.map(u => ({ u, idx: contentOf(u, split) })).filter(t => t.idx.length && retrieval(t.u, t.idx, split.testR) > 0).slice(0, TARGETS);
      const rng = makeRng(77 * s.seed), units = [];
      for (const t of targets) {
        const base = retrieval(t.u, t.idx, split.testR);
        const ablated = runWith(t.u);
        const effect = base - retrieval(t.u, t.idx, ablated);
        // other MEMORIES: test episodes retrieved (intact run) by another unit that
        // already existed at encoding. Episodes answered by units created after
        // the removal are excluded: their keys are renumbered by the extra
        // re-creation, a labelling artifact (calibration, run 1 of D4-S).
        const others = split.testR.map((_, j) => j).filter(j => !t.idx.includes(j) && pre.includes(split.testR[j]) && split.testR[j] !== t.u);
        const specificity = others.length ? others.filter(j => ablated[j] === split.testR[j]).length / others.length : 1;
        const pool = pre.filter(x => x !== t.u), nulls = [];
        for (let k = 0; k < RANDOM && pool.length; k++) nulls.push(base - retrieval(t.u, t.idx, runWith(pool[Math.floor(rng.random() * pool.length)])));
        units.push({ unit: t.u, contentEpisodes: t.idx.length, base, effect, nullMax: nulls.length ? Math.max(...nulls) : 0, specificity });
      }
      d4.push({ seed: s.seed, units });
    }
    // ---- D5-D: A (0..39), B (40..79), A' (80..119)
    let R5, keysA, keysEnd, rateA, rateB;
    if (kind === 'tempo') {
      const t = tempoResponders(s.ABA, s.seed); R5 = t.R; keysA = t.keysA; keysEnd = t.keysB; rateA = keysA.length; rateB = Math.max(0, new Set(keysEnd).size - new Set(keysA).size);
    } else {
      const e = make(s.seed); let snapA = null;
      const r = replayIncidences(e, s.s5.incidences, { endTimeMs: s.s5.endTimeMs,
        onDelivered: (i, eng) => { if (!snapA && i.arrivedAtMs >= 2 * N * E) snapA = eng.snapshot(); } });
      R5 = respondersFromEvents(r.events, 3 * N);
      const created = r.events.filter(t => t.detail.type === 'unit.created');
      rateA = created.filter(t => t.timeMs < N * E).length; rateB = created.filter(t => t.timeMs >= N * E && t.timeMs < 2 * N * E).length;
      keysA = created.filter(t => t.timeMs < N * E).map(t => t.detail.unit);
      keysEnd = (snapA ?? r.finalSnapshot).units.map(u => u.key);  // units alive at the end of B
    }
    const persist = keysA.length ? keysA.filter(k => keysEnd.includes(k)).length / keysA.length : 0;
    const rate = rateA ? rateB / rateA : 0;
    const ecphory = reactivationTest({ encH: s.ABA.slice(0, N), encR: R5.slice(0, N), testH: s.ABA.slice(2 * N), testR: R5.slice(2 * N) },
      { permutations: PERM, seed: 53 * s.seed });
    d5.push({ seed: s.seed, persist, rate, ecphory });
  }
  const d2r = d2rDecision(d2);
  out[kind] = {
    d2r, d2rStats: d2.map(x => ({ seed: x.seed, observed: +x.observed.toFixed(3), nullMean: +x.nullMean.toFixed(3), p: +x.p.toFixed(4) })),
    d4s: d4.length ? d4sDecision(d4, { d2rPass: d2r.pass }) : { testable: false, reason: 'engine declares no ablate(unitKey)' },
    d4sUnits: d4.map(x => ({ seed: x.seed, n: x.units.length, passed: x.units.filter(u => u.effect > u.nullMax).length,
      specificity: x.units.length ? +(x.units.reduce((a, u) => a + u.specificity, 0) / x.units.length).toFixed(3) : null })),
    d5d: d5dDecision(d5), d5dStats: d5.map(x => ({ seed: x.seed, persist: +x.persist.toFixed(2), rate: +x.rate.toFixed(2),
      ecphory: +x.ecphory.observed.toFixed(3), null: +x.ecphory.nullMean.toFixed(3), p: +x.ecphory.p.toFixed(4) })),
    grid: [0.1, 0.2, 0.3, 0.4].map(minGain => ({ minGain, d2r: d2rDecision(d2, { minGain }).pass, d5d: d5dDecision(d5, { minGain }).pass })),
  };
}
if (process.argv.includes('--json')) console.log(JSON.stringify(out, null, 2));
else for (const [k, v] of Object.entries(out)) {
  console.log('\n==', k);
  console.log(' D2-R', JSON.stringify(v.d2r), v.d2rStats.map(x => `${x.observed}/${x.nullMean}`).join(' '));
  console.log(' D4-S', JSON.stringify(v.d4s), v.d4sUnits.map(x => `${x.passed}/${x.n}·${x.specificity}`).join(' '));
  console.log(' D5-D', JSON.stringify(v.d5d), v.d5dStats.map(x => `p${x.persist} r${x.rate} e${x.ecphory}/${x.null}`).join(' '));
  console.log(' grade ganho mínimo', v.grid.map(g => `${g.minGain}:${g.d2r ? 'P' : '·'}${g.d5d ? 'P' : '·'}`).join(' '));
}
