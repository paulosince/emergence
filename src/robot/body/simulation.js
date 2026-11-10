// Simulated robot body (MuJoCo, @mujoco/mujoco). Researcher-side physical
// system S: physics, the balance reflex R1 (firmware-like, inside S) and
// access by name. Nothing here is delivered to the domain directly; the
// transduction layer (later step) reads sensors and produces incidences.
import loadMujoco from '@mujoco/mujoco';
import { buildRobotMJCF, ROBOT_PARAMS } from './robot-model.js';
import { makeRng } from '../../../vendor/tempo/core/rng.js';

let MJ = null;
export async function mujoco() { return MJ ??= await loadMujoco(); }

// Balance reflex R1. Decision of the researcher (10/11/2026): "the reflex has to
// be only a reflex, not a support of the upright posture; the robot is the one
// that has to learn to sustain itself". Default mode 'phasic': a brief wheel
// torque opposing the trunk's angular velocity when it exceeds a threshold
// (vestibular-like righting response); it slows a fall but cannot hold the
// posture. Mode 'postural' (full tilt/speed/travel controller, grid search
// 10/11/2026) is kept ONLY as an engineering control, never in experiments.
export const R1_DEFAULTS = Object.freeze({ mode: 'phasic', kPhasic: 0.6, thresholdRadS: 0.3,
  kTilt: 12, kRate: 3, kSpeed: 0.6, kTravel: 0.3 }); // postural gains (engineering only): grid search without casters, 20 s with a 3 N push, 15 of 192 combinations stable

export class RobotSimulation {
  #mj; #m; #d; #id = {}; #sens = {}; #act = {}; #jnt = {}; #r1; #travel0 = null; #trunkId; #noise = null;
  // disturbance: small random horizontal force on the trunk (Ornstein-Uhlenbeck, seeded), standing for
  // the irregularities of any real floor and body; without it an unstable equilibrium is never left.
  static async create({ params = ROBOT_PARAMS, r1 = R1_DEFAULTS, extraWorld = '', casters = true, disturbance = { stdN: 0.05, tauS: 0.2 }, seed = 1 } = {}) {
    const mj = await mujoco();
    const sim = new RobotSimulation(mj, buildRobotMJCF(params, { extraWorld, casters }), { ...R1_DEFAULTS, ...r1 });
    sim.#noise = disturbance && disturbance.stdN > 0 ? { ...disturbance, rng: makeRng(seed), f: [0, 0] } : null;
    return sim;
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
  tilt() { const b = this.#trunkId ??= this.#mj.mj_name2id(this.#m, this.#mj.mjtObj.mjOBJ_BODY.value, 'trunk'), q = this.#d.xquat, w = q[4 * b], x = q[4 * b + 1], y = q[4 * b + 2], z = q[4 * b + 3]; return Math.asin(Math.max(-1, Math.min(1, 2 * (w * y - z * x)))); }
  #reflex() {
    const k = this.#r1; if (!k.enabled) return;
    const rate = this.sensor('imu_gyro')[1];
    if (k.mode === 'phasic') {
      const u = Math.abs(rate) > k.thresholdRadS ? k.kPhasic * rate : 0;
      this.lastR1 = u; this.setCtrl('wheel_L', u); this.setCtrl('wheel_R', u); return;
    }
    const speed = (this.sensor('wheel_L_vel') + this.sensor('wheel_R_vel')) / 2;
    const travel = (this.sensor('wheel_L_pos') + this.sensor('wheel_R_pos')) / 2;
    this.#travel0 ??= travel;
    const u = k.kTilt * this.tilt() + k.kRate * rate + k.kSpeed * speed + k.kTravel * (travel - this.#travel0);
    this.lastR1 = u;
    this.setCtrl('wheel_L', u); this.setCtrl('wheel_R', u);
  }
  #disturb() {
    const z = this.#noise; if (!z) return;
    const b = this.#trunkId ??= this.#mj.mj_name2id(this.#m, this.#mj.mjtObj.mjOBJ_BODY.value, 'trunk');
    const dt = this.#m.opt.timestep, a = Math.exp(-dt / z.tauS), sd = z.stdN * Math.sqrt(1 - a * a);
    for (let k = 0; k < 2; k++) { z.f[k] = a * z.f[k] + sd * z.rng.normal(); this.#d.xfrc_applied[6 * b + k] = z.f[k]; }
  }
  step(n = 1) { for (let i = 0; i < n; i++) { this.#reflex(); this.#disturb(); this.#mj.mj_step(this.#m, this.#d); } }
  push(fx, steps = 25) { // external horizontal push on the trunk (researcher perturbation)
    const b = this.#mj.mj_name2id(this.#m, this.#mj.mjtObj.mjOBJ_BODY.value, 'trunk');
    for (let i = 0; i < steps; i++) { this.#d.xfrc_applied[6 * b] = fx; this.step(); }
    this.#d.xfrc_applied[6 * b] = 0;
  }
  dispose() { this.#d.delete(); this.#m.delete(); }
}
