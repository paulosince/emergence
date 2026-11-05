// Physical world -> transducer -> incidence -> diagnostic engine.
// Research-only world truth is stored in the manifest, never delivered as input.
// Examples:
//   node experiments/world-senses.js --json
//   node experiments/world-senses.js --optical-only
//   node experiments/world-senses.js --no-sensors
import { createWorldSensoryScenario } from '../src/sensory/world-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';
import { readSourceRevision } from '../src/research/source-revision.js';
import { toCsv } from '../src/research/csv.js';

const flags = new Set(process.argv.slice(2));
const outputFlags = ['--json', '--csv', '--trace-csv'];
const modalityFlags = ['--optical-only', '--mechanical-only', '--no-sensors'];
if ([...flags].some(f => ![...outputFlags, ...modalityFlags].includes(f)) ||
    outputFlags.filter(f => flags.has(f)).length > 1 ||
    modalityFlags.filter(f => flags.has(f)).length > 1) {
  throw new Error('Select at most one output format and one modality condition');
}
const modalities = flags.has('--no-sensors') ? []
  : flags.has('--optical-only') ? ['optical']
    : flags.has('--mechanical-only') ? ['mechanical']
      : ['optical', 'mechanical'];
const { environment, transducers, seed, endTimeMs } =
  createWorldSensoryScenario({ modalities });
const result = runExperiment({
  environment, transducers, seed, endTimeMs,
  engine: new DiagnosticEngine(),
  softwareRevision: readSourceRevision(new URL('../', import.meta.url)),
});
if (flags.has('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else if (flags.has('--csv')) {
  process.stdout.write(toCsv(result.incidences.map(i => ({
    incidence_id: i.incidenceId, sensor: i.transducerId,
    observed_at_ms: i.observedAtMs, arrived_at_ms: i.arrivedAtMs,
    measurement: i.measurement,
  })), ['incidence_id', 'sensor', 'observed_at_ms',
    'arrived_at_ms', 'measurement']));
} else if (flags.has('--trace-csv')) {
  process.stdout.write(toCsv(result.trace.map(r => ({
    order: r.order, time_ms: r.timeMs,
    recorded_at_ms: r.recordedAtMs ?? r.timeMs,
    kind: r.type, sensor: r.transducerId ?? '',
    incidence_id: r.incidenceId ?? '',
    measurement: r.measurement ?? '',
    details_json: JSON.stringify(r.detail ?? r),
  })), ['order','time_ms','recorded_at_ms','kind','sensor',
    'incidence_id','measurement','details_json']));
} else {
  console.log(JSON.stringify({
    experimentalCondition: modalities,
    scientificStatus: 'physical sensors and transport; no unit constitution',
    physicalReference: result.manifest.environment.world,
    transduction: result.manifest.environment.couplings,
    summary: result.summary,
    deliveredIncidences: result.incidences,
    diagnosticSnapshot: result.finalSnapshot,
  }, null, 2));
}