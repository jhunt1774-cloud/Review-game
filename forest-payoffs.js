/* Forest encounter turns, team payoffs and a rescue finale on the existing rules. */
(() => {
 'use strict';
 const Q=ForestAdventure,$=id=>document.getElementById(id);
 const trailmark={name:'Trailmark',text:'The first damaging hit each battle sets an opening: the next teammate weakness hit deals 25% more damage and restores 1 shared focus.'};
 const F=window.ForestPayoffs={state:null,combo:[],timer:null,phase:null,twist:null,
  clear(){clearTimeout(this.timer);this.timer=null;this.combo=[];const box=$('forest-payoff-event');if(box){box.hidden=true;box.getAnimations().forEach(a=>a.cancel());}for(const el of document.querySelectorAll('[data-forest-combo]'))delete el.dataset.forestCombo;},
  event(title,detail,kind='combo',actor=null){
   if(!Q.active(this.state)||document.hidden)return;
   let box=$('forest-payoff-event');if(!box){box=document.createElement('section');box.id='forest-payoff-event';box.setAttribute('role','status');box.setAttribute('aria-live','polite');box.innerHTML='<strong></strong><span></span>';$('arena').append(box);}
   this.clear();box.dataset.kind=kind;box.querySelector('strong').textContent=title;box.querySelector('span').textContent=detail;box.hidden=false;
   if(Number.isInteger(actor)&&$('hero-'+actor))$('hero-'+actor).dataset.forestCombo='true';
   if(!MotionPreference.reduced()&&VisualTrial.mode!=='light')box.animate([{opacity:0,translate:'0 6px'},{opacity:1,translate:'0 0'}],{duration:180,easing:'ease-out'});
   this.timer=setTimeout(()=>this.clear(),1800);
  },
  victory(s,renderer){
   if(!Q.active(s)||s.campaign.battleNode!=='m3'||s.phase!=='complete')return;
   this.state=s;this.clear();renderer?.setState('idle',true);$('arena').dataset.forestReleaseMotion=String(!MotionPreference.reduced()&&VisualTrial.mode!=='light');$('arena').dataset.forestFreed='true';
   const banner=$('victory-celebration');if(banner){banner.querySelector('strong').textContent='GUARDIAN FREED';banner.querySelector('span').textContent=s.campaign.forestQuest.ranger?'The ranger calls the path clear. The last roots release the Heart.':'The last roots release the Heart. The grove is safe.';}
  },
  present(s,plan){
   if(!Q.active(s)||s.phase!=='battle'||s.enemyHp<=0){this.clear();return;}
   const c=s.campaign,id=c.battleNode,model=ForestDirection.read(s,plan);
   const changed=s.enemyHp<=Q.encounter(s,{...FOREST_ENCOUNTERS[s.encounter],hp:Math.round(FOREST_ENCOUNTERS[s.encounter].hp*(s.lesson?.pace==='challenge'?1.2:1))}).hp/2;
   if(['m0','m1'].includes(id)){if(this.twist!==null&&this.twist!==changed&&changed)this.event('TACTIC CHANGED',id==='m0'?'The briars flare outward. Jump the flare; fire disrupts it.':'The wolf changes its pursuit. It now targets the healthiest hero.','twist');this.twist=changed;if(changed&&plan?.behavior)$('forest-battle-read').querySelector('.forest-read-opportunity').textContent=plan.behavior.hint;}
   if(id==='m3'){
    const phase=model.phase;
    if(this.phase!==null&&this.phase!==phase)this.event(phase===1?'ROOT SHELL BROKEN':'BARK BINDING BROKEN',phase===1?HEROES[1].name+': The seams are exposed. Bring the hammer.':HEROES[3].name+': Only the dark roots remain. Burn them clear.','phase');
    this.phase=phase;
    if(c.forestQuest.ranger&&!c.forestQuest.rangerAidUsed){const copy=$('forest-battle-read').querySelector('.forest-read-resources');copy.textContent+=' · Ranger ready: one uninterrupted rootfire attack −25%.';}
   }
  }
 };
 // An optional, bounded flag. Existing progress without it remains valid.
 const valid=Q.valid;Q.valid=function(s){return valid.call(this,s)&&(!this.active(s)||s.campaign.forestQuest.rangerAidUsed===undefined||typeof s.campaign.forestQuest.rangerAidUsed==='boolean');};
 const begin=Q.beginEncounter;Q.beginEncounter=function(s){begin.call(this,s);if(this.active(s))s.campaign.forestQuest.rangerAidUsed=false;};
 const reset=PartyRoles.reset;PartyRoles.reset=function(c){reset.call(this,c);if(Q.active(c))c.forestQuest.rangerAidUsed=false;};
 for(const method of ['prepareBattle','prologue','world','arrival','result','presentChallenge']){
  const old=Q[method];Q[method]=function(s,...args){if(F.state!==s||method==='prepareBattle'){F.clear();F.phase=null;F.twist=null;if(method==='prepareBattle'){$('arena').dataset.forestFreed='false';$('arena').dataset.forestReleaseMotion='false';}}F.state=s;const result=old.call(this,s,...args);
   if(!this.active(s)||!['battle','complete'].includes(s.phase)){$('arena').dataset.forestFreed='false';F.clear();}
   if(method==='presentChallenge'){F.present(s,args[0]);if(this.active(s)&&s.phase==='complete')$('enemy-name').textContent='Forest Guardian · freed';}
   if(method==='result'&&this.active(s)&&s.phase==='complete'){const recap=$('reward').querySelector('.forest-finish');if(recap){const p=document.createElement('p');p.className='forest-ally-recap';p.textContent=s.campaign.forestQuest.rangerAidUsed?'The ranger drew an eruption away from your party.':s.campaign.forestQuest.ranger?'The ranger kept watch as your party broke the bindings.':'Your companions broke every binding together.';recap.append(p);}}
   if(method==='result'&&this.active(s)&&s.phase==='victory'){
    const hints={m0:'Mossbite rewards a finishing blow when the enemy is at or below 40% health.',m1:'Trailmark sets up a teammate’s weakness hit. Lira can mark the sentinel for Brom’s hammer.',m2:'Bridgeguard’s ward survives a perfect defense. It protects the first hit that actually deals damage.'},card=$('item-reward-art');
    if(card&&hints[s.campaign.battleNode]){const p=document.createElement('small');p.className='forest-reward-tactic';p.textContent=RosterSystem.story(hints[s.campaign.battleNode]);(card.querySelector('div')||card).append(p);}
   }
   return result;
  };
 }
 // The imp flares when wounded; the wolf changes whom it pursues. Damage is not raised.
 const enemyPlan=EnemyBehavior.plan;EnemyBehavior.plan=function(s,e,p,...args){const next=enemyPlan.call(this,s,e,p,...args);if(!Q.active(s)||!next.behavior||s.enemyHp>e.hp/2)return next;
  const id=s.campaign.battleNode;if(!['m0','m1'].includes(id))return next;
  const b={...next.behavior,actions:next.behavior.actions.slice()};let target=next.target,damage=next.damage,name=next.name;
  if(id==='m0'){
   name='Briar flare';b.tell='Its damaged briars flare outward';b.actions=['jump'];
   if(!b.heavy){const opening=s.campaign.enemyOpening;b.disrupted=opening?.node===id&&opening.turn===s.turn;if(b.disrupted&&damage>0)damage=Math.max(1,Math.round(damage*.65));}
   b.heavy=true;b.hint='Wounded briars flare outward. A fire weakness hit weakens the flare by 35%.';
  }else{
   name='Cornered feint';b.tell='Turns away from wounded prey and sights the strongest hero';b.actions=['parry'];
   if(!(s.campaign.roleTaunt&&s.hp[1]>0)){const alive=s.hp.map((hp,i)=>hp>0?i:-1).filter(i=>i>=0);target=alive.sort((a,b)=>s.hp[b]/args[2](b)-s.hp[a]/args[2](a)||a-b)[0]??target;}
   b.hint='Cornered: now pursues the healthiest hero. '+HEROES[1].name+' can still draw its attack.';
  }
  return {...next,name,target,damage,behavior:b};
 };
 const enemyPresent=EnemyBehavior.present;EnemyBehavior.present=function(s,p){enemyPresent.call(this,s,p);if(Q.active(s))$('arena').dataset.forestTwist=s.enemyHp<=0?'':s.enemyHp<=Q.encounter(s,{...FOREST_ENCOUNTERS[s.encounter],hp:Math.round(FOREST_ENCOUNTERS[s.encounter].hp*(s.lesson?.pace==='challenge'?1.2:1))}).hp/2?s.campaign.battleNode:'';};
 // Preview the rescued ranger's help; spend it only when an actual attack is committed.
 const bossPlan=BossRules.plan;BossRules.plan=function(s,...args){const p=bossPlan.call(this,s,...args),q=s.campaign.forestQuest;if(Q.active(s)&&q.ranger&&!q.rangerAidUsed&&p.kind==='eruption'&&p.damage>0)return {...p,damage:Math.max(1,Math.round(p.damage*.75)),name:'Ranger distraction · '+p.name,forestRanger:true};return p;};
 const pending=BossRules.pending;BossRules.pending=function(p,s){const result=pending.call(this,p);if(p.forestRanger&&Q.active(s)){s.campaign.forestQuest.rangerAidUsed=true;F.event('RANGER DISTRACTION','“This way!” One rootfire attack deals 25% less damage.','ally');return {...result,forestRanger:true};}return result;};
 // Existing team bonuses retain their exact math. Highlight their real consumption at impact.
 const empower=PartyRoles.empower;PartyRoles.empower=function(c,actor,base){const tags=[];if(Q.active(c)){if(c.roleExpose>0)tags.push('Armor break');if(c.roleMark&&actor!==2)tags.push('Hunter’s mark');}const result=empower.call(this,c,actor,base);if(tags.length&&F.state?.campaign===c)F.combo=tags;return result;};
 const team=PartyTeamwork.attack;PartyTeamwork.attack=function(s,...args){const result=team.call(this,s,...args);if(Q.active(s)){if(result.labels.some(t=>t.startsWith('RALLY')))F.combo.push('Rally');if(result.labels.some(t=>t.startsWith('OPENING')))F.combo.push('Opening exploited');}return result;};
 // Moonfang's third-hit trait rarely triggered within four short fights. Give this named
 // bow a first-hit setup instead, using the established opening/focus rules.
 const equipped=EquipmentEffects.equipped;EquipmentEffects.equipped=function(c,i){const effects=equipped.call(this,c,i);return Q.active(c)&&Object.values(c.equipmentLoot?.loadouts?.[i]||{}).includes('moonfang')?effects.map(t=>t.key==='volley'?{...t,...trailmark,key:'trailmark'}:t):effects;};
 const attack=EquipmentEffects.attack;EquipmentEffects.attack=function(s,i,...args){const result=attack.call(this,s,i,...args);if(!Q.active(s))return result;
  if(result.damage>0&&this.equipped(s.campaign,i).some(t=>t.key==='trailmark')&&this.counters(s.campaign).hits[i]===1){PartyTeamwork.defaults(s.campaign).opening=true;result.labels.push('TRAILMARK · TEAM OPENING READY');}
  if(result.damage>0&&F.combo.length){const tags=[...new Set(F.combo)];F.combo=[];F.event('TEAM COMBINATION',tags.join(' + ')+' → '+HEROES[i].name,'combo',i);}
  return result;
 };
 const describe=EquipmentLoot.describe;EquipmentLoot.describe=function(item){const text=describe.call(this,item);return Q.active(F.state)&&item.id==='moonfang'?text.replace(EquipmentEffects.traits.volley.name+': '+EquipmentEffects.traits.volley.text,trailmark.name+': '+trailmark.text):text;};
 const clear=BattleCelebration.clear;BattleCelebration.clear=function(...args){F.clear();return clear.apply(this,args);};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)F.clear();});
})();
