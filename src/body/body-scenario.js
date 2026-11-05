// One causal physical world with independently selectable modalities.
// The experimenter gives the action command; no autonomous controller exists.
import { createActuatedWorld } from './actuated-world.js';
import { createFixedThresholdBodyWorld } from './fixed-threshold-control.js';
import { BodySignalEnvironment } from './body-signals.js';

export const BODY_SCENARIO_ID = 'single-actuated-sphere-drop-v1';
export const BODY_SCENARIO_HORIZON_MS = 1700;
const REGISTRY = Object.freeze([
  { id: 's0', channelId: 'c0', modality: 'optical', periodMs: 10, latencyMs: 2,
    coupling: { type: 'photogate', beamHeightM: 0.70 } },
  { id: 's1', channelId: 'c1', modality: 'optical', periodMs: 10, latencyMs: 3,
    coupling: { type: 'photogate', beamHeightM: 0.30 } },
  { id: 's2', channelId: 'c2', modality: 'mechanical', periodMs: 10, latencyMs: 4,
    coupling: { type: 'force-plate-impulse', windowMs: 10 } },
  { id: 's3', channelId: 'c3', modality: 'proprioceptive', periodMs: 10, latencyMs: 2,
    coupling: { type: 'joint-potentiometer', gain: 5 } },
  { id: 's4', channelId: 'c4', modality: 'interoceptive', periodMs: 20, latencyMs: 3,
    coupling: { type: 'capacitor-voltage' } },
  { id: 's5', channelId: 'c5', modality: 'interoceptive', periodMs: 20, latencyMs: 4,
    coupling: { type: 'temperature-voltage', gain: 0.01 } },
  { id: 's6', channelId: 'c6', modality: 'interoceptive', periodMs: 10, latencyMs: 3,
    coupling: { type: 'motor-current' } },
].map(Object.freeze));
const ALL_MODALITIES = Object.freeze([
  'optical', 'mechanical', 'proprioceptive', 'interoceptive',
]);
const SENSOR_OVERRIDES = Object.freeze([
  'periodMs', 'phaseMs', 'latencyMs', 'quantum', 'noiseStd',
  'emitMode', 'minDelta',
]);
export function createBodyScenario({
  modalities = ALL_MODALITIES,
  worldOptions = {},
  controlMode = 'experimenter',
  thresholdVoltageV = 9.95,
  sensorOverrides = {},
  seed = 42,
  endTimeMs = BODY_SCENARIO_HORIZON_MS,
} = {}) {
  if (!Array.isArray(modalities) ||
      modalities.some(x => !ALL_MODALITIES.includes(x)) ||
      new Set(modalities).size !== modalities.length) {
    throw new RangeError('Invalid or duplicate modality');
  }
  if (!worldOptions || typeof worldOptions !== 'object' ||
      Array.isArray(worldOptions) ||
      !sensorOverrides || typeof sensorOverrides !== 'object' ||
      Array.isArray(sensorOverrides)) {
    throw new TypeError('World options and sensor overrides must be records');
  }
  if (!['experimenter', 'fixed-voltage-gate'].includes(controlMode)) {
    throw new RangeError('Unknown action control mode');
  }
  const selected = REGISTRY.filter(x => modalities.includes(x.modality));
  const activeIds = new Set(selected.map(x => x.id));
  if (Object.keys(sensorOverrides).some(id => !activeIds.has(id))) {
    throw new RangeError('Unknown or inactive sensor override');
  }
  const transducers = selected.map(x => {
    const overrides = sensorOverrides[x.id] ?? {};
    if (!overrides || typeof overrides !== 'object' ||
        Array.isArray(overrides) ||
        Object.keys(overrides).some(key => !SENSOR_OVERRIDES.includes(key))) {
      throw new RangeError('Undeclared transducer override');
    }
    return {
      id: x.id, channelId: x.channelId, periodMs: x.periodMs,
      latencyMs: x.latencyMs, emitMode: 'change', ...overrides,
    };
  });
  const couplings = selected.map(x => ({
    channelId: x.channelId, ...x.coupling,
    ...(x.coupling.type === 'force-plate-impulse'
      ? { windowMs: transducers.find(s => s.id === x.id).periodMs } : {}),
  }));
  // The world has no dependency on sensor presence, order or sampling.
  const world = controlMode === 'experimenter'
    ? createActuatedWorld(worldOptions)
    : createFixedThresholdBodyWorld({ worldOptions, thresholdVoltageV });
  const environment = new BodySignalEnvironment({ world, couplings });
  return Object.freeze({
    environment, transducers, seed, endTimeMs,
    researchScenarioId: BODY_SCENARIO_ID,
    world, // researcher only; excluded by runner from ingest()
  });
}