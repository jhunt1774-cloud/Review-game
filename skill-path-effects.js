// Small original vector effects reuse the painted attack poses and the shared release clock.
window.SkillPathFX={
 async play({state,actor,action,renderer,target,arena,layer,audio,onImpact}){
  const move=SkillPaths.move(state,actor,action),reduced=MotionPreference.reduced(),origin=renderer.el,box=arena.getBoundingClientRect(),point=el=>{const r=el.getBoundingClientRect();return {x:r.left+r.width/2-box.left,y:r.top+r.height*.55-box.top};},start=point(origin),end=point(target),nodes=[],motions=[];let landed=false;
  const colors={execution:'#ffce77',rend:'#df8d68',banner:'#f8d689',bastion:'#8fd5e8',riposte:'#ffe5a4',shatter:'#efb873',deadeye:'#f3d17b',storm:'#a6e6ad',skirmish:'#a6dbce',comet:'#b8a8ff',prism:'#b1dcff',renewal:'#f0ebbd'},color=colors[move.fx];
  const add=(kind,at,svg='')=>{const el=document.createElement('div');el.className='path-fx '+kind;el.style.left=at.x+'px';el.style.top=at.y+'px';el.style.setProperty('--path-color',color);if(svg)el.innerHTML=svg;layer.append(el);nodes.push(el);return el;};
  const animate=async(el,frames,ms=250,fill)=>{const m=el.animate(frames,{duration:reduced?70:ms,easing:'ease-out',...(fill?{fill}:{})});motions.push(m);await m.finished;};
  const ring=async(at,kind='path-ring',large=false)=>{const el=add(kind,at);await animate(el,[{transform:'translate(-50%,-50%) scale(.25)',opacity:.9},{transform:'translate(-50%,-50%) scale('+(large?2.1:1.5)+')',opacity:0}],420);};
  const arrow='<svg viewBox="0 0 140 24"><path d="M5 12H123M105 3L135 12L105 21M4 4L23 12L4 20" fill="none" stroke="currentColor" stroke-width="3"/></svg>',slash='<svg viewBox="0 0 150 150"><path d="M12 130Q108 90 139 10Q139 116 12 130Z" fill="currentColor"/></svg>';
  const fly=async(kind,from,to,svg='',ms=260)=>{const p=add(kind,from,svg);await animate(p,[{transform:'translate(0,-50%) scale(.75)',opacity:1},{transform:'translate('+(to.x-from.x)*.55+'px,'+((to.y-from.y)*.55-(kind==='path-comet'?45:0))+'px) scale(1)',opacity:1,offset:.55},{transform:'translate('+(to.x-from.x)+'px,'+(to.y-from.y)+'px) scale(1.15)',opacity:1}],ms);p.hidden=true;};
  const impact=async()=>{if(landed)return;landed=true;await onImpact?.();audio?.impact(actor===3?'fireball':actor===2?'arrow':actor===1?'hammer':'slash',.2);};
  const allies=()=>[0,1,2,3].filter(i=>state.hp[i]>0).map(i=>document.getElementById('hero-'+i)).filter(Boolean);
  const banner=add('path-title',start);banner.textContent=move.move+(move.mastered?' · MASTERED':'');
  try{
   renderer.setState('idle');
   if(actor<2){const distance=Math.max(0,end.x-start.x-115);if(!reduced){renderer.setState('walk');await animate(origin,[{translate:'0px'},{translate:distance+'px'}],180,'forwards');}
    await CombatTiming.release(renderer);audio?.launch(actor===0?'slash':'hammer',-.2);
    if(actor===0){const cut=add('path-cut',end,slash);await impact();await animate(cut,[{transform:'translate(-50%,-50%) rotate(-45deg) scale(.45)',opacity:1},{transform:'translate(-50%,-50%) rotate(65deg) scale('+(move.mastered?1.7:1.3)+')',opacity:0}],300);if(move.fx==='rend')await ring(end,'path-wound');if(move.fx==='banner')await Promise.all(allies().map(el=>ring(point(el),'path-banner')));}
    else{await impact();await ring({...end,y:end.y+45},'path-ground',move.mastered);if(move.fx==='bastion')await Promise.all(allies().map(el=>ring(point(el),'path-ward')));if(move.fx==='riposte')await ring({...start,x:start.x+distance},'path-riposte');if(move.fx==='shatter'){const cracks=add('path-cracks',{...end,y:end.y+45},'<svg viewBox="0 0 180 70"><path d="M90 8L70 30L79 36L40 58M90 8L112 28L107 40L151 58M90 8L91 55M90 8L25 20M90 8L162 20" fill="none" stroke="currentColor" stroke-width="3"/></svg>');await animate(cracks,[{transform:'translate(-50%,-50%) scale(.5)',opacity:1},{transform:'translate(-50%,-50%) scale(1.4)',opacity:0}],380);}}
    if(!reduced){renderer.setState('walk');await animate(origin,[{translate:distance+'px'},{translate:'0px'}],180);}
   }else if(actor===2){const dodge=move.fx==='skirmish';if(dodge&&!reduced){renderer.setState('walk');await animate(origin,[{translate:'0px'},{translate:'-28px -10px'}],150,'forwards');}
    if(move.fx==='deadeye')await ring(end,'path-crosshair');await CombatTiming.release(renderer);const count=move.fx==='storm'?(move.mastered?5:3):1;
    for(let i=0;i<count;i++){audio?.launch('arrow',-.2);await fly('path-arrow'+(move.fx==='deadeye'?' path-gold-arrow':''),{x:start.x-(dodge&&!reduced?28:0),y:start.y+(i-(count-1)/2)*9},end,arrow,move.fx==='storm'?130:250);}
    await impact();await ring(end);if(dodge){await ring(start,'path-ward');if(!reduced)await animate(origin,[{translate:'-28px -10px'},{translate:'0px'}],150);}
   }else{const glyph=add('path-glyph',start,'<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="47" fill="none" stroke="currentColor" stroke-width="2"/><path d="M60 8L105 87H15ZM60 112L15 33H105Z" fill="none" stroke="currentColor" stroke-width="2"/></svg>');await animate(glyph,[{transform:'translate(-50%,-50%) rotate(-20deg) scale(.5)',opacity:.3},{transform:'translate(-50%,-50%) rotate(20deg) scale(1)',opacity:1}],180);glyph.hidden=true;await CombatTiming.release(renderer);audio?.launch('fireball',-.2);await fly(move.fx==='comet'?'path-comet':move.fx==='prism'?'path-prism-bolt':'path-dawn-orb',start,end,'',320);await impact();await ring(end,'path-ring',move.mastered);if(move.fx!=='comet')await Promise.all(allies().map(el=>ring(point(el),move.fx==='prism'?'path-ward':'path-healing')));}
   await impact();
  }finally{motions.forEach(m=>m.cancel?.());nodes.forEach(n=>n.remove());if(renderer.state!=='defeat')renderer.setState('idle');}
 }
};
