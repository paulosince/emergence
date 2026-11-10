// Constitutive engine, version 2 (docs/engine-v2-design-proposal.md; decisions of
// 09/11/2026 in docs/effects-v0.1.md and docs/clear-v43-reconciliation-v0.1.md).
// Version 1 (engine.js) is kept unchanged for the record of campaign round 1.
//
// Entities (CLEAR v43 roles):
//   * incidence {magnitude m in [0,1], effect e in [-1,1]}; only transduction
//     (channel changes) and units with the pacemaker property create incidences;
//   * Utrd: a channel; emits m = 1, e = 0 when its measurement changes;
//   * Upro: an entity {from, to, delay, gain g, added effect de}; on passage
//     e <- clamp(e + de), m <- min(1, m*g) (effect is a sum, magnitude multiplies);
//   * Uint: n >= 2 afferent Upro; sums m*e with availability decay tau and
//     discharges at >= 1; emits m = 1, e = 0 through its outgoing Upro.
// Constitution (Pcrt): adjust before creating; a new Uint receives all active
// sources of the event (up to maxAfferents) and inhibitory Upro to/from its
// competitors (units sharing afferent sources). Plasticity: confirmation
// strengthens contributing Upro; late incidences weaken and shorten delays;
// failed convergence moves delays together; the modulator multiplies rates.
// Sleep: population up-states (slow oscillation) give every Uint the same intrinsic
// subthreshold drive; selection is emergent; no activity is created without a source.
import { makeRng } from '../../../vendor/tempo/core/rng.js';
import { PacemakerUnit } from '../../rhythm/pacemaker.js';
import { createClockEnsemble } from '../../rhythm/clock.js';
import { checkpointSensorRng } from '../../runtime/checkpoint-rng.js';
import { DEFAULTS, checkOverrides } from './parameters-v2.js';
export { DEFAULTS, PARAMETERS } from './parameters-v2.js';
export const ENGINE_V2_CHECKPOINT_SCHEMA = 'emergence-constitutive-engine-v2-checkpoint-v1';

const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
const before = (a, b) => a.t < b.t || (a.t === b.t && a.seq < b.seq);
// checkpoints must survive JSON (infinite times are encoded as strings)
const enc = x => JSON.parse(JSON.stringify(x, (k, v) => v === Infinity ? '+inf' : v === -Infinity ? '-inf' : v));
const dec = x => JSON.parse(JSON.stringify(x), (k, v) => v === '+inf' ? Infinity : v === '-inf' ? -Infinity : v);

export class ConstitutiveEngineV2 {
  #p; #check; #rng; #pm; #clock = null; #clockPm = null; #grid = new Map(); #cell; #pending = [];
  #S; // complete plain state (checkpoint = structured clone)
  constructor(options = {}) {
    this.#check = checkOverrides(options);
    this.#p = Object.freeze({ ...DEFAULTS, ...options });
    const p = this.#p;
    this.#rng = checkpointSensorRng(options.seed ?? 1, 'constitutive-engine-v2');
    this.#cell = p.recruitRadiusUm;
    this.#pm = new PacemakerUnit(p.noveltyPacemaker);
    if (p.clock) {
      this.#clock = createClockEnsemble({ cells: p.clock.cells ?? 10, seed: options.seed ?? 1, timeScale: p.clock.timeScale ?? 1 });
      this.#clockPm = new PacemakerUnit({ tauMs: 200, threshold: 1, refractoryMs: 5, drive: 0.01 });
    }
    const elements = Array.from({ length: p.substrateSize }, (_, i) => ({
      id: i, pos: [0, 1, 2].map(() => this.#rng.random() * p.substrateSideUm),
      base: 1 + p.excitabilitySd * this.#rng.normal(), lastAlloc: -Infinity, units: 0 }));
    this.#S = { t: 0, lastValue: {}, sources: {}, elements, units: {}, order: [], upros: {}, out: {}, nU: 0, nP: 0, seq: 0,
      queue: [], tags: [], react: [], lastBurst: -Infinity, c: 0, tc: 0, des: 0, tdes: 0, spikes: 0, lastSweep: 0,
      rateEma: 0, lastClockSpike: null, clockSpikes: 0, state: 'awake', sleepEpisodes: 0, nextUp: 0, up: null, ach: 0, tAch: 0, lastTick: 0,
      stats: { failed: 0, pruned: 0, firings: 0, intrinsic: 0, surprises: 0, surprisesTransduced: 0, surprisesInternal: 0, surpriseSum: 0, confirmations: 0, late: 0,
        delayAdjusts: 0, accommodated: 0, created: 0 } };
    this.#indexElements();
  }
  describe() { return { id: 'constitutive-engine-v2', candidate: true, parameters: { ...this.#p }, changedFromPreregistration: this.#check.changed, exploratory: this.#check.exploratory }; }

  // ---------------- substrate ----------------
  #indexElements() {
    this.#grid = new Map();
    for (const e of this.#S.elements) { const k = this.#cellKey(e.pos); if (!this.#grid.has(k)) this.#grid.set(k, []); this.#grid.get(k).push(e); }
  }
  #cellKey(pos) { return pos.map(v => Math.floor(v / this.#cell)).join(','); }
  #excitability(e, t) {
    const p = this.#p, epoch = Math.floor(t / p.fluctuationPeriodMs);
    const fl = p.fluctuationSd * makeRng((p.seed ?? 1) * 1000003 + e.id * 7919 + epoch * 104729).normal();
    return e.base + fl + p.recentBoost * Math.exp(-(t - e.lastAlloc) / p.recentTauMs);
  }
  #nearElements(center, radius) {
    const out = [], c = center.map(v => Math.floor(v / this.#cell)), span = Math.ceil(radius / this.#cell);
    const maxI = Math.floor(this.#p.substrateSideUm / this.#cell), lo = v => Math.max(0, v - span), hi = v => Math.min(maxI, v + span);
    for (let x = lo(c[0]); x <= hi(c[0]); x++) for (let y = lo(c[1]); y <= hi(c[1]); y++) for (let z = lo(c[2]); z <= hi(c[2]); z++)
      for (const e of this.#grid.get(x + ',' + y + ',' + z) ?? [])
        if (Math.hypot(e.pos[0] - center[0], e.pos[1] - center[1], e.pos[2] - center[2]) <= radius) out.push(e);
    return out;
  }

  // ---------------- sources (Utrd and Uint seen as origins) ----------------
  #source(id) {
    const S = this.#S;
    if (!S.sources[id]) {
      const u = S.units[id];
      const pos = u ? [...u.position] : this.#p.channelAnatomy?.[id] ?? [0, 1, 2].map(() => this.#rng.random() * this.#p.substrateSideUm);
      S.sources[id] = { last: -Infinity, traces: this.#p.traceScalesMs.map(() => 0), tTrace: 0, pos, level: u ? u.hierLevel : 0 };
    }
    return S.sources[id];
  }
  #decayTrace(s, t) {
    const dt = t - s.tTrace;
    if (dt > 0) { s.traces = s.traces.map((v, k) => v * Math.exp(-dt / this.#p.traceScalesMs[k])); s.tTrace = t; }
  }
  #lead(u) { return Math.max(this.#p.delayTolMinMs, this.#p.delayTolFrac * u.span); }
  #window(u) { return this.#p.accommodationFactor * this.#lead(u); }

  // ---------------- incidence queue ----------------
  #push(item) {
    const q = this.#S.queue; item.seq = this.#S.seq++; q.push(item);
    let i = q.length - 1;
    while (i > 0) { const j = (i - 1) >> 1; if (!before(q[i], q[j])) break; [q[i], q[j]] = [q[j], q[i]]; i = j; }
  }
  #pop() {
    const q = this.#S.queue, top = q[0], last = q.pop();
    if (q.length) {
      q[0] = last; let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1; let m = i;
        if (l < q.length && before(q[l], q[m])) m = l;
        if (r < q.length && before(q[r], q[m])) m = r;
        if (m === i) break; [q[i], q[m]] = [q[m], q[i]]; i = m;
      }
    }
    return top;
  }
  // an origin emits an incidence (m = 1, e = 0: D1) through all its outgoing Upro
  #emit(fromId, t) {
    for (const id of this.#S.out[fromId] ?? []) {
      const pr = this.#S.upros[id];
      if (pr) this.#push({ t: t + pr.delayMs, te: t, upro: id, m: 1, e: 0 });
    }
  }

  // ---------------- integration (Uint) ----------------
  #decayV(u, t) {
    const dt = t - u.tV;
    if (dt > 0) { const k = Math.exp(-dt / u.tau); u.vE *= k; u.vI *= k; u.tV = t; }
  }
  #occupancy(t) {
    const p = this.#p; this.#desensitize(t);
    const K = p.receptorHalfNM * (1 + p.desensitizationGain * this.#S.des), c = this.#conc(t);
    return c / (c + K);
  }
  // up-state drive: intrinsic depolarization integrated since the up-state onset
  // (leaky integrator, as the pacemaker unit); one discharge per unit per up-state
  #upDrive(u, t) {
    const S = this.#S, p = this.#p, up = S.up;
    if (!up || t < up.t0 || t > up.end || u.lastDis >= up.t0) return 0;
    return p.upStateDrive * this.#unitExcitability(u, up.t0) * p.upStateTauMs * (1 - Math.exp(-(t - up.t0) / p.upStateTauMs));
  }
  #unitExcitability(u, t) { return u.elements.reduce((a, id) => a + this.#excitability(this.#S.elements[id], t), 0) / u.elements.length; }
  #arrive(a) {
    const S = this.#S, p = this.#p;
    if (a.intrinsic) { // scheduled threshold crossing of the up-state drive
      const u = S.units[a.intrinsic];
      if (u && S.state === 'asleep' && S.up && u.lastDis < S.up.t0 && a.t >= u.refUntil) { this.#decayV(u, a.t); this.#discharge(u, a.t, null, true); }
      return;
    }
    const pr = S.upros[a.upro];
    if (!pr) return;
    const u = S.units[pr.to]; if (!u) return;
    const t = a.t;
    // in slow-wave sleep, low acetylcholine releases recurrent (Uint -> Uint) excitatory transmission (Hasselmo 1999)
    const sleepGain = S.state === 'asleep' && pr.dEffect > 0 && S.units[pr.from] ? p.sleepRecurrentGain : 1;
    const e = clamp(a.e + pr.dEffect, -1, 1), m = Math.min(1, a.m * pr.gain * sleepGain), c = m * e; // Uint adds no effect or gain by default
    if (c === 0) return;
    this.#decayV(u, t);
    // late incidence (CLEAR v43 L81): arrives after the discharge it missed
    if (c > 0 && Number.isFinite(u.lastDis) && t - u.lastDis <= this.#window(u) && !u.lastContrib.includes(pr.id)) {
      const M = 1 + p.plasticityModGain * this.#occupancy(t);
      pr.gain = Math.max(0, pr.gain * (1 - p.depressionRate * M));
      pr.delayMs = Math.max(p.conductionDelayMs, pr.delayMs - p.delayAdjustRate * (t - u.lastDis));
      S.stats.late++;
      this.#pending.push({ type: 'upro.late', upro: pr.id, unit: u.key, gain: pr.gain, delayMs: pr.delayMs, timeMs: t });
    }
    if (t < u.refUntil) return; // refractory: not integrated
    if (c > 0) u.vE += c; else u.vI += c;
    u.hist.push({ t, te: a.te ?? t, c }); if (u.hist.length > 64) u.hist.shift(); // all contributions, for the expected set
    if (c > 0) { u.arrivals.push({ upro: pr.id, t, c }); if (u.arrivals.length > 32) u.arrivals.shift(); }
    if (u.vE + u.vI + this.#upDrive(u, t) >= 1) { this.#discharge(u, t, { trigger: pr }); return; }
    // failed convergence (L81): the closest other excitatory arrival within the window
    // moves both delays toward coincidence, half each (the mismatch does not say which to change)
    if (c > 0) {
      let prev = null;
      for (let k = u.arrivals.length - 2; k >= 0; k--) { const x = u.arrivals[k]; if (x.upro !== pr.id) { prev = x; break; } }
      const gap = prev ? t - prev.t : Infinity;
      if (prev && gap > 0 && gap <= this.#window(u) && S.upros[prev.upro]) {
        const shift = p.delayAdjustRate * gap / 2;
        S.upros[prev.upro].delayMs += shift;
        pr.delayMs = Math.max(p.conductionDelayMs, pr.delayMs - shift);
        S.stats.delayAdjusts++;
      }
    }
  }
  #discharge(u, t, info, intrinsic = false) {
    const S = this.#S, p = this.#p;
    const contrib = [...new Set(u.arrivals.filter(a => t - a.t <= 3 * u.tau).map(a => a.upro))];
    if (!intrinsic) {
      // confirmation strengthens the favoured pathways (responsible: answer b; L82)
      const M = 1 + p.plasticityModGain * this.#occupancy(t);
      for (const id of contrib) { const pr = S.upros[id]; if (pr) pr.gain = Math.min(1, pr.gain + p.potentiationRate * M * (1 - pr.gain)); }
      if (u.discharges > 0) S.stats.confirmations++;
    }
    u.lastContrib = contrib; u.lastDis = t; u.refUntil = t + p.refractoryMs; u.vE = 0; u.vI = 0; u.tV = t; u.arrivals = [];
    const hist = u.hist; u.hist = [];
    u.discharges++;
    if (p.cascade) { u.strength = 1; u.tTouch = t; S.react.push({ key: u.key, t }); }
    // surprise (responsible's definition, 09/11/2026; docs/nomenclature.md): at each
    // moment the units favoured by the accessed units (incidences received or already
    // emitted toward them) are the expected ones; the discharge of a unit that was NOT
    // expected is a surprise. "Before" excludes the incidences emitted inside the unit's
    // accommodation window: those are the sudden change that made it fire.
    let surprise = false, favour = null, cause = null;
    if (intrinsic) S.stats.intrinsic++;
    else {
      S.stats.firings++;
      const W = this.#window(u);
      favour = hist.filter(h => h.te < t - W).reduce((a, h) => a + h.c * Math.exp(-(t - h.t) / u.tau), 0);
      cause = S.units[info.trigger.from] ? 'interna' : 'transdutiva';
      surprise = S.state === 'awake' && favour < p.surpriseFavourMin;
      const dt = t - S.tAch, k = dt > 0 ? 1 - Math.exp(-dt / p.achTauMs) : 0;
      S.ach += ((surprise ? 1 : 0) - S.ach) * k; S.tAch = t;
      if (surprise) {
        const intensity = Math.max(0, 1 - favour);
        S.stats.surprises++; S.stats.surpriseSum += intensity; S.stats[cause === 'interna' ? 'surprisesInternal' : 'surprisesTransduced']++;
        if (p.surprise && t - S.lastBurst >= p.burstRefractoryMs) {
          S.lastBurst = t; this.#pm.input(p.surpriseInput / (1 + p.achGain * S.ach)); this.#modulator(t);
        }
      }
    }
    this.#pending.push({ type: 'unit.discharge', unit: u.key, timeMs: t, intrinsic, surprise, favour, cause });
    if (S.state === 'asleep') this.#pending.push({ type: 'unit.reactivated', unit: u.key, intrinsic, timeMs: t });
    this.#emit(u.key, t);
    if (u.hierLevel < p.maxLevel && S.state === 'awake') this.#originEvent(u.key, t, { unitDischarge: u.key });
  }

  // ---------------- constitution (Pcrt) ----------------
  #originEvent(sid, t, cause) {
    const S = this.#S, p = this.#p, s = this.#source(sid);
    const candidates = [];
    for (const [rid, r] of Object.entries(S.sources)) {
      if (rid === sid || !Number.isFinite(r.last)) continue;
      const lived = t - r.last;
      if (lived <= 0 || lived > p.maxDelayMs || (r.level ?? 0) >= p.maxLevel) continue;
      this.#decayTrace(r, t);
      const k = r.traces.findIndex(v => v >= p.traceThreshold);
      if (k >= 0) candidates.push({ rid, lived, k });
    }
    // adjust before creating (L81-82): a candidate is accommodated when an existing
    // Uint receives Upro from both origins with predicted mismatch inside its window
    const uncovered = [];
    for (const c of candidates) {
      let covered = false;
      for (const id of S.out[sid] ?? []) {
        const ps = S.upros[id]; if (!ps || ps.dEffect <= 0) continue;
        const u = S.units[ps.to]; if (!u) continue;
        for (const jd of u.upIn) {
          const pj = S.upros[jd];
          if (!pj || pj.from !== c.rid || pj.dEffect <= 0) continue;
          if (Math.abs((t - c.lived + pj.delayMs) - (t + ps.delayMs)) <= this.#window(u)) { covered = true; break; }
        }
        if (covered) break;
      }
      if (covered) S.stats.accommodated++; else uncovered.push(c);
    }
    if (uncovered.length && S.state === 'awake') {
      uncovered.sort((a, b) => a.lived - b.lived || (a.rid < b.rid ? -1 : 1));
      const group = uncovered.filter(c => c.k === uncovered[0].k).slice(0, p.maxAfferents - 1).map(c => ({ rid: c.rid, lived: c.lived }));
      if (!p.gating) this.#recruit(sid, group, t, cause);
      else {
        S.tags.push({ second: sid, group, t, cause });
        if (S.tags.length > p.maxTags) S.tags.splice(0, S.tags.length - p.maxTags);
        const novelty = p.gradedNovelty ? uncovered.length / candidates.length : 1;
        if (t - S.lastBurst >= p.burstRefractoryMs) { S.lastBurst = t; this.#pm.input(p.noveltyInput * novelty); this.#modulator(t); }
      }
    }
    this.#decayTrace(s, t);
    s.traces = s.traces.map(v => v + 1);
    s.last = t;
  }
  #newUpro(from, to, delayMs, gain, dEffect) {
    const S = this.#S, id = 'p' + (++S.nP);
    S.upros[id] = { id, from, to, delayMs, gain, dEffect };
    (S.out[from] ??= []).push(id);
    S.units[to].upIn.push(id);
    return id;
  }
  #recruit(sid, group, t, cause) {
    const S = this.#S, p = this.#p;
    const members = [{ rid: sid, lived: 0 }, ...group];
    const pos = members.map(x => this.#source(x.rid).pos);
    const center = [0, 1, 2].map(k => pos.reduce((a, q) => a + q[k], 0) / pos.length);
    let pool = [], radius = p.recruitRadiusUm;
    while (pool.length < p.unitSize && radius <= p.substrateSideUm * 1.8) { pool = this.#nearElements(center, radius).filter(e => e.units < p.maxUnitsPerElement); radius *= 2; }
    if (pool.length < p.unitSize) { S.stats.failed++; this.#pending.push({ type: 'recruitment.failed', timeMs: t, reason: 'substrate exhausted near sources' }); return null; }
    const ex = new Map(pool.map(e => [e, this.#excitability(e, t)]));
    pool.sort((x, y) => ex.get(y) - ex.get(x) || x.id - y.id);
    const chosen = pool.slice(0, p.unitSize), shared = chosen.filter(e => e.units > 0).length;
    for (const e of chosen) { e.lastAlloc = t; e.units++; }
    const span = Math.max(...members.map(x => x.lived)) + p.conductionDelayMs;
    const lead = Math.max(p.delayTolMinMs, p.delayTolFrac * span);
    const key = 'u' + (++S.nU);
    const u = { key, upIn: [], elements: chosen.map(e => e.id), createdAtMs: t, span, tau: p.availabilityFactor * lead,
      vE: 0, vI: 0, tV: t, refUntil: -Infinity, lastDis: -Infinity, lastContrib: [], arrivals: [], hist: [], discharges: 0,
      level: 0, strength: 1, tTouch: t, origin: { cause, sharedElements: shared },
      hierLevel: 1 + Math.max(...members.map(x => this.#source(x.rid).level ?? 0)),
      position: [0, 1, 2].map(k => chosen.reduce((a, e) => a + e.pos[k], 0) / chosen.length) };
    S.units[key] = u; S.order.push(key); S.stats.created++;
    // delay lines: the constituted coincidence arrives together after the conduction delay
    for (const x of members) this.#newUpro(x.rid, key, x.lived + p.conductionDelayMs, p.uproInitGain, 1);
    // D2: structural inhibition between competitors (units sharing afferent origins)
    const origins = new Set(members.map(x => x.rid));
    const competitors = [];
    for (let i = S.order.length - 2; i >= 0 && competitors.length < p.maxCompetitors; i--) {
      const v = S.units[S.order[i]];
      if (v && v.upIn.some(id => S.upros[id]?.dEffect > 0 && origins.has(S.upros[id].from))) competitors.push(v.key);
    }
    for (const v of competitors) {
      this.#newUpro(key, v, p.inhibitoryDelayMs, p.inhibitoryGain, -1);
      this.#newUpro(v, key, p.inhibitoryDelayMs, p.inhibitoryGain, -1);
    }
    this.#pending.push({ type: 'unit.created', unit: key, afferents: members.map(x => x.rid), delaysMs: members.map(x => x.lived + p.conductionDelayMs),
      competitors, elements: u.elements, position: u.position, level: u.hierLevel, timeMs: t });
    return u;
  }

  // ---------------- novelty modulator (as version 1) ----------------
  #conc(t) { return this.#S.c * Math.exp(-this.#p.modulatorClearancePerS * (t - this.#S.tc) / 1000); }
  #desensitize(t) {
    const S = this.#S, p = this.#p, dt = t - S.tdes;
    if (dt <= 0) return;
    const k = p.modulatorClearancePerS / 1000, c0 = this.#conc(S.tdes);
    const meanC = k > 0 ? (c0 * (1 - Math.exp(-k * dt))) / (k * dt) : c0;
    const target = meanC / p.receptorHalfNM, e = Math.exp(-dt / p.desensitizationTauMs);
    S.des = target + (S.des - target) * e; S.tdes = t;
  }
  #modulator(t) {
    const S = this.#S, p = this.#p;
    for (const ts of this.#pm.advanceTo(t)) {
      this.#desensitize(ts);
      S.c = this.#conc(ts) + p.modulatorPerSpikeNM; S.tc = ts; S.spikes++;
      this.#pending.push({ type: 'modulator.release', substance: 'novelty', timeMs: ts, concentrationNM: S.c });
      if (!p.gating) continue;
      const open = this.#occupancy(ts) >= 0.5;
      const liveR = S.react.filter(r => r.t >= ts - p.eligibilityMs && r.t <= ts);
      S.react = S.react.filter(r => r.t >= ts - p.eligibilityMs && !(open && r.t <= ts));
      if (liveR.length && open) for (const key of new Set(liveR.map(r => r.key))) {
        const u = S.units[key];
        if (u && u.level < p.cascadeMaxLevel) { u.level++; this.#pending.push({ type: 'unit.consolidated', unit: key, level: u.level, timeMs: ts }); }
      }
      const live = S.tags.filter(g => g.t >= ts - p.eligibilityMs && g.t <= ts);
      S.tags = S.tags.filter(g => g.t >= ts - p.eligibilityMs && !(open && g.t <= ts));
      if (live.length && open) {
        const seen = new Set(); let won = 0;
        live.sort((x, y) => y.t - x.t);
        for (const g of live) {
          if (won >= p.maxAllocationsPerGate) break;
          const k = g.second + '|' + g.group.map(x => x.rid + ':' + Math.round(x.lived)).join(',');
          if (seen.has(k)) continue; seen.add(k); won++;
          this.#recruit(g.second, g.group, ts, { ...g.cause, gatedAtMs: ts });
        }
      }
    }
  }

  // ---------------- cycle and sleep ----------------
  #cycle(t) {
    const S = this.#S, p = this.#p; if (!this.#clock) return;
    this.#clock.advanceTo(t / 3600000);
    const xn = Math.max(0, Math.min(1, (this.#clock.meanX() - 0.08) / 0.10));
    this.#clockPm.setDrive(0.0055 + 0.02 * xn);
    for (const ts of this.#clockPm.advanceTo(t)) {
      if (S.lastClockSpike !== null) S.rateEma = 0.9 * S.rateEma + 0.1 * (1000 / (ts - S.lastClockSpike));
      S.lastClockSpike = ts; S.clockSpikes++;
    }
    if (S.clockSpikes < 20) return;
    const rmin = 1000 / this.#clockPm.intrinsicPeriodMs(0.0055), rmax = 1000 / this.#clockPm.intrinsicPeriodMs(0.0255);
    const norm = (S.rateEma - rmin) / (rmax - rmin);
    if (S.state === 'awake' && norm < p.switchLow) {
      S.state = 'asleep'; S.sleepEpisodes++; S.nextUp = t; S.tags = [];
      for (const k of S.order) S.units[k].strength *= p.sleepDownscale; // synaptic homeostasis (Tononi and Cirelli 2014)
      this.#pending.push({ type: 'state.asleep', timeMs: t });
    } else if (S.state === 'asleep' && norm > p.switchHigh) { S.state = 'awake'; S.up = null; this.#pending.push({ type: 'state.awake', timeMs: t }); }
  }
  // D4' (validated against neurobiology, 09/11/2026): slow oscillation of the
  // population (Steriade et al. 1993): at each up-state every Uint receives the same
  // intrinsic subthreshold drive; which units fire is not chosen by the engine:
  // more excitable units cross threshold first and their incidences propagate
  // through the learned Upro (strong pathways recruit the next units).
  #upState(t0) {
    const S = this.#S, p = this.#p;
    S.up = { t0, end: t0 + p.upStateDurationMs };
    for (const k of S.order) {
      const u = S.units[k], vInf = p.upStateDrive * this.#unitExcitability(u, t0) * p.upStateTauMs;
      if (vInf <= 1) continue;
      const tc = -p.upStateTauMs * Math.log(1 - 1 / vInf);
      if (tc <= p.upStateDurationMs) this.#push({ t: t0 + tc, intrinsic: k });
    }
  }
  #sweep(t) {
    const S = this.#S, p = this.#p;
    if (!p.cascade || t - S.lastSweep < 60000) return;
    S.lastSweep = t;
    for (const k of [...S.order]) {
      const u = S.units[k], tau = p.cascadeBaseTauMs * p.cascadeFactor ** u.level;
      if (u.strength * Math.exp(-(t - u.tTouch) / tau) < p.pruneBelow) {
        this.ablate(k); S.stats.pruned++;
        this.#pending.push({ type: 'unit.pruned', unit: k, level: u.level, timeMs: t });
      }
    }
  }
  #advance(t) {
    const S = this.#S;
    for (;;) {
      const nA = S.queue.length ? S.queue[0].t : Infinity;
      const nU = S.state === 'asleep' ? S.nextUp : Infinity;
      const nT = (S.lastTick ?? 0) + 60000; // state, clock and decay are sampled at least every minute
      const n = Math.min(nA, nU, nT);
      if (n > t) break;
      this.#modulator(n); this.#cycle(n);
      if (n === nT && nT < nA && nT < nU) { S.lastTick = nT; this.#sweep(nT); }
      else if (S.state === 'asleep' && S.nextUp <= n && S.nextUp <= nA) { this.#upState(S.nextUp); S.nextUp += this.#p.upStatePeriodMs; }
      else if (nA <= n) this.#arrive(this.#pop());
    }
    this.#modulator(t); this.#cycle(t);
  }

  // ---------------- interface ----------------
  ingest(i) {
    const S = this.#S;
    if (i.arrivedAtMs < S.t) throw new RangeError('Incidence in the past');
    this.#advance(i.arrivedAtMs); S.t = i.arrivedAtMs;
    if (this.#clock && i.transducerId === this.#p.clock.lightChannel) this.#clock.setLight(Number(i.measurement) > 0 ? (this.#p.clock.lightGain ?? 0.01) : 0);
    const prev = S.lastValue[i.transducerId];
    S.lastValue[i.transducerId] = i.measurement;
    if (S.state === 'asleep') return; // sensory gating in sleep
    if (prev === undefined || prev === i.measurement) return; // Utrd transduces variations (L185)
    this.#emit(i.transducerId, i.arrivedAtMs);
    this.#originEvent(i.transducerId, i.arrivedAtMs, { incidence: { transducerId: i.transducerId, arrivedAtMs: i.arrivedAtMs } });
  }
  advanceTo(t) {
    if (t < this.#S.t) throw new RangeError('Engine time reversal');
    this.#advance(t); this.#S.t = t; this.#sweep(t);
  }
  drainEvents() { return this.#pending.splice(0); }
  ablate(key) {
    const S = this.#S, u = S.units[key]; if (!u) return;
    for (const [id, pr] of Object.entries(S.upros)) if (pr.to === key || pr.from === key) {
      delete S.upros[id];
      const l = S.out[pr.from]; if (l) l.splice(l.indexOf(id), 1);
      const v = S.units[pr.to]; if (v && v !== u) v.upIn.splice(v.upIn.indexOf(id), 1);
    }
    delete S.out[key]; delete S.units[key]; delete S.sources[key];
    S.order.splice(S.order.indexOf(key), 1);
    for (const id of u.elements) S.elements[id].units--;
  }
  checkpoint() {
    if (this.#pending.length) throw new RangeError('Drain events before checkpoint');
    return enc({ schema: ENGINE_V2_CHECKPOINT_SCHEMA, params: this.#p, rng: this.#rng.state(), S: this.#S,
      pm: this.#pm.getState(), clock: this.#clock ? this.#clock.getState() : null, clockPm: this.#clockPm ? this.#clockPm.getState() : null });
  }
  static restore(ck) {
    if (ck?.schema !== ENGINE_V2_CHECKPOINT_SCHEMA) throw new RangeError('Not a constitutive-engine-v2 checkpoint');
    ck = dec(ck);
    const e = new ConstitutiveEngineV2({ ...ck.params, substrateSize: 0 });
    e.#p = Object.freeze({ ...ck.params });
    e.#rng = checkpointSensorRng(ck.params.seed ?? 1, 'constitutive-engine-v2', ck.rng);
    e.#S = ck.S; e.#indexElements(); e.#pm.setState(ck.pm);
    if (ck.clock) { e.#clock.setState(ck.clock); e.#clockPm.setState(ck.clockPm); }
    return e;
  }
  snapshot() {
    const S = this.#S, upros = Object.values(S.upros);
    const units = S.order.map(k => {
      const u = S.units[k], inc = u.upIn.map(id => S.upros[id]).filter(Boolean);
      const exc = inc.filter(x => x.dEffect > 0);
      return { key: k, afferents: exc.map(x => x.from), delaysMs: exc.map(x => x.delayMs), gains: exc.map(x => x.gain),
        delayMs: u.span, inhibitoryAfferents: inc.length - exc.length, elements: [...u.elements], position: [...u.position],
        createdAtMs: u.createdAtMs, discharges: u.discharges, level: u.level, strength: u.strength, tTouch: u.tTouch,
        hierLevel: u.hierLevel, origin: structuredClone(u.origin) };
    });
    return { timeMs: S.t, units, upros: { total: upros.length, inhibitory: upros.filter(x => x.dEffect < 0).length },
      substrate: { size: S.elements.length, occupied: S.elements.filter(e => e.units > 0).length, recruitmentFailures: S.stats.failed },
      modulator: { novelty: { spikes: S.spikes, concentrationNM: this.#conc(S.t), desensitization: S.des } },
      pendingTags: S.tags.length, pendingIncidences: S.queue.length, stats: { ...S.stats },
      surpriseRate: S.stats.firings ? S.stats.surprises / S.stats.firings : null,
      state: S.state, sleepEpisodes: S.sleepEpisodes, expectedUncertainty: S.ach,
      sources: Object.keys(S.sources), sourcePositions: Object.fromEntries(Object.entries(S.sources).map(([k, v]) => [k, v.pos])),
      substrateSideUm: this.#p.substrateSideUm };
  }
}
