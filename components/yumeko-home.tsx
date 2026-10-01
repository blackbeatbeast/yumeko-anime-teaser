'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUp, ArrowUpRight, BookOpen, MessageCircle, Baby, Mic, Sparkles, Code2 } from 'lucide-react';
import { assetPath } from '@/lib/assets';
import { registerDemoPlayback } from '@/lib/demo-playback';
import AineMotionDemo from '@/components/aine-motion-demo';
import { BabyMotionDemo, MicMotionDemo } from '@/components/app-feature-demos';

const X_URL = 'https://x.com/Yumeko_TEKKEN';
const projects = [
  {
    id: 'bookvoice', number: '01', name: 'BookVoice', category: '本読み上げソフト', english: 'READ IT. HEAR IT.',
    headline: <>読む時間に、<br />聴く選択肢を。</>,
    description: '本の文章を、段落ごとに声へ。地の文と台詞の声を分けながら、読書を耳でも楽しむためのWindowsアプリ。',
    features: ['段落ごとの連続再生', '地の文・台詞の声分け', '読み上げ範囲の指定'],
    status: '開発ベータ', icon: BookOpen, color: 'yellow',
    note: 'PC向けの開発ベータ。iPhone連携は開発・検証中で、長時間再生などの確認が残っています。',
    scenes: ["本の本文を開く。","ページ範囲から1〜3ページを指定する。","声の設定で台詞の話者を選ぶ。"],
    captureNote: '本文表示領域だけを紹介用の短編に差し替えています。操作パネルは実際のUIです。',
    screenRatio: '8 / 5',
  },
  {
    id: 'aine', number: '02', name: 'AINE', category: 'AIメッセンジャー', english: 'A CONVERSATION CONTINUES.',
    headline: <>文字でも、声でも。<br />AIとの会話を。</>,
    description: '相手と会話を選び、メッセージや音声通話でAIと話す。会話を整理したり、途中から別の展開へ分岐させたり。',
    features: ['AIとのメッセージ・音声通話', '会話の整理', '会話の途中から分岐'],
    status: 'Windowsアプリ', icon: MessageCircle, color: 'purple',
    note: '',
    scenes: ["ソラとの会話を開く。","入力欄に文章を書く。","送信した文章への返答を読む。"],
    captureNote: '実際のUIを使い、会話は架空の相手と台本で作っています。AI接続・音声通話は含みません。',
    screenRatio: '8 / 5',
  },
  {
    id: 'babylog', number: '03', name: '育児ログ', category: '記録・紙への書き写し', english: 'SMALL RECORDS. EVERY DAY.',
    headline: <>片手で残して、<br />紙へ、すっと。</>,
    description: '授乳、ミルク、睡眠などをスマホで記録。時刻順の紙ビューで、あとから記録表へ書き写しやすくするPWA。',
    features: ['スマホで記録', '保存直後の取り消し', '紙ビュー・印刷'],
    status: 'PWA', icon: Baby, color: 'pink',
    note: '',
    scenes: ["今日の記録を表示する。","ミルクの入力画面で80mLを記録する。","紙ビューで記録を一覧する。"],
    captureNote: '実際の確認用UIで架空の記録を入力しています。家族のデータや本番の保存先は使っていません。',
    screenRatio: '22 / 45',
  },
  {
    id: 'micbridge', number: '04', name: 'IrodoriMicBridge', category: 'マイク・音声変換ブリッジ', english: 'YOUR WORDS, ANOTHER VOICE.',
    headline: <>話した言葉を、<br />別の声へつなぐ。</>,
    description: 'Windowsのマイク音声を文字にし、IrodoriTTSで生成した音声を仮想オーディオ出力へ。別アプリのマイク入力へつなぐ連携ツール。',
    features: ['マイク音声の文字起こし', 'テキストから音声生成', '仮想オーディオ出力'],
    status: '公開ソース', icon: Mic, color: 'yellow',
    note: 'IrodoriTTSとの非公式連携ツール。仮想オーディオドライバーは別途必要です。',
    scenes: ["入出力の操作画面を開く。","文章を入力し、Irodori話者を選ぶ。","出力モードをミュートに切り替える。"],
    captureNote: '実際のUI部品だけを描画しています。音声処理・マイク・外部サービスは動かしていません。',
    screenRatio: '4 / 3',
    source: 'https://github.com/blackbeatbeast/IrodoriMicBridge',
  },
];

function External({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} target="_blank" rel="noreferrer" className={className}>{children}<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only">（新しいタブで開く）</span></a>;
}

function DemoVideo({ project }: { project: typeof projects[number] }) {
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sourceFailures = useRef(new Set<string>());
  useEffect(() => {
    if (failed || !videoRef.current) return;
    return registerDemoPlayback(videoRef.current);
  }, [failed]);
  function cannotRead(format: string) {
    sourceFailures.current.add(format);
    if (sourceFailures.current.size === 2) setFailed(true);
  }
  return <figure className={`project-demo ${project.id === 'babylog' ? 'project-demo-phone' : ''}`} style={{ '--screen-ratio': project.screenRatio } as CSSProperties}>
    <div className="demo-chrome"><span><i /><i /><i /></span><span>{project.name}</span><span aria-hidden="true">↗</span></div>
    {failed ? <div className="video-fallback"><Image unoptimized src={assetPath(`/demos/${project.id}.webp`)} alt={`${project.name}の操作画面`} width={project.id === 'babylog' ? 440 : 1200} height={project.id === 'babylog' || project.id === 'micbridge' ? 900 : 750} /><p>動画を再生できませんでした。下の「操作の流れ」から確認できます。</p></div> : <video
      ref={videoRef} controls muted playsInline preload="none" poster={assetPath(`/demos/${project.id}.webp`)}
      aria-label={`${project.name}の操作画面`}
      onError={event => { if (event.currentTarget.error) setFailed(true); }}
      onCanPlay={() => sourceFailures.current.clear()}
    >
      <source src={assetPath(`/demos/${project.id}.mp4`)} type="video/mp4" onError={() => cannotRead('mp4')} />
      <source src={assetPath(`/demos/${project.id}.webm`)} type="video/webm" onError={() => cannotRead('webm')} />
      <track kind="captions" src={assetPath(`/demos/${project.id}.vtt`)} srcLang="ja" label="日本語" />
      このブラウザーは動画に対応していません。下のテキスト説明をご覧ください。
    </video>}
    <div className="demo-stills"><a href={assetPath(`/demos/${project.id}.webp`)} target="_blank" rel="noreferrer">静止画を拡大 <ArrowUpRight size={13} aria-hidden="true" /><span className="sr-only">（新しいタブで開く）</span></a></div>
    <details className="demo-transcript"><summary>操作の流れ</summary><ol>{project.scenes.map((scene, index) => <li key={scene}>{scene}<a className="scene-link" href={assetPath(`/demos/${project.id}-${index + 1}.webp`)} target="_blank" rel="noreferrer">この画面を拡大<span className="sr-only">（新しいタブで開く）</span><ArrowUpRight size={12} aria-hidden="true" /></a></li>)}</ol></details>
  </figure>;
}

function NuWidget() {
  const [nu, setNu] = useState(0);
  const [nuVisible, setNuVisible] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; style: CSSProperties }[]>([]);
  const serial = useRef(0);
  const cleanupTimers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  function sayNu(event: React.MouseEvent<HTMLButtonElement>) {
    setNu(n => n + 1); setNuVisible(true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setNuVisible(false), 1600);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const colors = ['#f16dab', '#ffd34a', '#b79aff', '#7bdfca', '#ff9878', '#fff3bd'];
    const cells = Array.from({ length: 24 }, (_, index) => index);
    for (let index = cells.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [cells[index], cells[other]] = [cells[other], cells[index]];
    }
    // One particle in every cell keeps a single burst spread across the screen.
    // The flight starts at the button; the gentle fall stays inside a fixed layer.
    const batch = cells.map((cell, index) => {
      const margin = width < 640 ? 44 : 62;
      const targetX = margin + (width - margin * 2) * (cell % 6 + Math.random() * .7) / 5.7;
      const targetY = height * (.05 + Math.floor(cell / 6) / 3 * .73 + Math.random() * .1);
      return {
      id: ++serial.current,
      style: {
        left: `${originX}px`, top: `${originY}px`,
        color: colors[index % colors.length],
        '--spread': `${targetX - originX}px`,
        '--rise': `${targetY - originY}px`,
        '--arc': `${height * .06}px`,
        '--fall': `${height - originY + 100}px`,
        '--sway': `${(index % 2 ? -1 : 1) * (12 + Math.random() * Math.min(width * .06, 55))}px`,
        '--turn': `${(Math.random() - .5) * 32}deg`,
        '--duration': `${4.05 + Math.random() * .65}s`,
        '--flutter': `${.8 + Math.random() * .5}s`,
        '--delay': `${index % 6 * .025 + Math.random() * .04}s`,
        fontSize: `${(width < 640 ? 19 : 24) + Math.random() * (width < 640 ? 8 : 16)}px`,
      } as CSSProperties,
    }; });
    setConfetti(previous => [...previous, ...batch].slice(-72));
    const timer = setTimeout(() => {
      const ids = new Set(batch.map(particle => particle.id));
      setConfetti(previous => previous.filter(particle => !ids.has(particle.id)));
      cleanupTimers.current.delete(timer);
    }, 5100);
    cleanupTimers.current.add(timer);
  }
  useEffect(() => {
    const timers = cleanupTimers.current;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const calm = () => { if (media.matches) setConfetti([]); };
    media.addEventListener('change', calm);
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
      timers.forEach(clearTimeout);
      media.removeEventListener('change', calm);
    };
  }, []);
  return <>
    <div className="nu-confetti" aria-hidden="true">{confetti.map(particle => <span key={particle.id} style={particle.style} onAnimationEnd={event => { if (event.target === event.currentTarget) setConfetti(previous => previous.filter(item => item.id !== particle.id)); }}><b>＼ぬ／</b></span>)}</div>
    <div className="nu-widget"><output className={`nu-pop ${nuVisible ? 'is-visible' : ''}`} key={nu}>{nuVisible ? '＼ぬ／' : ''}</output><button type="button" className="nu-button" onClick={sayNu} aria-label="カラフルな、ぬを飛ばす">ぬ</button></div>
  </>;
}

export default function Home() {
  return <>
    <a href="#main" className="skip-link">本文へ移動</a>
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="ゆめこ トップへ">ゆめこ<span>YUMEKO</span></a>
      <nav aria-label="メインナビゲーション"><a href="#works">つくったもの</a><a href="#journey">AIとつくる</a><a href="#about">ゆめこって？</a></nav>
      <External href={X_URL} className="header-x">Xをのぞく</External>
    </header>
    <main id="main"><div id="top" />
      <section className="hero showcase-hero" aria-labelledby="hero-title">
        <div className="hero-meta">YUMEKO&apos;S LITTLE CREATION LAB <span>IDEAS / AI / EVERYDAY</span></div>
        <div className="hero-copy"><span className="eyebrow">ぬ普及委員長・ゆめこの制作室</span>
          <h1 id="hero-title"><span>ゆめこ、</span><br />今日も<span className="pink-word">創作中。</span></h1>
          <p className="hero-tagline">「こんなの欲しい。」<br />そこから、AIとつくってみる。</p>
          <a className="button dark-button" href="#works">つくったものを見る <ArrowDown size={21} aria-hidden="true" /></a>
          <div className="hero-mini-index"><span>SELECTED WORKS</span><span>読書 / 会話 / 記録 / 声</span></div>
        </div>
        <div className="hero-art"><div className="sun-disc" /><div className="portrait-frame"><Image unoptimized className="hero-portrait" src={assetPath('/yumeko-hero.png')} width={1254} height={1254} fetchPriority="high" alt="ピンク髪に白い花と黄色い「ぬ」の髪飾り。得意げに笑うゆめこ" /><span className="frame-caption">ゆめこ / YUMEKO <span>好奇心、通常運転。</span></span></div><span className="speech-bubble">ちょっと欲しい。<br />じゃ、つくるか。</span><span className="hero-nu" aria-hidden="true">＼ぬ／</span><span className="art-star star-one" aria-hidden="true">✦</span><span className="art-star star-two" aria-hidden="true">✧</span></div>
        <span className="hero-bottom">日常の「ちょっと」を、動くものに。</span><a className="scroll-label" href="#works">SCROLL TO WORKS <ArrowDown size={22} aria-hidden="true" /></a>
      </section>
      <div className="ticker" aria-hidden="true"><div>MAKE IT. <span>＼ぬ／</span> TRY IT. <span>YUMEKO!</span> FIX IT. <span>＼ぬ／</span> MAKE IT. <span>YUMEKO!</span></div></div>

      <section className="works-section section" id="works" aria-labelledby="works-title">
        <div className="section-top works-heading"><div><span className="section-kicker">01 / SELECTED WORKS</span><h2 id="works-title">欲しかったから、<br /><span className="marker">つくってみた。</span></h2></div><p className="side-note">本を聴く。AIと話す。<br />記録する。声をつなぐ。<br />日常から生まれた、4つの作品。</p></div>
        <nav className="work-index" aria-label="作品一覧">{projects.map(p => <a key={p.id} href={`#${p.id}`}><span>{p.number}</span><p.icon size={18} aria-hidden="true" />{p.name}<ArrowDown size={15} aria-hidden="true" /></a>)}</nav>
        <div className="project-list">{projects.map(project => <article key={project.id} id={project.id} className={`project project-${project.color}`} aria-labelledby={`${project.id}-title`}>
          <div className="project-copy"><div className="project-meta"><span className="project-number">{project.number}</span><span>{project.category}</span><span className="project-status">{project.status}</span></div>
            <h3 id={`${project.id}-title`}>{project.name}</h3><span className="project-english">{project.english}</span><h4>{project.headline}</h4><p className="project-description">{project.description}</p>
            <ul className="project-features">{project.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
            {project.source && <External href={project.source} className="project-source"><Code2 size={17} aria-hidden="true" />公開ソースを見る</External>}
            {project.note && <p className="project-note">{project.note}</p>}
          </div>{project.id === 'aine' ? <AineMotionDemo /> : project.id === 'babylog' ? <BabyMotionDemo /> : project.id === 'micbridge' ? <MicMotionDemo /> : <DemoVideo project={project} />}
        </article>)}</div>
      </section>

      <section className="journey-section section" id="journey" aria-labelledby="journey-title">
        <div className="section-top"><div><span className="section-kicker">02 / MAKING WITH AI & CODEX</span><h2 id="journey-title">思いつく。つくる。<br /><span>また、直す。</span></h2></div><p className="side-note">完成した画面だけじゃなく、<br />試して直す、その途中も。</p></div>
        <div className="journey-grid">
          <article><span className="journey-number">01</span><Sparkles size={27} aria-hidden="true" /><h3>欲しいを、言葉に。</h3><p>本を声で聴きたい。記録を紙に写しやすくしたい。使う場面から、つくるものを考える。</p><span className="journey-foot">IDEA → A USEFUL SHAPE</span></article>
          <article><span className="journey-number">02</span><Code2 size={27} aria-hidden="true" /><h3>Codexと、形に。</h3><p>画面や機能をAI/Codexと組み立てる。BookVoice、AINE、育児ログ、MicBridgeへ。</p><span className="journey-foot">WORDS → WORKING SOFTWARE</span></article>
          <article><span className="journey-number">03</span><span className="journey-nu" aria-hidden="true">ぬ</span><h3>試して、また直す。</h3><p>声の再生、会話の整理、記録の操作。動かして気づいたことを、次の修正につなげる。</p><span className="journey-foot">TRY → FIX → TRY AGAIN</span></article>
        </div>
        <p className="journey-caption">BookVoiceには、まだ検証中の部分も。つくって、確かめながら進めています。</p>
      </section>

      <section className="about-section section" id="about" aria-labelledby="about-title">
        <div className="about-portrait"><Image unoptimized src={assetPath('/yumeko-reaction.png')} width={1254} height={1254} loading="lazy" alt="少し照れた表情の、ピンク髪のゆめこ" /><span>「ちょっと」が、ちょっとで終わらない。</span></div>
        <div className="about-copy"><span className="section-kicker">03 / ABOUT YUMEKO</span><h2 id="about-title">面白そう。<br />まず、触ってみる。</h2><p>ゆめこの制作室へようこそ。<br />AIやCodexとつくったアプリを、<br />ここに少しずつ並べています。</p><p>読書も、会話も、毎日の記録も。<br />身近な「欲しい」が、作品の入口です。</p><External href={X_URL} className="about-link">@Yumeko_TEKKEN</External></div>
      </section>
      <footer><div className="footer-top"><span className="section-kicker">NEXT IDEA, PLEASE.</span><h2>次は、<span>なにつくる？</span></h2><div className="footer-links"><a className="button dark-button" href="#works">作品をもう一度 <ArrowUp size={20} aria-hidden="true" /></a><External className="button light-button" href={X_URL}>Xでゆめこに会う</External></div></div><div className="footer-bottom"><a className="wordmark" href="#top">ゆめこ<span>YUMEKO</span></a><p>ゆめこ、今日も創作中。<br /><span>AI / Codexとつくる、日常のアプリと制作の記録。</span></p><a className="back-top" href="#top" aria-label="ページの先頭へ"><ArrowUp size={22} /></a></div></footer>
    </main>
    <NuWidget />
  </>;
}
