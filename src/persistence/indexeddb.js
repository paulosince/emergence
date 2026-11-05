// Browser-only, IndexedDB v2 schema with explicit transaction semantics.
// No server/cloud storage, no hidden localStorage fallback, no engine access.
export const DB_NAME='emergence-research';
export const DB_VERSION=2;
const clone=x=>structuredClone(x);

function openDb(idb) {
  if(!idb || typeof idb.open!=='function') {
    return Promise.reject(new Error('IndexedDB is unavailable; export a ZIP locally instead'));
  }
  return new Promise((resolve,reject)=>{
    const req=idb.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=event=>{
      const db=req.result;
      const oldVersion=event.oldVersion;
      if(oldVersion<1) {
        const runs=db.createObjectStore('runs',{keyPath:'id'});
        runs.createIndex('savedAt','savedAt',{unique:false});
        db.createObjectStore('configs',{keyPath:'id'});
      }
      if(oldVersion<2) {
        const cp=db.createObjectStore('checkpoints',{keyPath:'id'});
        cp.createIndex('savedAt','savedAt',{unique:false});
      }
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error??new Error('IndexedDB open failed'));
    req.onblocked=()=>reject(new Error('Please close other old EMERGENCE tabs to upgrade the database'));
  });
}

function operate(db,storeName,mode,action) {
  return new Promise((resolve,reject)=>{
    let tx,req,result;
    try{
      tx=db.transaction(storeName,mode);
      const store=tx.objectStore(storeName);
      req=action(store);
      req.onsuccess=()=>{result=req.result;};
      req.onerror=()=>{ /* transaction.onerror handles rejection */ };
      tx.oncomplete=()=>resolve(clone(result));
      tx.onerror=()=>reject(tx.error??new Error('IndexedDB transaction failed'));
      tx.onabort=()=>reject(tx.error??new Error('IndexedDB transaction aborted'));
    }catch(error){reject(error);}
  });
}

export async function openExperimentStore(idb=globalThis.indexedDB) {
  const db=await openDb(idb);
  const assertId=id=>{
    if(typeof id!=='string'||!id||id.length>120)
      throw new RangeError('Record identifier required');
  };
  return Object.freeze({
    databaseVersion:DB_VERSION,
    saveRun:async entry=>{
      if(!entry || typeof entry!=='object')throw new TypeError('Run entry required');
      assertId(entry.id);
      if(!Number.isFinite(entry.savedAt))
        throw new RangeError('Invalid local save date');
      await operate(db,'runs','readwrite',store=>store.put(clone(entry)));
      if(entry.record?.checkpoint) {
        await operate(db,'checkpoints','readwrite',store=>
          store.put({id:entry.id,savedAt:entry.savedAt,
            checkpoint:clone(entry.record.checkpoint)}));
      }
      return entry.id;
    },
    loadRun:async id=>{
      assertId(id);
      return (await operate(db,'runs','readonly',s=>s.get(id)))??null;
    },
    listRuns:async()=>{
      const all=await operate(db,'runs','readonly',s=>s.getAll());
      return all.map(x=>({
        id:x.id,savedAt:x.savedAt,
        date:x.record?.scenario?.options?.worldOptions?.date??null,
        deliveredCount:x.record?.result?.summary?.deliveredCount??null,
      })).sort((a,b)=>b.savedAt-a.savedAt);
    },
    loadCheckpoint:async id=>{
      assertId(id);
      return (await operate(db,'checkpoints','readonly',s=>s.get(id)))?.checkpoint??null;
    },
    deleteRun:async id=>{
      assertId(id);
      await operate(db,'runs','readwrite',s=>s.delete(id));
      await operate(db,'checkpoints','readwrite',s=>s.delete(id));
    },
    saveConfig:async entry=>{
      if(!entry || typeof entry!=='object')throw new TypeError('Config required');
      assertId(entry.id);
      await operate(db,'configs','readwrite',s=>s.put(clone(entry)));
    },
    loadConfig:async id=>{
      assertId(id);
      return (await operate(db,'configs','readonly',s=>s.get(id)))??null;
    },
    close:()=>db.close(),
  });
}
