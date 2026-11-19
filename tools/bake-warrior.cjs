const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'forest-warrior-'));
const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const source = fs.readFileSync(path.join(__dirname, 'warrior-art-source.js'), 'utf8');
const html = path.join(temporary, 'bake.html');
fs.writeFileSync(html, `<!DOCTYPE html><meta charset="utf-8"><pre></pre><script>
${source}
function sheet(columns, rows, painter) {
 const canvas = document.createElement('canvas');
 canvas.width = 240 * columns;
 canvas.height = 240 * rows;
 const c = canvas.getContext('2d');
 for(let f=0; f<columns*rows; f++){
  c.save();c.translate(f%columns*240,Math.floor(f/columns)*240);
  c.beginPath();c.rect(0,0,240,240);c.clip();
  painter(c,f);c.restore();
 }
 return canvas.toDataURL('image/webp', .89).split(',')[1];
}
function battlePose(f) {
 if(f===15) return [67,184, 83,198, 114,205, 78,212, 69,218, 107,209, 141,192, 151,215, 149,204, 167,215, -16];
 if(f>=4&&f<8) return poseAt([130,220,330,465][f-4]);
 const pose=guard.slice();
 if(f===1) {pose[1]-=2;pose[3]-=2;}
 if(f===2) {pose[7]-=2;pose[9]-=3;}
 if(f===3) {pose[1]+=2;pose[3]+=2;}
 if(f>=8&&f<12) {pose[0]-=Math.min(f-7,12-f)*8;pose[2]-=6;pose[1]+=4;pose[20]=-35;}
 if(f===12||f===13) {pose[7]-=30;pose[9]-=43;pose[20]=-90;}
 return pose;
}
function walk(c,f,bare){
 const pose=guard.slice(),phase=[0,1,0,-1][f%4];
 pose[0]+=phase*2;pose[1]-=Math.abs(phase)*4;
 pose[12]+=phase*9;pose[14]+=phase*16;pose[13]-=Math.max(0,phase)*10;
 pose[16]-=phase*9;pose[18]-=phase*16;pose[19]-=Math.max(0,-phase)*10;
 if(Math.floor(f/4)===3){c.translate(240,0);c.scale(-1,1);}
 drawWarrior(c,pose,bare);
}
document.querySelector('pre').textContent=JSON.stringify({
 'human-warrior-battle':sheet(4,4,(c,f)=>drawWarrior(c,battlePose(f))),
 'human-warrior-body':sheet(4,4,(c,f)=>drawWarrior(c,battlePose(f),true)),
 'human-warrior-travel':sheet(4,4,(c,f)=>walk(c,f,false)),
 'human-warrior-travel-body':sheet(4,4,(c,f)=>walk(c,f,true)),
 'human-warrior-sword':sheet(5,6,(c,f)=>{
  if(f<23){const time=f===10?330:f*32;drawTrail(c,time);drawWarrior(c,poseAt(time));}
  else if(f<27)walk(c,f-23,false);
 })
});
</script>`);
try {
 const output = execFileSync(chrome, ['--headless','--disable-gpu','--no-first-run',
  '--user-data-dir='+path.join(temporary,'profile'),'--dump-dom',pathToFileURL(html).href],
  {encoding:'utf8',maxBuffer:8*1024*1024,stdio:['ignore','pipe','ignore']});
 const data = JSON.parse(output.match(/<pre>([^<]+)<\/pre>/)[1]);
 fs.mkdirSync(path.join(root,'assets','warrior'),{recursive:true});
 for(const [name,encoded] of Object.entries(data)) {
  fs.writeFileSync(path.join(root,'assets','warrior',name+'.webp'),Buffer.from(encoded,'base64'));
 }
} finally {
 fs.rmSync(temporary,{recursive:true,force:true});
}
