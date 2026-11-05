// Replication campaign with explicit distinction between recorded replay,
// fresh re-execution and checkpoint resumption.
import {writeFileSync} from 'node:fs';
import {readSourceRevision} from '../src/research/source-revision.js';
import {buildRoomRecord,independentlyReexecute,
  resumeSavedCheckpoint} from '../src/persistence/records.js';
import {exportScientificArchive,importScientificArchive}
  from '../src/persistence/archive.js';

const flags=process.argv.slice(2);
if(flags.length>1 || flags.some(f=>!f.startsWith('--zip=')))
  throw new Error('Use no flags or --zip=<output.zip>');
const record=buildRoomRecord({
  modalities:['optical','thermal','electrical'],
  weatherPreset:'clear',
  worldOptions:{date:'2026-06-21',opaqueObjectEnabled:true},
  sensorOverrides:{r0:{periodMs:630000,noiseStd:0.05,
    latencyMs:50000}},
  seed:42,
},{softwareRevision:readSourceRevision(new URL('../',import.meta.url))});
const archive=await exportScientificArchive(record);
const imported=await importScientificArchive(archive);
const reexecution=independentlyReexecute(imported);
const resumption=resumeSavedCheckpoint(imported);
if(!reexecution.equivalent || !resumption.equivalent)
  throw new Error('Replication mismatch: '+JSON.stringify({
    reexecution,resumption,
  }));
const output=flags[0]?.slice(6);
if(output) {
  if(!output.endsWith('.zip'))throw new RangeError('Output file must have .zip extension');
  writeFileSync(output,archive);
}
console.log(JSON.stringify({
  campaign:'EMERGENCE 0.7 reproducibility',
  conclusion:'Same deterministic implementation and declared world, not physical external validity',
  archiveByteCount:archive.length,
  sampleCount:record.result.summary.sampleCount,
  deliveredCount:record.result.summary.deliveredCount,
  checkpointAtMs:record.checkpoint.cursor.processedThroughMs,
  deterministicReexecution:reexecution,
  actualCheckpointResume:resumption,
  outputZip:output??null,
},null,2));
