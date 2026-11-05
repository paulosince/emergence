import { EMERGENCE_VERSION } from '../src/research/version.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SimulatedClock } from '../src/runtime/simulated-clock.js';
import { EventScheduler } from '../src/runtime/event-scheduler.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';
import { TempoFixedNodesControl } from '../src/engines/tempo-fixed-nodes-control.js';
import { TraceEnvironment } from '../src/sensory/trace-environment.js';
import { createPhase1Scenario } from '../src/sensory/scenarios.js';

test('simulated clock is monotonic; independent of wall time', () => {
  const clock = new SimulatedClock();
  assert.equal(clock.advanceTo(0), 0);
  assert.equal(clock.advanceTo(10.5), 10.5);
  assert.throws(() => clock.advanceTo(10.4));
  assert.throws(() => clock.advanceTo(Infinity));
  assert.throws(() => new SimulatedClock(-1));
});

test('scheduler ties are resolved by insertion order', () => {
  const q = new EventScheduler();
  q.schedule(10, 'first');
  q.schedule(5, 'early');
  q.schedule(10, 'second');
  assert.deepEqual([q.next().kind, q.next().kind, q.next().kind],
    ['early', 'first', 'second']);
  assert.equal(q.next(), null);
  assert.throws(() => q.schedule(4, 'time-travel'));
});

test('same timestamp: sensor registration determines deterministic delivery order', () => {
  const scene = {
    environment: new TraceEnvironment({ scenarioId: 'ties', channels: {
      x: [[0, 1]], y: [[0, 2]],
    } }),
    transducers: [
      { id: 'A', channelId: 'x', periodMs: 10 },
      { id: 'B', channelId: 'y', periodMs: 10 },
    ],
    engine: new DiagnosticEngine(), seed: 1, endTimeMs: 0,
  };
  const result = runExperiment(scene);
  assert.deepEqual(result.incidences.map(x => x.transducerId), ['A', 'B']);
  assert.deepEqual(result.trace.filter(x => x.type === 'incidence.delivered')
    .map(x => x.transducerId), ['A', 'B']);
});

test('A=100ms, B=37ms, C=11ms: 30 samples, 29 deliveries and one delayed pending event', () => {
  const result = runExperiment({ ...createPhase1Scenario(), engine: new DiagnosticEngine() });
  assert.deepEqual(result.summary, {
    sampleCount: 30, suppressedCount: 0, emittedCount: 30,
    deliveredCount: 29, pendingScheduledEvents: 1,
    processedEvents: 59, engineEventCount: 29,
  });
  assert.deepEqual(result.incidences.filter(x => x.transducerId === 'A')
    .map(x => [x.observedAtMs, x.arrivedAtMs]),
    [[0, 4], [100, 104], [200, 204]]);
  assert.deepEqual(result.incidences.filter(x => x.transducerId === 'B')
    .map(x => x.observedAtMs), [0, 37, 74, 111, 148, 185]);
  assert.equal(result.manifest.tempoReferenceCommit.length, 40);
  assert.equal(result.finalSnapshot.nodeCount, 0);
});

test('every delivered incidence links to its sample and is recorded before engine response', () => {
  const result = runExperiment({ ...createPhase1Scenario(), engine: new DiagnosticEngine() });
  for (const incidence of result.incidences) {
    const sample = result.trace.find(x => x.type === 'sensor.sample' &&
      x.incidenceId === incidence.incidenceId);
    const delivered = result.trace.find(x => x.type === 'incidence.delivered' &&
      x.incidenceId === incidence.incidenceId);
    const received = result.trace.find(x => x.type === 'engine.event' &&
      x.detail.incidenceId === incidence.incidenceId);
    assert.ok(sample && delivered && received);
    assert.ok(sample.order < delivered.order && delivered.order < received.order);
    assert.equal(delivered.timeMs, incidence.arrivedAtMs);
  }
});

test('same seed and same protocol reproduce the entire output', () => {
  const a = runExperiment({ ...createPhase1Scenario(), engine: new DiagnosticEngine() });
  const b = runExperiment({ ...createPhase1Scenario(), engine: new DiagnosticEngine() });
  assert.deepEqual(a, b);
});

test('simulation enforces event count safety cap', () => {
  assert.throws(() => runExperiment({
    ...createPhase1Scenario(), engine: new DiagnosticEngine(), maxEvents: 2,
  }), /Event limit/);
});

test('learning engine never receives environment truth, only numerical incidences', () => {
  const received = [];
  const env = {
    readAt: () => 7,
    specification: () => ({ scenarioId: 'truth-hidden', hiddenGroundTruth: 'OBJECT_X' }),
  };
  const engine = {
    ingest: x => received.push(x),
    advanceTo: () => {},
    snapshot: () => ({}),
    drainEvents: () => [],
  };
  const result = runExperiment({
    environment: env, transducers: [{ id: 'S', channelId: 'scalar', periodMs: 100 }],
    engine, seed: 1, endTimeMs: 0,
  });
  assert.equal(result.manifest.environment.hiddenGroundTruth, 'OBJECT_X');
  assert.deepEqual(Object.keys(received[0]).sort(),
    ['arrivedAtMs','incidenceId','measurement','observedAtMs','transducerId'].sort());
  assert.equal(received[0].measurement, 7);
  assert.equal(JSON.stringify(received).includes('OBJECT_X'), false);
});

test('TEMPO fixed-node control uses existing 3 nodes and marks mappings as preassigned', () => {
  const result = runExperiment({
    ...createPhase1Scenario(),
    engine: new TempoFixedNodesControl({
      nodeCount: 3, transducerNodes: { A: 0, B: 1, C: 2 }, seed: 42,
    }),
  });
  assert.equal(result.manifest.engine.nodesArePredefined, true);
  assert.equal(result.manifest.engine.measurementsIgnored, true);
  assert.equal(result.finalSnapshot.nodeCount, 3);
  assert.ok(result.trace.some(x => x.type === 'engine.event' &&
    x.detail.type === 'node.fired'));
});

test('phase1 runner rejects invalid experiments before executing', () => {
  const scene = createPhase1Scenario();
  assert.throws(() => runExperiment({ ...scene, engine: new DiagnosticEngine(), seed: -1 }));
  assert.throws(() => runExperiment({ ...scene, engine: new DiagnosticEngine(), endTimeMs: -1 }));
  assert.throws(() => runExperiment({ ...scene, engine: new DiagnosticEngine(),
    transducers: [scene.transducers[0], scene.transducers[0]] }), /Duplicate/);
});
test('manifest identifies EMERGENCE revision and all fixed-node control parameters', () => {
  const run = runExperiment({
    ...createPhase1Scenario(),
    engine: new TempoFixedNodesControl({
      nodeCount: 3, transducerNodes: { A: 0, B: 1, C: 2 },
      seed: 42, K: 2, mode: 'shift', eta: 0.1,
    }),
    softwareRevision: 'revision-for-test',
  });
  assert.deepEqual(run.manifest.software, {
    name: 'EMERGENCE', version: EMERGENCE_VERSION, revision: 'revision-for-test',
  });
  assert.equal(run.manifest.engine.nodeCount, 3);
  assert.equal(run.manifest.engine.seed, 42);
  assert.equal(run.manifest.engine.K, 2);
  assert.equal(run.manifest.engine.mode, 'shift');
  assert.equal(run.manifest.engine.eta, 0.1);
});

test('TEMPO internal events record effective time separately from collection time', () => {
  const scene = createPhase1Scenario();
  const run = runExperiment({
    ...scene, engine: new TempoFixedNodesControl({
      nodeCount: 3, transducerNodes: { A: 0, B: 1, C: 2 },
      seed: scene.seed,
    }),
  });
  const events = run.trace.filter(x => x.type === 'engine.event');
  assert.ok(events.length > 0);
  assert.ok(events.every(x => Number.isFinite(x.timeMs) &&
    x.recordedAtMs >= x.timeMs));
});

test('a stateful engine instance cannot silently contaminate a subsequent run', () => {
  const engine = new DiagnosticEngine();
  const scene = createPhase1Scenario();
  runExperiment({ ...scene, engine });
  assert.throws(() => runExperiment({ ...scene, engine }), /fresh instance/);
});
