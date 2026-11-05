// Physical sensor couplings to a mechanical actuator body.
// Only measured numerical signals go to transducers. Full body state
// belongs exclusively to the researcher's hidden physical world.
import { WorldSignalEnvironment } from '../sensory/world-signals.js';

const BODY_SIGNAL_TYPES = Object.freeze([
  'joint-potentiometer', 'capacitor-voltage',
  'temperature-voltage', 'motor-current',
]);

export class BodySignalEnvironment {
  #world;
  #physicalSignals;
  #externalSignals;
  #bodySignals;
  constructor({ world, couplings }) {
    if (!world || typeof world.bodyStateAt !== 'function' ||
        typeof world.stateAt !== 'function' || typeof world.describe !== 'function') {
      throw new TypeError('Body world requires physical and internal state operations');
    }
    if (!Array.isArray(couplings)) throw new TypeError('Couplings must be an array');
    const ids = couplings.map(x => x?.channelId);
    if (ids.some(id => typeof id !== 'string' || !id.trim()) ||
        new Set(ids).size !== ids.length) {
      throw new RangeError('Coupling channel IDs must be distinct and nonempty');
    }
    const bodySpecs = [], externalSpecs = [];
    for (const coupling of couplings) {
      if (BODY_SIGNAL_TYPES.includes(coupling.type)) {
        const { gain = 1 } = coupling;
        if (!Number.isFinite(gain) || gain <= 0 || gain > 1000) {
          throw new RangeError('Body sensor gain must be finite and positive');
        }
        if (coupling.type !== 'joint-potentiometer' &&
            coupling.type !== 'temperature-voltage' && gain !== 1) {
          throw new RangeError('Direct capacitor/current sensors have no configurable gain');
        }
        const modality = coupling.type === 'joint-potentiometer'
          ? 'proprioceptive' : 'interoceptive';
        bodySpecs.push(Object.freeze({
          channelId: coupling.channelId,
          type: coupling.type, modality, gain,
          outputUnit: coupling.type === 'motor-current' ? 'A' : 'V',
        }));
      } else {
        externalSpecs.push(coupling);
      }
    }
    this.#world = world;
    this.#externalSignals = new WorldSignalEnvironment({
      world, couplings: externalSpecs,
    });
    this.#bodySignals = new Map(bodySpecs.map(x => [x.channelId, x]));
    this.#physicalSignals = Object.freeze([
      ...this.#externalSignals.specification().couplings,
      ...bodySpecs,
    ]);
  }

  readAt(channelId, timeMs) {
    const spec = this.#bodySignals.get(channelId);
    if (!spec) return this.#externalSignals.readAt(channelId, timeMs);
    // Every channel samples the same underlying body state at this time.
    // These are operational ideal measurement transductions, not labels.
    const body = this.#world.bodyStateAt(timeMs);
    if (spec.type === 'joint-potentiometer') {
      return spec.gain * body.jointExtensionM;
    }
    if (spec.type === 'capacitor-voltage') return body.capacitorVoltageV;
    if (spec.type === 'temperature-voltage') {
      return spec.gain * body.internalTemperatureK;
    }
    return body.motorCurrentA;
  }

  validateTransducers(sensors) {
    for (const sensor of sensors) {
      if (!this.#bodySignals.has(sensor.config.channelId)) {
        this.#externalSignals.validateTransducers([sensor]);
      }
      if (!this.#physicalSignals.some(x =>
        x.channelId === sensor.config.channelId)) {
        throw new RangeError('No physical coupling for sensor ' + sensor.config.id);
      }
    }
  }

  validateHorizon(endTimeMs) {
    this.#externalSignals.validateHorizon(endTimeMs);
    this.#world.bodyStateAt(endTimeMs);
  }

  researcherCheckpointStateAt(timeMs) {
    return structuredClone({
      world:this.#world.stateAt(timeMs),
      body:this.#world.bodyStateAt(timeMs),
      physicalEvents:this.#world.eventsThrough(timeMs),
    });
  }

  specification() {
    return {
      model: 'physically-coupled-body-sensors-v1',
      world: this.#world.describe(), // researcher-only, never passed to engine
      couplings: this.#physicalSignals.map(x => ({ ...x })),
      visibility: 'world and body physical truth researcher-only',
    };
  }
}