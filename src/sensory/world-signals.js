// Research-side coupling between an analytic world and scalar sensing channels.
// No object identity, impact labels or world state is passed to a learning engine.
import { assertPhysicalWorld } from '../world/world-contract.js';

const MAX_HEIGHT_M = 1e6;

function nonnegativeFinite(name, value, allowZero = true) {
  if (!Number.isFinite(value) || value < 0 || (!allowZero && value === 0)) {
    throw new RangeError(name + ' must be finite and ' +
      (allowZero ? 'nonnegative' : 'positive'));
  }
}

export class WorldSignalEnvironment {
  #world;
  #couplings;
  constructor({ world, couplings }) {
    assertPhysicalWorld(world);
    if (!Array.isArray(couplings)) {
      throw new TypeError('Couplings must be an array (which may be empty)');
    }
    const map = new Map();
    for (const spec of couplings) {
      if (!spec || typeof spec !== 'object' ||
          typeof spec.channelId !== 'string' || !spec.channelId.trim() ||
          map.has(spec.channelId)) {
        throw new TypeError('Physical channels must have distinct nonempty IDs');
      }
      if (spec.type === 'photogate') {
        nonnegativeFinite('beamHeightM', spec.beamHeightM);
        if (spec.beamHeightM > MAX_HEIGHT_M) throw new RangeError('beam out of range');
        const { clearIntensity = 1, blockedIntensity = 0 } = spec;
        nonnegativeFinite('clearIntensity', clearIntensity);
        nonnegativeFinite('blockedIntensity', blockedIntensity);
        if (clearIntensity > 1 || blockedIntensity > 1) {
          throw new RangeError('Normalized optical intensity must not exceed 1');
        }
        if (blockedIntensity > clearIntensity) {
          throw new RangeError('Blocked beam cannot be brighter than unobstructed beam');
        }
        map.set(spec.channelId, Object.freeze({
          channelId: spec.channelId, type: 'photogate',
          modality: 'optical',
          beamHeightM: spec.beamHeightM, clearIntensity, blockedIntensity,
          outputUnit: 'normalized-light-intensity',
        }));
      } else if (spec.type === 'force-plate-impulse') {
        nonnegativeFinite('windowMs', spec.windowMs, false);
        map.set(spec.channelId, Object.freeze({
          channelId: spec.channelId, type: 'force-plate-impulse',
          modality: 'mechanical',
          windowMs: spec.windowMs, outputUnit: 'N*s',
        }));
      } else {
        throw new RangeError('Unsupported physical coupling: ' + spec.type);
      }
    }
    this.#world = world;
    this.#couplings = map;
  }

  validateTransducers(transducers) {
    for (const sensor of transducers) {
      const coupling = this.#couplings.get(sensor.config.channelId);
      if (!coupling) {
        throw new RangeError('No physical coupling for sensor ' + sensor.config.id);
      }
      if (coupling.type === 'force-plate-impulse' &&
          coupling.windowMs !== sensor.config.periodMs) {
        throw new RangeError('Force plate integration window must equal sample period');
      }
    }
  }

  validateHorizon(endTimeMs) {
    this.#world.stateAt(endTimeMs);
  }

  readAt(channelId, timeMs) {
    const coupling = this.#couplings.get(channelId);
    if (!coupling) throw new RangeError('Unknown physical channel');
    nonnegativeFinite('timeMs', timeMs);
    // Read the underlying world even when a physical signal is absent.
    // This validates that observations remain inside the physical model's domain.
    if (coupling.type === 'photogate') {
      const state = this.#world.stateAt(timeMs);
      const radius = this.#world.describe().parameters.radiusM;
      // A collimated horizontal beam crosses the sphere's vertical axis.
      // Obstruction is purely geometric. Light propagation is idealized as
      // negligible relative to the simulated millisecond resolution.
      const blocked = Math.abs(state.centerHeightM - coupling.beamHeightM) <= radius;
      return blocked ? coupling.blockedIntensity : coupling.clearIntensity;
    }
    this.#world.stateAt(timeMs);
    // The force plate does not observe an infinite instantaneous force.
    // It integrates normal IMPULSE in (timeMs - windowMs, timeMs].
    // At t=0 the lower bound includes t=0 to capture an immediate collision.
    const startMs = Math.max(0, timeMs - coupling.windowMs);
    return this.#world.eventsThrough(timeMs)
      .filter(e => e.type === 'collision.impact' &&
        e.timeMs <= timeMs && (timeMs === 0 ? e.timeMs >= startMs : e.timeMs > startMs))
      .reduce((total, e) => total + e.normalImpulseNs, 0);
  }

  specification() {
    return {
      model: 'analytic-world-sensory-coupling-v1',
      world: this.#world.describe(), // researcher-only physical truth
      couplings: [...this.#couplings.values()].map(c => ({ ...c })),
      semantics: 'coupling settings are not exposed to the experimental engine',
    };
  }
}