import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const { chromium } = await import('../work/qa/node_modules/playwright/index.mjs');
const out = resolve('outputs/review');
mkdirSync(out, { recursive: true });
const url = 'http://127.0.0.1:4382/yumeko-anime-teaser/';
const browser = await chromium.launch({ executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true });
const report = { widths:[], media:[], before:null, errors:[] };
try {
  if (process.env.CAPTURE_PUBLIC_BASELINE === '1') {
  const before = await browser.newPage({ viewport:{width:1440,height:1000} });
  await before.route('**/*', route => route.request().url().startsWith('https://blackbeatbeast.github.io/yumeko-anime-teaser/') ? route.continue() : route.abort());
  try {
    await before.goto('https://blackbeatbeast.github.io/yumeko-anime-teaser/', {waitUntil:'networkidle',timeout:15000});
    await before.screenshot({path:resolve(out,'before-desktop.png')});
    await before.setViewportSize({width:390,height:844});
    await before.screenshot({path:resolve(out,'before-mobile.png')});
    report.before = 'Live public GitHub Pages captured.';
  } catch (error) { report.before = `Public baseline unavailable: ${error.message.split('\n')[0]}`; }
  await before.close();
  } else report.before = 'Earlier captured public baseline retained in outputs/review/before-*.png.';

  for (const width of [1440,768,390,320]) {
    const page = await browser.newPage({viewport:{width,height:width>700?1000:844}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if(response.status()>=400) errors.push(`${response.status()} ${response.url()}`); });
    await page.route('**/*', route => route.request().url().startsWith('http://127.0.0.1:4382/') ? route.continue() : route.abort());
    await page.goto(url,{waitUntil:'networkidle'});
    await page.waitForTimeout(700);
    await page.evaluate(async()=>{
      document.documentElement.style.scrollBehavior='auto';
      for(let y=0;y<document.documentElement.scrollHeight;y+=600){scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,70))}
      await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));
      scrollTo(0,0);
    });
    await page.waitForTimeout(300);
    assert.equal(await page.locator('article.project').count(),4);
    assert.equal(await page.locator('video').count(),4);
    assert.equal(await page.locator('h1').count(),1);
    const geometry = await page.evaluate(() => ({viewport:innerWidth,document:document.documentElement.scrollWidth,heroTitle:document.querySelector('h1').getBoundingClientRect().toJSON(),heroArt:document.querySelector('.portrait-frame').getBoundingClientRect().toJSON()}));
    assert(geometry.document<=width+1,`Horizontal overflow at ${width}: ${geometry.document}`);
    await page.screenshot({path:resolve(out,`after-${width}.png`),fullPage:true});
    await page.screenshot({path:resolve(out,`hero-${width}.png`)});
    await page.locator('#bookvoice').screenshot({path:resolve(out,`bookvoice-${width}.png`)});
    await page.locator('#journey').screenshot({path:resolve(out,`journey-${width}.png`)});
    const nuButton=page.getByRole('button',{name:'カラフルな、ぬを飛ばす'});
    await nuButton.click();
    await assert.doesNotReject(()=>page.locator('output').filter({hasText:'＼ぬ／'}).waitFor());
    assert(await page.locator('.nu-confetti span').count()>0);
    assert(await page.locator('.nu-confetti').evaluate(el=>getComputedStyle(el).pointerEvents==='none'));
    assert.equal(await page.locator('.nu-confetti span').first().innerText(),'＼ぬ／');
    if (width===1440) {
      await page.waitForTimeout(1450);
      await page.screenshot({path:resolve(out,'nu-confetti-desktop.png')});
      for(let click=0;click<16;click++)await nuButton.click();
      assert(await page.locator('.nu-confetti span').count()<=72);
      const colors=await page.locator('.nu-confetti span').evaluateAll(items=>new Set(items.map(el=>getComputedStyle(el).color)).size);
      assert(colors>=5);
      await page.waitForTimeout(5300);
      assert.equal(await page.locator('.nu-confetti span').count(),0);
      await nuButton.focus();await page.keyboard.press('Enter');
      assert(await page.locator('.nu-confetti span').count()>0);
    } else if (width===390) {
      await page.waitForTimeout(1450);
      await page.screenshot({path:resolve(out,'nu-confetti-mobile.png')});
    }
    const summary = page.locator('.demo-transcript summary').first();
    await summary.focus(); await page.keyboard.press('Enter');
    assert(await summary.evaluate(el=>el.parentElement.open));
    await page.getByRole('link',{name:'つくったもの',exact:true}).click();
    await page.waitForTimeout(800);
    assert.equal(new URL(page.url()).hash,'#works');
    report.widths.push({width,geometry,errors});
    report.errors.push(...errors);
    if(width===1440) {
      for(const id of ['bookvoice','aine','babylog','micbridge']) {
        const video=page.locator(`#${id} video`);
        await video.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
        await page.waitForTimeout(200);
        await video.evaluate(async el=>{await el.play()});
        await page.waitForTimeout(300);
        const state=await video.evaluate(el=>({id:el.closest('article').id,duration:el.duration,currentTime:el.currentTime,error:el.error?.code,controls:el.controls,playsInline:el.playsInline,width:el.videoWidth,height:el.videoHeight,hasAudio:el.mozHasAudio||el.webkitAudioDecodedByteCount>0,track:el.textTracks[0]?.language}));
        assert(!state.error); assert(state.duration>12&&state.duration<14); assert(state.controls&&state.playsInline); assert(state.currentTime>0);
        await video.evaluate(async el=>{el.currentTime=8;el.pause();});
        report.media.push(state);
      }
      await page.locator('#bookvoice video').evaluate(el=>el.play());
      await page.locator('#aine video').evaluate(el=>el.play());
      assert(await page.locator('#bookvoice video').evaluate(el=>el.paused));
      await page.locator('#aine video').evaluate(el=>el.pause());
      const response=await page.request.get(`${url}demos/bookvoice.mp4`,{headers:{Range:'bytes=0-255'}});
      assert.equal(response.status(),206);
      assert.equal((await response.body()).length,256);
      const reduced=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
      await reduced.goto(url,{waitUntil:'networkidle'});
      assert(await reduced.locator('video').first().evaluate(el=>el.paused&&!el.autoplay));
      await reduced.getByRole('button',{name:'カラフルな、ぬを飛ばす'}).focus();
      await reduced.keyboard.press('Space');
      assert.equal(await reduced.locator('.nu-confetti span').count(),0);
      assert.equal(await reduced.locator('output').innerText(),'＼ぬ／');
      await reduced.screenshot({path:resolve(out,'reduced-motion.png')});
      await reduced.close();
    }
    await page.close();
  }
  assert.equal(report.errors.length,0);
  console.log(JSON.stringify(report,null,2));
} finally {
  writeFileSync(resolve(out,'verification.json'),JSON.stringify(report,null,2));
  await browser.close();
}
