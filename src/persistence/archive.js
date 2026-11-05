// Portable, dependency-free scientific ZIP package.
// ZIP method 0 (STORED) only, CRC32 for ZIP consistency and SHA-256
// for verified content digests. No ZIP64, data descriptors or zip bombs.
// The archive is untrusted: bounded fields and explicit allowlist on import.
import {toCsv} from '../research/csv.js';

export const ARCHIVE_SCHEMA='emergence-experiment-package-v1';
const MAX_BYTES=25_000_000;
const MAX_ENTRIES=8;
const enc=new TextEncoder();
const dec=new TextDecoder('utf-8',{fatal:true});
const clone=x=>structuredClone(x);

function crc32(bytes) {
  let c=0xffffffff;
  for(const b of bytes) {
    c^=b;
    for(let k=0;k<8;k++)c=(c>>>1)^(0xedb88320&-(c&1));
  }
  return (c^0xffffffff)>>>0;
}
function hashBytes(bytes) {
  if(!globalThis.crypto?.subtle) {
    throw new Error('SHA-256 requires a secure browser context or Node with Web Crypto');
  }
  return globalThis.crypto.subtle.digest('SHA-256',bytes).then(raw=>
    [...new Uint8Array(raw)].map(b=>b.toString(16).padStart(2,'0')).join(''));
}

function zipFiles(entries) {
  const parts=[],central=[];
  let cursor=0;
  for(const {name,data} of entries) {
    const n=enc.encode(name);
    if(!n.length || n.length>120 || n.includes(47) || n.includes(92) ||
       data.length>MAX_BYTES)throw new RangeError('Unsafe ZIP entry');
    const head=new Uint8Array(30+n.length);
    const dv=new DataView(head.buffer);
    dv.setUint32(0,0x04034b50,true);
    dv.setUint16(4,20,true); // version needed
    dv.setUint16(6,0x0800,true); // UTF-8 flag only
    dv.setUint16(8,0,true); // stored (no compression)
    dv.setUint32(14,crc32(data),true);
    dv.setUint32(18,data.length,true);dv.setUint32(22,data.length,true);
    dv.setUint16(26,n.length,true);head.set(n,30);
    parts.push(head,data);
    const centralHead=new Uint8Array(46+n.length);
    const cd=new DataView(centralHead.buffer);
    cd.setUint32(0,0x02014b50,true);
    cd.setUint16(4,20,true);cd.setUint16(6,20,true);
    cd.setUint16(8,0x0800,true);cd.setUint16(10,0,true);
    cd.setUint32(16,crc32(data),true);
    cd.setUint32(20,data.length,true);cd.setUint32(24,data.length,true);
    cd.setUint16(28,n.length,true);cd.setUint32(42,cursor,true);
    centralHead.set(n,46);
    central.push(centralHead);
    cursor+=head.length+data.length;
  }
  const centralSize=central.reduce((sum,x)=>sum+x.length,0);
  const end=new Uint8Array(22);
  const ev=new DataView(end.buffer);
  ev.setUint32(0,0x06054b50,true);
  ev.setUint16(8,entries.length,true);ev.setUint16(10,entries.length,true);
  ev.setUint32(12,centralSize,true);ev.setUint32(16,cursor,true);
  const total=cursor+centralSize+end.length;
  if(total>MAX_BYTES)throw new RangeError('Package exceeds size limit');
  const output=new Uint8Array(total);let at=0;
  for(const item of [...parts,...central,end]){
    output.set(item,at);at+=item.length;
  }
  return output;
}

function unpackStoredZip(input) {
  const bytes=input instanceof Uint8Array ? input:
    input instanceof ArrayBuffer ? new Uint8Array(input) : null;
  if(!bytes || bytes.length>MAX_BYTES || bytes.length<22)
    throw new RangeError('Invalid or excessively large ZIP archive');
  const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  let endPos=-1;
  for(let offset=bytes.length-22;offset>=Math.max(0,bytes.length-65557);
      offset--) {
    if(v.getUint32(offset,true)===0x06054b50 &&
       offset+22+v.getUint16(offset+20,true)===bytes.length) {
      endPos=offset;break;
    }
  }
  if(endPos<0)throw new RangeError('ZIP central-directory terminator missing');
  const count=v.getUint16(endPos+10,true);
  if(count>MAX_ENTRIES || count!==v.getUint16(endPos+8,true))
    throw new RangeError('ZIP entry count invalid');
  const size=v.getUint32(endPos+12,true);
  const directory=v.getUint32(endPos+16,true);
  if(directory+size!==endPos)throw new RangeError('ZIP directory bounds incorrect');
  let offset=directory;
  const entries=new Map();
  for(let i=0;i<count;i++) {
    if(offset+46>endPos || v.getUint32(offset,true)!==0x02014b50)
      throw new RangeError('Invalid ZIP central header');
    const flags=v.getUint16(offset+8,true);
    const method=v.getUint16(offset+10,true);
    const crc=v.getUint32(offset+16,true);
    const compressedSize=v.getUint32(offset+20,true);
    const uncompressedSize=v.getUint32(offset+24,true);
    const nameLength=v.getUint16(offset+28,true);
    const extraLength=v.getUint16(offset+30,true);
    const commentLength=v.getUint16(offset+32,true);
    const localOffset=v.getUint32(offset+42,true);
    const next=offset+46+nameLength+extraLength+commentLength;
    if(method!==0 || flags!==0x0800 || next>endPos ||
       compressedSize!==uncompressedSize ||
       localOffset+30>directory ||
       nameLength>120 || nameLength===0) {
      throw new RangeError('Unsupported or unsafe ZIP entry');
    }
    const name=dec.decode(bytes.subarray(offset+46,offset+46+nameLength));
    if(name.includes('/') || name.includes('\\') ||
       name==='.' || name==='..' || entries.has(name)) {
      throw new RangeError('Illegal ZIP entry name or duplicate');
    }
    const lnameLength=v.getUint16(localOffset+26,true);
    const lextraLength=v.getUint16(localOffset+28,true);
    const start=localOffset+30+lnameLength+lextraLength;
    const localName=dec.decode(bytes.subarray(localOffset+30,
      localOffset+30+lnameLength));
    if(v.getUint32(localOffset,true)!==0x04034b50 ||
       v.getUint16(localOffset+8,true)!==0 ||
       v.getUint16(localOffset+6,true)!==0x0800 ||
       localName!==name || start+compressedSize>directory ||
       v.getUint32(localOffset+14,true)!==crc ||
       v.getUint32(localOffset+18,true)!==compressedSize) {
      throw new RangeError('ZIP local/central metadata mismatch');
    }
    const data=bytes.slice(start,start+compressedSize);
    if(crc32(data)!==crc)throw new RangeError('ZIP CRC mismatch');
    entries.set(name,data);
    offset=next;
  }
  if(offset!==endPos)throw new RangeError('Unexpected ZIP directory content');
  return entries;
}

export function validateResearchRecord(record){
  if(!record || record.schema!=='emergence-record-v1' ||
     record.scenario?.kind!=='room-v1' ||
     !record.scenario.options || !record.result?.manifest ||
     !Array.isArray(record.result?.incidences) ||
     !Array.isArray(record.result?.trace) ||
     record.result.manifest.software?.name!=='EMERGENCE' ||
     record.result.manifest.environment?.world?.modelId!==
       'naturalistic-room-thermal-optical-v1') {
    throw new RangeError('Invalid or unsupported scientific record');
  }
  if(record.checkpoint!==null && record.checkpoint!==undefined &&
     record.checkpoint.schema!=='emergence-experiment-checkpoint-v1'){
    throw new RangeError('Invalid checkpoint in scientific record');
  }
  return true;
}

export async function exportScientificArchive(record) {
  validateResearchRecord(record);
  const fields=['incidenceId','transducerId','observedAtMs',
    'arrivedAtMs','measurement'];
  const contents=[
    {name:'record.json',data:enc.encode(JSON.stringify(record,null,2))},
    {name:'incidences.csv',data:enc.encode(toCsv(record.result.incidences,fields))},
    {name:'trace.json',data:enc.encode(JSON.stringify(record.result.trace,null,2))},
  ];
  if(record.checkpoint)contents.push({
    name:'checkpoint.json',
    data:enc.encode(JSON.stringify(record.checkpoint,null,2)),
  });
  const integrity={schema:ARCHIVE_SCHEMA,
    digestAlgorithm:'SHA-256',zipMethod:'STORE',
    entries:{}};
  for(const item of contents)
    integrity.entries[item.name]=await hashBytes(item.data);
  contents.push({name:'integrity.json',
    data:enc.encode(JSON.stringify(integrity,null,2))});
  return zipFiles(contents);
}

export async function importScientificArchive(buffer) {
  const entries=unpackStoredZip(buffer);
  const allowed=new Set(['record.json','incidences.csv','trace.json',
    'checkpoint.json','integrity.json']);
  if(!entries.has('integrity.json') || !entries.has('record.json') ||
     [...entries.keys()].some(x=>!allowed.has(x)))
    throw new RangeError('Missing mandatory record or unexpected ZIP entry');
  const integrity=JSON.parse(dec.decode(entries.get('integrity.json')));
  if(integrity.schema!==ARCHIVE_SCHEMA ||
     integrity.digestAlgorithm!=='SHA-256' ||
     integrity.zipMethod!=='STORE') {
    throw new RangeError('Unrecognized integrity manifest');
  }
  const expectedNames=Object.keys(integrity.entries??{}).sort();
  const actualNames=[...entries.keys()].filter(x=>x!=='integrity.json').sort();
  if(JSON.stringify(expectedNames)!==JSON.stringify(actualNames) ||
     !expectedNames.includes('trace.json') ||
     !expectedNames.includes('incidences.csv'))
    throw new RangeError('Archive integrity manifest and contents mismatch');
  for(const name of expectedNames) {
    const expected=integrity.entries[name];
    if(typeof expected!=='string'||!/^[0-9a-f]{64}$/.test(expected) ||
       await hashBytes(entries.get(name))!==expected) {
      throw new RangeError('SHA-256 integrity failed: '+name);
    }
  }
  const record=JSON.parse(dec.decode(entries.get('record.json')));
  validateResearchRecord(record);
  if(JSON.stringify(record.result.trace,null,2)!==
     dec.decode(entries.get('trace.json'))) {
    throw new RangeError('Trace copy disagrees with record');
  }
  const field=['incidenceId','transducerId','observedAtMs',
    'arrivedAtMs','measurement'];
  if(toCsv(record.result.incidences,field)!==
     dec.decode(entries.get('incidences.csv'))) {
    throw new RangeError('CSV copy disagrees with record');
  }
  if(Boolean(record.checkpoint)!==entries.has('checkpoint.json') ||
     (record.checkpoint &&
      JSON.stringify(record.checkpoint,null,2)!==
       dec.decode(entries.get('checkpoint.json')))) {
    throw new RangeError('Checkpoint copy disagrees with record');
  }
  return clone(record);
}
