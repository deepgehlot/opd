import fs from 'node:fs';import {spawnSync} from 'node:child_process';
for(const file of ['server.mjs','storage.mjs','ai.mjs','api/index.mjs','public/app.js']){
 const result=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});if(result.status!==0)process.exit(1);
}
for(const file of ['public/index.html','public/style.css'])if(!fs.existsSync(file))throw new Error('Missing '+file);
JSON.parse(fs.readFileSync('vercel.json','utf8'));
console.log('Build checks passed. Static portal + Vercel Node function ready.');
