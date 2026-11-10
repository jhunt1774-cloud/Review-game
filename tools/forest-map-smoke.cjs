const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
require('./browser-harness.cjs')(async({evaluate:e,send,wait,errors,missing,root})=>{
 // Retain coverage of the optional full-story flow; fast play has its own suite.
 await e(`StoryPacing.set('full')`);
 await e(`MotionPreference.set('still');document.querySelector('#forest-quest-start').click()`);await wait(`document.querySelector('#game').dataset.scene==='prologue'`);const base=await e(`GameProgress.exportData()`);
 const states=await e(`(()=>{const c=GameProgress.exportData().data.campaign,n=id=>FOREST_NODES.find(n=>n.id===id);return {first:ForestVisuals.mapBadge(n('m0'),c,false),boss:ForestVisuals.mapBadge(n('m3'),c,false),normal:ForestVisuals.mapBadge(n('m0'),{},false),done:ForestVisuals.mapBadge(n('m0'),c,true)};})()`);
 assert.equal(states.first.state,'next');assert.equal(states.boss.state,'locked');assert.equal(states.boss.boss,true);assert.equal(states.normal,null);assert.equal(states.done.label,'✓');
 await e(`document.querySelector('#begin-chapter').click()`);await wait(`document.querySelector('#forest-map').dataset.canvasActors==='true'`);
 assert.ok(await e(`document.querySelector('#forest-map-key').textContent.includes('1–4')`));
 await e(`(()=>{const f=${JSON.stringify(base)};f.data.phase='world';f.data.encounter=1;f.data.campaign.completed=['m0'];f.data.campaign.explorePosition={x:29,y:66,chapter:0};GameProgress.restoreData(f);})()`);await wait(`document.querySelector('#game').dataset.scene==='world'`);await new Promise(r=>setTimeout(r,500));
 assert.equal(await e(`ForestVisuals.mapBadge(FOREST_NODES.find(n=>n.id==='forest-supplies'),GameProgress.exportData().data.campaign,false).state`),'optional');
 const same=await e(`(()=>{const v=ForestVisuals,c=GameProgress.exportData().data.campaign,n=FOREST_NODES.find(n=>n.id==='m1'),i=v.mapBadge(n,c,false);return v.badgeArt(i)===v.badgeArt(i)})()`);assert.equal(same,true);
 fs.writeFileSync(path.resolve(root,'../forest-map-landmarks.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await send('Emulation.setDeviceMetricsOverride',{width:768,height:600,deviceScaleFactor:1,mobile:false});await e(`document.querySelector('#forest-map-key').open=true`);await new Promise(r=>setTimeout(r,300));assert.ok(await e(`(()=>{const r=document.querySelector('#forest-trail-board').getBoundingClientRect();return r.right<=innerWidth&&r.bottom<=innerHeight})()`));
 fs.writeFileSync(path.resolve(root,'../forest-map-landmarks-small.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 assert.deepEqual(errors,[]);assert.deepEqual(missing.filter(p=>p!=='/favicon.ico'),[]);console.log('PASS map marker progress/locks/optional states, normal campaign isolation, cached badges, world rendering and expanded legend bounds at 768x600.');
}).catch(error=>{console.error(error);process.exitCode=1;});
