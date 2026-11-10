// P0.4 demonstration: apply the evaluation bench to the TEMPO fixed-node
// control in (a) the room (relations vs surrogate nulls) and (b) the episodic
// drop world (D3: does relation latency covary with the referent?).
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { createRoomScenario } from '../src/room/room-scenario.js';
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { ExecutionController } from '../src/runtime/execution-controller.js';
import { TempoFixedNodesControl } from '../src/engines/tempo-fixed-nodes-control.js';
import { replayIncidences } from '../src/research/bench/replay.js';
import { circularShift, intervalShuffle } from '../src/research/bench/surrogates.js';
import { compareToNull, permutationTest } from '../src/research/bench/stats.js';

const MAP = { r0: 0, r1: 1, r2: 2, r3: 3, r4: 4, r5: 5 };
const tempoRoom = () => new TempoFixedNodesControl({ nodeCount: 6, transducerNodes: MAP, seed: 42 });
const real = runExperiment({ ...createRoomScenario({}), engine: tempoRoom() });
const H = real.manifest.endTimeMs;
const observed = real.finalSnapshot.relations.length;
const nullCS = [], nullIS = [];
for (let s = 0; s < 30; s++) {
  nullCS.push(replayIncidences(tempoRoom(), circularShift(real.incidences, { horizonMs: H, seed: s }).incidences, { endTimeMs: H }).finalSnapshot.relations.length);
  nullIS.push(replayIncidences(tempoRoom(), intervalShuffle(real.incidences, { seed: s }).incidences, { endTimeMs: H }).finalSnapshot.relations.length);
}
console.log('(a) SALA — relações do controle TEMPO: observado', observed);
console.log('    nulo deslocamento circular', JSON.stringify(compareToNull(observed, nullCS)));
console.log('    nulo embaralhamento de intervalos', JSON.stringify(compareToNull(observed, nullIS)));

const fast = { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } };
for (const seed of [1, 2, 3, 4]) {
  const { world, ...cfg } = createEpisodicDropScenario({ episodes: 40, scheduleSeed: seed, sensorOverrides: fast });
  const c = new ExecutionController({ ...cfg, engine: new TempoFixedNodesControl({ nodeCount: 3, transducerNodes: { s0: 0, s1: 1, s2: 2 }, seed }) }).start();
  const E = world.describe().episodeMs, lived = [], lat = [];
  let seen = 0;
  for (const e of world.describe().episodes) {
    c.advanceTo(Math.min(c.endTimeMs, (e.index + 1) * E - 1));
    const inc = c.observe(seen).incidences; seen += inc.length;
    const top = inc.find(x => x.transducerId === 's0' && x.measurement === 0);
    const low = inc.find(x => x.transducerId === 's1' && x.measurement === 0);
    const r = c.engineSnapshot().relations.filter(x => x.source === 0 && x.target === 1).sort((a, b) => b.weight - a.weight)[0];
    if (top && low && r) { lived.push(low.arrivedAtMs - top.arrivedAtMs); lat.push(r.traversalMs); }
    if (c.state !== 'running') break;
  }
  const t = permutationTest(lived, lat, { seed, permutations: 2000 });
  console.log('(b) QUEDAS semente', seed, '— D3 (latência da relação × intervalo vivido): Spearman', t.observed.toFixed(3), 'p', t.p.toFixed(4), 'n', lived.length);
}
