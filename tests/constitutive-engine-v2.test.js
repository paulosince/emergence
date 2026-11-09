import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ConstitutiveEngineV2 } from '../src/engines/constitutive/engine-v2.js';
import { assertExperimentEngine } from '../src/contracts/engine.js';

const NOW = { gating: false, cascade: false }; // immediate constitution, no decay (controls)
function feeder(e) {
  const v = {};
  return list => {
    for (const [ch, t] of list) { v[ch] = v[ch] === 'on' ? 'off' : 'on'; e.ingest({ transducerId: ch, arrivedAtMs: t, measurement: v[ch] }); }
    return e.drainEvents();
  };
}
const created = (ev, aff) => ev.filter(x => x.type === 'unit.created' && (!aff || x.afferents.join() === aff));
const fired = ev => ev.filter(x => x.type === 'unit.discharge');

test('contract; only changes are incidences; nothing is constituted without coincidence', () => {
  const e = assertExperimentEngine(new ConstitutiveEngineV2({ ...NOW, seed: 1 }));
  e.ingest({ transducerId: 'a', arrivedAtMs: 0, measurement: 1 });
  e.ingest({ transducerId: 'a', arrivedAtMs: 5, measurement: 1 });
  assert.equal(e.snapshot().units.length, 0);
});

test('a coincidence constitutes a Uint with Upro delay lines; the same interval later makes it discharge without new units', () => {
  const e = new ConstitutiveEngineV2({ ...NOW, seed: 2 }), f = feeder(e);
  f([['a', 0], ['b', 1]]);
  const ev1 = f([['a', 1000], ['b', 1040]]);
  const c = created(ev1, 'b,a');
  assert.equal(c.length, 1);
  assert.deepEqual(c[0].delaysMs, [1, 41]); // both arrive together after the conduction delay
  const ev2 = f([['a', 5000], ['b', 5041]]);
  e.advanceTo(5100); const ev2b = [...ev2, ...e.drainEvents()];
  assert.equal(created(ev2b, 'b,a').length, 0, 'accommodated: no new unit for the same interval');
  assert.ok(fired(ev2b).some(x => x.unit === c[0].unit));
});

test('a single afferent never reaches threshold (Uint needs at least two contributions)', () => {
  const e = new ConstitutiveEngineV2({ ...NOW, seed: 3 }), f = feeder(e);
  f([['a', 0], ['b', 1], ['a', 1000], ['b', 1040]]);
  const u = e.snapshot().units.find(x => x.afferents.join() === 'b,a').key;
  const ev = f([['a', 20000]]); e.advanceTo(20200);
  assert.ok(!fired([...ev, ...e.drainEvents()]).some(x => x.unit === u));
});

test('confirmation strengthens the contributing Upro (favoured pathway)', () => {
  const e = new ConstitutiveEngineV2({ ...NOW, seed: 4 }), f = feeder(e);
  f([['a', 0], ['b', 1], ['a', 1000], ['b', 1040]]);
  const g0 = e.snapshot().units.find(x => x.afferents.join() === 'b,a').gains;
  f([['a', 5000], ['b', 5040]]); e.advanceTo(5100); e.drainEvents();
  const g1 = e.snapshot().units.find(x => x.afferents.join() === 'b,a').gains;
  assert.ok(g1[0] > g0[0] && g1[1] > g0[1]);
});

test('a late incidence weakens its Upro and shortens its delay (L81)', () => {
  const e = new ConstitutiveEngineV2({ ...NOW, seed: 5 }), f = feeder(e);
  f([['a', 0], ['b', 1], ['c', 2]]);
  f([['a', 1000], ['b', 1040], ['c', 1041]]); // Uint with afferents c, b, a
  const u0 = e.snapshot().units.find(x => x.afferents.length === 3);
  assert.ok(u0, 'three-afferent unit constituted');
  const iA = u0.afferents.indexOf('a'), dA = u0.delaysMs[iA], gA = u0.gains[iA];
  // b and c coincide at the unit (discharge at 9002); a's incidence arrives 3 ms later
  f([['a', 8963], ['b', 9000], ['c', 9001]]); e.advanceTo(9200); const ev = e.drainEvents();
  assert.ok(ev.some(x => x.type === 'upro.late' && x.unit === u0.key));
  const u1 = e.snapshot().units.find(x => x.key === u0.key);
  assert.ok(u1.gains[iA] < gA && u1.delaysMs[iA] < dA);
});

test('competitors are linked by inhibitory Upro', () => {
  const e = new ConstitutiveEngineV2({ ...NOW, seed: 6 }), f = feeder(e);
  f([['a', 0], ['b', 1], ['c', 2]]);
  f([['a', 1000], ['b', 1040]]);
  const u2 = created(f([['a', 3000], ['c', 3045]]), 'c,a')[0];
  assert.ok(u2 && u2.competitors.length >= 1);
  assert.ok(e.snapshot().upros.inhibitory >= 2);
});

test('surprise: a favoured unit firing is expected; a unit with no prior favour fired by a sudden change is a surprise', () => {
  const e = new ConstitutiveEngineV2({ ...NOW, seed: 10 }), f = feeder(e);
  f([['a', 0], ['b', 1], ['c', 2], ['d', 3]]);
  f([['a', 1000], ['b', 1040]]);  // interval unit: a's incidence is emitted 40 ms before (favour)
  f([['c', 3000], ['d', 3001]]);  // near-simultaneous onset: nothing emitted before the window
  const ev = [...f([['a', 6000], ['b', 6040], ['c', 9000], ['d', 9001]]), ...(e.advanceTo(9100), e.drainEvents())];
  const ab = e.snapshot().units.find(u => u.afferents.join() === 'b,a').key;
  const cd = e.snapshot().units.find(u => u.afferents.join() === 'd,c').key;
  const dab = fired(ev).find(x => x.unit === ab), dcd = fired(ev).find(x => x.unit === cd);
  assert.ok(dab && !dab.surprise && dab.favour >= 0.2, 'favoured: expected');
  assert.ok(dcd && dcd.surprise && dcd.cause === 'transdutiva', 'sudden change: surprise');
});

test('no incidence without a source: magnitude 0 never contributes and an idle engine stays silent', () => {
  const e = new ConstitutiveEngineV2({ ...NOW, seed: 7 }), f = feeder(e);
  f([['a', 0], ['b', 1], ['a', 1000], ['b', 1040]]);
  e.drainEvents(); e.advanceTo(3600000);
  assert.equal(fired(e.drainEvents()).length, 0);
});

test('checkpoint and restore reproduce the uninterrupted run exactly', () => {
  const script = [['a', 0], ['b', 1], ['c', 2]];
  for (let k = 1; k <= 40; k++) script.push(['a', k * 700], ['b', k * 700 + 40], ['c', k * 700 + 40 + (k % 3) * 20]);
  const run = cut => {
    let e = new ConstitutiveEngineV2({ seed: 8 }); const v = {}, out = [];
    for (let i = 0; i < script.length; i++) {
      const [ch, t] = script[i]; v[ch] = v[ch] === 'on' ? 'off' : 'on';
      e.ingest({ transducerId: ch, arrivedAtMs: t, measurement: v[ch] }); out.push(...e.drainEvents());
      if (i === cut) e = ConstitutiveEngineV2.restore(JSON.parse(JSON.stringify(e.checkpoint())));
    }
    e.advanceTo(40000); out.push(...e.drainEvents());
    return { out, snap: e.snapshot() };
  };
  const a = run(-1), b = run(60);
  assert.deepEqual(b.out, a.out);
  assert.deepEqual(b.snap, a.snap);
});

test('sleep: up-states drive every Uint equally; discharges follow excitability and Upro, none is invented', () => {
  const e = new ConstitutiveEngineV2({ seed: 9, clock: { cells: 4, timeScale: 1 } }), f = feeder(e);
  f([['a', 0], ['b', 1]]);
  const T0 = 20 * 3600000; e.advanceTo(T0); e.drainEvents();
  for (let k = 1; k <= 30; k++) f([['a', T0 + k * 2000], ['b', T0 + k * 2000 + 40]]);
  e.advanceTo(21.2 * 3600000);
  const ev = e.drainEvents();
  const sleep = ev.find(x => x.type === 'state.asleep');
  assert.ok(sleep, 'the clock produced at least one sleep episode');
  const P = e.describe().parameters;
  for (const r of ev.filter(x => x.type === 'unit.reactivated')) {
    assert.ok(ev.some(x => x.type === 'unit.discharge' && x.unit === r.unit && x.timeMs === r.timeMs));
    if (r.intrinsic) { const ph = (r.timeMs - sleep.timeMs) % P.upStatePeriodMs; assert.ok(ph <= P.upStateDurationMs + 1e-6, 'intrinsic only inside up-states'); }
  }
  assert.ok(ev.some(x => x.type === 'unit.reactivated' && x.intrinsic), 'up-states produced intrinsic discharges');
  assert.ok(!('sleepReactivationHz' in P));
});
