import test from 'node:test';import assert from 'node:assert/strict';import crypto from 'node:crypto';
import {MongoStore} from '../storage.mjs';import {createApp} from '../server.mjs';
test('real MongoDB transactions, distributed sessions, GridFS, chunks and lease', {skip:!process.env.TEST_MONGODB_URI},async t=>{
 const store=new MongoStore(process.env.TEST_MONGODB_URI,'opd_test_'+crypto.randomBytes(6).toString('hex'));await store.ready();
 const fake=async(c)=>({facts:[{category:'complaint',label:'Reported',label_hi:'बताया',value_en:'Cough',value_hi:'खांसी',quote:c[0].text,date:null,page:null,uncertain:false,attention_reason:null,attention_hi:null}],gaps:[],questions:[]});
 const a=createApp({store,ai:fake}),b=createApp({store,ai:fake});await Promise.all([new Promise(r=>a.listen(0,'127.0.0.1',r)),new Promise(r=>b.listen(0,'127.0.0.1',r))]);
 t.after(async()=>{await Promise.all([new Promise(r=>a.close(r)),new Promise(r=>b.close(r))]);await store.db.dropDatabase();await store.close();});
 const url=s=>'http://127.0.0.1:'+s.address().port;let cookie='';
 const call=async(s,p,body)=>{const r=await fetch(url(s)+'/api'+p,{method:body===undefined?'GET':'POST',headers:{cookie,...(body===undefined?{}:{'Content-Type':'application/json'})},body:body===undefined?undefined:JSON.stringify(body)});if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];return {status:r.status,data:await r.json()};};
 assert.equal((await call(a,'/register',{name:'Synthetic',mobile:'9000000001',age:'35',email:'demo@example.test'})).status,201);
 const challenge=(await call(a,'/otp/request',{identifier:'9000000001'})).data.challenge;
 assert.equal((await call(b,'/otp/verify',{challenge,otp:'123456'})).status,200);
 assert.equal((await call(a,'/me')).status,200);
 const v=(await call(a,'/visits',{})).data;
 assert.equal((await call(b,'/visits/'+v.id+'/source',{type:'text',text:'I have cough.'})).status,200);
 assert.equal((await call(a,'/visits/'+v.id)).data.facts.length,1);
 const bytes=Buffer.alloc(1024*1024,42);await store.putChunk('integration-upload',0,bytes,new Date(Date.now()+60000));assert.deepEqual(await store.readChunks('integration-upload',1,bytes.length),bytes);
 const file=await store.putFile('synthetic.bin',bytes);assert.deepEqual(await store.readFile(file),bytes);const chunks=[];for await(const piece of await store.fileStream(file))chunks.push(piece);assert.deepEqual(Buffer.concat(chunks),bytes);
 const lease='integration-lease';await store.lock(lease,async()=>{await assert.rejects(store.lock(lease,async()=>{}),e=>e.status===409);});
 // Two snapshots attempt to overwrite the same row: second must fail without data loss.
 const x=await store.load(),y=await store.load();const oldX=structuredClone(x.data),oldY=structuredClone(y.data);x.data.patients[0].city='Jodhpur';y.data.patients[0].city='Jaipur';await store.commit(oldX,x.data,x.versions);await assert.rejects(store.commit(oldY,y.data,y.versions),e=>e.status===409);assert.equal((await store.load()).data.patients[0].city,'Jodhpur');
 assert.equal((await call(a,'/logout',{})).status,200);assert.equal((await call(b,'/me')).status,401);
});
