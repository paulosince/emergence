// P2-P5, persistence (item 4) and the latency-function ablation.
// Usage: node experiments/predictions.js [nSeeds=10]
// Writes results/predictions.json and prints a summary.

import { writeFileSync, mkdirSync } from 'node:fs';
import {
  occurrencesToConstitution, persistence, reverseTest, conjDetector, testPair, trainOccurrence, median,
} from '../core/protocols.js';
import { Net } from '../core/net.js';
import { makeRng } from '../core/rng.js';

const nSeeds = Number(process.argv[2] ?? 10);
const seeds = [...Array(nSeeds).keys()];
const R = { nSeeds, P2: {}, P3: {}, P3strict: {}, ablation: {} };

// P2: occurrences to constitution vs adaptation rate (shift, K = 4)
for (const eta of [0.4, 0.2, 0.1, 0.05, 0.025])
  R.P2[eta] = seeds.map((s) => occurrencesToConstitution('shift', 4, eta, s).occ);

// P3: shift vs select across K (lenient: first correct response at any point)
for (const mode of ['shift', 'select'])
  for (const K of [1, 2, 4, 8, 16, 32])
    R.P3[`${mode}_K${K}`] = seeds.map((s) => occurrencesToConstitution(mode, K, 0.2, s).occ);

// Item 4: persistence after 120 s of background, with and without consolidation
R.persistence = seeds.map((s) => {
  const { occ, net } = occurrencesToConstitution('shift', 4, 0.2, s);
  return occ ? persistence(net) : null;
});
R.persistenceNoConsol = seeds.map((s) => {
  const { occ, net } = occurrencesToConstitution('shift', 4, 0.2, s, { consol: false });
  return occ ? persistence(net) : null;
});

// P5: reverse-order training
R.P5 = seeds.map((s) => reverseTest('shift', 4, 0.2, s));

// P4: integration window vs interval (Delta = 10 ms)
R.P4 = Object.fromEntries([2, 5, 10, 20, 30, 50].map((tw) => [tw, conjDetector(tw)]));

// Precision after 150 occurrences (strict item 3) and the ablation without latency function
for (const mode of ['fixed', 'select', 'shift'])
  for (const K of [1, 4, 16, 32]) {
    let len = 0, str = 0;
    for (const s of seeds) {
      const net = new Net(12, K, mode, 0.2, makeRng(s));
      for (let o = 0; o < 150; o++) trainOccurrence(net, [[0, 1, 40]], o * 1000);
      const r = testPair(net, 0, 1, 40);
      len += r.lenient; str += r.strict;
    }
    R.ablation[`${mode}_K${K}`] = { lenient: len, strict: str };
  }

mkdirSync(new URL('../results/', import.meta.url), { recursive: true });
writeFileSync(new URL('../results/predictions.json', import.meta.url), JSON.stringify(R, null, 1));

const pct = (arr) => `${arr.filter(Boolean).length}/${arr.length}`;
console.log('P2 medians (eta: occurrences):', Object.entries(R.P2).map(([k, v]) => `${k}:${median(v)}`).join('  '));
console.log('P3 medians:', Object.entries(R.P3).map(([k, v]) => `${k}:${median(v)}`).join('  '));
console.log('Persistence with consolidation:', pct(R.persistence), ' without:', pct(R.persistenceNoConsol));
console.log('P5 forward formed:', pct(R.P5.map((r) => r.forward)), ' reverse formed:', pct(R.P5.map((r) => r.reverse)));
console.log('P4 (tw: forward/reverse):', Object.entries(R.P4).map(([k, v]) => `${k}:${+v.forward}/${+v.reverse}`).join('  '));
console.log('Strict precision after 150 occ:', Object.entries(R.ablation).map(([k, v]) => `${k}:${v.strict}/${nSeeds}(len ${v.lenient})`).join('  '));
