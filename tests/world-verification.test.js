import { test } from 'node:test';
import { createReleaseControlledWorld } from '../src/world/release-control.js';
import assert from 'node:assert/strict';
import { createVerticalImpactWorld } from '../src/world/vertical-impact.js';
import { verifyVerticalTrajectory } from '../src/world/trajectory-verifier.js';
import { createDropV1, DROP_V1, researchSampleTimes } from '../src/world/scenarios.js';

test('independent energy/momentum/acceleration checks accept reference scenario', () => {
  const world = createDropV1();
  const samples = researchSampleTimes(world, {
    horizonMs: DROP_V1.horizonMs, stepMs: DROP_V1.sampleStepMs,
  });
  const result = verifyVerticalTrajectory(world, samples);
  assert.equal(result.passed, true, JSON.stringify(result.failures));
  assert.ok(result.checks >= 70);
  assert.ok(samples.includes(world.describe().impactTimeMs));
});

test('fault injection: constant positional offset is detected', () => {
  const actual = createDropV1();
  const faulty = {
    describe: () => actual.describe(),
    eventsThrough: t => actual.eventsThrough(t),
    stateAt: t => ({ ...actual.stateAt(t), clearanceM: actual.stateAt(t).clearanceM + 0.2 }),
  };
  const result = verifyVerticalTrajectory(faulty, [0, 100, 200, 300]);
  assert.equal(result.passed, false);
  assert.ok(result.failures.some(f => f.name === 'center clearance geometry'));
});

test('fault injection: erroneous velocity is detected by energy and time invariants', () => {
  const actual = createDropV1();
  const faulty = {
    describe: () => actual.describe(),
    eventsThrough: t => actual.eventsThrough(t),
    stateAt: t => ({ ...actual.stateAt(t),
      verticalVelocityMps: actual.stateAt(t).verticalVelocityMps + t / 1000 }),
  };
  const result = verifyVerticalTrajectory(faulty, [0, 100, 200, 300]);
  assert.equal(result.passed, false);
  assert.ok(result.failures.some(f => f.name === 'kinetic energy'));
  assert.ok(result.failures.some(f => f.name === 'velocity change across samples'));
});

test('fault injection: wrong impulse is detected independently', () => {
  const actual = createDropV1();
  const faulty = {
    describe: () => actual.describe(),
    stateAt: t => actual.stateAt(t),
    eventsThrough: t => actual.eventsThrough(t).map(event => event.type === 'collision.impact'
      ? { ...event, normalImpulseNs: 0 }
      : event),
  };
  const result = verifyVerticalTrajectory(faulty,
    [0, 200, actual.describe().impactTimeMs, 600, 800]);
  assert.equal(result.passed, false);
  assert.ok(result.failures.some(f => f.name === 'impulse momentum balance'));
});

test('freefall trajectory obeys energy conservation for varying initial speed', () => {
  for (const [clearanceM, velocity, gravity] of [
    [2, 0, 9.81], [4, 3, 3], [1, -2, 9.81], [0, 3, 10], [1, 0, 0],
  ]) {
    const w = createVerticalImpactWorld({
      clearanceM, initialVelocityMps: velocity,
      gravityMps2: gravity, restitution: 0,
    });
    const impact = w.describe().impactTimeMs;
    const until = impact === null ? 1000 : Math.min(1000, impact);
    const samples = [0, until / 4, until / 2, until * 0.75, until];
    const testResult = verifyVerticalTrajectory(w, samples);
    assert.equal(testResult.passed, true, JSON.stringify({
      clearanceM, velocity, gravity, failures: testResult.failures,
    }));
  }
});

test('verification parameters and sample ordering are validated', () => {
  const w = createDropV1();
  assert.throws(() => verifyVerticalTrajectory(w, [0, 0]));
  assert.throws(() => verifyVerticalTrajectory(w, [0, 100], { tolerance: 0 }));
  assert.throws(() => verifyVerticalTrajectory(w, [0, 100], { tolerance: 1 }));
});

test('release is an operational experimental intervention, independent of representation', () => {
  const world = createReleaseControlledWorld({
    clearanceM: 1, massKg: 2, gravityMps2: 9.81,
    restitution: 0, releaseAtMs: 120,
  });
  assert.equal(world.stateAt(119).phase, 'held');
  assert.equal(world.stateAt(119).clearanceM, 1);
  assert.equal(world.stateAt(119).supportForceN, 19.62);
  assert.equal(world.stateAt(120).phase, 'flight-before-impact');
  assert.equal(world.stateAt(120).supportForceN, 0);
  assert.deepEqual(world.eventsThrough(119), []);
  assert.equal(world.eventsThrough(120)[0].type, 'intervention.release');
  assert.equal(world.eventsThrough(120)[0].imposedBy, 'experimenter');
  const impactMs = 120 + 1000 * Math.sqrt(2 / 9.81);
  assert.ok(Math.abs(world.describe().impactTimeMs - impactMs) < 1e-8);
  assert.deepEqual(world.eventsThrough(impactMs).map(e => e.type),
    ['intervention.release', 'collision.impact']);
  const times = [0, 119, 120, 180, 320, impactMs, impactMs + 200];
  const verification = verifyVerticalTrajectory(world, times);
  assert.equal(verification.passed, true, JSON.stringify(verification.failures));
});

test('intervention rejects initial impulse disguised as release', () => {
  assert.throws(() => createReleaseControlledWorld({
    releaseAtMs: 20, initialVelocityMps: 2,
  }), /zero initial velocity/);
});
