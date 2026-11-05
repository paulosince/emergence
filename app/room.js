// EMERGENCE room inspector. The SIMULATOR and TRANSDUCERS are the only
// source of visual quantities; the diagram merely projects their geometry.
// Neither playback speed nor GUI state writes into the scientific engine.
import { createRoomScenario } from '../src/room/room-scenario.js';
import { runExperiment } from '../src/runtime/experiment-runner.js';
import { DiagnosticEngine } from '../src/engines/diagnostic-engine.js';
import { DAY_MS } from '../src/room/solar.js';

const el=id=>document.getElementById(id);
const sensors=document.querySelectorAll('[data-room-modality]');
const format=new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2});
const num=x=>format.format(x);
const clock=t=>{
  const mins=Math.floor(t/60000);
  return String(Math.floor(mins/60)).padStart(2,'0')+':'+
    String(mins%60).padStart(2,'0');
};
const channelNames=Object.freeze({
  r0:'Luz no piso · ponto 1',
  r1:'Luz no piso · ponto 2',
  r2:'Radiação externa',
  r3:'Temperatura interna · tensão',
  r4:'Temperatura externa · tensão',
  r5:'Corrente da lâmpada',
});
const unitNames=Object.freeze({
  r0:'W/m²',r1:'W/m²',r2:'W/m²',r3:'V',r4:'V',r5:'A',
});
const eventNames=Object.freeze({
  'lamp.initial':'Estado inicial da lâmpada',
  'lamp.toggle':'Fotocélula alterou a lâmpada',
});
let scene=null,result=null,tMs=0,playback=null;

function setText(id,value){el(id).textContent=value;}
function setAttribute(id,name,value){el(id).setAttribute(name,String(value));}
function project(east,north,up=0){
  return {x:360+55*east-52*north,
    y:314+19*east-28*north-65*up};
}
function shapeFromWorld(points){
  if(!points || points.length<3) return '';
  return points.map((p,i)=>{
    const q=project(p.x,p.y,p.z??0);
    return (i?'L':'M')+q.x.toFixed(3)+','+q.y.toFixed(3);
  }).join(' ')+' Z';
}
function planePoint(east,north,up=0){return {x:east,y:north,z:up};}
function drawGeometry(geometry) {
  const w=geometry.widthM/2,d=geometry.depthM/2,H=geometry.heightM;
  const P=planePoint;
  setAttribute('wallNorth','d',shapeFromWorld([
    P(-w,d,0),P(w,d,0),P(w,d,H),P(-w,d,H),
  ]));
  setAttribute('wallWest','d',shapeFromWorld([
    P(-w,-d,0),P(-w,d,0),P(-w,d,H),P(-w,-d,H),
  ]));
  setAttribute('floorSurface','d',shapeFromWorld([
    P(-w,-d),P(-w,d),P(w,d),P(w,-d),
  ]));
  const window=geometry.window,wx=window.widthM/2,cx=window.centerEastM;
  const zl=window.sillM,zh=zl+window.heightM;
  setAttribute('windowOpening','d',shapeFromWorld([
    P(cx-wx,d,zl),P(cx+wx,d,zl),P(cx+wx,d,zh),P(cx-wx,d,zh),
  ]));
  const door=geometry.door,dy=door.widthM/2;
  setAttribute('doorOpening','d',shapeFromWorld([
    P(-w,door.centerNorthM-dy,0),P(-w,door.centerNorthM+dy,0),
    P(-w,door.centerNorthM+dy,door.heightM),
    P(-w,door.centerNorthM-dy,door.heightM),
  ]));
  const b=geometry.opaqueObject;
  for(const id of ['objectLeft','objectFront','objectTop']) {
    setAttribute(id,'d','');
  }
  if(b) {
    const x1=b.centerEastM-b.widthM/2,x2=b.centerEastM+b.widthM/2;
    const y1=b.centerNorthM-b.depthM/2,y2=b.centerNorthM+b.depthM/2;
    setAttribute('objectLeft','d',shapeFromWorld([
      P(x1,y1,0),P(x1,y2,0),P(x1,y2,b.heightM),P(x1,y1,b.heightM),
    ]));
    setAttribute('objectFront','d',shapeFromWorld([
      P(x1,y1,0),P(x2,y1,0),P(x2,y1,b.heightM),P(x1,y1,b.heightM),
    ]));
    setAttribute('objectTop','d',shapeFromWorld([
      P(x1,y1,b.heightM),P(x2,y1,b.heightM),
      P(x2,y2,b.heightM),P(x1,y2,b.heightM),
    ]));
  }
  const lightFixture=project(0,0,geometry.heightM-.15);
  for(const id of ['lampAuraRing','lampFixture']) {
    setAttribute(id,'cx',lightFixture.x);
    setAttribute(id,'cy',lightFixture.y);
  }
}

function stop(){
  if(playback!==null) clearInterval(playback);
  playback=null;
  setText('roomPlay','Reproduzir');
}
function redraw(timeMs) {
  if(!scene) return;
  tMs=Math.min(Math.max(0,timeMs),scene.endTimeMs);
  el('roomTimeline').value=String(tMs);
  setText('roomTimeOutput',clock(tMs));
  setText('roomClock',clock(tMs));
  const s=scene.world.stateAt(tMs);
  const light=s.lighting;
  const day=s.sun.isAboveHorizon;
  const cloudy=s.weather.cloudCover>.5;
  setText('phaseLabel',day?(cloudy?'Dia encoberto':'Dia claro'):'Noite');
  setText('sunElevation',num(s.sun.altitudeDeg)+'°');
  setText('outdoorLight',num(light.outdoorIrradianceWm2)+' W/m²');
  setText('floorLight',num(scene.world.floorIrradianceAt(tMs,.65,.7))+' W/m²');
  setText('lampState',light.lampOn?'Acesa':'Apagada');
  setText('outdoorTemp',num(s.thermal.outdoorTemperatureC)+' °C');
  setText('indoorTemp',num(s.thermal.indoorTemperatureC)+' °C');

  setAttribute('sunPatch','d',shapeFromWorld(
    light.sunlightFloorPolygon));
  setAttribute('obstacleShadow','d',shapeFromWorld(
    light.obstacleShadowFloorPolygon));
  setAttribute('skyBackdrop','fill',!day?'#25394e':
    cloudy?'#d9e1ed':'#ebf3f5');
  setAttribute('windowOpening','fill',!day?'#273950':
    cloudy?'#acc1ce':'#a4d7ef');
  setAttribute('wallNorth','fill',!day?'#b5b6b5':
    cloudy?'#d4dbe4':'#e7ebef');
  setAttribute('wallWest','fill',!day?'#8c9195':
    cloudy?'#b9c8d5':'#d1dfe9');
  setAttribute('floorSurface','fill',!day?'#9aabb4':
    cloudy?'#c4d3dc':'#dae5ea');
  setAttribute('lampAuraRing','opacity',light.lampOn?'.85':'0');
  setAttribute('lampFixture','fill',light.lampOn?'#fff2b7':'#8b9eab');
  setAttribute('sunPatch','fill-opacity',
    (Math.max(0,Math.min(1,light.transmittedDirectPowerW/1400))*.65+.12)
      .toFixed(3));

  const explanation=!day
    ? 'Sol abaixo do horizonte: não entra luz solar. A fotocélula externa pode manter a lâmpada ligada.'
    : light.transmittedDirectPowerW===0
      ? 'O Sol está acima do horizonte, mas não ilumina diretamente esta janela: orientação e geometria importam.'
      : 'A luz atravessa a janela; seu alcance e a sombra do objeto derivam da direção solar e das interseções geométricas.';
  setText('roomExplanation',explanation);

  const delivered=result.incidences.filter(i=>i.arrivedAtMs<=tMs);
  setText('roomDelivered',String(delivered.length));
  setText('roomIncidenceCount',delivered.length+' incidências até '+clock(tMs));

  const readings=el('roomSensorReadings');
  readings.replaceChildren();
  const last=new Map();
  for(const i of delivered) last.set(i.transducerId,i);
  for(const config of result.manifest.transducers) {
    const div=document.createElement('div');
    const value=last.get(config.id);
    div.textContent=(channelNames[config.id]??config.id)+': ';
    const strong=document.createElement('strong');
    strong.textContent=value?num(value.measurement)+' '+
      (unitNames[config.id]??''):'—';
    div.append(strong);
    readings.append(div);
  }
  if(!result.manifest.transducers.length){
    const d=document.createElement('div');
    d.textContent='Todas as modalidades desativadas.';
    readings.append(d);
  }

  const incidenceList=el('roomIncidenceList');
  incidenceList.replaceChildren();
  for(const i of delivered.slice(-8).reverse()) {
    const li=document.createElement('li');
    const name=document.createElement('span');
    name.textContent=(channelNames[i.transducerId]??i.transducerId)+
      ' · '+num(i.measurement)+' '+(unitNames[i.transducerId]??'');
    const time=document.createElement('span');
    time.textContent=clock(i.arrivedAtMs);
    li.append(name,time);
    incidenceList.append(li);
  }
  if(!delivered.length){
    const li=document.createElement('li');
    li.textContent='Nenhuma incidência entregue até este instante.';
    incidenceList.append(li);
  }

  const events=el('roomEvents');
  events.replaceChildren();
  for(const e of scene.world.eventsThrough(tMs).slice(-5).reverse()){
    const row=document.createElement('li');
    const name=document.createElement('span');
    name.textContent=(eventNames[e.type]??e.type)+
      ' · '+(e.stateOn?'acesa':'apagada');
    const stamp=document.createElement('span');
    stamp.textContent=clock(e.timeMs);
    row.append(name,stamp);events.append(row);
  }
  setAttribute('chartCursor','x1',(620*tMs/DAY_MS).toFixed(2));
  setAttribute('chartCursor','x2',(620*tMs/DAY_MS).toFixed(2));
}

function drawDayChart(){
  const samples=[];
  for(let t=0;t<=DAY_MS;t+=900000) {
    samples.push({
      t,value:scene.world.floorIrradianceAt(t,.65,.7),
    });
  }
  const maximum=Math.max(1,...samples.map(s=>s.value));
  const points=samples.map(s=>{
    const x=620*s.t/DAY_MS;
    const y=145-135*s.value/maximum;
    return x.toFixed(2)+','+y.toFixed(2);
  }).join(' ');
  setAttribute('daylightCurve','points',points);
}

function restart() {
  stop();
  try{
    const modalities=[...sensors].filter(x=>x.checked).map(x=>x.value);
    scene=createRoomScenario({
      modalities,
      weatherPreset:el('roomWeather').value,
      worldOptions:{
        date:el('roomDate').value,
        opaqueObjectEnabled:el('roomObstacle').checked,
      },
    });
    result=runExperiment({...scene,engine:new DiagnosticEngine()});
    drawGeometry(scene.world.describe().geometry);
    drawDayChart();
    el('roomTimeline').max=String(scene.endTimeMs);
    setText('roomStatus','Simulação calculada · '+result.summary.deliveredCount+
      ' incidências');
    redraw(0);
  }catch(error){
    setText('roomStatus','Erro na simulação: '+error.message);
    throw error;
  }
}

el('roomPlay').addEventListener('click',()=>{
  if(playback!==null){stop();return;}
  if(tMs>=scene.endTimeMs)redraw(0);
  setText('roomPlay','Pausar');
  playback=setInterval(()=>{
    redraw(tMs+600000); // Ten simulated minutes per visual tick.
    if(tMs>=scene.endTimeMs)stop();
  },75);
});
el('roomStep').addEventListener('click',()=>{
  stop();redraw(tMs+1800000);
});
el('roomTimeline').addEventListener('input',()=>{
  stop();redraw(Number(el('roomTimeline').value));
});
for(const id of ['roomDate','roomWeather','roomObstacle'])
  el(id).addEventListener('change',restart);
for(const m of sensors)m.addEventListener('change',restart);
el('exportRoom').addEventListener('click',()=>{
  if(!result)return;
  const data={status:'researcher-only environment, no representation',
    ...result,physicalEvents:scene.world.eventsThrough(scene.endTimeMs)};
  const blob=new Blob([JSON.stringify(data,null,2)],{
    type:'application/json',
  });
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='emergence-room-experiment.json';a.click();
  setTimeout(()=>URL.revokeObjectURL(url),500);
});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden)stop();
});
restart();
