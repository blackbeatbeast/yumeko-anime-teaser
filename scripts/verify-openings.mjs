import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from '../work/qa/node_modules/playwright/index.mjs';
const out='outputs/project-openings';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={widths:[],errors:[],reduced:false};
try{
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:width>640?1000:844},isMobile:width<640,hasTouch:width<640});
  page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto('http://127.0.0.1:4382/yumeko-anime-teaser/',{waitUntil:'networkidle'});
  await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto'});
  const works=[];
  for(const id of ['bookvoice','aine','babylog','micbridge']){
   const demo=page.locator(id==='bookvoice'?'#bookvoice .project-demo':'#'+id+'-motion-demo');
   if(id==='bookvoice'){
    await demo.locator('video').evaluate(el=>{el.pause();el.currentTime=0;el.scrollIntoView({block:'center',behavior:'instant'});});
    await demo.locator('video').evaluate(el=>el.play());
   }else await demo.getByRole('button',{name:/最初から見る$/}).click();
   await page.waitForTimeout(800);
   assert.equal(await demo.locator('.pv-opening:visible').count(),1);
   assert.equal(await page.locator('.feature-stage[data-playing=true]').count()+await page.locator('video').evaluateAll(els=>els.filter(el=>!el.paused).length),1);
   await page.screenshot({path:`${out}/${id}-${width}.png`});
   if(id!=='bookvoice'){
    await demo.getByRole('button',{name:/アニメーションを停止$/}).click();
    const stopped=await demo.locator('.feature-stage').getAttribute('data-elapsed');
    assert.equal(await demo.locator('.pv-opening').evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
    await page.waitForTimeout(250);assert.equal(await demo.locator('.feature-stage').getAttribute('data-elapsed'),stopped);
    await demo.getByRole('button',{name:/アニメーションを再生$/}).click();
   }
   await page.waitForTimeout(1500);
   assert.equal(await demo.locator('.pv-opening:visible').count(),0);
   works.push({id,abstractOpening:true,uiReveal:true});
  }
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  report.widths.push({width,works,overflow:false});await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:4382/yumeko-anime-teaser/',{waitUntil:'networkidle'});
 for(const id of ['aine','babylog','micbridge']){
  const demo=page.locator('#'+id+'-motion-demo');await demo.getByRole('button',{name:/最初から見る$/}).click();
  assert.equal(await demo.locator('.pv-opening:visible').count(),0);
  assert.equal(await demo.locator('.feature-stage').getAttribute('data-playing'),'false');
 }
 assert.equal(await page.locator('video').evaluateAll(els=>els.filter(el=>!el.paused).length),0);
 report.reduced=true;await page.close();assert.equal(report.errors.length,0);
 console.log(JSON.stringify(report));
}finally{writeFileSync(`${out}/verification.json`,JSON.stringify(report,null,2));await browser.close();}
