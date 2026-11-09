// Run the constitutive engine on a world with any parameter changed.
// Examples:
//   node scripts/run-constitutive.mjs --world=quedas --set unitSize=6 --set contradictionFactor=0.8
//   node scripts/run-constitutive.mjs --world=mesa --seconds=120 --config=minha-config.json --json
//   node scripts/run-constitutive.mjs --list            (all parameters, value, status, source)
// Worlds: quedas | quedas-fixa | quedas-ciclo | mesa. Any change to a
// pre-registered value marks the run as EXPLORATORY in the output.
import { readFileSync } from 'node:fs';
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { createTabletopScenario } from '../src/sensory/tabletop-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { replayIncidences } from '../src/research/bench/replay.js';
import { ConstitutiveEngine } from '../src/engines/constitutive/engine.js';
import { PARAMETERS, checkOverrides } from '../src/engines/constitutive/parameters.js';
import { OracleIntervalControl } from '../src/engines/oracle-interval-control.js';

const args = process.argv.slice(2), arg = n => args.find(a => a.startsWith('--' + n + '='))?.split('=').slice(1).join('=');
if (args.includes('--list')) {
  for (const p of PARAMETERS) console.log(`${p.name} = ${JSON.stringify(p.value)} ${p.unit} [${p.status}] ${p.source}`);
  process.exit(0);
}
const overrides = arg('config') ? JSON.parse(readFileSync(arg('config'), 'utf8')) : {};
args.forEach((a, i) => { if (a === '--set') { const [k, ...v] = args[i + 1].split('='); const raw = v.join('='); try { overrides[k] = JSON.parse(raw); } catch { overrides[k] = raw; } } });
const check = checkOverrides(overrides);
const world = arg('world') ?? 'quedas', seconds = Number(arg('seconds') ?? 120), seed = Number(arg('seed') ?? 1);
const FAST = { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } }, n = Math.ceil(seconds / 3);
const makers = {
  quedas: () => createEpisodicDropScenario({ episodes: n, scheduleSeed: seed, sensorOverrides: FAST, maxEvents: 1e7 }),
  'quedas-fixa': () => createEpisodicDropScenario({ heightsM: new Array(n).fill(1.4), sensorOverrides: FAST, maxEvents: 1e7 }),
  'quedas-ciclo': () => createEpisodicDropScenario({ heightsM: Array.from({ length: n }, (_, k) => [1.0, 1.5, 2.0][k % 3]), sensorOverrides: FAST, maxEvents: 1e7 }),
  mesa: () => createTabletopScenario({ horizonMs: seconds * 1000, protocol: 'free', launchSeed: seed }),
};
if (!makers[world]) throw new RangeError('Unknown world: ' + world);
const { world: w, ...cfg } = makers[world]();
const rec = runExperiment({ ...cfg, engine: new OracleIntervalControl() });
const engine = new ConstitutiveEngine({ seed, ...overrides });
const t0 = Date.now(), r = replayIncidences(engine, rec.incidences, { endTimeMs: cfg.endTimeMs }), snap = r.finalSnapshot;
const count = t => r.events.filter(x => x.detail.type === t).length;
const out = { world, seconds: cfg.endTimeMs / 1000, seed, exploratory: check.exploratory, changed: Object.fromEntries(check.changed.map(k => [k, overrides[k]])),
  created: count('unit.created'), alive: snap.units.length, consolidated: snap.units.filter(u => u.level > 0).length,
  level2: snap.units.filter(u => u.hierLevel >= 2).length, pruned: snap.pruned, discharges: count('unit.discharge'),
  surprises: snap.surprises, releases: count('modulator.release'), sleepEpisodes: snap.sleepEpisodes, runMs: Date.now() - t0 };
if (args.includes('--json')) console.log(JSON.stringify(out, null, 2));
else {
  console.log(out.exploratory ? 'EXECUÇÃO EXPLORATÓRIA (valores diferentes do pré-registro):' : 'Parâmetros do pré-registro.', JSON.stringify(out.changed));
  for (const [k, v] of Object.entries(out)) if (!['changed', 'exploratory'].includes(k)) console.log(`  ${k}: ${v}`);
}
