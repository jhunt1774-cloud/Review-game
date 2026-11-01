/* Presentation only: reuse existing art, hit timing and rewards. */
(() => {
 'use strict';
 const Q=ForestAdventure,$=id=>document.getElementById(id);
 const icons=[
  '<path d="m4 13 7-9m-6 0c4-3 7-2 8 1l-4 4Z"/>',
  '<path d="m5 13 4-7m-3-3 6 3 2-4-6-3Z"/>',
  '<path d="M4 2c9 2 9 10 0 12L7 8Zm0 6h10m-3-3 3 3-3 3"/>',
  '<path d="m8 1 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/>'
 ];
 const V=window.ForestVisuals={enabled:false,nodes:new Map(),lastReward:null,
  sync(s){
   this.enabled=Q.active(s);$('game').dataset.forestVisuals=String(this.enabled);
   $('game').dataset.forestMotion=MotionPreference.reduced()?'still':'full';
   if(!this.enabled||s.phase!=='battle')this.clear();
   if(!this.enabled)return;
   if(!$('forest-map-key')){const key=document.createElement('details');key.id='forest-map-key';const title=document.createElement('summary');title.textContent='Map symbols';const text=document.createElement('p');text.textContent='1–4: encounters in order · 4: Guardian · C: camp · +: supplies · ◇: spirit · R: ranger. Gold: next encounter · blue: optional · lock: unavailable · ✓: cleared. Follow a blue trail to choose an optional stop.';key.append(title,text);$('forest-trail-board').append(key);}
   if(!$('forest-battle-atmosphere')){const shade=document.createElement('div');shade.id='forest-battle-atmosphere';shade.setAttribute('aria-hidden','true');$('arena').prepend(shade);}
   if(!$('forest-enemy-ground')){const ground=document.createElement('span');ground.id='forest-enemy-ground';ground.setAttribute('aria-hidden','true');$('enemy').prepend(ground);}
   HEROES.forEach((hero,i)=>{
    const actor=$('hero-'+i),card=$('party')?.children[i];
    if(actor){actor.dataset.visualActive=String(i===s.actor&&s.hp[i]>0);actor.dataset.visualFallen=String(s.hp[i]===0);}
    if(card){card.dataset.visualActive=String(i===s.actor&&s.hp[i]>0);const name=card.querySelector('strong');if(name&&!name.querySelector('.forest-role-mark')){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('forest-role-mark');svg.setAttribute('viewBox','0 0 16 16');svg.setAttribute('aria-hidden','true');svg.innerHTML=icons[i];name.prepend(svg);}}
   });
  },
  clear(){for(const [node,motion]of this.nodes){motion.cancel();node.remove();}this.nodes.clear();},
  mapBadge(n,c,done){
   const labels={m0:'1',m1:'2',m2:'3',m3:'4',merchant:'C','forest-supplies':'+','forest-spirit':'◇','forest-ranger':'R'};
   if(!Q.active(c)||!Object.hasOwn(labels,n.id))return null;
   const available=Q.available(c,n),target=Q.optionalTarget(c)?.id||Q.next(c);
   return {id:n.id,label:done?'✓':labels[n.id],state:done?'cleared':!available?'locked':!n.forestFind&&n.id===target?'next':'optional',boss:n.id==='m3'};
  },
  badgeArt(info){
   this.badges??=new Map();const key=info.id+':'+info.state;
   if(this.badges.has(key))return this.badges.get(key);
   const canvas=document.createElement('canvas');canvas.width=80;canvas.height=88;const c=canvas.getContext('2d');
   const color={cleared:'#a9e4b0',locked:'#a8b2ad',next:'#ffe0a0',optional:'#9ce5ed'}[info.state];
   c.fillStyle='#0b2925f5';c.strokeStyle=color;c.lineWidth=3;
   c.beginPath();if(info.boss){c.moveTo(40,5);c.lineTo(70,23);c.lineTo(65,60);c.lineTo(40,77);c.lineTo(15,60);c.lineTo(10,23);c.closePath();}else c.roundRect(12,8,56,60,14);c.fill();c.stroke();
   c.beginPath();c.moveTo(32,70);c.lineTo(40,84);c.lineTo(48,70);c.fill();
   c.fillStyle=color;c.font='bold 32px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillText(info.label,40,39);
   if(info.state==='locked'){c.lineWidth=2;c.beginPath();c.arc(61,17,7,Math.PI,0);c.stroke();c.fillStyle=color;c.fillRect(52,17,18,12);}
   this.badges.set(key,canvas);return canvas;
  },
  mapHero(c,hero,at){
   if(hero.index===MapWalkers.leader){c.strokeStyle='#f2dea0';c.fillStyle='#e8d69b24';c.lineWidth=1.4;c.beginPath();c.ellipse(at.x,at.y,14,5,0,0,Math.PI*2);c.fill();c.stroke();}
   c.shadowColor='#03160ddd';c.shadowBlur=2;c.shadowOffsetY=2;
  },
  async impact({type,target,arena,layer}){
   if(!this.enabled||MotionPreference.reduced()||document.hidden||window.VisualTrial?.mode==='light'||this.nodes.size>=10)return;
   if(!['slash','hammer','arrow','fireball','ice'].includes(type))return;
   const p=CombatPresentation.point(target,arena,type==='hammer'?.88:.55),count=type==='hammer'?2:1;
   const jobs=[];
   for(let i=0;i<count&&this.nodes.size<12;i++){
    const node=document.createElement('div');node.className='forest-impact forest-impact-'+type;node.setAttribute('aria-hidden','true');node.style.left=p.x+'px';node.style.top=p.y+'px';
    if(type==='arrow')node.innerHTML='<svg viewBox="0 0 64 64"><path d="M32 3v19m0 20v19M3 32h19m20 0h19M12 12l12 12m16 16 12 12m0-40L40 24M24 40 12 52"/></svg>';
    if(type==='fireball'||type==='ice')node.innerHTML='<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="24"/><path d="m40 2 5 11-5 8-5-8Zm38 38-11 5-8-5 8-5ZM40 78l-5-11 5-8 5 8ZM2 40l11-5 8 5-8 5Z"/></svg>';
    layer.append(node);
    const frames=type==='slash'?[{transform:'translate(-50%,-50%) rotate(-34deg) scaleX(.3)',opacity:.95},{transform:'translate(-50%,-50%) rotate(-22deg) scaleX(1.3)',opacity:0}]:[{transform:'translate(-50%,-50%) scale('+(i?.6:.3)+')',opacity:.85},{transform:'translate(-50%,-50%) scale('+(i?1.9:1.4)+')',opacity:0}];
    const motion=node.animate(frames,{duration:type==='hammer'?290:240,delay:i*35,easing:'ease-out'});this.nodes.set(node,motion);
    jobs.push(motion.finished.catch(()=>{}).finally(()=>{motion.cancel();node.remove();this.nodes.delete(node);}));
   }
   await Promise.all(jobs);
  },
  lantern(lit){
   const key=lit?'litLantern':'darkLantern';if(this[key])return this[key];
   const canvas=document.createElement('canvas');canvas.width=64;canvas.height=96;const c=canvas.getContext('2d');
   if(lit){const glow=c.createRadialGradient(32,36,1,32,36,30);glow.addColorStop(0,'#ffe4a0a0');glow.addColorStop(1,'#f1c56c00');c.fillStyle=glow;c.fillRect(0,4,64,64);}
   c.fillStyle='#493c2a';c.fillRect(29,25,5,62);c.fillRect(22,22,22,4);c.fillStyle=lit?'#ffe4a0':'#49554b';c.fillRect(36,29,10,15);c.strokeStyle='#c5a873';c.lineWidth=2;c.strokeRect(35,27,12,18);c.beginPath();c.moveTo(36,27);c.lineTo(41,21);c.lineTo(46,27);c.stroke();this[key]=canvas;return canvas;
  }
 };
 for(const method of ['prologue','world','arrival','result','presentChallenge']){
  const old=Q[method];Q[method]=function(s,...args){const result=old.call(this,s,...args);V.sync(s);return result;};
 }
 const contact=CombatPresentation.contact;
 CombatPresentation.contact=async function(options){
  const base=contact.call(this,options);if(!V.enabled)return base;
  const work=Promise.all([base,V.impact(options)]);this.pending.add(work);
  try{await work;}finally{this.pending.delete(work);}
 };
 document.addEventListener('visibilitychange',()=>{if(document.hidden)V.clear();});
 const mapMarker=ExplorationPolish.marker;
 ExplorationPolish.marker=function(c,n,at,done){
  const result=mapMarker.call(this,c,n,at,done),info=V.mapBadge(n,DungeonRules.campaign,done);
  if(info){c.save();c.globalAlpha=info.state==='locked'?.75:1;c.drawImage(V.badgeArt(info),at.x-(Q.steps.includes(n.id)?53:20),at.y-48,40,44);c.restore();}
  return result;
 };
 const art=ForestArt.landmark;
 ForestArt.landmark=function(c,n,at,done,time){
  const result=art.call(this,c,n,at,done,time),campaign=DungeonRules.campaign;
  if(!Q.active(campaign))return result;
  if(['m0','m1','m2'].includes(n.id))c.drawImage(V.lantern(done),at.x+18,at.y-60,44,66);
  if(n.id==='m3'&&done){
   c.save();c.fillStyle='#fff0b4';
   for(let i=0;i<4;i++){const phase=MotionPreference.reduced()?0:Math.sin(time*.7+i);c.globalAlpha=.45+phase*.15;const x=at.x-42+i*28,y=at.y-72-(i%2)*24+phase*3;c.beginPath();c.moveTo(x,y-4);c.lineTo(x+2,y);c.lineTo(x,y+4);c.lineTo(x-2,y);c.closePath();c.fill();}c.restore();
  }
  return result;
 };
 const reward=ItemArt.reward;
 ItemArt.reward=function(parent,c){
  reward.call(this,parent,c);const card=$('item-reward-art');if(!card||!Q.active(c))return;
  const image=card.querySelector('.item-portrait'),item=EquipmentLoot.catalog.find(i=>i.id===image?.dataset.item||i.name===(image?.alt||image?.getAttribute('aria-label')));if(!item)return;
  card.dataset.forestLoot='true';card.dataset.rarity=item.rarity;
  const key=c.battleNode+':'+item.id;card.classList.toggle('forest-item-new',V.lastReward!==key);V.lastReward=key;
  const text=document.createElement('div'),badge=document.createElement('span'),name=document.createElement('strong'),detail=document.createElement('small');
  badge.className='forest-loot-rarity';badge.textContent=item.rarity;name.textContent=item.name;detail.textContent=EquipmentLoot.describe(item)+' · Equip at camp';text.append(badge,name,detail);card.replaceChildren(image,text);
 };
})();
