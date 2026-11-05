import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createIncidence } from '../src/contracts/incidence.js';
import { assertExperimentEngine } from '../src/contracts/engine.js';
import { toCsv } from '../src/research/csv.js';

test('incidences contain only transducer data, not supplied categories', () => {
  const occurrence = createIncidence({ transducerId: 'A', observedAtMs: 11, measurement: 0.21 });
  assert.deepEqual(occurrence, { transducerId: 'A', observedAtMs: 11, measurement: 0.21 });
  assert.ok(Object.isFrozen(occurrence));
  assert.throws(() => createIncidence({ transducerId: '', observedAtMs: 2, measurement: 1 }));
  assert.throws(() => createIncidence({ transducerId: 'A', observedAtMs: -1, measurement: 1 }));
});

test('engine interface validates behavior availability, not its implementation', () => {
  const conforming = { ingest(){}, advanceTo(){}, snapshot(){}, drainEvents(){} };
  assert.equal(assertExperimentEngine(conforming), conforming);
  assert.throws(() => assertExperimentEngine({ ingest(){} }));
});

test('CSV escapes scientific data without changing its fields', () => {
  assert.equal(
    toCsv([{ time_ms: 11, note: 'a,b' }, { time_ms: 37, note: 'x"y' }], ['time_ms', 'note']),
    'time_ms,note\r\n11,"a,b"\r\n37,"x""y"\r\n'
  );
});
