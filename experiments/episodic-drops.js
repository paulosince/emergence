// P0.2 — Episodic drop world: transduction check and a first look at the
// TEMPO fixed-node control (preview of P0.4 / criterion D3).
// Usage: node experiments/episodic-drops.js [--json] [--episodes=N] [--seed=S]
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { ExecutionController } from '../src/runtime/execution-controller.js';
import { TempoFixedNodesControl } from '../src/engines/tempo-fixed-nodes-control.js';

const arg = (k, d) => Number(process.argv.find(a => a.startsWith('--' + k + '='))?.split('=')[1] ?? d);
const EP = arg('episodes', 40), SEED = arg('seed', 1);
const fast = { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } };
const s = createEpisodicDropScenario({ episodes: EP, scheduleSeed: SEED, sensorOverrides: fast });
const { world, ...cfg } = s;
const MAP = { s0: 0, s1: 1, s2: 2 };
const c = new ExecutionController({ ...cfg,
  engine: new TempoFixedNodesControl({ nodeCount: 3, transducerNodes: MAP, seed: SEED }) }).start();
const eps = world.describe().episodes, E = world.describe().episodeMs;
const rows = [];
let seen = 0;
for (const e of eps) {
  c.advanceTo(Math.min(c.endTimeMs, (e.index + 1) * E - 1));
  const view = c.observe(seen); seen += view.incidences.length;
  const inc = view.incidences;
  const top = inc.find(x => x.transducerId === 's0' && x.measurement === 0);
  const low = inc.find(x => x.transducerId === 's1' && x.measurement === 0);
  const imp = inc.find(x => x.transducerId === 's2' && x.measurement > 0);
  const snap = c.engineSnapshot();
  const rel = (a, b) => snap.relations.filter(r => r.source === a && r.target === b)
    .sort((x, y) => y.weight - x.weight)[0] ?? null;
  const r01 = rel(0, 1), r12 = rel(1, 2);
  rows.push({ episode: e.index, heightM: e.heightM,
    livedTopToLowMs: top && low ? low.arrivedAtMs - top.arrivedAtMs : null,
    livedLowToImpactMs: low && imp ? imp.arrivedAtMs - low.arrivedAtMs : null,
    relS0S1Ms: r01 ? r01.traversalMs : null, relS1S2Ms: r12 ? r12.traversalMs : null,
    relations: snap.relations.length });
  if (c.state !== 'running') break;
}
const rank = a => { const o = a.map((v, i) => [v, i]).sort((x, y) => x[0] - y[0]); const r = []; o.forEach(([, i], k) => r[i] = k); return r; };
const spearman = (a, b) => { const ra = rank(a), rb = rank(b), n = a.length, m = (n - 1) / 2;
  let num = 0, da = 0, db = 0; for (let i = 0; i < n; i++) { num += (ra[i] - m) * (rb[i] - m); da += (ra[i] - m) ** 2; db += (rb[i] - m) ** 2; }
  return num / Math.sqrt(da * db); };
const ok = rows.filter(r => r.livedTopToLowMs !== null && r.relS0S1Ms !== null);
const summary = {
  episodes: rows.length,
  spearmanHeightVsLivedInterval: spearman(ok.map(r => r.heightM), ok.map(r => r.livedTopToLowMs)),
  spearmanLivedVsRelationLatency: spearman(ok.map(r => r.livedTopToLowMs), ok.map(r => r.relS0S1Ms)),
  // Relation latency compared with the CURRENT episode vs the PREVIOUS one:
  spearmanPrevLivedVsRelationLatency: ok.length > 2 ? spearman(ok.slice(0, -1).map(r => r.livedTopToLowMs), ok.slice(1).map(r => r.relS0S1Ms)) : null,
};
if (process.argv.includes('--json')) console.log(JSON.stringify({ summary, rows }, null, 2));
else {
  console.log('episode  height(m)  lived s0->s1(ms)  TEMPO s0->s1 latency(ms)  relations');
  for (const r of rows) console.log(String(r.episode).padStart(7), r.heightM.toFixed(3).padStart(10),
    String(r.livedTopToLowMs).padStart(16), (r.relS0S1Ms === null ? '—' : r.relS0S1Ms.toFixed(2)).padStart(25), String(r.relations).padStart(10));
  console.log(summary);
}
