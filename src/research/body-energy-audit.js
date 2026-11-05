// Independent researcher-only audits for a physically prescribed lift.
// These verify bounded energy identities and work using numerical
// power integration; no measurements or truth are passed to the engine.

const relativeNear = (a, b, tolerance) =>
  Number.isFinite(a) && Number.isFinite(b) &&
  Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));

export function auditBodyEnergy(world, {
  powerStepMs = 1, tolerance = 0.0001,
} = {}) {
  if (!world || typeof world.bodyStateAt !== 'function') {
    throw new TypeError('Body energy audit requires a physical body');
  }
  if (!Number.isFinite(powerStepMs) || powerStepMs <= 0 ||
      powerStepMs > 100 ||
      !Number.isFinite(tolerance) || tolerance <= 0 ||
      tolerance > 0.01) {
    throw new RangeError('Invalid audit time step or tolerance');
  }
  const description = world.describe();
  const p = description.bodyParameters;
  if (!p) throw new TypeError('Body parameters missing');
  const t0 = p.startAtMs, t1 = t0 + p.liftDurationMs;
  const before = world.bodyStateAt(0);
  const atStart = world.bodyStateAt(t0);
  const after = world.bodyStateAt(t1);
  const errors = [];
  let checkCount = 0;
  const check = (name, a, b) => {
    checkCount++;
    if (!relativeNear(a, b, tolerance)) {
      errors.push({ name, measured: a, reference: b });
    }
  };
  check('initial capacitor energy', before.capacitorEnergyJ,
    p.initialCapacitorEnergyJ);
  check('initial temperature', before.internalTemperatureK,
    p.initialTemperatureK);
  check('initial joint extension', before.jointExtensionM, 0);
  check('final joint extension', after.jointExtensionM, p.liftHeightM);
  check('final joint velocity', after.jointVelocityMps, 0);
  check('final mechanical work', after.mechanicalWorkJ,
    p.massKg * p.gravityMps2 * p.liftHeightM);
  check('energy conservation: capacitor to work plus heat',
    before.capacitorEnergyJ - after.capacitorEnergyJ,
    after.mechanicalWorkJ + after.heatGeneratedJ);
  check('electrical work and efficiency',
    before.capacitorEnergyJ - after.capacitorEnergyJ,
    after.mechanicalWorkJ / p.motorEfficiency);
  check('thermal capacity',
    (after.internalTemperatureK - before.internalTemperatureK) *
      p.thermalCapacityJPerK,
    after.heatGeneratedJ);
  check('capacitor voltage and stored energy',
    0.5 * p.capacitanceF * after.capacitorVoltageV ** 2,
    after.capacitorEnergyJ);
  check('motor current goes to zero when released',
    after.motorCurrentA, 0);

  // Independent numerical integration of P(t)=F(t)*v(t). The integrator
  // does not use the world's work state when accumulating mechanical work.
  const segments = Math.ceil(p.liftDurationMs / powerStepMs);
  const dtSeconds = p.liftDurationMs / segments / 1000;
  let integratedMechanicalWork = 0, integratedElectricalWork = 0;
  for (let k = 0; k < segments; k++) {
    const midpointMs = t0 + (k + 0.5) * p.liftDurationMs / segments;
    const state = world.bodyStateAt(midpointMs);
    const worldState = world.stateAt(midpointMs);
    integratedMechanicalWork +=
      worldState.supportForceN * worldState.verticalVelocityMps * dtSeconds;
    integratedElectricalWork += state.electricalPowerW * dtSeconds;
    checkCount++;
    if (state.motorCurrentA < -tolerance ||
        state.motorMechanicalPowerW < -tolerance ||
        state.capacitorEnergyJ > p.initialCapacitorEnergyJ + tolerance) {
      errors.push({ name: 'nonphysical power or energy during lift',
        timeMs: midpointMs });
    }
  }
  check('independent F.dx integral', integratedMechanicalWork,
    after.mechanicalWorkJ);
  check('independent electrical power integral', integratedElectricalWork,
    before.capacitorEnergyJ - after.capacitorEnergyJ);

  return Object.freeze({
    passed: errors.length === 0,
    checks: checkCount, powerStepMs, tolerance,
    integratedMechanicalWorkJ: integratedMechanicalWork,
    integratedElectricalWorkJ: integratedElectricalWork,
    failures: Object.freeze(errors),
  });
}