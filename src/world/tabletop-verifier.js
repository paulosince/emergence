// Independent verification of the tabletop world (P0.6). Does NOT reuse the
// world's collision-time solvers. Checks physical invariants on sampled
// states and compares, up to the first collision, with a small-step
// numerical integration (an independent oracle).
export function verifyTabletop(world, { stepMs = 5, tolerance = 1e-6 } = {}) {
  const d = world.describe(), errors = [];
  let checks = 0;
  const T = d.horizonMs;
  const ivTimes = world.eventsThrough(T).filter(e => e.type.startsWith('intervention')).map(e => e.timeMs);
  const energy = s => s.discs.reduce((a, x) => a + 0.5 * x.massKg * (x.vx ** 2 + x.vy ** 2), 0);
  const momentum = s => s.discs.reduce((a, x) => [a[0] + x.massKg * x.vx, a[1] + x.massKg * x.vy], [0, 0]);
  let prevE = null, prevT = 0;
  for (let t = 0; t <= T; t += stepMs) {
    const s = world.stateAt(t);
    for (const x of s.discs) {                       // inside the table
      checks++;
      if (x.x < x.radiusM - tolerance || x.x > d.widthM - x.radiusM + tolerance ||
          x.y < x.radiusM - tolerance || x.y > d.depthM - x.radiusM + tolerance) errors.push({ check: 'inside', t, disc: x.id });
    }
    for (let i = 0; i < s.discs.length; i++) for (let j = i + 1; j < s.discs.length; j++) {
      checks++;
      const a = s.discs[i], b = s.discs[j];
      if (Math.hypot(a.x - b.x, a.y - b.y) < a.radiusM + b.radiusM - tolerance) errors.push({ check: 'no-penetration', t, discs: [i, j] });
    }
    const E = energy(s);
    const crossed = ivTimes.some(x => x > prevT && x <= t) || (t === 0 && ivTimes.includes(0));
    if (prevE !== null && !crossed) {                // elastic: energy constant between interventions
      checks++;
      if (Math.abs(E - prevE) > tolerance * Math.max(1, prevE)) errors.push({ check: 'energy', t, before: prevE, after: E });
    }
    prevE = E; prevT = t;
  }
  // momentum conserved across every disc-disc contact (walls excluded)
  for (const e of world.eventsThrough(T).filter(e => e.type === 'contact.disc-disc')) {
    if (e.timeMs - 1e-3 < 0 || e.timeMs + 1e-3 > T) continue;
    const before = world.stateAt(e.timeMs - 1e-3), after = world.stateAt(e.timeMs + 1e-3);
    const wallNear = world.eventsThrough(e.timeMs + 1e-3).some(x => x.type === 'contact.disc-wall' && Math.abs(x.timeMs - e.timeMs) < 1e-3);
    if (wallNear) continue;
    const ia = e.discs, pick = (s) => ia.map(k => s.discs[k]);
    const pB = pick(before).reduce((a, x) => [a[0] + x.massKg * x.vx, a[1] + x.massKg * x.vy], [0, 0]);
    const pA = pick(after).reduce((a, x) => [a[0] + x.massKg * x.vx, a[1] + x.massKg * x.vy], [0, 0]);
    checks++;
    if (Math.hypot(pA[0] - pB[0], pA[1] - pB[1]) > tolerance * Math.max(1, Math.hypot(...pB))) errors.push({ check: 'momentum', t: e.timeMs });
  }
  // independent oracle until the first event of any kind
  const first = world.eventsThrough(T).filter(e => e.timeMs > 0)[0]?.timeMs ?? T;
  const s0 = world.stateAt(0);
  const sim = s0.discs.map(x => ({ x: x.x, y: x.y, vx: x.vx, vy: x.vy }));
  const h = 0.1; // ms
  for (let t = 0; t + h <= first * 0.999; t += h) {
    for (const x of sim) { x.x += x.vx * h / 1000; x.y += x.vy * h / 1000; }
  }
  const tCheck = Math.floor((first * 0.999) / h) * h;
  const ref = world.stateAt(tCheck);
  sim.forEach((x, k) => { checks++;
    if (Math.hypot(x.x - ref.discs[k].x, x.y - ref.discs[k].y) > 1e-6) errors.push({ check: 'oracle', disc: k, t: tCheck }); });
  return Object.freeze({ passed: errors.length === 0, checks, errors: errors.slice(0, 20), errorCount: errors.length,
    momentumMomentumNote: 'momentum checked only for disc-disc contacts without a simultaneous wall contact' });
}
