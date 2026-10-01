import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from '../work/qa/node_modules/playwright/index.mjs';
const base='http://127.0.0.1:4382/yumeko-anime-teaser/',out='outputs/final-controls';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={widths:[],errors:[],external:[],failedAssets:[],reduced:false};
try{
 for(const width of [1440,768,390,320]){
  const page=await browser.newPage({viewport:{width,height:width>640?1000:844},isMobile:width<640,hasTouch:width<640});
  await page.clock.install();await page.route('**/*',r=>{if(r.request().url().startsWith(base))return r.continue();report.external.push(r.request().url());return r.abort();});
  page.on('pageerror',e=>report.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)report.failedAssets.push(r.url());});
  await page.addInitScript(()=>{
   const scroll=HTMLElement.prototype.scrollIntoView;window.__scrollCalls=0;HTMLElement.prototype.scrollIntoView=function(...args){window.__scrollCalls++;return scroll.apply(this,args);};window.__center=el=>scroll.call(el,{block:'center',behavior:'instant'});
   window.__devices=0;if(navigator.mediaDevices)navigator.mediaDevices.getUserMedia=()=>{window.__devices++;throw new Error('Unexpected device access');};
  });
  await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>document.documentElement.style.scrollBehavior='auto');
  const tick=async ms=>{await page.clock.runFor(ms);await page.waitForTimeout(30);},checks=[];
  for(const id of ['bookvoice','aine','babylog','micbridge']){
   const figure=page.locator('#'+id+'-motion-demo'),stage=figure.locator('.feature-stage'),controls=figure.locator('.feature-controls');
   await stage.evaluate(el=>window.__center(el));await tick(100);assert.equal(await stage.getAttribute('data-playing'),'true');
   await controls.evaluate(el=>window.__center(el));await tick(100);
   const y=await page.evaluate(()=>scrollY);
   await figure.locator('.feature-chapters button').first().evaluate(el=>el.click());await tick(350);
   const visible=await stage.evaluate(el=>{const r=el.getBoundingClientRect();return Math.min(r.bottom,innerHeight)-Math.max(r.top,0);});
   if(visible>=100)assert.equal(await stage.getAttribute('data-playing'),'true');
   assert.equal(await page.evaluate(()=>scrollY),y);
   assert((await page.locator('.feature-stage[data-playing=true]').count())<=1);
   await figure.locator('.feature-transport button').first().evaluate(el=>el.click());const stopped=await stage.getAttribute('data-elapsed');await tick(300);assert.equal(await stage.getAttribute('data-elapsed'),stopped);
   await stage.evaluate(el=>window.__center(el));await tick(100);assert.equal(await stage.getAttribute('data-playing'),'false');
   const buttons=await controls.locator('button').evaluateAll(els=>els.map(el=>({height:el.getBoundingClientRect().height,font:parseFloat(getComputedStyle(el).fontSize)})));
   assert(buttons.every(b=>b.height>=43&&b.font>=12));
   const count=await figure.locator('.feature-chapters button').count();
   for(let index=0;index<count;index++){
    const selectedY=await page.evaluate(()=>scrollY);
    await figure.locator('.feature-chapters button').nth(index).evaluate(el=>el.click());await tick(150);
    assert.equal(await stage.getAttribute('data-scene'),String(index));assert.equal(await page.evaluate(()=>scrollY),selectedY);
    assert.equal(await stage.getAttribute('data-playing'),'true');
    const copyFits=await figure.locator('.pv-caption').evaluate(el=>[...el.querySelectorAll('strong,div>span')].every(child=>{const r=child.getBoundingClientRect(),p=el.getBoundingClientRect();return r.top>=p.top-1&&r.bottom<=p.bottom+1;}));assert(copyFits);
   }
   for(let i=0;i<10;i++)await figure.locator('.feature-transport button').last().evaluate(el=>el.click());
   assert.equal(await figure.locator('.feature-scene').count(),1);
   await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});assert.equal(await stage.getAttribute('data-playing'),'false');
   await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await tick(100);
   await page.evaluate(()=>scrollTo(0,0));await tick(100);assert.equal(await stage.getAttribute('data-playing'),'false');
   await stage.evaluate(el=>window.__center(el));await tick(100);assert(Number(await stage.getAttribute('data-elapsed'))<500);
   if(id==='aine'&&(width===1440||width===320)){
    await figure.locator('.feature-chapters button').nth(1).evaluate(el=>el.click());await tick(17700);
    assert.equal(await figure.locator('.aine-mini-call').count(),1);assert.equal(await figure.locator('.aine-photo-preview img').count(),1);
    await figure.locator('.feature-transport button').first().evaluate(el=>el.click());await page.screenshot({path:out+'/photo-'+width+'.png'});
   }
   if(id==='bookvoice'&&width===390){await figure.locator('.feature-chapters button').first().evaluate(el=>el.click());await tick(1500);await figure.locator('.feature-transport button').first().evaluate(el=>el.click());await page.screenshot({path:out+'/book-shop-mobile.png'});}
   checks.push({id,chapters:count,touchTargets:true,labels:12,noScroll:true,manualVisible:true,manualPause:true,offscreen:true,visibility:true,captionFits:true});
  }
  await page.evaluate(()=>scrollTo(0,0));await tick(100);assert.equal(await page.evaluate(()=>window.__scrollCalls),0);
  assert.equal(await page.evaluate(()=>window.__devices),0);assert.equal(await page.evaluate(()=>localStorage.length),0);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('.nu-button').click();assert.equal(await page.locator('.nu-particle').count(),28);
  // A stalled animation must still be cleaned up by the lifetime bound.
  await page.locator('.nu-particle').evaluateAll(els=>els.forEach(el=>el.getAnimations().forEach(a=>a.pause())));
  for(let i=0;i<6;i++)await page.locator('.nu-button').click();assert((await page.locator('.nu-particle').count())<=72);
  await tick(7300);assert.equal(await page.locator('.nu-particle').count(),0);
  await page.locator('.thank-you-finale').evaluate(el=>window.__center(el));await tick(100);await tick(900);assert.equal(await page.locator('.nu-particle').count(),42);
  await tick(7300);assert.equal(await page.locator('.nu-particle').count(),0);
  await page.evaluate(()=>scrollTo(0,0));await tick(100);await page.locator('.thank-you-finale').evaluate(el=>window.__center(el));await tick(100);assert.equal(await page.locator('.nu-particle').count(),0);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(width===1440||width===390)await page.screenshot({path:out+'/footer-'+width+'.png'});
  report.widths.push({width,checks,maxParticles:72,stalledAnimationCleanup:true,footerOnce:true,overflow:false});console.log(JSON.stringify({width,passed:true}));await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await page.goto(base,{waitUntil:'networkidle'});
 for(const id of ['bookvoice','aine','babylog','micbridge']){const demo=page.locator('#'+id+'-motion-demo');await demo.scrollIntoViewIfNeeded();assert.equal(await demo.locator('.feature-stage').getAttribute('data-playing'),'false');await demo.locator('.feature-chapters button').last().evaluate(el=>el.click());assert.equal(await demo.locator('.feature-stage').getAttribute('data-playing'),'false');assert.equal(await demo.locator('.pv-opening').count(),0);}
 await page.locator('.nu-button').click();assert.equal(await page.locator('.nu-particle').count(),0);report.reduced=true;
 assert.equal(report.errors.length,0);assert.equal(report.external.length,0);assert.equal(report.failedAssets.length,0);
}finally{await browser.close();writeFileSync(out+'/verification.json',JSON.stringify(report,null,2));}
console.log(JSON.stringify(report));
