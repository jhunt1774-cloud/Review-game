// Fresh examples are generated only from recognized concepts in the assigned set.
// Unrecognized/imported questions keep their exact wording and correct answer.
(()=>{'use strict';
const pick=a=>a[Math.floor(Math.random()*a.length)],number=(lo,hi)=>lo+Math.floor(Math.random()*(hi-lo+1));
function valid(q){return !!q&&CS_DOMAINS.includes(q.topic)&&typeof q.text==='string'&&q.text.length>0&&q.text.length<=1000&&Array.isArray(q.answers)&&q.answers.length===4&&q.answers.every(a=>typeof a==='string'&&a.length>0&&a.length<=300)&&Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4&&typeof q.explanation==='string'&&q.explanation.length<=1500;}
function shuffle(q){const choices=q.answers.map((text,i)=>({text,right:i===q.correct}));for(let i=3;i>0;i--){const j=number(0,i);[choices[i],choices[j]]=[choices[j],choices[i]];}return {...q,answers:choices.map(a=>a.text),correct:choices.findIndex(a=>a.right)};}
function build(source,text,right,wrong,explanation){return {...source,text,answers:[right,...wrong],correct:0,explanation,variation:'example'};}
function supported(q){if(!['HTML','CSS'].includes(q.topic))return false;
if(QUESTIONS.some(s=>s.topic===q.topic&&s.text===q.text))return true;return [
 /^Which selector targets (?:id|class)="[\w-]+"\?$/,
 /^Which selector matches only direct p children of \.[\w-]+\?$/,
 /^An element uses content-box, width: \d+px, padding: \d+px and border: \d+px\. What is its outer width excluding margin\?$/,
 /^A content-box element has width: \d+px, padding: \d+px and border: \d+px\. What is its outer width excluding margin\?$/,
 /^Which (?:rule|media query) applies (?:when a viewport is|at viewport widths of|when the viewport is) \d+px (?:wide or narrower|or narrower)\?$/,
 /^Which declaration makes text in \.[\w-]+ [\w]+\?$/,
 /^Which declaration adds \d+px of space inside the border of \.[\w-]+\?$/,
 /^Which markup links to [\w-]+\.html\?$/,
 /^Which label correctly associates with an input whose id is "[\w-]+"\?$/,
 /^What does grid-template-columns: repeat\(\d+, 1fr\) create\?$/
 ].some(p=>p.test(q.text));}
function example(q){if(!supported(q))return {...q,answers:[...q.answers],variation:'reused'};const text=q.text,answer=q.answers[q.correct],token=pick(['hero','quest','forest','spell','party','treasure','beacon','guardian'])+number(10,999),color=pick(['red','blue','green','purple','navy','teal']);
if(q.topic==='CSS'){
 if(/selector|select/.test(text.toLowerCase())&&/(?:id|class)\s*=\s*["']/.test(text)&&/^[#.][\w-]+$/.test(answer)){const id=answer.startsWith('#');return build(q,`Which selector targets ${id?'id':'class'}="${token}"?`,(id?'#':'.')+token,[(id?'.':'#')+token,token,'@'+token],id?'An ID selector starts with #.':'A class selector starts with a dot.');}
 if(/direct.*children|direct.*child/.test(text.toLowerCase())&&/>/.test(answer)){return build(q,`Which selector matches only direct p children of .${token}?`,`.${token} > p`,[`.${token} p`,`p + .${token}`,`.${token} ~ p`],'The child combinator > matches direct children only.');}
 if(/content-box/.test(text)&&/outer width/.test(text)){const w=number(8,30)*10,p=number(2,16),b=number(1,5),total=w+2*p+2*b;return build(q,`An element uses content-box, width: ${w}px, padding: ${p}px and border: ${b}px. What is its outer width excluding margin?`,total+'px',[w+'px',(w+p+b)+'px',(w+2*p)+'px'],`${w} content + ${2*p} horizontal padding + ${2*b} horizontal border = ${total}px.`);}
 if(/viewport|media query/.test(text.toLowerCase())&&/max-width/.test(answer)){const width=pick([360,480,600,720,768,900,1024,1200]);return build(q,`Which media query applies when the viewport is ${width}px wide or narrower?`,`@media (max-width: ${width}px)`,[`@media (min-width: ${width}px)`,`@media (width > ${width}px)`,`@media (width = ${width}px)`],'max-width matches viewports at or below the specified width.');}
 if(/text.*color|color.*text/.test(text.toLowerCase())&&(answer==='color'||/^color:/.test(answer))){if(answer==='color')return {...q,text:`A .${token} paragraph needs ${color} text. Which CSS property changes its text color?`,variation:'example'};return build(q,`Which declaration makes text in .${token} ${color}?`,`color: ${color}`,[`font-color: ${color}`,`text-color: ${color}`,`background-color: ${color}`],'color sets the foreground text color.');}
 if(/inside.*border/.test(text.toLowerCase())&&(answer==='padding'||/^padding:/.test(answer))){if(answer==='padding')return {...q,text:`For .${token}, which property adds space inside the element’s border?`,variation:'example'};const amount=number(2,30);return build(q,`Which declaration adds ${amount}px of space inside the border of .${token}?`,`padding: ${amount}px`,[`margin: ${amount}px`,`gap: ${amount}px`,`outline: ${amount}px`],'Padding adds space between the content and its border.');}
 if(/grid-template-columns: repeat\(\d+, 1fr\)/.test(text)){const columns=number(2,6);return build(q,`What does grid-template-columns: repeat(${columns}, 1fr) create?`,`${columns} equal flexible columns`,[`${columns} fixed pixels`,`${columns} rows`,'One fixed-width column'],`repeat(${columns}, 1fr) creates ${columns} flexible column tracks sharing available space equally.`);}
 const concepts=[['font-weight',/text.*bold|makes.*bold/,`Which CSS property makes text in .${token} bold?`],['display: flex',/flex container/,`Which declaration makes .${token} a flex container?`],[':focus',/focused element|keyboard.*focus/,`Which pseudo-class matches a keyboard-focused .${token} element?`]];
 for(const [right,pattern,prompt] of concepts)if(answer===right&&pattern.test(text.toLowerCase()))return {...q,text:prompt,variation:'example'};
}
if(q.topic==='HTML'){
 if(/markup.*links|links to/.test(text.toLowerCase())&&/^<a href=/.test(answer)){const file=token+'.html';return build(q,`Which markup links to ${file}?`,`<a href="${file}">Open</a>`,[`<a src="${file}">Open</a>`,`<p href="${file}">Open</p>`,`<a link="${file}">Open</a>`],'An anchor uses href to specify its destination.');}
 if(/label.*associates/.test(text.toLowerCase())&&/^<label for=/.test(answer))return build(q,`Which label correctly associates with an input whose id is "${token}"?`,`<label for="${token}">Name</label>`,[`<label href="${token}">Name</label>`,`<label name="${token}">Name</label>`,`<label src="${token}">Name</label>`],'The label’s for attribute matches the input’s id.');
 const concepts=[['<a>',/creates.*hyperlink/,`On the ${token} page, which HTML element creates a hyperlink?`],['alt',/alternative text/,`Which attribute provides alternative text for the ${token} image?`],['<h1>',/largest heading|highest.heading/,`Which element is the highest-level heading on the ${token} page?`],['<ul>',/unordered list/,`Which HTML element wraps an unordered list of ${token} items?`],['<body>',/visible.*content/,`Where does the visible main content of the ${token} page belong?`],['<nav>',/navigation/,`Which semantic element groups the ${token} page’s main navigation links?`],['for',/label.*input/,`Which attribute connects a label to an input with id="${token}"?`],['<br>',/line break/,`Which HTML element creates a line break in the ${token} text?`],['password',/conceal|password/,`Which input type conceals characters entered in the ${token} field?`]];
 for(const [right,pattern,prompt] of concepts)if(answer===right&&pattern.test(text.toLowerCase()))return {...q,text:prompt,variation:'example'};
}
return {...q,answers:[...q.answers],variation:'reused'};
}
function next(source,cycle,recent=[]){if(!valid(source))throw Error('Invalid source question.');if(cycle===0)return {...source,answers:[...source.answers],variation:'original'};let q;for(let i=0;i<15;i++){q=example(source);if(!recent.includes(q.text)||q.variation==='reused')break;}const result=shuffle(q);if(!valid(result))return shuffle({...source,answers:[...source.answers],variation:'reused'});return result;}
window.PracticeQuestions={next,valid};
})();
