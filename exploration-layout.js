// Exploration scale, solid scenery and close-range interaction share the painted-world geometry.
(()=>{'use strict';
const solids={
 'region-0':[[[31,54],[35,53],[37,56],[35,59],[31,58]]],
 'region-1':[[[43,31],[48,30],[50,32],[49,34],[46,34],[43,33]]],
 'region-2':[[[16,31],[19,31],[20,34],[19,36],[17,36],[16,34]]],
 'region-3':[[[55,77],[57,76],[59,78],[58,80],[56,79]]],
 'region-4':[[[34,36],[37,36],[38,39],[36,41],[33,40]],[[7,60],[13,59],[18,61],[19,65],[14,68],[8,67],[6,64]]],
 'rootbound':[[[41,84],[45,84],[45,89],[42,89]]],
 'frostmine':[[[67,10],[70,10],[71,13],[69,15],[67,14]]],
 'amber-hollow':[[[55,36],[60,37],[61,41],[58,43],[55,42]],[[87,17],[93,19],[94,23],[90,24],[87,23]]],
 'clockwork-garden':[],
 'lantern-grotto':[[[84,36],[89,37],[90,41],[88,44],[84,43]]]
};
window.ExplorationLayout={version:1,heroSize:50,enemySize:60,solids,
 active(){return !!(window.SideGeography?.get()||window.OutdoorGeography?.get());},
 distance(a,b){return Math.hypot((a.x-b.x)*1.5,a.y-b.y);},
 approach(c,p,n){if(!this.active())return ExploreRules.near(p,n,n.radius||(n.kind==='battle'?1.9:2.5));const radius=n.kind==='battle'?1.35:n.kind==='crypt-search'?1.5:1.1;if(this.distance(p,n)>radius)return false;const barriers=RegionGates.open(c.viewChapter,c.completed)?[]:[RegionGates.gate(c.viewChapter)];return ForestWorld.stepClear(p,n,barriers);}
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
const hollow=SideGeography.get('amber-hollow');hollow.anchors['amber-hollow-cache']=[92,27];hollow.paths[5].points[hollow.paths[5].points.length-1]=[92,27];
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
