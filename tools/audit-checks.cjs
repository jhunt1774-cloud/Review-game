const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const teacher=fs.readFileSync('teacher.js','utf8');const parser=teacher.slice(teacher.indexOf('function csvRows'),teacher.indexOf("$('question-template').onclick"));
const c=vm.createContext({CS_DOMAINS:['HTML','CSS'],$:()=>({value:'beginner'})});vm.runInContext(parser,c);
const csv=key=>'subject,question,A,B,C,D,correct,explanation\nHTML,Question?,one,two,three,four,'+key+',Why';
for(const [key,correct] of [['A',0],['b',1],['C',2],['D',3],['',-1],['AB',-1],['0',-1],['Z',-1]])assert.equal(c.parseQuestions(csv(key),true).questions[0].correct,correct,key);
assert.equal(c.parseQuestions('subject,question,A,B,C,D,correct,explanation\nHTML,"Two lines\nand a comma, here?",one,two,three,four,B,Why',true).questions[0].text,'Two lines\nand a comma, here?');
assert.throws(()=>c.parseQuestions('subject,question,A,B,C,D,correct,explanation\nHTML,"unfinished',true));
let stored=new Map(),events=[];const win={dispatchEvent:e=>events.push(e)};const ctx=vm.createContext({window:win,CustomEvent:class{constructor(type,data){Object.assign(this,{type},data);}}});Object.defineProperty(win,'localStorage',{configurable:true,get(){throw Error('Blocked');}});
vm.runInContext(fs.readFileSync('progress-storage.js','utf8'),ctx);assert.ok(win.ProgressStorage);assert.throws(()=>win.ProgressStorage.getItem('web-wizardry-v1'),/Blocked/);
Object.defineProperty(win,'localStorage',{value:{getItem:k=>stored.get(k)||null,setItem:(k,v)=>stored.set(k,v)}});const ps=win.ProgressStorage;ps.setItem('web-wizardry-v1','local');ps.setOwner('student');ps.setItem('web-wizardry-v1','account');assert.equal(ps.getItem('web-wizardry-v1'),'account');assert.equal(ps.legacy('web-wizardry-v1'),'local');ps.setItem('teacher-draft','draft');assert.equal(stored.get('teacher-draft'),'draft');assert.equal(events.length,2);
const html=fs.readFileSync('index.html','utf8');const scripts=[...html.matchAll(/<script[^>]*src="([^"?]+)/g)].map(x=>x[1]);for(const p of scripts){assert.ok(fs.existsSync(p),p);if(p!=='cloud-saves.js')new vm.Script(fs.readFileSync(p,'utf8'),{filename:p});}
console.log('PASS: CSV answer keys, quoted/multiline CSV, malformed CSV, blocked storage startup, account/local isolation, '+scripts.length+' script paths and classic script syntax.');
