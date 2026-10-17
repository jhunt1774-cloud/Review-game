// Identity and companion ownership are saved with each independent adventure.
(()=>{'use strict';
const bases=HEROES.map(h=>({...h})),original=['thorin','brom','lira','seren'];
window.RosterSystem={
 members:[
 {id:'thorin',role:0,name:'Thorin',hp:0,power:0,description:'Balanced axe fighter',gate:null},
 {id:'brom',role:1,name:'Brom',hp:0,power:0,description:'Balanced defender',gate:null},
 {id:'lira',role:2,name:'Lira',hp:0,power:0,description:'Balanced ranger',gate:null},
 {id:'seren',role:3,name:'Seren',hp:0,power:0,description:'Balanced mage',gate:null},
 {id:'kestrel',role:2,name:'Kestrel',hp:-8,power:3,description:'Scout · +3 attack, −8 base HP',gate:'m3'},
 {id:'orin',role:1,name:'Orin',hp:15,power:-2,description:'Stalwart · +15 base HP, −2 attack',gate:'m3'},
 {id:'rowan',role:0,name:'Rowan',hp:-10,power:4,description:'Berserker · +4 attack, −10 base HP',gate:'m7'},
 {id:'nyra',role:3,name:'Nyra',hp:12,power:-2,description:'Dawn healer · +12 base HP, −2 attack',gate:'m7'}
 ],
 cleanName(value){return typeof value==='string'?value.replace(/[^\p{L}\p{M}\p{N} '\-]/gu,'').replace(/\s+/g,' ').trim().slice(0,24):'';},
 unlocked(c,m){return !m.gate||c.completed.includes(m.gate);},
 defaults(c){const p=c.playerHero;c.playerHero={role:Number.isInteger(p?.role)&&p.role>=0&&p.role<4?p.role:0,name:this.cleanName(p?.name)||bases[Number.isInteger(p?.role)&&p.role>=0&&p.role<4?p.role:0].name,chosen:p?.chosen===true};c.activeRoster=original.map((fallback,role)=>{const m=this.members.find(m=>m.id===c.activeRoster?.[role]&&m.role===role);return m&&this.unlocked(c,m)?m.id:fallback;});const health=c.companionHealth;c.companionHealth=Object.fromEntries(this.members.filter(m=>Number.isFinite(health?.[m.id])&&health[m.id]>=0).map(m=>[m.id,Math.min(9999,health[m.id])]));return c;},
 story(text){return String(text).replace(/\b(Thorin|Brom|Lira|Seren)\b/g,name=>HEROES[bases.findIndex(h=>h.name===name)].name);},
 apply(s){this.defaults(s.campaign);MapWalkers.leader=s.campaign.playerHero.role;s.campaign.activeRoster.forEach((id,i)=>{const m=this.members.find(m=>m.id===id),base=bases[i];Object.assign(HEROES[i],base,{name:s.campaign.playerHero.role===i?s.campaign.playerHero.name:m.name,maxHp:base.maxHp+m.hp,power:base.power+m.power});});},
 max(s,i){return HEROES[i].maxHp+(s.level-1)*12+s.campaign.talents.vitality*8+s.campaign.runeLevels[i].vitality*8+Progression.hp(s.campaign,i);},
 sync(s){if(!s?.campaign?.activeRoster)return;s.campaign.activeRoster.forEach((id,i)=>s.campaign.companionHealth[id]=s.hp[i]);},
 identify(s,role,name){name=this.cleanName(name);if(!name||!Number.isInteger(role)||role<0||role>3||s.campaign.playerHero.chosen)return false;s.campaign.playerHero={role,name,chosen:true};if(s.phase==='prologue')s.actor=role;this.apply(s);return true;},
 swap(s,role,id,atCamp){const m=this.members.find(m=>m.id===id&&m.role===role);if(s.phase!=='world'||!atCamp||!m||!this.unlocked(s.campaign,m)||role===s.campaign.playerHero.role||id===s.campaign.activeRoster[role])return false;this.sync(s);s.campaign.activeRoster[role]=id;this.apply(s);s.hp[role]=Math.min(this.max(s,role),s.campaign.companionHealth[id]??this.max(s,role));this.sync(s);return true;},
 identityUI(parent,s,onConfirm){const box=document.createElement('section');box.className='hero-identity';const heading=document.createElement('h2');heading.textContent='Your hero';box.append(heading);if(s.campaign.playerHero.chosen){const p=document.createElement('p');p.textContent=s.campaign.playerHero.name+' · '+bases[s.campaign.playerHero.role].role+' · Level '+s.level;box.append(p);parent.append(box);return;}
 const nameLabel=document.createElement('label'),name=document.createElement('input'),roleLabel=document.createElement('label'),role=document.createElement('select'),note=document.createElement('p');nameLabel.textContent='Hero name';name.id='player-hero-name';name.maxLength=24;name.value=s.campaign.playerHero.name;name.autocomplete='off';parent._identity={name,role:null};nameLabel.append(name);roleLabel.textContent='Choose your role';role.id='player-hero-role';bases.forEach((h,i)=>{const o=document.createElement('option');o.value=String(i);o.textContent=h.role;role.append(o);});role.value=String(s.campaign.playerHero.role);parent._identity.role=role;roleLabel.append(role);const confirm=document.createElement('button');confirm.id='confirm-player-hero';confirm.textContent='Make this my hero';confirm.onclick=()=>{if(!this.identify(s,Number(role.value),name.value)){note.textContent='Enter a name with letters or numbers (up to 24 characters).';return;}onConfirm();};note.textContent='Your hero stays in the party. The other three roles can change companions at camp.';box.append(nameLabel,roleLabel,confirm,note);parent.append(box);},
 render(parent,s,atCamp,onChange){parent.replaceChildren();this.identityUI(parent,s,onChange);const heading=document.createElement('h3');heading.textContent='Camp companions';parent.append(heading);const notice=document.createElement('p');notice.textContent=atCamp?'Choose one companion for each role. HP follows each companion; changing companions does not heal them. Gear and rune upgrades belong to the role.':'Visit camp to change companions. Your roster and unlocks are shown below.';parent.append(notice);for(let i=0;i<4;i++){const row=document.createElement('div');row.className='roster-role';const title=document.createElement('strong');title.textContent=bases[i].role+(s.campaign.playerHero.role===i?' · YOUR HERO':'');row.append(title);for(const m of this.members.filter(m=>m.role===i)){const b=document.createElement('button'),unlocked=this.unlocked(s.campaign,m),active=s.campaign.activeRoster[i]===m.id;b.textContent=(active?'✓ ':'')+(s.campaign.playerHero.role===i&&active?s.campaign.playerHero.name:m.name)+' · '+m.description+(!unlocked?' · Unlock after '+(m.gate==='m3'?'Forest Guardian':'Storm Drake'):'');b.disabled=!atCamp||!unlocked||active||s.campaign.playerHero.role===i;b.onclick=()=>{if(this.swap(s,i,m.id,atCamp))onChange();};row.append(b);}parent.append(row);}
 // Identity can be adopted by an older save only while at camp.
 if(!atCamp&&!s.campaign.playerHero.chosen)for(const control of parent.querySelectorAll?.('input,select,#confirm-player-hero')||[])control.disabled=true;
 }
};
})();

