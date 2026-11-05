// Solar geometry in local civil time; simplified declination + equation of time.
// Environmental forcing only: never a learned event or a transduced label.
// E/N/Up is a unit vector pointing FROM the room TOWARDS the Sun.
const DEG = Math.PI / 180;
export const DAY_MS = 86400000;

export function describeSolarDay({
  date = '2026-06-21',
  latitudeDeg = -23.45,
  longitudeDeg = -46.52,
  utcOffsetHours = -3,
} = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new RangeError('Date must use YYYY-MM-DD');
  }
  const parsed = new Date(date + 'T00:00:00.000Z');
  if (!Number.isFinite(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== date) {
    throw new RangeError('Nonexistent civil calendar date');
  }
  for (const [name, v, lo, hi] of [
    ['latitudeDeg', latitudeDeg, -90, 90],
    ['longitudeDeg', longitudeDeg, -180, 180],
    ['utcOffsetHours', utcOffsetHours, -12, 14],
  ]) {
    if (!Number.isFinite(v) || v < lo || v > hi)
      throw new RangeError(name + ' out of range');
  }
  const yearStart = Date.UTC(parsed.getUTCFullYear(), 0, 1);
  const dayOfYear = Math.round((parsed.getTime() - yearStart) / DAY_MS) + 1;
  return Object.freeze({
    date, latitudeDeg, longitudeDeg, utcOffsetHours, dayOfYear,
    method: 'approximate declination and equation-of-time, no refraction',
  });
}

export function solarAt(timeMs, day) {
  if (!Number.isFinite(timeMs) || timeMs < 0 || timeMs > DAY_MS) {
    throw new RangeError('Solar time outside one civil day');
  }
  const declination = 23.44 * DEG *
    Math.sin((2 * Math.PI / 365) * (284 + day.dayOfYear));
  const b = 2 * Math.PI * (day.dayOfYear - 81) / 364;
  const equationOfTimeMin = 9.87 * Math.sin(2*b) -
    7.53 * Math.cos(b) - 1.5 * Math.sin(b);
  const civilHour = timeMs / 3600000;
  const solarHour = civilHour +
    (4 * (day.longitudeDeg - 15 * day.utcOffsetHours) +
      equationOfTimeMin) / 60;
  const hourAngle = (solarHour - 12) * 15 * DEG;
  const phi = day.latitudeDeg * DEG;
  const east = -Math.cos(declination) * Math.sin(hourAngle);
  const north = Math.cos(phi) * Math.sin(declination) -
    Math.sin(phi) * Math.cos(declination) * Math.cos(hourAngle);
  const up = Math.sin(phi) * Math.sin(declination) +
    Math.cos(phi) * Math.cos(declination) * Math.cos(hourAngle);
  const altitudeDeg = Math.asin(Math.max(-1, Math.min(1, up))) / DEG;
  return Object.freeze({
    east, north, up, altitudeDeg, isAboveHorizon: up > 0,
    localHour: civilHour, solarHour,
  });
}