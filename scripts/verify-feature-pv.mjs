import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { chromium } from '../work/qa/node_modules/playwright/index.mjs';
const out = 'outputs/feature-pv'; mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const report = { widths: [], errors: [], requests: [], devices: 0, reduced: [] };
const ids = ['aine', 'babylog', 'micbridge'];
try {
 const requestedWidths = process.argv.slice(2).map(Number);
 for (const width of requestedWidths.length ? requestedWidths : [1440, 768, 390, 320]) {
  const page = await browser.newPage({ viewport: { width, height: width > 640 ? 1000 : 844 }, isMobile: width < 640, hasTouch: width < 640 });
  await page.clock.install();
  await page.route('**/*', route => route.request().url().startsWith('http://127.0.0.1:4382/') ? route.continue() : route.abort());
  page.on('pageerror', error => report.errors.push(error.message));
  page.on('request', request => report.requests.push(request.url()));
  await page.addInitScript(() => { window.__deviceCalls = 0; if (navigator.mediaDevices) navigator.mediaDevices.getUserMedia = () => { window.__deviceCalls++; return Promise.reject(new Error('Unexpected device call')); }; });
  await page.goto('http://127.0.0.1:4382/yumeko-anime-teaser/', { waitUntil: 'networkidle' });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  const scenes = [];
  for (const id of ids) {
   const demo = page.locator('#' + id + '-motion-demo');
   const stage = demo.locator('.feature-stage');
   const center = () => stage.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
   const clock = async ms => { await page.clock.runFor(ms); await page.waitForTimeout(60); };
   await center(); await clock(100);
   for (let index = 0; index < 3; index++) {
    await demo.locator('.feature-chapters button').nth(index).click();
    await clock(index === 0 && id === 'aine' ? 6500 : index === 1 && id === 'aine' ? 10100 : id === 'babylog' && index === 0 ? 6300 : id === 'babylog' && index === 1 ? 6600 : id === 'micbridge' && index === 0 ? 5300 : id === 'micbridge' && index === 1 ? 6200 : 7300);
    if (await stage.getAttribute('data-playing') !== 'true') {
      const diagnostic = await stage.evaluate(el => ({ dataset: { ...el.dataset }, rect: el.getBoundingClientRect().toJSON(), height: innerHeight, hidden: document.hidden, scroll: scrollY }));
      console.log(JSON.stringify({ width, id, index, diagnostic }));
      await page.screenshot({ path: `${out}/failure-${id}-${index}-${width}.png` });
    }
    assert.equal(await stage.getAttribute('data-playing'), 'true');
    assert.equal(await page.locator('.feature-stage[data-playing=true]').count(), 1);
    assert.equal(await page.locator('video').evaluateAll(videos => videos.filter(video => !video.paused).length), 0);
    await demo.getByRole('button', { name: /アニメーションを停止$/ }).click();
    const stopped = await stage.getAttribute('data-elapsed');
    await page.evaluate(() => scrollBy(0, 5)); await clock(400);
    assert.equal(await stage.getAttribute('data-elapsed'), stopped);
    assert.equal(await demo.locator('.feature-scene').evaluate(el => getComputedStyle(el).animationPlayState), 'paused');
    const sceneText = await stage.innerText();
    if (id === 'aine' && index === 0) assert(sceneText.includes('月の裏側の'));
    if (id === 'aine' && index === 1) { assert(sceneText.includes('通話中')); assert.equal(await demo.locator('.aine-call-ring img').count(), 1); assert.equal(await demo.locator('video').count(), 0); }
    if (id === 'aine' && index === 2) assert(sceneText.includes('星を探す道'));
    if (id === 'babylog' && index === 0) assert(sceneText.includes('ミルクを記録しました'));
    if (id === 'babylog' && index === 1) assert(sceneText.includes('睡眠 50分'));
    if (id === 'babylog' && index === 2) assert(sceneText.includes('育児記録表'));
    if (id === 'micbridge' && index === 0) assert(sceneText.includes('変換音声を出力中'));
    if (id === 'micbridge' && index === 1) assert(sceneText.includes('こんにちは。星の郵便局へ'));
    if (id === 'micbridge' && index === 2) assert(sceneText.includes('5.0'));
    await page.screenshot({ path: `${out}/scene-${id}-${index}-${width}.png` });
    scenes.push({ id, index, pausedAt: stopped });
   }
   for (let repeat = 0; repeat < 9; repeat++) await demo.getByRole('button', { name: /最初から見る$/ }).click();
   assert.equal(await demo.locator('.feature-scene').count(), 1);
   await center(); await clock(700);
   await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
   assert.equal(await stage.getAttribute('data-playing'), 'false');
   await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); }); await clock(100);
   await page.evaluate(() => scrollTo(0, 0)); await clock(100);
   assert.equal(await page.locator('.feature-stage[data-playing=true]').count(), 0);
   const exited = await stage.getAttribute('data-elapsed'); await clock(200); assert.equal(await stage.getAttribute('data-elapsed'), exited);
   await center(); await clock(250); assert(Number(await stage.getAttribute('data-elapsed')) < 900);
   const buttons = await demo.locator('.feature-controls button').evaluateAll(elements => elements.map(el => { const rect = el.getBoundingClientRect(); return { label: el.textContent.trim(), rect: rect.toJSON(), singleLine: rect.height < 50 }; }));
   assert(buttons.every(button => button.singleLine), 'Controls stay horizontal and readable');
  }
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('article.project').count(), 4);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.equal(await page.evaluate(() => localStorage.length), 0);
  assert.equal(await page.evaluate(() => window.__deviceCalls), 0);
  report.widths.push({ width, scenes, pause: true, repeat: true, visibility: true, offscreen: true, onePlayer: true, controls: true, overflow: false });
  await page.close();
 }
 const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
 await page.goto('http://127.0.0.1:4382/yumeko-anime-teaser/', { waitUntil: 'networkidle' });
 for (const id of ids) {
  const demo = page.locator('#' + id + '-motion-demo');
  await demo.locator('.feature-stage').evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  for (let index = 0; index < 3; index++) {
   await demo.locator('.feature-chapters button').nth(index).click();
   assert.equal(await demo.locator('.feature-stage').getAttribute('data-playing'), 'false');
   assert.equal(await demo.locator('.feature-scene').evaluate(el => getComputedStyle(el).animationName), 'none');
   assert.equal(await demo.locator('.pv-pointer:visible').count(), 0);
  }
  await demo.getByRole('button', { name: /次の機能を見る$/ }).click();
  assert.equal(await demo.locator('.feature-stage').getAttribute('data-scene'), '0');
  report.reduced.push({ id, autoplay: false, staticChapters: 3, next: true });
 }
 await page.close();
 assert.equal(report.errors.length, 0);
 assert(report.requests.every(url => url.startsWith('http://127.0.0.1:4382/')));
 report.requests = [...new Set(report.requests)];
 console.log(JSON.stringify({ widths: report.widths.map(item => item.width), scenes: report.widths[0].scenes.length, reduced: report.reduced, errors: report.errors }));
} finally { writeFileSync(`${out}/verification.json`, JSON.stringify(report, null, 2)); await browser.close(); }
