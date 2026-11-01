const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
require('./browser-harness.cjs')(async({evaluate:e,send,wait,errors,missing,root})=>{
 const slot='web-wizardry-forest-v1';
 const state=()=>e(`JSON.parse(localStorage.getItem('${slot}'))`);
 await e(`MotionPreference.set('still');document.querySelector('#defense-mode').value='assisted';document.querySelector('#start').click()`);
 await e(`document.querySelector('#home').click()`);const original=await e(`localStorage.getItem('web-wizardry-v1')`);assert.ok(original);
 await e(`document.querySelector('#forest-quest-start').click()`);
 await wait(`document.querySelector('#game').dataset.scene==='prologue'`);assert.equal((await state()).adventure,'forest-quest');
 await e(`document.querySelector('#begin-chapter').click()`);
 await wait(`document.querySelector('#game').dataset.scene==='world' && !!document.querySelector('#quest-route-overlay path').getAttribute('d')`);
 const paths=await e(`(()=>{const c=GameProgress.exportData().data.campaign,p=c.explorePosition||MapRoutes.graphs[0].points.get(c.location)||MapRoutes.graphs[0].points.get("entry");return ['m0','m1','m2','forest-supplies','forest-spirit','forest-ranger'].map(id=>{const n=FOREST_NODES.find(n=>n.id===id),r=ForestWorld.route(p,n,true);return {id,walkable:ForestWorld.walkable(n),reachable:!!r,length:r?.length};});})()`);
 console.log('ROUTES',JSON.stringify(paths));assert.ok(paths.every(p=>p.walkable&&p.reachable));
 fs.writeFileSync(path.resolve(root,'../forest-start.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 async function walk(id){await e(`(()=>{const c=GameProgress.exportData().data.campaign,n=FOREST_NODES.find(n=>n.id===${JSON.stringify(id)});MouseNavigation.path=MouseNavigation.route(0,c.explorePosition||MapRoutes.graphs[0].points.get(c.location)||MapRoutes.graphs[0].points.get("entry"),n,!RegionGates.open(0,c.completed));})()`);}
 async function fight(id,wrong=false){
  await walk(id);await wait(`document.querySelector('#game').dataset.scene==='arrival' && !document.querySelector('#begin-encounter').disabled`,30000);
  await e(`document.querySelector('#begin-encounter').click()`);if(id==='m3'){const prepared=await state();assert.equal(prepared.campaign.shield,1);assert.equal(prepared.campaign.focus,2);}
  const actors=new Set();let attempted=-1,usedWrong=false;const until=Date.now()+120000;
  while(Date.now()<until){
   const s=await state();if(['victory','complete','defeat'].includes(s.phase))break;
   const status=await e(`({review:!document.querySelector('#next-question').hidden,defense:!document.querySelector('#enemy-defense').hidden,question:document.querySelector('#question').textContent,menu:!document.querySelector('#hero-command-menu').hidden})`);
   if(status.defense)await e(`document.querySelector('#attack-cue').click()`);
   else if(status.review)await e(`document.querySelector('#next-question').click()`);
   else if(s.phase==='battle'&&s.practice&&s.practice.index===s.qIndex&&attempted!==s.qIndex){actors.add(s.actor);attempted=s.qIndex;const answer=wrong&&!usedWrong?(s.practice.question.correct+1)%4:s.practice.question.correct;usedWrong=usedWrong||wrong;await e(`document.querySelector('#hero-menu-actions [data-action=attack]')?.click();document.querySelectorAll('#answers button')[${answer}].click()`);}
   await new Promise(r=>setTimeout(r,80));
  }
  const s=await state();assert.notEqual(s.phase,'defeat');assert.ok(['victory','complete'].includes(s.phase),id+' should finish');
  await wait(`document.querySelector('#game').dataset.scene==='result'`,10000);await new Promise(r=>setTimeout(r,800));
  console.log('VICTORY',id,JSON.stringify({phase:s.phase,correct:s.correct,wrong:s.wrong,actors:[...actors],walkSeconds:s.campaign.forestQuest.walkingSeconds}));
 }
 await fight('m0',true);await e(`document.querySelector('#advance').click()`);
 await walk('forest-spirit');await wait(`!document.querySelector('#crypt-interact').hidden && document.querySelector('#crypt-interact').textContent.includes('Moonwell spirit')`,20000);await e(`document.querySelector('#crypt-interact').click()`);await wait(`!!document.querySelector('#mine-choice')?.open`,20000);await e(`document.querySelector('#mine-choice button').click()`);
 assert.equal((await state()).campaign.forestQuest.boon,'spirit');assert.equal(await e(`ForestAdventure.available(GameProgress.exportData().data.campaign,FOREST_NODES.find(n=>n.id==='forest-supplies'))`),false);
 await fight('m1');await e(`document.querySelector('#advance').click()`);
 await e(`document.querySelector('#forest-camp').click()`);await wait(`document.querySelector('#map-dialog').open`);await e(`document.querySelector('#close-map-dialog').click();document.querySelector('#forest-return').click()`);
 await walk('forest-ranger');await wait(`!document.querySelector('#crypt-interact').hidden && document.querySelector('#crypt-interact').textContent.includes('Ranger caught')`,20000);await e(`document.querySelector('#crypt-interact').click()`);await wait(`document.querySelector('#mine-choice')?.open`,20000);await e(`document.querySelector('#mine-choice button').click()`);assert.equal((await state()).campaign.forestQuest.ranger,true);await send('Page.reload');await wait(`!!window.TeacherContent && !!window.ForestAdventure && !document.querySelector('#forest-quest-continue').disabled`);await e(`document.querySelector('#forest-quest-continue').click()`);await wait(`document.querySelector('#game').dataset.scene==='world'`);
 await fight('m2');await e(`document.querySelector('#advance').click();document.querySelector('#forest-canopy').click()`);assert.equal((await state()).campaign.forestQuest.shortcut,true);
 await fight('m3');const finished=await state();assert.equal(finished.phase,'complete');assert.ok(await e(`document.querySelector('.forest-finish').textContent.includes('rescued the ranger')`));
 assert.equal(await e(`localStorage.getItem('web-wizardry-v1')`),original,'Full campaign save must be unchanged');
 fs.writeFileSync(path.resolve(root,'../forest-victory.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await e(`document.querySelector('#advance').click()`);assert.equal(await e(`document.querySelector('#world').dataset.forestRestored`),'true');
 await e(`document.querySelector('#forest-recap').click();document.querySelector('#menu').click();document.querySelector('#forest-quest-continue').click()`);await wait(`document.querySelector('#game').dataset.scene==='result'`);
 assert.equal((await state()).phase,'complete');
 await e(`document.querySelector('#menu').click();document.querySelector('#continue').click();document.querySelector('#begin-chapter').click()`);
 await wait(`document.querySelector('#game').dataset.scene==='world'`);assert.equal(await e(`ForestAdventure.active(GameProgress.exportData().data)`),false);
 assert.equal(await e(`FOREST_NODES.find(n=>n.id==='m2').x`),76,'Campaign map anchor restored');
 assert.equal(await e(`DungeonRules.visible(FOREST_NODES.find(n=>n.id==='forest-spirit'))`),false);
 assert.deepEqual(errors,[]);assert.deepEqual(missing.filter(p=>p!=='/favicon.ico'),[]);
 console.log('PASS full forest quest, real walking, wrong answer, both shortcuts, exclusive boon, ranger, boss, restored map, recap, continue, campaign save and geometry isolation.');
}).catch(error=>{console.error(error);process.exitCode=1;});
