// P0.6 scenario: default discs and a protocol covering the I2 requirements
// (rest periods, gradual drift, feature change while hidden, teleport).
import { createTabletopWorld } from '../world/tabletop.js';
import { TabletopSensorEnvironment } from './tabletop-sensors.js';

export const DEFAULT_DISCS = Object.freeze([
  { radiusM: 0.05, reflectance: 0.9, temperatureC: 40, x: 0.15, y: 0.20 },
  { radiusM: 0.07, reflectance: 0.3, temperatureC: 20, x: 0.80, y: 0.40 },
  { radiusM: 0.04, reflectance: 0.7, temperatureC: 60, x: 0.30, y: 0.45 },
].map(Object.freeze));

// First interval >= minMs after fromMs in which disc k is FULLY hidden.
export function findHiddenInterval(world, k, { fromMs = 0, minMs = 500, stepMs = 10 } = {}) {
  const T = world.describe().horizonMs;
  let start = null;
  for (let t = fromMs; t <= T; t += stepMs) {
    const h = world.stateAt(t).discs[k].fullyHidden;
    if (h && start === null) start = t;
    if (!h && start !== null) { if (t - start >= minMs) return { startMs: start, endMs: t }; start = null; }
  }
  return null;
}

export function createTabletopScenario({
  discs = DEFAULT_DISCS, horizonMs = 300000, launchSeed = 1,
  protocol = 'standard-v1', idSeed = 0, retinaPeriodMs = 100, seed = 42,
  modalities = ['optical', 'tactile', 'thermal'], sensorOptions = {}, maxEvents = 2000000,
} = {}) {
  let interventions = [{ timeMs: 0, type: 'launch', seed: launchSeed }];
  if (protocol === 'standard-v1') {
    interventions.push(
      { timeMs: 80000, type: 'rest' },                       // rest 1 (sensing silent)
      { timeMs: 95000, type: 'launch', seed: launchSeed + 1 },
      { timeMs: 140000, type: 'feature-drift', disc: 0, feature: 'reflectance', from: 0.9, to: 0.4, durationMs: 30000, steps: 10 },
      { timeMs: 230000, type: 'rest' },                      // rest 2
      { timeMs: 245000, type: 'launch', seed: launchSeed + 2 });
    // feature change WHILE HIDDEN for disc 1 (spatiotemporal continuity kept)
    const pilot = createTabletopWorld({ discs: discs.map(d => ({ ...d })), interventions, horizonMs });
    const hid = findHiddenInterval(pilot, 1, { fromMs: 180000, minMs: 300 });
    if (hid) interventions.push({ timeMs: hid.startMs + 100, type: 'feature', disc: 1, feature: 'reflectance', value: 0.8 });
    // teleport of disc 2 (spatiotemporal violation) to a free spot outside the
    // screen, chosen from a pilot run so it never overlaps another disc
    const pilot2 = createTabletopWorld({ discs: discs.map(d => ({ ...d })), interventions, horizonMs });
    const at = pilot2.stateAt(200000).discs, r2 = discs[2].radiusM;
    const spots = [];
    for (const x of [0.85, 0.15, 0.3, 0.75, 0.9, 0.1]) for (const y of [0.12, 0.48, 0.3]) spots.push({ x, y });
    const free = spots.find(p => at.every((d, k) => k === 2 || Math.hypot(d.x - p.x, d.y - p.y) > d.radiusM + r2 + 0.02));
    if (!free) throw new RangeError('No free teleport destination at 200000 ms');
    interventions.push({ timeMs: 200000, type: 'teleport', disc: 2, x: free.x, y: free.y });
  } else if (protocol !== 'free') throw new RangeError('Unknown protocol');
  const world = createTabletopWorld({ discs: discs.map(d => ({ ...d })), interventions, horizonMs });
  const environment = new TabletopSensorEnvironment({ world, idSeed, modalities, ...sensorOptions });
  const transducers = environment.channelIds().map(id => ({ id, channelId: id, periodMs: retinaPeriodMs,
    latencyMs: 0, emitMode: 'change' }));
  return { world, environment, transducers, seed, maxEvents, endTimeMs: horizonMs - 1 };
}
