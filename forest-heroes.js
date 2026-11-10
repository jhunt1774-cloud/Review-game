/* Portrait-led choices and companion voices over the existing identity/roster rules. */
(() => {
 'use strict';
 const Q=ForestAdventure,$=id=>document.getElementById(id);
 const profiles=[
  {id:'thorin',name:'Thorin',role:'Axe · vanguard',voice:'Decisive, with a protective streak. Leads by making room for the others.',play:'Expose armor with Sundering axe; rally teammates for stronger follow-up hits.'},
  {id:'brom',name:'Brom',role:'Hammer · defender',voice:'Patient and steady. Measures a victory by who makes it home.',play:'Draw the next attack with Challenge; use Hold formation to ward the party.'},
  {id:'lira',name:'Lira',role:'Bow · ranger',voice:'Observant and resourceful. Reads the danger before the first arrow flies.',play:'Mark an enemy for a teammate; find an opening for the next weakness hit.'},
  {id:'seren',name:'Seren',role:'Magic · healer',voice:'Thoughtful and quietly brave. Looks for what can be restored.',play:'Use Healing light to restore an ally; Renewing light heals and wards the party.'}
 ];
 const exchanges={
  m0:[[2,'Those roots are closing every way out.'],[0,'Then this is where we start opening them.']],
  m1:[[1,'It is cornered, not cruel.'],[3,'Let it retreat when the roots release it.']],
  m2:[[3,'That oath was meant to shelter people.'],[1,'Hold steady. We will give it that purpose back.']],
  m3:[[0,'We break the bindings. The Guardian stays.'],[2,'I will watch for the first opening.']]
 };
 const H=window.ForestHeroes={profiles,state:null,
  portrait(s,role){const p=profiles[role];return s.campaign.activeRoster?.[role]===p.id?'assets/forest-hero-'+p.id+'.webp':null;},
  image(source,size=64){const image=document.createElement('img');image.src=source;image.alt='';image.width=image.height=size;image.decoding='async';image.className='forest-hero-portrait';return image;},
  identity(parent,s){
   if(!Q.active(s))return;const box=parent.querySelector('.hero-identity');if(!box)return;const select=parent._identity?.role,name=parent._identity?.name,chosen=s.campaign.playerHero.chosen;
   if(chosen){const role=s.campaign.playerHero.role,p=profiles[role],source=this.portrait(s,role),card=document.createElement('div'),copy=document.createElement('div'),voice=document.createElement('p'),play=document.createElement('p');card.className='forest-hero-profile';if(source)card.append(this.image(source,80));voice.textContent=source?p.voice:'Your chosen companion · '+p.role;play.textContent=p.play;copy.append(voice,play);card.append(copy);box.append(card);return;}
   if(!select||!name)return;select.closest('label').hidden=true;
   const intro=document.createElement('p');intro.className='forest-role-intro';intro.textContent='All four heroes travel with you. Choose your named hero and the party’s map leader.';
   const group=document.createElement('div');group.className='forest-role-choices';group.setAttribute('role','group');group.setAttribute('aria-label','Choose your hero’s role');
   let automaticName=name.value===profiles[Number(select.value)].name;name.addEventListener('input',()=>{automaticName=false;});
   const update=()=>{const role=Number(select.value);if(automaticName)name.value=profiles[role].name;for(const button of group.children)button.setAttribute('aria-pressed',String(Number(button.dataset.role)===role));};
   profiles.forEach((p,role)=>{const button=document.createElement('button'),title=document.createElement('strong'),kind=document.createElement('span'),play=document.createElement('small');button.type='button';button.className='forest-role-choice';button.dataset.role=String(role);button.append(this.image('assets/forest-hero-'+p.id+'.webp',72));title.textContent=p.name;kind.textContent=p.role;play.textContent=p.play;button.append(title,kind,play);button.onclick=()=>{if(select.disabled)return;select.value=String(role);select.dispatchEvent(new Event('change',{bubbles:true}));};group.append(button);});
   select.addEventListener('change',update);update();box.querySelector('h2').after(intro,group);
  },
  arrival(s){
   $('forest-party-exchange')?.remove();$('arrival-speaker')?.querySelector('.forest-hero-portrait')?.remove();
   if(!Q.active(s))return;const lines=exchanges[s.campaign.battleNode];if(!lines)return;const source=this.portrait(s,lines[0][0]);if(source&&!$('arrival-speaker').hidden)$('arrival-speaker').prepend(this.image(source,36));
   const exchange=document.createElement('details'),summary=document.createElement('summary');exchange.id='forest-party-exchange';summary.textContent='Around the party';if(source&&$('arrival-speaker').hidden)summary.prepend(this.image(source,24));exchange.append(summary);
   for(const [role,line]of lines){const p=document.createElement('p'),name=document.createElement('strong');name.textContent=HEROES[role].name+': ';p.append(name,document.createTextNode('“'+line+'”'));exchange.append(p);}
   $('arrival-narration').after(exchange);
  }
 };
 const identity=RosterSystem.identityUI;RosterSystem.identityUI=function(parent,s,...args){const result=identity.call(this,parent,s,...args);H.identity(parent,s);return result;};
 const render=RosterSystem.render;RosterSystem.render=function(parent,s,atCamp,...args){const result=render.call(this,parent,s,atCamp,...args);if(Q.active(s)&&!atCamp&&!s.campaign.playerHero.chosen)for(const button of parent.querySelectorAll('.forest-role-choice'))button.disabled=true;return result;};
 const menu=ForestDirection.menu;ForestDirection.menu=function(s,role){const result=menu.call(this,s,role);$('hero-menu-title')?.querySelector('.forest-hero-portrait')?.remove();if(Q.active(s)){const source=H.portrait(s,role);if(source)$('hero-menu-title').prepend(H.image(source,30));}return result;};
 for(const method of ['prologue','world','arrival','result','presentChallenge']){const old=Q[method];Q[method]=function(s,...args){H.state=s;const result=old.call(this,s,...args);if(method==='arrival')H.arrival(s);if(!this.active(s)){$('forest-party-exchange')?.remove();$('arrival-speaker')?.querySelector('.forest-hero-portrait')?.remove();$('hero-menu-title')?.querySelector('.forest-hero-portrait')?.remove();}return result;};}
})();
