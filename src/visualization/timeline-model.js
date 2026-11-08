// One time axis for every view. Each item keeps the exact time recorded by
// the simulation; no view rounds, shifts or interpolates event times.
// Researcher-only world events and data received by the engine stay in
// separate, labelled lanes. No DOM.

export const LANES = Object.freeze([
  { id: 'world', audience: 'researcher', label: 'Mundo físico (somente pesquisador)' },
  { id: 'observed', audience: 'researcher', label: 'Amostras emitidas pelos transdutores' },
  { id: 'delivered', audience: 'engine', label: 'Incidências entregues ao motor' },
  { id: 'engine', audience: 'engine', label: 'Eventos registrados pelo motor' },
]);

// `horizonMs`: executed horizon. Items after it are never returned, even if
// the caller passes them (e.g. analytic world events computed ahead).
export function timelineModel({ incidences = [], trace = [], worldEvents = [], horizonMs }) {
  if (!Number.isFinite(horizonMs)) throw new RangeError('horizonMs is required');
  const within = t => Number.isFinite(t) && t <= horizonMs;
  const lanes = {
    world: worldEvents.filter(e => within(e.timeMs)).map(e => ({
      timeMs: e.timeMs, kind: e.type, ref: null,
    })),
    observed: incidences.filter(i => within(i.observedAtMs)).map(i => ({
      timeMs: i.observedAtMs, kind: 'sample.emitted', ref: i.incidenceId,
      transducerId: i.transducerId,
    })),
    delivered: incidences.filter(i => within(i.arrivedAtMs)).map(i => ({
      timeMs: i.arrivedAtMs, kind: 'incidence.delivered', ref: i.incidenceId,
      transducerId: i.transducerId,
    })),
    engine: trace.filter(e => e.type === 'engine.event' && within(e.timeMs)).map(e => ({
      timeMs: e.timeMs, kind: e.detail?.type ?? 'engine.event',
      ref: e.detail?.incidenceId ?? null, node: e.detail?.node ?? null,
    })),
  };
  return LANES.map(lane => ({ ...lane, items: lanes[lane.id] }));
}

// HH:MM:SS.mmm for inspection views that need millisecond resolution.
export function preciseClock(timeMs) {
  const ms = Math.floor(timeMs % 1000);
  const s = Math.floor(timeMs / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}.${String(ms).padStart(3, '0')}`;
}
