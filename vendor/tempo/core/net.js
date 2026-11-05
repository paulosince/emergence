// TEMPO core model: an attributed digraph that starts with no links.
//
// Nodes (C1): leaky integrators that emit a discrete event when the potential
//   reaches threshold, followed by a refractory period.
// Links: weight w and two latency segments, ta (source -> junction) and
//   td (junction -> target). Total latency = ta + td.
// Local rules, applied at each event:
//   C2  order- and interval-sensitive, persistent weight change
//       (post-event: potentiate/adjust; pre-event after post: depress)
//   C3  link creation on pre-before-post co-activity; pruning below wMin
//   C4  latency function: 'shift'  = move latency toward the lived interval
//                          'select' = random fixed latency, keep only matches
//                          'fixed'  = ablation, no latency function at all
//   K   out-degree bound: a simulation parameter, not a criterion (bounded degree is
//       not required; it only makes 'select' precise)
//   Consolidation: consolidated links resist change (needed for persistence).
//
// Times are in milliseconds. The simulation is event-driven.

import { EventHeap } from './heap.js';

export const DEFAULTS = {
  L: 100,        // latency range for new links (ms), drawn from [2, L]
  tol: 3,        // tolerance for "latency matches the lived interval" (ms)
  W: 120,        // plasticity / co-activity window (ms)
  theta: 1.0,    // firing threshold
  wMax: 1.2,     // weight ceiling (above theta: one consolidated link can fire its target)
  wInit: 0.3,    // weight of a newly created link (below theta)
  tw: 5,         // integration time constant of nodes (ms)
  tr: 5,         // refractory period (ms)
  wMin: 0.05,    // pruning threshold
  dep: 0.5,      // depression factor
  consol: true,  // consolidation on/off
};

export class Net {
  constructor(N, K, mode, eta, rng, params = {}) {
    Object.assign(this, DEFAULTS, params);
    this.N = N; this.K = K; this.mode = mode; this.eta = eta; this.rng = rng;
    this.out = Array.from({ length: N }, () => []);
    this.inn = Array.from({ length: N }, () => []);
    this.V = new Float64Array(N);
    this.tV = new Float64Array(N);
    this.last = new Float64Array(N).fill(-1e9);
    this.q = new EventHeap(); this.seq = 0;
    this.learn = true;
    this.fires = [];          // [time, node]
    this.record = true;
  }

  // ---------- structure ----------
  addLink(i, j, tau) {
    const a = tau / 2;
    const l = { i, j, w: this.wInit, ta: a, td: tau - a };
    this.out[i].push(l); this.inn[j].push(l);
    return l;
  }
  dropLink(l) {
    this.out[l.i].splice(this.out[l.i].indexOf(l), 1);
    this.inn[l.j].splice(this.inn[l.j].indexOf(l), 1);
  }
  links() { return this.out.flat(); }
  nLinks() { return this.out.reduce((s, o) => s + o.length, 0); }

  // consolidation factor: consolidated links resist change
  cf(l) { return this.consol ? (1 - Math.min(l.w, this.wMax) / this.wMax) ** 2 : 1; }

  // ---------- events ----------
  push(t, kind, n, w = 0) { this.q.push({ t, seq: ++this.seq, kind, n, w }); }

  runUntil(T) {
    while (this.q.size && this.q.peekTime() <= T) {
      const { t, kind, n, w } = this.q.pop();
      if (kind === 'f') {                       // forced (external) event
        if (t - this.last[n] >= this.tr) this.fire(n, t);
      } else {                                  // arrival through a link
        this.V[n] = this.V[n] * Math.exp(-(t - this.tV[n]) / this.tw) + w;
        this.tV[n] = t;
        if (this.V[n] >= this.theta && t - this.last[n] >= this.tr) this.fire(n, t);
      }
    }
  }

  fire(j, t) {
    this.V[j] = 0; this.tV[j] = t;
    if (this.record) this.fires.push([t, j]);
    if (this.learn) this.plasticity(j, t);
    this.last[j] = t;
    for (const l of this.out[j]) this.push(t + l.ta + l.td, 'a', l.j, l.w);
  }

  // ---------- plasticity (C2-C4) ----------
  plasticity(j, t) {
    const eta = this.eta;
    // j as target: links i->j whose source fired before
    for (const l of [...this.inn[j]]) {
      const dPre = t - this.last[l.i];
      if (!(dPre > 0 && dPre <= this.W)) continue;
      const e = dPre - (l.ta + l.td);            // lived interval minus current latency
      if (this.mode === 'shift') {
        const g = (eta * e) / 2 * this.cf(l);
        l.ta = Math.max(0.5, l.ta + g); l.td = Math.max(0.5, l.td + g);
        l.w += eta * (this.wMax - l.w) * Math.exp(-Math.abs(e) / this.tol);
        if (Math.abs(e) > this.tol) l.w -= eta * 0.1 * this.cf(l);
      } else if (this.mode === 'fixed') {        // ablation: no latency function
        l.w += eta * (this.wMax - l.w);
      } else {                                   // 'select'
        if (Math.abs(e) <= this.tol) l.w += eta * (this.wMax - l.w);
        else l.w -= eta * this.dep * this.cf(l);
      }
      if (l.w < this.wMin) this.dropLink(l);
    }
    // j as source: links j->k whose target fired shortly before (reverse order)
    for (const l of [...this.out[j]]) {
      const dPost = t - this.last[l.j];
      if (dPost > 0 && dPost <= this.W) {
        l.w -= eta * this.dep * this.cf(l);
        if (l.w < this.wMin) this.dropLink(l);
      }
    }
    // creation (C3), up to the out-degree parameter K
    for (let i = 0; i < this.N; i++) {
      if (i === j) continue;
      const d = t - this.last[i];
      if (!(d > 0 && d <= this.W)) continue;
      const free = this.K - this.out[i].length;
      if (free <= 0) continue;
      if (this.mode === 'shift') {
        if (!this.out[i].some((l) => l.j === j)) this.addLink(i, j, this.rng.uniform(2, this.L));
      } else {
        for (let k = 0; k < free; k++) this.addLink(i, j, this.rng.uniform(2, this.L));
      }
    }
  }

  // Copy of the structure for probing (learning off, empty queue, nodes at rest).
  probeCopy() {
    const c = new Net(this.N, this.K, this.mode, this.eta, this.rng, {
      L: this.L, tol: this.tol, W: this.W, theta: this.theta, wMax: this.wMax, wInit: this.wInit,
      tw: this.tw, tr: this.tr, wMin: this.wMin, dep: this.dep, consol: this.consol,
    });
    for (const l of this.links()) {
      const m = c.addLink(l.i, l.j, 1); m.w = l.w; m.ta = l.ta; m.td = l.td;
    }
    c.learn = false;
    return c;
  }
}
