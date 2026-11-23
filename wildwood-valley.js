/* Connect the baked valley and floor to the existing forest adventure. */
(() => {
  'use strict';
  const data = window.WildwoodValleyData;
  if (!data) return;
  const layout = WildwoodLayout;
  const stops = data.stops;
  const packed = Uint8Array.from(atob(data.cells), ch => ch.charCodeAt(0));
  const cellAt = p => {
    const x = Math.floor(p.x * data.width / 100);
    const y = Math.floor(p.y * data.height / 100);
    if (x < 0 || y < 0 || x >= data.width || y >= data.height) return 0;
    const i = y * data.width + x;
    return (packed[i >> 2] >> ((i % 4) * 2)) & 3;
  };
  const point = ([x, y]) => ({x, y});
  layout.width = 4560;
  layout.height = 3040;
  layout.speed = 2.4;
  for (const key of Object.keys(layout.positions)) layout.positions[key] = stops[key];
  for (const cache of layout.caches) Object.assign(cache, point(stops[cache.id]));
  for (const patrol of layout.patrols) patrol.home = stops[patrol.questNode];
  // Keep the original item IDs so the pack, battle actions and old saves agree.
  const relicTrails = [
    ['loot-axe','m0','Mossgate arch','After the briars retreat, look inside the old gate for an axe sigil.',c=>c.completed.includes('m0')],
    ['loot-shield','m2','Sentinel’s landing','When the crossing opens, read the oath cut into the west landing.',c=>c.completed.includes('m2')],
    ['loot-bow','wildwood-watch-cache','Ranger watch','Free the ranger or light the ridge beacon to locate the buried quiver at the watch.',c=>c.forestQuest.ranger||c.completed.includes('valley-ridge-beacon')],
    ['loot-moon','forest-spirit','Moonwell','After choosing supplies or the spirit’s shield, return to the Moonwell and search the water.',c=>!!c.forestQuest.boon||c.completed.includes('m3')]
  ];
  const requirements=new Map();
  const tailraceCache='wildwood-tailrace-cache';
  layout.caches.push({
    id:tailraceCache,name:'Tailrace keeper’s satchel',x:68.5,y:87.2,
    container:'satchel',gold:24,potions:1,runes:2
  });
  requirements.set(tailraceCache,c=>c.completed.includes('valley-mill-sluice'));
  for(const [id,stop,place,clue,ready] of relicTrails){
    const site=LootRules.sites.find(s=>s.id===id);
    const node=FOREST_NODES.find(n=>n.id===id);
    Object.assign(node,{kind:'forest-find',forestFind:true,wildwood:true,valleyRelic:site,...point(stops[stop])});
    layout.positions[id]=stops[stop];
    LootRules.powers[site.hero].hint=clue;
    requirements.set(id,ready);
  }
  const entrance='amber-hollow-entrance',delivery='valley-wagon-delivery';
  const atPress=point(stops['valley-cider-press']),atOrchard=point(stops['valley-apple-harvest']);
  layout.positions[entrance]=stops['valley-cider-press'];
  Object.assign(FOREST_NODES.find(n=>n.id===entrance),atPress);
  Object.assign(SideAdventures.specs.find(s=>s.id==='amber-hollow').surfaceEntry,atPress);
  requirements.set(entrance,c=>c.completed.includes('valley-cider-press'));
  requirements.set(delivery,c=>c.completed.includes('amber-hollow-wagon'));
  FOREST_NODES.push({id:delivery,name:'Orchard caravan delivery',...atOrchard,chapter:0,stage:0,
    kind:'forest-find',forestFind:true,wildwood:true,optional:true,hidden:true});
  const errands = [
    {
      pickup:'valley-apple-harvest', start:'West orchard', action:'Gather windfall apples',
      finish:'valley-cider-press', end:'Cider press', deliver:'Press the orchard apples',
      carried:'Basket of russet apples', hint:'Take the ripe windfalls from the west orchard to the screw press.',
      reward:'Pressed cider for camp. Your party receives two healing potions.', potions:2, runes:0, gold:10
    },
    {
      pickup:'valley-timber-yard', start:'Timber yard', action:'Collect a sluice board',
      finish:'valley-mill-sluice', end:'Tailrace sluice', deliver:'Repair the mill sluice',
      carried:'Seasoned sluice board', hint:'The tailrace gate is missing a board. The timber yard keeps cut replacements.',
      reward:'The millwright pays 45 gold. The water drops below the gate, exposing a muddy shelf. Follow the bank downstream and look for a stranded satchel.', potions:0, runes:0, gold:45
    },
    {
      pickup:'valley-quarry-glass', start:'Old glass quarry', action:'Recover the beacon lens',
      finish:'valley-ridge-beacon', end:'Ridge beacon', deliver:'Relight the ridge beacon',
      carried:'Faceted beacon lens', hint:'Recover the polished lens at the quarry, then carry it up the switchback.',
      reward:'The signal fire is lit above the valley. You earn three forge runes.', potions:0, runes:3, gold:0
    }
  ];
  for (const job of errands) {
    for (const [id, name] of [[job.pickup,job.action],[job.finish,job.deliver]]) {
      FOREST_NODES.push({id,name,...point(stops[id]),chapter:0,stage:0,kind:'forest-find',
        forestFind:true,wildwood:true,valleyJob:job,optional:true,hidden:true});
    }
  }
  const defaults=ForestAdventure.defaults;
  ForestAdventure.defaults=function(){return {...defaults.call(this),valleyRevision:2};};
  // Use the game's equipment catalog so camp, stats, save validation and artwork agree.
  const finds = [
    {source:'wildwood-herbalist-cache', id:'apiary-smock', name:'Beekeeper’s smock', slot:'armor', role:null, hp:6, guard:.01},
    {source:'wildwood-mill-cache', id:'millwright-mallet', name:'Millwright’s mallet', slot:'weapon', role:1, damage:3},
    {source:'wildwood-ruin-cache', id:'east-warden-seal', name:'East warden’s seal', slot:'accessory', role:null, hp:4, skill:.02}
  ];
  for (const find of finds) EquipmentLoot.catalog.push({rarity:'uncommon', damage:0, hp:0, guard:0, skill:0, ...find});
  const ground = 'assets/wildwood-valley.webp?v=painted-workshops2';
  const canopy = 'assets/wildwood-valley-canopy.webp?v=painted-workshops2';
  const sluice='assets/wildwood-sluice-open.webp?v=painted-workshops2';
  window.WildwoodValley = {
    revealed(c,id){return requirements.has(id)?requirements.get(id)(c):undefined;},
    caravan(c){
      if(!c.completed.includes('amber-hollow-wagon'))return null;
      return {x:atOrchard.x-1.8,y:atOrchard.y+.1,width:2.7,height:3.6,art:'orchardCaravan',solid:false};
    },
    migrate(campaign) {
      const quest=campaign.forestQuest;
      if (!quest || quest.valleyRevision>=2) return;
      // The original camera window occupies the central half of each new axis.
      function recenter(p) {
        if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) {
          p.x=25+p.x/2; p.y=25+p.y/2;
        }
      }
      if (!campaign.dungeon) recenter(campaign.explorePosition);
      recenter(campaign.dungeon?.returnPosition);
      recenter(quest.returnPoint);
      for (const [id,patrol] of Object.entries(campaign.roaming?.patrols||{})) {
        if (id.startsWith('roam-0-')) recenter(patrol);
      }
      quest.valleyRevision=2;
    },
    aimBeacon(complete) {
      if (document.getElementById('valley-beacon-lens')) return;
      const dial=document.createElement('dialog');
      dial.id='valley-beacon-lens'; dial.className='crypt-puzzle';
      dial.setAttribute('aria-labelledby','valley-lens-title');
      const heading=document.createElement('h2'); heading.id='valley-lens-title'; heading.textContent='Aim the ridge beacon';
      const clue=document.createElement('p');
      clue.textContent='The lens rim reads: “Let the ranger on the upstream watch see our light.” Turn the reflector toward its receiver.';
      const feedback=document.createElement('p'); feedback.setAttribute('role','status');
      dial.append(heading,clue,feedback);
      for (const [label,correct] of [['Downstream waterwheel',false],['Ranger watch',true],['Cider orchard',false]]) {
        const button=document.createElement('button');button.type='button';button.textContent=label;
        button.onclick=()=>{
          if (!correct) {feedback.textContent='No signal returns. Check which landmark the inscription names.';return;}
          dial.close();complete();
        };
        dial.append(button);
      }
      const leave=document.createElement('button');leave.type='button';leave.textContent='Leave the beacon';
      leave.onclick=()=>dial.close();dial.append(leave);
      dial.addEventListener('close',()=>dial.remove(),{once:true});
      dial.addEventListener('keydown',event=>event.stopPropagation());
      document.getElementById('game').append(dial);GameExploration.stop();dial.showModal();
    },
    interact(state,node,ui) {
      const c=state.campaign,job=node.valleyJob;
      if (c.completed.includes(node.id)) return;
      if(this.revealed(c,node.id)===false)return;
      if(node.valleyRelic){
        const site=node.valleyRelic,potions=c.potions,runes=c.runes;
        if(!LootRules.collect(state,node.id))return;
        const power=LootRules.powers[site.hero],contents=[{id:site.id,name:site.item,quantity:1,detail:power.name+' · 3 focus, once per battle'}];
        if(site.gold)contents.push({id:'gold',name:'Gold',quantity:site.gold});
        if(site.potions)contents.push({id:'healing-potion',name:'Healing potion',quantity:site.potions,kept:c.potions-potions});
        if(site.runes)contents.push({id:'forge-rune',name:'Forge rune',quantity:site.runes,kept:c.runes-runes});
        ui.loot(site.name,contents,site.xp);ui.save();ui.reward?.(['rare-item']);return;
      }
      if(node.id===delivery){
        if(c.potions>97){ui.notice(node.name,'The crew is holding two healing potions for you. Return with room for both.');return;}
        if(!DungeonRules.reward(state,node.id,0,0,2,0,'First orchard delivery'))return;
        ui.loot(node.name,[{id:'healing-potion',name:'Healing potion',quantity:2}],0);ui.save();ui.reward?.(['chest-open']);return;
      }
      if (node.id===job.finish && !c.completed.includes(job.pickup)) {
        ui.notice(job.end,job.hint); return;
      }
      if (node.id===job.pickup) {
        c.completed.push(node.id);
        ui.save(); ui.world(); ui.notice(job.carried,'Bring it to '+job.end+'.');
        return;
      }
      const complete=()=>{
        if (!DungeonRules.reward(state,node.id,45,job.gold,job.potions,job.runes,job.deliver)) return;
        ui.save(); ui.world(); ui.reward?.(['quest-complete']); ui.notice(job.end,job.reward+(node.id==='valley-cider-press'?' The press keeper opens the cart road into Amber Hollow. Enter here to help the stranded wagon.':''));
      };
      if (job.finish==='valley-ridge-beacon') this.aimBeacon(complete);
      else complete();
    },
    updatePlaces(campaign) {
      const stopsBox = document.getElementById('forest-mini-stops');
      if (!stopsBox) return;
      let select = document.getElementById('valley-destinations');
      if (!select) {
        select = document.createElement('select');
        select.id = 'valley-destinations';
        select.setAttribute('aria-label', 'Walk to a place in the valley');
        select.add(new Option('Walk to a place…', ''));
        const banks = [
          ['Camp and west bank', [['merchant','Ranger camp'],['wildwood-herbalist-cache','Apiary'],['crypt-entrance','Rootbound Sanctuary'],['wildwood-watch-cache','Ranger watch'],['wildwood-overlook-cache','Cargo hoist'],[errands[0].pickup,errands[0].start],[errands[0].finish,errands[0].end]]],
          ['Across the bridge', [['wildwood-mill-cache','Watermill'],['wildwood-ruin-cache','Ruined courtyard'],...errands.slice(1).flatMap(job=>[[job.pickup,job.start],[job.finish,job.end]])]]
        ];
        for (const [bank, places] of banks) {
          const group = document.createElement('optgroup');
          group.label = bank;
          for (const [id,name] of places) group.append(new Option(name,id));
          select.append(group);
        }
        const discoveries=document.createElement('optgroup');discoveries.label='Discovered trails';
        for(const [id,label] of [[entrance,'Amber Hollow · orchard road'],[delivery,'Returning caravan'],...relicTrails.map(([id,,place])=>[id,LootRules.sites.find(s=>s.id===id).item+' · '+place])])
          discoveries.append(new Option(label,id));
        select.insertBefore(discoveries,select.lastElementChild);
        select.onchange = () => {
          if (select.value) ForestAdventure.walkTo(select.value);
          select.selectedIndex = 0;
        };
        stopsBox.after(select);
      }
      const discoveries=select.querySelector('optgroup[label="Discovered trails"]');
      for(const option of discoveries.children){
        option.hidden=!this.revealed(campaign,option.value)||(option.value!==entrance&&campaign.completed.includes(option.value));
        option.disabled=option.hidden;
      }
      discoveries.hidden=Array.from(discoveries.children).every(o=>o.hidden);
      for (const job of errands) {
        const picked=campaign.completed.includes(job.pickup),done=campaign.completed.includes(job.finish);
        select.querySelector('[value="'+job.pickup+'"]').textContent=job.start+(picked?' (collected)':'');
        select.querySelector('[value="'+job.finish+'"]').textContent=job.end+(done?' (complete)':picked?' (deliver here)':'');
      }
      let tracker=document.getElementById('valley-errands');
      if (!tracker) {
        tracker=document.createElement('details');tracker.id='valley-errands';
        tracker.append(document.createElement('summary'),document.createElement('ul'));select.after(tracker);
      }
      const locked = !RegionGates.open(0,campaign.completed);
      const progress=errands.map(job=>campaign.completed.includes(job.finish)?2:campaign.completed.includes(job.pickup)?1:0).join('');
      const trackerKey=progress+':'+locked;
      if (tracker.dataset.progress!==trackerKey) {
        tracker.dataset.progress=trackerKey;
        tracker.firstChild.textContent='Valley errands '+[...progress].filter(n=>n==='2').length+'/3';
        tracker.lastChild.replaceChildren(...errands.map((job,i)=>{
          const li=document.createElement('li');
          const done=progress[i]==='2',carrying=progress[i]==='1',acrossBridge=i>0&&locked;
          li.textContent=done?job.end+' complete':carrying?job.carried+' — deliver to '+job.end:job.hint;
          if(done)return li;
          if(acrossBridge)li.append(' Defeat the sentinel to reach this errand.');
          const destination=carrying?job.finish:job.pickup;
          const walk=document.createElement('button');
          walk.type='button';
          walk.dataset.errandWalk=destination;
          walk.textContent='Walk to '+(carrying?job.end:job.start);
          walk.disabled=acrossBridge;
          walk.onclick=()=>ForestAdventure.walkTo(destination);
          li.append(walk);
          return li;
        }));
      }
      let log=document.getElementById('valley-field-notes');
      if(!log){
        log=document.createElement('details');log.id='valley-field-notes';
        log.append(document.createElement('summary'),document.createElement('ul'));tracker.after(log);
      }
      const marks=relicTrails.map(([id])=>campaign.completed.includes(id)?2:this.revealed(campaign,id)?1:0);
      const wagon=campaign.completed.includes('amber-hollow-wagon'),open=this.revealed(campaign,entrance);
      const tailrace=campaign.completed.includes(tailraceCache)?2:this.revealed(campaign,tailraceCache)?1:0;
      const key=marks.join('')+open+wagon+campaign.completed.includes(delivery)+tailrace;
      if(log.dataset.progress!==key){
        log.dataset.progress=key;
        log.firstChild.textContent='Field notes · '+marks.filter(v=>v===2).length+'/4 relics';
        const lines=relicTrails.map(([id,,place,clue],i)=>marks[i]===2?place+' · '+LootRules.sites.find(s=>s.id===id).item+' recovered':clue);
        lines.push(wagon?(campaign.completed.includes(delivery)?'The orchard caravan is provisioned.':'The rescued wagon is at the west orchard. Its crew has two potions for you.'):open?'The press keeper has opened Amber Hollow. Protect the supply wagon on the expedition trail.':'Help press the orchard apples to reopen the cart road.');
        if(tailrace===1)lines.push('The open sluice exposed a stranded satchel. Follow the bank downstream from the gate.');
        if(tailrace===2)lines.push('The tailrace keeper’s satchel is recovered.');
        log.lastChild.replaceChildren(...lines.map(line=>{const li=document.createElement('li');li.textContent=line;return li;}));
      }
      const east = select.lastElementChild;
      east.disabled = locked;
      east.label = locked ? 'Across the bridge · defeat the sentinel' : 'Across the bridge';
    },
    gate: point(data.gate),
    west: point(stops['gate-west']),
    east: point(stops['gate-east']),
    roots: point(stops['ranger-roots']),
    bank: p => Number(cellAt(p) === 2),
    ground: p => Number(cellAt(p) !== 0),
    ready() {
      return [ground, canopy, sluice].every(src => ForestRenderer.image(src).naturalWidth > 0);
    },
    paint(ctx, w, h) {
      ctx.drawImage(ForestRenderer.image(ground), 0, 0, w, h);
      if (DungeonRules.campaign.completed.includes('valley-mill-sluice')) {
        const [x,y,width,height]=data.sluiceBox;
        ctx.drawImage(ForestRenderer.image(sluice),x*w,y*h,width*w,height*h);
      }
    },
    foreground(ctx, list, toScreen) {
      if (DungeonRules.campaign?.completed.includes('valley-ridge-beacon')) {
        const at=toScreen(...data.beaconFlame);
        const radius=(toScreen(data.beaconFlame[0]+.65,data.beaconFlame[1]).x-at.x);
        list.push({y:at.y+1,draw(){
          ctx.save();ctx.translate(at.x,at.y);ctx.scale(radius,radius);
          const halo=ctx.createRadialGradient(0,-.55,.09,0,-.55,1.12);
          halo.addColorStop(0,'#fff7ad');halo.addColorStop(.27,'#ffc456');halo.addColorStop(.57,'#ec73279c');halo.addColorStop(1,'#ff922000');
          ctx.fillStyle=halo;ctx.fillRect(-1.2,-1.75,2.4,2.4);ctx.restore();
        }});
      }
      const img = ForestRenderer.image(canopy);
      // The actor canvas is transparent above the baked terrain. Punching out
      // silhouettes reveals the original full-resolution painting beneath it.
      if (!img.naturalWidth || ctx.canvas !== ForestRenderer.overlay) return;
      const [width, height] = data.canopySize;
      for (const [left, top, w, h, atlasY, feet] of data.layers) {
        const a = toScreen(left * 100 / width, top * 100 / height);
        const b = toScreen((left + w) * 100 / width, (top + h) * 100 / height);
        if (b.x < 0 || b.y < 0 || a.x > ctx.canvas.width || a.y > ctx.canvas.height) continue;
        list.push({y: toScreen(0, feet * 100).y, draw() {
          ctx.save();
          ctx.globalCompositeOperation='destination-out';
          ctx.drawImage(img, 0, atlasY, w, h, a.x, a.y, b.x-a.x, b.y-a.y);
          ctx.restore();
        }});
      }
    }
  };
})();
