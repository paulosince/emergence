// Baseline only: TEMPO's original nodes are predefined, relations begin empty.
import { occurrencesToConstitution, testPair } from '../../vendor/tempo/core/protocols.js';

export const TEMPO_SOURCE_COMMIT = '206611ec5e453fa66a78ad3f5f1650c5892d0b6d';

export function runTempoReference(config = {}) {
  const { seed = 0, mode = 'shift', K = 4, eta = 0.2,
    d = 40, N = 12, maxOcc = 400, strict = false } = config;
  if (!Number.isInteger(seed) || seed < 0) throw new RangeError('seed must be a nonnegative integer');
  if (!Number.isInteger(N) || N < 2) throw new RangeError('N must be >= 2');
  if (!Number.isInteger(K) || K < 1) throw new RangeError('K must be >= 1');
  if (!Number.isFinite(eta) || eta <= 0) throw new RangeError('eta must be positive');
  if (!Number.isFinite(d) || d <= 0) throw new RangeError('d must be positive');
  if (!Number.isInteger(maxOcc) || maxOcc < 1) throw new RangeError('maxOcc must be positive integer');
  if (!['shift', 'select', 'fixed'].includes(mode)) throw new RangeError('Unknown reference mode');
  const { occ, net } = occurrencesToConstitution(mode, K, eta, seed, { d, N, maxOcc, strict });
  const probe = testPair(net, 0, 1, d);
  const relations = net.links().map(({ i, j, w, ta, td }) => ({
    source: i, target: j, weight: w, delaySourceMs: ta, delayTargetMs: td, traversalMs: ta + td,
  }));
  return {
    schemaVersion: '1.0.0',
    algorithm: 'TEMPO-reference',
    sourceCommit: TEMPO_SOURCE_COMMIT,
    configuration: { seed, mode, K, eta, dMs: d, nodeCount: N, maxOcc, strict },
    result: { occurrencesToConstitution: occ, lenient: probe.lenient,
      strict: probe.strict, hitTimesMs: probe.hits, initialNodeCount: N,
      initialLinkCount: 0, finalLinkCount: relations.length },
    relations,
  };
}
