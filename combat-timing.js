// One attacker owns each strike. Release poses, contact, HP and recovery share a clock.
window.CombatTiming={
 wait(ms){return new Promise(resolve=>setTimeout(resolve,MotionPreference.reduced()?0:ms));},
 async release(renderer,state='attack'){renderer.setState(state,true);const clip=renderer.config.states[state]||renderer.config.states.attack||renderer.config.states.idle;await this.wait((clip.releaseFrame??Math.min(1,(clip.frames?.length||1)-1))*1000/(clip.fps||8));},
 aggregate(steps){const multiplier=steps.reduce((sum,s)=>sum+s.multiplier,0)/Math.max(1,steps.length),grade=steps.every(s=>s.grade==='perfect')?'perfect':steps.every(s=>s.grade==='miss')?'miss':'guard';return {grade,multiplier,beats:steps.length,steps,label:grade==='perfect'?'Perfect defense sequence':grade==='miss'?'Defense sequence missed':'Partial defense sequence'};},
 cumulative(base,steps,total){if(!steps.length)return 0;const amount=steps.reduce((sum,s)=>sum+s.multiplier,0)/total;return amount>0&&base>0?Math.max(1,Math.round(base*amount)):0;},
 validSteps(p){return p.resolvedSteps===undefined||Array.isArray(p.resolvedSteps)&&p.resolvedSteps.length<=3&&p.resolvedSteps.every(s=>['guard','perfect','miss'].includes(s.grade)&&['block','dodge','parry'].includes(s.action)&&[0,.35,.4,1].includes(s.multiplier))&&Number.isInteger(p.actualLoss)&&p.actualLoss>=0&&p.actualLoss<=3996;},
 async enemyStrike({renderer,defenders,step,type,alternate,arena,layer,audio,onImpact,valid}){
  if(!defenders.length||!valid())return;type=renderer.config.attackEffects?.[alternate?1:0]||type;const motions=[],nodes=[],reactions=defenders.map(d=>DefenseAnimations.create(d,step)),actor=renderer.el,reduced=MotionPreference.reduced(),melee=type!=='enemy-spell',box=arena.getBoundingClientRect(),a=actor.getBoundingClientRect(),first=defenders[0].el.getBoundingClientRect(),origin={x:a.left+a.width/2-box.left,y:a.top+a.height*.55-box.top},approach=melee?Math.min(0,first.left+first.width-a.left+45):0;
  const animate=async(el,frames,duration,fill)=>{const motion=el.animate(frames,{duration:reduced?0:duration,easing:'ease-out',...(fill?{fill}:{} )});motions.push(motion);await motion.finished;};
  try{
   reactions.forEach(r=>r.prepare());if(melee&&!reduced){renderer.setState('walk');await animate(actor,[{translate:'0px'},{translate:approach+'px'}],160,'forwards');}if(!valid())return;
   const reacting=reactions.map(r=>r.react());await this.release(renderer,alternate&&renderer.config.states.attackAlt?'attackAlt':'attack');if(!valid())return;audio?.launch(type,.25);
   if(!melee){await Promise.all(defenders.map(async d=>{const r=d.el.getBoundingClientRect(),p=document.createElement('div');p.className='timed-projectile';p.style.left=origin.x+'px';p.style.top=origin.y+'px';layer.append(p);nodes.push(p);await animate(p,[{translate:'0px'},{translate:(r.left+r.width/2-box.left-origin.x)+'px '+(r.top+r.height*.5-box.top-origin.y)+'px'}],260);p.hidden=true;}));}
   if(!valid())return;audio?.impact(type,-.25);await onImpact();
   for(const d of defenders){const r=d.el.getBoundingClientRect(),spark=document.createElement('div');spark.className='timed-contact '+(melee?'claw-contact':'spell-contact');spark.style.left=r.left+r.width/2-box.left+'px';spark.style.top=r.top+r.height*.5-box.top+'px';layer.append(spark);nodes.push(spark);const m=spark.animate([{transform:'translate(-50%,-50%) scale(.35)',opacity:1},{transform:'translate(-50%,-50%) scale(1.4)',opacity:0}],{duration:reduced?0:220});motions.push(m);}
   await Promise.allSettled(reacting);await this.wait(180);if(melee&&!reduced&&valid()){renderer.setState('walk');await animate(actor,[{translate:approach+'px'},{translate:'0px'}],180);}
  }finally{await Promise.allSettled(reactions.map(r=>r.finish()));motions.forEach(m=>m.cancel?.());nodes.forEach(n=>n.remove());if(['walk','attack','attackAlt'].includes(renderer.state))renderer.setState('idle');}
 }
};
