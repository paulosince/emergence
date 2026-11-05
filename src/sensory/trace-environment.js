// Piecewise-constant scalar environment. The engine never receives this object.
// Numeric traces are laboratory inputs, NOT pre-defined entities or categories.
export class TraceEnvironment {
  #channels;
  constructor({ scenarioId, channels }) {
    if (typeof scenarioId !== 'string' || !scenarioId.trim()) {
      throw new TypeError('scenarioId is required');
    }
    if (!channels || typeof channels !== 'object' || Array.isArray(channels)) {
      throw new TypeError('channels must contain time/value traces');
    }
    this.scenarioId = scenarioId;
    this.#channels = Object.create(null);
    for (const [channelId, points] of Object.entries(channels)) {
      if (!channelId || !Array.isArray(points) || !points.length) {
        throw new TypeError('Each channel needs a non-empty trace');
      }
      const normalized = points.map(point => {
        if (!Array.isArray(point) || point.length !== 2 ||
            !Number.isFinite(point[0]) || point[0] < 0 ||
            !Number.isFinite(point[1])) {
          throw new TypeError('Trace points must be [nonnegative timeMs, finite value]');
        }
        return Object.freeze([point[0], point[1]]);
      });
      if (normalized[0][0] !== 0) throw new RangeError('Each trace must begin at 0 ms');
      for (let i = 1; i < normalized.length; i++) {
        if (normalized[i][0] <= normalized[i - 1][0]) {
          throw new RangeError('Trace times must be strictly increasing');
        }
      }
      this.#channels[channelId] = Object.freeze(normalized);
    }
    if (!Object.keys(this.#channels).length) throw new TypeError('At least one channel is required');
    Object.freeze(this.#channels);
  }

  readAt(channelId, timeMs) {
    if (!Number.isFinite(timeMs) || timeMs < 0) {
      throw new RangeError('Invalid environment time');
    }
    const points = this.#channels[channelId];
    if (!points) throw new RangeError('Unknown physical channel: ' + channelId);
    let lo = 0, hi = points.length - 1;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (points[mid][0] <= timeMs) lo = mid;
      else hi = mid - 1;
    }
    return points[lo][1];
  }

  // Research metadata. The runner stores this outside the engine input boundary.
  specification() {
    return {
      scenarioId: this.scenarioId,
      model: 'piecewise-constant-scalar-traces',
      channels: Object.fromEntries(Object.entries(this.#channels)
        .map(([key, points]) => [key, points.map(([t, v]) => [t, v])])),
    };
  }
}