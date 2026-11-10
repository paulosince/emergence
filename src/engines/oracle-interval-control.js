// CALIBRATION CONTROLS ONLY — not candidates for autonomous constitution.
// OracleIntervalControl is TOLD by the designer which two channels matter
// (the upper and lower photogates) and which value means "beam blocked".
// It creates a unit for each novel lived interval between the two channels
// (tolerance tolMs) and discharges the matching unit. It exists to check that
// pre-registered thresholds are attainable (positive control).
// With randomDelays:true it assigns random delays instead (negative control).
// With createAlways:true it never reuses a unit: one new unit per interval
// (negative control for FORMATION: tracks the referent but constitutes nothing
// reusable; the 'criar sempre' ablation of the pre-registration).
// Independent stream: must NOT share the world's schedule stream (a shared
// seed made 'random' delays an affine function of the heights; caught in
// calibration v1).
import { sensorRandomStream } from '../runtime/seed-stream.js';

export class OracleIntervalControl {
  #first; #second; #blocked; #tol; #units = []; #pending = []; #last = null; #time = 0; #n = 0;
  #random; #rng; #always;
  constructor({ first = 's0', second = 's1', blockedValue = 0, tolMs = 5, randomDelays = false, createAlways = false, seed = 0 } = {}) {
    this.#always = createAlways;
    this.#first = first; this.#second = second; this.#blocked = blockedValue; this.#tol = tolMs;
    this.#random = randomDelays; this.#rng = sensorRandomStream(seed, 'oracle-random-delays');
  }
  describe() { return { id: this.#always ? 'oracle-create-always-negative-control' : this.#random ? 'oracle-random-delay-negative-control' : 'oracle-interval-positive-control',
    designerKnowledge: ['relevant channel pair', 'blocked value'], candidate: false }; }
  ingest(i) {
    if (i.measurement !== this.#blocked) return;
    if (i.transducerId === this.#first) { this.#last = i.arrivedAtMs; return; }
    if (i.transducerId !== this.#second || this.#last === null) return;
    const lived = this.#random ? this.#rng.uniform(70, 175) : i.arrivedAtMs - this.#last;
    this.#last = null;
    let u = this.#always ? null : this.#units.find(x => Math.abs(x.delayMs - lived) <= this.#tol);
    if (!u) {
      u = { key: 'u' + (++this.#n), delayMs: lived, createdAtMs: i.arrivedAtMs, discharges: 0 };
      this.#units.push(u);
      this.#pending.push({ type: 'unit.created', unit: u.key, delayMs: lived, timeMs: i.arrivedAtMs });
    }
    u.discharges++;
    this.#pending.push({ type: 'unit.discharge', unit: u.key, delayMs: u.delayMs, timeMs: i.arrivedAtMs });
  }
  advanceTo(t) { this.#time = t; }
  drainEvents() { return this.#pending.splice(0); }
  snapshot() { return { timeMs: this.#time, units: this.#units.map(u => ({ ...u })) }; }
  ablate(key) { this.#units = this.#units.filter(u => u.key !== key); }
}
