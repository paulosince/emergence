// Researcher-side consistency check for the explicitly nonlearning control.
// This does not audit arbitrary learning-engine semantics.
export function auditDiagnosticDelivery(result) {
  if (result?.manifest?.engine?.id !== 'diagnostic-no-learning') {
    throw new TypeError('Diagnostic delivery audit requires a diagnostic control');
  }
  const errors = [];
  const snapshot = result.finalSnapshot;
  const ids = result.incidences.map(i => i.incidenceId);
  const engineEvents = result.trace.filter(r => r.type === 'engine.event' &&
    r.detail?.type === 'input.received');
  if (snapshot.receivedCount !== ids.length) {
    errors.push('diagnostic receivedCount differs from delivered incidences');
  }
  if (snapshot.lastIncidenceId !== (ids.at(-1) ?? null)) {
    errors.push('diagnostic last incidence differs from delivered record');
  }
  if (snapshot.timeMs !== result.manifest.endTimeMs) {
    errors.push('diagnostic end time differs from run horizon');
  }
  if (snapshot.nodeCount !== 0 || snapshot.relationCount !== 0) {
    errors.push('nonlearning diagnostic unexpectedly reports constituted structure');
  }
  if (engineEvents.length !== ids.length) {
    errors.push('diagnostic event count differs from delivered incidences');
  }
  for (let i = 0; i < ids.length; i++) {
    const event = engineEvents[i]?.detail;
    const incidence = result.incidences[i];
    if (!event || event.incidenceId !== incidence.incidenceId ||
        event.transducerId !== incidence.transducerId ||
        event.arrivedAtMs !== incidence.arrivedAtMs ||
        event.observedAtMs !== incidence.observedAtMs) {
      errors.push('diagnostic ingest event differs at position ' + i);
    }
  }
  return Object.freeze({
    passed: errors.length === 0, ingestions: engineEvents.length,
    failures: Object.freeze(errors),
  });
}