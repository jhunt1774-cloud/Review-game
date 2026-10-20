// Level-derived budgets prevent duplicate grants. Training belongs to the role, like equipment.
(()=>{'use strict';
const branches=[
 [
  {id:'execution',name:'Executioner',passive:'Basic axe strikes deal 8% more damage.',move:'Executioner’s arc',detail:'1.8× strike; +25% against enemies below 40% HP.',mastery:'2.15× strike; finishing bonus becomes 35%.',scale:[1.8,2.15],cost:2,fx:'execution'},
  {id:'rend',name:'Ravager',passive:'Axe strikes leave a wound: the next ally hit gains 6 damage.',move:'Rending cut',detail:'1.25× strike; next two ally hits add 25% of this strike’s damage.',mastery:'1.5× strike; wound damage becomes 35%.',scale:[1.25,1.5],cost:2,fx:'rend'},
  {id:'leadership',name:'Warlord',passive:'Axe strikes rally the next ally hit for +5% damage.',move:'Banner of courage',detail:'0.75× strike; next two ally hits deal 25% more damage.',mastery:'1× strike; rally becomes +35% and grants each ally a 10% one-hit ward.',scale:[.75,1],cost:2,fx:'banner'}
 ],
 [
  {id:'bulwark',name:'Bulwark',passive:'The defender takes 6% less damage.',move:'Bastion slam',detail:'0.85× strike; each living ally gains a 25% ward against one damaging hit.',mastery:'1.1× strike; wards become 35%.',scale:[.85,1.1],cost:2,fx:'bastion'},
  {id:'counter',name:'Duelist',passive:'A successful defense stores +15% base attack for your next damaging strike.',move:'Riposte stance',detail:'1.1× strike; draw the next attack. A successful defense stores +60% base attack for your next strike.',mastery:'1.35× strike; the stored counter becomes +90% base attack.',scale:[1.1,1.35],cost:2,fx:'riposte'},
  {id:'disruption',name:'Gatebreaker',passive:'Hammer strikes deal 6% more damage.',move:'Shatterguard',detail:'1.4× strike; +1 stagger and the next enemy attack deals 20% less damage.',mastery:'1.7× strike; adds 2 stagger instead.',scale:[1.4,1.7],cost:2,fx:'shatter'}
 ],
 [
  {id:'precision',name:'Sharpshooter',passive:'Weapon-weakness hits deal 8% more damage.',move:'Deadeye shot',detail:'A carefully aimed 2× shot.',mastery:'A 2.4× shot with a brighter precision impact.',scale:[2,2.4],cost:2,fx:'deadeye'},
  {id:'multishot',name:'Volley ranger',passive:'Every third successful damaging shot deals 12% more damage.',move:'Arrow storm',detail:'Three arrows deliver 1.65× total damage and add 1 stagger.',mastery:'Five arrows deliver 2.05× total damage and add 2 stagger.',scale:[1.65,2.05],cost:2,fx:'storm'},
  {id:'evasion',name:'Pathfinder',passive:'Your first successful defense each battle restores 1 focus, up to 3.',move:'Skirmish shot',detail:'1.15× shot; a 45% personal ward absorbs part of your next damaging hit.',mastery:'1.4× shot; personal ward becomes 60%.',scale:[1.15,1.4],cost:2,fx:'skirmish'}
 ],
 [
  {id:'destruction',name:'Evoker',passive:'Damaging skills deal 8% more damage.',move:'Arcane comet',detail:'A concentrated spell deals 2× damage. Costs 3 focus.',mastery:'The comet deals 2.5× damage.',scale:[2,2.5],cost:3,fx:'comet'},
  {id:'protection',name:'Spellwarden',passive:'Damaging skills give the caster a 10% one-hit ward.',move:'Prism aegis',detail:'0.65× spell; each living ally gains a 20% ward for two damaging hits.',mastery:'0.85× spell; two-hit wards become 30%.',scale:[.65,.85],cost:2,fx:'prism'},
  {id:'healing',name:'Dawnweaver',passive:'Basic spells heal the lowest-HP living ally for 2% of their maximum HP.',move:'Dawn renewal',detail:'0.4× spell; heal each living ally for 18% of their maximum HP. Does not revive.',mastery:'0.6× spell; party healing becomes 26%.',scale:[.4,.6],cost:2,fx:'renewal'}
 ]
];
const integer=(v,max)=>Number.isInteger(v)&&v>=0?Math.min(v,max):0,price=rank=>rank*(rank+1)/2;
window.SkillPaths={branches,tab:null,
 defaults(c){const old=c.skillPaths||{};c.skillPaths={version:1,notified:integer(old.notified,10),ranks:Array.from({length:4},(_,i)=>Array.from({length:3},(_,j)=>integer(old.ranks?.[i]?.[j],3)))};return c.skillPaths;},
 notification(s){const p=this.ensure(s),earned=this.budget(s),gained=earned-p.notified;if(gained<=0)return '';p.notified=earned;return '+'+gained+' skill point'+(gained>1?'s':'')+' for each role. Open Skills at camp to choose your paths.';},
 budget(s){return Math.floor(Math.max(1,Math.min(20,Number.isFinite(s.level)?Math.floor(s.level):1))/2);},
 ensure(s){const p=this.defaults(s.campaign),budget=this.budget(s);for(const ranks of p.ranks){while(ranks.reduce((n,r)=>n+price(r),0)>budget){let j=ranks.lastIndexOf(Math.max(...ranks));ranks[j]--;}}return p;},
 available(s,i){if(!Number.isInteger(i)||i<0||i>3)return 0;return this.budget(s)-this.ensure(s).ranks[i].reduce((n,r)=>n+price(r),0);},
 rank(s,i,j){return this.ensure(s).ranks[i]?.[j]||0;},
 learn(s,i,j,atCamp){if(!atCamp||s.phase!=='world'||!Number.isInteger(i)||i<0||i>3||!Number.isInteger(j)||j<0||j>2)return false;const rank=this.rank(s,i,j),next=rank+1;if(next>3||s.level<[0,2,6,12][next]||this.available(s,i)<next)return false;s.campaign.skillPaths.ranks[i][j]++;return true;},
 reset(s,i,atCamp){if(!atCamp||s.phase!=='world'||!Number.isInteger(i)||i<0||i>3)return false;this.ensure(s).ranks[i]=[0,0,0];return true;},
 isAction(action){return /^path-[0-2]$/.test(String(action));},
 move(s,i,action){if(!this.isAction(action)||!Number.isInteger(i)||i<0||i>3)return null;const branch=Number(action.slice(-1)),rank=this.rank(s,i,branch),spec=branches[i][branch];return {...spec,branch,rank,scale:spec.scale[rank===3?1:0],mastered:rank===3};},
 battle(c){const old=c.skillBattle||{};const ward=v=>v&&Number.isFinite(v.value)&&v.value>=0&&v.value<=.6?{value:v.value,hits:integer(v.hits,2)}:{value:0,hits:0};return c.skillBattle={turns:Array.from({length:4},(_,i)=>integer(old.turns?.[i],99999)),ready:Array.from({length:4},(_,i)=>Array.from({length:3},(_,j)=>integer(old.ready?.[i]?.[j],100002))),wards:Array.from({length:4},(_,i)=>ward(old.wards?.[i])),counter:Math.min(999,integer(old.counter,999)),riposte:[.6,.9].includes(old.riposte)?old.riposte:0,reflex:old.reflex===true,shots:integer(old.shots,99999),wound:{hits:integer(old.wound?.hits,2),damage:integer(old.wound?.damage,80)},rally:{hits:integer(old.rally?.hits,2),bonus:[.05,.25,.35].includes(old.rally?.bonus)?old.rally.bonus:0}};},
 cooldown(s,i,action){const move=this.move(s,i,action);if(!move)return 0;const b=this.battle(s.campaign);return Math.max(0,b.ready[i][move.branch]-b.turns[i]);},
 canUse(s,i,action){const m=this.move(s,i,action);return !!m&&s.phase==='battle'&&s.hp[i]>0&&!s.pendingEnemy&&m.rank>=2&&s.campaign.focus>=m.cost&&this.cooldown(s,i,action)===0;},
 choices(s,i){return branches[i].flatMap((_,j)=>{const action='path-'+j,m=this.move(s,i,action);if(m.rank<2)return [];const cool=this.cooldown(s,i,action);return [[action,m.move+(m.mastered?' ★':''),(m.mastered?m.mastery:m.detail)+' · '+m.cost+' focus · '+(cool?cool+' own turns until ready':'Ready · 2 own turns between uses')]];});},
 noteTurn(s,i){const b=this.battle(s.campaign);b.turns[i]=Math.min(99999,b.turns[i]+1);},
 ward(b,i,value,hits){const old=b.wards[i];if(old.hits<=0||value>old.value)b.wards[i]={value,hits};else if(value===old.value)old.hits=Math.max(old.hits,hits);},
 heal(s,i,part,label){if(s.hp[i]<=0)return 0;const max=RosterSystem.max(s,i),gain=Math.max(0,Math.min(max-s.hp[i],Math.ceil(max*part)));s.hp[i]+=gain;if(gain)EquipmentEffects.feedback(i,['+'+gain+' HP · '+label]);return gain;},
 attack(s,i,damage,skill,context={}){const ranks=this.ensure(s).ranks,b=this.battle(s.campaign),labels=[];if(damage<=0||s.hp[i]<=0)return {damage,labels};const action=context.action||'attack',m=this.move(s,i,action);
  if(i!==0&&b.wound.hits){damage+=b.wound.damage;b.wound.hits--;labels.push('WOUND +'+b.wound.damage);}
  if(i!==0&&b.rally.hits){damage*=1+b.rally.bonus;b.rally.hits--;labels.push('COURAGE +'+Math.round(b.rally.bonus*100)+'%');}
  if(i===0){if(ranks[0][0]&&action==='attack')damage*=1.08;if(ranks[0][1])b.wound={hits:1,damage:6};if(ranks[0][2])b.rally={hits:1,bonus:.05};}
  if(i===1){if(ranks[1][2])damage*=1.06;if(b.counter){damage+=b.counter;labels.push('COUNTER +'+b.counter);b.counter=0;}}
  if(i===2){b.shots++;if(ranks[2][0]&&context.weakness)damage*=1.08;if(ranks[2][1]&&b.shots%3===0){damage*=1.12;labels.push('VOLLEY RHYTHM');}}
  if(i===3){if(ranks[3][0]&&skill)damage*=1.08;if(ranks[3][1]&&skill)this.ward(b,i,.1,1);if(ranks[3][2]&&action==='attack'){const target=s.hp.map((hp,j)=>({j,hp,max:RosterSystem.max(s,j)})).filter(v=>v.hp>0&&v.hp<v.max).sort((a,b)=>a.hp/a.max-b.hp/b.max)[0];if(target)this.heal(s,target.j,.02,'KINDLED RENEWAL');}}
  if(m?.rank>=2){b.ready[i][m.branch]=Math.min(100002,b.turns[i]+3);labels.push(m.move.toUpperCase());const strong=m.mastered,c=s.campaign;
   if(i===0&&m.branch===0&&s.enemyHp<=context.enemyMax*.4){damage*=strong?1.35:1.25;labels.push('EXECUTION');}
   if(i===0&&m.branch===1)b.wound={hits:2,damage:Math.min(80,Math.max(1,Math.round(damage*(strong?.35:.25))))};
   if(i===0&&m.branch===2){b.rally={hits:2,bonus:strong?.35:.25};if(strong)s.hp.forEach((hp,j)=>{if(hp>0)this.ward(b,j,.1,1);});}
   if(i===1&&m.branch===0)s.hp.forEach((hp,j)=>{if(hp>0)this.ward(b,j,strong?.35:.25,1);});
   if(i===1&&m.branch===1){b.riposte=strong?.9:.6;c.roleTaunt=true;}
   if(i===1&&m.branch===2){c.stagger=Math.min(3,c.stagger+(strong?2:1));c.roleChill=true;}
   if(i===2&&m.branch===1)c.stagger=Math.min(3,c.stagger+(strong?2:1));
   if(i===2&&m.branch===2)this.ward(b,i,strong?.6:.45,1);
   if(i===3&&m.branch===1)s.hp.forEach((hp,j)=>{if(hp>0)this.ward(b,j,strong?.3:.2,2);});
   if(i===3&&m.branch===2)s.hp.forEach((hp,j)=>{if(hp>0)this.heal(s,j,strong?.26:.18,'DAWN RENEWAL');});
  }
  return {damage:Math.max(1,Math.round(damage)),labels};
 },
 defend(s,i,amount){if(amount<=0)return {damage:0,labels:[]};const ranks=this.ensure(s).ranks,b=this.battle(s.campaign),labels=[];let damage=amount;if(i===1&&ranks[1][0])damage*=.94;const w=b.wards[i];if(w.hits>0){damage*=1-w.value;w.hits--;labels.push('SKILL WARD −'+Math.round(w.value*100)+'%');}return {damage:Math.max(1,Math.round(damage)),labels};},
 basePower(s,i){const c=s.campaign;return HEROES[i].power+(s.level-1)*5+c.upgrades[i]*5+c.runeLevels[i].power*3+c.talents.power*2+c.progression.gear[i].weapon*3+(c.completed.includes('ruins')?4:0)+(c.completed.includes('mine')?3:0);},
 afterDefense(s,i,step){if(s.hp[i]<=0)return;const ranks=this.ensure(s).ranks,b=this.battle(s.campaign),success=step.grade==='guard'||step.grade==='perfect';if(i===1){if(success&&ranks[1][1]){const bonus=Math.ceil(this.basePower(s,i)*(b.riposte||.15));b.counter=Math.max(b.counter,bonus);EquipmentEffects.feedback(i,['COUNTER READY +'+bonus]);}if(b.riposte)b.riposte=0;}if(i===2&&success&&ranks[2][2]&&!b.reflex){b.reflex=true;s.campaign.focus=Math.min(3,s.campaign.focus+1);EquipmentEffects.feedback(i,['TRAIL REFLEXES · +1 FOCUS']);}},
 status(s,i){const learned=branches[i].map((p,j)=>this.rank(s,i,j)?p.name+' '+this.rank(s,i,j)+'/3':'').filter(Boolean),b=this.battle(s.campaign);return learned.join(' · ')+(i===1&&b.counter?' · Counter +'+b.counter+' ready':'')+(b.wards[i].hits?' · '+Math.round(b.wards[i].value*100)+'% ward ×'+b.wards[i].hits:'');},
 render(parent,s,atCamp,onChange){this.ensure(s);parent.replaceChildren();const title=document.createElement('h3'),intro=document.createElement('p'),tabs=document.createElement('div');title.textContent='Hero skill paths';title.id='skill-paths-heading';intro.textContent='Each role earns 1 point at levels 2, 4, 6 … 20. Spend at camp. Learn a passive, unlock its move, then master it. Mix paths or specialize; reset freely at camp. Training stays with the role when companions change.';tabs.className='skill-role-tabs';tabs.setAttribute('role','group');tabs.setAttribute('aria-label','Choose a role to train');const role=Number.isInteger(this.tab)?this.tab:s.campaign.playerHero.role;this.tab=role;
  for(let i=0;i<4;i++){const b=document.createElement('button');b.textContent=HEROES[i].name+' · '+this.available(s,i)+' points';b.setAttribute('aria-pressed',String(i===role));b.onclick=()=>{this.tab=i;this.render(parent,s,atCamp,onChange);};tabs.append(b);}parent.append(title,intro,tabs);
  const summary=document.createElement('p'),grid=document.createElement('div');summary.className='skill-point-summary';summary.textContent=HEROES[role].name+' · Level '+s.level+' · '+this.available(s,role)+' available / '+this.budget(s)+' earned points'+(atCamp?'':' · Visit camp to train');grid.className='skill-path-grid';
  branches[role].forEach((path,j)=>{const rank=this.rank(s,role,j),card=document.createElement('section'),h=document.createElement('h4');card.className='skill-path-card';card.dataset.rank=String(rank);h.textContent=path.name+' · '+rank+'/3';card.append(h);const steps=[['Passive',path.passive],['Unlock '+path.move,path.detail+' · '+path.cost+' focus · 2 own turns between uses'],['Master '+path.move,path.mastery]];steps.forEach(([label,detail],n)=>{const tier=n+1,line=document.createElement('div'),strong=document.createElement('strong'),copy=document.createElement('p'),button=document.createElement('button');line.className='skill-node';line.dataset.learned=String(rank>=tier);strong.textContent=label;copy.textContent=detail;button.textContent=rank>=tier?'Learned':tier+' point'+(tier>1?'s':'')+' · level '+[0,2,6,12][tier]+(rank<tier-1?' · learn previous node first':'');button.disabled=!atCamp||s.phase!=='world'||rank!==tier-1||s.level<[0,2,6,12][tier]||this.available(s,role)<tier;button.onclick=()=>{if(this.learn(s,role,j,atCamp))onChange();};line.append(strong,copy,button);card.append(line);});grid.append(card);});
  const reset=document.createElement('button');reset.textContent='Reset '+HEROES[role].name+'’s paths · refund all spent points';reset.disabled=!atCamp||!this.ensure(s).ranks[role].some(Boolean);reset.onclick=()=>{if(this.reset(s,role,atCamp))onChange();};parent.append(summary,grid,reset);
 }
};
const attack=EquipmentEffects.attack;EquipmentEffects.attack=function(s,i,base,skill,max,enemyMax,context={}){const path=SkillPaths.attack(s,i,base,skill,{...context,enemyMax}),hit=attack.call(this,s,i,path.damage,skill,max,enemyMax,context);hit.labels.unshift(...path.labels);return hit;};
const defend=EquipmentEffects.defend;EquipmentEffects.defend=function(s,i,amount,max){const path=SkillPaths.defend(s,i,amount),hit=defend.call(this,s,i,path.damage,max);hit.labels.unshift(...path.labels);return hit;};
const reset=PartyRoles.reset;PartyRoles.reset=function(c){reset.call(this,c);delete c.skillBattle;SkillPaths.battle(c);};
const defaults=Progression.defaults;Progression.defaults=function(c){defaults.call(this,c);SkillPaths.defaults(c);SkillPaths.battle(c);return c;};
})();
