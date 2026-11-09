const assert=require('node:assert/strict');
require('./browser-harness.cjs')(async({evaluate:e,send,wait,errors,missing})=>{
 assert.equal(await e(`!!document.querySelector('script[src*="cloud-saves"],script[src*="cloud-config"]')`),false);
 assert.equal(await e(`performance.getEntriesByType('resource').some(r=>!r.name.startsWith(location.origin))`),false);
 // Exercise the shipped document-reader modules with project-relative paths.
 assert.equal(await e(`(async()=>{const pdf=await import('./document-libs/pdf.mjs');return typeof pdf.getDocument;})()`),'function');
 assert.equal(await e(`(async()=>{await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='./document-libs/mammoth.browser.js';s.onload=resolve;s.onerror=reject;document.head.append(s);});return typeof mammoth.extractRawText;})()`),'function');
 await e(`MotionPreference.set('still');document.querySelector('#defense-mode').value='assisted';document.querySelector('#forest-quest-start').click()`);
 const base=await e(`GameProgress.exportData()`);
 const saved=()=>e(`JSON.parse(localStorage.getItem('web-wizardry-forest-v1'))`);
 async function fixture(){
  await e(`(()=>{const f=${JSON.stringify(base)};f.data.phase='battle';f.data.encounter=0;f.data.enemyHp=200;f.data.campaign.battleNode='m0';GameProgress.restoreData(f);})()`);
  await wait(`!document.querySelector('#hero-command-menu').hidden`);
  assert.match(await e(`document.querySelector('#trail').textContent`),/1 of 4/);
  assert.match(await e(`document.querySelector('#battle-chapter').textContent`),/ENCOUNTER 1 OF 4/);
 }
 async function answer(correct){
  const s=await saved(),i=correct?s.practice.question.correct:(s.practice.question.correct+1)%4;
  await e(`document.querySelector('#hero-menu-actions [data-action=attack]').click();document.querySelectorAll('#answers button')[${i}].click()`);
  await wait(`!document.querySelector('#next-question').hidden`);
 }
 await fixture();await answer(true);let s=await saved();assert.ok(s.enemyHp<200);assert.equal(s.correct,1);assert.equal(s.wrong,0);
 await fixture();await answer(false);s=await saved();assert.equal(s.enemyHp,200);assert.equal(s.wrong,1);assert.equal(s.correct,0);assert.ok(s.pendingEnemy.damage>0);
 const before=s.hp.reduce((a,b)=>a+b,0),index=s.qIndex;
 // Closing in answer review must preserve the incoming strike without another answer.
 await send('Page.reload');await wait(`!!window.ForestAdventure && !document.querySelector('#forest-quest-continue').disabled`);
 await e(`document.querySelector('#defense-mode').value='assisted';document.querySelector('#forest-quest-continue').click()`);
 await wait(`!document.querySelector('#enemy-defense').hidden`);
 await e(`document.querySelector('#take-hit').click()`);
 await wait(`!document.querySelector('#hero-command-menu').hidden`);
 s=await saved();assert.ok(s.hp.reduce((a,b)=>a+b,0)<before);assert.equal(s.enemyHp,200);assert.equal(s.qIndex,index);assert.equal(s.wrong,1);assert.ok(!s.pendingEnemy);
 const after=s.hp;
 await send('Page.reload');await wait(`!!window.ForestAdventure && !document.querySelector('#forest-quest-continue').disabled`);await e(`document.querySelector('#forest-quest-continue').click()`);await wait(`!document.querySelector('#hero-command-menu').hidden`);
 assert.deepEqual((await saved()).hp,after,'Resolved enemy damage must not repeat on reload');
 assert.deepEqual(errors,[]);assert.deepEqual(missing.filter(p=>p!=='/favicon.ico'),[]);
 console.log('PASS classroom: local-only startup, PDF/Word readers at project path, four-encounter HUD, correct-answer damage, wrong-answer HP loss, pending-strike reload and no duplicate damage.');
}).catch(error=>{console.error(error);process.exitCode=1;});
