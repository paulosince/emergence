import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ConstitutiveEngine } from '../src/engines/constitutive/engine.js';
import { assertExperimentEngine } from '../src/contracts/engine.js';
// Increment-1 semantics (immediate recruitment, no decay) = ablation of the gate and cascade.
const I1 = { gating: false, cascade: false };

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
  const e = assertExperimentEngine(new ConstitutiveEngine({ ...I1, seed: 1 }));
  assert.equal(e.snapshot().units.length, 0);
  e.ingest({ transducerId: 'a', arrivedAtMs: 0, measurement: 1 });
  e.ingest({ transducerId: 'a', arrivedAtMs: 5, measurement: 1 });
  e.ingest({ transducerId: 'b', arrivedAtMs: 6, measurement: 'x' });
  assert.equal(e.snapshot().units.length, 0);
});

test('a coincidence of distinct sources recruits a unit with recorded allocation; the same delay later discharges it', () => {
  const e = new ConstitutiveEngine({ ...I1, seed: 2 });
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
  const e = new ConstitutiveEngine({ ...I1, seed: 3, substrateSize: 3, unitSize: 4 });
  feed(e, [...prime('a'), ...prime('b')]);
  const ev = feed(e, [['a', 1000], ['b', 1040]]);
  assert.equal(ev.filter(x => x.type === 'recruitment.failed').length, 1);
  assert.equal(e.snapshot().substrate.recruitmentFailures, 1);
});

test('allocation by excitability: memories close in time share elements; distant ones mostly do not', () => {
  const share = gapMs => {
    const e = new ConstitutiveEngine({ ...I1, seed: 4, substrateSize: 4000, unitSize: 10, substrateSideUm: 200, recruitRadiusUm: 200,
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
  const e = new ConstitutiveEngine({ ...I1, seed: 5 });
  feed(e, [...prime('a'), ...prime('b')]);
  feed(e, [['a', 1000], ['b', 1040]]); e.advanceTo(1300);
  const key = e.snapshot().units[0].key;
  e.ablate(key);
  assert.equal(e.snapshot().units.length, 0);
  assert.equal(e.snapshot().substrate.occupied, 0);
  const ev = feed(e, [['a', 5000], ['b', 5040]]);
  assert.equal(ab(ev.filter(x => x.type === 'unit.created')).length, 1, 're-created after removal');
});

test('three-factor gate: a coincidence is only recruited when the novelty modulator arrives within the eligibility window', () => {
  const e = new ConstitutiveEngine({ seed: 6 });
  feed(e, [...prime('a'), ...prime('b')]);
  feed(e, [['a', 1000], ['b', 1040]]);
  e.advanceTo(1300); // the phasic burst completes after the event
  const ev = e.drainEvents();
  const c = ab(ev.filter(x => x.type === 'unit.created'));
  assert.equal(c.length, 1);
  assert.ok(ev.some(x => x.type === 'modulator.release'));
  assert.ok(Number.isFinite(e.snapshot().units.find(u => u.afferents.join() === 'a,b').origin.cause.gatedAtMs));
  const weak = new ConstitutiveEngine({ seed: 6, modulatorPerSpikeNM: 5 });
  feed(weak, [...prime('a'), ...prime('b')]);
  feed(weak, [['a', 1000], ['b', 1040]]);
  weak.advanceTo(1300);
  const ev2 = weak.drainEvents();
  assert.equal(ev2.filter(x => x.type === 'unit.created').length, 0, 'no third factor, no unit');
});

test('cascade stability: unused units are pruned; reactivation with the gate raises the level and slows decay', () => {
  const e = new ConstitutiveEngine({ seed: 7, cascadeBaseTauMs: 60000 });
  feed(e, [...prime('a'), ...prime('b')]);
  feed(e, [['a', 1000], ['b', 1040]]); e.advanceTo(1300);
  const key = e.snapshot().units.find(u => u.afferents.join() === 'a,b').key;
  e.advanceTo(400000);
  assert.ok(!e.snapshot().units.some(u => u.key === key), 'pruned after ~6 time constants without use');
  assert.ok(e.snapshot().pruned >= 1);
  const f = new ConstitutiveEngine({ seed: 7, cascadeBaseTauMs: 60000 });
  feed(f, [...prime('a'), ...prime('b'), ...prime('c')]);
  feed(f, [['a', 1000], ['b', 1040]]); f.advanceTo(1300);
  // reactivate a->b while novelty is high (an unaccommodated c event drives the source)
  feed(f, [['a', 20000], ['c', 20039], ['b', 20040]]); f.advanceTo(20300);
  const u = f.snapshot().units.find(x => x.afferents.join() === 'a,b' && x.delayMs === 40);
  assert.ok(u.level >= 1, `level ${u.level}`);
  f.advanceTo(400000);
  assert.ok(f.snapshot().units.some(x => x.key === u.key), 'consolidated unit survives');
});

test('capacity per element is respected', () => {
  const e = new ConstitutiveEngine({ ...I1, seed: 8, substrateSize: 8, unitSize: 4, maxUnitsPerElement: 1, recruitRadiusUm: 1000 });
  feed(e, [...prime('a'), ...prime('b')]);
  feed(e, [['a', 1000], ['b', 1040]]);
  feed(e, [['a', 2000], ['b', 2090]]);
  const ev = feed(e, [['a', 3000], ['b', 3150]]);
  assert.ok(ev.some(x => x.type === 'recruitment.failed'));
});

test('lateral inhibition: two units of the same pair matching the same event -> only the best one discharges', () => {
  const e = new ConstitutiveEngine({ ...I1, seed: 9, delayTolFrac: 0.2 });
  feed(e, [...prime('a'), ...prime('b')]);
  feed(e, [['a', 1000], ['b', 1040]]);
  feed(e, [['a', 3000], ['b', 3050]]); // 50 is within 20% of 40 -> accommodated, no new unit
  e.drainEvents();
  const ev = feed(e, [['a', 6000], ['b', 6045]]);
  assert.equal(ab(ev.filter(x => x.type === 'unit.discharge')).length + ev.filter(x => x.type === 'unit.discharge').length > 0, true);
  const dis = ev.filter(x => x.type === 'unit.discharge');
  const byPair = new Set(dis.map(x => e.snapshot().units.find(u => u.key === x.unit).afferents.join()));
  assert.equal(byPair.size, dis.length, 'at most one discharge per pair');
});

test('recursion up to the predefined level: unit discharges become sources; levels are capped', () => {
  const run = maxLevel => {
    const e = new ConstitutiveEngine({ ...I1, seed: 10, maxLevel });
    feed(e, [...prime('a'), ...prime('b'), ...prime('c'), ...prime('d')]);
    for (let k = 0; k < 4; k++) feed(e, [['a', 1000 + k * 5000], ['b', 1040 + k * 5000], ['c', 1100 + k * 5000], ['d', 1170 + k * 5000]]);
    return Math.max(...e.snapshot().units.map(u => u.hierLevel));
  };
  assert.equal(run(1), 1);
  assert.equal(run(2), 2);
});

test('surprise: a consolidated unit whose expected event does not occur produces an expectation failure', () => {
  const e = new ConstitutiveEngine({ seed: 11, cascadeBaseTauMs: 600000 });
  feed(e, [...prime('a'), ...prime('b'), ...prime('c')]);
  feed(e, [['a', 1000], ['b', 1040]]); e.advanceTo(1300);
  feed(e, [['a', 20000], ['c', 20039], ['b', 20040]]); e.advanceTo(20300); // reactivation with gate -> level 1
  assert.ok(e.snapshot().units.some(u => u.afferents.join() === 'a,b' && u.level >= 1));
  e.drainEvents();
  feed(e, [['a', 40000]]); // b should follow at +40 ms but does not
  e.advanceTo(40500);
  assert.ok(e.drainEvents().some(x => x.type === 'expectation.failed'));
  assert.ok(e.snapshot().surprises >= 1);
});
