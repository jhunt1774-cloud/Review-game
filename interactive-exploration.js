// Searchable scenery and a saved, optional surface shortcut. No boss gates are bypassed.
(()=>{'use strict';
const graph=DungeonRules.mainGraph;
const sites=[
 {id:'search-hollow',join:'v3',x:18,y:77,name:'The hollow oak',prop:0,text:'A dry hollow hides a sealed ranger’s satchel. Search it, or leave it for another traveler.',reward:[30,12,1,0,'Recovered ranger’s satchel'],button:'Search the hollow · supplies'},
 {id:'search-bench',join:'v21',x:62,y:60,name:'Abandoned ranger’s bench',prop:3,text:'Broken arrowheads and a small ore pouch lie beneath the workbench. Salvage the useful pieces.',reward:[35,8,0,0,'Ranger’s salvaged materials'],button:'Salvage crafting materials',materials:true},
 {id:'restore-footpath',join:'v15',x:35,y:49,name:'Overgrown footpath',prop:1,text:'Beyond the brambles, an old footpath reconnects to the lower forest road. Clearing it opens a permanent shortcut. The northern Guardian gate remains on its own route.',reward:[45,0,0,1,'Restored forest footpath'],button:'Clear the brambles · open shortcut',shortcut:true}
];
for(const s of sites){const p=graph.points.get(s.join),cost=Math.hypot(p.x-s.x,p.y-s.y);graph.points.set(s.id,{id:s.id,x:s.x,y:s.y});graph.edges.set(s.id,[{id:s.join,cost}]);graph.edges.get(s.join).push({id:s.id,cost});FOREST_NODES.push({id:s.id,kind:'search-scenery',name:s.name,description:'Investigate this place. Rewards and changes are saved.',chapter:0,stage:0,radius:1.7,x:s.x,y:s.y});}
window.InteractiveExploration={sites,opened:false,
 sync(c){const open=c.completed.includes('restore-footpath');if(open===this.opened)return;this.opened=open;const a='restore-footpath',b='v11';for(const [from,to]of [[a,b],[b,a]]){const edges=graph.edges.get(from);for(let i=edges.length-1;i>=0;i--)if(edges[i].id===to)edges.splice(i,1);if(open){const p=graph.points.get(from),q=graph.points.get(to);edges.push({id:to,cost:Math.hypot(p.x-q.x,p.y-q.y)});}}MineExpansion.reset();},
 interact(state,node,ui){const s=sites.find(s=>s.id===node.id),c=state.campaign;if(!s||c.completed.includes(s.id))return;MineExpansion.modal(s.name,s.text,[{label:s.button,act:()=>{if(!DungeonRules.reward(state,s.id,...s.reward))return false;if(s.materials){c.progression.materials.ore+=4;c.progression.materials.essence+=2;}this.sync(c);ui.save();ui.notice(s.name,s.shortcut?'The footpath is open. Follow the new trail south.':s.materials?'Recovered 4 ore, 2 essence and XP.':'Recovered a potion, gold and XP.');return true;}}],state,ui);}
};
const bind=DungeonRules.bind,handles=DungeonRules.handles,allowed=DungeonRules.allowed,interact=DungeonRules.interact;
DungeonRules.bind=function(c){bind.call(this,c);InteractiveExploration.sync(c);};
DungeonRules.handles=function(n){return n.kind==='search-scenery'||handles.call(this,n);};
DungeonRules.allowed=function(c,n){return n.kind==='search-scenery'?!c.dungeon&&c.viewChapter===0&&!c.completed.includes(n.id):allowed.call(this,c,n);};
DungeonRules.interact=function(s,n,ui){return n.kind==='search-scenery'?InteractiveExploration.interact(s,n,ui):interact.call(this,s,n,ui);};
const landmark=ForestArt.landmark;
ForestArt.landmark=function(c,n,at,done,time){const site=sites.find(s=>s.id===n.id);if(!site)return landmark.call(this,c,n,at,done,time);c.save();if(done)c.globalAlpha=.65;const drawn=MapVariety.draw(c,site.prop,at.x,at.y,110,105);c.restore();if(!drawn)return landmark.call(this,c,n,at,done,time);if(!done){c.save();c.font='bold 22px Georgia';c.textAlign='center';c.fillStyle='#ffe0a0';c.strokeStyle='#231c12';c.lineWidth=4;c.strokeText('?',at.x,at.y-111);c.fillText('?',at.x,at.y-111);c.restore();}};
})();
