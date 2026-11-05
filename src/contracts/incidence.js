// Input contract: records a transducer occurrence, not an object identity or category.
export function createIncidence({ transducerId, observedAtMs, measurement }) {
  if (typeof transducerId !== 'string' || !transducerId.trim()) {
    throw new TypeError('transducerId must be a non-empty transducer identifier');
  }
  if (!Number.isFinite(observedAtMs) || observedAtMs < 0) {
    throw new RangeError('observedAtMs must be a finite nonnegative simulated time');
  }
  if (measurement === undefined) {
    throw new TypeError('measurement is required; its interpretation belongs to an engine');
  }
  return Object.freeze({ transducerId, observedAtMs, measurement });
}
