// Pré-teste de ramos — motor mínimo de integração (ver pre-registro.md).
// Estrutura dada: Utrd, Upro, ramos e Uint. Sem Pcrt, aprendizado ou poda.
// Tempo em ms. A Utrd não analisa nada: cada pulso de entrada é uma emissão
// entregue a todas as suas Upros, e cada Upro entrega a todos os seus ramos.

const EPS = 1e-9;

export class Engine {
  constructor({ rule, windowMs = 0.25, threshold = 1.5, refractoryMs = 1 }) {
    if (!["A", "B"].includes(rule)) throw Error("regra deve ser A ou B");
    this.cfg = { rule, windowMs, threshold, refractoryMs };
    this.upros = new Map();          // id -> {id, from, to, ramos:[{delay, magnitude}]}
    this.outOf = new Map();          // utrd id -> [upro ids]
    this.uints = new Map();          // id -> {contribs:[], refractoryUntil}
    this.queue = []; this.log = []; this.seq = 0; this.emissionSeq = 0;
  }
  utrd(id) { if (!this.outOf.has(id)) this.outOf.set(id, []); }
  uint(id) { this.uints.set(id, { contribs: [], refractoryUntil: -Infinity }); }
  upro({ id, from, to, ramos }) {
    if (!this.outOf.has(from) || !this.uints.has(to)) throw Error("Upro inválida");
    if (!ramos.length || ramos.some(r => !(r.delay > 0))) throw Error("ramos inválidos");
    this.upros.set(id, { id, from, to, ramos: ramos.map(r => ({ magnitude: 1, ...r })) });
    this.outOf.get(from).push(id);
  }
  // Um pulso na Utrd = uma emissão com identidade própria.
  pulse(utrdId, time) {
    const emission = ++this.emissionSeq;
    this.log.push({ kind: "emit", time, utrd: utrdId, emission });
    for (const pid of this.outOf.get(utrdId)) {
      const p = this.upros.get(pid);
      p.ramos.forEach((r, ri) => this.queue.push({
        time: time + r.delay, seq: ++this.seq,
        uint: p.to, upro: pid, ramo: ri, emission, magnitude: r.magnitude,
      }));
    }
  }
  // Chave de distinção: A = Upro; B = emissão.
  key(c) { return this.cfg.rule === "A" ? "u:" + c.upro : "e:" + c.emission; }
  run() {
    this.queue.sort((a, b) => a.time - b.time || a.seq - b.seq);
    for (const ev of this.queue) this.arrive(ev);
    this.queue = [];
    return this.log;
  }
  arrive(ev) {
    const u = this.uints.get(ev.uint), w = this.cfg.windowMs;
    u.contribs = u.contribs.filter(c => ev.time - c.time <= w + EPS);
    u.contribs.push(ev);
    const sum = u.contribs.reduce((s, c) => s + c.magnitude, 0);
    const distinct = new Set(u.contribs.map(c => this.key(c))).size;
    this.log.push({ kind: "arrival", time: ev.time, uint: ev.uint, upro: ev.upro,
      ramo: ev.ramo, emission: ev.emission, sum, distinct });
    if (ev.time < u.refractoryUntil - EPS) return;
    if (distinct < 2 || sum < this.cfg.threshold - EPS) return;
    this.log.push({ kind: "fire", time: ev.time, uint: ev.uint, sum, distinct,
      contributors: u.contribs.map(c => ({ upro: c.upro, ramo: c.ramo, emission: c.emission })) });
    u.contribs = []; u.refractoryUntil = ev.time + this.cfg.refractoryMs;
  }
  fires() { return this.log.filter(x => x.kind === "fire"); }
}
