// Sensing for the multi-day room: the same six room transducers.
import { RoomSensorEnvironment } from './room-sensors.js';
import { ROOM_SENSORS } from './room-scenario.js';
import { createMultiDayRoomWorld, multiDaySchedule } from './multi-day-room.js';

export function createMultiDayRoomScenario({ schedule = null, startDate = '2026-06-21', days = 7,
  scheduleSeed = 0, pOvercast = 0.4, pObject = 0.5,
  modalities = ['optical', 'thermal', 'electrical'], sensorOverrides = {}, seed = 42,
  maxEvents = 1000000 } = {}) {
  const plan = schedule ?? multiDaySchedule({ startDate, days, scheduleSeed, pOvercast, pObject });
  const world = createMultiDayRoomWorld({ schedule: plan });
  const selected = ROOM_SENSORS.filter(s => modalities.includes(s.modality));
  if (!selected.length && modalities.length) throw new RangeError('Unknown modalities');
  const ids = new Set(selected.map(s => s.id));
  if (Object.keys(sensorOverrides).some(id => !ids.has(id))) throw new RangeError('Override for missing sensor');
  const transducers = selected.map(s => ({ id: s.id, channelId: s.channelId, periodMs: s.periodMs,
    latencyMs: s.latencyMs, emitMode: 'change', ...(sensorOverrides[s.id] ?? {}) }));
  const couplings = selected.map(s => ({ channelId: s.channelId, type: s.type,
    ...(s.type === 'floor-radiometer' ? { eastM: s.eastM, northM: s.northM } : {}) }));
  return { world, environment: new RoomSensorEnvironment({ world, couplings }), transducers,
    seed, maxEvents, endTimeMs: world.describe().endMs - 1 };
}
