import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RobotWorld } from '../src/robot/world/robot-world.js';
import { EyeCamera } from '../src/robot/senses/vision.js';

const names = (w, img) => { const { mj, model: m } = w.sim, s = new Set(); for (const g of img.geom) s.add(g < 0 ? 'sky' : mj.mj_id2name(m, 5, g)); return s; };

test('vision: through the low window the eyes see the tree and the grass; the glass is transparent to the cameras', async () => {
  const w = await RobotWorld.create({ sky: { startHour: 12 } }); w.step(200);
  const e = new EyeCamera(w, 'camera_L', { width: 64, height: 48 }), img = e.render(), seen = names(w, img);
  for (const n of ['tree_trunk', 'tree_canopy']) assert.ok(seen.has(n), n);
  assert.ok(!seen.has('window_glass'));
  e.dispose(); w.dispose();
});

test('vision: at night the outside is dark and the lamp lights the room until 22:00', async () => {
  const mean = async hour => { const w = await RobotWorld.create({ sky: { startHour: hour } }); w.step(200); const e = new EyeCamera(w, 'camera_L', { width: 32, height: 24 }), img = e.render();
    const { mj, model: m } = w.sim; let inside = 0, n = 0, outside = 0, k = 0;
    img.geom.forEach((g, p) => { const v = img.rgb[3 * p] + img.rgb[3 * p + 1] + img.rgb[3 * p + 2], nm = g < 0 ? 'sky' : mj.mj_id2name(m, 5, g); if (/^wall/.test(nm ?? '')) { inside += v; n++; } if (nm === 'sky' || /^tree|grass/.test(nm ?? '')) { outside += v; k++; } });
    e.dispose(); w.dispose(); return { wall: inside / Math.max(1, n), out: outside / Math.max(1, k) }; };
  const lamp = await mean(20), dark = await mean(23);
  assert.ok(lamp.wall > 10 * lamp.out, 'lamp-lit walls brighter than the night outside');
  assert.ok(lamp.wall > 10 * dark.wall, 'walls dark after the lamp turns off');
});
