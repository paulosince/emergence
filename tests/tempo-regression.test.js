import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runTempoReference, TEMPO_SOURCE_COMMIT } from '../src/tempo/reference-runner.js';
import { occurrencesToConstitution, reverseTest } from '../vendor/tempo/core/protocols.js';

const golden = [25, 28, 16, 35, 22, 31, 17, 37, 44, 40];

test('TEMPO reference has fixed starting nodes and starts without links', () => {
  const result = runTempoReference({ seed: 0 });
  assert.equal(result.sourceCommit, TEMPO_SOURCE_COMMIT);
  assert.equal(result.result.initialNodeCount, 12);
  assert.equal(result.result.initialLinkCount, 0);
});

test('golden P2: eta=0.2, mode=shift, K=4, seeds 0..9', () => {
  for (let seed = 0; seed < golden.length; seed++) {
    const result = occurrencesToConstitution('shift', 4, 0.2, seed);
    assert.equal(result.occ, golden[seed], 'seed ' + seed);
  }
});

test('baseline reference reproducibility and strict propagation timing', () => {
  const first = runTempoReference({ seed: 0, strict: true });
  const second = runTempoReference({ seed: 0, strict: true });
  assert.deepEqual(first, second);
  assert.equal(first.result.strict, true);
});

test('reverse-order reference does not learn the forward relation', () => {
  assert.deepEqual(reverseTest('shift', 4, 0.2, 0), { forward: false, reverse: true });
});
