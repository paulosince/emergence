// Feed a recorded or surrogate incidence stream to an engine with the SAME
// ordering semantics as ExperimentSession: at each delivery the engine is
// advanced to the delivery time, receives the incidence, is advanced again,
// and its events are collected. Researcher-side tool; no world, no sensors.
import { assertExperimentEngine } from '../../contracts/engine.js';

export function replayIncidences(engine, incidences, { endTimeMs, onDelivered = null } = {}) {
  assertExperimentEngine(engine);
  if (!Number.isFinite(endTimeMs)) throw new RangeError('endTimeMs required');
  const sorted = incidences.slice().sort((a, b) => a.arrivedAtMs - b.arrivedAtMs);
  const events = [];
  const drain = now => { for (const d of engine.drainEvents()) events.push({ timeMs: Number.isFinite(d.timeMs) ? d.timeMs : now, detail: d }); };
  for (const i of sorted) {
    if (i.arrivedAtMs > endTimeMs) break;
    engine.advanceTo(i.arrivedAtMs); drain(i.arrivedAtMs);
    engine.ingest(i);
    engine.advanceTo(i.arrivedAtMs); drain(i.arrivedAtMs);
    if (onDelivered) onDelivered(i, engine);
  }
  engine.advanceTo(endTimeMs); drain(endTimeMs);
  return { events, finalSnapshot: engine.snapshot(), delivered: sorted.filter(i => i.arrivedAtMs <= endTimeMs).length };
}
