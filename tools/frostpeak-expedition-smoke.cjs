const assert=require('node:assert/strict');
const fs=require('node:fs');

require('./browser-harness.cjs')(async({evaluate:e,send,wait,errors,missing})=>{
 await send('Emulation.setDeviceMetricsOverride',{width:1024,height:600,deviceScaleFactor:1,mobile:false});
 await e("document.querySelector('#start').click()");
 const base=await e(`(()=>{
  const save=GameProgress.exportData(),s=save.data,c=s.campaign;
  s.phase='world';s.encounter=4;c.completed=['m0','m1','m2','m3'];
  c.viewChapter=1;c.battleNode='m4';c.location='entry';c.potions=2;
  delete c.worldChanges;
  const journal=FOREST_NODES.find(n=>n.id==='loot-frost-lore');
  c.explorePosition={x:journal.x,y:journal.y,chapter:1};
  s.hp=[50,75,0,1];
  return save;
 })()`);
 if(process.env.FROSTPEAK_PREVIEW_SAVE)fs.writeFileSync(process.env.FROSTPEAK_PREVIEW_SAVE,JSON.stringify(base,null,2));
 const saved=()=>e('GameProgress.exportData().data');
 await e(`GameProgress.restoreData(${JSON.stringify(base)})`);
 await e("document.querySelector('[data-node=loot-frost-lore]').click()");
 await wait("GameProgress.exportData().data.campaign.completed.includes('loot-frost-lore')",35000);
 const journal=await saved();
 assert.equal(journal.campaign.worldChanges.frostpeakAid,null);
 assert.equal(journal.campaign.potions,2);
 assert.match(await e("FOREST_NODES.find(n=>n.id==='world-expedition').name"),/Injured climbing party/);

 async function standAtStation(potions){
  await e(`(()=>{
   const f=GameProgress.exportData(),n=FOREST_NODES.find(n=>n.id==='world-expedition');
   f.data.campaign.explorePosition={x:n.x,y:n.y,chapter:1};
   if(${potions ?? 'null'}!==null)f.data.campaign.potions=${potions ?? 'null'};
   GameProgress.restoreData(f);
   document.querySelector('[data-node=world-expedition]').click();
  })()`);
 }
 async function openStation(){
  await wait("!document.querySelector('#crypt-interact').hidden && document.querySelector('#crypt-interact').textContent.includes('Visit')");
  await e("document.querySelector('#crypt-interact').click()");
  await wait("document.querySelector('#mine-choice')?.open");
 }
 const button=(label)=>`[...document.querySelectorAll('#mine-choice button')].find(b=>b.textContent.startsWith(${JSON.stringify(label)}))`;
 const choose=async label=>{
  await e(button(label)+'.click()');
  await wait("!document.querySelector('#mine-choice').open");
 };
 const reload=async()=>{
  await send('Page.reload');
  await wait("!!window.GameProgress && !document.querySelector('#continue').disabled");
  await e("document.querySelector('#continue').click()");
  await wait("document.querySelector('#game').dataset.scene==='world'");
 };

 await e("document.querySelector('[data-node=world-expedition]').click()");
 await wait('MouseNavigation.path.length>0');
 await openStation();
 const mineAccess=()=>e("DungeonRules.allowed(GameProgress.exportData().data.campaign,FOREST_NODES.find(n=>n.id==='frostmine-entrance'))");
 const originalAccess=await mineAccess();
 assert.equal(await e(button('Treat the injured')+'.disabled'),false);
 await choose('Continue toward the mine');
 assert.equal((await saved()).campaign.worldChanges.frostpeakAid,'passed');
 assert.equal((await saved()).campaign.potions,2);
 assert.equal(await mineAccess(),originalAccess);
 await reload();
 assert.equal((await saved()).campaign.worldChanges.frostpeakAid,'passed');
 await openStation();
 assert.equal(await e("!!"+button('Field medic')),false);
 await choose('Step back');

 await standAtStation(0);await openStation();
 assert.equal(await e(button('Treat the injured')+'.disabled'),true);
 await choose('Step back');
 await standAtStation(2);await openStation();
 await choose('Treat the injured');
 const helped=await saved();
 assert.equal(helped.campaign.potions,1);
 assert.deepEqual(helped.hp,journal.hp);
 assert.equal(helped.campaign.worldChanges.frostpeakAid,'helped');
 assert.equal(helped.campaign.questBoard.claimed.includes('lost-expedition'),false);
 assert.equal(await mineAccess(),originalAccess);
 await reload();
 assert.equal(await e("FOREST_NODES.find(n=>n.id==='world-expedition').name"),'Expedition field medic');
 await openStation();
 const expected=await e(`(()=>{const s=GameProgress.exportData().data;return s.hp.map((hp,i)=>hp?Math.min(RosterSystem.max(s,i),hp+Math.ceil(RosterSystem.max(s,i)*.25)):0);})()`);
 await choose('Field medic');
 const treated=await saved();
 assert.deepEqual(treated.hp,expected);
 assert.equal(treated.hp[2],0);
 assert.equal(treated.campaign.potions,1);
 await reload();await openStation();
 assert.match(await e(button('Field medic')+'.textContent'),/treatment used/);
 assert.equal(await e(button('Field medic')+'.disabled'),true);
 assert.deepEqual(errors,[]);
 assert.deepEqual(missing.filter(p=>!p.endsWith('/favicon.ico')),[]);
 console.log('PASS Frostpeak journal, both climbing-party choices, mine access, potion cost, and one-time medic after reload.');
}).catch(error=>{console.error(error);process.exitCode=1;});
