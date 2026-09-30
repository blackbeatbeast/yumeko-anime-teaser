import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const {chromium}=await import('../work/qa/node_modules/playwright/index.mjs');
const url=process.env.SHOWCASE_URL || 'http://127.0.0.1:4382/yumeko-anime-teaser/';
const prefix=process.env.SHOWCASE_URL ? 'public' : 'final';
const output=resolve('outputs/review');mkdirSync(output,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={url,widths:[],reduced:null,assets:[],errors:[]};
try{
 for(const width of [1440,390,320]){
  const page=await browser.newPage({viewport:{width,height:width>640?1000:844}});
  page.on('pageerror',error=>report.errors.push(error.message));
  await page.goto(url,{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(1050);
  await page.screenshot({path:resolve(output,`${prefix}-hero-${width}.png`)});
  const button=page.locator('.nu-button');
  await button.click();await page.waitForTimeout(1450);
  const burst=await page.locator('.nu-confetti>span').evaluateAll(particles=>{
   const rects=particles.map(el=>el.getBoundingClientRect());
   return {count:particles.length,text:particles.every(el=>el.textContent==='＼ぬ／'),
    colors:new Set(particles.map(el=>getComputedStyle(el).color)).size,
    minX:Math.min(...rects.map(r=>r.left)),maxX:Math.max(...rects.map(r=>r.right)),
    minY:Math.min(...rects.map(r=>r.top)),maxY:Math.max(...rects.map(r=>r.bottom))};
  });
  assert.equal(burst.count,24);assert(burst.text);assert.equal(burst.colors,6);
  assert(burst.minX<width*.2 && burst.maxX>width*.8,'Burst spans both sides');
  const height=width>640?1000:844;
  assert(burst.minY<height*.25 && burst.maxY>height*.75,'Burst spans upper and lower screen');
  const overlay=await page.locator('.nu-confetti').evaluate(el=>({position:getComputedStyle(el).position,pointerEvents:getComputedStyle(el).pointerEvents,rect:el.getBoundingClientRect().toJSON()}));
  assert.equal(overlay.position,'fixed');assert.equal(overlay.pointerEvents,'none');
  assert.equal(overlay.rect.width,width);assert.equal(overlay.rect.height,height);
  await page.screenshot({path:resolve(output,`${prefix}-nu-wide-${width}.png`)});
  for(let click=0;click<16;click++)await button.click();
  assert.equal(await page.locator('.nu-confetti>span').count(),72);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.waitForTimeout(5350);
  assert.equal(await page.locator('.nu-confetti>span').count(),0);
  await button.focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('.nu-confetti>span').count(),24);
  await page.waitForTimeout(5350);
  await page.locator('#bookvoice video').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
  await page.waitForFunction(()=>!document.querySelector('#bookvoice video').paused);
  await page.waitForTimeout(350);
  await page.evaluate(()=>{document.activeElement?.blur();document.querySelector('#bookvoice').scrollIntoView({block:'start',behavior:'instant'});});
  await page.screenshot({path:resolve(output,`${prefix}-book-${width}.png`)});
  const type=await page.evaluate(()=>({
   prose:{size:getComputedStyle(document.querySelector('.project-description')).fontSize,line:getComputedStyle(document.querySelector('.project-description')).lineHeight},
   note:getComputedStyle(document.querySelector('.demo-disclosure')).fontSize,
   nuFont:document.fonts.check('400 24px "Yumeko Nu Pop"'),
   fontFaces:[...document.fonts].map(f=>({family:f.family,status:f.status,weight:f.weight}))
  }));
  assert.equal(type.prose.size,'16px');assert.equal(type.note,'12px');assert(type.nuFont);
  assert(type.fontFaces.some(f=>f.family==='Yumeko Nu Pop'&&f.status==='loaded'&&f.weight==='400'));
  report.widths.push({width,burst,overlay,type,repeatedLimit:72,cleanup:0,keyboard:true});
  await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 reduced.on('pageerror',e=>report.errors.push(e.message));
 await reduced.goto(url,{waitUntil:'networkidle'});
 await reduced.locator('.nu-button').focus();await reduced.keyboard.press('Space');
 assert.equal(await reduced.locator('.nu-confetti>span').count(),0);
 assert.equal(await reduced.locator('output').innerText(),'＼ぬ／');
 await reduced.locator('#aine video').evaluate(v=>v.scrollIntoView({block:'center',behavior:'instant'}));
 await reduced.waitForTimeout(300);
 assert(await reduced.locator('video').evaluateAll(v=>v.every(el=>el.paused)));
 report.reduced={particles:0,staticAcknowledgment:true,autoplay:false};
 await reduced.screenshot({path:resolve(output,`${prefix}-reduced-motion.png`)});
 const font=await reduced.request.get(new URL('fonts/yumeko-nu-pop.woff2',url).href);
 assert.equal(font.status(),200);assert.equal((await font.body()).length,1064);
 report.assets.push({path:'fonts/yumeko-nu-pop.woff2',status:font.status(),bytes:1064});
 for(const id of ['bookvoice','aine','babylog','micbridge']){
  for(const extension of ['webp','mp4','webm','vtt']){
   const asset=await reduced.request.get(new URL(`demos/${id}.${extension}`,url).href);
   assert.equal(asset.status(),200);assert((await asset.body()).length>0);
   report.assets.push({path:`demos/${id}.${extension}`,status:asset.status()});
  }
 }
 await reduced.close();assert.equal(report.errors.length,0);
 console.log(JSON.stringify(report));
}finally{writeFileSync(resolve(output,`${prefix}-polish-verification.json`),JSON.stringify(report,null,2));await browser.close();}
