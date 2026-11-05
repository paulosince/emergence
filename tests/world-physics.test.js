import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createVerticalImpactWorld } from '../src/world/vertical-impact.js';
import { assertPhysicalWorld } from '../src/world/world-contract.js';

const near = (a, b, tol = 1e-9) =>
  assert.ok(Math.abs(a - b) <= tol, 'Expected ' + a + ' ≈ ' + b);

test('world interface and deterministic read-only states', () => {
  const a = createVerticalImpactWorld();
  const b = createVerticalImpactWorld();
  assert.equal(assertPhysicalWorld(a), a);
  assert.deepEqual(a.describe(), b.describe());
  assert.deepEqual(a.stateAt(150), a.stateAt(150));
  assert.ok(Object.isFrozen(a.stateAt(0)));
  assert.throws(() => assertPhysicalWorld({ stateAt() {} }), /eventsThrough/);
});

test('analytic freefall: one metre at 9.81 m/s2, released from rest', () => {
  const world = createVerticalImpactWorld({ clearanceM: 1, restitution: 0.5 });
  near(world.stateAt(100).clearanceM, 1 - 0.5 * 9.81 * 0.1 ** 2);
  near(world.stateAt(100).verticalVelocityMps, -0.981);
  near(world.describe().impactTimeMs, 1000 * Math.sqrt(2 / 9.81), 1e-8);
  near(world.stateAt(0).centerHeightM, 1.05);
  assert.equal(world.eventsThrough(400).length, 0);
});

test('impact is determined by crossing, restitution and momentum (not a scheduled sound)', () => {
  const mass = 2, e = 0.25;
  const world = createVerticalImpactWorld({ massKg: mass, restitution: e });
  const tImpact = world.describe().impactTimeMs;
  const [impact] = world.eventsThrough(tImpact);
  assert.equal(impact.type, 'collision.impact');
  near(impact.verticalVelocityBeforeMps, -Math.sqrt(2 * 9.81));
  near(impact.verticalVelocityAfterMps,
    -e * impact.verticalVelocityBeforeMps);
  near(impact.normalImpulseNs,
    mass * (1 + e) * Math.sqrt(2 * 9.81));
  near(impact.kineticEnergyLossJ, (1 - e * e) * mass * 9.81);
  near(world.stateAt(tImpact).clearanceM, 0);
  assert.equal(world.stateAt(tImpact).phase, 'flight-after-impact');
});

test('model refuses times at or after unsupported SECOND collision', () => {
  const world = createVerticalImpactWorld({ clearanceM: 1, restitution: 0.5 });
  const second = world.describe().secondImpactTimeMs;
  near(second, 2 * world.describe().impactTimeMs);
  assert.ok(world.stateAt(second - 1).clearanceM >= 0);
  assert.throws(() => world.stateAt(second), /one-impact/);
  assert.throws(() => world.eventsThrough(second + 1), /one-impact/);
});

test('perfectly inelastic impact rests on the plane without penetration', () => {
  const world = createVerticalImpactWorld({
    clearanceM: 1, massKg: 2, restitution: 0,
  });
  const impactAt = world.describe().impactTimeMs;
  assert.equal(world.stateAt(impactAt + 10000).phase, 'rest');
  assert.equal(world.stateAt(impactAt + 10000).clearanceM, 0);
  near(world.stateAt(impactAt + 10000).normalForceN, 19.62);
  near(world.eventsThrough(impactAt)[0].kineticEnergyLossJ, 19.62);
});

test('body initially resting at the surface is a CONTACT, not an impact', () => {
  const world = createVerticalImpactWorld({ clearanceM: 0, initialVelocityMps: 0 });
  assert.equal(world.describe().impactTimeMs, null);
  assert.equal(world.stateAt(0).phase, 'rest');
  assert.equal(world.stateAt(2000).phase, 'rest');
  assert.deepEqual(world.eventsThrough(0).map(e => e.type), ['contact.initial']);
});

test('initial downward velocity at the plane causes immediate collision', () => {
  const world = createVerticalImpactWorld({
    clearanceM: 0, initialVelocityMps: -2, gravityMps2: 0, restitution: 1,
  });
  assert.equal(world.describe().impactTimeMs, 0);
  near(world.stateAt(0).verticalVelocityMps, 2);
  near(world.stateAt(1000).clearanceM, 2);
  assert.equal(world.describe().secondImpactTimeMs, null);
});

test('upward throw from plane lands later; gravity zero admits no landing', () => {
  const tossed = createVerticalImpactWorld({
    clearanceM: 0, initialVelocityMps: 5, gravityMps2: 10,
  });
  near(tossed.describe().impactTimeMs, 1000);
  near(tossed.stateAt(500).clearanceM, 1.25);
  const noGravity = createVerticalImpactWorld({
    clearanceM: 0, initialVelocityMps: 5, gravityMps2: 0,
  });
  assert.equal(noGravity.describe().impactTimeMs, null);
  near(noGravity.stateAt(1000).clearanceM, 5);
  const constantDown = createVerticalImpactWorld({
    clearanceM: 1, initialVelocityMps: -2, gravityMps2: 0,
  });
  near(constantDown.describe().impactTimeMs, 500);
});

test('short-time trajectories are stable for large downward speed', () => {
  const world = createVerticalImpactWorld({
    clearanceM: 1, initialVelocityMps: -10000,
    gravityMps2: 9.81, restitution: 0,
  });
  const t = world.describe().impactTimeMs;
  near(t, 0.1, 1e-6);
  assert.equal(world.stateAt(t).phase, 'rest');
});

test('physical and time input validation rejects invalid values', () => {
  for (const options of [
    { clearanceM: -1 }, { massKg: 0 }, { radiusM: 0 },
    { gravityMps2: -1 }, { restitution: 1.1 },
    { restitution: NaN }, { initialVelocityMps: Infinity },
    { clearanceM: 1e308 },
  ]) assert.throws(() => createVerticalImpactWorld(options), RangeError);
  const world = createVerticalImpactWorld();
  for (const t of [-1, NaN, Infinity]) {
    assert.throws(() => world.stateAt(t), RangeError);
    assert.throws(() => world.eventsThrough(t), RangeError);
  }
});