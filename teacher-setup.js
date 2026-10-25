// Subject-first browsing. Selecting a subject never silently replaces the assignment.
(()=>{'use strict';
const $=id=>document.getElementById(id),G=QuestionGenerator,teacher=$('teacher');
const shell=document.createElement('section');shell.id='teacher-setup';shell.innerHTML='<nav class="setup-steps" aria-label="Assignment setup"><button id="setup-step-1" type="button">1 · Choose content</button><button id="setup-step-2" type="button">2 · Review questions</button><button id="setup-step-3" type="button">3 · Share</button></nav><p id="setup-summary" class="setup-summary" role="status"></p><section id="setup-content"><h3>Choose your content</h3><div class="setup-sources"><button id="setup-source-banks" type="button">Subjects</button><button id="setup-source-ohio" type="button">Ohio standards</button><button id="setup-source-import" type="button">Import my materials</button><button id="setup-source-library" type="button">Load a saved set</button></div><div id="setup-banks"><div id="subject-tabs" role="tablist" aria-label="Subjects"></div><div class="subject-context"><h3 id="subject-heading"></h3><p id="subject-description"></p><button id="subject-new" type="button">Start a subject-only assignment</button><p id="subject-draft-note" role="status"></p></div><div id="subject-panels"></div></div><div id="setup-import" hidden><h3>Use your own materials</h3><p>Import questions, review answers, then add them to your assignment. Choose the subject during document review.</p><p class="small">Use material you created or have permission to share. Importing does not grant copyright permission.</p></div><div id="setup-library" hidden><h3>Your saved sets</h3><p>Loading a saved set replaces the draft. Keep downloaded backups.</p></div><button id="setup-review-next" class="primary" type="button">Review my questions →</button></section><section id="setup-review" hidden></section><section id="setup-share" hidden></section><div class="setup-footer"><button id="setup-back" type="button">← Back</button><button id="setup-next" class="primary" type="button">Next →</button><button id="setup-new" type="button">Start a new assignment</button></div><div id="subject-tool-parking" hidden></div>';
teacher.appendChild(shell);$('subject-tool-parking').hidden=true;
const move=(id,parent)=>{const element=$(id);if(element)$(parent).appendChild(element);};
for(const id of ['teacher-import-panel','document-review'])move(id,'setup-import');
move('saved-question-sets','setup-library');move('teacher-review-panel','setup-review');move('teacher-writing-panel','setup-review');move('teacher-share-panel','setup-share');
if($('teacher-import-panel'))$('teacher-import-panel').open=true;
// Keep old handlers internally; retire the overlapping bank picker from the visible UI.
move('teacher-bank-panel','subject-tool-parking');
const bankTools=document.createElement('section');bankTools.id='subject-bank-tools';bankTools.innerHTML='<h3>Reviewed question bank</h3><p id="subject-bank-empty" class="small" hidden>No reviewed bank questions are included for this subject in this edition. Use a generator when available, or import your own materials.</p><p class="small">Choose topics and depth below. Add keeps your existing draft; Use only this subject replaces it.</p><div id="subject-bank-status"></div><div id="subject-bank-topics"></div><div id="subject-bank-actions" class="preset-buttons"></div><div id="subject-bank-more"></div>';
$('subject-tool-parking').appendChild(bankTools);move('bank-selection-summary','subject-bank-status');move('teacher-focus-panel','subject-bank-topics');
for(const id of ['add-banks','combine-banks'])move(id,'subject-bank-actions');
$('add-banks').textContent='Add this subject to draft';$('combine-banks').textContent='Use only this subject · replace draft';
for(const id of ['web-skill-panel','math-generator-panel','express-course'])move(id,'subject-tool-parking');
move('bank-generator-panel','subject-bank-more');move('generation-area','subject-tool-parking');
const aliases=document.createElement('div');aliases.innerHTML='<button id="setup-generate-web" type="button">HTML tools</button><button id="setup-generate-math" type="button">Math tools</button>';$('subject-tool-parking').appendChild(aliases);
const displayName=topic=>topic==='3D design'?'Tinkercad / 3D design':topic==='Computing & society'?'Digital citizenship':topic;
const order=['Math','HTML','CSS','Programming','3D design','Computer basics','Algorithms','Data','Networks','Cybersecurity','Computing & society','AI literacy'];
const subjects=[...order.filter(s=>CS_DOMAINS.includes(s)),...CS_DOMAINS.filter(s=>!order.includes(s)&&!window.TeacherSubjects?.includes(s))],panels=new Map(),tabs=new Map(),tools=new Map();
for(const [index,topic]of subjects.entries()){
 const panel=document.createElement('section');panel.id='subject-panel-'+index;panel.className='teacher-subject-panel';panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby','subject-tab-'+index);panel.hidden=true;$('subject-panels').appendChild(panel);panels.set(topic,panel);
 const button=document.createElement('button');button.id='subject-tab-'+index;button.type='button';button.textContent=displayName(topic);button.dataset.subject=topic;button.setAttribute('role','tab');button.setAttribute('aria-controls',panel.id);button.setAttribute('aria-selected','false');button.tabIndex=-1;button.onclick=()=>TeacherSetup.subject(topic);button.onkeydown=event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?subjects.length-1:(index+(event.key==='ArrowRight'?1:-1)+subjects.length)%subjects.length;TeacherSetup.subject(subjects[next]);tabs.get(subjects[next]).focus();};$('subject-tabs').appendChild(button);tabs.set(topic,button);
}
let step=1,source='banks',active=null;
function mount(topic){
 for(const id of ['subject-bank-tools','web-skill-panel','math-generator-panel','express-course'])move(id,'subject-tool-parking');
 const panel=panels.get(topic);
 if(topic==='Math'){if($('math-generator-panel'))panel.appendChild($('math-generator-panel'));}
 else{
  panel.appendChild(bankTools);
  if((topic==='HTML'||topic==='CSS')&&$('web-skill-panel')){panel.appendChild($('web-skill-panel'));WebSkillGenerator.focusTopic?.(topic);}
  if(topic==='Programming'&&window.EXPRESS_SETS?.length&&$('express-course'))panel.appendChild($('express-course'));
 }
 for(const id of tools.get(topic)||[])if($(id))panel.appendChild($(id));
}
window.TeacherSetup={
 get activeSubject(){return active;},
 sync(){const draft=TeacherMode.current(),valid=validLesson(draft),counts=new Map();for(const q of draft.questions)counts.set(q.topic,(counts.get(q.topic)||0)+1);const detail=[...counts].map(([name,count])=>displayName(name)+': '+count).join(' · ');
  $('setup-summary').textContent=draft.questions.length?draft.name+' · '+draft.questions.length+' questions · '+detail:'No questions yet. Choose a subject, import materials, or load a saved set.';
  $('subject-draft-note').textContent=!draft.questions.length?'Your draft is empty. Add questions from this subject.':counts.size===1&&counts.has(active)?'Your draft contains '+draft.questions.length+' '+displayName(active)+' questions.':'Draft: '+detail+'. Tabs filter the tools, not existing questions. Start a '+displayName(active)+'-only assignment to clear this draft, or add deliberately to combine subjects.';
  for(const id of ['setup-step-2','setup-step-3','setup-review-next','make-assignment-link','save-question-set'])$(id).disabled=!valid;
  $('setup-next').disabled=!valid;$('setup-next').hidden=step===3;$('setup-back').hidden=step===1;
  const hasBank=G.catalog.some(q=>q.topic===active);$('subject-bank-empty').hidden=hasBank;$('teacher-focus-panel').hidden=!hasBank;$('subject-bank-actions').hidden=!hasBank;$('subject-bank-more').hidden=!hasBank;
 },
 show(next,options={}){if(next>1&&!options.authoring&&!validLesson(TeacherMode.current()))return;step=next;for(const [index,id]of ['setup-content','setup-review','setup-share'].entries())$(id).hidden=index+1!==step;for(let i=1;i<=3;i++)$('setup-step-'+i).setAttribute('aria-current',i===step?'step':'false');this.sync();},
 source(next){if(!['banks','ohio','import','library'].includes(next))return;source=next;if(next==='banks'&&active){const chosen=G.banks();if(chosen.length!==1||chosen[0]!==active)G.focusSubject(active);}for(const name of ['banks','ohio','import','library']){if($('setup-'+name))$('setup-'+name).hidden=name!==source;$('setup-source-'+name).setAttribute('aria-pressed',String(name===source));}},
 subject(topic){if(!panels.has(topic))return;active=topic;this.source('banks');for(const s of subjects){panels.get(s).hidden=s!==topic;tabs.get(s).setAttribute('aria-selected',String(s===topic));tabs.get(s).tabIndex=s===topic?0:-1;}mount(topic);G.focusSubject(topic);$('subject-heading').textContent=displayName(topic);$('subject-description').textContent=topic==='Math'?'Choose a grade and math concepts below. Only math choices appear here.':topic==='HTML'||topic==='CSS'?'Use the '+topic+' question bank or generate new '+topic+' skill questions below. Other subjects are in their own tabs.':'Choose '+displayName(topic)+' bank topics and use its matching-question tools below.';$('subject-new').textContent='Start a '+displayName(topic)+'-only assignment';this.sync();},
 registerSubjectTool(topic,id){if(!panels.has(topic))throw Error('Register the subject in the subject catalog first.');const list=tools.get(topic)||[];if(!list.includes(id))list.push(id);tools.set(topic,list);if(active===topic)mount(topic);}
};
for(let i=1;i<=3;i++)$('setup-step-'+i).onclick=()=>TeacherSetup.show(i);
for(const name of ['banks','ohio','import','library'])$('setup-source-'+name).onclick=()=>TeacherSetup.source(name);
$('setup-review-next').onclick=()=>TeacherSetup.show(2);$('setup-next').onclick=()=>TeacherSetup.show(Math.min(3,step+1));$('setup-back').onclick=()=>TeacherSetup.show(Math.max(1,step-1));
$('setup-new').onclick=()=>{TeacherMode.clear();TeacherSetup.show(1);};
$('subject-new').onclick=()=>{TeacherMode.clear();$('lesson-name').value=displayName(active)+' practice';G.preview();TeacherSetup.show(1);};
$('setup-generate-web').onclick=()=>TeacherSetup.subject('HTML');$('setup-generate-math').onclick=()=>TeacherSetup.subject('Math');
const refresh=G.refreshScope;G.refreshScope=function(){refresh?.call(G);TeacherSetup.sync();};
TeacherSetup.subject(subjects.includes('Math')&&window.MathQuestionGenerator?'Math':subjects.includes('HTML')?'HTML':subjects[0]);TeacherSetup.show(1);
})();


