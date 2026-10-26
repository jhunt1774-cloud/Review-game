// Recorded CC0 Foley plus licensed ElevenLabs celebration/defense cues; no synthesized fallback.
(()=>{'use strict';const proto=CombatAudio.prototype,unlock=proto.unlock;
const groups={
 'level-up':[['reward-level-up']], 'chest-open':[['reward-treasure-chest']], 'rare-item':[['reward-rare-item']], 'quest-complete':[['reward-quest-complete']], 'area-unlocked':[['reward-area-unlocked']],
 'signature-0':[['battle-thorin-axe-skill']], 'signature-1':[['battle-brom-hammer-skill']], 'signature-2':[['battle-lira-arrow-skill']], 'signature-3':[['battle-seren-ice-skill']],
 'warning-quick':[['battle-warning-quick']], 'warning-heavy':[['battle-warning-heavy']], 'warning-spell':[['battle-warning-spell']], 'warning-boss':[['battle-warning-boss']],
 'slash-launch':[['axe-swing-0','axe-swing-1','axe-swing-2']], 'slash-impact':[['wood-hit-0','wood-hit-1'],['body-hit-0','body-hit-1']],
 'hammer-launch':[['axe-swing-1','axe-swing-2']], 'hammer-impact':[['metal-hit-0','metal-hit-1'],['body-hit-0','body-hit-1']],
 'arrow-launch':[['bow-release-0','bow-release-1','bow-release-2']], 'arrow-impact':[['wood-hit-0','wood-hit-1']],
 'claw-launch':[['blade-swing-0','blade-swing-1']], 'claw-impact':[['body-hit-0','body-hit-1']],
 'fireball-launch':[['magic-air']], 'fireball-impact':[['body-hit-0'],['magic-air']],
 'ice-launch':[['magic-air']], 'ice-impact':[['magic-glass']],
 'enemy-spell-launch':[['magic-air']], 'enemy-spell-impact':[['magic-glass'],['body-hit-1']],
 'parry-impact':[['battle-defense-parry']], 'block-impact':[['wood-hit-0','wood-hit-1']],
 'duck-impact':[['battle-defense-duck']], 'dodge-impact':[['dodge-cloth']], 'jump-impact':[['battle-defense-jump']],
 heal:[['heal-water'],['wood-chimes']],chime:[['coin-reward']],victory:[['battle-victory-fanfare']],'boss-victory':[['battle-boss-victory']],'perfect-parry':[['battle-perfect-parry']],'hero-hit-light':[['battle-hero-hit-light']],'hero-hit-heavy':[['battle-hero-hit-heavy']],defeat:[['body-hit-1']]
};
proto.prepareFoley=function(){this.foleyBuffers??=new Map();this.foleyPending??=new Map();return Promise.allSettled(Object.entries(window.RECORDED_FOLEY||{}).map(async([id,config])=>{if(this.foleyBuffers.has(id))return;if(this.foleyPending.has(id))return this.foleyPending.get(id);const promise=fetch(config.url).then(r=>{if(!r.ok)throw Error('Recorded effect unavailable');return r.arrayBuffer();}).then(bytes=>this.ctx.decodeAudioData(bytes)).then(buffer=>{this.foleyBuffers.set(id,buffer);return buffer;}).finally(()=>this.foleyPending.delete(id));this.foleyPending.set(id,promise);return promise;}));};
proto.unlock=async function(){const original=unlock.call(this),effects=this.ctx?this.prepareFoley():Promise.resolve([]),ready=await original;if(!ready)return false;const results=await effects;if(results.some(r=>r.status==='rejected'))this.error='Some recorded effects could not load. Toggle sound off and on to retry.';return true;};
proto.cue=function(name,pan=0){if(!this.enabled||!this.ctx||this.hidden||this.ctx.state&&this.ctx.state!=='running')return;const layers=groups[name];if(!layers)return;this.foleyCounters??={};const counter=this.foleyCounters[name]||0;this.foleyCounters[name]=counter+1;layers.forEach((variants,index)=>{const id=variants[counter%variants.length],buffer=this.foleyBuffers?.get(id),config=window.RECORDED_FOLEY?.[id];if(!buffer||!config)return;try{const source=this.emit(buffer,this.fx,this.ctx.currentTime,(config.gain??.8)*(index?.5:1),pan);if(name==='victory'||name==='boss-victory')this.rewardAfter=this.ctx.currentTime+buffer.duration;if(source.playbackRate)source.playbackRate.value=name==='hammer-launch'?.85:name==='duck-impact'?.8:name.startsWith('enemy-spell')?.9:1;}catch{}});};
proto.defense=function(step){if(step.grade==='perfect'&&step.action==='parry'){this.cue('perfect-parry',-.25);return;}if(step.grade!=='miss')this.cue((step.action==='block'?'duck':step.action||'duck')+'-impact',-.25);};
proto.setScene=function(scene,region=0,context={}){this.region=Math.max(0,Math.min(3,Number(region)||0));this.battleMusic=scene==='battle';const id=this.battleMusic?(context.boss?'boss':'battle'):context.dungeon?'city':['adventure','mountain','city','coast'][this.region];this.themeId=id;if(this.currentMusic?.id===id||this.loadingMusic===id)return;this.stopMusic();this.startMusic();};
// Keep current and next decoded tracks, while browser HTTP caching handles revisits.
const musicBuffer=proto.musicBuffer;proto.musicBuffer=function(id){const promise=musicBuffer.call(this,id);promise.then(()=>{for(const key of [...this.musicBuffers.keys()]){if(this.musicBuffers.size<=2)break;if(key!==id&&key!==this.currentMusic?.id)this.musicBuffers.delete(key);}},()=>{});return promise;};
})();

// One damage cue per contact, even when a boss strikes several heroes together.
CombatAudio.prototype.damage=function(loss,maxHp){if(!Number.isFinite(loss)||loss<=0||!this.enabled||!this.ctx||this.hidden||this.ctx.state!=='running')return;const now=this.ctx.currentTime;if(this.lastDamageCue!==undefined&&now-this.lastDamageCue<.075)return;this.lastDamageCue=now;this.cue(loss>=Math.max(15,maxHp*.18)?'hero-hit-heavy':'hero-hit-light',-.2);};

// Cue once at a signature release and once when each enemy defense beat starts.
CombatAudio.prototype.signature=function(actor){if(Number.isInteger(actor)&&actor>=0&&actor<4)this.cue('signature-'+actor,-.2);};
CombatAudio.prototype.warning=function(pending={}){this.cue(pending.boss?'warning-boss':pending.effect==='enemy-spell'?'warning-spell':pending.behavior?.heavy?'warning-heavy':'warning-quick',.2);};

// Short reward sequences share the effects bus and cancel when leaving their screen.
CombatAudio.prototype.cancelRewards=function(){for(const source of this.rewardSources||[])try{source.stop();}catch{}this.rewardSources?.clear();};
CombatAudio.prototype.rewardSequence=function(names=[]){this.cancelRewards();if(!this.enabled||!this.ctx||this.hidden||this.ctx.state!=='running')return;this.rewardSources??=new Set();let when=Math.max(this.ctx.currentTime,this.rewardAfter||0);const ids={'level-up':'reward-level-up','chest-open':'reward-treasure-chest','rare-item':'reward-rare-item','quest-complete':'reward-quest-complete','area-unlocked':'reward-area-unlocked',chime:'coin-reward'};for(const name of [...new Set(names)].slice(0,4)){const id=ids[name],buffer=this.foleyBuffers?.get(id),config=window.RECORDED_FOLEY?.[id];if(!buffer||!config)continue;try{const source=this.emit(buffer,this.fx,when,config.gain??.8,0);this.rewardSources.add(source);const ended=source.onended;source.onended=(...args)=>{ended?.apply(source,args);this.rewardSources.delete(source);};when+=buffer.duration+.12;}catch{}}};
