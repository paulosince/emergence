// P0.3 validation: multi-day room composed of validated single-day worlds.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createMultiDayRoomWorld,multiDaySchedule} from '../src/room/multi-day-room.js';
import {createMultiDayRoomScenario} from '../src/room/multi-day-room-scenario.js';
import {createRoomWorld} from '../src/room/room-world.js';
import {DAY_MS} from '../src/room/solar.js';
import {runExperiment} from '../src/runtime/experiment-runner.js';
import {ExecutionController} from '../src/runtime/execution-controller.js';
import {DiagnosticEngine} from '../src/engines/diagnostic-engine.js';

const plan=multiDaySchedule({days:4,weather:['clear','overcast','overcast','clear'],
  objects:[true,true,false,true]});

test('each day equals the validated single-day model with the carried temperature',()=>{
  const w=createMultiDayRoomWorld({schedule:plan});
  w.describe().days.forEach((d,k)=>{
    const ref=createRoomWorld({date:d.date,weatherPreset:d.weatherPreset,
      opaqueObjectEnabled:d.opaqueObjectEnabled,initialIndoorTemperatureC:d.initialIndoorTemperatureC});
    for(const local of [0,3600000,43200000,DAY_MS-1]){
      const a=w.stateAt(k*DAY_MS+local),b=ref.stateAt(local);
      assert.equal(a.thermal.indoorTemperatureC,b.thermal.indoorTemperatureC);
      assert.equal(a.lighting.lampOn,b.lighting.lampOn);
      assert.equal(a.day,k);
      assert.equal(w.floorIrradianceAt(k*DAY_MS+local,0.65,0.7),ref.floorIrradianceAt(local,0.65,0.7));
    }
  });
});

test('indoor temperature and lamp are continuous across every midnight',()=>{
  const w=createMultiDayRoomWorld({schedule:plan});
  for(let k=1;k<plan.length;k++){
    const before=w.dayWorlds()[k-1].stateAt(DAY_MS),after=w.stateAt(k*DAY_MS);
    assert.equal(after.thermal.indoorTemperatureC,before.thermal.indoorTemperatureC);
    assert.equal(after.lighting.lampOn,before.lighting.lampOn);
  }
});

test('outdoor forcing steps at midnight only when the weather preset changes (declared limit)',()=>{
  const w=createMultiDayRoomWorld({schedule:plan});
  const jumps=[];
  for(let k=1;k<plan.length;k++){
    const before=w.dayWorlds()[k-1].stateAt(DAY_MS).thermal.outdoorTemperatureC;
    const after=w.stateAt(k*DAY_MS).thermal.outdoorTemperatureC;
    jumps.push({changed:plan[k].weatherPreset!==plan[k-1].weatherPreset,jump:Math.abs(after-before)});
  }
  for(const j of jumps)if(!j.changed)assert.ok(j.jump<1e-9,JSON.stringify(j));
  assert.ok(jumps.some(j=>j.changed&&j.jump>0),'preset change produces a step');
});

test('events: weather changes and object interventions at midnight; single lamp.initial',()=>{
  const w=createMultiDayRoomWorld({schedule:plan});
  const ev=w.eventsThrough(w.describe().endMs);
  assert.equal(ev.filter(e=>e.type==='lamp.initial').length,1);
  assert.deepEqual(ev.filter(e=>e.type==='weather.change').map(e=>e.day),[1,3]);
  assert.deepEqual(ev.filter(e=>e.type.startsWith('intervention.object')).map(e=>[e.day,e.type]),
    [[2,'intervention.object-removed'],[3,'intervention.object-inserted']]);
  for(let k=1;k<ev.length;k++)assert.ok(ev[k].timeMs>=ev[k-1].timeMs);
  assert.throws(()=>w.stateAt(w.describe().endMs+1));
});

test('schedule is deterministic; dates are consecutive',()=>{
  const a=multiDaySchedule({days:10,scheduleSeed:5}),b=multiDaySchedule({days:10,scheduleSeed:5});
  assert.deepEqual(a,b);
  assert.equal(a[0].date,'2026-06-21');assert.equal(a[9].date,'2026-06-30');
  assert.equal(multiDaySchedule({startDate:'2026-12-30',days:3})[2].date,'2027-01-01');
});

test('engine isolation and controller parity over several days',()=>{
  const mk=()=>createMultiDayRoomScenario({schedule:plan});
  const {world,...cfg}=mk();
  const ref=runExperiment({...cfg,engine:new DiagnosticEngine()});
  for(const i of ref.incidences)
    assert.deepEqual(Object.keys(i).sort(),['arrivedAtMs','incidenceId','measurement','observedAtMs','transducerId']);
  const {world:w2,...cfg2}=mk();
  const c=new ExecutionController({...cfg2,engine:new DiagnosticEngine()}).start();
  c.advanceTo(DAY_MS*1.5).pause('t').resume().runToEnd();
  assert.deepEqual(c.result(),ref);
  assert.ok(ref.summary.deliveredCount>0);
});
