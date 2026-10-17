// In-house exploration: the rendered terrain and movement share this tile grid.
(()=>{'use strict';
const W=150,H=100;
window.ForestWorld={width:W,height:H,cells:null,classic:false,
 active(chapter=ExploreRules.activeChapter||0){return chapter===0&&!this.classic;},
 init(){if(this.cells)return;this.cells=new Uint8Array(W*H);const g=MapRoutes.graphs[0],edges=[];for(const [id,list]of g.edges)for(const edge of list)if(id<edge.id)edges.push([g.points.get(id),g.points.get(edge.id)]);
  this.rooms=['m0','m1','m3','ruins','merchant','shrine'].map(id=>g.points.get(id));
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const p=this.point(x,y);let distance=Infinity;for(const [a,b]of edges){const dx=(b.x-a.x)*1.5,dy=b.y-a.y,t=Math.max(0,Math.min(1,(((p.x-a.x)*1.5)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));distance=Math.min(distance,Math.hypot((p.x-a.x)*1.5-t*dx,p.y-a.y-t*dy));}const room=this.rooms.some(r=>Math.hypot((p.x-r.x)/4.5,(p.y-r.y)/4.7)<=1),river=this.river(p),bridge=river&&distance<=1.45;this.cells[y*W+x]=bridge?3:river?2:distance<=2.55||room?1:0;}
 },
 river(p){if(p.y>29)return false;const center=59+Math.sin(p.y*.12)*1.3;return Math.abs(p.x-center)<2.3;},
 point(x,y){return {x:(x+.5)*100/W,y:(y+.5)*100/H};},
 cell(p){return {x:Math.max(0,Math.min(W-1,Math.floor(p.x/100*W))),y:Math.max(0,Math.min(H-1,Math.floor(p.y/100*H)))};},
 terrain(x,y){this.init();return x>=0&&x<W&&y>=0&&y<H?this.cells[y*W+x]:0;},
 walkable(p){if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.y)||p.x<1||p.x>99||p.y<1||p.y>99)return false;const c=this.cell(p),v=this.terrain(c.x,c.y);return v===1||v===3;},
 nearest(p,max=Infinity){this.init();let best=null;for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if([1,3].includes(this.cells[y*W+x])){const at=this.point(x,y),distance=Math.hypot((at.x-p.x)*1.5,at.y-p.y);if(distance<=max&&(!best||distance<best.distance))best={...at,distance};}return best;},
 blocked(a,b,barriers=[]){const graph=MapRoutes.graphs[0];return barriers.some(gate=>{const from=graph.points.get(gate.a),to=graph.points.get(gate.b);if(!from||!to)return ExploreRules.blocked(graph,a,b,[gate]);const dx=to.x-from.x,dy=to.y-from.y,length=Math.hypot(dx,dy),project=p=>({along:((p.x-gate.x)*dx+(p.y-gate.y)*dy)/length,across:Math.abs((p.x-gate.x)*dy-(p.y-gate.y)*dx)/length}),p=project(a),q=project(b);return q.across<=3.7&&(Math.abs(q.along)<.65||p.along*q.along<0&&Math.min(p.across,q.across)<=3.7);});},
 move(p,dx,dy,seconds,barriers=[]){if(!this.walkable(p)){const snap=this.nearest(p);if(snap)p={x:snap.x,y:snap.y};}const length=Math.hypot(dx,dy);if(!length)return {...p};const budget=ExploreRules.speed*Math.min(.08,Math.max(0,seconds)),steps=Math.max(1,Math.ceil(budget/.25));let at={...p};for(let i=0;i<steps;i++){const sx=dx/length*budget/steps/1.5,sy=dy/length*budget/steps,candidates=[{x:at.x+sx,y:at.y+sy},{x:at.x+sx,y:at.y},{x:at.x,y:at.y+sy}];const next=candidates.find(q=>this.walkable(q)&&!this.blocked(at,q,barriers));if(next)at=next;}return at;},
 route(start,goal,closed){this.init();const s=this.walkable(start)?start:this.nearest(start),end=this.nearest(goal,4);if(!s||!end)return null;const a=this.cell(s),b=this.cell(end),sid=a.y*W+a.x,tid=b.y*W+b.x,barriers=closed?[RegionGates.gate(0)]:[],cost=new Float64Array(W*H).fill(Infinity),prev=new Int32Array(W*H).fill(-1),done=new Uint8Array(W*H),heap=[];
  const push=(id,score)=>{let i=heap.length;heap.push({id,score});while(i){const j=(i-1)>>1;if(heap[j].score<=score)break;heap[i]=heap[j];i=j;}heap[i]={id,score};},pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){let i=0;while(true){let j=i*2+1;if(j>=heap.length)break;if(j+1<heap.length&&heap[j+1].score<heap[j].score)j++;if(last.score<=heap[j].score)break;heap[i]=heap[j];i=j;}heap[i]=last;}return top.id;};
  const pass=(x,y)=>[1,3].includes(this.terrain(x,y));cost[sid]=0;push(sid,0);
  while(heap.length){const id=pop();if(done[id])continue;done[id]=1;if(id===tid)break;const x=id%W,y=Math.floor(id/W),p=this.point(x,y);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const nx=x+dx,ny=y+dy;if(!pass(nx,ny)||dx&&dy&&(!pass(x+dx,y)||!pass(x,y+dy)))continue;const next=ny*W+nx,q=this.point(nx,ny);if(this.blocked(p,q,barriers))continue;const value=cost[id]+(dx&&dy?1.41421356:1);if(value>=cost[next])continue;cost[next]=value;prev[next]=id;push(next,value+Math.hypot(nx-b.x,ny-b.y));}}
  if(!Number.isFinite(cost[tid]))return null;const ids=[tid];while(ids[0]!==sid){const parent=prev[ids[0]];if(parent<0)return null;ids.unshift(parent);}return ids.map(id=>this.point(id%W,Math.floor(id/W)));
 },
 advance(p,seconds,barriers=[]){let at={...p},budget=ExploreRules.speed*Math.min(.08,Math.max(0,seconds));while(MouseNavigation.path.length&&budget>0){const goal=MouseNavigation.path[0],dx=(goal.x-at.x)*1.5,dy=goal.y-at.y,d=Math.hypot(dx,dy);if(d<.00001){MouseNavigation.path.shift();continue;}const step=Math.min(d,budget),q={x:at.x+dx/d*step/1.5,y:at.y+dy/d*step};if(!this.walkable(q)||this.blocked(at,q,barriers)){MouseNavigation.clear();break;}at=q;budget-=step;if(step===d)MouseNavigation.path.shift();}return at;}
};
try{ForestWorld.classic=new URL(location.href).searchParams.get('world')==='classic';}catch{}
const oldMove=ExploreRules.move.bind(ExploreRules),oldValid=ExploreRules.valid.bind(ExploreRules),oldRoute=MouseNavigation.route.bind(MouseNavigation),oldAdvance=MouseNavigation.advance.bind(MouseNavigation);
const oldSize=WorldCamera.size.bind(WorldCamera);
WorldCamera.size=function(chapter,width,height){if(!ForestWorld.active(chapter))return oldSize(chapter,width,height);const w=Math.max(1800,Math.min(2600,width*1.75));return {width:w,height:w/1.5};};
const oldPatrol=WorldCamera.patrol;
WorldCamera.patrol=function(seconds){if(!ForestWorld.active())return oldPatrol(seconds);const g=MapRoutes.graphs[0],points=['v6','v7','v24'].map(id=>g.points.get(id)),lengths=points.slice(1).map((p,i)=>Math.hypot((p.x-points[i].x)*1.5,p.y-points[i].y)),total=lengths.reduce((a,b)=>a+b,0);let distance=(seconds*3)%(total*2);if(distance>total)distance=total*2-distance;for(let i=0;i<lengths.length;i++){if(distance<=lengths[i]){const t=distance/lengths[i];return {x:points[i].x+(points[i+1].x-points[i].x)*t,y:points[i].y+(points[i+1].y-points[i].y)*t};}distance-=lengths[i];}return {...points[0]};};
ExploreRules.move=function(graph,p,dx,dy,seconds,barriers=[]){return ForestWorld.active()&&graph===MapRoutes.graphs[0]?ForestWorld.move(p,dx,dy,seconds,barriers):oldMove(graph,p,dx,dy,seconds,barriers);};
ExploreRules.valid=function(p,chapter,graphs){return ForestWorld.active(chapter)?p?.chapter===chapter&&ForestWorld.walkable(p):oldValid(p,chapter,graphs);};
MouseNavigation.route=function(chapter,start,goal,closed){return ForestWorld.active(chapter)?ForestWorld.route(start,goal,closed):oldRoute(chapter,start,goal,closed);};
MouseNavigation.advance=function(graph,p,seconds,barriers=[]){return ForestWorld.active()&&graph===MapRoutes.graphs[0]?ForestWorld.advance(p,seconds,barriers):oldAdvance(graph,p,seconds,barriers);};
})();
