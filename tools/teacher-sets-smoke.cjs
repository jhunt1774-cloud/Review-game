const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
require('./browser-harness.cjs')(async({evaluate:e,send,wait,errors,missing,root})=>{
 await wait('!!window.TeacherSets');
 await e(`document.querySelector('#teacher-open').click();document.querySelector('#teacher-code').value='2373';document.querySelector('#teacher-access-form').requestSubmit();document.querySelector('#workspace-cs-sets').click()`);
 assert.equal(await e(`document.querySelector('#teacher-set-manager').checkVisibility()`),true);
 await e(`Promise.all(document.querySelector('#teacher').getAnimations().map(a=>a.finished))`);await e(`document.querySelector('#teacher-set-manager').scrollIntoView({block:'start'})`);fs.writeFileSync(path.resolve(root,'../teacher-dashboard-desktop.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:false});await e(`document.querySelector('#teacher-set-manager').scrollIntoView({block:'start'})`);assert.equal(await e(`document.documentElement.scrollWidth<=innerWidth`),true);fs.writeFileSync(path.resolve(root,'../teacher-dashboard-mobile.png'),Buffer.from((await send('Page.captureScreenshot',{format:'png'})).data,'base64'));await send('Emulation.clearDeviceMetricsOverride');
 assert.ok(await e(`TeacherSetLibrary.entries().filter(s=>s.builtin).length>20`));
 assert.equal(await e(`TeacherSetLibrary.entries().every(s=>validLesson(s.lesson))`),true);
 assert.equal(await e(`(()=>{try{TeacherSetLibrary.delete('builtin:0');return false;}catch{return true;}})()`),true);
 assert.equal(await e(`[...document.querySelectorAll('.managed-set')].some(row=>row.textContent.includes('protected from deletion')&&row.textContent.includes('Delete saved set'))`),false);
 await e(`document.querySelector('#sets-grade').value='8';document.querySelector('#sets-topic').value='3D design';document.querySelector('#sets-topic').dispatchEvent(new Event('change'))`);
 assert.match(await e(`document.querySelector('#sets-list').textContent`),/Tinkercad/);
 assert.equal(await e(`TeacherMode.current().questions.length`),0);
 await e(`document.querySelector('#sets-select-shown').click();document.querySelector('#sets-add-selected').click()`);
 assert.ok(await e(`TeacherMode.current().questions.length>0`));
 assert.match(await e(`document.querySelector('#sets-status').textContent`),/sets added/);
 // Overlaps belong to both sets, while independently added questions survive removal.
 const overlap=await e(`(()=>{TeacherMode.clear();const all=TeacherSetLibrary.entries(),a=all.find(s=>s.lesson.name==='HTML Basics'),b=all.find(s=>s.lesson.name==='Grade 7 · Web development');QuestionGenerator.add([a.lesson.questions[0]],'independent');TeacherMode.addSet(a.lesson,a.id);TeacherMode.addSet(b.lesson,b.id);const union=TeacherMode.current().questions.length;TeacherMode.removeSet(a.id);const kept=TeacherMode.current().questions.length;TeacherMode.removeSet(b.id);return {union,kept,b:b.lesson.questions.length,left:TeacherMode.current().questions.length};})()`);
 assert.equal(overlap.kept,overlap.b);assert.equal(overlap.left,1);
 const limit=await e(`(()=>{const snapshot=JSON.stringify(TeacherMode.current()),lesson={version:1,name:'Large set',difficulty:'beginner',questions:Array.from({length:500},(_,i)=>({...QUESTIONS[0],text:'Unique limit question '+i}))};try{TeacherMode.addSet(lesson,'import:limit');return false;}catch{return snapshot===JSON.stringify(TeacherMode.current());}})()`);assert.equal(limit,true);
 const storageFailure=await e(`(()=>{const n=TeacherSetLibrary.entries().length,original=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('Storage full');};try{try{TeacherSetLibrary.save(TeacherMode.current());return false;}catch{return TeacherSetLibrary.entries().length===n;}}finally{Storage.prototype.setItem=original;}})()`);assert.equal(storageFailure,true);
 // Legacy library snapshots are read without modifying their data on startup.
 await e(`window.legacy={version:1,name:'Existing custom set',difficulty:'beginner',questions:[{...QUESTIONS[0],text:'Existing custom question?'}]};localStorage.setItem('web-wizardry-set-library-v1',JSON.stringify([legacy]));document.querySelector('#save-lesson').click()`);
 await send('Page.reload');await wait('!!window.TeacherSets');
 assert.equal(await e(`JSON.parse(localStorage.getItem('web-wizardry-set-library-v1'))[0].questions[0].text`),'Existing custom question?');
 await e(`GameModes.showTeacher();document.querySelector('#teacher-code').value='2373';document.querySelector('#teacher-access-form').requestSubmit();TeacherSets.open()`);
 const before=await e(`JSON.stringify(TeacherMode.current())`);
 async function importText(name,text){await e(`document.querySelector('#teacher-file').onchange({target:{files:[new File([${JSON.stringify(text)}],${JSON.stringify(name)})],value:''}})`);}
 const csv='subject,question,A,B,C,D,correct,explanation\nProgramming,"An imported, quoted question?",one,two,three,four,B,Why';
 await importText('valid.csv',csv);
 assert.equal(await e(`JSON.stringify(TeacherMode.current())`),before);
 assert.match(await e(`document.querySelector('#sets-preview-title').textContent`),/Import preview/);
 await e(`document.querySelector('#sets-preview-add').click();document.querySelector('#sets-preview-save').click()`);
 assert.equal(await e(`TeacherMode.current().questions.at(-1).correct`),1);
 assert.equal(await e(`TeacherSetLibrary.entries().filter(s=>!s.builtin).length`),2);
 assert.equal(await e(`document.querySelector('#sets-preview-title').textContent.includes('Imported')`),true);
 // Reject malformed keys, columns, headers, JSON, empty sets and oversize files atomically.
 const draft=await e(`JSON.stringify(TeacherMode.current())`);
 for(const [name,text] of [['bad.csv',csv.replace(',B,Why',',Z,Why')],['bad.csv',csv+',extra'],['bad.csv',csv.replace('explanation','correct')],['bad.json','{'],['empty.json','[]'],['bad.json',JSON.stringify({version:1,name:'Bad',difficulty:'beginner',questions:[{topic:'Unknown'}]})]]){
  await importText(name,text);assert.match(await e(`document.querySelector('#import-status').textContent`),/Import failed/);assert.equal(await e(`JSON.stringify(TeacherMode.current())`),draft);assert.equal(await e(`document.querySelector('#sets-preview').hidden`),true);
 }
 await importText('large.json',' '.repeat(400001));assert.match(await e(`document.querySelector('#import-status').textContent`),/400 KB/);
 // JSON lesson and question-array imports; HTML is shown as text.
 await importText('valid.json',JSON.stringify([{topic:'HTML',text:'<img src=x onerror="throw Error(1)">?',answers:['a','b','c','d'],correct:0,explanation:'Explanation'}]));
 assert.equal(await e(`document.querySelector('#sets-preview-questions img')===null`),true);
 await e(`document.querySelector('#sets-preview-save').click()`);
 const savedId=await e(`TeacherSetLibrary.entries().at(-1).id`);
 await e(`document.querySelector('#sets-source').value='saved';document.querySelector('#sets-source').dispatchEvent(new Event('change'));[...document.querySelectorAll('#sets-list button')].filter(b=>b.textContent==='Delete saved set…').at(-1).click()`);
 assert.equal(await e(`document.querySelector('#sets-delete-dialog').open`),true);
 const beforeCancel=await e(`TeacherSetLibrary.entries().length`);await e(`document.querySelector('#sets-delete-cancel').click()`);assert.equal(await e(`TeacherSetLibrary.entries().length`),beforeCancel);
 await e(`[...document.querySelectorAll('#sets-list button')].filter(b=>b.textContent==='Delete saved set…').at(-1).click();document.querySelector('#sets-delete-confirm').click()`);
 assert.equal(await e(`TeacherSetLibrary.entries().some(s=>s.id===${JSON.stringify(savedId)})`),false);
 assert.equal(await e(`JSON.stringify(TeacherMode.current())`),draft);
 await send('Page.reload');await wait('!!window.TeacherSets');
 assert.equal(await e(`TeacherSetLibrary.entries().some(s=>s.id===${JSON.stringify(savedId)})`),false);
 assert.equal(await e(`TeacherSetLibrary.entries().filter(s=>!s.builtin).length`),2);
 // Assignment links preserve the exact pool, and activation uses it without changing campaign progress.
 await e(`TeacherMode.clear();const set=TeacherSetLibrary.entries().find(s=>s.lesson.name==='HTML Basics');TeacherMode.addSet(set.lesson,set.id);document.querySelector('#save-lesson').click();window.assignment=TeacherMode.current();window.campaignBefore=localStorage.getItem('web-wizardry-v1');`);
 assert.equal(await e(`(async()=>JSON.stringify((await AssignmentLinks.decode(await AssignmentLinks.encode(assignment))).questions.map(q=>q.text))===JSON.stringify(assignment.questions.map(q=>q.text)))()`),true);
 await e(`TeacherSets.open();document.querySelector('#sets-activate').click()`);
 assert.equal(await e(`JSON.parse(localStorage.getItem('web-wizardry-teacher-save-v1')).lesson.questions.length`),await e(`assignment.questions.length`));
 assert.equal(await e(`localStorage.getItem('web-wizardry-v1')===campaignBefore`),true);
 assert.deepEqual(errors,[]);assert.deepEqual(missing.filter(p=>p!=='/favicon.ico'),[]);
 console.log('PASS teacher sets: grade/topic filters, selection, overlap-safe add/remove, built-in protection, legacy preservation, staged CSV/JSON imports, validation, confirmed deletion/reload, links and activation.');
}).catch(error=>{console.error(error);process.exitCode=1;});
