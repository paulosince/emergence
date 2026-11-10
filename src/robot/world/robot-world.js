// Robot + room + sky in one simulation (step 2). Researcher-side system S.
// Events of the environment that are not physics: the cheese pushed under the
// door at dusk (decision 10/11/2026) and the light schedule. The mouse comes
// in a later step.
import { RobotSimulation } from '../body/simulation.js';
import { buildRoomMJCF, ROOM_DEFAULTS } from './room.js';
import { Sky } from './sky.js';

export class RobotWorld {
  #room; #lastCheeseDay = -1; #events = [];
  static async create({ room = ROOM_DEFAULTS, sky = {}, ...simOptions } = {}) {
    const built = buildRoomMJCF(room);
    const sim = await RobotSimulation.create({ ...simOptions, extraWorld: built.xml });
    return new RobotWorld(sim, new Sky(sky), room, built);
  }
  constructor(sim, sky, room, built) { this.sim = sim; this.sky = sky; this.#room = room; this.objects = built.objects; }
  get roomConfig() { return this.#room; }
  get time() { return this.sim.time; }
  #bodyQ(name) { const { mj, model: m } = this.sim; const j = mj.mj_name2id(m, mj.mjtObj.mjOBJ_JOINT.value, name); return { q: m.jnt_qposadr[j], v: m.jnt_dofadr[j] }; }
  bodyPosition(name) { const { mj, model: m, data: d } = this.sim, b = mj.mj_name2id(m, mj.mjtObj.mjOBJ_BODY.value, name); return [0, 1, 2].map(k => d.xpos[3 * b + k]); }
  #pushCheese() { // someone outside pushes a piece of cheese through the gap under the door
    const R = this.#room, { q, v } = this.#bodyQ('cheese'), d = this.sim.data;
    const pos = [R.door.along, R.widthEW / 2 + R.wall + 0.02, R.cheese.size[2] / 2 + 0.0005];
    pos.forEach((x, k) => { d.qpos[q + k] = x; }); [1, 0, 0, 0].forEach((x, k) => { d.qpos[q + 3 + k] = x; });
    [0, -2.0, 0, 0, 0, 0].forEach((x, k) => { d.qvel[v + k] = x; });
    this.#events.push({ type: 'cheese.pushed', timeS: this.time });
  }
  step(n = 1) {
    for (let i = 0; i < n; i++) {
      this.sim.step();
      if (i % 50 === 0) { const c = this.sky.clock(this.time); if (c.dayIndex !== this.#lastCheeseDay && this.sky.dusk(this.time)) { this.#lastCheeseDay = c.dayIndex; this.#pushCheese(); } }
    }
  }
  drainEvents() { return this.#events.splice(0); }
  dispose() { this.sim.dispose(); }
}
