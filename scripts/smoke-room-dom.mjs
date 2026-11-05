// Test the real browser inspector module against a tiny DOM double.
// This validates event wiring + simulation, NOT actual visual layout.
import assert from 'node:assert/strict';
class Element {
  constructor(id=''){
    this.id=id;this.value='';this.checked=false;this.textContent='';
    this.listeners={};this.children=[];this.attributes={};
    this.classList={toggle:()=>{}};
  }
  addEventListener(k,cb){this.listeners[k]=cb;}
  fire(k){assert.ok(this.listeners[k],this.id+' lacks '+k);this.listeners[k]();}
  setAttribute(k,v){this.attributes[k]=String(v);}
  querySelector(){return new Element('circle');}
  replaceChildren(...x){this.children=[...x];}
  append(...x){this.children.push(...x);}
}
const map=new Map(),id=k=>{
  if(!map.has(k))map.set(k,new Element(k));
  return map.get(k);
};
const modalities=['optical','thermal','electrical'].map(v=>{
  const x=new Element(v);x.value=v;x.checked=true;return x;
});
id('sceneDate').value='2026-06-21';
id('weatherMode').value='clear';
id('roomTime').value='43200000';
globalThis.document={
  getElementById:id,
  querySelectorAll:s=>{assert.equal(s,'[data-room-modality]');return modalities;},
  createElement:tag=>new Element(tag),
  addEventListener(){},
};
await import('../app/room-inspector.js');
assert.match(id('runStatus').textContent,/Mundo calculado/);
assert.ok(id('solarAltitude').textContent.endsWith('°'));
assert.ok(id('insideTemp').textContent.endsWith('°C'));
assert.ok(id('sunPatch').attributes.points.length>0);
assert.ok(id('roomIncidences').children.length>0);
const clear=id('outdoorLight').textContent;
id('weatherMode').value='overcast';
id('weatherMode').fire('change');
assert.notEqual(clear,id('outdoorLight').textContent);
assert.match(id('runStatus').textContent,/Mundo calculado/);
id('sceneDate').value='2026-12-21';
id('sceneDate').fire('change');
assert.ok(id('insideTemp').textContent.endsWith('°C'));
for(const x of modalities)x.checked=false;
modalities[0].fire('change');
assert.match(id('runStatus').textContent,/0 incidências/);
assert.ok(id('roomEvents').children.length>0);
assert.equal(id('roomIncidences').children.length,1);
assert.equal(id('roomIncidences').children[0].textContent,'Nenhuma incidência disponível');
id('stepRoom').fire('click');
assert.match(id('timeDisplay').textContent,/^\d{2}:\d{2}$/);
console.log('Real room inspector + simulation work in DOM behavioral smoke; visual layout untested');
