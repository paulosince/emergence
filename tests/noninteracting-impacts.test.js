import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createNoninteractingImpacts } from '../src/research/noninteracting-impacts.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';

function execute(arrangement) {
  return runExperiment({
    ...createNoninteractingImpacts({ arrangement }),
    engine: new DiagnosticEngine(),
  });
}
const readings = (run, id) => run.incidences
  .filter(i => i.transducerId === id).map(i =>
    ({ at: i.observedAtMs, value: i.measurement }));

test('two physical origins can collide in the SAME observation bin without interacting', () => {
  const scene = createNoninteractingImpacts({ arrangement: 'coincident' });
  const a = scene.environment.specification();
  assert.equal(a.physicalInteractionBetweenSources, false);
  assert.equal(a.releaseCoordinationByExperimenter, true);
  assert.equal(a.sources.length, 2);
  const [worldA, worldB] = a.sources.map(x => x.world);
  assert.ok(Math.abs(worldA.impactTimeMs - worldB.impactTimeMs) < 1e-9);
  assert.equal(worldA.parameters.clearanceM, 1);
  assert.equal(worldB.parameters.clearanceM, 0.25);
  assert.ok(worldB.intervention.releaseAtMs > 0);
  const run = execute('coincident');
  const a0 = readings(run, 's0'), b0 = readings(run, 's1');
  assert.deepEqual(a0.map(x => x.at), [0, 460, 470]);
  assert.deepEqual(b0.map(x => x.at), [0, 460, 470]);
  assert.notEqual(a0[1].value, b0[1].value);
  assert.equal(run.summary.deliveredCount, 6);
  // Temporal simultaneity does not entitle any inference of common origin.
  assert.equal(run.finalSnapshot.nodeCount, 0);
});

test('changing only external release timing separates the two collision times', () => {
  const simultaneous = execute('coincident');
  const staggered = execute('staggered');
  const sA = simultaneous.manifest.environment.sources[0].world;
  const dA = staggered.manifest.environment.sources[0].world;
  assert.deepEqual(sA, dA);
  const sB = simultaneous.manifest.environment.sources[1].world;
  const dB = staggered.manifest.environment.sources[1].world;
  assert.deepEqual(sB.parameters, dB.parameters);
  assert.equal(sB.intervention.releaseAtMs > 0, true);
  assert.equal(dB.intervention.releaseAtMs, 0);
  assert.ok(dB.impactTimeMs < sB.impactTimeMs);
  assert.deepEqual(readings(simultaneous, 's0'), readings(staggered, 's0'));
  assert.deepEqual(readings(staggered, 's1').map(i => i.at), [0, 230, 240]);
  assert.deepEqual(readings(simultaneous, 's1').map(i => i.at), [0, 460, 470]);
});

test('two-source scenario reproduces and rejects invalid arrangement', () => {
  assert.deepEqual(execute('coincident'), execute('coincident'));
  assert.throws(() => createNoninteractingImpacts({
    arrangement: 'causally-linked',
  }), /Arrangement/);
  const invalid = createNoninteractingImpacts({
    arrangement: 'coincident', endTimeMs: 1000,
  });
  assert.throws(() => runExperiment({
    ...invalid, engine: new DiagnosticEngine(),
  }), /one-impact/);
});

test('world-source labels and causal assumptions never reach the experimental engine', () => {
  const captured = [];
  const engine = {
    ingest: x => captured.push({ ...x }),
    advanceTo() {},
    snapshot: () => ({}),
    drainEvents: () => [],
  };
  const run = runExperiment({ ...createNoninteractingImpacts(), engine });
  assert.equal(captured.length, 6);
  assert.ok(!JSON.stringify(captured).includes('world-A'));
  assert.ok(!JSON.stringify(captured).includes('world-B'));
  assert.ok(!JSON.stringify(captured).includes('collision.impact'));
  assert.ok(!JSON.stringify(captured).includes('releaseCoordinationByExperimenter'));
  assert.equal(run.manifest.environment.sources.length, 2);
});
