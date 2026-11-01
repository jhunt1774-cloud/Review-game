/* A short, separately saved quest built from the existing forest campaign. */
(() => {
 'use strict';
 const $ = id => document.getElementById(id);
 const steps = ['m0', 'm1', 'm2', 'm3'];
 const distance = (a, b) => Math.hypot((a.x - b.x) * 1.5, a.y - b.y);
 const node = id => FOREST_NODES.find(n => n.id === id);
 const sites = [
  {id:'forest-supplies',name:'Ranger’s supply cache',x:22,y:68,kind:'forest-find',description:'Choose supplies: two extra healing potions. Taking supplies closes the spirit blessing.'},
  {id:'forest-spirit',name:'Moonwell spirit',x:33,y:63,kind:'forest-find',description:'Choose protection: a shield against the Guardian’s first strike. This closes the supply cache.'},
  {id:'forest-ranger',name:'Ranger caught in roots',x:40,y:61,kind:'forest-find',description:'Free the ranger to learn the Guardian’s changing weaknesses and begin its fight with two focus.'}
 ];
 for (const site of sites) FOREST_NODES.push({...site,chapter:0,stage:0,hidden:true,optional:true,forestFind:true});
 let current = null, api = null, mode = false;
 const Q = window.ForestAdventure = {
  steps, sites, slot:'web-wizardry-forest-v1',
  active(value = current) { return !!(value?.campaign ? value.adventure === 'forest-quest' : value?.forestQuest?.version === 1); },
  defaults() { return {version:1,boon:null,ranger:false,bossPrepared:false,shortcut:false,returnPoint:null,walkingSeconds:0}; },
  valid(s) {
   if (s.adventure === undefined) return !s.campaign?.forestQuest;
   const q = s.campaign?.forestQuest;
   return s.adventure === 'forest-quest' && q?.version === 1 && s.campaign.viewChapter === 0 && !s.campaign.dungeon &&
    [null,'supplies','spirit'].includes(q.boon) && ['ranger','bossPrepared','shortcut'].every(k => typeof q[k] === 'boolean') &&
    Number.isFinite(q.walkingSeconds) && q.walkingSeconds >= 0 && (!q.returnPoint ||
     Number.isFinite(q.returnPoint.x) && Number.isFinite(q.returnPoint.y) && q.returnPoint.chapter === 0 &&
     q.returnPoint.x >= 1 && q.returnPoint.x <= 99 && q.returnPoint.y >= 1 && q.returnPoint.y <= 99);
  },
  complete(c) { return steps.every(id => c.completed.includes(id)); },
  next(c) { return steps.find(id => !c.completed.includes(id)); },
  visible(c, n) { return n.id === 'merchant' || steps.includes(n.id) || c.completed.includes('m0') && sites.some(s => s.id === n.id); },
  available(c, n) {
   if (!this.active(c)) return false;
   if (n.id === 'merchant') return true;
   if (steps.includes(n.id)) return this.next(c) === n.id;
   if (c.completed.includes(n.id) || this.complete(c) || !c.completed.includes('m0')) return false;
   return n.id === 'forest-ranger' ? !c.forestQuest.ranger : !c.forestQuest.boon;
  },
  encounter(s, e) {
   if (!this.active(s)) return e;
   // Keep the boss's three phases; trim repeated questions in the opening fights.
   return {...e,hp:Math.round(e.hp * (s.encounter === 3 ? .85 : .78)),damage:Math.round(e.damage * .9)};
  },
  prepareBattle(s, retry = false) {
   if (!this.active(s) || s.campaign.battleNode !== 'm3') return;
   const q = s.campaign.forestQuest;
   if (q.bossPrepared && !retry) return;
   q.bossPrepared = true;
   if (q.boon === 'spirit') s.campaign.shield = 1;
   if (q.ranger) s.campaign.focus = Math.max(2, s.campaign.focus);
  },
  interact(s, n, ui) {
   const c=s.campaign, q=c.forestQuest;
   if (!this.available(c,n)) return;
   let messageAfter = '';
   const finish = message => {
    if (!c.completed.includes(n.id)) c.completed.push(n.id);
    messageAfter=message;ui.log(message);ui.save();ui.reward?.(['quest-complete']);
    return true;
   };
   const choices = n.id === 'forest-ranger' ? [
    {label:'Cut the roots · learn the Guardian’s weaknesses',act:()=>{if(!this.available(c,n))return false;q.ranger=true;return finish('Ranger rescued! Guardian: axe, then hammer, then fire. Start its battle with 2 focus.');}},
    {label:'Share 1 potion · rescue the ranger and heal the party',act:()=>{
     if(!this.available(c,n)||c.potions<1)return false;
     c.potions--;s.hp=s.hp.map((hp,i)=>Math.min(api.maxHp(i),hp+Math.ceil(api.maxHp(i)*.4)));q.ranger=true;
     return finish('Ranger rescued! Party healed 40%. Guardian: axe → hammer → fire. Start with 2 focus.');
    },disabled:c.potions<1}
   ] : [{label:n.id==='forest-supplies'?'Take supplies · +2 healing potions':'Free the spirit · shield the first Guardian strike',act:()=>{
    if(!this.available(c,n))return false;
    q.boon=n.id==='forest-supplies'?'supplies':'spirit';
    if(q.boon==='supplies')c.potions=Math.min(99,c.potions+2);
    return finish(q.boon==='supplies'?'Supplies chosen: +2 potions. The spirit keeps its blessing.':'Spirit freed: the first Guardian strike is shielded. The ranger keeps the supplies.');
   }}];
   MineExpansion.modal(n.name,n.description,choices,s,{...ui,world(){ui.world();if(messageAfter)ui.notice(n.name,messageAfter);}});
  },
  attach(game) {
   api=game;
   const card=document.createElement('section');card.id='forest-quest-card';card.className='forest-quest-card';
   card.innerHTML='<span class="eyebrow">FOREST PATH · A COMPLETE SHORT QUEST</span><h2>Wake the Emerald Heart</h2><p>Four heroes. Three dangers. One Guardian. Choose your preparations and bring the forest back to life.</p><div class="forest-quest-actions"><button id="forest-quest-start" class="primary">Play forest quest →</button><button id="forest-quest-continue">Continue forest quest</button></div><p id="forest-quest-note" class="small" role="status">Designed for a short classroom session. Saved separately from the full campaign.</p>';
   $('title').insertBefore(card,$('title').querySelector('.title-actions'));
   $('start').textContent='Start full campaign →';
   $('forest-quest-start').onclick=()=>this.start();
   $('forest-quest-continue').onclick=()=>{delete $('forest-quest-start').dataset.confirm;this.pendingLesson=null;$('forest-quest-start').textContent='Play forest quest →';api.continue();};
   const panel=document.createElement('section');panel.id='forest-trail-board';panel.hidden=true;
   panel.setAttribute('aria-label','Forest quest route and preparations');
   panel.innerHTML='<strong id="forest-trail-heading">The Emerald Heart</strong><div id="forest-route-steps"></div><p id="forest-preparations"></p><div class="forest-trail-actions"><button id="forest-follow">Follow gold trail</button><button id="forest-camp">Return to camp</button><button id="forest-return" hidden>Return to trail</button><button id="forest-canopy" hidden>Use canopy shortcut</button><button id="forest-recap" hidden>Quest recap</button></div><p class="forest-legend">◆ Gold: next goal · ✦ Blue: optional help · ✓ Green: completed</p>';
   $('world').append(panel);
   $('forest-follow').onclick=()=>api.follow();
   $('forest-camp').onclick=()=>api.camp();
   $('forest-return').onclick=()=>api.returnToTrail();
   $('forest-canopy').onclick=()=>api.canopy();
   $('forest-recap').onclick=()=>api.recap();
   this.refreshTitle();
   window.addEventListener('load',()=>{
    const button=document.createElement('button');button.id='teacher-forest-quest';button.textContent='Play forest quest with this set';
    button.onclick=()=>{const p=window.TeacherMode?.current();if(window.validLesson?.(p))this.start(p);else $('teacher-message').textContent='Add at least one valid question first.';};
    $('launch-lesson').after(button);
   });
  },
  async start(lesson) {
   if(this.starting)return;this.starting=true;
   const button=$('forest-quest-start');
   button.disabled=true;
   try {
    if(!lesson&&!this.pendingLesson){const token=new URLSearchParams(location.hash.slice(1)).get('quest');if(token)lesson=await AssignmentLinks.decode(token);}
    const previous=api.hasSave();
    if(previous && !button.dataset.confirm){
     button.dataset.confirm='yes';button.textContent='Confirm new forest quest';
     $('forest-quest-note').textContent='A forest quest is already saved. Continue it, or click Play again to replace only that quest.';
     // Teacher starts use the same visible confirmation, with their reviewed set retained.
     this.pendingLesson=lesson||null;
     if($('game').dataset.scene==='teacher')api.title();
     return;
    }
    button.disabled=true;
    const chosen=lesson||this.pendingLesson||null;
    api.start(chosen);delete button.dataset.confirm;this.pendingLesson=null;
    button.textContent='Play forest quest →';
   } catch(error){$('forest-quest-note').textContent=error.message;window.GameDiagnostics?.report(error);}
   finally {button.disabled=false;this.starting=false;}
  },
  refreshTitle() { if(!api)return;$('forest-quest-continue').disabled=!api.hasSave(); },
  prologue(s) {
   const active=this.active(s);
   $('prologue').querySelector('h1').textContent=active?'Wake the Emerald Heart':'The Last Light of Asterfall';
   $('begin-chapter').textContent=active?'Enter the forest →':'Begin the Emerald Road →';
  },
  arrival(s) {
   if(!this.active(s))return;
   if(s.encounter===2){$('arrival-title').textContent='The bridge sentinel';$('arrival-narration').textContent='The sentinel guards the river crossing. Break its armor to reopen the bridge and the old canopy shortcut.';}
   if(s.encounter===3){
    const q=s.campaign.forestQuest;
    $('arrival-narration').textContent='The ancient tree is bound in thorn roots. Awaken the Emerald Heart and let the forest breathe again.';
    $('arrival-danger').textContent=(q.ranger?'Ranger’s scouting: axe → hammer → fire as the Guardian changes phases. Start with 2 focus. ':'Watch for changing weaknesses and interrupt its charged attack. ')+(q.boon==='spirit'?'The freed spirit shields the first strike.':q.boon==='supplies'?'Your extra healing potions are ready in Items.':'You face the Guardian with your party’s own strength.');
   }
  },
  world(s) {
   const active=this.active(s),board=$('forest-trail-board');board.hidden=!active;
   board.dataset.complete=String(active&&this.complete(s.campaign));
   $('world').dataset.forestQuest=String(active);$('world').dataset.forestRestored=String(active&&this.complete(s.campaign));
   if(!active)return;
   const c=s.campaign,q=c.forestQuest,next=this.next(c);
   $('world-title').textContent=this.complete(c)?'Forest Path · Restored':'Forest Path · The Emerald Heart';
   $('progress').textContent='FOREST QUEST · '+steps.filter(id=>c.completed.includes(id)).length+' / 4 ENCOUNTERS';
   $('chapter-picker').disabled=true;
   const list=$('forest-route-steps');list.replaceChildren();
   for(const [i,id]of steps.entries()){
    const b=document.createElement('button'),done=c.completed.includes(id);b.type='button';
    b.textContent=(done?'✓ ':i+1+'. ')+(id==='m2'?'Bridge sentinel':id==='m3'?'Forest Guardian':node(id).name.replace('The ',''));
    b.disabled=done||id!==next;b.dataset.current=String(id===next);b.setAttribute('aria-current',id===next?'step':'false');b.onclick=()=>api.follow();list.append(b);
   }
   $('forest-trail-heading').textContent=this.complete(c)?'The forest is alive again':'Your next adventure';
   $('forest-preparations').textContent=(q.boon==='supplies'?'Supplies packed · +2 potions':q.boon==='spirit'?'Spirit blessing · first boss strike shielded':'Choose supplies or a spirit blessing')+' · '+(q.ranger?'Ranger rescued · boss starts with 2 focus':'Optional: rescue the ranger');
   $('forest-camp').disabled=!c.completed.includes('m1');$('forest-camp').title=c.completed.includes('m1')?'A cleared trail takes you straight to camp.':'Clear Whispering Hollow to unlock the camp shortcut.';
   $('forest-return').hidden=!q.returnPoint;$('forest-canopy').hidden=!c.completed.includes('m2')||c.completed.includes('m3');
   $('forest-recap').hidden=!this.complete(c);$('forest-follow').hidden=this.complete(c);
   $('pack-summary').textContent=c.potions+' healing potions · '+c.runes+' forge runes · '+(q.ranger?'Guardian phases: axe → hammer → fire':'The ranger knows how to break the Guardian’s defenses.');
   $('explore-tip').textContent=this.complete(c)?'The river runs clear. Visit camp or open your quest recap.':'Follow gold · Blue markers: optional help · E or Search to interact.';
  },
  result(s) {
   const active=this.active(s),forge=$('rune-forge');$('result').dataset.forestQuest=String(active);
   if(!active){if(this.forgeDetails){const content=[...this.forgeDetails.childNodes].filter(n=>n.tagName!=='SUMMARY');forge.replaceChildren(...content);this.forgeDetails=null;}return;}
   if(!this.forgeDetails){const details=document.createElement('details'),summary=document.createElement('summary');summary.textContent='Spend your earned runes · optional upgrades';details.append(summary,...forge.childNodes);forge.append(details);this.forgeDetails=details;}
   this.forgeDetails.open=false;
   const c=s.campaign,q=c.forestQuest;
   $('progress').textContent='FOREST QUEST · '+steps.filter(id=>c.completed.includes(id)).length+' / 4 ENCOUNTERS';
   if(s.phase==='complete'){
    $('result-eyebrow').textContent='THE EMERALD HEART AWAKENS';$('result-title').textContent='You brought the forest back';
    $('result-copy').textContent='Light returns to the ancient tree. The roots release the river, and the ranger’s trail is safe again. Your four heroes made it happen.';
    const recap=document.createElement('section');recap.className='forest-finish';recap.innerHTML='<h3>Your forest story</h3>';
    const choices=[q.boon==='supplies'?'You packed healing supplies.':q.boon==='spirit'?'You freed the Moonwell spirit.':'You faced the forest without a blessing.',q.ranger?'You rescued the ranger and learned the Guardian’s weaknesses.':'You defeated the Guardian without the ranger’s scouting.',q.shortcut?'You restored and used the canopy shortcut.':'The canopy shortcut is now open.',s.correct+' correct answers · '+s.wrong+' mistakes · '+c.completed.filter(id=>steps.includes(id)).length+'/4 encounters cleared'];
    for(const text of choices){const p=document.createElement('p');p.textContent=text;recap.append(p);}
    $('reward').append(recap);$('advance').textContent='Explore the restored forest →';
   } else if(s.phase==='victory'){
    const next=node(this.next(c));
    $('result-copy').textContent=s.encounter===2?'The sentinel yields. The bridge and canopy trail reopen. Return to camp to prepare, or take the shortcut to the ancient tree.':s.encounter===0?'Mossgate is safe. Ahead: choose healing supplies or the spirit’s protection, then seek Whispering Hollow.':'Whispering Hollow is quiet. Your camp shortcut is open. A trapped ranger waits along the route to the bridge.';
    $('advance').textContent=next?'Continue to '+(next.id==='m2'?'the bridge':next.name)+' →':'Return to forest →';
   }
  }
 };

 // These changes are scoped to the short quest; the full campaign keeps its rules.
 const bind=DungeonRules.bind;
 DungeonRules.bind=function(c){
  current=c;const active=Q.active(c);if(active!==mode){mode=active;OpenPaintedMaps.revision++;ForestWorld.cells=null;if(ForestRenderer.terrain){ForestRenderer.terrain.remove();ForestRenderer.overlay?.remove();ForestRenderer.terrain=null;}OpenPaintedMaps.layout=null;}
  return bind.call(this,c);
 };
 const visible=DungeonRules.visible,allowed=DungeonRules.allowed,handles=DungeonRules.handles,interact=DungeonRules.interact;
 DungeonRules.visible=function(n){return Q.active(this.campaign)?Q.visible(this.campaign,n):n.forestFind?false:visible.call(this,n);};
 DungeonRules.allowed=function(c,n){return Q.active(c)?Q.available(c,n):n.forestFind?false:allowed.call(this,c,n);};
 DungeonRules.handles=function(n){return !!n.forestFind||handles.call(this,n);};
 DungeonRules.interact=function(s,n,ui){return n.forestFind?Q.interact(s,n,ui):interact.call(this,s,n,ui);};
 const bossReady=RequiredStory.bossReady;
 RequiredStory.bossReady=function(c,chapter){return Q.active(c)?chapter===0&&steps.slice(0,3).every(id=>c.completed.includes(id)):bossReady.call(this,c,chapter);};
 const target=JourneyGuide.target,goalLine=JourneyGuide.goalLine,guideAllowed=JourneyGuide.allowed;
 JourneyGuide.target=function(c){return Q.active(c)?node(Q.next(c))||null:target.call(this,c);};
 JourneyGuide.goalLine=function(c){return Q.active(c)?Q.complete(c)?'Forest restored · celebrate at camp':'Next · '+(node(Q.next(c))?.name||'Forest Guardian'):goalLine.call(this,c);};
 JourneyGuide.allowed=function(c,n){return Q.active(c)?Q.available(c,n):guideAllowed.call(this,c,n);};
 const regions=JourneyGuide.regionComplete;JourneyGuide.regionComplete=function(c,i){return Q.active(c)?i===0&&Q.complete(c):regions.call(this,c,i);};
 const build=OpenPaintedMaps.build;
 OpenPaintedMaps.build=function(){
  build.call(this);
  if(!Q.active(current)||!this.layout||this.layout._forestQuest)return;
  // Put the crossing encounter at the actual bridge approach, avoiding the eastern dead-end loop.
  const p={x:59,y:45};
  Object.assign(node('m2'),p);Object.assign(this.layout.graph.points.get('m2'),p);
  this.layout._forestQuest=true;
 };
 const move=ExploreRules.move,advance=MouseNavigation.advance;
 function brisk(fn,args){const old=ExploreRules.speed;if(Q.active(current))ExploreRules.speed=14;try{return fn(...args);}finally{ExploreRules.speed=old;}}
 ExploreRules.move=function(...args){return brisk(move.bind(this),args);};
 MouseNavigation.advance=function(...args){return brisk(advance.bind(this),args);};
 const size=WorldCamera.size;WorldCamera.size=function(chapter,w,h){if(!Q.active(current))return size.call(this,chapter,w,h);const width=Math.max(w,1900);return {width,height:width/1.5};};
 const roamingEnabled=RoamingWorld.enabled;RoamingWorld.enabled=function(c){return !Q.active(c)&&roamingEnabled.call(this,c);};
 const roaming=RoamingWorld.update;RoamingWorld.update=function(c,...args){return Q.active(c)?null:roaming.call(this,c,...args);};
 const roads=RoadRules.available;RoadRules.available=function(c,...args){return Q.active(c)?false:roads.call(this,c,...args);};
 const questBoard=QuestBoard.render;
 QuestBoard.render=function(parent,s,...args){
  if(!Q.active(s))return questBoard.call(this,parent,s,...args);
  parent.replaceChildren();const h=document.createElement('h3'),copy=document.createElement('p'),list=document.createElement('ol');
  h.id='quest-board-heading';h.textContent='Your forest goals';copy.textContent='Clear the four dangers. Supplies, a spirit blessing and the ranger’s scouting are optional preparations.';
  for(const id of steps){const row=document.createElement('li');row.textContent=(s.campaign.completed.includes(id)?'✓ ':'○ ')+node(id).name;list.append(row);}parent.append(h,copy,list);
 };

 // A route drawn on real walkable ground and consistent markers improve every map.
 const guideUpdate=JourneyGuide.update;
 JourneyGuide.update=function(s,p,frame){
  guideUpdate.call(this,s,p,frame);
  let svg=$('quest-route-overlay');
  if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.id='quest-route-overlay';svg.setAttribute('aria-hidden','true');svg.innerHTML='<path class="quest-route-shadow"/><path class="quest-route-line"/>';$('map-viewport').append(svg);}
  const route=this.routeCache?.points,next=this.target(s.campaign);
   const hidden=!next||!route?.length||this.ui.dialog.open;svg.toggleAttribute('hidden',hidden);
   if(hidden)return;
  svg.setAttribute('viewBox','0 0 '+frame.width+' '+frame.height);
  let nearest=0,best=Infinity;for(let i=0;i<route.length;i++){const d=distance(p,route[i]);if(d<best){best=d;nearest=i;}}
   // Keep the pathfinder's corners. No new pathfinding or collision scans per frame.
   const points=[p,...route.slice(nearest)];
  const d=points.map((q,i)=>(i?'L':'M')+(q.x/100*frame.size.width-frame.camera.x).toFixed(1)+','+(q.y/100*frame.size.height-frame.camera.y).toFixed(1)).join(' ');
   for(const path of svg.children)path.setAttribute('d',d);
 };
 const marker=ExplorationPolish.marker;
 ExplorationPolish.marker=function(c,n,at,done){
  const campaign=DungeonRules.campaign,target=campaign&&JourneyGuide.target(campaign),main=target?.id===n.id;
  const questBattle=Q.active(campaign)&&steps.includes(n.id);
  if(!n.forestFind&&!main&&!questBattle)return marker.call(this,c,n,at,done);
  const unavailable=(n.forestFind||questBattle)&&Q.active(campaign)&&!Q.available(campaign,n)&&!done;
  const label=done?'✓ '+n.name:unavailable?questBattle?'— '+n.name:campaign?.completed.includes('m0')?'— Choice closed':'Clear Mossgate first':(main?'◆ ':'✦ ')+n.name;
  c.save();c.font='bold 12px system-ui';c.textAlign='center';const w=c.measureText(label).width+20;
  c.fillStyle='#092a27ed';c.strokeStyle=done?'#97d5a1':unavailable?'#8b9690':main?'#ffe09a':'#8ee9ed';c.lineWidth=2;
  c.fillRect(at.x-w/2,at.y+8,w,25);c.strokeRect(at.x-w/2,at.y+8,w,25);c.fillStyle=c.strokeStyle;c.fillText(label,at.x,at.y+25);
  if(!done&&!unavailable){c.beginPath();c.ellipse(at.x,at.y,18,7,0,0,Math.PI*2);c.stroke();}c.restore();
 };
 const landmark=ForestArt.landmark;
 ForestArt.landmark=function(c,n,at,done,time){
  if(!n.forestFind){
   const result=landmark.call(this,c,n,at,done,time);
   if(Q.active(current)&&n.id==='m2'&&!done){
    c.save();c.strokeStyle='#624332';c.lineWidth=5;
    for(let i=0;i<3;i++){c.beginPath();c.moveTo(at.x-28,at.y-8-i*9);c.bezierCurveTo(at.x+5,at.y-38,at.x+35,at.y+14,at.x+62,at.y-18-i*6);c.stroke();}c.restore();
   }
   if(Q.active(current)&&n.id==='m3'&&done){
    c.save();const light=c.createRadialGradient(at.x,at.y-30,3,at.x,at.y-30,90);light.addColorStop(0,'#d9ffc5b0');light.addColorStop(1,'#b6ffb000');c.fillStyle=light;c.fillRect(at.x-90,at.y-120,180,180);c.restore();
   }
   return result;
  }
  const file=n.id==='forest-supplies'?'assets/map-painted-chest-'+(done?'open':'closed')+'.webp':n.id==='forest-spirit'?'assets/map-painted-runestone.webp':'assets/ranger-discoveries.webp';
  const image=ForestRenderer.image(file);c.save();c.globalAlpha=done?.55:1;
  if(image.complete&&image.naturalWidth){if(n.id==='forest-ranger'){const w=image.naturalWidth/4,h=image.naturalHeight/2;c.drawImage(image,w,0,w,h,at.x-30,at.y-54,60,54);}else ForestArt.fit(c,image,at.x,at.y,48,54);}
  c.restore();ExplorationPolish.marker(c,n,at,done);
 };
})();
