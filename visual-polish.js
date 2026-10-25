/* One visual layer for travel, native scene seals and an opening atlas. */
(()=>{
 const colors={forest:'#a4d28d',mountain:'#9bc9df',city:'#d9bf82',coast:'#9bd5cb',mine:'#a2bfdf',crypt:'#b4cda0'};
 window.ScenicSeals={scene(c,list,toScreen,campaign,time=0){
  if(RegionGates.open(campaign.viewChapter,campaign.completed))return;
  const gate=RegionGates.gate(campaign.viewChapter),graph=MapRoutes.graphs[campaign.viewChapter],a=graph.points.get(gate.a),b=graph.points.get(gate.b);
  if(!a||!b)return;const geo=SideGeography.get()||OutdoorGeography.get(),dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,span=geo?.pass?.r?geo.pass.r/Math.hypot(dy/len*1.5,dx/len):3.55,at=toScreen(gate.x,gate.y),left=toScreen(gate.x-dy/len*span,gate.y+dx/len*span),right=toScreen(gate.x+dy/len*span,gate.y-dx/len*span),color=colors[OpenPaintedMaps.layout?.theme]||'#d3b780';
  list.push({y:at.y,draw:()=>{c.save();c.strokeStyle=color;c.lineWidth=2;c.globalAlpha=.65;c.setLineDash([3,7]);c.beginPath();c.moveTo(left.x,left.y-3);c.lineTo(right.x,right.y-3);c.stroke();c.setLineDash([]);for(const p of [left,right]){c.beginPath();c.ellipse(p.x,p.y,8,3,0,0,Math.PI*2);c.stroke();}c.globalAlpha=1;c.strokeStyle=color;c.beginPath();c.moveTo(at.x,at.y-24);c.lineTo(at.x+6,at.y-16);c.lineTo(at.x,at.y-8);c.lineTo(at.x-6,at.y-16);c.closePath();c.stroke();c.restore();}});
 }};
 MapWalkers.update=function(p,dx,dy,moving,time){
  PartyTrail.push(p);const positions=PartyTrail.formation(),canvasMode=document.getElementById('forest-map')?.dataset.canvasActors==='true';
  for(const r of this.renderers){const at=positions[r.trailIndex??r.index],config=this.configs[r.index];if(!config)continue;const vx=(r.trailIndex??r.index)?at.dx:dx,vy=(r.trailIndex??r.index)?at.dy:dy;
   if(Math.abs(vx)+Math.abs(vy)>.001)r.direction=PartyTrail.direction(vx,vy);
   const row={north:0,south:1,east:2,west:3}[r.direction];r.frame=moving&&!MotionPreference.reduced()?Math.floor(time*8)%4:0;r.position={x:at.x,y:at.y};
   if(canvasMode)continue;
   const styles={left:at.x+'%',top:at.y+'%',transform:'translate(-50%,-'+((config.feet?.[row*4+r.frame]||.92)*100)+'%)',zIndex:String(Math.round(at.y*10)),backgroundImage:'url("'+config.image+'")',backgroundSize:'400% '+((config.rows||4)*100)+'%',backgroundPosition:r.frame/3*100+'% '+(row+(config.rowOffset||0))/((config.rows||4)-1)*100+'%'},crop=config.travelCrops?.[row*4+r.frame];
   styles.clipPath=crop?'inset('+[crop.top,Math.max(0,1-crop.left-crop.width),Math.max(0,1-crop.top-crop.height),crop.left].map(v=>(v*100)+'%').join(' ')+')':'';
   for(const [key,value]of Object.entries(styles))if(r.el.style[key]!==value)r.el.style[key]=value;
   r.el.dataset.direction=r.direction;r.el.dataset.state=moving?'walk':'idle';
  }
 };
 JourneyGuide.openOverview=function(){if(this.traveling)return;this.ensureUI();this.renderAtlas({completed:[],viewChapter:0});this.ui.dialog.showModal();this.ui.scroll.scrollTop=0;this.ui.scroll.scrollLeft=0;};
 const overview=document.getElementById('title-world-map-open');if(overview)overview.onclick=()=>JourneyGuide.openOverview();
})();

/* Registered spell poses retain equipped weapons without neighboring-sheet pixels. */
(()=>{
 const A=window.SerenAttackArt={image:'assets/seren-attack-isolated.webp?v=20261025-1',bare:'assets/seren-attack-body.webp?v=20261025-1',width:2172,height:724,scale:.67,rects:[],grips:[[345,350],[780,245],[1450,435],[2010,450]],angles:[20,28,62,5]};
 const xs=[0,543,1086,1675],ws=[543,543,589,497],centers=[274.5,821,1310,1910];
 A.rects=xs.map((x,i)=>({x,y:0,w:ws[i],h:724,dx:220-(centers[i]-x)*.67,dy:425-657*.67,scale:.67}));
 PARTY_V3.seren.states.attack={frames:[0,1,2,3],fps:8,loop:false,releaseFrame:2,image:A.image,frameWidth:440,frameHeight:440,sheetWidth:2172,sheetHeight:724,frameRects:A.rects,columns:4,rows:1};
 const E=EquipmentAppearance,body=E.body,rig=E.rig,install=E.install;
 const frames=new Map();
 E.body=async function(member,type,frame){
  if(member!=='seren'||type!=='battle'||frame<4||frame>7)return body.call(this,member,type,frame);
  const i=frame-4;if(frames.has(i))return frames.get(i);
  const promise=(async()=>{const [original,bare]=await Promise.all([this.image(A.image),this.image(A.bare)]),r=A.rects[i],draw=im=>{const can=this.canvas(440,440),c=can.getContext('2d');c.drawImage(im,r.x*im.naturalWidth/A.width,0,r.w*im.naturalWidth/A.width,im.naturalHeight,r.dx,r.dy,r.w*r.scale,r.h*r.scale);return can;},can=draw(bare);return {canvas:can,original:draw(original),bounds:this.bounds(can),spellPose:i};})();
  frames.set(i,promise);promise.catch(()=>frames.delete(i));return promise;
 };
 E.install=function(role,member,result){install.call(this,role,member,result);if(member==='seren'&&result.attack)HEROES[role].states.attack={frames:[0,1,2,3],fps:8,loop:false,releaseFrame:2,image:result.attack,frameWidth:440,frameHeight:440,sheetWidth:1760,sheetHeight:440,columns:4,rows:1,frameRects:Array.from({length:4},(_,i)=>({x:i*440,y:0,w:440,h:440,dx:0,dy:0,scale:1}))};};
})();

EquipmentAppearance.spellRig=function(body,frame,role){const A=SerenAttackArt,i=body.spellPose,r=this.rig(body.bounds,'battle',frame,role),crop=A.rects[i],grip=A.grips[i];r.grip={x:crop.dx+(grip[0]-crop.x)*crop.scale,y:crop.dy+grip[1]*crop.scale};r.weaponAngle=A.angles[i]*Math.PI/180;return r;};

EquipmentAppearance.weaponGrip=function(part){
 if(part.staffGrip)return part.staffGrip;const can=part.canvas,bytes=can.getContext('2d').getImageData(0,0,can.width,can.height).data,points=[];
 for(let y=0;y<can.height;y+=2)for(let x=0;x<can.width;x+=2){const i=(y*can.width+x)*4;if(bytes[i+3]>128&&bytes[i]>bytes[i+1]*1.04&&bytes[i]>bytes[i+2]*1.1)points.push([x,y]);}
 if(points.length<10)return {x:.30,y:.75,angle:0};
 const mx=points.reduce((s,p)=>s+p[0],0)/points.length,my=points.reduce((s,p)=>s+p[1],0)/points.length;let xx=0,yy=0,xy=0;
 for(const [x,y]of points){xx+=(x-mx)**2;yy+=(y-my)**2;xy+=(x-mx)*(y-my);}
 const theta=.5*Math.atan2(2*xy,xx-yy);let ax=Math.cos(theta),ay=Math.sin(theta);if(ay>0){ax=-ax;ay=-ay;}
 const projections=points.map(([x,y])=>(x-mx)*ax+(y-my)*ay).sort((a,b)=>a-b),low=projections[Math.floor(projections.length*.05)],high=projections[Math.floor(projections.length*.95)],grip=low+(high-low)*.32;
 return part.staffGrip={x:(mx+ax*grip)/can.width,y:(my+ay*grip)/can.height,angle:Math.atan2(ax,-ay)};
};

