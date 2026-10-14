window.FOREST_NODES=[
 {id:'m0',kind:'battle',stage:0,name:'The Mossgate',description:'Briar creatures guard the entrance. Clear the gate to open the deeper forest.',x:14,y:72,encounter:0},
 {id:'cache',kind:'treasure',stage:0,name:'Abandoned supply cart',description:'Search the side path for supplies before entering the forest.',x:34,y:85},
 {id:'m1',kind:'battle',stage:1,name:'Whispering Hollow',description:'Follow the howling into the hollow. Defeat Thornfang to reach the crossing.',x:37,y:51,encounter:1},
 {id:'shrine',kind:'shrine',stage:1,name:'Moonwell Shrine',description:'An optional detour. Accept immediate healing, or free the forest spirit for help against the Guardian.',x:14,y:33},
 {id:'merchant',kind:'merchant',stage:1,name:'Wayfarer’s camp',description:'Spend your gold on permanent weapon upgrades and healing supplies.',x:61,y:75},
 {id:'ruins',kind:'battle',stage:2,name:'Overgrown ruins',description:'Optional battle: defeat a stronger Thornfang and claim a relic that strengthens every hero.',x:70,y:51,encounter:1,optional:true},
 {id:'m2',kind:'battle',stage:2,name:'The Ancient Crossing',description:'The sentinel holds the bridge. Win its trial to reach the forest heart.',x:58,y:29,encounter:2},
 {id:'m3',kind:'battle',stage:3,name:'Heart of the Forest',description:'The Forest Guardian awaits. Prepare your party for the final battle.',x:84,y:28,encounter:3}
];
window.FOREST_ENCOUNTERS=[{name:'The Mossgate',enemy:'Briar Imp',hp:145,damage:18,xp:60,gold:25,treasure:'Mossgate copper seal'},{name:'Whispering Hollow',enemy:'Thornfang Wolf',hp:185,damage:23,xp:85,gold:40,treasure:'Moonstone charm'},{name:'The Ancient Crossing',enemy:'Runebark Sentinel',hp:225,damage:27,xp:110,gold:55,treasure:'Runebark key'},{name:'Heart of the Forest',enemy:'Forest Guardian',hp:305,damage:32,xp:160,gold:100,treasure:'Emerald Heart of Asterfall'}];
// Original procedural effects and score. No downloads, accounts, or audio assets.
window.FantasyAudio={
 sampleRate:22050,
 random(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2147483648-1;};},
 effect(name){
  const sr=this.sampleRate,duration=name==='victory'?1.8:name==='defeat'?1.65:name==='heal'?1.15:name.endsWith('impact')?.58:name==='chime'?.32:.5,out=new Float32Array(Math.ceil(sr*duration)),random=this.random([...name].reduce((a,c)=>a+c.charCodeAt(0),17));let low=0,high=0,rumble=0;
  const bell=(t,f,decay)=>Math.sin(2*Math.PI*f*t)*Math.exp(-t*decay);
  for(let i=0;i<out.length;i++){
   const t=i/sr,noise=random();low+=.18*(noise-low);high+=.035*(noise-high);rumble+=.018*(noise-rumble);const air=low-high;let v=0;
   if(name==='slash-launch'||name==='claw-launch'){const e=Math.sin(Math.PI*Math.min(1,t/.27))**2;v=air*e*2.4+(name==='claw-launch'?Math.sin(2*Math.PI*(85*t-45*t*t))*Math.exp(-t*13)*.16:0);}
   else if(name==='hammer-launch')v=air*Math.sin(Math.PI*Math.min(1,t/.32))**2*1.9;
   else if(name==='arrow-launch')v=air*Math.exp(-t*14)*.55+(bell(t,235,20)+bell(t,470,25)*.3)*.25;
   else if(name==='fireball-launch'||name==='enemy-spell-launch'){v=air*Math.sin(Math.PI*Math.min(1,t/.45))**2*1.4+Math.sin(2*Math.PI*(180*t+310*t*t))*Math.exp(-t*5)*.14;}
   else if(name==='slash-impact')v=low*Math.exp(-t*29)*1.1+bell(t,112,18)*.34+(bell(t,740,12)+bell(t,1280,17)*.55+bell(t,1910,24)*.3)*.18;
   else if(name==='hammer-impact')v=rumble*Math.exp(-t*13)*3.7+bell(t,68,12)*.62+bell(t,151,16)*.2+bell(t,980,14)*.14+noise*Math.exp(-t*80)*.18;
   else if(name==='arrow-impact')v=bell(t,132,28)*.43+bell(t,285,33)*.15+low*Math.exp(-t*45)*1.3;
   else if(name==='claw-impact')v=low*Math.exp(-t*22)*1.5+bell(t,79,17)*.4;
   else if(name==='fireball-impact'||name==='enemy-spell-impact'){const dark=name==='enemy-spell-impact';v=rumble*Math.exp(-t*6)*3+low*Math.exp(-t*11)*1.7+Math.sin(2*Math.PI*(dark?51:72)*t)*Math.exp(-t*9)*.35+noise*Math.exp(-t*38)*.11;}
   else if(name==='drum')v=bell(t,73,18)*.58+low*Math.exp(-t*48)*.4;
   else{
    const notes=name==='victory'?[62,65,69,74]:name==='defeat'?[57,53,50]:name==='heal'?[74,77,81]:[81,86],step=name==='victory'?.16:name==='defeat'?.24:name==='heal'?.11:.08;
    for(let k=0;k<notes.length;k++){const u=t-k*step;if(u>=0){const f=440*2**((notes[k]-69)/12);v+=(bell(u,f,name==='defeat'?3.5:5)+bell(u,f*2,7)*.2)*.22*Math.min(1,u/.008);}}
   }
   out[i]=Math.tanh(v*1.15)*.82*Math.min(1,t/.002,Math.max(0,(duration-t)/.03));
  }
  return out;
 },

};
window.CombatAudio=class{
 constructor(){this.enabled=false;this.ctx=null;this.music=true;this.volume=.65;this.musicVolume=.28;this.region=0;this.battleMusic=false;this.hidden=false;this.cache=new Map();this.voices=new Set();this.musicVoices=new Set();this.musicBuffers=new Map();this.musicPositions={};this.musicToken=0;this.error='';try{const p=JSON.parse(localStorage.getItem('web-wizardry-audio-v2'));if(p){if(typeof p.music==='boolean')this.music=p.music;if(Number.isFinite(p.effects))this.volume=Math.max(0,Math.min(1,p.effects));if(Number.isFinite(p.score))this.musicVolume=Math.max(0,Math.min(1,p.score));}}catch{}}
 remember(){try{localStorage.setItem('web-wizardry-audio-v2',JSON.stringify({music:this.music,effects:this.volume,score:this.musicVolume}));}catch{}}
 async unlock(){if(!this.enabled)return false;try{if(!this.ctx){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('unsupported');const c=this.ctx=new Audio();this.master=c.createGain();this.fx=c.createGain();this.score=c.createGain();const limiter=c.createDynamicsCompressor();limiter.threshold.value=-10;limiter.knee.value=14;limiter.ratio.value=5;limiter.attack.value=.006;limiter.release.value=.18;this.fx.connect(this.master);this.score.connect(this.master);this.master.connect(limiter);limiter.connect(c.destination);this.fx.gain.value=this.volume;this.score.gain.value=this.musicVolume;}await this.ctx.resume();if(this.ctx.state&&this.ctx.state!=='running')throw Error('suspended');this.master.gain.setTargetAtTime(1,this.ctx.currentTime,.025);this.error='';if(!this.hidden)await this.startMusic();return true;}catch{this.error='Sound could not start. Check your browser’s sound permission and try again.';return false;}}
 async toggle(){if(this.enabled){this.enabled=false;this.stopMusic(true);this.stopVoices(this.voices);if(this.master)this.master.gain.setTargetAtTime(0,this.ctx.currentTime,.015);return false;}this.enabled=true;if(!await this.unlock()){this.enabled=false;return false;}this.play('chime');return true;}
 setVolume(channel,value){const v=Math.max(0,Math.min(1,Number(value)||0));if(channel==='music'){this.musicVolume=v;if(this.score)this.score.gain.setTargetAtTime(v,this.ctx.currentTime,.035);}else{this.volume=v;if(this.fx)this.fx.gain.setTargetAtTime(v,this.ctx.currentTime,.035);}this.remember();}
 setMusic(enabled){this.music=!!enabled;this.remember();if(this.music)this.startMusic();else this.stopMusic(true);}
 setScene(scene,region=0){this.region=Math.max(0,Math.min(2,Number(region)||0));const battle=scene==='battle';if(battle===this.battleMusic)return;this.battleMusic=battle;this.stopMusic();this.startMusic();}
 visibility(hidden){this.hidden=!!hidden;if(hidden){this.stopMusic(true);this.stopVoices(this.voices);}else if(this.enabled)return this.unlock();}
 buffer(key,make){if(this.cache.has(key))return this.cache.get(key);const samples=make(),b=this.ctx.createBuffer(1,samples.length,FantasyAudio.sampleRate);b.getChannelData(0).set(samples);if(this.cache.size>=48)this.cache.delete(this.cache.keys().next().value);this.cache.set(key,b);return b;}
 emit(buffer,bus,when,gain=1,pan=0,music=false){const c=this.ctx,source=c.createBufferSource(),level=c.createGain();source.buffer=buffer;level.gain.value=gain;source.connect(level);source._level=level;let stereo=null;if(c.createStereoPanner){stereo=c.createStereoPanner();stereo.pan.value=pan;level.connect(stereo);stereo.connect(bus);}else level.connect(bus);const group=music?this.musicVoices:this.voices;if(group.size>=(music?32:12)){const old=group.values().next().value;try{old.stop();}catch{}group.delete(old);}group.add(source);source.onended=()=>{group.delete(source);source.disconnect();level.disconnect();stereo?.disconnect();};source.start(when);return source;}
 cue(name,pan=0){if(!this.enabled||!this.ctx||this.hidden||this.ctx.state&&this.ctx.state!=='running')return;try{this.emit(this.buffer('fx:'+name,()=>FantasyAudio.effect(name)),this.fx,this.ctx.currentTime,1,pan);}catch{}}
 launch(type,pan=0){this.cue(type+'-launch',pan);}
 impact(type,pan=0){this.cue(type+'-impact',pan);}
 play(type){this.cue(['heal','victory','defeat','chime'].includes(type)?type:type+'-impact');}
 async startMusic(){
  if(!this.enabled||!this.music||!this.ctx||this.hidden||this.ctx.state&&this.ctx.state!=='running')return;
  const id=this.battleMusic?'battle':'adventure';if(this.currentMusic?.id===id||this.loadingMusic===id)return;
  const token=++this.musicToken;this.loadingMusic=id;
  try{
   const buffer=await this.musicBuffer(id);if(token!==this.musicToken||!this.enabled||!this.music||this.hidden)return;
   const c=this.ctx,source=c.createBufferSource(),level=c.createGain(),now=c.currentTime;
   source.buffer=buffer;source.loop=true;source.connect(level);source._level=level;level.connect(this.score);level.gain.setValueAtTime(0,now);level.gain.linearRampToValueAtTime(.8,now+.75);
   const offset=(this.musicPositions[id]||0)%buffer.duration;source.start(now,offset);this.musicVoices.add(source);
   source.onended=()=>{this.musicVoices.delete(source);source.disconnect();level.disconnect();};
   this.currentMusic={id,source,level,started:now,offset,duration:buffer.duration};this.musicTimer=source;this.loadingMusic=null;
  }catch{if(token===this.musicToken){this.loadingMusic=null;this.error='The music could not load. Effects are still available.';}}
 }
 musicBuffer(id){
  if(this.musicBuffers.has(id))return this.musicBuffers.get(id);
  const track=window.FANTASY_MUSIC?.[id];if(!track?.data&&!track?.url)return Promise.reject(Error('Missing soundtrack'));
  let input;if(track.url)input=fetch(track.url).then(response=>{if(!response.ok)throw Error('Soundtrack request failed: '+response.status);return response.arrayBuffer();});else{const binary=atob(track.data),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);input=Promise.resolve(bytes.buffer);}
  const pending=input.then(bytes=>this.ctx.decodeAudioData(bytes)).then(buffer=>{if(!buffer.duration)throw Error('Empty soundtrack');return buffer;}).catch(error=>{this.musicBuffers.delete(id);throw error;});this.musicBuffers.set(id,pending);return pending;
 }
 stopMusic(immediate=false){
  ++this.musicToken;this.loadingMusic=null;this.musicTimer=null;
  const current=this.currentMusic;this.currentMusic=null;if(!current){if(immediate)this.stopVoices(this.musicVoices);return;}
  const c=this.ctx;this.musicPositions[current.id]=(current.offset+c.currentTime-current.started)%current.duration;
  try{current.level.gain.cancelScheduledValues(c.currentTime);current.level.gain.setTargetAtTime(0,c.currentTime,immediate?.012:.18);current.source.stop(c.currentTime+(immediate?.05:.85));}catch{}if(immediate)this.stopVoices(this.musicVoices);
 }
 stopVoices(group){for(const voice of group){try{voice._level?.gain.setTargetAtTime(0,this.ctx.currentTime,.012);voice.stop(this.ctx.currentTime+.05);}catch{}}group.clear();}
};
