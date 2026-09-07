'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { assetPath } from '@/lib/assets';
import { ArrowDown, ArrowUpRight, ArrowUp, Gamepad2, Sparkles, Smile, Play } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const X_URL = 'https://x.com/Yumeko_TEKKEN';
const YOUTUBE = 'https://www.youtube.com/channel/UClIGEBGSbOybksOzXNYwzWA';
const modes = [
  { id:'game', label:'対戦モード', en:'GAME ON', icon:Gamepad2, image:'/yumeko-hero.png', quote:'俺の見せ場、ここだろ。', text:'いま遊んでいるのは鉄拳8。ファーカムラムとクニミツを使って、今日も対戦へ。勝ちたい気持ちは、ちゃんと本気。', note:'TEKKEN 8 / ファーカムラム・クニミツ', color:'yellow'},
  { id:'daily', label:'日常モード', en:'OOPS, AGAIN.', icon:Smile, image:'/yumeko-reaction.png', quote:'今のは、見なかったことにしろ。', text:'好きなことを呟いて、勝手に自爆。格好よく決めたはずが、気づけば自分で台無しに。そんな日も、まあある。', note:'好きなことを、好きなだけ。', color:'pink'},
  { id:'curious', label:'好奇心モード', en:'WHAT IS THIS?', icon:Sparkles, image:'/yumeko-hero.png', quote:'なにこれ。ちょっと触るわ。', text:'面白そうな技術を見つけると、まず触ってみたくなる。気づけば誰かに話したくなる。新しい遊びは、だいたいそこから。', note:'「ちょっと」が、ちょっとで終わらない。', color:'purple'},
];
const episodes = [
  {num:'01', tag:'GAME', title:'俺の見せ場、\nここだろ。', body:'対戦前の気合は十分。格好よく決める準備もできた。あとは、口が先走らなければ。', image:'/yumeko-hero.png', caption:'勝つ準備だけは、できてる。', detail:'鉄拳8を立ち上げるゆめこ。ファーカムラムか、クニミツか。今日の一戦が始まる、その瞬間——まず飛び出したのは、やたらと強気なひと言だった。'},
  {num:'02', tag:'CURIOSITY', title:'ちょっと触る、\nとは言った。', body:'面白そうな新技術、発見。軽く試すだけのつもりが、いつの間にか説明する側に。', image:'/yumeko-hero.png', caption:'面白かったら、黙ってられない。', detail:'「これ、ちょっと見て」。軽い気持ちで触ったはずの新技術。できることを一つ発見するたび、話したいことが増えていく。で、何を作るつもりだったっけ。'},
  {num:'03', tag:'EVERYDAY', title:'じゃ、\nもう一戦。', body:'失敗した。笑った。ちょっと悔しい。それでも、一緒に遊ぶ時間はやっぱり楽しい。', image:'/yumeko-reaction.png', caption:'まだ終わるには、早いだろ。', detail:'今日はここまで、と言ったはずなのに。誰かのひと言で、もう一度始まる対戦。格好よくはいかなくても、また遊びたくなる。ゆめこの日常は、そんな一戦のつづき。'},
];
function External({href,children,className=''}:{href:string;children:React.ReactNode;className?:string}){return <a href={href} target="_blank" rel="noreferrer" className={className}>{children}<ArrowUpRight size={19} aria-label="新しいタブで開く"/></a>}
export default function Home(){
 const [nu,setNu]=useState(0);
 const timeout = useRef<ReturnType<typeof setTimeout>|null>(null);
 const [nuVisible,setNuVisible]=useState(false);
 function sayNu(){setNu(n=>n+1);setNuVisible(true);if(timeout.current)clearTimeout(timeout.current);timeout.current=setTimeout(()=>setNuVisible(false),1600)}
 useEffect(()=>()=>{if(timeout.current)clearTimeout(timeout.current)},[]);
 return <>
 <a href="#main" className="skip-link">本文へ移動</a>
 <header className="site-header">
  <a className="wordmark" href="#top" aria-label="ゆめこ トップへ">ゆめこ<span>YUMEKO</span></a>
  <nav aria-label="メインナビゲーション"><a href="#intro">はじめに</a><a href="#character">ゆめこって？</a><a href="#episodes">おはなし</a><a href="#activity">活動記録</a></nav>
  <External href={X_URL} className="header-x">Xをのぞく</External>
 </header>
 <main id="main"><div id="top"/>
 <section className="hero" aria-labelledby="hero-title">
  <div className="hero-meta">YUMEKO&apos;S EVERYDAY CHAOS <span>ANIME CONCEPT / 2026</span></div>
  <div className="hero-copy"><span className="eyebrow">ぬ普及委員長・ゆめこ</span>
   <h1 id="hero-title"><span>ゆめこ、</span><br/>今日も<span className="pink-word">自爆中。</span></h1>
   <p className="hero-tagline">勝ちたい。遊びたい。<br/>口が先に動く。</p>
   <a className="button dark-button" href="#intro">ゆめこを知る <ArrowDown size={21}/></a>
  </div>
  <div className="hero-art"><div className="sun-disc"/><div className="portrait-frame"><Image unoptimized className="hero-portrait" src={assetPath("/yumeko-hero.png")} width="1254" height="1254" fetchPriority="high" alt="ピンク髪に白い花と黄色いぬの髪飾り。得意げに笑うゆめこ"/><span className="frame-caption">ゆめこ / YUMEKO <span>今日も、通常運転。</span></span></div><span className="speech-bubble">俺の見せ場、<br/>ここだろ。</span><span className="hero-nu" aria-hidden="true">＼ぬ／</span><span className="art-star star-one" aria-hidden="true">✳</span><span className="art-star star-two" aria-hidden="true">✳</span></div>
  <span className="hero-bottom">ゲームも日常も、だいたい全力。</span><a className="scroll-label" href="#intro">SCROLL TO START <ArrowDown size={22}/></a>
 </section>
 <div className="ticker" aria-hidden="true"><div>GAME ON. <span>＼ぬ／</span> OOPS, AGAIN. <span>YUMEKO!</span> ONE MORE ROUND. <span>＼ぬ／</span> GAME ON. <span>YUMEKO!</span></div></div>
 <section className="intro section" id="intro" aria-labelledby="intro-title">
  <div className="intro-heading"><span className="section-kicker">01 / INTRODUCTION</span><h2 id="intro-title">かわいい顔して、<br/><em>今日も騒がしい。</em></h2><div className="intro-icon"><Image unoptimized src={assetPath("/yumeko-icon.png")} width="400" height="400" loading="lazy" alt="いつものゆめこのXアイコン"/><span>いつもの顔で、<br/>いつもの調子。</span></div></div>
  <div className="intro-copy"><span className="tiny-stamp">平常運転</span><p>面白そうなら、まず飛び込む。<br/>鉄拳8も、新しい技術も、気づけば全力。</p><p>思ったことは、だいたい口に出る。<br/>格好よく決めるはずだった今日も、<br/>なぜか自分で台無しに。</p><p className="intro-ending">それでも、みんなと遊べば、<strong>もう一戦。</strong></p><span className="stray-nu" aria-hidden="true">＼ぬ／</span></div>
 </section>
 <section className="character section" id="character" aria-labelledby="char-title">
  <div className="section-top"><div><span className="section-kicker">02 / CHARACTER</span><h2 id="char-title">ゆめこの取扱説明。</h2></div><p className="side-note">見た目はかわいく。<br/>一人称は「俺」。</p></div>
  <Tabs defaultValue="game" className="character-tabs">
   <TabsList className="mode-tabs" aria-label="ゆめこのモード"><>{modes.map(m=><TabsTrigger className="mode-tab" key={m.id} value={m.id}><m.icon size={18}/>{m.label}</TabsTrigger>)}</></TabsList>
   {modes.map(m=><TabsContent key={m.id} value={m.id} className={'character-panel '+m.color}>
    <div className="character-image"><span className="vertical-label">{m.en}</span><Image unoptimized src={assetPath(m.image)} width="1254" height="1254" loading="lazy" alt={m.label+'のゆめこ'}/><span className="portrait-label">ぬ普及委員長</span></div>
    <div className="character-copy"><span className="mode-number">YUMEKO / {m.en}</span><h3>ゆめこ<span>@Yumeko_TEKKEN</span></h3><blockquote>「{m.quote}」</blockquote><p>{m.text}</p><div className="character-note">{m.note}</div></div>
   </TabsContent>)}
  </Tabs><p className="fiction-note">※台詞はアカウントから着想を得た、このサイトのための創作です。</p>
 </section>
 <section className="episodes section" id="episodes" aria-labelledby="episode-title">
  <div className="section-top"><div><span className="section-kicker">03 / EPISODE</span><h2 id="episode-title">こんな毎日、<br className="mobile-break"/>たぶんつづく。</h2></div><p className="side-note">ゲームと日常の、<br/>予告編みたいな三つのおはなし。</p></div>
  <div className="episode-grid">{episodes.map((e,i)=><article className={'episode-card episode-'+i} key={e.num}><div className="episode-visual"><span className="episode-number">#{e.num}</span><Image unoptimized src={assetPath(e.image)} width="1254" height="1254" loading="lazy" alt="" className={i===1?'curiosity-crop':''}/><span className="episode-tag">{e.tag}</span>{i===1&&<span className="episode-nu" aria-hidden="true">＼ぬ／</span>}</div><div className="episode-copy"><span className="episode-caption">{e.caption}</span><h3>{e.title.split('\n').map((line,j)=><span key={j}>{line}<br/></span>)}</h3><p>{e.body}</p><details><summary>おはなしを読む <span>＋</span></summary><p>{e.detail}</p></details></div></article>)}</div><p className="fiction-note">アカウントから着想を得たフィクション。実際の出来事や映像作品の告知ではありません。</p>
 </section>
 <section className="activity section" id="activity" aria-labelledby="activity-title"><div className="section-top"><div><span className="section-kicker">04 / NOW & ARCHIVE</span><h2 id="activity-title">いま遊んでる。<br/>遊んできた。</h2></div><span className="now-label"><i/>NOW PLAYING</span></div>
  <div className="now-game"><div className="game-title"><span>いまの一戦は、ここで。</span><h3>TEKKEN<span>8</span></h3><p>鉄拳8</p></div><div className="fighters"><span className="fighter-label">使用キャラクター</span><div><span>01</span><strong>ファーカムラム</strong></div><div><span>02</span><strong>クニミツ</strong></div><small>2026年9月8日時点</small></div></div>
  <div className="archive-heading"><h3>これまでの配信・動画</h3><span>PAST ADVENTURES</span></div>
  <div className="archive-links"><External href="https://www.youtube.com/watch?v=yNjSpsqGJgs" className="archive-row"><span className="archive-play"><Play size={18}/></span><div><span className="archive-category">TEKKEN 7 / 過去の配信</span><h4>PS4鉄拳ランクマ（ファラン）</h4></div></External><External href="https://www.youtube.com/watch?v=lFryKh2P_g0" className="archive-row"><span className="archive-play"><Play size={18}/></span><div><span className="archive-category">NARAKA / 過去の配信</span><h4>NARAKA CN 二人でやってます</h4></div></External></div>
  <div className="archive-footer"><p>NARAKAは、以前遊んでいたゲーム。<br/>あの頃の一戦は、アーカイブに。</p><External href={YOUTUBE} className="text-link">YouTubeですべて見る</External></div>
 </section>
 <footer id="links"><div className="footer-top"><span className="section-kicker">05 / SEE YOU NEXT ROUND</span><h2>じゃ、<span>もう一戦。</span></h2><div className="footer-links"><External className="button dark-button" href={X_URL}>Xでゆめこに会う</External><External className="button light-button" href={YOUTUBE}>YouTubeを見る</External></div></div><div className="footer-bottom"><a className="wordmark" href="#top">ゆめこ<span>YUMEKO</span></a><p>アニメ風コンセプトサイト<br/><span>原案：@Yumeko_TEKKENの発信 / ビジュアル・構成：AIを用いて制作</span></p><a className="back-top" href="#top" aria-label="ページの先頭へ"><ArrowUp size={22}/></a></div></footer>
 </main>
 <div className="nu-widget"><div className={'nu-pop '+(nuVisible?'is-visible':'')} key={nu} aria-live="polite">{nuVisible?'＼ぬ／':''}</div><button className="nu-button" onClick={sayNu} aria-label="ぬ、と言ってみる">ぬ</button></div>
 </>;
}

