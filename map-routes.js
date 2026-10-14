// Waypoints traced along the roads in the three painted chapter maps.
window.MapRoutes={graphs:[],build(lines){const points=new Map(),edges=new Map();for(const line of lines){let previous;for(const [id,x,y]of line){points.set(id,{id,x,y});if(!edges.has(id))edges.set(id,[]);if(previous){const p=points.get(previous),cost=Math.hypot(x-p.x,y-p.y);edges.get(previous).push({id,cost});edges.get(id).push({id:previous,cost});}previous=id;}}return {points,edges};},route(chapter,from,to){const g=this.graphs[chapter],start=g.points.has(from)?from:'entry',end=g.points.has(to)?to:'entry',dist=new Map([[start,0]]),prev=new Map(),open=new Set(g.points.keys());while(open.size){const u=[...open].sort((a,b)=>(dist.get(a)??Infinity)-(dist.get(b)??Infinity))[0];if(!Number.isFinite(dist.get(u)))break;open.delete(u);if(u===end)break;for(const e of g.edges.get(u)){const d=dist.get(u)+e.cost;if(d<(dist.get(e.id)??Infinity)){dist.set(e.id,d);prev.set(e.id,u);}}}const ids=[end];while(ids[0]!==start){const p=prev.get(ids[0]);if(!p)throw Error('Map road is disconnected.');ids.unshift(p);}return ids.map(id=>g.points.get(id));},apply(){FOREST_NODES.forEach(n=>{const p=this.graphs[n.chapter||0].points.get(n.id);if(p&&!n.global){n.x=p.x;n.y=p.y;}});JOURNEY_CHAPTERS.forEach((c,i)=>{const p=this.graphs[i].points.get('merchant');c.camp=[p.x,p.y];});}};
MapRoutes.graphs=[
MapRoutes.build([
[['entry',20,91],['f0',23,86],['cache',34,85],['f1',40,81],['f2',46,73],['f3',49,63]],
[['m0',14,72],['f4',18,75],['f5',26,77],['f6',34,79],['f7',42,76],['f2',46,73]],
[['f3',49,63],['f8',48,59],['f9',44,56],['m1',37,51],['f10',32,48],['f11',28,43],['f12',23,39],['f13',18,35],['shrine',14,33]],
[['f3',49,63],['f14',53,65],['f15',57,69],['merchant',61,75]],
[['f8',48,59],['f16',54,56],['f17',60,54],['f18',65,53],['ruins',70,51]],
[['f8',48,59],['f19',49,52],['f20',48,47],['f21',44,40],['f22',47,35],['f23',52,30],['m2',58,27],['f24',65,24],['f25',70,22],['f26',75,25],['f27',80,29],['m3',84,28]]]),
MapRoutes.build([
[['entry',15,92],['h0',25,89],['cache2',39,86],['h1',48,85],['h2',57,83],['h3',64,81],['h4',68,77],['merchant',72,75]],
[['cache2',39,86],['h5',30,81],['h6',22,76],['m4',14,72],['h7',20,69],['h8',26,64],['h9',31,59],['h10',36,56],['m5',37,51]],
[['h9',31,59],['h11',29,53],['h12',25,48],['h13',23,43],['h14',18,39],['spring2',14,33]],
[['h10',36,56],['h15',44,55],['h16',48,52],['h17',52,50],['h18',57,49],['h19',62,52],['h20',67,53],['mine',70,51],['h21',73,55],['h22',78,59],['h23',77,63],['h24',73,69],['merchant',72,75]],
[['h16',48,52],['h25',49,45],['h26',44,38],['h27',43,35],['h28',48,31],['h29',53,27],['m6',60,23],['h30',60,28],['h31',58,30],['h32',65,32],['h33',72,29],['h34',80,27],['h35',86,24],['m7',90,18]]]),
MapRoutes.build([
[['entry',50,95],['c0',47,92],['cache3',43,88],['c1',35,85],['c2',30,80],['c3',24,78],['m8',18,75],['c4',25,74],['c5',31,70],['c6',35,65],['c7',41,63],['c8',44,59],['c9',45,55],['m9',40,50]],
[['c7',41,63],['c10',48,66],['c11',52,70],['c12',53,74],['c13',60,75],['merchant',67,79]],
[['m9',40,50],['c14',45,47],['c15',50,44],['c16',52,40],['c17',50,36],['c18',41,35],['c19',32,35],['c20',25,33],['c21',19,30],['spring3',14,26]],
[['c16',52,40],['c22',52,33],['c23',55,29],['c24',59,25],['m10',63,23],['c25',66,18],['c26',73,14],['c27',80,15],['c28',85,20],['c29',88,25],['m11',90,33]],
[['c15',50,44],['c30',56,46],['c31',63,49],['c32',68,52],['c33',72,56],['c34',77,57],['vault',80,56]]])];MapRoutes.apply();
