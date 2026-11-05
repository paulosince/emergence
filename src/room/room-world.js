import { approximateSun } from './solar.js';
import { sunPatchOnFloor,boxShadowOnFloor,pointInPolygon,polygonArea } from './geometry.js';

// Naturalistic but BOUNDED scene: stationary shell, a north window, one box,
// astronomical solar direction, a scalar illumination model and a binary lamp.
// There is no raytraced radiance, dynamic weather, live meteorological feed,
// heat, acoustics or free rigid-body dynamics in this first room slice.
export const ROOM_WORLD_ID='bounded-daylit-room-v1';
export const ROOM_DAY_MS=86400000;
const ranges={
  latitudeDeg:[-66,66],dayOfYear:[1,365],widthM:[2,10],
  depthM:[2,10],heightM:[2,6],windowWidthM:[0.1,5],
  windowSillM:[0,4],windowTopM:[0.1,5],
  cloudCover:[0,1],lampThreshold:[0,1],
  lampIlluminance:[0,2],boxWidthM:[0.05,1.5],
  boxDepthM:[0.05,1.5],boxHeightM:[0.05,1.5],
  boxX:[-4,4],boxY:[-4,4],
};
function validate(p) {
  for(const [key,[min,max]] of Object.entries(ranges)){
    if(!Number.isFinite(p[key])||p[key]<min||p[key]>max||
      (key==='dayOfYear'&&!Number.isInteger(p[key])))
      throw new RangeError('Invalid bounded room parameter: '+key);
  }
  if(p.windowWidthM>=p.widthM||
     p.windowTopM>=p.heightM||p.windowTopM<=p.windowSillM)
    throw new RangeError('Window must fit inside north wall');
  if(Math.abs(p.boxX)+p.boxWidthM/2>=p.widthM/2||
     Math.abs(p.boxY)+p.boxDepthM/2>=p.depthM/2||
     p.boxHeightM>=p.heightM)
    throw new RangeError('Opaque box must fit entirely inside room');
}
export function createRoomWorld(options={}) {
  if(!options||typeof options!=='object'||Array.isArray(options))
    throw new TypeError('Room parameters must be an object');
  const p=Object.freeze({
    latitudeDeg:-23.55,dayOfYear:172,
    widthM:4,depthM:3,heightM:2.7,
    windowWidthM:1.8,windowSillM:0.8,windowTopM:2.1,
    boxX:0.25,boxY:-0.25,boxWidthM:0.45,
    boxDepthM:0.5,boxHeightM:0.7,
    cloudCover:0,lampThreshold:0.05,lampIlluminance:0.4,
    ...options,
  });
  if(Object.keys(options).some(x=>!Object.hasOwn(ranges,x)))
    throw new RangeError('Unknown room configuration parameter');
  validate(p);
  const windowArea=p.windowWidthM*(p.windowTopM-p.windowSillM);
  const floorArea=p.widthM*p.depthM;

  function checkTime(timeMs){
    if(!Number.isFinite(timeMs)||timeMs<0||timeMs>ROOM_DAY_MS)
      throw new RangeError('Room observation time must fall within its 24h solar day');
  }
  function skyAt(tMs) {
    const sun=approximateSun({
      latitudeDeg:p.latitudeDeg,dayOfYear:p.dayOfYear,
      solarHour:24*tMs/ROOM_DAY_MS,
    });
    const elev=Math.max(0,sun.up);
    const cloud=p.cloudCover;
    const clearFactor=(1-cloud)**2;
    const outdoorIlluminance=elev*
      (0.45*clearFactor+0.35*(1-0.55*cloud));
    // Diffuse through window, spatially uniform INSIDE in this model.
    // Direct beam is projected geometrically, separately.
    const diffuseRoomIlluminance=elev*(0.12+0.25*cloud)*
      (1-0.55*cloud)*windowArea/floorArea;
    return {sun,outdoorIlluminance,diffuseRoomIlluminance,
      directStrength:elev*clearFactor};
  }
  function lampOnAt(tMs){
    checkTime(tMs);
    return skyAt(tMs).outdoorIlluminance<p.lampThreshold;
  }
  // Events are independent of sensory sampling or UI. Seek state flips
  // on a finite reference grid, then bisect within 1 ms. This is an
  // instrument control, not a solar ephemeris.
  const switchEvents=[];
  let prev=lampOnAt(0);
  const STEP=60000;
  for(let t=STEP;t<=ROOM_DAY_MS;t+=STEP){
    const now=lampOnAt(t);
    if(now!==prev){
      let lo=t-STEP,hi=t;
      for(let i=0;i<20 && hi-lo>0.5;i++){
        const mid=(lo+hi)/2;
        if(lampOnAt(mid)===prev)lo=mid;
        else hi=mid;
      }
      switchEvents.push(Object.freeze({
        eventId:'room-lamp-'+switchEvents.length,
        type:'lamp.photocell-switch',
        timeMs:hi,source:'fixed-outdoor-photocell',
        lampOn:now,
      }));
    }
    prev=now;
  }
  const immutableEvents=Object.freeze(switchEvents);
  function stateAt(timeMs){
    checkTime(timeMs);
    const sky=skyAt(timeMs);
    const patch=sunPatchOnFloor(sky.sun,p);
    const shadow=boxShadowOnFloor(sky.sun,p);
    const lampOn=lampOnAt(timeMs);
    return Object.freeze({
      timeMs,solarHour:24*timeMs/ROOM_DAY_MS,
      sun:sky.sun,
      cloudCover:p.cloudCover,
      outdoorIlluminance:sky.outdoorIlluminance,
      diffuseRoomIlluminance:sky.diffuseRoomIlluminance,
      directStrength:sky.directStrength,
      lampOn,
      projectedWindowPatch:patch,
      projectedBoxShadow:shadow,
      projectedWindowAreaM2:polygonArea(patch),
      projectedBoxShadowAreaM2:polygonArea(shadow),
    });
  }
  function floorIlluminanceAt(timeMs,{x,y}){
    if(!Number.isFinite(x)||!Number.isFinite(y)||
       Math.abs(x)>p.widthM/2||Math.abs(y)>p.depthM/2)
      throw new RangeError('Floor sensor must be inside room');
    const state=stateAt(timeMs);
    const inBeam=pointInPolygon({x,y},state.projectedWindowPatch);
    const inShadow=pointInPolygon({x,y},state.projectedBoxShadow);
    // Inverse-square attenuation from a ceiling lamp (deliberately not
    // physically calibrated lux). Uses exactly the same state as UI.
    const dist2=(x*x+y*y+p.heightM*p.heightM);
    const artificial=state.lampOn
      ? p.lampIlluminance*p.heightM*p.heightM/dist2 : 0;
    return state.diffuseRoomIlluminance+
      (inBeam&&!inShadow?state.directStrength:0)+artificial;
  }
  function eventsThrough(timeMs){
    checkTime(timeMs);
    return Object.freeze(immutableEvents.filter(e=>e.timeMs<=timeMs));
  }
  function describe(){
    return Object.freeze({
      modelId:ROOM_WORLD_ID,modelVersion:'0.1.0',
      units:{time:'ms',distance:'m',floorLight:'relative-normalized-intensity'},
      axes:{x:'east',y:'north',z:'up'},
      shell:{door:{wall:'south',open:false},
        window:{wall:'north',widthM:p.windowWidthM,
          sillM:p.windowSillM,topM:p.windowTopM}},
      object:{type:'stationary-opaque-box',position:[p.boxX,p.boxY],
        size:[p.boxWidthM,p.boxDepthM,p.boxHeightM]},
      parameters:p,solarTimeConvention:'local solar time, 0 to 24; non-leap day',
      modelScope:'window projection and box floor shadow, diffuse term, fixed photocell lamp; no realistic sky optics',
    });
  }
  return Object.freeze({stateAt,floorIlluminanceAt,eventsThrough,describe});
}