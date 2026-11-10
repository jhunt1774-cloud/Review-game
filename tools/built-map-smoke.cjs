const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
require('./browser-harness.cjs')(async({evaluate:e,send,wait,errors,missing,root})=>{
 assert.equal(await e(`!!window.BuiltMapPreview`),false);
 await e(`localStorage.setItem('web-wizardry-forest-v1','original-save-sentinel')`);
 await send('Page.navigate',{url:'http://127.0.0.1:8138'+(process.env.SITE_PREFIX||'/')+'map-prototype.html'});
 await wait(`!!window.GameProgress&&!!window.TeacherContent&&!!window.BuiltMapPreview`);
 await e(`MotionPreference.set('still');document.querySelector('#forest-quest-start').click();document.querySelector('#begin-chapter').click()`);
 await wait(`document.querySelector('#forest-map').dataset.canvasActors==='true'&&OpenPaintedMaps.layout?.key.startsWith('built-forest')`);
 assert.equal(await e(`ForestAdventure.slot`),'web-wizardry-built-map-v1');
 assert.equal(await e(`localStorage.getItem('web-wizardry-forest-v1')`),'original-save-sentinel');
 assert.equal(await e(`GameProgress.exportData().slot`),'web-wizardry-built-map-v1');
 assert.equal(await e(`ForestWorld.walkable({x:64,y:65})`),false);
 assert.equal(await e(`ForestWorld.walkable({x:64,y:44})`),true);
 assert.equal(await e(`ForestWorld.route({x:57,y:44},{x:83,y:28},true)`),null);
 assert.ok(await e(`!!ForestWorld.route({x:57,y:44},{x:83,y:28},false)`));
 for(const id of ['merchant','m0','m1','m2','forest-supplies','forest-spirit','forest-ranger'])assert.ok(await e(`!!ForestWorld.route(OpenPaintedMaps.layout.entry,MapRoutes.graphs[0].points.get('${id}')||FOREST_NODES.find(n=>n.id==='${id}'),true)`),id+' reachable');
 assert.equal(await e(`BuiltMapPreview.objects.every(o=>!ForestWorld.walkable(o))`),true);
 assert.ok(await e(`RoamingWorld.actors.length>0`));
 const before=await e(`GameProgress.exportData()`);
 await e(`(()=>{const f=GameProgress.exportData();f.data.campaign.forestQuest.ranger=true;GameProgress.restoreData(f);})()`);
 await wait(`!BuiltMapPreview.objects.some(o=>o.roots)`);
 assert.equal(await e(`ForestWorld.walkable({x:53,y:58})`),true);
 await e(`GameProgress.restoreData(${JSON.stringify(before)})`);
 await wait(`BuiltMapPreview.objects.some(o=>o.roots)`);
 await send('Page.reload');await wait(`!!window.GameProgress&&!!window.TeacherContent`);
 await e(`document.querySelector('#forest-quest-continue').click()`);await wait(`document.querySelector('#game').dataset.scene==='world'`);
 assert.equal(await e(`localStorage.getItem('web-wizardry-forest-v1')`),'original-save-sentinel');
 await new Promise(r=>setTimeout(r,1000));
 fs.writeFileSync(path.resolve(root,'../built-map-preview.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await send('Emulation.setDeviceMetricsOverride',{width:768,height:600,deviceScaleFactor:1,mobile:false});
 assert.ok(await e(`document.documentElement.scrollWidth<=innerWidth`));
 // Exercise the actual walking/combat loop across the whole prototype.
 await e(`document.querySelector('#defense-mode').value='assisted'`);
 for(const id of ['m0','m1','m2','m3']){
  await e(`ForestAdventure.walkTo('${id}')`);
  await wait(`document.querySelector('#game').dataset.scene==='battle'`,30000);
  let attempted=-1;const until=Date.now()+120000;
  while(Date.now()<until){
   const s=await e(`GameProgress.exportData().data`);if(['victory','complete','defeat'].includes(s.phase)){assert.notEqual(s.phase,'defeat');break;}
   const status=await e(`({review:!document.querySelector('#next-question').hidden,defense:!document.querySelector('#enemy-defense').hidden,menu:!document.querySelector('#hero-command-menu').hidden})`);
   if(status.defense)await e(`document.querySelector('#attack-cue').click()`);
   else if(status.review)await e(`document.querySelector('#next-question').click()`);
   else if(status.menu&&s.practice&&attempted!==s.qIndex){attempted=s.qIndex;await e(`document.querySelector('#hero-menu-actions [data-action=attack]').click();document.querySelectorAll('#answers button')[${s.practice.question.correct}].click()`);}
   await new Promise(r=>setTimeout(r,80));
  }
  await wait(`document.querySelector('#game').dataset.scene==='result'`);assert.ok(await e(`GameProgress.exportData().data.campaign.completed.includes('${id}')`));
  console.log('Cleared',id);
  if(id!=='m3'){await e(`document.querySelector('#advance').click()`);await wait(`document.querySelector('#game').dataset.scene==='world'`);}
 }
 assert.equal(await e(`GameProgress.exportData().data.phase`),'complete');
 assert.deepEqual(errors,[]);assert.deepEqual(missing.filter(p=>p!=='/favicon.ico'),[]);
 console.log('PASS original unchanged, separate save and reload, all west-bank destinations reachable, river collision, sealed/open bridge routing, solid props, rescue shortcut, patrol presence, small viewport.');
});
