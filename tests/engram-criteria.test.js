import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reactivationRate, reactivationTest, d2rDecision, contentOf, retrieval, d4sDecision } from '../src/research/criteria/engram.js';

const encH = [1, 2, 3, 4], testH = [1.1, 2.1, 3.1, 3.9];
test('content-specific responders reactivate above the permutation null', () => {
  const t = reactivationTest({ encH, encR: ['a', 'b', 'c', 'd'], testH, testR: ['a', 'b', 'c', 'd'] }, { permutations: 500 });
  assert.equal(t.observed, 1); assert.ok(t.nullMean < 0.5); assert.ok(t.p < 0.1);
});
test('the same responder for every content is not specific (null equals observed)', () => {
  const t = reactivationTest({ encH, encR: ['r', 'r', 'r', 'r'], testH, testR: ['r', 'r', 'r', 'r'] }, { permutations: 200 });
  assert.equal(t.observed, 1); assert.equal(t.nullMean, 1); assert.equal(t.p, 1);
});
test('create-always never reactivates', () => {
  assert.equal(reactivationRate({ encH, encR: ['a', 'b', 'c', 'd'], testH, testR: ['e', 'f', 'g', 'h'] }), 0);
});
test('content and retrieval of a unit', () => {
  const d = { encH, encR: ['a', 'b', 'c', 'c'], testH };
  assert.deepEqual(contentOf('c', d), [2, 3]);
  assert.equal(retrieval('c', [2, 3], ['a', 'b', 'c', 'x']), 0.5);
});
test('D2-R needs gain over null; D4-S is conditional on D2-R', () => {
  const s = Array.from({ length: 10 }, () => ({ observed: 0.9, nullMean: 0.1, p: 0.0005 }));
  assert.equal(d2rDecision(s).pass, true);
  assert.equal(d2rDecision(s.map(x => ({ ...x, nullMean: 0.8 }))).pass, false);
  const u = Array.from({ length: 10 }, () => ({ units: [{ effect: 1, nullMax: 0, specificity: 1 }] }));
  assert.equal(d4sDecision(u, { d2rPass: true }).pass, true);
  assert.equal(d4sDecision(u, { d2rPass: false }).pass, false);
  assert.throws(() => d4sDecision(u, {}));
});
