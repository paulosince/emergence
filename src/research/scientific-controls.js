// Versioned, predeclared control conditions; every contrast changes one
// intended factor or states its different experimental assumptions explicitly.
// All learning engines see only numeric incidences, never control metadata.
import { createWorldSensoryScenario } from '../sensory/world-scenario.js';
import { WorldSignalEnvironment } from '../sensory/world-signals.js';
import { createReleaseControlledWorld } from '../world/release-control.js';
import { createNoninteractingImpacts } from './noninteracting-impacts.js';
import { auditFirstImpact } from './numeric-fall-oracle.js';
import { auditIncidenceTrace } from './incidence-audit.js';
import { auditDiagnosticDelivery } from './diagnostic-audit.js';
import { runExperiment } from '../runtime/experiment-runner.js';
import { DiagnosticEngine } from '../engines/diagnostic-engine.js';

function alteredPhysicalWorld(properties, seed) {
  const baseline = createWorldSensoryScenario({ seed });
  const world = createReleaseControlledWorld(properties);
  const couplings = baseline.environment.specification().couplings;
  return {
    ...baseline,
    world,
    environment: new WorldSignalEnvironment({ world, couplings }),
  };
}

export const SCIENTIFIC_CONTROLS_V1 = Object.freeze([
  Object.freeze({ id: 'single-baseline-v1', changedFactor: 'none',
    description: 'One verified world, all three instrumented channels' }),
  Object.freeze({ id: 'upper-beam-aliasing-v1', changedFactor: 's0 sampling period',
    description: 'Miss a brief obstruction without changing the world' }),
  Object.freeze({ id: 'upper-beam-position-v1', changedFactor: 's0 beam height',
    description: 'Move one sensor without moving the sphere' }),
  Object.freeze({ id: 'mechanical-delay-v1', changedFactor: 's2 delivery latency',
    description: 'Separate observed event time from delivered time' }),
  Object.freeze({ id: 'no-sensors-v1', changedFactor: 'sensor availability',
    description: 'Physical events continue, but no incidences exist' }),
  Object.freeze({ id: 'inelastic-collision-v1', changedFactor: 'restitution',
    description: 'Remove the rebound with the same other physical conditions' }),
  Object.freeze({ id: 'zero-gravity-v1', changedFactor: 'gravity',
    description: 'No fall or collision when released from rest' }),
  Object.freeze({ id: 'delayed-release-v1', changedFactor: 'intervention time',
    description: 'Experimenter delays release, not physics or sensor clocks' }),
  Object.freeze({ id: 'dual-noninteracting-coincident-v1',
    changedFactor: 'two noninteracting physical origins with timed release',
    description: 'Two distinct collisions in the same sampling bin' }),
  Object.freeze({ id: 'dual-noninteracting-staggered-v1',
    changedFactor: 'second origin release time relative to coincident condition',
    description: 'Same two physical mechanisms, separated event times' }),
]);

export function createScientificControl(id, { seed = 42 } = {}) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) {
    throw new RangeError('Seed must be a valid unsigned 32-bit integer');
  }
  if (!SCIENTIFIC_CONTROLS_V1.some(entry => entry.id === id)) {
    throw new RangeError('Unknown or unversioned scientific control: ' + id);
  }
  let scene;
  switch (id) {
    case 'single-baseline-v1': scene = createWorldSensoryScenario({ seed }); break;
    case 'upper-beam-aliasing-v1':
      scene = createWorldSensoryScenario({
        seed, sensorOverrides: { s0: { periodMs: 100 } },
      }); break;
    case 'upper-beam-position-v1':
      scene = createWorldSensoryScenario({
        seed, couplingOverrides: { s0: { beamHeightM: 0.45 } },
      }); break;
    case 'mechanical-delay-v1':
      scene = createWorldSensoryScenario({
        seed, sensorOverrides: { s2: { latencyMs: 25 } },
      }); break;
    case 'no-sensors-v1':
      scene = createWorldSensoryScenario({ seed, modalities: [] }); break;
    case 'inelastic-collision-v1':
      scene = alteredPhysicalWorld({ clearanceM: 1, restitution: 0 }, seed); break;
    case 'zero-gravity-v1':
      scene = alteredPhysicalWorld({ clearanceM: 1, gravityMps2: 0 }, seed); break;
    case 'delayed-release-v1':
      scene = alteredPhysicalWorld({ clearanceM: 1, releaseAtMs: 100 }, seed); break;
    case 'dual-noninteracting-coincident-v1':
      scene = createNoninteractingImpacts({ arrangement: 'coincident', seed }); break;
    case 'dual-noninteracting-staggered-v1':
      scene = createNoninteractingImpacts({ arrangement: 'staggered', seed }); break;
  }
  return Object.freeze({ ...scene, researchConditionId: id });
}

export function runScientificControl(id, { seed = 42,
  softwareRevision = null } = {}) {
  const scene = createScientificControl(id, { seed });
  const result = runExperiment({
    ...scene, engine: new DiagnosticEngine(), softwareRevision,
  });
  const incidenceAudit = auditIncidenceTrace(result);
  if (!incidenceAudit.passed) {
    throw new Error('Experiment incidence audit failed: ' +
      JSON.stringify(incidenceAudit.failures));
  }
  const diagnosticAudit = auditDiagnosticDelivery(result);
  if (!diagnosticAudit.passed) {
    throw new Error('Diagnostic engine audit failed: ' +
      JSON.stringify(diagnosticAudit.failures));
  }
  // Researcher-side physical validation, not supplied as an incidence.
  const physicalAudits = scene.world
    ? [auditFirstImpact(scene.world, { stepMs: 1, toleranceMs: 0.01 })]
    : [];
  if (physicalAudits.some(x => !x.passed)) {
    throw new Error('Independent physical audit failed');
  }
  return {
    condition: SCIENTIFIC_CONTROLS_V1.find(x => x.id === id),
    result,
    incidenceAudit,
    diagnosticAudit,
    physicalAudits,
  };
}