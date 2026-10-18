// Four role-specific support actions; resources and temporary effects persist with the battle.
(()=>{'use strict';
window.PartyTeamwork={
 moves:[
  {name:'Rally the party',detail:'70% strike · next 2 hits by other heroes deal +20% damage · 2 focus',scale:.7,role:'Vanguard · prepare allies to strike'},
  {name:'Hold formation',detail:'50% strike · each living hero gains a 20% ward against one damaging enemy hit · 2 focus',scale:.5,role:'Defender · protect the whole party'},
  {name:'Find an opening',detail:'80% shot · next teammate weakness hit deals +25% damage and restores 1 focus · 2 focus',scale:.8,role:'Ranger · set up a precise follow-up'},
  {name:'Renewing light',detail:'40% strike · heal each living ally 12% max HP and give a 15% ward against one damaging hit · 2 focus',scale:.4,role:'Healer · recover and protect allies'}
 ],
 defaults(c){const old=c.teamwork||{};c.teamwork={rally:Number.isInteger(old.rally)?Math.max(0,Math.min(2,old.rally)):0,opening:old.opening===true,wards:Array.from({length:4},(_,i)=>[.15,.2].includes(old.wards?.[i])?old.wards[i]:0)};return c.teamwork;},
 status(c){const t=this.defaults(c);return [t.rally?'Rally: '+t.rally+' teammate hits +20%':'',t.opening?'Opening: teammate weakness hit +25% and +1 focus':'',t.wards.some(Boolean)?'Wards: '+t.wards.map((v,i)=>v?HEROES[i].name+' '+Math.round(v*100)+'%':'').filter(Boolean).join(', '):''].filter(Boolean).join(' · ');},
 attack(s,i,damage,weakness){const t=this.defaults(s.campaign),labels=[];if(damage<=0)return {damage:0,labels};if(i!==0&&t.rally){damage*=1.2;t.rally--;labels.push('RALLY +20%');}if(i!==2&&weakness&&t.opening){damage*=1.25;t.opening=false;s.campaign.focus=Math.min(3,s.campaign.focus+1);labels.push('OPENING +25% · +1 FOCUS');}return {damage:Math.max(1,Math.round(damage)),labels};},
 activate(s,i,max){const t=this.defaults(s.campaign),labels=[this.moves[i].name.toUpperCase()],healing=[];if(i===0)t.rally=2;if(i===1)t.wards=t.wards.map((v,j)=>s.hp[j]>0?Math.max(v,.2):v);if(i===2)t.opening=true;if(i===3){for(let j=0;j<4;j++){if(s.hp[j]<=0)continue;const gain=Math.max(0,Math.min(max(j)-s.hp[j],Math.ceil(max(j)*.12)));s.hp[j]+=gain;t.wards[j]=Math.max(t.wards[j],.15);if(gain)healing.push({hero:j,gain});}}return {labels,healing};},
 defend(s,i,amount){const t=this.defaults(s.campaign);if(amount<=0||!t.wards[i])return {damage:amount,labels:[]};const protection=t.wards[i];t.wards[i]=0;return {damage:Math.max(1,Math.round(amount*(1-protection))),labels:['PARTY WARD −'+Math.round(protection*100)+'%']};}
};
const defaults=Progression.defaults,reset=PartyRoles.reset,status=PartyRoles.status;
Progression.defaults=function(c){defaults.call(this,c);PartyTeamwork.defaults(c);return c;};
PartyRoles.reset=function(c){reset.call(this,c);delete c.teamwork;PartyTeamwork.defaults(c);};
PartyRoles.status=function(c){return [status.call(this,c),PartyTeamwork.status(c)].filter(Boolean).join(' · ');};
})();
