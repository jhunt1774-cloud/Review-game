const assert = require('node:assert/strict');

require('./browser-harness.cjs')(async ({evaluate,send,wait,errors,missing}) => {
 await send('Emulation.setDeviceMetricsOverride',{width:1024,height:600,deviceScaleFactor:1,mobile:false});
 await evaluate(`MotionPreference.set('full');document.querySelector('#forest-quest-start').click()`);
 assert.match(await evaluate(`document.querySelector('.hero-appearance option[value="human-warrior"]').textContent`),/Alden.*Human warrior/);
 const base = await evaluate('GameProgress.exportData()');
 const saved = () => evaluate(`JSON.parse(localStorage.getItem('web-wizardry-forest-v1'))`);

 async function instrument() {
  await evaluate(`window.strikeLog=[];
   const originalContact=CombatPresentation.contact;
   CombatPresentation.contact=function(args){
    const hero=document.querySelector('#hero-0');
    const canvas=hero.querySelector('canvas[width="240"]');
    strikeLog.push({
     phase:hero.dataset.swordPhase||null,
     recoil:args.target.dataset.state,
     damage:args.damage,
     sprite:!!canvas && canvas.getContext('2d').getImageData(120,150,1,1).data[3]>0
    });
    return originalContact.call(this,args);
   };
   for(const cue of ['launch','impact']){
    const original=CombatAudio.prototype[cue];
    CombatAudio.prototype[cue]=function(type,...args){
     if(type==='sword') strikeLog.push(cue);
     return original.call(this,type,...args);
    };
   }`);
 }
 async function fixture({member='human-warrior', motion='full', hp=200}={}) {
  const data = structuredClone(base);
  data.data.phase = 'battle';
  data.data.encounter = 0;
  data.data.enemyHp = hp;
  data.data.campaign.battleNode = 'm0';
  data.data.campaign.activeRoster[0] = member;
  await evaluate(`MotionPreference.set('${motion}');strikeLog.length=0;GameProgress.restoreData(${JSON.stringify(data)});`);
  await wait(`!document.querySelector('#hero-command-menu').hidden`);
  await evaluate(`(()=>{window.phaseLog=[];const hero=document.querySelector('#hero-0');
   new MutationObserver(()=>{if(hero.dataset.swordPhase)phaseLog.push(hero.dataset.swordPhase);})
    .observe(hero,{attributeFilter:['data-sword-phase']});})()`);
 }
 async function answer(correct=true) {
  const question = (await saved()).practice.question;
  const index = correct ? question.correct : (question.correct+1)%4;
  await evaluate(`document.querySelector('#hero-menu-actions [data-action=attack]').click();
   document.querySelectorAll('#answers button')[${index}].click()`);
  await wait(`!document.querySelector('#next-question').hidden || !document.querySelector('#result').hidden`);
  return saved();
 }

 await instrument();
 await fixture({member:'thorin',motion:'still'});
 const control = await answer();
 const expectedDamage = 200 - control.enemyHp;
 assert.ok(expectedDamage > 0);

 await fixture();
 assert.equal(await evaluate('HumanSwordAttack.preload({config:HEROES[0]})'),true);
 const full = await answer();
 assert.equal(full.enemyHp,control.enemyHp);
 assert.equal(full.correct,1);
 assert.equal(full.wrong,0);
 assert.equal(full.pendingEnemy.damage,control.pendingEnemy.damage);
 const strike = await evaluate('strikeLog');
 assert.deepEqual(strike,['launch','impact',{phase:'impact',recoil:'hurt',damage:expectedDamage,sprite:true}]);
 assert.deepEqual(await evaluate('[...new Set(phaseLog)]'),['approach','windup','swing','impact','recovery','retreat']);
 assert.equal(await evaluate(`document.querySelector('#hero-0').querySelectorAll('canvas').length`),1);
 assert.equal(await evaluate(`document.querySelector('#hero-0').style.translate`),'');

 await fixture();
 const wrong = await answer(false);
 assert.equal(wrong.enemyHp,200);
 assert.equal(wrong.wrong,1);
 assert.ok(wrong.pendingEnemy.damage>full.pendingEnemy.damage);
 assert.deepEqual(await evaluate('strikeLog'),[]);

 await fixture({motion:'still'});
 assert.equal((await answer()).enemyHp,control.enemyHp);
 assert.deepEqual(await evaluate('strikeLog'),['launch','impact',{phase:null,recoil:'hurt',damage:expectedDamage,sprite:false}]);

 await fixture({hp:1});
 await answer();
 assert.deepEqual(await evaluate('strikeLog'),['launch','impact',{phase:'impact',recoil:'defeat',damage:1,sprite:true}]);

 await send('Network.enable');
 await send('Network.setBlockedURLs',{urls:['*human-warrior-sword.webp*']});
 await send('Page.reload');
 await wait('!!window.GameProgress && !!window.HumanSwordAttack');
 await instrument();
 await fixture();
 assert.equal((await answer()).enemyHp,control.enemyHp);
 assert.deepEqual(await evaluate('strikeLog'),['launch','impact',{phase:null,recoil:'hurt',damage:expectedDamage,sprite:false}]);
 assert.deepEqual(errors,[]);
 assert.deepEqual(missing.filter(path=>!path.endsWith('/favicon.ico')),[]);
 console.log('PASS Human warrior: contact frame, single hit and sound cues, enemy recoil and defeat, wrong answers, still poses and missing atlas at 1024 × 600.');
}).catch(error => {console.error(error);process.exitCode=1;});
