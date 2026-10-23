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
