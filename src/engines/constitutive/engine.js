// Constitutive engine, increment 1: finite substrate and recruitment.
// Decisions of 09/11/2026 (docs/decisions-log.md):
//   * incidence = (source, instant); an event is a CHANGE of a channel's
//     measurement (content-neutral: the engine never interprets values);
//   * multiscale traces per source (0.1 s, 3 s, 90 s, 45 min), same rule for all;
//   * coincidence between DISTINCT sources with the lived delay as content;
//   * accommodation test: an existing unit that responds (same afferent pair,
//     delay within tolerance) discharges; otherwise a new unit is RECRUITED;
//   * recruitment from a FINITE substrate of pre-existing elements placed in
//     constitutive 3D space; candidates near the afferent sources (wiring
//     economy); allocation to the most EXCITABLE candidates (Josselyn and
//     Tonegawa 2020); recent allocation raises excitability, so temporally
//     close memories share elements (Rashid et al. 2016); excitability also
//     fluctuates slowly (piecewise constant, seeded), so distant memories
//     tend to recruit different elements;
//   * every unit records its allocation: elements, afferents, causing
//     incidences (criterion of registered origin).
// Not yet (later increments): cascade stability and decay, modulatory gate,
// receptors, lateral inhibition, predefined levels, sleep phase.
import { makeRng } from '../../../vendor/tempo/core/rng.js';

export const DEFAULTS = Object.freeze({
  substrateSize: 1000, substrateSideUm: 400, unitSize: 4,
  traceScalesMs: [100, 3000, 90000, 2700000], traceThreshold: 0.2,
  delayTolFrac: 0.05, delayTolMinMs: 2, maxDelayMs: 2700000 * 2,
  recruitRadiusUm: 60, excitabilitySd: 0.1, recentBoost: 0.3, recentTauMs: 6 * 3600 * 1000,
  fluctuationSd: 0.1, fluctuationPeriodMs: 12 * 3600 * 1000,
  maxCandidatesPerEvent: 64,
});

export class ConstitutiveEngine {
  #p; #rng; #t = 0; #pending = [];
  #lastValue = new Map(); #sources = new Map(); // id -> {last, traces[], tTrace, pos}
  #elements; #grid = new Map(); #cell;
  #units = []; #byPair = new Map(); #n = 0; #failed = 0;
  constructor(options = {}) {
    this.#p = Object.freeze({ ...DEFAULTS, ...options });
    const p = this.#p;
    this.#rng = makeRng(options.seed ?? 1);
    this.#cell = p.recruitRadiusUm;
    this.#elements = Array.from({ length: p.substrateSize }, (_, i) => {
      const pos = [0, 1, 2].map(() => this.#rng.random() * p.substrateSideUm);
      const e = { id: i, pos, base: 1 + p.excitabilitySd * this.#rng.normal(), lastAlloc: -Infinity, units: 0 };
      const key = this.#cellKey(pos);
      if (!this.#grid.has(key)) this.#grid.set(key, []);
      this.#grid.get(key).push(e);
      return e;
    });
  }
  describe() { return { id: 'constitutive-engine-v0-increment-1', candidate: true, parameters: { ...this.#p } }; }
  #cellKey(pos) { return pos.map(v => Math.floor(v / this.#cell)).join(','); }
  #fluctuation(e, t) {
    const epoch = Math.floor(t / this.#p.fluctuationPeriodMs);
    const r = makeRng((this.#p.seed ?? 1) * 1000003 + e.id * 7919 + epoch * 104729);
    return this.#p.fluctuationSd * r.normal();
  }
  #excitability(e, t) {
    return e.base + this.#fluctuation(e, t) + this.#p.recentBoost * Math.exp(-(t - e.lastAlloc) / this.#p.recentTauMs);
  }
  #source(id) {
    if (!this.#sources.has(id)) {
      // channels without declared anatomy: opaque random site (seeded)
      const pos = this.#p.channelAnatomy?.[id] ?? [0, 1, 2].map(() => this.#rng.random() * this.#p.substrateSideUm);
      this.#sources.set(id, { last: -Infinity, traces: this.#p.traceScalesMs.map(() => 0), tTrace: 0, pos });
    }
    return this.#sources.get(id);
  }
  #decay(s, t) {
    const dt = t - s.tTrace;
    if (dt > 0) { s.traces = s.traces.map((v, k) => v * Math.exp(-dt / this.#p.traceScalesMs[k])); s.tTrace = t; }
  }
  ingest(i) {
    if (i.arrivedAtMs < this.#t) throw new RangeError('Incidence in the past');
    this.#t = i.arrivedAtMs;
    const prev = this.#lastValue.get(i.transducerId);
    this.#lastValue.set(i.transducerId, i.measurement);
    if (prev === undefined || prev === i.measurement) return; // only changes are events
    this.#event(i.transducerId, i.arrivedAtMs, { incidence: { transducerId: i.transducerId, arrivedAtMs: i.arrivedAtMs } });
  }
  #event(sourceId, t, cause) {
    const s = this.#source(sourceId), p = this.#p;
    // For each other source r: does an existing unit accommodate the lived
    // delay of the pair (r -> s)? If yes it discharges; if not, and r's trace
    // is above threshold at some scale, the coincidence recruits a new unit.
    const pairs = this.#byPair.get(sourceId);
    const candidates = [];
    for (const [rid, r] of this.#sources) {
      if (rid === sourceId || !Number.isFinite(r.last)) continue;
      const lived = t - r.last;
      if (lived <= 0 || lived > p.maxDelayMs) continue;
      let matched = false;
      for (const u of pairs?.get(rid) ?? []) {
        if (Math.abs(lived - u.delayMs) <= Math.max(p.delayTolMinMs, p.delayTolFrac * u.delayMs)) {
          u.discharges++; u.lastDischargeMs = t; matched = true;
          this.#pending.push({ type: 'unit.discharge', unit: u.key, delayMs: u.delayMs, livedMs: lived, timeMs: t });
        }
      }
      if (matched) continue;
      this.#decay(r, t);
      const k = r.traces.findIndex(v => v >= p.traceThreshold);
      if (k >= 0) candidates.push({ rid, lived, scaleMs: p.traceScalesMs[k] });
    }
    candidates.sort((a, b) => a.lived - b.lived);
    for (const c of candidates.slice(0, p.maxCandidatesPerEvent)) this.#recruit(c.rid, sourceId, c.lived, c.scaleMs, t, cause);
    // 3. update own trace and last time
    this.#decay(s, t);
    s.traces = s.traces.map(v => v + 1);
    s.last = t;
  }
  #nearElements(center, radius) {
    const out = [], c = center.map(v => Math.floor(v / this.#cell)), span = Math.ceil(radius / this.#cell);
    for (let dx = -span; dx <= span; dx++) for (let dy = -span; dy <= span; dy++) for (let dz = -span; dz <= span; dz++) {
      for (const e of this.#grid.get([c[0] + dx, c[1] + dy, c[2] + dz].join(',')) ?? []) {
        if (Math.hypot(e.pos[0] - center[0], e.pos[1] - center[1], e.pos[2] - center[2]) <= radius) out.push(e);
      }
    }
    return out;
  }
  #recruit(first, second, lived, scaleMs, t, cause) {
    const p = this.#p, a = this.#sources.get(first).pos, b = this.#sources.get(second).pos;
    const center = [0, 1, 2].map(k => (a[k] + b[k]) / 2);
    let pool = [], radius = p.recruitRadiusUm;
    while (pool.length < p.unitSize && radius <= p.substrateSideUm * 2) { pool = this.#nearElements(center, radius); radius *= 2; }
    if (pool.length < p.unitSize) { this.#failed++; this.#pending.push({ type: 'recruitment.failed', timeMs: t, reason: 'substrate exhausted near sources' }); return; }
    const ex = new Map(pool.map(e => [e, this.#excitability(e, t)]));
    pool.sort((x, y) => ex.get(y) - ex.get(x) || x.id - y.id);
    const chosen = pool.slice(0, p.unitSize);
    const shared = chosen.filter(e => e.units > 0).length;
    for (const e of chosen) { e.lastAlloc = t; e.units++; }
    const u = { key: 'u' + (++this.#n), afferents: [first, second], delayMs: lived, scaleMs, elements: chosen.map(e => e.id),
      createdAtMs: t, discharges: 0, level: 0, origin: { cause, sharedElements: shared } };
    this.#units.push(u);
    if (!this.#byPair.has(second)) this.#byPair.set(second, new Map());
    const m = this.#byPair.get(second);
    if (!m.has(first)) m.set(first, []);
    m.get(first).push(u);
    this.#pending.push({ type: 'unit.created', unit: u.key, delayMs: lived, afferents: [first, second], elements: u.elements, timeMs: t });
  }
  advanceTo(t) { if (t < this.#t) throw new RangeError('Engine time reversal'); this.#t = t; }
  drainEvents() { return this.#pending.splice(0); }
  ablate(key) {
    const u = this.#units.find(x => x.key === key);
    if (!u) return;
    this.#units = this.#units.filter(x => x !== u);
    const list = this.#byPair.get(u.afferents[1])?.get(u.afferents[0]);
    if (list) list.splice(list.indexOf(u), 1);
    for (const id of u.elements) this.#elements[id].units--;
  }
  snapshot() {
    return { timeMs: this.#t, units: this.#units.map(u => ({ ...u, afferents: [...u.afferents], elements: [...u.elements] })),
      substrate: { size: this.#elements.length, occupied: this.#elements.filter(e => e.units > 0).length, recruitmentFailures: this.#failed },
      sources: [...this.#sources.keys()] };
  }
}
