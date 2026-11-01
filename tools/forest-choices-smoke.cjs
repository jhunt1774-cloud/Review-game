const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
require('./browser-harness.cjs')(async({evaluate:e,send,wait,errors,missing,root})=>{
 assert.equal(await e(`document.querySelector('#startup-error-detail').textContent`),'');
 await e(`MotionPreference.set('still');document.querySelector('#defense-mode').value='assisted';document.querySelector('#forest-quest-start').click()`);await wait(`document.querySelector('#game').dataset.scene==='prologue'`);
 await e(`window.choiceBase=GameProgress.exportData();choiceBase.data.phase='world';choiceBase.data.campaign.completed=['m0'];choiceBase.data.campaign.explorePosition={x:22,y:68,chapter:0};GameProgress.restoreData(JSON.parse(JSON.stringify(choiceBase)))`);
 await wait(`!document.querySelector('#crypt-interact').hidden`);await e(`document.querySelector('#crypt-interact').click()`);await wait(`document.querySelector('#mine-choice')?.open`);const before=await e(`GameProgress.exportData().data.campaign.potions`);await e(`document.querySelector('#mine-choice button').click()`);
 assert.equal(await e(`GameProgress.exportData().data.campaign.potions`),before+2);
 assert.equal(await e(`ForestAdventure.available(GameProgress.exportData().data.campaign,FOREST_NODES.find(n=>n.id==='forest-spirit'))`),false);
 assert.equal(await e(`ForestAdventure.available(GameProgress.exportData().data.campaign,FOREST_NODES.find(n=>n.id==='forest-supplies'))`),false);
 const invalid=await e(`(()=>{const s=GameProgress.exportData().data;s.campaign.forestQuest.returnPoint={x:Infinity,y:10,chapter:0};return GameProgress.validate(s)===null;})()`);assert.ok(invalid);
 await e(`document.querySelector('#home').click();window.lesson={version:1,name:'Exact classroom wording',difficulty:'beginner',questions:[{topic:'Programming',text:'Classroom-only question: choose green.',answers:['red','blue','green','yellow'],correct:2,explanation:'Our class selected green.'}]};TeacherMode.load(lesson);document.querySelector('#teacher-forest-quest').click()`);
 await wait(`document.querySelector('#forest-quest-start').dataset.confirm==='yes'`);await e(`document.querySelector('#forest-quest-start').click()`);await wait(`document.querySelector('#game').dataset.scene==='prologue'`);
 assert.equal(await e(`GameProgress.exportData().data.lesson.name`),'Exact classroom wording');
 await e(`(()=>{const f=GameProgress.exportData();f.data.phase='battle';f.data.enemyHp=100;GameProgress.restoreData(f);})()`);
 await wait(`document.querySelector('#question').textContent==='Classroom-only question: choose green.'`);
 await e(`document.querySelector('#hero-menu-actions [data-action=attack]').click();document.querySelectorAll('#answers button')[2].click()`);
 await wait(`JSON.parse(localStorage.getItem('web-wizardry-forest-v1')).correct===1`);
 await e(`document.querySelector('#next-question').click()`);
 for(let i=0;i<40;i++){await e(`if(!document.querySelector('#enemy-defense').hidden)document.querySelector('#attack-cue').click()`);if(await e(`!document.querySelector('#hero-command-menu').hidden`))break;await new Promise(r=>setTimeout(r,100));}
 await e(`document.querySelector('#home').click()`);await wait(`document.querySelector('#game').dataset.scene==='title'`);
 await e(`(async()=>{location.hash='#quest='+await AssignmentLinks.encode(lesson);})()`);await wait(`!document.querySelector('#linked-assignment-start').disabled && document.querySelector('#linked-assignment-name').textContent==='Exact classroom wording'`);
 await e(`document.querySelector('#forest-quest-start').click()`);await wait(`document.querySelector('#forest-quest-start').dataset.confirm==='yes'`);await e(`document.querySelector('#forest-quest-start').click()`);await wait(`document.querySelector('#game').dataset.scene==='prologue'`);assert.equal(await e(`GameProgress.exportData().data.lesson.name`),'Exact classroom wording');
 await send('Runtime.evaluate',{expression:`document.querySelector('#sound').click()`,userGesture:true});await wait(`!document.querySelector('#sound').disabled`,20000);assert.equal(await e(`document.querySelector('#sound').textContent`),'Sound on');
 await e(`document.querySelector('#begin-chapter').click()`);await wait(`document.querySelector('#game').dataset.scene==='world'`);
 const d=await e(`({roam:RoamingWorld.actors.length,gate:!RegionGates.open(0,GameProgress.exportData().data.campaign.completed),board:!document.querySelector('#forest-trail-board').hidden})`);assert.equal(d.roam,0);assert.ok(d.gate&&d.board);
 await send('Emulation.setDeviceMetricsOverride',{width:768,height:600,deviceScaleFactor:1,mobile:false});
 await new Promise(r=>setTimeout(r,800));fs.writeFileSync(path.resolve(root,'../forest-small-screen.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 const box=await e(`(()=>{const r=document.querySelector('#forest-trail-board').getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:innerWidth,height:innerHeight};})()`);assert.ok(box.left>=0&&box.right<=box.width&&box.bottom<box.height);

 await send('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false});
 assert.equal(await e(`document.querySelector('#camp-quest-board').textContent.includes('Your forest goals')`),true);
 await e(`(()=>{const f=GameProgress.exportData();f.data.phase='complete';f.data.encounter=3;f.data.enemyHp=0;f.data.correct=24;f.data.wrong=1;f.data.campaign.completed=['m0','m1','m2','m3'];f.data.campaign.battleNode='m3';f.data.campaign.forestQuest.ranger=true;f.data.campaign.forestQuest.boon='spirit';f.data.campaign.forestQuest.shortcut=true;GameProgress.restoreData(f);})()`);
 await wait(`document.querySelector('#game').dataset.scene==='result'`);await new Promise(r=>setTimeout(r,800));
 const finishBox=await e(`(()=>{const b=document.querySelector('#advance').getBoundingClientRect();return {bottom:b.bottom,height:innerHeight};})()`);assert.ok(finishBox.bottom<finishBox.height,'Ending action should fit the desktop viewport');
 fs.writeFileSync(path.resolve(root,'../forest-finale-layout.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await e(`document.querySelector('#advance').click()`);
 await e(`(()=>{const f=GameProgress.exportData(),p=ForestWorld.nearest({x:22,y:12});f.data.campaign.explorePosition={x:p.x,y:p.y,chapter:0};GameProgress.restoreData(f);})()`);
 await new Promise(r=>setTimeout(r,800));fs.writeFileSync(path.resolve(root,'../forest-restored.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));


 const forestBefore=await e(`localStorage.getItem('web-wizardry-forest-v1')`);
 await e(`(()=>{const f=GameProgress.exportData();f.slot='web-wizardry-teacher-save-v1';delete f.data.adventure;delete f.data.campaign.forestQuest;f.data.phase='victory';f.data.encounter=0;f.data.campaign.completed=['m0'];f.data.campaign.battleNode='m0';GameProgress.restoreData(f);})()`);
 assert.equal(await e(`document.querySelector('#result').dataset.forestQuest`),'false');
 assert.equal(await e(`!!ForestAdventure.forgeDetails`),false);assert.ok(await e(`document.querySelector('#rune-upgrades').children.length>0`));
 assert.equal(await e(`localStorage.getItem('web-wizardry-forest-v1')`),forestBefore);

 assert.deepEqual(errors,[]);assert.deepEqual(missing.filter(p=>p!=='/favicon.ico'),[]);console.log('PASS: supplies once, exclusive spirit choice, invalid restore rejection, teacher questions preserved in actual combat, linked assignment launch, audio starts, no inert roaming enemies, sealed boss gate, 768x600 route panel, compact ending, restored map and normal forge restored.');
}).catch(error=>{console.error(error);process.exitCode=1;});
