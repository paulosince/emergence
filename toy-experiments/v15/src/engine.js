// Motor da V0.15: factories, Uint, Upro, propagação e Pcrt (especificação, seções 4–6).
// Nenhuma estrutura associa propriedades do sinal a Uint ou Upro. O único índice que leva
// de uma origem a uma Upro é a lista de saída da origem, e ele é o próprio mecanismo de propagação.
import { FS, DT, World, buildSchedule } from './world.js';
import { Utrd, N_SENSORS, N_BANDS, N_LEVELS, viaDescriptor } from './utrd.js';
import { stream, opaqueId, hashString } from './rng.js';

// ---- Parâmetros congelados ----
export const P = Object.freeze({
  TAU: 0.30e-3,            // constante de disponibilidade da Uint (s)
  THETA_U: 1.5,            // limiar da Uint
  U_REFR: 1e-3,            // refratariedade da Uint (s)
  D_BASE: 0.5e-3,          // menor atraso de candidata (s)
  DMAX: 3e-3,              // maior intervalo vivido considerado (D15)
  CAND_STEP: 0.2e-3,       // degrau das candidatas (D5a, D5b revista)
  N_CAND: 16,              // candidatas por via (0,5 a 3,5 ms)
  N_REC: 5,                // recorrência (D7)
  T_CLOSE: 2.0,            // s (D7)
  T_SEL: 2.0,              // período de seleção (s)
  CAP_UINT: 5000,          // D12
  CAP_UPRO: 200000,        // D12a (candidatas incluídas)
});
export const W = P.TAU * Math.log(1 / (P.THETA_U - 1)); // janela efetiva ≈ 0,208 ms (D6)
export const T_AVA = P.D_BASE + P.DMAX + W;               // avaliação do par pendente
const WHEEL = 512;

export class Interrupt extends Error {}

/**
 * condition: {
 *   lookup (K1), clockPlan (K2), intervention: 'K3'|'K4'|'K5' no início do bloco de teste,
 *   ruleOff (K11), level2 (D14), noBackground (K8a), idSalt (K6), log: 0|1|2
 * }
 */
export class Engine {
  constructor({ seq, seed, calibration, condition = {} }) {
    this.seed = seed; this.cond = condition;
    this.schedule = buildSchedule(seq, seed);
    this.world = new World(this.schedule, seed, { backgroundNoise: !condition.noBackground });
    this.utrd = new Utrd(calibration.thresholds);
    const rId = stream(seed, `ids:${condition.idSalt ?? 'base'}`);
    this.rId = rId;
    this.vias = [];
    for (let v = 0; v < N_SENSORS * N_BANDS * N_LEVELS; v++) {
      this.vias.push({ kind: 'via', idx: v, uid: opaqueId(rId, 'v_'), out: [], trace: null, desc: viaDescriptor(v) });
    }
    this.sources = this.vias.slice();
    this.uints = [];
    this.aliveUint = 0; this.aliveUpro = 0; this.createdUpro = 0;
    this.uproKeys = new Set();
    // Registro interno de trilhas: só a Pcrt (ou um controle rotulado) escreve aqui.
    this._trails = new WeakSet();
    this.precursor = new Map();
    this.lookup = condition.lookup ? new Map() : null; // K1 (controle positivo de H0)
    this.wheel = Array.from({ length: WHEEL }, () => []);
    this.fifo = []; this.fifoHead = 0;
    this.sel = []; this.selHead = 0;
    this.seqCounter = 0; this.incCounter = 0; this.firingCounter = 0; this.arrivalCounter = 0;
    this.stats = { emissions: 0, deliveries: 0, pairs: 0, accommodated: 0, nonAccommodated: 0, constitutions: 0,
      forcedFirings: 0, removedCand: 0, removedUint: 0, interventions: [] };
    this.log = { level: condition.log ?? 1, uints: [], firings: [], trails: [], emissions: [] };
    this.status = 'ok';
    // Controles com relógio (K2) e intervenções no início do teste.
    this.clockEvents = [];
    if (condition.clockPlan) this._planClock(condition.clockPlan);
    const testBlock = this.schedule.blocks[2];
    this.interventionAt = condition.intervention && testBlock ? testBlock.start : Infinity;
    this.rCtl = stream(seed, `control:${condition.intervention ?? ''}:${condition.clockPlan ? 'K2' : ''}`);
  }

  // ---------------- Factories (infraestrutura) ----------------
  _registerTrail(trail) { this._trails.add(trail); return trail; }
  _createUint(trail, t) {
    if (!this._trails.has(trail)) throw Error('UintFactory: chamada sem trilha válida');
    if (this.aliveUint + 1 > P.CAP_UINT) throw new Interrupt(`limite de ${P.CAP_UINT} Uint`);
    const U = { kind: 'uint', seq: this.uints.length, uid: opaqueId(this.rId, 'u_'), createdAt: t,
      block: this._blockAt(t), state: new Map(), refrUntil: -1, upIn: [], out: [], credited: new Set(),
      alive: true, selected: false, trace: null, fires: 0, trailKind: trail.kind };
    this.uints.push(U); this.aliveUint++;
    if (this.cond.level2) this.sources.push(U);
    return U;
  }
  _createUpro({ origin, target, delay, candidate }, trail) {
    if (!this._trails.has(trail)) throw Error('UproFactory: chamada sem trilha válida');
    if (!(origin.kind === 'via' || (origin.kind === 'uint' && origin.alive && this.cond.level2)))
      throw Error('UproFactory: origem inválida');
    if (!target || target.kind !== 'uint' || !target.alive) throw Error('UproFactory: destino inválido');
    if (!(delay > 0)) throw Error('UproFactory: atraso inválido');
    const key = `${origin.uid}>${target.uid}@${Math.round(delay * 1e7)}`;
    if (this.uproKeys.has(key)) return null;
    if (this.aliveUpro + 1 > P.CAP_UPRO) throw new Interrupt(`limite de ${P.CAP_UPRO} Upro`);
    this.uproKeys.add(key);
    const u = { origin, target, delay, candidate: !!candidate, alive: true, key };
    origin.out.push(u); target.upIn.push(u);
    this.aliveUpro++; this.createdUpro++;
    return u;
  }
  _killUpro(u) {
    if (!u.alive) return;
    u.alive = false; this.aliveUpro--; this.uproKeys.delete(u.key);
  }
  _killUint(U, t) {
    if (!U.alive) return;
    U.alive = false; this.aliveUint--;
    for (const u of U.upIn) this._killUpro(u);
    for (const u of U.out) this._killUpro(u);
    this._compactOut(new Set(U.upIn.map((u) => u.origin)));
    if (this.cond.level2) this.sources = this.sources.filter((s) => s !== U);
    if (this.log.level) this.log.uints[U.seq].removedAt = t;
  }
  _compactOut(origins) { for (const o of origins) o.out = o.out.filter((u) => u.alive); }

  // ---------------- Observador ----------------
  _blockAt(t) {
    for (const b of this.schedule.blocks) if (t >= b.start && t < b.end + 1.0) return b.block;
    return 0;
  }

  // ---------------- Execução ----------------
  run() {
    const N = Math.round(this.schedule.duration * FS);
    const p = [0, 0];
    const em = [];
    const emit = (v, tc, n) => em.push({ type: 0, t: tc, seq: this.seqCounter++, via: this.vias[v], n });
    try {
      for (let n = 1; n <= N; n++) {
        const t = n * DT;
        if (t >= this.interventionAt) { this._intervene(this.cond.intervention, t); this.interventionAt = Infinity; }
        while (this.clockEvents.length && this.clockEvents[0] <= t) this._clockCreate(this.clockEvents.shift());
        this.world.sample(t, p);
        em.length = 0;
        this.utrd.step(t, n, p, emit);
        const bucket = this.wheel[n % WHEEL];
        let events = bucket.length || em.length || this._fifoDue(t) || this._selDue(t) ? [] : null;
        if (!events) continue;
        for (const e of bucket) events.push(e);
        bucket.length = 0;
        while (this.fifoHead < this.fifo.length && this.fifo[this.fifoHead].t <= t) events.push(this.fifo[this.fifoHead++]);
        while (this.selHead < this.sel.length && this.sel[this.selHead].t <= t) events.push(this.sel[this.selHead++]);
        for (const e of em) events.push(e);
        if (this.fifoHead > 65536) { this.fifo = this.fifo.slice(this.fifoHead); this.fifoHead = 0; }
        events.sort((a, b) => a.t - b.t || a.seq - b.seq);
        for (const e of events) {
          if (e.type === 0) this._onEmission(e.via, e.t, e.n);
          else if (e.type === 1) this._onDelivery(e);
          else if (e.type === 2) this._onPairEval(e);
          else if (e.type === 3) this._onSelectionEnd(e.U, e.t);
        }
      }
    } catch (err) {
      if (err instanceof Interrupt) { this.status = `interrompida: ${err.message}`; }
      else throw err;
    }
    return this;
  }
  _fifoDue(t) { return this.fifoHead < this.fifo.length && this.fifo[this.fifoHead].t <= t; }
  _selDue(t) { return this.selHead < this.sel.length && this.sel[this.selHead].t <= t; }

  _schedule(t, ev) {
    const n = Math.ceil(t * FS - 1e-9);
    ev.t = t; ev.seq = this.seqCounter++;
    this.wheel[n % WHEEL].push(ev);
  }

  /** Emissão de uma incidência por uma origem (via, ou Uint no segundo nível). */
  _emitFrom(src, t, n) {
    const inc = { id: this.incCounter++, src, t, n, parts: null };
    // Pcrt: coincidência entre fontes distintas (só a emissão mais recente de cada outra fonte, D15).
    const srcs = this.sources;
    for (let i = 0; i < srcs.length; i++) {
      const X = srcs[i];
      if (X === src) continue;
      const tr = X.trace;
      if (tr === null) continue;
      const dt = t - tr.t;
      if (dt < 0 || dt > P.DMAX) continue;
      this.fifo.push({ type: 2, t: t + T_AVA, seq: this.seqCounter++, ei: tr, ej: inc, si: X, sj: src, dt });
    }
    src.trace = inc;
    // Propagação: por TODAS as Upro de saída (D8).
    const out = src.out;
    for (let i = 0; i < out.length; i++) {
      const u = out[i];
      if (u.alive) this._schedule(t + u.delay, { type: 1, upro: u, inc });
    }
    return inc;
  }
  _onEmission(via, t, n) {
    this.stats.emissions++;
    const inc = this._emitFrom(via, t, n);
    if (this.log.level >= 2) this.log.emissions.push([via.idx, t, n, inc.id]);
  }

  /** Entrega numa Uint: integração por origem (D17), a chegada mais recente substitui (D17a). */
  _onDelivery(e) {
    const u = e.upro, U = u.target;
    if (!u.alive || !U.alive) return;
    this.stats.deliveries++;
    const t = e.t;
    const key = this.cond.ruleOff ? this.arrivalCounter++ : u.origin.uid; // K11 desliga a regra
    U.state.set(key, { t, c: 1, upro: u, inc: e.inc });
    let V = 0;
    for (const [k, s] of U.state) {
      const d = t - s.t;
      if (d > 8 * P.TAU) U.state.delete(k);
      else V += s.c * Math.exp(-d / P.TAU);
    }
    if (V >= P.THETA_U && t >= U.refrUntil) this._fire(U, t);
  }

  _fire(U, t, forced = false) {
    const fid = this.firingCounter++;
    for (const s of U.state.values()) {
      if (t - s.t <= W + 1e-12) {
        U.credited.add(s.upro);
        (s.inc.parts || (s.inc.parts = [])).push(fid); // registro local de participação
      }
    }
    U.state.clear();
    U.refrUntil = t + P.U_REFR;
    U.fires++;
    if (this.log.level) this.log.firings.push([U.seq, t, forced ? 1 : 0]);
    if (this.cond.level2) this._emitFrom(U, t, -1);
  }

  /** Avaliação do par pendente: não acomodação decidida pela propagação (HC5). */
  _onPairEval(e) {
    this.stats.pairs++;
    const a = e.ei.parts, b = e.ej.parts;
    if (a && b) {
      for (let i = 0; i < a.length; i++) if (b.includes(a[i])) { this.stats.accommodated++; return; }
    }
    const key = `${e.si.uid}|${e.sj.uid}`;
    if (this.lookup) { // K1: seleção por índice, no estilo da V0.13 (controle positivo de H0)
      const U = this.lookup.get(key);
      if (U && U.alive) {
        if (e.t >= U.refrUntil) { this.stats.forcedFirings++; this._fire(U, e.t, true); }
        this.stats.accommodated++;
        return;
      }
    }
    if (this.cond.clockPlan) return; // K2: a Pcrt não constitui
    if (e.si.kind === 'uint' && !e.si.alive) return;
    if (e.sj.kind === 'uint' && !e.sj.alive) return;
    this.stats.nonAccommodated++;
    let rec = this.precursor.get(key);
    if (!rec) { rec = []; this.precursor.set(key, rec); }
    const t = e.t;
    while (rec.length && t - rec[0].t > P.T_CLOSE) rec.shift();
    rec.push({ dt: e.dt, t, ei: e.ei.id, ej: e.ej.id, ti: e.ei.t, tj: e.ej.t });
    const last = rec[rec.length - 1].dt;
    let consistent = 0;
    for (const r of rec) if (Math.abs(r.dt - last) < W) consistent++;
    if (consistent >= P.N_REC) this._constitute(e.si, e.sj, key, rec, t);
  }

  _constitute(si, sj, key, rec, t) {
    const trail = this._registerTrail({ kind: 'pcrt', t, rule: { nRec: P.N_REC, W },
      intervals: rec.filter((r) => Math.abs(r.dt - rec[rec.length - 1].dt) < W) });
    const U = this._createUint(trail, t);
    for (const o of [si, sj]) {
      for (let m = 0; m < P.N_CAND; m++) {
        this._createUpro({ origin: o, target: U, delay: P.D_BASE + m * P.CAND_STEP, candidate: true }, trail);
      }
    }
    this.precursor.delete(key); // nenhuma referência a U fica guardada a partir das origens
    if (this.lookup) this.lookup.set(key, U);
    this.sel.push({ type: 3, t: t + P.T_SEL, seq: this.seqCounter++, U });
    this.stats.constitutions++;
    if (this.log.level) {
      this.log.uints[U.seq] = { seq: U.seq, t, block: U.block, kind: 'pcrt',
        origins: [this._desc(si), this._desc(sj)], removedAt: null, selectedAt: null, surviving: null };
      this.log.trails.push({ seq: U.seq, t, key: [this._desc(si), this._desc(sj)], intervals: trail.intervals });
    }
  }
  _desc(o) { return o.kind === 'via' ? `v${o.idx}` : `u${o.seq}`; }

  /** Fim da seleção: poda das candidatas que nunca contribuíram; D18. */
  _onSelectionEnd(U, t) {
    if (!U.alive) return;
    const origins = new Set();
    for (const u of U.upIn) {
      if (!u.alive) continue;
      if (!U.credited.has(u)) { this._killUpro(u); this.stats.removedCand++; }
    }
    for (const u of U.upIn) origins.add(u.origin);
    this._compactOut(origins);
    U.upIn = U.upIn.filter((u) => u.alive);
    const alive = new Set(U.upIn.map((u) => u.origin));
    U.selected = true;
    if (this.log.level) {
      const L = this.log.uints[U.seq];
      L.selectedAt = t;
      L.surviving = U.upIn.map((u) => [this._desc(u.origin), +(u.delay * 1e3).toFixed(3)]);
    }
    if (alive.size < 2) { this.stats.removedUint++; this._killUint(U, t); }
  }

  // ---------------- Controles ----------------
  _intervene(kind, t) {
    const live = [];
    for (const U of this.uints) if (U.alive) for (const u of U.upIn) if (u.alive) live.push(u);
    if (kind === 'K3') { // origens embaralhadas
      for (const u of live) {
        if (u.origin.kind !== 'via') continue;
        const nv = this.vias[Math.floor(this.rCtl() * this.vias.length)];
        u.origin.out = u.origin.out.filter((x) => x !== u);
        u.origin = nv; nv.out.push(u);
      }
    } else if (kind === 'K4') { // atrasos embaralhados
      const d = live.map((u) => u.delay);
      for (let i = d.length - 1; i > 0; i--) { const j = Math.floor(this.rCtl() * (i + 1)); [d[i], d[j]] = [d[j], d[i]]; }
      live.forEach((u, i) => { u.delay = d[i]; });
    } else if (kind === 'K5') { // ablação das Uint do bloco 1
      for (const U of this.uints) if (U.alive && U.block === 1) this._killUint(U, t);
    } else throw Error(`intervenção desconhecida: ${kind}`);
    this.stats.interventions.push({ kind, t, affected: live.length });
  }

  _planClock(plan) {
    // K2: mesmas contagens por bloco que a execução principal da mesma semente, em instantes fixos.
    this.clockPlan = plan;
    this.schedule.blocks.forEach((b, i) => {
      const nB = plan.perBlock[i] || 0;
      for (let k = 0; k < nB; k++) this.clockEvents.push(b.start + ((k + 0.5) * (b.end - b.start)) / nB);
    });
  }
  _clockCreate(t) {
    const recent = this.vias.filter((v) => v.trace && t - v.trace.t <= P.DMAX);
    const pool = recent.length >= 2 ? recent : this.vias;
    const a = pool[Math.floor(this.rCtl() * pool.length)];
    let b = a; while (b === a) b = pool[Math.floor(this.rCtl() * pool.length)];
    const trail = this._registerTrail({ kind: 'control-K2', t });
    const U = this._createUint(trail, t);
    U.selected = true;
    for (const o of [a, b]) for (let m = 0; m < this.clockPlan.uproPerOrigin; m++) {
      this._createUpro({ origin: o, target: U, delay: P.D_BASE + this.rCtl() * (P.N_CAND - 1) * P.CAND_STEP }, trail);
    }
    if (this.log.level) this.log.uints[U.seq] = { seq: U.seq, t, block: U.block, kind: 'control-K2',
      origins: [this._desc(a), this._desc(b)], removedAt: null, selectedAt: t,
      surviving: U.upIn.map((u) => [this._desc(u.origin), +(u.delay * 1e3).toFixed(3)]) };
  }

  /** Assinatura estrutural independente de identificadores (K6, K7). */
  structuralHash() {
    const sigs = [];
    for (const U of this.uints) {
      if (!U.alive) continue;
      const s = U.upIn.filter((u) => u.alive).map((u) => `${this._desc(u.origin)}@${(u.delay * 1e6).toFixed(0)}`).sort().join(',');
      sigs.push(`${U.seq}:${s}`);
    }
    return hashString(sigs.join(';')).toString(16) + `:${sigs.length}`;
  }
}
