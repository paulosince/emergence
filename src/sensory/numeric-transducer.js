// Converts a sampled scalar signal into a numerical incidence.
// Neither the name of a phenomenon nor a semantic label is generated here.
export class NumericTransducer {
  #lastEmitted = null;
  constructor({
    id, channelId, periodMs, phaseMs = 0, latencyMs = 0,
    quantum = 0, noiseStd = 0, emitMode = 'all', minDelta = 0,
  }) {
    if (typeof id !== 'string' || !id.trim() ||
        typeof channelId !== 'string' || !channelId.trim()) {
      throw new TypeError('Transducer id and channelId are required');
    }
    if (!(Number.isFinite(periodMs) && periodMs > 0) ||
        !Number.isFinite(phaseMs) || phaseMs < 0 ||
        !Number.isFinite(latencyMs) || latencyMs < 0 ||
        !Number.isFinite(quantum) || quantum < 0 ||
        !Number.isFinite(noiseStd) || noiseStd < 0 ||
        !Number.isFinite(minDelta) || minDelta < 0) {
      throw new RangeError('Invalid period, phase, delay, precision or noise parameter');
    }
    if (!['all', 'change'].includes(emitMode)) {
      throw new RangeError('emitMode must be all or change');
    }
    this.config = Object.freeze({
      id, channelId, periodMs, phaseMs, latencyMs,
      quantum, noiseStd, emitMode, minDelta,
    });
  }

  sampleAt(observedAtMs, environment, rng) {
    const raw = environment.readAt(this.config.channelId, observedAtMs);
    const noisy = raw + (this.config.noiseStd ? this.config.noiseStd * rng.normal() : 0);
    const measurement = this.config.quantum
      ? Math.round(noisy / this.config.quantum) * this.config.quantum : noisy;
    if (!Number.isFinite(measurement)) throw new RangeError('Sensor output became nonfinite');
    const { emitMode, minDelta, latencyMs } = this.config;
    const emitted = emitMode === 'all' || this.#lastEmitted === null ||
      Math.abs(measurement - this.#lastEmitted) > minDelta;
    if (emitted) this.#lastEmitted = measurement;
    return {
      rawValue: raw, measurement, emitted,
      observedAtMs, arrivedAtMs: observedAtMs + latencyMs,
    };
  }
}