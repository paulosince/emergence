import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ConstitutiveSpace } from '../src/space/constitutive-space.js';

const anatomy = { a: [0, 0, 0], b: [100, 0, 0], c: [0, 100, 0] };

test('channels by anatomy; opaque control shuffles the assignment reproducibly', () => {
  const s = new ConstitutiveSpace();
  s.placeChannels(anatomy);
  assert.deepEqual(s.position('b'), [100, 0, 0]);
  const o1 = new ConstitutiveSpace(), o2 = new ConstitutiveSpace();
  o1.placeChannels(anatomy, { opaqueSeed: 9 }); o2.placeChannels(anatomy, { opaqueSeed: 9 });
  assert.deepEqual(o1.ids().map(i => o1.position(i)), o2.ids().map(i => o2.position(i)));
  assert.deepEqual(new Set(o1.ids().map(i => o1.position(i).join())), new Set(Object.values(anatomy).map(p => p.join())));
});

test('new units are born near their afferent sources, with recorded origin', () => {
  const s = new ConstitutiveSpace({ scatterUm: 1 });
  s.placeChannels(anatomy);
  const p = s.placeNearAfferents('u1', ['a', 'b']);
  assert.ok(Math.hypot(p[0] - 50, p[1], p[2]) < 6);
  assert.deepEqual(s.origin('u1'), { rule: 'near-afferents', afferents: ['a', 'b'] });
  assert.throws(() => s.placeNearAfferents('u1', ['a']), /already/);
  assert.throws(() => s.placeNearAfferents('u2', ['zz']), /afferent without position/);
});

test('latency derived from distance: 1 mm at 1 m/s is 1 ms plus synaptic delay', () => {
  const s = new ConstitutiveSpace();
  s.placeFixed('x', [0, 0, 0]); s.placeFixed('y', [1000, 0, 0]);
  assert.ok(Math.abs(s.latencyMs('x', 'y', { velocityMPerS: 1, synapticDelayMs: 0.5 }) - 1.5) < 1e-12);
});

test('shuffled-position null keeps the same set of positions', () => {
  const s = new ConstitutiveSpace();
  s.placeChannels(anatomy);
  const n = s.shuffledCopy(['a', 'b', 'c'], 4);
  assert.deepEqual(new Set(['a', 'b', 'c'].map(i => n.position(i).join())), new Set(Object.values(anatomy).map(p => p.join())));
});
