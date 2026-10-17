// Named, once-only drops. Save IDs are independent of display names and companions.
(()=>{'use strict';
const rows=[
 ['m0','mossbite','Mossbite axe','weapon',0,'uncommon',3,0,0,0],
 ['m1','moonfang','Moonfang bow','weapon',2,'uncommon',4,0,0,0],
 ['m2','bridgeguard','Bridgeguard mail','armor',null,'uncommon',0,12,.02,0],
 ['m3','emerald-heart','Emerald heart pendant','accessory',null,'rare',2,12,0,0],
 ['m4','ridgebreaker','Ridgebreaker hammer','weapon',1,'uncommon',6,0,0,0],
 ['m5','frost-lantern','Frost lantern staff','weapon',3,'rare',6,0,0,.03],
 ['m6','watchtower','Watchtower plate','armor',null,'rare',0,20,.03,0],
 ['m7','stormstring','Stormstring bow','weapon',2,'epic',8,0,0,.04],
 ['m8','thornreaver','Thornreaver axe','weapon',0,'rare',9,0,.01,0],
 ['m9','first-flame','First Flame staff','weapon',3,'epic',8,0,0,.08],
 ['m10','emberforge','Emberforge hammer','weapon',1,'epic',10,0,0,.03],
 ['m11','dawnheart','Dawnheart medallion','accessory',null,'legendary',0,16,0,.08],
 ['m12','saltcleaver','Saltcleaver axe','weapon',0,'epic',11,0,0,.03],
 ['m13','tideglass-focus','Tideglass staff','weapon',3,'epic',11,0,0,.06],
 ['m14','coral-aegis','Coral aegis armor','armor',null,'epic',0,30,.04,0],
 ['m15','beaconstring','Beaconstring bow','weapon',2,'legendary',13,0,0,.08],
 ['ruins','ranger-hide','Ruins ranger coat','armor',null,'uncommon',0,16,.01,0],
 ['mine','quartz-maul','Quartz maul','weapon',1,'rare',7,0,0,.04],
 ['vault','clockwork-shell','Clockwork shell armor','armor',null,'epic',0,24,.05,0],
 ['reef','pearl-ward','Pearl ward','accessory',null,'epic',0,14,.05,0],
 ['crypt-guardian','rootward-mail','Rootward oath mail','armor',null,'rare',0,18,.03,0],
 ['crypt-secret','root-whisper','Root whisper charm','accessory',null,'rare',0,16,0,.03],
 ['cache','wayfarer-coat','Wayfarer coat','armor',null,'uncommon',0,8,0,0],
 ['cache2','wind-feather','Wind feather charm','accessory',null,'uncommon',3,0,.01,0],
 ['cache3','keepers-light','Keeper’s light charm','accessory',null,'rare',0,14,0,.03],
 ['loot-coast-cache','navigator-ring','Navigator’s star ring','accessory',null,'epic',4,0,0,.05]
];
window.EquipmentLoot={catalog:rows.map(([source,id,name,slot,role,rarity,damage,hp,guard,skill])=>({source,id,name,slot,role,rarity,damage,hp,guard,skill})),
 get(id){return this.catalog.find(item=>item.id===id);},
 defaults(c){const old=c.equipmentLoot||{},owned=Array.isArray(old.owned)?[...new Set(old.owned.filter(id=>this.get(id)))]:[],claimed=Array.isArray(old.claimed)?[...new Set(old.claimed.filter(source=>this.catalog.some(item=>item.source===source)))]:[],used=new Set();c.equipmentLoot={owned,claimed,loadouts:Array.from({length:4},(_,role)=>Object.fromEntries(['weapon','armor','accessory'].map(slot=>{const item=this.get(old.loadouts?.[role]?.[slot]),valid=item&&owned.includes(item.id)&&item.slot===slot&&(item.role===null||item.role===role)&&!used.has(item.id);if(valid)used.add(item.id);return [slot,valid?item.id:null];})))};for(const source of new Set(Array.isArray(c.completed)?c.completed:[]))this.collect(c,source);for(let i=0;i<4;i++)if(c.equipmentLoot.loadouts[i].accessory)c.progression.gear[i].accessory=null;return c;},
 collect(c,source){const inv=c.equipmentLoot;if(!inv||inv.claimed.includes(source))return '';const item=this.catalog.find(item=>item.source===source);if(!item)return '';inv.claimed.push(source);if(!inv.owned.includes(item.id))inv.owned.push(item.id);return item.rarity.toUpperCase()+' · '+item.name;},
 stats(c,role,replace=null){const result={damage:0,hp:0,guard:0,skill:0},slots={...c.equipmentLoot.loadouts[role],...replace};for(const id of Object.values(slots)){const item=this.get(id);if(item)for(const key of Object.keys(result))result[key]+=item[key];}return result;},
 equip(s,role,id,atCamp){if(s.phase!=='world'||!atCamp||!Number.isInteger(role)||role<0||role>3)return false;const item=this.get(id),inv=s.campaign.equipmentLoot;if(!item||!inv.owned.includes(id)||item.role!==null&&item.role!==role)return false;const current=inv.loadouts[role][item.slot];for(const loadout of inv.loadouts)if(loadout[item.slot]===id)loadout[item.slot]=null;inv.loadouts[role][item.slot]=current===id?null:id;if(item.slot==='accessory'&&current!==id)s.campaign.progression.gear[role].accessory=null;return true;},
 describe(stats){return [stats.damage?'+'+stats.damage+' attack':'',stats.hp?'+'+stats.hp+' max HP':'',stats.guard?Math.round(stats.guard*100)+'% protection':'',stats.skill?'+'+Math.round(stats.skill*100)+'% skill damage':''].filter(Boolean).join(' · ')||'No bonuses';},
 comparison(c,role,item){const old=this.stats(c,role),next=this.stats(c,role,{[item.slot]:item.id}),g=c.progression.gear[role];if(item.slot==='accessory'&&g.accessory){if(g.accessory==='vigor')old.hp+=20;if(g.accessory==='ward')old.guard+=.06;}const format=(v,suffix)=>v===0?'':(v>0?'+':'')+v+suffix;const differences=[format(next.damage-old.damage,' attack'),format(next.hp-old.hp,' max HP'),format(Math.round((next.guard-old.guard)*100),'% protection'),format(Math.round((next.skill-old.skill)*100),'% skill damage')];if(item.slot==='accessory'&&g.accessory==='precision')differences.push('replaces +6% attack accessory');return differences.filter(Boolean).join(' · ')||'Same bonuses';},
 render(parent,s,atCamp,onChange){parent.replaceChildren();const inv=s.campaign.equipmentLoot,h=document.createElement('h3'),intro=document.createElement('p');h.textContent='Found equipment · '+inv.owned.length+' / '+this.catalog.length;intro.textContent='Choose a character to compare equipment. One weapon, one armor and one accessory per role. One copy per item; equipping a shared item moves it from its previous wearer. Found accessories replace crafted accessories. '+(atCamp?'Equip at camp below.':'Visit camp to equip.');parent.append(h,intro);
 const label=document.createElement('label'),select=document.createElement('select');label.textContent='Compare for ';select.id='inventory-role';HEROES.forEach((hero,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent=hero.name+' · '+hero.role;select.append(option);});const role=Number.isInteger(parent._role)?parent._role:s.campaign.playerHero.role;select.value=String(role);label.append(select);parent.append(label);select.onchange=()=>{parent._role=Number(select.value);this.render(parent,s,atCamp,onChange);};
 const current=document.createElement('p');current.textContent='Equipped: '+Object.entries(inv.loadouts[role]).map(([slot,id])=>slot+': '+(this.get(id)?.name||'standard')).join(' · ');if(s.campaign.progression.gear[role].accessory)current.textContent+=' · crafted accessory: '+Progression.accessories[s.campaign.progression.gear[role].accessory].name;parent.append(current);
 const grid=document.createElement('div');grid.className='equipment-grid';const eligible=inv.owned.map(id=>this.get(id)).filter(item=>item.role===null||item.role===role).sort((a,b)=>['legendary','epic','rare','uncommon'].indexOf(a.rarity)-['legendary','epic','rare','uncommon'].indexOf(b.rarity));if(!eligible.length){const empty=document.createElement('p');empty.textContent='Defeat enemies and search side paths to find equipment for this role.';grid.append(empty);}for(const item of eligible){const card=document.createElement('article'),badge=document.createElement('small'),name=document.createElement('strong'),stats=document.createElement('p'),compare=document.createElement('p'),button=document.createElement('button'),owner=inv.loadouts.findIndex(loadout=>loadout[item.slot]===item.id);card.className='equipment-card';card.dataset.rarity=item.rarity;badge.textContent=item.rarity.toUpperCase()+' · '+item.slot;name.textContent=item.name;stats.textContent=this.describe(item);compare.textContent=owner===role?'Currently equipped':this.comparison(s.campaign,role,item);compare.className='equipment-comparison';button.textContent=owner===role?'Unequip':owner>=0?'Move from '+HEROES[owner].name:'Equip on '+HEROES[role].name;button.disabled=!atCamp;button.onclick=()=>{if(this.equip(s,role,item.id,atCamp))onChange();};card.append(badge,name,stats,compare,button);grid.append(card);}parent.append(grid);
 }
};
const defaults=Progression.defaults,hp=Progression.hp,attack=Progression.attack,incoming=Progression.incoming,accessory=Progression.accessory;
Progression.defaults=function(c){defaults.call(this,c);EquipmentLoot.defaults(c);return c;};
Progression.hp=function(c,i){return hp.call(this,c,i)+EquipmentLoot.stats(c,i).hp;};
Progression.attack=function(c,i,base,skill){const bonus=EquipmentLoot.stats(c,i);return Math.round(attack.call(this,c,i,base+bonus.damage,skill)*(skill?1+bonus.skill:1));};
Progression.incoming=function(c,i,amount){const reduced=incoming.call(this,c,i,amount);return reduced>0?Math.max(1,Math.round(reduced*(1-EquipmentLoot.stats(c,i).guard))):0;};
Progression.accessory=function(s,i,key,atCamp){const changed=accessory.call(this,s,i,key,atCamp);if(changed&&s.campaign.progression.gear[i].accessory)s.campaign.equipmentLoot.loadouts[i].accessory=null;return changed;};
})();
