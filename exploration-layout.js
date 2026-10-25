// Exploration scale, solid scenery and close-range interaction share the painted-world geometry.
(()=>{'use strict';
const solids={
 'region-0':[[[31,54],[35,53],[37,56],[35,59],[31,58]]],
 'region-1':[[[43,31],[48,30],[50,32],[49,34],[46,34],[43,33]]],
 'region-2':[[[16,31],[19,31],[20,34],[19,36],[17,36],[16,34]]],
 'region-3':[[[55,77],[57,76],[59,78],[58,80],[56,79]]],
 'region-4':[[[40,37],[43,37],[44,40],[42,42],[40,41]],[[7,60],[13,59],[18,61],[19,65],[14,68],[8,67],[6,64]]],
 'rootbound':[[[41,84],[45,84],[45,89],[42,89]]],
 'frostmine':[[[67,10],[70,10],[71,13],[69,15],[67,14]]],
 'amber-hollow':[],
 'clockwork-garden':[],
 'lantern-grotto':[[[84,36],[89,37],[90,41],[88,44],[84,43]]]
};
window.ExplorationLayout={version:1,heroSize:50,enemySize:60,solids,
 active(){return !!(window.SideGeography?.get()||window.OutdoorGeography?.get());},
 distance(a,b){return Math.hypot((a.x-b.x)*1.5,a.y-b.y);},
 approach(c,p,n){if(!this.active())return ExploreRules.near(p,n,n.radius||(n.kind==='battle'?1.9:2.5));const radius=n.kind==='battle'?2.8:n.kind==='crypt-search'?1.5:1.1;if(this.distance(p,n)>radius)return false;const barriers=RegionGates.open(c.viewChapter,c.completed)?[]:[RegionGates.gate(c.viewChapter)];return ForestWorld.stepClear(p,n,barriers);}
};
// Retain the distinctive paintings, but bring their movement scale closer to the old dungeons.
PartyTrail.spacing=2.45;ExploreRules.speed=9.4;
const size=WorldCamera.size;WorldCamera.size=function(chapter,width,height){if(!ExplorationLayout.active())return size.call(this,chapter,width,height);const w=Math.max(width,Math.min(3000,Math.max(2500,width*1.8)));return {width:w,height:w/1.5};};
const reset=MapWalkers.reset;MapWalkers.reset=function(...args){const result=reset.apply(this,args);for(const r of this.renderers){r.el.style.width=ExplorationLayout.heroSize+'px';r.el.style.height=ExplorationLayout.heroSize+'px';}return result;};
// Smaller navigation cells plus continuous footprint tests prevent a coarse cell extending over an edge.
const terrain=PaintedBoundaries.terrain;PaintedBoundaries.terrain=function(id,p){if(solids[id]?.some(poly=>this.inside(p,poly,-.12)))return 0;return terrain.call(this,id,p);};
for(const d of [...OutdoorGeography.data,...SideGeography.data]){for(const path of d.paths)path.r*=.94;for(const clearing of d.clearings){clearing.rx*=.97;clearing.ry*=.97;}}
// Follow the actual crypt crosswalk, rather than the empty space below it.
const crypt=SideGeography.get('rootbound');crypt.paths[3].points=[[50,48],[43,47],[35,46],[29,49],[28,50]];
// Amber Hollow uses explicit painted deck polygons, with its own authored destinations.
const clock=SideGeography.get('clockwork-garden');clock.b=[71,23];clock.pass.points=[[64,29],[65,25],[71,23]];
// The tide machine is solid. Its shore approach goes around the water-facing side.
const grotto=SideGeography.get('lantern-grotto'),shore=grotto.paths[0].points;shore.splice(shore.findIndex(p=>p[0]===85&&p[1]===44)+1,3,[82,41],[82,37],[84,33],[89,31],[91,28]);
OutdoorGeography.data[2].camp=[24,35];
// The southwestern highland pool and its cliff face are not a walking shortcut.
OutdoorGeography.data[4].paths[5]={r:1.25,points:[[11,55],[7,58],[4,60],[3,64],[3,67],[5,70],[10,72]]};
// Additional verge anchors distribute existing discoveries along the walking loops.
// These describe painted ground; they do not add another layer of blocking scenery.
const features=OutdoorGeography.features;OutdoorGeography.features=function(id){const list=features.call(this,id),d=this.get(id);if(!d)return list;return [...list,...d.paths.flatMap(path=>path.points.filter((p,i)=>i%4===2).map(([x,y])=>({x,y:y-1.6,rx:1.8,ry:1.2,sceneryOnly:true,verge:true})))];};
})();

// 2026-10 map survey: centers follow the visible decks, stair treads and terrace tops.
// These replace the old schematic shortcuts; do not widen across cliffs to reconnect them.
(()=>{'use strict';
const r=(r,...points)=>({r,points}),g=(x,y,rx,ry)=>({x,y,rx,ry});
const [forest,mountain,city,coast,highlands]=OutdoorGeography.data;
// Forest: include the actual western stair landings and broad eastern terrace.
forest.paths[1]=r(2.1,[23,69],[20,65],[18,61],[17,57],[18,55],[23,54],[30,53],[35,50],[39,46],[40,42],[39,38],[37,35],[33,33],[28,33],[23,34],[17,35]);
forest.paths[2]=r(1.6,[28,33],[28,29],[28,25]);
forest.paths[4]=r(2.1,[40,42],[44,38],[48,34],[53,33]);
forest.paths[6]=r(2.1,[72,41],[77,39],[79,35],[80,30],[79,26],[76,23],[74,21],[74,18],[78,15],[82,13]);
forest.clearings.push(g(85,50,5,2.5),g(89,58,3,4));
// Frostpeak: climb the exposed switchback road rather than its cliff-side verge.
mountain.paths=[
 r(2.1,[53,94],[49,90],[45,87],[41,85],[37,84],[33,83],[31,81],[34,79],[39,77],[41,75],[40,73],[37,71],[36,68],[38,65],[43,63],[49,61],[55,59],[61,57],[65,54],[66,52],[64,50],[59,48],[54,46],[48,44],[42,42],[36,40],[31,38],[28,36],[28,34],[32,32],[38,31],[43,29],[46,26],[48,23],[50,20],[51,18]),
 r(1.45,[33,83],[28,85],[22,87],[17,88]),
 r(1.8,[17,88],[16,84],[14,80],[12,76],[11,72],[11,68],[13,64],[17,61],[19,57],[19,53],[19,49],[18,46],[16,44]),
 r(1.8,[32,32],[26,30],[21,28],[17,25],[13,23],[10,21],[9,18],[12,17],[17,17]),
 r(2,[48,44],[50,41],[53,39],[58,37],[63,35],[67,34],[70,35],[71,38],[70,41],[68,45],[66,49],[66,52]),
 r(1.7,[67,34],[70,31],[74,30],[77,31],[80,33]),
 r(1.25,[80,33],[85,33.5],[90,34.5],[94,35]),
 r(1.8,[94,35],[97,36])];
mountain.camp=[42,84];mountain.battles=[[39,77],[65,52],[53,39],[55,8]];
mountain.clearings=[g(42,84,4,2.5),g(39,77,3,2),g(17,61,3,2.5),g(65,52,3,2),g(53,39,4,2.5),g(32,32,3,2),g(14,17,3,2)];
// Asterfall: the lower and eastern terraces return through the western stairs.
// The former diagonal southeast connection ran through an unsupported cliff face.
city.paths=[
 r(2.2,[61,96],[56,93],[51,90],[47,88],[43,85],[40,82],[36,79],[32,76],[27,74],[23,72],[20,69],[17,66],[17,63],[20,61],[23,60],[22,57],[20,54],[19,51],[18,48],[20,45],[21,42],[20,39],[22,37]),
 r(2,[22,37],[24,37],[28,38],[31,36],[33,33],[34,30],[39,29],[45,29],[51,28],[56,26]),
 r(1.8,[30,36],[30,31],[29,27],[28,23],[26,20],[25,17],[25,13]),
 r(1.8,[23,60],[28,62],[33,64],[37,63],[39,60],[40,57],[43,55],[49,56],[56,57],[62,55],[65,52],[67,48],[68,45],[69,42],[71,39],[73,36]),
 r(1.8,[28,38],[31,41],[34,44],[38,47],[41,49],[45,51],[49,53],[56,55]),
 r(1.6,[31,36],[34,37],[36,39],[40,40],[45,40],[51,40],[56,41],[61,42],[65,43],[69,42]),
 r(1.8,[47,88],[53,87],[60,86],[66,84],[69,82]),
 r(1.8,[65,52],[68,56],[73,60],[78,63],[82,65],[85,65]),
 r(1.9,[56,26],[60,27],[62,30],[66,32],[70,33],[73,36])];
city.entry=[61,96];city.camp=[24,37];city.battles=[[49,87],[25,13],[64,85],[81,20]];
city.clearings=[g(50,88,4,2.5),g(28,63,4,2),g(24,37,6,3),g(25,13,6,3),g(51,28,4,2),g(82,65,3,2),g(56,56,3,1.8)];
// Coast: follow the real eastern stair nose and keep the lower beach on dry sand.
coast.paths[0]=r(2.1,[17,10],[23,12],[30,13],[40,14],[49,15],[57,18],[65,18],[73,21],[81,24],[89,28],[94,31],[97,35],[96,40],[95,45],[95,49],[92,53],[88,57],[85,61],[81,65],[76,69],[70,73],[64,78],[60,81],[56,82],[51,81],[43,80],[35,78]);
coast.paths[2]=r(1.9,[85,61],[79,65],[74,68],[69,72],[64,78],[60,81]);
coast.clearings.push(g(48,80,6,2),g(68,74,4,2));
// Ashen Highlands: the entire eastern ascent was offset onto the lava-side cliff.
highlands.paths=[
 r(2.2,[92,94],[88,91],[84,88],[79,85],[74,83],[70,83],[65,84],[61,84]),
 r(2,[74,83],[78,80],[83,77],[89,74],[94,71],[97,68],[98,65],[95,63],[91,62],[88,60],[89,57],[92,54],[93,52],[92,49],[90,47],[90,44],[92,41],[95,39],[96,36],[94,34],[90,33],[86,31],[82,29],[77,29],[74,30]),
 r(1.35,[74,30],[69,30],[65,30],[61,30]),
 r(2.1,[61,30],[57,28],[52,26],[47,25],[42,25],[38,25],[36,25],[35,28],[33,31],[32,34],[34,37],[38,39],[40,42],[38,45],[34,48],[29,49],[24,49],[19,47],[15,45],[10,43],[5,41],[2,39]),
 r(1.7,[86,31],[87,28],[85,25],[82,23],[79,21],[79,19],[82,17],[86,17],[89,18]),
 r(1.8,[38,39],[37,42],[34,44],[30,46],[26,47],[22,46],[19,44],[18,42]),
 r(1.7,[19,47],[15,49],[11,50],[8,49]),
 r(1.15,[8,49],[8,52],[7,55],[5,58],[4,60],[4,63],[5,66],[6,68],[9,70],[12,72],[14,74],[13,76],[10,78],[7,80])];
highlands.asset='assets/geography-highlands-connected.webp?v=d660c442f0';highlands.entry=[92,94];highlands.camp=[79,85];highlands.battles=[[87,75],[84,17],[39,42],[20,10]];
highlands.clearings=[g(79,85,3.5,2),g(87,75,3,2),g(84,17,3.5,2),g(47,25,3,2),g(39,42,2.5,2),g(29,49,3,2),g(11,77,2,1.5)];
highlands.a=[36,25];highlands.pass=r(1.5,[36,25],[33,21],[30,18],[27,14]);
// Side maps: bridge centers must be on the tread, not on the back parapet.
const crypt=SideGeography.get('rootbound');crypt.pass.r=2.2;crypt.pass.points=[[22,23],[23,20],[24,17]];
crypt.paths[1]=r(2.1,[50,82],[43,83],[36,82],[30,81],[26,78],[23,75],[21,72],[20,68],[21,63],[24,58],[27,54],[28,51],[25,48],[21,46],[16,44],[12,44],[9,43]);
crypt.paths[3]=r(1.45,[50,49],[44,49],[38,49.5],[33,50],[28,51]);
crypt.paths[6]=r(1.8,[50,82],[58,83],[65,83],[72,82],[78,80],[81,76],[83,72],[86,68],[86,66]);
const mine=SideGeography.get('frostmine');mine.entry=[19,17];
mine.paths[0]=r(2,[7,11],[13,14],[19,17],[25,21],[32,25],[39,29],[44,33],[46,36],[50,39],[58,40],[65,39],[72,42],[80,46],[87,48],[91,47]);
mine.paths[2]=r(1.8,[31,48],[32,52],[33,55],[35,58],[40,61],[43,65],[44,69],[48,74],[54,79],[60,83],[65,86],[66,90],[70,96],[74,91]);
mine.paths[3]=r(1.9,[35,58],[30,61],[26,65],[24,70],[20,73],[16,74],[10,75]);
mine.paths[5]=r(1.7,[78,18],[71,17],[66,16],[60,14],[54,12],[48,11],[40,10],[34,9]);
mine.anchors['frostmine-rescue']=[16,74];mine.anchors['frostmine-lock']=[89,47];
mine.clearings=mine.clearings.filter(c=>c.x!==17&&c.x!==88);mine.clearings.push(g(16,74,6,2.5),g(88,47,4,2),g(89,18,3,1.5));
const clock=SideGeography.get('clockwork-garden');
clock.paths[0]=r(2,[10,91],[10,87],[13,83],[16,79],[18,75],[20,71],[19,67],[18,63],[17,59],[15,55],[14,52],[13,48],[13,45],[12,42],[10,39],[8,36],[7,33],[8,28],[9,24],[11,22],[15,21],[20,20]);
clock.paths[4]=r(1.8,[20,71],[26,73],[32,76],[38,79],[44,81],[49,81],[55,79],[60,76],[65,72],[71,69],[75,68],[79,70],[82,73],[84,76]);
clock.paths[2]=r(1.9,[13,45],[20,43],[26,41],[31,40],[33,38],[38,37],[42,37]);
clock.paths[3]=r(1.8,[42,37],[48,37],[54,38],[59,37],[63,35],[64,29]);
const grotto=SideGeography.get('lantern-grotto');
grotto.paths[2]=r(1.6,[91,28],[94,25],[96,22],[96,19],[92,17],[85,16],[77,15],[69,14],[61,13],[53,12],[45,11],[38,11],[34,10]);
grotto.paths[3]=r(1.7,[50,12],[49,16],[47,20],[52,22],[57,23],[63,24],[68,25]);
grotto.anchors['lantern-grotto-guard']=[57,23];grotto.anchors['lantern-grotto-cache']=[64,24];
})();



// Explicit object approaches replace the old unlimited nearest-floor relocation.
(()=>{
const r=(r,...points)=>({r,points});
const forest=OutdoorGeography.data[0];forest.paths[0].points.splice(8,3,[33,63],[39,61],[43,57],[43,52]);
const grotto=SideGeography.get('lantern-grotto');
grotto.paths[0]=r(2,[94,85],[90,88],[85,89],[82,87],[83,82],[84,77],[83,73],[78,69],[73,67],[63,68],[54,70],[46,73],[42,72],[46,68],[52,65],[59,62],[66,59],[74,57],[79,55],[81,53],[82,49],[83,46],[82,43],[82,39],[83,36],[86,34],[90,31],[93,28],[91,28]);
grotto.paths[1]=r(1.8,[83,46],[86,47],[91,47],[95,46]);
grotto.anchors['lantern-grotto-puzzle']=[92,47];grotto.anchors['lantern-grotto-cargo']=[48,71];
SideGeography.get('clockwork-garden').anchors['clockwork-garden-relays']=[68,70];
const placements=[
 {'cache':[54,71],shrine:[17,35],ruins:[74,41],'firefly-cache':[12,81],'ranger-cache':[90,65],'loot-shield':[48,34],'loot-bow':[60,75],'loot-moon':[24,33],'crypt-entrance':[30,53],'amber-hollow-entrance':[27,92],'search-hollow':[19,73],'search-bench':[58,72],'world-caravan':[63,76],'ranger-hollow':[22,68],'ranger-shelter':[33.5,52.25],'ranger-shrine':[40,61],'ranger-den':[28,27]},
 {'spring2':[13,23],mine:[70,41],'loot-frost-lore':[23,86],'loot-crystal-cache':[59,48],'frostmine-entrance':[69,44],'frostcrest-discovery-camp':[17,62],'frostcrest-discovery-winch':[58,58],'frostcrest-discovery-cairn':[30,37],'frostcrest-discovery-den':[74,30]},
 {'cache3':[43,85],spring3:[20,39],vault:[82,65],'loot-beacon-lore':[33,64],'archive-discovery-astrolabe':[73,60],'archive-discovery-relay':[34,44],'archive-discovery-door':[70,33]},
 {'cache4':[39,79],spring4:[20,11],reef:[83,34],'loot-coast-lore':[47,81],'loot-coast-cache':[62,78],'lantern-grotto-entrance':[35,78],'world-dock':[44,80],'tideglass-discovery-boat':[51,81],'tideglass-discovery-shelter':[77,69],'tideglass-discovery-shrine':[30,13],'tideglass-discovery-cave':[73,21]},
 {'cache5':[11,77],spring5:[27,49],'highlands-quarry':[34,44],'highlands-foundry':[89,74],'sunforge-discovery-cart':[22,47],'sunforge-discovery-smith':[80,79],'sunforge-discovery-shrine':[46,25],'sunforge-discovery-furnace':[82,23]}
];
const prepare=OutdoorGeography.prepare;OutdoorGeography.prepare=function(id,graph,nodes){prepare.call(this,id,graph,nodes);const d=this.get(id);if(!d)return;for(const [name,[x,y]]of Object.entries(placements[this.data.indexOf(d)])){const n=nodes.find(n=>n.id===name),p=graph.points.get(name);if(n)Object.assign(n,{x,y});if(p)Object.assign(p,{x,y});const service=WorldConsequences.byId.get(name);if(service)Object.assign(service,{x,y});for(const spec of SideAdventures.specs)if(name===spec.id+'-entrance')Object.assign(spec.surfaceEntry,{x,y});}};
})();

// Trace the final repaired Frostpeak painting, including both staircase switchbacks.
(()=>{const r=(r,...points)=>({r,points}),d=OutdoorGeography.data[1];
d.asset='assets/geography-mountain-connected.webp?v=c03525bb1f';
d.paths[2]=r(1.25,[17,88],[20,84],[20,82],[18,78],[17,75],[14,72],[11,70],[10,67],[10,64],[9,62],[8,60],[11,59],[13,57],[14,54],[17,51],[20,48],[20,46],[17,44]);
d.paths[3]=r(1.35,[17,44],[15,42],[15,39],[13,36],[11,34],[10,31],[9,29],[11,28],[14,27],[16,26],[16,24],[14,22],[13,20],[12,18],[10,16],[14,17]);
d.clearings=d.clearings.filter(c=>c.x!==17);d.clearings.push({x:10,y:64,rx:1.7,ry:1.6},{x:14,y:17,rx:2.5,ry:1.5});
const prepare=OutdoorGeography.prepare;OutdoorGeography.prepare=function(id,graph,nodes){prepare.call(this,id,graph,nodes);if(id!=='region-1')return;const changes={'spring2':[13,20],'frostcrest-discovery-camp':[14,72]};for(const [name,[x,y]]of Object.entries(changes)){const n=nodes.find(n=>n.id===name),p=graph.points.get(name);if(n)Object.assign(n,{x,y});if(p)Object.assign(p,{x,y});}};
OutdoorGeography.data[2].paths.push(r(1.9,[51,87],[51,83],[51,79],[51,75],[48,73],[42,72],[36,70],[30,68],[26,66],[23,63],[20,61]));
})();




