const assert=require('node:assert/strict');

require('./browser-harness.cjs')(async({send,evaluate:e,wait,errors,missing})=>{
 const url='http://127.0.0.1:8138'+(process.env.SITE_PREFIX||'/')+'frostpeak-walk.html';
 const saveKey='web-wizardry-frostpeak-walk-v1';
 const saved=()=>e(`JSON.parse(localStorage.getItem('${saveKey}'))`);
 const label=()=>document.querySelector('#location').textContent;
 const at=name=>wait(`(${label})()===${JSON.stringify(name)}`,18000);
 const choose=async name=>{
  await e(`(()=>{const select=document.querySelector('#destination');select.value=${JSON.stringify(name)};
   select.dispatchEvent(new Event('change'));})()`);
  await at(name);
 };
 const clickAt=async (x,y)=>{
  const location=await e(`(()=>{const b=document.querySelector('canvas').getBoundingClientRect();return {x:b.left+b.width*${x},y:b.top+b.height*${y}};})()`);
  await send('Input.dispatchMouseEvent',{type:'mousePressed',...location,button:'left',clickCount:1});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',...location,button:'left',clickCount:1});
 };
 await send('Emulation.setDeviceMetricsOverride',{width:1024,height:600,deviceScaleFactor:1,mobile:false});
 await send('Page.navigate',{url});await at('Trailhead');
 await e("document.querySelector('canvas').focus()");
 await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowUp',code:'ArrowUp',windowsVirtualKeyCode:38});
 await new Promise(resolve=>setTimeout(resolve,130));
 await send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowUp',code:'ArrowUp',windowsVirtualKeyCode:38});
 await wait(`JSON.parse(localStorage.getItem('${saveKey}'))?.y < .878`);
 await e("document.querySelector('#overview').click()");
 await clickAt(.62,.51);
 await wait(`(${label})().startsWith('Choose the trail')`);
 await clickAt(.49,.76);await at('Journal');
 await choose('Climbing station');
 await choose('Watchtower');
 await choose('East lookout');
 await choose('Mine entrance');
 await wait(`JSON.parse(localStorage.getItem('${saveKey}'))?.y < .22`,10000);
 const before=await saved();
 await send('Page.reload');await at('Mine entrance');
 assert.deepEqual(await saved(),before);
 await send('Emulation.setDeviceMetricsOverride',{width:768,height:600,deviceScaleFactor:1,mobile:false});
 assert.equal(await e('document.documentElement.scrollWidth<=innerWidth'),true);
 assert.deepEqual(errors,[]);
 assert.deepEqual(missing.filter(file=>!file.endsWith('/favicon.ico')),[]);
 console.log('PASS Frostpeak keyboard, clicked journal, blocked ravine, station, watchtower, crossing, mine, and reload.');
}).catch(error=>{console.error(error);process.exitCode=1;});
