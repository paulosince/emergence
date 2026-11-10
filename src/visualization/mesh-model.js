// Read-only projection of an engine snapshot into a drawable mesh.
// It never invents nodes, relations or events: every element comes from the
// engine's own snapshot() or from engine events recorded in the run trace.
// No DOM. Shared by the page and by tests.
import { DEFAULTS as TEMPO_DEFAULTS } from '../../vendor/tempo/core/net.js';

export const LIFECYCLE = Object.freeze({
  WEAK: 'weak',                 // new or weak: cannot fire its target alone
  STRONG: 'strong',             // weight >= threshold: can fire its target alone
  CONSOLIDATED: 'consolidated', // strong and resistant to change
  PRUNING: 'pruning',           // close to the pruning threshold
});

// Same classification rules as the TEMPO page, with TEMPO's own parameters.
export function relationLifecycle(weight, params = TEMPO_DEFAULTS) {
  const { theta, wMax, consol } = params;
  if (weight < 0.12) return LIFECYCLE.PRUNING;
  if (consol && (1 - Math.min(weight, wMax) / wMax) ** 2 < 0.05) {
    return LIFECYCLE.CONSOLIDATED;
  }
  if (weight >= theta) return LIFECYCLE.STRONG;
  return LIFECYCLE.WEAK;
}

function relationKeys(relations) {
  const seen = new Map();
  return relations.map(r => {
    const pair = r.source + '>' + r.target;
    const n = seen.get(pair) ?? 0;
    seen.set(pair, n + 1);
    return pair + '#' + n;
  });
}

// `snapshot` is engine.snapshot(); `previous` is an earlier snapshot of the
// same run (or null). Returns kind 'empty' when the engine has no relational
// structure at all (e.g. the diagnostic engine): the caller must show a true
// empty state rather than drawing anything.
export function meshModel(snapshot, previous = null, params = TEMPO_DEFAULTS) {
  if (!snapshot || !Array.isArray(snapshot.relations) ||
      !Number.isInteger(snapshot.nodeCount) || snapshot.nodeCount < 1) {
    return {
      kind: 'empty', nodeCount: 0, constitutedUnits: 0,
      nodes: [], relations: [], removedCount: 0, newCount: 0,
    };
  }
  const keys = relationKeys(snapshot.relations);
  const before = previous && Array.isArray(previous.relations)
    ? new Set(relationKeys(previous.relations)) : null;
  const relations = snapshot.relations.map((r, k) => ({
    key: keys[k],
    source: r.source, target: r.target, weight: r.weight,
    delaySourceMs: r.delaySourceMs, delayTargetMs: r.delayTargetMs,
    traversalMs: r.traversalMs,
    lifecycle: relationLifecycle(r.weight, params),
    isNew: before ? !before.has(keys[k]) : false,
  }));
  const now = new Set(keys);
  const removedCount = before ? [...before].filter(k => !now.has(k)).length : 0;
  return {
    // The TEMPO control maps transducers onto PREDEFINED nodes. They are
    // never reported as constituted units.
    kind: 'fixed-nodes',
    nodeCount: snapshot.nodeCount,
    constitutedUnits: 0,
    nodes: Array.from({ length: snapshot.nodeCount }, (_, index) => ({
      index, predefined: true,
    })),
    relations,
    removedCount,
    newCount: relations.filter(r => r.isNew).length,
  };
}

// Firing events recorded by the engine, as {timeMs, node}.
export function firingsFromTrace(trace) {
  return trace
    .filter(e => e.type === 'engine.event' && e.detail?.type === 'node.fired' &&
      Number.isInteger(e.detail.node))
    .map(e => ({ timeMs: e.detail.timeMs ?? e.timeMs, node: e.detail.node }));
}

// Propagation in flight at `timeMs`: for each recorded firing of a source
// node, an incidence travels along each outgoing relation for exactly the
// relation's recorded traversal time. Nothing here alters the run.
export function propagationAt(firings, relations, timeMs) {
  const out = [];
  for (const f of firings) {
    if (f.timeMs > timeMs) continue;
    for (const r of relations) {
      if (r.source !== f.node) continue;
      const elapsed = timeMs - f.timeMs;
      if (elapsed < r.traversalMs) {
        out.push({ key: r.key, firedAtMs: f.timeMs, fraction: elapsed / r.traversalMs,
          arrivesAtMs: f.timeMs + r.traversalMs });
      }
    }
  }
  return out;
}

// Activity per node in the window (timeMs - windowMs, timeMs], normalised 0..1.
export function activityAt(firings, nodeCount, timeMs, windowMs) {
  const counts = new Array(nodeCount).fill(0);
  for (const f of firings) {
    if (f.timeMs <= timeMs && f.timeMs > timeMs - windowMs &&
        f.node >= 0 && f.node < nodeCount) counts[f.node]++;
  }
  const max = Math.max(1, ...counts);
  return counts.map(c => c / max);
}

// Was a firing forced by a delivered incidence on a mapped transducer?
// The engine does not record which internal link caused a non-forced firing,
// so that cause is reported as not recorded instead of guessed.
export function firingCause(firing, incidences, transducerNodes) {
  const forced = incidences.find(i => i.arrivedAtMs === firing.timeMs &&
    transducerNodes[i.transducerId] === firing.node);
  return forced
    ? { kind: 'forced', incidenceId: forced.incidenceId, transducerId: forced.transducerId }
    : { kind: 'internal-unrecorded' };
}
