// Robot body for the simulation (docs/robot-spec-v1.md, approved 10/11/2026).
// Builds the MuJoCo MJCF of the robot: 40 cm tall, 25 cm cubic trunk, two
// 15 x 5 cm wheels (no permanent support), arms with 3-axis shoulder, elbow and
// 2-axis wrist, 3 two-phalanx fingers per hand driven by one tendon each,
// neck with yaw/pitch/roll, two eyes with yaw/pitch and a camera each, two
// microphone sites, an IMU site and touch taxels over the whole body.
// Frame: x forward, y left, z up; SI units. Masses and actuator strengths are
// declared values (no source), to be calibrated.
// Names here are for the researcher only; the domain receives opaque ids.

export const ROBOT_PARAMS = Object.freeze({
  trunkHalf: 0.125, clearance: 0.025, wheelX: 0.025, // axle under the centre of mass of the neutral posture (arms forward)
  wheelRadius: 0.075, wheelHalfWidth: 0.025, wheelGap: 0.005,
  trunkMass: 1.2, wheelMass: 0.12, neckMass: 0.05, headMass: 0.2, eyeMass: 0.015,
  upperArmMass: 0.07, forearmMass: 0.05, handMass: 0.04, phalanxMass: 0.004,
  shoulder: [0.08, 0.145, 0.10], upperArm: 0.12, forearm: 0.12, hand: 0.05, phalanx: 0.012,
  armRadius: 0.012, fingerRadius: 0.004,
  wheelTorque: 1.5, armKp: 4, neckKp: 2, eyeKp: 0.3, fingerKp: 3,
  taxel: { trunk: 0.025, head: 0.025, arm: 0.02, palm: 0.008, fingertip: 0.003 },
  timestep: 0.002,
});

const f = v => +v.toFixed(5);
const v3 = a => a.map(f).join(' ');

// support: removable front and back sliding supports (researcher-side, like a walker) so that
// the body can stay upright while the domain does not yet sustain it (option, off by default)
export function buildRobotMJCF(P = ROBOT_PARAMS, { extraWorld = '', support = false } = {}) {
  const sensors = [], actuators = [], tendons = [], taxels = [];
  const T = P.trunkHalf, zTrunk = P.clearance + T;
  const taxelSite = (name, pos, size, region) => { taxels.push({ name, region }); sensors.push(`<touch name="${name}" site="${name}"/>`); return `<site name="${name}" type="box" pos="${v3(pos)}" size="${v3(size)}" rgba="1 .5 0 .15" group="3"/>`; };
  // grid of taxels on a rectangular face: centre c, two in-plane axes (unit), half extents, normal axis
  const face = (prefix, c, ax1, h1, ax2, h2, nrm, step, region) => {
    const n1 = Math.max(1, Math.round(2 * h1 / step)), n2 = Math.max(1, Math.round(2 * h2 / step)), out = [];
    for (let i = 0; i < n1; i++) for (let j = 0; j < n2; j++) {
      const a = -h1 + (i + 0.5) * 2 * h1 / n1, b = -h2 + (j + 0.5) * 2 * h2 / n2;
      const pos = [0, 1, 2].map(k => c[k] + a * ax1[k] + b * ax2[k]);
      const size = [0, 1, 2].map(k => Math.abs(ax1[k]) * h1 / n1 + Math.abs(ax2[k]) * h2 / n2 + Math.abs(nrm[k]) * 0.004);
      out.push(taxelSite(`${prefix}_${i}_${j}`, pos, size, region));
    }
    return out.join('\n');
  };
  const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];
  const joint = (name, axis, range, extra = '') => `<joint name="${name}" type="hinge" axis="${axis}" range="${range}" damping="0.02" armature="0.0005" ${extra}/>`;
  const pos = (name, j, kp, range) => actuators.push(`<position name="${name}" joint="${j}" kp="${kp}" ctrlrange="${range}" ctrllimited="true"/>`);
  const jsens = j => sensors.push(`<jointpos name="${j}_pos" joint="${j}"/>`, `<jointvel name="${j}_vel" joint="${j}"/>`);

  // ---------------- trunk taxels (front, back, left, right, top) ----------------
  const trunkSkin = [
    face('skin_trunk_front', [T, 0, 0], Y, T, Z, T, X, P.taxel.trunk, 'trunk-front'),
    face('skin_trunk_back', [-T, 0, 0], Y, T, Z, T, X, P.taxel.trunk, 'trunk-back'),
    face('skin_trunk_left', [0, T, 0], X, T, Z, T, Y, P.taxel.trunk, 'trunk-left'),
    face('skin_trunk_right', [0, -T, 0], X, T, Z, T, Y, P.taxel.trunk, 'trunk-right'),
    face('skin_trunk_top', [0, 0, T], X, T, Y, T, Z, P.taxel.trunk, 'trunk-top'),
  ].join('\n');

  // ---------------- wheels ----------------
  const wy = T + P.wheelGap + P.wheelHalfWidth;
  const wheel = (s, side) => {
    jsens(`wheel_${s}`);
    actuators.push(`<motor name="wheel_${s}" joint="wheel_${s}" gear="1" ctrlrange="${-P.wheelTorque} ${P.wheelTorque}" ctrllimited="true"/>`);
    return `<body name="wheel_${s}" pos="${P.wheelX} ${f(side * wy)} ${f(P.wheelRadius - zTrunk)}">
      <joint name="wheel_${s}" type="hinge" axis="0 1 0" damping="0.001"/>
      <geom type="cylinder" size="${P.wheelRadius} ${P.wheelHalfWidth}" zaxis="0 1 0" mass="${P.wheelMass}" friction="1.2 0.01 0.001" rgba=".15 .15 .15 1"/>
    </body>`;
  };

  // ---------------- neck, head, eyes ----------------
  const hx = 0.04, hy = 0.05, hz = 0.045, headZ = 0.40 - hz - zTrunk;
  ['neck_yaw', 'neck_pitch', 'neck_roll'].forEach(j => { pos(j, j, P.neckKp, j === 'neck_yaw' ? '-1.6 1.6' : '-0.8 0.8'); jsens(j); });
  const eye = (s, side) => {
    for (const a of ['yaw', 'pitch']) { const j = `eye_${s}_${a}`; pos(j, j, P.eyeKp, '-0.6 0.6'); jsens(j); }
    return `<body name="eye_${s}" pos="${hx} ${f(side * 0.028)} 0.012">
      ${joint(`eye_${s}_yaw`, '0 0 1', '-0.6 0.6')}${joint(`eye_${s}_pitch`, '0 1 0', '-0.6 0.6')}
      <geom type="cylinder" fromto="0 0 0 0.03 0 0" size="0.012" mass="${P.eyeMass}" rgba=".3 .3 .35 1"/>
      <camera name="camera_${s}" pos="0.031 0 0" xyaxes="0 -1 0 0 0 1" fovy="60"/>
    </body>`;
  };
  const headSkin = [
    face('skin_head_front', [hx, 0, -0.02], Y, hy * 0.6, Z, hz * 0.4, X, P.taxel.head, 'head-front'),
    face('skin_head_top', [0, 0, hz], X, hx, Y, hy, Z, P.taxel.head, 'head-top'),
    face('skin_head_left', [0, hy, 0], X, hx, Z, hz, Y, P.taxel.head, 'head-left'),
    face('skin_head_right', [0, -hy, 0], X, hx, Z, hz, Y, P.taxel.head, 'head-right'),
  ].join('\n');

  // ---------------- arms and hands ----------------
  const arm = (s, side) => {
    const L = P.upperArm, F = P.forearm, H = P.hand, ph = P.phalanx, r = P.armRadius;
    const J = n => `${n}_${s}`;
    for (const [j, range] of [['shoulder_flex', '-3.1 1.2'], ['shoulder_abd', side > 0 ? '-0.3 2.6' : '-2.6 0.3'], ['shoulder_rot', '-1.6 1.6'],
      ['elbow', '-2.6 0'], ['wrist_flex', '-1.4 1.4'], ['wrist_dev', '-0.6 0.6']]) { pos(J(j), J(j), P.armKp, range); jsens(J(j)); }
    const ring = (prefix, len, region) => {
      const out = [], n = Math.round(len / P.taxel.arm);
      for (let i = 0; i < n; i++) for (const [k, d] of [[0, X], [1, Y], [2, [-1, 0, 0]], [3, [0, -1, 0]]]) {
        const z = -(i + 0.5) * len / n;
        out.push(taxelSite(`${prefix}_${i}_${k}`, [d[0] * r, d[1] * r, z], [Math.abs(d[1]) * r * 0.8 + Math.abs(d[0]) * 0.004, Math.abs(d[0]) * r * 0.8 + Math.abs(d[1]) * 0.004, len / n / 2], region));
      }
      return out.join('\n');
    };
    // fingers: finger 1 on the front of the palm, 2 and 3 on the back, flexing toward each other
    const finger = (k, x, y, dir) => {
      const name = `finger_${s}${k}`;
      tendons.push(`<fixed name="${name}"><joint joint="${name}_prox" coef="1"/><joint joint="${name}_dist" coef="1"/></fixed>`);
      actuators.push(`<position name="${name}" tendon="${name}" kp="${P.fingerKp}" ctrlrange="0 2.6" ctrllimited="true"/>`);
      sensors.push(`<tendonpos name="${name}_tendon" tendon="${name}"/>`, `<actuatorfrc name="${name}_tension" actuator="${name}"/>`);
      jsens(`${name}_prox`); jsens(`${name}_dist`);
      const ax = `0 ${dir} 0`, tip = [];
      for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++)
        tip.push(taxelSite(`skin_${name}_tip_${a}_${b}`, [-dir * 0.0035, (a - 1) * P.taxel.fingertip, -(b + 0.5) * ph / 3], [0.002, P.taxel.fingertip / 2, ph / 6], `fingertip-${s}${k}`));
      return `<body name="${name}_prox" pos="${x} ${y} ${-H}">
        ${joint(`${name}_prox`, ax, '0 1.4')}
        <geom type="capsule" fromto="0 0 0 0 0 ${-ph}" size="${P.fingerRadius}" mass="${P.phalanxMass}" rgba=".8 .8 .8 1"/>
        ${taxelSite(`skin_${name}_prox`, [-dir * 0.0035, 0, -ph / 2], [0.002, 0.004, ph / 2], `finger-${s}${k}`)}
        ${taxelSite(`skin_${name}_prox_dorsal`, [dir * 0.0035, 0, -ph / 2], [0.002, 0.004, ph / 2], `finger-${s}${k}`)}
        <body name="${name}_dist" pos="0 0 ${-ph}">
          ${joint(`${name}_dist`, ax, '0 1.4')}
          <geom type="capsule" fromto="0 0 0 0 0 ${-ph}" size="${P.fingerRadius}" mass="${P.phalanxMass}" rgba=".9 .9 .9 1"/>
          ${tip.join('\n')}
          ${taxelSite(`skin_${name}_dist_dorsal`, [dir * 0.0035, 0, -ph / 2], [0.002, 0.004, ph / 2], `finger-${s}${k}`)}
          ${taxelSite(`skin_${name}_dist_side_a`, [0, 0.0035, -ph / 2], [0.004, 0.002, ph / 2], `finger-${s}${k}`)}
          ${taxelSite(`skin_${name}_dist_side_b`, [0, -0.0035, -ph / 2], [0.004, 0.002, ph / 2], `finger-${s}${k}`)}
          ${taxelSite(`skin_${name}_tip_end`, [0, 0, -ph - 0.002], [0.004, 0.004, 0.003], `fingertip-${s}${k}`)}
        </body>
      </body>`;
    };
    return `<body name="${J('upper_arm')}" pos="${P.shoulder[0]} ${f(side * P.shoulder[1])} ${P.shoulder[2]}">
      ${joint(J('shoulder_flex'), '0 1 0', '-3.1 1.2')}${joint(J('shoulder_abd'), '1 0 0', side > 0 ? '-0.3 2.6' : '-2.6 0.3')}${joint(J('shoulder_rot'), '0 0 1', '-1.6 1.6')}
      <geom type="capsule" fromto="0 0 0 0 0 ${-L}" size="${r}" mass="${P.upperArmMass}" rgba=".55 .6 .7 1"/>
      ${ring(`skin_upper_arm_${s}`, L, `upper-arm-${s}`)}
      <body name="${J('forearm')}" pos="0 0 ${-L}">
        ${joint(J('elbow'), '0 1 0', '-2.6 0')}
        <geom type="capsule" fromto="0 0 0 0 0 ${-F}" size="${r * 0.9}" mass="${P.forearmMass}" rgba=".55 .6 .7 1"/>
        ${ring(`skin_forearm_${s}`, F, `forearm-${s}`)}
        <body name="${J('hand')}" pos="0 0 ${-F}">
          ${joint(J('wrist_flex'), '0 1 0', '-1.4 1.4')}${joint(J('wrist_dev'), '1 0 0', '-0.6 0.6')}
          <geom type="box" pos="0 0 ${-H / 2}" size="0.008 0.02 ${H / 2}" mass="${P.handMass}" rgba=".7 .7 .75 1"/>
          ${face(`skin_palm_${s}_front`, [0.008, 0, -H / 2], Y, 0.02, Z, H / 2, X, P.taxel.palm, `palm-${s}`)}
          ${face(`skin_palm_${s}_back`, [-0.008, 0, -H / 2], Y, 0.02, Z, H / 2, X, P.taxel.palm, `palm-${s}`)}
          ${finger(1, 0.006, 0, -1)}${finger(2, -0.006, 0.01, 1)}${finger(3, -0.006, -0.01, 1)}
        </body>
      </body>
    </body>`;
  };

  sensors.push('<accelerometer name="imu_acc" site="imu"/>', '<gyro name="imu_gyro" site="imu"/>', '<framequat name="trunk_quat_diagnostic" objtype="body" objname="trunk"/>');
  for (const a of ['wheel_L', 'wheel_R']) sensors.push(`<actuatorfrc name="${a}_effort" actuator="${a}"/>`);
  const xml = `<mujoco model="clear-robot-v1">
  <compiler angle="radian" autolimits="true"/>
  <option timestep="${P.timestep}" integrator="implicitfast"/>
  <default><geom condim="3" friction="0.8 0.01 0.001"/></default>
  <worldbody>
    <geom name="floor" type="plane" size="5 5 0.1" rgba=".7 .65 .6 1"/>
    ${extraWorld}
    <body name="trunk" pos="0 0 ${f(zTrunk)}">
      <freejoint name="root"/>
      <geom name="trunk" type="box" size="${T} ${T} ${T}" mass="${P.trunkMass}" rgba=".85 .8 .7 1"/>
      <site name="imu" pos="0 0 0" size="0.005"/>
      ${trunkSkin}
      ${wheel('L', 1)}${wheel('R', -1)}
      ${support ? [-1, 1].map(sx => `<body name="support_${sx > 0 ? 'front' : 'back'}"><geom type="capsule" fromto="${f(sx * T)} 0 ${f(-T + 0.02)} ${f(sx * (T + 0.03))} 0 ${f(0.02 - zTrunk)}" size="0.006" mass="0.02" rgba=".9 .3 .3 1"/><geom type="sphere" pos="${f(sx * (T + 0.03))} 0 ${f(0.02 - zTrunk)}" size="0.02" mass="0.01" friction="0.05 0.001 0.001" rgba=".9 .3 .3 1"/></body>`).join('') : ''}
      <body name="neck" pos="0 0 ${T}">
        ${joint('neck_yaw', '0 0 1', '-1.6 1.6')}${joint('neck_pitch', '0 1 0', '-0.8 0.8')}${joint('neck_roll', '1 0 0', '-0.8 0.8')}
        <geom type="capsule" fromto="0 0 0 0 0 0.035" size="0.015" mass="${P.neckMass}" rgba=".4 .4 .45 1"/>
        <body name="head" pos="0 0 ${f(headZ - T)}">
          <geom name="head" type="box" size="${hx} ${hy} ${hz}" mass="${P.headMass}" rgba=".8 .78 .7 1"/>
          <site name="mic_L" pos="0 ${hy} 0" size="0.004"/><site name="mic_R" pos="0 ${-hy} 0" size="0.004"/>
          ${headSkin}
          ${eye('L', 1)}${eye('R', -1)}
        </body>
      </body>
      ${arm('L', 1)}${arm('R', -1)}
    </body>
  </worldbody>
  <tendon>${tendons.join('\n')}</tendon>
  <actuator>${actuators.join('\n')}</actuator>
  <sensor>${sensors.join('\n')}</sensor>
</mujoco>`;
  return { xml, taxels, nActuators: actuators.length };
}
