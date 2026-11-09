// 3-D layout of the investigated domain for the laboratory view.
//
// Proximity is OPERATIONAL, computed only from what the run recorded:
//   (1) afferent provenance: which transduction channels actually drove each
//       node (forced firings by delivered incidences, plus one hop through
//       recorded incoming relations, weighted by recorded weight);
//   (2) co-activity: cosine similarity of the nodes' recorded firing counts
//       in common time bins.
// It is NOT semantic similarity assigned by an observer, and it does not
// claim that any node or cluster represents anything.
//
// Geometry: transduction channels are anchors on a ring at z = 0; each node
// sits at height z = level (1 for first-order nodes; higher levels for
// units whose afferents include other units, when an engine reports them).
// x,y blend classical multidimensional scaling of the operational distance
// with the mean position of the node's afferent channels, so nodes driven by
// the same channels and active together are drawn close, others apart.
// Deterministic: same inputs, same layout. No DOM.
import { firingCause } from './mesh-model.js';

const norm = v => { const s = Math.hypot(...v); return s > 0 ? v.map(x => x / s) : v.map(() => 0); };
const cosine = (a, b) => {
  const na = Math.hypot(...a), nb = Math.hypot(...b);
  if (!na || !nb) return 0;
  let d = 0; for (let k = 0; k < a.length; k++) d += a[k] * b[k];
  return d / (na * nb);
};

function sparseCosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (const v of a.values()) na += v * v;
  for (const v of b.values()) nb += v * v;
  if (!na || !nb) return 0;
  for (const [k, v] of a) dot += v * (b.get(k) ?? 0);
  return dot / Math.sqrt(na * nb);
}

// Top-k eigenvectors of a symmetric matrix by deterministic power iteration
// with deflation. Small n (tens to a few hundred nodes) is expected.
function topEigen(M, k, iterations = 300) {
  const n = M.length, vecs = [], vals = [];
  const A = M.map(r => r.slice());
  for (let e = 0; e < k; e++) {
    let v = Array.from({ length: n }, (_, i) => 1 + ((i * 7 + e * 3) % 11) / 10);
    let lambda = 0;
    for (let it = 0; it < iterations; it++) {
      const w = A.map(row => row.reduce((s, x, j) => s + x * v[j], 0));
      const len = Math.hypot(...w);
      if (!len) { v = v.map(() => 0); lambda = 0; break; }
      lambda = w.reduce((s, x, i) => s + x * v[i], 0) / (Math.hypot(...v) ** 2 || 1);
      v = w.map(x => x / len);
    }
    vecs.push(v); vals.push(lambda);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) A[i][j] -= lambda * v[i] * v[j];
  }
  return { vecs, vals };
}

function classicalMds(D, k = 2) {
  const n = D.length;
  if (n === 0) return [];
  if (n === 1) return [new Array(k).fill(0)];
  const D2 = D.map(r => r.map(x => x * x));
  const rowMean = D2.map(r => r.reduce((s, x) => s + x, 0) / n);
  const all = rowMean.reduce((s, x) => s + x, 0) / n;
  const B = D2.map((r, i) => r.map((x, j) => -0.5 * (x - rowMean[i] - rowMean[j] + all)));
  const { vecs, vals } = topEigen(B, k);
  return Array.from({ length: n }, (_, i) => vecs.map((_, d) =>
    vals[d] > 1e-12 ? vecs[d][i] * Math.sqrt(vals[d]) : 0));
}

/**
 * @param model          meshModel() output (kind 'fixed-nodes' or 'empty')
 * @param firings        [{timeMs,node}] recorded engine firings
 * @param incidences     delivered incidences
 * @param transducerNodes mapping channelId -> node index used by the engine
 * @param channels       ordered list of channel ids to place as anchors
 * @param timeMs         cursor: nothing after it is used
 */
export function domainLayout({ model, firings, incidences, transducerNodes = {},
  channels, timeMs, coactivityBinMs = 1000, alpha = 0.5, clusterThreshold = 0.35,
  geometry = 'stratified' }) {
  // geometry 'stratified': channels ring at z = 0, height = level, x,y pulled
  //   toward afferent channels (a DISPLAY CHOICE that imposes stratification).
  // geometry 'neutral': 3-D classical MDS of the operational distance only;
  //   no level axis, no channel pull. Use it when testing hypotheses about
  //   centrality or stratification, so the layout does not build them in.
  if (!['stratified', 'neutral'].includes(geometry)) throw new RangeError('Unknown geometry');
  const C = channels.length;
  const anchors = channels.map((channel, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / Math.max(1, C);
    return { channel, x: Math.cos(a), y: Math.sin(a), z: 0 };
  });
  if (!model || model.kind === 'empty' || model.nodeCount === 0) {
    return { anchors, nodes: [], clusters: [], distance: [], basis: 'empty' };
  }
  const n = model.nodeCount;
  const fired = firings.filter(f => f.timeMs <= timeMs && f.node >= 0 && f.node < n);
  const delivered = incidences.filter(i => i.arrivedAtMs <= timeMs);
  const chIndex = new Map(channels.map((c, i) => [c, i]));

  // (1) afferent provenance
  const direct = Array.from({ length: n }, () => new Array(C).fill(0));
  const fireCount = new Array(n).fill(0);
  for (const f of fired) {
    fireCount[f.node]++;
    const cause = firingCause(f, delivered, transducerNodes);
    if (cause.kind === 'forced' && chIndex.has(cause.transducerId)) {
      direct[f.node][chIndex.get(cause.transducerId)]++;
    }
  }
  const directN = direct.map(norm);
  const profile = directN.map(v => v.slice());
  for (const r of model.relations) {
    const w = Math.max(0, Math.min(1, r.weight / 1.2));
    for (let c = 0; c < C; c++) profile[r.target][c] += w * directN[r.source][c];
  }
  const profileN = profile.map(norm);

  // (2) co-activity
  const bins = Array.from({ length: n }, () => new Map());
  for (const f of fired) {
    const b = Math.floor(f.timeMs / coactivityBinMs);
    bins[f.node].set(b, (bins[f.node].get(b) ?? 0) + 1);
  }

  const distance = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => {
    if (i === j) return 0;
    const s = alpha * cosine(profileN[i], profileN[j]) + (1 - alpha) * sparseCosine(bins[i], bins[j]);
    return Math.max(0, 1 - s);
  }));

  // geometry
  const mds = classicalMds(distance, geometry === 'neutral' ? 3 : 2);
  const maxR = Math.max(1e-9, ...mds.map(v => Math.hypot(...v)));
  const nodes = Array.from({ length: n }, (_, i) => {
    let ax = 0, ay = 0, wsum = 0;
    profileN[i].forEach((w, c) => { ax += w * anchors[c].x; ay += w * anchors[c].y; wsum += w; });
    if (wsum > 0) { ax /= wsum; ay /= wsum; }
    const [mx, my, mz = 0] = mds[i].map(v => (0.8 * v) / maxR);
    const dominant = profileN[i].some(v => v > 0)
      ? channels[profileN[i].indexOf(Math.max(...profileN[i]))] : null;
    const level = model.nodes[i]?.level ?? 1;
    const neutral = geometry === 'neutral';
    return {
      index: i, level, fired: fireCount[i], profile: profileN[i], dominantChannel: dominant,
      x: neutral ? mx : (wsum > 0 ? 0.5 * mx + 0.5 * ax : 0.5 * mx),
      y: neutral ? my : (wsum > 0 ? 0.5 * my + 0.5 * ay : 0.5 * my),
      z: neutral ? 0.45 + mz : 0.9 * level, cluster: -1,
    };
  });

  // clusters: single linkage under the operational-distance threshold,
  // only among nodes with recorded activity.
  const parent = nodes.map((_, i) => i);
  const find = i => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (fireCount[i] && fireCount[j] && distance[i][j] < clusterThreshold) parent[find(i)] = find(j);
  }
  const groups = new Map();
  nodes.forEach((node, i) => {
    if (!fireCount[i]) return;
    const root = find(i);
    (groups.get(root) ?? groups.set(root, []).get(root)).push(i);
  });
  const clusters = [...groups.values()].sort((a, b) => a[0] - b[0]).map((members, id) => {
    members.forEach(m => { nodes[m].cluster = id; });
    const cx = members.reduce((s, m) => s + nodes[m].x, 0) / members.length;
    const cy = members.reduce((s, m) => s + nodes[m].y, 0) / members.length;
    const cz = members.reduce((s, m) => s + nodes[m].z, 0) / members.length;
    const radius = Math.max(0.12, ...members.map(m =>
      Math.hypot(nodes[m].x - cx, nodes[m].y - cy, nodes[m].z - cz) + 0.1));
    const votes = new Map();
    for (const m of members) if (nodes[m].dominantChannel)
      votes.set(nodes[m].dominantChannel, (votes.get(nodes[m].dominantChannel) ?? 0) + 1);
    const dominantChannel = [...votes.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0]?.[0] ?? null;
    return { id, members, centroid: { x: cx, y: cy, z: cz }, radius, dominantChannel };
  });
  return {
    anchors, nodes, clusters, distance,
    basis: 'afferent-provenance+co-activity', geometry, alpha, coactivityBinMs, clusterThreshold,
  };
}
