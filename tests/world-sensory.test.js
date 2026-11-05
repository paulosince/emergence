import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WorldSignalEnvironment } from '../src/sensory/world-signals.js';
import { createWorldSensoryScenario } from '../src/sensory/world-scenario.js';
import { createDropV1 } from '../src/world/scenarios.js';
import { createReleaseControlledWorld } from '../src/world/release-control.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';

const run = options => runExperiment({
  ...createWorldSensoryScenario(options),
  engine: new DiagnosticEngine(),
});

test('photogate output follows sphere geometry at two distinct heights', () => {
  const { environment } = createWorldSensoryScenario();
  assert.equal(environment.readAt('c0', 0), 1);
  assert.equal(environment.readAt('c0', 200), 1);
  assert.equal(environment.readAt('c0', 250), 0);
  assert.equal(environment.readAt('c0', 280), 0);
  assert.equal(environment.readAt('c0', 290), 1);
  assert.equal(environment.readAt('c1', 250), 1);
  assert.equal(environment.readAt('c1', 380), 0);
  assert.equal(environment.readAt('c1', 400), 0);
  assert.equal(environment.readAt('c1', 410), 1);
  // The second photogate also sees the sphere rebound, not an injected cue.
  assert.equal(environment.readAt('c1', 600), 0);
  assert.equal(environment.readAt('c1', 790), 1);
});

test('a single physical history produces distinct intermodal incidence patterns', () => {
  const result = run();
  assert.equal(result.manifest.environment.world.modelId,
    'analytic-vertical-sphere-plane');
  assert.deepEqual(result.manifest.environment.couplings.map(x => x.modality),
    ['optical', 'optical', 'mechanical']);
  const bySensor = id => result.incidences.filter(x => x.transducerId === id);
  assert.deepEqual(bySensor('s0').map(x => [x.observedAtMs, x.measurement]),
    [[0, 1], [250, 0], [290, 1]]);
  assert.deepEqual(bySensor('s1').map(x => [x.observedAtMs, x.measurement]),
    [[0, 1], [380, 0], [410, 1], [580, 0], [780, 1]]);
  const mechanical = bySensor('s2');
  assert.deepEqual(mechanical.map(x => x.observedAtMs), [0, 460, 470]);
  assert.equal(mechanical[0].measurement, 0);
  assert.ok(mechanical[1].measurement > 0);
  assert.equal(mechanical[2].measurement, 0);
  assert.equal(result.summary.emittedCount, 11);
  assert.equal(result.summary.deliveredCount, 11);
  assert.equal(result.finalSnapshot.nodeCount, 0);
  assert.equal(result.finalSnapshot.relationCount, 0);
});

test('force plate integrates exactly the analytic collision impulse in ONE sampling bin', () => {
  const { environment, world } = createWorldSensoryScenario();
  const impact = world.eventsThrough(800).find(e => e.type === 'collision.impact');
  assert.ok(impact);
  const readings = Array.from({ length: 81 }, (_, i) => environment.readAt('c2', i * 10));
  const nonzero = readings.map((v, i) => ({ v, timeMs: i * 10 }))
    .filter(x => x.v !== 0);
  assert.equal(nonzero.length, 1);
  assert.equal(nonzero[0].timeMs, 460);
  assert.ok(Math.abs(nonzero[0].v - impact.normalImpulseNs) < 1e-12);
  assert.ok(Math.abs(readings.reduce((a, b) => a + b, 0) -
    impact.normalImpulseNs) < 1e-12);
});

test('turning off a modality changes available incidences, not the world physics', () => {
  const both = run();
  const visualOnly = run({ modalities: ['optical'] });
  const mechanicalOnly = run({ modalities: ['mechanical'] });
  const none = run({ modalities: [] });
  for (const r of [visualOnly, mechanicalOnly, none]) {
    assert.deepEqual(r.manifest.environment.world, both.manifest.environment.world);
    assert.deepEqual(r.finalSnapshot, {
      timeMs: 800,
      receivedCount: r.summary.deliveredCount,
      lastIncidenceId: r.summary.deliveredCount ? r.incidences.at(-1).incidenceId : null,
      nodeCount: 0, relationCount: 0,
    });
  }
  assert.ok(visualOnly.incidences.every(i => ['s0', 's1'].includes(i.transducerId)));
  assert.ok(mechanicalOnly.incidences.every(i => i.transducerId === 's2'));
  assert.equal(none.summary.sampleCount, 0);
  assert.equal(none.summary.deliveredCount, 0);
  assert.deepEqual(none.incidences, []);
});

test('coarse sampling can miss a real beam obstruction', () => {
  const normal = run({ modalities: ['optical'] });
  const coarse = run({
    modalities: ['optical'],
    sensorOverrides: { s0: { periodMs: 100 } },
  });
  assert.ok(normal.incidences.some(i => i.transducerId === 's0' &&
    i.measurement === 0));
  const coarseUpper = coarse.incidences.filter(i => i.transducerId === 's0');
  assert.deepEqual(coarseUpper.map(i => i.measurement), [1]);
  assert.deepEqual(coarse.manifest.environment.world,
    normal.manifest.environment.world);
});

test('moving the photogate shifts its observed history but not the physical impact', () => {
  const baseline = run({ modalities: ['optical'] });
  const moved = run({
    modalities: ['optical'],
    couplingOverrides: { s0: { beamHeightM: 0.45 } },
  });
  assert.deepEqual(baseline.manifest.environment.world,
    moved.manifest.environment.world);
  assert.notDeepEqual(
    baseline.incidences.filter(i => i.transducerId === 's0').map(i => i.observedAtMs),
    moved.incidences.filter(i => i.transducerId === 's0').map(i => i.observedAtMs),
  );
});

test('delaying a sensor shifts reception but not world history or its observation times', () => {
  const base = run({ modalities: ['mechanical'] });
  const delayed = run({
    modalities: ['mechanical'],
    sensorOverrides: { s2: { latencyMs: 25 } },
  });
  assert.deepEqual(base.manifest.environment.world,
    delayed.manifest.environment.world);
  assert.deepEqual(base.incidences.map(i => [i.observedAtMs, i.measurement]),
    delayed.incidences.map(i => [i.observedAtMs, i.measurement]));
  for (const i of delayed.incidences) {
    assert.equal(i.arrivedAtMs - i.observedAtMs, 25);
  }
});

test('quantization affects output, not the physical collision impulse', () => {
  const base = run({ modalities: ['mechanical'] });
  const quantized = run({
    modalities: ['mechanical'],
    sensorOverrides: { s2: { quantum: 0.5 } },
  });
  const physicalImpulse = base.incidences.find(i => i.measurement > 0).measurement;
  const measured = quantized.incidences.find(i => i.measurement > 0).measurement;
  assert.equal(measured, Math.round(physicalImpulse / 0.5) * 0.5);
  assert.deepEqual(base.manifest.environment.world,
    quantized.manifest.environment.world);
});

test('the learner receives only numerical incidences, never physical truth or event labels', () => {
  const delivered = [];
  const engine = {
    ingest: i => delivered.push(structuredClone(i)),
    advanceTo: () => {},
    snapshot: () => ({}),
    drainEvents: () => [],
  };
  const result = runExperiment({ ...createWorldSensoryScenario(), engine });
  assert.ok(delivered.length > 0);
  for (const incidence of delivered) {
    assert.deepEqual(Object.keys(incidence).sort(),
      ['arrivedAtMs', 'incidenceId', 'measurement', 'observedAtMs', 'transducerId'].sort());
    assert.equal(typeof incidence.measurement, 'number');
  }
  assert.equal(JSON.stringify(delivered).includes('collision.impact'), false);
  assert.equal(JSON.stringify(delivered).includes('clearanceM'), false);
  assert.equal(JSON.stringify(delivered).includes('beamHeightM'), false);
  assert.equal(result.manifest.environment.world.parameters.clearanceM, 1);
});

test('the same physical scenario, seed and channels reproduce entire output', () => {
  assert.deepEqual(run(), run());
});

test('coupling definitions and integration windows are validated', () => {
  const world = createDropV1();
  assert.throws(() => new WorldSignalEnvironment({ world,
    couplings: [{ channelId: 'c0', type: 'photogate', beamHeightM: -0.1 }],
  }), RangeError);
  assert.throws(() => new WorldSignalEnvironment({ world,
    couplings: [
      { channelId: 'dup', type: 'photogate', beamHeightM: 0.5 },
      { channelId: 'dup', type: 'photogate', beamHeightM: 0.7 },
    ],
  }), /distinct/);
  const environment = new WorldSignalEnvironment({ world,
    couplings: [{ channelId: 'force', type: 'force-plate-impulse', windowMs: 3 }],
  });
  assert.throws(() => runExperiment({
    environment,
    transducers: [{ id: 's9', channelId: 'force', periodMs: 10 }],
    engine: new DiagnosticEngine(),
    endTimeMs: 500,
  }), /integration window/);
  assert.throws(() => createWorldSensoryScenario({
    modalities: ['optical', 'unknown'],
  }), /modality/);
  assert.throws(() => createWorldSensoryScenario({
    couplingOverrides: { s0: { type: 'force-plate-impulse' } },
  }), /physically fixed/);
});

test('unsupported physical horizons fail even with every sensor disabled', () => {
  // The first rebound's second impact is outside the one-collision model.
  const scene = createWorldSensoryScenario({ modalities: [], endTimeMs: 1000 });
  assert.throws(() => runExperiment({
    ...scene, engine: new DiagnosticEngine(),
  }), /one-impact/);
});

test('no gravity means no impact response in a stationary scene', () => {
  const world = createReleaseControlledWorld({
    gravityMps2: 0, clearanceM: 1,
  });
  const env = new WorldSignalEnvironment({ world,
    couplings: [{ type: 'force-plate-impulse', channelId: 'c0', windowMs: 10 }],
  });
  const runResult = runExperiment({
    environment: env, endTimeMs: 500, seed: 0,
    transducers: [{ id: 's0', channelId: 'c0', periodMs: 10 }],
    engine: new DiagnosticEngine(),
  });
  assert.ok(runResult.incidences.every(i => i.measurement === 0));
  assert.equal(world.describe().impactTimeMs, null);
});
