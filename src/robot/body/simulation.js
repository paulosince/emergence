// Simulated robot body (MuJoCo, @mujoco/mujoco). Researcher-side physical
// system S: physics, the balance reflex R1 (firmware-like, inside S) and
// access by name. Nothing here is delivered to the domain directly; the
// transduction layer (later step) reads sensors and produces incidences.
import loadMujoco from '@mujoco/mujoco';
import { buildRobotMJCF, ROBOT_PARAMS } from './robot-model.js';

let MJ = null;
export async function mujoco() { return MJ ??= await loadMujoco(); }

// Balance reflex R1 (docs/robot-spec-v1.md): inputs computed inside S (tilt,
// tilt rate, wheel speed and travel); output = common wheel torque. Gains are
// declared and tuned on the model, not taken from a source.
export const R1_DEFAULTS = Object.freeze({ kTilt: 12, kRate: 3, kSpeed: 0.8, kTravel: 0.3 }); // grid search 10/11/2026 (60 s, 3 N push for 50 ms): only wheels touch the floor, largest displacement 0.23 m; only 1 of 72 combinations passed: fragile, to calibrate

export class RobotSimulation {
  #mj; #m; #d; #id = {}; #sens = {}; #act = {}; #jnt = {}; #r1; #travel0 = null;
  static async create({ params = ROBOT_PARAMS, r1 = R1_DEFAULTS, extraWorld = '' } = {}) {
    const mj = await mujoco();
    return new RobotSimulation(mj, buildRobotMJCF(params, { extraWorld }), r1);
  }
  constructor(mj, built, r1) {
    this.#mj = mj; this.built = built; this.#r1 = { ...r1, enabled: true };
    this.#m = mj.MjModel.from_xml_string(built.xml); this.#d = new mj.MjData(this.#m);
    const m = this.#m, O = mj.mjtObj;
    for (let i = 0; i < m.nsensor; i++) { const name = mj.mj_id2name(m, O.mjOBJ_SENSOR.value, i); this.#sens[name] = { adr: m.sensor_adr[i], dim: m.sensor_dim[i] }; }
    for (let i = 0; i < m.nu; i++) this.#act[mj.mj_id2name(m, O.mjOBJ_ACTUATOR.value, i)] = i;
    for (let i = 0; i < m.njnt; i++) this.#jnt[mj.mj_id2name(m, O.mjOBJ_JOINT.value, i)] = { qadr: m.jnt_qposadr[i], dadr: m.jnt_dofadr[i] };
    // initial posture: elbows bent so the hands stay above the floor
    for (const s of ['L', 'R']) { this.setJoint('elbow_' + s, -Math.PI / 2); this.setCtrl('elbow_' + s, -Math.PI / 2); }
    mj.mj_forward(this.#m, this.#d);
  }
  get model() { return this.#m; } get data() { return this.#d; } get mj() { return this.#mj; }
  get time() { return this.#d.time; }
  sensor(name) { const s = this.#sens[name]; if (!s) throw new RangeError('unknown sensor ' + name); const v = this.#d.sensordata; return s.dim === 1 ? v[s.adr] : Array.from({ length: s.dim }, (_, k) => v[s.adr + k]); }
  sensorNames() { return Object.keys(this.#sens); }
  actuatorNames() { return Object.keys(this.#act); }
  setCtrl(name, value) { const i = this.#act[name]; if (i === undefined) throw new RangeError('unknown actuator ' + name); this.#d.ctrl[i] = value; }
  setJoint(name, value) { this.#d.qpos[this.#jnt[name].qadr] = value; }
  joint(name) { return this.#d.qpos[this.#jnt[name].qadr]; }
  setR1(enabled) { this.#r1.enabled = enabled; }
  // trunk pitch (rotation about y, positive = top forward) from the trunk quaternion (diagnostic, inside S)
  tilt() { const [w, x, y, z] = this.sensor('trunk_quat_diagnostic'); return Math.asin(Math.max(-1, Math.min(1, 2 * (w * y - z * x)))); }
  #reflex() {
    const k = this.#r1; if (!k.enabled) return;
    const rate = this.sensor('imu_gyro')[1];
    const speed = (this.sensor('wheel_L_vel') + this.sensor('wheel_R_vel')) / 2;
    const travel = (this.sensor('wheel_L_pos') + this.sensor('wheel_R_pos')) / 2;
    this.#travel0 ??= travel;
    const u = k.kTilt * this.tilt() + k.kRate * rate + k.kSpeed * speed + k.kTravel * (travel - this.#travel0);
    this.lastR1 = u;
    this.setCtrl('wheel_L', u); this.setCtrl('wheel_R', u);
  }
  step(n = 1) { for (let i = 0; i < n; i++) { this.#reflex(); this.#mj.mj_step(this.#m, this.#d); } }
  push(fx, steps = 25) { // external horizontal push on the trunk (researcher perturbation)
    const b = this.#mj.mj_name2id(this.#m, this.#mj.mjtObj.mjOBJ_BODY.value, 'trunk');
    for (let i = 0; i < steps; i++) { this.#d.xfrc_applied[6 * b] = fx; this.step(); }
    this.#d.xfrc_applied[6 * b] = 0;
  }
  dispose() { this.#d.delete(); this.#m.delete(); }
}
