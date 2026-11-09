import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ConstitutiveEngine } from '../src/engines/constitutive/engine.js';
import { assertExperimentEngine } from '../src/contracts/engine.js';

// Each "pulse" is a change of a channel's measurement.
const VALUES = new WeakMap();
function feed(e, list) {
  if (!VALUES.has(e)) VALUES.set(e, {});
  const values = VALUES.get(e);
  for (const [ch, t] of list) {
    values[ch] = values[ch] === 'on' ? 'off' : 'on';
    e.ingest({ transducerId: ch, arrivedAtMs: t, measurement: values[ch] });
  }
  return e.drainEvents();
}
const prime = ch => [[ch, 0]]; // first sample is not an event (no previous value)
const ab = ev => ev.filter(x => x.afferents?.join() === 'a,b');

test('starts with no units; only measurement changes are events; contract satisfied', () => {
  const e = assertExperimentEngine(new ConstitutiveEngine({ seed: 1 }));
  assert.equal(e.snapshot().units.length, 0);
  e.ingest({ transducerId: 'a', arrivedAtMs: 0, measurement: 1 });
  e.ingest({ transducerId: 'a', arrivedAtMs: 5, measurement: 1 });
  e.ingest({ transducerId: 'b', arrivedAtMs: 6, measurement: 'x' });
  assert.equal(e.snapshot().units.length, 0);
});

test('a coincidence of distinct sources recruits a unit with recorded allocation; the same delay later discharges it', () => {
  const e = new ConstitutiveEngine({ seed: 2 });
  feed(e, [...prime('a'), ...prime('b')]);
  const ev1 = feed(e, [['a', 1000], ['b', 1040]]);
  const created = ev1.filter(x => x.type === 'unit.created');
  assert.equal(created.length, 1);
  const u = e.snapshot().units[0];
  assert.deepEqual(u.afferents, ['a', 'b']);
  assert.equal(u.delayMs, 40);
  assert.equal(u.elements.length, 4);
  assert.deepEqual(u.origin.cause.incidence, { transducerId: 'b', arrivedAtMs: 1040 });
  const ev2 = feed(e, [['a', 5000], ['b', 5041]]);
  // (the slow-scale trace also lets b -> a coincide: other pairs may be recruited)
  assert.equal(ab(ev2.filter(x => x.type === 'unit.created')).length, 0);
  assert.deepEqual(ev2.filter(x => x.type === 'unit.discharge').map(x => x.unit), [u.key]);
  const ev3 = feed(e, [['a', 9000], ['b', 9080]]); // different delay: not accommodated
  assert.equal(ab(ev3.filter(x => x.type === 'unit.created')).length, 1);
});

test('finite substrate: recruitment fails when elements run out', () => {
  const e = new ConstitutiveEngine({ seed: 3, substrateSize: 3, unitSize: 4 });
  feed(e, [...prime('a'), ...prime('b')]);
  const ev = feed(e, [['a', 1000], ['b', 1040]]);
  assert.equal(ev.filter(x => x.type === 'recruitment.failed').length, 1);
  assert.equal(e.snapshot().substrate.recruitmentFailures, 1);
});

test('allocation by excitability: memories close in time share elements; distant ones mostly do not', () => {
  const share = gapMs => {
    const e = new ConstitutiveEngine({ seed: 4, substrateSize: 4000, unitSize: 10, substrateSideUm: 200, recruitRadiusUm: 200,
      channelAnatomy: { a: [100, 100, 100], b: [100, 100, 100], c: [100, 100, 100], d: [100, 100, 100] } });
    feed(e, [...prime('a'), ...prime('b'), ...prime('c'), ...prime('d')]);
    feed(e, [['a', 1000], ['b', 1040]]);
    feed(e, [['c', 1000 + gapMs], ['d', 1000 + gapMs + 70]]);
    const [u1, u2] = e.snapshot().units.filter(u => (u.afferents.join() === 'a,b') || (u.afferents.join() === 'c,d'));
    return u2.elements.filter(x => u1.elements.includes(x)).length / 10;
  };
  const close = share(3600 * 1000), far = share(72 * 3600 * 1000);
  assert.ok(close >= 0.8, `close overlap ${close}`);
  assert.ok(far <= 0.5, `far overlap ${far}`);
});

test('ablation removes the unit and releases its elements', () => {
  const e = new ConstitutiveEngine({ seed: 5 });
  feed(e, [...prime('a'), ...prime('b')]);
  feed(e, [['a', 1000], ['b', 1040]]);
  const key = e.snapshot().units[0].key;
  e.ablate(key);
  assert.equal(e.snapshot().units.length, 0);
  assert.equal(e.snapshot().substrate.occupied, 0);
  const ev = feed(e, [['a', 5000], ['b', 5040]]);
  assert.equal(ab(ev.filter(x => x.type === 'unit.created')).length, 1, 're-created after removal');
});
