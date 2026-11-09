/* Show the chosen walk, separately from the gold story objective. Reuse map frames. */
(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const button=document.createElement('button');button.id='stop-walking';button.type='button';button.hidden=true;button.textContent='Stop walking · Esc';button.title='Solid blue: your chosen walk. Gold: main story route. Stop here, or take over with WASD / arrows.';$('crypt-interact').before(button);
 const G=window.RouteGuide={cache:null,cancelVersion:0,
  stop(){if(!MouseNavigation.path.length)return;MouseNavigation.clear();$('explore-tip').textContent='Walking stopped. Choose another destination, or use WASD / arrows.';},
  sync(){
   const points=MouseNavigation.path;button.hidden=!points.length;
   if(!points.length){this.cache=null;$('mouse-destination').hidden=true;return null;}
   if(this.cache?.points!==points||this.cache.length!==points.length){
    const newRoute=this.cache?.points!==points;
    const path=new Path2D();points.forEach((p,i)=>i?path.lineTo(p.x*1.5,p.y):path.moveTo(p.x*1.5,p.y));this.cache={points,length:points.length,path,first:points[0],end:points.at(-1)};
    $('mouse-destination').style.left=this.cache.end.x+'%';$('mouse-destination').style.top=this.cache.end.y+'%';$('mouse-destination').hidden=false;
    if(newRoute&&!$('world').hidden){const c=DungeonRules.campaign,end=this.cache.end,near=FOREST_NODES.filter(n=>DungeonRules.visible(n)&&(n.global||n.chapter===c.viewChapter)).map(n=>n.global?{...n,...MapRoutes.graphs[c.viewChapter].points.get('merchant')}:n).map(n=>({n,d:Math.hypot((n.x-end.x)*1.5,n.y-end.y)})).sort((a,b)=>a.d-b.d)[0];$('explore-tip').textContent='Walking to '+(near?.d<1.2?near.n.name:'chosen ground')+' · Solid blue: your walk · Gold: main objective.';}
   }
   return this.cache;
  },
  draw(c,toScreen,p){
   const data=this.sync();if(!data)return;
   const a=toScreen(0,0),b=toScreen(100,100),scale=(b.x-a.x)/150;if(!(scale>0))return;
   c.save();c.translate(a.x,a.y);c.scale(scale,scale);c.lineCap='round';c.lineJoin='round';
   const connector=new Path2D();connector.moveTo(p.x*1.5,p.y);connector.lineTo(data.first.x*1.5,data.first.y);
   for(const [color,width]of [['#08232bd9',7],['#a6e1ed',3]]){c.strokeStyle=color;c.lineWidth=width/scale;c.stroke(data.path);c.stroke(connector);}
   c.fillStyle='#a6e1ed';c.strokeStyle='#092d35';c.lineWidth=2/scale;c.beginPath();c.arc(data.end.x*1.5,data.end.y,5/scale,0,Math.PI*2);c.fill();c.stroke();c.restore();
  }
 };
 button.onclick=()=>G.stop();
 document.addEventListener('keydown',event=>{
  if(event.key!=='Escape'||event.defaultPrevented||$('world').hidden||!MouseNavigation.path.length||document.querySelector('dialog[open]')||$('audio-settings').open||event.target?.closest?.('input,select,textarea,[contenteditable=true]'))return;
  event.preventDefault();G.stop();
 });
 const clear=MouseNavigation.clear;MouseNavigation.clear=function(...args){G.cancelVersion++;const result=clear.apply(this,args);G.sync();return result;};
 const advance=MouseNavigation.advance;MouseNavigation.advance=function(...args){const moving=this.path.length>0,version=G.cancelVersion,result=advance.apply(this,args);if(moving&&!this.path.length&&version===G.cancelVersion&&!$('world').hidden)$('explore-tip').textContent='Destination reached. Use E / Search if an interaction is available.';G.sync();return result;};
 const scene=OpenPaintedMaps.scene;OpenPaintedMaps.scene=function(c,list,toScreen,p){scene.call(this,c,list,toScreen,p);G.sync();if(MouseNavigation.path.length)list.push({y:-Infinity,draw:()=>G.draw(c,toScreen,p)});};
 // Mode changes and modal transitions already clear navigation; discard stale UI too.
 const bind=DungeonRules.bind;DungeonRules.bind=function(...args){const result=bind.apply(this,args);G.sync();return result;};
})();
