const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
require('./browser-harness.cjs')(async({evaluate:e,send,wait,errors,missing,root})=>{
 // Verify retained map/story alignment in the optional full-story view.
 await e(`StoryPacing.set('full')`);
 assert.ok(await e(`document.querySelector('#map-ground-view').closest('.audio-panel')`));
 assert.match(await e(`StoryConnections['frostmine-entrance'].landmark`),/northwestern cave/);
 assert.equal(await e(`FOREST_NODES.find(n=>n.id==='m13').name`),'Tideglass Landing');
 await e(`document.querySelector('#start').click();window.mapBase=GameProgress.exportData()`);
 const ids=['region-0','region-1','region-2','region-3','region-4','rootbound','frostmine','amber-hollow','clockwork-garden','lantern-grotto'];let total=0,locks=0;
 for(const id of ids){
  const result=await e(`(()=>{
   const id=${JSON.stringify(id)},c=JSON.parse(JSON.stringify(mapBase.data.campaign)),side=SideGeography.get(id);c.viewChapter=side?.chapter??Number(id.slice(7));c.completed=[];if(side)c.dungeon={id,returnPosition:{x:30,y:90,chapter:c.viewChapter},returnLocation:'entry'};
   DungeonRules.bind(c);ForestWorld.init();const l=OpenPaintedMaps.layout,open=OpenPaintedMaps.reachable(false).slice(),closed=OpenPaintedMaps.reachable(true).slice(),at=n=>Math.floor(n.y*2)*300+Math.floor(n.x*3),targets=l.nodes.filter(n=>DungeonRules.visible(n)&&ForestWorld.walkable(n)),problems=[];let locks=0;
   const unreachable=ForestWorld.cells.reduce((sum,v,i)=>sum+([1,3].includes(v)&&!open[i]?1:0),0);
   for(const n of targets){const island=PaintedBoundaries.zone(id,n)==='island';if(!open[at(n)]||!island&&!closed[at(n)])problems.push(n.id+' disconnected');
    const route=MouseNavigation.route(l.chapter,l.entry,n,!island);if(!route)problems.push(n.id+' no route');else for(let i=1;i<route.length;i++)if(!ForestWorld.stepClear(route[i-1],route[i],island?[]:[l.gate])){problems.push(n.id+' bad step');break;}
    if(island){locks++;if(MouseNavigation.route(l.chapter,l.entry,n,true))problems.push(n.id+' bypassed seal');}
   }
   for(const branch of DestinationRoutes.regions.find(r=>r.id===id)?.branches||[]){const n=FOREST_NODES.find(n=>n.id===branch.id),f=IntegratedMapArt.maps[id].features.find(f=>f.id===branch.id);if(branch.gate[0]!==n.x||branch.gate[1]!==n.y||f.x!==n.x||f.y!==n.y)problems.push(branch.id+' connection drift');if(branch.points.some(([x,y])=>!ForestWorld.walkable({x,y})))problems.push(branch.id+' unsafe connection');}
   const first=MapTraversal.overlay(),second=MapTraversal.overlay();return {id,count:targets.length,locks,unreachable,problems,cached:first===second,width:first.width,height:first.height};
  })()`);
  assert.deepEqual(result.problems,[],id);assert.equal(result.unreachable,0,id);assert.ok(result.cached);assert.equal(result.width,300);total+=result.count;locks+=result.locks;
 }
 // Use the real contextual entrance/exit controls, not a fabricated chapter switch.
 for(const id of ['rootbound','frostmine','amber-hollow','clockwork-garden','lantern-grotto']){
  await e(`(()=>{const f=JSON.parse(JSON.stringify(mapBase)),c=f.data.campaign,id=${JSON.stringify(id)},d=SideGeography.get(id),entrance=id==='rootbound'?'crypt-entrance':id+'-entrance',p=AuthoredFloors.data['region-'+d.chapter].anchors[entrance];f.data.phase='world';f.data.encounter=d.chapter*4;c.viewChapter=d.chapter;c.completed=[...new Set([...FOREST_NODES.filter(n=>/^m\\d+$/.test(n.id)).map(n=>n.id),...RequiredStory.stops.flatMap(s=>s.goals)])];c.location='entry';c.explorePosition={x:p[0],y:p[1],chapter:d.chapter};GameProgress.restoreData(f);})()`);
  await wait(`!document.querySelector('#crypt-interact').hidden && document.querySelector('#crypt-interact').textContent.includes('Enter')`,20000);
  await e(`document.querySelector('#crypt-interact').click()`);await wait(`GameProgress.exportData().data.campaign.dungeon?.id===${JSON.stringify(id)} && !JourneyGuide.traveling`,20000);
  await e(`(()=>{const c=GameProgress.exportData().data.campaign,n=FOREST_NODES.find(n=>n.id===${JSON.stringify(id==='rootbound'?'crypt-exit':id+'-exit')});MouseNavigation.path=MouseNavigation.route(c.viewChapter,c.explorePosition,n,!RegionGates.open(c.viewChapter,c.completed));})()`);
  await wait(`!document.querySelector('#crypt-interact').hidden && document.querySelector('#crypt-interact').textContent.includes('Leave area')`,25000);
  await e(`document.querySelector('#crypt-interact').click()`);await wait(`!GameProgress.exportData().data.campaign.dungeon && !JourneyGuide.traveling`,20000);
  assert.equal(await e(`ForestWorld.walkable(GameProgress.exportData().data.campaign.explorePosition)`),true);
  console.log('ROUNDTRIP',id);
 }
 await e(`GameModes.title()`);
 // A held north key previously stopped after 0.15 units on this angled stair.
 const stair=await e(`(()=>{const c=JSON.parse(JSON.stringify(mapBase.data.campaign));c.viewChapter=0;c.completed=[];c.dungeon={id:'amber-hollow',returnPosition:{x:30,y:90,chapter:0}};DungeonRules.bind(c);ForestWorld.init();let p={x:77.5,y:52.25},safe=true;for(let i=0;i<120;i++){const q=ForestWorld.move(p,0,-1,.016,[RegionGates.gate(0)]);safe&&=ForestWorld.stepClear(p,q,[RegionGates.gate(0)]);p=q;}return {progress:52.25-p.y,safe};})()`);assert.ok(stair.progress>10);assert.equal(stair.safe,true);
 // Nearby edge clicks land on connected floor; remote water is never a destination.
 const click=await e(`(()=>{const c=JSON.parse(JSON.stringify(mapBase.data.campaign));c.viewChapter=0;c.completed=[];DungeonRules.bind(c);ForestWorld.init();const l=OpenPaintedMaps.layout;let found=null;for(let y=4;y<196&&!found;y++)for(let x=4;x<296&&!found;x++){const p=ForestWorld.point(x,y);if(ForestWorld.walkable(p))continue;const path=MouseNavigation.route(0,l.entry,p,true);if(path&&MouseNavigation.lastResult.snapped)found={p,end:path.at(-1),safe:ForestWorld.walkable(path.at(-1))};}const water=MouseNavigation.route(0,l.entry,{x:58,y:15},true);return {found,water:!!water};})()`);assert.ok(click.found?.safe);assert.equal(click.water,false);
 await e(`GameModes.title();MotionPreference.set('still');document.querySelector('#forest-quest-start').click()`);await wait(`document.querySelector('#game').dataset.scene==='prologue'`);assert.ok(await e(`document.querySelector('#prologue-text').textContent.includes('west bank')`));
 const f=await e(`GameProgress.exportData()`);await e(`(()=>{const f=${JSON.stringify(f)};f.data.phase='world';f.data.campaign.completed=['m0','m1'];f.data.campaign.explorePosition={x:53,y:44,chapter:0};GameProgress.restoreData(f);})()`);await wait(`document.querySelector('#game').dataset.scene==='world' && OpenPaintedMaps.ready()`);
 await e(`document.querySelector('#forest-panel-toggle').click()`);assert.equal(await e(`document.querySelector('#forest-panel-toggle').getAttribute('aria-expanded')`),'false');
 assert.equal(await e(`MapTraversal.lighting()===getComputedStyle(ForestRenderer.terrain).filter`),true);
 assert.equal(await e(`(()=>{const world=document.querySelector('#world'),old=world.dataset.forestRestored;world.dataset.forestRestored='true';const same=MapTraversal.lighting()===getComputedStyle(ForestRenderer.terrain).filter;world.dataset.forestRestored=old;return same;})()`),true);
 await new Promise(r=>setTimeout(r,800));fs.writeFileSync(path.resolve(root,'../map-clear-paths.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await e(`MapTraversal.set('painted')`);await new Promise(r=>setTimeout(r,400));assert.equal(await e(`localStorage.getItem('asterfall-ground-view')`),'painted');await e(`MapTraversal.set('clear')`);
 await send('Emulation.setDeviceMetricsOverride',{width:768,height:600,deviceScaleFactor:1,mobile:false});await new Promise(r=>setTimeout(r,500));assert.ok(await e(`document.documentElement.scrollWidth<=innerWidth`));fs.writeFileSync(path.resolve(root,'../map-clear-paths-small.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 assert.deepEqual(errors,[]);assert.deepEqual(missing.filter(p=>p!=='/favicon.ico'),[]);
 console.log('PASS '+ids.length+' painted maps, '+total+' destination routes, '+locks+' sealed destinations, disconnected-speck cleanup, safe stair edge-following, edge click targeting, blocked water, cached ground guide, panel toggle and small-screen bounds.');
}).catch(error=>{console.error(error);process.exitCode=1;});
