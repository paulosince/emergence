// Run the CURRENT home-page inspector with actual model modules, no UI mock data.
// Small DOM double verifies state and callback wiring, not pixel rendering.
import assert from 'node:assert/strict';

class Element {
  constructor(id=''){
    this.id=id;this.value='';this.checked=false;this.textContent='';
    this.children=[];this.attrs={};this.handlers={};
  }
  setAttribute(name,value){this.attrs[name]=String(value);}
  addEventListener(name,cb){this.handlers[name]=cb;}
  fire(name){
    assert.equal(typeof this.handlers[name],'function',
      this.id+' missing '+name+' callback');
    this.handlers[name]();
  }
  append(...children){this.children.push(...children);}
  replaceChildren(...children){this.children=[...children];}
}
const ids=new Map();
const byId=id=>{
  if(!ids.has(id))ids.set(id,new Element(id));
  return ids.get(id);
};
const modalities=['optical','thermal','electrical'].map(m=>{
  const e=new Element(m);e.value=m;e.checked=true;return e;
});
byId('roomDate').value='2026-06-21';
byId('roomWeather').value='clear';
byId('roomObstacle').checked=true;
byId('roomTimeline').value='0';

globalThis.document={
  getElementById:byId,
  querySelectorAll:selector=>{
    assert.equal(selector,'[data-room-modality]');
    return modalities;
  },
  createElement:tag=>new Element(tag),
  addEventListener(){},
};
await import('../app/room.js');
assert.match(byId('roomStatus').textContent,/Simulação calculada/);
assert.equal(byId('roomDelivered').textContent,'0');
assert.equal(byId('roomClock').textContent,'00:00');
assert.ok(byId('windowOpening').attrs.d.length>10);
assert.ok(byId('doorOpening').attrs.d.length>10);

byId('roomTimeline').value=String(12*3600000);
byId('roomTimeline').fire('input');
assert.equal(byId('roomClock').textContent,'12:00');
assert.equal(byId('lampState').textContent,'Apagada');
assert.ok(byId('sunPatch').attrs.d.length>0);
assert.ok(byId('obstacleShadow').attrs.d.length>0);
assert.ok(Number(byId('roomDelivered').textContent)>0);
assert.ok(byId('roomSensorReadings').children.length>0);
assert.ok(byId('roomIncidenceList').children.length>0);
const sunny=byId('outdoorLight').textContent;

byId('roomWeather').value='overcast';
byId('roomWeather').fire('change');
byId('roomTimeline').value=String(12*3600000);
byId('roomTimeline').fire('input');
assert.notEqual(byId('outdoorLight').textContent,sunny);

byId('roomObstacle').checked=false;
byId('roomObstacle').fire('change');
byId('roomTimeline').value=String(12*3600000);
byId('roomTimeline').fire('input');
assert.equal(byId('obstacleShadow').attrs.d,'');
assert.equal(byId('objectTop').attrs.d,'');

byId('roomDate').value='2026-12-21';
byId('roomDate').fire('change');
byId('roomTimeline').value=String(12*3600000);
byId('roomTimeline').fire('input');
assert.ok(byId('indoorTemp').textContent.endsWith('°C'));

for(const m of modalities)m.checked=false;
modalities[0].fire('change');
byId('roomTimeline').value=String(23*3600000);
byId('roomTimeline').fire('input');
assert.equal(byId('roomDelivered').textContent,'0');
assert.ok(byId('roomEvents').children.length>0);
assert.equal(byId('roomIncidenceList').children[0].textContent,
  'Nenhuma incidência entregue até este instante.');
byId('roomStep').fire('click');
assert.match(byId('roomClock').textContent,/^\d{2}:\d{2}$/);
console.log('Room homepage science + inputs + controls: DOM behavioral smoke passed (not visual QA)');
