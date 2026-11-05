// Each sensor is a physical coupling to the SAME world, with independent
// sampling/latency. World truth is stored only in the researcher's manifest.
import { createRoomWorld,ROOM_DAY_MS } from './room-world.js';

const REGISTRY=Object.freeze([
  Object.freeze({id:'s0',channelId:'c0',source:'floor-light',
    modality:'optical',x:0,y:0.0,periodMs:900000,latencyMs:120}),
  Object.freeze({id:'s1',channelId:'c1',source:'floor-light',
    modality:'optical',x:1.25,y:-0.8,periodMs:900000,latencyMs:170}),
  Object.freeze({id:'s2',channelId:'c2',source:'outdoor-photocell',
    modality:'optical',periodMs:900000,latencyMs:90}),
  Object.freeze({id:'s3',channelId:'c3',source:'lamp-current',
    modality:'electrical',periodMs:900000,latencyMs:130}),
]);
export class RoomSignalEnvironment {
  #world;
  #channels;
  constructor(world,couplings){
    if(!world||typeof world.floorIlluminanceAt!=='function')
      throw new TypeError('Requires an operational room model');
    if(!Array.isArray(couplings))throw new TypeError('Couplings must be an array');
    const map=new Map();
    for(const c of couplings){
      if(!c||typeof c.channelId!=='string'||!c.channelId.trim()||
        map.has(c.channelId))throw new RangeError('Duplicate or invalid channel ID');
      if(!['floor-light','outdoor-photocell','lamp-current'].includes(c.source))
        throw new RangeError('Unknown room sensor coupling');
      if(c.source==='floor-light'){
        // Validation must not rely on whether the sensor ever actually samples.
        world.floorIlluminanceAt(0,{x:c.x,y:c.y});
      }
      map.set(c.channelId,Object.freeze({...c}));
    }
    this.#world=world;this.#channels=map;
  }
  readAt(channelId,timeMs){
    const c=this.#channels.get(channelId);
    if(!c)throw new RangeError('Unknown room sensory channel');
    if(c.source==='floor-light')
      return this.#world.floorIlluminanceAt(timeMs,{x:c.x,y:c.y});
    const state=this.#world.stateAt(timeMs);
    if(c.source==='outdoor-photocell')return state.outdoorIlluminance;
    return state.lampOn?1:0; // normalized lamp circuit current, ideal binary switch.
  }
  specification(){
    return {model:'room-scalar-sensory-coupling-v1',
      world:this.#world.describe(), // researcher only
      couplings:[...this.#channels.values()].map(c=>({...c}))};
  }
  validateHorizon(endTimeMs){this.#world.stateAt(endTimeMs);}
  validateTransducers(sensors){
    for(const s of sensors){
      if(!this.#channels.has(s.config.channelId))
        throw new RangeError('Sensor has no physical room coupling');
    }
  }
}
export function createRoomScenario({
  worldOptions={},
  modalities=['optical','electrical'],
  sensorOverrides={},
  seed=42,
  endTimeMs=ROOM_DAY_MS,
}={}){
  if(!Array.isArray(modalities)||modalities.some(x=>!['optical','electrical'].includes(x))||
     new Set(modalities).size!==modalities.length)
     throw new RangeError('Unknown or duplicate modality');
  if(!sensorOverrides||typeof sensorOverrides!=='object'||Array.isArray(sensorOverrides))
    throw new TypeError('Sensor overrides must be a record');
  const selected=REGISTRY.filter(c=>modalities.includes(c.modality));
  const allowedIds=new Set(selected.map(c=>c.id));
  if(Object.keys(sensorOverrides).some(id=>!allowedIds.has(id)))
    throw new RangeError('Unknown or disabled room sensor override');
  const allowed=new Set(['periodMs','phaseMs','latencyMs','noiseStd','quantum',
    'emitMode','minDelta']);
  const sensors=selected.map(c=>{
    const ov=sensorOverrides[c.id]??{};
    if(!ov||typeof ov!=='object'||Array.isArray(ov)||
       Object.keys(ov).some(x=>!allowed.has(x)))
      throw new RangeError('Invalid sensor parameter override');
    return {
      id:c.id,channelId:c.channelId,periodMs:c.periodMs,
      latencyMs:c.latencyMs,emitMode:'change',quantum:0.001,...ov,
    };
  });
  const couplings=selected.map(c=>({
    channelId:c.channelId,source:c.source,
    modality:c.modality,...(c.source==='floor-light'?{x:c.x,y:c.y}:{}),
  }));
  const world=createRoomWorld(worldOptions);
  return Object.freeze({
    environment:new RoomSignalEnvironment(world,couplings),
    transducers:sensors,endTimeMs,seed,world,
    researchScenarioId:'north-window-solar-room-v1',
  });
}
