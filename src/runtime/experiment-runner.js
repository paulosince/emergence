// Deterministic synchronous orchestrator. No DOM, storage, files or wall clock.
import { assertExperimentEngine } from '../contracts/engine.js';
import { createIncidence } from '../contracts/incidence.js';
import { NumericTransducer } from '../sensory/numeric-transducer.js';
import { sensorRandomStream } from './seed-stream.js';
import { EventScheduler } from './event-scheduler.js';
import { SimulatedClock } from './simulated-clock.js';
import { TEMPO_SOURCE_COMMIT } from '../tempo/reference-runner.js';

const enginesAlreadyExecuted = new WeakSet();

export function runExperiment({
  environment, transducers, engine, seed = 0, endTimeMs,
  maxEvents = 100000, softwareRevision = null,
}) {
  assertExperimentEngine(engine);
  if (!environment || typeof environment.readAt !== 'function' ||
      typeof environment.specification !== 'function') {
    throw new TypeError('A trace environment is required');
  }
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) {
    throw new RangeError('Seed must be an unsigned 32-bit integer');
  }
  if (!Number.isFinite(endTimeMs) || endTimeMs < 0) {
    throw new RangeError('endTimeMs must be finite and nonnegative');
  }
  if (softwareRevision !== null && (typeof softwareRevision !== 'string' ||
      !softwareRevision.trim())) {
    throw new TypeError('softwareRevision must be a non-empty string or null');
  }
  if (!Number.isInteger(maxEvents) || maxEvents < 1) {
    throw new RangeError('maxEvents must be a positive integer');
  }
  if (!Array.isArray(transducers) || !transducers.length) {
    throw new TypeError('At least one transducer configuration is required');
  }
  const sensors = transducers.map(spec => new NumericTransducer(spec));
  const ids = sensors.map(s => s.config.id);
  if (new Set(ids).size !== ids.length) throw new RangeError('Duplicate transducer IDs');
  // State carried over from a prior run would be undeclared experimental input.
  // Resume will require a versioned checkpoint instead of silent object reuse.
  if (enginesAlreadyExecuted.has(engine)) {
    throw new Error('Engine already used: create a fresh instance per run');
  }
  enginesAlreadyExecuted.add(engine);

  const scheduler = new EventScheduler();
  const clock = new SimulatedClock();
  const streams = new Map(sensors.map(s => [s.config.id, sensorRandomStream(seed, s.config.id)]));
  const incidences = [];
  const trace = [];
  let processedEvents = 0, sampleCount = 0, suppressedCount = 0;
  let deliveredCount = 0, engineEventCount = 0;
  let nextId = 0;

  const observeEngine = () => {
    const events = engine.drainEvents();
    if (!Array.isArray(events)) throw new TypeError('drainEvents() must return an array');
    for (const detail of events) {
      if (!detail || typeof detail !== 'object') throw new TypeError('Invalid engine event');
      trace.push({
        order: trace.length + 1,
        timeMs: Number.isFinite(detail.timeMs) ? detail.timeMs : clock.timeMs,
        recordedAtMs: clock.timeMs,
        type: 'engine.event', detail: structuredClone(detail),
      });
      engineEventCount++;
    }
  };

  for (let i = 0; i < sensors.length; i++) {
    const sensor = sensors[i];
    if (sensor.config.phaseMs <= endTimeMs) {
      scheduler.schedule(sensor.config.phaseMs, 'sample', { sensorIndex: i, tickIndex: 0 });
    }
  }

  while (scheduler.size && scheduler.peekTime() <= endTimeMs) {
    if (++processedEvents > maxEvents) {
      throw new RangeError('Event limit exceeded; lower horizon or increase maxEvents');
    }
    const event = scheduler.next();
    clock.advanceTo(event.timeMs);
    // Internal operations scheduled earlier for the same time complete before
    // the currently arriving external incidence is ingested.
    engine.advanceTo(clock.timeMs);
    observeEngine();

    if (event.kind === 'sample') {
      const { sensorIndex, tickIndex } = event.payload;
      const sensor = sensors[sensorIndex];
      const result = sensor.sampleAt(clock.timeMs, environment, streams.get(sensor.config.id));
      sampleCount++;
      let incidence = null;
      if (result.emitted) {
        incidence = createIncidence({
          incidenceId: 'i' + (++nextId), transducerId: sensor.config.id,
          observedAtMs: result.observedAtMs, arrivedAtMs: result.arrivedAtMs,
          measurement: result.measurement,
        });
        // A sensor can observe before the horizon but deliver after the horizon.
        scheduler.schedule(incidence.arrivedAtMs, 'deliver', { incidence });
      } else {
        suppressedCount++;
      }
      trace.push({
        order: trace.length + 1, timeMs: clock.timeMs, type: 'sensor.sample',
        transducerId: sensor.config.id,
        incidenceId: incidence?.incidenceId ?? null,
        rawValue: result.rawValue,
        measurement: result.measurement, emitted: result.emitted,
      });
      // Derive from tick index to avoid cumulative floating-point drift.
      const nextTick = tickIndex + 1;
      const tNext = sensor.config.phaseMs + nextTick * sensor.config.periodMs;
      if (tNext <= endTimeMs) {
        scheduler.schedule(tNext, 'sample', { sensorIndex, tickIndex: nextTick });
      }
    } else if (event.kind === 'deliver') {
      const { incidence } = event.payload;
      // Record causal input before any response produced by the engine.
      trace.push({
        order: trace.length + 1, timeMs: clock.timeMs,
        type: 'incidence.delivered', incidenceId: incidence.incidenceId,
        transducerId: incidence.transducerId,
        observedAtMs: incidence.observedAtMs,
        arrivedAtMs: incidence.arrivedAtMs,
        measurement: incidence.measurement,
      });
      // The engine sees ONLY the incidence and the current simulated time.
      engine.ingest(incidence);
      engine.advanceTo(clock.timeMs);
      observeEngine();
      incidences.push(incidence);
      deliveredCount++;
    } else {
      throw new Error('Unknown scheduled event: ' + event.kind);
    }
  }

  clock.advanceTo(endTimeMs);
  engine.advanceTo(endTimeMs);
  observeEngine();

  const manifest = {
    schemaVersion: '1.0.0',
    software: { name: 'EMERGENCE', version: '0.2.0', revision: softwareRevision },
    execution: 'deterministic-event-simulation',
    seed, endTimeMs, maxEvents,
    tempoReferenceCommit: TEMPO_SOURCE_COMMIT,
    environment: environment.specification(), // researcher-only provenance
    transducers: sensors.map(s => ({ ...s.config })),
    engine: typeof engine.describe === 'function' ? engine.describe() : { id: 'unspecified' },
    eventOrdering: 'simulated-time-then-insertion-sequence',
  };
  return {
    manifest,
    summary: {
      sampleCount, suppressedCount,
      emittedCount: sampleCount - suppressedCount,
      deliveredCount,
      pendingScheduledEvents: scheduler.size,
      processedEvents, engineEventCount,
    },
    incidences,
    trace,
    finalSnapshot: structuredClone(engine.snapshot()),
  };
}