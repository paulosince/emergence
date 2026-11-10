// Causal-removal test (criterion N7 / D4): does removing a candidate unit
// change what the SYSTEM itself does afterwards, beyond removing random units?
// Engine-agnostic. Requires an engine factory and an engine method
// ablate(unitKey) declared by the engine; engines without it cannot be tested
// (the bench refuses rather than faking a removal).
import { replayIncidences } from './replay.js';
import { makeRng } from '../../../vendor/tempo/core/rng.js';
import { compareToNull } from './stats.js';

export function causalRemovalTest({ makeEngine, incidences, endTimeMs, removeAtMs,
  target, candidates, outcome, randomRemovals = 30, seed = 0 }) {
  const probe = makeEngine();
  if (typeof probe.ablate !== 'function') {
    throw new TypeError('Engine declares no ablate(unitKey): causal removal not available');
  }
  const run = removed => {
    const engine = makeEngine();
    let done = removed === null;
    const r = replayIncidences(engine, incidences, { endTimeMs,
      onDelivered: (i, e) => { if (!done && i.arrivedAtMs >= removeAtMs) { e.ablate(removed); done = true; } } });
    if (!done) { engine.ablate(removed); }
    return outcome(r, engine);
  };
  const intact = run(null);
  const effect = x => Math.abs(x - intact);
  const targetEffect = effect(run(target));
  const pool = candidates.filter(k => k !== target);
  const rng = makeRng(seed);
  const nullEffects = [];
  for (let k = 0; k < Math.min(randomRemovals, pool.length * 4); k++) {
    nullEffects.push(effect(run(pool[Math.floor(rng.random() * pool.length)])));
  }
  return { intact, targetEffect, null: compareToNull(targetEffect, nullEffects) };
}
