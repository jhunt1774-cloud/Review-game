const assert = require('node:assert/strict');

require('./browser-harness.cjs')(async ({evaluate,errors,missing}) => {
 const results = await evaluate(`(async () => {
  MotionPreference.set('full');
  const arena = document.querySelector('#arena');
  const heroes = arena.querySelector('#heroes');
  const enemy = arena.querySelector('#enemy-art');
  const probe = document.createElement('canvas');
  probe.width = probe.height = 40;
  const ctx = probe.getContext('2d');
  const pause = ms => new Promise(resolve => setTimeout(resolve,ms));
  function pixels(renderer) {
   if (!renderer.portrait) return null;
   ctx.clearRect(0,0,40,40);
   ctx.drawImage(renderer.portrait,0,0,40,40);
   const data=Array.from(ctx.getImageData(0,0,40,40).data);
   return data.some(Boolean) ? data.join(',') : null;
  }
  async function check(el,config,release) {
   const renderer = new CharacterRenderer(el,config);
   try {
    renderer.setState('attack',true);
    for(let attempt=0;attempt<30&&!pixels(renderer);attempt++) await pause(20);
    renderer.holdPose('attack',0);
    const base=pixels(renderer);
    if(!base)return 'empty source';
    BattleBodyMotion.telegraph(renderer,.52,release);
    await pause(40);
    const windup=pixels(renderer);
    BattleBodyMotion.telegraph(renderer,1,release);
    const contact=pixels(renderer);
    BattleBodyMotion.stop(renderer);
    const restored=pixels(renderer);
    MotionPreference.set('still');
    BattleBodyMotion.telegraph(renderer,1,release);
    const still=pixels(renderer);
    MotionPreference.set('full');
    return base && windup && contact && windup!==contact && restored===still ? null : 'motion or still pose';
   } finally {renderer.destroy();}
  }
  const failed=[];
  let heroCount=0,enemyCount=0;
  for(const member of RosterSystem.members){
   const config=PARTY_V3[member.id];
   if(!config){failed.push(member.id+': no art');continue;}
   const actor=document.createElement('div');
   actor.className='hero hero-'+member.role;
   heroes.append(actor);
   const issue=await check(actor,config,.82);
   if(issue)failed.push(member.id+': '+issue);
   actor.remove();
   heroCount++;
  }
  for(const [key,config] of Object.entries({...ENEMY_ANIMATIONS,...SIDE_GUARDIAN_ART})){
   const issue=await check(enemy,{...config,key},config.projectileColor ? .82 : 1);
   if(issue)failed.push(key+': '+issue);
   enemyCount++;
  }
  return {failed,heroCount,enemyCount};
 })()`);
 assert.deepEqual(results.failed,[]);
 assert.ok(results.heroCount>=14);
 assert.ok(results.enemyCount>=12);
 assert.deepEqual(errors,[]);
 assert.deepEqual(missing.filter(path=>!path.endsWith('/favicon.ico')),[]);
 console.log('PASS body motion: '+results.heroCount+' roster appearances and '+results.enemyCount+' enemy atlas entries, contact deformation, restore, and still poses.');
}).catch(error=>{console.error(error);process.exitCode=1;});
