// Small world props use the same painted lighting and perspective as the map backgrounds.
(()=>{'use strict';
const metric=(a,b)=>Math.hypot((a.x-b.x)*1.5,a.y-b.y),file='assets/world-find-props.webp?v=40f25e142b';
window.ExplorationPolish={
 active(){return !!window.AuthoredFloors?.data[OpenPaintedMaps.key()];},
 propKind(n){return n.roamCache?0:['treasure','dungeon-cache'].includes(n.kind)?1:n.kind==='loot'?2:n.kind==='search-scenery'?n.discovery?0:3:null;},
 glint(c,at,time,done){if(done)return;c.save();c.globalAlpha=.4+.12*Math.sin(time*1.6);c.strokeStyle='#e7c98d';c.lineWidth=1;c.beginPath();c.ellipse(at.x,at.y-1,8,3,0,0,Math.PI*2);c.stroke();c.restore();},
 draw(c,n,at,done,time=0){const p=DungeonRules.campaign?.explorePosition;if(!p||metric(p,n)>12)return;const kind=this.propKind(n);if(kind!==null&&!done){const im=ForestRenderer.image(file);if(im.complete&&im.naturalWidth){const rects=[[.025,.14,.44,.41],[.515,.15,.47,.40],[.015,.565,.47,.345],[.52,.60,.43,.30]],r=rects[kind],w=kind===1?32:kind===2?23:27,h=w*r[3]/r[2];ForestRenderer.ellipse(c,at.x,at.y-1,w*.34,3,'#201b1938');c.save();c.globalAlpha=metric(p,n)>9?.72:1;c.drawImage(im,r[0]*im.naturalWidth,r[1]*im.naturalHeight,r[2]*im.naturalWidth,r[3]*im.naturalHeight,at.x-w/2,at.y-h,w,h);c.restore();}}if(metric(p,n)<5)this.glint(c,at,time,done);},
};
const landmark=ForestArt.landmark;ForestArt.landmark=function(c,n,at,done,time){if(!ExplorationPolish.active())return landmark.call(this,c,n,at,done,time);if(n.kind==='dungeon-exit'||n.id==='crypt-echo')return landmark.call(this,c,n,at,done,time);if(n.kind==='battle')return;return ExplorationPolish.draw(c,n,at,done,time);};
// The legacy vignette placer must not pull authored finds back into narrow scenery clusters.
const bindSites=SearchSites.bind;SearchSites.bind=function(c){if(c.dungeon||!ExplorationPolish.active())return bindSites.call(this,c);OpenPaintedMaps.build();this.context=OpenPaintedMaps.layout.key;this.campaign=c;this.sites.clear();for(const n of FOREST_NODES.filter(n=>n.chapter===c.viewChapter&&!n.dungeon&&this.kind(n)&&(!n.hidden||n.roamCache&&RoamingWorld.actors.some(a=>a.cache===n.id)))){if(!ForestWorld.walkable(n))throw Error('Authored find outside walking ground: '+n.id);this.sites.set(n.id,{point:{x:n.x,y:n.y},anchor:{x:n.x,y:n.y},anchored:true,name:n.name});}};
// Preload only the compact shared pickup sheet; large landmark cutouts are no longer drawn.
const ready=OpenPaintedMaps.ready;OpenPaintedMaps.ready=function(){if(ExplorationPolish.active())ForestRenderer.image(file);return ready.call(this);};
})();
