// P0.1 — Latency control for the TEMPO fixed-node control on the room.
// Question (research-design N5): do the relations formed in the room reflect
// the world, or the transducers' own fixed latencies?
// Predictions of the INSTRUMENT-ARTIFACT hypothesis:
//   (a) equal latencies -> relations vanish or change radically;
//   (b) permuted latencies -> relation directions follow the new latency order;
//   (c) fixed latencies, different worlds (dates, weather, obstacle) ->
//       relation pattern invariant.
// Predictions of the WORLD-STRUCTURE hypothesis: the opposite in (a)-(c).
// Usage: node experiments/latency-control.js [--json]
import { createRoomScenario } from '../src/room/room-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { TempoFixedNodesControl } from '../src/engines/tempo-fixed-nodes-control.js';

const IDS = ['r0', 'r1', 'r2', 'r3', 'r4', 'r5'];
const MAP = Object.fromEntries(IDS.map((id, i) => [id, i]));
const BASE = { r0: 200, r1: 300, r2: 200, r3: 400, r4: 400, r5: 100 };

function run({ latencies, date = '2026-06-21', weather = 'clear', obstacle = true, seed = 42 }) {
  const sensorOverrides = Object.fromEntries(IDS.map(id => [id, { latencyMs: latencies[id] }]));
  const scene = createRoomScenario({
    weatherPreset: weather, worldOptions: { date, opaqueObjectEnabled: obstacle },
    sensorOverrides, seed,
  });
  const r = runExperiment({ ...scene,
    engine: new TempoFixedNodesControl({ nodeCount: 6, transducerNodes: MAP, seed }) });
  const rel = r.finalSnapshot.relations.map(x => IDS[x.source] + '>' + IDS[x.target]).sort();
  return { delivered: r.summary.deliveredCount, relations: rel };
}
// Fraction of relations whose direction goes from the faster channel (lower
// latency) to the slower one: the artifact hypothesis predicts ~1.
function followsLatency(relations, lat) {
  const directed = relations.map(k => k.split('>')).filter(([a, b]) => lat[a] !== lat[b]);
  if (!directed.length) return null;
  return directed.filter(([a, b]) => lat[a] < lat[b]).length / directed.length;
}
function rotations(k) {
  const vals = IDS.map(id => BASE[id]);
  return Object.fromEntries(IDS.map((id, i) => [id, vals[(i + k) % vals.length]]));
}
const jaccard = (a, b) => {
  const A = new Set(a), B = new Set(b), u = new Set([...a, ...b]);
  return u.size ? [...A].filter(x => B.has(x)).length / u.size : 1;
};

const out = { base: null, equal: [], permuted: [], worlds: [] };
const base = run({ latencies: BASE });
out.base = { ...base, followsLatency: followsLatency(base.relations, BASE) };
for (const L of [100, 250, 400]) {
  const lat = Object.fromEntries(IDS.map(id => [id, L]));
  out.equal.push({ latencyMs: L, ...run({ latencies: lat }) });
}
for (let k = 1; k < 6; k++) {
  const lat = rotations(k);
  const r = run({ latencies: lat });
  out.permuted.push({ latencies: lat, ...r, followsLatency: followsLatency(r.relations, lat),
    overlapWithBase: jaccard(r.relations, base.relations) });
}
for (const date of ['2026-06-21', '2026-09-22', '2026-12-21'])
  for (const weather of ['clear', 'overcast'])
    for (const obstacle of [true, false]) {
      const r = run({ latencies: BASE, date, weather, obstacle });
      out.worlds.push({ date, weather, obstacle, ...r,
        followsLatency: followsLatency(r.relations, BASE),
        overlapWithBase: jaccard(r.relations, base.relations) });
    }

if (process.argv.includes('--json')) { console.log(JSON.stringify(out, null, 2)); }
else {
  const f = x => x === null ? 'n/a' : x.toFixed(2);
  console.log('BASE latencies', JSON.stringify(BASE));
  console.log(' relations', out.base.relations.length, out.base.relations.join(' '), '| follows latency', f(out.base.followsLatency));
  console.log('EQUAL latencies');
  for (const e of out.equal) console.log(' ', e.latencyMs, 'ms -> relations', e.relations.length, e.relations.join(' '));
  console.log('PERMUTED latencies (rotations)');
  for (const p of out.permuted) console.log(' ', JSON.stringify(p.latencies), '-> relations', p.relations.length,
    '| follows latency', f(p.followsLatency), '| overlap with base', f(p.overlapWithBase));
  console.log('WORLDS with base latencies');
  for (const w of out.worlds) console.log(' ', w.date, w.weather.padEnd(8), 'obstacle', String(w.obstacle).padEnd(5),
    '-> relations', w.relations.length, '| follows latency', f(w.followsLatency), '| overlap with base', f(w.overlapWithBase));
}
