// Keep the quest's purpose without making repeat encounters wait on long scenes.
window.StoryPacing={mode:'brief',read(){try{this.mode=localStorage.getItem('asterfall-story-mode')==='full'?'full':'brief';}catch{}return this.mode;},brief(){return this.mode!=='full';},set(mode){this.mode=mode==='full'?'full':'brief';try{localStorage.setItem('asterfall-story-mode',this.mode);}catch{}},opening(){return this.brief()?['Restore the Beacon. Find the paths through each region.','Choose your hero to begin.']:FOREST_STORY.opening;},arrival(text){if(!this.brief())return text;return text.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim()||text;}};
StoryPacing.read();const storySelect=document.getElementById('story-mode');storySelect.value=StoryPacing.mode;storySelect.onchange=()=>StoryPacing.set(storySelect.value);

StoryPacing.summary=function(text,maxWords=24){const full=String(text||" ").replace(/\s+/g," ").trim(),sentence=full.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim()||full,words=sentence.split(/\s+/);return words.length<=maxWords?sentence:words.slice(0,maxWords).join(" ")+"…";};
StoryPacing.arrival=function(text){return this.brief()?this.summary(text,28):text;};
