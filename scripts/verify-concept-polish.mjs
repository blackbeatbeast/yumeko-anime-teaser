import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from '../work/qa/node_modules/playwright/index.mjs';
const out='outputs/concept-polish';mkdirSync(out,{recursive:true});
const base='http://127.0.0.1:4382/yumeko-anime-teaser/';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={widths:[],errors:[],external:[],failedAssets:[],reduced:[],scrollCalls:0};
const ids=['bookvoice','aine','babylog','micbridge'];
try{
 for(const width of (process.argv.slice(2).length?process.argv.slice(2).map(Number):[1440,768,390,320])){
  const page=await browser.newPage({viewport:{width,height:width>640?1000:844},isMobile:width<640,hasTouch:width<640});
  await page.clock.install();
  await page.route('**/*',r=>{if(r.request().url().startsWith(base))return r.continue();report.external.push(r.request().url());return r.abort();});
  page.on('pageerror',e=>report.errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)report.failedAssets.push({url:r.url(),status:r.status()});});
  await page.addInitScript(()=>{
   window.__devices=0;window.__scrollCalls=0;
   const original=HTMLElement.prototype.scrollIntoView;
   HTMLElement.prototype.scrollIntoView=function(...args){window.__scrollCalls++;return original.apply(this,args);};
   window.__center=el=>original.call(el,{block:'center',behavior:'instant'});
   if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia=()=>{window.__devices++;throw new Error('Forbidden microphone access');};
  });
  await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
  const advance=async ms=>{await page.clock.runFor(ms);await page.waitForTimeout(50);};
  const checks=[];
  for(const id of ids){
   const figure=page.locator('#'+id+'-motion-demo'),stage=figure.locator('.feature-stage');
   await stage.evaluate(el=>window.__center(el));await advance(60);
   await figure.locator('.feature-transport button').last().evaluate(el=>el.click());await advance(1100);
   assert.equal(await stage.getAttribute('data-playing'),'true');
   assert.equal(await figure.locator('.op-corner-label').count(),1);
   for(const animation of await figure.locator('.pv-opening').evaluate(el=>el.getAnimations({subtree:true}).length?['exists']:[]))assert(animation);
   // CSS animations use their own compositor clock; set a captured phase explicitly.
   await figure.locator('.pv-opening').evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>a.currentTime=1100));
   if(width===1440||width===390)await page.screenshot({path:`${out}/concept-${id}-${width}.png`});
   await advance(1300);await figure.locator('.pv-opening').evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>a.currentTime=2500));
   const title=await figure.locator('.op-title strong').innerText();assert(title.replace(/\s/g,'').length>3);
   if(width===1440||width===390)await page.screenshot({path:`${out}/title-${id}-${width}.png`});
   await advance(1500);assert.equal(await figure.locator('.pv-opening').count(),0);
   const count=await figure.locator('.feature-chapters button').count();
   for(let index=0;index<count;index++){
    const before=await page.evaluate(()=>scrollY);
    await figure.locator('.feature-chapters button').nth(index).evaluate(el=>el.click());
    assert.equal(await page.evaluate(()=>scrollY),before,'chapter selection does not scroll');
    const wait=id==='aine'&&index===1?18100:id==='bookvoice'&&index===1?7600:id==='bookvoice'&&index===0?5300:id==='bookvoice'&&index===2?4700:id==='babylog'&&index===0?6500:id==='babylog'&&index===1?6700:id==='micbridge'&&index===3?10800:7300;
    await advance(wait);
    assert.equal(await stage.getAttribute('data-scene'),String(index));
    assert.equal(await page.locator('.feature-stage[data-playing=true]').count(),1);
    if(id==='aine'&&index===1){
     assert.equal(await figure.locator('.aine-mini-call').count(),1);
     assert.equal(await figure.locator('.aine-photo-preview img').count(),1);
     assert((await figure.locator('.aine-mini-call').innerText()).includes('通話中'));
     assert.equal(await figure.locator('img[src*="sora-outing"]').evaluate(el=>el.complete&&el.naturalWidth>0),true);
     if(width===1440||width===390)await page.screenshot({path:`${out}/aine-call-photo-${width}.png`});
     await advance(2200);assert.equal(await figure.locator('.aine-photo-lightbox').count(),1);
     if(width===1440||width===390)await page.screenshot({path:`${out}/aine-photo-expanded-${width}.png`});
    }
    if(id==='bookvoice')assert.equal(await figure.locator('.book-native-scene img').evaluate(el=>el.complete&&el.naturalWidth>0),true);
    if(id==='micbridge'&&index===3){assert.equal(await figure.locator('.route-virtual-mic.is-connected').count(),1);assert((await stage.innerText()).includes('選んだ声'));}
    await figure.locator('.feature-transport button').first().evaluate(el=>el.click());
    const stopped=await stage.getAttribute('data-elapsed');await advance(300);assert.equal(await stage.getAttribute('data-elapsed'),stopped);
    const pausedY=await page.evaluate(()=>scrollY);await page.evaluate(()=>scrollBy(0,3));await advance(80);assert.equal(await stage.getAttribute('data-playing'),'false');
    assert(Math.abs((await page.evaluate(()=>scrollY))-pausedY)<=4);
    if(width===1440||width===390)await page.screenshot({path:`${out}/scene-${id}-${index}-${width}.png`});
   }
   for(let i=0;i<12;i++)await figure.locator('.feature-transport button').last().evaluate(el=>el.click());
   assert.equal(await figure.locator('.feature-scene').count(),1);
   await figure.locator('.feature-controls').evaluate(el=>window.__center(el));await advance(80);
   const controlsY=await page.evaluate(()=>scrollY);
   await figure.locator('.feature-chapters button').first().evaluate(el=>el.click());await advance(300);
   assert.equal(await page.evaluate(()=>scrollY),controlsY);
   const visible=await stage.evaluate(el=>{const r=el.getBoundingClientRect();return Math.min(r.bottom,innerHeight)-Math.max(r.top,0);});
   if(visible>=100)assert.equal(await stage.getAttribute('data-playing'),'true','manual playback remains visible without moving the page');
   await stage.evaluate(el=>window.__center(el));await advance(100);
   await advance(700);await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
   assert.equal(await stage.getAttribute('data-playing'),'false');
   await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await advance(100);
   await page.evaluate(()=>scrollTo(0,0));await advance(100);assert.equal(await page.locator('.feature-stage[data-playing=true]').count(),0);
   await stage.evaluate(el=>window.__center(el));await advance(100);assert(Number(await stage.getAttribute('data-elapsed'))<500);
   // Keep the actual browser's scroll position under the user's control on completion.
   await figure.locator('.feature-chapters button').last().evaluate(el=>el.click());
   const remaining=Number(await stage.getAttribute('data-duration'))-Number(await stage.getAttribute('data-elapsed'));
   const completionY=await page.evaluate(()=>scrollY);await advance(remaining+100);
   assert.equal(await stage.getAttribute('data-playing'),'false');assert.equal(await page.evaluate(()=>scrollY),completionY);
   checks.push({id,chapters:count,openingTitle:title,manualPause:true,repeatedReplay:true,visibility:true,reentry:true,noScroll:true});
   console.log(JSON.stringify({width,id,chapters:count,passed:true}));
  }
  for(let i=0;i<12;i++){await page.locator('#'+ids[i%4]+'-motion-demo .feature-stage').evaluate(el=>window.__center(el));await advance(35);assert((await page.locator('.feature-stage[data-playing=true]').count())<=1);}
  assert.equal(await page.evaluate(()=>window.__scrollCalls),0);
  assert.equal(await page.evaluate(()=>window.__devices),0);assert.equal(await page.evaluate(()=>localStorage.length),0);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.evaluate(()=>scrollTo(0,0));await advance(100);
  await page.locator('.nu-button').click();assert.equal(await page.locator('.nu-particle').count(),28);
  const particleInfo=await page.locator('.nu-particle').evaluateAll(els=>els.map(el=>{const a=el.getAnimations()[0],timing=a.effect.getTiming();a.currentTime=Number(timing.duration)*.38;return {size:parseFloat(getComputedStyle(el).fontSize),color:getComputedStyle(el).color,duration:timing.duration,delay:timing.delay,path:JSON.stringify(a.effect.getKeyframes())};}));
  assert(new Set(particleInfo.map(p=>p.path)).size===28);assert(new Set(particleInfo.map(p=>p.duration)).size>20);assert(Math.max(...particleInfo.map(p=>p.size))-Math.min(...particleInfo.map(p=>p.size))>17);
  assert.equal(await page.locator('.nu-confetti').evaluate(el=>el.parentElement===document.body&&getComputedStyle(el).position==='fixed'&&getComputedStyle(el).pointerEvents==='none'),true);
  if(width===1440||width===390)await page.screenshot({path:`${out}/nu-whole-viewport-${width}.png`});
  for(let i=0;i<7;i++)await page.locator('.nu-button').click();
  assert((await page.locator('.nu-particle').count())<=72);
  const finish=async()=>{await page.locator('.nu-particle').evaluateAll(els=>els.forEach(el=>el.getAnimations().forEach(a=>a.finish())));await page.waitForTimeout(100);};
  await finish();assert.equal(await page.locator('.nu-particle').count(),0);
  await page.locator('.nu-button').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.nu-particle').count(),28);await finish();
  await advance(2000);await page.locator('.thank-you-finale').evaluate(el=>window.__center(el));await advance(100);await advance(900);
  assert.equal(await page.locator('.nu-particle').count(),42);assert(await page.locator('.thank-you-finale').innerText().then(s=>s.includes('ここまで見てくれて')));
  assert(await page.evaluate(()=>document.fonts.check('24px "Yumeko Thanks"')));
  if(width===1440||width===390)await page.screenshot({path:`${out}/thank-you-${width}.png`});
  await finish();await page.evaluate(()=>scrollTo(0,0));await advance(100);await page.locator('.thank-you-finale').evaluate(el=>window.__center(el));await advance(100);
  assert.equal(await page.locator('.nu-particle').count(),0,'footer does not burst repeatedly');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  report.widths.push({width,checks,nu:{uniquePaths:28,maxParticles:72,cleanup:true,keyboard:true,footerOnce:true},overflow:false});
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await page.goto(base,{waitUntil:'networkidle'});
 for(const id of ids){const figure=page.locator('#'+id+'-motion-demo');await figure.scrollIntoViewIfNeeded();assert.equal(await figure.locator('.feature-stage').getAttribute('data-playing'),'false');assert.equal(await figure.locator('.pv-opening').count(),0);await figure.locator('.feature-chapters button').last().evaluate(el=>el.click());assert.equal(await figure.locator('.feature-stage').getAttribute('data-playing'),'false');report.reduced.push(id);}
 await page.locator('.nu-button').click();assert.equal(await page.locator('.nu-particle').count(),0);assert.equal(await page.locator('.nu-pop').innerText(),'＼ぬ／');
 await page.locator('.thank-you-finale').scrollIntoViewIfNeeded();await page.screenshot({path:out+'/reduced-footer.png'});
 assert.equal(report.errors.length,0);assert.equal(report.external.length,0);assert.equal(report.failedAssets.length,0);
}finally{await browser.close();writeFileSync(out+'/verification.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify(report));
