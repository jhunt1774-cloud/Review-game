/* One campaign route drives the atlas, objective cue and story travel. */
(()=>{'use strict';
const node=id=>FOREST_NODES.find(n=>n.id===id),done=(c,id)=>c.completed.includes(id),distance=(a,b)=>Math.hypot((a.x-b.x)*1.5,a.y-b.y);
const arc=[
 {name:'The living forest',purpose:'Carry the Emerald Heart toward Asterfall.',link:'The Emerald Heart lights the climb to Frostpeak.',steps:['m0','m1','rootbound','m2','amber-hollow','m3']},
 {name:'The mountain key',purpose:'Win the Storm Key to open Asterfall.',link:'The Storm Key opens the road into Asterfall.',steps:['m4','m5','frostmine','m6','m7']},
 {name:'The First Flame',purpose:'Restore the city machinery and relight the Beacon.',link:'The restored Beacon reveals the road to the coast.',steps:['m8','m9','clockwork-garden','m10','m11']},
 {name:'The lantern road',purpose:'Restore the coastal lantern and clear the highland road.',link:'The lantern guides the supply road to the Sunforge.',steps:['m12','m13','lantern-grotto','m14','m15']},
 {name:'The rebuilding fire',purpose:'Awaken the Sunforge to rebuild the scattered villages.',link:'The Sunforge burns. The rebuilding can begin.',steps:['m16','m17','m18','m19']}
];
const purposes={
 rootbound:'Renew the Keeper’s oath to protect the Heart.',
 'amber-hollow':'Restore the water that sustains the forest.',
 frostmine:'Restore the prism works and bring the expedition home.',
 'clockwork-garden':'Recover the living machinery needed to restore the Beacon.',
 'lantern-grotto':'Restore the tide clock to guide the coastal road.'
};
const positions=[
 {id:'region-0',name:'Forest Path',chapter:0,x:17,y:62,bounds:[2,36,39,48]},
 {id:'rootbound',name:'Rootbound Sanctuary',chapter:0,x:13,y:42,bounds:[5,32,17,21]},
 {id:'amber-hollow',name:'Amber Hollow',chapter:0,x:33,y:69,bounds:[24,61,18,17]},
 {id:'region-1',name:'Frostpeak Pass',chapter:1,x:43,y:23,bounds:[28,3,25,30]},
 {id:'frostmine',name:'Expedition Works',chapter:1,x:23,y:18,bounds:[12,10,18,18]},
 {id:'region-2',name:'Asterfall Beacon',chapter:2,x:57,y:39,bounds:[46,29,22,18]},
 {id:'clockwork-garden',name:'Clockwork Conservatory',chapter:2,x:47,y:51,bounds:[39,44,18,16]},
 {id:'region-3',name:'Sunken Coast',chapter:3,x:70,y:68,bounds:[62,49,24,31]},
 {id:'lantern-grotto',name:'Lantern Haven',chapter:3,x:88,y:73,bounds:[80,64,17,20]},
 {id:'region-4',name:'Ashen Highlands',chapter:4,x:92,y:15,bounds:[77,4,22,38]}
];
const roads=[
 {from:'region-0',to:'region-1',points:[[17,62],[24,52],[27,44],[29,36],[33,29],[43,23]]},
 {from:'region-1',to:'region-2',points:[[43,23],[50,28],[53,33],[57,39]]},
 {from:'region-2',to:'region-3',points:[[57,39],[66,44],[75,49],[76,55],[70,68]]},
 {from:'region-3',to:'region-4',points:[[70,68],[79,59],[83,47],[86,35],[87,25],[92,15]]},
 {from:'region-0',to:'rootbound',points:[[17,62],[22,53],[20,45],[13,42]]},
 {from:'region-0',to:'amber-hollow',points:[[17,62],[23,65],[28,66],[33,69]]},
 {from:'region-1',to:'frostmine',points:[[43,23],[35,27],[29,23],[23,18]]},
 {from:'region-2',to:'clockwork-garden',points:[[57,39],[54,44],[50,47],[47,51]]},
 {from:'region-3',to:'lantern-grotto',points:[[70,68],[78,65],[84,67],[88,73]]}
];
function stopDone(c,id){const stop=RequiredStory.stops.find(s=>s.id===id);return stop?stop.goals.every(g=>done(c,g)):done(c,id);}
function entrance(id){return node(id==='rootbound'?'crypt-entrance':id+'-entrance');}
function exit(id){return node(id==='rootbound'?'crypt-exit':id+'-exit');}
function task(c,id){const n=node(id);return n?{...n,task:n.name,purpose:arc[c.viewChapter].purpose}:null;}
const Guide=window.JourneyGuide={
 arc,positions,roads,purposes,traveling:false,routeCache:null,state:null,
 step(c){return arc[c.viewChapter]?.steps.find(id=>!stopDone(c,id))||null;},
 allowed(c,n){if(window.GamePlaytest?.active())return true;if(!/^m\d+$/.test(n.id))return true;return done(c,n.id)||this.step(c)===n.id;},
 target(c){
  const area=c.dungeon?.id;
  if(area){
   let id;
   if(area==='rootbound')id=!done(c,'crypt-runes')?'crypt-runes':!done(c,'crypt-guardian')?'crypt-guardian':'crypt-exit';
   else if(area==='frostmine')id=!done(c,'frostmine-brace')?'frostmine-brace':!done(c,'frostmine-rescue')&&c.mineRescue!=='following'&&c.mineRescue!=='safe'?'frostmine-rescue':!done(c,'frostmine-lock')?'frostmine-lock':!done(c,'frostmine-overseer')?'frostmine-overseer':'frostmine-exit';
   else id=!done(c,area+'-puzzle')?area+'-puzzle':!done(c,area+'-boss')?area+'-boss':area+'-exit';
   const n=task(c,id);if(n){n.purpose=purposes[area];if(n.kind==='dungeon-exit')n.task=area==='frostmine'&&c.mineRescue==='following'?'Escort the expedition home':'Return to '+JOURNEY_CHAPTERS[c.viewChapter].name;}return n;
  }
  const missing=window.GamePlaytest?.active()?null:RequiredStory.missing(c,c.viewChapter-1)[0];
  if(missing){const at=OpenPaintedMaps.layout?.entry;return at?{...at,id:'story-retrace',kind:'region-link',to:missing.chapter,task:'Return to '+JOURNEY_CHAPTERS[missing.chapter].name,purpose:purposes[missing.id]}:null;}
  const id=this.step(c);
  if(id){const n=RequiredStory.stops.some(s=>s.id===id)?entrance(id):node(id);return n?{...n,task:n.name,purpose:purposes[id]||arc[c.viewChapter].purpose}:null;}
  if(c.viewChapter<arc.length-1&&RequiredStory.canVisit(c,c.viewChapter+1)){
   const at=node('m'+(c.viewChapter*4+3));
   return {...at,id:'story-road-'+c.viewChapter,kind:'region-link',to:c.viewChapter+1,task:'Road to '+JOURNEY_CHAPTERS[c.viewChapter+1].name,purpose:arc[c.viewChapter].link};
  }
  return null;
 },
 goalLine(c){const n=this.target(c);return n?'Next · '+n.task:arc[c.viewChapter].link;},
 regionComplete(c,i){return arc[i].steps.every(id=>stopDone(c,id));},
 bind(s){this.state=s;this.routeCache=null;this.ensureUI();this.renderAtlas(s.campaign);},
 nextPoint(c,p,target,now=Date.now()){
  const key=OpenPaintedMaps.key()+':'+target.id+':'+c.completed.join('|'),old=this.routeCache,closed=!RegionGates.open(c.viewChapter,c.completed);
  let route=old?.points,nearest=0,best=Infinity;
  if(route)for(let i=0;i<route.length;i++){const d=distance(p,route[i]);if(d<best){best=d;nearest=i;}}
  if(!old||old.key!==key||(best>4&&now-old.time>600)||route?.length&&!ForestWorld.stepClear(p,route[nearest],closed?[RegionGates.gate(c.viewChapter)]:[])){
   route=ForestWorld.route(p,target,closed)||null;this.routeCache={key,points:route,time:now};nearest=0;
  }
  if(!route?.length)return null;
  // Pick a point ahead on actual walkable ground, never a straight bearing through a wall.
  let aim=null;const barriers=closed?[RegionGates.gate(c.viewChapter)]:[];for(let i=nearest;i<route.length;i++){if(distance(p,route[i])<.25)continue;if(!ForestWorld.stepClear(p,route[i],barriers))break;aim=route[i];if(distance(p,aim)>=4)break;}return aim;
 },
 async transition(label,action){
  if(this.traveling)return false;this.traveling=true;MouseNavigation.clear();this.ensureUI();
  const el=this.ui.crossing;el.textContent=label;el.hidden=false;
  const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  try{await pause(180);await action();await pause(180);return true;}
  catch(error){window.GameDiagnostics?.report(error);return false;}
  finally{el.hidden=true;this.traveling=false;this.onsettled?.(); }
 }
};
// Direct travel applies only after the player deliberately uses E / Enter.
const modal=MineExpansion.modal;
MineExpansion.modal=function(title,text,choices,s,ui){
 if(Guide.traveling&&choices.some(c=>/^Travel there/.test(c.label))){
  const choice=choices.find(c=>/^Travel there/.test(c.label));if(choice.act()!==false)ui.world();return {panel:null,status:null};
 }
 return modal.call(this,title,text,choices,s,ui);
};
})();

/* Atlas and small route-aware marker; no automatic walking or fast travel. */
(()=>{
 const G=JourneyGuide,el=id=>document.getElementById(id),make=(tag,id,parent)=>{const e=document.createElement(tag);if(id)e.id=id;if(parent)parent.append(e);return e;};
 G.ensureUI=function(){
  if(this.ui)return;
  const world=el('world'),toolbar=el('crypt-interact').parentElement;
  const button=make('button','open-world-atlas',toolbar?.append?toolbar:el('world-controls'));button.textContent='World map';button.onclick=()=>this.openAtlas();
  const arrow=make('div','story-direction',world);arrow.setAttribute('aria-hidden','true');arrow.hidden=true;
  arrow.innerHTML='<svg viewBox="0 0 40 40" width="34" height="34"><path d="M34 20 7 6 14 20 7 34Z" fill="#f7d58a" stroke="#17252a" stroke-width="3" stroke-linejoin="round"/></svg>';
  const goal=make('div','story-target-pin',world);goal.setAttribute('aria-hidden','true');goal.textContent='◇';goal.hidden=true;
  const road=make('div','story-road-sign',world);road.hidden=true;road.setAttribute('aria-hidden','true');
  const crossing=make('div','journey-crossing',el('game'));crossing.setAttribute('role','status');crossing.hidden=true;
  const dialog=make('dialog','world-atlas',el('game'));dialog.setAttribute('aria-label','World map and story journey');
  const head=make('div',null,dialog);head.className='atlas-heading';
  const title=make('h2',null,head);title.textContent='The road to Asterfall';
  const close=make('button',null,head);close.textContent='Back to journey ×';close.onclick=()=>dialog.close();
  const purpose=make('p','atlas-purpose',dialog),scroll=make('div',null,dialog);scroll.className='atlas-scroll';
  const map=make('div','atlas-map',scroll),image=make('img',null,map);image.src='assets/asterfall-world-atlas.webp?v=20261024-1';image.alt='One connected country: forest, mountain pass, Asterfall, coast and the northeastern Sunforge.';
  const paths=make('div','atlas-roads',map);paths.setAttribute('aria-hidden','true');
  const pins=make('div','atlas-pins',map),info=make('div','atlas-selection',dialog);info.setAttribute('aria-live','polite');
  const next=make('p','atlas-next',dialog),legend=make('p',null,dialog);legend.className='atlas-legend';legend.textContent='◆ You are here · Gold = next story stop · ✓ Restored · Dim = ahead';
  dialog.onclose=()=>{if(this.state?.phase==='world')this.onsettled?.();};
  this.ui={button,arrow,goal,road,crossing,dialog,purpose,map,scroll,paths,pins,info,next};
 };
 G.currentArea=c=>c.dungeon?.id||'region-'+c.viewChapter;
 G.status=function(c,zone){
  const current=this.currentArea(c)===zone.id,complete=zone.id.startsWith('region-')?this.regionComplete(c,zone.chapter):RequiredStory.stops.find(s=>s.id===zone.id).goals.every(id=>c.completed.includes(id));
  const next=this.target(c),nextArea=next?.kind==='region-link'?'region-'+next.to:next?.kind==='dungeon'?next.id==='crypt-entrance'?'rootbound':next.id.replace(/-entrance$/,''):this.currentArea(c);
  return {current,complete,next:nextArea===zone.id&&!complete,unlocked:zone.chapter===0||c.completed.includes('m'+(zone.chapter*4-1))&&RequiredStory.canVisit(c,zone.chapter)};
 };
 G.selectArea=function(c,zone){
  const status=this.status(c,zone),purpose=zone.id.startsWith('region-')?this.arc[zone.chapter].purpose:this.purposes[zone.id];
  this.ui.info.textContent=zone.name+' · '+(status.current?'You are here':status.complete?'Restored':status.unlocked?'On your route':'Ahead on the journey')+'. '+purpose;
 };
 G.renderAtlas=function(c){
  this.ensureUI();const key=this.currentArea(c)+':'+c.completed.join('|')+':'+c.mineRescue;if(key===this.atlasKey)return;this.atlasKey=key;
  this.ui.purpose.textContent=this.arc[c.viewChapter].purpose;this.ui.next.textContent=this.goalLine(c);
  this.ui.paths.innerHTML='<svg viewBox="0 0 1500 1000" preserveAspectRatio="none">'+this.roads.map(r=>{
   const from=this.positions.find(p=>p.id===r.from),to=this.positions.find(p=>p.id===r.to),a=this.status(c,from),b=this.status(c,to),tone=b.complete?'restored':b.next||a.current?'active':'ahead';
   return '<polyline class="'+tone+'" points="'+r.points.map(p=>(p[0]*15)+','+(p[1]*10)).join(' ')+'"/>';
  }).join('')+'</svg>';
  this.ui.pins.replaceChildren();
  for(const zone of this.positions){const status=this.status(c,zone),pin=make('button',null,this.ui.pins);pin.className='atlas-pin';pin.style.left=zone.x+'%';pin.style.top=zone.y+'%';pin.dataset.current=String(status.current);pin.dataset.complete=String(status.complete);pin.dataset.next=String(status.next);pin.dataset.locked=String(!status.unlocked);pin.textContent=(status.current?'◆ ':status.complete?'✓ ':'')+zone.name;pin.setAttribute('aria-label',pin.textContent+(status.next?' · Next story stop':''));pin.onclick=()=>this.selectArea(c,zone);}
  this.selectArea(c,this.positions.find(p=>p.id===this.currentArea(c)));
 };
 G.openAtlas=function(){if(!this.state||this.traveling)return;this.renderAtlas(this.state.campaign);MouseNavigation.clear();if(!this.ui.dialog.open)this.ui.dialog.showModal();const zone=this.positions.find(p=>p.id===this.currentArea(this.state.campaign));this.ui.scroll.scrollLeft=Math.max(0,(this.ui.map.clientWidth||920)*zone.x/100-(this.ui.scroll.clientWidth||920)/2);this.ui.scroll.scrollTop=Math.max(0,(this.ui.map.clientHeight||613)*zone.y/100-(this.ui.scroll.clientHeight||450)/2);};
 G.update=function(s,p,frame){
  this.state=s;this.ensureUI();const c=s.campaign,target=this.target(c),ui=this.ui;
  const objective=el('world-objective'),line=this.goalLine(c);if(objective.textContent!==line)objective.textContent=line;
  this.renderAtlas(c);
  const hide=()=>{ui.arrow.hidden=true;ui.goal.hidden=true;ui.road.hidden=true;};
  if(!target||this.traveling||ui.dialog.open){hide();return;}
  const screen=q=>({x:q.x/100*frame.size.width-frame.camera.x,y:q.y/100*frame.size.height-frame.camera.y}),at=screen(p),goal=screen(target),distance=ExplorationLayout.distance(p,target);
  ui.road.hidden=target.kind!=='region-link'||goal.x<40||goal.x>frame.width-40||goal.y<100||goal.y>frame.height-100;if(!ui.road.hidden){ui.road.textContent=target.task+' →';ui.road.style.left=goal.x+'px';ui.road.style.top=(goal.y-48)+'px';}
  ui.goal.hidden=target.kind==='region-link'||goal.x<18||goal.x>frame.width-18||goal.y<100||goal.y>frame.height-120;
  if(!ui.goal.hidden){ui.goal.style.left=goal.x+'px';ui.goal.style.top=(goal.y-32)+'px';}
  const next=this.nextPoint(c,p,target);
  ui.arrow.hidden=!next||distance<2.3;
  if(next&&!ui.arrow.hidden){const q=screen(next),dx=q.x-at.x,dy=q.y-at.y,len=Math.hypot(dx,dy)||1;
   ui.arrow.style.left=Math.max(26,Math.min(frame.width-26,at.x+dx/len*70))+'px';
   ui.arrow.style.top=Math.max(118,Math.min(frame.height-150,at.y+dy/len*70))+'px';
   ui.arrow.style.transform='translate(-50%,-50%) rotate('+Math.atan2(dy,dx)+'rad)';
  }
 };
 const remaining=RegionGates.remaining;
 RegionGates.remaining=function(chapter,completed){if(DungeonRules.campaign?.dungeon)return remaining.call(this,chapter,completed);return FOREST_NODES.filter(n=>n.chapter===chapter&&/^m\d+$/.test(n.id)&&n.encounter%4!==3&&!completed.includes(n.id));};
 for(const [id,purpose]of Object.entries(G.purposes)){const n=FOREST_NODES.find(n=>n.id===(id==='rootbound'?'crypt-entrance':id+'-entrance'));if(n)n.description=purpose;}
})();

