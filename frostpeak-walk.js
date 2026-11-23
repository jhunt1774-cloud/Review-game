(() => {
 'use strict';
 const canvas = document.querySelector('canvas');
 const ctx = canvas.getContext('2d');
 const status = document.querySelector('#location');
 const overview = document.querySelector('#overview');
 const destinations = document.querySelector('#destination');
 const saveKey = 'web-wizardry-frostpeak-walk-v1';
 const keys = new Map([
  ['w',[0,-1]],['arrowup',[0,-1]],['s',[0,1]],['arrowdown',[0,1]],
  ['a',[-1,0]],['arrowleft',[-1,0]],['d',[1,0]],['arrowright',[1,0]]
 ]);
 const neighbors = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
 const loadImage = async url => {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
 };
 const clamp = (value, max) => Math.max(0,Math.min(max,value));

 async function start() {
  const [art,actor,data] = await Promise.all([
   loadImage('assets/frostpeak-painted-preview.webp'),
   loadImage('assets/lira-painted-walk.webp'),
   fetch('assets/frostpeak-floor.json').then(response => {
    if(!response.ok) throw Error('Missing Frostpeak floor');
    return response.json();
   })
  ]);
  const {w,h,marks,foreground} = data;
  const grid = Uint8Array.from(atob(data.floor),byte=>byte.charCodeAt(0));
  const W = art.naturalWidth, H = art.naturalHeight;
  const held = new Set();
  const cell = (x,y) => {
   const a=Math.floor(x/W*w),b=Math.floor(y/H*h);
   return a<0||a>=w||b<0||b>=h ? -1 : b*w+a;
  };
  const center = i=>({x:(i%w+.5)*W/w,y:(Math.floor(i/w)+.5)*H/h});
  const point = mark=>({x:mark.x*W,y:mark.y*H});
  let pos=point(marks.Trailhead), route=[], frame=0, previous=0, dir=0, phase=0;
  let view={x:0,y:0,w:W,h:H}, fullMap=false;
  let saveTimer;
  try {
   const saved=JSON.parse(localStorage.getItem(saveKey));
   if(saved && grid[cell(saved.x*W,saved.y*H)]) pos=point(saved);
  } catch {}
  function remember() {
   clearTimeout(saveTimer);
   saveTimer=setTimeout(()=>{
    try {localStorage.setItem(saveKey,JSON.stringify({x:pos.x/W,y:pos.y/H}));} catch {}
   },120);
  }
  function say(value) {
   if(status.textContent!==value) status.textContent=value;
  }
  function locate() {
   let closest='Frostpeak trail', distance=34;
   for(const [name,mark] of Object.entries(marks)) {
    const d=Math.hypot(mark.x*W-pos.x,mark.y*H-pos.y);
    if(d<distance) {closest=name;distance=d;}
   }
   say(closest);
  }
  function plan(x,y) {
   const startCell=cell(pos.x,pos.y),goal=cell(x,y);
   if(!grid[goal]||!grid[startCell]) return false;
   const parents=new Int32Array(w*h).fill(-1),queue=new Int32Array(w*h);
   let head=0,tail=1;
   queue[0]=startCell;
   parents[startCell]=startCell;
   while(head<tail&&parents[goal]===-1) {
    const id=queue[head++],a=id%w,b=Math.floor(id/w);
    for(const [dx,dy] of neighbors) {
     const nx=a+dx,ny=b+dy,next=ny*w+nx;
     if(nx<0||nx>=w||ny<0||ny>=h||!grid[next]||parents[next]!==-1) continue;
     if(dx&&dy&&(!grid[b*w+nx]||!grid[ny*w+a]))continue;
     parents[next]=id;
     queue[tail++]=next;
    }
   }
   if(parents[goal]===-1)return false;
   const points=[];
   for(let i=goal;i!==startCell;i=parents[i]) points.push(center(i));
   route=points.reverse();
   route.push({x,y});
   return true;
  }
  function paint() {
   const zoom=fullMap?1:1.75, vw=W/zoom,vh=H/zoom;
   view={x:clamp(pos.x-vw/2,W-vw),y:clamp(pos.y-vh/2,H-vh),w:vw,h:vh};
   const cw=canvas.width,ch=canvas.height,sx=cw/view.w,sy=ch/view.h;
   ctx.drawImage(art,view.x,view.y,vw,vh,0,0,cw,ch);
   ctx.save();
   ctx.scale(sx,sy);
   ctx.translate(-view.x,-view.y);
   const cellW=actor.width/4,cellH=actor.height/4;
   const size=46;
   ctx.drawImage(actor,(Math.floor(phase)%4)*cellW,dir*cellH,cellW,cellH,
    pos.x-size/2,pos.y-size*.94,size,size);
   for(const layer of foreground) {
    if(pos.y/H>=layer.foot)continue;
    ctx.save();
    ctx.beginPath();
    layer.outline.forEach(([x,y],i)=>i?ctx.lineTo(x*W,y*H):ctx.moveTo(x*W,y*H));
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(art,0,0);
    ctx.restore();
   }
   ctx.restore();
  }
  function move(dx,dy,budget) {
   const distance=Math.hypot(dx,dy);
   if(!distance)return true;
   const factor=Math.min(1,budget/distance),x=pos.x+dx*factor,y=pos.y+dy*factor;
   if(!grid[cell(x,y)]||!grid[cell(x,pos.y)]||!grid[cell(pos.x,y)])return false;
   dir=Math.abs(dx)>Math.abs(dy)?(dx>0?2:3):(dy>0?1:0);
   pos={x,y};
   phase+=distance*factor/12;
   return true;
  }
  function tick(now) {
   frame=0;
   const dt=previous?Math.min(.028,(now-previous)/1000):.016;
   previous=now;
   let dx=0,dy=0,budget=dt*146;
   for(const key of held) {const direction=keys.get(key);dx+=direction[0];dy+=direction[1];}
   if(dx||dy)move(dx*50,dy*50,budget);
   else while(route.length&&budget>0) {
    const target=route[0],x=target.x-pos.x,y=target.y-pos.y,distance=Math.hypot(x,y);
    if(!move(x,y,budget)) {route=[];break;}
    if(distance<=budget+.001)route.shift();
    budget-=distance;
   }
   if(route.length||held.size)wake();
   else {phase=0;previous=0;remember();}
   locate();
   paint();
  }
  function wake() {if(!frame)frame=requestAnimationFrame(tick);}
  function go(x,y) {
   if(plan(x,y))wake();
   else {route=[];say('Choose the trail or a clear terrace.');}
  }
  canvas.addEventListener('pointerdown',event=>{
   canvas.focus();
   const bounds=canvas.getBoundingClientRect();
   go(view.x+(event.clientX-bounds.left)/bounds.width*view.w,
      view.y+(event.clientY-bounds.top)/bounds.height*view.h);
  });
  canvas.addEventListener('keydown',event=>{
   const key=event.key.toLowerCase();
   if(!keys.has(key))return;
   event.preventDefault();
   route=[];
   held.add(key);
   wake();
  });
  window.addEventListener('keyup',event=>held.delete(event.key.toLowerCase()));
  canvas.addEventListener('blur',()=>held.clear());
  window.addEventListener('pagehide',()=>{
   try {localStorage.setItem(saveKey,JSON.stringify({x:pos.x/W,y:pos.y/H}));} catch {}
  });
  overview.onclick=()=>{
   fullMap=!fullMap;
   overview.textContent=fullMap?'Follow the party':'Show full map';
   overview.setAttribute('aria-pressed',String(fullMap));
   paint();
  };
  destinations.onchange=()=>{
   const mark=marks[destinations.value];
   if(mark)go(mark.x*W,mark.y*H);
   destinations.selectedIndex=0;
   canvas.focus();
  };
  document.querySelector('#trailhead').onclick=()=>{
   route=[];
   held.clear();
   pos=point(marks.Trailhead);
   phase=0;
   locate();
   paint();
   remember();
   canvas.focus();
  };
  locate();
  paint();
 }
 start().catch(()=>{status.textContent='Frostpeak could not load.';});
})();
