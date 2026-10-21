// Search sites are grounded environmental vignettes with reachable walk-up positions.
(()=>{'use strict';const metric=(a,b)=>Math.hypot((a.x-b.x)*1.5,a.y-b.y);
window.SearchSites={context:null,sites:new Map(),origins:new Map(),
 kind(n){return ['loot','treasure','dungeon-cache','roam-cache'].includes(n.kind);},
 bind(c){if(c.dungeon||!OpenPaintedMaps.enabled()){this.context=null;this.sites.clear();return;}OpenPaintedMaps.build();const l=OpenPaintedMaps.layout,key=l.key;if(this.context===key&&this.campaign===c)return;this.context=key;this.campaign=c;this.sites.clear();const world=ForestWorld,reachable=OpenPaintedMaps.reachable(true),hosts=[...l.features,...l.props.filter(p=>!p.closedSecret)];const nodes=FOREST_NODES.filter(n=>n.chapter===c.viewChapter&&!n.dungeon&&this.kind(n));
 for(const [index,n]of nodes.entries()){
 const originKey=l.id+':'+n.id;if(!this.origins.has(originKey))this.origins.set(originKey,{x:n.x,y:n.y});const origin=this.origins.get(originKey),geography=!!window.OutdoorGeography?.get(l.id);let host=hosts.slice().sort((a,b)=>(metric(a,origin)+[...this.sites.values()].filter(s=>s.host===a).length*12)-(metric(b,origin)+[...this.sites.values()].filter(s=>s.host===b).length*12))[0];let best=null;
 for(let y=2;y<world.height-2;y+=world.height>=200?2:1)for(let x=2;x<world.width-2;x+=world.width>=300?2:1){if(!reachable[y*world.width+x])continue;const p=world.point(x,y);if(metric(p,l.gate)<13||metric(p,origin)>(geography?150:30)||[...this.sites.values()].some(s=>metric(p,s.point)<(geography?6.5:7)))continue;if(FOREST_NODES.some(other=>other.id!==n.id&&other.chapter===c.viewChapter&&!other.hidden&&!other.dungeon&&!other.global&&!this.kind(other)&&metric(p,other)<(geography?5.5:8)))continue;if(window.RoamingWorld?.actors.some(a=>metric(p,a.home)<4.5))continue;const behind={x:p.x,y:p.y-1.6};if(!world.walkable(behind))continue;const neighbors=[[-1,0],[1,0],[0,-1],[0,1]].every(([dx,dy])=>world.walkable({x:p.x+dx,y:p.y+dy}));if(!neighbors)continue;
 const choices=hosts.filter(h=>{const e=Math.hypot((p.x-h.x)/(h.rx||3),(p.y-h.y)/(h.ry||3));return p.y>=h.y&&e>=1.08&&e<=1.8;}),candidate=choices.sort((a,b)=>metric(a,p)-metric(b,p))[0];if(!candidate)continue;const edge=candidate?Math.sqrt(Math.pow((p.x-candidate.x)/(candidate.rx||3),2)+Math.pow((p.y-candidate.y)/(candidate.ry||3),2)):1.3;if(candidate&&(edge<1.08||edge>1.8||p.y<candidate.y))continue;const score=metric(p,origin)*.35+Math.abs(edge-1.3)*8;if(!best||score<best.score)best={...p,score,host:candidate};}
 if(best?.host)host=best.host;const point=best?{x:best.x,y:best.y}:origin;if(!world.walkable(point))continue;Object.assign(n,point);const graphPoint=l.graph.points.get(n.id);if(graphPoint)Object.assign(graphPoint,point);
 const chapter=c.viewChapter,base=chapter===0?0:chapter===1||chapter===4?2:chapter===2?4:6,cell=base+index%2;this.sites.set(n.id,{point,cell,anchored:!!best,host,anchor:{x:point.x,y:point.y-.7},name:n.name});
 }
 },
 draw(c,n,at,done){const site=this.sites.get(n.id);if(!site)return false;const highland=this.campaign?.viewChapter===4,image=ForestRenderer.image(highland?'assets/highlands-search.png?v=3147444ad4':'assets/search-scenery.png?v=b3ac302961');if(!image.complete||!image.naturalWidth)return true;const columns=highland?2:4,rows=highland?1:2,cell=highland?site.cell%2:site.cell,sw=image.naturalWidth/columns,sh=image.naturalHeight/rows,w=site.cell===0?88:78,h=w*sh/sw;c.save();if(done)c.globalAlpha=.78;c.drawImage(image,cell%columns*sw,Math.floor(cell/columns)*sh,sw,sh,at.x-w/2,at.y-h+7,w,h);c.restore();return true;}
};
const bind=RoamingWorld.bind;RoamingWorld.bind=function(c){bind.call(this,c);SearchSites.bind(c);};
// Place both visual scenery and its interaction point before map controls are built.
const dungeonBind=DungeonRules.bind;DungeonRules.bind=function(c){dungeonBind.call(this,c);RoamingWorld.bind(c);};
const visible=DungeonRules.visible;DungeonRules.visible=function(n){if(n.roamCache&&this.campaign&&!this.campaign.dungeon&&n.chapter===this.campaign.viewChapter&&this.campaign.completed.includes(n.id)&&SearchSites.sites.has(n.id))return true;return visible.call(this,n);};
const art=ForestArt.landmark;ForestArt.landmark=function(c,n,at,done,time){if(SearchSites.draw(c,n,at,done))return;return art.call(this,c,n,at,done,time);};
})();


