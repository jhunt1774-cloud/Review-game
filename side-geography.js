// Side quests retain their saved identities; only their physical spaces and presentation change.
(()=>{'use strict';
const point=p=>({x:p[0],y:p[1]}),metric=(a,b)=>Math.hypot((a.x-b.x)*1.5,a.y-b.y);
const distance=(p,a,b)=>{const x=(b[0]-a[0])*1.5,y=b[1]-a[1],t=Math.max(0,Math.min(1,((p.x-a[0])*1.5*x+(p.y-a[1])*y)/(x*x+y*y||1)));return Math.hypot((p.x-a[0])*1.5-x*t,p.y-a[1]-y*t);};
const ribbon=(p,r)=>r.points.some((b,i)=>i&&distance(p,r.points[i-1],b)<=r.r),ellipse=(p,g)=>((p.x-g.x)/g.rx)**2+((p.y-g.y)/g.ry)**2<=1;
window.SideGeography={data:SIDE_GEOGRAPHY_DATA,version:1,
 get(id=OpenPaintedMaps.key()){return this.data.find(d=>d.id===id)||null;},
 asset(id){return this.get(id)?'assets/side-geography-'+id+'.webp':null;},
 terrain(id,p){const d=this.get(id);if(!d)return null;if(d.obstacles?.some(poly=>PaintedBoundaries.inside(p,poly,-.2)))return 0;if(ribbon(p,d.pass))return 3;if(PaintedBoundaries.inside(p,d.sanctuary,.2))return 1;if(PaintedBoundaries.inside(p,d.sanctuary,-1.8))return 0;
 if(d.secret&&RootboundExplore.secret(DungeonRules.campaign)&&(ribbon(p,d.secret.path)||ellipse(p,d.secret.room)))return 1;
 return d.paths.some(r=>ribbon(p,r))||d.clearings.some(g=>ellipse(p,g))?1:0;},
 zone(id,p){const d=this.get(id);return !d?null:ribbon(p,d.pass)?'bridge':PaintedBoundaries.inside(p,d.sanctuary,.2)?'island':this.terrain(id,p)===1?'main':'blocked';},
 prepare(id,graph,nodes){const d=this.get(id);if(!d)return;const gate=RegionGates.gate(d.chapter),anchors={...d.anchors,entry:d.entry,[gate.a]:d.a,[gate.b]:d.b};for(const [name,at]of Object.entries(anchors)){const p=graph.points.get(name);if(p)Object.assign(p,point(at));const n=nodes.find(n=>n.id===name);if(n)Object.assign(n,point(at));}
 if(d.rooms)for(const [id,x,y,w,h]of d.rooms){const room=RootboundExplore.rooms.find(r=>r.id===id);if(room)Object.assign(room,{x,y,w,h});}
 },
 features(id){return this.get(id)?[]:null;},
 returnToTrail(c,back,id){DungeonRules.bind(c);ForestWorld.init();const l=OpenPaintedMaps.layout,n=FOREST_NODES.find(n=>n.id===(id==='rootbound'?'crypt-entrance':id+'-entrance')),origin=n||back.returnPosition||l.entry,closed=!RegionGates.open(c.viewChapter,c.completed),start=RegionGates.safePosition(c.viewChapter,origin,c.completed),destination=l.graph.points.get('merchant')||l.entry;
 const route=ForestWorld.route(start,destination,closed)||ForestWorld.route(start,l.entry,closed);let position=route?.find(p=>metric(p,origin)>=6);if(!position){const reachable=OpenPaintedMaps.reachable(closed);let best=null;for(let y=1;y<ForestWorld.height-1;y++)for(let x=1;x<ForestWorld.width-1;x++){if(!reachable[y*ForestWorld.width+x])continue;const p=ForestWorld.point(x,y),d=metric(p,origin);if(d>=6&&(!best||d<best.d))best={...p,d};}position=best||start;}
 c.explorePosition={x:position.x,y:position.y,chapter:c.viewChapter};c.location=n?.id||back.returnLocation||'entry';
 }
};
const terrain=PaintedBoundaries.terrain,zone=PaintedBoundaries.zone,align=PaintedBoundaries.align;
PaintedBoundaries.terrain=function(id,p){return SideGeography.terrain(id,p)??terrain.call(this,id,p);};
PaintedBoundaries.zone=function(id,p){return SideGeography.zone(id,p)??zone.call(this,id,p);};
PaintedBoundaries.align=function(l){const d=SideGeography.get(l.id);if(!d)return align.call(this,l);Object.assign(l.a,point(d.a));Object.assign(l.b,point(d.b));Object.assign(l.gate,{x:(d.a[0]+d.b[0])/2,y:(d.a[1]+d.b[1])/2});};
const gate=RegionGates.gate;RegionGates.gate=function(chapter){const g=gate.call(this,chapter),d=SideGeography.get(DungeonRules.campaign?.dungeon?.id);return d?{...g,x:(d.a[0]+d.b[0])/2,y:(d.a[1]+d.b[1])/2}:g;};
// Every entrance has its own arrival and exit direction. Depart along real surface ground.
const interact=DungeonRules.interact;DungeonRules.interact=function(s,n,ui){const entering=n.kind==='dungeon',leaving=n.kind==='dungeon-exit',id=entering?(n.id==='crypt-entrance'?'rootbound':n.id.replace(/-entrance$/,'')):s.campaign.dungeon?.id,d=SideGeography.get(id);if(!d||!entering&&!leaving)return interact.call(this,s,n,ui);const back=s.campaign.dungeon?{...s.campaign.dungeon}:null;
 const proxy={...ui,world:()=>{const c=s.campaign;if(entering&&c.dungeon?.id===id){c.location='entry';c.explorePosition={...point(d.entry),chapter:d.chapter};}else if(leaving&&!c.dungeon)SideGeography.returnToTrail(c,back,id);return ui.world();},notice:(title,text)=>ui.notice(title,entering?d.description:text)};
 return interact.call(this,s,n,proxy);
};
const decorate=DungeonRules.decorate;DungeonRules.decorate=function(c){decorate.call(this,c);const d=SideGeography.get(c.dungeon?.id);if(!d)return;const tip=document.getElementById('explore-tip');if(tip)tip.textContent='EXIT: '+d.exitDirection+' entrance, marked on the map. Arrows / WASD or click to walk · E searches nearby objects.';const objective=document.getElementById('world-objective');if(objective)objective.textContent=(objective.textContent||'').replaceAll('southern exit','marked entrance').replaceAll('return south','return to the marked entrance').replaceAll('northern vault','inner vault');};
// The paintings include their own furniture, roots and machinery. Do not duplicate old props.
const rootScene=RootboundExplore.scene;RootboundExplore.scene=function(...args){if(SideGeography.get('rootbound')&&this.active())return;return rootScene.apply(this,args);};
const variety=MapVariety.upgrade;MapVariety.upgrade=function(){if(SideGeography.get())return;return variety.call(this);};
const foliage=LayeredFoliage.scene;LayeredFoliage.scene=function(...args){if(SideGeography.get())return;return foliage.apply(this,args);};
const visible=DungeonRules.visible;DungeonRules.visible=function(n){const d=SideGeography.get();if(d?.id==='rootbound'&&n.dungeon==='rootbound'){if(n.kind==='dungeon-exit')return true;if(n.id==='crypt-echo-complete'||n.id==='crypt-secret'&&!RootboundExplore.secret(this.campaign)||n.id==='crypt-echo'&&this.campaign.cryptExploration?.echo==='released')return false;return visible.call(this,n)||metric(n,this.campaign.explorePosition||point(d.entry))<7;}return visible.call(this,n);};
const landmark=ForestArt.landmark;ForestArt.landmark=function(c,n,at,done,time){if(!SideGeography.get())return landmark.call(this,c,n,at,done,time);if(n.kind==='dungeon-exit'){c.save();c.font='bold 15px system-ui';c.textAlign='center';c.fillStyle='#112621ec';c.fillRect(at.x-65,at.y-48,130,29);c.strokeStyle='#d6b275';c.strokeRect(at.x-65,at.y-48,130,29);c.fillStyle='#ffe6ac';c.fillText('EXIT · Return',at.x,at.y-28);c.restore();return;}
 const p=DungeonRules.campaign?.explorePosition;if(done||!p||metric(p,n)>6||n.kind==='battle')return;
 if(n.id==='crypt-echo')return RootboundExplore.landmark(c,n,at,done);
 // A nearby glint locates the painted object without putting a second object on top of it.
 c.save();c.globalAlpha=.48+.18*Math.sin((time||0)*2);c.strokeStyle=n.kind==='puzzle'?'#8ee9e2':'#f4d68c';c.lineWidth=2;c.beginPath();c.ellipse(at.x,at.y-2,13,5,0,0,Math.PI*2);c.stroke();c.restore();
};
})();
