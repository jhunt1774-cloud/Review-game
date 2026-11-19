// Small scene-space effects, synchronized to contact. No camera movement or hit pause.
window.CombatPresentation={pending:new Set(),
 point(el,arena,y=.55){const r=el.getBoundingClientRect(),b=arena.getBoundingClientRect();return {x:r.left+r.width/2-b.left,y:r.top+r.height*y-b.top};},
 async contact({type,target,arena,layer,damage=null,label='',heavy=false}){
  const nodes=[],motions=[],reduced=MotionPreference.reduced(),p=this.point(target,arena),colors={slash:'#ffe2a0',hammer:'#e4b47b',arrow:'#c3edaf',fireball:'#ffb75c',ice:'#a9eeff'},color=colors[type]||'#e2d1ff';
  const add=(kind,at=p)=>{const el=document.createElement('div');el.className='combat-fx '+kind;el.style.left=at.x+'px';el.style.top=at.y+'px';el.style.setProperty('--strike-color',color);layer.appendChild(el);nodes.push(el);return el;};
  const move=(el,frames,ms)=>{const m=el.animate(frames,{duration:reduced?80:ms,easing:'ease-out'});motions.push(m);return m.finished;};
  const work=(async()=>{try{
   const flash=add('contact-core '+type);const jobs=[move(flash,[{transform:'translate(-50%,-50%) scale(.35)',opacity:1},{transform:'translate(-50%,-50%) scale('+(heavy?1.8:1.2)+')',opacity:0}],240)];
   if(!reduced){
    if(type==='slash'){const arc=add('contact-cut');jobs.push(move(arc,[{transform:'translate(-50%,-50%) rotate(-40deg) scale(.4)',opacity:1},{transform:'translate(-50%,-50%) rotate(35deg) scale(1.25)',opacity:0}],260));}
    if(type==='hammer'){const wave=add('contact-ground',this.point(target,arena,.9));jobs.push(move(wave,[{transform:'translate(-50%,-50%) scale(.2)',opacity:1},{transform:'translate(-50%,-50%) scale(1.6)',opacity:0}],380));}
    const count=heavy?8:5;for(let i=0;i<count;i++){const chip=add('contact-chip '+type),angle=(i/count)*Math.PI*2;const radius=type==='hammer'?50:35;jobs.push(move(chip,[{translate:'0px',rotate:'0deg',opacity:1},{translate:Math.cos(angle)*radius+'px '+(Math.sin(angle)*radius+15)+'px',rotate:i*63+'deg',opacity:0}],300+i*12));}
    const reaction=target.animate([{translate:'0px',filter:'brightness(1.35)'},{translate:'7px 0px',filter:'brightness(1.08)',offset:.3},{translate:'0px',filter:'brightness(1)'}],{duration:heavy?270:190,easing:'ease-out'});motions.push(reaction);jobs.push(reaction.finished);
   }
   if(damage!==null){const number=add('contact-number');number.textContent='−'+damage+' HP';jobs.push(move(number,[{transform:'translate(-50%,-45px)',opacity:1},{transform:'translate(-50%,-65px)',opacity:1,offset:.8},{transform:'translate(-50%,-78px)',opacity:0}],700));}
   if(label){const text=add('contact-label');text.textContent=label;jobs.push(move(text,[{transform:'translate(-50%,-15px)',opacity:1},{transform:'translate(-50%,-25px)',opacity:1,offset:.8},{transform:'translate(-50%,-30px)',opacity:0}],700));}
   await Promise.allSettled(jobs);
  }finally{motions.forEach(m=>m.cancel?.());nodes.forEach(n=>n.remove());}})();this.pending.add(work);try{await work;}finally{this.pending.delete(work);}
 },
 async finish(){await Promise.allSettled([...this.pending]);},
 async basic({type,renderer,target,arena,layer,audio,onImpact}){
  const reduced=MotionPreference.reduced(),actor=renderer.el,melee=['slash','hammer'].includes(type),motions=[],nodes=[];let advance=0,landed=false;
  const move=async(el,frames,ms,fill)=>{const m=el.animate(frames,{duration:reduced?60:ms,easing:'ease-out',...(fill?{fill}:{} )});motions.push(m);await m.finished;};
  const strike=async()=>{if(landed)return;landed=true;audio?.impact(type,.25);await onImpact?.();};
  try{
   const start=this.point(actor,arena),end=this.point(target,arena);
   if(melee&&!reduced){advance=Math.max(0,end.x-start.x-95);renderer.setState('walk');await move(actor,[{translate:'0px'},{translate:advance+'px'}],210,'forwards');}
   await CombatTiming.release(renderer);audio?.launch(type,-.25);
   if(!melee){const a=this.point(actor,arena,.46),b=this.point(target,arena),dx=b.x-a.x,dy=b.y-a.y,angle=Math.atan2(dy,dx)*180/Math.PI,p=document.createElement('div');p.className='combat-fx combat-projectile '+type;p.style.left=a.x+'px';p.style.top=a.y+'px';
    if(type==='arrow')p.innerHTML='<svg viewBox="0 0 110 18"><path d="M2 9H101M88 2L106 9L88 16" fill="none" stroke="#ffeac4" stroke-width="3"/><path d="M2 2L15 9L2 16" fill="none" stroke="#b6d6a1" stroke-width="3"/></svg>';
    layer.appendChild(p);nodes.push(p);await move(p,[{transform:'translate(-50%,-50%) rotate('+angle+'deg)',opacity:1},{transform:'translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px)) rotate('+angle+'deg)',opacity:1}],Math.max(220,Math.min(420,Math.hypot(dx,dy)*.65)));p.hidden=true;
   }
   await strike();await this.finish();
   if(melee&&!reduced){renderer.setState('walk');await move(actor,[{translate:advance+'px'},{translate:'0px'}],210);}
  }finally{motions.forEach(m=>m.cancel?.());nodes.forEach(n=>n.remove());if(['walk','attack'].includes(renderer.state))renderer.setState('idle');}
 }
};
