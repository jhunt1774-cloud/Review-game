// Equipment passives resolve only at real contact, with battle counters stored in the save.
(()=>{'use strict';
const traits={
 cleave:{name:'Finisher',text:'Deals 25% more damage when the enemy is at or below 40% HP.'},
 opener:{name:'Opening blow',text:'The first successful damaging hit each battle deals 30% more damage.'},
 volley:{name:'Rhythm shot',text:'Every third successful damaging hit deals 35% more damage.'},
 renewal:{name:'Spell renewal',text:'A successful damaging skill restores 8% of the wielder’s maximum HP. Does not revive.'},
 ward:{name:'First-hit ward',text:'Reduces the first damaging enemy hit each battle by 30%. Perfect defenses do not consume it.'},
 focus:{name:'Focus spark',text:'The first successful damaging skill each battle restores 1 focus, up to 3.'},
 siphon:{name:'Life siphon',text:'Successful damaging hits heal the wielder for 10% of actual damage dealt. Does not revive.'},
 resolve:{name:'Last stand',text:'While at or below 35% HP, reduces damaging enemy hits by 20%.'}
};
const accessory={ 'emerald-heart':'siphon','dawnheart':'focus','pearl-ward':'resolve','root-whisper':'focus','wind-feather':'resolve','keepers-light':'focus','navigator-ring':'siphon','amber-hollow-item-3':'siphon','clockwork-garden-item-3':'focus','lantern-grotto-item-3':'resolve'};
window.EquipmentEffects={traits,
 trait(item){return item.slot==='weapon'?['cleave','opener','volley','renewal'][item.role]:item.slot==='armor'?'ward':accessory[item.id]||'focus';},
 equipped(c,i){return Object.values(c.equipmentLoot?.loadouts?.[i]||{}).map(id=>EquipmentLoot.get(id)).filter(Boolean).map(item=>({...traits[this.trait(item)],key:this.trait(item),item:item.name}));},
 counters(c){const old=c.equipmentEffects||{};c.equipmentEffects={hits:Array.from({length:4},(_,i)=>Number.isInteger(old.hits?.[i])&&old.hits[i]>=0?Math.min(old.hits[i],99999):0),ward:Array.from({length:4},(_,i)=>old.ward?.[i]===true),focus:Array.from({length:4},(_,i)=>old.focus?.[i]===true)};return c.equipmentEffects;},
 attack(s,i,base,skill,max,enemyMax){const c=s.campaign,b=this.counters(c),effects=this.equipped(c,i),has=k=>effects.some(e=>e.key===k),labels=[];let damage=base;if(base<=0)return {damage:0,labels,heal:0};b.hits[i]++;
  if(has('cleave')&&s.enemyHp<=enemyMax*.4){damage*=1.25;labels.push('FINISHER');}
  if(has('opener')&&b.hits[i]===1){damage*=1.3;labels.push('OPENING BLOW');}
  if(has('volley')&&b.hits[i]%3===0){damage*=1.35;labels.push('RHYTHM SHOT');}
  damage=Math.max(1,Math.round(damage));let heal=0;
  if(skill&&has('renewal')&&s.hp[i]>0)heal+=Math.ceil(max*.08);
  if(has('siphon')&&s.hp[i]>0)heal+=Math.ceil(Math.min(s.enemyHp,damage)*.1);
  heal=Math.max(0,Math.min(max-s.hp[i],heal));if(heal){s.hp[i]+=heal;labels.push('+'+heal+' HP');}
  if(skill&&has('focus')&&!b.focus[i]&&c.focus<3){b.focus[i]=true;c.focus=Math.min(3,c.focus+1);labels.push('+1 FOCUS');}
  return {damage,labels,heal};
 },
 defend(s,i,amount,max){if(amount<=0)return {damage:0,labels:[]};const b=this.counters(s.campaign),effects=this.equipped(s.campaign,i),has=k=>effects.some(e=>e.key===k),labels=[];let damage=amount;if(has('ward')&&!b.ward[i]){b.ward[i]=true;damage*=.7;labels.push('FIRST-HIT WARD');}if(has('resolve')&&s.hp[i]>0&&s.hp[i]<=max*.35){damage*=.8;labels.push('LAST STAND');}return {damage:Math.max(1,Math.round(damage)),labels};},
 feedback(i,labels){if(!labels.length)return;const hero=document.getElementById('hero-'+i),layer=document.getElementById('effects'),arena=document.getElementById('arena');if(!hero||!layer||!arena)return;const p=CombatPresentation.point(hero,arena,.25),el=document.createElement('div');el.className='equipment-proc';el.textContent=labels.join(' · ');el.style.left=p.x+'px';el.style.top=p.y+'px';layer.appendChild(el);const task=(async()=>{let motion;try{motion=el.animate([{transform:'translate(-50%,-75px)',opacity:1},{transform:'translate(-50%,-90px)',opacity:1,offset:.85},{transform:'translate(-50%,-100px)',opacity:0}],{duration:MotionPreference.reduced()?1100:1500,easing:'ease-out'});await motion.finished;}catch{}finally{motion?.cancel?.();el.remove();}})();CombatPresentation.pending.add(task);task.finally(()=>CombatPresentation.pending.delete(task));}
};
const reset=PartyRoles.reset,defaults=Progression.defaults,describe=EquipmentLoot.describe;
PartyRoles.reset=function(c){reset.call(this,c);delete c.equipmentEffects;EquipmentEffects.counters(c);};
Progression.defaults=function(c){defaults.call(this,c);EquipmentEffects.counters(c);return c;};
EquipmentLoot.describe=function(item){const base=describe.call(this,item);return item.id?base+' · '+traits[EquipmentEffects.trait(item)].name+': '+traits[EquipmentEffects.trait(item)].text:base;};
})();
