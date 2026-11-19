// Coordinates describe the head, shoulders, hips, sword elbow and wrist,
// shield wrist, and both knees and feet on a 240 × 240 stage.
const guard = [119,64, 114,108, 116,153, 127,135, 150,125, 92,119, 102,183, 92,215, 135,185, 148,215, -68];
const keys = [
 [0, guard],
 [130,[109,68, 106,112, 110,157, 87,100, 79,75, 97,125, 96,185, 83,215, 130,184, 148,215, -126]],
 [220,[104,61, 102,104, 105,151, 72,81, 56,63, 111,119, 95,183, 81,215, 123,181, 150,215, -153]],
 [265,[120,58, 118,103, 116,150, 111,77, 125,62, 100,114, 99,183, 78,215, 143,175, 165,209, -88]],
 [330,[149,77, 139,115, 122,151, 165,112, 180,127, 112,116, 99,185, 78,215, 156,178, 176,215, 4]],
 [385,[151,86, 143,123, 124,157, 162,143, 170,160, 114,129, 101,185, 78,215, 158,183, 176,215, 60]],
 [465,[140,82, 132,121, 120,155, 141,148, 150,153, 108,128, 101,185, 82,215, 148,180, 172,215, 37]],
 [590,[126,69, 123,111, 120,151, 130,135, 153,130, 102,121, 105,180, 91,211, 137,181, 153,215, -46]],
 [704,guard]
];

function poseAt(time) {
 const end = Math.max(1, keys.findIndex(([ms]) => ms >= time));
 const [startTime, first] = keys[end - 1];
 const [endTime, last] = keys[end];
 const linear = (time - startTime) / (endTime - startTime);
 const progress = time >= 220 && time <= 385 ? linear : linear * linear * (3 - 2 * linear);
 return first.map((value, index) => value + (last[index] - value) * progress);
}

function drawTrail(c, time) {
 if(time<282 || time>370)return;
 const edge = [];
 const inner = [];
 for(let ms=Math.max(248,time-62);ms<=time;ms+=4){
  const pose=poseAt(ms), angle=pose[20]*Math.PI/180;
  const offset=(ms-(time-62))/62;
  edge.push([pose[8]+Math.cos(angle)*60,pose[9]+Math.sin(angle)*60]);
  inner.push([pose[8]+Math.cos(angle)*(60-offset*26),pose[9]+Math.sin(angle)*(60-offset*26)]);
 }
 const points=edge.concat(inner.reverse());
 const glow=c.createLinearGradient(144,58,211,146);
 glow.addColorStop(0,'#fff5b500');
 glow.addColorStop(.5,'#e6eccc36');
 glow.addColorStop(1,'#fff5c18a');
 c.beginPath();
 points.forEach(([x,y],index)=>index?c.lineTo(x,y):c.moveTo(x,y));
 c.closePath();
 c.fillStyle=glow;
 c.globalAlpha=Math.min(1,(370-time)/24);
 c.fill();
 c.globalAlpha=1;
}

function drawWarrior(c, pose, bare = false) {
 const [hx,hy,sx,sy,px,py,ex,ey,wx,wy,bx,by,kx,ky,fx,fy,lx,ly,gx,gy,angle] = pose;
 const steel = ['#c8d5c7','#526f70','#23343b'];
 const leather = ['#94745a','#51372e','#2d2424'];
 const cloth = ['#b46345','#642b2c','#371f27'];
 const gold = ['#ffe0a0','#ac7846','#563827'];
 function shape(points, colors) {
  const gradient = c.createLinearGradient(Math.min(...points.map(p=>p[0])), Math.min(...points.map(p=>p[1])),
   Math.max(...points.map(p=>p[0])), Math.max(...points.map(p=>p[1])) + 1);
  colors.forEach((color, index) => gradient.addColorStop(index / (colors.length-1),color));
  c.beginPath();
  points.forEach(([x,y], index) => index ? c.lineTo(x,y) : c.moveTo(x,y));
  c.closePath();
  c.fillStyle = gradient;
  c.fill();
  c.lineJoin = 'round';
  c.lineWidth = 1.5;
  c.strokeStyle = '#191f25';
  c.stroke();
 }
 function plate(x,y,xx,yy,width,tip,colors) {
  const length = Math.hypot(xx-x,yy-y) || 1;
  const nx = (y-yy)/length, ny = (xx-x)/length;
  shape([[x+nx*width,y+ny*width],[xx+nx*tip,yy+ny*tip],
   [xx-nx*tip,yy-ny*tip],[x-nx*width,y-ny*width]], colors);
 }
 function boot(x,y) {
  shape([[x-8,y-10],[x+6,y-10],[x+10,y-4],[x+21,y],[x+21,y+5],[x-9,y+5]],leather);
 }
 c.save();
 c.fillStyle = '#111a272a';
 c.beginPath();c.ellipse((fx+gx)/2,219,Math.max(32,(gx-fx)/2+12),6,0,0,Math.PI*2);c.fill();
 shape([[sx-17,sy-10],[sx+9,sy+5],[px+8,py+18],[px-22,py+37],[sx-24-(sx-px)*.5,py+23]],cloth);
 plate(px-10,py,kx,ky,12,9,leather);
 plate(kx,ky,fx,fy-4,9,7,steel);
 boot(fx,fy);
 plate(px+11,py,lx,ly,13,10,leather);
 plate(lx,ly,gx,gy-4,10,8,steel);
 plate(lx-2,ly+1,gx-2,gy-5,2,1,['#f7e4ac','#6f8282']);
 boot(gx,gy);
 plate(sx-12,sy+2,bx,by,8,8,leather);
 shape([[sx-18,sy-12],[sx+13,sy-13],[sx+24,sy-1],[px+17,py-4],[px+10,py+4],[px-18,py-3],[sx-23,sy+3]],steel);
 shape([[sx-19,sy-10],[sx-10,sy-13],[px+9,py-4],[px+3,py+1]],cloth);
 plate(px-18,py-3,px+17,py+1,5,5,leather);
 shape([[px-4,py-9],[px+5,py-8],[px+5,py+2],[px-4,py+1]],gold);
 shape([[hx-10,hy+15],[hx+6,hy+16],[sx+7,sy-9],[sx-7,sy-10]],leather);
 shape([[hx-12,hy-14],[hx+7,hy-16],[hx+14,hy-8],[hx+14,hy+1],[hx+19,hy+7],[hx+13,hy+9],[hx+11,hy+20],[hx+3,hy+23],[hx-10,hy+13]],
  ['#efd4ad','#bb8560','#69483b']);
 shape([[hx-17,hy-11],[hx-10,hy-21],[hx+6,hy-23],[hx+16,hy-14],[hx+17,hy-7],[hx+7,hy-5],[hx+3,hy-10],[hx-3,hy-5],[hx-8,hy+13],[hx-14,hy+14]],leather);
 shape([[hx+6,hy+1],[hx+13,hy],[hx+10,hy+3]],['#342827','#241f22']);
 if(!bare) {
  shape([[bx-18,by-16],[bx+4,by-20],[bx+19,by-8],[bx+14,by+17],[bx-1,by+29],[bx-15,by+14]],gold);
  shape([[bx-13,by-12],[bx+3,by-15],[bx+14,by-6],[bx+9,by+15],[bx-1,by+23],[bx-11,by+11]],cloth);
  shape([[bx-4,by-1],[bx+5,by+1],[bx+3,by+9],[bx-5,by+7]],gold);
 }
 plate(sx+10,sy,ex,ey,11,8,steel);
 plate(ex,ey,wx,wy,8,6,steel);
 if(!bare) {
  c.save();c.translate(wx,wy);c.rotate(angle*Math.PI/180);
  shape([[-10,-3],[7,-3],[7,3],[-10,4]],leather);
  shape([[8,-5],[42,-5],[58,0],[41,5],[8,5]],steel);
  shape([[10,-3],[43,-3],[56,0],[10,0]],['#fff8d7','#bad9d3']);
  shape([[5,-10],[10,-9],[10,9],[5,10]],gold);
  c.restore();
 }
 shape([[wx-5,wy-4],[wx+3,wy-5],[wx+6,wy+2],[wx+3,wy+6],[wx-5,wy+5]],leather);
 c.restore();
}
