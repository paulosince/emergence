// Comparator: Grow When Required network (Marsland, Shapiro and Nehmzow 2002),
// algorithm as described by Parisi, Weber and Wermter (2015, Frontiers in
// Neurorobotics 9:3, Algorithm 1; read via PMC). Not a candidate.
// Input (declared adaptation, same information as the constitutive engine):
// at each measurement CHANGE of any channel, a vector with one exponentially
// decaying trace per channel (tau 300 ms; channels in order of first appearance,
// zero-padded). Node insertion: activity a = exp(-||x - w_s||) < aT AND
// firing counter h_s < fT; new node at (w_s + x)/2. Otherwise winner and
// neighbours move by eps * h * (x - w). Habituation h(t) = h0 - S/alpha (1 - e^{-alpha t / tau}),
// applied per step. Edges age; removed above aMax; isolated nodes removed.
// Parameters: stationary set of the paper (aT 0.95, eps_b 0.2, eps_n 0.006,
// aMax 50, h0 1, alpha 0.95, tau_b 3.33); tau_n and fT not reported there:
// declared tau_n = 14.3, fT = 0.1 (sources to verify).
export class GwrComparator {
  #p; #nodes = []; #edges = new Map(); #n = 0; #channels = []; #last = new Map(); #lastValue = new Map(); #pending = []; #t = 0;
  constructor(o = {}) { this.#p = { aT: 0.95, epsB: 0.2, epsN: 0.006, aMax: 50, h0: 1, alpha: 0.95, tauB: 3.33, tauN: 14.3, fT: 0.1, traceTauMs: 300, maxNodes: 50000, ...o }; }
  describe() { return { id: 'gwr-comparator', candidate: false, parameters: { ...this.#p } }; }
  #vec(t) { return this.#channels.map(c => { const l = this.#last.get(c); return l === undefined ? 0 : Math.exp(-(t - l) / this.#p.traceTauMs); }); }
  #pad(w, n) { while (w.length < n) w.push(0); return w; }
  #key(a, b) { return a < b ? a + '|' + b : b + '|' + a; }
  ingest(i) {
    this.#t = i.arrivedAtMs;
    const prev = this.#lastValue.get(i.transducerId); this.#lastValue.set(i.transducerId, i.measurement);
    if (prev === undefined || prev === i.measurement) return;
    if (!this.#channels.includes(i.transducerId)) this.#channels.push(i.transducerId);
    this.#last.set(i.transducerId, i.arrivedAtMs);
    const x = this.#vec(i.arrivedAtMs), p = this.#p, N = x.length;
    for (const nd of this.#nodes) this.#pad(nd.w, N);
    if (this.#nodes.length < 2) { this.#nodes.push({ key: 'g' + (++this.#n), w: x.slice(), h: p.h0 }); this.#pending.push({ type: 'unit.created', unit: 'g' + this.#n, delayMs: null, timeMs: i.arrivedAtMs }); return; }
    const d = this.#nodes.map(nd => Math.hypot(...nd.w.map((v, k) => v - x[k])));
    let s = 0, t2 = 1; if (d[1] < d[0]) { s = 1; t2 = 0; }
    for (let k = 2; k < d.length; k++) { if (d[k] < d[s]) { t2 = s; s = k; } else if (d[k] < d[t2]) t2 = k; }
    const S = this.#nodes[s], T = this.#nodes[t2], e = this.#key(S.key, T.key);
    this.#edges.set(e, 0);
    const a = Math.exp(-d[s]);
    if (a < p.aT && S.h < p.fT && this.#nodes.length < p.maxNodes) {
      const r = { key: 'g' + (++this.#n), w: S.w.map((v, k) => (v + x[k]) / 2), h: p.h0 };
      this.#nodes.push(r); this.#edges.delete(e); this.#edges.set(this.#key(r.key, S.key), 0); this.#edges.set(this.#key(r.key, T.key), 0);
      this.#pending.push({ type: 'unit.created', unit: r.key, delayMs: null, timeMs: i.arrivedAtMs });
    } else {
      S.w = S.w.map((v, k) => v + p.epsB * S.h * (x[k] - v));
      for (const [k2] of this.#edges) { const [u, v] = k2.split('|'); const other = u === S.key ? v : v === S.key ? u : null; if (!other) continue;
        const nb = this.#nodes.find(z => z.key === other); if (nb) nb.w = nb.w.map((v2, k) => v2 + p.epsN * nb.h * (x[k] - v2)); }
    }
    // habituation, discrete form of tau dh/dt = alpha (h0 - h) - S(t) (S = 1 for the winner and neighbours)
    const neigh = new Set();
    for (const [k2] of this.#edges) { const [u, v] = k2.split('|'); if (u === S.key) neigh.add(v); if (v === S.key) neigh.add(u); }
    S.h = Math.max(0, S.h + (p.alpha * (p.h0 - S.h) - 1) / p.tauB);
    for (const nd of this.#nodes) if (neigh.has(nd.key)) nd.h = Math.max(0, nd.h + (p.alpha * (p.h0 - nd.h) - 1) / p.tauN);
    for (const [k2, age] of this.#edges) { const [u, v] = k2.split('|'); if (u === S.key || v === S.key) this.#edges.set(k2, age + 1); }
    for (const [k2, age] of [...this.#edges]) if (age > p.aMax) this.#edges.delete(k2);
    const connected = new Set(); for (const k2 of this.#edges.keys()) k2.split('|').forEach(z => connected.add(z));
    if (this.#nodes.length > 2) this.#nodes = this.#nodes.filter(nd => connected.has(nd.key));
    this.#pending.push({ type: 'unit.discharge', unit: S.key, delayMs: null, timeMs: i.arrivedAtMs });
  }
  advanceTo(t) { this.#t = t; }
  drainEvents() { return this.#pending.splice(0); }
  snapshot() { return { timeMs: this.#t, units: this.#nodes.map(nd => ({ key: nd.key, h: nd.h })), edges: this.#edges.size }; }
}
