// Self-contained fictional reconstructions. No original app code, data,
// devices, accounts, API connections or voice files are used.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = resolve('.');
process.env.PLAYWRIGHT_BROWSERS_PATH = resolve('work/browsers');
const { chromium } = await import('../work/qa/node_modules/playwright/index.mjs');
const ffmpeg = require('../work/qa/node_modules/ffmpeg-static');
const output = resolve('public/demos');
mkdirSync(output, { recursive: true });
mkdirSync('work/demo-recordings', { recursive: true });

const stories = {
  bookvoice: {
    name: 'BookVoice', color: '#ffcf3e', theme: 'book',
    captions: ['01  架空の短編を開く', '02  範囲と声を選ぶ', '03  段落ごとの再生をイメージ'],
    body: `<aside><b>READING DESK</b><p class="nav selected">本を読む</p><p class="nav">音声設定</p><div class="voice-label">地の文の声<br><strong>サンプル A</strong></div><div class="voice-label">台詞の声<br><strong>サンプル B</strong></div><small>声は架空の選択肢です</small></aside><section class="paper"><span class="overline">紹介用オリジナル短編 / 1ページ</span><h1>星を届ける郵便屋</h1><p class="line l1">夜の郵便屋は、小さな星をかばんに入れた。</p><p class="line l2">「今日は、どこまで届けようか。」</p><p class="line l3">窓辺の猫が、北の空を指さした。</p><p class="line l4">「あの青い屋根の家まで。」</p><div class="reader-control"><span class="pill">このページ</span><span class="pill">地の文 A ／ 台詞 B</span><strong id="read-state">▶ スタート</strong></div><div class="progress"><i></i></div></section>`,
    stages: ["document.querySelector('.pill').classList.add('active')", "document.querySelector('#read-state').textContent='Ⅱ 再生中のイメージ';document.body.classList.add('reading')"],
  },
  aine: {
    name: 'AINE', color: '#b5a5dd', theme: 'chat',
    captions: ['01  架空の相手と会話を開く', '02  メッセージの流れを再現', '03  別の展開へ分岐するイメージ'],
    body: `<aside><b>AINE</b><div class="person"><span class="avatar">S</span><div><strong>ソラ</strong><small>架空のAIキャラクター</small></div></div><p class="nav selected">星の郵便屋のお話</p><p class="nav">新しい会話</p><p class="nav branch-nav">↳ もうひとつの展開</p></aside><section class="conversation"><header><strong>ソラ</strong><span>メッセージ / 紹介用の台本</span></header><div class="bubble left">小さな星を運ぶ郵便屋。<br>どんな続きにしよう？</div><div class="bubble right incoming">青い屋根の家まで、<br>届けに行こう。</div><div class="bubble left answer">じゃあ、窓辺で待つ猫が<br>道案内をしてくれるのはどう？</div><div class="fork">↳ この会話から、別の展開へ</div><div class="chat-input"><span id="chat-input">続きを考えよう。</span><span class="send">↑</span></div></section>`,
    stages: ["document.body.classList.add('message');document.querySelector('#chat-input').textContent='返答は紹介用の台本です'", "document.body.classList.add('branch')"],
  },
  babylog: {
    name: '育児ログ', color: '#ed9fc3', theme: 'baby',
    captions: ['01  すべて架空の育児記録', '02  ミルクの記録を追加する流れ', '03  時刻順の紙ビューへ'],
    body: `<aside><b>こまめの記録</b><small>架空の名前・日時・記録</small><p class="nav selected">今日</p><p class="nav paper-nav">紙ビュー</p><p class="nav">履歴</p><div class="baby-stamp">✿<br><span>毎日の記録</span></div></aside><section class="baby-content"><div class="baby-top"><h1 id="baby-title">今日の記録</h1><span>架空の一日</span></div><div class="quick-actions"><span>授乳</span><span class="milk">ミルク</span><span>睡眠</span></div><div class="log-table"><div><span>07:10</span><strong>起きた</strong><span>☀</span></div><div><span>07:30</span><strong>授乳</strong><span>左右 各5分</span></div><div class="new-record"><span>09:00</span><strong>ミルク</strong><span>80mL</span></div><div><span>09:30</span><strong>寝た</strong><span>☾</span></div></div><div class="save-note">ミルクを記録しました　↶ 取り消す</div><div class="paper-note">時刻順に、紙の記録表へ。</div></section>`,
    stages: ["document.body.classList.add('saved')", "document.body.classList.add('paper-view');document.querySelector('#baby-title').textContent='紙ビュー';document.querySelector('.paper-nav').classList.add('selected')"],
  },
  micbridge: {
    name: 'IrodoriMicBridge', color: '#ffcf3e', theme: 'mic',
    captions: ['01  デバイス名も架空の例', '02  文字起こしの表示イメージ', '03  生成音声を仮想出力へ'],
    body: `<section class="mic-content"><div class="mic-head"><h1>MIC BRIDGE</h1><span>音声なしの処理イメージ</span></div><div class="device-row"><div><small>INPUT</small><strong>サンプル入力</strong></div><span>→</span><div><small>OUTPUT</small><strong>サンプル仮想出力</strong></div></div><div class="pipeline"><span class="pipe capture">01 マイク</span><b>→</b><span class="pipe text">02 文字起こし</span><b>→</b><span class="pipe voice">03 音声生成</span><b>→</b><span class="pipe out">04 仮想出力</span></div><div class="transcription"><span>認識テキスト / 架空の例</span><p id="mic-text">……</p></div><div class="wave">${Array.from({length:32},(_,i)=>`<i style="--height:${12+(i*17%48)}px;--delay:${i*.04}s"></i>`).join('')}</div><p class="mic-note">IrodoriTTSとの非公式連携ツール</p></section>`,
    stages: ["document.body.classList.add('transcribed');document.querySelector('#mic-text').textContent='今日は、星の郵便屋のお話です。'", "document.body.classList.add('outputting')"],
  },
};

const css = `*{box-sizing:border-box}body{margin:0;background:#fffaf0;color:#29232b;font:600 18px/1.8 'Yu Gothic',Meiryo,sans-serif;width:960px;height:600px;overflow:hidden}h1,p{margin:0}h1{font-size:31px;letter-spacing:-.035em}b,strong{font-weight:800}.top{height:54px;display:flex;justify-content:space-between;align-items:center;padding:0 26px;border-bottom:2px solid #29232b;background:var(--color);font-size:14px}.top b{font:900 21px Arial,sans-serif}.top span{font-size:12px}.app{display:flex;height:464px;border-bottom:2px solid #29232b}.bottom{height:82px;padding:11px 26px;background:#29232b;color:#fffaf0;display:flex;justify-content:space-between;align-items:center}.bottom strong{font-size:20px}.bottom span{display:block;font-size:11px;color:#ffcf3e;letter-spacing:.12em}.steps{display:flex;gap:10px}.steps i{width:23px;height:4px;background:#776370}.steps i.current{background:var(--color)}aside{width:235px;flex-shrink:0;border-right:2px solid #29232b;padding:24px;background:#f5ecf0}aside>b{font-size:14px;letter-spacing:.08em}aside small{display:block;font-size:11px;margin-top:9px}.nav{margin-top:15px;padding:8px 10px;font-size:16px}.nav.selected{background:var(--color);border:1px solid #29232b}.voice-label{font-size:12px;margin-top:27px;border-top:1px solid #baabb6;padding-top:12px}.voice-label strong{font-size:16px}.overline{font-size:11px;color:#78626d}.paper{padding:28px 34px;flex:1}.paper h1{margin:3px 0 23px}.line{font-size:21px;margin-bottom:13px;padding:5px 9px;transition:background .3s}.reader-control{display:flex;align-items:center;gap:9px;font-size:12px;border-top:1px solid #b6a6b0;padding-top:22px;margin-top:25px}.reader-control strong{margin-left:auto;border:1px solid #29232b;padding:5px 9px;background:var(--color)}.pill{border:1px solid #baabb6;padding:5px 8px;transition:background .3s}.pill.active{background:#ffcf3e}.progress{margin-top:15px;height:4px;background:#eee4e9}.progress i{display:block;width:0;height:100%;background:#ed65aa}.reading .progress i{animation:grow 5s linear both}.reading .l1{animation:highlight 1.5s both}.reading .l2{animation:highlight 1.5s 1.5s both}.reading .l3{animation:highlight 1.5s 3s both}.reading .l4{animation:highlight 1.5s 4.5s both}@keyframes grow{to{width:100%}}@keyframes highlight{0%,90%{background:#ffcf3e88}100%{background:transparent}}.person{display:flex;gap:10px;align-items:center;margin-top:25px}.person strong{font-size:18px}.person small{font-size:10px;margin:0}.avatar{background:#b5a5dd;border:1px solid #29232b;width:45px;height:45px;display:grid;place-items:center;border-radius:50%;font:800 23px Arial}.conversation{padding:18px 27px;flex:1;background:#efebf6;position:relative}.conversation header{display:flex;gap:15px;align-items:center;border-bottom:1px solid #c8becd;padding-bottom:13px;margin-bottom:16px}.conversation header>span{font-size:11px}.bubble{font-size:18px;padding:10px 18px;border:1px solid #29232b;border-radius:13px;width:fit-content;box-shadow:2px 2px #29232b;margin-bottom:13px;background:#fffaf0}.bubble.right{margin-left:auto;background:#b5a5dd}.incoming,.answer,.fork,.branch-nav{opacity:0;transform:translateY(10px);transition:opacity .45s,transform .45s}.message .incoming{opacity:1;transform:none}.message .answer{opacity:1;transform:none;transition-delay:1s}.branch .fork,.branch .branch-nav{opacity:1;transform:none}.fork{font-size:12px;text-align:right;padding:5px 10px;border:1px dashed #6b527c}.chat-input{position:absolute;bottom:18px;left:27px;right:27px;display:flex;justify-content:space-between;padding:10px 15px;background:#fffaf0;border:1px solid #29232b;font-size:13px}.send{background:#b5a5dd;padding:0 9px;border:1px solid #29232b}.baby-content{flex:1;padding:28px 34px}.baby-top{display:flex;align-items:center;justify-content:space-between}.baby-top span{font-size:11px}.quick-actions{display:flex;gap:15px;margin:20px 0}.quick-actions span{border:1px solid #29232b;background:#fff;border-radius:50px;padding:7px 27px;font-size:15px}.quick-actions .milk{background:var(--color)}.log-table>div{display:flex;align-items:center;gap:35px;border-bottom:1px solid #d9c6cd;padding:11px 12px;font-size:17px}.log-table>div>span:last-child{margin-left:auto;font-size:13px}.new-record{opacity:.15;transition:background .3s,opacity .3s}.saved .new-record{background:#ed9fc355;opacity:1}.save-note,.paper-note{opacity:0;font-size:13px;background:#ffcf3e;padding:8px 12px;margin-top:14px;transition:opacity .3s}.saved .save-note{opacity:1}.paper-view .save-note{display:none}.paper-view .paper-note{opacity:1}.paper-view .quick-actions{display:none}.paper-view .log-table{margin-top:30px;border:1px solid #29232b;background:#fff}.baby-stamp{text-align:center;font-size:65px;color:#a42e69;margin-top:20px}.baby-stamp span{font-size:12px;display:block}.mic-content{width:100%;background:#2d2b35;color:#fffaf0;padding:30px 38px}.mic-head{display:flex;align-items:center;justify-content:space-between}.mic-head h1{font:900 31px Arial}.mic-head>span{font-size:12px;color:#ffcf3e}.device-row{display:flex;gap:35px;align-items:center;margin-top:23px}.device-row>div{background:#393541;border:1px solid #867586;padding:9px 18px;flex:1}.device-row small{display:block;font:600 9px Arial;letter-spacing:.2em;color:#c9bcc9}.device-row strong{font-size:16px}.pipeline{display:flex;gap:12px;align-items:center;margin-top:26px;font-size:13px}.pipe{border:1px solid #8c798a;padding:7px 10px;flex:1;text-align:center}.pipe.capture{background:#ffcf3e;color:#29232b}.transcribed .text,.outputting .voice,.outputting .out{background:#ffcf3e;color:#29232b;transition:background .4s}.transcription{border:1px solid #867586;margin-top:23px;padding:12px 20px}.transcription>span{font-size:11px;color:#ccbdcc}.transcription p{font-size:24px;margin-top:10px;min-height:45px}.wave{display:flex;align-items:center;justify-content:center;gap:7px;height:55px;margin-top:10px}.wave i{display:block;width:5px;height:5px;background:#ed65aa}.outputting .wave i{animation:wave .8s var(--delay) infinite alternate}@keyframes wave{to{height:var(--height)}}.mic-note{font-size:11px;color:#ccb8c7;text-align:right}`;

function html(id, item) {
  return `<!doctype html><html lang="ja"><meta charset="utf-8"><style>${css}</style><body class="${item.theme}" style="--color:${item.color}"><div class="top"><b>${item.name}</b><span>架空データの再現画面 / 実アプリの録画ではありません</span></div><main class="app">${item.body}</main><footer class="bottom"><div><span>YUMEKO'S CREATION LAB / ${id.toUpperCase()}</span><strong id="caption">${item.captions[0]}</strong></div><div class="steps"><i class="current"></i><i></i><i></i></div></footer><script>window.showStage=n=>{document.querySelector('#caption').textContent=${JSON.stringify(item.captions)}[n];document.querySelectorAll('.steps i').forEach((el,i)=>el.classList.toggle('current',i===n));${item.stages.map((s,i)=>`if(n===${i+1}){${s}}`).join('')}};</script></body></html>`;
}

const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
try {
  for (const [id, item] of Object.entries(stories)) {
    const context = await browser.newContext({ viewport: { width: 960, height: 600 }, deviceScaleFactor: 1, recordVideo: { dir: resolve('work/demo-recordings'), size: { width: 960, height: 600 } } });
    // Block every request: these reconstructions must never connect to an app.
    await context.route('**/*', route => route.abort());
    const page = await context.newPage();
    await page.setContent(html(id, item));
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(4000);
    await page.evaluate(() => window.showStage(1));
    await page.waitForTimeout(2200);
    const poster = resolve('work', `${id}-poster.png`);
    await page.screenshot({ path: poster });
    await page.waitForTimeout(1800);
    await page.evaluate(() => window.showStage(2));
    await page.waitForTimeout(5000);
    const video = page.video();
    await context.close();
    const recorded = await video.path();
    for (const [ext, args] of [
      ['mp4', ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-movflags', '+faststart']],
      ['webm', ['-c:v', 'libvpx-vp9', '-crf', '34', '-b:v', '0']],
    ]) {
      const r = spawnSync(ffmpeg, ['-y', '-i', recorded, '-t', '13', '-an', ...args, resolve(output, `${id}.${ext}`)], { stdio: 'pipe' });
      if (r.status !== 0) throw new Error(r.stderr.toString().slice(-2000));
    }
    const posterResult = spawnSync(ffmpeg, ['-y', '-i', poster, '-frames:v', '1', '-quality', '85', resolve(output, `${id}.webp`)], { stdio: 'pipe' });
    if (posterResult.status !== 0) throw new Error(posterResult.stderr.toString().slice(-2000));
    writeFileSync(resolve(output, `${id}.vtt`), `WEBVTT\n\n00:00.000 --> 00:04.000\n${item.captions[0]}\n\n00:04.000 --> 00:08.000\n${item.captions[1]}\n\n00:08.000 --> 00:13.000\n${item.captions[2]}\n`);
    console.log(`${id}: fictional poster, MP4, WebM and captions generated.`);
  }
} finally { await browser.close(); }
