// Light from outside and inside over time (environment forcing; never a label
// for the domain). Sun: the existing solar geometry (src/room/solar.js).
// Moon (decision 10/11/2026: moonlight at night): phase from a reference new
// moon and the mean synodic month; position approximated as the Sun's path
// lagging by the phase angle (declared loss: no lunar declination or orbit
// inclination). Illuminance values are order-of-magnitude declarations, not
// measurements. Lamp (decision): on at dusk (sunset), off at 22:00.
import { describeSolarDay, solarAt, DAY_MS } from '../../room/solar.js';

export const SKY_DEFAULTS = Object.freeze({
  startDate: '2026-11-10', latitudeDeg: -23.45, longitudeDeg: -46.52, utcOffsetHours: -3,
  startHour: 8, lampOffHour: 22,
  sunLuxAtZenith: 110000, fullMoonLuxAtZenith: 0.25, lampLux: 300, // declared orders of magnitude
});
const SYNODIC_DAYS = 29.530588853, REF_NEW_MOON_UTC_MS = Date.UTC(2000, 0, 6, 18, 14); // reference new moon (to verify)

export class Sky {
  #c; #days = new Map();
  constructor(config = {}) { this.#c = { ...SKY_DEFAULTS, ...config }; }
  #day(k) {
    if (!this.#days.has(k)) {
      const d = new Date(Date.parse(this.#c.startDate + 'T00:00:00Z') + k * DAY_MS).toISOString().slice(0, 10);
      this.#days.set(k, describeSolarDay({ date: d, latitudeDeg: this.#c.latitudeDeg, longitudeDeg: this.#c.longitudeDeg, utcOffsetHours: this.#c.utcOffsetHours }));
    }
    return this.#days.get(k);
  }
  // civil time from simulation seconds
  clock(simSeconds) {
    const ms = this.#c.startHour * 3600000 + simSeconds * 1000, k = Math.floor(ms / DAY_MS);
    return { dayIndex: k, msOfDay: ms - k * DAY_MS, hour: (ms - k * DAY_MS) / 3600000 };
  }
  sun(simSeconds) { const c = this.clock(simSeconds); return solarAt(c.msOfDay, this.#day(c.dayIndex)); }
  moonPhase(simSeconds) { // 0 new, 0.5 full
    const c = this.clock(simSeconds), utc = Date.parse(this.#day(c.dayIndex).date + 'T00:00:00Z') + c.msOfDay - this.#c.utcOffsetHours * 3600000;
    const x = ((utc - REF_NEW_MOON_UTC_MS) / DAY_MS) / SYNODIC_DAYS;
    return x - Math.floor(x);
  }
  moon(simSeconds) {
    const phase = this.moonPhase(simSeconds), c = this.clock(simSeconds);
    let lagged = c.msOfDay - phase * DAY_MS; lagged -= Math.floor(lagged / DAY_MS) * DAY_MS;
    const p = solarAt(lagged, this.#day(c.dayIndex));
    return { ...p, phase, illuminatedFraction: (1 - Math.cos(2 * Math.PI * phase)) / 2 };
  }
  // the lamp turns on at the first sunset sample of each day and off at lampOffHour
  lampOn(simSeconds) {
    const c = this.clock(simSeconds);
    return c.hour < this.#c.lampOffHour && c.hour > 12 && !this.sun(simSeconds).isAboveHorizon;
  }
  dusk(simSeconds) { const c = this.clock(simSeconds); return c.hour > 12 && !this.sun(simSeconds).isAboveHorizon; }
  outdoorLux(simSeconds) {
    const s = this.sun(simSeconds), m = this.moon(simSeconds), c = this.#c;
    return Math.max(0, s.up) * c.sunLuxAtZenith + Math.max(0, m.up) * m.illuminatedFraction * c.fullMoonLuxAtZenith;
  }
  state(simSeconds) {
    return { clock: this.clock(simSeconds), sun: this.sun(simSeconds), moon: this.moon(simSeconds), lampOn: this.lampOn(simSeconds), outdoorLux: this.outdoorLux(simSeconds) };
  }
}
