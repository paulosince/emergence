// Pacemaker unit (approved 09/11/2026; docs/pacemakers-v0.1.md): leaky
// integrator with a constant intrinsic drive, threshold, reset and refractory
// period, so it fires periodically without input. Inputs shift the phase
// (phase response); modulators change the drive (frequency). Event-driven:
// the next spike time is computed in closed form.
//   dV/dt = -V/tauMs + drive  ->  V(t) = drive*tau*(1 - e^{-t/tau}) + V0 e^{-t/tau}
export class PacemakerUnit {
  #tau; #theta; #ref; #drive; #v = 0; #t = 0; #refUntil = 0; #spikes = [];
  constructor({ tauMs = 20, threshold = 1, refractoryMs = 2, drive = 0.1 } = {}) {
    if (!(tauMs > 0 && threshold > 0 && refractoryMs >= 0)) throw new RangeError('invalid pacemaker parameters');
    this.#tau = tauMs; this.#theta = threshold; this.#ref = refractoryMs; this.#drive = drive;
  }
  get drive() { return this.#drive; }
  // Intrinsic period (ms) from reset; Infinity below rheobase (drive*tau <= threshold).
  intrinsicPeriodMs(drive = this.#drive) {
    const vInf = drive * this.#tau;
    return vInf <= this.#theta ? Infinity : this.#ref + -this.#tau * Math.log(1 - this.#theta / vInf);
  }
  #timeToThreshold(v0) {
    const vInf = this.#drive * this.#tau;
    if (v0 >= this.#theta) return 0;
    if (vInf <= this.#theta) return Infinity;
    return -this.#tau * Math.log((vInf - this.#theta) / (vInf - v0));
  }
  #evolve(dt) { const e = Math.exp(-dt / this.#tau); this.#v = this.#drive * this.#tau * (1 - e) + this.#v * e; }
  nextSpikeMs() { const start = Math.max(this.#t, this.#refUntil); return start + this.#timeToThreshold(this.#v); }
  // Advance to tMs, emitting spikes; returns spike times in (previous t, tMs].
  advanceTo(tMs) {
    if (tMs < this.#t) throw new RangeError('Pacemaker time reversal');
    const out = [];
    for (;;) {
      if (this.#t < this.#refUntil) { if (tMs <= this.#refUntil) { this.#t = tMs; break; } this.#t = this.#refUntil; }
      const ts = this.#t + this.#timeToThreshold(this.#v);
      if (ts > tMs) { this.#evolve(tMs - this.#t); this.#t = tMs; break; }
      // reset by subtraction: a large input yields a burst separated by the refractory period
      this.#t = ts; this.#v = this.#v >= this.#theta ? this.#v - this.#theta : 0; this.#refUntil = ts + this.#ref; out.push(ts); if (this.#spikes.length < 10000) this.#spikes.push(ts); // bounded record
    }
    return out;
  }
  // Input at the current time (after advanceTo): instantaneous voltage jump.
  input(weight) { if (this.#t >= this.#refUntil) this.#v = Math.max(0, this.#v + weight); }
  // Modulation: change drive from now on (e.g. clock phase, neuromodulators).
  setDrive(drive) { if (!(drive >= 0)) throw new RangeError('drive must be >= 0'); this.#drive = drive; }
  spikes() { return [...this.#spikes]; }
  getState() { return { v: this.#v, t: this.#t, refUntil: this.#refUntil, drive: this.#drive }; }
  setState(x) { this.#v = x.v; this.#t = x.t; this.#refUntil = x.refUntil; this.#drive = x.drive; }
}
