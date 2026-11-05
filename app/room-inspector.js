// Observer-only inspector. Never controls the physical world from rendering.
import {createRoomScenario} from '../src/room/room-scenario.js';
import {runExperiment} from '../src/runtime/experiment-runner.js';
import {DiagnosticEngine} from '../src/engines/diagnostic-engine.js';
const $=id=>document.getElementById(id);
const inputs=[...document.querySelectorAll('[data-room-modality]')];
const H=3600000,MIN=60000;
const num=(v,n=1)=>new Intl.NumberFormat('pt-BR',{maximumFractionDigits:n}).format(v);
const time=t=>{const m=Math.floor(t/MIN);return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');};
const names={r0:'Luz no piso S0',r1:'Luz no piso S1',r2:'Luz exterior',r3:'Temperatura interna',r4:'Temperatura externa',r5:'Corrente da lâmpada'};
let scene,result,now=12*H,timer=null;
function stop(){if(timer!==null)clearInterval(timer);timer=null;$('playRoom').textContent='Reproduzir';}
function rows(id,entries,empty){
  const el=$(id);el.replaceChildren();
  if(!entries.length){const li=document.createElement('li');li.textContent=empty;el.append(li);return;}
  for(const [label,stamp] of entries){
    const li=document.createElement('li'),a=document.createElement('span'),b=document.createElement('span');
    a.textContent=label;b.textContent=stamp;li.append(a,b);el.append(li);
  }
}
function render(t){
  if(!scene)return;
  now=Math.max(0,Math.min(scene.endTimeMs,t));
  $('roomTime').value=String(now);
  $('timeDisplay').textContent=time(now);
  const world=scene.world,state=world.stateAt(now),L=state.lighting,T=state.thermal;
  $('solarAltitude').textContent=num(state.sun.altitudeDeg)+'°';
  $('outdoorLight').textContent=num(L.outdoorIrradianceWm2)+' W/m²';
  $('nearLight').textContent=num(world.floorIrradianceAt(now,0,0.7))+' W/m²';
  $('farLight').textContent=num(world.floorIrradianceAt(now,-1.3,0.7))+' W/m²';
  $('outsideTemp').textContent=num(T.outdoorTemperatureC)+' °C';
  $('insideTemp').textContent=num(T.indoorTemperatureC)+' °C';
  $('lampState').textContent=L.lampOn?'Acesa':'Apagada';
  $('lampIndicator').classList.toggle('on',L.lampOn);
  $('lampMarker').querySelector('circle').classList.toggle('on',L.lampOn);
  // SVG = top-down x(east),y(north) of the CALCULATED aperture light.
  const coords=points=>points.map(p=>(350+90*p.x).toFixed(2)+','+(42+90*(2-p.y)).toFixed(2)).join(' ');
  $('sunPatch').setAttribute('points',coords(L.sunlightFloorPolygon));
  $('sunPatch').setAttribute('opacity',String(Math.min(0.9,L.transmittedDirectPowerW/600)));
  const shadow=$('objectShadow');
  if(shadow)shadow.setAttribute('points',coords(L.obstacleShadowFloorPolygon||[]));
  $('sunDirection').setAttribute('visibility',state.sun.isAboveHorizon?'visible':'hidden');
  $('sunDirection').setAttribute('d','M'+(350+state.sun.east*45).toFixed(2)+' '+(85-state.sun.north*30).toFixed(2)+' L350 116');
  $('sunText').textContent=state.sun.isAboveHorizon?'SOL · '+num(state.sun.altitudeDeg,0)+'°':'SOL ABAIXO DO HORIZONTE';
  const arrived=result.incidences.filter(i=>i.arrivedAtMs<=now);
  $('roomCount').textContent=arrived.length+' incidências até '+time(now);
  rows('roomIncidences',arrived.slice(-10).reverse().map(i=>[
    (names[i.transducerId]||i.transducerId)+' · '+num(i.measurement,3),time(i.arrivedAtMs)
  ]),'Nenhuma incidência disponível');
  rows('roomEvents',world.eventsThrough(now).slice(-8).reverse().map(e=>[
    e.type==='lamp.initial'?'Condição inicial: '+(e.stateOn?'acesa':'apagada'):
    'Fotocélula: lâmpada '+(e.stateOn?'acesa':'apagada'),time(e.timeMs)
  ]),'Sem evento físico registrado');
}
function configure(){
  stop();
  try{
    scene=createRoomScenario({
      worldOptions:{date:$('sceneDate').value},
      weatherPreset:$('weatherMode').value,
      modalities:inputs.filter(i=>i.checked).map(i=>i.value),
    });
    result=runExperiment({...scene,engine:new DiagnosticEngine()});
    $('runStatus').textContent='Mundo calculado · '+result.summary.deliveredCount+' incidências';
    $('roomTime').max=String(scene.endTimeMs);
    render(now);
  }catch(e){$('runStatus').textContent='Falha de simulação: '+e.message;throw e;}
}
$('sceneDate').addEventListener('change',configure);
$('weatherMode').addEventListener('change',configure);
for(const i of inputs)i.addEventListener('change',configure);
$('roomTime').addEventListener('input',()=>{stop();render(Number($('roomTime').value));});
$('stepRoom').addEventListener('click',()=>{stop();render(now+15*MIN);});
$('playRoom').addEventListener('click',()=>{
  if(timer!==null){stop();return;}
  if(now>=scene.endTimeMs-15*MIN)render(0);
  $('playRoom').textContent='Pausar';
  timer=setInterval(()=>{render(now+15*MIN);if(now>=scene.endTimeMs)stop();},85);
});
$('exportRoom').addEventListener('click',()=>{
  const payload={instrument:'EMERGENCE room prototype',
    scientificLimitations:'Idealized solar, optical, thermal, no learning',
    ...result,researcherEvents:scene.world.eventsThrough(scene.endTimeMs)};
  const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='emergence-room.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),500);
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
configure();
