const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

require('./browser-harness.cjs')(async ({evaluate, send, wait, errors, missing, root}) => {
 const prefix = process.env.SITE_PREFIX || '/';
 const preview = 'http://127.0.0.1:8138' + prefix + '?swordPreview=1';
 await send('Emulation.setDeviceMetricsOverride', {width:Number(process.env.SWORD_WIDTH)||1024,height:Number(process.env.SWORD_HEIGHT)||600,deviceScaleFactor:1,mobile:false});
 await evaluate("document.querySelector('#forest-quest-start').click()");
 const base = await evaluate('GameProgress.exportData()');
 const saved = () => evaluate("JSON.parse(localStorage.getItem('web-wizardry-forest-v1'))");

 async function fixture({motion='full', hp=113, focus=0}={}) {
  const data = structuredClone(base);
  data.data.phase = 'battle';
  data.data.encounter = 0;
  data.data.enemyHp = hp;
  data.data.campaign.battleNode = 'm0';
  data.data.campaign.focus = focus;
  await evaluate(`MotionPreference.set('${motion}');GameProgress.restoreData(${JSON.stringify(data)});`);
  await wait("!document.querySelector('#hero-command-menu').hidden");
 }

 async function answer(correct=true, action='attack') {
  const question = (await saved()).practice.question;
  const index = correct ? question.correct : (question.correct+1)%question.answers.length;
  await evaluate(`document.querySelector('#hero-menu-actions [data-action=${action}]').click();
   document.querySelectorAll('#answers button')[${index}].click()`);
  await wait("!document.querySelector('#next-question').hidden || !document.querySelector('#result').hidden");
  return saved();
 }

 await fixture();
 const control = await answer();
 const damage = 113 - control.enemyHp;
 assert.ok(damage > 0);
 assert.equal(await evaluate('Boolean(window.PaintedSwordPreview)'), false);
 await fixture({focus:2});
 const controlSpecial=await answer(true,'special');
 assert.ok(controlSpecial.enemyHp < control.enemyHp);
 assert.equal(controlSpecial.campaign.focus,0);

 await send('Page.navigate', {url:preview});
 await wait('!!window.PaintedSwordPreview && !!window.GameProgress');
 await wait(`PaintedSwordPreview.configFor(HEROES[0],0,${JSON.stringify(base.data)}).paintedSwordPreview===true`);
 const gearCheck = await evaluate(`(()=>{const fixture=${JSON.stringify(base.data)};fixture.campaign.equipmentLoot={loadouts:[{weapon:'loot-preview'}]};return PaintedSwordPreview.configFor(HEROES[0],0,fixture)===HEROES[0];})()`);
 assert.ok(gearCheck);
 await evaluate(`window.strikeLog=[];window.phaseLog=[];window.strideLog={approach:[],retreat:[]};
  const oldContact=CombatPresentation.contact;
  CombatPresentation.contact=function(args){
   const hero=document.querySelector('#hero-0');
   strikeLog.push([hero.dataset.swordPhase||null,args.target.dataset.state,args.damage]);
   return oldContact.call(this,args);
  };
  for(const cue of ['launch','impact']){
   const original=CombatAudio.prototype[cue];
   CombatAudio.prototype[cue]=function(type,...args){
    if(type==='sword')strikeLog.push(cue);
    if(type==='sword-special')strikeLog.push('special-'+cue);
    return original.call(this,type,...args);
   };
  }`);
 await fixture();
 await wait("document.querySelector('#hero-menu-title img')?.naturalWidth===192");
 assert.match(await evaluate("document.querySelector('#hero-menu-title img').src"),/painted-swordsman-portrait/);
 assert.match(await evaluate("PartyAppearance.portrait('thorin').style.backgroundImage"),/painted-swordsman-portrait/);
 assert.doesNotMatch(await evaluate("PartyAppearance.portrait('brom').style.backgroundImage"),/painted-swordsman-portrait/);
 await evaluate(`new MutationObserver(records=>{
  for(const {target} of records){
   const phase=target.dataset.swordPhase;
   if(!phase)continue;
   phaseLog.push(phase);
   if(strideLog[phase])strideLog[phase].push(Number(target.dataset.frame));
  }
 }).observe(document.querySelector('#hero-0'),{attributeFilter:['data-sword-phase','data-frame']});`);

 if(process.env.SWORD_SCREENSHOT) {
  await evaluate(`const original=PaintedSwordPreview.play;
   PaintedSwordPreview.play=function(args){
    return original.call(this,{...args,onImpact:async()=>{
     await args.onImpact();
     await new Promise(resolve=>{window.resumeSword=resolve;});
    }});
   };`);
 }
 const attack=answer();
 if(process.env.SWORD_SCREENSHOT) {
  await wait("typeof window.resumeSword==='function'");
  try {
   const picture=await send('Page.captureScreenshot',{format:'png'});
   fs.writeFileSync(path.resolve(root,process.env.SWORD_SCREENSHOT),Buffer.from(picture.data,'base64'));
  } finally {
   await evaluate('window.resumeSword();PaintedSwordPreview.play=original;');
  }
 }
 const full=await attack;
 assert.equal(full.enemyHp,control.enemyHp);
 assert.equal(full.correct,1);
 assert.equal(full.pendingEnemy.damage,control.pendingEnemy.damage);
 assert.deepEqual(await evaluate('strikeLog'),['launch','impact',['impact','hurt',damage]]);
 assert.deepEqual(await evaluate('[...new Set(phaseLog)]'),['approach','windup','swing','impact','follow-through','recovery','retreat']);
 const strides=await evaluate('Object.fromEntries(Object.entries(strideLog).map(([phase,frames])=>[phase,[...new Set(frames)]]))');
 assert.deepEqual(strides,{approach:[6,7,8,9],retreat:[9,8,7,6]});
 assert.equal(await evaluate("document.querySelector('#hero-0').style.translate"),'');

 await fixture();
 await evaluate('strikeLog.length=0');
 const wrong=await answer(false);
 assert.equal(wrong.enemyHp,113);
 assert.equal(wrong.wrong,1);
 assert.deepEqual(await evaluate('strikeLog'),[]);

 await fixture({motion:'still'});
 assert.equal((await answer()).enemyHp,control.enemyHp);
 assert.deepEqual(await evaluate('strikeLog'),[[null,'hurt',damage]]);

 await fixture({hp:1});
 await evaluate('strikeLog.length=0');
 await answer();
 assert.deepEqual(await evaluate('strikeLog'),['launch','impact',['impact','defeat',1]]);

 await fixture();
 const defenses = await evaluate(`(async()=>{
  const arena=document.querySelector('#arena');
  const hero=document.createElement('div'),enemy=document.createElement('div'),layer=document.createElement('div');
  arena.append(hero,enemy,layer);
  const defender=new CharacterRenderer(hero,PaintedSwordPreview.configFor(HEROES[0],0,GameProgress.exportData().data));
  const attacker=new CharacterRenderer(enemy,HEROES[1]);
  const results=[];
  try {
   const cases=[['dodge','perfect',false],['parry','guard',false],['dodge','miss',false],['parry','perfect',true]];
   for(const [action,grade,still] of cases){
    MotionPreference.set(still?'still':'full');
    defender.setState('idle',true);
    const frames=[],cues=[];
    const observer=new MutationObserver(()=>frames.push(Number(hero.dataset.frame)));
    observer.observe(hero,{attributeFilter:['data-frame']});
    const audio={warning(){},launch(){},defense(){cues.push('defense');},impact(){cues.push('impact');}};
    const strike={renderer:attacker,defenders:[defender],type:'claw',arena,layer,audio,valid:()=>true};
    const step={action,grade};
    const prepared=CombatTelegraph.create(strike);
    prepared.defend(step);
    const before=Number(hero.dataset.frame);
    await Promise.resolve();
    let hits=0;
    await CombatTiming.enemyStrike({...strike,step,prepared,onImpact(){hits++;if(grade!=='perfect')defender.setState('hurt',true);}});
    observer.disconnect();
    results.push({before,hits,cues,frames:[...new Set(frames.filter(n=>n>=10))],defense:hero.dataset.defense||null,state:defender.state});
   }
  } finally {
   defender.destroy();attacker.destroy();hero.remove();enemy.remove();layer.remove();MotionPreference.set('full');
  }
  return results;
 })()`);
 assert.deepEqual(defenses,[
  {before:10,hits:1,cues:['defense'],frames:[10,11,12],defense:null,state:'idle'},
  {before:13,hits:1,cues:['defense'],frames:[13,14,15],defense:null,state:'idle'},
  {before:0,hits:1,cues:['impact'],frames:[],defense:null,state:'hurt'},
  {before:0,hits:1,cues:['defense'],frames:[],defense:null,state:'idle'}
 ]);

 await fixture();
 assert.equal(await evaluate("document.querySelector('#hero-menu-actions [data-action=special]').disabled"),true);
 await fixture({focus:2});
 assert.match(await evaluate("document.querySelector('#hero-menu-actions [data-action=special]').textContent"),/Ironfall cleave/);
 await evaluate('strikeLog.length=0');
 const special=await answer(true,'special');
 assert.equal(special.enemyHp,controlSpecial.enemyHp);
 assert.equal(special.campaign.focus,controlSpecial.campaign.focus);
 assert.equal(special.correct,1);
 assert.deepEqual(await evaluate('strikeLog'),['special-launch','special-impact',['impact','hurt',113-special.enemyHp]]);

 await fixture({motion:'still',focus:2});
 await evaluate('strikeLog.length=0');
 assert.equal((await answer(true,'special')).enemyHp,controlSpecial.enemyHp);
 assert.deepEqual(await evaluate('strikeLog'),[[null,'hurt',113-special.enemyHp]]);

 await send('Network.enable');
 await send('Network.setBlockedURLs',{urls:['*painted-swordsman-strike.webp*']});
 await send('Page.reload');
 await wait('!!window.PaintedSwordPreview && !!window.GameProgress');
 await fixture();
 assert.equal((await answer()).enemyHp,control.enemyHp);
 assert.equal(await evaluate("document.querySelector('#hero-0').hasAttribute('data-sword-phase')"),false);
 assert.deepEqual(errors,[]);
 assert.deepEqual(missing.filter(file=>!file.endsWith('/favicon.ico')),[]);
 console.log('PASS Painted swordsman: authored phases, synchronized contact and audio, dodge and parry, special Focus and damage, quiz and damage parity, lethal hit, Still poses, blocked atlas and cleanup.');
}).catch(error=>{console.error(error);process.exitCode=1;});
