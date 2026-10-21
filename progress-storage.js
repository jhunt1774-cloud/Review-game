// Only student progress is namespaced. Teacher drafts and playtests stay local.
(()=>{const native=window.localStorage;let owner=null;
const eligible=k=>/^web-wizardry-(v1|assignment-[a-f0-9]{64})$/.test(k);
const key=k=>owner&&/^web-wizardry-(v1|assignment-[a-f0-9]{64})(-backup|-before-update)?$/.test(k)?'forest-account:'+owner+':'+k:k;
window.ProgressStorage={eligible,setOwner(uid){owner=uid;},getItem(k){return native.getItem(key(k));},setItem(k,v){native.setItem(key(k),v);if(eligible(k))window.dispatchEvent(new CustomEvent('progress-saved',{detail:{slot:k,raw:v}}));},legacy(k){return native.getItem(k);},accountKey:key};
})();
