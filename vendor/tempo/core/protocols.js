// Training and test protocols, including the five-item test of constitution.
//
// Test of constitution for a relation i -> j with lived interval d:
//   1. before training there was no link i -> j (the domain starts empty)
//   2. i alone reaches j
//   3. the latency is compatible with d (strict: j's FIRST response is at d +/- tol)
//   4. the relation persists (checked after a period of background activity)
//   5. training in reverse order does not produce i -> j

import { Net } from './net.js';
import { makeRng } from './rng.js';

export function trainOccurrence(net, pairs, t0, { period = 1000, bg = 0.5, jit = 1 } = {}) {
  const r = net.rng;
  for (const [i, j, d] of pairs) {
    net.push(t0, 'f', i);
    net.push(t0 + d + r.uniform(-jit, jit), 'f', j);
  }
  for (let n = 0; n < net.N; n++) {              // background, away from the pair
    const k = r.poisson((bg * period) / 1000);
    for (let s = 0; s < k; s++) net.push(r.uniform(t0 + 200, t0 + period), 'f', n);
  }
  net.runUntil(t0 + period - 1e-6);
}

// Items 2-3. Returns { lenient, strict, hits } where hits are response times of j.
export function testPair(net, i, j, d, tol = 3) {
  const c = net.probeCopy();
  const T0 = 0;
  c.last.fill(-1e9); c.tV.fill(T0);
  c.push(T0, 'f', i); c.runUntil(T0 + 3 * c.L);
  const hits = c.fires.filter(([, n]) => n === j).map(([t]) => t - T0);
  const lenient = hits.some((h) => Math.abs(h - d) <= tol);
  const strict = hits.length > 0 && Math.abs(Math.min(...hits) - d) <= tol;
  return { lenient, strict, hits };
}

export function occurrencesToConstitution(mode, K, eta, seed, { d = 40, N = 12, maxOcc = 400, strict = false, ...params } = {}) {
  const net = new Net(N, K, mode, eta, makeRng(seed), params);
  if (net.nLinks() !== 0) throw new Error('item 1 violated: domain not empty');
  for (let occ = 1; occ <= maxOcc; occ++) {
    trainOccurrence(net, [[0, 1, d]], (occ - 1) * 1000);
    const r = testPair(net, 0, 1, d);
    if (strict ? r.strict : r.lenient) return { occ, net };
  }
  return { occ: null, net };
}

export function persistence(net, d = 40, seconds = 120) {
  const t = Math.max(...net.last) + 1000;
  for (let k = 0; k < seconds; k++) trainOccurrence(net, [], t + k * 1000);
  return testPair(net, 0, 1, d).lenient;
}

export function reverseTest(mode, K, eta, seed, { d = 40, N = 12, occ = 150 } = {}) {
  const net = new Net(N, K, mode, eta, makeRng(seed));
  for (let o = 0; o < occ; o++) trainOccurrence(net, [[1, 0, d]], o * 1000);
  return { forward: testPair(net, 0, 1, d).lenient, reverse: testPair(net, 1, 0, d).lenient };
}

// P4: conjunctive detector. a at t, b at t+Delta, k forced at t+D; wMax < theta so both
// inputs are needed. Returns whether the forward and the reverse order fire k.
export function conjDetector(tw, { Delta = 10, D = 40, seed = 0, occ = 150 } = {}) {
  const net = new Net(3, 4, 'shift', 0.2, makeRng(seed), { wMax: 0.75, tw });
  for (let o = 0; o < occ; o++) {
    const t0 = o * 1000;
    net.push(t0, 'f', 0); net.push(t0 + Delta, 'f', 1); net.push(t0 + D, 'f', 2);
    net.runUntil(t0 + 999);
  }
  const probe = (first, second) => {
    const c = net.probeCopy();
    c.last.fill(-1e9); c.tV.fill(0);
    c.push(0, 'f', first); c.push(Delta, 'f', second); c.runUntil(300);
    return c.fires.some(([, n]) => n === 2);
  };
  return { forward: probe(0, 1), reverse: probe(1, 0) };
}

export const median = (xs) => {
  const v = xs.map((x) => (x === null ? Infinity : x)).sort((a, b) => a - b);
  const m = v.length >> 1;
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
};
