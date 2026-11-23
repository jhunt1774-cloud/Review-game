const assert=require('node:assert/strict');
require('./browser-harness.cjs')(async({evaluate:e,send,wait,errors,missing})=>{
 const url='http://127.0.0.1:8138/index.html?map=wildwood&terrain=valley';
 await send('Page.navigate',{url});await wait('window.WildwoodValley && window.GameProgress');
 await e(`MotionPreference.set('still');document.querySelector('#defense-mode').value='assisted';document.querySelector('#forest-quest-start').click();document.querySelector('#begin-chapter').click()`);
 await wait('WildwoodBoard.active() && OpenPaintedMaps.ready()');
 const base=await e('GameProgress.exportData()');
 const at=async id=>e(`(()=>{const f=GameProgress.exportData(),n=FOREST_NODES.find(n=>n.id===${JSON.stringify(id)});f.data.campaign.explorePosition={x:n.x,y:n.y,chapter:0};GameProgress.restoreData(f)})()`);
 const use=async id=>{
  await at(id);
  await wait(`!document.querySelector('#crypt-interact').hidden && document.querySelector('#crypt-interact').textContent.includes(${id.endsWith('-exit')?"'Leave area'":`FOREST_NODES.find(n=>n.id===${JSON.stringify(id)}).name`})`);
  await e("document.querySelector('#crypt-interact').click()");
 };
 const resume=async()=>{
  await send('Page.reload');await wait("document.querySelector('#forest-quest-continue')?.disabled===false");
  await e("document.querySelector('#forest-quest-continue').click()");
  await wait("document.querySelector('#game').dataset.scene==='world' && OpenPaintedMaps.ready()");
 };
 const count=id=>e(`DungeonRules.campaign.completed.filter(i=>i===${JSON.stringify(id)}).length`);
 const entrance='amber-hollow-entrance',wagon='amber-hollow-wagon';
 assert.equal(await e(`DungeonRules.visible(FOREST_NODES.find(n=>n.id==='${entrance}'))`),false);
 await use('valley-apple-harvest');await use('valley-cider-press');
 await use(entrance);await wait("DungeonRules.campaign?.dungeon?.id==='amber-hollow'");
 await resume();assert.equal(await e('SideAdventures.active?.id'),'amber-hollow');
 assert.equal(await e("DungeonRules.allowed(DungeonRules.campaign,FOREST_NODES.find(n=>n.id==='amber-hollow-secret'))"),false);
 await at(wagon);
 await wait("['arrival','battle'].includes(GameProgress.exportData().data.phase)",25000);
 if(await e("GameProgress.exportData().data.phase==='arrival'")){
  await wait("document.querySelector('#game').dataset.scene==='arrival'");
  await e("document.querySelector('#begin-encounter').click()");
 }
 await wait("GameProgress.exportData().data.phase==='battle'");
 let last=-1,braces=0;
 const until=Date.now()+100000;
 while(Date.now()<until){
  const phase=await e('GameProgress.exportData().data.phase');
  if(phase==='victory')break;
  assert.notEqual(phase,'defeat','Party lost the supply wagon');
  const choice=await e(`(()=>{const s=GameProgress.exportData().data;
   if(!document.querySelector('#enemy-defense').hidden){document.querySelector('#attack-cue').click();return null;}
   if(!document.querySelector('#next-question').hidden){document.querySelector('#next-question').click();return null;}
   if(document.querySelector('#hero-command-menu').hidden||!s.practice||s.qIndex===${last})return null;
   const brace=document.querySelector('#hero-menu-actions [data-action=objective]');if(!brace||brace.disabled)return null;
   brace.click();document.querySelectorAll('#answers button')[s.practice.question.correct].click();return s.qIndex;})()`);
  if(choice!=null){last=choice;braces++;}
  await new Promise(r=>setTimeout(r,100));
 }
 assert.ok(braces>=3,'The crew must survive three rounds');
 assert.equal(await count(wagon),1);
 assert.equal(await e("GameProgress.exportData().data.campaign.encounterObjective.method"),'objective');
 await wait("document.querySelector('#game').dataset.scene==='result'");await e("document.querySelector('#advance').click()");
 await wait("document.querySelector('#game').dataset.scene==='world'");
 await use('amber-hollow-exit');await wait('WildwoodBoard.active() && OpenPaintedMaps.ready()');
 assert.ok(await e("WildwoodBoard.objects.some(o=>o.art==='orchardCaravan')"));
 const before=await e('DungeonRules.campaign.potions');
 await use('valley-wagon-delivery');assert.equal(await e('DungeonRules.campaign.potions'),before+2);
 await resume();assert.equal(await count('valley-wagon-delivery'),1);
 console.log('Recovered Amber Hollow: orchard unlock, expedition save, three-turn wagon rescue, return and first delivery');
 // Simulate an existing valley save with the landmarks cleared before this update.
 base.data.campaign.completed.push('m0','m1','m2','forest-supplies');
 base.data.campaign.forestQuest.boon='supplies';
 await e(`GameProgress.restoreData(${JSON.stringify(base)})`);
 await use('forest-ranger');await wait("document.querySelector('#mine-choice')?.open");
 assert.ok(await e("WildwoodBoard.objects.some(o=>o.art==='snaggedRanger') && !WildwoodBoard.objects.some(o=>o.art==='roots')"));
 await e("Array.from(document.querySelectorAll('#mine-choice button')).find(b=>b.textContent==='Free Rowan').click()");
 await wait("DungeonRules.campaign.forestQuest.ranger && ForestWorld.walkable(WildwoodValley.roots)");
 assert.equal(await e("WildwoodBoard.objects.some(o=>o.roots)"),false);
 for(const [index,id] of ['loot-axe','loot-shield','loot-bow','loot-moon'].entries()){
  assert.equal(await e(`LootRules.unlocked(DungeonRules.campaign,${index})`),false);
  await use(id);await wait(`LootRules.unlocked(DungeonRules.campaign,${index})`);
  assert.equal(await count(id),1);
 }
 await resume();assert.equal(await e("document.querySelector('#valley-field-notes summary').textContent"),'Field notes · 4/4 relics');
 assert.ok(await e("LootRules.powers.every((_,i)=>LootRules.canUse({...DungeonRules.campaign,focus:3},i))"));
 await at('roam-0-2');await wait("GameProgress.exportData().data.phase==='battle'");
 await e("(()=>{const f=GameProgress.exportData();f.data.campaign.focus=3;GameProgress.restoreData(f)})()");
 await wait("!document.querySelector('#hero-command-menu').hidden && !document.querySelector('#hero-menu-actions [data-action=relic]')?.disabled");
 const hero=await e("GameProgress.exportData().data.actor");
 await e(`document.querySelector('#hero-command-tabs [data-group=skills]').click();document.querySelector('#hero-menu-actions [data-action=relic]').click();const q=GameProgress.exportData().data.practice.question;document.querySelectorAll('#answers button')[q.correct].click()`);
 await wait(`GameProgress.exportData().data.campaign.relicUsed?.[${hero}]===true`);
 assert.deepEqual(errors,[]);assert.deepEqual(missing.filter(p=>p!=='/favicon.ico'),[]);
 console.log('Recovered all four relics from a pre-update save with original battle eligibility after reload');
});
