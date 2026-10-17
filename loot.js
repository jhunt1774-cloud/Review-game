// Loot sites use existing road waypoints; no new off-road movement or quest gates.
window.LootRules={
 powers:[{name:'Runebreaker',hint:'Find the axe rune on the Mossgate trail.',description:'2.2× damage · expose armor for two more hits'},{name:'Aegis quake',hint:'Find the shield rune on the northern forest trail.',description:'1.25× damage · draw next attack · strengthen your shield'},{name:'Starfall volley',hint:'Find the ranger relic beyond the forest camp.',description:'2.3× damage · mark the enemy for a teammate'},{name:'Renewal',hint:'Find the moonstone on the western shrine trail.',description:'Heal every ally 25% max HP · light magic strike'}],
 sites:[
 {id:'loot-axe',chapter:0,point:'v10',name:'Forgotten axe rune',item:'Runebreaker sigil',hero:0,xp:45,gold:10,runes:1},
 {id:'loot-shield',chapter:0,point:'v29',name:'Oathkeeper’s cairn',item:'Aegis stone',hero:1,xp:55,gold:15,runes:1},
 {id:'loot-bow',chapter:0,point:'v22',name:'Ranger’s buried quiver',item:'Starfall feather',hero:2,xp:55,gold:15,potions:1},
 {id:'loot-moon',chapter:0,point:'v17',name:'Moonstone offering',item:'Moonwell tear',hero:3,xp:55,gold:10,potions:1},
 {id:'loot-frost-lore',chapter:1,point:'h6',name:'Frozen expedition journal',item:'Frostpeak explorer’s journal',xp:85,gold:30,runes:2},
 {id:'loot-crystal-cache',chapter:1,point:'h19',name:'Crystal prospector’s stash',item:'Prospector’s rune pouch',xp:90,gold:40,potions:2,runes:2},
 {id:'loot-beacon-lore',chapter:2,point:'c6',name:'Lost keeper’s record',item:'Beacon keeper’s record',xp:110,gold:45,runes:3},
 {id:'loot-city-cache',chapter:2,point:'c19',name:'Sealed city strongbox',item:'Dawnward strongbox',xp:115,gold:60,potions:2,runes:3},
 {id:'loot-coast-lore',chapter:3,point:'s6',name:'Navigator’s hidden chart',item:'Navigator’s star chart',xp:140,gold:65,runes:3},
 {id:'loot-coast-cache',chapter:3,point:'s20',name:'Tide-sealed treasure',item:'Pearl-inlaid sea chest',xp:150,gold:80,potions:2,runes:4}
 ],
 unlocked(c,hero){return this.sites.some(s=>s.hero===hero&&c.completed.includes(s.id));},
 count(c){return this.sites.filter(s=>c.completed.includes(s.id)).length;},
 collect(state,id){const site=this.sites.find(s=>s.id===id);if(!site||state.campaign.completed.includes(id))return null;const c=state.campaign,old=state.level;state.xp+=site.xp;state.gold+=site.gold||0;c.potions=Math.min(99,c.potions+(site.potions||0));c.runes=Math.min(999,c.runes+(site.runes||0));state.level=Math.min(20,1+Math.floor(state.xp/120));c.completed.push(id);state.treasure.push(site.item);const lines=['+'+site.xp+' XP',site.gold?'+'+site.gold+' gold':'',site.potions?'+'+site.potions+' potions':'',site.runes?'+'+site.runes+' forge runes':'',Number.isInteger(site.hero)?HEROES[site.hero].name+' unlocked '+this.powers[site.hero].name+'!':'',state.level>old?'Level '+state.level+' reached!':''].filter(Boolean);return {title:site.item,message:lines.join(' · ')};},
 resetBattle(c){c.relicUsed=[false,false,false,false];},
 canUse(c,hero){return this.unlocked(c,hero)&&c.focus>=3&&!c.relicUsed?.[hero];}
};
for(const site of LootRules.sites){const point=MapRoutes.graphs[site.chapter].points.get(site.point);if(!point)throw Error('Loot waypoint missing: '+site.point);FOREST_NODES.push({...site,kind:'loot',radius:1.7,description:site.hero===undefined?'Explore this discovery for XP and supplies.':'Recover a relic to unlock '+LootRules.powers[site.hero].name+'.',x:point.x,y:point.y});}
