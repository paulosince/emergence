import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RobotSimulation } from '../src/robot/body/simulation.js';

const floorContactOtherThanWheels = sim => {
  const { mj, model: m, data: d } = sim;
  for (let c = 0; c < d.ncon; c++) {
    const k = d.contact.get(c), b1 = m.geom_bodyid[k.geom1], b2 = m.geom_bodyid[k.geom2];
    if (b1 !== 0 && b2 !== 0) continue;
    if (!mj.mj_id2name(m, 1, b1 === 0 ? b2 : b1).startsWith('wheel')) return true;
  }
  return false;
};

test('robot model: 27 actuators, whole-body skin, IMU, joint and tendon sensors', async () => {
  const sim = await RobotSimulation.create();
  assert.equal(sim.built.nActuators, 27);
  const regions = new Set(sim.built.taxels.map(t => t.region.replace(/-[LR]\d?$/, '')));
  for (const r of ['trunk-front', 'trunk-back', 'trunk-left', 'trunk-right', 'trunk-top', 'head-front', 'upper-arm', 'forearm', 'palm', 'fingertip', 'finger']) assert.ok(regions.has(r), r);
  for (const n of ['imu_acc', 'imu_gyro', 'finger_R1_tension', 'finger_L3_tendon', 'eye_L_yaw_pos', 'neck_roll_vel']) assert.ok(sim.sensorNames().includes(n), n);
  sim.dispose();
});

test('balance reflex R1: stands on two wheels only and recovers from a push', async () => {
  const sim = await RobotSimulation.create();
  for (let i = 0; i < 4000; i++) {
    sim.step(); if (i === 1500) sim.push(3, 25);
    if (i % 20 === 0) assert.ok(!floorContactOtherThanWheels(sim), 'only the wheels touch the floor at t=' + sim.time.toFixed(2));
  }
  assert.ok(Math.abs(sim.tilt()) < 0.2);
  sim.dispose();
});

test('without R1 the body falls (control: the reflex is what keeps it up)', async () => {
  const sim = await RobotSimulation.create(); sim.setR1(false);
  let touched = false;
  for (let i = 0; i < 2500 && !touched; i++) { sim.step(); if (i % 20 === 0) touched = floorContactOtherThanWheels(sim); }
  assert.ok(touched);
  sim.dispose();
});

test('T13 self-touch: the right hand touches the trunk front while balancing; both skins register the contact', async () => {
  const sim = await RobotSimulation.create(), names = sim.sensorNames();
  const q = [0.82, -0.87, 0.32, -2.46, 0.55, 0.22], J = ['shoulder_flex', 'shoulder_abd', 'shoulder_rot', 'elbow', 'wrist_flex', 'wrist_dev'];
  sim.step(500);
  let both = false;
  for (let i = 0; i < 2000 && !both; i++) {
    const a = Math.min(1, i / 1000); J.forEach((j, k) => sim.setCtrl(j + '_R', (j === 'elbow' ? -Math.PI / 2 : 0) * (1 - a) + q[k] * a));
    sim.step();
    if (i % 10 === 0) both = names.some(n => n.startsWith('skin_trunk') && sim.sensor(n) > 0) && names.some(n => /^skin_(finger|palm)_R/.test(n) && sim.sensor(n) > 0);
    assert.ok(Math.abs(sim.tilt()) < 0.6, 'did not fall');
  }
  assert.ok(both);
  sim.dispose();
});

test('determinism: two identical runs give identical sensor readings', async () => {
  const run = async () => { const sim = await RobotSimulation.create(); sim.step(1000); sim.push(2, 10); sim.step(500); const v = Array.from(sim.data.sensordata); sim.dispose(); return v; };
  assert.deepEqual(await run(), await run());
});
