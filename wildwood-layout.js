/* Authored places and grove clusters. Coordinates describe objects, not walk rails. */
(()=>{'use strict';if(new URLSearchParams(location.search).get('map')!=='wildwood')return;
window.WildwoodLayout={version:1,width:6000,height:4000,speed:4.8,
 positions:{entry:[18,82],merchant:[22,82],m0:[29,69],m1:[38,42],m2:[58,44],m3:[83,25],'forest-supplies':[26,59],'forest-spirit':[38,72],'forest-ranger':[48,55]},
 trails:[
  [[18,82],[22,82],[23,77],[27,73],[29,69],[28,63],[26,59],[28,51],[33,47],[38,42]],
  [[29,69],[34,69],[38,72],[43,68],[46,61],[48,55],[52,50],[58,44]],
  [[38,42],[45,39],[51,39],[58,44],[65,44],[73,43],[78,36],[83,25]],
  [[26,59],[19,57],[12,58]],[[38,42],[32,34],[26,25],[18,28]],
  [[48,55],[55,63],[59,69],[59,75]],[[38,42],[45,28],[55,25],[64,25],[74,24]],
  [[73,43],[77,49],[79,58],[82,65]],[[83,25],[88,33],[88,49],[82,65]],
  [[18,82],[12,77],[12,65]],[[38,72],[36,80],[30,88]]
 ],
 groves:[[4,18,5,16],[5,50,6,18],[4,82,5,16],[25,96,21,5],[63,96,25,4],[95,80,5,17],[96,43,4,23],[27,5,22,4],[83,6,12,4],[17,47,7,8],[27,37,6,10],[42,30,7,5],[39,59,6,5],[31,81,4,7],[52,84,5,8],[76,79,10,9],[85,44,7,7],[71,31,4,8],[9,20,5,7],[86,18,5,5],[15,89,3,3]],
 caches:[
  {id:'wildwood-herbalist-cache',name:'Herbalist’s supplies',x:12,y:58},
  {id:'wildwood-watch-cache',name:'Old watchtower cache',x:18,y:28},
  {id:'wildwood-meadow-cache',name:'Firefly meadow cache',x:30,y:88},
  {id:'wildwood-mill-cache',name:'Mill keeper’s chest',x:59,y:75},
  {id:'wildwood-ruin-cache',name:'Eastern ruin strongbox',x:82,y:65},
  {id:'wildwood-river-cache',name:'Riverhead explorer’s cache',x:55,y:16}
 ],
 landmarks:[
  {id:'camp',x:22,y:80.5,art:'camp',width:4.2,height:6.4,footprints:[{x:22,y:79.6,rx:1.3,ry:.75}]},
  {id:'mossgate',x:29,y:68.6,art:'gate',width:5.3,height:7,footprints:[{x:27.8,y:68,rx:.45,ry:.65},{x:30.2,y:68,rx:.45,ry:.65}]},
  {id:'hollow',x:38,y:41,art:'hollow',width:5.2,height:7,footprints:[{x:38,y:40,rx:1.4,ry:.75}]},
  {id:'heart',x:83,y:23.7,art:'ancient',width:9,height:14,footprints:[{x:83,y:23,rx:.8,ry:.55}]},
  {id:'moonwell',x:38,y:71,art:'moonwell',width:3.1,height:5,footprints:[{x:38,y:70.4,rx:.9,ry:.65}]},
  {id:'ranger-post',x:46,y:54,art:'tower',width:3.4,height:6.6,footprints:[{x:46,y:53.4,rx:.8,ry:.55}]},
  {id:'watermill',x:61.8,y:73,art:'watermill',width:7.2,height:10,footprints:[{x:61.8,y:71.7,rx:2.4,ry:1.1}]},
  {id:'herbalist',x:12,y:56.5,art:'shelter',width:3.8,height:5.4,footprints:[{x:12,y:55.8,rx:1,ry:.6}]},
  {id:'old-watch',x:18,y:26.5,art:'tower',width:3.8,height:6.2,footprints:[{x:18,y:25.7,rx:.8,ry:.5}]},
  {id:'ruin-library',x:82,y:63,art:'library',width:5.3,height:8,footprints:[{x:82,y:61.5,rx:1.5,ry:.7}]},
  {x:78.5,y:63,art:'wall',width:3.4,height:5.2,rx:.65,ry:.45},
  {x:85.5,y:63.5,art:'wall',width:3.5,height:5,rx:.65,ry:.45},
  {x:77,y:24,art:'rune',width:2,height:3.6,rx:.4,ry:.35},
  {x:87,y:26,art:'rune',width:2,height:3.6,rx:.4,ry:.35}
 ],
 patrols:[{slot:0,questNode:'m0',home:[29,69]},{slot:1,questNode:'m1',home:[38,42]},{slot:2,questNode:'roam-0-2',home:[15,35]},{slot:3,questNode:'roam-0-3',home:[78,57]}]
};})();
