import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TraceEnvironment } from '../src/sensory/trace-environment.js';
import { NumericTransducer } from '../src/sensory/numeric-transducer.js';
import { sensorRandomStream } from '../src/runtime/seed-stream.js';
import { createIncidence } from '../src/contracts/incidence.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';

test('piecewise traces retain exact transitions; no interpolation is invented', () => {
  const e = new TraceEnvironment({ scenarioId: 'step', channels: {
    signal: [[0, 1], [12, 7], [50, -3]],
  } });
  assert.deepEqual([e.readAt('signal', 0), e.readAt('signal', 11.99),
    e.readAt('signal', 12), e.readAt('signal', 99)], [1, 1, 7, -3]);
  assert.throws(() => e.readAt('missing', 0));
  assert.throws(() => new TraceEnvironment({scenarioId:'bad',
    channels:{signal:[[2,1]]}}));
});

test('transducer change mode emits only signal changes exceeding the threshold', () => {
  const env = new TraceEnvironment({ scenarioId: 'change', channels: {
    signal: [[0, 0], [1, 0.2], [2, 0.9], [3, 1.0]],
  } });
  const s = new NumericTransducer({
    id: 'A', channelId: 'signal', periodMs: 1,
    emitMode: 'change', minDelta: 0.5,
  });
  const rng = sensorRandomStream(0, 'A');
  assert.deepEqual([0, 1, 2, 3].map(t => s.sampleAt(t, env, rng).emitted),
    [true, false, true, false]);
});

test('numeric transducer quantization changes measurement without interpreting it', () => {
  const env = new TraceEnvironment({ scenarioId: 'quant', channels: {
    scalar: [[0, 0.74]],
  } });
  const s = new NumericTransducer({
    id: 'Q', channelId: 'scalar', periodMs: 11, quantum: 0.5, latencyMs: 3,
  });
  const reading = s.sampleAt(0, env, sensorRandomStream(1, 'Q'));
  assert.equal(reading.rawValue, 0.74);
  assert.equal(reading.measurement, 0.5);
  assert.equal(reading.arrivedAtMs, 3);
});

test('a sensor RNG is stable even if another sensor is added or reordered', () => {
  const env = new TraceEnvironment({ scenarioId: 'noise', channels: {
    x: [[0, 1]], y: [[0, 2]],
  } });
  const a = { id: 'A', channelId: 'x', periodMs: 10, noiseStd: 0.1 };
  const b = { id: 'B', channelId: 'y', periodMs: 10, noiseStd: 0.1 };
  const run = transducers => runExperiment({
    environment: env, transducers, engine: new DiagnosticEngine(),
    seed: 345, endTimeMs: 30,
  }).incidences.filter(x => x.transducerId === 'A').map(x => x.measurement);
  assert.deepEqual(run([a]), run([a, b]));
  assert.deepEqual(run([a, b]), run([b, a]));
});

test('incidence has separate physical observation and reception timestamps', () => {
  const i = createIncidence({
    transducerId: 'sensor', observedAtMs: 12, arrivedAtMs: 17,
    incidenceId: 'i2', measurement: 1,
  });
  assert.ok(Object.isFrozen(i));
  assert.equal(i.arrivedAtMs - i.observedAtMs, 5);
  assert.throws(() => createIncidence({
    transducerId: 'sensor', observedAtMs: 12, arrivedAtMs: 10, measurement: 1,
  }));
});

test('suppressed samples are recorded but not delivered as incidences', () => {
  const env = new TraceEnvironment({ scenarioId: 'quiet', channels: {
    signal: [[0, 1]],
  } });
  const result = runExperiment({
    environment: env,
    transducers: [{id:'A',channelId:'signal',periodMs:10,emitMode:'change'}],
    seed: 0, endTimeMs: 30, engine: new DiagnosticEngine(),
  });
  assert.equal(result.summary.sampleCount, 4);
  assert.equal(result.summary.emittedCount, 1);
  assert.equal(result.summary.suppressedCount, 3);
  assert.equal(result.summary.deliveredCount, 1);
  assert.equal(result.trace.filter(x => x.type === 'sensor.sample').length, 4);
});