// Topological measures with nulls for the domain-organization hypothesis
// (H-ORG, research-design section 5; roadmap P0.5). Researcher-side only.
// Graph input: { n, edges: [{source, target, weight}] } (directed, weighted).
// Undirected measures use the symmetrized graph (max of the two weights).
import { makeRng } from '../../../vendor/tempo/core/rng.js';

export function undirected({ n, edges }) {
  const w = new Map();
  for (const e of edges) {
    if (e.source === e.target) continue;
    const a = Math.min(e.source, e.target), b = Math.max(e.source, e.target), k = a * n + b;
    w.set(k, Math.max(w.get(k) ?? 0, e.weight ?? 1));
  }
  const adj = Array.from({ length: n }, () => new Map());
  for (const [k, x] of w) { const a = Math.floor(k / n), b = k % n; adj[a].set(b, x); adj[b].set(a, x); }
  return adj;
}

export const degree = adj => adj.map(m => m.size);
export const strength = adj => adj.map(m => [...m.values()].reduce((s, x) => s + x, 0));

// k-core number of each node (Batagelj–Zaversnik).
export function coreNumber(adj) {
  const n = adj.length, deg = degree(adj), core = new Array(n).fill(0), removed = new Array(n).fill(false);
  for (let left = n, k = 0; left > 0;) {
    let progress = true;
    while (progress) {
      progress = false;
      for (let v = 0; v < n; v++) if (!removed[v] && deg[v] <= k) {
        removed[v] = true; core[v] = k; left--; progress = true;
        for (const u of adj[v].keys()) if (!removed[u]) deg[u]--;
      }
    }
    k++;
  }
  return core;
}

// Betweenness (Brandes) on unweighted hops of the undirected graph, normalized
// to [0,1] by (n-1)(n-2)/2.
export function betweenness(adj) {
  const n = adj.length, cb = new Array(n).fill(0);
  for (let s = 0; s < n; s++) {
    const stack = [], pred = Array.from({ length: n }, () => []), sigma = new Array(n).fill(0), dist = new Array(n).fill(-1);
    sigma[s] = 1; dist[s] = 0; const q = [s];
    while (q.length) { const v = q.shift(); stack.push(v);
      for (const w of adj[v].keys()) {
        if (dist[w] < 0) { dist[w] = dist[v] + 1; q.push(w); }
        if (dist[w] === dist[v] + 1) { sigma[w] += sigma[v]; pred[w].push(v); }
      } }
    const delta = new Array(n).fill(0);
    while (stack.length) { const w = stack.pop();
      for (const v of pred[w]) delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
      if (w !== s) cb[w] += delta[w]; }
  }
  const norm = n > 2 ? ((n - 1) * (n - 2)) : 1; // undirected: each pair counted twice
  return cb.map(x => x / norm);
}

// Deterministic label propagation (weighted), seeded visiting order.
export function communities(adj, { seed = 0, maxIter = 100 } = {}) {
  const n = adj.length, label = Array.from({ length: n }, (_, i) => i), rng = makeRng(seed);
  for (let it = 0; it < maxIter; it++) {
    const order = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(rng.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    let changed = false;
    for (const v of order) {
      if (!adj[v].size) continue;
      const score = new Map();
      for (const [u, w] of adj[v]) score.set(label[u], (score.get(label[u]) ?? 0) + w);
      const best = [...score.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0];
      if (best !== label[v]) { label[v] = best; changed = true; }
    }
    if (!changed) break;
  }
  const ids = [...new Set(label)].sort((a, b) => a - b), map = new Map(ids.map((x, k) => [x, k]));
  return label.map(x => map.get(x));
}

// Guimerà–Amaral participation coefficient and within-module degree z-score.
export function participation(adj, module) {
  const s = strength(adj), P = [], z = [];
  const mods = [...new Set(module)];
  for (let v = 0; v < adj.length; v++) {
    const per = new Map(); for (const [u, w] of adj[v]) per.set(module[u], (per.get(module[u]) ?? 0) + w);
    P.push(s[v] ? 1 - [...per.values()].reduce((acc, x) => acc + (x / s[v]) ** 2, 0) : 0);
  }
  const within = adj.map((m, v) => [...m].filter(([u]) => module[u] === module[v]).reduce((acc, [, w]) => acc + w, 0));
  for (const m of mods) {
    const members = within.map((x, v) => [x, v]).filter(([, v]) => module[v] === m);
    const mean = members.reduce((acc, [x]) => acc + x, 0) / members.length;
    const sd = Math.sqrt(members.reduce((acc, [x]) => acc + (x - mean) ** 2, 0) / members.length);
    for (const [x, v] of members) z[v] = sd ? (x - mean) / sd : 0;
  }
  return { participation: P, withinModuleZ: z };
}

// Degree-preserving rewiring (double-edge swaps) of the undirected graph.
export function rewire(adj, { swaps = null, seed = 0 } = {}) {
  const edges = []; adj.forEach((m, a) => { for (const b of m.keys()) if (a < b) edges.push([a, b]); });
  const n = adj.length, has = new Set(edges.map(([a, b]) => a * n + b)), rng = makeRng(seed);
  const key = (a, b) => Math.min(a, b) * n + Math.max(a, b);
  const total = swaps ?? edges.length * 10;
  for (let k = 0; k < total && edges.length > 1; k++) {
    const i = Math.floor(rng.random() * edges.length), j = Math.floor(rng.random() * edges.length);
    if (i === j) continue;
    const [a, b] = edges[i], [c, d] = edges[j];
    if (new Set([a, b, c, d]).size < 4 || has.has(key(a, d)) || has.has(key(c, b))) continue;
    has.delete(key(a, b)); has.delete(key(c, d)); has.add(key(a, d)); has.add(key(c, b));
    edges[i] = [a, d]; edges[j] = [c, b];
  }
  const out = Array.from({ length: n }, () => new Map());
  for (const [a, b] of edges) { out[a].set(b, 1); out[b].set(a, 1); }
  return out;
}

// Rich-club coefficient phi(k) and normalized rho(k) = phi / mean phi_null
// over degree-preserving rewired nulls (Colizza et al. 2006).
export function richClub(adj, { nulls = 50, seed = 0 } = {}) {
  const phi = A => {
    const deg = degree(A), maxK = Math.max(0, ...deg), out = [];
    for (let k = 0; k < maxK; k++) {
      const club = deg.map((d, i) => [d, i]).filter(([d]) => d > k).map(([, i]) => i);
      const N = club.length; if (N < 2) { out.push(null); continue; }
      const inClub = new Set(club); let E = 0;
      for (const v of club) for (const u of A[v].keys()) if (inClub.has(u) && u > v) E++;
      out.push((2 * E) / (N * (N - 1)));
    }
    return out;
  };
  const observed = phi(adj), sums = observed.map(() => 0), counts = observed.map(() => 0);
  for (let s = 0; s < nulls; s++) phi(rewire(adj, { seed: seed + s + 1 })).forEach((x, k) => {
    if (x !== null && k < sums.length) { sums[k] += x; counts[k]++; } });
  return observed.map((p, k) => ({ k, phi: p, phiNull: counts[k] ? sums[k] / counts[k] : null,
    rho: p !== null && counts[k] && sums[k] ? p / (sums[k] / counts[k]) : null }));
}

// Per-node summary of every measure, for reports and the H-ORG analyses.
export function domainTopology(graph, { seed = 0 } = {}) {
  const adj = undirected(graph), module = communities(adj, { seed });
  const { participation: P, withinModuleZ: Z } = participation(adj, module);
  const deg = degree(adj), str = strength(adj), core = coreNumber(adj), btw = betweenness(adj);
  return { nodes: deg.map((d, i) => ({ node: i, degree: d, strength: str[i], core: core[i],
    betweenness: btw[i], module: module[i], participation: P[i], withinModuleZ: Z[i] })),
    modules: new Set(module).size };
}
