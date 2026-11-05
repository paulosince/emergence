// Incidence is a measurement at a transducer boundary, not a pre-labelled entity.
export function createIncidence({
  transducerId, observedAtMs, arrivedAtMs, measurement, incidenceId,
}) {
  if (typeof transducerId !== 'string' || !transducerId.trim()) {
    throw new TypeError('transducerId must be a non-empty transducer identifier');
  }
  if (!Number.isFinite(observedAtMs) || observedAtMs < 0) {
    throw new RangeError('observedAtMs must be a finite nonnegative simulated time');
  }
  if (arrivedAtMs !== undefined &&
      (!Number.isFinite(arrivedAtMs) || arrivedAtMs < observedAtMs)) {
    throw new RangeError('arrivedAtMs must be finite and no earlier than observation');
  }
  if (measurement === undefined) {
    throw new TypeError('measurement is required; its interpretation belongs to an engine');
  }
  if (incidenceId !== undefined && (typeof incidenceId !== 'string' || !incidenceId)) {
    throw new TypeError('incidenceId must be a non-empty string');
  }
  const incidence = { transducerId, observedAtMs, measurement };
  if (arrivedAtMs !== undefined) incidence.arrivedAtMs = arrivedAtMs;
  if (incidenceId !== undefined) incidence.incidenceId = incidenceId;
  return Object.freeze(incidence);
}