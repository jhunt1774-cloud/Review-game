// Forest-specific exploration geography and camera bounds.
FOREST_NODES.push({id:'firefly-cache',chapter:0,kind:'treasure',stage:0,name:'Firefly glade',description:'A forgotten chest waits beyond the fern-lined trail.',x:10,y:84},{id:'ranger-cache',chapter:0,kind:'treasure',stage:2,name:'Ranger’s hidden camp',description:'Follow the eastern trail to recover the ranger’s supplies.',x:78,y:80});
JOURNEY_CHAPTERS[0].map='assets/forest-explore.webp?v=f06739c134';
MapRoutes.graphs[0]=MapRoutes.build([
[['entry',21,96],['v0',22,91],['v1',24,87],['v2',26,82],['v3',27,77],['v4',29,73],['cache',36,73],['v5',40,70],['v6',45,65],['v7',49,57]],
[['m0',13,60],['v8',18,60],['v9',23,58],['v10',28,57],['v11',33,56],['v12',40,57],['v7',49,57]],
[['v7',49,57],['v13',48,53],['v14',44,48],['v15',40,46],['m1',37,42],['v16',31,39],['v17',27,35],['v18',23,29],['v19',18,25],['shrine',14,23]],
[['v7',49,57],['v20',54,62],['v21',58,66],['merchant',63,70],['v22',68,75],['v23',74,77],['ranger-cache',78,79]],
[['v7',49,57],['v24',49,49],['v25',54,47],['v26',59,45],['v27',64,41],['v28',69,41],['ruins',70,45]],
[['v24',49,49],['v29',48,43],['v30',48,36],['v31',49,31],['v32',52,25],['v33',56,20],['m2',58,18],['v34',63,17],['v35',69,15],['v36',74,13],['v37',78,15],['v38',80,18],['v39',83,22],['m3',85,21]],
[['v1',24,87],['v40',19,87],['v41',14,86],['firefly-cache',9,83]]]);
MapRoutes.apply();
window.WorldCamera={size(chapter,width,height){const w=chapter===0?Math.max(1800,width*2.4):Math.max(width,height*1.5);return {width:w,height:w/1.5};},follow(p,world,viewport){return {x:Math.max(0,Math.min(world.width-viewport.width,p.x/100*world.width-viewport.width/2)),y:Math.max(0,Math.min(world.height-viewport.height,p.y/100*world.height-viewport.height/2))};}};

WorldCamera.patrol=seconds=>({x:44.5+Math.sin(seconds*.3)*4.5,y:57});

window.RegionGates={edges:[['v34','v35'],['h32','h33'],['c27','c28'],['s28','s29']],boss(chapter){return 'm'+(chapter*4+3);},remaining(chapter,completed){return FOREST_NODES.filter(n=>n.chapter===chapter&&n.kind==='battle'&&!n.hidden&&n.id!==this.boss(chapter)&&!completed.includes(n.id));},open(chapter,completed){return completed.includes(this.boss(chapter))||this.remaining(chapter,completed).length===0;},gate(chapter){const graph=MapRoutes.graphs[chapter],[a,b]=this.edges[chapter],p=graph.points.get(a),q=graph.points.get(b);return {x:(p.x+q.x)/2,y:(p.y+q.y)/2,radius:ExploreRules.roadWidth+1.5,a,b};},safeSide(chapter){const graph=MapRoutes.graphs[chapter],gate=this.gate(chapter),seen=new Set(['entry']),queue=['entry'];while(queue.length){const id=queue.shift();for(const edge of graph.edges.get(id)){if(id===gate.a&&edge.id===gate.b||id===gate.b&&edge.id===gate.a)continue;if(!seen.has(edge.id)){seen.add(edge.id);queue.push(edge.id);}}}return seen;},safePosition(chapter,p,completed){if(this.open(chapter,completed))return p;const graph=MapRoutes.graphs[chapter],nearest=[...graph.points.values()].sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];if(this.safeSide(chapter).has(nearest.id))return p;const gate=this.gate(chapter);return [...this.safeSide(chapter)].map(id=>graph.points.get(id)).filter(v=>Math.hypot(v.x-gate.x,v.y-gate.y)>gate.radius+1).sort((a,b)=>Math.hypot(a.x-gate.x,a.y-gate.y)-Math.hypot(b.x-gate.x,b.y-gate.y))[0]||graph.points.get('entry');}};
FOREST_NODES.forEach(n=>{if(n.optional&&!n.hidden){n.description=n.description.replace(/optional/gi,'Side-route');if(FOREST_STORY.areas[n.id])FOREST_STORY.areas[n.id].danger=FOREST_STORY.areas[n.id].danger.replace(/optional/gi,'side-route');}});
