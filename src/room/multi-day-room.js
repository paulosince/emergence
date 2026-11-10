// P0.3 — The same room over several consecutive civil days.
// Each day is the validated single-day model (createRoomWorld). Continuity:
//   * indoor temperature: each day starts at the previous day's final indoor
//     temperature (thermal state carried across midnight);
//   * lamp: decided by exterior irradiance, so it is continuous at midnight;
//   * weather: synthetic presets are periodic within a day; when the preset
//     CHANGES between days, outdoor forcing steps at midnight. This is a
//     declared model limitation (an instantaneous weather front), measured
//     and reported, not hidden.
// The object can be inserted or removed by the researcher at midnight.
// All of this is researcher-side truth; engines receive only incidences.
import { createRoomWorld } from './room-world.js';
import { DAY_MS } from './solar.js';
import { makeRng } from '../../vendor/tempo/core/rng.js';

export const MULTI_DAY_ROOM_MODEL = 'naturalistic-room-multi-day-v1';

function addDays(isoDate, k) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + k));
  return t.toISOString().slice(0, 10);
}

// Researcher schedule: consecutive dates; weather and object per day either
// explicit or drawn with a declared seed.
export function multiDaySchedule({ startDate = '2026-06-21', days = 7,
  weather = null, objects = null, pOvercast = 0.4, pObject = 0.5, scheduleSeed = 0 } = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) throw new RangeError('startDate must be YYYY-MM-DD');
  if (!Number.isInteger(days) || days < 1 || days > 366) throw new RangeError('days must be in [1, 366]');
  const rng = makeRng(scheduleSeed);
  return Array.from({ length: days }, (_, k) => {
    const w = weather ? weather[k] : (rng.random() < pOvercast ? 'overcast' : 'clear');
    const o = objects ? objects[k] : rng.random() < pObject;
    if (!['clear', 'overcast'].includes(w)) throw new RangeError('Unknown weather preset at day ' + k);
    if (typeof o !== 'boolean') throw new TypeError('objects[k] must be boolean');
    return Object.freeze({ date: addDays(startDate, k), weatherPreset: w, opaqueObjectEnabled: o });
  });
}

export function createMultiDayRoomWorld({ schedule, initialIndoorTemperatureC = 17, worldOptions = {} } = {}) {
  if (!Array.isArray(schedule) || schedule.length < 1) throw new RangeError('schedule must be a non-empty array');
  const days = [];
  let startTemp = initialIndoorTemperatureC;
  schedule.forEach((s, k) => {
    const world = createRoomWorld({ ...worldOptions, date: s.date, weatherPreset: s.weatherPreset,
      opaqueObjectEnabled: s.opaqueObjectEnabled, initialIndoorTemperatureC: startTemp });
    const endState = world.stateAt(DAY_MS);
    days.push(Object.freeze({ index: k, startMs: k * DAY_MS, ...s, world,
      initialIndoorTemperatureC: startTemp }));
    startTemp = endState.thermal.indoorTemperatureC;
  });
  const endMs = days.length * DAY_MS;

  function dayAt(t) {
    if (!Number.isFinite(t) || t < 0 || t > endMs) {
      throw new RangeError('timeMs must be within the multi-day schedule [0, ' + endMs + ']');
    }
    return days[Math.min(days.length - 1, Math.floor(t / DAY_MS))];
  }
  function stateAt(t) {
    const d = dayAt(t);
    return Object.freeze({ ...d.world.stateAt(t - d.startMs), timeMs: t, day: d.index });
  }
  function floorIrradianceAt(t, eastM, northM) {
    const d = dayAt(t);
    return d.world.floorIrradianceAt(t - d.startMs, eastM, northM);
  }
  function eventsThrough(t) {
    const last = dayAt(t).index, out = [];
    for (let k = 0; k <= last; k++) {
      const d = days[k], prev = days[k - 1];
      if (prev && prev.weatherPreset !== d.weatherPreset) {
        out.push(Object.freeze({ type: 'weather.change', eventId: 'weather-' + k, timeMs: d.startMs,
          from: prev.weatherPreset, to: d.weatherPreset, day: k }));
      }
      if (prev && prev.opaqueObjectEnabled !== d.opaqueObjectEnabled) {
        out.push(Object.freeze({ type: d.opaqueObjectEnabled ? 'intervention.object-inserted' : 'intervention.object-removed',
          eventId: 'object-' + k, timeMs: d.startMs, imposedBy: 'experimenter', day: k }));
      }
      for (const e of d.world.eventsThrough(Math.min(DAY_MS, t - d.startMs))) {
        // The lamp state at midnight continues from the previous day: keep the
        // single-day 'lamp.initial' only for day 0.
        if (k > 0 && e.type === 'lamp.initial') continue;
        out.push(Object.freeze({ ...e, eventId: e.eventId + '-d' + k, timeMs: d.startMs + e.timeMs, day: k }));
      }
    }
    return Object.freeze(out);
  }
  function describe() {
    return Object.freeze({
      modelId: MULTI_DAY_ROOM_MODEL, version: '0.1.0', endMs,
      geometry: days[0].world.describe().geometry, // dimensions shared by all days
      days: Object.freeze(days.map(d => Object.freeze({ index: d.index, date: d.date,
        weatherPreset: d.weatherPreset, opaqueObjectEnabled: d.opaqueObjectEnabled,
        initialIndoorTemperatureC: d.initialIndoorTemperatureC }))),
      continuity: 'indoor temperature carried across midnight; lamp continuous; weather preset may step at midnight',
      provenance: 'researcher-only truth',
    });
  }
  function dayWorlds() { return days.map(d => d.world); }
  return Object.freeze({ stateAt, eventsThrough, describe, floorIrradianceAt, dayWorlds });
}
