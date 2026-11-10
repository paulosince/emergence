import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ConstitutiveEngine } from '../src/engines/constitutive/engine.js';
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { OracleIntervalControl } from '../src/engines/oracle-interval-control.js';

test('checkpoint contract: restore at mid-run and continue reproduces the uninterrupted run exactly (with clock and sleep)', () => {
  const { world, ...cfg } = createEpisodicDropScenario({ episodes: 30, scheduleSeed: 2, sensorOverrides: { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } } });
  const inc = runExperiment({ ...cfg, engine: new OracleIntervalControl() }).incidences.slice().sort((a, b) => a.arrivedAtMs - b.arrivedAtMs);
  const opts = { seed: 3, clock: { cells: 6, timeScale: 3600 } };
  const feed = (e, list, out) => { for (const i of list) { e.advanceTo(i.arrivedAtMs); e.ingest(i); e.advanceTo(i.arrivedAtMs); out.push(...e.drainEvents()); } };
  const mid = Math.floor(inc.length / 2);
  const a = new ConstitutiveEngine(opts), evA = [];
  feed(a, inc, evA); a.advanceTo(cfg.endTimeMs); evA.push(...a.drainEvents());
  const b = new ConstitutiveEngine(opts), evB = [];
  feed(b, inc.slice(0, mid), evB);
  const ck = JSON.parse(JSON.stringify(b.checkpoint()));
  const c = ConstitutiveEngine.restore(ck);
  feed(c, inc.slice(mid), evB); c.advanceTo(cfg.endTimeMs); evB.push(...c.drainEvents());
  assert.equal(evB.length, evA.length);
  assert.deepEqual(evB, evA);
  assert.deepEqual(c.snapshot(), a.snapshot());
});

test('checkpoint refuses undrained events and foreign objects', () => {
  const e = new ConstitutiveEngine({ seed: 1 });
  e.ingest({ transducerId: 'a', arrivedAtMs: 0, measurement: 0 });
  e.ingest({ transducerId: 'b', arrivedAtMs: 1, measurement: 0 });
  e.ingest({ transducerId: 'a', arrivedAtMs: 100, measurement: 1 });
  e.ingest({ transducerId: 'b', arrivedAtMs: 140, measurement: 1 });
  e.advanceTo(5000); // tonic releases of the novelty source are pending
  assert.throws(() => e.checkpoint(), /Drain events/);
  e.drainEvents();
  assert.doesNotThrow(() => e.checkpoint());
  assert.throws(() => ConstitutiveEngine.restore({ schema: 'x' }), /Not a constitutive-engine checkpoint/);
});
