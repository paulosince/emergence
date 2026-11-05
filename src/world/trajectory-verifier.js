// Independent PHYSICAL INVARIANTS: verify the model without reusing its
// position-versus-time equation or collision-time root finder.
// The verifier is a research/evaluation tool, never an input to the engine.
import { assertPhysicalWorld } from './world-contract.js';

function relativeMatch(a, b, tolerance) {
  return Number.isFinite(a) && Number.isFinite(b) &&
    Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));
}

export function verifyVerticalTrajectory(world, sampleTimesMs, { tolerance = 1e-9 } = {}) {
  assertPhysicalWorld(world);
  if (!Array.isArray(sampleTimesMs) || sampleTimesMs.length < 2 ||
      sampleTimesMs.some((x, i) => !Number.isFinite(x) || x < 0 ||
        (i > 0 && x <= sampleTimesMs[i - 1]))) {
    throw new TypeError('Provide >=2 strictly increasing, finite sample times');
  }
  if (!Number.isFinite(tolerance) || tolerance <= 0 || tolerance >= 0.01) {
    throw new RangeError('Tolerance must be finite, positive and less than 0.01');
  }

  const descriptor = world.describe();
  if (descriptor.modelId !== 'analytic-vertical-sphere-plane') {
    throw new TypeError('Verifier requires the vertical sphere/plane contract');
  }
  const p = descriptor.parameters;
  const errors = [];
  let count = 0;
  const check = (name, actual, expected, timeMs) => {
    count++;
    if (!relativeMatch(actual, expected, tolerance)) {
      errors.push({ name, timeMs, actual, expected });
    }
  };
  const initialEnergy = 0.5 * p.massKg * p.initialVelocityMps ** 2 +
    p.massKg * p.gravityMps2 * p.clearanceM;

  for (const timeMs of sampleTimesMs) {
    const state = world.stateAt(timeMs);
    check('time', state.timeMs, timeMs, timeMs);
    check('center clearance geometry', state.centerHeightM,
      state.clearanceM + p.radiusM, timeMs);
    check('kinetic energy', state.kineticEnergyJ,
      0.5 * p.massKg * state.verticalVelocityMps ** 2, timeMs);
    check('potential energy', state.potentialEnergyJ,
      p.massKg * p.gravityMps2 * state.clearanceM, timeMs);

    if (state.clearanceM < 0) {
      errors.push({ name: 'nonpenetration', timeMs, actual: state.clearanceM,
        expected: 'nonnegative' });
    }
    if (state.phase === 'held') {
      check('held velocity', state.verticalVelocityMps, 0, timeMs);
      check('held acceleration', state.verticalAccelerationMps2, 0, timeMs);
      check('held normal force', state.normalForceN, 0, timeMs);
      check('holding constraint', state.supportForceN,
        p.massKg * p.gravityMps2, timeMs);
      check('held potential energy', state.potentialEnergyJ,
        p.massKg * p.gravityMps2 * p.clearanceM, timeMs);
    } else if (state.phase === 'rest') {
      check('rest clearance', state.clearanceM, 0, timeMs);
      check('rest velocity', state.verticalVelocityMps, 0, timeMs);
      check('support normal', state.normalForceN,
        p.massKg * p.gravityMps2, timeMs);
      check('rest net acceleration', state.verticalAccelerationMps2, 0, timeMs);
    } else if (state.phase === 'flight-before-impact' ||
               state.phase === 'flight-after-impact') {
      check('flight acceleration', state.verticalAccelerationMps2,
        -p.gravityMps2, timeMs);
      check('flight normal force', state.normalForceN, 0, timeMs);
      const collision = world.eventsThrough(timeMs)
        .find(event => event.type === 'collision.impact');
      const referenceEnergy = state.phase === 'flight-before-impact'
        ? initialEnergy
        : 0.5 * p.massKg *
          (p.restitution * collision.verticalVelocityBeforeMps) ** 2;
      check('piecewise mechanical energy',
        state.kineticEnergyJ + state.potentialEnergyJ,
        referenceEnergy, timeMs);
    } else {
      errors.push({ name: 'unknown physical phase', timeMs,
        actual: state.phase, expected: 'flight-before/after-impact or rest' });
    }
  }
  // Independent consequence of acceleration: delta-v = -g * delta-t.
  for (let i = 1; i < sampleTimesMs.length; i++) {
    const a = world.stateAt(sampleTimesMs[i - 1]);
    const b = world.stateAt(sampleTimesMs[i]);
    if (a.phase === b.phase && a.phase.startsWith('flight-')) {
      check('velocity change across samples',
        b.verticalVelocityMps - a.verticalVelocityMps,
        -p.gravityMps2 * (b.timeMs - a.timeMs) / 1000,
        b.timeMs);
    }
  }

  const events = world.eventsThrough(sampleTimesMs.at(-1));
  for (const event of events) {
    if (event.type !== 'collision.impact') continue;
    check('impulse momentum balance', event.normalImpulseNs,
      p.massKg * (event.verticalVelocityAfterMps -
        event.verticalVelocityBeforeMps), event.timeMs);
    check('restitution rule', event.verticalVelocityAfterMps,
      -p.restitution * event.verticalVelocityBeforeMps,
      event.timeMs);
    check('impact kinetic loss', event.kineticEnergyLossJ,
      0.5 * p.massKg * (event.verticalVelocityBeforeMps ** 2 -
        event.verticalVelocityAfterMps ** 2), event.timeMs);
    if (event.kineticEnergyLossJ < -tolerance) {
      errors.push({ name: 'nonnegative impact energy loss',
        timeMs: event.timeMs, actual: event.kineticEnergyLossJ,
        expected: 'nonnegative' });
    }
  }
  return Object.freeze({ passed: errors.length === 0, checks: count,
    failures: Object.freeze(errors) });
}