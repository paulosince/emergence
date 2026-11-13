// Auditoria pré-execução (especificação, seção 9) — testes automáticos.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Engine, P, W } from '../src/engine.js';

const cal = JSON.parse(readFileSync(new URL('../calibration.json', import.meta.url)));
const short = (cond = {}, seed = 1, dur = 0.56) => {
  const e = new Engine({ seq: 'S1', seed, calibration: cal, condition: cond });
  e.schedule.duration = dur;
  return e.run();
};

test('factories recusam chamadas sem trilha registrada pela Pcrt', () => {
  const e = new Engine({ seq: 'S1', seed: 1, calibration: cal });
  assert.throws(() => e._createUint({ kind: 'forjada' }, 0), /sem trilha/);
  const trail = e._registerTrail({ kind: 'teste' });
  const U = e._createUint(trail, 0);
  assert.throws(() => e._createUpro({ origin: e.vias[0], target: U, delay: 1e-3 }, { kind: 'forjada' }), /sem trilha/);
});

test('registro precursor não contém referência a Uint nem a Upro', () => {
  const e = short();
  for (const rec of e.precursor.values()) for (const r of rec) {
    for (const v of Object.values(r)) assert.equal(typeof v, 'number');
  }
});

test('atrasos das candidatas não dependem do intervalo vivido', () => {
  const e = short();
  const sets = new Set();
  for (const U of e.uints) {
    const d = U.upIn.filter((u) => u.candidate).map((u) => Math.round(u.delay * 1e7)).sort((a, b) => a - b).join(',');
    sets.add(d);
  }
  // todas as Uint ainda em seleção têm exatamente o mesmo conjunto de atrasos
  const inSel = e.uints.filter((U) => !U.selected && U.alive);
  const s2 = new Set(inSel.map((U) => U.upIn.map((u) => Math.round(u.delay * 1e7)).sort((a, b) => a - b).join(',')));
  assert.equal(s2.size, 1);
  const expected = Array.from({ length: P.N_CAND }, (_, m) => Math.round((P.D_BASE + m * P.CAND_STEP) * 1e7));
  const one = [...s2][0].split(',').map(Number);
  assert.deepEqual([...new Set(one)], expected);
});

test('D17: Uint que só recebe de uma origem nunca dispara', () => {
  const e = new Engine({ seq: 'S1', seed: 1, calibration: cal });
  const trail = e._registerTrail({ kind: 'teste' });
  const U = e._createUint(trail, 0);
  const ups = [];
  for (let m = 0; m < 30; m++) ups.push(e._createUpro({ origin: e.vias[0], target: U, delay: 0.5e-3 + m * 1e-5 }, trail));
  const inc = { id: 0, parts: null };
  for (let m = 0; m < 30; m++) e._onDelivery({ upro: ups[m], inc, t: 0.01 + m * 1e-5 });
  assert.equal(U.fires, 0);
});

test('D17: duas origens dentro da janela disparam a Uint', () => {
  const e = new Engine({ seq: 'S1', seed: 1, calibration: cal });
  const trail = e._registerTrail({ kind: 'teste' });
  const U = e._createUint(trail, 0);
  const a = e._createUpro({ origin: e.vias[0], target: U, delay: 1e-3 }, trail);
  const b = e._createUpro({ origin: e.vias[1], target: U, delay: 1e-3 }, trail);
  e._onDelivery({ upro: a, inc: { id: 0, parts: null }, t: 0.010 });
  e._onDelivery({ upro: b, inc: { id: 1, parts: null }, t: 0.010 + 0.9 * W });
  assert.equal(U.fires, 1);
  const U2 = e._createUint(trail, 0);
  const c = e._createUpro({ origin: e.vias[0], target: U2, delay: 1e-3 }, trail);
  const d = e._createUpro({ origin: e.vias[1], target: U2, delay: 1e-3 }, trail);
  e._onDelivery({ upro: c, inc: { id: 2, parts: null }, t: 0.020 });
  e._onDelivery({ upro: d, inc: { id: 3, parts: null }, t: 0.020 + 1.1 * W });
  assert.equal(U2.fires, 0);
});

test('determinismo: mesma semente, mesma assinatura estrutural', () => {
  assert.equal(short().structuralHash(), short().structuralHash());
});

test('K6: trocar identificadores opacos não muda a dinâmica', () => {
  const a = short(), b = short({ idSalt: 'permutado' });
  assert.notEqual(a.vias[0].uid, b.vias[0].uid);
  assert.equal(a.structuralHash(), b.structuralHash());
  assert.deepEqual(a.stats, b.stats);
});

test('K7: sem observador, a mesma estrutura', () => {
  assert.equal(short({ log: 0 }).structuralHash(), short().structuralHash());
});

test('K8a: silêncio absoluto não gera incidências nem Uint', () => {
  const e = new Engine({ seq: 'SILENCE', seed: 1, calibration: cal, condition: { noBackground: true } });
  e.schedule.duration = 1.0; e.run();
  assert.equal(e.stats.emissions, 0);
  assert.equal(e.uints.length, 0);
});
