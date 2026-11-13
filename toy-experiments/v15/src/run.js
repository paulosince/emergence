// Executa uma condição e grava um resumo JSON em results/raw/.
// Uso: node src/run.js <sequência> <semente> [condição-json] [rótulo]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { Engine } from './engine.js';

export function runOne(seq, seed, condition = {}, label = 'main') {
  const cal = JSON.parse(readFileSync(new URL('../calibration.json', import.meta.url)));
  const t0 = Date.now();
  const e = new Engine({ seq, seed, calibration: cal, condition }).run();
  const created = e.log.uints.filter(Boolean);
  const byBlock = {};
  for (const U of created) byBlock[U.block] = (byBlock[U.block] || 0) + 1;
  const lastT = created.length ? created[created.length - 1].t : null;
  return {
    label, seq, seed, condition, status: e.status, wallMs: Date.now() - t0,
    stats: e.stats, aliveUint: e.aliveUint, aliveUpro: e.aliveUpro, createdUint: created.length,
    createdUpro: e.createdUpro, createdPerBlock: byBlock, lastCreationT: lastT,
    firings: e.log.firings.length, structuralHash: e.structuralHash(),
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [seq = 'S1', seed = '1', cond = '{}', label = 'main'] = process.argv.slice(2);
  const r = runOne(seq, +seed, JSON.parse(cond), label);
  mkdirSync(new URL('../results/raw/', import.meta.url), { recursive: true });
  writeFileSync(new URL(`../results/raw/${label}-${seq}-s${seed}.json`, import.meta.url), JSON.stringify(r, null, 2));
  console.log(JSON.stringify({ label: r.label, seq, seed, status: r.status, createdUint: r.createdUint, lastCreationT: r.lastCreationT, wallMs: r.wallMs }));
}
