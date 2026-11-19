// Human vanguard art uses the same roster and equipment data contracts as the painted party.
(() => {
 'use strict';
 const directory = 'assets/warrior/human-warrior-';
 const battleImage = directory + 'battle.webp?v=1';
 const travelImage = directory + 'travel.webp?v=1';
 const swordImage = directory + 'sword.webp?v=1';
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
 const step = 32;
 const release = 8 * step;
 const contact = 10 * step;
 const duration = 23 * step;
 let atlas;
 let ready = false;

 window.HumanSwordAttack = {
  supports(renderer) {
   return renderer.config.image === battleImage;
  },

  preload(renderer) {
   if (atlas || MotionPreference.reduced() || !this.supports(renderer) || typeof Image !== 'function') return;
   const image = new Image();
   image.decoding = 'async';
   image.src = swordImage;
   atlas = image;
   image.decode().then(() => {ready = image.naturalWidth === 1200 && image.naturalHeight === 1200;}, () => {});
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
   const reach = (237 / cell - .5) * side;
   const distance = Math.max(0, enemyBox.left + enemyBox.width * .31 - actorBox.left - actorBox.width / 2 - reach);
   const saved = {translate:origin.style.translate, zIndex:origin.style.zIndex, visibility:portrait.style.visibility};
   let lastFrame = -1;
   let released = false;
   let hit = false;
   let started;
   const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

   try {
    origin.append(canvas);
    portrait.style.visibility = 'hidden';
    origin.style.zIndex = '4';
    origin.dataset.swordPhase = 'windup';
    while (valid() && origin.isConnected) {
     const now = await nextFrame();
     if (!valid() || !origin.isConnected) break;
     started ??= now;
     const elapsed = Math.min(now - started, duration);
     // Keep the release and contact frames visible even when rendering misses a frame.
     const time = !released && elapsed >= release ? release : !hit && elapsed >= contact ? contact : elapsed;
     const frame = Math.min(22, Math.floor(time / step));
     if (frame !== lastFrame) {
      context.clearRect(0,0,cell,cell);
      context.drawImage(atlas,frame % 5 * cell,Math.floor(frame / 5) * cell,cell,cell,0,0,cell,cell);
      lastFrame = frame;
     }
     const progress = time < contact ? Math.max(0,(time-96)/(contact-96)) :
      Math.max(0,1-(time-contact-76)/(duration-contact-76));
     const slide = Math.min(1,progress);
     origin.style.translate = distance * slide * slide * (3-2*slide) + 'px';
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
     } else if (hit) origin.dataset.swordPhase = 'recovery';
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
