// P0.6 — Tabletop world with persistent entities (researcher-side truth).
//
// A rectangular table with 2..N rigid DISCS moving in the plane, with exact
// event-driven elastic collisions (disc-disc and disc-wall), an opaque
// SCREEN strip that hides discs from optical sensing (not from touch), and a
// schedule of researcher interventions:
//   - 'rest'        all discs stop (sensing becomes silent: rest periods);
//   - 'launch'      set velocities (explicit or seeded);
//   - 'teleport'    move one disc instantaneously (spatiotemporal violation);
//   - 'feature'     set reflectance/temperature of one disc (abrupt change);
//   - 'feature-drift' change a feature gradually in N equal steps (Theseus).
// Between interventions motion is uniform and collisions are solved exactly.
// Everything here is researcher-only truth; engines receive incidences only.
import { makeRng } from '../../vendor/tempo/core/rng.js';

export const TABLETOP_MODEL = 'tabletop-discs-event-driven';
export const TABLETOP_VERSION = '0.1.0';
const EPS = 1e-12;

const check = (name, v, lo, hi) => {
  if (!Number.isFinite(v) || v < lo || v > hi) throw new RangeError(name + ' must be in [' + lo + ', ' + hi + ']');
  return v;
};

function wallTime(p, v, r, lo, hi) {
  if (v > EPS) return (hi - r - p) / v;
  if (v < -EPS) return (lo + r - p) / v;
  return Infinity;
}
function pairTime(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, dvx = b.vx - a.vx, dvy = b.vy - a.vy, R = a.r + b.r;
  const bb = dx * dvx + dy * dvy;
  if (bb >= 0) return Infinity; // separating or parallel
  const aa = dvx * dvx + dvy * dvy, cc = dx * dx + dy * dy - R * R;
  const disc = bb * bb - aa * cc;
  if (disc < 0) return Infinity;
  const t = (-bb - Math.sqrt(disc)) / aa;
  return t >= -1e-9 ? Math.max(0, t) : Infinity;
}

export function createTabletopWorld({
  widthM = 1.0, depthM = 0.6,
  discs,                           // [{id?, radiusM, reflectance, temperatureC, x, y, vx, vy}]
  screen = { x0: 0.45, x1: 0.6 },  // opaque strip over the full depth, or null
  interventions = [],              // [{timeMs, type, ...}]
  horizonMs = 300000,
  maxCollisions = 200000,
} = {}) {
  check('widthM', widthM, 0.1, 100); check('depthM', depthM, 0.1, 100);
  check('horizonMs', horizonMs, 1, 1e9);
  if (!Array.isArray(discs) || discs.length < 1 || discs.length > 16) throw new RangeError('1..16 discs required');
  const state = discs.map((d, k) => {
    const r = check('radiusM', d.radiusM, 0.005, Math.min(widthM, depthM) / 4);
    const s = { k, id: 'disc-' + k, r, m: r * r * 1000, x: check('x', d.x, r, widthM - r), y: check('y', d.y, r, depthM - r),
      vx: d.vx ?? 0, vy: d.vy ?? 0,
      reflectance: check('reflectance', d.reflectance, 0, 1), temperatureC: check('temperatureC', d.temperatureC, -50, 200) };
    return s;
  });
  for (let a = 0; a < state.length; a++) for (let b = a + 1; b < state.length; b++) {
    if (Math.hypot(state[a].x - state[b].x, state[a].y - state[b].y) < state[a].r + state[b].r - 1e-9) {
      throw new RangeError('Initial overlap between discs ' + a + ' and ' + b);
    }
  }
  if (screen !== null) { check('screen.x0', screen.x0, 0, widthM); check('screen.x1', screen.x1, screen.x0, widthM); }

  // Expand feature-drift into equal steps; sort all interventions by time.
  const plan = [];
  for (const iv of interventions) {
    check('intervention.timeMs', iv.timeMs, 0, horizonMs);
    if (iv.type === 'feature-drift') {
      const n = iv.steps ?? 10, dur = check('durationMs', iv.durationMs, 1, horizonMs);
      for (let s = 1; s <= n; s++) plan.push({ timeMs: iv.timeMs + (dur * s) / n, type: 'feature', disc: iv.disc,
        feature: iv.feature, value: iv.from + ((iv.to - iv.from) * s) / n, drift: true });
    } else plan.push({ ...iv });
  }
  plan.sort((a, b) => a.timeMs - b.timeMs);
  for (const iv of plan) {
    if (!['rest', 'launch', 'teleport', 'feature'].includes(iv.type)) throw new RangeError('Unknown intervention ' + iv.type);
    if (iv.type !== 'rest' && iv.type !== 'launch' && !(Number.isInteger(iv.disc) && iv.disc >= 0 && iv.disc < state.length)) {
      throw new RangeError('Intervention needs a valid disc index');
    }
  }

  // ---- precompute the exact trajectory as breakpoints -----------------------
  const snaps = [];        // {timeMs, discs:[{x,y,vx,vy,reflectance,temperatureC}]}
  const events = [];       // researcher-side physical and intervention events
  const snapshot = t => snaps.push({ timeMs: t, discs: state.map(s => ({ x: s.x, y: s.y, vx: s.vx, vy: s.vy,
    reflectance: s.reflectance, temperatureC: s.temperatureC })) });
  const advance = dtMs => { const dt = dtMs / 1000; for (const s of state) { s.x += s.vx * dt; s.y += s.vy * dt; } };
  const clampInside = s => { s.x = Math.min(widthM - s.r, Math.max(s.r, s.x)); s.y = Math.min(depthM - s.r, Math.max(s.r, s.y)); };
  let t = 0, collisions = 0, pi = 0;
  snapshot(0);
  while (t < horizonMs) {
    // earliest collision
    let best = Infinity, kind = null, a = -1, b = -1;
    for (const s of state) {
      const tx = wallTime(s.x, s.vx, s.r, 0, widthM), ty = wallTime(s.y, s.vy, s.r, 0, depthM);
      if (tx * 1000 < best) { best = tx * 1000; kind = 'wall-x'; a = s.k; }
      if (ty * 1000 < best) { best = ty * 1000; kind = 'wall-y'; a = s.k; }
    }
    for (let i = 0; i < state.length; i++) for (let j = i + 1; j < state.length; j++) {
      const tc = pairTime(state[i], state[j]) * 1000;
      if (tc < best) { best = tc; kind = 'pair'; a = i; b = j; }
    }
    const nextIv = pi < plan.length ? plan[pi].timeMs : Infinity;
    const tNext = Math.min(t + Math.max(0, best), nextIv, horizonMs);
    advance(tNext - t); t = tNext;
    if (t >= horizonMs && nextIv > horizonMs) { snapshot(t); break; }
    if (nextIv <= t + EPS && (best === Infinity || t + Math.max(0, best) >= nextIv - EPS || nextIv === t)) {
      const iv = plan[pi++];
      if (iv.type === 'rest') for (const s of state) { s.vx = 0; s.vy = 0; }
      else if (iv.type === 'launch') {
        const rng = makeRng(iv.seed ?? 0);
        state.forEach((s, k) => {
          const v = iv.velocities?.[k];
          if (v) { s.vx = v.vx; s.vy = v.vy; }
          else { const speed = rng.uniform(iv.minSpeed ?? 0.05, iv.maxSpeed ?? 0.25), ang = rng.uniform(0, 2 * Math.PI);
            s.vx = speed * Math.cos(ang); s.vy = speed * Math.sin(ang); }
        });
      } else if (iv.type === 'teleport') {
        const s = state[iv.disc]; s.x = iv.x; s.y = iv.y; clampInside(s);
        for (const o of state) if (o !== s && Math.hypot(o.x - s.x, o.y - s.y) < o.r + s.r) {
          throw new RangeError('Teleport at ' + iv.timeMs + ' ms would overlap disc ' + o.k);
        }
      } else if (iv.type === 'feature') {
        if (!['reflectance', 'temperatureC'].includes(iv.feature)) throw new RangeError('Unknown feature ' + iv.feature);
        state[iv.disc][iv.feature] = iv.value;
      }
      events.push(Object.freeze({ type: 'intervention.' + iv.type + (iv.drift ? '-drift-step' : ''), timeMs: t,
        disc: iv.disc ?? null, feature: iv.feature ?? null, value: iv.value ?? null, imposedBy: 'experimenter' }));
      snapshot(t);
      continue;
    }
    if (kind === null || best === Infinity) { snapshot(t); continue; }
    if (++collisions > maxCollisions) throw new RangeError('Collision budget exceeded');
    if (kind === 'wall-x') { state[a].vx = -state[a].vx; clampInside(state[a]); }
    else if (kind === 'wall-y') { state[a].vy = -state[a].vy; clampInside(state[a]); }
    else {
      const p = state[a], q = state[b];
      const nx = (q.x - p.x) / (p.r + q.r), ny = (q.y - p.y) / (p.r + q.r);
      const rel = (p.vx - q.vx) * nx + (p.vy - q.vy) * ny;
      const J = (2 * rel) / (1 / p.m + 1 / q.m);
      p.vx -= (J / p.m) * nx; p.vy -= (J / p.m) * ny; q.vx += (J / q.m) * nx; q.vy += (J / q.m) * ny;
    }
    events.push(Object.freeze({ type: kind === 'pair' ? 'contact.disc-disc' : 'contact.disc-wall', timeMs: t,
      discs: kind === 'pair' ? [a, b] : [a] }));
    snapshot(t);
  }
  const snapTimes = snaps.map(s => s.timeMs);

  function locate(timeMs) {
    if (!Number.isFinite(timeMs) || timeMs < 0 || timeMs > horizonMs) throw new RangeError('timeMs outside [0, ' + horizonMs + ']');
    let lo = 0, hi = snapTimes.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (snapTimes[mid] <= timeMs) lo = mid; else hi = mid - 1; }
    return snaps[lo];
  }
  function stateAt(timeMs) {
    const s = locate(timeMs), dt = (timeMs - s.timeMs) / 1000;
    return Object.freeze({ timeMs, discs: Object.freeze(s.discs.map((d, k) => {
      const x = d.x + d.vx * dt, y = d.y + d.vy * dt;
      return Object.freeze({ id: 'disc-' + k, x, y, vx: d.vx, vy: d.vy, radiusM: state[k].r, massKg: state[k].m,
        reflectance: d.reflectance, temperatureC: d.temperatureC,
        hidden: screen !== null && x + state[k].r > screen.x0 && x - state[k].r < screen.x1,
        fullyHidden: screen !== null && x - state[k].r >= screen.x0 && x + state[k].r <= screen.x1 });
    })) });
  }
  function eventsThrough(timeMs) { locate(timeMs); return Object.freeze(events.filter(e => e.timeMs <= timeMs)); }
  function describe() {
    return Object.freeze({ modelId: TABLETOP_MODEL, version: TABLETOP_VERSION, widthM, depthM, horizonMs,
      screen: screen && { ...screen }, discs: state.map(s => ({ id: s.id, radiusM: s.r, massKg: s.m })),
      collisions, interventions: plan.length,
      parameters: { restitution: 1, collisions: 'exact event-driven, elastic' },
      provenance: 'researcher-only truth' });
  }
  return Object.freeze({ stateAt, eventsThrough, describe });
}
