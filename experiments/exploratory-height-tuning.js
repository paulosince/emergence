// EXPLORATORY (observer side; not a pre-registered criterion): are there units
// whose firing is TUNED to the drop height? For each unit that fired in >= 5
// episodes, tuning = SD of the heights of the episodes it fired in; compared
// with a null of the same number of episodes drawn at random (1000 draws).
// A unit is "tuned" if its SD is below the 1st percentile of its null.
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { replayIncidences } from '../src/research/bench/replay.js';
import { ConstitutiveEngine } from '../src/engines/constitutive/engine.js';
import { OracleIntervalControl } from '../src/engines/oracle-interval-control.js';
import { makeRng } from '../vendor/tempo/core/rng.js';

const FAST = { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } }, E = 3000;
const sd = a => { const m = a.reduce((x, y) => x + y, 0) / a.length; return Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length); };
const out = [];
for (let seed = 1; seed <= 10; seed++) {
  const { world, ...cfg } = createEpisodicDropScenario({ episodes: 40, scheduleSeed: seed, sensorOverrides: FAST });
  const H = world.describe().episodes.map(e => e.heightM);
  const r = replayIncidences(new ConstitutiveEngine({ seed, substrateSize: 10000, substrateSideUm: 860 }), runExperiment({ ...cfg, engine: new OracleIntervalControl() }).incidences, { endTimeMs: cfg.endTimeMs });
  const fired = new Map(), firstOf = new Map();
  for (const e of r.events) if (e.detail.type === 'unit.discharge') {
    const k = Math.floor(e.timeMs / E); if (!fired.has(e.detail.unit)) fired.set(e.detail.unit, new Set()); fired.get(e.detail.unit).add(k);
    if (!firstOf.has(k)) firstOf.set(k, e.detail.unit);
  }
  const rng = makeRng(seed + 500); let tested = 0, tuned = 0, firstTuned = 0; const tunedUnits = new Set();
  for (const [u, eps] of fired) {
    const ks = [...eps].filter(k => k < H.length); if (ks.length < 5 || ks.length > H.length - 5) continue;
    tested++;
    const obs = sd(ks.map(k => H[k])), nulls = [];
    for (let i = 0; i < 1000; i++) { const pick = [...H].sort(() => rng.random() - 0.5).slice(0, ks.length); nulls.push(sd(pick)); }
    nulls.sort((a, b) => a - b);
    if (obs < nulls[10]) { tuned++; tunedUnits.add(u); }
  }
  for (const [, u] of firstOf) if (tunedUnits.has(u)) firstTuned++;
  out.push({ seed, units: fired.size, tested, tuned, episodesWhoseFirstResponderIsTuned: firstTuned });
}
console.log(JSON.stringify(out, null, 1));
