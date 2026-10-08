// Replace image with your supplied art. Define states as frame arrays for real sheets.
// Sheets: { image:'assets/hero.webp', frameWidth:128, frameHeight:128,
// states:{ idle:{frames:[0,1],fps:6}, attack:{frames:[2,3,4],fps:10}, ... } }
window.HEROES = [
 {id:'axe',name:'Thorin',role:'Axe dwarf',color:'#d09c52',maxHp:110,power:26,effect:'slash',crop:[22,38,206,241]},
 {id:'hammer',name:'Brom',role:'Hammer dwarf',color:'#93b8c5',maxHp:125,power:24,effect:'hammer',crop:[215,38,194,241]},
 {id:'archer',name:'Lira',role:'Elf archer',color:'#97c787',maxHp:85,power:29,effect:'arrow',crop:[208,1099,187,239]},
 {id:'mage',name:'Seren',role:'Mage',color:'#b49bdb',maxHp:80,power:33,effect:'fireball',crop:[587,1099,175,239]}
].map(h=>({...h,image:'assets/hero-sheet.webp',states:Object.fromEntries(['idle','walk','attack','hurt','victory','defeat'].map(s=>[s,{frames:[0],fps:6}]))}));
window.CharacterRenderer = class {
 constructor(element,config){this.el=element;this.config=config;this.setState('idle');}
 setState(state){clearInterval(this.timer);this.el.dataset.state=state;const c=this.config,s=c.states[state]||c.states.idle;if(!c.image)return;this.el.classList.add('sprite');if(c.crop){const [x,y,w,h]=c.crop;this.el.innerHTML=`<svg viewBox="${x} ${y} ${w} ${h}" aria-hidden="true"><defs><clipPath id="clip-${c.id}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><image clip-path="url(#clip-${c.id})" href="${c.image}" width="768" height="1360"/></svg>`;return;}this.el.style.backgroundImage=`url("${c.image}")`;if(!c.frameWidth){this.el.style.backgroundSize='contain';return;}let i=0;const draw=()=>{let f=s.frames[i++%s.frames.length],cols=c.columns||1;this.el.style.backgroundPosition=`-${f%cols*c.frameWidth}px -${Math.floor(f/cols)*c.frameHeight}px`;};this.el.style.width=c.frameWidth+'px';this.el.style.height=c.frameHeight+'px';draw();if(s.frames.length>1)this.timer=setInterval(draw,1000/s.fps);}
 destroy(){clearInterval(this.timer);}
};


