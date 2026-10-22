// Deterministic enemy intentions; committed defense sequences survive save/continue.
(()=>{'use strict';
const styles={
 hunter:{name:'Hunter',hint:'Pursues the most injured hero. Brom’s protective challenge draws it away.',moves:[
  {name:'Stalking lunge',tell:'Lowers its body and fixes on its prey',actions:['dodge'],scale:.9,variant:false},
  {name:'Raking pursuit',tell:'Leans back, ready to rake across the target',actions:['block','parry'],scale:1,variant:true},
  {name:'Committed pounce',tell:'Crouches deeply before a powerful leap',actions:['dodge','parry','dodge'],scale:1.3,variant:false,heavy:true}]},
 bulwark:{name:'Bulwark',hint:'Slow, heavy blows. Guard or use a weakness hit to soften its committed attack.',moves:[
  {name:'Groundbreaker',tell:'Raises its weight above the ground',actions:['jump'],scale:1.05,variant:false},
  {name:'Sweeping crush',tell:'Draws its weapon sideways for a broad sweep',actions:['block','jump'],scale:1.1,variant:true},
  {name:'Overhead devastation',tell:'Plants its feet and lifts for a crushing blow',actions:['dodge','jump','parry'],scale:1.4,variant:false,heavy:true}]},
 caster:{name:'Channeler',hint:'Pressures the back line. A weakness hit disrupts its strongest spell.',moves:[
  {name:'Seeking bolt',tell:'A small light gathers at its casting point',actions:['dodge'],scale:.95,variant:true},
  {name:'Prism volley',tell:'Two pulses gather before the spell releases',actions:['parry','dodge'],scale:1.05,variant:true},
  {name:'Overcharged burst',tell:'Its casting point burns with unstable light',actions:['dodge','parry','jump'],scale:1.35,variant:true,heavy:true}]},
 skirmisher:{name:'Skirmisher',hint:'Alternates quick feints and committed strikes. Read each directional cue.',moves:[
  {name:'Quick rake',tell:'Pulls its striking arm close',actions:['block'],scale:.85,variant:false},
  {name:'Crosscut feint',tell:'Shifts its stance before crossing strikes',actions:['parry','block'],scale:1,variant:true},
  {name:'Reckless flurry',tell:'Leans forward, leaving its guard open',actions:['jump','dodge','parry'],scale:1.25,variant:false,heavy:true}]}
};
const actions=['block','jump','dodge','parry'];
window.EnemyBehavior={styles,
 key(s){const id=s.campaign.battleNode,patrol=window.RoamingWorld?.specs.find(p=>p.id===id);if(patrol)return {hunter:'hunter',guard:'bulwark',wander:'skirmisher'}[patrol.type];const n=FOREST_NODES.find(n=>n.id===id),name=(n?.name||FOREST_ENCOUNTERS[s.encounter]?.enemy||'').toLowerCase();if(/spect|spirit|mage|wisp|wraith/.test(name))return 'caster';if(/wolf|fang|hound/.test(name))return 'hunter';if(/sentinel|golem|coloss|warden/.test(name))return 'bulwark';return ['skirmisher','hunter','bulwark','caster'][s.encounter%4];},
 applies(s,p){return !p.boss&&!window.SideGuardians?.details[s.campaign.battleNode];},
 plan(s,e,p,config,profile,maxHp){if(!this.applies(s,p))return p;const key=this.key(s),style=styles[key],chapter=s.campaign.viewChapter||0,index=Math.max(0,(s.turn-1)%3),move=style.moves[index],alive=s.hp.map((hp,i)=>hp>0?i:-1).filter(i=>i>=0);if(!alive.length)return p;let target=p.target;if(!(s.campaign.roleTaunt&&s.hp[1]>0)){if(key==='hunter')target=[...alive].sort((a,b)=>s.hp[a]/maxHp(a)-s.hp[b]/maxHp(b)||a-b)[0];if(key==='caster')target=alive.includes(3)?3:alive[alive.length-1];}
 const variant=!!move.variant&&!!config.states.attackAlt,effect=config.attackEffects?.[variant?1:0]||p.effect||e.effect||'claw',count=chapter===0?1:chapter===1?Math.min(2,move.actions.length):move.actions.length,sequence=move.actions.slice(0,count),opening=s.campaign.enemyOpening,disrupted=!!(move.heavy&&opening?.node===s.campaign.battleNode&&opening.turn===s.turn),duration=Math.max(1350,1950-chapter*110)+(move.heavy?180:0),damage=p.damage===0?0:Math.max(1,Math.min(600,Math.round(p.damage*move.scale*(disrupted?.65:1))));
 return {...p,target,damage,name:move.name,effect,attackVariant:variant,behavior:{version:1,key,index,actions:sequence,duration,tell:move.tell,heavy:!!move.heavy,disrupted,hint:style.hint+(move.heavy?' Hit its '+(profile.weak||'current')+' weakness to reduce this strike by 35%.':'')}};
 },
 onHit(s,weakness){if(weakness)s.campaign.enemyOpening={node:s.campaign.battleNode,turn:s.turn};},
 pending(p){return p.behavior?{behavior:JSON.parse(JSON.stringify(p.behavior))}:{};},
 valid(b){return b===undefined||!!(b&&b.version===1&&styles[b.key]&&Number.isInteger(b.index)&&b.index>=0&&b.index<3&&Array.isArray(b.actions)&&b.actions.length>=1&&b.actions.length<=3&&b.actions.every(a=>actions.includes(a))&&Number.isFinite(b.duration)&&b.duration>=1200&&b.duration<=2400&&typeof b.tell==='string'&&b.tell.length<=120&&typeof b.hint==='string'&&b.hint.length<=260&&typeof b.heavy==='boolean'&&typeof b.disrupted==='boolean');},
 pattern(p){return p.behavior?{actions:p.behavior.actions.slice(),duration:p.behavior.duration,name:p.name}:null;},
 present(s,p){const panel=document.getElementById('enemy-read'),actor=document.getElementById('enemy-art');if(!panel)return;const visible=s.phase==='battle'&&s.enemyHp>0&&p.behavior;panel.hidden=!visible;document.getElementById('arena').dataset.enemyBehavior=String(!!visible);if(!visible){delete actor.dataset.behavior;const details=document.getElementById('enemy-attack-details');if(details)details.textContent='';return;}const b=p.behavior;actor.dataset.behavior=b.key;panel.dataset.heavy=String(b.heavy);panel.dataset.disrupted=String(b.disrupted);panel.replaceChildren();const title=document.createElement('strong'),tell=document.createElement('span'),hint=document.createElement('small');title.textContent=styles[b.key].name+' · '+p.name+' → '+HEROES[p.target].name;tell.textContent=b.tell+' · '+b.actions.map(DefenseRules.label).join(' → ');hint.textContent=b.disrupted?'WEAKNESS DISRUPTION · this attack is 35% weaker':b.hint;const details=document.getElementById('enemy-attack-details');if(details)details.textContent=tell.textContent+' '+hint.textContent;title.textContent=p.name+' → '+HEROES[p.target].name+' · '+p.damage+' HP';panel.append(title);}
};
const valid=DefenseRules.validPending;DefenseRules.validPending=function(p){return valid.call(this,p)&&EnemyBehavior.valid(p.behavior);};
const reset=PartyRoles.reset;PartyRoles.reset=function(c){reset.call(this,c);delete c.enemyOpening;};
// Add readable preparation to the existing contact clock, without playing the attack early.
const create=CombatTelegraph.create;CombatTelegraph.create=function(options){const t=create.call(this,options),actor=options.renderer.el,key=actor.dataset.behavior,scale=actor.style.scale||'',rotate=actor.style.rotate||'',progress=t.progress,finish=t.finish;if(!styles[key])return t;t.progress=function(p){progress.call(this,p);if(MotionPreference.reduced())return;const telling=p<.68;actor.style.scale=telling?(key==='hunter'?'1.03 .94':key==='bulwark'?'1.02 1.04':key==='caster'?'1.02':'1.02 .98'):scale;actor.style.rotate=telling?(key==='bulwark'?'-3deg':key==='skirmisher'?'2deg':rotate):rotate;};t.finish=async function(){try{return await finish.call(this);}finally{actor.style.scale=scale;actor.style.rotate=rotate;}};return t;};
})();
