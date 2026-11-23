const fs=require('node:fs');
require('./browser-harness.cjs')(async ({evaluate})=>{
 const result=await evaluate(`(async()=>{
  const load=async path=>{const image=new Image();image.src=path;await image.decode();const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;canvas.getContext('2d').drawImage(image,0,0);return canvas;};
  const source=await load('art-source/warrior/painted-human-warrior-strike-source.png');
  const approved=await load('art-source/warrior/painted-human-warrior-guard-v3.png');
  const stride=await load('art-source/warrior/painted-human-warrior-stride-source.png');
  const defense=await load('art-source/warrior/painted-human-warrior-defense-source.png');
  const atlas=document.createElement('canvas');atlas.width=1440;atlas.height=1440;
  const ctx=atlas.getContext('2d');ctx.imageSmoothingQuality='high';
  const bounds=(canvas,x,y,w,h)=>{
   const data=canvas.getContext('2d').getImageData(x,y,w,h).data;
   let left=w,top=h,right=-1,bottom=-1;
   for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(data[(j*w+i)*4+3]>=96){
    left=Math.min(left,i);top=Math.min(top,j);right=Math.max(right,i);bottom=Math.max(bottom,j);
   }
   if(left<2||right>w-3||top<2||bottom>h-3)throw Error('Pose alpha runs into crop boundary: '+JSON.stringify({x,y,left,top,right,bottom}));
   return {x:x+left,y:y+top,w:right-left+1,h:bottom-top+1};
  };
  const guard=bounds(source,0,0,512,512);
  const cover=bounds(approved,0,0,approved.width,approved.height);
  const poses=[cover,...[1,2,3,4,5].map(i=>bounds(source,(i%3)*512,Math.floor(i/3)*512,512,512))];
  const strideWidth=stride.width/2,strideHeight=stride.height/2;
  const strides=Array.from({length:4},(_,i)=>bounds(stride,i%2*strideWidth,Math.floor(i/2)*strideHeight,strideWidth,strideHeight));
  const defenses=Array.from({length:6},(_,i)=>bounds(defense,i%3*512,Math.floor(i/3)*512,512,512));
  const details=[...poses,...strides,...defenses].map((pose,i)=>{
   const scale=292/(i>=10?defenses[5].h:i>=6?strides[0].h:i?guard.h:cover.h);
   const width=pose.w*scale,height=pose.h*scale;
   if(width>354||height>347)throw Error('Frame exceeds portrait: '+JSON.stringify({i,width,height}));
   const x=(360-width)/2+(i===3?Math.min(8,(360-width)/2):0);
   ctx.drawImage(i>=10?defense:i>=6?stride:i?source:approved,pose.x,pose.y,pose.w,pose.h,(i%4)*360+x,Math.floor(i/4)*360+347-height,width,height);
   return {pose,width,height,x,blade:i===3?x+width:null};
  });
  return {image:atlas.toDataURL('image/webp',.88).split(',')[1],details};
 })()`);
 fs.mkdirSync('assets/warrior',{recursive:true});
 fs.writeFileSync('assets/warrior/painted-swordsman-strike.webp',Buffer.from(result.image,'base64'));
 console.log(JSON.stringify(result.details));
}).catch(e=>{console.error(e);process.exitCode=1;});
