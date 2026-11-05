// Weather INPUT conditions, not synthetic sensor responses.
// Presets are deliberately synthetic. Imported time series is provenance-bound
// and linearly interpolated; it is not fetched by the experimental kernel.
export const WEATHER_PRESETS = Object.freeze({
  clear: Object.freeze({
    id: 'clear-synthetic-v1', meanTemperatureC: 17,
    temperatureAmplitudeC: 5, cloudCover: 0.05,
  }),
  overcast: Object.freeze({
    id: 'overcast-synthetic-v1', meanTemperatureC: 16,
    temperatureAmplitudeC: 2, cloudCover: 0.9,
  }),
});

export function createWeatherForcing({
  preset = 'clear', series = null, source = null,
} = {}) {
  if (series !== null) {
    if (!Array.isArray(series) || series.length < 2 ||
        typeof source !== 'string' || !source.trim()) {
      throw new TypeError('Weather series requires >=2 records and explicit source');
    }
    const records = series.map(r => ({
      timeMs: r.timeMs, temperatureC: r.temperatureC,
      cloudCover: r.cloudCover,
    }));
    for (let i = 0; i < records.length; i++) {
      const { timeMs, temperatureC, cloudCover } = records[i];
      if (![timeMs, temperatureC, cloudCover].every(Number.isFinite) ||
          timeMs < 0 || timeMs > 86400000 ||
          temperatureC < -90 || temperatureC > 65 ||
          cloudCover < 0 || cloudCover > 1 ||
          (i && timeMs <= records[i-1].timeMs)) {
        throw new RangeError('Invalid ordered weather record');
      }
    }
    if (records[0].timeMs !== 0 ||
        records.at(-1).timeMs !== 86400000) {
      throw new RangeError('Weather series must span this complete 24-hour day');
    }
    return Object.freeze({
      describe: () => ({
        kind: 'imported-forcing', source,
        records: records.map(x => ({ ...x })),
        explicitlyNotRealtime: true,
      }),
      at: timeMs => {
        assertTime(timeMs);
        let lo = 0, hi = records.length - 1;
        while (hi - lo > 1) {
          const mid = Math.floor((hi + lo) / 2);
          if (records[mid].timeMs < timeMs) lo = mid;
          else hi = mid;
        }
        const a = records[lo], b = records[hi];
        const ratio = (timeMs - a.timeMs) / (b.timeMs - a.timeMs);
        return Object.freeze({
          temperatureC: a.temperatureC + ratio * (b.temperatureC - a.temperatureC),
          cloudCover: a.cloudCover + ratio * (b.cloudCover - a.cloudCover),
        });
      },
    });
  }
  if (!Object.hasOwn(WEATHER_PRESETS, preset)) {
    throw new RangeError('Unknown weather preset');
  }
  const p = WEATHER_PRESETS[preset];
  return Object.freeze({
    describe: () => ({
      kind: 'synthetic-periodic', id: p.id,
      parameters: { ...p },
      explicitlyNotRealtime: true,
    }),
    at: timeMs => {
      assertTime(timeMs);
      const hour = timeMs / 3600000;
      return Object.freeze({
        temperatureC: p.meanTemperatureC +
          p.temperatureAmplitudeC *
            Math.cos((2 * Math.PI / 24) * (hour - 15)),
        cloudCover: p.cloudCover,
      });
    },
  });
}

function assertTime(t) {
  if (!Number.isFinite(t) || t < 0 || t > 86400000)
    throw new RangeError('Weather time outside civil day');
}