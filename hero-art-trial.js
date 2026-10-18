// Standard painted artwork; no trial settings or per-device appearance changes.
(()=>{'use strict';
const keys=['image','crop','frameWidth','frameHeight','columns','rows','sheetWidth','sheetHeight','frameRects','states'];
window.HeroArtwork={apply(){const art=[PAINTED_THORIN,PAINTED_BROM,PAINTED_LIRA,PAINTED_SEREN];for(let index=0;index<4;index++){const config={...art[index],crop:null,columns:4,rows:4};for(const key of keys)HEROES[index][key]=key==='states'?JSON.parse(JSON.stringify(config[key])):config[key];MapWalkers.configs[index]=PAINTED_TRAVEL[index];}}};
const apply=RosterSystem.apply;RosterSystem.apply=function(state){apply.call(this,state);HeroArtwork.apply();};HeroArtwork.apply();
})();
