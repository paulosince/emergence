import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRoomWorld } from '../src/room/room-world.js';
import { solarAt,describeSolarDay,DAY_MS } from '../src/room/solar.js';
import { createWeatherForcing } from '../src/room/weather.js';
import { floorReceivesDirectSun,sunPatchOnFloor,
  ROOM_GEOMETRY_V1 } from '../src/room/geometry.js';

const H=3600000;
const nearly=(x,y,epsilon=1e-6)=>
  assert.ok(Math.abs(x-y)<epsilon,'Expected '+x+' near '+y);

test('solar geometry produces night, sun above horizon and morning/afternoon directions',()=>{
  const day=describeSolarDay();
  const midnight=solarAt(0,day),morning=solarAt(9*H,day);
  const noon=solarAt(12*H,day),afternoon=solarAt(15*H,day);
  assert.equal(midnight.isAboveHorizon,false);
  assert.equal(noon.isAboveHorizon,true);
  assert.ok(noon.altitudeDeg>40 && noon.altitudeDeg<50);
  assert.ok(morning.east>0 && afternoon.east<0);
  assert.ok(noon.north>0); // June: winter Sun north of Guarulhos.
  for(const sun of [midnight,morning,noon,afternoon]) {
    nearly(sun.east**2+sun.north**2+sun.up**2,1,1e-12);
  }
  assert.throws(()=>describeSolarDay({date:'2026-02-30'}),RangeError);
  assert.throws(()=>describeSolarDay({latitudeDeg:95}),RangeError);
  assert.throws(()=>solarAt(DAY_MS+1,day),RangeError);
});

test('ray projection of a window casts a causal sun patch on room floor',()=>{
  const day=describeSolarDay(),sun=solarAt(12*H,day),g=ROOM_GEOMETRY_V1;
  const polygon=sunPatchOnFloor(sun,g);
  assert.ok(polygon.length>=3);
  for(const p of polygon) {
    assert.ok(Math.abs(p.x)<=g.widthM/2+1e-9);
    assert.ok(Math.abs(p.y)<=g.depthM/2+1e-9);
  }
  // Project a window-center light ray onto floor and reverse-ray-test it.
  const z=g.window.sillM+g.window.heightM/2;
  const x=g.window.centerEastM-z*sun.east/sun.up;
  const y=g.depthM/2-z*sun.north/sun.up;
  assert.ok(floorReceivesDirectSun(x,y,sun,g));
  assert.equal(floorReceivesDirectSun(x,y,solarAt(0,day),g),false);
  assert.equal(floorReceivesDirectSun(g.widthM/2,g.depthM/2,sun,g),false);
  assert.deepEqual(sunPatchOnFloor(solarAt(0,day),g),[]);
});

test('photocell state changes at solar irradiance crossings, never fixed clock times',()=>{
  const world=createRoomWorld();
  const events=world.eventsThrough(DAY_MS);
  assert.equal(events[0].type,'lamp.initial');
  const changes=events.filter(e=>e.type==='lamp.toggle');
  assert.equal(changes.length,2,'winter clear sky must produce dawn/dusk');
  assert.equal(changes[0].stateOn,false);
  assert.equal(changes[1].stateOn,true);
  assert.ok(changes[0].timeMs>4*H && changes[0].timeMs<9*H);
  assert.ok(changes[1].timeMs>16*H && changes[1].timeMs<21*H);
  for(const change of changes) {
    assert.equal(world.stateAt(change.timeMs).lighting.lampOn,change.stateOn);
    assert.notEqual(world.stateAt(change.timeMs-1).lighting.lampOn,change.stateOn);
  }
  assert.equal(world.stateAt(0).lighting.lampOn,true);
  assert.equal(world.stateAt(12*H).lighting.lampOn,false);
  assert.equal(world.stateAt(23*H).lighting.lampOn,true);
});

test('sun and geometry determine illumination; shaded positions differ',()=>{
  const world=createRoomWorld();
  const sunny=world.stateAt(12*H);
  assert.ok(sunny.lighting.transmittedDirectPowerW>0);
  assert.ok(sunny.lighting.sunlightFloorPolygon.length>=3);
  const sun=sunny.sun,g=world.describe().geometry;
  const centerHeight=g.window.sillM+g.window.heightM/2;
  const x=g.window.centerEastM-centerHeight*sun.east/sun.up;
  const y=g.depthM/2-centerHeight*sun.north/sun.up;
  const direct=world.floorIrradianceAt(12*H,x,y);
  const shaded=world.floorIrradianceAt(12*H,-2.5,-1.8);
  assert.ok(direct>shaded+100);
  assert.ok(world.floorIrradianceAt(0,x,y)>0);// electric lamp
  assert.ok(world.floorIrradianceAt(12*H,x,y)>
    world.floorIrradianceAt(0,x,y));
});

test('thermal capacity obeys finite, smooth energy balance under variable forcing',()=>{
  const world=createRoomWorld();
  assert.equal(world.stateAt(0).thermal.indoorTemperatureC,17);
  const beginning=world.stateAt(6*H).thermal.indoorTemperatureC;
  const midday=world.stateAt(12*H).thermal.indoorTemperatureC;
  const evening=world.stateAt(18*H).thermal.indoorTemperatureC;
  for(const t of [0,3,6,12,15,18,21,24].map(x=>x*H)) {
    const s=world.stateAt(t);
    assert.ok(Number.isFinite(s.thermal.indoorTemperatureC));
    assert.ok(s.thermal.indoorTemperatureC>-30);
    assert.ok(s.thermal.indoorTemperatureC<80);
    const expectedEnvelope=120*(s.thermal.outdoorTemperatureC-
      s.thermal.indoorTemperatureC);
    nearly(s.thermal.conductivePowerIntoRoomW,expectedEnvelope,1e-7);
  }
  assert.notEqual(beginning,midday);
  assert.notEqual(midday,evening);
  // Output never depends on request order, playback order or sensor count.
  const remembered=world.stateAt(12*H);
  world.stateAt(23*H);
  world.stateAt(2*H);
  assert.deepEqual(world.stateAt(12*H),remembered);
});

test('cloudier forcing reduces direct solar radiation without deleting daylight',()=>{
  const clear=createRoomWorld({weatherPreset:'clear'});
  const cloud=createRoomWorld({weatherPreset:'overcast'});
  const a=clear.stateAt(12*H),b=cloud.stateAt(12*H);
  assert.ok(a.lighting.transmittedDirectPowerW >
    20*b.lighting.transmittedDirectPowerW);
  assert.ok(b.lighting.diffuseHorizontalWm2>0);
  assert.equal(a.sun.altitudeDeg,b.sun.altitudeDeg);
  assert.notEqual(a.thermal.outdoorTemperatureC,b.thermal.outdoorTemperatureC);
  assert.equal(cloud.describe().weather.kind,'synthetic-periodic');
  assert.equal(cloud.describe().weather.explicitlyNotRealtime,true);
});

test('imported weather is provenance-bound, interpolated and not a live query',()=>{
  const series=[
    {timeMs:0,temperatureC:10,cloudCover:1},
    {timeMs:12*H,temperatureC:20,cloudCover:0.5},
    {timeMs:DAY_MS,temperatureC:12,cloudCover:1},
  ];
  const weather=createWeatherForcing({series,source:'local synthetic test file'});
  nearly(weather.at(6*H).temperatureC,15);
  nearly(weather.at(6*H).cloudCover,0.75);
  const world=createRoomWorld({weatherSeries:series,weatherSource:'test fixture'});
  assert.equal(world.stateAt(6*H).weather.temperatureC,15);
  assert.equal(world.describe().weather.source,'test fixture');
  assert.throws(()=>createWeatherForcing({series}),TypeError);
  assert.throws(()=>createWeatherForcing({series:[
    {timeMs:0,temperatureC:20,cloudCover:0},
    {timeMs:DAY_MS,temperatureC:20,cloudCover:2},
  ],source:'bad'}),RangeError);
  assert.throws(()=>createRoomWorld({weatherPreset:'unknown'}),RangeError);
});

test('invalid room physics cannot silently create unsupported simulations',()=>{
  for(const options of [
    {heatCapacityJPerK:0},{envelopeConductanceWPerK:-1},
    {lampOnThresholdWm2:20,lampOffThresholdWm2:10},
    {lampVisibleRadiantFraction:1.1},
    {initialIndoorTemperatureC:Infinity},
  ]) assert.throws(()=>createRoomWorld(options),RangeError);
  assert.throws(()=>createRoomWorld().stateAt(-1),RangeError);
  assert.throws(()=>createRoomWorld().stateAt(DAY_MS+1),RangeError);
});
