// Constitutive 3D coordinates (approved 09/11/2026; docs/spatial-diffusion-v0.1.md).
// Positions are produced by the ENGINE's own rules, never by the observer's
// layouts. Rules:
//   * channels: placed by sensor anatomy (given positions); opaque control
//     shuffles the assignment with a declared seed;
//   * new units: born near their afferent sources (wiring economy:
//     Chklovskii et al. 2002), at the centroid plus seeded Gaussian scatter;
//   * fixed architectural sites (e.g. modulatory sources) by declaration.
// Variant (approved): conduction latency derived from distance,
//   latency = distance / velocity + synapticDelay.
// Null for the domain-organisation hypothesis: the same positions shuffled
// among units (shuffledCopy).
import { makeRng } from '../../vendor/tempo/core/rng.js';

export class ConstitutiveSpace {
  #pos = new Map(); #origin = new Map(); #rng; #scatter;
  constructor({ seed = 1, scatterUm = 5 } = {}) { this.#rng = makeRng(seed); this.#scatter = scatterUm; }
  #set(id, p, origin) {
    if (this.#pos.has(id)) throw new RangeError('Position already constituted: ' + id);
    if (!(Array.isArray(p) && p.length === 3 && p.every(Number.isFinite))) throw new RangeError('position must be [x,y,z]');
    this.#pos.set(id, Object.freeze([...p])); this.#origin.set(id, origin);
  }
  // Channels by anatomy; opaque: shuffle which channel gets which anatomical site.
  placeChannels(anatomy, { opaqueSeed = null } = {}) {
    const ids = Object.keys(anatomy), sites = ids.map(id => anatomy[id]);
    if (opaqueSeed !== null) {
      const r = makeRng(opaqueSeed);
      for (let i = sites.length - 1; i > 0; i--) { const j = Math.floor(r.random() * (i + 1)); [sites[i], sites[j]] = [sites[j], sites[i]]; }
    }
    ids.forEach((id, k) => this.#set(id, sites[k], { rule: opaqueSeed === null ? 'anatomy' : 'anatomy-shuffled' }));
  }
  placeFixed(id, p, note = 'architecture') { this.#set(id, p, { rule: 'fixed', note }); }
  // New unit near its afferent sources.
  placeNearAfferents(id, afferentIds) {
    if (!afferentIds.length) throw new RangeError('a unit needs at least one afferent source');
    const ps = afferentIds.map(a => { const p = this.#pos.get(a); if (!p) throw new RangeError('afferent without position: ' + a); return p; });
    const c = [0, 1, 2].map(k => ps.reduce((s, p) => s + p[k], 0) / ps.length + this.#scatter * this.#rng.normal());
    this.#set(id, c, { rule: 'near-afferents', afferents: [...afferentIds] });
    return c;
  }
  position(id) { return this.#pos.get(id) ?? null; }
  origin(id) { return this.#origin.get(id) ?? null; }
  distanceUm(a, b) { const p = this.#pos.get(a), q = this.#pos.get(b); if (!p || !q) throw new RangeError('unknown id'); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); }
  latencyMs(a, b, { velocityMPerS = 1, synapticDelayMs = 0.5 } = {}) {
    // um / (m/s) = 1e-6 m / (m/s) = 1e-6 s = 1e-3 ms
    return (this.distanceUm(a, b) * 1e-3) / velocityMPerS + synapticDelayMs;
  }
  ids() { return [...this.#pos.keys()]; }
  // Null: same set of positions, randomly reassigned among the given ids.
  shuffledCopy(ids, seed) {
    const r = makeRng(seed), ps = ids.map(id => this.#pos.get(id));
    for (let i = ps.length - 1; i > 0; i--) { const j = Math.floor(r.random() * (i + 1)); [ps[i], ps[j]] = [ps[j], ps[i]]; }
    const out = new ConstitutiveSpace({ seed, scatterUm: this.#scatter });
    ids.forEach((id, k) => out.placeFixed(id, ps[k], 'shuffled-null'));
    return out;
  }
}
