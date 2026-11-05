// Diagnostic control: checks delivery and history; does NOT learn units or relations.
export class DiagnosticEngine {
  #timeMs = 0;
  #count = 0;
  #pending = [];
  #lastIncidence = null;

  checkpoint() {
    return {
      timeMs:this.#timeMs,receivedCount:this.#count,
      pending:structuredClone(this.#pending),
      lastIncidence:this.#lastIncidence === null
        ? null : structuredClone(this.#lastIncidence),
    };
  }
  restore(state) {
    if(!state || !Number.isFinite(state.timeMs) ||
       state.timeMs<0 || !Number.isInteger(state.receivedCount) ||
       state.receivedCount<0 || !Array.isArray(state.pending) ||
       (state.lastIncidence!==null &&
         (!state.lastIncidence || typeof state.lastIncidence!=='object'))) {
      throw new RangeError('Invalid diagnostic engine checkpoint');
    }
    this.#timeMs=state.timeMs;this.#count=state.receivedCount;
    this.#pending=structuredClone(state.pending);
    this.#lastIncidence=state.lastIncidence===null?null:
      structuredClone(state.lastIncidence);
  }
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