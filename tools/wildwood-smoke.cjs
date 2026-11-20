const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
require('./browser-harness.cjs')(async({evaluate:e,send,wait,errors,missing,root})=>{
 assert.equal(await e(`!!window.WildwoodBoard`),false);
 await e(`localStorage.setItem('web-wizardry-forest-v1','original-forest-sentinel');localStorage.setItem('web-wizardry-teacher-save-v1','original-teacher-sentinel')`);
 const valley=process.env.WILDWOOD_VALLEY==='1';
 const map=valley?'index.html?map=wildwood&terrain=valley':process.env.WILDWOOD_RELIEF==='1'?'index.html?map=wildwood&terrain=relief':'wildwood.html';
 await send('Page.navigate',{url:'http://127.0.0.1:8138'+(process.env.SITE_PREFIX||'/')+map});await wait(`!!window.TeacherContent&&!!window.WildwoodBoard`);
 await e(`MotionPreference.set('still');document.querySelector('#defense-mode').value='assisted';document.querySelector('#forest-quest-start').click();document.querySelector('#begin-chapter').click()`);
 await wait(`OpenPaintedMaps.ready()&&document.querySelector('#forest-map').dataset.canvasActors==='true'`,30000);
 if(!valley)assert.ok(await e(`(()=>{
  const board=WildwoodBoard,canvas=ForestRenderer.terrain,c=canvas.getContext('2d');
  return board.bridges.every(bridge=>{
   const x=Math.round(board.river(bridge.y)*canvas.width/100);
   const y=Math.round(board.projectY(board.river(bridge.y),bridge.y)*canvas.height/100);
   const data=c.getImageData(x-10,y-5,20,10).data;
   let limestone=0;
   for(let i=0;i<data.length;i+=4)if(data[i]>data[i+2]+12&&data[i]>60)limestone++;
   return limestone>120;
  });
 })()`),'Both bridges render a limestone deck over the river');
 const base=await e(`GameProgress.exportData()`);assert.equal(base.slot,valley?'web-wizardry-wildwood-valley-v1':'web-wizardry-wildwood-v1');assert.equal(await e(`localStorage.getItem('web-wizardry-forest-v1')`),'original-forest-sentinel');
 assert.deepEqual(await e(`WorldCamera.size(0,1366,600)`),valley?{width:2280,height:1520}:{width:6000,height:4000});assert.equal(await e(`ExploreRules.speed`),4.8);if(!valley)assert.ok(await e(`WildwoodBoard.objects.filter(o=>o.tree).length>500`));
 for(const id of ['m0','m1','m2','forest-supplies','forest-spirit','forest-ranger',...await e(`WildwoodLayout.caches.map(n=>n.id)`)])assert.ok(await e(`!!ForestWorld.route(OpenPaintedMaps.layout.entry,FOREST_NODES.find(n=>n.id==='${id}'),false)`),id+' connected');
 assert.equal(await e(`ForestWorld.route(OpenPaintedMaps.layout.entry,FOREST_NODES.find(n=>n.id==='m3'),true)`),null);
 if(valley)assert.equal(await e(`ForestWorld.route(WildwoodValley.west,WildwoodValley.east,true)`),null);
 else for(const y of [25,44])assert.equal(await e(`!!ForestWorld.route({x:WildwoodBoard.river(${y})-4,y:${y}},{x:WildwoodBoard.river(${y})+4,y:${y}},true)`),false,'Both crossings stay sealed');
 assert.ok(await e(`WildwoodBoard.objects.filter(o=>o.solid!==false).every(o=>(o.footprints||[o]).every(f=>!ForestWorld.walkable(f)))`),'Visible solid footprints block movement');
 if(!valley)assert.deepEqual(await e(`[...new Set(WildwoodBoard.objects.filter(o=>o.tree).map(o=>o.art))].sort()`),['canopy-conifer','canopy-oak','canopy-sycamore']);
 if(valley){
  await wait(`!!document.getElementById('valley-destinations')`);
  assert.equal(await e(`document.getElementById('valley-destinations').lastElementChild.disabled`),true);
  await e(`const place=document.getElementById('valley-destinations');place.value='wildwood-herbalist-cache';place.dispatchEvent(new Event('change'))`);
  await wait(`MouseNavigation.path.length>0`);
  await e(`MouseNavigation.clear()`);
  const equipment=await e(`EquipmentLoot.catalog.filter(i=>i.source.startsWith('wildwood-')).map(i=>i.id)`);
  assert.equal(new Set(equipment).size,3);
  await e(`localStorage.setItem('web-wizardry-wildwood-v1','old-wildwood-sentinel')`);
 }
 const standAt=async id=>e(`(()=>{const node=FOREST_NODES.find(n=>n.id===${JSON.stringify(id)}),f=GameProgress.exportData();f.data.campaign.explorePosition={x:node.x,y:node.y,chapter:0};GameProgress.restoreData(f);})()`);
 await standAt('crypt-entrance');
 await wait(`!document.querySelector('#crypt-interact').hidden&&/Sanctuary/.test(document.querySelector('#crypt-interact').textContent)`);
 await e(`document.querySelector('#crypt-interact').click()`);
 await wait(`DungeonRules.campaign?.dungeon?.id==='rootbound'`);
 assert.equal(await e(`GameProgress.exportData().data.campaign.dungeon.id`),'rootbound');
 await send('Page.reload');await wait(`!!window.WildwoodBoard&&document.querySelector('#forest-quest-continue')?.disabled===false`);
 await e(`document.querySelector('#forest-quest-continue').click()`);
 await wait(`DungeonRules.campaign?.dungeon?.id==='rootbound'`);
 await standAt('crypt-exit');
 await wait(`!document.querySelector('#crypt-interact').hidden`);
 await e(`document.querySelector('#crypt-interact').click()`);
 await wait(`WildwoodBoard.active()&&OpenPaintedMaps.ready()`);
 await e(`GameProgress.restoreData(${JSON.stringify(base)})`);
 console.log('Checked sanctuary entry, reload and return');
 assert.equal(await e(`WildwoodBoard.objects.some(o=>o.art==='waterfall')`),false);
 if(!valley){
 const terrain=await e(`(()=>{
  const p=WildwoodBoard,camp=p.heightAt(18,82),crossing=p.heightAt(p.river(44),44),
   hollow=p.heightAt(38,42),heart=p.heightAt(83,25);
  return {hollowAboveCamp:hollow>camp,heartAboveCrossing:heart>crossing+5,
   clearKnoll:ForestWorld.stepClear({x:53.7,y:46.6},{x:53.7,y:43.75}),
   route:!!ForestWorld.route(OpenPaintedMaps.layout.entry,WildwoodLayout.caches.find(n=>n.id==='wildwood-overlook-cache'),true)};
 })()`);
 assert.deepEqual(terrain,{hollowAboveCamp:true,heartAboveCrossing:true,clearKnoll:true,route:true});
 console.log('Checked rolling terrain progression, unobstructed knoll, and level river');
 }
 if(process.env.WILDWOOD_RELIEF==='1'){
  assert.ok(await e(`(()=>{
   const p=WildwoodBoard;
   if(!p.raised()||p.projectY(39,43)>=42.6)return false;
   for(let x=8;x<=70;x+=2)for(let y=22;y<95;y+=1){
    const screen=p.projectY(x,y);
    if(p.projectY(x,y+1)<=screen||Math.abs(p.unproject(x,screen).y-y)>.01)return false;
   }
   return p.projectY(83,25)===25;
  })()`),'Projected terrain stays invertible and the eastern map stays in place');
 }

 // Walk on clear grass away from every suggested trail using actual keyboard input.
 const grass=await e(`(()=>{for(let y=10;y<90;y+=2)for(let x=10;x<55;x+=2){const p={x,y},q={x:x+3,y};if((window.WildwoodValley||WildwoodBoard.trailDistance(p)>4)&&ForestWorld.stepClear(p,q,[])&&WildwoodLayout.patrols.every(a=>Math.hypot((x-a.home[0])*1.5,y-a.home[1])>17))return p;}return null;})()`);assert.ok(grass);
 await e(`(()=>{const f=GameProgress.exportData();f.data.campaign.explorePosition={x:${grass.x},y:${grass.y},chapter:0};GameProgress.restoreData(f);})()`);
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'d',code:'KeyD',windowsVirtualKeyCode:68});await new Promise(r=>setTimeout(r,650));await send('Input.dispatchKeyEvent',{type:'keyUp',key:'d',code:'KeyD',windowsVirtualKeyCode:68});
 assert.ok(await e(`ForestFastPlay.state.campaign.explorePosition.x>${grass.x}+.5`),'Grass is free movement, not a walking rail');
 const pick=await e(`(()=>{const el=document.querySelector('#forest-mini-ground'),r=el.getBoundingClientRect();for(let y=15;y<90;y+=9)for(let x=10;x<55;x+=7){const p={x,y},px=r.left+r.width*x/100,py=r.top+r.height*y/100,target=document.elementFromPoint(px,py);if(ForestWorld.walkable(p)&&!target?.closest('button')&&el.contains(target)&&WildwoodBoard.bank(p)===0&&ForestWorld.route(ForestFastPlay.state.campaign.explorePosition,p,true))return {x:px,y:py};}return null;})()`);assert.ok(pick);
 await send('Input.dispatchMouseEvent',{type:'mousePressed',x:pick.x,y:pick.y,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:pick.x,y:pick.y,button:'left',clickCount:1});assert.ok(await e(`MouseNavigation.path.length>0`),'Clicking open ground on the minimap starts navigation');
 await e(`GameProgress.restoreData(${JSON.stringify(base)})`);
 // A real contextual search pays once and survives a reload.
 await standAt('wildwood-herbalist-cache');await wait(`!document.querySelector('#crypt-interact').hidden&&document.querySelector('#crypt-interact').textContent.includes('Herbalist')`);
 const before=await e(`GameProgress.exportData().data.campaign`);await e(`document.querySelector('#crypt-interact').click()`);const after=await e(`GameProgress.exportData().data.campaign`);
 if(valley){
  assert.ok(after.equipmentLoot.owned.includes('apiary-smock'));
  const duplicate=await e(`(()=>{const s=ForestFastPlay.state,prior=s.gold;
   ForestAdventure.interact(s,FOREST_NODES.find(n=>n.id==='wildwood-herbalist-cache'),{});
   return [s.gold-prior,s.campaign.equipmentLoot.owned.filter(id=>id==='apiary-smock').length];})()`);
  assert.deepEqual(duplicate,[0,1]);
 }
 assert.ok(after.completed.includes('wildwood-herbalist-cache'));assert.equal(after.potions,before.potions+1);assert.equal(after.runes,before.runes+1);
 await send('Page.reload');await wait(`!!window.TeacherContent&&!!window.GameProgress`);await e(`document.querySelector('#forest-quest-continue').click()`);await wait(`document.querySelector('#game').dataset.scene==='world'&&OpenPaintedMaps.ready()`);
 assert.ok(await e(`GameProgress.exportData().data.campaign.completed.includes('wildwood-herbalist-cache')`));
 await wait(`RoamingWorld.actors.every(a=>Date.now()>=a.graceUntil)`);const first=await e(`RoamingWorld.actors.map(a=>({id:a.id,x:a.position.x,y:a.position.y}))`);await new Promise(r=>setTimeout(r,1100));const second=await e(`RoamingWorld.actors.map(a=>({id:a.id,x:a.position.x,y:a.position.y}))`);assert.ok(second.some(a=>{const p=first.find(p=>p.id===a.id);return p&&Math.hypot(a.x-p.x,a.y-p.y)>.05;}),'Patrols move');
 // Rescue physically removes the roots from the shared navigation grid.
 assert.equal(await e(`ForestWorld.walkable(window.WildwoodValley?.roots||{x:51,y:54.6})`),false);await e(`(()=>{const f=GameProgress.exportData();f.data.campaign.forestQuest.ranger=true;GameProgress.restoreData(f);})()`);assert.equal(await e(`ForestWorld.walkable(window.WildwoodValley?.roots||{x:51,y:54.6})`),true);
 // Optional roaming combat uses the same quiz rules and keeps a valid save.
 await standAt('roam-0-2');await wait(`GameProgress.exportData().data.phase==='battle'`,15000);
 assert.equal(await e(`GameProgress.exportData().data.campaign.battleNode`),'roam-0-2');assert.ok(await e(`!!GameProgress.validate(GameProgress.exportData().data)`));
 async function finishBattle(wrong=false){let attempted=-1,usedWrong=false,wrongHp=null,enemyBefore=null;const until=Date.now()+120000;
  while(Date.now()<until){const s=await e(`GameProgress.exportData().data`);if(['victory','complete','defeat'].includes(s.phase)){assert.notEqual(s.phase,'defeat');return s;}
   const ui=await e(`({review:!document.querySelector('#next-question').hidden,defense:!document.querySelector('#enemy-defense').hidden,menu:!document.querySelector('#hero-command-menu').hidden})`);
   // The wrong-answer case deliberately takes damage; the full quest uses assisted defense.
   if(ui.defense){await e(wrong ? `document.querySelector('#take-hit').click()` : `document.querySelector('#attack-cue').click()`);if(wrongHp!==null){await wait(`!document.querySelector('#hero-command-menu').hidden`);const next=await e(`GameProgress.exportData().data`);assert.ok(next.hp.reduce((a,b)=>a+b,0)<wrongHp);assert.equal(next.enemyHp,enemyBefore);wrongHp=null;}}
   else if(ui.review)await e(`document.querySelector('#next-question').click()`);
   else if(ui.menu&&s.practice&&attempted!==s.qIndex){attempted=s.qIndex;const miss=wrong&&!usedWrong,answer=miss?(s.practice.question.correct+1)%4:s.practice.question.correct;if(miss){usedWrong=true;wrongHp=s.hp.reduce((a,b)=>a+b,0);enemyBefore=s.enemyHp;}await e(`document.querySelector('#hero-menu-actions [data-action=attack]').click();document.querySelectorAll('#answers button')[${answer}].click()`);}
   await new Promise(r=>setTimeout(r,70));
  }throw Error('Battle did not finish');
 }
 const optional=await finishBattle(true);assert.ok(optional.campaign.completed.includes('roam-0-2'));assert.ok(!optional.campaign.completed.includes('m0'));assert.ok(await e(`!!GameProgress.validate(GameProgress.exportData().data)`));
 // Now complete the main adventure using actual click-to-walk and battle controls.
 await e(`document.querySelector('#home').click();window.wildwoodLesson={version:1,name:'Wildwood classroom proof',difficulty:'beginner',questions:[{topic:'Programming',text:'Wildwood classroom-only question: choose green.',answers:['red','blue','green','yellow'],correct:2,explanation:'The classroom set selects green.'}]};TeacherMode.load(wildwoodLesson);document.querySelector('#teacher-forest-quest').click()`);await wait(`document.querySelector('#forest-quest-start').dataset.confirm==='yes'`);await e(`document.querySelector('#forest-quest-start').click()`);await wait(`document.querySelector('#game').dataset.scene==='prologue'`);assert.equal(await e(`GameProgress.exportData().data.lesson.name`),'Wildwood classroom proof');await e(`document.querySelector('#begin-chapter').click()`);await wait(`document.querySelector('#game').dataset.scene==='world'`);
 for(const id of ['m0','m1','m2','m3']){await e(`ForestAdventure.walkTo('${id}')`);await wait(`GameProgress.exportData().data.phase==='battle'`,45000);assert.equal(await e(`GameProgress.exportData().data.campaign.battleNode`),id);assert.match(await e(`GameProgress.exportData().data.practice.question.text`),/Wildwood classroom-only/);const s=await finishBattle();assert.ok(s.campaign.completed.includes(id));console.log('Cleared',id);await wait(`document.querySelector('#game').dataset.scene==='result'`);if(id!=='m3'){await e(`document.querySelector('#advance').click()`);await wait(`document.querySelector('#game').dataset.scene==='world'`);}}
 assert.equal(await e(`GameProgress.exportData().data.phase`),'complete');await e(`document.querySelector('#advance').click()`);await wait(`document.querySelector('#game').dataset.scene==='world'`);assert.equal(await e(`RoamingWorld.actors.length`),0);
 await send('Emulation.setDeviceMetricsOverride',{width:768,height:600,deviceScaleFactor:1,mobile:false});await new Promise(r=>setTimeout(r,150));assert.ok(await e(`document.documentElement.scrollWidth<=innerWidth`));fs.writeFileSync(path.resolve(root,'work/wildwood-small.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 assert.equal(await e(`localStorage.getItem('web-wizardry-forest-v1')`),'original-forest-sentinel');assert.equal(await e(`localStorage.getItem('web-wizardry-teacher-save-v1')`),'original-teacher-sentinel');assert.deepEqual(errors,[]);assert.deepEqual(missing.filter(p=>p!=='/favicon.ico'),[]);
 if(valley){
  assert.equal(await e(`document.getElementById('valley-destinations').lastElementChild.disabled`),false);
  for(const [site,item] of [['wildwood-mill-cache','millwright-mallet'],['wildwood-ruin-cache','east-warden-seal']]){
   await standAt(site);await wait(`!document.querySelector('#crypt-interact').hidden`);
   await e(`document.querySelector('#crypt-interact').click()`);
   await wait(`GameProgress.exportData().data.campaign.equipmentLoot.owned.includes('${item}')`);
  }
  assert.equal(await e(`localStorage.getItem('web-wizardry-wildwood-v1')`),'old-wildwood-sentinel');
 }
 console.log('PASS keyboard movement, bridge gating, all destinations, saved rewards, patrols, quiz damage, four quest fights, postgame exploration and 768x600.');
});
