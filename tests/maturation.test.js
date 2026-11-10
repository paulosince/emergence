import { test } from 'node:test';
import assert from 'node:assert/strict';
import { maturationSeed, meanSurprise } from '../src/research/criteria/maturation.js';
const W = (sum, n, c = 0) => ({ surpriseSum: sum, firings: n, created: c });
test('a system without firings cannot pass', () => {
  assert.equal(meanSurprise(W(0, 0)), null);
  const w = [W(0, 0), W(0, 0)];
  assert.equal(maturationSeed({ fixed: w, cycle: w, random: w }).pass, false);
});
test('strengthening relations pass; frozen relations fail', () => {
  const good = { fixed: [W(5, 10, 1), W(1, 10), W(1, 10)], cycle: [W(6, 10, 3), W(2, 10), W(1, 10)], random: [W(7, 10, 5), W(6, 10, 4), W(5, 10, 4)] };
  assert.equal(maturationSeed(good).pass, true);
  const frozen = { fixed: [W(7, 10), W(7, 10), W(7, 10)], cycle: [W(7, 10), W(7, 10), W(7, 10)], random: [W(7, 10), W(7, 10), W(7, 10)] };
  assert.equal(maturationSeed(frozen).pass, false);
});
