// Diagnostic control: checks delivery and history; does NOT learn units or relations.
export class DiagnosticEngine {
  #timeMs = 0;
  #count = 0;
  #pending = [];
  #lastIncidence = null;

  describe() {
    return { id: 'diagnostic-no-learning', learnsUnits: false, learnsRelations: false };
  }
  ingest(incidence) {
    this.#count++;
    this.#lastIncidence = incidence;
    this.#pending.push({
      type: 'input.received', incidenceId: incidence.incidenceId ?? null,
      transducerId: incidence.transducerId,
      observedAtMs: incidence.observedAtMs,
      arrivedAtMs: incidence.arrivedAtMs ?? incidence.observedAtMs,
    });
  }
  advanceTo(t) {
    if (!Number.isFinite(t) || t < this.#timeMs) throw new RangeError('Engine time reversal');
    this.#timeMs = t;
  }
  snapshot() {
    return {
      timeMs: this.#timeMs, receivedCount: this.#count,
      lastIncidenceId: this.#lastIncidence?.incidenceId ?? null,
      nodeCount: 0, relationCount: 0,
    };
  }
  drainEvents() { return this.#pending.splice(0); }
}