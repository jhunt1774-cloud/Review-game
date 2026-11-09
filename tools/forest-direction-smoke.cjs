const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
require('./browser-harness.cjs')(async({evaluate:e,send,wait,errors,missing,root})=>{
 await e(`MotionPreference.set('still');document.querySelector('#defense-mode').value='assisted';document.querySelector('#forest-quest-start').click()`);
 assert.ok(await e(`document.querySelector('#prologue-text').textContent.includes('river has stopped')`));
 const base=await e(`GameProgress.exportData()`),saved=()=>e(`JSON.parse(localStorage.getItem('web-wizardry-forest-v1'))`);
 async function fixture(id='m2',focus=0){
  await e(`(()=>{const f=${JSON.stringify(base)},s=f.data,c=s.campaign;s.phase='battle';s.encounter=Number('${id}'.slice(1));s.enemyHp=200;s.actor=0;c.battleNode='${id}';c.completed=['m0','m1'].slice(0,s.encounter);c.focus=${focus};c.forestQuest.sentinelOpening=0;GameProgress.restoreData(f);})()`);
  await wait(`!document.querySelector('#hero-command-menu').hidden`);
 }
 async function answer(action,good=true){const s=await saved();if(action!=='attack')await e(`document.querySelector('#hero-command-menu [data-group=skills]').click()`);await e(`document.querySelector('#hero-menu-actions [data-action=${action}]').click();document.querySelectorAll('#answers button')[${good?s.practice.question.correct:(s.practice.question.correct+1)%4}].click()`);await wait(`!document.querySelector('#next-question').hidden`);}
 async function next(){await e(`document.querySelector('#next-question').click()`);await wait(`!document.querySelector('#enemy-defense').hidden`);await e(`document.querySelector('#take-hit').click()`);await wait(`!document.querySelector('#hero-command-menu').hidden`);}
 const damage=()=>e(`(()=>{const s=GameProgress.exportData().data,p=TacticalRules.profile(2,'m2',s.enemyHp,200);return ['axe','blunt','piercing'].map(t=>TacticalRules.damage(100,t,p,0).damage);})()`);
 await fixture();assert.deepEqual(await damage(),[75,130,49]);
 assert.match(await e(`document.querySelector('#forest-battle-read').textContent`),/Armor braced/);
 await answer('guard',false);assert.equal((await saved()).campaign.forestQuest.sentinelOpening,0);
 await fixture();await answer('guard');assert.equal((await saved()).campaign.forestQuest.sentinelOpening,2);assert.deepEqual(await damage(),[125,163,125]);
 await send('Page.reload');await wait(`!!window.ForestDirection && !document.querySelector('#forest-quest-continue').disabled`);await e(`document.querySelector('#defense-mode').value='assisted';document.querySelector('#forest-quest-continue').click()`);await wait(`!document.querySelector('#enemy-defense').hidden`);await e(`document.querySelector('#take-hit').click()`);await wait(`!document.querySelector('#hero-command-menu').hidden`);
 assert.equal((await saved()).campaign.forestQuest.sentinelOpening,2);
 await answer('attack');assert.equal((await saved()).campaign.forestQuest.sentinelOpening,1);await next();await answer('attack');assert.equal((await saved()).campaign.forestQuest.sentinelOpening,0);
 await fixture('m0',3);assert.equal(await e(`document.querySelector('#hero-menu-actions [data-action=channel]').disabled`),true);await e(`document.querySelector('#hero-menu-actions [data-action=channel]').onclick()`);assert.equal(await e(`document.querySelector('#hero-command-menu').hidden`),false,'Stale clicks cannot choose a zero-gain channel');
 await fixture('m2');await e(`(()=>{const f=GameProgress.exportData();f.data.enemyHp=176;GameProgress.restoreData(f);document.querySelector('#forest-battle-read').open=true;})()`);await new Promise(r=>setTimeout(r,700));
 fs.writeFileSync(path.resolve(root,'../forest-tactics-desktop.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await send('Emulation.setDeviceMetricsOverride',{width:768,height:600,deviceScaleFactor:1,mobile:false});
 await new Promise(r=>setTimeout(r,700));
 assert.ok(await e(`document.documentElement.scrollWidth<=innerWidth`));
 assert.ok(await e(`document.querySelector('#forest-battle-read').getBoundingClientRect().right<=innerWidth`));
 assert.ok(await e(`(()=>{const r=document.querySelector('#forest-battle-read').getBoundingClientRect();return r.top>=0&&r.bottom<innerHeight*.65;})()`));
 fs.writeFileSync(path.resolve(root,'../forest-tactics-small.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 for(const phase of [0,1,2]){await e(`(()=>{const f=${JSON.stringify(base)},s=f.data;s.phase='battle';s.encounter=3;s.campaign.battleNode='m3';s.campaign.completed=['m0','m1','m2'];s.enemyHp=${[340,190,50][phase]};GameProgress.restoreData(f);})()`);await wait(`!document.querySelector('#hero-command-menu').hidden`);assert.equal(await e(`document.querySelector('#arena').dataset.forestBinding`),['shell','bark','heart'][phase]);}
 const invalid=await e(`(()=>{const s=GameProgress.exportData().data;s.campaign.forestQuest.sentinelOpening=3;return GameProgress.validate(s)===null;})()`);assert.ok(invalid);
 await e(`(()=>{const f=${JSON.stringify(base)};delete f.data.adventure;delete f.data.campaign.forestQuest;f.slot='web-wizardry-teacher-save-v1';f.data.phase='battle';f.data.encounter=2;f.data.campaign.battleNode='m2';GameProgress.restoreData(f);})()`);await wait(`!document.querySelector('#hero-command-menu').hidden`);assert.ok(await e(`document.querySelector('#forest-battle-read').hidden`));assert.deepEqual(await damage(),[100,130,65]);
 assert.equal(await e(`ForestVisuals.restoration('m0')===ForestVisuals.restoration('m0')`),true);
 assert.equal(await e(`ForestVisuals.restoration('m0').width`),160);
 assert.deepEqual(errors,[]);assert.deepEqual(missing.filter(p=>p!=='/favicon.ico'),[]);
 console.log('PASS sentinel brace/open multipliers, correct-only guard, two follow-up hits, reload persistence, capped-focus protection, story opening, phase visuals, small-screen briefing, cached recovery art and campaign isolation.');
}).catch(error=>{console.error(error);process.exitCode=1;});
