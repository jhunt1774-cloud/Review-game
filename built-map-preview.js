/* Opt-in built-map experiment. The normal game never enters this adapter. */
(()=>{'use strict';
if(new URLSearchParams(location.search).get('map')!=='modular')return;
ForestAdventure.slot='web-wizardry-built-map-v1';
const W=ForestWorld,M=OpenPaintedMaps,metric=(a,b)=>Math.hypot((a.x-b.x)*1.5,a.y-b.y);
const positions={entry:[15,83],merchant:[20,80],m0:[26,65],m1:[43,36],m2:[57,44],m3:[83,28],'forest-supplies':[29,51],'forest-spirit':[37,75],'forest-ranger':[49,58]};
const P=window.BuiltMapPreview={
 active(){return ForestAdventure.active()&&!DungeonRules.campaign?.dungeon&&(ExploreRules.activeChapter||0)===0;},
 objects:[],
 river(y){return 64+Math.sin((y-44)*.055)*2;},
 ground(p){if(p.x<5||p.x>95||p.y<8||p.y>94)return 0;const water=Math.abs(p.x-this.river(p.y))<3.5;if(water)return Math.abs(p.y-44)<3?3:2;return 1;},
 solid(p,o){return ((p.x-o.x)/o.rx)**2+((p.y-o.y)/o.ry)**2<=1;},
 build(){
  const c=DungeonRules.campaign,q=c.forestQuest,key='built-forest-v1:'+q.ranger+':'+q.boon;
  if(M.layout?.key===key&&W._openKey===key&&W.cells)return;
  const graph=MapRoutes.graphs[0];
  for(const [id,[x,y]]of Object.entries(positions)){const n=FOREST_NODES.find(n=>n.id===id),point=graph.points.get(id);if(n)Object.assign(n,{x,y});if(point)Object.assign(point,{x,y});}
  JOURNEY_CHAPTERS[0].camp=[20,80];
  const gate=RegionGates.gate(0);Object.assign(graph.points.get(gate.a),{x:61,y:44});Object.assign(graph.points.get(gate.b),{x:67,y:44});
  const props=[];
  // Trunks have small physical footprints; their canopies are rendered above actors.
  const protectedPoint=p=>Object.values(positions).some(([x,y])=>metric(p,{x,y})<8)||Math.abs(p.y-44)<6||Math.abs(p.x-this.river(p.y))<7;
  for(let row=0;row<9;row++)for(let col=0;col<13;col++){
   const x=8+col*7+(row%2)*2+Math.sin(row*19+col*7)*1.6,y=14+row*9+Math.cos(col*13+row*3)*2,p={x,y};if(x>93||protectedPoint(p)||(row*13+col)%4===0)continue;
   props.push({...p,rx:1.2,ry:1.1,art:(row+col)%3?'oak':'pine',width:6.6,height:10});
  }
  for(const [x,y]of [[12,55],[35,23],[51,79],[76,68],[87,52]])props.push({x,y,rx:2,ry:1.5,art:'rocks',width:5,height:4});
  // The roots create a visible optional shortcut, cleared by the existing rescue action.
  if(!q.ranger)for(const y of [55,58,61])props.push({x:53,y,rx:1.3,ry:1.8,art:'rocks',width:4,height:4,roots:true});
  this.objects=props;W.chapter=0;W.cells=new Uint8Array(W.width*W.height);W._openKey=key;
  for(let y=0;y<W.height;y++)for(let x=0;x<W.width;x++){const p=W.point(x,y);let cell=this.ground(p);if(cell===1&&props.some(o=>this.solid(p,o)))cell=0;W.cells[y*W.width+x]=cell;}
  const entry=graph.points.get('entry'),nodes=FOREST_NODES.filter(n=>n.chapter===0&&!n.hidden&&!n.global);
  M.layout={key,id:'region-0',chapter:0,theme:'forest',dungeon:false,entry,originalEntry:entry,gate,graph,nodes,props:[],features:[],edges:[],islandEdges:[],islandPoints:[graph.points.get('m3')],islandIds:new Set(['m3']),a:graph.points.get(gate.a),b:graph.points.get(gate.b),ready:true,traversalClean:true,floor:p=>this.ground(p)};
 },
 paint(c,w,h){
  this.build();c.fillStyle='#173b2e';c.fillRect(0,0,w,h);
  const grass=ForestArt.image('grass');if(grass.complete&&grass.naturalWidth){c.fillStyle=c.createPattern(grass,'repeat');c.fillRect(0,0,w,h);}
  // The visible banks and water use exactly the same cells as movement.
  const tw=w/W.width,th=h/W.height,water=ForestArt.image('water'),waterPattern=water.complete&&water.naturalWidth?c.createPattern(water,'repeat'):'#246b79';
  for(let y=0;y<W.height;y++)for(let x=0;x<W.width;x++){
   const p=W.point(x,y),type=this.ground(p);if(type===1)continue;
   c.fillStyle=type===2?waterPattern:type===3?'#95754b':'#173326';c.fillRect(x*tw,y*th,tw+.3,th+.3);
   if(type===2&&[1,3].includes(this.ground({x:p.x+.7,y:p.y}))||type===2&&[1,3].includes(this.ground({x:p.x-.7,y:p.y}))){c.fillStyle='#c6bc88';c.fillRect(x*tw,y*th,tw+.3,th+.3);}
  }
  // Soft continuous bank caps follow the same river function, within one navigation cell.
  for(const side of [-1,1]){c.beginPath();for(let y=8;y<=94;y+=.5){const x=(this.river(y)+side*3.5)*w/100;if(y===8)c.moveTo(x,y*h/100);else c.lineTo(x,y*h/100);}c.strokeStyle='#c6bc88';c.lineWidth=w*.004;c.stroke();}
  // Wide dirt routes suggest direction without constraining the open clearings.
  c.lineCap='round';c.lineJoin='round';for(const points of [[[15,83],[26,65],[29,51],[43,36],[57,44]],[[26,65],[37,75],[49,58],[57,44]],[[68,44],[76,40],[83,28]]]){
   c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x*w/100,y*h/100):c.moveTo(x*w/100,y*h/100));c.strokeStyle='#706d43';c.lineWidth=w*.035;c.stroke();const texture=ForestArt.image('path');c.strokeStyle=texture.complete&&texture.naturalWidth?c.createPattern(texture,'repeat'):'#a49a69';c.lineWidth=w*.027;c.stroke();
  }
  c.strokeStyle='#533e29';c.lineWidth=2;for(let y=41;y<47;y+=.65){c.beginPath();c.moveTo(60*w/100,y*h/100);c.lineTo(68*w/100,y*h/100);c.stroke();}
  for(const o of this.objects){c.fillStyle='#253f2740';c.beginPath();c.ellipse(o.x*w/100,o.y*h/100,o.rx*w/100,o.ry*h/100,0,0,Math.PI*2);c.fill();}
 },
 scene(c,list,toScreen,p){
  for(const o of this.objects){const at=toScreen(o.x,o.y),a=toScreen(o.x+o.width,o.y),height=toScreen(o.x,o.y+o.height).y-at.y;
   list.push({y:at.y,draw:()=>{c.save();if(metric(p,o)<5&&p.y<o.y)c.globalAlpha=.4;ForestArt.fit(c,ForestArt.image(o.art),at.x,at.y,a.x-at.x,height);if(o.roots){c.strokeStyle='#54432e';c.lineWidth=5;c.beginPath();c.moveTo(at.x-15,at.y);c.bezierCurveTo(at.x-5,at.y-30,at.x+15,at.y+5,at.x+20,at.y-20);c.stroke();}c.restore();}});
  }
 },
};
const build=M.build;M.build=function(){return P.active()?P.build():build.call(this);};
const gate=RegionGates.gate;RegionGates.gate=function(chapter){if(P.active()&&chapter===0){const [a,b]=this.edges[0];return {a,b,x:64,y:44,radius:4};}return gate.call(this,chapter);};
const paint=M.paint;M.paint=function(c,w,h){return P.active()?P.paint(c,w,h):paint.call(this,c,w,h);};
const scene=M.scene;M.scene=function(...args){return P.active()?P.scene(...args):scene.apply(this,args);};
const ready=M.ready;M.ready=function(){if(!P.active())return ready.call(this);this.build();return ['grass','path','water','oak','pine','rocks'].every(key=>{const im=ForestArt.image(key);return im.complete&&im.naturalWidth;});};
for(const owner of [LayeredFoliage,ScenicSeals]){const old=owner.scene;owner.scene=function(...args){if(!P.active())return old.apply(this,args);};}
// The small location map must show this terrain, not the original painting.
const mini=ForestFastPlay.map;ForestFastPlay.map=function(c,p){if(P.active()&&ForestRenderer.minimap)document.getElementById('world-overview').style.backgroundImage='url("'+ForestRenderer.minimap+'")';return mini.call(this,c,p);};
for(const method of ['prologue','arrival','world','result']){const old=ForestAdventure[method];ForestAdventure[method]=function(s,...args){const result=old.call(this,s,...args);if(P.active()){
 if(method==='prologue')document.getElementById('prologue-text').innerHTML='<p>Black roots have trapped the forest’s Guardian across the river. Clear Mossgate and the hollow, free the ranger if you can, then defeat the bridge sentinel and reach the Emerald Heart.</p>';
 if(method==='arrival'&&s.phase==='arrival')document.getElementById('arrival-narration').textContent=['A briar imp patrols Mossgate. Clear the road into the forest.','A root-bound wolf prowls the hollow. Defeat it to secure the western trails.','The sentinel guards the bridge. Break its armor to cross the river.','The Guardian waits beyond the bridge, at the northern end of the eastern trail.'][s.encounter];
 if(method==='world'){document.getElementById('forest-canopy').textContent='Take the cleared bridge trail';document.getElementById('forest-canopy').onclick=()=>{const dialog=document.getElementById('map-dialog');if(dialog.open)document.getElementById('close-map-dialog').click();ForestAdventure.walkTo('m3');};const note=document.getElementById('forest-boss-readiness');if(note)note.textContent='Guardian ahead · cross the bridge and follow the eastern trail north.';}
 if(method==='result'&&s.phase==='victory')document.getElementById('result-copy').textContent=['Mossgate is clear. Choose supplies or a spirit shield, then find the hollow.','The hollow is safe. Find the ranger and head east to the bridge.','The bridge is open. Cross the river and follow the northern trail to the Guardian.'][s.encounter]||'The path is clear.';
}return result;};}
const style=document.createElement('style');style.textContent='#start,#continue,#visual-trial-start,#load-lesson,#continue-teacher,#title-world-map-open{display:none!important}';document.head.append(style);
const label=document.createElement('p');label.style.cssText='position:fixed;top:0;left:50%;transform:translateX(-50%);z-index:1000;margin:0;padding:5px 14px;background:#18352e;color:#fff4ce;font:13px system-ui;border-radius:0 0 8px 8px';label.innerHTML='Built-map preview · separate save · <a href="index.html" style="color:#ffe09a">Original game</a>';document.body.append(label);
})();
