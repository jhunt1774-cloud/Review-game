// Editable question bank. Correct is the zero-based answer index.
window.QUESTIONS = [
 ['HTML','Which element creates a hyperlink?',['<a>','<link>','<href>','<url>'],0,'The <a> element creates a link; its href attribute sets the destination.'],
 ['HTML','Which attribute provides alternative text for an image?',['title','src','alt','name'],2,'alt describes an image for people who cannot see it.'],
 ['CSS','Which property changes the text color?',['font-color','color','text-style','background-color'],1,'color sets the foreground color of text.'],
 ['CSS','Which selector targets an element with id="quest"?',['.quest','quest','*quest','#quest'],3,'A # selector matches an ID; a dot matches a class.'],
 ['HTML','Which element represents the largest heading level?',['<h6>','<heading>','<h1>','<head>'],2,'h1 is the highest heading level; head contains document metadata.'],
 ['CSS','Which property adds space inside an element’s border?',['margin','padding','gap','outline'],1,'Padding sits inside the border; margin sits outside it.'],
 ['CSS','How do you select every element with class="hero"?',['#hero','.hero','hero','@hero'],1,'The dot prefix selects a class. Multiple elements can share a class.'],
 ['HTML','Which element creates an unordered list?',['<ol>','<li>','<ul>','<list>'],2,'ul wraps an unordered list. Each item uses li.'],
 ['CSS','Which declaration turns a container into a flex container?',['position: flex','display: flex','layout: flex','flex: display'],1,'display: flex enables Flexbox layout for the container’s children.'],
 ['HTML','Where should a page’s visible main content go?',['<head>','<meta>','<title>','<body>'],3,'body contains visible content; head contains metadata.'],
 ['CSS','Which property makes text bold?',['font-weight','text-bold','font-style','text-decoration'],0,'font-weight: bold increases the weight of text.'],
 ['CSS','What does margin: 0 auto usually do to a block with a fixed width?',['Adds inside spacing','Centers it horizontally','Hides the block','Centers text'],1,'Automatic left and right margins share available horizontal space.'],
 ['HTML','Which element is a semantic navigation container?',['<navigate>','<nav>','<menuitem>','<navigation>'],1,'nav identifies a major group of navigation links.'],
 ['CSS','Which rule applies when a viewport is 600px wide or narrower?',['@media (max-width: 600px)','@media (min-width: 600px)','@viewport 600px','@screen = 600px'],0,'max-width media queries match viewports at or below the given width.'],
 ['HTML','Which attribute is used to associate a label with an input’s id?',['name','target','for','value'],2,'The label’s for attribute matches the input’s id.'],
 ['CSS','With border-box, what is included in the specified width?',['Only content','Content, padding, and border','Margin only','Content and margin'],1,'box-sizing: border-box includes content, padding, and border in the set width.'],
 ['HTML','Which element creates a line break?',['<break>','<lb>','<br>','<hr>'],2,'br creates a line break. hr represents a thematic break.'],
 ['CSS','Which unit is relative to the root element’s font size?',['px','vh','rem','%'],2,'rem is relative to the root font size; em depends on the relevant element’s font size.'],
 ['HTML','Which input type conceals the entered characters?',['hidden','password','private','secret'],1,'type="password" conceals characters on screen. It does not encrypt transmitted data.'],
 ['CSS','Which pseudo-class matches a keyboard-focused element?',[':active',':checked',':focus',':visited'],2,':focus matches the element currently receiving input focus.']
].map((q,id)=>({id,topic:q[0],text:q[1],answers:q[2],correct:q[3],explanation:q[4]}));
