import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Net } from '../core/net.js';
import { makeRng } from '../core/rng.js';
import { occurrencesToConstitution, persistence, reverseTest, testPair } from '../core/protocols.js';

test('item 1: the domain starts without links', () => {
  assert.equal(new Net(12, 4, 'shift', 0.2, makeRng(0)).nLinks(), 0);
});

test('same seed gives the same result', () => {
  const a = occurrencesToConstitution('shift', 4, 0.2, 3).occ;
  const b = occurrencesToConstitution('shift', 4, 0.2, 3).occ;
  assert.equal(a, b);
});

test('items 2-3: a trained pair is constituted with latency near the lived interval', () => {
  const { occ, net } = occurrencesToConstitution('shift', 4, 0.2, 0);
  assert.ok(occ !== null);
  const r = testPair(net, 0, 1, 40);
  assert.ok(r.strict, `hits: ${r.hits}`);
  const l = net.out[0].find((x) => x.j === 1);
  assert.ok(Math.abs(l.ta + l.td - 40) <= 3);
});

test('item 4: the relation persists through background activity (with consolidation)', () => {
  const { net } = occurrencesToConstitution('shift', 4, 0.2, 0);
  assert.ok(persistence(net));
});

test('item 5: reverse-order training does not produce the forward relation', () => {
  const r = reverseTest('shift', 4, 0.2, 0);
  assert.equal(r.forward, false);
});
