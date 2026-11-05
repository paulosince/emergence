import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runScientificControl, createScientificControl,
  SCIENTIFIC_CONTROLS_V1 } from '../src/research/scientific-controls.js';
import { auditIncidenceTrace } from '../src/research/incidence-audit.js';
import { auditDiagnosticDelivery } from '../src/research/diagnostic-audit.js';

const run = id => runScientificControl(id).result;
const values = (r, id) => r.incidences.filter(i => i.transducerId === id)
  .map(i => [i.observedAtMs, i.arrivedAtMs, i.measurement]);

test('the complete versioned campaign runs and is reproducible', () => {
  assert.equal(SCIENTIFIC_CONTROLS_V1.length, 13);
  assert.equal(new Set(SCIENTIFIC_CONTROLS_V1.map(c => c.id)).size, 13);
  for (const control of SCIENTIFIC_CONTROLS_V1) {
    const output = runScientificControl(control.id);
    assert.equal(output.condition.id, control.id);
    assert.equal(output.incidenceAudit.passed, true);
    assert.equal(output.diagnosticAudit.passed, true);
    assert.ok(output.physicalAudits.length >= 1,
      'No physical audit actually executed');
    assert.ok(output.physicalAudits.every(x => x.passed));
    assert.deepEqual(output, runScientificControl(control.id));
  }
});

test('each controlled alteration is isolated to its declared factor', () => {
  const base = run('single-baseline-v1');
  const aliased = run('upper-beam-aliasing-v1');
  const moved = run('upper-beam-position-v1');
  const delayed = run('mechanical-delay-v1');
  const noSensors = run('no-sensors-v1');
  for (const result of [aliased, moved, delayed, noSensors]) {
    assert.deepEqual(result.manifest.environment.world,
      base.manifest.environment.world);
  }
  assert.deepEqual(values(aliased, 's0').map(x => x[2]), [1]);
  assert.deepEqual(values(aliased, 's1'), values(base, 's1'));
  assert.notDeepEqual(values(moved, 's0'), values(base, 's0'));
  assert.deepEqual(values(moved, 's1'), values(base, 's1'));
  assert.deepEqual(values(moved, 's2'), values(base, 's2'));
  assert.deepEqual(values(delayed, 's0'), values(base, 's0'));
  assert.deepEqual(values(delayed, 's1'), values(base, 's1'));
  assert.deepEqual(values(delayed, 's2').map(x => [x[0], x[2]]),
    values(base, 's2').map(x => [x[0], x[2]]));
  assert.equal(noSensors.incidences.length, 0);
  assert.equal(noSensors.summary.sampleCount, 0);
});

test('physical perturbations change predicted events without fabricating inputs', () => {
  const base = run('single-baseline-v1');
  const zeroGravity = run('zero-gravity-v1');
  const inelastic = run('inelastic-collision-v1');
  const lateRelease = run('delayed-release-v1');
  assert.equal(zeroGravity.manifest.environment.world.impactTimeMs, null);
  assert.ok(zeroGravity.incidences.every(x =>
    x.measurement === 0 || x.measurement === 1));
  assert.equal(inelastic.manifest.environment.world.parameters.restitution, 0);
  assert.equal(inelastic.manifest.environment.world.parameters.gravityMps2,
    base.manifest.environment.world.parameters.gravityMps2);
  assert.ok(inelastic.incidences.filter(x => x.transducerId === 's1').length <
    base.incidences.filter(x => x.transducerId === 's1').length);
  assert.ok(Math.abs(lateRelease.manifest.environment.world.impactTimeMs -
    base.manifest.environment.world.impactTimeMs - 100) < 1e-9);
  assert.deepEqual(lateRelease.manifest.transducers, base.manifest.transducers);
});

test('coincident readings preserve distinct physical provenance for researcher only', () => {
  const dualChecks = runScientificControl('dual-noninteracting-coincident-v1');
  assert.equal(dualChecks.physicalAudits.length, 2);
  assert.ok(dualChecks.physicalAudits.every(a => a.passed));
  const simultaneous = dualChecks.result;
  const staggered = run('dual-noninteracting-staggered-v1');
  assert.equal(simultaneous.manifest.environment.physicalInteractionBetweenSources, false);
  assert.ok(Math.abs(simultaneous.manifest.environment.sources[0].world.impactTimeMs -
    simultaneous.manifest.environment.sources[1].world.impactTimeMs) < 1e-9);
  assert.notEqual(staggered.manifest.environment.sources[0].world.impactTimeMs,
    staggered.manifest.environment.sources[1].world.impactTimeMs);
  assert.equal(simultaneous.incidences.filter(i => i.measurement > 0).length, 2);
  const hits = simultaneous.incidences.filter(i => i.measurement > 0);
  assert.equal(hits[0].observedAtMs, hits[1].observedAtMs);
  assert.notEqual(hits[0].transducerId, hits[1].transducerId);
});

test('audit catches missing delivery, duplicate ID, backdating and illicit semantic label', () => {
  const good = run('single-baseline-v1');
  const clone = () => structuredClone(good);
  assert.equal(auditIncidenceTrace(good).passed, true);
  const missing = clone();
  missing.trace = missing.trace.filter(x => x.type !== 'incidence.delivered');
  assert.equal(auditIncidenceTrace(missing).passed, false);
  const duplicate = clone();
  duplicate.incidences[1].incidenceId = duplicate.incidences[0].incidenceId;
  assert.ok(auditIncidenceTrace(duplicate).failures.some(x => x.includes('duplicate')));
  const backdated = clone();
  backdated.incidences[0].arrivedAtMs = backdated.incidences[0].observedAtMs - 1;
  assert.equal(auditIncidenceTrace(backdated).passed, false);
  const leak = clone();
  leak.incidences[0].physicalCause = 'collision.impact';
  assert.ok(auditIncidenceTrace(leak).failures.some(x => x.includes('schema')));
  const altered = clone();
  altered.incidences[0].measurement = 999;
  assert.ok(auditIncidenceTrace(altered).failures.some(x => x.includes('trace')));
});

test('unknown and unversioned control IDs cannot be executed', () => {
  assert.throws(() => createScientificControl('single-baseline'), RangeError);
  assert.throws(() => runScientificControl('hacked-v1'), RangeError);
  assert.throws(() => createScientificControl('single-baseline-v1', { seed: -1 }),
    RangeError);
});


test('sample-to-incidence mutation is detected, even if delivery trace agrees', () => {
  const tampered = structuredClone(run('single-baseline-v1'));
  const incidence = tampered.incidences[0];
  const delivery = tampered.trace.find(x => x.type === 'incidence.delivered' &&
    x.incidenceId === incidence.incidenceId);
  incidence.measurement = 0.123456;
  delivery.measurement = 0.123456;
  const verdict = auditIncidenceTrace(tampered);
  assert.equal(verdict.passed, false);
  assert.ok(verdict.failures.some(x => x.includes('sample-to-incidence')));
});

test('diagnostic audit detects a motor dropping inputs despite valid transport', () => {
  const base = run('single-baseline-v1');
  const tampered = structuredClone(base);
  tampered.finalSnapshot.receivedCount -= 1;
  assert.equal(auditIncidenceTrace(tampered).passed, true);
  assert.equal(auditDiagnosticDelivery(tampered).passed, false);
  assert.ok(auditDiagnosticDelivery(tampered).failures
    .some(x => x.includes('receivedCount')));
});

test('diagnostic audit detects corrupted engine event history independently', () => {
  const tampered = structuredClone(run('single-baseline-v1'));
  const firstEngineEvent = tampered.trace.find(x =>
    x.type === 'engine.event' && x.detail?.type === 'input.received');
  firstEngineEvent.detail.transducerId = 'bogus';
  assert.equal(auditIncidenceTrace(tampered).passed, true);
  const verdict = auditDiagnosticDelivery(tampered);
  assert.equal(verdict.passed, false);
  assert.ok(verdict.failures.some(x => x.includes('ingest event')));
});


test('equal sampling periods but different PHASES can reverse an aliasing failure', () => {
  const aliased = run('upper-beam-aliasing-v1');
  const phased = run('upper-beam-phase-shift-v1');
  assert.deepEqual(aliased.manifest.environment.world,
    phased.manifest.environment.world);
  assert.equal(aliased.manifest.transducers.find(x => x.id === 's0').periodMs, 100);
  assert.equal(phased.manifest.transducers.find(x => x.id === 's0').periodMs, 100);
  assert.deepEqual(values(aliased, 's0').map(x => x[2]), [1]);
  assert.ok(values(phased, 's0').some(x => x[2] === 0));
  assert.deepEqual(values(aliased, 's1'), values(phased, 's1'));
  assert.deepEqual(values(aliased, 's2'), values(phased, 's2'));
});

test('independent seeded noise changes only its declared sensor readings', () => {
  const noNoise = run('single-baseline-v1');
  const noiseA = runScientificControl('upper-beam-noise-v1', { seed: 123 }).result;
  const noiseB = runScientificControl('upper-beam-noise-v1', { seed: 456 }).result;
  assert.notDeepEqual(values(noiseA, 's0'), values(noiseB, 's0'));
  assert.deepEqual(values(noiseA, 's1'), values(noNoise, 's1'));
  assert.deepEqual(values(noiseA, 's2'), values(noNoise, 's2'));
  assert.deepEqual(noiseA.manifest.environment.world,
    noNoise.manifest.environment.world);
});

test('quantizing measured mechanical impulse does not change the actual collision', () => {
  const baseline = run('single-baseline-v1');
  const coarse = run('mechanical-quantization-v1');
  assert.deepEqual(baseline.manifest.environment.world,
    coarse.manifest.environment.world);
  assert.deepEqual(values(baseline, 's0'), values(coarse, 's0'));
  assert.deepEqual(values(baseline, 's1'), values(coarse, 's1'));
  const physicalReading = values(baseline, 's2').find(x => x[2] > 0)[2];
  const roundedReading = values(coarse, 's2').find(x => x[2] > 0)[2];
  assert.equal(roundedReading, Math.round(physicalReading / 0.5) * 0.5);
  assert.notEqual(physicalReading, roundedReading);
});
