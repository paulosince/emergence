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
import { PacemakerUnit } from '../../rhythm/pacemaker.js';
import { createClockEnsemble } from '../../rhythm/clock.js';

export { DEFAULTS, PARAMETERS } from './parameters.js';
import { DEFAULTS, checkOverrides } from './parameters.js';

export class ConstitutiveEngine {
  #p; #check; #rng; #t = 0; #pending = [];
  #lastValue = new Map(); #sources = new Map(); // id -> {last, traces[], tTrace, pos}
  #elements; #grid = new Map(); #cell;
  #units = []; #unitByKey = new Map(); #byPair = new Map(); #n = 0; #failed = 0;
  #tags = []; #react = []; #pm; #lastBurst = -Infinity; #expect = []; #surprises = 0; #fulfilled = 0; #surpriseSum = 0; #firings = 0;
  #clock = null; #clockPm = null; #rateEma = 0; #lastClockSpike = null; #clockSpikes = 0; #state = 'awake'; #sleepEpisodes = 0;
  #nextReact = 0; #reactivations = 0; #ach = 0; #tAch = 0; #recentDis = 0; #recentSur = 0; #c = 0; #tc = 0; #des = 0; #tdes = 0; #pruned = 0; #lastSweep = 0; #spikes = 0;
  constructor(options = {}) {
    this.#check = checkOverrides(options);
    this.#p = Object.freeze({ ...DEFAULTS, ...options });
    const p = this.#p;
    this.#rng = makeRng(options.seed ?? 1);
    this.#cell = p.recruitRadiusUm;
    this.#pm = new PacemakerUnit(p.noveltyPacemaker);
    if (p.clock) {
      this.#clock = createClockEnsemble({ cells: p.clock.cells ?? 10, seed: options.seed ?? 1, timeScale: p.clock.timeScale ?? 1 });
      this.#clockPm = new PacemakerUnit({ tauMs: 200, threshold: 1, refractoryMs: 5, drive: 0.01 });
    }
    this.#elements = Array.from({ length: p.substrateSize }, (_, i) => {
      const pos = [0, 1, 2].map(() => this.#rng.random() * p.substrateSideUm);
      const e = { id: i, pos, base: 1 + p.excitabilitySd * this.#rng.normal(), lastAlloc: -Infinity, units: 0 };
      const key = this.#cellKey(pos);
      if (!this.#grid.has(key)) this.#grid.set(key, []);
      this.#grid.get(key).push(e);
      return e;
    });
  }
  describe() { return { id: 'constitutive-engine-v0-increment-4', candidate: true, parameters: { ...this.#p }, changedFromPreregistration: this.#check.changed, exploratory: this.#check.exploratory }; }
  #cellKey(pos) { return pos.map(v => Math.floor(v / this.#cell)).join(','); }
  #firstWeight(u) { const p = this.#p; return Math.min(0.95, p.firstWeightInit + p.firstWeightPerLevel * u.level); }
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
      const unit = this.#unitByKey?.get(id);
      const pos = unit ? [0, 1, 2].map(k => unit.elements.reduce((a, e) => a + this.#elements[e].pos[k], 0) / unit.elements.length)
        : this.#p.channelAnatomy?.[id] ?? [0, 1, 2].map(() => this.#rng.random() * this.#p.substrateSideUm);
      this.#sources.set(id, { last: -Infinity, traces: this.#p.traceScalesMs.map(() => 0), tTrace: 0, pos, level: unit ? unit.hierLevel : 0 });
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
    this.#modulator(i.arrivedAtMs);
    this.#checkExpectations(i.arrivedAtMs);
    this.#cycle(i.arrivedAtMs);
    if (this.#clock && i.transducerId === this.#p.clock.lightChannel) this.#clock.setLight(Number(i.measurement) > 0 ? (this.#p.clock.lightGain ?? 0.01) : 0);
    const prev = this.#lastValue.get(i.transducerId);
    if (this.#state === 'asleep') { this.#lastValue.set(i.transducerId, i.measurement); return; } // sensory gating in sleep
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
    const candidates = [], matches = [];
    let accommodatedPairs = 0;
    for (const [rid, r] of this.#sources) {
      if (rid === sourceId || !Number.isFinite(r.last)) continue;
      const lived = t - r.last;
      if (lived <= 0 || lived > p.maxDelayMs) continue;
      let matched = false;
      for (const u of pairs?.get(rid) ?? []) {
        if (p.integration) {
          // integrating unit (soma): the first afferent's incidence arrived via the
          // relation's latency (delay - lead) and left the unit PREPARED; the second
          // afferent's incidence adds now; the unit fires if the sum crosses threshold
          const lead = Math.max(p.delayTolMinMs, p.delayTolFrac * u.delayMs), tau = 4.93 * lead;
          const arrival = r.last + u.delayMs - lead, since = t - arrival;
          if (since < 0) continue;
          const prep = this.#firstWeight(u) * Math.exp(-since / tau);
          if (prep + p.secondWeight >= 1) { matches.push({ u, lived, err: -prep, prep }); matched = true; }
        } else {
          const err = Math.abs(lived - u.delayMs);
          if (err <= Math.max(p.delayTolMinMs, p.delayTolFrac * u.delayMs)) { matches.push({ u, lived, err: err / Math.max(1, u.delayMs), prep: null }); matched = true; }
        }
      }
      if (matched) { accommodatedPairs++; continue; }
      this.#decay(r, t);
      const k = r.traces.findIndex(v => v >= p.traceThreshold);
      if (k >= 0 && (r.level ?? 0) < p.maxLevel) candidates.push({ rid, lived, scaleMs: p.traceScalesMs[k] });
    }
    // lateral inhibition: the most PREPARED (best-matching) unit of each pair wins
    matches.sort((x, y) => x.err - y.err);
    const perPair = new Set(), winners = [];
    for (const m of matches) {
      const pk = m.u.afferents[0];
      if (perPair.has(pk)) continue;
      perPair.add(pk); winners.push(m);
      if (winners.length >= p.maxDischargesPerEvent) break;
    }
    this.#recentDis += winners.length;
    let unprepared = 0;
    for (const { u, lived, prep } of winners) {
      // surprise = firing without preparation (CLEAR): 1 - preparation before the volley
      if (prep !== null) { const sur = Math.max(0, 1 - prep); /* threshold = 1 */ u.lastSurprise = sur; this.#surpriseSum += sur; this.#firings++; if (sur > 0.5) unprepared++; }
      u.discharges++; u.lastDischargeMs = t;
      if (p.cascade) { u.strength = 1; u.tTouch = t; this.#react.push({ u, t }); }
      // any discharge of the pair fulfils the pair's expectation (even by a not-yet-consolidated unit)
      const before = this.#expect.length;
      this.#expect = this.#expect.filter(x => !(x.first === u.afferents[0] && x.second === u.afferents[1] && t >= x.from));
      this.#fulfilled += before - this.#expect.length;
      this.#pending.push({ type: 'unit.discharge', unit: u.key, delayMs: u.delayMs, livedMs: lived, timeMs: t });
    }
    candidates.sort((a, b) => a.lived - b.lived);
    const chosen = candidates.slice(0, p.maxCandidatesPerEvent);
    if (!p.gating) for (const c of chosen) this.#recruit(c.rid, sourceId, c.lived, c.scaleMs, t, cause);
    else if (chosen.length) {
      // three-factor rule: coincidence leaves an eligibility tag; a novelty
      // signal (nothing accommodated the coincidence) drives the novelty source
      for (const c of chosen) this.#tags.push({ first: c.rid, second: sourceId, lived: c.lived, scaleMs: c.scaleMs, t, cause });
      if (this.#tags.length > p.maxTags) this.#tags.splice(0, this.#tags.length - p.maxTags);
      // phasic novelty response; a minimum interval between bursts (proposal)
      const novelty = p.gradedNovelty ? chosen.length / (chosen.length + accommodatedPairs) : 1;
      if (t - this.#lastBurst >= p.burstRefractoryMs) { this.#lastBurst = t; this.#pm.input(p.noveltyInput * novelty); this.#modulator(t); }
    }
    // 3. update own trace and last time
    this.#decay(s, t);
    s.traces = s.traces.map(v => v + 1);
    s.last = t;
    // expectations (estado de espera): consolidated units whose first afferent fired
    if (p.integration && unprepared && this.#state === 'awake' && t - this.#lastBurst >= p.burstRefractoryMs) {
      this.#lastBurst = t; this.#recentSur += unprepared;
      this.#pm.input(p.surpriseInput / (1 + p.achGain * this.#achLevel(t))); this.#modulator(t);
    }
    // one expectation per (pair, occurrence): fulfilled if ANY consolidated unit of the pair discharges
    if (p.surprise && p.projection) for (const [second, m] of this.#byPair) {
      const us = (m.get(sourceId) ?? []).filter(u => u.level >= 1);
      if (!us.length) continue;
      const due = Math.max(...us.map(u => u.delayMs + Math.max(p.delayTolMinMs, p.delayTolFrac * u.delayMs)));
      this.#expect.push({ first: sourceId, second, from: t, due: t + due, tol: 0, units: new Set(us) });
    }
    // recursion: a unit's discharge is an event of the same kind, up to the predefined level
    for (const { u } of winners) if (u.hierLevel < p.maxLevel) this.#event(u.key, t, { unitDischarge: u.key });
  }
  // Expected uncertainty (ACh-like; Yu and Dayan 2005): exponential average of
  // surprises per discharge. When failures are expected, each failure is less
  // informative, so the phasic (NE-like) response to it is reduced.
  #achLevel(t) {
    const dt = t - this.#tAch;
    if (dt > 0) {
      const e = Math.exp(-dt / this.#p.achTauMs), x = this.#recentDis ? this.#recentSur / this.#recentDis : (this.#recentSur ? 1 : 0);
      this.#ach = this.#ach * e + (1 - e) * Math.min(x, 10); this.#tAch = t; this.#recentDis = 0; this.#recentSur = 0;
    }
    return this.#state === 'asleep' ? 0 : this.#ach;
  }
  // Imposed cycle: clock units -> clock pacemaker (drive follows the clock) ->
  // state switch with hysteresis (mutual inhibition, Saper et al. 2001).
  #cycle(t) {
    const p = this.#p; if (!this.#clock) return;
    this.#clock.advanceTo(t / 3600000);
    const x = this.#clock.meanX();
    // clock output range calibrated on the Gonze ensemble (mean X ~0.08-0.18): declared, no source
    const xn = Math.max(0, Math.min(1, (x - 0.08) / 0.10));
    this.#clockPm.setDrive(0.0055 + 0.02 * xn);
    for (const ts of this.#clockPm.advanceTo(t)) {
      if (this.#lastClockSpike !== null) { const isi = ts - this.#lastClockSpike; this.#rateEma = 0.9 * this.#rateEma + 0.1 * (1000 / isi); }
      this.#lastClockSpike = ts; this.#clockSpikes++;
    }
    if (this.#clockSpikes < 20) return; // warm-up
    const rmin = 1000 / this.#clockPm.intrinsicPeriodMs(0.0055), rmax = 1000 / this.#clockPm.intrinsicPeriodMs(0.0255);
    const norm = (this.#rateEma - rmin) / (rmax - rmin);
    if (this.#state === 'awake' && norm < p.switchLow) this.#enterSleep(t);
    else if (this.#state === 'asleep' && norm > p.switchHigh) { this.#state = 'awake'; this.#pending.push({ type: 'state.awake', timeMs: t }); }
    if (this.#state === 'asleep') this.#sleepWork(t);
  }
  #enterSleep(t) {
    const p = this.#p;
    this.#state = 'asleep'; this.#sleepEpisodes++; this.#nextReact = t;
    this.#tags = []; this.#expect = []; // no new learning and no expectations without input
    // synaptic homeostasis: proportional renormalisation at sleep onset (Tononi and Cirelli 2014)
    for (const u of this.#units) { u.strength *= p.sleepDownscale; }
    this.#pending.push({ type: 'state.asleep', timeMs: t });
  }
  // spontaneous reactivation without transduction: maintains reactivated units;
  // the rest decays (regulated decay in sleep, Hardt et al. 2013)
  #sleepWork(t) {
    const p = this.#p, period = 1000 / p.sleepReactivationHz;
    while (this.#nextReact <= t && this.#units.length) {
      const pool = this.#units.filter(u => u.level >= 1);
      if (pool.length) {
        const w = pool.map(u => u.strength * Math.exp(-(this.#nextReact - u.tTouch) / (p.cascadeBaseTauMs * p.cascadeFactor ** u.level)));
        let r = this.#rng.random() * w.reduce((a, b) => a + b, 0), k = 0;
        while (k < w.length - 1 && r > w[k]) { r -= w[k]; k++; }
        const u = pool[k]; u.strength = Math.min(1, u.strength + 0.5); u.tTouch = this.#nextReact; this.#reactivations++;
        this.#pending.push({ type: 'unit.reactivated', unit: u.key, timeMs: this.#nextReact });
      }
      this.#nextReact += period;
    }
  }
  #checkExpectations(t) {
    const p = this.#p; if (!p.surprise || !this.#expect.length) return;
    const missed = this.#expect.filter(x => t > x.due + x.tol);
    if (!missed.length) return;
    this.#expect = this.#expect.filter(x => t <= x.due + x.tol);
    this.#surprises += missed.length; this.#recentSur += missed.length;
    for (const x of missed) {
      this.#pending.push({ type: 'expectation.failed', pair: [x.first, x.second], timeMs: x.due });
      for (const u of x.units) { u.strength *= p.contradictionFactor; u.contradictions = (u.contradictions ?? 0) + 1; }
    }
    if (this.#state === 'awake' && t - this.#lastBurst >= p.burstRefractoryMs) { this.#lastBurst = t; this.#pm.input(p.surpriseInput / (1 + p.achGain * this.#achLevel(t))); this.#modulator(t); }
  }
  #nearElements(center, radius) {
    const out = [], c = center.map(v => Math.floor(v / this.#cell)), span = Math.ceil(radius / this.#cell);
    const maxI = Math.floor(this.#p.substrateSideUm / this.#cell), lo = v => Math.max(0, v - span), hi = v => Math.min(maxI, v + span);
    for (let x = lo(c[0]); x <= hi(c[0]); x++) for (let y = lo(c[1]); y <= hi(c[1]); y++) for (let z = lo(c[2]); z <= hi(c[2]); z++) {
      for (const e of this.#grid.get(x + ',' + y + ',' + z) ?? []) {
        if (Math.hypot(e.pos[0] - center[0], e.pos[1] - center[1], e.pos[2] - center[2]) <= radius) out.push(e);
      }
    }
    return out;
  }
  #recruit(first, second, lived, scaleMs, t, cause) {
    const p = this.#p, a = this.#sources.get(first).pos, b = this.#sources.get(second).pos;
    const center = [0, 1, 2].map(k => (a[k] + b[k]) / 2);
    let pool = [], radius = p.recruitRadiusUm;
    while (pool.length < p.unitSize && radius <= p.substrateSideUm * 1.8) { pool = this.#nearElements(center, radius).filter(e => e.units < p.maxUnitsPerElement); radius *= 2; }
    if (pool.length < p.unitSize) { this.#failed++; this.#pending.push({ type: 'recruitment.failed', timeMs: t, reason: 'substrate exhausted near sources' }); return; }
    const ex = new Map(pool.map(e => [e, this.#excitability(e, t)]));
    pool.sort((x, y) => ex.get(y) - ex.get(x) || x.id - y.id);
    const chosen = pool.slice(0, p.unitSize);
    const shared = chosen.filter(e => e.units > 0).length;
    for (const e of chosen) { e.lastAlloc = t; e.units++; }
    const u = { key: 'u' + (++this.#n), afferents: [first, second], delayMs: lived, scaleMs, elements: chosen.map(e => e.id),
      createdAtMs: t, discharges: 0, level: 0, strength: 1, tTouch: t, origin: { cause, sharedElements: shared },
      hierLevel: 1 + Math.max(this.#sources.get(first).level ?? 0, this.#sources.get(second).level ?? 0) };
    this.#unitByKey.set(u.key, u);
    this.#units.push(u);
    if (!this.#byPair.has(second)) this.#byPair.set(second, new Map());
    const m = this.#byPair.get(second);
    if (!m.has(first)) m.set(first, []);
    m.get(first).push(u);
    u.position = [0, 1, 2].map(k => chosen.reduce((a, e) => a + e.pos[k], 0) / chosen.length); // real constitutive coordinates (um)
    this.#pending.push({ type: 'unit.created', unit: u.key, delayMs: lived, afferents: [first, second], elements: u.elements,
      position: u.position, level: u.hierLevel, timeMs: t });
  }
  // Novelty modulator: a pacemaker source (tonic single spikes stay below the
  // receptor's half-effect; a phasic burst crosses it) releasing into a
  // uniformly innervated volume. For a uniform density of release sites the
  // diffusion kernel integrates to a spatially uniform concentration away from
  // the edges (mass conservation), so the field reduces to one concentration
  // with first-order clearance (declared equivalence; explicit varicosities
  // are a later variant).
  #conc(t) { return this.#c * Math.exp(-this.#p.modulatorClearancePerS * (t - this.#tc) / 1000); }
  #desensitize(t) {
    const p = this.#p, dt = t - this.#tdes;
    if (dt <= 0) return;
    const k = p.modulatorClearancePerS / 1000, c0 = this.#conc(this.#tdes);
    const meanC = k > 0 ? (c0 * (1 - Math.exp(-k * dt))) / (k * dt) : c0;
    const target = meanC / p.receptorHalfNM, e = Math.exp(-dt / p.desensitizationTauMs);
    this.#des = target + (this.#des - target) * e; this.#tdes = t;
  }
  #gateOpen(t) {
    const p = this.#p; this.#desensitize(t);
    const K = p.receptorHalfNM * (1 + p.desensitizationGain * this.#des), c = this.#conc(t);
    return c / (c + K) >= 0.5;
  }
  #modulator(t) {
    const p = this.#p;
    for (const ts of this.#pm.advanceTo(t)) {
      this.#desensitize(ts);
      this.#c = this.#conc(ts) + p.modulatorPerSpikeNM; this.#tc = ts; this.#spikes++;
      this.#pending.push({ type: 'modulator.release', substance: 'novelty', timeMs: ts, concentrationNM: this.#c });
      if (!p.gating) continue;
      const liveR = this.#react.filter(r => r.t >= ts - p.eligibilityMs && r.t <= ts);
      const open = this.#gateOpen(ts);
      this.#react = this.#react.filter(r => r.t >= ts - p.eligibilityMs && !(open && r.t <= ts));
      if (liveR.length && open) {
        for (const u of new Set(liveR.map(r => r.u))) {
          if (u.level < p.cascadeMaxLevel && this.#units.includes(u)) { u.level++; this.#pending.push({ type: 'unit.consolidated', unit: u.key, level: u.level, timeMs: ts }); }
        }
      }
      const live = this.#tags.filter(g => g.t >= ts - p.eligibilityMs && g.t <= ts);
      // expired tags are dropped; live tags wait for an open gate within their window
      this.#tags = this.#tags.filter(g => g.t >= ts - p.eligibilityMs && !(open && g.t <= ts));
      if (live.length && open) {
        // competitive, sparse allocation: only the most recent eligible
        // coincidences win per gate opening (Rashid et al. 2016; Josselyn and Tonegawa 2020)
        const seen = new Set();
        live.sort((x, y) => y.t - x.t || x.lived - y.lived);
        let won = 0;
        for (const g of live) {
          if (won >= p.maxAllocationsPerGate) break;
          const key = g.first + '>' + g.second + ':' + Math.round(g.lived);
          if (seen.has(key)) continue; seen.add(key); won++;
          this.#recruit(g.first, g.second, g.lived, g.scaleMs, ts, { ...g.cause, gatedAtMs: ts });
        }
      }
    }
  }
  #sweep(t) {
    const p = this.#p;
    if (!p.cascade || t - this.#lastSweep < 60000) return;
    this.#lastSweep = t;
    for (const u of [...this.#units]) {
      const tau = p.cascadeBaseTauMs * p.cascadeFactor ** u.level;
      if (u.strength * Math.exp(-(t - u.tTouch) / tau) < p.pruneBelow) {
        this.ablate(u.key); this.#pruned++;
        this.#pending.push({ type: 'unit.pruned', unit: u.key, level: u.level, timeMs: t });
      }
    }
  }
  advanceTo(t) {
    if (t < this.#t) throw new RangeError('Engine time reversal');
    this.#t = t; this.#modulator(t); this.#checkExpectations(t); this.#cycle(t); this.#sweep(t);
  }
  drainEvents() { return this.#pending.splice(0); }
  ablate(key) {
    const u = this.#units.find(x => x.key === key);
    if (!u) return;
    this.#units = this.#units.filter(x => x !== u); this.#unitByKey.delete(key); for (const x of this.#expect) x.units.delete(u); this.#expect = this.#expect.filter(x => x.units.size);
    const list = this.#byPair.get(u.afferents[1])?.get(u.afferents[0]);
    if (list) list.splice(list.indexOf(u), 1);
    for (const id of u.elements) this.#elements[id].units--;
  }
  snapshot() {
    return { timeMs: this.#t, units: this.#units.map(u => ({ ...u, afferents: [...u.afferents], elements: [...u.elements], position: u.position && [...u.position] })),
      substrate: { size: this.#elements.length, occupied: this.#elements.filter(e => e.units > 0).length, recruitmentFailures: this.#failed },
      modulator: { novelty: { spikes: this.#spikes, concentrationNM: this.#conc(this.#t), desensitization: this.#des } }, pendingTags: this.#tags.length, pruned: this.#pruned, surprises: this.#surprises, fulfilledExpectations: this.#fulfilled, firings: this.#firings,
      meanSurprise: this.#firings ? this.#surpriseSum / this.#firings : null,
      state: this.#state, sleepEpisodes: this.#sleepEpisodes, reactivations: this.#reactivations, expectedUncertainty: this.#ach,
      sources: [...this.#sources.keys()], sourcePositions: Object.fromEntries([...this.#sources].map(([k, v]) => [k, v.pos])),
      substrateSideUm: this.#p.substrateSideUm };
  }
}
