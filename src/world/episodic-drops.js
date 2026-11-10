// Episodic 1D world (P0.2): repeated drops of ONE rigid sphere onto a fixed
// plane, at release heights chosen by the RESEARCHER.
//
// Each episode composes the already validated analytic model
// (createReleaseControlledWorld) without rewriting its physics:
//   1. at the episode start the researcher instantaneously REPOSITIONS the
//      sphere at the episode height and holds it (external intervention; not
//      physical motion, so no upward trajectory exists to be sensed);
//   2. at startMs + holdMs the sphere is released;
//   3. it falls under gravity and hits the plane; restitution is 0 inside
//      this world, so it comes to rest (no second impact; the one-impact
//      model stays within its validity domain);
//   4. it rests until the next episode.
//
// The release heights are the independent physical variable that a
// constitutive engine would have to track (research-design D3). They are
// researcher-side truth and are never delivered to any engine.
import { createReleaseControlledWorld } from './release-control.js';
import { makeRng } from '../../vendor/tempo/core/rng.js';

export const EPISODIC_DROPS_MODEL = 'episodic-vertical-drops';
export const EPISODIC_DROPS_VERSION = '0.1.0';

const finite = (name, v, lo, hi) => {
  if (!Number.isFinite(v) || v < lo || v > hi) {
    throw new RangeError(name + ' must be finite and in [' + lo + ', ' + hi + ']');
  }
  return v;
};

// Researcher-side schedule: explicit heights, or heights drawn uniformly from
// a declared range with a declared seed (both recorded in describe()).
export function episodicHeights({ heightsM = null, episodes = 20,
  minHeightM = 0.8, maxHeightM = 2.0, scheduleSeed = 0 } = {}) {
  if (heightsM !== null) {
    if (!Array.isArray(heightsM) || heightsM.length < 1) {
      throw new RangeError('heightsM must be a non-empty array');
    }
    return heightsM.map((h, i) => finite('heightsM[' + i + ']', h, 0.01, 100));
  }
  if (!Number.isInteger(episodes) || episodes < 1 || episodes > 100000) {
    throw new RangeError('episodes must be an integer in [1, 100000]');
  }
  finite('minHeightM', minHeightM, 0.01, 100);
  finite('maxHeightM', maxHeightM, minHeightM, 100);
  if (!Number.isInteger(scheduleSeed) || scheduleSeed < 0 || scheduleSeed > 0xffffffff) {
    throw new RangeError('scheduleSeed must be an unsigned 32-bit integer');
  }
  const rng = makeRng(scheduleSeed);
  return Array.from({ length: episodes }, () => rng.uniform(minHeightM, maxHeightM));
}

export function createEpisodicDropWorld({
  heightsM, episodeMs = 3000, holdMs = 1000,
  gravityMps2 = 9.81, massKg = 1, radiusM = 0.05,
  schedule = null,
} = {}) {
  if (!Array.isArray(heightsM) || heightsM.length < 1) {
    throw new RangeError('heightsM must be a non-empty array');
  }
  finite('episodeMs', episodeMs, 1, 1e9);
  finite('holdMs', holdMs, 0, episodeMs);
  finite('gravityMps2', gravityMps2, 1e-6, 1e4);
  const episodes = heightsM.map((h, i) => {
    finite('heightsM[' + i + ']', h, 0.01, 100);
    const world = createReleaseControlledWorld({
      releaseAtMs: holdMs, clearanceM: h, gravityMps2, massKg, radiusM,
      restitution: 0,
    });
    const impactLocalMs = world.describe().impactTimeMs;
    // Keep a visible rest interval: the episode must contain the whole fall.
    if (!(impactLocalMs < episodeMs)) {
      throw new RangeError('Episode ' + i + ' too short: impact at ' +
        impactLocalMs.toFixed(3) + ' ms (local) >= episodeMs ' + episodeMs);
    }
    return Object.freeze({ index: i, startMs: i * episodeMs, heightM: h,
      world, impactTimeMs: i * episodeMs + impactLocalMs });
  });
  const endMs = episodes.length * episodeMs;

  function episodeAt(timeMs) {
    if (!Number.isFinite(timeMs) || timeMs < 0 || timeMs > endMs) {
      throw new RangeError('timeMs outside the episodic schedule [0, ' + endMs + ']');
    }
    return episodes[Math.min(episodes.length - 1, Math.floor(timeMs / episodeMs))];
  }
  function stateAt(timeMs) {
    const e = episodeAt(timeMs);
    const local = e.world.stateAt(timeMs - e.startMs);
    return Object.freeze({ ...local, timeMs, episode: e.index });
  }
  function eventsThrough(timeMs) {
    const last = episodeAt(timeMs).index;
    const out = [];
    for (let i = 0; i <= last; i++) {
      const e = episodes[i];
      out.push(Object.freeze({ eventId: 'reposition-' + (i + 1),
        type: 'intervention.reposition', timeMs: e.startMs, episode: i,
        heightM: e.heightM, imposedBy: 'experimenter' }));
      for (const ev of e.world.eventsThrough(Math.min(timeMs, e.startMs + episodeMs) - e.startMs)) {
        if (e.startMs + ev.timeMs > timeMs) continue;
        out.push(Object.freeze({ ...ev, eventId: ev.eventId + '-e' + (i + 1),
          timeMs: e.startMs + ev.timeMs, episode: i }));
      }
    }
    return Object.freeze(out);
  }
  function describe() {
    return Object.freeze({
      modelId: EPISODIC_DROPS_MODEL, version: EPISODIC_DROPS_VERSION,
      // Shared physical parameters (sensing couplings read radiusM here).
      parameters: Object.freeze({ gravityMps2, massKg, radiusM, restitution: 0 }),
      episodeMs, holdMs, endMs,
      schedule: schedule === null ? Object.freeze({ kind: 'explicit' }) : Object.freeze({ ...schedule }),
      // RESEARCHER-ONLY truth: never delivered to an engine.
      episodes: Object.freeze(episodes.map(e => Object.freeze({
        index: e.index, startMs: e.startMs, heightM: e.heightM,
        releaseMs: e.startMs + holdMs, impactTimeMs: e.impactTimeMs,
      }))),
      intervention: 'experimenter repositions (instantaneous) and releases each episode',
      validity: 'restitution 0: exactly one impact per episode, then rest',
    });
  }
  // Component worlds, exposed for independent per-episode verification.
  function episodeWorlds() { return episodes.map(e => e.world); }
  return Object.freeze({ describe, stateAt, eventsThrough, episodeWorlds });
}
