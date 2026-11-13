import { readFileSync } from 'node:fs';
import { Engine, W } from '../src/engine.js';
const cal = JSON.parse(readFileSync(new URL('../calibration.json', import.meta.url)));
const e = new Engine({ seq: 'S1', seed: 1, calibration: cal, condition: { log: 1 } });
const cnt = new Map();
const orig = e._fire.bind(e);
e._fire = (U,t,f)=>{ for (const s of U.state.values()) if (t-s.t<=W+1e-12) cnt.set(s.upro,(cnt.get(s.upro)||0)+1); return orig(U,t,f); };
e.schedule.duration = 0.62; e.run();
// for first 6 Uints: credit distribution per origin over candidate delays
for (const U of e.uints.slice(0,6)) {
  const byO = new Map();
  for (const u of U.upIn) { const k=u.origin.idx; if(!byO.has(k)) byO.set(k,[]); byO.get(k).push(cnt.get(u)||0); }
  const tr = e.log.trails[U.seq].intervals; const dt = tr[tr.length-1].dt*1e3;
  console.log(`U${U.seq} Δ=${dt.toFixed(3)}ms fires=${U.fires}`, [...byO.entries()].map(([k,a])=>`v${k}:[${a.join(' ')}]`).join('  '));
}
