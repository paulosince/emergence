import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RobotSimulation } from '../src/robot/body/simulation.js';

const floorContactOtherThanWheels = (sim, allowCasters = false) => {
  const { mj, model: m, data: d } = sim, con = d.contact; // the contact vector is a copy: free it
  let found = false;
  for (let c = 0; c < d.ncon && !found; c++) {
    const k = con.get(c), b1 = m.geom_bodyid[k.geom1], b2 = m.geom_bodyid[k.geom2]; k.delete?.();
    if (b1 !== 0 && b2 !== 0) continue;
    const n = mj.mj_id2name(m, 1, b1 === 0 ? b2 : b1);
    found = !(n.startsWith('wheel') || (allowCasters && n.startsWith('caster')));
  }
  con.delete?.();
  return found;
};

test('robot model: 27 actuators, whole-body skin, IMU, joint and tendon sensors', async () => {
  const sim = await RobotSimulation.create();
  assert.equal(sim.built.nActuators, 27);
  const regions = new Set(sim.built.taxels.map(t => t.region.replace(/-[LR]\d?$/, '')));
  for (const r of ['trunk-front', 'trunk-back', 'trunk-left', 'trunk-right', 'trunk-top', 'head-front', 'upper-arm', 'forearm', 'palm', 'fingertip', 'finger']) assert.ok(regions.has(r), r);
  for (const n of ['imu_acc', 'imu_gyro', 'finger_R1_tension', 'finger_L3_tendon', 'eye_L_yaw_pos', 'neck_roll_vel']) assert.ok(sim.sensorNames().includes(n), n);
  sim.dispose();
});

test('R1 is only a reflex: it slows a fall but does not hold the posture', async () => {
  const fall = async off => { const sim = await RobotSimulation.create({ casters: false }); if (off) sim.setR1(false); let t = null;
    for (let i = 0; i < 5000 && t === null; i++) { sim.step(); if (i % 10 === 0 && floorContactOtherThanWheels(sim)) t = sim.time; } sim.dispose(); return t; };
  const withReflex = await fall(false), without = await fall(true);
  assert.ok(withReflex !== null, 'falls even with the reflex');
  assert.ok(without !== null && withReflex > without, `reflex slows the fall (${withReflex} s vs ${without} s)`);
});

test('engineering control only: the postural controller (never used in experiments) keeps the body up on two wheels', async () => {
  const sim = await RobotSimulation.create({ casters: false, r1: { mode: 'postural' } });
  for (let i = 0; i < 4000; i++) { sim.step(); if (i === 1500) sim.push(3, 25); if (i % 20 === 0) assert.ok(!floorContactOtherThanWheels(sim)); }
  sim.dispose();
});

test('training casters: without learned balance the body ends up resting on the front or back caster', async () => {
  const sim = await RobotSimulation.create();
  sim.step(5000);
  assert.ok(Math.abs(Math.abs(sim.tilt()) - 0.15) < 0.02, 'rests at the caster tilt: ' + sim.tilt().toFixed(3));
  assert.ok(!floorContactOtherThanWheels(sim, true), 'only wheels and casters touch the floor');
  sim.dispose();
});

test('training casters barely touch the floor while the trunk is near upright (engineering controller)', async () => {
  const sim = await RobotSimulation.create({ r1: { mode: 'postural' } });
  sim.step(2000);
  let touching = 0, samples = 0;
  for (let i = 0; i < 3000; i++) { sim.step(); if (i % 20 === 0) { samples++; if (floorContactOtherThanWheels(sim)) touching++; } }
  assert.ok(touching / samples < 0.1, `casters touched in ${touching} of ${samples} samples`);
  sim.dispose();
});

// T13 self-touch (postures found by contact-aware sampling, 10/11/2026); both skins must register the contact
const J = ['shoulder_flex', 'shoulder_abd', 'shoulder_rot', 'elbow', 'wrist_flex', 'wrist_dev'];
async function selfTouch(targets, bodyPattern, handPattern) {
  const sim = await RobotSimulation.create(), names = sim.sensorNames();
  let hit = false;
  for (let i = 0; i < 3000 && !hit; i++) {
    const a = Math.min(1, i / 1500);
    for (const [s, q] of Object.entries(targets)) J.forEach((j, k) => sim.setCtrl(j + '_' + s, (j === 'elbow' ? -Math.PI / 2 : 0) * (1 - a) + q[k] * a));
    sim.step();
    if (i % 10 === 0) hit = names.some(n => bodyPattern.test(n) && sim.sensor(n) > 0) && names.some(n => handPattern.test(n) && sim.sensor(n) > 0);
  }
  sim.dispose(); return hit;
}
test('T13 self-touch: right hand on the trunk front', async () => {
  assert.ok(await selfTouch({ R: [0.82, -0.87, 0.32, -2.46, 0.55, 0.22] }, /^skin_trunk/, /^skin_(finger|palm)_R/));
});
test('T13 self-touch: right hand on the head', async () => {
  assert.ok(await selfTouch({ R: [-2.59, 0.04, 0.64, -1.79, 0.47, -0.32] }, /^skin_head/, /^skin_(finger|palm)_R/));
});
test('T13 self-touch: the two hands touch each other', async () => {
  assert.ok(await selfTouch({ R: [-2.82, -0.2, 1.42, -2.15, -0.1, -0.54], L: [-2.82, 0.2, -1.42, -2.15, -0.1, 0.54] }, /^skin_(finger|palm)_L/, /^skin_(finger|palm)_R/));
});

test('determinism: two identical runs give identical sensor readings', async () => {
  const run = async () => { const sim = await RobotSimulation.create(); sim.step(1000); sim.push(2, 10); sim.step(500); const v = Array.from(sim.data.sensordata); sim.dispose(); return v; };
  assert.deepEqual(await run(), await run());
});
