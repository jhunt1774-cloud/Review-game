// Optional Firebase adapter. No analytics, roster, teacher content or question banks.
const config=window.ForestCloudConfig;

let status;
function message(t){if(status)status.textContent=t;}
async function boot(){
 const panel=document.createElement('section');panel.className='teacher-box';
 panel.innerHTML='<h3>Save across Chromebooks</h3><p role="status" aria-live="polite"></p>';
 document.getElementById('title').append(panel);status=panel.querySelector('p');
 const button=(label,fn)=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>Promise.resolve().then(fn).catch(e=>message(e.message));panel.append(b);return b;};
 message('Connecting to cloud saves…');
 const [app,A,F]=await Promise.all(['app','auth','firestore'].map(n=>import('https://www.gstatic.com/firebasejs/13.0.0/firebase-'+n+'.js')));
 const instance=app.initializeApp(config.firebase),auth=A.getAuth(instance),db=F.getFirestore(instance);
 await A.setPersistence(auth,A.browserSessionPersistence);
 let uid=null,pending=new Map(),revisions=new Map(),locked=new Set(),working=false;
 const storage=window.ProgressStorage;
 const baseKey=slot=>'forest-revision:'+uid+':'+slot;
 const revision=slot=>{if(!revisions.has(slot))revisions.set(slot,Number(localStorage.getItem(baseKey(slot))||0));return revisions.get(slot);};
 const recordRevision=(slot,n)=>{revisions.set(slot,n);localStorage.setItem(baseKey(slot),n);};
 const ref=(slot,user=uid)=>F.doc(db,'players',user,'saves',slot);
 const current=async()=>{const token=new URLSearchParams(location.hash.slice(1)).get('quest');if(!token)return {slot:'web-wizardry-v1',lesson:null};const lesson=await AssignmentLinks.decode(token);return {slot:'web-wizardry-assignment-'+await AssignmentLinks.identity(lesson),lesson};};
 const requireUser=()=>{if(!uid)throw Error('Sign in with your school Google account first.');};
 const compact=raw=>{const data=JSON.parse(raw);data.lesson=null;data.practice=null;const payload=JSON.stringify(data);if(new TextEncoder().encode(payload).length>180000)throw Error('Progress exceeds cloud size limit. Download a progress backup.');return payload;};
 async function flush(){
  if(!uid||working||!navigator.onLine)return;
  working=true;const user=uid;
  try{for(const [slot,raw] of pending){if(locked.has(slot))continue;const expected=revision(slot),payload=compact(raw);message('Saving to cloud…');
   await F.runTransaction(db,async tx=>{const r=ref(slot,user),snap=await tx.get(r),actual=snap.exists()?snap.data().revision:0;if(actual!==expected)throw Error('CONFLICT');tx.set(r,{schema:1,revision:expected+1,payload,updatedAt:F.serverTimestamp()});});
   if(uid!==user)break;recordRevision(slot,expected+1);if(pending.get(slot)===raw){pending.delete(slot);localStorage.removeItem('forest-dirty:'+user+':'+slot);}message('Cloud saved.');
  }}catch(e){if(e.message==='CONFLICT'){for(const slot of pending.keys())locked.add(slot);message('Another device has newer progress. Download your local backup, then load cloud progress. Local progress is preserved.');}else message('Cloud save unavailable. Progress is safe on this device; retry when online.');}finally{working=false;}
 }
 button('Sign in with Google',async()=>{if(working)throw Error('Wait for the current save.');const provider=new A.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});await A.signInWithPopup(auth,provider);});
 button('Load cloud adventure / linked assignment',async()=>{
  requireUser();if(working)throw Error('Wait for the current save.');const user=uid,hash=location.hash,{slot,lesson}=await current(),snap=await F.getDocFromServer(ref(slot,user));if(uid!==user||location.hash!==hash)throw Error('Account or assignment changed. Load again.');
  if(!snap.exists()){recordRevision(slot,0);message('No cloud progress for this quest yet. Start playing to create it.');return;}
  const doc=snap.data();if(doc.schema!==1)throw Error('This cloud save needs a newer game version.');const data=JSON.parse(doc.payload);data.lesson=lesson;
  if(!GameProgress.validate(data))throw Error('Cloud progress failed validation. Local progress is unchanged.');
  if(!confirm('Load cloud progress? Current local progress will be kept as a backup.'))return;
  // Set revision before restore, whose local save event schedules the new checkpoint.
  recordRevision(slot,doc.revision);locked.delete(slot);pending.delete(slot);
  GameProgress.restoreData({format:'asterfall-progress',version:1,slot,data});message('Cloud progress loaded.');
 });
 button('Save to cloud now',flush);
 button('Import old device save',async()=>{requireUser();const {slot}=await current(),raw=storage.legacy(slot);if(!raw)throw Error('No old device save for this quest.');if(storage.getItem(slot))throw Error('This account already has local progress. Export backups before replacing it.');if(!GameProgress.validate(JSON.parse(raw)))throw Error('Old save is invalid.');if(confirm('Copy this shared device save into your signed-in account? Only import your own progress.')){storage.setItem(slot,raw);GameProgress.resetAccount();message('Imported locally. Save to cloud now; an existing cloud save will be protected.');}});
 button('Sign out',async()=>{if(working)throw Error('Wait for the current save.');if(pending.size&&!confirm('Some progress has not reached cloud. It remains on this device for this account. Sign out anyway?'))return;await A.signOut(auth);});
 A.onAuthStateChanged(auth,user=>{
  uid=user?.uid||null;pending.clear();revisions.clear();locked.clear();storage.setOwner(uid);GameProgress.resetAccount();
  if(uid){for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i),prefix='forest-dirty:'+uid+':';if(k.startsWith(prefix)){const slot=k.slice(prefix.length),raw=storage.getItem(slot);if(raw&&storage.eligible(slot))pending.set(slot,raw);}}}
  message(uid?'Signed in. Load cloud progress before continuing on a different Chromebook.':'Signed out. Device-only progress is available.');
 });
 window.addEventListener('progress-saved',e=>{if(!uid)return;const {slot,raw}=e.detail;if(!storage.eligible(slot))return;revision(slot);pending.set(slot,raw);localStorage.setItem('forest-dirty:'+uid+':'+slot,'1');message('Saved locally · cloud checkpoint pending');const phase=JSON.parse(raw).phase;if(['victory','complete','defeat'].includes(phase))flush();});
 setInterval(flush,60000);window.addEventListener('online',flush);document.addEventListener('visibilitychange',()=>{if(document.hidden)flush();});
}

if(config) boot().catch(()=>message('Cloud unavailable. Local saves still work.'));


