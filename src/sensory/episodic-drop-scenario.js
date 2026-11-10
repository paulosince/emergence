// Sensing for the episodic drop world (P0.2): the SAME photogates (0.70 m and
// 0.30 m) and force plate as the validated single-drop world. The engine
// receives only incidences; heights, episode boundaries and impact labels
// stay on the researcher side.
import { WORLD_SENSOR_REGISTRY } from './world-scenario.js';
import { WorldSignalEnvironment } from './world-signals.js';
import { createEpisodicDropWorld, episodicHeights } from '../world/episodic-drops.js';

export function createEpisodicDropScenario({
  heightsM = null, episodes = 20, minHeightM = 0.8, maxHeightM = 2.0,
  scheduleSeed = 0, episodeMs = 3000, holdMs = 1000,
  modalities = ['optical', 'mechanical'], sensorOverrides = {},
  seed = 42, maxEvents = 1000000,
} = {}) {
  if (!Array.isArray(modalities) ||
      modalities.some(m => !['optical', 'mechanical'].includes(m)) ||
      new Set(modalities).size !== modalities.length) {
    throw new RangeError('Unknown or repeated modality');
  }
  const heights = episodicHeights({ heightsM, episodes, minHeightM, maxHeightM, scheduleSeed });
  const schedule = heightsM === null
    ? { kind: 'uniform', minHeightM, maxHeightM, scheduleSeed, episodes }
    : { kind: 'explicit' };
  const world = createEpisodicDropWorld({ heightsM: heights, episodeMs, holdMs, schedule });
  const selected = WORLD_SENSOR_REGISTRY.filter(item => modalities.includes(item.modality));
  const ids = new Set(selected.map(item => item.sensor.id));
  if (Object.keys(sensorOverrides).some(id => !ids.has(id))) {
    throw new RangeError('Override refers to an unknown or disabled sensor');
  }
  const allowed = ['periodMs', 'phaseMs', 'latencyMs', 'quantum', 'noiseStd', 'emitMode', 'minDelta'];
  const transducers = selected.map(({ sensor }) => {
    const o = sensorOverrides[sensor.id] ?? {};
    if (Object.keys(o).some(k => !allowed.includes(k))) {
      throw new RangeError('Override changes undeclared sensor properties');
    }
    return { ...sensor, ...o };
  });
  const couplings = selected.map(({ coupling, sensor }) => coupling.type === 'photogate'
    ? { ...coupling }
    : { ...coupling, windowMs: transducers.find(s => s.id === sensor.id).periodMs });
  const environment = new WorldSignalEnvironment({ world, couplings });
  return {
    environment, transducers, seed, maxEvents,
    endTimeMs: world.describe().endMs - 1,
    world, // RESEARCHER ONLY
  };
}
