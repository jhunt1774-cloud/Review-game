const assert=require('node:assert/strict');
require('./browser-harness.cjs')(async({evaluate:e,send,wait,errors,missing})=>{
 // Retain coverage of the optional full-story flow; fast play has its own suite.
 await e(`StoryPacing.set('full')`);
 await e(`MotionPreference.set('still');document.querySelector('#forest-quest-start').click()`);
 const base=await e(`GameProgress.exportData()`);
 async function reward(id){await e(`(()=>{const f=${JSON.stringify(base)},s=f.data,c=s.campaign;s.phase='victory';s.encounter=Number('${id}'.slice(1));s.enemyHp=0;c.battleNode='${id}';c.completed=Array.from({length:s.encounter+1},(_,i)=>'m'+i);EquipmentLoot.defaults(c);c.lastEquipmentDrop=EquipmentLoot.catalog.find(i=>i.source==='${id}').name;GameProgress.restoreData(f);})()`);await wait(`!!document.querySelector('.forest-reward-equip')`);}
 await reward('m0');assert.equal(await e(`document.querySelectorAll('.forest-reward-equip button').length`),1);
 await e(`document.querySelector('.forest-reward-equip button').click()`);
 assert.equal(await e(`GameProgress.exportData().data.campaign.equipmentLoot.loadouts[0].weapon`),'mossbite');
 assert.equal(await e(`ForestAdventure.equipReward(0,'mossbite')`),false);
 assert.match(await e(`document.querySelector('.forest-reward-equip').textContent`),/Equipped on/);
 assert.equal(await e(`JSON.parse(localStorage.getItem('web-wizardry-forest-v1')).campaign.equipmentLoot.loadouts[0].weapon`),'mossbite');
 await reward('m1');assert.equal(await e(`ForestAdventure.equipReward(0,'moonfang')`),false);await e(`document.querySelector('.forest-reward-equip button').click()`);assert.equal(await e(`GameProgress.exportData().data.campaign.equipmentLoot.loadouts[2].weapon`),'moonfang');
 assert.equal(await e(`ForestAdventure.equipReward(0,'mossbite')`),false,'Cannot swap an earlier reward away from camp');
 await reward('m2');assert.equal(await e(`document.querySelectorAll('.forest-reward-equip button').length`),4);await e(`document.querySelectorAll('.forest-reward-equip button')[1].click()`);assert.equal(await e(`GameProgress.exportData().data.campaign.equipmentLoot.loadouts[1].armor`),'bridgeguard');
 await send('Emulation.setDeviceMetricsOverride',{width:768,height:600,deviceScaleFactor:1,mobile:false});assert.ok(await e(`document.documentElement.scrollWidth<=innerWidth`),'Reward choices fit a small Chromebook screen');
 assert.deepEqual(errors,[]);assert.deepEqual(missing.filter(x=>!x.endsWith('/favicon.ico')),[]);console.log('Reward choices: role restrictions, shared armor, save, duplicate/stale protection passed.');
});

