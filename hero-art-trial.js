// Optional painted class artwork; each role can be compared independently.
(()=>{'use strict';
const keys=['image','crop','frameWidth','frameHeight','columns','rows','sheetWidth','sheetHeight','frameRects','states'];
const originals=[0,1].map(index=>Object.fromEntries(keys.map(key=>[key,HEROES[index][key]])));
window.HeroArtTrial={enabled:false,bromEnabled:false,
 read(){try{this.enabled=localStorage.getItem('asterfall-painted-thorin')==='yes';this.bromEnabled=localStorage.getItem('asterfall-painted-brom')==='yes';}catch{}},
 apply(){for(const index of [0,1]){const enabled=index===0?this.enabled:this.bromEnabled;const art=enabled?{...(index===0?PAINTED_THORIN:PAINTED_BROM),crop:null,columns:4,rows:4}:originals[index];for(const key of keys)HEROES[index][key]=key==='states'?JSON.parse(JSON.stringify(art[key])):art[key];}},
 set(enabled){this.enabled=!!enabled;this.save('thorin',this.enabled);},
 setBrom(enabled){this.bromEnabled=!!enabled;this.save('brom',this.bromEnabled);},
 save(role,enabled){try{localStorage.setItem('asterfall-painted-'+role,enabled?'yes':'no');}catch{}window.GameAppearance?.refresh();}
};
HeroArtTrial.read();const apply=RosterSystem.apply;RosterSystem.apply=function(s){apply.call(this,s);HeroArtTrial.apply();};
const choice=document.getElementById('hero-art-trial');choice.checked=HeroArtTrial.enabled;choice.onchange=()=>HeroArtTrial.set(choice.checked);
const brom=document.getElementById('brom-art-trial');brom.checked=HeroArtTrial.bromEnabled;brom.onchange=()=>HeroArtTrial.setBrom(brom.checked);
})();
