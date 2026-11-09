import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GwrComparator } from '../src/engines/comparators/gwr.js';
test('GWR grows on novel inputs and stops growing on a repeated pattern (habituation)', () => {
  const g = new GwrComparator(); let v = 0;
  const pulse = t => { v = 1 - v; g.ingest({ transducerId: 'a', arrivedAtMs: t, measurement: v }); g.ingest({ transducerId: 'b', arrivedAtMs: t + 40, measurement: v }); };
  g.ingest({ transducerId: 'a', arrivedAtMs: 0, measurement: v }); g.ingest({ transducerId: 'b', arrivedAtMs: 0, measurement: v });
  for (let k = 1; k <= 300; k++) pulse(k * 1000);
  const ev = g.drainEvents(), created = ev.filter(e => e.type === 'unit.created');
  const late = created.filter(e => e.timeMs > 200000).length;
  assert.ok(created.length >= 2);
  assert.equal(late, 0, 'no growth once the repeated input is learned');
  assert.ok(ev.filter(e => e.type === 'unit.discharge').length > 100);
});
