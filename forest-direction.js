/* Focused forest encounter direction. Reuses the existing combat/save pipeline. */
(() => {
 'use strict';
 const Q=ForestAdventure,$=id=>document.getElementById(id);
 const scenes={
  m0:{title:'Mossgate · the sealed road',speaker:2,
   arrival:'Lira finds fresh claw marks on the inside of the gate. The briar imp is not guarding a way in. It is trying to escape something deeper in the forest.',
   danger:'Fire cuts through its briar hide. A correct attack succeeds, then the surviving enemy responds. A mistake strengthens that response.',
   victory:'The imp breaks apart into dry leaves. Beneath the gate, a strand of black root recoils from the light. Lira follows it toward the hollow: the same growth has closed every path to the river.'},
  m1:{title:'Whispering Hollow · a cornered hunter',speaker:1,
   arrival:'Thornfang blocks the circular stone landing above the western camp. Black roots cling to the ruined pillars. Brom keeps his hammer low. “Give it room.” The wolf lunges as they approach the stairs.',
   danger:'The wolf hunts the most injured ally. Brom’s skill draws its next attack; piercing hits disrupt its committed pounce. Healing can change whom it targets.',
   victory:'The wolf withdraws between the broken pillars. Lira points east, toward the river bridge. A sentinel holds the crossing at the west-bank approach. The path there winds around the central ruins.'},
  m2:{title:'Ancient Crossing · the broken oath',speaker:3,
   arrival:'The sentinel bars the west-bank approach to the timber bridge. Seren reads a stone beside the landing: “Hold the crossing. Shelter the lost.” Black roots have twisted a protective oath into a command to turn everyone away.',
   danger:'Its armor reduces non-hammer damage by 25%. A correct Guarding strike opens the armor for the next two damaging hits: +25% damage and no arrow resistance. Hammer weakness still applies.',
   victory:'The sentinel lowers its arms. The bridge leads east to the ruins and Amber Hollow, but the Guardian is on this bank. Turn back toward the Moonwell and follow the northern stone stairs to the grove above it.'},
  m3:{title:'The Emerald Heart · a protector bound',speaker:0,
   arrival:'Above the Moonwell stairs, the Guardian stands in the northwestern grove beneath the ancient tree. Black roots tighten around the Emerald Heart. “We see what you are protecting,” Thorin says. “Let us carry the weight.”',
   victory:'The last binding breaks. The Guardian lowers its branches, and the Emerald Heart settles back into the ancient tree. From the grove, the companions can trace the reopened west-bank paths down to camp and the river bridge. The forest keeps its protector.'}
 };
 const D=window.ForestDirection={state:null,
  actionAllowed(s,id){return !Q.active(s)||id!=='channel'||s.campaign.focus<3;},
  armor(c){return c.forestQuest?.sentinelOpening||0;},
  menu(s,i){
   if(!Q.active(s))return;
   const channel=$('hero-menu-actions').querySelector('[data-action=channel]');
   if(channel){const gain=Math.min(2,3-s.campaign.focus);channel.disabled ||= gain===0;channel.querySelector('small').textContent='+'+gain+' focus';channel.title=gain?'Gain '+gain+' shared focus; give up this hero’s damage this turn.':'Shared focus is full. Spend it before channeling.';channel.setAttribute('aria-label','Channel focus · '+channel.title);}
   const guard=$('hero-menu-actions').querySelector('[data-action=guard]');
   if(guard&&s.campaign.battleNode==='m2'){guard.title='Light strike · +1 focus · halve the next hit · open armor for two damaging follow-ups';guard.setAttribute('aria-label','Guarding strike · '+guard.title);}
   const effects=PartyRoles.status(s.campaign);
   if(effects)$('hero-menu-note').textContent+=' '+effects;
  },
  read(s,plan){
   const c=s.campaign,max=Q.encounter(s,{...FOREST_ENCOUNTERS[s.encounter],hp:Math.round(FOREST_ENCOUNTERS[s.encounter].hp*(s.lesson?.pace==='challenge'?1.2:1))}).hp,p=TacticalRules.profile(s.encounter,c.battleNode,s.enemyHp,max);
   const next=plan||s.pendingEnemy;
   const names=(next?.targets||[next?.target]).filter(Number.isInteger).map(i=>HEROES[i].name).join(' + ');
   const committed=!!s.pendingEnemy,damage=next?(committed?next.damage+' HP':DefenseRules.damage(next.damage,true)+' HP · '+DefenseRules.damage(next.damage,false)+' if incorrect'):'';
   let response=next?.charging?'Charging · no strike this turn':next?.damage===0?'Interrupted · no incoming damage':next?next.name+' → '+names+' · '+damage+' before defense':'Choose your next move';
   const armor=c.battleNode==='m2'?(this.armor(c)?'Armor open · '+this.armor(c)+' damaging hits left · +25% damage':'Armor braced · non-hammer damage −25% · guard to open it'):'';
   const opportunity=c.guardianCharge?'Rootfire primed · hit '+p.weak+' to interrupt':next?.behavior?.heavy?(next.behavior.disrupted?'Heavy attack disrupted · damage reduced 35%':'Committed attack · hit '+p.weak+' to reduce its damage 35%'):p.hint;
   return {response,opportunity,armor,weak:p.weak,committed,targets:next?.targets||[next?.target],phase:c.battleNode==='m3'?BossRules.phase(s.enemyHp,max):null};
  },
  present(s,plan){
   let box=$('forest-battle-read');
   if(!box){box=document.createElement('details');box.id='forest-battle-read';box.innerHTML='<summary><strong></strong><span></span></summary><p class="forest-read-opportunity"></p><p class="forest-read-resources"></p><p class="forest-read-rule">Predicted HP shows correct / incorrect answer damage before defense. Targets and damage can change with your action. Shared focus caps at 3; each living hero acts once per round.</p>';$('arena').append(box);}
   box.hidden=!Q.active(s)||s.phase!=='battle';if(box.hidden)return;
   const model=this.read(s,plan),c=s.campaign;
   const scene=scenes[c.battleNode];if(scene)$('battle-narration').textContent=RosterSystem.story(scene.arrival)+' '+(scene.danger||'Break the Guardian’s bindings by exploiting its changing weaknesses.');
   const title=(model.committed?'Incoming · ':'Enemy intent · ')+model.response;
   if(box.querySelector('strong').textContent!==title)box.querySelector('strong').textContent=title;
   box.querySelector('summary span').textContent=model.armor||(model.phase===null?'':'Binding '+(model.phase+1)+'/3 · ')+'Weakness: '+model.weak+' · Focus '+c.focus+'/3 · inspect tactics';
   box.querySelector('.forest-read-opportunity').textContent=model.opportunity;
   box.querySelector('.forest-read-resources').textContent='Focus '+c.focus+'/3 · Stagger '+c.stagger+'/3'+(c.powerStrike?' · POWER STRIKE READY · next damaging correct answer ×2.5':'')+' · '+(PartyRoles.status(c)||'No team effects active. Guard buys protection; channel trades damage for focus.');
   $('arena').dataset.forestBinding=model.phase===null?(c.battleNode==='m2'?this.armor(c)?'open':'braced':'none'):['shell','bark','heart'][model.phase];
   [...$('party').children].forEach((card,i)=>{card.dataset.forestTarget=String(s.enemyHp>0&&model.targets.includes(i));card.dataset.forestSpent=String(c.acted.includes(i));});
  }
 };
 // Explain why the two preparations are alternatives without inventing a new cost.
 for(const id of ['forest-supplies','forest-spirit']){
  const description=id==='forest-supplies'?'The stranded scouts offer one aid: take their spare field kit (+2 potions), or leave it for them and carry the Moonwell spirit’s ward instead.':'Leave the spare field kit with the stranded scouts. The Moonwell spirit will shield the first Guardian strike in return. You can still rescue the trapped ranger.';
  Q.sites.find(n=>n.id===id).description=description;FOREST_NODES.find(n=>n.id===id).description=description;
 }
 // Keep old saves valid; the optional counter is bounded and checked on restore.
 const valid=Q.valid;Q.valid=function(s){return valid.call(this,s)&&(!this.active(s)||s.campaign.forestQuest.sentinelOpening===undefined||[0,1,2].includes(s.campaign.forestQuest.sentinelOpening));};
 const begin=Q.beginEncounter;Q.beginEncounter=function(s){begin.call(this,s);if(this.active(s))s.campaign.forestQuest.sentinelOpening=0;};
 const reset=PartyRoles.reset;PartyRoles.reset=function(c){reset.call(this,c);if(Q.active(c))c.forestQuest.sentinelOpening=0;};
 const hit=Q.noteHit;Q.noteHit=function(s,info){hit.call(this,s,info);if(!this.active(s)||s.campaign.battleNode!=='m2')return;const q=s.campaign.forestQuest;q.sentinelOpening=Math.max(0,(q.sentinelOpening||0)-1);if(info.action==='guard'){q.sentinelOpening=2;EquipmentEffects.feedback(info.actor,['ARMOR OPEN · 2 FOLLOW-UP HITS']);}};
 const profile=TacticalRules.profile;TacticalRules.profile=function(index,id,hp,max){const p=profile.call(this,index,id,hp,max);if(!Q.active(D.state)||D.state.campaign.battleNode!==id||id!=='m2')return p;const remaining=D.armor(D.state.campaign),open=remaining>0;return {...p,resist:open?null:p.resist,forestArmor:open?'open':'braced',name:open?'Exposed runebark':'Braced runebark',hint:open?'Armor exposed: '+remaining+' damaging '+(remaining===1?'hit gains':'hits gain')+' 25%.':'Hammer bypasses the brace. A correct Guarding strike opens two follow-up hits.'};};
 const damage=TacticalRules.damage;TacticalRules.damage=function(base,type,p,streak){const result=damage.call(this,base,type,p,streak);if(p.forestArmor)result.damage=Math.max(1,Math.round(result.damage*(p.forestArmor==='open'?1.25:type==='blunt'?1:.75)));return result;};
 for(const method of ['prepareBattle','prologue','arrival','world','result','presentChallenge']){
  const original=Q[method];Q[method]=function(s,...args){D.state=s;const result=original.call(this,s,...args),active=this.active(s);if(!active){if($('forest-battle-read'))$('forest-battle-read').hidden=true;return result;}
   const scene=scenes[s.campaign.battleNode];
   if(method==='prologue'){$('prologue-text').replaceChildren();for(const text of ['The river divides the forest. Mossgate, camp and the Moonwell stairs lie on the west bank; a timber bridge reaches the eastern terraces. Black roots bind the Guardian in the northwestern grove.','Clear Mossgate and the western hollow, confront the sentinel at the bridge approach, then return up the northern stairs to free the Guardian. Your preparations and the ranger’s scouting can help you break its bindings.']){const p=document.createElement('p');p.textContent=text;$('prologue-text').append(p);}}
   if(method==='arrival'&&scene){$('arrival-title').textContent=scene.title;$('arrival-speaker').textContent=HEROES[scene.speaker].name;$('arrival-narration').textContent=RosterSystem.story(scene.arrival);if(scene.danger)$('arrival-danger').textContent=scene.danger;}
   if(method==='result'&&scene&&['victory','complete'].includes(s.phase)){
    $('result-copy').textContent=RosterSystem.story(scene.victory)+(s.phase==='complete'?(s.campaign.forestQuest.ranger?' The rescued ranger returns to mark a safe route for the villages.':' The companions mark the reopened road for those who will follow.'):'');
    $('result-copy').after($('advance'),$('menu'));
   }
   if(method==='world'){$('world').dataset.forestRecovery=String(Q.steps.filter(id=>s.campaign.completed.includes(id)).length);const recovered=['Mossgate stands above the southwest entrance. Follow the west-bank path.','Mossgate is open. Follow the stairs above camp to Whispering Hollow.','The western landing is clear. Follow the central path east to the bridge approach.','The bridge leads east. For the Guardian, return west and climb the Moonwell stairs.','The northwestern grove is free. Camp and the crossing are open below.'];$('explore-tip').textContent=recovered[Number($('world').dataset.forestRecovery)]+(Q.complete(s.campaign)?'':' · Follow gold · E / Search to interact.');}
   if(method==='presentChallenge')D.present(s,args[0]);
   return result;
  };
 }
})();
