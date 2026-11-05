import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createReleaseControlledWorld } from '../src/world/release-control.js';
import { createDropV1 } from '../src/world/scenarios.js';
import { integrateFirstContact, auditFirstImpact } from '../src/research/numeric-fall-oracle.js';

test('numerical reference converges towards a separately calculated ideal first contact', () => {
  const expectedMs = Math.sqrt(2 / 9.81) * 1000;
  const coarse = integrateFirstContact({ clearanceM: 1, gravityMps2: 9.81, stepMs: 50 });
  const fine = integrateFirstContact({ clearanceM: 1, gravityMps2: 9.81, stepMs: 1 });
  assert.ok(Math.abs(coarse - expectedMs) < 2, 'coarse reference did not converge');
  assert.ok(Math.abs(fine - expectedMs) < 0.01, 'fine reference disagrees');
  assert.ok(Math.abs(fine - expectedMs) < Math.abs(coarse - expectedMs));
});

test('numerical independent reference accepts canonical world', () => {
  const result = auditFirstImpact(createDropV1(), { stepMs: 1, toleranceMs: 0.01 });
  assert.equal(result.passed, true, JSON.stringify(result.failures));
  assert.ok(Math.abs(result.predictedImpactMs - 451.524) < 0.01);
  assert.equal(result.detectedEvents, 1);
});

test('independent reference catches a falsified first-impact timestamp', () => {
  const genuine = createDropV1();
  const broken = {
    describe: () => ({ ...genuine.describe(),
      impactTimeMs: genuine.describe().impactTimeMs + 25 }),
    eventsThrough: t => genuine.eventsThrough(t),
    stateAt: t => genuine.stateAt(t),
  };
  const verdict = auditFirstImpact(broken, { stepMs: 1, toleranceMs: 0.01 });
  assert.equal(verdict.passed, false);
  assert.ok(verdict.failures.some(s => s.includes('disagrees')));
});

test('independent reference catches an event shifted while the manifest remains correct', () => {
  const genuine = createDropV1();
  const broken = {
    describe: () => genuine.describe(),
    stateAt: t => genuine.stateAt(t),
    eventsThrough: t => genuine.eventsThrough(t).map(event =>
      event.type === 'collision.impact'
        ? { ...event, timeMs: event.timeMs + 25 } : event),
  };
  const verdict = auditFirstImpact(broken, { stepMs: 1, toleranceMs: 0.01 });
  assert.equal(verdict.passed, false);
  assert.ok(verdict.failures.some(s => s.includes('collision event')));
});

test('zero gravity, initial contact and upward launch have explicit numerical behavior', () => {
  assert.equal(integrateFirstContact({
    clearanceM: 1, initialVelocityMps: 0, gravityMps2: 0,
  }), null);
  assert.equal(integrateFirstContact({
    clearanceM: 0, initialVelocityMps: 0, gravityMps2: 9.81,
  }), null);
  assert.equal(integrateFirstContact({
    clearanceM: 0, initialVelocityMps: -3, gravityMps2: 0,
  }), 0);
  assert.ok(Math.abs(integrateFirstContact({
    clearanceM: 0, initialVelocityMps: 3, gravityMps2: 10, stepMs: 1,
  }) - 600) < 0.01);
});

test('independent numerical reference handles delayed intervention', () => {
  const world = createReleaseControlledWorld({ clearanceM: 1,
    releaseAtMs: 175, restitution: 0 });
  const result = auditFirstImpact(world, { stepMs: 1, toleranceMs: 0.01 });
  assert.equal(result.passed, true, JSON.stringify(result.failures));
  assert.ok(result.predictedImpactMs > 600);
});

test('no-impact configuration passes without inventing a collision', () => {
  const world = createReleaseControlledWorld({ clearanceM: 1,
    gravityMps2: 0, restitution: 0 });
  const verdict = auditFirstImpact(world);
  assert.equal(verdict.passed, true, JSON.stringify(verdict.failures));
  assert.equal(verdict.predictedImpactMs, null);
  assert.equal(verdict.detectedEvents, 0);
});

test('numerical audits reject unbounded and invalid integration', () => {
  assert.throws(() => integrateFirstContact({
    clearanceM: -1, gravityMps2: 9.81,
  }), RangeError);
  assert.throws(() => integrateFirstContact({
    clearanceM: 1, gravityMps2: 9.81, stepMs: 0,
  }), RangeError);
  assert.throws(() => integrateFirstContact({
    clearanceM: 1, gravityMps2: 9.81, stepMs: 1, maxSteps: 5,
  }), /horizon/);
  assert.throws(() => auditFirstImpact(createDropV1(), {
    toleranceMs: -1,
  }), RangeError);
});
