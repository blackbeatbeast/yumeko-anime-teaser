import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
import {chromium} from '../work/qa/node_modules/playwright/index.mjs';
const base='http://127.0.0.1:4382/yumeko-anime-teaser/',out='outputs/responsive-followup';mkdirSync(out,{recursive:true});
const reducedOnly=process.argv.includes('--reduced-only');
const cases=[... [320,342,375,390,430,540,640,641,700,760,850,1000,1024,1280,1440,1920,2048,2560,3440].map(width=>({width,height:900,zoom:1})),...[[2048,195],[2048,328],[960,320],[1000,320],[1280,360],[1440,360],[640,360],[844,390]].map(([width,height])=>({width,height,zoom:1})),... [1.25,1.5,2].flatMap(zoom=>[1280,1920].map(physical=>({width:Math.floor(physical/zoom),height:Math.floor(900/zoom),zoom,physical})))];
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const report={cases:[],errors:[],failedAssets:[],reduced:false};
const overlaps=(a,b)=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1;
try{
 for(const c of reducedOnly?[]:cases){
  const page=await browser.newPage({viewport:{width:c.width,height:c.height},deviceScaleFactor:c.zoom});await page.clock.install();
  page.on('pageerror',e=>report.errors.push(e.message));page.on('response',r=>{if(r.status()>=400)report.failedAssets.push(r.url());});
  await page.goto(base,{waitUntil:'networkidle'});await page.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';document.querySelector('.hero').getAnimations({subtree:true}).forEach(a=>{if(a.effect.getTiming().iterations!==Infinity)a.finish();});});
  const tick=async ms=>{await page.clock.runFor(ms);await page.waitForTimeout(20);};await tick(100);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert(!overflow,`Horizontal overflow ${JSON.stringify(c)}`);
  const hero=await page.evaluate(()=>{const r=el=>{const x=el.getBoundingClientRect();return {left:x.left,right:x.right,top:x.top,bottom:x.bottom,width:x.width,height:x.height};};return {card:r(document.querySelector('.hero-nu')),label:r(document.querySelector('.scroll-label')),copy:r(document.querySelector('.hero-bottom')),portrait:r(document.querySelector('.portrait-frame'))};});
  assert(!overlaps(hero.card,hero.label),'Hero card overlaps scroll label '+JSON.stringify(c));assert(!overlaps(hero.copy,hero.label),'Hero footer text overlaps '+JSON.stringify(c));assert(!overlaps(hero.portrait,hero.label),'Portrait overlaps scroll label '+JSON.stringify(c));
  assert(hero.label.left>=0&&hero.label.right<=c.width,'Scroll label clipped '+JSON.stringify(c));
  if([641,850,2048].includes(c.width)&&c.zoom===1&&c.height===900)await page.screenshot({path:`${out}/hero-${c.width}.png`});
  await page.locator('.ticker').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));await tick(100);
  const ticker=await page.locator('.ticker').evaluate(el=>{const g=[...el.querySelectorAll('.ticker-group')].map(x=>x.getBoundingClientRect().width);return {width:el.clientWidth,groups:g,repeats:el.querySelector('.ticker-group').children.length};});
  assert(ticker.groups[0]>=c.width&&Math.abs(ticker.groups[0]-ticker.groups[1])<1,'Ticker groups fail to cover width '+JSON.stringify(c));
  for(const phase of [0,.25,.5,.75,.999]){
   const gaps=await page.locator('.ticker').evaluate((el,phase)=>{const a=el.firstElementChild.getAnimations()[0];a.pause();a.currentTime=Number(a.effect.getTiming().duration)*phase;const intervals=[];for(const unit of el.querySelectorAll('.ticker-unit')){const walker=document.createTreeWalker(unit,NodeFilter.SHOW_TEXT);while(walker.nextNode()){const node=walker.currentNode;if(!node.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(node);for(const r of range.getClientRects())if(r.right>0&&r.left<innerWidth)intervals.push([Math.max(0,r.left),Math.min(innerWidth,r.right)]);}}intervals.sort((a,b)=>a[0]-b[0]);let end=0,max=0;for(const [left,right]of intervals){max=Math.max(max,left-end);end=Math.max(end,right);}return Math.max(max,innerWidth-end);},phase);
   assert(gaps<100,'Wide blank ticker gap '+gaps+' '+JSON.stringify(c));
  }
  if(c.width===2048&&c.height===195)await page.screenshot({path:out+'/ticker-wide-short.png'});
  for(const id of ['bookvoice','aine','babylog','micbridge']){
   const figure=page.locator('#'+id+'-motion-demo');await figure.locator('.feature-stage').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));await tick(100);
   for(let attempt=0;attempt<4&&await figure.locator('.feature-stage').getAttribute('data-playing')!=='true';attempt++)await tick(80);
   if(await figure.locator('.feature-stage').getAttribute('data-playing')!=='true')console.log(JSON.stringify(await page.locator('.feature-stage').evaluateAll(els=>els.map(el=>({demo:el.dataset.demo,playing:el.dataset.playing,rect:el.getBoundingClientRect().toJSON(),height:innerHeight,hidden:document.hidden})))));
   assert.equal(await figure.locator('.feature-stage').getAttribute('data-playing'),'true','Centered autoplay fails '+id+' '+JSON.stringify(c));await figure.locator('.feature-transport button').last().evaluate(el=>el.click());await tick(2450);
   const opening=figure.locator('.pv-opening');await opening.evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>a.currentTime=2500));
   const lines=await opening.locator('.op-title-line').evaluateAll(els=>els.map(el=>({text:el.textContent,rect:el.getBoundingClientRect().toJSON(),parent:el.closest('.pv-opening').getBoundingClientRect().toJSON()})));
   for(const l of lines)assert(l.rect.left>=l.parent.left-1&&l.rect.right<=l.parent.right+1,`Opening title clipped ${id} ${JSON.stringify(c)}`);
   if(id==='babylog'){assert.deepEqual(lines.map(x=>x.text),['育児','ログ']);assert(lines[1].rect.top>lines[0].rect.top);if([320,641,2048].includes(c.width)&&c.zoom===1&&c.height===900)await page.screenshot({path:`${out}/baby-title-${c.width}.png`});}
  }
  assert.equal(await page.locator('.thank-you-finale').getAttribute('data-entered'),'false');
  await page.locator('.thank-you-finale').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));await tick(100);
  for(let attempt=0;attempt<4&&await page.locator('.thank-you-finale').getAttribute('data-entered')!=='true';attempt++)await tick(80);
  assert.equal(await page.locator('.thank-you-finale').getAttribute('data-entered'),'true');
  const entry=await page.locator('.thanks-line').evaluateAll(els=>els.map(el=>{const a=el.getAnimations()[0];if(a)a.currentTime=250;return {animated:Boolean(a),opacity:parseFloat(getComputedStyle(el).opacity)};}));assert(entry.every(x=>x.animated&&x.opacity>0&&x.opacity<1));
  if(c.width===390&&c.height===900)await page.screenshot({path:out+'/thanks-entering-mobile.png'});
  await page.locator('.thank-you-finale').evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>a.finish()));await tick(900);
  const thanks=await page.locator('.thanks-line').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,opacity:parseFloat(getComputedStyle(el).opacity)};}));assert(thanks.every(r=>r.left>=0&&r.right<=c.width&&r.opacity===1));
  assert((await page.locator('.nu-particle').count())<=42);await tick(7300);assert.equal(await page.locator('.nu-particle').count(),0);
  await page.evaluate(()=>scrollTo(0,0));await tick(100);await page.locator('.thank-you-finale').evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));await tick(900);assert.equal(await page.locator('.nu-particle').count(),0);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if([390,2048].includes(c.width)&&c.zoom===1&&[900,328].includes(c.height))await page.screenshot({path:`${out}/footer-${c.width}-${c.height}.png`});
  report.cases.push({...c,ticker,hero,passed:true});console.log(JSON.stringify({...c,passed:true}));await page.close();
 }
 const page=await browser.newPage({viewport:{width:320,height:360},reducedMotion:'reduce'});await page.goto(base,{waitUntil:'networkidle'});await page.locator('.thank-you-finale').scrollIntoViewIfNeeded();
 assert(await page.locator('.thanks-line').evaluateAll(els=>els.every(el=>getComputedStyle(el).opacity==='1'&&el.getAnimations().length===0)));assert.equal(await page.locator('.ticker-track').evaluate(el=>el.getAnimations().length),0);assert.equal(await page.locator('.nu-particle').count(),0);report.reduced=true;
 assert.equal(report.errors.length,0);assert.equal(report.failedAssets.length,0);
}finally{await browser.close();writeFileSync(out+'/'+(reducedOnly?'reduced-verification.json':'verification.json'),JSON.stringify(report,null,2));}
console.log(JSON.stringify({cases:report.cases.length,reduced:report.reduced,errors:report.errors.length,failedAssets:report.failedAssets.length}));
