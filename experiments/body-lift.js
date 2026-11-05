// Researcher-facing experiment: one internally coupled body and external world.
// Default control is experimenter-commanded, NEVER autonomously selected.
import { createBodyScenario } from '../src/body/body-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';
import { readSourceRevision } from '../src/research/source-revision.js';
import { auditFirstImpact } from '../src/research/numeric-fall-oracle.js';
import { auditBodyEnergy } from '../src/research/body-energy-audit.js';
import { toCsv } from '../src/research/csv.js';

const flags = new Set(process.argv.slice(2));
const allowed = new Set([
  '--json', '--csv', '--optical-only', '--proprio-only',
  '--intero-only', '--no-sensors', '--no-lift',
]);
if ([...flags].some(f => !allowed.has(f)) ||
    ['--optical-only', '--proprio-only', '--intero-only', '--no-sensors']
      .filter(x => flags.has(x)).length > 1) {
  throw new Error('Unknown or incompatible body experiment flags');
}
const modalities = flags.has('--optical-only') ? ['optical']
  : flags.has('--proprio-only') ? ['proprioceptive']
  : flags.has('--intero-only') ? ['interoceptive']
  : flags.has('--no-sensors') ? []
  : ['optical', 'mechanical', 'proprioceptive', 'interoceptive'];
const scene = createBodyScenario({
  modalities,
  worldOptions: flags.has('--no-lift') ? { liftHeightM: 0 } : {},
});
const result = runExperiment({
  ...scene,
  engine: new DiagnosticEngine(),
  softwareRevision: readSourceRevision(new URL('../', import.meta.url)),
});
const physicalChecks = {
  energy: auditBodyEnergy(scene.world),
  contact: auditFirstImpact(scene.world, {
    stepMs: 1, toleranceMs: 0.01,
  }),
};
if (!physicalChecks.energy.passed || !physicalChecks.contact.passed) {
  throw new Error('Independent body/world verification failed');
}
if (flags.has('--json')) {
  console.log(JSON.stringify({ result, physicalChecks }, null, 2));
} else if (flags.has('--csv')) {
  process.stdout.write(toCsv(result.incidences.map(i => ({
    incidence_id: i.incidenceId,
    transducer_id: i.transducerId,
    observed_at_ms: i.observedAtMs,
    arrived_at_ms: i.arrivedAtMs,
    measurement: i.measurement,
  })), ['incidence_id', 'transducer_id', 'observed_at_ms',
    'arrived_at_ms', 'measurement']));
} else {
  console.log(JSON.stringify({
    name: 'EMERGENCE Phase 6 — physical body plus external world',
    status: 'no autonomous controller, no unit formation',
    modalities,
    physicalWorld: result.manifest.environment.world,
    summary: result.summary,
    physicalChecks,
    diagnosticSnapshot: result.finalSnapshot,
  }, null, 2));
}