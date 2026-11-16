// node toy-experiments/pre-v17-ramos/run.mjs > toy-experiments/pre-v17-ramos/resultados.json
// Executa as condições do pre-registro.md, nas regras A e B, sem ajuste de parâmetros.
import { Engine } from "./engine.mjs";

function rng(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
function gauss(r) { const u = 1 - r(), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

const periodic = (n, P) => Array.from({ length: n }, (_, i) => i * P);

// Uma Utrd, uma Upro com os ramos dados, uma Uint.
function oneChannel(rule, ramos, times) {
  const e = new Engine({ rule });
  e.utrd("t"); e.uint("j");
  e.upro({ id: "p", from: "t", to: "j", ramos: ramos.map(delay => ({ delay })) });
  for (const t of times) e.pulse("t", t);
  e.run();
  return e.fires().length;
}
function predictedC3(P) {
  for (let k = 1; k <= 19; k++) if (Math.abs(k * P - 5) <= 0.25 + 1e-9) return 20 - k;
  return 0;
}
const both = f => ({ A: f("A"), B: f("B") });
const out = {};

out.C1 = both(r => oneChannel(r, [2.0, 2.05, 2.1], periodic(20, 5)));
out.C2 = both(r => oneChannel(r, [2, 7], periodic(20, 5)));

out.C3 = [];
for (let i = 0; i <= 130; i++) {
  const P = +(1.5 + i * 0.05).toFixed(2);
  const r = both(rule => oneChannel(rule, [2, 7], periodic(20, P)));
  out.C3.push({ P, ...r, predictedB: predictedC3(P) });
}

out.C4a = both(r => oneChannel(r, [2, 7], [0]));

const randomTrain = r => { const t = [0]; while (t.length < 20) t.push(t.at(-1) + 1 - 4 * Math.log(1 - r())); return t; };
out.C4b = { seeds: 500, A: [], B: [] };
for (let s = 1; s <= 500; s++) for (const rule of ["A", "B"])
  out.C4b[rule].push(oneChannel(rule, [2, 7], randomTrain(rng(1000 + s))));

function twoChannels(rule, d1, d2) {
  const e = new Engine({ rule });
  e.utrd("t1"); e.utrd("t2"); e.uint("j");
  e.upro({ id: "p1", from: "t1", to: "j", ramos: [{ delay: d1 }] });
  e.upro({ id: "p2", from: "t2", to: "j", ramos: [{ delay: d2 }] });
  for (const t of periodic(20, 5)) { e.pulse("t1", t); e.pulse("t2", t); }
  e.run(); return e.fires().length;
}
out.C4c = { i: both(r => twoChannels(r, 2, 2)), ii: both(r => twoChannels(r, 2, 3)) };

out.C5 = [];
for (const sd of [0.05, 0.1, 0.2, 0.4]) {
  const row = { sd, A: [], B: [] };
  for (let s = 1; s <= 200; s++) {
    const r = rng(5000 + s), times = periodic(20, 5).map(t => t + sd * gauss(r));
    for (const rule of ["A", "B"]) row[rule].push(oneChannel(rule, [2, 7], times));
  }
  out.C5.push(row);
}

console.log(JSON.stringify(out));
