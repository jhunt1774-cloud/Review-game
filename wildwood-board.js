/* Opt-in built-map experiment. The normal game never enters this adapter. */
(()=>{'use strict';
if(new URLSearchParams(location.search).get('map')!=='wildwood')return;
ForestAdventure.slot='web-wizardry-wildwood-v1';
const W=ForestWorld,M=OpenPaintedMaps,metric=(a,b)=>Math.hypot((a.x-b.x)*1.5,a.y-b.y);
const L=WildwoodLayout,positions=L.positions;
const treeFallback={'canopy-conifer':'pine','canopy-oak':'oak','canopy-sycamore':'oak'};
const P=window.WildwoodBoard={
 active(){return ForestAdventure.active()&&!DungeonRules.campaign?.dungeon&&(ExploreRules.activeChapter||0)===0;},
 objects:[],
 assets:{crossingKit:'assets/wildwood-crossing-kit.webp',paintedGround:'assets/wildwood-painted-ground.webp','canopy-conifer':'assets/wildwood-conifer.webp','canopy-oak':'assets/wildwood-oak.webp','canopy-sycamore':'assets/wildwood-sycamore.webp',stoneBridge:'assets/wildwood-stone-bridge.webp',stoneDetails:'assets/wildwood-stone-details.webp',soil:'assets/forrest_ground_01.webp',mud:'assets/brown_mud_leaves_01.webp',bridge:'assets/recovered-timber-bridge.png',courtyard:'assets/forest-courtyard-v2.webp',grass:'assets/wildwood-forest-floor.webp',stump:'assets/map-detail-1.webp',tower:'assets/map-detail-3.webp',shelter:'assets/map-detail-2.webp',roots:'assets/crypt-layered-overgrowth.webp',watermill:'assets/wildwood-watermill.webp',library:'assets/map-city-library.webp',wall:'assets/map-city-wall.webp'},
 trails:L.trails,bridges:[{y:44,width:6.4,depth:2.2},{y:25,width:6.4,depth:2.2}],
 river(y){return 64+4*Math.sin((y-44)*.07)+1.8*Math.sin((y-44)*.17);},
 riverWidth(y){return 1.8+.3*Math.sin(y*.11);},
 bank(p){return Number(p.x>this.river(p.y));},
 lakes(){return [[44,76,5,4.5],[20,24,3.5,3],[this.river(14),15,2.8,2.3]];},
 lakeRadius(a){return 1+.065*Math.sin(a*5)+.035*Math.cos(a*9);},
 water(p){return Math.abs(p.x-this.river(p.y))<this.riverWidth(p.y)||this.lakes().some(([x,y,rx,ry])=>{const dx=(p.x-x)/rx,dy=(p.y-y)/ry;return Math.hypot(dx,dy)<this.lakeRadius(Math.atan2(dy,dx));});},
 ground(p){if(p.x<3||p.x>97||p.y<4||p.y>97)return 0;if(this.water(p))return this.bridges.some(b=>Math.abs(p.y-b.y)<b.depth/2&&Math.abs(p.x-this.river(b.y))<b.width/2)?3:2;return 1;},
 image(key){
  const image=this.assets[key]?ForestRenderer.image(this.assets[key]):ForestArt.image(key);
  return treeFallback[key]&&image.complete&&!image.naturalWidth?ForestArt.image(treeFallback[key]):image;
 },
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
   const mix=rand(i+17,group+21),conifer=cy<40?.57:.24;
   const art=mix<conifer?'canopy-conifer':mix<.82?'canopy-oak':'canopy-sycamore',width=2.5+rand(i+21,group)*1.2;
   props.push({...p,rx:.27,ry:.29,art,width,height:width*2,tree:true});
  }
  props.push(...L.landmarks.map(o=>({...o,footprints:o.footprints?.map(f=>({...f}))})));
  for(const [i,[x,y]]of [[40,72],[48,79],[16,21],[24,23],[69,78],[71,83]].entries())props.push({x,y,art:'canopy-sycamore',width:4.2+i%2*.6,height:8.5,rx:.35,ry:.35,tree:true});
  // Smaller ferns, stones and fallen logs create a planted forest floor.
  for(let i=0;i<900;i++){
   const p={x:4+rand(i,61)*92,y:5+rand(i,73)*91};if(this.ground(p)!==1||this.trailDistance(p)<.65||!keepClear({...p,x:p.x+.1})&&Object.values(positions).some(([x,y])=>metric(p,{x,y})<2))continue;
   if(i%3&&props.every(o=>metric(o,p)>3.5))continue;
   props.push({...p,art:i%11===0?'rock'+(i%6+1):i%43===0?'stump':'ferns',width:.8+rand(i,82)*1.2,height:2.9,solid:false});
  }
  for(let y=8;y<96;y+=2.1)for(const side of [-1,1]){if(this.bridges.some(b=>Math.abs(y-b.y)<2.5))continue;if(rand(y,side+5)<.18)continue;const py=y+(rand(y,side+8)-.5)*.9,x=this.river(py)+side*(this.riverWidth(py)+.15+rand(y,side+2)*.7);props.push({x,y:py,art:rand(y,side+11)>.4?'ferns':'rock'+(Math.floor(y)%6+1),width:.8+rand(y,side)*1.2,height:2.2,solid:false});}
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
 stampStone(c,image,cell,x,y,width,angle=0){
  if(!image.complete||!image.naturalWidth)return;
  const sw=image.naturalWidth/3,sh=image.naturalHeight/2,height=width*sh/sw*(cell>=3?.68:.8);
  c.save();c.translate(x,y);c.rotate(angle);
  c.drawImage(image,cell%3*sw,Math.floor(cell/3)*sh,sw,sh,-width/2,-height/2,width,height);
  c.restore();
 },
 paintCrossing(c,w,h,waterPath){
  const kit=this.image('crossingKit');
  if(!kit.complete||!kit.naturalWidth)return;
  const bridge=this.bridges.find(b=>b.y===44);
  const river=this.river(bridge.y);
  const draw=(cell,x,y,scale,angle=0)=>{
   const sw=kit.naturalWidth/3,sh=kit.naturalHeight/2,width=scale*w/100;
   c.save();c.translate(x*w/100,y*h/100);c.rotate(angle);
   const height=width*sh/sw;
   c.drawImage(kit,cell%3*sw,Math.floor(cell/3)*sh,sw,sh,-width/2,-height/2,width,height);
   c.restore();
  };
  // Dappled light is composed once alongside the rest of the terrain cache.
  const land=new Path2D();
  land.rect(0,0,w,h);land.addPath(waterPath);
  c.save();c.clip(land,'evenodd');c.globalCompositeOperation='soft-light';
  for(const [i,[dx,dy]] of [[-9,-4],[-6,2],[-3,-3],[4,-4],[7,1],[5,5],[-9,5]].entries()){
   for(let j=0;j<12;j++){
    const phase=i*41+j*17,scatter=Math.sin(phase),drift=Math.cos(phase*1.43);
    const x=(river+dx+scatter*1.55)*w/100,y=(bridge.y+dy+drift*1.2)*h/100;
    const radius=w*(.0025+Math.abs(scatter)*.0045);
    const light=c.createRadialGradient(x,y,0,x,y,radius);
    light.addColorStop(0,'#fbe396a6');light.addColorStop(1,'#fbe39600');
    c.fillStyle=light;c.fillRect(x-radius,y-radius,radius*2,radius*2);
   }
  }
  c.restore();
  // Attached to the actual span and bank boundaries. All stamps are cosmetic.
  for(const [side,y,cell,width,angle] of [
   [-1,39.8,1,2.5,.37],[-1,42.2,3,2.4,-.24],[-1,46,1,2.6,.49],[-1,48.3,3,2.1,.56],
   [1,39.4,3,2.7,-.22],[1,42,1,2.9,.21],[1,45.8,3,2.7,.39],[1,48.3,1,2.6,.54]
  ])draw(cell,this.river(y)+side*this.riverWidth(y),y,width,angle);
  c.save();c.clip(waterPath);c.globalAlpha=.42;
  for(const [side,y,width] of [[-1,41.3,1.1],[1,42.4,1.3],[-1,46.5,1.2],[1,47.4,1.3]]) {
   draw(4,this.river(y)+side*(this.riverWidth(y)-.32),y,width,.46);
  }
  c.restore();
  for(const [dx,dy,cell,width,angle] of [
   [-5.9,-3.2,2,2.7,.2],[-5.6,3.3,2,2.5,-.2],[-4.2,1.1,5,2.8,-.35],
   [-3.2,-.6,5,2.3,.17],[3.8,.6,5,2.9,.1],[6.3,-1.8,2,3.2,.47],
   [5.9,2.1,2,2.5,-.16],[7.4,.2,5,2.6,-.15]
  ])draw(cell,river+dx,bridge.y+dy,width,angle);
  const center={x:river,y:bridge.y};
  const nearby=this.objects.filter(o=>o.tree&&o.art==='canopy-oak'&&metric(o,center)<16)
   .sort((a,b)=>metric(a,center)-metric(b,center)).slice(0,3);
  for(const tree of nearby)draw(0,tree.x,tree.y-.1,tree.width*.96);
 },
 paint(c,w,h){
  this.build();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
  const grass=this.image('grass');c.fillStyle=grass.complete&&grass.naturalWidth?c.createPattern(grass,'repeat'):'#446044';c.fillRect(0,0,w,h);c.fillStyle='#314c2909';c.fillRect(0,0,w,h);
  const painted=this.image('paintedGround');
  if(painted.complete&&painted.naturalWidth){
   c.save();c.globalAlpha=.62;c.fillStyle=c.createPattern(painted,'repeat');c.fillRect(0,0,w,h);c.restore();
  }
  // Broad changes of light interrupt the repeating ground texture.
  for(const [x,y,rx,ry,color] of [
   [22,81,17,14,'#d7ad594f'],[37,42,14,14,'#e9c77538'],
   [68,43,17,13,'#80b79b30'],[82,65,12,15,'#d5bc6948'],
   [41,71,13,11,'#275d5539'],[83,25,11,15,'#e3cf6845'],
   [9,55,16,42,'#14352e65'],[48,5,37,10,'#162d244c']
  ]){
   c.save();c.translate(x*w/100,y*h/100);c.scale(rx*w/100,ry*h/100);
   const light=c.createRadialGradient(0,0,.12,0,0,1);
   light.addColorStop(0,color);light.addColorStop(1,'#0000');
   c.fillStyle=light;c.fillRect(-1,-1,2,2);c.restore();
  }
  // Blend leaf litter beneath groves; clear grass remains readable between them.
  const soil=this.image('soil'),mud=this.image('mud');
  for(const [gx,gy,rx,ry]of L.groves){c.save();const mask=document.createElement('canvas');mask.width=Math.ceil(rx*w/50);mask.height=Math.ceil(ry*h/50);const q=mask.getContext('2d');q.fillStyle=q.createPattern(soil,'repeat');q.fillRect(0,0,mask.width,mask.height);q.globalCompositeOperation='destination-in';const fade=q.createRadialGradient(mask.width/2,mask.height/2,0,mask.width/2,mask.height/2,Math.max(mask.width,mask.height)/2);fade.addColorStop(0,'#000a');fade.addColorStop(1,'#0000');q.fillStyle=fade;q.fillRect(0,0,mask.width,mask.height);c.globalAlpha=.65;c.drawImage(mask,(gx-rx)*w/100,(gy-ry)*h/100);c.restore();}
  for(const [x,y]of Object.values(positions)){const light=c.createRadialGradient(x*w/100,y*h/100,0,x*w/100,y*h/100,w*.065);light.addColorStop(0,'#efdf9e24');light.addColorStop(1,'#efdf9e00');c.fillStyle=light;c.fillRect(x*w/100-w*.07,y*h/100-w*.07,w*.14,w*.14);}
  // Bake warm contact shadows under existing objects once, independent of navigation.
  for(const o of this.objects){
   if(!o.tree&&!o.id)continue;
   const x=o.x*w/100,y=o.y*h/100,radius=o.width*w/100;
   const shadow=c.createRadialGradient(0,0,.08,0,0,1);
   shadow.addColorStop(0,o.tree?'#13291e94':'#241c107a');shadow.addColorStop(1,'#0000');
   c.save();c.translate(x+radius*.16,y-radius*.04);c.scale(radius*.61,radius*.29);
   c.fillStyle=shadow;c.fillRect(-1,-1,2,2);c.restore();
  }
  // Use the same shoreline geometry as navigation.
  const waterPath=new Path2D();for(let y=0;y<=100;y+=.3){const x=(this.river(y)-this.riverWidth(y))*w/100;if(!y)waterPath.moveTo(x,y*h/100);else waterPath.lineTo(x,y*h/100);}for(let y=100;y>=0;y-=.3)waterPath.lineTo((this.river(y)+this.riverWidth(y))*w/100,y*h/100);waterPath.closePath();
  for(const [x,y,rx,ry]of this.lakes()){for(let a=0;a<=Math.PI*2+.04;a+=.04){const r=this.lakeRadius(-a),px=(x+Math.cos(a)*rx*r)*w/100,py=(y-Math.sin(a)*ry*r)*h/100;if(!a)waterPath.moveTo(px,py);else waterPath.lineTo(px,py);}waterPath.closePath();}
  c.save();c.strokeStyle='#686849';c.lineWidth=w*.0034;c.stroke(waterPath);
  c.strokeStyle='#9f9470';c.lineWidth=w*.0018;c.stroke(waterPath);c.restore();
  c.save();c.clip(waterPath);const water=this.image('water');c.fillStyle=water.complete&&water.naturalWidth?c.createPattern(water,'repeat'):'#347d89';c.fillRect(0,0,w,h);c.fillStyle='#143d4b24';c.fillRect(0,0,w,h);
  c.strokeStyle='#52b6a766';c.lineWidth=w*.007;c.stroke(waterPath);
  c.strokeStyle='#baddb35e';c.lineWidth=w*.0011;c.stroke(waterPath);c.restore();
  // Trails suggest destinations. Every unblocked grass cell is still walkable.
  const layer=document.createElement('canvas');layer.width=w;layer.height=h;const t=layer.getContext('2d');t.lineCap='round';t.lineJoin='round';const texture=this.image('path');
  for(const points of this.trails){this.curve(t,points,w,h);t.strokeStyle='#8b875a60';t.lineWidth=w*.019;t.filter='blur(4px)';t.stroke();t.filter='blur(3px)';t.strokeStyle=texture.complete&&texture.naturalWidth?t.createPattern(texture,'repeat'):'#b1a477';t.lineWidth=w*.012;t.stroke();}
  t.filter='none';
  // Small irregular earth and stone patches break up the road edges at world scale.
  const noise=n=>{const v=Math.sin(n*127.13)*43758.54;return v-Math.floor(v);};
  for(let i=0;i<18000;i++){const x=noise(i+1)*100,y=noise(i+22001)*100,d=this.trailDistance({x,y});if(d>1.5||this.water({x,y}))continue;const edge=d>.65;t.fillStyle=edge?(i%3?'#758b3d88':'#c7be7b88'):(i%3?'#ead6a155':'#695a3b44');t.beginPath();t.ellipse(x*w/100,y*h/100,(1+noise(i+40001)*3)*w/4500,(.7+noise(i+50001)*2)*h/3000,noise(i)*3,0,Math.PI*2);t.fill();}
  const stones=this.image('stoneDetails');
  // Uneven flagstone remnants cluster near the gate, crossings and ruined courtyard.
  for(const [index,points] of this.trails.entries()){
   for(let i=1;i<points.length;i++){
    const [ax,ay]=points[i-1],[bx,by]=points[i],run=metric({x:ax,y:ay},{x:bx,y:by});
    for(let offset=.5;offset<run;offset+=.8){
     const seed=index*83+i*37+offset*17,progress=offset/run;
     const x=ax+(bx-ax)*progress+(noise(seed)-.5)*.48,y=ay+(by-ay)*progress+(noise(seed+3)-.5)*.45;
     const closeToStone=[[29,69],[58,44],[83,25],[82,65]].some(([sx,sy])=>metric({x,y},{x:sx,y:sy})<8);
     if(noise(seed+5)>(closeToStone?.87:.33))continue;
     t.globalAlpha=closeToStone?.84:.58;
     this.stampStone(t,stones,3+Math.floor(noise(seed+9)*3),x*w/100,y*h/100,w*(.012+noise(seed+6)*.01),(noise(seed+7)-.5)*.9);
    }
   }
  }
  t.globalAlpha=1;
  // Do not paint trails over water between the two actual crossings.
  t.globalCompositeOperation='destination-out';t.fillStyle='#fff';t.fill(waterPath);c.drawImage(layer,0,0);
  // Irregular stone shelves soften the bank at map scale; these are visual only.
  c.globalAlpha=.85;
  for(const side of [-1,1]){
   for(let y=.5;y<100;y+=.56){
    if(this.bridges.some(b=>Math.abs(y-b.y)<1.4)||noise(y*103+side)<.32)continue;
    const edge=this.river(y)+side*(this.riverWidth(y)+.07);
    this.stampStone(c,stones,Math.floor(noise(y*71+side)*3),edge*w/100,y*h/100,w*(.009+noise(y*41+side)*.009),noise(y*53+side)*Math.PI*2);
   }
  }
  for(const [x,y,rx,ry] of this.lakes()){
   for(let a=0;a<Math.PI*2;a+=.15){
    if(noise(a*73+x)<.27)continue;
    const radius=this.lakeRadius(a),px=x+Math.cos(a)*rx*radius,py=y+Math.sin(a)*ry*radius;
    this.stampStone(c,stones,Math.floor(noise(a*47+y)*3),px*w/100,py*h/100,w*(.01+noise(a*63+x)*.008),a);
   }
  }
  c.globalAlpha=1;
  this.paintCrossing(c,w,h,waterPath);
  for(const b of this.bridges){const x=this.river(b.y)*w/100,y=b.y*h/100,dw=b.width*w/100,dh=b.depth*h/100,im=this.image('stoneBridge');if(im.complete&&im.naturalWidth){const height=dw*im.naturalHeight/im.naturalWidth;c.drawImage(im,x-dw/2,y-height/2,dw,height);}else{const old=this.image('bridge');if(old.complete&&old.naturalWidth)c.drawImage(old,130,115,760,525,x-dw/2,y-dh*.8,dw,dh*1.6);}}
  const shade=c.createLinearGradient(0,0,w,h);shade.addColorStop(0,'#112c241d');shade.addColorStop(.5,'#112c2400');shade.addColorStop(1,'#092c3322');c.fillStyle=shade;c.fillRect(0,0,w,h);
 },
 navigate(goal){const c=DungeonRules.campaign,closed=!RegionGates.open(0,c.completed),reachable=M.reachable(closed),cell=W.cell(goal);let target=null,best=1.6;for(let y=Math.max(0,cell.y-4);y<=Math.min(W.height-1,cell.y+4);y++)for(let x=Math.max(0,cell.x-4);x<=Math.min(W.width-1,cell.x+4);x++){if(!reachable[y*W.width+x])continue;const p=W.point(x,y),d=metric(p,goal);if(d<best){best=d;target=p;}}if(!target)return false;const route=MouseNavigation.route(0,c.explorePosition||M.layout.entry,target,closed);if(!route)return false;MouseNavigation.path=route;return true;},
 scene(c,list,toScreen,p){
  for(const o of this.objects){const at=toScreen(o.x,o.y),a=toScreen(o.x+o.width,o.y),height=toScreen(o.x,o.y+o.height).y-at.y,width=a.x-at.x;
   if(at.x<-width||at.x>c.canvas.width+width||at.y<-30||at.y>c.canvas.height+height)continue;
   list.push({y:at.y+(o.solid===false?-1:0),draw:()=>{c.save();if(/^rock[1-6]$/.test(o.art)){const stones=this.image('stoneDetails');if(stones.complete&&stones.naturalWidth)this.stampStone(c,stones,(Number(o.art.slice(-1))-1)%3,at.x,at.y-height*.12,width);else ForestArt.fit(c,this.image('rocks'),at.x,at.y,width,height);c.restore();return;}if(o.art==='ferns')c.filter='brightness(.93) saturate(.85)';const party=[p,...(window.PartyTrail?.formation?.()||[])];if(o.tree&&party.some(q=>Math.abs(q.x-o.x)<o.width*.65&&q.y<o.y+1&&q.y>o.y-o.height))c.globalAlpha=.2;else if(o.solid!==false&&metric(p,o)<2&&p.y<o.y)c.globalAlpha=.45;if(o.flip){c.translate(at.x*2,0);c.scale(-1,1);}const im=this.image(o.cache&&DungeonRules.campaign?.completed.includes(o.cache)?'open':o.art);if(o.cell!==undefined&&im.complete&&im.naturalWidth){const sw=im.naturalWidth/4,sh=im.naturalHeight/3,scale=Math.min(width/sw,height/sh);const inset=Math.min(sw,sh)*.065;c.drawImage(im,o.cell%4*sw+inset,Math.floor(o.cell/4)*sh+inset,sw-inset*2,sh-inset*2,at.x-sw*scale/2,at.y-sh*scale,sw*scale,sh*scale);}else if(o.art==='camp'&&im.complete&&im.naturalWidth){const sh=im.naturalHeight*.965,scale=Math.min(width/im.naturalWidth,height/sh);c.drawImage(im,0,0,im.naturalWidth,sh,at.x-im.naturalWidth*scale/2,at.y-sh*scale,im.naturalWidth*scale,sh*scale);}else ForestArt.fit(c,im,at.x,at.y,width,height);c.restore();}});
  }
  if(DungeonRules.campaign?.completed.includes('m3')){const at=toScreen(83,24);list.push({y:-Infinity,draw:()=>{c.save();const glow=c.createRadialGradient(at.x,at.y,4,at.x,at.y,100);glow.addColorStop(0,'#bef9c588');glow.addColorStop(1,'#88e7b400');c.fillStyle=glow;c.fillRect(at.x-100,at.y-100,200,200);c.restore();}});}

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
const ready=M.ready;M.ready=function(){if(!P.active())return ready.call(this);this.build();return ['stoneBridge','stoneDetails','paintedGround','crossingKit'].every(key=>P.image(key).complete)&&['soil','mud','bridge','courtyard','grass','canopy-conifer','canopy-oak','canopy-sycamore','gate','camp','cave','ancient','moonwell','tower','roots','stump','ferns','rocks','rune','path','water','wood','watermill','waterfall','library','wall','shelter','closed','open'].every(key=>{const im=P.image(key);return im.complete&&im.naturalWidth;});};
for(const owner of [LayeredFoliage,ScenicSeals]){const old=owner.scene;owner.scene=function(...args){if(!P.active())return old.apply(this,args);};}
const landmark=ForestArt.landmark;ForestArt.landmark=function(c,n,at,done,time){if(P.active()&&(n.wildwood||n.id==='crypt-entrance'))return;if(P.active()&&['merchant','m0','m1','m3','forest-spirit'].includes(n.id)){if(n.id==='merchant'&&DungeonRules.campaign?.forestQuest?.ranger)return landmark.call(this,c,n,at,done,time);return;}return landmark.call(this,c,n,at,done,time);};
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
// Once inside the real side dungeon, its existing campaign rules own exploration.
const forestActive=ForestAdventure.active;
ForestAdventure.active=function(value){
 const campaign=value?.campaign||value||DungeonRules.campaign;
 return campaign?.dungeon?.id!=='rootbound'&&forestActive.call(this,value);
};
const visible=ForestAdventure.visible,available=ForestAdventure.available,interact=ForestAdventure.interact;
ForestAdventure.visible=function(c,n){return P.active()&&(n.wildwood||n.id==='crypt-entrance')?true:visible.call(this,c,n);};
ForestAdventure.available=function(c,n){if(P.active()&&n.id==='crypt-entrance')return true;if(P.active()&&(n.wildwood||['roam-0-2','roam-0-3'].includes(n.id)))return !c.completed.includes(n.id);return available.call(this,c,n);};
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
const label=document.createElement('p');label.style.cssText='position:fixed;top:0;left:50%;transform:translateX(-50%);z-index:1000;margin:0;padding:5px 14px;background:#18352e;color:#fff4ce;font:13px system-ui;border-radius:0 0 8px 8px';label.innerHTML='Wildwood · progress saved separately · <a href="index.html" style="color:#ffe09a">Original game</a>';document.body.append(label);
})();
