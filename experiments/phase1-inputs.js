// Run with node; no bundler or package dependencies.
// --json: full trace; --csv: delivered inputs; --trace-csv: all recorded events.
// --tempo-control: explicitly pre-maps A/B/C to existing TEMPO nodes.
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { createPhase1Scenario } from '../src/sensory/scenarios.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';
import { TempoFixedNodesControl } from '../src/engines/tempo-fixed-nodes-control.js';
import { toCsv } from '../src/research/csv.js';
import { execFileSync } from 'node:child_process';

const flags = new Set(process.argv.slice(2));
const allowed = new Set(['--json', '--csv', '--trace-csv', '--tempo-control']);
for (const flag of flags) if (!allowed.has(flag)) {
  throw new Error('Unknown argument: ' + flag);
}
if ([...flags].filter(flag => ['--json', '--csv', '--trace-csv'].includes(flag)).length > 1) {
  throw new Error('Choose at most one output format');
}
const scene = createPhase1Scenario();
const engine = flags.has('--tempo-control')
  ? new TempoFixedNodesControl({
      nodeCount: 3, transducerNodes: { A: 0, B: 1, C: 2 },
      seed: scene.seed,
    })
  : new DiagnosticEngine();
let revision = process.env.GITHUB_SHA || null;
if (!revision) {
  try {
    revision = execFileSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8', cwd: new URL('../', import.meta.url),
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    // A source ZIP without .git can still run, but provenance remains unverified.
  }
}
const result = runExperiment({ ...scene, engine, softwareRevision: revision });
if (flags.has('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else if (flags.has('--csv')) {
  process.stdout.write(toCsv(result.incidences.map(x => ({
    incidence_id: x.incidenceId,
    transducer_id: x.transducerId,
    observed_at_ms: x.observedAtMs,
    arrived_at_ms: x.arrivedAtMs,
    measurement: x.measurement,
  })), ['incidence_id', 'transducer_id', 'observed_at_ms', 'arrived_at_ms', 'measurement']));
} else if (flags.has('--trace-csv')) {
  process.stdout.write(toCsv(result.trace.map(x => ({
    record_order: x.order, recorded_at_ms: x.timeMs, event_type: x.type,
    incidence_id: x.incidenceId ?? '', transducer_id: x.transducerId ?? '',
    details_json: JSON.stringify(x.detail ?? x),
  })), ['record_order', 'recorded_at_ms', 'event_type',
    'incidence_id', 'transducer_id', 'details_json']));
} else {
  console.log(JSON.stringify({
    name: 'EMERGENCE Phase 1 — input pipeline (not unit emergence)',
    scenarioId: result.manifest.environment.scenarioId,
    engine: result.manifest.engine,
    summary: result.summary,
    firstDeliveredIncidences: result.incidences.slice(0, 6),
    finalSnapshot: result.finalSnapshot,
  }, null, 2));
}