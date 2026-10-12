import { createApp } from '../server.mjs';
export function createVercelHandler(app){return async function handler(req,res){
  const url=new URL(req.url,'https://opd.invalid');
  const route=url.searchParams.get('__route');
  if(route!==null){
    if(!/^[A-Za-z0-9_/-]*$/.test(route)){res.writeHead(400);res.end('Invalid route');return;}
    url.searchParams.delete('__route');
    req.url='/api/'+route+(url.searchParams.size?'?'+url.searchParams.toString():'');
  }
  return app.handle(req,res);
};}
export default createVercelHandler(createApp());
