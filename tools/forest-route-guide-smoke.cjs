const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
require('./browser-harness.cjs')(async({evaluate:e,send,wait,errors,missing,root})=>{
 // Retain coverage of the optional full-story flow; fast play has its own suite.
 await e(`StoryPacing.set('full')`);
 await e(`MotionPreference.set('still');document.querySelector('#forest-quest-start').click()`);
 const base=await e(`GameProgress.exportData()`);
 await e(`(()=>{const f=${JSON.stringify(base)};f.data.phase='world';f.data.campaign.completed=['m0','m1'];f.data.campaign.explorePosition={x:53,y:44,chapter:0};GameProgress.restoreData(f);})()`);
 await wait(`document.querySelector('#game').dataset.scene==='world'&&OpenPaintedMaps.ready()`);
 const start=()=>e(`(()=>{const c=GameProgress.exportData().data.campaign,n=FOREST_NODES.find(n=>n.id==='forest-spirit');MouseNavigation.path=MouseNavigation.route(0,c.explorePosition,n,true);RouteGuide.sync();return MouseNavigation.path.length;})()`);
 assert.ok(await start());await wait(`!document.querySelector('#stop-walking').hidden&&!!RouteGuide.cache`);
 assert.equal(await e(`(()=>{const cache=RouteGuide.sync();return Array.from({length:50},()=>RouteGuide.sync()===cache).every(Boolean);})()`),true);
 assert.ok(await e(`(()=>{const p=MouseNavigation.path;return p.slice(1).every((q,i)=>ForestWorld.stepClear(p[i],q,[RegionGates.gate(0)]));})()`));
 assert.ok(await e(`Math.abs(parseFloat(document.querySelector('#mouse-destination').style.left)-RouteGuide.cache.end.x)<.001`));
 await e(`document.querySelector('#forest-panel-toggle').click()`);await new Promise(r=>setTimeout(r,700));
 fs.writeFileSync(path.resolve(root,'../chosen-route-preview.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await e(`document.querySelector('#stop-walking').click()`);assert.equal(await e(`MouseNavigation.path.length`),0);assert.equal(await e(`RouteGuide.cache`),null);assert.equal(await e(`document.querySelector('#mouse-destination').hidden`),true);assert.match(await e(`document.querySelector('#explore-tip').textContent`),/Walking stopped/);
 await start();await e(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}))`);assert.equal(await e(`MouseNavigation.path.length`),0);
 await start();await e(`document.querySelector('#map-dialog').showModal();document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}))`);assert.ok(await e(`MouseNavigation.path.length>0`));await e(`document.querySelector('#map-dialog').close()`);
 await e(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true,cancelable:true}));document.dispatchEvent(new KeyboardEvent('keyup',{key:'ArrowLeft',bubbles:true,cancelable:true}))`);assert.equal(await e(`MouseNavigation.path.length`),0);
 await e(`(()=>{const c=GameProgress.exportData().data.campaign;MouseNavigation.path=MouseNavigation.route(0,c.explorePosition,c.explorePosition,true);})()`);await wait(`MouseNavigation.path.length===0&&document.querySelector('#stop-walking').hidden`);assert.match(await e(`document.querySelector('#explore-tip').textContent`),/Destination reached/);
 await start();await send('Emulation.setDeviceMetricsOverride',{width:768,height:600,deviceScaleFactor:1,mobile:false});await new Promise(r=>setTimeout(r,400));const box=await e(`(()=>{const r=document.querySelector('#stop-walking').getBoundingClientRect();return {left:r.left,right:r.right,bottom:r.bottom,width:innerWidth,height:innerHeight};})()`);assert.ok(box.left>=0&&box.right<=box.width&&box.bottom<=box.height);
 fs.writeFileSync(path.resolve(root,'../chosen-route-small.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await e(`GameModes.title()`);assert.equal(await e(`MouseNavigation.path.length`),0);assert.equal(await e(`RouteGuide.cache`),null);
 assert.deepEqual(errors,[]);assert.deepEqual(missing.filter(p=>p!=='/favicon.ico'),[]);
 console.log('PASS chosen-route drawing/cache, safe route segments, endpoint marker, Stop/Escape, modal Escape protection, keyboard takeover, arrival feedback, title cleanup and small-screen controls.');
}).catch(error=>{console.error(error);process.exitCode=1;});
