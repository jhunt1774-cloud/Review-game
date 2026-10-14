// Local diagnostics only. No save data or errors are sent anywhere.
window.GameDiagnostics={
 build:'animated-combat-playback-20261009',
 report(error){const box=document.getElementById('startup-error'),detail=document.getElementById('startup-error-detail');if(!box||!detail)return;box.hidden=false;const message=error?.message||String(error||'Unknown error');detail.textContent=message.slice(0,400);},
 clear(){const box=document.getElementById('startup-error');if(box)box.hidden=true;}
};
window.addEventListener('error',event=>GameDiagnostics.report(event.error||event.message));
window.addEventListener('unhandledrejection',event=>GameDiagnostics.report(event.reason));
