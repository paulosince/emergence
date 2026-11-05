// RESEARCHER-SIDE audit: checks recorded incidence consistency and leakage.
// It does NOT establish correctness of a physical model or representation.
const INCIDENCE_KEYS = Object.freeze([
  'arrivedAtMs', 'incidenceId', 'measurement', 'observedAtMs', 'transducerId',
]);

export function auditIncidenceTrace(result) {
  if (!result || !result.manifest || !result.summary ||
      !Array.isArray(result.trace) || !Array.isArray(result.incidences)) {
    throw new TypeError('A complete experiment result is required');
  }
  const expectedSensors = new Set(result.manifest.transducers.map(s => s.id));
  const errors = [];
  const seen = new Set();
  const deliveries = result.trace.filter(r => r.type === 'incidence.delivered');
  let previousArrival = -Infinity;
  for (const [index, incidence] of result.incidences.entries()) {
    const keys = Object.keys(incidence).sort();
    if (keys.join('|') !== INCIDENCE_KEYS.join('|')) {
      errors.push('incidence schema differs at index ' + index);
    }
    if (typeof incidence.incidenceId !== 'string' || !incidence.incidenceId) {
      errors.push('invalid incidence identifier at index ' + index);
    }
    if (seen.has(incidence.incidenceId)) {
      errors.push('duplicate incidence identifier ' + incidence.incidenceId);
    }
    seen.add(incidence.incidenceId);
    if (!expectedSensors.has(incidence.transducerId)) {
      errors.push('unexpected sensor ID at index ' + index);
    }
    if (![incidence.arrivedAtMs, incidence.observedAtMs, incidence.measurement]
      .every(Number.isFinite) || incidence.observedAtMs < 0 ||
      incidence.arrivedAtMs < incidence.observedAtMs ||
      incidence.arrivedAtMs > result.manifest.endTimeMs) {
      errors.push('nonphysical or outside-run timestamp/value at index ' + index);
    }
    if (incidence.arrivedAtMs < previousArrival) {
      errors.push('delivered incidence order violates simulated time');
    }
    previousArrival = incidence.arrivedAtMs;
    const trace = deliveries[index];
    if (!trace || trace.incidenceId !== incidence.incidenceId ||
        trace.transducerId !== incidence.transducerId ||
        trace.observedAtMs !== incidence.observedAtMs ||
        trace.arrivedAtMs !== incidence.arrivedAtMs ||
        trace.measurement !== incidence.measurement ||
        trace.timeMs !== incidence.arrivedAtMs) {
      errors.push('delivery trace inconsistency at index ' + index);
    }
  }
  if (deliveries.length !== result.incidences.length ||
      result.summary.deliveredCount !== result.incidences.length) {
    errors.push('delivered incidence count disagrees with trace or summary');
  }
  const samples = result.trace.filter(r => r.type === 'sensor.sample');
  if (samples.length !== result.summary.sampleCount ||
      samples.filter(r => r.emitted).length !== result.summary.emittedCount) {
    errors.push('sample/emission count disagrees with trace or summary');
  }
  return Object.freeze({
    passed: errors.length === 0,
    checkedIncidences: result.incidences.length,
    checkedSampleEvents: samples.length,
    failures: Object.freeze(errors),
  });
}