// Explicit CONTROL ONLY: sensor IDs are pre-mapped to existing TEMPO node indices.
// A successful run is NOT evidence for autonomous node constitution.
import { Net } from '../../vendor/tempo/core/net.js';
import { makeRng } from '../../vendor/tempo/core/rng.js';
import { TEMPO_SOURCE_COMMIT } from '../tempo/reference-runner.js';

export class TempoFixedNodesControl {
  #net;
  #mapping;
  #settings;
  #fireCursor = 0;
  #timeMs = 0;

  constructor({ nodeCount, transducerNodes, seed = 0, K = 4, mode = 'shift', eta = 0.2 }) {
    if (!Number.isInteger(nodeCount) || nodeCount < 2) {
      throw new RangeError('nodeCount must be at least 2');
    }
    if (!transducerNodes || typeof transducerNodes !== 'object') {
      throw new TypeError('Explicit transducerNodes mapping is required');
    }
    if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff ||
        !Number.isInteger(K) || K < 1 ||
        !['shift', 'select', 'fixed'].includes(mode) ||
        !Number.isFinite(eta) || eta <= 0) {
      throw new RangeError('Invalid TEMPO control parameters');
    }
    this.#settings = Object.freeze({ nodeCount, seed, K, mode, eta });
    this.#mapping = { ...transducerNodes };
    for (const [id, node] of Object.entries(this.#mapping)) {
      if (!id || !Number.isInteger(node) || node < 0 || node >= nodeCount) {
        throw new RangeError('Invalid fixed-node mapping');
      }
    }
    this.#net = new Net(nodeCount, K, mode, eta, makeRng(seed));
  }

  describe() {
    return {
      id: 'tempo-fixed-nodes-control',
      ...this.#settings,
      pinnedSourceCommit: TEMPO_SOURCE_COMMIT,
      nodesArePredefined: true,
      measurementsIgnored: true,
      transducerNodes: { ...this.#mapping },
    };
  }
  ingest(incidence) {
    if (!Object.hasOwn(this.#mapping, incidence.transducerId)) {
      throw new RangeError('No fixed-node mapping for ' + incidence.transducerId);
    }
    const t = incidence.arrivedAtMs ?? incidence.observedAtMs;
    if (t < this.#timeMs) throw new RangeError('Late incidence received');
    // Reference forced activation: magnitude is intentionally ignored.
    this.#net.push(t, 'f', this.#mapping[incidence.transducerId]);
  }
  advanceTo(timeMs) {
    if (!Number.isFinite(timeMs) || timeMs < this.#timeMs) {
      throw new RangeError('Engine time reversal');
    }
    this.#net.runUntil(timeMs);
    this.#timeMs = timeMs;
  }
  drainEvents() {
    const entries = this.#net.fires.slice(this.#fireCursor);
    this.#fireCursor += entries.length;
    return entries.map(([timeMs, node]) => ({ type: 'node.fired', timeMs, node }));
  }
  snapshot() {
    return {
      timeMs: this.#timeMs, nodeCount: this.#net.N,
      relations: this.#net.links().map(l => ({
        source: l.i, target: l.j, weight: l.w,
        delaySourceMs: l.ta, delayTargetMs: l.td, traversalMs: l.ta + l.td,
      })),
    };
  }
}