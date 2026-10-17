// Dedicated relic choreography: one gameplay impact, bounded effects, no camera shake.
window.RelicAnimations={async play({actor,renderer,target,arena,layer,audio,onImpact,damage=null,healingGains=null}){
 const reduced=MotionPreference.reduced(),nodes=[],motions=[],origin=renderer.el,box=arena.getBoundingClientRect();
 const point=(el,feet=false)=>{const r=el.getBoundingClientRect();return {x:r.left+r.width/2-box.left,y:r.top+r.height*(feet?.94:.5)-box.top};};
 const a=point(origin),b=point(target),floor=point(target,true),home=point(origin,true);
 const make=(kind,at,svg='')=>{const el=document.createElement('div');el.className='relic-fx '+kind;el.style.left=at.x+'px';el.style.top=at.y+'px';el.innerHTML=svg;layer.appendChild(el);nodes.push(el);return el;};
 const move=async(el,frames,duration=400,extra={})=>{const motion=el.animate(frames,{duration:reduced?80:duration,easing:'ease-out',...extra,delay:reduced?0:extra.delay||0});motions.push(motion);await motion.finished;};
 const pulse=(at,kind,size=1)=>{const el=make('relic-pulse '+kind,at);return move(el,[{transform:'translate(-50%,-50%) scale(.25)',opacity:1},{transform:'translate(-50%,-50%) scale('+size*1.8+')',opacity:0}],420);};
 const number=async(at,text,kind)=>{const el=make('relic-number '+kind,at);el.textContent=text;await move(el,[{transform:'translate(-50%,-30px)',opacity:1},{transform:'translate(-50%,-65px)',opacity:1,offset:.75},{transform:'translate(-50%,-80px)',opacity:0}],800);};
 const axe='<svg viewBox="0 0 200 200"><path d="M20 180Q180 130 175 15Q205 170 20 180Z" fill="#fff2bc"/><path d="M30 150Q145 100 170 25" fill="none" stroke="#fff" stroke-width="4"/></svg>';
 const arrow='<svg viewBox="0 0 140 22"><path d="M0 11H122M106 2L136 11L106 20M4 3L19 11L4 19" fill="none" stroke="#d9eeff" stroke-width="3"/></svg>';
 const allies=[...document.querySelectorAll('#heroes .hero')].slice(0,4);
 let landed=false,advanced=0;
 const impact=async()=>{if(landed)return;landed=true;await onImpact?.();audio?.impact(['slash','hammer','arrow','fireball'][actor],.25);};
 try{
  renderer.setState('idle');const label=make('relic-title',a);label.textContent=LootRules.powers[actor].name;
  
  if(reduced){await impact();await pulse(b,'soft');if(actor===3)await Promise.all(allies.map((ally,i)=>number(point(ally),healingGains?.[i]===0?'FULL HP':'+'+(healingGains?.[i]??0)+' HP','healing')));}
  else if(actor===0){
   advanced=Math.max(0,b.x-a.x-110);renderer.setState('walk');await move(origin,[{translate:'0px'},{translate:advanced+'px'}],280,{fill:'forwards'});
   const seal=make('armor-seal',b,'<svg viewBox="0 0 120 140"><path d="M60 5L110 25V78Q100 115 60 135Q20 115 10 78V25Z" fill="#224e68bb" stroke="#c2eaff" stroke-width="4"/><path d="M60 15L45 48L69 65L45 94L63 128" stroke="#ffe8aa" stroke-width="5" fill="none"/></svg>');
   const swing=move(origin,[{rotate:'-16deg'},{rotate:'12deg'}],230);await CombatTiming.release(renderer);audio?.launch(['slash','hammer','arrow','fireball'][actor],-.25);await swing;const slash=make('runebreaker-cut',b,axe);await impact();await move(slash,[{transform:'translate(-50%,-50%) rotate(-50deg) scale(.35)',opacity:1},{transform:'translate(-50%,-50%) rotate(40deg) scale(1.4)',opacity:1}],230);await impact();seal.hidden=true;
   await Promise.all([-1,1].map(side=>{const half=make('broken-armor '+(side<0?'left':'right'),b);return move(half,[{translate:'0px',rotate:'0deg',opacity:1},{translate:(side*90)+'px 45px',rotate:(side*45)+'deg',opacity:0}],450);}));await pulse(floor,'gold',1.2);
  }else if(actor===1){
   await move(origin,[{translate:'0px',rotate:'0deg'},{translate:'0px -15px',rotate:'-8deg'},{translate:'0px',rotate:'5deg'}],380);await CombatTiming.release(renderer);audio?.launch(['slash','hammer','arrow','fireball'][actor],-.25);
   const wave=make('aegis-wave',home);await move(wave,[{transform:'translate(-50%,-50%) scale(.25)',opacity:1},{transform:'translate('+(floor.x-home.x-80)+'px,'+(floor.y-home.y)+'px) scale(1.7)',opacity:1}],450);await impact();
   await Promise.all([pulse(floor,'blue',1.6),...allies.map(ally=>{const at=point(ally,true),ward=make('aegis-ward',at);return move(ward,[{transform:'translate(-50%,-90%) scaleY(.1)',opacity:0},{transform:'translate(-50%,-90%) scaleY(1)',opacity:1,offset:.35},{transform:'translate(-50%,-90%) scaleY(1.1)',opacity:0}],650);})]);
  }else if(actor===2){
   const constellation=make('starfall-bow',a);await move(constellation,[{transform:'translate(-50%,-50%) rotate(-50deg) scale(.2)',opacity:0},{transform:'translate(-50%,-50%) rotate(0) scale(1)',opacity:1}],250);
   await CombatTiming.release(renderer);audio?.launch(['slash','hammer','arrow','fireball'][actor],-.25);await Promise.all(Array.from({length:5},(_,i)=>{const shot=make('starfall-arrow',a,arrow),spread=(i-2)*26,dx=b.x-a.x-125,dy=b.y-a.y;return move(shot,[{transform:'translate(0px,0px) rotate('+(spread/3)+'deg)',opacity:1},{transform:'translate('+(dx*.5)+'px,'+(dy*.5+spread-50)+'px) rotate(-3deg)',opacity:1,offset:.5},{transform:'translate('+dx+'px,'+(dy+(i-2)*5)+'px) rotate(0deg)',opacity:1}],460,{delay:i*65}).then(()=>{shot.hidden=true;});}));await impact();
   const star=make('starfall-impact',b,'<svg viewBox="0 0 180 180"><path d="M90 5L108 66L174 60L124 101L146 166L90 130L34 166L56 101L6 60L72 66Z" fill="none" stroke="#e4edff" stroke-width="4"/></svg>');await move(star,[{transform:'translate(-50%,-50%) rotate(-30deg) scale(.4)',opacity:1},{transform:'translate(-50%,-50%) rotate(20deg) scale(1.3)',opacity:0}],480);
  }else{
   const source=make('renewal-source',a);await move(source,[{transform:'translate(-50%,-50%) scale(.2)',opacity:0},{transform:'translate(-50%,-50%) scale(1.2)',opacity:1}],350);
   await Promise.all(allies.map(async(ally,i)=>{const at=point(ally),wisp=make('renewal-wisp',a);await move(wisp,[{transform:'translate(0,0)',opacity:1},{transform:'translate('+(at.x-a.x)*.5+'px,'+((at.y-a.y)*.5-70)+'px)',opacity:1,offset:.5},{transform:'translate('+(at.x-a.x)+'px,'+(at.y-a.y)+'px)',opacity:1}],500,{delay:i*45});wisp.hidden=true;await Promise.all([pulse(point(ally,true),'green'),number(at,healingGains?.[i]===0?'FULL HP':'+'+(healingGains?.[i]??'')+' HP','healing')]);}));
   await CombatTiming.release(renderer);audio?.launch(['slash','hammer','arrow','fireball'][actor],-.25);const ray=make('renewal-ray',a);await move(ray,[{transform:'translate(0,0) scale(.3)',opacity:1},{transform:'translate('+(b.x-a.x)+'px,'+(b.y-a.y)+'px) scale(1)',opacity:1}],380);ray.hidden=true;await impact();await pulse(b,'green');
  }
  if(damage!==null)await number(b,'−'+damage+' HP','damage');
  if(advanced){renderer.setState('walk');await move(origin,[{translate:advanced+'px'},{translate:'0px'}],260);}
 }finally{motions.forEach(m=>m.cancel?.());nodes.forEach(n=>n.remove());if(['walk','attack'].includes(renderer.state))renderer.setState('idle');}
}};
