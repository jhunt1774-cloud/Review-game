// Dedicated creature art and paired combat cues for the three expedition guardians.
(()=>{'use strict';const details={
 'amber-hollow-boss':{key:'amberwood',names:['Amber pincer snap','Molten honey bolt'],effects:['claw','enemy-spell'],color:'#ffb438',actions:[['parry','dodge'],['dodge','parry']]},
 'clockwork-garden-boss':{key:'glasswarden',names:['Brass sickle sweep','Conservatory prism beam'],effects:['claw','enemy-spell'],color:'#78e7ff',actions:[['parry','jump'],['dodge','parry','dodge']]},
 'lantern-grotto-boss':{key:'tidewarden',names:['Lantern claw slam','Grotto tide blast'],effects:['hammer','enemy-spell'],color:'#53dfcf',actions:[['jump','parry'],['dodge','jump','parry']]}
};
window.SideGuardians={details};
const resolve=EnemyRoster.resolve;EnemyRoster.resolve=function(index,node){const d=details[node];return d?{...SIDE_GUARDIAN_ART[d.key],id:'battle-enemy',key:d.key,attackNames:d.names,attackEffects:d.effects,projectileColor:d.color,releasePoint:{x:.23,y:.5}}:resolve.call(this,index,node);};
const plan=BossRules.plan;BossRules.plan=function(state,encounter,base){const p=plan.call(this,state,encounter,base),d=details[state.campaign.battleNode];if(!d)return p;const variant=state.turn%2===0;return {...p,attackVariant:variant,name:d.names[variant?1:0],effect:d.effects[variant?1:0]};};
const pattern=DefenseRules.pattern;DefenseRules.pattern=function(index,turn,effect,node){const p=pattern.call(this,index,turn,effect,node),d=details[node];if(!d)return p;const i=effect==='enemy-spell'?1:0;return {...p,name:d.names[i],actions:d.actions[i].slice()};};
for(const [node,d]of Object.entries(details)){const tale=FOREST_STORY.areas[node];tale.danger+=' '+d.names[0]+' is a close strike; '+d.names[1]+' is a ranged attack. Watch the creature’s preparation and the directional cue.';}
})();
