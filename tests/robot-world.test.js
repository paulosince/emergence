import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RobotWorld } from '../src/robot/world/robot-world.js';
import { Sky } from '../src/robot/world/sky.js';
import { ROOM_DEFAULTS } from '../src/robot/world/room.js';

test('room: the robot and four objects inside; objects settle on the floor inside the walls', async () => {
  const w = await RobotWorld.create();
  w.step(1500);
  for (const o of w.objects) {
    const [x, y, z] = w.bodyPosition(o.name);
    assert.ok(Math.abs(x) < ROOM_DEFAULTS.lengthNS / 2 && Math.abs(y) < ROOM_DEFAULTS.widthEW / 2, o.name + ' inside');
    assert.ok(z < 0.03, o.name + ' on the floor (z=' + z.toFixed(3) + ')');
  }
  const [rx, ry] = w.bodyPosition('trunk');
  assert.ok(Math.hypot(rx, ry) < 0.3);
  w.dispose();
});

test('low window: a horizontal line of sight at eye height crosses the window opening', () => {
  const eye = 0.37, W = ROOM_DEFAULTS.window;
  assert.ok(eye > W.sill && eye < W.sill + W.height);
});

test('sky: lamp on after sunset, off at 22:00 and during the day; moon phase cycles in ~29.5 days', () => {
  const sky = new Sky({ startHour: 0 });
  const at = h => h * 3600;
  assert.equal(sky.lampOn(at(12)), false);
  assert.equal(sky.lampOn(at(20)), true);
  assert.equal(sky.lampOn(at(22.5)), false);
  assert.ok(sky.outdoorLux(at(12)) > 1000 && sky.outdoorLux(at(2)) < 1);
  const p0 = sky.moonPhase(0), p1 = sky.moonPhase(29.530588853 * 86400);
  assert.ok(Math.abs(p0 - p1) < 1e-6 || Math.abs(Math.abs(p0 - p1) - 1) < 1e-6);
});

test('cheese: pushed under the door at dusk, ends up inside the room', async () => {
  const w = await RobotWorld.create({ sky: { startHour: 18.5 } }); // start just before/around sunset
  let pushed = false;
  for (let k = 0; k < 40 && !pushed; k++) { w.step(500); pushed = w.drainEvents().some(e => e.type === 'cheese.pushed'); }
  if (!pushed) { // advance the clock to after sunset if needed
    assert.fail('no dusk within the simulated window');
  }
  w.step(1500);
  const [, y, z] = w.bodyPosition('cheese');
  assert.ok(y < ROOM_DEFAULTS.widthEW / 2 && z < 0.02, 'cheese inside at y=' + y.toFixed(3));
  w.dispose();
});
