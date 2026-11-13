/* Opt-in built-map experiment. The normal game never enters this adapter. */
(()=>{'use strict';
if(new URLSearchParams(location.search).get('map')!=='wildwood')return;
ForestAdventure.slot='web-wizardry-wildwood-v1';
const W=ForestWorld,M=OpenPaintedMaps,metric=(a,b)=>Math.hypot((a.x-b.x)*1.5,a.y-b.y);
const L=WildwoodLayout,positions=L.positions;
const P=window.WildwoodBoard={
 active(){return ForestAdventure.active()&&!DungeonRules.campaign?.dungeon&&(ExploreRules.activeChapter||0)===0;},
 objects:[],
 assets:{bridge:'assets/recovered-timber-bridge.png',courtyard:'assets/forest-courtyard-v2.webp',grass:'assets/wildwood-forest-floor.webp',hollow:'assets/map-detail-0.webp',stump:'assets/map-detail-1.webp',tower:'assets/map-detail-3.webp',shelter:'assets/map-detail-2.webp',roots:'assets/crypt-layered-overgrowth.webp',watermill:'assets/wildwood-watermill.webp',willow:'assets/wildwood-willow.webp',waterfall:'assets/wildwood-waterfall.webp',library:'assets/map-city-library.webp',wall:'assets/map-city-wall.webp'},
 trails:L.trails,bridges:[{y:44,width:6.4,depth:2.2},{y:25,width:6.4,depth:2.2}],
 river(y){return 64+4*Math.sin((y-44)*.07)+1.8*Math.sin((y-44)*.17);},
 riverWidth(y){return 1.8+.3*Math.sin(y*.11);},
 bank(p){return Number(p.x>this.river(p.y));},
 lakes(){return [[44,76,5,4.5],[20,24,3.5,3],[this.river(14),15,2.8,2.3]];},
 lakeRadius(a){return 1+.065*Math.sin(a*5)+.035*Math.cos(a*9);},
 water(p){return Math.abs(p.x-this.river(p.y))<this.riverWidth(p.y)||this.lakes().some(([x,y,rx,ry])=>{const dx=(p.x-x)/rx,dy=(p.y-y)/ry;return Math.hypot(dx,dy)<this.lakeRadius(Math.atan2(dy,dx));});},
 ground(p){if(p.x<3||p.x>97||p.y<4||p.y>97)return 0;if(this.water(p))return this.bridges.some(b=>Math.abs(p.y-b.y)<b.depth/2&&Math.abs(p.x-this.river(b.y))<b.width/2)?3:2;return 1;},
 image(key){return this.assets[key]?ForestRenderer.image(this.assets[key]):ForestArt.image(key);},
 solid(p,o){if(o.solid===false)return false;return (o.footprints||[o]).some(f=>((p.x-f.x)/f.rx)**2+((p.y-f.y)/f.ry)**2<=1);},
 trailDistance(p){let best=Infinity;for(const trail of this.trails)for(let i=1;i<trail.length;i++){const a=trail[i-1],b=trail[i],dx=(b[0]-a[0])*1.5,dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p.x-a[0])*1.5*dx+(p.y-a[1])*dy)/(dx*dx+dy*dy)));best=Math.min(best,Math.hypot((p.x-a[0])*1.5-dx*t,p.y-a[1]-dy*t));}return best;},
 curve(c,points,w,h){const p=points.map(([x,y])=>[x*w/100,y*h/100]);c.beginPath();c.moveTo(...p[0]);for(let i=0;i<p.length-1;i++){const a=p[Math.max(0,i-1)],b=p[i],d=p[i+1],e=p[Math.min(p.length-1,i+2)];c.bezierCurveTo(b[0]+(d[0]-a[0])/6,b[1]+(d[1]-a[1])/6,d[0]-(e[0]-b[0])/6,d[1]-(e[1]-b[1])/6,...d);}},
 build(){
  const c=DungeonRules.campaign,q=c.forestQuest,key='wildwood-v1:'+q.ranger;
  if(M.layout?.key===key&&W._openKey===key&&W.cells)return;
  const graph=MapRoutes.graphs[0];
  for(const [id,[x,y]]of Object.entries(positions)){const n=FOREST_NODES.find(n=>n.id===id),p=graph.points.get(id);if(n)Object.assign(n,{x,y});if(p)Object.assign(p,{x,y});}
  for(const n of L.caches)Object.assign(FOREST_NODES.find(p=>p.id===n.id),n);
  JOURNEY_CHAPTERS[0].camp=positions.merchant.slice();const gate=RegionGates.gate(0);
  Object.assign(graph.points.get(gate.a),{x:61,y:44});Object.assign(graph.points.get(gate.b),{x:67,y:44});
  const props=[],rand=(i,j)=>{const n=Math.sin(i*127.1+j*311.7)*43758.5453;return n-Math.floor(n);};
  const keepClear=p=>Object.values(positions).every(([x,y])=>metric(p,{x,y})>3.6)&&L.caches.every(n=>metric(p,n)>2.4)&&L.patrols.every(n=>metric(p,{x:n.home[0],y:n.home[1]})>2.7)&&this.trailDistance(p)>1.5&&!this.water(p)&&this.bridges.every(b=>Math.abs(p.y-b.y)>2||Math.abs(p.x-this.river(b.y))>5);
  // Dense authored groves, with open meadows and freely traversable grass between them.
  for(const [group,[cx,cy,rx,ry]]of L.groves.entries())for(let i=0;i<150;i++){
   const angle=rand(i,group+1)*Math.PI*2,r=Math.sqrt(rand(i+47,group+9)),p={x:cx+Math.cos(angle)*rx*r,y:cy+Math.sin(angle)*ry*r};
   if(p.x<2||p.x>98||p.y<3||p.y>98||!keepClear(p)||props.some(o=>metric(o,p)<1.7))continue;
   const art=i%7===0?'willow':i%3===0?'pine':'oak',width=2.5+rand(i+21,group)*1.2;
   props.push({...p,rx:.27,ry:.29,art,width,height:width*2,flip:rand(i,group+31)>.5,tree:true});
  }
  props.push(...L.landmarks.map(o=>({...o,footprints:o.footprints?.map(f=>({...f}))})));
  props.push({id:'riverhead-falls',x:this.river(14),y:16,art:'waterfall',width:9,height:14,footprints:[{x:this.river(14),y:11,rx:2.7,ry:2.2}]});
  for(const [i,[x,y]]of [[40,72],[48,79],[16,21],[24,23],[69,78],[71,83]].entries())props.push({x,y,art:'willow',width:4.2+i%2*.6,height:8.5,rx:.35,ry:.35,tree:true});
  // Smaller ferns, stones and fallen logs create a planted forest floor.
  for(let i=0;i<900;i++){
   const p={x:4+rand(i,61)*92,y:5+rand(i,73)*91};if(this.ground(p)!==1||this.trailDistance(p)<.65||!keepClear({...p,x:p.x+.1})&&Object.values(positions).some(([x,y])=>metric(p,{x,y})<2))continue;
   if(i%3&&props.every(o=>metric(o,p)>3.5))continue;
   props.push({...p,art:i%11===0?'rocks':i%43===0?'stump':'ferns',width:.8+rand(i,82)*1.2,height:2.9,solid:false});
  }
  for(let y=8;y<96;y+=2.1)for(const side of [-1,1]){if(this.bridges.some(b=>Math.abs(y-b.y)<2.5))continue;if(rand(y,side+5)<.18)continue;const py=y+(rand(y,side+8)-.5)*.9,x=this.river(py)+side*(this.riverWidth(py)+.15+rand(y,side+2)*.7);props.push({x,y:py,art:rand(y,side+11)>.4?'ferns':'rocks',width:.8+rand(y,side)*1.2,height:2.2,solid:false});}
  if(!q.ranger)props.push({x:51,y:55.5,art:'roots',width:3.7,height:5,roots:true,footprints:[{x:51,y:54.6,rx:1.1,ry:.65}]});
  for(const n of L.caches)props.push({x:n.x,y:n.y,art:'closed',width:1.1,height:1.7,solid:false,cache:n.id});
  this.objects=props;this.buckets=new Map();
  // Navigation uses the same object footprints that appear above the ground.
  for(const o of props.filter(o=>o.solid!==false))for(const f of o.footprints||[o])for(let y=Math.floor((f.y-f.ry-.3)/4);y<=Math.floor((f.y+f.ry+.3)/4);y++)for(let x=Math.floor((f.x-f.rx-.2)/4);x<=Math.floor((f.x+f.rx+.2)/4);x++){const k=x+':'+y;if(!this.buckets.has(k))this.buckets.set(k,[]);this.buckets.get(k).push(f);}
  W.chapter=0;W.cells=new Uint8Array(W.width*W.height);W._openKey=key;
  for(let y=0;y<W.height;y++)for(let x=0;x<W.width;x++){const p=W.point(x,y);let cell=this.ground(p);if(cell===1&&(this.buckets.get(Math.floor(p.x/4)+':'+Math.floor(p.y/4))||[]).some(f=>(Math.max(0,Math.abs(p.x-f.x)-.17)/f.rx)**2+(Math.max(0,Math.abs(p.y-f.y)-.25)/f.ry)**2<=1))cell=0;W.cells[y*W.width+x]=cell;}
  const entry=graph.points.get('entry'),nodes=FOREST_NODES.filter(n=>n.chapter===0&&!n.dungeon&&!n.global);
  M.layout={key,id:'region-0',chapter:0,theme:'forest',dungeon:false,entry,originalEntry:entry,gate,graph,nodes,props:[],features:[],edges:[],islandEdges:[],islandPoints:[graph.points.get('m3')],islandIds:new Set(['m3']),a:graph.points.get(gate.a),b:graph.points.get(gate.b),ready:true,traversalClean:true,floor:p=>this.ground(p)};
 },
 paint(c,w,h){
  this.build();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
  const grass=this.image('grass');c.fillStyle=grass.complete&&grass.naturalWidth?c.createPattern(grass,'repeat'):'#446044';c.fillRect(0,0,w,h);c.fillStyle='#314c2909';c.fillRect(0,0,w,h);
  for(const [x,y]of Object.values(positions)){const light=c.createRadialGradient(x*w/100,y*h/100,0,x*w/100,y*h/100,w*.065);light.addColorStop(0,'#efdf9e24');light.addColorStop(1,'#efdf9e00');c.fillStyle=light;c.fillRect(x*w/100-w*.07,y*h/100-w*.07,w*.14,w*.14);}
  // Real terrain water, not a river painted into a background picture.
  const waterPath=new Path2D();for(let y=0;y<=100;y+=.3){const x=(this.river(y)-this.riverWidth(y))*w/100;if(!y)waterPath.moveTo(x,y*h/100);else waterPath.lineTo(x,y*h/100);}for(let y=100;y>=0;y-=.3)waterPath.lineTo((this.river(y)+this.riverWidth(y))*w/100,y*h/100);waterPath.closePath();
  for(const [x,y,rx,ry]of this.lakes()){for(let a=0;a<=Math.PI*2+.04;a+=.04){const r=this.lakeRadius(-a),px=(x+Math.cos(a)*rx*r)*w/100,py=(y-Math.sin(a)*ry*r)*h/100;if(!a)waterPath.moveTo(px,py);else waterPath.lineTo(px,py);}waterPath.closePath();}
  c.save();c.shadowColor='#173d3b88';c.shadowBlur=10;c.strokeStyle='#76845a';c.lineWidth=w*.003;c.stroke(waterPath);c.restore();c.save();c.clip(waterPath);const water=this.image('water');c.fillStyle=water.complete&&water.naturalWidth?c.createPattern(water,'repeat'):'#347d89';c.fillRect(0,0,w,h);c.fillStyle='#1b565d38';c.fillRect(0,0,w,h);c.restore();
  // Trails suggest destinations. Every unblocked grass cell is still walkable.
  const layer=document.createElement('canvas');layer.width=w;layer.height=h;const t=layer.getContext('2d');t.lineCap='round';t.lineJoin='round';const texture=this.image('path');
  for(const points of this.trails){this.curve(t,points,w,h);t.strokeStyle='#8b875a60';t.lineWidth=w*.019;t.filter='blur(4px)';t.stroke();t.filter='blur(3px)';t.strokeStyle=texture.complete&&texture.naturalWidth?t.createPattern(texture,'repeat'):'#b1a477';t.lineWidth=w*.012;t.stroke();}
  t.filter='none';
  // Small irregular earth and stone patches break up the road edges at world scale.
  const noise=n=>{const v=Math.sin(n*127.13)*43758.54;return v-Math.floor(v);};
  for(let i=0;i<18000;i++){const x=noise(i+1)*100,y=noise(i+22001)*100,d=this.trailDistance({x,y});if(d>1.5||this.water({x,y}))continue;const edge=d>.65;t.fillStyle=edge?(i%3?'#758b3d88':'#c7be7b88'):(i%3?'#ead6a155':'#695a3b44');t.beginPath();t.ellipse(x*w/100,y*h/100,(1+noise(i+40001)*3)*w/4500,(.7+noise(i+50001)*2)*h/3000,noise(i)*3,0,Math.PI*2);t.fill();}
  // Do not paint trails over water between the two actual crossings.
  t.globalCompositeOperation='destination-out';t.fillStyle='#fff';t.fill(waterPath);c.drawImage(layer,0,0);
  for(const b of this.bridges){const x=this.river(b.y)*w/100,y=b.y*h/100,dw=b.width*w/100,dh=b.depth*h/100,im=this.image('bridge');if(im.complete&&im.naturalWidth)c.drawImage(im,130,115,760,525,x-dw/2,y-dh*.8,dw,dh*1.6);}
  const shade=c.createLinearGradient(0,0,w,h);shade.addColorStop(0,'#112c241d');shade.addColorStop(.5,'#112c2400');shade.addColorStop(1,'#092c3322');c.fillStyle=shade;c.fillRect(0,0,w,h);
 },
 navigate(goal){const c=DungeonRules.campaign,closed=!RegionGates.open(0,c.completed),reachable=M.reachable(closed),cell=W.cell(goal);let target=null,best=1.6;for(let y=Math.max(0,cell.y-4);y<=Math.min(W.height-1,cell.y+4);y++)for(let x=Math.max(0,cell.x-4);x<=Math.min(W.width-1,cell.x+4);x++){if(!reachable[y*W.width+x])continue;const p=W.point(x,y),d=metric(p,goal);if(d<best){best=d;target=p;}}if(!target)return false;const route=MouseNavigation.route(0,c.explorePosition||M.layout.entry,target,closed);if(!route)return false;MouseNavigation.path=route;return true;},
 scene(c,list,toScreen,p){
  for(const o of this.objects){const at=toScreen(o.x,o.y),a=toScreen(o.x+o.width,o.y),height=toScreen(o.x,o.y+o.height).y-at.y,width=a.x-at.x;
   if(at.x<-width||at.x>c.canvas.width+width||at.y<-30||at.y>c.canvas.height+height)continue;
   list.push({y:at.y+(o.solid===false?-1:0),draw:()=>{c.save();const party=[p,...(window.PartyTrail?.formation?.()||[])];if(o.tree&&party.some(q=>Math.abs(q.x-o.x)<o.width*.65&&q.y<o.y+1&&q.y>o.y-o.height))c.globalAlpha=.2;else if(o.solid!==false&&metric(p,o)<2&&p.y<o.y)c.globalAlpha=.45;if(o.flip){c.translate(at.x*2,0);c.scale(-1,1);}const im=this.image(o.cache&&DungeonRules.campaign?.completed.includes(o.cache)?'open':o.art);if(o.cell!==undefined&&im.complete&&im.naturalWidth){const sw=im.naturalWidth/4,sh=im.naturalHeight/3,scale=Math.min(width/sw,height/sh);const inset=Math.min(sw,sh)*.065;c.drawImage(im,o.cell%4*sw+inset,Math.floor(o.cell/4)*sh+inset,sw-inset*2,sh-inset*2,at.x-sw*scale/2,at.y-sh*scale,sw*scale,sh*scale);}else if(o.art==='camp'&&im.complete&&im.naturalWidth){const sh=im.naturalHeight*.965,scale=Math.min(width/im.naturalWidth,height/sh);c.drawImage(im,0,0,im.naturalWidth,sh,at.x-im.naturalWidth*scale/2,at.y-sh*scale,im.naturalWidth*scale,sh*scale);}else ForestArt.fit(c,im,at.x,at.y,width,height);c.restore();}});
  }
  if(DungeonRules.campaign?.completed.includes('m3')){const at=toScreen(83,24);list.push({y:-Infinity,draw:()=>{c.save();const glow=c.createRadialGradient(at.x,at.y,4,at.x,at.y,100);glow.addColorStop(0,'#bef9c588');glow.addColorStop(1,'#88e7b400');c.fillStyle=glow;c.fillRect(at.x-100,at.y-100,200,200);c.restore();}});}
  if(!RegionGates.open(0,DungeonRules.campaign.completed))for(const b of this.bridges){const at=toScreen(this.river(b.y),b.y);list.push({y:at.y+.2,draw:()=>{c.save();c.strokeStyle='#5c4c30';c.lineWidth=7;for(let i=-1;i<=1;i++){c.beginPath();c.moveTo(at.x-30,at.y+21+i*7);c.bezierCurveTo(at.x-12,at.y-15,at.x+10,at.y+29,at.x+30,at.y-20+i*7);c.stroke();}c.restore();}});}

 },
};
const build=M.build;M.build=function(){return P.active()?P.build():build.call(this);};
const gate=RegionGates.gate;RegionGates.gate=function(chapter){if(P.active()&&chapter===0){const [a,b]=this.edges[0];return {a,b,x:64,y:44,radius:4};}return gate.call(this,chapter);};
const blocked=W.blocked;W.blocked=function(a,b,barriers=[]){return P.active()?!!barriers.length&&P.bank(a)!==P.bank(b):blocked.call(this,a,b,barriers);};
const size=WorldCamera.size;WorldCamera.size=function(chapter,w,h){return P.active()?{width:Math.max(w,L.width),height:Math.max(w,L.width)/1.5}:size.call(this,chapter,w,h);};
const ensure=ForestRenderer.ensure;ForestRenderer.ensure=function(){const ok=ensure.call(this);if(ok&&P.active()&&this._wildwoodCanvas!==this.terrain){this.terrain.width=4500;this.terrain.height=3000;this._wildwoodCanvas=this.terrain;this._openLayout=null;this._openReady=false;}return ok;};
const bind=DungeonRules.bind;DungeonRules.bind=function(...args){const result=bind.apply(this,args);if(P.active()){ExploreRules.speed=L.speed;PartyTrail.spacing=.85;}return result;};
const paint=M.paint;M.paint=function(c,w,h){return P.active()?P.paint(c,w,h):paint.call(this,c,w,h);};
const scene=M.scene;M.scene=function(...args){return P.active()?P.scene(...args):scene.apply(this,args);};
const ready=M.ready;M.ready=function(){if(!P.active())return ready.call(this);this.build();return ['bridge','courtyard','grass','oak','pine','gate','camp','hollow','ancient','moonwell','tower','roots','stump','ferns','rocks','rune','path','water','wood','watermill','willow','waterfall','library','wall','shelter','closed','open'].every(key=>{const im=P.image(key);return im.complete&&im.naturalWidth;});};
for(const owner of [LayeredFoliage,ScenicSeals]){const old=owner.scene;owner.scene=function(...args){if(!P.active())return old.apply(this,args);};}
const landmark=ForestArt.landmark;ForestArt.landmark=function(c,n,at,done,time){if(P.active()&&n.wildwood)return;if(P.active()&&['merchant','m0','m1','m3','forest-spirit'].includes(n.id)){if(n.id==='merchant'&&DungeonRules.campaign?.forestQuest?.ranger)return landmark.call(this,c,n,at,done,time);return;}return landmark.call(this,c,n,at,done,time);};
// The small location map must show this terrain, not the original painting.
const mini=ForestFastPlay.map;ForestFastPlay.map=function(c,p){if(P.active()&&ForestRenderer.terrain&&M.ready()&&ForestRenderer._openLayout===M.layout.key&&ForestRenderer._openReady){
 const key=M.layout.key+':'+c.completed.join(',');if(P.minimap?.key!==key){const canvas=document.createElement('canvas');canvas.width=360;canvas.height=240;const context=canvas.getContext('2d');context.drawImage(ForestRenderer.terrain,0,0,360,240);const objects=[];P.scene(context,objects,(x,y)=>({x:x*3.6,y:y*2.4}),{x:-100,y:200});objects.sort((a,b)=>a.y-b.y).forEach(o=>o.draw());P.minimap={key,image:canvas.toDataURL('image/webp',.8)};ForestRenderer.minimap=P.minimap.image;}
 const background='url("'+P.minimap.image+'")';if(document.getElementById('world-overview').style.backgroundImage!==background)document.getElementById('world-overview').style.backgroundImage=background;
}return mini.call(this,c,p);};
for(const method of ['prologue','arrival','world','result']){const old=ForestAdventure[method];ForestAdventure[method]=function(s,...args){const result=old.call(this,s,...args);if(P.active()){
 if(method==='prologue')document.getElementById('prologue-text').innerHTML='<p>Roam Wildwood, recover hidden supplies, and free the forest’s Guardian. Four encounters lead to the Heart; the mill, meadow, ruins and riverhead are yours to explore. Defeat the bridge sentinel to reopen both crossings.</p>';
 if(method==='arrival'&&s.phase==='arrival')document.getElementById('arrival-narration').textContent=['A briar imp patrols Mossgate. Clear the road into the forest.','A root-bound wolf prowls the hollow. Defeat it to secure the western trails.','The sentinel guards the bridge. Break its armor to cross the river.','The Guardian waits beyond the bridge, at the northern end of the eastern trail.'][s.encounter];
 if(method==='world'){document.getElementById('forest-canopy').textContent='Take the cleared bridge trail';document.getElementById('forest-canopy').onclick=()=>{const dialog=document.getElementById('map-dialog');if(dialog.open)document.getElementById('close-map-dialog').click();ForestAdventure.walkTo('m3');};const note=document.getElementById('forest-boss-readiness');if(note)note.textContent='Guardian ahead · cross the bridge and follow the eastern trail north.';}
 if(method==='result'&&s.phase==='victory')document.getElementById('result-copy').textContent=['Mossgate is clear. Choose supplies or a spirit shield, then find the hollow.','The hollow is safe. Find the ranger and head east to the bridge.','Both crossings are open. Explore the eastern ruins or follow the river north to the Guardian.'][s.encounter]||'The path is clear.';
}return result;};}
// Discoveries use ordinary completed-node flags, so rewards and progress survive reload.
for(const n of L.caches)FOREST_NODES.push({...n,chapter:0,stage:0,kind:'forest-find',forestFind:true,wildwood:true,hidden:true,optional:true});
const visible=ForestAdventure.visible,available=ForestAdventure.available,interact=ForestAdventure.interact;
ForestAdventure.visible=function(c,n){return P.active()&&n.wildwood?true:visible.call(this,c,n);};
ForestAdventure.available=function(c,n){if(P.active()&&(n.wildwood||['roam-0-2','roam-0-3'].includes(n.id)))return !c.completed.includes(n.id);return available.call(this,c,n);};
ForestAdventure.interact=function(s,n,ui){if(!P.active()||!n.wildwood)return interact.call(this,s,n,ui);if(s.campaign.completed.includes(n.id))return;if(DungeonRules.reward(s,n.id,35,20,1,1,n.name)){ui.save();ui.world();ui.reward?.(['chest-open']);ui.notice(n.name,'+1 potion · +1 rune · +20 gold. Keep exploring or return to the main quest.');}};
const challenge=ForestAdventure.beginEncounter;ForestAdventure.beginEncounter=function(s){if(P.active()&&['roam-0-2','roam-0-3'].includes(s.campaign.battleNode)){s.campaign.forestQuest.challenge=null;return;}return challenge.call(this,s);};
const present=ForestAdventure.presentChallenge;ForestAdventure.presentChallenge=function(s){const result=present.call(this,s);if(P.active()&&['roam-0-2','roam-0-3'].includes(s.campaign.battleNode)){document.getElementById('battle-chapter').textContent='WILDWOOD · OPTIONAL PATROL';document.getElementById('trail').textContent='Optional encounter · victory does not change the main quest order';}return result;};
const forestResult=ForestAdventure.result;ForestAdventure.result=function(s,...args){const result=forestResult.call(this,s,...args);if(P.active()&&s.phase==='complete')document.getElementById('result-copy').textContent='The Heart is free. Wildwood is safe again. Explore for any caches you missed, or return to camp.';if(P.active()&&s.phase==='victory'&&['roam-0-2','roam-0-3'].includes(s.campaign.battleNode)){document.getElementById('result-copy').textContent='Patrol cleared. Its territory stays safe for this adventure. Explore for supplies or return to your next quest encounter.';document.getElementById('advance').textContent='Return to Wildwood →';}return result;};
// Keep the existing pursuit, retreat, escape grace, combat and save behavior.
ForestPatrols.bind=function(c){const next=ForestAdventure.next(c),key='wildwood-patrol:'+next+':'+c.completed.filter(id=>id.startsWith('roam-')).join(',');const R=RoamingWorld;if(R.context===key&&R.campaign===c)return;R.context=key;R.campaign=c;R.actors=[];R.defaults(c);
 for(const plan of L.patrols){if(c.completed.includes(plan.questNode)||plan.slot<2&&next!==plan.questNode)continue;const spec=R.specs.find(s=>s.chapter===0&&s.slot===plan.slot),origin={x:plan.home[0],y:plan.home[1]},home=ForestWorld.nearest(origin,2);if(!home)continue;const route=[{x:home.x,y:home.y}];
 for(let radius=1.2;radius<3&&route.length<4;radius+=.6)for(let i=0;i<16&&route.length<4;i++){const angle=i*Math.PI/8,p={x:home.x+Math.cos(angle)*radius/1.5,y:home.y+Math.sin(angle)*radius};if(W.walkable(p)&&route.every(q=>metric(q,p)>.7)&&R.line(home,p,c))route.push(p);}
 for(let i=route.length-1;i>0;i--)if(!R.line(route[i-1],route[i],c)||!R.line(route[i],route[0],c))route.splice(i,1);
 const saved=c.roaming.patrols[spec.id],at=saved&&Number.isFinite(saved.x)&&Number.isFinite(saved.y)&&metric(saved,home)<8&&W.walkable(saved)&&R.line(home,saved,c)?{x:saved.x,y:saved.y}:route[0];
 R.actors.push({...spec,questNode:plan.questNode,home:route[0],position:{...at},route,target:route.length>1?1:0,mode:'patrol',timer:0,unseen:0,repath:0,path:[],graceUntil:Math.max(Date.now()+2500,saved?.graceUntil||0),facing:1});
 const n=FOREST_NODES.find(n=>n.id===plan.questNode);if(plan.slot>=2)Object.assign(n,{x:home.x,y:home.y});
 }
};
const refresh=ForestAdventure.refreshTitle;ForestAdventure.refreshTitle=function(...args){const result=refresh.apply(this,args),start=document.getElementById('forest-quest-start'),resume=document.getElementById('forest-quest-continue');if(start&&!start.dataset.confirm)start.textContent='Enter Wildwood →';if(resume)resume.textContent='Continue Wildwood';return result;};
const attach=ForestAdventure.attach;ForestAdventure.attach=function(...args){const result=attach.apply(this,args);window.addEventListener('load',()=>{const button=document.getElementById('teacher-forest-quest');if(button)button.textContent='Play Wildwood with this set';});const card=document.getElementById('forest-quest-start').closest('section');if(card){card.querySelector('h2').textContent='Explore Wildwood';const copy=card.querySelector('p');if(copy)copy.textContent='A large open forest board. Follow four quest encounters, or roam for caches, ruins and optional patrols. Saved separately from your other games.';}return result;};
const sync=ForestFastPlay.sync;ForestFastPlay.sync=function(s){const result=sync.call(this,s);if(P.active()){
 let stats=document.getElementById('wildwood-discoveries');if(!stats){stats=document.createElement('small');stats.id='wildwood-discoveries';document.getElementById('forest-mini-body').append(stats);}stats.textContent='Caches '+L.caches.filter(n=>s.campaign.completed.includes(n.id)).length+'/'+L.caches.length+' · click map ground to walk';
 const mini=document.getElementById('forest-mini-ground');if(!mini._wildwoodClick){mini._wildwoodClick=true;mini.addEventListener('click',event=>{if(event.target.closest('button')||ForestFastPlay.state?.phase!=='world'||document.getElementById('map-dialog').open)return;event.stopPropagation();const rect=mini.getBoundingClientRect(),goal={x:(event.clientX-rect.left)/rect.width*100,y:(event.clientY-rect.top)/rect.height*100};P.navigate(goal);});}
 }return result;};
const style=document.createElement('style');style.textContent='#start,#continue,#visual-trial-start,#load-lesson,#continue-teacher,#title-world-map-open,#launch-lesson{display:none!important}#wildwood-discoveries{display:block;padding:5px 7px;font:11px/1.3 system-ui;color:#d9d5b0}';document.head.append(style);
const label=document.createElement('p');label.style.cssText='position:fixed;top:0;left:50%;transform:translateX(-50%);z-index:1000;margin:0;padding:5px 14px;background:#18352e;color:#fff4ce;font:13px system-ui;border-radius:0 0 8px 8px';label.innerHTML='Wildwood preview · progress saved separately · <a href="index.html" style="color:#ffe09a">Original game</a>';document.body.append(label);
})();
