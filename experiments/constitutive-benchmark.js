// Performance test of the constitutive engine (increment 1) for the scale
// series decided on 09/11/2026: substrates of 1,000, 10,000 and 100,000
// elements. Incidence streams are recorded once and replayed (engine time only).
// Usage: node experiments/constitutive-benchmark.js [--json]
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { createTabletopScenario } from '../src/sensory/tabletop-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { replayIncidences } from '../src/research/bench/replay.js';
import { ConstitutiveEngine } from '../src/engines/constitutive/engine.js';
import { OracleIntervalControl } from '../src/engines/oracle-interval-control.js';

const FAST = { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } };
function record(name, make) {
  const t0 = Date.now(); const { world, ...cfg } = make();
  const r = runExperiment({ ...cfg, engine: new OracleIntervalControl() });
  return { name, incidences: r.incidences, endTimeMs: cfg.endTimeMs, recordMs: Date.now() - t0 };
}
const streams = [
  record('quedas, 40 episódios', () => createEpisodicDropScenario({ episodes: 40, scheduleSeed: 1, sensorOverrides: FAST })),
  record('mesa, 120 s', () => createTabletopScenario({ horizonMs: 120000, protocol: 'free', launchSeed: 1 })),
];
const out = [];
for (const s of streams) for (const size of [1000, 10000, 100000]) {
  const t0 = Date.now(), mem0 = process.memoryUsage().heapUsed;
  const e = new ConstitutiveEngine({ seed: 1, substrateSize: size, substrateSideUm: 400 * Math.cbrt(size / 1000) });
  const tBuild = Date.now() - t0;
  const r = replayIncidences(e, s.incidences, { endTimeMs: s.endTimeMs });
  const snap = r.finalSnapshot;
  out.push({ stream: s.name, incidences: s.incidences.length, substrate: size, buildMs: tBuild, runMs: Date.now() - t0 - tBuild,
    units: snap.units.length, occupied: snap.substrate.occupied, failures: snap.substrate.recruitmentFailures,
    discharges: r.events.filter(x => x.detail.type === 'unit.discharge').length,
    heapMB: +((process.memoryUsage().heapUsed - mem0) / 1e6).toFixed(1) });
}
if (process.argv.includes('--json')) console.log(JSON.stringify({ streams: streams.map(s => ({ name: s.name, incidences: s.incidences.length, recordMs: s.recordMs })), results: out }, null, 2));
else for (const o of out) console.log(`${o.stream} | substrato ${o.substrate} | ${o.incidences} incidências | construção ${o.buildMs} ms | execução ${o.runMs} ms | unidades ${o.units} | elementos ocupados ${o.occupied} | descargas ${o.discharges} | falhas ${o.failures}`);
