const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),{spawn}=require('node:child_process');
module.exports=async function withBrowser(run){
 const root=path.resolve(__dirname,'..'),mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.css':'text/css','.webp':'image/webp','.png':'image/png','.json':'application/json','.mp3':'audio/mpeg'},missing=[],errors=[];
 const siteRoot=path.resolve(root,process.env.SITE_ROOT||'.'),prefix=process.env.SITE_PREFIX||'/';
 const server=http.createServer((req,res)=>{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(!name.startsWith(prefix)){missing.push(name);res.writeHead(404).end();return;}const relative=name.slice(prefix.length)||'index.html';const file=path.resolve(siteRoot,relative);if(!file.startsWith(siteRoot+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(error,body)=>{if(error)missing.push(name);res.writeHead(error?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(error?'Missing':body);});});
 await new Promise(r=>server.listen(8138,'127.0.0.1',r));
 const profile=fs.mkdtempSync(path.resolve(root,'../forest-browser-'));
 const chrome=spawn(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--no-first-run','--no-default-browser-check','--remote-debugging-port=9238','--window-size=1366,768','--user-data-dir='+profile,'about:blank'],{windowsHide:true,stdio:'ignore'});
 let socket;try{
  let tabs;for(let i=0;i<100;i++){try{tabs=await(await fetch('http://127.0.0.1:9238/json')).json();break;}catch{await new Promise(r=>setTimeout(r,100));}}
  if(!tabs)throw Error('Chrome did not start');socket=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>socket.onopen=r);
  let id=0;const pending=new Map();socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);};
  const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id,timer=setTimeout(()=>{pending.delete(n);reject(Error('Browser request timed out: '+method));},45000);pending.set(n,{resolve,reject,timer});socket.send(JSON.stringify({id:n,method,params}));});
  const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description);return r.result.value;};
  const wait=async(expression,ms=15000)=>{const until=Date.now()+ms;while(Date.now()<until){const result=await evaluate(expression);if(result)return result;await new Promise(r=>setTimeout(r,100));}throw Error('Timed out waiting for '+expression.slice(0,150));};
  await send('Runtime.enable');await send('Page.enable');await send('Page.navigate',{url:'http://127.0.0.1:8138'+prefix});await wait('!!window.TeacherContent && !!window.GameProgress && !!window.ForestAdventure');
  await run({evaluate,send,wait,errors,missing,root});
 }finally{socket?.close();chrome.kill();server.closeAllConnections();server.close();}
};
