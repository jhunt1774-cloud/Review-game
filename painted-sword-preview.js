// Opt-in painted vanguard preview. The normal roster, saves and combat rules own gameplay.
(() => {
 'use strict';
 if (new URLSearchParams(location.search).get('swordPreview') !== '1') return;

 const image = 'assets/warrior/painted-swordsman-strike.webp?v=1';
 const cell = 360;
 const bladeTip = 349;
 const sheet = new Image();
 sheet.src = image;
 let ready = false;
 const checkSheet = () => { ready = sheet.naturalWidth === 3 * cell && sheet.naturalHeight === 2 * cell; };
 sheet.addEventListener('load', checkSheet, {once:true});
 checkSheet();

 const beats = [
  {time:0, frame:1, phase:'windup', advance:0},
  {time:256, frame:2, phase:'swing', advance:.65},
  {time:320, frame:3, phase:'impact', advance:1},
  {time:416, frame:4, phase:'follow-through', advance:1},
  {time:528, frame:5, phase:'recovery', advance:.65},
  {time:672, frame:0, phase:'recovery', advance:0}
 ];
 const duration = 736;
 const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

 window.PaintedSwordPreview = {
  configFor(hero, role, state) {
   if (!ready || role !== 0 || state.campaign.activeRoster[role] !== 'thorin' ||
       Object.values(EquipmentAppearance.loadout(state, role) || {}).some(Boolean)) return hero;

   const states = Object.fromEntries(Object.entries(hero.states).map(([name, clip]) => [
    name, {frames:clip.frames.map(() => 0), fps:clip.fps, loop:clip.loop, releaseFrame:clip.releaseFrame}
   ]));
   states.attack.frames = [1,2,3,4,5,0];
   states.attack.releaseFrame = 2;
   return {...hero, image, crop:null, frameWidth:cell, frameHeight:cell, columns:3, rows:2,
    sheetWidth:3 * cell, sheetHeight:2 * cell, frameRects:null, states, paintedSwordPreview:true};
  },

  async play({renderer, target, audio, onImpact, valid}) {
   if (!renderer.config.paintedSwordPreview || MotionPreference.reduced() ||
       !window.requestAnimationFrame || !valid()) return false;
   const actor = renderer.el;
   const canvas = renderer.portrait;
   if (!canvas || canvas.parentElement !== actor) return false;
   const context = canvas.getContext('2d');
   if (!context) return false;
   const box = canvas.getBoundingClientRect();
   const enemy = target.getBoundingClientRect();
   const size = Math.min(box.width, box.height);
   if (!size || !enemy.width) return false;
   const bladeX = box.left + box.width / 2 + (bladeTip / cell - .5) * size;
   const advance = Math.max(0, enemy.left + enemy.width * .34 - bladeX);
   const lunge = Math.min(advance, size * .30);
   const approach = advance - lunge;
   const travel = approach ? Math.min(310, Math.max(120, approach / size * 100)) : 0;
   const saved = {translate:actor.style.translate, zIndex:actor.style.zIndex};
   const stillHere = () => valid() && actor.isConnected && renderer.portrait === canvas;
   const present = (phase, offset) => {
    actor.dataset.swordPhase = phase;
    actor.style.translate = offset + 'px';
   };
   const draw = frame => {
    context.clearRect(0, 0, cell, cell);
    context.drawImage(sheet, frame % 3 * cell, Math.floor(frame / 3) * cell, cell, cell, 0, 0, cell, cell);
   };
   let hit = false;

   renderer.stop();
   actor.style.zIndex = '4';
   try {
    if (travel) {
     const start = await nextFrame();
     let elapsed = 0;
     while (stillHere() && elapsed < travel) {
      present('approach', approach * elapsed / travel);
      elapsed = (await nextFrame()) - start;
     }
    }
    const start = await nextFrame();
    let now = start;
    for (const beat of beats) {
     while (stillHere() && now - start < beat.time) now = await nextFrame();
     if (!stillHere()) return hit;
     draw(beat.frame);
     present(beat.phase, approach + lunge * beat.advance);
     if (beat.phase === 'swing') audio?.launch('sword', -.25);
     if (beat.phase === 'impact') {
      hit = true;
      audio?.impact('sword', .25);
      await onImpact?.();
     }
     // Give each authored pose a draw opportunity after a slow or suspended frame.
     now = await nextFrame();
    }
    while (stillHere() && now - start < duration + travel) {
     if (now - start >= duration && travel) {
      present('retreat', approach * Math.max(0, 1 - (now - start - duration) / travel));
     }
     now = await nextFrame();
    }
    return hit;
   } finally {
    actor.style.translate = saved.translate;
    actor.style.zIndex = saved.zIndex;
    delete actor.dataset.swordPhase;
    if (stillHere()) renderer.setState('idle', true);
   }
  }
 };
})();
