// External experimental intervention, not autonomous behavior.
// The object is held motionless by a constraint until the specified release time.
import { createVerticalImpactWorld } from './vertical-impact.js';

export function createReleaseControlledWorld({ releaseAtMs = 0, ...parameters } = {}) {
  if (!Number.isFinite(releaseAtMs) || releaseAtMs < 0 || releaseAtMs > 1e12) {
    throw new RangeError('releaseAtMs outside supported simulated time');
  }
  if (parameters.initialVelocityMps !== undefined && parameters.initialVelocityMps !== 0) {
    throw new RangeError('Release without impulse requires zero initial velocity');
  }
  const dynamics = createVerticalImpactWorld({ ...parameters, initialVelocityMps: 0 });
  const metadata = dynamics.describe(), p = metadata.parameters;
  const releaseEvent = Object.freeze({
    eventId: 'release-1', type: 'intervention.release',
    timeMs: releaseAtMs, imposedBy: 'experimenter',
  });

  function checkTime(timeMs) {
    if (!Number.isFinite(timeMs) || timeMs < 0 || timeMs > 1e12) {
      throw new RangeError('Invalid simulated time');
    }
  }
  function stateAt(timeMs) {
    checkTime(timeMs);
    if (timeMs < releaseAtMs) {
      return Object.freeze({
        timeMs, phase: 'held', clearanceM: p.clearanceM,
        centerHeightM: p.clearanceM + p.radiusM,
        verticalVelocityMps: 0, verticalAccelerationMps2: 0,
        normalForceN: 0, supportForceN: p.massKg * p.gravityMps2,
        kineticEnergyJ: 0, potentialEnergyJ: p.massKg * p.gravityMps2 * p.clearanceM,
      });
    }
    return Object.freeze({ ...dynamics.stateAt(timeMs - releaseAtMs),
      timeMs, supportForceN: 0 });
  }
  function eventsThrough(timeMs) {
    checkTime(timeMs);
    if (timeMs < releaseAtMs) return Object.freeze([]);
    return Object.freeze([
      releaseEvent,
      ...dynamics.eventsThrough(timeMs - releaseAtMs).map(event =>
        Object.freeze({ ...event, timeMs: event.timeMs + releaseAtMs })),
    ]);
  }
  function describe() {
    return Object.freeze({
      ...metadata,
      intervention: Object.freeze({
        type: 'experimenter-held-then-release',
        releaseAtMs, autonomouslyInitiated: false,
      }),
      impactTimeMs: metadata.impactTimeMs === null
        ? null : metadata.impactTimeMs + releaseAtMs,
      secondImpactTimeMs: metadata.secondImpactTimeMs === null
        ? null : metadata.secondImpactTimeMs + releaseAtMs,
    });
  }
  return Object.freeze({ describe, stateAt, eventsThrough });
}