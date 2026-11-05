// Scientific time is independent of performance.now(), Date and animation frames.
export class SimulatedClock {
  #timeMs;
  constructor(startMs = 0) {
    if (!Number.isFinite(startMs) || startMs < 0) {
      throw new RangeError('startMs must be a finite nonnegative number');
    }
    this.#timeMs = startMs;
  }
  get timeMs() { return this.#timeMs; }
  advanceTo(timeMs) {
    if (!Number.isFinite(timeMs) || timeMs < this.#timeMs) {
      throw new RangeError('Simulation time cannot go backwards or become nonfinite');
    }
    this.#timeMs = timeMs;
    return this.#timeMs;
  }
}