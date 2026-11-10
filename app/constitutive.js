// Constitutive engine lab page: editable parameters, run in the browser,
// units at the engine's real 3D coordinates, novelty-modulator illustration.
import * as P1 from '../src/engines/constitutive/parameters.js';
import * as P2 from '../src/engines/constitutive/parameters-v2.js';
import { ConstitutiveEngine } from '../src/engines/constitutive/engine.js';
import { ConstitutiveEngineV2 } from '../src/engines/constitutive/engine-v2.js';
import { createEpisodicDropScenario } from '../src/sensory/episodic-drop-scenario.js';
import { createTabletopScenario } from '../src/sensory/tabletop-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { replayIncidences } from '../src/research/bench/replay.js';
import { OracleIntervalControl } from '../src/engines/oracle-interval-control.js';
import { makeRng } from '../vendor/tempo/core/rng.js';

const $ = id => document.getElementById(id);
const values = {};
// version 2 is the current engine (docs/engine-v2-design-proposal.md); version 1 kept for the record of round 1
let V = 2, PARAMETERS = P2.PARAMETERS, DEFAULTS = P2.DEFAULTS, checkOverrides = P2.checkOverrides;
$('engine').onchange = () => {
  V = Number($('engine').value); const M = V === 2 ? P2 : P1;
  PARAMETERS = M.PARAMETERS; DEFAULTS = M.DEFAULTS; checkOverrides = M.checkOverrides;
  for (const k of Object.keys(values)) delete values[k]; run = null; renderParams(); updateMode(); draw();
};
function renderParams() {
  const box = $('params'); box.innerHTML = '';
  for (const p of PARAMETERS) {
    const row = document.createElement('div'); row.className = 'param';
    const v = values[p.name] ?? p.value, txt = typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v);
    row.innerHTML = `<label>${p.name} <span class="tag">${p.status}</span><small>${p.unit ? p.unit + ' · ' : ''}${p.source}</small></label><input value='${txt.replace(/'/g, '&#39;')}'/>`;
    const input = row.querySelector('input');
    input.addEventListener('change', () => {
      try { values[p.name] = JSON.parse(input.value); } catch { values[p.name] = input.value; }
      if (JSON.stringify(values[p.name]) === JSON.stringify(p.value)) delete values[p.name];
      updateMode();
    });
    if (p.name in values) row.classList.add('changed');
    box.appendChild(row);
  }
}
function updateMode() {
  const c = checkOverrides(values), m = $('mode');
  m.className = c.exploratory ? 'exploratory' : 'prereg';
  m.textContent = c.exploratory ? 'EXPLORATÓRIO: ' + c.changed.join(', ') : (c.changed.length ? 'Pré-registro (série de escala)' : 'Parâmetros do pré-registro');
  for (const [i, p] of PARAMETERS.entries()) $('params').children[i]?.classList.toggle('changed', p.name in values);
}
$('reset').onclick = () => { for (const k of Object.keys(values)) delete values[k]; renderParams(); updateMode(); };

let run = null;
$('run').onclick = () => {
  $('run').disabled = true; $('run').textContent = 'Executando…';
  setTimeout(() => {
    try {
      const world = $('world').value, seconds = Number($('seconds').value), seed = Number($('seed').value), n = Math.ceil(seconds / 3);
      const FAST = { s0: { periodMs: 1 }, s1: { periodMs: 1 }, s2: { periodMs: 1 } };
      const mk = { quedas: () => createEpisodicDropScenario({ episodes: n, scheduleSeed: seed, sensorOverrides: FAST, maxEvents: 1e7 }),
        'quedas-fixa': () => createEpisodicDropScenario({ heightsM: new Array(n).fill(1.4), sensorOverrides: FAST, maxEvents: 1e7 }),
        'quedas-ciclo': () => createEpisodicDropScenario({ heightsM: Array.from({ length: n }, (_, k) => [1.0, 1.5, 2.0][k % 3]), sensorOverrides: FAST, maxEvents: 1e7 }),
        mesa: () => createTabletopScenario({ horizonMs: seconds * 1000, protocol: 'free', launchSeed: seed }) }[world];
      const { world: w, ...cfg } = mk();
      const rec = runExperiment({ ...cfg, engine: new OracleIntervalControl() });
      const engine = V === 2 ? new ConstitutiveEngineV2({ seed, ...values }) : new ConstitutiveEngine({ seed, ...values });
      const r = replayIncidences(engine, rec.incidences, { endTimeMs: cfg.endTimeMs });
      const snap = r.finalSnapshot, ev = r.events.map(e => ({ t: e.timeMs, ...e.detail })).sort((a, b) => a.t - b.t);
      run = { ev, end: cfg.endTimeMs, side: snap.substrateSideUm, src: snap.sourcePositions, params: { ...DEFAULTS, ...values }, snap, v: V, exploratory: checkOverrides(values).exploratory };
      $('time').value = 1000; draw();
    } catch (e) { alert('Erro: ' + e.message); }
    $('run').disabled = false; $('run').textContent = 'Executar';
  }, 30);
};

// --- 3D view ---------------------------------------------------------------
const cv = $('view'), ctx = cv.getContext('2d');
let yaw = 0.7, pitch = 0.4, zoom = 1, drag = null;
cv.addEventListener('pointerdown', e => { drag = [e.clientX, e.clientY]; cv.setPointerCapture(e.pointerId); });
cv.addEventListener('pointermove', e => { if (!drag) return; yaw += (e.clientX - drag[0]) * 0.01; pitch = Math.max(-1.4, Math.min(1.4, pitch + (e.clientY - drag[1]) * 0.01)); drag = [e.clientX, e.clientY]; draw(); });
cv.addEventListener('pointerup', () => { drag = null; });
cv.addEventListener('wheel', e => { e.preventDefault(); zoom = Math.max(0.3, Math.min(5, zoom * (e.deltaY < 0 ? 1.1 : 0.9))); draw(); }, { passive: false });
function proj([x, y, z], W, H, side) {
  const c = side / 2, X = x - c, Y = y - c, Z = z - c;
  const x1 = X * Math.cos(yaw) - Z * Math.sin(yaw), z1 = X * Math.sin(yaw) + Z * Math.cos(yaw);
  const y1 = Y * Math.cos(pitch) - z1 * Math.sin(pitch), z2 = Y * Math.sin(pitch) + z1 * Math.cos(pitch);
  const s = (Math.min(W, H) / side) * 0.75 * zoom * (side * 2.2) / (side * 2.2 + z2);
  return [W / 2 + x1 * s, H / 2 - y1 * s, z2];
}
const LEVEL = ['#8a93a6', '#5b8def', '#3fb8a9', '#5fcf8b', '#f5c26b', '#fff3c4'];
function draw() {
  const W = cv.width = cv.clientWidth * devicePixelRatio, H = cv.height = cv.clientHeight * devicePixelRatio;
  ctx.clearRect(0, 0, W, H);
  if (!run) { ctx.fillStyle = '#8a93a6'; ctx.font = `${14 * devicePixelRatio}px system-ui`; ctx.fillText('Escolha o mundo, ajuste os parâmetros e execute.', 20 * devicePixelRatio, 30 * devicePixelRatio); return; }
  const t = (Number($('time').value) / 1000) * run.end, side = run.side, P = p => proj(p, W, H, side), p = run.params;
  // novelty concentration (uniform equivalent) -> ambient glow; sleep -> blue tint
  const rel = run.ev.filter(e => e.type === 'modulator.release' && e.t <= t);
  const conc = rel.reduce((a, e) => a + p.modulatorPerSpikeNM * Math.exp(-p.modulatorClearancePerS * (t - e.t) / 1000), 0);
  const states = run.ev.filter(e => e.type.startsWith('state.') && e.t <= t), asleep = states.length && states[states.length - 1].type === 'state.asleep';
  const g = Math.min(1, conc / (2 * p.receptorHalfNM));
  ctx.fillStyle = asleep ? 'rgba(40,60,120,0.35)' : `rgba(245,194,107,${0.12 * g})`; ctx.fillRect(0, 0, W, H);
  // substrate cube
  ctx.strokeStyle = '#262c38'; ctx.lineWidth = devicePixelRatio;
  const C = [0, side], corners = []; for (const x of C) for (const y of C) for (const z of C) corners.push([x, y, z]);
  for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) { const d = corners[i].filter((v, k) => v !== corners[j][k]).length; if (d === 1) { const a = P(corners[i]), b = P(corners[j]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
  // units alive at t
  const units = new Map();
  for (const e of run.ev) {
    if (e.t > t) break;
    if (e.type === 'unit.created') { units.set(e.unit, { pos: e.position, aff: e.afferents, inh: e.competitors ?? [], level: 0, hier: e.level, last: -Infinity, surprise: false }); }
    else if (e.type === 'unit.pruned') units.delete(e.unit);
    else if (e.type === 'unit.consolidated' && units.has(e.unit)) units.get(e.unit).level = e.level;
    else if ((e.type === 'unit.discharge' || e.type === 'unit.reactivated') && units.has(e.unit)) { const u = units.get(e.unit); u.last = e.t; if (e.type === 'unit.discharge') u.surprise = !!e.surprise; }
  }
  const pos = id => units.get(id)?.pos ?? run.src[id];
  ctx.strokeStyle = 'rgba(138,147,166,0.18)';
  for (const u of units.values()) for (const a of u.aff) { const q = pos(a); if (!q) continue; const A = P(q), B = P(u.pos); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); }
  // version 2: inhibitory Upro between competitors (both directions), dashed red
  ctx.strokeStyle = 'rgba(224,92,92,0.35)'; ctx.setLineDash([4 * devicePixelRatio, 4 * devicePixelRatio]);
  for (const u of units.values()) for (const c of u.inh) { const v = units.get(c); if (!v) continue; const A = P(v.pos), B = P(u.pos); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); }
  ctx.setLineDash([]);
  for (const [id, q] of Object.entries(run.src)) { if (units.has(id)) continue; const A = P(q); ctx.fillStyle = '#c46a45'; ctx.fillRect(A[0] - 3, A[1] - 3, 6, 6); }
  const list = [...units.values()].map(u => ({ u, A: P(u.pos) })).sort((a, b) => b.A[2] - a.A[2]);
  for (const { u, A } of list) {
    const flash = t - u.last < 150;
    ctx.fillStyle = flash ? (u.surprise ? '#ff8a3d' : '#ffffff') : LEVEL[Math.min(5, u.level)];
    ctx.beginPath(); ctx.arc(A[0], A[1], (2 + 1.5 * u.hier) * devicePixelRatio * (flash ? 1.6 : 1), 0, 7); ctx.fill();
  }
  // illustration of release particles (recent releases)
  const Dstar = 322, MAG = 20;
  for (const e of rel.filter(e => t - e.t < 200)) {
    const r = makeRng(Math.round(e.t)), age = (t - e.t) / 1000, rad = Math.sqrt(6 * Dstar * Math.max(age, 1e-4)) * MAG, fade = Math.exp(-p.modulatorClearancePerS * age);
    for (let k = 0; k < 40; k++) {
      const site = [r.random() * side, r.random() * side, r.random() * side];
      const dir = [r.normal(), r.normal(), r.normal()], n = Math.hypot(...dir) || 1;
      const q = site.map((v, i) => v + (dir[i] / n) * rad * Math.abs(r.normal()));
      const A = P(q); ctx.fillStyle = `rgba(245,194,107,${0.8 * fade})`; ctx.fillRect(A[0], A[1], 2 * devicePixelRatio, 2 * devicePixelRatio);
    }
  }
  $('clock').textContent = `${(t / 1000).toFixed(2)} s · ${asleep ? 'sono' : 'vigília'} · novidade ${conc.toFixed(1)} nM${run.exploratory ? ' · EXPLORATÓRIO' : ''}`;
  const s = run.snap, stat = (k, v) => `<div class="stat"><b>${v}</b><span>${k}</span></div>`;
  const created = run.ev.filter(e => e.type === 'unit.created').length, cons = s.units.filter(u => u.level > 0).length;
  $('stats').innerHTML = run.v === 2
    ? stat('Uint vivas em t', units.size) + stat('Uint criadas (total)', created) + stat('consolidadas (fim)', cons) + stat('podadas', s.stats.pruned)
      + stat('descargas', s.stats.firings) + stat('surpresas', `${s.stats.surprises} (${s.stats.surprisesTransduced} transdutivas · ${s.stats.surprisesInternal} internas)`)
      + stat('confirmações', s.stats.confirmations) + stat('incidências tardias', s.stats.late) + stat('acomodações', s.stats.accommodated)
      + stat('Upro (inibitórias)', `${s.upros.total} (${s.upros.inhibitory})`) + stat('liberações', rel.length) + stat('episódios de sono', s.sleepEpisodes ?? 0)
    : stat('unidades vivas em t', units.size) + stat('criadas (total)', created) + stat('consolidadas (fim)', cons) + stat('podadas', s.pruned) + stat('falhas de espera', s.surprises)
      + stat('esperas cumpridas', s.fulfilledExpectations) + stat('liberações', rel.length) + stat('episódios de sono', s.sleepEpisodes ?? 0);
}
let timer = null;
$('play').onclick = () => {
  if (timer) { clearInterval(timer); timer = null; $('play').textContent = '▶'; return; }
  if (Number($('time').value) >= 1000) $('time').value = 0;
  $('play').textContent = '❚❚';
  timer = setInterval(() => { const v = Number($('time').value) + 2; $('time').value = Math.min(1000, v); draw(); if (v >= 1000) $('play').onclick(); }, 40);
};
$('time').oninput = draw;
addEventListener('resize', draw);
renderParams(); updateMode(); draw();
