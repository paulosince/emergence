import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maturationSeed, failureFraction } from '../src/research/criteria/maturation.js';
const W = (f, ok, c = 0) => ({ failures: f, fulfilled: ok, created: c });
test('a system without expectations cannot pass (undefined failure fraction)', () => {
  assert.equal(failureFraction(W(0, 0)), null);
  const w = [W(0, 0), W(0, 0)];
  assert.equal(maturationSeed({ fixed: w, cycle: w, cycleShuffled: w, random: w }).pass, false);
});
test('perfect learner passes; frozen predictor fails on the cycle', () => {
  const good = { fixed: [W(1, 9, 1), W(0, 10), W(0, 10)], cycle: [W(3, 7), W(0, 10), W(0, 10)], cycleShuffled: [W(7, 3), W(7, 3), W(7, 3)], random: [W(9, 1), W(9, 1), W(9, 1)] };
  assert.equal(maturationSeed(good).pass, true);
  assert.equal(maturationSeed({ ...good, cycle: [W(7, 3), W(7, 3), W(7, 3)] }).pass, false);
});
