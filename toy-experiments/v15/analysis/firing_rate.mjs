import { readFileSync } from 'node:fs';
import { Engine } from '../src/engine.js';
const cal = JSON.parse(readFileSync(new URL('../calibration.json', import.meta.url)));
const e = new Engine({ seq: 'S1', seed: 1, calibration: cal, condition: { log: 1 } });
e.schedule.duration = 0.60; e.run();
// taxa de disparo das Uint criadas antes de 0,52 s, entre 0,55 e 0,60 s
const early = new Set(e.log.uints.filter(u=>u.t<0.52).map(u=>u.seq));
let n=0; for (const [s,t] of e.log.firings) if (early.has(s) && t>=0.55 && t<0.60) n++;
console.log('Uint criadas antes de 0,52 s:', early.size, 'disparos/s por Uint entre 0,55 e 0,60 s:', (n/early.size/0.05).toFixed(0));
console.log('pares avaliados', e.stats.pairs, 'acomodados', e.stats.accommodated, (100*e.stats.accommodated/e.stats.pairs).toFixed(1)+'%');
