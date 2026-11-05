import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBodyScenario } from '../src/body/body-scenario.js';
import { createActuatedWorld } from '../src/body/actuated-world.js';
import { BodySignalEnvironment } from '../src/body/body-signals.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';

const execute = args => runExperiment({
  ...createBodyScenario(args), engine: new DiagnosticEngine(),
});
const series = (result, id) => result.incidences
  .filter(i => i.transducerId === id)
  .map(i => [i.observedAtMs, i.measurement]);

test('four sensory modalities sample ONE dynamic body/world without labels', () => {
  const output = execute();
  assert.deepEqual(output.manifest.environment.couplings.map(x => x.modality),
    ['optical', 'optical', 'mechanical', 'proprioceptive',
      'interoceptive', 'interoceptive', 'interoceptive']);
  assert.equal(output.manifest.environment.world.modelId,
    'analytic-actuated-sphere-plane');
  assert.equal(output.finalSnapshot.nodeCount, 0);
  assert.equal(output.finalSnapshot.relationCount, 0);
  assert.ok(series(output, 's3').some(x => x[1] > 0));
  assert.ok(series(output, 's4').some(x => x[1] < 10));
  assert.ok(series(output, 's5').some(x => x[1] > 2.95));
  assert.ok(series(output, 's6').some(x => x[1] > 0));
  assert.ok(series(output, 's2').some(x => x[1] > 0));
  assert.ok(series(output, 's0').some(x => x[1] === 0));
  assert.ok(output.incidences.every(i =>
    Object.keys(i).every(k => ['incidenceId', 'transducerId', 'observedAtMs',
      'arrivedAtMs', 'measurement'].includes(k))));
});

test('body sensors use physical analog observables, not preexisting unit names', () => {
  const scene = createBodyScenario();
  const environment = scene.environment;
  const bodyMid = scene.world.bodyStateAt(500);
  assert.equal(environment.readAt('c3', 500), 5 * bodyMid.jointExtensionM);
  assert.equal(environment.readAt('c4', 500), bodyMid.capacitorVoltageV);
  assert.equal(environment.readAt('c5', 500), 0.01 * bodyMid.internalTemperatureK);
  assert.equal(environment.readAt('c6', 500), bodyMid.motorCurrentA);
  assert.equal(environment.readAt('c6', 50), 0);
  assert.equal(environment.readAt('c6', 1000), 0);
  assert.notEqual(environment.readAt('c0', 1400),
    environment.readAt('c0', 0));
});

test('modality ablations alter only input availability, never world history', () => {
  const full = execute();
  for (const modalities of [
    ['optical'], ['mechanical'], ['proprioceptive'],
    ['interoceptive'], ['optical', 'interoceptive'], [],
  ]) {
    const subset = execute({ modalities });
    assert.deepEqual(subset.manifest.environment.world,
      full.manifest.environment.world);
    assert.equal(subset.finalSnapshot.nodeCount, 0);
    const ids = new Set(subset.manifest.transducers.map(s => s.id));
    assert.ok(subset.incidences.every(i => ids.has(i.transducerId)));
    if (!modalities.length) {
      assert.equal(subset.summary.sampleCount, 0);
      assert.equal(subset.summary.deliveredCount, 0);
    }
  }
});

test('internal state has physical consequences only when lifting occurs', () => {
  const lift = execute({ modalities: ['interoceptive', 'proprioceptive'] });
  const none = execute({
    modalities: ['interoceptive', 'proprioceptive'],
    worldOptions: { liftHeightM: 0 },
  });
  assert.notDeepEqual(lift.manifest.environment.world, none.manifest.environment.world);
  assert.ok(series(lift, 's3').some(x => x[1] > 0));
  assert.ok(series(lift, 's4').some(x => x[1] < 10));
  assert.ok(series(lift, 's5').some(x => x[1] > 2.95));
  assert.ok(series(lift, 's6').some(x => x[1] > 0));
  assert.deepEqual(series(none, 's3').map(x => x[1]), [0]);
  assert.deepEqual(series(none, 's4').map(x => x[1]), [10]);
  assert.deepEqual(series(none, 's5').map(x => x[1]), [2.95]);
  assert.deepEqual(series(none, 's6').map(x => x[1]), [0]);
});

test('changing sensor sample period or latency cannot alter physical heat', () => {
  const normal = execute();
  const alternate = execute({
    sensorOverrides: {
      s4: { periodMs: 80, latencyMs: 40 },
      s3: { periodMs: 100 },
    },
  });
  assert.deepEqual(normal.manifest.environment.world,
    alternate.manifest.environment.world);
  assert.notDeepEqual(series(normal, 's4'), series(alternate, 's4'));
  assert.deepEqual(series(normal, 's0'), series(alternate, 's0'));
  assert.deepEqual(series(normal, 's2'), series(alternate, 's2'));
});

test('changing experimenter action timing changes physical and sensory history', () => {
  const first = execute();
  const later = execute({ worldOptions: { startAtMs: 300 } });
  assert.ok(later.manifest.environment.world.impactTimeMs >
    first.manifest.environment.world.impactTimeMs);
  assert.notDeepEqual(series(first, 's3'), series(later, 's3'));
  assert.notDeepEqual(series(first, 's2'), series(later, 's2'));
});

test('body and extero sensor signals are repeatable given identical conditions', () => {
  assert.deepEqual(execute(), execute());
});

test('invalid and disabled modalities are rejected', () => {
  assert.throws(() => createBodyScenario({
    modalities: ['interoceptive', 'interoceptive'],
  }), /modality/);
  assert.throws(() => createBodyScenario({
    sensorOverrides: { unregistered: { periodMs: 10 } },
  }), /inactive/);
  assert.throws(() => createBodyScenario({
    modalities: [],
    sensorOverrides: { s5: { periodMs: 10 } },
  }), /inactive/);
  assert.throws(() => new BodySignalEnvironment({
    world: createActuatedWorld(),
    couplings: [{ channelId: 'a', type: 'temperature-voltage', gain: 0 }],
  }), /gain/);
  assert.throws(() => createBodyScenario({
    sensorOverrides: { s4: { role: 'world-truth' } },
  }), /Undeclared/);
});

test('even with sensors absent, unsupported second impact remains forbidden', () => {
  const scene = createBodyScenario({ modalities: [], endTimeMs: 2000 });
  assert.throws(() => runExperiment({
    ...scene, engine: new DiagnosticEngine(),
  }), /one-impact/);
});

test('the engine receives only scalar measurements and no body physical truth', () => {
  const captured = [];
  const engine = {
    ingest(incidence) { captured.push(structuredClone(incidence)); },
    advanceTo() {}, snapshot: () => ({}), drainEvents: () => [],
  };
  runExperiment({ ...createBodyScenario(), engine });
  assert.ok(captured.length > 0);
  const serialized = JSON.stringify(captured);
  assert.equal(serialized.includes('capacitorEnergyJ'), false);
  assert.equal(serialized.includes('jointExtensionM'), false);
  assert.equal(serialized.includes('intervention.motor-command'), false);
  assert.equal(serialized.includes('optical'), false);
  assert.equal(serialized.includes('interoceptive'), false);
});
