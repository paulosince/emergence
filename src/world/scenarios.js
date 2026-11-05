import { createReleaseControlledWorld } from './release-control.js';

export const DROP_V1 = Object.freeze({
  scenarioId: 'single-sphere-freefall-impact-v1', releaseAtMs: 0,
  clearanceM: 1, initialVelocityMps: 0,
  gravityMps2: 9.81, massKg: 1, radiusM: 0.05, restitution: 0.5,
  horizonMs: 800, sampleStepMs: 100,
});

export function createDropV1() {
  const { scenarioId, horizonMs, sampleStepMs, ...params } = DROP_V1;
  return createReleaseControlledWorld(params);
}

export function researchSampleTimes(world, { horizonMs, stepMs }) {
  if (!Number.isFinite(horizonMs) || horizonMs <= 0 ||
      !Number.isFinite(stepMs) || stepMs <= 0 || stepMs > horizonMs) {
    throw new RangeError('Invalid time horizon or sampling step');
  }
  const set = new Set([0, horizonMs]);
  for (let k = 1; k * stepMs < horizonMs; k++) set.add(k * stepMs);
  // Sample the actual discontinuity rather than miss it on a fixed grid.
  for (const event of world.eventsThrough(horizonMs)) set.add(event.timeMs);
  return [...set].sort((a, b) => a - b);
}