// Human vanguard art uses the same roster and equipment data contracts as the painted party.
(() => {
 'use strict';
 const directory = 'assets/warrior/human-warrior-';
 const battleImage = directory + 'battle.webp?v=1';
 const travelImage = directory + 'travel.webp?v=1';
 const swordImage = directory + 'sword.webp?v=2';
 const member = 'human-warrior';
 const frameRects = Array.from({length:16}, (_, frame) => ({
  x:frame % 4 * 240, y:Math.floor(frame / 4) * 240, w:240, h:240, dx:0, dy:0, scale:1.5
 }));
 PARTY_V3[member] = {
  image:battleImage, travelImage, travelRows:4, travelRowOffset:0, travelFeet:Array(16).fill(.92),
  frameWidth:360, frameHeight:360, columns:4, rows:4, sheetWidth:960, sheetHeight:960, frameRects,
  states:{
   idle:{frames:[0,0,1,2,2,3,0],fps:5,loop:true},
   walk:{frames:[4,5,6,7],fps:9,loop:true,image:travelImage},
   attack:{frames:[4,5,6,7],fps:10,loop:false,releaseFrame:2},
   hurt:{frames:[8,9,10,11],fps:10,loop:false},
   victory:{frames:[12,13,12,13],fps:6,loop:false},
   defeat:{frames:[10,15],fps:5,loop:false}
  }
 };
 RosterSystem.members.push({
  id:member, role:0, name:'Alden', hp:0, power:0,
  description:'Human warrior · sword and shield'
 });
 EquipmentAppearance.data.bodies[member] = {
  battle:directory + 'body.webp?v=1', travel:directory + 'travel-body.webp?v=1',
  complete:true, battleFromTravel:false
 };

 const cell = 240;
 const columns = 5;
 const rows = 6;
 const step = 32;
 const release = 8 * step;
 const contact = 10 * step;
 const duration = 23 * step;
 const walkStart = 23;
 let atlas;
 let loading;
 let ready = false;

 window.HumanSwordAttack = {
  supports(renderer) {
   return renderer.config.image === battleImage;
  },

  preload(renderer) {
   if (MotionPreference.reduced() || !this.supports(renderer) || typeof Image !== 'function') return;
   if (loading) return loading;
   const image = new Image();
   image.decoding = 'async';
   image.src = swordImage;
   atlas = image;
   loading = image.decode?.().then(() => {
    ready = image.naturalWidth === columns * cell && image.naturalHeight === rows * cell;
    return ready;
   }, () => false);
   return loading;
  },

  async play({renderer,target,audio,onImpact,valid}) {
   if (MotionPreference.reduced() || !this.supports(renderer) || !ready || !window.requestAnimationFrame) return false;

   const origin = renderer.el;
   const portrait = renderer.portrait;
   if (portrait?.parentElement !== origin) return false;
   const canvas = document.createElement('canvas');
   const context = canvas.getContext('2d');
   if (!context) return false;
   canvas.width = canvas.height = cell;
   canvas.className = 'actor-portrait';
   canvas.setAttribute('aria-hidden','true');

   const actorBox = portrait.getBoundingClientRect();
   const enemyBox = target.getBoundingClientRect();
   const side = Math.min(actorBox.width,actorBox.height);
   if (side <= 0) return false;
   const reach = (237 / cell - .5) * side;
   const distance = Math.max(0, enemyBox.left + enemyBox.width * .31 - actorBox.left - actorBox.width / 2 - reach);
   const lunge = Math.min(distance,side * .16);
   const approach = distance - lunge;
   const travelTime = approach > 0 ? Math.min(360,Math.max(150,approach / side * 165)) : 0;
   const saved = {translate:origin.style.translate, zIndex:origin.style.zIndex, visibility:portrait.style.visibility};
   let lastFrame = -1;
   let released = false;
   let hit = false;
   let started;
   const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
   const draw = frame => {
    if(frame === lastFrame) return;
    context.clearRect(0,0,cell,cell);
    context.drawImage(atlas,frame % columns * cell,Math.floor(frame / columns) * cell,cell,cell,0,0,cell,cell);
    lastFrame = frame;
   };

   try {
    origin.append(canvas);
    portrait.style.visibility = 'hidden';
    origin.style.zIndex = '4';
    origin.dataset.swordPhase = travelTime ? 'approach' : 'windup';
    while (valid() && origin.isConnected) {
     const now = await nextFrame();
     if (!valid() || !origin.isConnected) break;
     started ??= now;
     const elapsed = now - started;
     if (elapsed < travelTime) {
      draw(walkStart + Math.floor(elapsed / 65) % 4);
      origin.style.translate = approach * elapsed / travelTime + 'px';
      continue;
     }

     const attackTime = Math.min(elapsed - travelTime,duration);
     // Keep the release and contact frames visible even when rendering misses a frame.
     const time = !released && attackTime >= release ? release : !hit && attackTime >= contact ? contact : attackTime;
     if (time === duration && travelTime) {
      const retreat = Math.min(travelTime,elapsed - travelTime - duration);
      if (origin.dataset.swordPhase !== 'retreat') origin.dataset.swordPhase = 'retreat';
      draw(walkStart + (4 - Math.floor(retreat / 65) % 4) % 4);
      origin.style.translate = approach * (1 - retreat / travelTime) + 'px';
      if (retreat === travelTime) break;
      continue;
     }

     draw(Math.min(walkStart - 1,Math.floor(time / step)));
     if (origin.dataset.swordPhase === 'approach') origin.dataset.swordPhase = 'windup';
     const progress = time < contact ? Math.max(0,(time-96)/(contact-96)) :
      Math.max(0,1-(time-contact-76)/(duration-contact-76));
     const slide = Math.min(1,progress);
     origin.style.translate = approach + lunge * slide * slide * (3-2*slide) + 'px';
     if (!released && time === release) {
      released = true;
      origin.dataset.swordPhase = 'swing';
      audio?.launch('sword',-.25);
     }
     if (!hit && time === contact) {
      hit = true;
      origin.dataset.swordPhase = 'impact';
      audio?.impact('sword',.25);
      await onImpact?.();
     } else if (origin.dataset.swordPhase === 'impact') origin.dataset.swordPhase = 'recovery';
     if (time === duration) break;
    }
    return hit;
   } finally {
    canvas.remove();
    portrait.style.visibility = saved.visibility;
    origin.style.translate = saved.translate;
    origin.style.zIndex = saved.zIndex;
    delete origin.dataset.swordPhase;
   }
  }
 };
})();
