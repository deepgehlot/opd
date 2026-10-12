import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import crypto from 'node:crypto';
const collections=['users','patients','visits','audit','sessions','challenges','uploads'];
const error=(msg,status=409)=>Object.assign(new Error(msg),{status});
const strip=d=>{const {_id,_rev,active,...rest}=d;return rest;};
export class MongoStore {
  constructor(uri=process.env.MONGODB_URI,name=process.env.MONGODB_DB||'opd_brief') {this.uri=uri;this.name=name;}
  async ready(){
    if(!this.uri)throw error('Add MONGODB_URI in Vercel Settings → Environment Variables, then redeploy.',503);
    if(!this.promise)this.promise=this.connect().catch(async e=>{this.promise=null;if(this.client)await this.client.close().catch(()=>{});throw e;});
    return this.promise;
  }
  async connect(){
    this.client=new MongoClient(this.uri,{maxPoolSize:5,minPoolSize:0,serverSelectionTimeoutMS:10000});await this.client.connect();this.db=this.client.db(this.name);this.bucket=new GridFSBucket(this.db,{bucketName:'documents'});
    await Promise.all([
      this.db.collection('patients').createIndex({mobile:1},{unique:true}),
      this.db.collection('patients').createIndex({email:1},{unique:true,partialFilterExpression:{email:{$gt:''}}}),
      this.db.collection('visits').createIndex({patientId:1,active:1},{unique:true,partialFilterExpression:{active:true}}),
      ...['sessions','challenges','uploads','uploadChunks','rates','leases'].map(c=>this.db.collection(c).createIndex({expiresAt:1},{expireAfterSeconds:0}))
    ]);return this;
  }
  async seed(users){await this.ready();for(const u of users)await this.db.collection('users').updateOne({_id:u.id},{$setOnInsert:{...u,_rev:0}},{upsert:true});}
  async load(){await this.ready();const data={},versions={};await Promise.all(collections.map(async c=>{const rows=await this.db.collection(c).find({}).toArray();data[c]=rows.map(strip);versions[c]=Object.fromEntries(rows.map(d=>[d.id,d._rev||0]));}));return {data,versions};}
  async commit(base,data,versions){
    await this.ready();const changes=[];
    for(const c of collections){const old=new Map(base[c].map(x=>[x.id,x]));for(const row of data[c]){const prev=old.get(row.id);old.delete(row.id);if(!prev||JSON.stringify(prev)!==JSON.stringify(row))changes.push({c,row,kind:prev?'update':'insert'});}for(const row of old.values())changes.push({c,row,kind:'delete'});}
    if(!changes.length)return;
    const session=this.client.startSession();
    try{await session.withTransaction(async()=>{for(const {c,row,kind}of changes){const col=this.db.collection(c);const rev=versions[c][row.id]||0;const doc={...row,_id:row.id,_rev:kind==='insert'?0:rev+1,...(c==='visits'?{active:row.status!=='reviewed'}:{})};if(kind==='insert')await col.insertOne(doc,{session});else{const r=kind==='delete'?await col.deleteOne({_id:row.id,_rev:rev},{session}):await col.replaceOne({_id:row.id,_rev:rev},doc,{session});if((r.deletedCount??r.modifiedCount)!==1)throw error('Record changed in another request. Refresh and retry.');}}});}
    catch(e){if(e.code===11000)throw error('Patient already registered, or an active visit already exists. Refresh the queue.');throw e;}
    finally{await session.endSession();}
  }
  async lock(key,fn){await this.ready();const owner=crypto.randomUUID(),now=new Date(),expiresAt=new Date(Date.now()+180000);
    try{await this.db.collection('leases').findOneAndUpdate({_id:key,expiresAt:{$lte:now}},{$set:{owner,expiresAt}},{upsert:true});}catch(e){if(e.code===11000)throw error('This record is being processed. Wait and retry.');throw e;}
    try{return await fn();}finally{await this.db.collection('leases').deleteOne({_id:key,owner});}
  }
  async rate(key){await this.ready();const id=crypto.createHash('sha256').update(String(key)).digest('hex')+':'+Math.floor(Date.now()/60000);const row=await this.db.collection('rates').findOneAndUpdate({_id:id},{$inc:{n:1},$setOnInsert:{expiresAt:new Date(Date.now()+120000)}},{upsert:true,returnDocument:'after'});if(row.n>80)throw error('Too many requests. Wait a minute.',429);}
  async putChunk(id,part,buffer,expiresAt){await this.ready();const _id=id+':'+part;await this.db.collection('uploadChunks').updateOne({_id},{$set:{uploadId:id,part,bytes:buffer,expiresAt}},{upsert:true});}
  async readChunks(id,total,size){await this.ready();const rows=await this.db.collection('uploadChunks').find({uploadId:id}).sort({part:1}).toArray();if(rows.length!==total||rows.some((r,i)=>r.part!==i))throw error('Upload incomplete. Retry the upload.',400);const data=Buffer.concat(rows.map(r=>Buffer.from(typeof r.bytes.value==='function'?r.bytes.value(true):r.bytes)));if(data.length!==size)throw error('Upload size mismatch.',400);return data;}
  async clearChunks(id){await this.db.collection('uploadChunks').deleteMany({uploadId:id});}
  async putFile(name,data){await this.ready();const stream=this.bucket.openUploadStream(name);await new Promise((resolve,reject)=>{stream.once('error',reject);stream.once('finish',resolve);stream.end(data);});return stream.id.toHexString();}
  async readFile(id){await this.ready();const stream=this.bucket.openDownloadStream(new ObjectId(id));const chunks=[];for await(const b of stream)chunks.push(b);return Buffer.concat(chunks);}
  async fileStream(id){await this.ready();return this.bucket.openDownloadStream(new ObjectId(id));}
  async close(){if(this.client)await this.client.close();}
}
export const getStore=()=>new MongoStore();
