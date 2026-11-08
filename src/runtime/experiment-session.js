// Fully captured synchronous event-session for the current deterministic kernel.
// Designed to compare BYTE-EQUIVALENT research histories with runExperiment.
// Checkpoints contain genuine pending scheduler events, sensor emitted states,
// PRNG states, diagnostic engine state and explicit immutable world provenance.
// No replay-from-start masquerading as a checkpoint. Node and browser ESM.
import { assertExperimentEngine } from '../contracts/engine.js';
import { createIncidence } from '../contracts/incidence.js';
import { NumericTransducer } from '../sensory/numeric-transducer.js';
import { EventScheduler } from './event-scheduler.js';
import { SimulatedClock } from './simulated-clock.js';
import { checkpointSensorRng } from './checkpoint-rng.js';
import { TEMPO_SOURCE_COMMIT } from '../tempo/reference-runner.js';
import { EMERGENCE_VERSION } from '../research/version.js';

export const CHECKPOINT_SCHEMA='emergence-experiment-checkpoint-v1';
const RUN_POLICY='event-time-then-insertion-sequence';
const clone=x=>structuredClone(x);
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

export class ExperimentSession {
  #environment;#engine;#sensors;#rngs;#scheduler;#clock;
  #manifest;#trace=[];#incidences=[];#counts;
  #nextId=0;#finished=false;#lastBoundaryMs=0;

  constructor({
    environment,transducers,engine,seed=0,endTimeMs,
    maxEvents=100000,softwareRevision=null,
  }) {
    assertExperimentEngine(engine);
    if(!environment || typeof environment.readAt!=='function' ||
       typeof environment.specification!=='function') {
      throw new TypeError('Operational environment required');
    }
    if(!Number.isInteger(seed)||seed<0||seed>0xffffffff ||
       !Number.isFinite(endTimeMs)||endTimeMs<0 ||
       !Number.isInteger(maxEvents)||maxEvents<1 ||
       (softwareRevision!==null &&
        (typeof softwareRevision!=='string'||!softwareRevision.trim())) ||
       !Array.isArray(transducers)) {
      throw new RangeError('Invalid experiment session configuration');
    }
    this.#environment=environment;this.#engine=engine;
    this.#sensors=transducers.map(c=>new NumericTransducer(c));
    if(new Set(this.#sensors.map(s=>s.config.id)).size!==this.#sensors.length)
      throw new RangeError('Duplicate transducer IDs');
    environment.validateTransducers?.(this.#sensors);
    environment.validateHorizon?.(endTimeMs);
    this.#rngs=new Map(this.#sensors.map(s=>[
      s.config.id,checkpointSensorRng(seed,s.config.id),
    ]));
    this.#scheduler=new EventScheduler();
    this.#clock=new SimulatedClock();
    this.#counts={
      processedEvents:0,sampleCount:0,suppressedCount:0,
      deliveredCount:0,engineEventCount:0,
    };
    this.#manifest={
      schemaVersion:'1.0.0',
      software:{name:'EMERGENCE',version:EMERGENCE_VERSION,
        revision:softwareRevision},
      execution:'deterministic-event-simulation',
      seed,endTimeMs,maxEvents,
      tempoReferenceCommit:TEMPO_SOURCE_COMMIT,
      environment:environment.specification(),
      transducers:this.#sensors.map(s=>({...s.config})),
      engine:typeof engine.describe==='function'?
        engine.describe():{id:'unspecified'},
      eventOrdering:'simulated-time-then-insertion-sequence',
    };
    for(let i=0;i<this.#sensors.length;i++){
      const s=this.#sensors[i];
      if(s.config.phaseMs<=endTimeMs)
        this.#scheduler.schedule(s.config.phaseMs,'sample',
          {sensorIndex:i,tickIndex:0});
    }
  }

  get timeMs(){return this.#clock.timeMs;}
  get endTimeMs(){return this.#manifest.endTimeMs;}
  get complete(){return this.#finished;}
  // Simulated time through which EVERY scheduled event has been processed.
  get executedThroughMs(){return this.#lastBoundaryMs;}

  // Read-only views for observers (UI, monitors). They return copies and
  // never advance the clock, the scheduler or the engine.
  manifest(){return clone(this.#manifest);}
  progress(){
    return {
      executedThroughMs:this.#lastBoundaryMs,
      clockMs:this.#clock.timeMs,
      complete:this.#finished,
      pendingScheduledEvents:this.#scheduler.size,
      ...clone(this.#counts),
    };
  }
  incidencesFrom(start=0){
    if(!Number.isInteger(start)||start<0)
      throw new RangeError('Invalid incidence index');
    return clone(this.#incidences.slice(start));
  }
  traceFrom(start=0){
    if(!Number.isInteger(start)||start<0)
      throw new RangeError('Invalid trace index');
    return clone(this.#trace.slice(start));
  }
  // Engine snapshot() is a read-only contract method; copied for observers.
  engineSnapshot(){return clone(this.#engine.snapshot());}

  #collectEngineEvents(){
    const events=this.#engine.drainEvents();
    if(!Array.isArray(events))
      throw new TypeError('drainEvents must return an array');
    for(const detail of events){
      if(!detail || typeof detail!=='object')
        throw new TypeError('Invalid engine event');
      this.#trace.push({
        order:this.#trace.length+1,
        timeMs:Number.isFinite(detail.timeMs)?detail.timeMs:
          this.#clock.timeMs,
        recordedAtMs:this.#clock.timeMs,
        type:'engine.event',detail:clone(detail),
      });
      this.#counts.engineEventCount++;
    }
  }

  #step(){
    if(++this.#counts.processedEvents>this.#manifest.maxEvents)
      throw new RangeError('Event limit exceeded');
    const event=this.#scheduler.next();
    this.#clock.advanceTo(event.timeMs);
    this.#engine.advanceTo(this.#clock.timeMs);
    this.#collectEngineEvents();
    if(event.kind==='sample'){
      const {sensorIndex,tickIndex}=event.payload;
      const s=this.#sensors[sensorIndex];
      const result=s.sampleAt(this.#clock.timeMs,
        this.#environment,this.#rngs.get(s.config.id));
      this.#counts.sampleCount++;
      let incidence=null;
      if(result.emitted){
        incidence=createIncidence({
          incidenceId:'i'+(++this.#nextId),
          transducerId:s.config.id,
          observedAtMs:result.observedAtMs,
          arrivedAtMs:result.arrivedAtMs,
          measurement:result.measurement,
        });
        this.#scheduler.schedule(incidence.arrivedAtMs,'deliver',
          {incidence});
      }else this.#counts.suppressedCount++;
      this.#trace.push({
        order:this.#trace.length+1,timeMs:this.#clock.timeMs,
        type:'sensor.sample',transducerId:s.config.id,
        incidenceId:incidence?.incidenceId??null,
        rawValue:result.rawValue,measurement:result.measurement,
        emitted:result.emitted,
      });
      const nextTick=tickIndex+1;
      const tNext=s.config.phaseMs+nextTick*s.config.periodMs;
      if(tNext<=this.endTimeMs)
        this.#scheduler.schedule(tNext,'sample',{
          sensorIndex,tickIndex:nextTick,
        });
    }else if(event.kind==='deliver'){
      const {incidence}=event.payload;
      this.#trace.push({
        order:this.#trace.length+1,timeMs:this.#clock.timeMs,
        type:'incidence.delivered',incidenceId:incidence.incidenceId,
        transducerId:incidence.transducerId,
        observedAtMs:incidence.observedAtMs,
        arrivedAtMs:incidence.arrivedAtMs,
        measurement:incidence.measurement,
      });
      this.#engine.ingest(incidence);
      this.#engine.advanceTo(this.#clock.timeMs);
      this.#collectEngineEvents();
      this.#incidences.push(incidence);
      this.#counts.deliveredCount++;
    }else throw new RangeError('Unsupported scheduled event');
  }

  // Process all scheduled events through the specified time, INCLUDING
  // every event sharing the boundary timestamp. No invented partial event.
  advanceThrough(timeMs){
    if(this.#finished) throw new Error('Cannot advance a completed experiment');
    if(!Number.isFinite(timeMs)||timeMs<this.#lastBoundaryMs ||
       timeMs>this.endTimeMs)
      throw new RangeError('Experimental checkpoint boundary outside run');
    while(this.#scheduler.size &&
       this.#scheduler.peekTime()<=timeMs) this.#step();
    this.#lastBoundaryMs=timeMs;
    // Deliberately do NOT advance the engine to an event-free boundary:
    // doing so would invent a separate engine operation absent from continuous.
    return this;
  }

  checkpoint(){
    if(this.#finished)throw new Error('Completed experiment cannot checkpoint');
    if(typeof this.#engine.checkpoint!=='function' ||
       typeof this.#engine.restore!=='function') {
      throw new TypeError('Engine has no actual checkpoint/restore contract');
    }
    return clone({
      schema:CHECKPOINT_SCHEMA,
      simulationVersion:EMERGENCE_VERSION,
      policy:RUN_POLICY,
      world: {
        kind:'immutable-analytic-world',
        specification:this.#environment.specification(),
        capturedAtMs:this.#lastBoundaryMs,
        physicalState:this.#environment.researcherCheckpointStateAt?.(
          this.#lastBoundaryMs)??null,
        // Analytic world is functionally reconstructed from parameters.
        // Its actual state/events at the boundary are also recorded and
        // compared before continuing, rather than silently assumed equal.
        reference:'versioned scenario constructor and physical parameters',
      },
      manifest:this.#manifest,
      cursor:{
        clockMs:this.#clock.timeMs,
        processedThroughMs:this.#lastBoundaryMs,
        nextIncidenceNumber:this.#nextId,
      },
      scheduler:this.#scheduler.snapshot(),
      sensorStates:this.#sensors.map(s=>({
        id:s.config.id,state:s.snapshot(),
        rngState:this.#rngs.get(s.config.id).state(),
      })),
      engineState:this.#engine.checkpoint(),
      counts:this.#counts,
      trace:this.#trace,
      incidences:this.#incidences,
    });
  }

  static restore(checkpoint,configuration){
    if(!checkpoint || checkpoint.schema!==CHECKPOINT_SCHEMA ||
       checkpoint.simulationVersion!==EMERGENCE_VERSION ||
       checkpoint.policy!==RUN_POLICY ||
       !checkpoint.cursor || !checkpoint.scheduler ||
       !Array.isArray(checkpoint.sensorStates)){
      throw new RangeError('Invalid or incompatible checkpoint');
    }
    const instance=new ExperimentSession(configuration);
    if(!equal(instance.#manifest,checkpoint.manifest) ||
       !equal(instance.#environment.specification(),
         checkpoint.world?.specification)){
      throw new RangeError('Checkpoint world, engine or experiment configuration mismatch');
    }
    const researcherState=instance.#environment.researcherCheckpointStateAt?.(
      checkpoint.world?.capturedAtMs)??null;
    if(!equal(researcherState,checkpoint.world?.physicalState) ||
       checkpoint.world?.capturedAtMs !==
         checkpoint.cursor?.processedThroughMs) {
      throw new RangeError('Captured world physical state differs from reconstructed dynamics');
    }
    const {clockMs,processedThroughMs,nextIncidenceNumber}
      =checkpoint.cursor;
    if(![clockMs,processedThroughMs].every(Number.isFinite) ||
       clockMs<0 || processedThroughMs<clockMs ||
       processedThroughMs>instance.endTimeMs ||
       !Number.isInteger(nextIncidenceNumber) ||
       nextIncidenceNumber<0 ||
       checkpoint.sensorStates.length!==instance.#sensors.length) {
      throw new RangeError('Invalid checkpoint cursor or sensor count');
    }
    instance.#clock=new SimulatedClock(clockMs);
    instance.#lastBoundaryMs=processedThroughMs;
    instance.#scheduler.restore(checkpoint.scheduler);
    if(instance.#scheduler.snapshot().nowMs!==clockMs)
      throw new RangeError('Scheduler and clock disagree');
    instance.#nextId=nextIncidenceNumber;
    for(let i=0;i<instance.#sensors.length;i++){
      const sensor=instance.#sensors[i];
      const item=checkpoint.sensorStates[i];
      if(item?.id!==sensor.config.id)throw new RangeError('Sensor ordering changed');
      sensor.restore(item.state);
      instance.#rngs.set(item.id,checkpointSensorRng(
        instance.#manifest.seed,item.id,item.rngState));
    }
    if(typeof instance.#engine.restore!=='function' ||
       typeof instance.#engine.checkpoint!=='function')
      throw new TypeError('Engine cannot restore actual internal state');
    instance.#engine.restore(clone(checkpoint.engineState));
    instance.#counts=clone(checkpoint.counts);
    instance.#trace=clone(checkpoint.trace);
    instance.#incidences=clone(checkpoint.incidences);
    if(instance.#counts.sampleCount+instance.#counts.deliveredCount !==
       instance.#counts.processedEvents ||
       instance.#counts.deliveredCount!==instance.#incidences.length ||
       instance.#counts.sampleCount<0 ||
       instance.#counts.suppressedCount<0 ||
       instance.#counts.engineEventCount<0 ||
       instance.#trace.length !==
        instance.#counts.sampleCount+
        instance.#counts.deliveredCount+
        instance.#counts.engineEventCount ||
       instance.#nextId !==
        instance.#counts.sampleCount-instance.#counts.suppressedCount) {
      throw new RangeError('Checkpoint counters are incoherent');
    }
    return instance;
  }

  finish(){
    if(!this.#finished){
      this.advanceThrough(this.endTimeMs);
      this.#clock.advanceTo(this.endTimeMs);
      this.#engine.advanceTo(this.endTimeMs);
      this.#collectEngineEvents();
      this.#finished=true;
    }
    const c=this.#counts;
    return clone({
      manifest:this.#manifest,
      summary:{
        sampleCount:c.sampleCount,suppressedCount:c.suppressedCount,
        emittedCount:c.sampleCount-c.suppressedCount,
        deliveredCount:c.deliveredCount,
        pendingScheduledEvents:this.#scheduler.size,
        processedEvents:c.processedEvents,engineEventCount:c.engineEventCount,
      },
      incidences:this.#incidences,
      trace:this.#trace,
      finalSnapshot:this.#engine.snapshot(),
    });
  }
}
export function runCheckpointedExperiment(configuration,{stopAfterMs=null}={}){
  const s=new ExperimentSession(configuration);
  if(stopAfterMs===null)return {result:s.finish(),checkpoint:null};
  s.advanceThrough(stopAfterMs);
  return {result:null,checkpoint:s.checkpoint()};
}