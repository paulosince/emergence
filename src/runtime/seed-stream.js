// Stable separate random streams prevent sensor registration order changing noise.
import { makeRng } from '../../vendor/tempo/core/rng.js';

export function sensorRandomStream(seed, transducerId) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) {
    throw new RangeError('Seed must be an unsigned 32-bit integer');
  }
  if (typeof transducerId !== 'string' || !transducerId) {
    throw new TypeError('Transducer ID is required');
  }
  let hash = (2166136261 ^ seed) >>> 0; // FNV-1a with run seed included
  for (let i = 0; i < transducerId.length; i++) {
    hash = Math.imul(hash ^ transducerId.charCodeAt(i), 16777619) >>> 0;
  }
  return makeRng(hash);
}