import { createRoomWorld } from './room-world.js';
import { RoomSensorEnvironment } from './room-sensors.js';
import { DAY_MS } from './solar.js';

export const ROOM_SCENARIO_ID='guarulhos-winter-room-clear-v1';
export const ROOM_HORIZON_MS=DAY_MS-1;
const SENSORS=Object.freeze([
  {id:'r0',channelId:'c0',modality:'optical',periodMs:900000,latencyMs:200,
   type:'floor-radiometer',eastM:0,northM:0.7},
  {id:'r1',channelId:'c1',modality:'optical',periodMs:900000,latencyMs:300,
   type:'floor-radiometer',eastM:-1.3,northM:0.7},
  {id:'r2',channelId:'c2',modality:'optical',periodMs:900000,latencyMs:200,
   type:'outdoor-radiometer'},
  {id:'r3',channelId:'c3',modality:'thermal',periodMs:900000,latencyMs:400,
   type:'indoor-temperature-voltage'},
  {id:'r4',channelId:'c4',modality:'thermal',periodMs:900000,latencyMs:400,
   type:'outdoor-temperature-voltage'},
  {id:'r5',channelId:'c5',modality:'electrical',periodMs:900000,latencyMs:100,
   type:'lamp-current'},
].map(Object.freeze));
const MODALITIES=['optical','thermal','electrical'];
const ALLOWED_SENSOR_KEYS=new Set([
  'periodMs','phaseMs','latencyMs','quantum','noiseStd','emitMode','minDelta',
]);
export function createRoomScenario({
  modalities=MODALITIES,weatherPreset='clear',worldOptions={},
  sensorOverrides={},seed=42,endTimeMs=ROOM_HORIZON_MS,
}={}) {
  if (!Array.isArray(modalities) ||
      modalities.some(x=>!MODALITIES.includes(x)) ||
      new Set(modalities).size!==modalities.length)
    throw new RangeError('Invalid or repeated room modality');
  if (!worldOptions || typeof worldOptions!=='object' ||
      Array.isArray(worldOptions) ||
      !sensorOverrides || typeof sensorOverrides!=='object' ||
      Array.isArray(sensorOverrides))
    throw new TypeError('World parameters and sensor overrides must be records');
  const selected=SENSORS.filter(s=>modalities.includes(s.modality));
  const ids=new Set(selected.map(s=>s.id));
  if(Object.keys(sensorOverrides).some(id=>!ids.has(id)))
    throw new RangeError('Override for missing/inactive sensor');
  const world=createRoomWorld({...worldOptions,weatherPreset});
  const transducers=selected.map(s=>{
    const override=sensorOverrides[s.id]??{};
    if (!override || typeof override!=='object' ||
        Array.isArray(override) ||
        Object.keys(override).some(k=>!ALLOWED_SENSOR_KEYS.has(k)))
      throw new RangeError('Invalid room transducer override');
    return {id:s.id,channelId:s.channelId,
      periodMs:s.periodMs,latencyMs:s.latencyMs,
      emitMode:'change',...override};
  });
  const couplings=selected.map(s=>({
    channelId:s.channelId,type:s.type,
    ...(s.type==='floor-radiometer'?
      {eastM:s.eastM,northM:s.northM}:{}),
  }));
  return Object.freeze({
    world,environment:new RoomSensorEnvironment({world,couplings}),
    transducers,seed,endTimeMs,researchScenarioId:ROOM_SCENARIO_ID,
  });
}