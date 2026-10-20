// Role benefits resolve at contact, not when a question or attack menu opens.
(()=>{'use strict';
window.RoleMastery={
 info:[{name:'Vanguard',text:'Opening pressure: first damaging hit each battle deals +15% damage.'},{name:'Defender',text:'Steadfast: the first damaging hit received each battle is reduced by 20%. Perfect defenses preserve it.'},{name:'Ranger',text:'Precision: hits against an enemy’s weapon weakness deal +12% damage.'},{name:'Spellkeeper',text:'Mending echo: first two damaging skills heal the lowest-HP living ally by 6% of their maximum HP.'}],
 defaults(c){const old=c.roleMastery||{};return c.roleMastery={opened:old.opened===true,guarded:old.guarded===true,mends:Number.isInteger(old.mends)?Math.max(0,Math.min(2,old.mends)):0};},
 status(c,i){const b=this.defaults(c);return this.info[i].name+' · '+this.info[i].text+(i===0?' '+(b.opened?'Opening used.':'Opening ready.'):i===1?' '+(b.guarded?'Steadfast used.':'Steadfast ready.'):i===3?' '+(2-b.mends)+' echoes left.':'');},
 attack(s,i,damage,skill,context={}){const b=this.defaults(s.campaign),labels=[];if(damage<=0)return {damage,labels};if(i===0&&!b.opened){b.opened=true;damage=Math.round(damage*1.15);labels.push('OPENING PRESSURE +15%');}if(i===2&&context.weakness){damage=Math.round(damage*1.12);labels.push('PRECISION +12%');}if(i===3&&skill&&b.mends<2){const living=s.hp.map((hp,j)=>({j,hp,max:RosterSystem.max(s,j)})).filter(a=>a.hp>0&&a.hp<a.max).sort((a,b)=>a.hp/a.max-b.hp/b.max||a.j-b.j);if(living.length){const a=living[0],gain=Math.min(a.max-a.hp,Math.ceil(a.max*.06));s.hp[a.j]+=gain;b.mends++;labels.push('MENDING ECHO');EquipmentEffects.feedback(a.j,['+'+gain+' HP · MENDING ECHO']);}}return {damage,labels};},
 defend(s,i,damage){const b=this.defaults(s.campaign);if(i!==1||damage<=0||b.guarded)return {damage,labels:[]};b.guarded=true;return {damage:Math.max(1,Math.round(damage*.8)),labels:['STEADFAST −20%']};}
};
const attack=EquipmentEffects.attack;EquipmentEffects.attack=function(s,i,base,skill,max,enemyMax,context){const role=RoleMastery.attack(s,i,base,skill,context),hit=attack.call(this,s,i,role.damage,skill,max,enemyMax);hit.labels.unshift(...role.labels);return hit;};
const defend=EquipmentEffects.defend;EquipmentEffects.defend=function(s,i,amount,max){const role=RoleMastery.defend(s,i,amount),hit=defend.call(this,s,i,role.damage,max);hit.labels.unshift(...role.labels);return hit;};
const reset=PartyRoles.reset;PartyRoles.reset=function(c){reset.call(this,c);delete c.roleMastery;RoleMastery.defaults(c);};
const defaults=Progression.defaults;Progression.defaults=function(c){defaults.call(this,c);RoleMastery.defaults(c);return c;};
})();
