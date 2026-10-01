import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const {chromium}=await import('../work/qa/node_modules/playwright/index.mjs');
const url='http://127.0.0.1:4382/yumeko-anime-teaser/';
const out=resolve('outputs/aine-motion');mkdirSync(out,{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={widths:[],reduced:null,visibility:null,requests:[],errors:[]};
const stage=page=>page.locator('.aine-stage');
const pause=page=>page.getByRole('button',{name:'AINEのアニメーションを停止',exact:true}).click();
const resume=page=>page.getByRole('button',{name:'AINEのアニメーションを再生',exact:true}).click();
const replay=page=>page.getByRole('button',{name:'AINEのアニメーションを最初から見る',exact:true}).click();
const elapsed=page=>stage(page).getAttribute('data-elapsed').then(Number);
async function waitTime(page,time){await page.waitForFunction(time=>Number(document.querySelector('.aine-stage').dataset.elapsed)>=time,time);}
async function center(page){await stage(page).evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));}
async function fresh(options){
 const page=await browser.newPage(options);
 page.on('pageerror',e=>report.errors.push(e.message));
 page.on('request',r=>report.requests.push(r.url()));
 await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:4382/')?route.continue():route.abort());
 await page.goto(url,{waitUntil:'networkidle'});
 await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';});
 return page;
}
try{
 for(const width of [1440,390,320]){
  const page=await fresh({viewport:{width,height:width>640?1000:844},hasTouch:width<640,isMobile:width<640});
  assert.equal(await page.locator('video').count(),3);
  assert.equal(await page.locator('article.project').count(),4);
  assert.equal(await page.locator('.demo-disclosure,.demo-playback-note').count(),0);
  const showcaseText=await page.locator('.project-list').innerText();
  assert(!/架空|台本|REAL UI|13秒/.test(showcaseText));
  await center(page);await waitTime(page,1700);await pause(page);
  const wrote=await page.locator('.aine-input.has-text').innerText();assert(wrote.length>2&&wrote.length<24);
  const stopped=await elapsed(page);await page.waitForTimeout(320);assert.equal(await elapsed(page),stopped);
  assert.equal(await page.locator('.aine-cursor').evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
  const bounds=await stage(page).boundingBox();
  await page.screenshot({path:resolve(out,`typing-${width}.png`)});
  await resume(page);await waitTime(page,4400);await pause(page);
  assert.equal(await page.locator('.aine-outgoing').count(),1);
  assert.equal(await page.locator('.aine-dots').count(),1);
  assert.equal(await page.locator('.aine-input.has-text').count(),0);
  await page.screenshot({path:resolve(out,`sending-${width}.png`)});
  await resume(page);await waitTime(page,6500);await pause(page);
  const partial=await page.locator('.aine-response .aine-bubble').innerText();assert(partial.length>4&&partial.length<43);
  await page.screenshot({path:resolve(out,`reply-${width}.png`)});
  await resume(page);await waitTime(page,11800);
  assert.equal(await stage(page).getAttribute('data-playing'),'false');
  assert((await page.locator('.aine-response .aine-bubble').innerText()).includes('まだ見ぬ友だちへ'));
  assert.equal((await stage(page).boundingBox()).height,bounds.height);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.equal(await page.evaluate(()=>localStorage.length),0);
  await page.screenshot({path:resolve(out,`result-${width}.png`)});
  await page.evaluate(()=>scrollBy(0,8));await page.waitForTimeout(300);
  assert.equal(await stage(page).getAttribute('data-playing'),'false','Complete scene does not loop');
  for(let repeat=0;repeat<8;repeat++)await replay(page);
  assert.equal(await page.locator('.aine-workspace').count(),1);
  assert.equal(await page.locator('.aine-cursor').count(),1);
  await waitTime(page,800);await pause(page);
  const manual=await elapsed(page);await page.evaluate(()=>scrollBy(0,8));await page.waitForTimeout(320);assert.equal(await elapsed(page),manual);
  await resume(page);await waitTime(page,1300);
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(160);
  const exited=await elapsed(page);await page.waitForTimeout(250);assert.equal(await elapsed(page),exited);
  assert.equal(await stage(page).getAttribute('data-playing'),'false');
  await center(page);await page.waitForTimeout(250);assert(await elapsed(page)<900,'Complete exit permits a new visit');
  if(width===1440){
   await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
   await page.waitForTimeout(100);assert.equal(await stage(page).getAttribute('data-playing'),'false');
   await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
   await page.waitForTimeout(120);assert.equal(await stage(page).getAttribute('data-playing'),'true');
   report.visibility='Synthetic visibilitychange: motion paused and resumed';
  }
  for(const id of ['bookvoice','babylog','micbridge']){
   await page.locator('#'+id+' video').evaluate(v=>v.scrollIntoView({block:'center',behavior:'instant'}));
   await page.waitForFunction(id=>!document.querySelector('#'+id+' video').paused,id);
   assert.equal(await stage(page).getAttribute('data-playing'),'false');
   assert.equal(await page.locator('video').evaluateAll(v=>v.filter(el=>!el.paused).length),1);
  }
  await center(page);await page.waitForTimeout(200);
  assert.equal(await page.locator('video').evaluateAll(v=>v.filter(el=>!el.paused).length),0);
  report.widths.push({width,typed:wrote,partialReply:partial,stableHeight:bounds.height,pause:true,replay:true,offscreenPause:true,onePlayer:true,overflow:false});
  await page.close();
 }
 const reduced=await fresh({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await center(reduced);await reduced.waitForTimeout(200);
 assert.equal(await stage(reduced).getAttribute('data-playing'),'false');
 assert.equal(await reduced.locator('.aine-cursor').evaluate(el=>getComputedStyle(el).display),'none');
 assert.equal(await elapsed(reduced),11800);
 await replay(reduced);assert.equal(await elapsed(reduced),0);
 for(const expected of [3300,4800,11800]){
  await reduced.getByRole('button',{name:'AINEの操作を次の場面へ進める',exact:true}).click();
  assert.equal(await elapsed(reduced),expected);
  assert.equal(await stage(reduced).getAttribute('data-playing'),'false');
 }
 await reduced.screenshot({path:resolve(out,'reduced-motion.png')});
 report.reduced={autoplay:false,cursor:false,instantSteps:[3300,4800,11800]};
 await reduced.close();
 assert.equal(report.errors.length,0);
 assert(report.requests.every(request=>request.startsWith('http://127.0.0.1:4382/')));
 report.requests=[...new Set(report.requests)];
 console.log(JSON.stringify(report));
}finally{writeFileSync(resolve(out,'verification.json'),JSON.stringify(report,null,2));await browser.close();}
