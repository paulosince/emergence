import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createClockEnsemble, peakTimes, meanPeriod } from '../src/rhythm/clock.js';
import { PacemakerUnit } from '../src/rhythm/pacemaker.js';

function run(opts, hours, light = null) {
  const c = createClockEnsemble({ stepHours: 0.05, ...opts }), T = [], X = [], U = [];
  for (let t = 0.5; t <= hours; t += 0.5) {
    if (light !== null) c.setLight(t % 24 < 12 ? light : 0);
    c.advanceTo(t); T.push(t); X.push(c.meanX()); U.push(c.unitX()[0]);
  }
  const late = a => a.slice(-200), amp = a => Math.max(...late(a)) - Math.min(...late(a));
  return { period: meanPeriod(peakTimes(T, X, { after: hours / 2 })), amp: amp(X), unitAmp: amp(U) };
}

test('clock: isolated unit reproduces Gonze et al. (2005) period ~23.5 h (sustained with n = 4)', () => {
  const r = run({ cells: 1, periodSd: 0, coupled: false }, 800);
  assert.ok(Math.abs(r.period - 23.5) < 0.4, `period ${r.period}`);
  assert.ok(r.amp > 0.05);
});

test('clock: linear degradation with n = 4 damps out (Goodwin/Griffith condition)', () => {
  const r = run({ cells: 1, periodSd: 0, coupled: false, linearDegradation: true }, 800);
  assert.ok(r.amp < 1e-3, `amplitude ${r.amp}`);
});

test('clock: coupled population synchronises with period ~26.5 h; uncoupled units keep their own rhythm but desynchronise', () => {
  const coupled = run({ cells: 50, seed: 3 }, 1500);
  assert.ok(coupled.period > 25.8 && coupled.period < 27.5, `period ${coupled.period}`);
  const free = run({ cells: 50, seed: 3, coupled: false }, 1500);
  assert.ok(free.amp < coupled.amp / 2, 'population mean flattens without coupling');
  assert.ok(free.unitAmp > 0.05, 'each unit still oscillates (Welsh et al. 1995)');
});

test('clock: entrained to 24 h by a light-dark cycle', () => {
  const r = run({ cells: 50, seed: 3 }, 1500, 0.01);
  assert.ok(Math.abs(r.period - 24) < 0.1, `period ${r.period}`);
});

test('clock: time reversal and negative light are refused', () => {
  const c = createClockEnsemble({ cells: 2 });
  c.advanceTo(1);
  assert.throws(() => c.advanceTo(0.5));
  assert.throws(() => c.setLight(-1));
});

test('pacemaker: fires periodically without input at the closed-form period', () => {
  const p = new PacemakerUnit({ tauMs: 20, threshold: 1, refractoryMs: 2, drive: 0.1 });
  const T = p.intrinsicPeriodMs();
  const s = p.advanceTo(1000);
  assert.ok(s.length > 5);
  const isi = s.slice(1).map((x, i) => x - s[i]);
  assert.ok(isi.every(d => Math.abs(d - T) < 1e-6), `isi ${isi[0]} vs ${T}`);
});

test('pacemaker: excitatory input advances the next spike; drive changes the frequency; no firing below rheobase', () => {
  const a = new PacemakerUnit({ drive: 0.1 }), b = new PacemakerUnit({ drive: 0.1 });
  a.advanceTo(10); b.advanceTo(10);
  b.input(0.2);
  assert.ok(b.nextSpikeMs() < a.nextSpikeMs());
  const fast = new PacemakerUnit({ drive: 0.2 });
  assert.ok(fast.intrinsicPeriodMs() < a.intrinsicPeriodMs());
  const silent = new PacemakerUnit({ drive: 0.04 }); // drive*tau = 0.8 < threshold
  assert.equal(silent.intrinsicPeriodMs(), Infinity);
  assert.equal(silent.advanceTo(5000).length, 0);
});
