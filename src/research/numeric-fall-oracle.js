// Independent, researcher-only numerical approximation of the first impact.
// Unlike src/world/vertical-impact.js this integrates in finite time increments.
// It deliberately does NOT solve the quadratic for the first-contact time.
// Suitable only for constant-acceleration single-body 1D mechanics.

export function integrateFirstContact({
  clearanceM, initialVelocityMps = 0, gravityMps2,
  stepMs = 2, maxSteps = 1000000,
}) {
  for (const [key, x] of Object.entries({
    clearanceM, initialVelocityMps, gravityMps2,
  })) {
    if (!Number.isFinite(x) || (key !== 'initialVelocityMps' && x < 0)) {
      throw new RangeError('Invalid physical parameter: ' + key);
    }
  }
  if (!Number.isFinite(stepMs) || stepMs <= 0 || stepMs > 1000 ||
      !Number.isInteger(maxSteps) || maxSteps < 1 || maxSteps > 1000000) {
    throw new RangeError('Invalid integration step or limit');
  }

  if (clearanceM === 0 && initialVelocityMps < 0) return 0;
  if (clearanceM === 0 && initialVelocityMps === 0) return null;
  if (gravityMps2 === 0 && initialVelocityMps >= 0) return null;

  let timeS = 0, clearance = clearanceM, velocity = initialVelocityMps;
  const stepS = stepMs / 1000;
  // A time-stepping independent method: integrate velocity and position
  // using a midpoint-velocity update; locate the crossing by interpolation.
  // Its event-time estimate has discretization error and MUST be compared
  // with an explicit tolerance, never equality of floating-point values.
  for (let index = 0; index < maxSteps; index++) {
    const midpointVelocity = velocity - 0.5 * gravityMps2 * stepS;
    const nextHeight = clearance + midpointVelocity * stepS;
    if (nextHeight <= 0) {
      // First descending crossing of plane. Start-at-plane upward trajectories
      // are not treated as an initial impact.
      const fraction = clearance / (clearance - nextHeight);
      const eventTimeS = timeS + fraction * stepS;
      if (!Number.isFinite(eventTimeS) || eventTimeS < 0) {
        throw new RangeError('Numerical integration produced an invalid crossing');
      }
      return eventTimeS * 1000;
    }
    clearance = nextHeight;
    velocity -= gravityMps2 * stepS;
    timeS += stepS;
  }
  throw new RangeError('No contact before numerical integration horizon');
}

export function auditFirstImpact(world, {
  stepMs = 2, maxSteps = 1000000, toleranceMs = 0.05,
} = {}) {
  if (!Number.isFinite(toleranceMs) || toleranceMs <= 0 || toleranceMs > 10) {
    throw new RangeError('Invalid audit tolerance');
  }
  const description = world.describe();
  if (description.modelId !== 'analytic-vertical-sphere-plane') {
    throw new TypeError('This audit requires the bounded sphere/plane model');
  }
  const predictedRelativeMs = integrateFirstContact({
    ...description.parameters, stepMs, maxSteps,
  });
  const releaseAtMs = description.intervention?.releaseAtMs ?? 0;
  const predictedMs = predictedRelativeMs === null ? null
    : predictedRelativeMs + releaseAtMs;
  const reportedMs = description.impactTimeMs;
  const events = world.eventsThrough(Math.max(
    releaseAtMs,
    predictedMs === null ? releaseAtMs : predictedMs + toleranceMs * 2,
    reportedMs === null ? releaseAtMs : reportedMs + toleranceMs * 2,
  ));
  const actualImpacts = events.filter(event => event.type === 'collision.impact');
  const errors = [];
  if (predictedMs === null) {
    if (reportedMs !== null) errors.push('unexpected impact time in description');
    if (actualImpacts.length) errors.push('unexpected collision event');
  } else {
    if (reportedMs === null || !Number.isFinite(reportedMs) ||
        Math.abs(reportedMs - predictedMs) > toleranceMs) {
      errors.push('first impact disagrees with independent numerical integration');
    }
    if (actualImpacts.length !== 1 ||
        Math.abs(actualImpacts[0].timeMs - predictedMs) > toleranceMs) {
      errors.push('collision event disagrees with independently estimated time');
    }
  }
  return Object.freeze({
    passed: errors.length === 0,
    referenceMethod: 'finite-step-midpoint-integrator-plus-linear-event-interpolation',
    stepMs, toleranceMs, predictedImpactMs: predictedMs,
    reportedImpactMs: reportedMs, detectedEvents: actualImpacts.length,
    failures: Object.freeze(errors),
  });
}