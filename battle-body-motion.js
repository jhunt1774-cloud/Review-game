// Pose sheets supply the silhouette and equipment. A bounded canvas pass adds
// squash, lean and follow-through without decoding another atlas per fighter.
(() => {
 'use strict';
 const active = new WeakMap();
 const step = 1000 / 30;
 const slices = 18;
 const attacks = /^(attack(?:Alt)?|windup|recover|hurt)$/;
 // [upper-body travel, body compression, reach]. Values are fractions of the portrait.
 const styles = {
  axe:[.17,.073,.085], hammer:[.13,.115,.080], bow:[.076,.036,.105], magic:[.091,.049,.091],
  claw:[.15,.085,.082], beast:[.14,.10,.095], heavy:[.096,.066,.064], flight:[.12,.068,.124],
  specter:[.115,.050,.119]
 };
 const enemyStyles = {
  'briar-imp':'claw', thornfang:'beast', runebark:'heavy', 'forest-guardian':'heavy',
  'ridge-bandit':'axe', 'frost-wolf':'beast', 'stone-warden':'heavy', 'storm-drake':'flight',
  'thorn-knight':'axe', 'shadow-specter':'specter', 'ember-sentinel':'magic', nightroot:'specter',
  amberwood:'claw', glasswarden:'axe', tidewarden:'heavy'
 };
 const enabled = renderer => !MotionPreference.reduced() && renderer.el.matches('#arena #heroes .hero, #arena #enemy-art');
 const smooth = t => t*t*(3-2*t);
 const sample = (p, a, b) => smooth(Math.max(0,Math.min(1,(p-a)/(b-a))));

 function create(renderer) {
  const source = document.createElement('canvas');
  const context = source.getContext('2d');
  if (!context) return null;
  const enemy = renderer.el.id === 'enemy-art';
  const role = ['axe','hammer','bow','magic'].find((_,i) => renderer.el.classList.contains('hero-'+i));
  const kind = enemy ? enemyStyles[renderer.config.key] ||
   (renderer.config.projectileColor ? 'magic' : 'claw') : role || 'axe';
  const facing = Number(getComputedStyle(renderer.el).getPropertyValue('--battle-facing-x')) || 1;
  const direction = enemy ? -facing : facing;
  const motion = {source,context,direction,style:styles[kind],loaded:false,lean:0,compression:0,reach:0};
  active.set(renderer,motion);
  return motion;
 }

 function paint(renderer,motion) {
  const canvas = renderer.portrait;
  if (!canvas || !motion.loaded || !canvas.isConnected || canvas.width !== motion.width || canvas.height !== motion.height) return;
  const ctx = canvas.getContext('2d');
  const {source,lean,compression,reach,direction} = motion;
  const {width,height} = canvas;
  ctx.save();
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,width,height);
  ctx.imageSmoothingQuality = 'low';
  if(!lean && !compression && !reach){
   ctx.drawImage(source,0,0,width,height);
   ctx.restore();
   return;
  }
  for(let row=0;row<slices;row++){
   const start = row / slices;
   const end = (row + 1) / slices;
   const weight = (1-(start+end)/2)**1.7;
   const widthDelta = width * reach * weight;
   const x = direction * (width * lean * weight + widthDelta * .35) - widthDelta/2;
   const y = height * (start + compression * (1-start));
   const rowHeight = height * (end-start);
   ctx.drawImage(source,0,source.height*start,source.width,source.height*(end-start),
    x,y,width+widthDelta,Math.ceil(rowHeight*(1-compression)));
  }
  ctx.restore();
 }

 function pose(renderer,motion,windup,drive,release,recoil=0) {
  const [travel,compress,extend] = motion.style;
  motion.lean = travel * (drive - windup*.64 - recoil*.74);
  motion.compression = compress * (windup*.88 + recoil*.74 - release*.46);
  motion.reach = extend * (drive - windup*.55);
  paint(renderer,motion);
 }

 function stop(renderer,restore=true) {
  const motion = active.get(renderer);
  if (!motion) return;
  cancelAnimationFrame(motion.request);
  if (restore) pose(renderer,motion,0,0,0);
  active.delete(renderer);
 }

 function run(renderer,state) {
  if (!enabled(renderer)) return;
  const clip = renderer.config.states[state] || renderer.config.states.idle;
  const frameDuration = 1000/(clip.fps||8);
  const duration = Math.max(frameDuration, (clip.frames?.length||1)*frameDuration);
  const contact = Math.min(.9,Math.max(.12,(clip.releaseFrame??1)*frameDuration/duration));
  const motion = create(renderer);
  if (!motion) return;
  const started=performance.now();
  let last=-Infinity;
  function tick(now){
   if (!enabled(renderer) || !renderer.el.isConnected || active.get(renderer)!==motion) {
    if (active.get(renderer)===motion) stop(renderer);
    return;
   }
   const p=Math.max(0,Math.min(1,(now-started)/duration));
   if(now-last>=step-1 || p===1){
    last=now;
    const spring=1-sample(p,0,1);
    if(state==='hurt') pose(renderer,motion,0,0,0,spring);
    else if(state==='recover') pose(renderer,motion,0,spring,spring*.5);
    else if(state==='windup') pose(renderer,motion,sample(p,0,1),0,0);
    else {
     const loaded=sample(p,0,contact*.62);
     const swing=sample(p,contact*.62,contact);
     pose(renderer,motion,loaded*(1-swing),swing*(1-sample(p,contact,1)),swing*(1-sample(p,contact,.98)));
    }
   }
   if(p<1) motion.request=requestAnimationFrame(tick);
   else if(state!=='windup') stop(renderer);
  }
  motion.request=requestAnimationFrame(tick);
 }

 window.BattleBodyMotion = {
  capture(renderer,canvas) {
   const motion=active.get(renderer);
   if(!motion) return;
   const scale=Math.min(1,320/Math.max(canvas.width,canvas.height));
   const width=Math.round(canvas.width*scale),height=Math.round(canvas.height*scale);
   if(motion.source.width!==width||motion.source.height!==height){
    motion.source.width=width;
    motion.source.height=height;
   }
   motion.context.clearRect(0,0,width,height);
   motion.context.drawImage(canvas,0,0,width,height);
   motion.width=canvas.width;
   motion.height=canvas.height;
   motion.loaded=true;
   paint(renderer,motion);
  },
  telegraph(renderer,progress,releaseAt) {
   if(!enabled(renderer)) {stop(renderer);return;}
   let motion=active.get(renderer);
   if(!motion){
    motion=create(renderer);
    if(!motion)return;
    if(renderer.portrait)this.capture(renderer,renderer.portrait);
   }
   const now=performance.now();
   if(progress<1 && now-(motion.last??-Infinity)<step-1)return;
   motion.last=now;
   const windup=sample(progress,0,.68),swing=sample(progress,.68,releaseAt);
   const follow=releaseAt<1 ? sample(progress,releaseAt,1) : 0;
   pose(renderer,motion,windup*(1-swing),swing*(1-follow*.7),swing*(1-follow*.6));
  },
  stop
 };

 const prototype=CharacterRenderer.prototype;
 const setState=prototype.setState;
 prototype.setState=function(state,restart=false){
  if(state==='_held') return setState.call(this,state,restart);
  if(this.state===state&&!restart&&(this.timer||this.finishedState===state))return;
  stop(this,false);
  if(attacks.test(state)) run(this,state);
  return setState.call(this,state,restart);
 };
 const destroy=prototype.destroy;
 prototype.destroy=function(){stop(this,false);return destroy.call(this);};
})();
