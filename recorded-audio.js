// Existing CC0 physical Foley and generated ElevenLabs spell/outcome effects. No oscillator fallback.
(()=>{'use strict';const proto=CombatAudio.prototype,unlock=proto.unlock;
const groups={
'chest-open':[['explore-chest-open']],'footstep-grass':[['explore-footstep-grass']],'footstep-stone':[['explore-footstep-stone']],'level-up':[['explore-level-up']],

 'slash-launch':[['axe-swing-0','axe-swing-1','axe-swing-2']], 'slash-impact':[['wood-hit-0','wood-hit-1'],['body-hit-0','body-hit-1']],
 'hammer-launch':[['axe-swing-1','axe-swing-2']], 'hammer-impact':[['metal-hit-0','metal-hit-1'],['body-hit-0','body-hit-1']],
 'arrow-launch':[['bow-release-0','bow-release-1','bow-release-2']], 'arrow-impact':[['wood-hit-0','wood-hit-1']],
 'claw-launch':[['blade-swing-0','blade-swing-1']], 'claw-impact':[['body-hit-0','body-hit-1']],
 'fireball-launch':[['day1-fireball-launch']], 'fireball-impact':[['day1-fireball-impact']],
 'ice-launch':[['day1-ice-launch']], 'ice-impact':[['day1-ice-impact']],
 'enemy-spell-launch':[['day1-enemy-spell-launch']], 'enemy-spell-impact':[['day1-enemy-spell-impact']],
 'parry-impact':[['parry-0','parry-1']], 'block-impact':[['wood-hit-0','wood-hit-1']],
 'duck-impact':[['dodge-cloth']], 'dodge-impact':[['dodge-cloth']], 'jump-impact':[['jump-step']],
 'heal':[['day1-heal']],'chime':[['day1-chime']],'victory':[['day1-victory']],'defeat':[['day1-defeat']]
};
proto.footstep=function(region=0,dungeon=false){if(!this.enabled||!this.ctx||this.hidden||this.ctx.state!=='running')return;const now=this.ctx.currentTime;if(this.lastFootstepTime!==undefined&&now-this.lastFootstepTime<.4)return;this.lastFootstepTime=now;this.cue(dungeon||region===1||region===2?'footstep-stone':'footstep-grass');};
proto.prepareFoley=function(){this.foleyBuffers??=new Map();this.foleyPending??=new Map();return Promise.allSettled(Object.entries(window.RECORDED_FOLEY||{}).map(async([id,config])=>{if(this.foleyBuffers.has(id))return;if(this.foleyPending.has(id))return this.foleyPending.get(id);const promise=fetch(config.url).then(r=>{if(!r.ok)throw Error('Recorded effect unavailable');return r.arrayBuffer();}).then(bytes=>this.ctx.decodeAudioData(bytes)).then(buffer=>{this.foleyBuffers.set(id,buffer);return buffer;}).finally(()=>this.foleyPending.delete(id));this.foleyPending.set(id,promise);return promise;}));};
proto.unlock=async function(){const original=unlock.call(this),effects=this.ctx?this.prepareFoley():Promise.resolve([]),ready=await original;if(!ready)return false;const results=await effects;if(results.some(r=>r.status==='rejected'))this.error='Some recorded effects could not load. Toggle sound off and on to retry.';return true;};
proto.cue=function(name,pan=0){if(!this.enabled||!this.ctx||this.hidden||this.ctx.state&&this.ctx.state!=='running')return;const layers=groups[name];if(!layers)return;this.foleyCounters??={};const counter=this.foleyCounters[name]||0;this.foleyCounters[name]=counter+1;layers.forEach((variants,index)=>{const id=variants[counter%variants.length],buffer=this.foleyBuffers?.get(id),config=window.RECORDED_FOLEY?.[id];if(!buffer||!config)return;try{const source=this.emit(buffer,this.fx,this.ctx.currentTime,(config.gain??.8)*(index?.5:1),pan);if(source.playbackRate)source.playbackRate.value=name==='hammer-launch'?.85:name==='duck-impact'?.8:name.startsWith('enemy-spell')?.9:1;}catch{}});};
proto.defense=function(step){if(step.grade!=='miss')this.cue((step.action||'duck')+'-impact',-.25);};
proto.setScene=function(scene,region=0,context={}){this.region=Math.max(0,Math.min(3,Number(region)||0));this.battleMusic=scene==='battle';const id=this.battleMusic?(context.boss?'boss':'battle'):context.dungeon?'crypt':['adventure','mountain','city','coast'][this.region];this.themeId=id;if(this.currentMusic?.id===id||this.loadingMusic===id)return;this.stopMusic();this.startMusic();};
// Keep current and next decoded tracks, while browser HTTP caching handles revisits.
const musicBuffer=proto.musicBuffer;proto.musicBuffer=function(id){const promise=musicBuffer.call(this,id);promise.then(()=>{for(const key of [...this.musicBuffers.keys()]){if(this.musicBuffers.size<=2)break;if(key!==id&&key!==this.currentMusic?.id)this.musicBuffers.delete(key);}},()=>{});return promise;};
})();


// Forest/crypt ambience: independent effects bus, lazy loading, no gameplay changes.
(()=>{'use strict';
const proto=CombatAudio.prototype;
if(proto._forestCryptAmbienceInstalled)return;
proto._forestCryptAmbienceInstalled=true;
const tracks={"forest": {"url": "assets/ambience/forest.mp3?v=ae08eee806", "gain": 0.18}, "crypt": {"url": "assets/ambience/crypt.mp3?v=18aee92157", "gain": 0.18}};
proto.stopAmbience=function(immediate=true){
 this.ambienceToken=(this.ambienceToken||0)+1;this.ambienceLoading=null;
 const current=this.currentAmbience;this.currentAmbience=null;if(!current)return;
 try{const now=this.ctx.currentTime;current.level.gain.cancelScheduledValues(now);current.level.gain.setTargetAtTime(0,now,immediate?.008:.12);current.source.stop(now+(immediate?.035:.45));}catch{try{current.source.disconnect();current.level.disconnect();}catch{}}
};
proto.ambienceBuffer=function(id){
 this.ambienceBuffers??=new Map();if(this.ambienceBuffers.has(id))return this.ambienceBuffers.get(id);
 const track=tracks[id];if(!track)return Promise.reject(Error('Unknown ambience'));
 const promise=fetch(track.url).then(r=>{if(!r.ok)throw Error('Ambience unavailable');return r.arrayBuffer();}).then(bytes=>this.ctx.decodeAudioData(bytes)).then(buffer=>{if(!buffer.duration)throw Error('Empty ambience');return buffer;}).catch(error=>{this.ambienceBuffers.delete(id);throw error;});
 this.ambienceBuffers.set(id,promise);return promise;
};
proto.syncAmbience=async function(){
 const id=this.ambienceTarget;
 if(!id||!this.enabled||!this.ctx||this.hidden||this.ctx.state!=='running'){this.stopAmbience();return;}
 if(this.currentAmbience?.id===id||this.ambienceLoading?.id===id)return;
 this.stopAmbience(false);const token=this.ambienceToken;this.ambienceLoading={id,token};
 try{
  const buffer=await this.ambienceBuffer(id);
  if(token!==this.ambienceToken||id!==this.ambienceTarget||!this.enabled||this.hidden||this.ctx.state!=='running')return;
  const c=this.ctx,source=c.createBufferSource(),level=c.createGain();source.buffer=buffer;source.loop=true;source.connect(level);level.connect(this.fx);
  level.gain.setValueAtTime(0,c.currentTime);level.gain.linearRampToValueAtTime(tracks[id].gain,c.currentTime+.65);
  const current={id,source,level};source.onended=()=>{source.disconnect();level.disconnect();if(this.currentAmbience===current)this.currentAmbience=null;};
  this.currentAmbience=current;source.start();this.ambienceError='';
 }catch{if(token===this.ambienceToken)this.ambienceError='Background ambience could not load. Toggle sound to retry.';}
 finally{if(this.ambienceLoading?.token===token)this.ambienceLoading=null;}
};
const setScene=proto.setScene,unlock=proto.unlock,toggle=proto.toggle,visibility=proto.visibility;
proto.setScene=function(scene,region=0,context={}){
 setScene.call(this,scene,region,context);
 this.ambienceTarget=scene==='world'?(context.dungeon?'crypt':Number(region)===0?'forest':null):null;
 void this.syncAmbience();
};
proto.unlock=async function(...args){const ready=await unlock.apply(this,args);if(ready)void this.syncAmbience();else this.stopAmbience();return ready;};
proto.toggle=async function(...args){if(this.enabled)this.stopAmbience();const result=await toggle.apply(this,args);void this.syncAmbience();return result;};
proto.visibility=function(hidden){if(hidden)this.stopAmbience();return visibility.call(this,hidden);};
})();
