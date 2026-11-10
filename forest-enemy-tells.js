/* Readable enemy silhouettes and Guardian bindings; the existing combat clock owns timing. */
(() => {
 'use strict';
 const Q=ForestAdventure,$=id=>document.getElementById(id),ns='http://www.w3.org/2000/svg';
 const glyphs={
  rake:'<path d="m79 33-12 27m22-25L77 65m22-27L87 69"/>',
  flare:'<path d="m39 90 8-13 7 11 7-20 9 18 9-20 7 22 9-12 8 14M33 99q37-18 74 0"/>',
  pounce:'<path d="M107 93Q90 55 42 79m0 0 8-13m-8 13 16 2M48 100h38"/>',
  sweep:'<path d="M26 86Q70 53 114 85m-88 1 14 3m-14-3 4-13M38 99q30-15 61 0"/>',
  overhead:'<path d="M72 26v48m-10-12 10 12 10-12M49 97l12-12m34 12L83 85M61 104h23"/>',
  lash:'<path d="M106 96Q66 96 94 75T61 52L44 64m17-12-4-12m37 35 9-9"/>',
  charge:'<circle cx="83" cy="61" r="22"/><path d="m83 29 3 10m23 22h10M83 83v11M51 61h10m13 7 9-18 9 18Z"/>',
  eruption:'<path d="M45 103q19-22 9-44 22 13 18 40 4-37 20-54-3 33 14 58M41 108h69"/><circle cx="60" cy="41" r="2"/><circle cx="83" cy="30" r="2"/>',
  interrupted:'<path d="m56 52-9 9q-7 9 1 16t16-1l7-8m15-8 8-8q7-9-1-16t-16 1l-7 7M63 58l8-7m-3 20 8-8"/>'
 };
 const T=window.ForestEnemyTells={state:null,last:null,motions:new Set(),
  cancel(){for(const motion of this.motions)motion.cancel();this.motions.clear();},
  clear(){this.cancel();this.last=null;if($('forest-attack-tell'))$('forest-attack-tell').hidden=true;if($('forest-defense-sequence'))$('forest-defense-sequence').hidden=true;delete $('arena').dataset.forestTell;},
  category(s,p){if(p.charging)return 'charge';if(!p.damage)return 'interrupted';if(p.boss)return {eruption:'eruption',sweep:'sweep',lash:'lash'}[p.kind]||'lash';if(p.name==='Briar flare')return 'flare';if(p.name==='Cornered feint')return 'rake';if(p.behavior?.key==='hunter')return p.behavior.index===0||p.behavior.heavy?'pounce':'rake';if(p.behavior?.key==='bulwark')return p.behavior.index===1?'sweep':'overhead';return p.behavior?.index===1?'sweep':'rake';},
  ensure(){
   if(!$('forest-attack-tell')){const svg=document.createElementNS(ns,'svg');svg.id='forest-attack-tell';svg.setAttribute('viewBox','0 0 140 120');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.innerHTML=Object.entries(glyphs).map(([key,art])=>'<g data-tell="'+key+'">'+art+'</g>').join('');$('enemy').append(svg);}
   const veil=$('forest-binding-veil');if(veil&&!veil.querySelector('.guardian-shell')){const shell=document.createElementNS(ns,'g');shell.classList.add('guardian-shell');shell.innerHTML='<path d="M22 35q19 22 8 46t11 25M78 35Q59 57 70 81t-11 25M24 70q26-13 52 0M26 84q24-12 48 0"/>';const bark=document.createElementNS(ns,'g');bark.classList.add('guardian-bark');bark.innerHTML='<path d="m29 48 9 7-4 15 9 8-4 14m32-44-9 7 4 15-9 8 4 14M35 97l15 7 15-7"/>';veil.append(shell,bark);}
   if(!$('forest-defense-sequence')){const hint=document.createElement('small');hint.id='forest-defense-sequence';$('forest-battle-read').querySelector('summary').append(hint);}
  },
  present(s,plan){
   this.state=s;if(!Q.active(s)||s.phase!=='battle'||s.enemyHp<=0){this.clear();return;}
   const p=s.pendingEnemy||plan;if(!p){this.clear();return;}this.ensure();const category=this.category(s,p),svg=$('forest-attack-tell');svg.hidden=false;$('arena').dataset.forestTell=category;svg.dataset.disrupted=String(!!p.behavior?.disrupted);for(const group of svg.children)group.style.display=group.dataset.tell===category?'':'none';
   const hint=$('forest-defense-sequence');hint.hidden=false;const pattern=p.boss?BossRules.pattern(p):EnemyBehavior.pattern(p)||DefenseRules.pattern(s.encounter,s.turn,p.effect),remaining=pattern.actions.slice(p.resolvedSteps?.length||0),copy=p.charging?'Gathering rootfire · no strike this turn':!p.damage?'Interrupted · no defense needed':!remaining.length?'Defense sequence complete':'If it strikes: '+remaining.map(DefenseRules.label).join(' · ');if(hint.textContent!==copy)hint.textContent=copy;
   const phase=ForestDirection.read(s,p).phase;if(phase!==null)$('boss-phase-announcement')?.getAnimations().forEach(m=>m.cancel());
   if(phase!==null&&this.last?.state===s&&this.last.node===s.campaign.battleNode&&phase>this.last.phase&&!MotionPreference.reduced()&&VisualTrial.mode!=='light'&&!document.hidden){const group=$('forest-binding-veil').querySelector(this.last.phase===0?'.guardian-shell':'.guardian-bark');this.cancel();const motion=group.animate([{opacity:.85,transform:'translateY(0)'},{opacity:0,transform:'translateY(10px)'}],{duration:420,easing:'ease-out'});this.motions.add(motion);motion.finished.catch(()=>{}).finally(()=>{motion.cancel();this.motions.delete(motion);});}
   this.last={state:s,node:s.campaign.battleNode,phase};
  }
 };
 for(const method of ['prologue','world','arrival','result','presentChallenge','prepareBattle']){const old=Q[method];Q[method]=function(s,...args){if(method==='prepareBattle')T.clear();const result=old.call(this,s,...args);if(method==='presentChallenge')T.present(s,args[0]);else if(method!=='prepareBattle')T.clear();return result;};}
 document.addEventListener('visibilitychange',()=>{if(document.hidden)T.cancel();});
})();
