// Does surprise (expectation failures) decrease as the engine matures?
// Exploratory observation (not a pre-registered criterion). Rates per window.
// Usage: node experiments/surprise-over-time.js [--json] [--seconds=600]
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { createTabletopScenario } from '../src/sensory/tabletop-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { replayIncidences } from '../src/research/bench/replay.js';
import { ConstitutiveEngine } from '../src/engines/constitutive/engine.js';
import { OracleIntervalControl } from '../src/engines/oracle-interval-control.js';

const SEC = Number(process.argv.find(a => a.startsWith('--seconds='))?.split('=')[1] ?? 600);
const FAST = { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } };
const rec = make => { const { world, ...cfg } = make(); const r = runExperiment({ ...cfg, engine: new OracleIntervalControl() }); return { inc: r.incidences, end: cfg.endTimeMs }; };
const streams = {
  quedas: { s: rec(() => createEpisodicDropScenario({ episodes: 200, scheduleSeed: 1, sensorOverrides: FAST, maxEvents: 10000000 })), win: 60000 },
  'quedas altura fixa': { s: rec(() => createEpisodicDropScenario({ heightsM: new Array(200).fill(1.4), sensorOverrides: FAST, maxEvents: 10000000 })), win: 60000 },
  'quedas ciclo de 3 alturas': { s: rec(() => createEpisodicDropScenario({ heightsM: Array.from({ length: 200 }, (_, k) => [1.0, 1.5, 2.0][k % 3]), sensorOverrides: FAST, maxEvents: 10000000 })), win: 60000 },
  mesa: { s: rec(() => createTabletopScenario({ horizonMs: SEC * 1000, protocol: 'free', launchSeed: 1 })), win: 30000 },
};
const out = {};
for (const [name, { s, win }] of Object.entries(streams)) {
  const e = new ConstitutiveEngine({ seed: 1, substrateSize: 10000, substrateSideUm: 860 });
  const r = replayIncidences(e, s.inc, { endTimeMs: s.end });
  const nWin = Math.ceil(s.end / win), rows = Array.from({ length: nWin }, (_, k) => ({ fromS: k * win / 1000, surprises: 0, created: 0, discharges: 0, releases: 0, surpriseSum: 0, firings: 0 }));
  for (const x of r.events) {
    const k = Math.min(nWin - 1, Math.floor(x.timeMs / win)), d = x.detail.type;
    if (d === 'expectation.failed') rows[k].surprises++;
    else if (d === 'unit.created') rows[k].created++;
    else if (d === 'unit.discharge') { rows[k].discharges++; if (x.detail.surprise !== null && x.detail.surprise !== undefined) { rows[k].surpriseSum += x.detail.surprise; rows[k].firings++; } }
    else if (d === 'modulator.release') rows[k].releases++;
  }
  // surprises per discharge: failures relative to how much the engine is predicting
  for (const w of rows) w.meanSurprise = w.firings ? +(w.surpriseSum / w.firings).toFixed(3) : null;
  out[name] = { windowS: win / 1000, rows };
}
if (process.argv.includes('--json')) console.log(JSON.stringify(out, null, 2));
else for (const [n, v] of Object.entries(out)) {
  console.log(`== ${n} (janela ${v.windowS} s)`);
  for (const w of v.rows) console.log(`${w.fromS}s surpresas ${w.surprises} | criadas ${w.created} | descargas ${w.discharges} | surpresa média por disparo ${w.meanSurprise} | liberações ${w.releases}`);
}
