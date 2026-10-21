// Approved physical geography. Walk surfaces follow the painted banks, terraces and stairs.
(()=>{'use strict';
const route=(r,...points)=>({r,points}),grove=(x,y,rx,ry)=>({x,y,rx,ry});
const data=[
{id:'forest',name:'River Valley',entry:[30,94],camp:[25,66],battles:[[14,81],[17,55],[76,39],[22,12]],
 paths:[route(2.6,[30,94],[26,91],[20,88],[15,85],[12,81],[17,75],[23,69],[28,65],[33,60],[39,57],[43,52],[46,47],[53,44],[59,45]),route(2.4,[23,69],[21,63],[17,59],[17,55],[22,53],[30,52],[37,48],[40,43],[39,38],[35,32],[28,31],[22,33],[17,35]),route(2,[28,31],[28,25]),route(2.8,[39,57],[40,63],[45,67],[54,70],[59,74],[63,76]),route(2.6,[40,43],[45,36],[48,32],[54,31]),route(1.3,[59,45],[72,41]),route(2.3,[72,41],[78,39],[80,34],[81,29],[80,24],[76,21],[73,19],[74,16],[80,13],[83,10]),route(2.3,[72,41],[78,43],[83,47],[89,50],[94,54],[94,60],[91,65],[87,69]),route(1.8,[83,10],[87,13],[91,15])],
 clearings:[grove(15,81,5,3.2),grove(25,66,4.5,4),grove(35,59,5.5,4),grove(54,71,6,4),grove(17,55,4.5,3.8),grove(30,52,4,3),grove(48,33,5,3.5),grove(53,43,4.5,3),grove(76,21,5,3.5),grove(88,51,4,3.5)],
 sanctuary:[[12,10],[17,7],[27,7],[31,10],[31,14],[26,16],[17,15],[12,13]],a:[28,25],b:[28,15],pass:route(1.6,[28,25],[28,19],[28,15]),
 scenery:[[12,74,3,4],[20,60,3,4],[31,55,3,3],[35,44,3.5,4],[45,28,3,3],[76,29,3,4],[89,46,3,4],[22,83,3,3]]},
{id:'mountain',name:'Ridge Ascent',entry:[53,93],camp:[43,83],battles:[[38,76],[63,51],[49,36],[55,8]],
 paths:[route(2.3,[53,93],[49,88],[43,84],[34,83],[31,79],[38,76],[41,70],[36,67],[37,64],[45,61],[52,57],[61,55],[65,52],[59,49],[53,46],[44,43],[37,40],[29,38],[26,34],[28,29],[36,27],[43,23],[47,20],[51,18]),route(1.7,[34,83],[16,88]),route(2.2,[16,88],[15,81],[12,73],[12,65],[18,60],[20,54],[20,48],[19,43],[16,42]),route(2,[26,34],[19,31],[12,25],[9,20],[9,16],[15,14],[19,17]),route(2.6,[44,43],[49,39],[52,36],[59,34],[65,33],[69,36],[71,39],[69,43],[65,47],[65,52]),route(2,[65,33],[71,29],[76,29],[80,32]),route(1.6,[80,32],[93,34]),route(2.2,[93,34],[96,35])],
 clearings:[grove(43,83,5,3.5),grove(38,76,4,3),grove(17,60,5,4),grove(61,53,5,3.5),grove(51,36,7,4.5),grove(31,30,5,3),grove(15,17,4,3.3)],
 sanctuary:[[49,5],[55,4],[61,6],[63,9],[59,11],[52,12],[48,10]],a:[51,18],b:[55,11],pass:route(1.7,[51,18],[52,14],[55,11]),
 scenery:[[46,80,3,3],[34,71,3,4],[16,54,3,4],[56,49,3,3],[44,32,3,4],[31,24,3,3],[15,12,3,3],[73,35,3,3]]},
{id:'city',name:'Terraced Ruins',entry:[58,95],camp:[20,34],battles:[[51,80],[25,13],[64,84],[81,20]],
 paths:[route(2.5,[58,95],[52,90],[45,86],[50,82],[51,78],[51,74],[48,71],[36,69],[28,66],[20,64],[19,60],[24,56],[21,51],[19,46],[18,42],[18,36]),route(2.5,[18,36],[25,36],[30,34],[33,30],[37,28],[45,28],[52,25]),route(1.9,[30,34],[30,29],[30,25],[28,21],[25,18],[25,13]),route(2.2,[28,66],[34,62],[38,58],[44,55],[55,56],[64,52],[67,46],[66,41],[69,37],[72,36]),route(2,[30,39],[35,43],[39,47],[44,53],[44,55]),route(2.3,[25,36],[30,39]),route(2,[39,47],[39,42],[44,39],[49,39],[56,39],[61,41],[66,41]),route(2.2,[49,84],[61,85],[69,82],[73,77],[78,74],[84,70],[85,65],[80,63],[74,60],[70,56],[64,52]),route(2.3,[52,25],[58,24],[61,28],[64,31],[69,32],[72,36])],
 clearings:[grove(51,87,5.5,3),grove(29,65,5.5,3.5),grove(20,34,8,4.8),grove(25,13,7,4),grove(50,26,6,3.5),grove(80,63,5,3.5),grove(58,55,4,2.5)],
 sanctuary:[[74,17],[79,15],[86,16],[88,21],[84,24],[77,24],[73,21]],a:[72,36],b:[78,24],pass:route(1.7,[72,36],[75,30],[78,24]),
 scenery:[[24,60,3,3],[31,53,3,4],[31,33,3,3],[16,31,3,3],[27,9,3,3],[48,21,3,4],[75,58,3,4],[61,50,3,3],[51,75,3,5]]},
{id:'coast',name:'Crescent Bay',entry:[17,9],camp:[45,13],battles:[[82,35],[89,54],[90,70],[13,70]],
 paths:[route(2.5,[17,9],[22,11],[30,12],[40,13],[49,14],[57,17],[65,17],[73,20],[81,24],[89,27],[94,30],[96,37],[94,43],[96,49],[92,55],[87,61],[84,66],[77,70],[68,75],[60,79],[51,81],[43,79],[35,78]),route(2,[94,30],[90,31],[87,32],[83,34],[80,35]),route(2.3,[87,61],[81,64],[76,67],[71,69],[67,72],[60,76],[60,79]),route(2.2,[84,66],[89,69],[93,72],[96,73]),route(2.1,[65,17],[66,13],[72,10],[77,7])],
 clearings:[grove(18,10,4,3),grove(45,13,6,3.5),grove(80,24,5,3.2),grove(82,35,4,2.5),grove(89,54,4,3.5),grove(59,79,6,4),grove(90,70,5,3)],
 sanctuary:[[9,68],[12,65],[16,66],[19,70],[18,74],[13,75],[9,72]],a:[35,78],b:[17,71],pass:route(1.3,[35,78],[27,76],[20,73],[17,71]),
 scenery:[[22,7,3,3],[42,10,3,3],[76,21,3,3],[88,36,3,4],[86,50,3,4],[79,65,3,4],[53,76,3,3],[90,66,3,3]]},
{id:'highlands',name:'Faulted Plateaus',entry:[88,92],camp:[79,84],battles:[[80,72],[83,16],[37,41],[20,10]],
 paths:[route(2.6,[88,92],[82,88],[75,85],[67,83],[63,80],[68,77],[77,73],[83,70],[84,65],[84,61],[88,59],[89,54],[85,51],[80,48],[80,44],[83,40],[86,35],[85,30],[79,28],[74,29]),route(1.6,[74,29],[67,30],[61,31]),route(2.5,[61,31],[55,29],[51,27],[49,24],[43,23],[36,23],[36,22]),route(2.6,[51,27],[47,31],[42,35],[38,40],[40,45],[43,49],[44,53],[35,52],[27,50],[23,47],[20,43],[19,39],[25,39],[32,40],[38,40]),route(2.3,[21,44],[17,48],[13,51],[11,55],[15,56]),route(2,[11,55],[7,58],[6,64],[6,69],[11,72],[16,74],[20,76]),route(2.3,[85,30],[86,24],[89,21],[89,17],[86,14],[81,14])],
 clearings:[grove(79,84,5.5,3.5),grove(80,72,5.5,4),grove(86,36,5,3.5),grove(49,25,6,3),grove(37,41,5.5,4),grove(27,49,6,3.5),grove(15,54,4,3.5),grove(83,16,5,3.5)],
 sanctuary:[[9,7],[14,4],[27,4],[30,8],[29,13],[24,16],[15,16],[8,12]],a:[36,22],b:[27,14],pass:route(1.7,[36,22],[32,18],[27,14]),
 scenery:[[79,80,3,4],[76,69,3,3],[82,43,3,4],[81,31,3,3],[43,20,3,3],[32,35,3,4],[22,47,3,3],[10,51,3,4],[85,14,3,4]]}
];
const point=p=>({x:p[0],y:p[1]}),distance=(p,a,b)=>{const x=(b[0]-a[0])*1.5,y=b[1]-a[1],t=Math.max(0,Math.min(1,((p.x-a[0])*1.5*x+(p.y-a[1])*y)/(x*x+y*y||1)));return Math.hypot((p.x-a[0])*1.5-x*t,p.y-a[1]-y*t);};
function ribbon(p,r){return r.points.some((b,i)=>i&&distance(p,r.points[i-1],b)<=r.r);}
window.OutdoorGeography={data,version:1,
 get(id=OpenPaintedMaps.key()){return /^region-[0-4]$/.test(id)?data[Number(id.slice(7))]:null;},
 terrain(id,p){const d=this.get(id);if(!d)return null;if(ribbon(p,d.pass))return 3;if(PaintedBoundaries.inside(p,d.sanctuary,.2))return 1;if(PaintedBoundaries.inside(p,d.sanctuary,-1.8))return 0;return d.paths.some(r=>ribbon(p,r))||d.clearings.some(g=>Math.pow((p.x-g.x)/g.rx,2)+Math.pow((p.y-g.y)/g.ry,2)<=1)?1:0;},
 zone(id,p){const d=this.get(id);if(!d)return null;return ribbon(p,d.pass)?'bridge':PaintedBoundaries.inside(p,d.sanctuary,.2)?'island':this.terrain(id,p)===1?'main':'blocked';},
 prepare(id,graph,nodes){const d=this.get(id);if(!d)return;const chapter=data.indexOf(d),anchors={entry:d.entry,merchant:d.camp,...Object.fromEntries(d.battles.map((p,i)=>['m'+(chapter*4+i),p]))};for(const [name,at]of Object.entries(anchors)){const g=graph.points.get(name);if(g)Object.assign(g,point(at));const n=nodes.find(n=>n.id===name);if(n)Object.assign(n,point(at));}JOURNEY_CHAPTERS[chapter].camp=d.camp.slice();JOURNEY_CHAPTERS[chapter].map=this.asset(id);},
 features(id){const d=this.get(id);return d?[...d.scenery.map(([x,y,rx,ry])=>({x,y,rx,ry,sceneryOnly:true})),...d.clearings.map(g=>({x:g.x,y:g.y-g.ry,rx:Math.max(2,g.rx*.6),ry:Math.max(2,g.ry*.7),sceneryOnly:true}))]:null;},
 asset(id){const d=this.get(id);return d?(d.asset||'assets/geography-'+d.id+'.webp'):null;}
};
const terrain=PaintedBoundaries.terrain,zone=PaintedBoundaries.zone,align=PaintedBoundaries.align;
PaintedBoundaries.terrain=function(id,p){return OutdoorGeography.terrain(id,p)??terrain.call(this,id,p);};
PaintedBoundaries.zone=function(id,p){return OutdoorGeography.zone(id,p)??zone.call(this,id,p);};
PaintedBoundaries.align=function(l){const d=OutdoorGeography.get(l.id);if(!d)return align.call(this,l);Object.assign(l.a,point(d.a));Object.assign(l.b,point(d.b));Object.assign(l.gate,{x:(d.a[0]+d.b[0])/2,y:(d.a[1]+d.b[1])/2});};
const gate=RegionGates.gate;RegionGates.gate=function(chapter){const g=gate.call(this,chapter);if(DungeonRules.campaign?.dungeon)return g;const d=data[chapter];return d?{...g,x:(d.a[0]+d.b[0])/2,y:(d.a[1]+d.b[1])/2}:g;};
// The new paintings contain their own scenery; do not cover them with the old random props.
const foreground={
 forest:[{foot:61,poly:[[34,43],[41,42],[48,46],[48,52],[44,57],[39,58],[34,55],[31,49]]}],
 city:[{foot:82,poly:[[45,67],[47,66],[49,70],[48,79],[45,80]]},{foot:83,poly:[[55,68],[58,70],[59,82],[56,83]]},{foot:82,poly:[[46,66],[55,68],[57,72],[48,71]]}],
 coast:[{foot:79,poly:[[53,73],[57,70],[61,72],[64,76],[61,79],[55,78]]}]
};
const foliage=LayeredFoliage.scene;LayeredFoliage.scene=function(c,list,toScreen,p,...rest){const d=OutdoorGeography.get();if(!d)return foliage.call(this,c,list,toScreen,p,...rest);const image=ForestRenderer.image(OutdoorGeography.asset(OpenPaintedMaps.key()));if(!image.complete||!image.naturalWidth)return;for(const o of foreground[d.id]||[]){const minX=Math.min(...o.poly.map(p=>p[0])),maxX=Math.max(...o.poly.map(p=>p[0])),minY=Math.min(...o.poly.map(p=>p[1])),maxY=Math.max(...o.poly.map(p=>p[1]));list.push({y:toScreen(0,o.foot).y,draw:()=>{const a=toScreen(minX,minY),b=toScreen(maxX,maxY);c.save();c.beginPath();o.poly.forEach(([x,y],i)=>{const at=toScreen(x,y);if(i)c.lineTo(at.x,at.y);else c.moveTo(at.x,at.y);});c.closePath();c.clip();if(PaintedBoundaries.inside(p,o.poly,-2))c.globalAlpha=.38;c.drawImage(image,minX/100*image.naturalWidth,minY/100*image.naturalHeight,(maxX-minX)/100*image.naturalWidth,(maxY-minY)/100*image.naturalHeight,a.x,a.y,b.x-a.x,b.y-a.y);c.restore();}});}};
// Painted locations already contain their architecture. Do not stack the old generic gates over it.
const landmark=ForestArt.landmark;ForestArt.landmark=function(c,n,at,done,time){if(OutdoorGeography.get()&&n.kind==='battle'&&!n.discovery)return;return landmark.call(this,c,n,at,done,time);};
})();

