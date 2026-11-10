// Robot room (docs/environment-design-v0.md, decisions of 10/11/2026): a smaller
// level room with a LOW window (the robot sees outside), a closed door with a gap
// under it (cheese is pushed through at dusk), a mouse hole in the baseboard and
// configurable loose objects on the floor (default: 2 Lego-like bricks, a
// ping-pong ball, a small solid rubber ball). Frame: x = north, y = west, z = up;
// the room centre is the origin; the robot starts at the centre facing north.
// Dimensions not set by the researcher are our proposals (marked in the doc).
import { makeRng } from '../../../vendor/tempo/core/rng.js';

export const ROOM_DEFAULTS = Object.freeze({
  lengthNS: 3.0, widthEW: 2.5, height: 2.5, wall: 0.1,
  window: { width: 1.2, sill: 0.2, height: 1.5 },          // north wall
  door: { width: 0.8, height: 2.0, gap: 0.01, along: 0.4 }, // west wall; gap under the door
  hole: { width: 0.04, height: 0.03, along: -0.6 },         // east wall, at the floor
  objects: [
    { kind: 'brick', size: [0.032, 0.016, 0.0114], mass: 0.0025, rgba: '0.85 0.1 0.1 1' },
    { kind: 'brick', size: [0.032, 0.016, 0.0114], mass: 0.0025, rgba: '0.1 0.3 0.85 1' },
    { kind: 'ball', radius: 0.02, mass: 0.0027, rgba: '0.97 0.97 0.95 1', friction: '0.4 0.005 0.0005' },
    { kind: 'ball', radius: 0.015, mass: 0.015, rgba: '0.95 0.8 0.1 1', friction: '1.2 0.01 0.001' },
  ],
  cheese: { size: [0.03, 0.02, 0.008], mass: 0.005, rgba: '0.98 0.85 0.35 1', parkedAt: [0, 4, 0.004] }, // thinner than the door gap
  tree: { at: [4.0, 0.6], trunkRadius: 0.12, trunkHeight: 1.8, canopy: [1.3, 1.3, 1.1] },
  objectSeed: 1, keepClearOfRobot: 0.35,
});

const f = v => +v.toFixed(5);
const box = (name, c, h, extra = '') => `<geom name="${name}" type="box" pos="${c.map(f).join(' ')}" size="${h.map(f).join(' ')}" ${extra}/>`;

export function buildRoomMJCF(R = ROOM_DEFAULTS) {
  const L = R.lengthNS / 2, W = R.widthEW / 2, H = R.height, t = R.wall / 2, wallRgba = 'rgba=".92 .9 .86 1"';
  const parts = [];
  // north wall (x = +L) with the window opening
  const wn = R.window, x = L + t;
  parts.push(box('wall_north_low', [x, 0, wn.sill / 2], [t, W + R.wall, wn.sill / 2], wallRgba));
  parts.push(box('wall_north_high', [x, 0, (wn.sill + wn.height + H) / 2], [t, W + R.wall, (H - wn.sill - wn.height) / 2], wallRgba));
  for (const s of [1, -1]) parts.push(box(`wall_north_side_${s > 0 ? 'w' : 'e'}`, [x, s * (wn.width / 2 + (W - wn.width / 2) / 2), wn.sill + wn.height / 2], [t, (W - wn.width / 2) / 2, wn.height / 2], wallRgba));
  parts.push(box('window_glass', [x, 0, wn.sill + wn.height / 2], [0.003, wn.width / 2, wn.height / 2], 'rgba=".7 .85 1 .12" group="3"')); // group 3: transparent to camera rays
  parts.push(box('wall_south', [-L - t, 0, H / 2], [t, W + R.wall, H / 2], wallRgba));
  // west wall (y = +W) with the door; the door leaves a gap above the floor
  const d = R.door, yW = W + t, a = d.along;
  parts.push(box('wall_west_n', [(a + d.width / 2 + L) / 2, yW, H / 2], [(L - a - d.width / 2) / 2, t, H / 2], wallRgba));
  parts.push(box('wall_west_s', [(a - d.width / 2 - L) / 2, yW, H / 2], [(a - d.width / 2 + L) / 2, t, H / 2], wallRgba));
  parts.push(box('wall_west_top', [a, yW, (d.height + H) / 2], [d.width / 2, t, (H - d.height) / 2], wallRgba));
  parts.push(box('door', [a, yW, d.gap + (d.height - d.gap) / 2], [d.width / 2, 0.02, (d.height - d.gap) / 2], 'rgba=".55 .4 .25 1"'));
  // east wall (y = -W) with the mouse hole at the floor
  const h = R.hole, yE = -W - t, b = h.along;
  parts.push(box('wall_east_n', [(b + h.width / 2 + L) / 2, yE, H / 2], [(L - b - h.width / 2) / 2, t, H / 2], wallRgba));
  parts.push(box('wall_east_s', [(b - h.width / 2 - L) / 2, yE, H / 2], [(b - h.width / 2 + L) / 2, t, H / 2], wallRgba));
  parts.push(box('wall_east_above_hole', [b, yE, (h.height + H) / 2], [h.width / 2, t, (H - h.height) / 2], wallRgba));
  // outside, seen through the window (decision 10/11/2026: tree and sky): grass and one tree
  const T = R.tree;
  parts.push(box('grass', [(L + R.wall + 6) / 2, 0, 0.0005], [(6 - L - R.wall) / 2, 6, 0.0005], 'rgba=".3 .55 .2 1" contype="0" conaffinity="0"'));
  parts.push(`<geom name="tree_trunk" type="cylinder" pos="${f(T.at[0])} ${f(T.at[1])} ${f(T.trunkHeight / 2)}" size="${T.trunkRadius} ${f(T.trunkHeight / 2)}" rgba=".4 .28 .16 1" contype="0" conaffinity="0"/>`);
  parts.push(`<geom name="tree_canopy" type="ellipsoid" pos="${f(T.at[0])} ${f(T.at[1])} ${f(T.trunkHeight + T.canopy[2] * 0.7)}" size="${T.canopy.join(' ')}" rgba=".2 .45 .18 1" contype="0" conaffinity="0"/>`);
  // loose objects at seeded positions, away from the robot and the walls
  const rng = makeRng(R.objectSeed), placed = [];
  R.objects.forEach((o, k) => {
    let p; do { p = [(rng.random() * 2 - 1) * (L - 0.15), (rng.random() * 2 - 1) * (W - 0.15)]; }
    while (Math.hypot(...p) < R.keepClearOfRobot || placed.some(q => Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.1));
    placed.push(p);
    const name = `object_${k}`, z = o.kind === 'ball' ? o.radius : o.size[2] / 2;
    const geom = o.kind === 'ball' ? `<geom type="sphere" size="${o.radius}" mass="${o.mass}" rgba="${o.rgba}" friction="${o.friction ?? '0.8 0.01 0.001'}"/>`
      : `<geom type="box" size="${o.size.map(v => f(v / 2)).join(' ')}" mass="${o.mass}" rgba="${o.rgba}"/>`;
    parts.push(`<body name="${name}" pos="${f(p[0])} ${f(p[1])} ${f(z + 0.001)}"><freejoint name="${name}"/>${geom}</body>`);
  });
  const c = R.cheese;
  parts.push(`<body name="cheese" pos="${c.parkedAt.map(f).join(' ')}"><freejoint name="cheese"/><geom type="box" size="${c.size.map(v => f(v / 2)).join(' ')}" mass="${c.mass}" rgba="${c.rgba}" friction="0.6 0.01 0.001"/></body>`);
  return { xml: parts.join('\n'), objects: R.objects.map((o, k) => ({ name: `object_${k}`, ...o })) };
}
