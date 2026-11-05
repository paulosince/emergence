// A SINGLE spherical rigid body over an immobile horizontal plane.
// Analytic vertical dynamics in SI units; no external sensory outputs.
// Valid only until the SECOND collision if the first causes a rebound.

export const VERTICAL_IMPACT_MODEL = 'analytic-vertical-sphere-plane';
export const VERTICAL_IMPACT_VERSION = '0.1.0';

function finiteInRange(name, value, min, max) {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(name + ' must be finite and in [' + min + ', ' + max + ']');
  }
  return value;
}

export function createVerticalImpactWorld(options = {}) {
  const {
    clearanceM = 1,
    initialVelocityMps = 0,
    gravityMps2 = 9.81,
    massKg = 1,
    radiusM = 0.05,
    restitution = 0.5,
  } = options;

  // These are numerical domain limits, not statements of physical generality.
  finiteInRange('clearanceM', clearanceM, 0, 1e6);
  finiteInRange('initialVelocityMps', initialVelocityMps, -1e4, 1e4);
  finiteInRange('gravityMps2', gravityMps2, 0, 1e4);
  finiteInRange('massKg', massKg, 1e-9, 1e6);
  finiteInRange('radiusM', radiusM, 1e-6, 1e4);
  finiteInRange('restitution', restitution, 0, 1);

  const parameters = Object.freeze({
    clearanceM, initialVelocityMps, gravityMps2, massKg, radiusM, restitution,
  });

  // Height above the contact plane is CLEARANCE of the sphere, not its center.
  // For a body already resting at the plane there is no collision impulse.
  const initiallyResting = clearanceM === 0 && initialVelocityMps === 0;
  let impactSeconds = Infinity;
  if (!initiallyResting) {
    if (clearanceM === 0 && initialVelocityMps < 0) {
      impactSeconds = 0;
    } else if (gravityMps2 === 0) {
      if (initialVelocityMps < 0) {
        impactSeconds = clearanceM / -initialVelocityMps;
      }
    } else {
      const discriminant = initialVelocityMps ** 2 + 2 * gravityMps2 * clearanceM;
      const root = Math.sqrt(discriminant);
      // Stable form for downward initial velocity avoids cancellation.
      impactSeconds = initialVelocityMps < 0
        ? (2 * clearanceM) / (root - initialVelocityMps)
        : (initialVelocityMps + root) / gravityMps2;
    }
  }
  const impactTimeMs = impactSeconds * 1000;
  const beforeVelocity = Number.isFinite(impactSeconds)
    ? initialVelocityMps - gravityMps2 * impactSeconds : null;
  const afterVelocity = beforeVelocity === null ? null : -restitution * beforeVelocity;
  const impact = beforeVelocity === null ? null : Object.freeze({
    type: 'collision.impact',
    eventId: 'world-impact-1', // Research bookkeeping, never exposed to a learning engine.
    timeMs: impactTimeMs,
    verticalVelocityBeforeMps: beforeVelocity,
    verticalVelocityAfterMps: afterVelocity,
    normalImpulseNs: massKg * (afterVelocity - beforeVelocity),
    kineticEnergyLossJ: 0.5 * massKg *
      (beforeVelocity ** 2 - afterVelocity ** 2),
  });
  const initialContact = initiallyResting ? Object.freeze({
    type: 'contact.initial',
    eventId: 'world-contact-initial',
    timeMs: 0,
    normalForceN: massKg * gravityMps2,
  }) : null;

  // A second impact is OUTSIDE this model. Never let the simulated sphere
  // silently pass through the floor. The next release may extend dynamics.
  const secondImpactTimeMs = impact && afterVelocity > 0 && gravityMps2 > 0
    ? impactTimeMs + 2000 * afterVelocity / gravityMps2 : Infinity;

  function assertTime(tMs) {
    if (!Number.isFinite(tMs) || tMs < 0 || tMs > 1e12) {
      throw new RangeError('timeMs must be finite, nonnegative and <= 1e12');
    }
    if (tMs >= secondImpactTimeMs) {
      throw new RangeError(
        'Outside the one-impact model: second contact would occur at ' +
        secondImpactTimeMs + ' ms'
      );
    }
  }

  function stateAt(timeMs) {
    assertTime(timeMs);
    const t = timeMs / 1000;
    let clearance, velocity, acceleration, normalForce, phase;

    if (initiallyResting) {
      phase = 'rest';
      clearance = 0; velocity = 0; acceleration = 0;
      normalForce = massKg * gravityMps2;
    } else if (!impact || timeMs < impactTimeMs) {
      phase = 'flight-before-impact';
      clearance = clearanceM + initialVelocityMps * t - 0.5 * gravityMps2 * t * t;
      velocity = initialVelocityMps - gravityMps2 * t;
      acceleration = -gravityMps2;
      normalForce = 0;
    } else if (afterVelocity === 0) {
      phase = 'rest';
      clearance = 0; velocity = 0; acceleration = 0;
      normalForce = massKg * gravityMps2;
    } else {
      phase = 'flight-after-impact';
      const dt = t - impactSeconds;
      clearance = afterVelocity * dt - 0.5 * gravityMps2 * dt * dt;
      velocity = afterVelocity - gravityMps2 * dt;
      acceleration = -gravityMps2;
      normalForce = 0;
    }

    // Roundoff near a contact must not become penetration; reject material errors.
    const roundoffM = 1e-10 * Math.max(1, clearanceM, radiusM);
    if (clearance < -roundoffM || !Number.isFinite(clearance) ||
        !Number.isFinite(velocity)) {
      throw new RangeError('Computed state violates nonpenetration or finiteness');
    }
    clearance = Math.max(0, clearance);
    return Object.freeze({
      timeMs,
      phase,
      clearanceM: clearance,
      centerHeightM: clearance + radiusM,
      verticalVelocityMps: velocity,
      verticalAccelerationMps2: acceleration,
      normalForceN: normalForce,
      kineticEnergyJ: 0.5 * massKg * velocity * velocity,
      potentialEnergyJ: massKg * gravityMps2 * clearance,
    });
  }

  function eventsThrough(timeMs) {
    assertTime(timeMs);
    return Object.freeze([
      ...(initialContact && timeMs >= 0 ? [initialContact] : []),
      ...(impact && impact.timeMs <= timeMs ? [impact] : []),
    ]);
  }

  function describe() {
    return Object.freeze({
      modelId: VERTICAL_IMPACT_MODEL,
      modelVersion: VERTICAL_IMPACT_VERSION,
      coordinate: 'upwards-positive',
      geometry: 'rigid-sphere-over-fixed-plane',
      timeUnit: 'ms', positionUnit: 'm', velocityUnit: 'm/s',
      accelerationUnit: 'm/s2', massUnit: 'kg',
      parameters,
      impactTimeMs: impact?.timeMs ?? null,
      secondImpactTimeMs: Number.isFinite(secondImpactTimeMs)
        ? secondImpactTimeMs : null,
      validity: 'at most one impact; reject timestamps at or after second impact',
    });
  }

  return Object.freeze({ describe, stateAt, eventsThrough });
}