// Landmarks are painted into their own map, using the same camera and brushwork.
(()=>{'use strict';
const maps={"region-0":{"asset":"assets/integrated-region-0.webp?v=0daf2f2c8a","features":[{"number":1,"id":"cache","name":"Abandoned supply cart","kind":"treasure","x":52.166666666666664,"y":70.25},{"number":2,"id":"firefly-cache","name":"Firefly glade","kind":"treasure","x":18.833333333333332,"y":70.25},{"number":3,"id":"ranger-cache","name":"Ranger’s hidden camp","kind":"treasure","x":89.5,"y":58.25},{"number":4,"id":"loot-axe","name":"Forgotten axe rune","kind":"loot","x":26.833333333333332,"y":66.25},{"number":5,"id":"loot-shield","name":"Oathkeeper’s cairn","kind":"loot","x":49.5,"y":32.25},{"number":6,"id":"loot-bow","name":"Ranger’s buried quiver","kind":"loot","x":60.166666666666664,"y":64.25},{"number":7,"id":"loot-moon","name":"Moonstone offering","kind":"loot","x":37.5,"y":48.25},{"number":8,"id":"crypt-entrance","name":"Rootbound Sanctuary","kind":"dungeon","x":30,"y":53},{"number":9,"id":"amber-hollow-entrance","name":"Amber Hollow","kind":"dungeon","x":27,"y":92},{"number":10,"id":"ranger-hollow","name":"A satchel in the hollow","kind":"search-scenery","x":33.5,"y":74.25},{"number":11,"id":"ranger-shelter","name":"The ivy-covered shelter","kind":"search-scenery","x":45.5,"y":50.25},{"number":12,"id":"ranger-shrine","name":"The amber-root shrine","kind":"search-scenery","x":44.166666666666664,"y":68.25},{"number":13,"id":"ranger-den","name":"Heartwood Den","kind":"battle","x":41.5,"y":28.25},{"number":14,"id":"merchant","name":"Wayfarer camp","kind":"merchant","x":25,"y":66},{"number":15,"id":"roam-cache-0-0","name":"Abandoned trail satchel","kind":"roam-cache","x":46.166666666666664,"y":59.25},{"number":16,"id":"roam-cache-0-1","name":"Hunter’s hidden cache","kind":"roam-cache","x":70.16666666666667,"y":83.25},{"number":17,"id":"roam-cache-0-2","name":"Warden’s relic chest","kind":"roam-cache","x":52.833333333333336,"y":49.25}]},"region-1":{"asset":"assets/integrated-region-1.webp?v=d2a471362a","features":[{"number":1,"id":"cache2","name":"Climber’s supplies","kind":"treasure","x":42.833333333333336,"y":88.25},{"number":2,"id":"loot-frost-lore","name":"Frozen expedition journal","kind":"loot","x":28.166666666666668,"y":82.25},{"number":3,"id":"loot-crystal-cache","name":"Crystal prospector’s stash","kind":"loot","x":58.833333333333336,"y":60.25},{"number":4,"id":"frostmine-entrance","name":"Lost Expedition Works","kind":"dungeon","x":69,"y":44},{"number":5,"id":"frostcrest-discovery-camp","name":"The snowbound survey camp","kind":"search-scenery","x":22.833333333333332,"y":70.25},{"number":6,"id":"frostcrest-discovery-winch","name":"The abandoned ore winch","kind":"search-scenery","x":48.166666666666664,"y":26.25},{"number":7,"id":"frostcrest-discovery-cairn","name":"The frost-crystal cairn","kind":"search-scenery","x":38.833333333333336,"y":40.25},{"number":8,"id":"frostcrest-discovery-den","name":"The icy survey den","kind":"battle","x":32.166666666666664,"y":32.25},{"number":9,"id":"merchant","name":"Wayfarer camp","kind":"merchant","x":42,"y":84},{"number":10,"id":"roam-cache-1-0","name":"Abandoned trail satchel","kind":"roam-cache","x":35.5,"y":83.25},{"number":11,"id":"roam-cache-1-1","name":"Hunter’s hidden cache","kind":"roam-cache","x":76.83333333333333,"y":77.25},{"number":12,"id":"roam-cache-1-2","name":"Warden’s relic chest","kind":"roam-cache","x":7.5,"y":15.25}]},"region-2":{"asset":"assets/integrated-region-2.webp?v=8d3733b8ef","features":[{"number":1,"id":"cache3","name":"Refugee supply wagon","kind":"treasure","x":40.166666666666664,"y":80.25},{"number":2,"id":"loot-beacon-lore","name":"Lost keeper’s record","kind":"loot","x":29.5,"y":72.25},{"number":3,"id":"loot-city-cache","name":"Sealed city strongbox","kind":"loot","x":32.166666666666664,"y":34.25},{"number":4,"id":"clockwork-garden-entrance","name":"Clockwork Conservatory","kind":"dungeon","x":66.83333333333333,"y":95.75},{"number":5,"id":"archive-discovery-books","name":"The ivy-covered bookstall","kind":"search-scenery","x":12.166666666666666,"y":38.25},{"number":6,"id":"archive-discovery-astrolabe","name":"The fallen astrolabe","kind":"search-scenery","x":56.166666666666664,"y":30.25},{"number":7,"id":"archive-discovery-relay","name":"The flowered rune relay","kind":"search-scenery","x":26.833333333333332,"y":38.25},{"number":8,"id":"archive-discovery-door","name":"The forgotten archive doorway","kind":"battle","x":69.5,"y":38.25},{"number":9,"id":"merchant","name":"Wayfarer camp","kind":"merchant","x":24,"y":37},{"number":10,"id":"roam-cache-2-0","name":"Abandoned trail satchel","kind":"roam-cache","x":64.83333333333333,"y":53.25},{"number":11,"id":"roam-cache-2-1","name":"Hunter’s hidden cache","kind":"roam-cache","x":16.833333333333332,"y":47.25},{"number":12,"id":"roam-cache-2-2","name":"Warden’s relic chest","kind":"roam-cache","x":35.5,"y":75.25}]},"region-3":{"asset":"assets/integrated-region-3.webp?v=da4ae84c80","features":[{"number":1,"id":"cache4","name":"Castaway supplies","kind":"treasure","x":52.166666666666664,"y":76.25},{"number":2,"id":"loot-coast-lore","name":"Navigator’s hidden chart","kind":"loot","x":64.16666666666667,"y":72.25},{"number":3,"id":"loot-coast-cache","name":"Tide-sealed treasure","kind":"loot","x":72.16666666666667,"y":60.25},{"number":4,"id":"lantern-grotto-entrance","name":"Lantern Haven","kind":"dungeon","x":35,"y":78},{"number":5,"id":"tideglass-discovery-boat","name":"The driftwood rowboat","kind":"search-scenery","x":82.83333333333333,"y":62.25},{"number":6,"id":"tideglass-discovery-shelter","name":"The sailcloth shelter","kind":"search-scenery","x":80.16666666666667,"y":82.25},{"number":7,"id":"tideglass-discovery-shrine","name":"The tide-washed shrine","kind":"search-scenery","x":85.5,"y":18.25},{"number":8,"id":"tideglass-discovery-cave","name":"The chartkeeper’s sea cave","kind":"battle","x":72.16666666666667,"y":8.25},{"number":9,"id":"merchant","name":"Wayfarer camp","kind":"merchant","x":45,"y":13},{"number":10,"id":"roam-cache-3-0","name":"Abandoned trail satchel","kind":"roam-cache","x":96.83333333333333,"y":75.25},{"number":11,"id":"roam-cache-3-1","name":"Hunter’s hidden cache","kind":"roam-cache","x":44.833333333333336,"y":13.25},{"number":12,"id":"roam-cache-3-2","name":"Warden’s relic chest","kind":"roam-cache","x":71.5,"y":19.25}]},"region-4":{"asset":"assets/integrated-region-4.webp?v=08711ac1f5","features":[{"number":1,"id":"cache5","name":"Caravan repair camp","kind":"treasure","x":6.833333333333333,"y":44.25},{"number":2,"id":"sunforge-discovery-cart","name":"The overgrown forge caravan","kind":"search-scenery","x":18.833333333333332,"y":48.25},{"number":3,"id":"sunforge-discovery-smith","name":"The roadside smith’s shelter","kind":"search-scenery","x":80.16666666666667,"y":82.25},{"number":4,"id":"sunforge-discovery-shrine","name":"The amber-grass sun shrine","kind":"search-scenery","x":46.833333333333336,"y":26.25},{"number":5,"id":"sunforge-discovery-furnace","name":"The abandoned furnace","kind":"battle","x":81.83333333333333,"y":21.75},{"number":6,"id":"merchant","name":"Wayfarer camp","kind":"merchant","x":79,"y":85},{"number":7,"id":"roam-cache-4-0","name":"Abandoned trail satchel","kind":"roam-cache","x":32.833333333333336,"y":37.25},{"number":8,"id":"roam-cache-4-1","name":"Hunter’s hidden cache","kind":"roam-cache","x":90.16666666666667,"y":85.25},{"number":9,"id":"roam-cache-4-2","name":"Warden’s relic chest","kind":"roam-cache","x":18.166666666666668,"y":33.25}]},"rootbound":{"asset":"assets/integrated-rootbound.webp?v=1990b1c2a2","features":[{"number":1,"id":"crypt-risk-cache","name":"Sentinel’s strongbox","kind":"dungeon-cache","x":93.5,"y":42.25},{"number":2,"id":"crypt-secret","name":"Hidden root chamber","kind":"dungeon-cache","x":11,"y":66}]},"frostmine":{"asset":"assets/integrated-frostmine.webp?v=3b4ec065cf","features":[{"number":1,"id":"frostmine-secret","name":"Surveyor’s hidden chamber","kind":"dungeon-cache","x":9,"y":44},{"number":2,"id":"frostmine-cache","name":"Foreman’s strongbox","kind":"dungeon-cache","x":66.83333333333333,"y":40.25}]},"amber-hollow":{"asset":"assets/integrated-amber-hollow.webp?v=8d913a951e","features":[{"number":1,"id":"amber-hollow-cache","name":"Guarded supply cache","kind":"dungeon-cache","x":93.5,"y":24.25},{"number":2,"id":"amber-hollow-secret","name":"Hidden expedition chest","kind":"dungeon-cache","x":32,"y":12}]},"clockwork-garden":{"asset":"assets/integrated-clockwork-garden.webp?v=e3b722ecb0","features":[{"number":1,"id":"clockwork-garden-cache","name":"Guarded supply cache","kind":"dungeon-cache","x":81.5,"y":48.25},{"number":2,"id":"clockwork-garden-secret","name":"Hidden expedition chest","kind":"dungeon-cache","x":90,"y":26}]},"lantern-grotto":{"asset":"assets/integrated-lantern-grotto.webp?v=73f9734c6b","features":[{"number":1,"id":"lantern-grotto-cache","name":"Guarded supply cache","kind":"dungeon-cache","x":58.833333333333336,"y":20.25},{"number":2,"id":"lantern-grotto-secret","name":"Hidden expedition chest","kind":"dungeon-cache","x":26,"y":15}]}};
window.IntegratedMapArt={maps,current(){return maps[OpenPaintedMaps.key()];}};
const scene=OpenPaintedMaps.sceneAsset;OpenPaintedMaps.sceneAsset=function(){return IntegratedMapArt.current()?.asset||scene.call(this);};
const ready=OpenPaintedMaps.ready;OpenPaintedMaps.ready=function(){if(!IntegratedMapArt.current())return ready.call(this);this.build();const im=ForestRenderer.image(this.sceneAsset());if(!im._openTracked){im._openTracked=true;im.addEventListener?.('error',()=>{im._openFailed=true;});}this.failed=!!im._openFailed;return !!(im.complete&&im.naturalWidth);};
const paint=OpenPaintedMaps.paint;OpenPaintedMaps.paint=function(c,w,h){if(!IntegratedMapArt.current())return paint.call(this,c,w,h);this.build();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.fillStyle='#10201b';c.fillRect(0,0,w,h);const im=ForestRenderer.image(this.sceneAsset());if(im.complete&&im.naturalWidth)c.drawImage(im,0,0,w,h);};
const landmark=ForestArt.landmark;ForestArt.landmark=function(c,n,at,done,time=0){const map=IntegratedMapArt.current();if(map&&n.kind==='dungeon-exit')return;if(!map?.features.some(f=>f.id===n.id))return landmark.call(this,c,n,at,done,time);};
// Searchable small finds blend into the original vegetation until approached.
const originals={"region-0":"assets/geography-forest.webp?v=1b2725db6d","region-1":"assets/geography-mountain-user-bridges.webp?v=ee1ce382c5","region-2":"assets/asterfall-coherent-city.webp?v=20261024-1","region-3":"assets/geography-coast-user-bridges.webp?v=a6746cb452","region-4":"assets/geography-highlands-upper-bridges.webp?v=adbfac1ef9","rootbound":"assets/side-geography-rootbound-user-bridges.webp?v=d5aedd500c","frostmine":"assets/side-geography-frostmine-user-bridges.webp?v=efad1a78ec","amber-hollow":"assets/amber-hollow-user-bridges.webp?v=b9165c136d","clockwork-garden":"assets/clockwork-coherent-conservatory.webp?v=20261024-1","lantern-grotto":"assets/side-geography-lantern-grotto.webp?v=e3bbdb8085"},patches=new Map(),distance=(a,b)=>Math.hypot((a.x-b.x)*1.5,a.y-b.y);
Object.assign(IntegratedMapArt,{
 concealed(map){return map.features.filter(f=>(['loot','treasure','dungeon-cache','roam-cache'].includes(f.kind)||f.id==='ranger-hollow')&&!map.features.some(p=>['merchant','dungeon'].includes(p.kind)&&distance(p,f)<4));},
 opacity(p,n,visible=true){if(!visible)return 0;return Math.max(0,Math.min(1,(6-distance(p,n))/2));},
 patch(f,reveal){const id=OpenPaintedMaps.key(),key=id+':'+f.id+':'+reveal;if(patches.has(key))return patches.get(key);const im=ForestRenderer.image(reveal?this.maps[id].asset:originals[id]);if(!im.complete||!im.naturalWidth)return null;const canvas=document.createElement('canvas');canvas.width=280;canvas.height=240;const c=canvas.getContext('2d');c.drawImage(im,f.x*15.36-140,f.y*10.24-160,280,240,0,0,280,240);c.globalCompositeOperation='destination-in';const mask=c.createRadialGradient(140,120,110,140,120,140);mask.addColorStop(0,'#fff');mask.addColorStop(1,'#fff0');c.fillStyle=mask;c.fillRect(0,0,280,240);if(!reveal){c.globalCompositeOperation='destination-out';c.fillStyle='#fff';for(const site of this.maps[id].features.filter(p=>['merchant','dungeon'].includes(p.kind))){const x=(site.x-f.x)*15.36+140,y=(site.y-f.y)*10.24+110,keep=c.createRadialGradient(x,y,75,x,y,125);keep.addColorStop(0,'#fff');keep.addColorStop(1,'#fff0');c.fillStyle=keep;c.fillRect(x-125,y-125,250,250);}}patches.set(key,canvas);return canvas;},
 reveal(c,list,toScreen,p){const map=this.current();if(!map)return;for(const f of this.concealed(map)){const n=FOREST_NODES.find(n=>n.id===f.id),alpha=this.opacity(p,f,!!n&&DungeonRules.visible(n));if(!alpha)continue;const patch=this.patch(f,true);if(!patch)continue;const a=toScreen(f.x-140/15.36,f.y-160/10.24),b=toScreen(f.x+140/15.36,f.y+80/10.24);list.push({y:-Infinity,draw:()=>{c.save();c.globalAlpha=alpha;c.drawImage(patch,a.x,a.y,b.x-a.x,b.y-a.y);c.restore();}});}}
});
const integratedReady=OpenPaintedMaps.ready;OpenPaintedMaps.ready=function(){const ready=integratedReady.call(this),file=originals[this.key()];if(!file)return ready;const im=ForestRenderer.image(file);if(!im._quietTracked){im._quietTracked=true;im.addEventListener?.('error',()=>im._openFailed=true);}this.failed=this.failed||!!im._openFailed;return ready&&im.complete&&im.naturalWidth>0;};
const integratedPaint=OpenPaintedMaps.paint;OpenPaintedMaps.paint=function(c,w,h){integratedPaint.call(this,c,w,h);const map=IntegratedMapArt.current();if(!map)return;for(const f of IntegratedMapArt.concealed(map)){const patch=IntegratedMapArt.patch(f,false);if(patch)c.drawImage(patch,(f.x*15.36-140)*w/1536,(f.y*10.24-160)*h/1024,280*w/1536,240*h/1024);}};
const sceneObjects=OpenPaintedMaps.scene;OpenPaintedMaps.scene=function(c,list,toScreen,p){sceneObjects.call(this,c,list,toScreen,p);IntegratedMapArt.reveal(c,list,toScreen,p);};
ExplorationPolish.marker=function(){};
// All entrances share one explicit choice; declining does not mutate progress.
const interact=DungeonRules.interact;DungeonRules.interact=function(state,node,ui){if(node.kind!=='dungeon')return interact.call(this,state,node,ui);if(!this.allowed(state.campaign,node))return;MouseNavigation.clear();MineExpansion.modal(node.name,'Travel to '+node.name+'? '+(window.StoryConnections?.[node.id]?.outward||'Your discoveries here will stay saved.'),[{label:'Travel there',act:()=>{interact.call(this,state,node,{...ui,world(){}});ui.save();return true;}}],state,ui);};

})();
// These five saved side areas are story destinations. Internal IDs remain stable for old saves.
(()=>{'use strict';
const destinations={
 rootbound:{name:'Rootbound Sanctuary',region:'Forest Path',story:'An ancient forest settlement survives among roots, waterfalls and ruined terraces. Recover the forgotten keepers’ names and renew their oath at the Three Lights sanctuary.',route:'Explore the western archive and root garden, or challenge the eastern sentinel for its supplies. Restore the Three Lights to reach the keeper’s sanctuary.'},
 frostmine:{name:'Lost Expedition Works',region:'Frostpeak Pass',story:'Beyond Frostpeak, a stranded expedition shelters among crystal terraces and abandoned workshops. Bring its people home and discover what still powers the old works.',route:'Follow the quarry benches and stairs. Rescue the miners on the lower western shelf, inspect the upper forge and unlock the southeastern prism vault.'},
 'amber-hollow':{name:'Amber Hollow',region:'Forest Path',story:'A secluded woodland community once tended these apiaries and gardens. Restore its waterworks and discover why the Amberwood Keeper still guards the abandoned terraces.',route:'The lower western bridge reaches the ranger’s shelter. The eastern connector leads to the apiary sluice. Restoring it opens the northwestern altar.'},
 'clockwork-garden':{name:'Clockwork Conservatory',region:'the archive region',story:'An abandoned botanical estate holds a living record of the old city. Restart its garden machinery and face the Glasswarden to recover the conservators’ legacy.',route:'Search the garden terraces, find the repair station and restore the dormant engine. Its mechanism opens the guardian’s enclosure.'},
 'lantern-grotto':{name:'Lantern Haven',region:'Tideglass Coast',story:'A sheltered tidal refuge once guided travelers along the coast. Help its stranded quartermaster and restore the tide clock to uncover the haven’s lost stores.',route:'Explore the waterfront walkways and sheltered terraces. Find the quartermaster, restore the tide clock and challenge the Tidewarden beyond its gate.'}
};
window.StoryDestinations=destinations;
for(const [id,d]of Object.entries(destinations)){
 const entrance=id==='rootbound'?'crypt-entrance':id+'-entrance';
 const node=FOREST_NODES.find(n=>n.id===entrance);if(node){node.name=d.name;node.description=d.story;}
 const geography=SideGeography.get(id);if(geography){geography.name=d.name;geography.description=d.story+' '+d.route;}
 const exit=FOREST_NODES.find(n=>n.id===(id==='rootbound'?'crypt-exit':id+'-exit'));if(exit)exit.name='Return to '+d.region;
 const spec=window.SideAdventures.specs.find(s=>s.id===id);if(spec)spec.name=d.name;
 for(const quest of QuestBoard.quests)if(quest.id===id+'-contract') {quest.name='Explore '+d.name;quest.story=d.story;}
}
const interact=DungeonRules.interact;
DungeonRules.interact=function(s,n,ui){const entering=n.kind==='dungeon',id=entering?(n.id==='crypt-entrance'?'rootbound':n.id.replace(/-entrance$/,'')):s.campaign.dungeon?.id,d=destinations[id];if(!d)return interact.call(this,s,n,ui);return interact.call(this,s,n,{...ui,notice:(title,text)=>ui.notice(entering?d.name:title,entering?d.story+' '+d.route:n.kind==='dungeon-exit'?'The party returns to '+d.region+'. Your discoveries, collected equipment and completed encounters remain saved.':text)});};
const decorate=DungeonRules.decorate;
DungeonRules.decorate=function(c){decorate.call(this,c);const d=destinations[c.dungeon?.id];if(!d)return;document.getElementById('world-title').textContent=d.name+' · story destination';const geography=SideGeography.get(c.dungeon.id);document.getElementById('explore-tip').textContent='Return trail: '+geography.exitDirection+'. Arrows / WASD or click to explore · E searches nearby objects.';};
})();
// Main-story milestones use existing completion flags, so earlier victories retain credit.
(()=>{'use strict';
const stops=[
 {id:'rootbound',chapter:0,goals:['crypt-runes','crypt-guardian'],task:'Awaken the Three Lights and earn the Keeper’s oath'},
 {id:'amber-hollow',chapter:0,goals:['amber-hollow-puzzle','amber-hollow-boss'],task:'Restore the apiary sluice and face the Amberwood Keeper'},
 {id:'frostmine',chapter:1,goals:['frostmine-lock','frostmine-overseer','frostmine-escort-home'],task:'Restore the prism works, defeat the Colossus and escort the expedition home'},
 {id:'clockwork-garden',chapter:2,goals:['clockwork-garden-puzzle','clockwork-garden-boss'],task:'Restart the engine and defeat the Glasswarden'},
 {id:'lantern-grotto',chapter:3,goals:['lantern-grotto-puzzle','lantern-grotto-boss'],task:'Restore the tide clock and defeat the Tidewarden'}
];
window.RequiredStory={stops,missing(c,through=4){return stops.filter(s=>s.chapter<=through&&!s.goals.every(id=>c.completed.includes(id)));},canVisit(c,chapter){return this.missing(c,chapter-1).length===0;},bossReady(c,chapter){return this.missing(c,chapter).length===0;},complete(c){return this.missing(c).length===0;}};
for(const stop of stops){const d=StoryDestinations[stop.id];d.task=stop.task;for(const id of stop.goals){const n=FOREST_NODES.find(n=>n.id===id);if(n?.kind==='battle')n.optional=false;const story=FOREST_STORY.areas[id];if(story)story.danger=story.danger.replaceAll('Optional expedition.','Story encounter.');}const quest=QuestBoard.quests.find(q=>q.id===stop.id+'-contract');if(quest){quest.name=d.name+' · main story';quest.story=d.story+' Required: '+stop.task+'. Other treasure is optional.';}}
const decorate=DungeonRules.decorate;DungeonRules.decorate=function(c){decorate.call(this,c);const missing=RequiredStory.missing(c,c.viewChapter);if(c.dungeon){const d=StoryDestinations[c.dungeon.id];if(d){document.getElementById('world-title').textContent=d.name+' · main story';const stop=stops.find(s=>s.id===c.dungeon.id);document.getElementById('world-objective').textContent=stop.goals.every(id=>c.completed.includes(id))?'Story milestone complete. Return to the region or search for optional treasure.':'Required: '+stop.task+'.';}return;}const objective=document.getElementById('world-objective');if(missing.length)objective.textContent='Main story: '+missing.map(s=>StoryDestinations[s.id].name+' — '+s.task).join(' · ')+'. Complete these before the regional finale.';else if(c.completed.includes('m'+(c.viewChapter*4+3))&&c.viewChapter<4)objective.textContent='Region and story destinations complete. Choose the next chapter above to continue.';for(const option of document.getElementById('chapter-picker').children)if(!RequiredStory.canVisit(c,Number(option.value)))option.disabled=true;};
})();
// Each destination is reached along a named surface route, with a matching return connection.
(()=>{'use strict';
const routes={
 'crypt-entrance':{id:'rootbound',chapter:0,landmark:'ruined sanctuary gateway',path:'the old keeper’s trail',outward:'Beyond the open stone gateway, the keeper’s trail leaves the river valley and winds among ancient roots to Rootbound Sanctuary.',arrival:'The party follows the keeper’s trail to the sanctuary’s southern terraces.',return:'Follow the keeper’s trail back to the open stone gateway in Forest Path.'},
 'amber-hollow-entrance':{id:'amber-hollow',chapter:0,landmark:'flowering apiary gateway',path:'the amber apiary trail',outward:'The flowering timber gateway marks the amber apiary trail. Follow it beyond the old forest walls to the gardens and bridges of Amber Hollow.',arrival:'The apiary trail brings the party to Amber Hollow’s southeastern garden terraces.',return:'Follow the apiary trail back to the flowering timber gateway in Forest Path.'},
 'frostmine-entrance':{id:'frostmine',chapter:1,landmark:'expedition checkpoint',path:'the crystal survey route',outward:'The timber checkpoint marks the crystal survey route. It continues across Frostpeak’s high ledges to the Lost Expedition Works and its stranded crew.',arrival:'The party follows the survey route to the northwestern approach of the Lost Expedition Works.',return:'Follow the survey route back to the timber checkpoint in Frostpeak Pass.'},
 'clockwork-garden-entrance':{id:'clockwork-garden',chapter:2,landmark:'open conservatory garden gate',path:'the conservators’ garden walk',outward:'The open brass-and-stone gate leads along the conservators’ garden walk to the terraces, glasshouses and machinery of Clockwork Conservatory.',arrival:'The garden walk reaches the conservatory’s southwestern terraces.',return:'Follow the garden walk back to the brass-and-stone gate in the archive ruins.'},
 'lantern-grotto-entrance':{id:'lantern-grotto',chapter:3,landmark:'lantern-marked coastal gateway',path:'the sheltered shore trail',outward:'The lantern-marked gateway opens onto a sheltered shore trail. Follow the water’s edge on foot to the tidal walkways and stores of Lantern Haven.',arrival:'The shore trail brings the party to Lantern Haven’s southeastern landing.',return:'Follow the shore trail back to the lantern gateway on Tideglass Coast.'}
};
window.StoryConnections=routes;
for(const r of Object.values(routes)){const d=StoryDestinations[r.id];d.region=JOURNEY_CHAPTERS[r.chapter].name;const exit=FOREST_NODES.find(n=>n.id===(r.id==='rootbound'?'crypt-exit':r.id+'-exit'));if(exit){exit.name='Return to '+d.region;exit.description=r.return;}const geography=SideGeography.get(r.id);geography.description=r.arrival+' '+d.story+' '+d.route;}
for(const [id,r]of Object.entries(routes)){const n=FOREST_NODES.find(n=>n.id===id);n.description=r.outward+' Main story: '+StoryDestinations[r.id].task+'.';}
for(let chapter=0;chapter<4;chapter++)IntegratedMapArt.maps['region-'+chapter].asset='assets/connected-region-'+chapter+'.webp';
const interact=DungeonRules.interact;
DungeonRules.interact=function(s,n,ui){const r=routes[n.id]||Object.values(routes).find(r=>r.id===s.campaign.dungeon?.id);if(!r)return interact.call(this,s,n,ui);const entering=n.kind==='dungeon',leaving=n.kind==='dungeon-exit',d=StoryDestinations[r.id];return interact.call(this,s,n,{...ui,notice:(title,text)=>ui.notice(entering?d.name:leaving?JOURNEY_CHAPTERS[r.chapter].name:title,entering?r.arrival+' '+d.story+' '+d.route:leaving?r.return+' Your discoveries, equipment and completed encounters remain saved.':text)});};
const decorate=DungeonRules.decorate;
DungeonRules.decorate=function(c){decorate.call(this,c);if(c.dungeon){const r=Object.values(routes).find(r=>r.id===c.dungeon.id);if(r)document.getElementById('explore-tip').textContent=r.return+' Return connection: '+SideGeography.get(r.id).exitDirection+'.';}else{const missing=RequiredStory.missing(c,c.viewChapter);if(missing.length)document.getElementById('world-objective').textContent+=' Routes: '+missing.map(s=>{const r=Object.values(routes).find(r=>r.id===s.id);return StoryDestinations[s.id].name+' via the '+r.landmark;}).join(' · ')+'.';}};
const oath=QuestBoard.quests.find(q=>q.id==='root-oath');if(oath){oath.name='The keepers’ oath';oath.story='Follow the old keeper’s trail through the open stone gateway to Rootbound Sanctuary. Renewing the oath is part of the main story; this camp contract also rewards finding the hidden memorial cache.';}
})();

// Keep painted pedestrian openings consistent with approved movement and concealed finds.
(()=>{'use strict';
const regions={"rootbound":{"asset":"assets/traversal-rootbound.webp?v=4a28312726","cuts":[[390,300,355,115],[345,450,420,125],[300,700,345,215],[900,690,440,210]]},"frostmine":{"asset":"assets/traversal-frostmine.webp?v=e96656c92d","cuts":[[290,535,315,255],[870,755,385,160],[545,295,370,165],[980,175,240,155]]},"amber-hollow":{"asset":"assets/traversal-amber-hollow.webp?v=f766ff2c31","cuts":[[740,555,320,195],[305,645,205,145],[1050,315,265,210],[475,195,185,135],[1230,790,240,180]]},"clockwork-garden":{"asset":"assets/traversal-clockwork-garden.webp?v=ae6ca6dfc4","cuts":[[180,560,740,340],[915,155,300,165],[760,300,280,135],[1030,350,285,205]]},"lantern-grotto":{"asset":"assets/traversal-lantern-grotto.webp?v=31c4e97a00","cuts":[[475,285,225,160],[1060,395,270,210],[350,130,445,195],[1345,130,191,215],[665,55,160,155]]},"region-4":{"asset":"assets/traversal-region-4.webp?v=d62776ba7c","cuts":[[650,10,240,240],[1150,65,220,160],[1010,215,190,125]]},"region-1":{"asset":"assets/traversal-region-1.webp?v=2b29f50c0f","cuts":[[930,480,315,340],[260,775,200,140],[90,520,180,160],[1160,265,220,155]]},"region-3":{"asset":"assets/traversal-region-3.webp?v=36b8217280","cuts":[[825,120,405,125],[1010,240,220,180]]}},prepared=new WeakSet();
window.CrossingRepairs={regions};for(const [id,r]of Object.entries(regions))IntegratedMapArt.maps[id].asset=r.asset;
const patch=IntegratedMapArt.patch;IntegratedMapArt.patch=function(f,reveal){const canvas=patch.call(this,f,reveal),r=regions[OpenPaintedMaps.key()];if(!canvas||reveal||!r||prepared.has(canvas))return canvas;prepared.add(canvas);const x=f.x*15.36-140,y=f.y*10.24-160,cuts=r.cuts.filter(([a,b,w,h])=>a<x+280&&a+w>x&&b<y+240&&b+h>y);if(!cuts.length)return canvas;const mask=document.createElement('canvas');mask.width=280;mask.height=240;const m=mask.getContext('2d');m.fillStyle='#fff';for(const [a,b,w,h]of cuts)m.fillRect(a-x,b-y,w,h);
// Retain concealment directly over the find, but let repaired walkways show around it.
m.globalCompositeOperation='destination-out';m.beginPath();m.ellipse(140,125,55,80,0,0,Math.PI*2);m.fill();const c=canvas.getContext('2d');c.save();c.globalCompositeOperation='destination-out';c.drawImage(mask,0,0);c.restore();return canvas;};
})();

// Asterfall architecture follows the existing owner-authored walking ground.
// Keep finds separate from terrain so proximity patches cannot restore the old walls.
(()=>{'use strict';
const id='region-2',asset='assets/asterfall-coherent-city.webp?v=20261024-1';
IntegratedMapArt.maps[id].asset=asset;
const patch=IntegratedMapArt.patch;
IntegratedMapArt.patch=function(f,reveal){if(OpenPaintedMaps.key()===id)return null;return patch.call(this,f,reveal);};
const reveal=IntegratedMapArt.reveal;
IntegratedMapArt.reveal=function(c,list,toScreen,p){
 if(OpenPaintedMaps.key()!==id)return reveal.call(this,c,list,toScreen,p);
 const map=this.current(),campaign=DungeonRules.campaign;
 for(const f of this.concealed(map)){
  const n=FOREST_NODES.find(n=>n.id===f.id);
  const alpha=this.opacity(p,f,!!n&&DungeonRules.visible(n));
  if(!alpha)continue;
  const at=toScreen(f.x,f.y),done=!!campaign?.completed.includes(f.id);
  const image=ForestRenderer.image('assets/world-find-props.webp'),kind=ExplorationPolish.propKind(n);
  if(kind===null||!image.complete||!image.naturalWidth)continue;
  const rects=[[.025,.14,.44,.41],[.515,.15,.47,.40],[.015,.565,.47,.345],[.52,.60,.43,.30]],r=rects[kind],w=kind===1?54:kind===2?42:46,h=w*r[3]/r[2];
  list.push({y:at.y,draw:()=>{c.save();c.globalAlpha=alpha*(done?.5:1);c.drawImage(image,r[0]*image.naturalWidth,r[1]*image.naturalHeight,r[2]*image.naturalWidth,r[3]*image.naturalHeight,at.x-w/2,at.y-h,w,h);c.restore();}});
 }
};
// The previous map's foreground polygons describe walls removed by this repair.
const foliage=LayeredFoliage.scene;
LayeredFoliage.scene=function(...args){if(OpenPaintedMaps.key()!==id)return foliage.apply(this,args);};
})();



// Asterfall's destinations and progression gate use the surveyed new streets.
(()=>{'use strict';
const anchors=AuthoredFloors.data['region-2'].anchors,city=OutdoorGeography.get('region-2');
city.entry=anchors.entry.slice();city.camp=anchors.merchant.slice();city.battles=[8,9,10,11].map(i=>anchors['m'+i].slice());
city.a=anchors.c27.slice();city.b=anchors.c28.slice();city.pass={r:1.8,points:[city.a,city.b]};
city.sanctuary=[[74.7,14.9],[78.9,12.7],[82.7,13.5],[87,16.5],[86,18.9],[82.5,20.6],[78.6,18.9]];
ExplorationLayout.solids['region-2']=[];
for(const f of IntegratedMapArt.maps['region-2'].features){const at=anchors[f.id];if(at){f.x=at[0];f.y=at[1];}}
})();

// Patrols fit the new streets; their finds follow their actual searchable nodes.
(()=>{'use strict';
const clearance=RoamingWorld.clearance;
RoamingWorld.clearance=function(p,r=3){return clearance.call(this,p,OpenPaintedMaps.key()==='region-2'?Math.min(r,1.3):r);};
const reveal=IntegratedMapArt.reveal;
IntegratedMapArt.reveal=function(c,list,toScreen,p){if(OpenPaintedMaps.key()==='region-2')for(const f of this.maps['region-2'].features){const n=FOREST_NODES.find(n=>n.id===f.id);if(n?.roamCache){f.x=n.x;f.y=n.y;}}return reveal.call(this,c,list,toScreen,p);};
})();




// Clockwork Conservatory uses the replacement glasshouse floor.
// Keep finds separate from terrain so proximity patches cannot restore the old walls.
(()=>{'use strict';
const id='clockwork-garden',asset='assets/clockwork-coherent-conservatory.webp?v=20261024-1';
IntegratedMapArt.maps[id].asset=asset;
const patch=IntegratedMapArt.patch;
IntegratedMapArt.patch=function(f,reveal){if(OpenPaintedMaps.key()===id)return null;return patch.call(this,f,reveal);};
const reveal=IntegratedMapArt.reveal;
IntegratedMapArt.reveal=function(c,list,toScreen,p){
 if(OpenPaintedMaps.key()!==id)return reveal.call(this,c,list,toScreen,p);
 const map=this.current(),campaign=DungeonRules.campaign;
 for(const f of this.concealed(map)){
  const n=FOREST_NODES.find(n=>n.id===f.id);
  const alpha=this.opacity(p,f,!!n&&DungeonRules.visible(n));
  if(!alpha)continue;
  const at=toScreen(f.x,f.y),done=!!campaign?.completed.includes(f.id);
  const image=ForestRenderer.image('assets/world-find-props.webp'),kind=ExplorationPolish.propKind(n);
  if(kind===null||!image.complete||!image.naturalWidth)continue;
  const rects=[[.025,.14,.44,.41],[.515,.15,.47,.40],[.015,.565,.47,.345],[.52,.60,.43,.30]],r=rects[kind],w=kind===1?54:kind===2?42:46,h=w*r[3]/r[2];
  list.push({y:at.y,draw:()=>{c.save();c.globalAlpha=alpha*(done?.5:1);c.drawImage(image,r[0]*image.naturalWidth,r[1]*image.naturalHeight,r[2]*image.naturalWidth,r[3]*image.naturalHeight,at.x-w/2,at.y-h,w,h);c.restore();}});
 }
};
// The previous map's foreground polygons describe walls removed by this repair.
const foliage=LayeredFoliage.scene;
LayeredFoliage.scene=function(...args){if(OpenPaintedMaps.key()!==id)return foliage.apply(this,args);};
})();




// Match all existing story interactions and the sealed guardian approach to the new floor.
(()=>{'use strict';
const id='clockwork-garden',floor=AuthoredFloors.data[id],d=SideGeography.get(id),anchors=floor.anchors;
d.entry=anchors.entry.slice();d.anchors=Object.fromEntries(Object.entries(anchors).map(([key,p])=>[key,p.slice()]));
d.a=anchors['gate-a'].slice();d.b=anchors['gate-b'].slice();
d.pass={r:1.9,points:[d.a,d.b]};d.sanctuary=[[68.03385416666667,14.0625],[91.796875,14.0625],[92.44791666666667,23.4375],[80.078125,26.26953125],[76.82291666666667,35.15625],[71.61458333333334,33.30078125],[73.56770833333334,24.4140625],[67.70833333333334,21.09375]];d.obstacles=[];d.paths=[];d.clearings=[];
ExplorationLayout.solids[id]=[];
for(const f of IntegratedMapArt.maps[id].features){const at=anchors[f.id];if(at){f.x=at[0];f.y=at[1];}}
const destination=StoryDestinations[id];
destination.route='Explore the ground-floor paths around the lily pool. Visit the western repair workshop, restart the southeastern engine, then climb the northeastern stair to the Glasswarden’s court.';
const connection=StoryConnections['clockwork-garden-entrance'];
connection.arrival='The garden walk brings the party through the conservatory’s southwest glasshouse entrance.';
d.description=connection.arrival+' '+destination.story+' '+destination.route;
})();


// Destination routes are painted side branches; interaction is deliberate at each gateway.
(()=>{'use strict';
const regions=[{"id":"region-0","asset":"assets/routes-region-0.webp?v=20261024-1","cuts":[[350,395,230,220],[330,795,250,229],[590,90,240,285],[1340,535,196,210]],"branches":[{"id":"crypt-entrance","name":"Rootbound Sanctuary","join":[48,33],"points":[[47.833333333333336,32.75],[46,30],[44,26],[44,23.5]],"gate":[44,23.5]},{"id":"amber-hollow-entrance","name":"Amber Hollow","join":[93,60],"points":[[92.83333333333333,59.75],[95,61.5],[96.5,64]],"gate":[96.5,64]}]},{"id":"region-1","asset":"assets/routes-region-1.webp?v=20261024-1","cuts":[[960,345,220,205],[235,395,285,235]],"branches":[{"id":"frostmine-entrance","name":"Lost Expedition Works","join":[19,57],"points":[[18.833333333333332,56.75],[22,55],[26,53],[28.5,51.5]],"gate":[28.5,51.5]}]},{"id":"region-2","asset":"assets/routes-region-2.webp?v=20261024-1","cuts":[[900,770,255,254],[10,330,265,210]],"branches":[{"id":"clockwork-garden-entrance","name":"Clockwork Conservatory","join":[14,43],"points":[[13.833333333333334,42.75],[10,43],[7,44],[5,45]],"gate":[5,45]}]},{"id":"region-3","asset":"assets/routes-region-3.webp?v=20261024-1","cuts":[[440,665,220,205],[1330,350,206,220]],"branches":[{"id":"lantern-grotto-entrance","name":"Lantern Haven","join":[94,43],"points":[[94.16666666666667,43.25],[95.5,42.5],[97,42]],"gate":[97,42]}]}];
window.DestinationRoutes={regions,entrances:regions.flatMap(r=>r.branches)};
for(const r of regions){
 IntegratedMapArt.maps[r.id].asset=r.asset;
 const existing=CrossingRepairs.regions[r.id];
 CrossingRepairs.regions[r.id]={asset:r.asset,cuts:[...(existing?.cuts||[]),...r.cuts]};
 for(const branch of r.branches){
  const f=IntegratedMapArt.maps[r.id].features.find(f=>f.id===branch.id);
  if(f){f.x=branch.gate[0];f.y=branch.gate[1];}
  const route=StoryConnections[branch.id];
  if(route){route.outward='Follow the side trail to '+branch.name+'.';}
  const node=FOREST_NODES.find(n=>n.id===branch.id);
  if(node)node.description='Enter '+branch.name+'.';
 }
}
})();
/* Brief navigation copy keeps puzzle clues and choice consequences intact. */
(()=>{
 const modal=MineExpansion.modal;
 MineExpansion.modal=function(title,text,choices,s,ui){
  const isTravel=choices.some(c=>/^Travel there/.test(c.label));
  return modal.call(this,title,isTravel?'Enter '+title+'?':text,choices,s,ui);
 };
 const decorate=DungeonRules.decorate;
 DungeonRules.decorate=function(c){
  decorate.call(this,c);
  const tip=document.getElementById('explore-tip');
  const direction=SideGeography.get(c.dungeon?.id)?.exitDirection;if(tip)tip.textContent='WASD / arrows · E to interact'+(direction?' · Exit '+direction:'');
  if(!StoryPacing.brief())return;
  const tasks={
   rootbound:'Awaken the three-light altar. Face the Keeper.',
   frostmine:'Restart the works. Defeat the Colossus and escort the miners.',
   'amber-hollow':'Restore the sluice. Defeat the Amberwood Keeper.',
   'clockwork-garden':'Restart the engine. Defeat the Glasswarden.',
   'lantern-grotto':'Restore the tide clock. Defeat the Tidewarden.'
  };
  const objective=document.getElementById('world-objective');
  if(objective)objective.textContent=c.dungeon?(tasks[c.dungeon.id]||StoryPacing.summary(objective.textContent,22)):StoryPacing.summary(objective.textContent,22);
 };
})();

