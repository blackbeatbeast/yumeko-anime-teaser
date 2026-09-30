'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUp, ArrowUpRight, BookOpen, MessageCircle, Baby, Mic, Sparkles, Play, Code2 } from 'lucide-react';
import { assetPath } from '@/lib/assets';

const X_URL = 'https://x.com/Yumeko_TEKKEN';
const projects = [
  {
    id: 'bookvoice', number: '01', name: 'BookVoice', category: '本読み上げソフト', english: 'READ IT. HEAR IT.',
    headline: <>読む時間に、<br />聴く選択肢を。</>,
    description: '本の文章を、段落ごとに声へ。地の文と台詞の声を分けながら、読書を耳でも楽しむためのWindowsアプリ。',
    features: ['段落ごとの連続再生', '地の文・台詞の声分け', '読み上げ範囲の指定'],
    status: '開発ベータ', icon: BookOpen, color: 'yellow',
    note: 'PC向けの開発ベータ。iPhone連携は開発・検証中で、長時間再生などの確認が残っています。',
    scenes: ['架空の短編「星を届ける郵便屋」を表示。', '読む範囲と地の文・台詞の声を選択。', '段落のハイライトで、連続再生の流れを再現。'],
  },
  {
    id: 'aine', number: '02', name: 'AINE', category: 'AIメッセンジャー', english: 'A CONVERSATION CONTINUES.',
    headline: <>文字でも、声でも。<br />AIとの会話を。</>,
    description: '相手と会話を選び、メッセージや音声通話でAIと話す。会話を整理したり、途中から別の展開へ分岐させたり。',
    features: ['AIとのメッセージ・音声通話', '会話の整理', '会話の途中から分岐'],
    status: 'Windowsアプリ', icon: MessageCircle, color: 'purple',
    note: 'AIとの会話を扱うアプリ。動画の返答は紹介用の台本です。音声やAI接続の実演は含みません。',
    scenes: ['架空の相手「ソラ」との会話を開く。', '「星の郵便屋の続きを考えよう」と入力する流れを再現。', '台本の返答を表示し、別の展開への分岐を見せる。'],
  },
  {
    id: 'babylog', number: '03', name: '育児ログ', category: '記録・紙への書き写し', english: 'SMALL RECORDS. EVERY DAY.',
    headline: <>片手で残して、<br />紙へ、すっと。</>,
    description: '授乳、ミルク、睡眠などをスマホで記録。時刻順の紙ビューで、あとから記録表へ書き写しやすくするPWA。',
    features: ['スマホで記録', '保存直後の取り消し', '紙ビュー・印刷'],
    status: 'PWA', icon: Baby, color: 'pink',
    note: '動画の名前・日時・記録はすべて架空。記録を振り返るためのアプリで、医療上の診断や予測は行いません。',
    scenes: ['架空の「こまめ」の記録画面を表示。', 'ミルク80mLの架空記録を追加する流れを再現。', '時刻順の紙ビューへ切り替え、書き写す順番を表示。'],
  },
  {
    id: 'micbridge', number: '04', name: 'IrodoriMicBridge', category: 'マイク・音声変換ブリッジ', english: 'YOUR WORDS, ANOTHER VOICE.',
    headline: <>話した言葉を、<br />別の声へつなぐ。</>,
    description: 'Windowsのマイク音声を文字にし、IrodoriTTSで生成した音声を仮想オーディオ出力へ。別アプリのマイク入力へつなぐ連携ツール。',
    features: ['マイク音声の文字起こし', 'テキストから音声生成', '仮想オーディオ出力'],
    status: '公開ソース', icon: Mic, color: 'yellow',
    note: 'IrodoriTTSとの非公式連携ツール。仮想オーディオドライバーは別途必要です。動画は音声なしの処理イメージです。',
    scenes: ['架空の入力・出力デバイスを表示。', '「今日は、星の郵便屋のお話です。」という文字起こし例を表示。', '文字から音声生成、仮想出力までの処理順を再現。'],
    source: 'https://github.com/blackbeatbeast/IrodoriMicBridge',
  },
];

function External({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return <a href={href} target="_blank" rel="noreferrer" className={className}>{children}<ArrowUpRight size={18} aria-hidden="true" /><span className="sr-only">（新しいタブで開く）</span></a>;
}

function DemoVideo({ project }: { project: typeof projects[number] }) {
  const [failed, setFailed] = useState(false);
  return <figure className="project-demo">
    <div className="demo-chrome"><span><i /><i /><i /></span><span>{project.name} / DEMO SCENE</span><span aria-hidden="true">↗</span></div>
    {failed ? <div className="video-fallback"><Image unoptimized src={assetPath(`/demos/${project.id}.webp`)} alt={`${project.name}の架空データによる再現画面`} width={960} height={600} /><p>動画を再生できませんでした。下の「動画の内容を読む」から確認できます。</p></div> : <video
      controls playsInline preload="none" poster={assetPath(`/demos/${project.id}.webp`)}
      aria-label={`${project.name}：架空データによる操作イメージ。音声なし`}
      onError={() => setFailed(true)}
      onPlay={event => {
        document.querySelectorAll('video').forEach(video => { if (video !== event.currentTarget) video.pause(); });
      }}
    >
      <source src={assetPath(`/demos/${project.id}.mp4`)} type="video/mp4" />
      <source src={assetPath(`/demos/${project.id}.webm`)} type="video/webm" />
      <track kind="captions" src={assetPath(`/demos/${project.id}.vtt`)} srcLang="ja" label="日本語" />
      このブラウザーは動画に対応していません。下のテキスト説明をご覧ください。
    </video>}
    <figcaption><span><Play size={13} aria-hidden="true" /> 操作イメージ</span><span>約13秒・音声なし</span></figcaption>
    <p className="demo-disclosure">架空データの再現画面です。実アプリの録画ではありません。</p>
    <details className="demo-transcript"><summary>動画の内容を読む</summary><ol>{project.scenes.map(scene => <li key={scene}>{scene}</li>)}</ol></details>
  </figure>;
}

export default function Home() {
  const [nu, setNu] = useState(0);
  const [nuVisible, setNuVisible] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  function sayNu() {
    setNu(n => n + 1); setNuVisible(true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setNuVisible(false), 1600);
  }
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);
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
            <p className="project-note">{project.note}</p>
          </div><DemoVideo project={project} />
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
    <div className="nu-widget"><output className={`nu-pop ${nuVisible ? 'is-visible' : ''}`} key={nu}>{nuVisible ? '＼ぬ／' : ''}</output><button type="button" className="nu-button" onClick={sayNu} aria-label="ぬ、と言ってみる">ぬ</button></div>
  </>;
}
