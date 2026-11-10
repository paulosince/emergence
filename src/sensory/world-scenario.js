// Configure modality availability without changing the underlying physical world.
import { createDropV1, DROP_V1 } from '../world/scenarios.js';
import { WorldSignalEnvironment } from './world-signals.js';

export const WORLD_SENSOR_REGISTRY = Object.freeze([
  Object.freeze({
    modality: 'optical',
    sensor: Object.freeze({
      id: 's0', channelId: 'c0', periodMs: 10,
      latencyMs: 2, emitMode: 'change',
    }),
    coupling: Object.freeze({
      channelId: 'c0', type: 'photogate', beamHeightM: 0.70,
    }),
  }),
  Object.freeze({
    modality: 'optical',
    sensor: Object.freeze({
      id: 's1', channelId: 'c1', periodMs: 10,
      latencyMs: 3, emitMode: 'change',
    }),
    coupling: Object.freeze({
      channelId: 'c1', type: 'photogate', beamHeightM: 0.30,
    }),
  }),
  Object.freeze({
    modality: 'mechanical',
    sensor: Object.freeze({
      id: 's2', channelId: 'c2', periodMs: 10,
      latencyMs: 4, emitMode: 'change',
    }),
    coupling: Object.freeze({
      channelId: 'c2', type: 'force-plate-impulse', windowMs: 10,
    }),
  }),
]);

export function createWorldSensoryScenario({
  modalities = ['optical', 'mechanical'],
  sensorOverrides = {},
  couplingOverrides = {},
  seed = 42,
  endTimeMs = DROP_V1.horizonMs,
} = {}) {
  if (!Array.isArray(modalities) ||
      modalities.some(m => !['optical', 'mechanical'].includes(m)) ||
      new Set(modalities).size !== modalities.length) {
    throw new RangeError('Unknown or repeated modality');
  }
  if (!sensorOverrides || typeof sensorOverrides !== 'object' ||
      Array.isArray(sensorOverrides)) {
    throw new TypeError('sensorOverrides must be an object');
  }
  if (!couplingOverrides || typeof couplingOverrides !== 'object' ||
      Array.isArray(couplingOverrides)) {
    throw new TypeError('couplingOverrides must be an object');
  }
  const ids = WORLD_SENSOR_REGISTRY.map(item => item.sensor.id);
  if ([...Object.keys(sensorOverrides), ...Object.keys(couplingOverrides)]
    .some(id => !ids.includes(id))) {
    throw new RangeError('Unknown sensor identifier in override');
  }
  const selected = WORLD_SENSOR_REGISTRY.filter(item => modalities.includes(item.modality));
  const selectedIds = new Set(selected.map(item => item.sensor.id));
  if ([...Object.keys(sensorOverrides), ...Object.keys(couplingOverrides)]
    .some(id => !selectedIds.has(id))) {
    throw new RangeError('Override refers to a disabled sensor');
  }
  const transducers = selected.map(({ sensor }) => {
    const override = sensorOverrides[sensor.id] ?? {};
    if (!override || typeof override !== 'object' || Array.isArray(override)) {
      throw new TypeError('Sensor overrides must be objects');
    }
    // Physics and identities are not modifiable through numerical sampling settings.
    const allowed = ['periodMs', 'phaseMs', 'latencyMs', 'quantum',
      'noiseStd', 'emitMode', 'minDelta'];
    if (Object.keys(override).some(key => !allowed.includes(key))) {
      throw new RangeError('Override changes undeclared sensor properties');
    }
    return { ...sensor, ...override };
  });
  const couplings = selected.map(({ coupling, sensor }) => {
    const override = couplingOverrides[sensor.id] ?? {};
    if (!override || typeof override !== 'object' || Array.isArray(override)) {
      throw new TypeError('Coupling overrides must be objects');
    }
    const allowed = coupling.type === 'photogate'
      ? ['beamHeightM', 'clearIntensity', 'blockedIntensity'] : [];
    if (Object.keys(override).some(key => !allowed.includes(key))) {
      throw new RangeError('Override changes a physically fixed coupling type');
    }
    if (coupling.type === 'photogate') return { ...coupling, ...override };
    // Force plate bins must tile time rather than silently overlap or leave gaps.
    return { ...coupling,
      windowMs: transducers.find(s => s.id === sensor.id).periodMs };
  });
  const world = createDropV1();
  const environment = new WorldSignalEnvironment({ world, couplings });
  return {
    environment, transducers, seed, endTimeMs,
    // Returned separately to RESEARCHER ONLY: not passed to engine.
    world,
  };
}