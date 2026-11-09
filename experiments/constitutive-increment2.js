// Increment 2 check: creation rate on the tabletop (envelope: 50 creations per
// simulated second) and unit formation on the drops world, gate on vs off.
// No pre-registered criterion is evaluated here.
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { createTabletopScenario } from '../src/sensory/tabletop-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { replayIncidences } from '../src/research/bench/replay.js';
import { ConstitutiveEngine } from '../src/engines/constitutive/engine.js';
import { OracleIntervalControl } from '../src/engines/oracle-interval-control.js';

const FAST = { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } };
const rec = make => { const { world, ...cfg } = make(); const r = runExperiment({ ...cfg, engine: new OracleIntervalControl() }); return { inc: r.incidences, end: cfg.endTimeMs }; };
const streams = { 'quedas, 40 episódios': rec(() => createEpisodicDropScenario({ episodes: 40, scheduleSeed: 1, sensorOverrides: FAST })),
  'mesa, 120 s': rec(() => createTabletopScenario({ horizonMs: 120000, protocol: 'free', launchSeed: 1 })) };
const out = [];
for (const [name, s] of Object.entries(streams)) for (const gating of [false, true]) {
  const t0 = Date.now(), e = new ConstitutiveEngine({ seed: 1, substrateSize: 10000, substrateSideUm: 860, gating, cascade: gating });
  const r = replayIncidences(e, s.inc, { endTimeMs: s.end }), snap = r.finalSnapshot, n = t => r.events.filter(x => x.detail.type === t).length;
  out.push({ stream: name, gate: gating, created: n('unit.created'), perSecond: +(n('unit.created') / (s.end / 1000)).toFixed(1),
    alive: snap.units.length, consolidated: snap.units.filter(u => u.level > 0).length, pruned: n('unit.pruned'),
    releases: n('modulator.release'), desensitization: +snap.modulator.novelty.desensitization.toFixed(2), runMs: Date.now() - t0 });
}
if (process.argv.includes('--json')) console.log(JSON.stringify(out, null, 2));
else for (const o of out) console.log(Object.entries(o).map(([k, v]) => `${k}=${v}`).join(' '));
