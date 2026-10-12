// Explicit test-only database. Normal local/Vercel operation always uses MongoDB.
import {Readable} from 'node:stream';import crypto from 'node:crypto';
const names=['users','patients','visits','audit','sessions','challenges','uploads'];
const err=(message,status=409)=>Object.assign(new Error(message),{status});
export class MemoryStore {
 constructor(){this.data=Object.fromEntries(names.map(n=>[n,[]]));this.versions=Object.fromEntries(names.map(n=>[n,{}]));this.files=new Map();this.chunks=new Map();this.locks=new Set();}
 async ready(){return this;}
 async seed(users){for(const u of users)if(!this.data.users.some(x=>x.id===u.id)){this.data.users.push(structuredClone(u));this.versions.users[u.id]=0;}}
 async load(){return {data:structuredClone(this.data),versions:structuredClone(this.versions)};}
 async commit(base,data,versions){const next=structuredClone(this.data),vers=structuredClone(this.versions);for(const c of names){const old=new Map(base[c].map(x=>[x.id,x]));for(const row of data[c]){const prev=old.get(row.id);old.delete(row.id);if(!prev||JSON.stringify(prev)!==JSON.stringify(row)){const present=next[c].find(x=>x.id===row.id);if(prev&&(!present||vers[c][row.id]!==versions[c][row.id]))throw err('Record changed in another request. Refresh and retry.');if(!prev&&present)throw err('Duplicate ID');next[c]=next[c].filter(x=>x.id!==row.id);next[c].push(structuredClone(row));vers[c][row.id]=prev?versions[c][row.id]+1:0;}}for(const row of old.values()){if(vers[c][row.id]!==versions[c][row.id])throw err('Record changed');next[c]=next[c].filter(x=>x.id!==row.id);delete vers[c][row.id];}}
 const phones=new Set(),emails=new Set(),active=new Set();for(const p of next.patients){if(phones.has(p.mobile)||p.email&&emails.has(p.email))throw err('Patient already registered');phones.add(p.mobile);if(p.email)emails.add(p.email);}for(const v of next.visits)if(v.status!=='reviewed'){if(active.has(v.patientId))throw err('Active visit already exists');active.add(v.patientId);}this.data=next;this.versions=vers;}
 async lock(key,fn){if(this.locks.has(key))throw err('This record is being processed. Wait and retry.');this.locks.add(key);try{return await fn();}finally{this.locks.delete(key);}}
 async rate(){}
 async putChunk(id,part,bytes){if(!this.chunks.has(id))this.chunks.set(id,new Map());this.chunks.get(id).set(part,Buffer.from(bytes));}
 async readChunks(id,total,size){const chunks=this.chunks.get(id);if(!chunks||chunks.size!==total)throw err('Upload incomplete',400);const result=Buffer.concat(Array.from({length:total},(_,i)=>chunks.get(i)||Buffer.alloc(0)));if(result.length!==size)throw err('Upload size mismatch',400);return result;}
 async clearChunks(id){this.chunks.delete(id);}
 async putFile(name,bytes){const id=crypto.randomBytes(12).toString('hex');this.files.set(id,Buffer.from(bytes));return id;}
 async readFile(id){if(!this.files.has(id))throw err('File not found',404);return Buffer.from(this.files.get(id));}
 async fileStream(id){return Readable.from(await this.readFile(id));}
 async close(){}
}
