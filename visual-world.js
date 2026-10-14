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
