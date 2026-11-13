import {Experiment} from './core.js';
const x=new Experiment({repeat:3,linkRepeat:2,bin:2,maxGap:12});
// Only environment events are scripted. No Uint/Upro IDs or factory calls.
const signals=[];for(let i=0;i<12;i++){signals.push({channel:'sensor-A',amplitude:2,time:10*i});signals.push({channel:'sensor-B',amplitude:4,time:10*i+4});}signals.sort((a,b)=>a.time-b.time);for(const signal of signals)x.feed(signal);
const result=x.report();console.log(JSON.stringify({signals:signals.length,units:result.units,edges:result.edges,audit:result.audit,deliveries:result.events.filter(e=>e.kind==='scheduled-delivery').length},null,2));
