/* Painted maps and traversal share the same ground. No new routes across scenery. */
(() => {
 'use strict';
 const W=ForestWorld,$=id=>document.getElementById(id),metric=(a,b)=>Math.hypot((a.x-b.x)*1.5,a.y-b.y);
 const M=window.MapTraversal={mode:'clear',cache:null,
  lighting(){const key=$('world').dataset.forestQuest+':'+$('world').dataset.forestRestored;if(this.light?.key!==key)this.light={key,filter:getComputedStyle(ForestRenderer.terrain).filter};return this.light.filter;},
  set(mode){this.mode=mode==='painted'?'painted':'clear';try{localStorage.setItem('asterfall-ground-view',this.mode);}catch{}this.cache=null;ForestRenderer._openLayout=null;},
  overlay(){
   const l=OpenPaintedMaps.layout,c=DungeonRules.campaign,closed=!RegionGates.open(l.chapter,c.completed),key=l.key+':'+closed;
   if(this.cache?.key===key&&this.cache.floor===W.cells)return this.cache.canvas;
   const reachable=OpenPaintedMaps.reachable(closed),open=OpenPaintedMaps.reachable(false),canvas=document.createElement('canvas');canvas.width=300;canvas.height=200;const context=canvas.getContext('2d'),image=context.createImageData(300,200),pass=i=>i>=0&&i<60000&&[1,3].includes(W.cells[i])&&open[i];
   for(let i=0;i<60000;i++){
    const at=i*4,x=i%300,y=Math.floor(i/300),ground=pass(i),edge=ground&&(x===0||x===299||y===0||y===199||!pass(i-1)||!pass(i+1)||!pass(i-300)||!pass(i+300));
    const color=ground?(reachable[i]?edge?[235,211,151,135]:[229,213,165,12]:edge?[231,157,105,150]:[77,39,29,43]):[5,18,19,36];
    image.data.set(color,at);
   }
   context.putImageData(image,0,0);this.cache={key,floor:W.cells,canvas};return canvas;
  },
  click(chapter,start,goal,closed,route){
   MouseNavigation.lastResult=null;
   if(W.walkable(goal)){
    const path=route(chapter,start,goal,closed);MouseNavigation.lastResult={snapped:false,reason:path?'':'No connected route here. Use the marked crossing; sealed passages open through the story.'};return path;
   }
   // Small targeting forgiveness only. A distant cliff, roof or water click stays blocked.
   const reachable=OpenPaintedMaps.reachable(closed),cell=W.cell(goal);let best=null;
   for(let y=Math.max(1,cell.y-4);y<=Math.min(198,cell.y+4);y++)for(let x=Math.max(1,cell.x-4);x<=Math.min(298,cell.x+4);x++){
    if(!reachable[y*300+x])continue;const p=W.point(x,y),d=metric(goal,p);if(d<=1.6&&(!best||d<best.d))best={...p,d};
   }
   const path=best?route(chapter,start,best,closed):null;MouseNavigation.lastResult={snapped:!!path,reason:path?'':'That is scenery or an edge. Click the highlighted ground or a destination marker.'};return path;
  }
 };
 try{M.mode=localStorage.getItem('asterfall-ground-view')==='painted'?'painted':'clear';}catch{}
 const label=document.createElement('label');label.textContent='Map ground';const select=document.createElement('select');select.id='map-ground-view';select.innerHTML='<option value="clear">Clear paths · show ground edges</option><option value="painted">Original painting</option>';select.value=M.mode;select.onchange=()=>M.set(select.value);label.append(select);$('movement-mode').after(label);
 const attach=ForestAdventure.attach;ForestAdventure.attach=function(...args){const result=attach.apply(this,args),board=$('forest-trail-board'),button=document.createElement('button');button.id='forest-panel-toggle';button.type='button';button.textContent='Hide route panel';button.setAttribute('aria-expanded','true');button.onclick=()=>{const compact=board.dataset.compact!=='true';board.dataset.compact=String(compact);button.textContent=compact?'Show route & preparations':'Hide route panel';button.setAttribute('aria-expanded',String(!compact));};board.prepend(button);return result;};

 // Discard unreachable specks, not legitimate paths or the separately sealed final area.
 const build=OpenPaintedMaps.build;let cleaning=false;
 OpenPaintedMaps.build=function(){build.call(this);const l=this.layout;if(cleaning||!l?.ready||l.traversalClean)return;cleaning=true;
  try{const open=this.reachable(false);let removed=0;for(let i=0;i<60000;i++)if([1,3].includes(W.cells[i])&&!open[i]){W.cells[i]=0;removed++;}l.traversalClean=true;l.removedSpecks=removed;if(removed)l.reach=null;
   for(const branch of DestinationRoutes.regions.find(r=>r.id===l.id)?.branches||[]){const n=FOREST_NODES.find(n=>n.id===branch.id);if(!n)continue;branch.gate=[n.x,n.y];const path=W.route(l.entry,n,true);if(path){branch.points=path.slice(-16).map(p=>[p.x,p.y]);branch.join=branch.points[0];}const feature=IntegratedMapArt.maps[l.id]?.features.find(f=>f.id===branch.id);if(feature)Object.assign(feature,{x:n.x,y:n.y});}
  }finally{cleaning=false;}
 };
 const paint=OpenPaintedMaps.paint;OpenPaintedMaps.paint=function(c,w,h){paint.call(this,c,w,h);if(M.mode==='clear')c.drawImage(M.overlay(),0,0,w,h);};
 const upgrade=OpenPaintedMaps.upgrade;OpenPaintedMaps.upgrade=function(){const c=DungeonRules.campaign,key=M.mode+':'+(c?RegionGates.open(c.viewChapter,c.completed):false);if(this.groundViewKey!==key){this.groundViewKey=key;ForestRenderer._openLayout=null;}return upgrade.call(this);};

 // Cardinal input can follow an angled tread instead of snagging on its raster edge.
 // Each candidate still passes the original continuous, gate-aware collision check.
 const move=W.move;
 W.move=function(p,dx,dy,seconds,barriers=[]){
  const result=move.call(this,p,dx,dy,seconds,barriers),length=Math.hypot(dx,dy);if(!length||!OpenPaintedMaps.enabled()||!this.walkable(p))return result;
  const budget=ExploreRules.speed*Math.min(.08,Math.max(0,seconds)),ux=dx/length,uy=dy/length,forward=q=>(q.x-p.x)*1.5*ux+(q.y-p.y)*uy;
  if(budget<=0||forward(result)>=budget*.45)return result;
  let best=result,score=forward(result);const amount=Math.min(budget,.24);
  for(const degrees of [20,-20,35,-35,50,-50,60,-60]){const a=degrees*Math.PI/180,x=ux*Math.cos(a)-uy*Math.sin(a),y=ux*Math.sin(a)+uy*Math.cos(a),q={x:p.x+x*amount/1.5,y:p.y+y*amount},value=forward(q);if(value>score&&this.stepClear(p,q,barriers)){best=q;score=value;}}
  // A raster stair corner sometimes needs a short sideways step before advancing.
  // Require a clear forward continuation within one cell; do not drift along a wall.
  if(score<budget*.1)for(const distance of [.15,.3,.45,.6])for(const sign of [-1,1]){
   const side={x:p.x-uy*distance*sign/1.5,y:p.y+ux*distance*sign},ahead={x:side.x+ux*.15/1.5,y:side.y+uy*.15};
   if(this.stepClear(p,side,barriers)&&this.stepClear(side,ahead,barriers)){const step=Math.min(amount,distance);return {x:p.x-uy*step*sign/1.5,y:p.y+ux*step*sign};}
  }
  return best;
 };
 const route=MouseNavigation.route;MouseNavigation.route=function(chapter,start,goal,closed){return OpenPaintedMaps.enabled()?M.click(chapter,start,goal,closed,route.bind(this)):route.call(this,chapter,start,goal,closed);};
 const connections={
  'crypt-entrance':['river-bank trail north of the bridge','Follow the west-bank trail north of the bridge to Rootbound Sanctuary.','Return through the southern sanctuary arch to the west bank of Forest Path.'],
  'amber-hollow-entrance':['southeastern terrace trail','Cross the timber bridge, follow the eastern terraces south, then take the side trail into Amber Hollow.','Leave by the southeastern stairs to return to the eastern terraces of Forest Path.'],
  'frostmine-entrance':['northwestern cave mouth','Follow Frostpeak’s western switchbacks to the northwestern cave mouth, beside the upper waterfall.','Leave by the northwestern mine passage to return beside Frostpeak’s upper waterfall.'],
  'clockwork-garden-entrance':['western garden path','Take the garden path from the western edge of Asterfall into the conservatory.','Leave through the southwest glasshouse entrance to return to Asterfall’s western garden path.'],
  'lantern-grotto-entrance':['eastern shore passage','Follow the eastern shore passage beyond the upper landing to Lantern Haven.','Leave by the southeastern harbor passage to return to the eastern shore of Sunken Coast.']
 };
 for(const [id,[landmark,outward,back]]of Object.entries(connections)){const r=StoryConnections[id];Object.assign(r,{landmark,outward,return:back});const n=FOREST_NODES.find(n=>n.id===id);if(n)n.description=outward;const exit=FOREST_NODES.find(n=>n.id===(r.id==='rootbound'?'crypt-exit':r.id+'-exit'));if(exit)exit.description=back;const d=SideGeography.get(r.id),story=StoryDestinations[r.id];d.description=r.arrival+' '+story.story+' '+story.route;}
 // The regional paintings were replaced after the original scripts were written.
 // Keep the plot and rewards, but locate scenes on the visible terraces and landings.
 const scenes={
  m2:['The sentinel holds the eastern landing of the river bridge. Seren reads its weathered oath: “Only those who understand the old words may cross.” Black roots have twisted the command.','The eastern landing is clear. The terrace trail continues southeast to Amber Hollow. After restoring its sluice, return across the bridge and climb the western Moonwell stairs to the Guardian.'],
  m5:['The frost wolf blocks the central stair landing above the lower bridge. Ice gathers in its breath as Lira studies the narrow approach. “Stay on the tread. We have room to hold our ground.”','The wolf withdraws from the landing. The western switchbacks reach Crystal Spring and the expedition cave; the central ascent continues toward the watchtower.'],
  m7:['At the northern summit court, the Storm Drake guards the way through a ruined stone arch. The Storm Key gleams between its horns. Thorin raises the Emerald Heart as thunder crosses the ridge.','The drake lowers its horns and releases the Storm Key. Beyond the summit arch lies the road to Asterfall.'],
  m9:['A shadow gathers in the northwestern library court. Loose pages spiral from the pavilion doorway around a book of golden letters. Seren recognizes the First Flame’s words.','The book reveals how Heart, Key and Ember can relight the Beacon. The western garden path reaches the conservatory; the ember relay waits on the southern court.'],
  m10:['The southern relay court is cold and dark. An ember sentinel carries the last living spark in its chest. Thorin sets the Emerald Heart beside the old relay. “Give us the flame. We will carry it to the Beacon.”','The relay catches light. Thorin takes the Living Ember; the northern terraces lead to Nightroot at the northeastern Beacon court.'],
  m11:['Nightroot binds the Beacon above the northeastern court. Thorin places Heart, Key and Ember in their ancient sockets. The shadow that poisoned the forest rises to defend its stolen light.',null],
  m12:['Footprints cross the upper eastern wreck landing. A damaged boat lies below the coastal stairs, and no light answers from the western lantern. A saltfang marauder steps from the rocks.','The marauder retreats along the shore. Blue lantern glass marks the descending stairs toward Tideglass Landing and its stranded keeper.'],
  m13:['At Tideglass Landing, beside the lower boats, a keeper’s lantern flickers with a restless shadow. The specter repeats a warning: “The guardian is bound beyond the causeway.” Seren reaches for its old runes.','Seren steadies the flame. The keeper asks for help at Lantern Haven, through the eastern shore passage. Beyond the southern shore crossing, the long western causeway reaches the Drowned Lantern.'],
  m14:['A coral-armored sentinel blocks the southern shore crossing. The bridge links the lower coastal terraces; the route then bends west along the beach toward the lantern causeway. Brom braces his hammer against the rail.','The sentinel yields. Follow the lower shore west, then cross the stone causeway to the lighthouse platform. The sea guardian waits there.'],
  m15:['Across the western causeway, the Stormbound Leviathan coils around the Drowned Lantern. Black chains bind its wings above the lighthouse platform. Thorin lifts the Emerald Heart. “We will not leave you in these chains.”',null],
  m16:[null,'The caravan landing is safe. Camp lies below; the eastern stairs climb toward Obsidian Watch on the northeastern terrace.'],
  m17:[null,'The forge key is recovered. Cross the great upper bridge west, then descend to the bell platform on the central western terrace.'],
  m18:[null,'The bell rings across the ravine. Return along the upper western terrace, then climb the short northwestern approach to the Sunforge. The great chasm bridge is behind you.']
 };
 for(const [id,[arrival,victory]]of Object.entries(scenes)){if(arrival)FOREST_STORY.areas[id].arrival=arrival;if(victory)FOREST_STORY.areas[id].victory=victory;}
 for(const [id,name]of [['m10','Southern Relay Court'],['m13','Tideglass Landing'],['m14','Southern Shore Crossing']]){FOREST_NODES.find(n=>n.id===id).name=name;FOREST_ENCOUNTERS[Number(id.slice(1))].name=name;}
 FOREST_STORY.objectives=FOREST_STORY.objectives.map(text=>text.replaceAll('Beacon Causeway','Southern Relay Court').replaceAll('Tideglass Cavern','Tideglass Landing'));
 // Make existing entrance/exit anchors look deliberate on the painted tread.
 const landmark=ForestArt.landmark;ForestArt.landmark=function(c,n,at,done,time){const result=landmark.call(this,c,n,at,done,time);if(!['dungeon','dungeon-exit'].includes(n.kind))return result;c.save();c.translate(at.x,at.y);c.strokeStyle=n.kind==='dungeon-exit'?'#a9e0db':'#e4cb8e';c.lineWidth=2;c.fillStyle='#0c2424d9';c.beginPath();c.ellipse(0,1,17,7,0,0,Math.PI*2);c.fill();c.stroke();for(const x of [-5,4]){c.beginPath();c.moveTo(x-3,-2);c.lineTo(x+2,1);c.lineTo(x-3,4);c.stroke();}c.restore();return result;};
})();
