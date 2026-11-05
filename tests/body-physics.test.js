import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createActuatedWorld } from '../src/body/actuated-world.js';
import { auditBodyEnergy } from '../src/research/body-energy-audit.js';
import { auditFirstImpact } from '../src/research/numeric-fall-oracle.js';

const almost = (a, b, tol = 1e-9) => assert.ok(
  Math.abs(a - b) <= tol,
  'Expected ' + a + ' approximately equal ' + b,
);

test('actual action raises the sphere continuously and releases with zero velocity', () => {
  const w = createActuatedWorld();
  const p = w.describe().bodyParameters;
  assert.equal(p.startAtMs, 100);
  assert.equal(p.liftDurationMs, 800);
  assert.equal(w.stateAt(50).phase, 'held');
  assert.equal(w.stateAt(50).clearanceM, 1);
  assert.equal(w.stateAt(100).phase, 'actuated-lift');
  almost(w.stateAt(500).clearanceM, 1.1);
  almost(w.stateAt(500).verticalVelocityMps, 0.375);
  assert.ok(w.stateAt(500).verticalAccelerationMps2 < 1e-10);
  assert.equal(w.eventsThrough(99).length, 0);
  assert.deepEqual(w.eventsThrough(100).map(x => x.type),
    ['intervention.motor-command']);
  almost(w.stateAt(900).clearanceM, 1.2);
  almost(w.stateAt(900).verticalVelocityMps, 0);
  assert.deepEqual(w.eventsThrough(900).map(x => x.type),
    ['intervention.motor-command', 'intervention.release']);
  assert.equal(w.eventsThrough(900)[0].imposedBy, 'experimenter');
  const impact = w.describe().impactTimeMs;
  almost(impact, 900 + 1000 * Math.sqrt(2 * 1.2 / 9.81), 1e-8);
  assert.deepEqual(w.eventsThrough(impact).map(x => x.type),
    ['intervention.motor-command', 'intervention.release', 'collision.impact']);
  assert.equal(w.describe().intervention.autonomouslyInitiated, false);
});

test('mechanical work, capacitor discharge and heat are causally coupled', () => {
  const w = createActuatedWorld();
  const early = w.bodyStateAt(50);
  const midpoint = w.bodyStateAt(500);
  const end = w.bodyStateAt(900);
  const late = w.bodyStateAt(1600);
  assert.equal(early.capacitorEnergyJ, 100);
  assert.equal(early.internalTemperatureK, 295);
  assert.ok(midpoint.motorForceN > 0);
  assert.ok(midpoint.motorCurrentA > 0);
  assert.ok(midpoint.mechanicalWorkJ > 0);
  almost(end.mechanicalWorkJ, 1 * 9.81 * 0.2);
  almost(end.electricalEnergyUsedJ, (9.81 * 0.2) / 0.8);
  almost(end.heatGeneratedJ, (9.81 * 0.2) * (1 / 0.8 - 1));
  almost(end.capacitorEnergyJ + end.electricalEnergyUsedJ, 100);
  almost(end.internalTemperatureK,
    295 + end.heatGeneratedJ / 20);
  almost(0.5 * 2 * end.capacitorVoltageV ** 2, end.capacitorEnergyJ);
  assert.equal(late.motorCurrentA, 0);
  assert.equal(late.capacitorEnergyJ, end.capacitorEnergyJ);
  assert.equal(late.internalTemperatureK, end.internalTemperatureK);
});

test('independent power integral and independent numerical impact audit pass', () => {
  const w = createActuatedWorld();
  const energy = auditBodyEnergy(w);
  const collision = auditFirstImpact(w, { stepMs: 1, toleranceMs: 0.01 });
  assert.equal(energy.passed, true, JSON.stringify(energy.failures));
  assert.equal(collision.passed, true, JSON.stringify(collision.failures));
  assert.ok(energy.checks >= 800);
  almost(energy.integratedMechanicalWorkJ, 1.962, 0.0001);
});

test('physical actuator never needs negative support force in its valid domain', () => {
  const w = createActuatedWorld();
  for (let t = 100; t < 900; t += 1) {
    const physical = w.stateAt(t);
    const body = w.bodyStateAt(t);
    assert.ok(physical.supportForceN >= 0);
    assert.ok(body.motorMechanicalPowerW >= 0);
    assert.ok(body.motorCurrentA >= 0);
  }
});

test('without lifting, energy and heat stay constant and collision occurs sooner', () => {
  const active = createActuatedWorld();
  const passive = createActuatedWorld({ liftHeightM: 0 });
  almost(passive.bodyStateAt(500).jointExtensionM, 0);
  almost(passive.bodyStateAt(900).capacitorEnergyJ, 100);
  almost(passive.bodyStateAt(900).internalTemperatureK, 295);
  almost(passive.bodyStateAt(900).motorCurrentA, 0);
  assert.ok(passive.describe().impactTimeMs < active.describe().impactTimeMs);
  assert.equal(auditBodyEnergy(passive).passed, true);
  assert.equal(auditFirstImpact(passive).passed, true);
});

test('later experimental command shifts release and impact while preserving energy', () => {
  const early = createActuatedWorld();
  const later = createActuatedWorld({ startAtMs: 300 });
  almost(later.describe().impactTimeMs - early.describe().impactTimeMs, 200);
  almost(later.bodyStateAt(1100).capacitorEnergyJ,
    early.bodyStateAt(900).capacitorEnergyJ);
  assert.equal(later.stateAt(250).phase, 'held');
  assert.equal(auditBodyEnergy(later).passed, true);
  assert.equal(auditFirstImpact(later).passed, true);
});

test('insufficient energy, impossible force and invalid bodies fail before execution', () => {
  for (const args of [
    { initialCapacitorEnergyJ: 1 },
    { motorEfficiency: 0 },
    { capacitanceF: 0 },
    { liftHeightM: -0.1 },
    { gravityMps2: -1 },
    { massKg: 0 },
    { thermalCapacityJPerK: 0 },
    { initialTemperatureK: -1 },
    { liftHeightM: 2, liftDurationMs: 100 },
  ]) assert.throws(() => createActuatedWorld(args), RangeError);
  const w = createActuatedWorld();
  assert.throws(() => w.stateAt(1900), /one-impact/);
  assert.throws(() => w.bodyStateAt(Infinity), RangeError);
});

test('body energy auditor rejects an adulterated capacitor state', () => {
  const real = createActuatedWorld();
  const broken = {
    ...real,
    bodyStateAt: t => t >= 900
      ? { ...real.bodyStateAt(t),
        capacitorEnergyJ: real.bodyStateAt(t).capacitorEnergyJ + 3 }
      : real.bodyStateAt(t),
  };
  const report = auditBodyEnergy(broken);
  assert.equal(report.passed, false);
  assert.ok(report.failures.some(f =>
    f.name.includes('energy conservation') ||
    f.name.includes('capacitor voltage')));
});

test('body energy auditor detects corrupted actuator support force', () => {
  const real = createActuatedWorld();
  const broken = {
    ...real,
    stateAt: t => t > 100 && t < 900
      ? { ...real.stateAt(t), supportForceN: 0 }
      : real.stateAt(t),
  };
  const report = auditBodyEnergy(broken);
  assert.equal(report.passed, false);
  assert.ok(report.failures.some(f => f.name === 'independent F.dx integral'));
});
