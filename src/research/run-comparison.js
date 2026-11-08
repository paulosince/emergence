// Comparison of completed runs for the Analyse view. Pure functions over
// recorded results and manifests; nothing here executes an engine.
import { toCsv } from './csv.js';

const canonical = value => {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') {
    return '{' + Object.keys(value).sort()
      .map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
  }
  return JSON.stringify(value);
};

// SHA-256 of the canonical manifest: detects accidental change of the run
// definition. It is NOT a signature and does not authenticate authorship.
export async function manifestDigest(manifest) {
  if (!globalThis.crypto?.subtle) throw new Error('SHA-256 unavailable');
  const bytes = new TextEncoder().encode(canonical(manifest));
  const raw = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(raw)].map(b => b.toString(16).padStart(2, '0')).join('');
}

export function flatten(value, prefix = '', out = {}) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const k of Object.keys(value).sort()) flatten(value[k], prefix ? prefix + '.' + k : k, out);
  } else out[prefix] = canonical(value);
  return out;
}

export const METRIC_COLUMNS = Object.freeze([
  'run', 'engine', 'modalities', 'weather', 'date', 'obstacle', 'seed',
  'horizonMs', 'samples', 'suppressed', 'delivered', 'engineEvents',
  'predefinedNodes', 'constitutedUnits', 'relations', 'manifestSha256',
]);

// `run`: { id, result, manifestSha256 } where result is the controller result.
export function metricsRow(run) {
  const m = run.result.manifest, s = run.result.summary, snap = run.result.finalSnapshot ?? {};
  const env = m.environment ?? {};
  return {
    run: run.id,
    engine: m.engine?.id ?? 'unspecified',
    modalities: m.transducers.map(t => t.id).join(' ') || '(nenhuma)',
    weather: env.world?.weather?.id ?? '',
    date: env.world?.date ?? '',
    obstacle: env.world?.opaqueObjectEnabled ?? '',
    seed: m.seed,
    horizonMs: m.endTimeMs,
    samples: s.sampleCount,
    suppressed: s.suppressedCount,
    delivered: s.deliveredCount,
    engineEvents: s.engineEventCount,
    predefinedNodes: Array.isArray(snap.relations) ? snap.nodeCount : 0,
    constitutedUnits: 0,
    relations: Array.isArray(snap.relations) ? snap.relations.length : 0,
    manifestSha256: run.manifestSha256 ?? '',
  };
}

export function metricsCsv(runs) {
  return toCsv(runs.map(metricsRow), [...METRIC_COLUMNS]);
}

// Manifest differences, isolated-change detection (ablation-style
// comparison), summary deltas and the first diverging delivered incidence.
export function compareRuns(a, b) {
  const fa = flatten(a.result.manifest), fb = flatten(b.result.manifest);
  const paths = [...new Set([...Object.keys(fa), ...Object.keys(fb)])].sort();
  const manifestDifferences = paths
    .filter(p => fa[p] !== fb[p])
    .map(p => ({ path: p, a: fa[p] ?? '(ausente)', b: fb[p] ?? '(ausente)' }));
  const ia = a.result.incidences, ib = b.result.incidences;
  let firstIncidenceDivergence = null;
  for (let k = 0; k < Math.max(ia.length, ib.length); k++) {
    if (canonical(ia[k] ?? null) !== canonical(ib[k] ?? null)) {
      firstIncidenceDivergence = { index: k, a: ia[k] ?? null, b: ib[k] ?? null };
      break;
    }
  }
  const ra = metricsRow(a), rb = metricsRow(b);
  const summaryDelta = {};
  for (const k of ['samples', 'suppressed', 'delivered', 'engineEvents', 'relations']) {
    summaryDelta[k] = rb[k] - ra[k];
  }
  return {
    identicalManifest: manifestDifferences.length === 0,
    identicalHistory: firstIncidenceDivergence === null &&
      canonical(a.result.trace) === canonical(b.result.trace),
    // Exactly one manifest entry differs: an isolated, ablation-like change.
    isolatedChange: manifestDifferences.length === 1 ? manifestDifferences[0].path : null,
    manifestDifferences,
    summaryDelta,
    firstIncidenceDivergence,
  };
}
