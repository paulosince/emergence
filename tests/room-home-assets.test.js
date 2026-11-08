import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';

const home=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../app/room.js',import.meta.url),'utf8');
test('main entrance is naturalistic room and legacy body control remains accessible',()=>{
  assert.ok(home.includes('src="./app/room.js"'));
  assert.ok(home.includes('href="./body.html"'));
  assert.ok(home.includes('id="roomObstacle"'));
  assert.ok(home.includes('id="roomTimeline"'));
  assert.ok(home.includes('id="sunPatch"'));
  assert.ok(home.includes('id="obstacleShadow"'));
  assert.ok(home.includes('id="roomIncidenceList"'));
  assert.ok(home.includes('id="roomEvents"'));
  assert.ok(home.includes('id="roomRun"'));
  assert.ok(home.includes('id="roomRunAll"'));
  assert.ok(home.includes('id="roomMode"'));
  assert.ok(existsSync(new URL('../body.html',import.meta.url)));
  assert.ok(existsSync(new URL('../app/room.css',import.meta.url)));
});
test('the room inspector uses the physical simulation and does not pretend to learn',()=>{
  assert.ok(js.includes("import { createRoomScenario }"));
  assert.ok(js.includes("import { ExecutionController }"));
  assert.ok(!js.includes('runExperiment('),
    'the live view must not pre-compute the whole run');
  assert.ok(js.includes("import { DiagnosticEngine }"));
  assert.ok(js.includes('scene.world.stateAt(tMs)'));
  assert.ok(js.includes('scene.world.floorIrradianceAt'));
  assert.ok(!js.includes('Math.random('));
  assert.ok(home.includes('sem aprendizagem'));
});
