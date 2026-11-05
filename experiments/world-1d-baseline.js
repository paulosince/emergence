// Step 3: world-only, deliberately NO sensory channels or representation engine.
// node experiments/world-1d-baseline.js [--json | --csv | --events-csv]
import { createDropV1, DROP_V1, researchSampleTimes } from '../src/world/scenarios.js';
import { verifyVerticalTrajectory } from '../src/world/trajectory-verifier.js';
import { toCsv } from '../src/research/csv.js';
import { readSourceRevision } from '../src/research/source-revision.js';

const flags = process.argv.slice(2);
if (flags.some(arg => !['--json', '--csv', '--events-csv'].includes(arg)) ||
    flags.length > 1) {
  throw new Error('Choose one option: --json, --csv, --events-csv or no option');
}
const world = createDropV1();
const times = researchSampleTimes(world, {
  horizonMs: DROP_V1.horizonMs, stepMs: DROP_V1.sampleStepMs,
});
const states = times.map(t => world.stateAt(t));
const events = world.eventsThrough(DROP_V1.horizonMs);
const verification = verifyVerticalTrajectory(world, times);
if (!verification.passed) {
  throw new Error('World verification failed: ' + JSON.stringify(verification.failures));
}
const result = {
  manifest: {
    scenarioId: DROP_V1.scenarioId,
    stage: 'world-only, no transduction or domain constitution',
    software: { name: 'EMERGENCE', version: '0.3.0',
      revision: readSourceRevision(new URL('../', import.meta.url)) },
    world: world.describe(),
    horizonMs: DROP_V1.horizonMs,
    sampledTimesMs: times,
  },
  events, states, verification,
};
if (flags[0] === '--json') {
  console.log(JSON.stringify(result, null, 2));
} else if (flags[0] === '--csv') {
  process.stdout.write(toCsv(states.map(s => ({
    time_ms: s.timeMs, phase: s.phase,
    clearance_m: s.clearanceM, center_height_m: s.centerHeightM,
    velocity_mps: s.verticalVelocityMps, acceleration_mps2: s.verticalAccelerationMps2,
    normal_force_n: s.normalForceN,
    kinetic_energy_j: s.kineticEnergyJ, potential_energy_j: s.potentialEnergyJ,
  })), ['time_ms','phase','clearance_m','center_height_m','velocity_mps',
    'acceleration_mps2','normal_force_n','kinetic_energy_j','potential_energy_j']));
} else if (flags[0] === '--events-csv') {
  process.stdout.write(toCsv(events.map(e => ({
    event_type: e.type, event_id: e.eventId, time_ms: e.timeMs,
    impulse_ns: e.normalImpulseNs ?? 0,
    kinetic_loss_j: e.kineticEnergyLossJ ?? 0,
  })), ['event_type','event_id','time_ms','impulse_ns','kinetic_loss_j']));
} else {
  console.log(JSON.stringify({
    name: 'EMERGENCE Step 3: analytic world (no representation learning)',
    model: result.manifest.world.modelId,
    scenarioId: result.manifest.scenarioId,
    impactTimeMs: result.manifest.world.impactTimeMs,
    secondImpactTimeMs: result.manifest.world.secondImpactTimeMs,
    eventCount: events.length, sampleCount: states.length,
    verification,
  }, null, 2));
}