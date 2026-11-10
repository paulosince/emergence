// Camera images by ray casting in the MuJoCo scene (research tool inside S; the
// domain never receives an image, only the transduced incidences built on top).
// Per pixel: one ray from the camera; colour of the hit geom times the light at
// the hit point. Light (declared simplifications, no source): outdoors, sky light
// plus direct sun or moon by the surface orientation; indoors, a daylight factor
// times the outdoor light, the lamp when on, and direct sun only where a shadow
// ray toward the sun leaves the room through the window. No interreflections,
// no soft shadows, no specularity, no lens effects (declared losses).
const SKY_DAY = [0.45, 0.62, 0.95], SKY_NIGHT = [0.05, 0.06, 0.1];

export const VISION_DEFAULTS = Object.freeze({ width: 160, height: 120, fovyDeg: 60, daylightFactor: 0.04, glassTransmittance: 0.7, ambient: 0.35, maxRange: 30 });

export class EyeCamera {
  #w; #c; #cam; #body; #gid; #dist; #nrm; #sgid; #sdist; #snrm; #group = [1, 1, 1, 0, 1, 1];
  constructor(world, cameraName, config = {}) {
    this.#w = world; this.#c = { ...VISION_DEFAULTS, ...config };
    const { mj, model: m } = world.sim, n = this.#c.width * this.#c.height;
    this.#cam = mj.mj_name2id(m, mj.mjtObj.mjOBJ_CAMERA.value, cameraName);
    if (this.#cam < 0) throw new RangeError('unknown camera ' + cameraName);
    this.#body = m.cam_bodyid[this.#cam];
    this.#gid = new mj.IntBuffer(n); this.#dist = new mj.DoubleBuffer(n); this.#nrm = new mj.DoubleBuffer(3 * n);
    this.#sgid = new mj.IntBuffer(n); this.#sdist = new mj.DoubleBuffer(n); this.#snrm = new mj.DoubleBuffer(3 * n);
  }
  get width() { return this.#c.width; } get height() { return this.#c.height; }
  #directions() {
    const { data: d } = this.#w.sim, c = this.#c, W = c.width, H = c.height, th = Math.tan(c.fovyDeg * Math.PI / 360);
    const R = Array.from({ length: 9 }, (_, k) => d.cam_xmat[9 * this.#cam + k]), v = new Array(3 * W * H);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const x = ((i + 0.5) / W * 2 - 1) * th * W / H, y = (1 - (j + 0.5) / H * 2) * th, z = -1;
      const a = R[0] * x + R[1] * y + R[2] * z, b = R[3] * x + R[4] * y + R[5] * z, e = R[6] * x + R[7] * y + R[8] * z, n = Math.hypot(a, b, e), k = 3 * (j * W + i);
      v[k] = a / n; v[k + 1] = b / n; v[k + 2] = e / n;
    }
    return v;
  }
  // returns { rgb: Float32Array (linear radiance, arbitrary units), geom: Int32Array }
  render() {
    const { mj, model: m, data: d } = this.#w.sim, c = this.#c, N = c.width * c.height, sky = this.#w.sky.state(this.#w.time);
    const pos = [0, 1, 2].map(k => d.cam_xpos[3 * this.#cam + k]), dirs = this.#directions();
    mj.mj_multiRay(m, d, pos, dirs, this.#group, 1, this.#body, this.#gid, this.#dist, this.#nrm, N, c.maxRange);
    const g = this.#gid.GetView(), dist = this.#dist.GetView(), nrm = this.#nrm.GetView();
    const room = this.#w.roomConfig, inside = p => Math.abs(p[0]) < room.lengthNS / 2 + room.wall && Math.abs(p[1]) < room.widthEW / 2 + room.wall && p[2] < room.height;
    const sun = sky.sun, sunDir = [sun.north, -sun.east, sun.up], moon = sky.moon, moonDir = [moon.north, -moon.east, moon.up];
    const out = sky.outdoorLux, sunLux = Math.max(0, sun.up) * 110000, moonLux = Math.max(0, moon.up) * moon.illuminatedFraction * 0.25;
    const indoorDiffuse = out * c.daylightFactor + (sky.lampOn ? 300 : 0);
    const rgb = new Float32Array(3 * N), geom = Int32Array.from(g);
    // shadow rays toward the sun for indoor hits (direct sun patches through the window)
    const lit = new Uint8Array(N);
    if (sun.up > 0) {
      const hitsIn = [];
      for (let p = 0; p < N; p++) if (g[p] >= 0) { const q = [0, 1, 2].map(k => pos[k] + dirs[3 * p + k] * dist[p]); if (inside(q)) hitsIn.push(p); }
      for (const p of hitsIn) {
        const q = [0, 1, 2].map(k => pos[k] + dirs[3 * p + k] * dist[p] + nrm[3 * p + k] * 1e-4);
        const r = mj.mj_ray(m, d, q, sunDir, this.#group, 1, -1, this.#sgid, null);
        lit[p] = r < 0 ? 1 : 0;
      }
    }
    for (let p = 0; p < N; p++) {
      let col, E;
      if (g[p] < 0) { // sky
        const day = Math.min(1, out / 10000); col = SKY_DAY.map((s, k) => s * day + SKY_NIGHT[k] * (1 - day)); E = out > 1 ? out * 0.3 : 0.05 + moonLux;
      } else {
        col = [0, 1, 2].map(k => m.geom_rgba[4 * g[p] + k]);
        const q = [0, 1, 2].map(k => pos[k] + dirs[3 * p + k] * dist[p]), n = [nrm[3 * p], nrm[3 * p + 1], nrm[3 * p + 2]];
        const dot = v => Math.max(0, n[0] * v[0] + n[1] * v[1] + n[2] * v[2]);
        if (!inside(q)) E = out * c.ambient + sunLux * dot(sunDir) + moonLux * dot(moonDir);
        else E = indoorDiffuse * (c.ambient + (1 - c.ambient) * Math.max(0, n[2])) + (lit[p] ? sunLux * c.glassTransmittance * dot(sunDir) : 0);
      }
      for (let k = 0; k < 3; k++) rgb[3 * p + k] = col[k] * E;
    }
    return { rgb, geom, width: c.width, height: c.height };
  }
  dispose() { for (const b of [this.#gid, this.#dist, this.#nrm, this.#sgid, this.#sdist, this.#snrm]) b.delete(); }
}
