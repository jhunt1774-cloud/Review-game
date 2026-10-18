// Painted heroes are the default; per-role switches retain the original artwork.
(()=>{'use strict';
const keys=['image','crop','frameWidth','frameHeight','columns','rows','sheetWidth','sheetHeight','frameRects','states'];
const originals=[0,1,2,3].map(index=>Object.fromEntries(keys.map(key=>[key,HEROES[index][key]])));
const originalTravel=MapWalkers.configs.slice(),roles=['thorin','brom','lira','seren'];
window.HeroArtTrial={enabled:true,bromEnabled:true,liraEnabled:true,serenEnabled:true,
 read(){try{if(localStorage.getItem('asterfall-painted-default-v1')!=='yes'){for(const role of roles)localStorage.setItem('asterfall-painted-'+role,'yes');localStorage.setItem('asterfall-painted-default-v1','yes');}this.enabled=localStorage.getItem('asterfall-painted-thorin')!=='no';this.bromEnabled=localStorage.getItem('asterfall-painted-brom')!=='no';this.liraEnabled=localStorage.getItem('asterfall-painted-lira')!=='no';this.serenEnabled=localStorage.getItem('asterfall-painted-seren')!=='no';}catch{}},
 apply(){for(const index of [0,1,2,3]){const enabled=[this.enabled,this.bromEnabled,this.liraEnabled,this.serenEnabled][index];const art=enabled?{...[PAINTED_THORIN,PAINTED_BROM,PAINTED_LIRA,PAINTED_SEREN][index],crop:null,columns:4,rows:4}:originals[index];for(const key of keys)HEROES[index][key]=key==='states'?JSON.parse(JSON.stringify(art[key])):art[key];MapWalkers.configs[index]=enabled?PAINTED_TRAVEL[index]:originalTravel[index];}},
 set(enabled){this.enabled=!!enabled;this.save('thorin',this.enabled);},
 setBrom(enabled){this.bromEnabled=!!enabled;this.save('brom',this.bromEnabled);},
 setLira(enabled){this.liraEnabled=!!enabled;this.save('lira',this.liraEnabled);},
 setSeren(enabled){this.serenEnabled=!!enabled;this.save('seren',this.serenEnabled);},
 save(role,enabled){try{localStorage.setItem('asterfall-painted-'+role,enabled?'yes':'no');}catch{}window.GameAppearance?.refresh();}
};
HeroArtTrial.read();const apply=RosterSystem.apply;RosterSystem.apply=function(s){apply.call(this,s);HeroArtTrial.apply();};
const choice=document.getElementById('hero-art-trial');choice.checked=HeroArtTrial.enabled;choice.onchange=()=>HeroArtTrial.set(choice.checked);
const brom=document.getElementById('brom-art-trial');brom.checked=HeroArtTrial.bromEnabled;brom.onchange=()=>HeroArtTrial.setBrom(brom.checked);
const lira=document.getElementById('lira-art-trial');lira.checked=HeroArtTrial.liraEnabled;lira.onchange=()=>HeroArtTrial.setLira(lira.checked);
const seren=document.getElementById('seren-art-trial');seren.checked=HeroArtTrial.serenEnabled;seren.onchange=()=>HeroArtTrial.setSeren(seren.checked);
HeroArtTrial.apply();
})();
