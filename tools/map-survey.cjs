// Paint/collision survey. Diagnostic output stays outside the published game.
const fs=require('node:fs'),path=require('node:path');
require('./browser-harness.cjs')(async({evaluate:e,root,errors})=>{
 await e(`document.querySelector('#start').click();window.surveyBase=GameProgress.exportData().data`);
 const ids=['region-0','region-1','region-2','region-3','region-4','rootbound','frostmine','amber-hollow','clockwork-garden','lantern-grotto'];
 const reports=[];
 for(const id of ids){
  const result=await e(`(async()=>{
   const id=${JSON.stringify(id)},c=JSON.parse(JSON.stringify(surveyBase.campaign)),side=SideGeography.get(id);c.viewChapter=side?.chapter??Number(id.slice(7));c.completed=[];delete c.forestQuest;delete c.dungeon;if(side)c.dungeon={id,returnPosition:{x:30,y:90,chapter:c.viewChapter},returnLocation:'entry'};
   DungeonRules.bind(c);ForestWorld.init();const l=OpenPaintedMaps.layout,w=300,h=200,closed=OpenPaintedMaps.reachable(true).slice(),open=OpenPaintedMaps.reachable(false).slice(),floor=ForestWorld.cells.slice(),raw=AuthoredFloors.mask(id),at=p=>Math.floor(p.y*2)*w+Math.floor(p.x*3),pass=v=>v===1||v===3;
   const targets=[...l.nodes,{...l.graph.points.get('merchant'),name:'Camp',kind:'camp'}].filter(n=>Number.isFinite(n.x));
   const stats={id,asset:OpenPaintedMaps.sceneAsset(),entry:l.entry,gate:{a:l.a,b:l.b},anchors:targets.map(n=>({id:n.id,name:n.name,kind:n.kind,x:n.x,y:n.y,walkable:pass(floor[at(n)]),closed:!!closed[at(n)],open:!!open[at(n)],zone:PaintedBoundaries.zone(id,n)})),walkable:floor.filter(pass).length,reachable:open.reduce((a,b)=>a+b,0),rawOnly:raw?raw.filter((v,i)=>pass(v)&&!pass(floor[i])).length:null};
   const components=[],seen=new Uint8Array(60000);for(let start=0;start<60000;start++){if(seen[start]||!pass(floor[start]))continue;const q=[start];seen[start]=1;for(let j=0;j<q.length;j++){const a=q[j],x=a%w,y=Math.floor(a/w);for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,b=ny*w+nx;if(nx>=0&&nx<w&&ny>=0&&ny<h&&!seen[b]&&pass(floor[b])){seen[b]=1;q.push(b);}}}if(q.length>8)components.push({size:q.length,x:(start%w+.5)/3,y:(Math.floor(start/w)+.5)/2});}stats.components=components.sort((a,b)=>b.size-a.size);
   const image=new Image();image.src=stats.asset;await image.decode();const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=800;const g=canvas.getContext('2d');g.drawImage(image,0,0,1200,800);const plain=canvas.toDataURL().split(',')[1];
   for(let i=0;i<60000;i++){if(pass(floor[i]))g.fillStyle=open[i]?'#16e5a038':'#ff603899';else if(raw&&pass(raw[i]))g.fillStyle='#ff36d180';else continue;g.fillRect(i%300*4,Math.floor(i/300)*4,4,4);}
   g.font='bold 12px system-ui';for(const p of targets){g.fillStyle='#071c21e8';const label=p.id||p.name;g.fillRect(p.x*12-2,p.y*8-17,g.measureText(label).width+8,20);g.fillStyle='#fff3bf';g.fillText(label,p.x*12+2,p.y*8-3);g.beginPath();g.arc(p.x*12,p.y*8,4,0,Math.PI*2);g.fill();}
   g.strokeStyle='#ffffff50';g.lineWidth=1;g.font='11px system-ui';for(let n=10;n<100;n+=10){g.beginPath();g.moveTo(n*12,0);g.lineTo(n*12,800);g.moveTo(0,n*8);g.lineTo(1200,n*8);g.stroke();g.fillStyle='white';g.fillText(String(n),n*12+2,12);g.fillText(String(n),2,n*8-2);}
   return {stats,plain,overlay:canvas.toDataURL().split(',')[1]};
  })()`);
  for(const type of ['plain','overlay'])fs.writeFileSync(path.resolve(root,'../survey-'+id+'-'+type+'.png'),Buffer.from(result[type],'base64'));
  reports.push(result.stats);console.log(JSON.stringify(result.stats));
 }
 fs.writeFileSync(path.resolve(root,'../map-survey.json'),JSON.stringify({reports,errors},null,2));
}).catch(error=>{console.error(error);process.exitCode=1;});
