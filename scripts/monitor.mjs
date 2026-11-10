// Headless campaign: node scripts/monitor.mjs --plan=plano.json --dir=results/campanha
// plan: [{ "id": "quedas-s1", "world": "quedas", "seconds": 120, "seed": 1, "params": { "substrateSize": 10000 } }, ...]
// Exit code 2 if a STOP is active or was triggered (fail-closed).
import { readFileSync } from 'node:fs';
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { createTabletopScenario } from '../src/sensory/tabletop-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { OracleIntervalControl } from '../src/engines/oracle-interval-control.js';
import { runCampaign, campaignBlocked } from '../src/monitor/campaign.js';

const arg = n => process.argv.find(a => a.startsWith('--' + n + '='))?.split('=').slice(1).join('=');
const dir = arg('dir') ?? 'results/campanha', plan = JSON.parse(readFileSync(arg('plan'), 'utf8'));
if (campaignBlocked(dir)) { console.error('STOP ativo em ' + dir + ': nenhuma execução nova sem RESUME.json registrado.'); process.exit(2); }
const FAST = { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } };
const runs = plan.map(p => {
  const n = Math.ceil(p.seconds / 3);
  const mk = { quedas: () => createEpisodicDropScenario({ episodes: n, scheduleSeed: p.seed, sensorOverrides: FAST, maxEvents: 1e7 }),
    'quedas-fixa': () => createEpisodicDropScenario({ heightsM: new Array(n).fill(1.4), sensorOverrides: FAST, maxEvents: 1e7 }),
    'quedas-ciclo': () => createEpisodicDropScenario({ heightsM: Array.from({ length: n }, (_, k) => [1.0, 1.5, 2.0][k % 3]), sensorOverrides: FAST, maxEvents: 1e7 }),
    mesa: () => createTabletopScenario({ horizonMs: p.seconds * 1000, protocol: 'standard-v1', launchSeed: p.seed }) }[p.world];
  const { world, ...cfg } = mk();
  const inc = runExperiment({ ...cfg, engine: new OracleIntervalControl() }).incidences.slice().sort((a, b) => a.arrivedAtMs - b.arrivedAtMs);
  return { id: p.id, incidences: inc, endTimeMs: cfg.endTimeMs, params: { seed: p.seed, ...(p.params ?? {}) } };
});
const rep = runCampaign({ dir, runs, codeVersion: process.env.GITHUB_SHA ?? null });
console.log(JSON.stringify(rep, null, 2));
if (rep.some(r => r.status !== 'completed')) process.exit(2);
