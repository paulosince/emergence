import { readFileSync } from 'node:fs';
import { Engine } from '../src/engine.js';
import { viaIndex } from '../src/utrd.js';
const cal = JSON.parse(readFileSync(new URL('../calibration.json', import.meta.url)));
// Só observação: sem Pcrt (clockPlan vazio desliga a constituição), registro de emissões ligado.
const e = new Engine({ seq: 'S1', seed: 1, calibration: cal, condition: { log: 2, clockPlan: { perBlock: [0,0,0], uproPerOrigin: 0 } } });
e.schedule.duration = 2.5; e.run();
const em = e.log.emissions;
function lived(vi, vj, t0, t1) { // intervalo da emissão de vj após a mais recente de vi
  const out=[]; let last=null;
  for (const [v,t] of em) { if (t<t0||t>t1) continue; if (v===vi) last=t; else if (v===vj && last!==null && t-last<=0.003) out.push((t-last)*1e3); }
  const s=out.slice(5,15); return s.length? (s.reduce((a,b)=>a+b,0)/s.length).toFixed(3)+' ms (n='+out.length+')' : 'nenhum';
}
const pairs = { 'Y: E 189 Hz → E 378 Hz': [viaIndex(0,1,0), viaIndex(0,4,0)], 'Y: E 378 Hz → E 600 Hz': [viaIndex(0,4,0), viaIndex(0,6,0)], 'Z: E 378 Hz → D 378 Hz': [viaIndex(0,4,0), viaIndex(1,4,0)] };
for (const [name,[a,b]] of Object.entries(pairs)) {
  const r = [0,1,2,3].map(k => lived(a,b,0.5+0.5*k+0.02,0.5+0.5*k+0.28));
  console.log(name, '| apresentações 1–4 de A:', r.join(' | '));
}
