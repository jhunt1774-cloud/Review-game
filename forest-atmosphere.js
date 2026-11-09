/* Forest scenery stays on the painted river and respects the existing movement mask. */
(() => {
 'use strict';
 const Q=ForestAdventure,$=id=>document.getElementById(id),distance=(a,b)=>Math.hypot((a.x-b.x)*1.5,a.y-b.y);
 const river=[[53,0],[55,10],[56,18],[59,28],[60,34],[62,42],[65,51],[72,62],[82,74],[92,88],[100,98]];
 const A=window.ForestAtmosphere={preference:'gentle',cache:null,builds:0,last:{active:false,drawn:0,moving:false},
  active(){return Q.active(DungeonRules.campaign)&&OpenPaintedMaps.layout?.id==='region-0'&&!DungeonRules.active;},
  moving(){return this.preference==='gentle'&&!MotionPreference.reduced()&&window.VisualTrial?.mode!=='light'&&!document.hidden;},
  set(value){this.preference=['gentle','still','off'].includes(value)?value:'gentle';try{localStorage.setItem('forest-atmosphere',this.preference);}catch{}},
  riverX(y){for(let i=1;i<river.length;i++)if(y<=river[i][1]){const a=river[i-1],b=river[i],t=(y-a[1])/(b[1]-a[1]);return a[0]+(b[0]-a[0])*t;}return 100;},
  ground(p){if(!ForestWorld.cells||p.x<1||p.x>99||p.y<1||p.y>99)return false;const at=ForestWorld.cell(p),value=ForestWorld.cells[at.y*300+at.x];return value===1||value===3;},
  water(p){return p.y>=1&&p.y<=97&&Math.abs(p.x-this.riverX(p.y))<2.1&&!this.ground(p);},
  waterLine(p){return [-.55,-.28,0,.28,.55].every(dx=>this.water({x:p.x+dx,y:p.y}));},
  build(){
   if(this.cache?.floor===ForestWorld.cells)return this.cache;
   const canvas=document.createElement('canvas');canvas.width=300;canvas.height=200;const c=canvas.getContext('2d'),pixels=c.createImageData(300,200),water=[];
   for(let y=0;y<200;y++)for(let x=0;x<300;x++){const p=ForestWorld.point(x,y);if(this.water(p)){const at=(y*300+x)*4;pixels.data.set([139,212,215,12],at);}}
   c.putImageData(pixels,0,0);
   for(let i=0;i<12;i++){const y=5+i*7.5,p={x:this.riverX(y)+(i%3-1)*.65,y};if(this.waterLine(p))water.push(p);}
   const leaves=[];for(let i=0;i<100&&leaves.length<8;i++){const p={x:8+(i*29%84),y:8+(i*37%84)};if(this.water(p)||this.ground(p))continue;let clear=true;for(const dx of [-1,0,1])for(const dy of [-1,0,1])if(this.ground({x:p.x+dx,y:p.y+dy}))clear=false;if(clear)leaves.push(p);}
   const foot=ForestWorld.nearest({x:28,y:25},1),top=ForestWorld.nearest({x:28,y:15},1),route=foot&&top?ForestWorld.route(foot,top,false):null,steps=[];
   if(route)for(let i=4;i<route.length&&steps.length<8;i+=Math.max(4,Math.floor(route.length/8)))steps.push(route[i]);
   this.builds++;return this.cache={floor:ForestWorld.cells,canvas,water,leaves,foot,steps};
  },
  sign(open){this.signs??=new Map();if(this.signs.has(open))return this.signs.get(open);const canvas=document.createElement('canvas');canvas.width=174;canvas.height=91;const c=canvas.getContext('2d');c.fillStyle='#503d2c';c.fillRect(82,39,9,48);c.fillStyle='#9b8760';c.fillRect(84,42,2,43);c.fillStyle=open?'#193f34':'#3d3229';c.strokeStyle=open?'#c8d9a1':'#c6a17b';c.lineWidth=2;c.beginPath();c.roundRect(4,3,166,49,5);c.fill();c.stroke();c.textAlign='center';c.fillStyle='#f2e2bd';c.font='bold 13px system-ui';c.fillText('MOONWELL STAIRS',87,22);c.font='12px system-ui';c.fillStyle=open?'#c5e4c2':'#e6bf9a';c.fillText(open?'↑ Guardian grove':'Sealed · face the sentinel',87,41);this.signs.set(open,canvas);return canvas;},
  scene(c,list,toScreen,p){
   this.last={active:this.active(),drawn:0,moving:false};if(!this.last.active||document.hidden)return;
   const campaign=DungeonRules.campaign,cache=this.build(),open=campaign.completed.includes('m2'),restored=Q.complete(campaign),moving=this.moving(),time=moving?performance.now()/1000:0;this.last.moving=moving;
   if(cache.foot&&distance(p,cache.foot)<24){const at=toScreen(cache.foot.x,cache.foot.y);list.push({y:at.y,draw:()=>{c.drawImage(this.sign(open),at.x+14,at.y-75,174,91);if(open){c.save();c.strokeStyle='#e9db9cbb';c.lineWidth=1.4;for(const step of cache.steps){const s=toScreen(step.x,step.y);c.beginPath();c.moveTo(s.x-3,s.y+2);c.lineTo(s.x,s.y);c.lineTo(s.x+3,s.y+2);c.stroke();}c.restore();}}});}
   if(this.preference==='off')return;
   const origin=toScreen(0,0),end=toScreen(100,100);
   list.push({y:-1000000,draw:()=>{c.save();c.drawImage(cache.canvas,origin.x,origin.y,end.x-origin.x,end.y-origin.y);c.lineWidth=1.1;
    for(let i=0;i<cache.water.length;i++){const base=cache.water[i],point={x:base.x,y:base.y+(moving?Math.sin(time*.55+i)*.32:0)};if(!this.waterLine(point))continue;const a=toScreen(point.x-.55,point.y),b=toScreen(point.x+.55,point.y);c.strokeStyle=restored?'#e1f8e9':'#bde6e4';c.globalAlpha=.2+(moving?(Math.sin(time*.7+i)+1)*.1:.1);c.beginPath();c.moveTo(a.x,a.y);c.quadraticCurveTo((a.x+b.x)/2,a.y+1.5,b.x,b.y);c.stroke();this.last.drawn++;}c.restore();}});
   if(window.VisualTrial?.mode!=='light')list.push({y:1000000,draw:()=>{c.save();for(let i=0;i<cache.leaves.length;i++){const base=cache.leaves[i],x=base.x+(moving?Math.sin(time*.17+i)*.28:0),y=base.y+(moving?Math.sin(time*.23+i)*.35:0),at=toScreen(x,y);if(this.ground({x,y})||this.water({x,y}))continue;c.fillStyle=restored?'#e4cd8a':'#a4b58a';c.globalAlpha=.5;c.beginPath();c.ellipse(at.x,at.y,3,1.2,moving?time*.2+i:i,0,Math.PI*2);c.fill();this.last.drawn++;}c.restore();}});
   if(restored){const n=FOREST_NODES.find(n=>n.id==='m3');list.push({y:1000001,draw:()=>{c.save();c.fillStyle='#fff0bc';for(let i=0;i<4;i++){const at=toScreen(n.x+(i-1.5)*1.1,n.y-1.5-i%2),drift=moving?Math.sin(time*.6+i)*2:0;c.globalAlpha=.5;c.beginPath();c.arc(at.x,at.y-32+drift,1.8,0,Math.PI*2);c.fill();this.last.drawn++;}c.restore();}});}
  }
 };
 try{const value=localStorage.getItem('forest-atmosphere');if(['gentle','still','off'].includes(value))A.preference=value;}catch{}
 const label=document.createElement('label');label.textContent='Forest atmosphere';const select=document.createElement('select');select.id='forest-atmosphere';select.innerHTML='<option value="gentle">Gentle · follows motion and Light settings</option><option value="still">Still scenery</option><option value="off">Off · keep landmark signs</option>';select.value=A.preference;select.onchange=()=>A.set(select.value);label.append(select);$('map-ground-view').closest('label').after(label);
 const scene=OpenPaintedMaps.scene;OpenPaintedMaps.scene=function(c,list,toScreen,p){const result=scene.call(this,c,list,toScreen,p);A.scene(c,list,toScreen,p);return result;};
})();
