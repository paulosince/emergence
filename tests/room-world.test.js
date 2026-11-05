import { test } from 'node:test';
import assert from 'node:assert/strict';
import { approximateSun } from '../src/room/solar.js';
import { createRoomWorld,ROOM_DAY_MS } from '../src/room/room-world.js';
import { polygonArea,pointInPolygon,clipToFloor } from '../src/room/geometry.js';
import { createRoomScenario } from '../src/room/room-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';
const H=3600000;
const nearly=(a,b,err=1e-8)=>assert.ok(Math.abs(a-b)<=err,'Expected '+a+' = '+b);
const run=opts=>runExperiment({...createRoomScenario(opts),engine:new DiagnosticEngine()});

test('solar frame: equinox noon overhead at equator and midnight below horizon',()=>{
  const noon=approximateSun({latitudeDeg:0,dayOfYear:80,solarHour:12});
  assert.ok(noon.altitudeDeg>89.9);
  assert.ok(noon.up>0.999);
  assert.ok(approximateSun({latitudeDeg:0,dayOfYear:80,solarHour:0}).up<0);
  nearly(approximateSun({latitudeDeg:0,dayOfYear:80,solarHour:6}).up,0,1e-9);
  const morning=approximateSun({latitudeDeg:0,dayOfYear:80,solarHour:9});
  const evening=approximateSun({latitudeDeg:0,dayOfYear:80,solarHour:15});
  assert.ok(morning.east>0);
  assert.ok(evening.east<0);
});

test('northern-facing window admits midday winter sun in southern hemisphere',()=>{
  const world=createRoomWorld();
  const noon=world.stateAt(12*H);
  assert.ok(noon.sun.altitudeDeg>35&&noon.sun.altitudeDeg<55);
  assert.ok(noon.sun.north>0);
  assert.ok(noon.projectedWindowAreaM2>0);
  assert.ok(noon.projectedWindowPatch.every(p=>
    Math.abs(p.x)<=2+1e-7&&Math.abs(p.y)<=1.5+1e-7));
  assert.ok(world.floorIlluminanceAt(12*H,{x:0,y:0})>
    world.floorIlluminanceAt(12*H,{x:1.8,y:-1.3}));
});

test('night has no direct sunlight or geometric solar shadow, but lamp responds',()=>{
  const world=createRoomWorld();
  for(const h of [0,2,23,24]){
    const state=world.stateAt(h*H);
    assert.equal(state.projectedWindowAreaM2,0);
    assert.equal(state.projectedBoxShadowAreaM2,0);
    assert.equal(state.lampOn,true);
    assert.ok(world.floorIlluminanceAt(h*H,{x:0,y:0})>0);
  }
  assert.equal(world.stateAt(12*H).lampOn,false);
  assert.ok(world.stateAt(12*H).outdoorIlluminance>0.4);
});

test('opaque box changes direct irradiance at shadowed floor points',()=>{
  const world=createRoomWorld();
  const state=world.stateAt(12*H);
  assert.ok(state.projectedBoxShadow.length>=3);
  assert.ok(state.projectedBoxShadowAreaM2>0);
  const shadow=state.projectedBoxShadow;
  assert.ok(pointInPolygon({x:world.describe().parameters.boxX,
    y:world.describe().parameters.boxY},shadow));
  const patch=state.projectedWindowPatch;
  assert.ok(polygonArea(patch)>0);
  assert.ok(clipToFloor([{x:-5,y:-5},{x:5,y:-5},{x:5,y:5},{x:-5,y:5}],
    {widthM:4,depthM:3}).every(pt=>
    Math.abs(pt.x)<=2+1e-6&&Math.abs(pt.y)<=1.5+1e-6));
});

test('cloud cover removes direct floor beam and shadow while leaving daytime ambient',()=>{
  const clear=createRoomWorld({cloudCover:0});
  const cloudy=createRoomWorld({cloudCover:1});
  const a=clear.stateAt(12*H),b=cloudy.stateAt(12*H);
  assert.ok(a.directStrength>0);
  assert.equal(b.directStrength,0);
  assert.ok(b.outdoorIlluminance>0);
  assert.ok(clear.floorIlluminanceAt(12*H,{x:0,y:0})>
    cloudy.floorIlluminanceAt(12*H,{x:0,y:0}));
});

test('photocell switches lamp twice as daylight crosses threshold',()=>{
  const room=createRoomWorld();
  const events=room.eventsThrough(ROOM_DAY_MS);
  assert.equal(events.length,2);
  assert.ok(events[0].timeMs<12*H);
  assert.ok(events[1].timeMs>12*H);
  assert.equal(events[0].lampOn,false);
  assert.equal(events[1].lampOn,true);
  for(const event of events){
    assert.equal(room.stateAt(event.timeMs).lampOn,event.lampOn);
    assert.notEqual(room.stateAt(event.timeMs-2).lampOn,event.lampOn);
  }
  assert.deepEqual(room.eventsThrough(10*H),events.filter(e=>e.timeMs<=10*H));
});

test('sensor ablation does not change the room or its physical transitions',()=>{
  const normal=run();
  const optical=run({modalities:['optical']});
  const none=run({modalities:[]});
  assert.deepEqual(normal.manifest.environment.world,optical.manifest.environment.world);
  assert.deepEqual(normal.manifest.environment.world,none.manifest.environment.world);
  assert.ok(normal.incidences.length>0);
  assert.ok(optical.incidences.every(i=>['s0','s1','s2'].includes(i.transducerId)));
  assert.equal(none.summary.deliveredCount,0);
  assert.equal(none.summary.sampleCount,0);
  assert.equal(normal.finalSnapshot.nodeCount,0);
});

test('physical room light changes are observed through numerical channels',()=>{
  const full=run();
  const s0=full.incidences.filter(i=>i.transducerId==='s0');
  const s3=full.incidences.filter(i=>i.transducerId==='s3');
  assert.ok(s0.length>=3);
  assert.ok(s3.some(i=>i.measurement===0));
  assert.ok(s3.some(i=>i.measurement===1));
  assert.ok(full.incidences.every(i=>Object.keys(i).sort().join(',')===
    ['arrivedAtMs','incidenceId','measurement','observedAtMs','transducerId'].join(',')));
});

test('cloud change alters observation but does not introduce arbitrary event labels',()=>{
  const clear=run();
  const clouds=run({worldOptions:{cloudCover:1}});
  assert.notDeepEqual(clear.incidences,clouds.incidences);
  assert.equal(clear.manifest.environment.world.parameters.cloudCover,0);
  assert.equal(clouds.manifest.environment.world.parameters.cloudCover,1);
  const delivery=JSON.stringify(clouds.incidences);
  assert.ok(!delivery.includes('sun')&&!delivery.includes('lamp.photocell-switch'));
});

test('sensor position and sampling shift readings without changing physics',()=>{
  const defaultRun=run();
  const late=run({sensorOverrides:{s0:{periodMs:3600000,phaseMs:600000}}});
  assert.deepEqual(defaultRun.manifest.environment.world,late.manifest.environment.world);
  assert.notDeepEqual(defaultRun.incidences.filter(x=>x.transducerId==='s0'),
    late.incidences.filter(x=>x.transducerId==='s0'));
  assert.deepEqual(defaultRun.incidences.filter(x=>x.transducerId==='s1'),
    late.incidences.filter(x=>x.transducerId==='s1'));
});

test('replay with same world, sensors and seed is deterministic',()=>{
  assert.deepEqual(run(),run());
});

test('invalid geometry, time and sensor assumptions are rejected',()=>{
  assert.throws(()=>createRoomWorld({windowTopM:5}),RangeError);
  assert.throws(()=>createRoomWorld({windowWidthM:5}),RangeError);
  assert.throws(()=>createRoomWorld({latitudeDeg:85}),RangeError);
  assert.throws(()=>createRoomWorld({unknownThing:123}),RangeError);
  assert.throws(()=>createRoomWorld().stateAt(ROOM_DAY_MS+1),RangeError);
  assert.throws(()=>createRoomWorld().floorIlluminanceAt(0,{x:100,y:0}),RangeError);
  assert.throws(()=>createRoomScenario({modalities:['acoustic']}),RangeError);
  assert.throws(()=>createRoomScenario({modalities:[],
    sensorOverrides:{s0:{periodMs:1}}}),RangeError);
  assert.throws(()=>runExperiment({
    ...createRoomScenario({modalities:[],endTimeMs:ROOM_DAY_MS+1}),
    engine:new DiagnosticEngine()}),RangeError);
});
