// P0.6 — Uninterpreted sensing of the tabletop world.
//   * retina: grid of downward light sensors (screen-covered cells see only
//     the screen: optical occlusion);
//   * tactile: grid of pressure cells under the table (NOT occluded);
//   * thermal: infrared sensors with Gaussian receptive fields, each read
//     through a BANK of thresholds (one binary channel per threshold);
//     IR from a disc whose centre is under the screen is blocked.
// Channel IDs are OPAQUE and shuffled by a declared seed, so channel order
// and names reveal nothing about geometry or modality. The id -> geometry
// map is researcher-only (specification()).
import { makeRng } from '../../vendor/tempo/core/rng.js';

const SUB = 4; // 4x4 sub-sample points per cell for area coverage
const G = 9.81;

function opaqueIds(n, seed) {
  const rng = makeRng(seed), used = new Set(), ids = [];
  while (ids.length < n) {
    const id = 'k' + Math.floor(rng.random() * 0xffffff).toString(16).padStart(6, '0');
    if (!used.has(id)) { used.add(id); ids.push(id); }
  }
  return ids;
}

export class TabletopSensorEnvironment {
  #world; #geo; #channels = new Map();
  constructor({ world, retina = { cols: 10, rows: 6 }, tactile = { cols: 5, rows: 3 },
    thermal = { sensors: [{ x: 0.2, y: 0.3 }, { x: 0.5, y: 0.3 }, { x: 0.8, y: 0.3 }], sigmaM: 0.15,
      thresholdsK: [2, 6, 12], roomC: 20 },
    tableReflectance = 0.5, screenReflectance = 0.1, idSeed = 0, modalities = ['optical', 'tactile', 'thermal'] }) {
    this.#world = world;
    const d = world.describe();
    this.#geo = { W: d.widthM, D: d.depthM, screen: d.screen, tableReflectance, screenReflectance, thermal };
    const specs = [];
    if (modalities.includes('optical')) for (let r = 0; r < retina.rows; r++) for (let c = 0; c < retina.cols; c++) {
      specs.push({ type: 'retina', modality: 'optical', x0: (c * d.widthM) / retina.cols, x1: ((c + 1) * d.widthM) / retina.cols,
        y0: (r * d.depthM) / retina.rows, y1: ((r + 1) * d.depthM) / retina.rows, col: c, row: r });
    }
    if (modalities.includes('tactile')) for (let r = 0; r < tactile.rows; r++) for (let c = 0; c < tactile.cols; c++) {
      specs.push({ type: 'tactile', modality: 'tactile', x0: (c * d.widthM) / tactile.cols, x1: ((c + 1) * d.widthM) / tactile.cols,
        y0: (r * d.depthM) / tactile.rows, y1: ((r + 1) * d.depthM) / tactile.rows, col: c, row: r });
    }
    if (modalities.includes('thermal')) thermal.sensors.forEach((s, i) => thermal.thresholdsK.forEach(th =>
      specs.push({ type: 'thermal-threshold', modality: 'thermal', sensor: i, x: s.x, y: s.y, thresholdK: th })));
    const ids = opaqueIds(specs.length, idSeed);
    const order = specs.map((_, i) => i);
    const rng = makeRng(idSeed + 1);
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rng.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    order.forEach((specIndex, k) => this.#channels.set(ids[k], Object.freeze({ channelId: ids[k], ...specs[specIndex] })));
  }
  channelIds() { return [...this.#channels.keys()]; }

  #coverage(cell, disc) {        // fraction of the cell's sample points inside the disc
    let inside = 0;
    for (let i = 0; i < SUB; i++) for (let j = 0; j < SUB; j++) {
      const x = cell.x0 + ((i + 0.5) * (cell.x1 - cell.x0)) / SUB, y = cell.y0 + ((j + 0.5) * (cell.y1 - cell.y0)) / SUB;
      if ((x - disc.x) ** 2 + (y - disc.y) ** 2 <= disc.radiusM ** 2) inside++;
    }
    return inside / (SUB * SUB);
  }
  readAt(channelId, timeMs) {
    const c = this.#channels.get(channelId);
    if (!c) throw new RangeError('Unknown channel');
    const s = this.#world.stateAt(timeMs), g = this.#geo;
    if (c.type === 'retina') {
      let sum = 0;
      for (let i = 0; i < SUB; i++) for (let j = 0; j < SUB; j++) {
        const x = c.x0 + ((i + 0.5) * (c.x1 - c.x0)) / SUB, y = c.y0 + ((j + 0.5) * (c.y1 - c.y0)) / SUB;
        if (g.screen && x >= g.screen.x0 && x <= g.screen.x1) { sum += g.screenReflectance; continue; }
        const d = s.discs.find(d => (x - d.x) ** 2 + (y - d.y) ** 2 <= d.radiusM ** 2);
        sum += d ? d.reflectance : g.tableReflectance;
      }
      return sum / (SUB * SUB);
    }
    if (c.type === 'tactile') {
      const cellArea = (c.x1 - c.x0) * (c.y1 - c.y0);
      return s.discs.reduce((p, d) => p + (d.massKg * G * this.#coverage(c, d) * cellArea) / (Math.PI * d.radiusM ** 2), 0);
    }
    // thermal threshold channel: 1 if the IR excess at the sensor exceeds the threshold
    const t = g.thermal;
    const excess = s.discs.reduce((acc, d) => {
      if (g.screen && d.x >= g.screen.x0 && d.x <= g.screen.x1) return acc; // IR blocked by the screen
      return acc + (d.temperatureC - t.roomC) * Math.exp(-((d.x - c.x) ** 2 + (d.y - c.y) ** 2) / (2 * t.sigmaM ** 2));
    }, 0);
    return excess > c.thresholdK ? 1 : 0;
  }
  validateTransducers(sensors) {
    for (const s of sensors) if (!this.#channels.has(s.config.channelId)) throw new RangeError('Sensor without coupling');
  }
  validateHorizon(t) { this.#world.stateAt(t); }
  researcherCheckpointStateAt(t) { return structuredClone({ world: this.#world.stateAt(t), physicalEvents: this.#world.eventsThrough(t) }); }
  specification() {
    return { model: 'tabletop-uninterpreted-sensing-v1', world: this.#world.describe(),
      channels: [...this.#channels.values()].map(c => ({ ...c })), // researcher-only geometry
      semantics: 'opaque shuffled channel IDs; geometry and modality are not delivered to the engine' };
  }
}
