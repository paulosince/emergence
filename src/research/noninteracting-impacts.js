// Adversarial control with TWO noninteracting, independently evolved
// copies of the already validated 1D sphere/plane model.
// Their event TIMES may coincide by experimenter coordination. Such
// coincidence does not demonstrate physical interaction/common object.
// Research-only provenance is kept outside the engine's incidence stream.
import { createReleaseControlledWorld } from '../world/release-control.js';
import { WorldSignalEnvironment } from '../sensory/world-signals.js';

class NoninteractingImpactEnvironment {
  #sources;
  #routes;
  constructor(sources) {
    if (!Array.isArray(sources) || sources.length !== 2) {
      throw new TypeError('Requires exactly two independent physical sources');
    }
    this.#sources = sources;
    this.#routes = new Map();
    for (const s of sources) {
      if (this.#routes.has(s.channelId)) {
        throw new RangeError('Duplicate channel in noninteracting worlds');
      }
      this.#routes.set(s.channelId, s);
    }
  }

  readAt(channelId, timeMs) {
    const source = this.#routes.get(channelId);
    if (!source) throw new RangeError('Unknown physical channel');
    return source.sensing.readAt(channelId, timeMs);
  }

  validateTransducers(transducers) {
    for (const transducer of transducers) {
      const source = this.#routes.get(transducer.config.channelId);
      if (!source) throw new RangeError('Unknown physical channel');
      source.sensing.validateTransducers([transducer]);
    }
  }

  validateHorizon(endTimeMs) {
    for (const source of this.#sources) source.sensing.validateHorizon(endTimeMs);
  }

  specification() {
    return {
      model: 'noninteracting-dual-impact-control-v1',
      physicalInteractionBetweenSources: false,
      releaseCoordinationByExperimenter: true,
      // Full physical truth is for the researcher, never the learning engine.
      sources: this.#sources.map(s => ({
        originForAuditOnly: s.originForAuditOnly,
        channelId: s.channelId,
        world: s.world.describe(),
        coupling: s.sensing.specification().couplings[0],
      })),
    };
  }
}

export function createNoninteractingImpacts({
  arrangement = 'coincident', seed = 42, endTimeMs = 800,
} = {}) {
  if (!['coincident', 'staggered'].includes(arrangement)) {
    throw new RangeError('Arrangement must be coincident or staggered');
  }
  const worldA = createReleaseControlledWorld({
    clearanceM: 1, gravityMps2: 9.81, restitution: 0.5,
  });
  const worldBAtZero = createReleaseControlledWorld({
    clearanceM: 0.25, gravityMps2: 9.81, restitution: 0,
  });
  // The experimenter varies ONLY B's holding constraint/release time.
  // There is no force, signal, collision or state transfer between A and B.
  const releaseBMs = arrangement === 'coincident'
    ? worldA.describe().impactTimeMs - worldBAtZero.describe().impactTimeMs
    : 0;
  const worldB = createReleaseControlledWorld({
    clearanceM: 0.25, gravityMps2: 9.81, restitution: 0,
    releaseAtMs: releaseBMs,
  });

  const sources = [
    { originForAuditOnly: 'world-A', channelId: 'c0', world: worldA },
    { originForAuditOnly: 'world-B', channelId: 'c1', world: worldB },
  ].map(entry => ({
    ...entry,
    sensing: new WorldSignalEnvironment({
      world: entry.world,
      couplings: [{
        channelId: entry.channelId, type: 'force-plate-impulse',
        windowMs: 10,
      }],
    }),
  }));
  return {
    environment: new NoninteractingImpactEnvironment(sources),
    transducers: [
      { id: 's0', channelId: 'c0', periodMs: 10, latencyMs: 2,
        emitMode: 'change' },
      { id: 's1', channelId: 'c1', periodMs: 10, latencyMs: 2,
        emitMode: 'change' },
    ],
    seed, endTimeMs,
    researchConditionId: 'dual-noninteracting-' + arrangement + '-v1',
  };
}