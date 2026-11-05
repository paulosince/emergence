import {test} from 'node:test';
import assert from 'node:assert/strict';
import {openExperimentStore,DB_NAME,DB_VERSION}
  from '../src/persistence/indexeddb.js';
import {buildRoomRecord} from '../src/persistence/records.js';

// A small IndexedDB transaction/scheduling test double, NOT a browser itself.
// Includes version-1 migration, delayed asynchronous requests, keyPath and
// a single multi-store transaction for run+checkpoint atomicity.
function makeDb({oldVersion=1}={}) {
  const data=new Map(oldVersion>=1 ? [
    ['runs',new Map()],
    ['configs',new Map()],
  ] : []);
  const upgradeOperations=[],transactions=[];
  let currentVersion=oldVersion;
  const db={
    createObjectStore(name) {
      if(data.has(name))throw new Error('Existing object store: '+name);
      data.set(name,new Map());upgradeOperations.push(name);
      return {createIndex:()=>{}};
    },
    transaction(names,mode) {
      const namesList=Array.isArray(names)?names:[names];
      transactions.push({names:namesList,mode});
      let pending=0,completed=false;
      const tx={
        error:null,
        objectStore(name) {
          if(!namesList.includes(name) || !data.has(name))
            throw new Error('Store not in transaction: '+name);
          function schedule(fn) {
            pending++;
            const req={result:undefined,error:null};
            queueMicrotask(()=>{
              try{req.result=fn();}
              catch(e){req.error=e;tx.error=e;tx.onerror?.();return;}
              req.onsuccess?.();
              pending--;
              if(pending===0 && !completed) {
                completed=true;
                queueMicrotask(()=>tx.oncomplete?.());
              }
            });
            return req;
          }
          return {
            put:entry=>schedule(()=>{
              const copied=structuredClone(entry);
              data.get(name).set(copied.id,copied);
              return copied.id;
            }),
            get:id=>schedule(()=>structuredClone(data.get(name).get(id))),
            getAll:()=>schedule(()=>
              [...data.get(name).values()].map(value=>structuredClone(value))),
            delete:id=>schedule(()=>{data.get(name).delete(id);return undefined;}),
          };
        },
      };
      return tx;
    },
    close(){},
  };
  return {
    upgradeOperations,transactions,data,
    idb:{
      open(name,version) {
        assert.equal(name,DB_NAME);
        assert.equal(version,DB_VERSION);
        const req={result:db,error:null};
        queueMicrotask(()=>{
          if(version>currentVersion) {
            const old=currentVersion;
            currentVersion=version;
            req.onupgradeneeded?.({oldVersion:old});
          }
          req.onsuccess?.();
        });
        return req;
      },
    },
  };
}

test('migrate version 1 to v2 without replacing existing research stores',async()=>{
  const mock=makeDb({oldVersion:1});
  const store=await openExperimentStore(mock.idb);
  assert.equal(store.databaseVersion,2);
  assert.deepEqual(mock.upgradeOperations,['checkpoints']);
  store.close();
});

test('new browser DB v0 creates all three stores for run, checkpoint and configs',async()=>{
  const mock=makeDb({oldVersion:0});
  await openExperimentStore(mock.idb);
  assert.deepEqual(mock.upgradeOperations,
    ['runs','configs','checkpoints']);
});

test('persisted run and checkpoint use a single atomic multi-store transaction',async()=>{
  const mock=makeDb({oldVersion:1});
  const store=await openExperimentStore(mock.idb);
  const record=buildRoomRecord({modalities:[]});
  const entry={id:'case-1',savedAt:12345,record};
  await store.saveRun(entry);
  const save=mock.transactions.filter(x=>x.mode==='readwrite' &&
    x.names.includes('runs'));
  assert.deepEqual(save.map(x=>x.names),
    [['runs','checkpoints']]);
  assert.deepEqual(await store.loadRun('case-1'),entry);
  assert.deepEqual(await store.loadCheckpoint('case-1'),record.checkpoint);
  assert.deepEqual(await store.listRuns(),[{
    id:'case-1',savedAt:12345,
    date:'2026-06-21',deliveredCount:0,
  }]);
  await store.saveConfig({id:'current-room',scenario:record.scenario});
  assert.deepEqual(await store.loadConfig('current-room'),
    {id:'current-room',scenario:record.scenario});
  assert.equal(await store.loadRun('nonexistent'),null);
  await store.deleteRun('case-1');
  assert.equal(await store.loadRun('case-1'),null);
  assert.equal(await store.loadCheckpoint('case-1'),null);
  assert.deepEqual(mock.transactions.filter(x=>x.mode==='readwrite' &&
    x.names.includes('checkpoints')).map(x=>x.names),
    [['runs','checkpoints'],['runs','checkpoints']]);
});

test('resaving a run without checkpoint clears the previous checkpoint',async()=>{
  const store=await openExperimentStore(makeDb().idb);
  const record=buildRoomRecord({modalities:[]});
  await store.saveRun({id:'test',savedAt:1,record});
  assert.ok(await store.loadCheckpoint('test'));
  await store.saveRun({id:'test',savedAt:2,
    record:{...record,checkpoint:null}});
  assert.equal(await store.loadCheckpoint('test'),null);
});

test('invalid storage records do not silently create orphan checkpoint entries',async()=>{
  const store=await openExperimentStore(makeDb().idb);
  await assert.rejects(()=>store.saveRun({id:'',savedAt:1}),RangeError);
  await assert.rejects(()=>store.saveRun({id:'valid',savedAt:Infinity}),
    RangeError);
  await assert.rejects(()=>store.loadRun(''),RangeError);
});
