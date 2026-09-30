import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const {chromium}=await import('../work/qa/node_modules/playwright/index.mjs');
const url='http://127.0.0.1:4382/yumeko-anime-teaser/';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={widths:[],visibility:null,reduced:null,rejection:null,errors:[]};
async function center(page,id){
 await page.locator('#'+id+' video').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
}
async function playing(page,id){
 await page.waitForFunction(id=>{const v=document.querySelector('#'+id+' video');return v&&!v.paused&&v.currentTime>.05;},id,{timeout:6000});
 const state=await page.locator('video').evaluateAll(videos=>videos.map(v=>({id:v.closest('article').id,paused:v.paused,muted:v.muted,time:v.currentTime})));
 assert.equal(state.filter(v=>!v.paused).length,1);
 assert(state.find(v=>v.id===id).muted);
 return state;
}
async function top(page){await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(300);assert(await page.locator('video').evaluateAll(videos=>videos.every(v=>v.paused)));}
async function newPage(options={}){
 const context=await browser.newContext({viewport:{width:1440,height:1000},...options});
 const page=await context.newPage();
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:4382/')?route.continue():route.abort());
 await page.goto(url,{waitUntil:'networkidle'});
 await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';});
 return page;
}
try{
 for(const width of [1440,390]){
  const page=await newPage({viewport:{width,height:width===1440?1000:844}});
  const before=await page.locator('video').evaluateAll(videos=>videos.every(v=>v.paused&&v.preload==='none'));
  assert(before);
  const states=[];
  for(const id of ['bookvoice','aine','babylog','micbridge']){await center(page,id);states.push(await playing(page,id));}
  await top(page);
  await center(page,'bookvoice');await playing(page,'bookvoice');
  const video=page.locator('#bookvoice video');
  await video.focus();await page.keyboard.press('Space');await page.waitForTimeout(200);
  assert(await video.evaluate(v=>v.paused));
  await page.evaluate(()=>scrollBy({top:8,behavior:'instant'}));await page.waitForTimeout(700);
  assert(await video.evaluate(v=>v.paused),'Manual pause survives scroll near the same work');
  await video.focus();await page.keyboard.press('Space');await playing(page,'bookvoice');
  await video.evaluate(v=>v.pause());await page.waitForTimeout(150);
  await top(page);await center(page,'bookvoice');await playing(page,'bookvoice');
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Emulation.setFocusEmulationEnabled',{enabled:false});
  const other=await page.context().newPage();await other.goto('about:blank');await other.bringToFront();
  const nativeHidden=await page.evaluate(()=>document.hidden);
  if(!nativeHidden)await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
  await page.waitForTimeout(200);
  assert(await video.evaluate(v=>v.paused),'Hidden tab pauses immediately');
  await page.bringToFront();
  if(!nativeHidden)await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
  await cdp.send('Emulation.setFocusEmulationEnabled',{enabled:true});
  await other.close();
  await playing(page,'bookvoice');
  report.visibility={nativeHidden,method:nativeHidden?'Native background tab':'Synthetic visibilitychange (headless visibility override)',paused:true,resumed:true};
  report.widths.push({width,posterBeforeView:before,states,manualPause:true,reentry:true});
  await page.context().close();
 }
 const reduced=await newPage({reducedMotion:'reduce'});
 await center(reduced,'babylog');await reduced.waitForTimeout(500);
 assert(await reduced.locator('video').evaluateAll(v=>v.every(el=>el.paused)));
 await reduced.locator('#babylog video').evaluate(v=>v.play());await playing(reduced,'babylog');
 await top(reduced);
 report.reduced={automatic:false,manualPlay:true,offscreenPause:true};
 await reduced.context().close();
 const rejected=await browser.newPage({viewport:{width:1440,height:1000}});
 rejected.on('pageerror',e=>report.errors.push(e.message));
 await rejected.addInitScript(()=>{
  const original=HTMLMediaElement.prototype.play;
  window.playAttempts=0;window.allowPlayback=false;
  HTMLMediaElement.prototype.play=function(){window.playAttempts++;if(!window.allowPlayback)return Promise.reject(new DOMException('Simulated autoplay refusal','NotAllowedError'));return original.call(this);};
 });
 await rejected.goto(url,{waitUntil:'networkidle'});
 await center(rejected,'bookvoice');await rejected.waitForTimeout(350);
 const attempts=await rejected.evaluate(()=>window.playAttempts);
 assert.equal(attempts,1);
 await rejected.evaluate(()=>scrollBy({top:8,behavior:'instant'}));await rejected.waitForTimeout(350);
 assert.equal(await rejected.evaluate(()=>window.playAttempts),attempts);
 await rejected.evaluate(()=>{window.allowPlayback=true;});
 await rejected.locator('#bookvoice video').evaluate(v=>v.play());await playing(rejected,'bookvoice');
 report.rejection={attempts,noRetryLoop:true,manualRecovery:true};
 await rejected.close();
 assert.equal(report.errors.length,0);
 console.log(JSON.stringify(report));
}finally{writeFileSync('outputs/review/viewport-playback-verification.json',JSON.stringify(report,null,2));await browser.close();}
