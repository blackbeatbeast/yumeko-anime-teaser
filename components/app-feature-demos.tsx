'use client';

import { useEffect, useRef } from 'react';
import { Activity, Baby, BarChart3, ChevronDown, Clock, Droplets, FileText, Mic, MicOff, Milk, Moon, MousePointer2, PenLine, Play, Power, Save, Settings, Sun, Thermometer, X } from 'lucide-react';
import FeatureDemo, { type FeatureState } from './feature-demo';

const babyScenes = [
  { label: '記録', title: '片手で、ひとつ。', detail: '量を選んで、今日の記録に。', duration: 10000 },
  { label: '睡眠・履歴', title: '眠った。起きた。残せた。', detail: 'その日の流れを、すぐ見返す。', duration: 8500 },
  { label: '紙ビュー', title: '紙へ、すっと。', detail: '記録を、そのまま一日の表に。', duration: 8500 },
];
const micScenes = [
  { label: '出力モード', title: '生声も、AIの声も。', detail: '生声・Irodori音声・ミュートを切り替える。', duration: 10000 },
  { label: '文章入力', title: '文字が、別の声に。', detail: '書いたひとことを、マイクへ。', duration: 9500 },
  { label: '表現', title: '声の表情を、選ぶ。', detail: '話し方と、表現の強さを調整。', duration: 8500 },
];

function DemoPointer({ className = '' }: { className?: string }) { return <MousePointer2 className={`pv-pointer ${className}`} size={25} fill="#ed65aa" strokeWidth={1.8} />; }
function BabyNav({ paper }: { paper: boolean }) { return <div className="baby-nav">{[[Activity, '今日'], [FileText, '紙ビュー'], [BarChart3, 'ふり返り'], [Settings, '設定'], [Save, '出力']].map(([Icon, label], i) => {
  const Symbol = Icon as typeof Activity;
  return <span key={i} className={(paper ? i === 1 : i === 0) ? 'is-selected' : ''}><Symbol size={17} /><small>{String(label)}</small></span>;
})}</div>; }
function BabyHome({ time, index }: FeatureState) {
  const home = useRef<HTMLDivElement>(null);
  const saved = index === 0 && time >= 5900;
  const asleep = index === 1 && time >= 1900 && time < 5700;
  const awake = index === 1 && time >= 5700;
  const sheet = index === 0 && time >= 1300 && time < 5900;
  useEffect(() => {
    if (home.current) home.current.scrollTop = saved || awake || asleep ? home.current.scrollHeight : 0;
  }, [saved, awake, asleep]);
  return <div className="baby-ui">
    <div className="baby-app-header"><div><span>BABY PAPER LOG</span><strong>育児ログ</strong><small>ひなた家 / こまめ</small></div><i>オンライン</i></div>
    <div className="baby-home" ref={home}>
      <div className="baby-today"><div><small>9/15（火）</small><strong>生後21日</strong></div><span><Moon size={16} />{asleep ? '睡眠中' : '起きています'}</span></div>
      <div className="baby-quick-grid">{[[Droplets, 'おしっこ', '時刻を選ぶ'], [FileText, 'うんち', '時刻と量'], [Baby, '授乳', '左右5分'], [Milk, 'ミルク', '80ml'], [asleep ? Sun : Moon, asleep ? '起きた' : '寝た', asleep ? '睡眠を終了' : '睡眠を開始']].map(([Icon, title, note], i) => {
        const Symbol = Icon as typeof Activity;
        const selected = index === 0 ? i === 3 && time >= 800 && time < 1700 : i === 4 && ((time > 1100 && time < 2300) || (time > 5100 && time < 6000));
        return <div key={i} className={`baby-quick baby-tone-${i} ${selected ? 'is-tapped' : ''}`}><Symbol size={23} /><strong>{String(title)}</strong><small>{String(note)}</small></div>;
      })}</div>
      <div className="baby-secondary"><span><Thermometer size={20} /><strong>体温</strong><small>数値を記録</small></span><span><PenLine size={20} /><strong>メモ</strong><small>短い補足</small></span></div>
      <div className="baby-summary"><div><small>最後の授乳・ミルク</small><span>授乳 <b>08:30 L5 R5</b></span><span>ミルク <b>{saved || index === 1 ? '09:30 80ml' : 'まだなし'}</b></span></div><div><small>最後のおむつ</small><span>おしっこ <b>08:45</b></span><span>うんち <b>08:45 ◑</b></span></div><div><small>最後の睡眠</small><b>{asleep ? '09:30〜 睡眠中' : awake ? '09:30〜10:20' : '昨夜21:30〜06:30'}</b></div><div><small>今日</small><span>おしっこ 1　うんち 1</span><span>ミルク {saved || index === 1 ? 1 : 0}　睡眠 {awake ? 1 : 0}</span></div></div>
      <div className="baby-recent"><small>日付をまたいで確認</small><strong>直近24時間</strong><div className={'baby-event ' + (saved || awake ? 'is-new' : '')}><time>{awake ? '10:20' : saved || asleep ? '09:30' : '08:45'}</time><i /><span><strong>{awake ? '起きた' : asleep ? '寝た' : saved ? 'ミルク' : 'おしっこ'}</strong><small>{awake ? '睡眠 50分' : asleep ? '睡眠を開始' : saved ? '80ml' : '時刻を記録'}</small></span><PenLine size={14} /></div></div>
    </div><BabyNav paper={false} />
    {sheet && <div className="baby-sheet-backdrop"><div className="baby-record-sheet"><div><span>記録</span><X size={18} /></div><strong>ミルク</strong><div className="baby-time-panel"><small><Clock size={14} />記録する日時</small><b>今日 09:30</b><span>今日　09　:　30 <ChevronDown size={12} /></span></div><h5>ミルク量</h5><div className="baby-chips">{[40, 60, 80, 100, 120, 160].map(amount => <span key={amount} className={(time >= 2800 ? amount === 80 : amount === 120) ? 'is-selected' : ''}>{amount}</span>)}</div><div className="baby-amount">ml <b>{time >= 2800 ? 80 : 120}</b></div><div className="baby-save"><span>やめる</span><span className={time > 5300 ? 'is-tapped' : ''}><Save size={16} />今日 09:30で保存</span></div></div></div>}
    {saved && time < 8500 && <div className="baby-toast"><span>ミルクを記録しました</span><b>元に戻す</b></div>}
    {index === 0 && time > 850 && time < 1300 && <DemoPointer className="baby-milk-pointer" />}
    {sheet && time > 2200 && time < 3100 && <DemoPointer className="baby-amount-pointer" />}
    {sheet && time > 5000 && <DemoPointer className="baby-save-pointer" />}
    {index === 1 && ((time > 1300 && time < 2300) || (time > 5100 && time < 6000)) && <DemoPointer className="baby-sleep-pointer" />}
  </div>;
}
function BabyPaper({ time }: FeatureState) {
  return <div className="baby-ui baby-paper-ui"><div className="baby-paper-heading"><small>紙ビュー</small><strong>育児記録表</strong></div><div className="baby-paper-actions"><span>2026/09/15</span><span>4日表示</span><span>印刷</span></div><div className="baby-paper-card"><strong>9/15（火）</strong><p>こまめ / 生後21日</p><span className="baby-transcribed">□ 書き写し済み</span><div className="baby-paper-totals">{['おしっこ|1|回', 'うんち|1|回', '授乳|1|回', 'ミルク|80|ml', '睡眠|1|回'].map(value => { const [label, number, unit] = value.split('|'); return <span key={label}>{label}<b>{number}</b>{unit}</span>; })}</div><div className="baby-paper-table"><div className="baby-paper-cols"><span>時刻</span><span>おむつ</span><span>睡眠</span><span>授乳・ミルク</span></div>{['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'].map((hour, i) => <div className="baby-paper-row" key={hour}><span>{hour}</span><span>{i === 2 && <i>08:45<br />おしっこ<br />うんち ◑</i>}</span><span>{i === 0 ? <i>06:30<br />↑ 起きた</i> : i === 3 ? <i>09:30<br />↓ 寝た</i> : i === 4 ? <i>10:20<br />↑ 起きた</i> : null}</span><span>{i === 2 ? <i>08:30<br />L5 R5</i> : i === 3 ? <i className={time < 1500 ? 'paper-arrival' : ''}>09:30<br />80ml</i> : null}</span></div>)}</div></div><BabyNav paper />
  </div>;
}
export function BabyMotionDemo() { return <FeatureDemo id="babylog" name="育児ログ" scenes={babyScenes} phone className="baby-stage" description="ミルク量を選んで保存すると履歴と集計に反映される。寝た・起きたを記録して睡眠を見返す。紙ビューで一日の記録表を見る。">{state => state.index < 2 ? <BabyHome {...state} /> : <BabyPaper {...state} />}</FeatureDemo>; }

function Meter({ active, time }: { active: boolean; time: number }) { return <div className="mic-meter">{Array.from({ length: 24 }, (_, i) => <i key={i} className={active && i < 7 + Math.floor((Math.sin(time / 260) + 1) * 5) ? 'lit' : ''} />)}</div>; }
function MicWorkspace({ index, time }: FeatureState) {
  const mode = index === 0 ? time < 2200 ? 'raw' : time < 7100 ? 'tts' : 'mute' : 'tts';
  const typed = 'こんにちは。星の郵便局へ、手紙を届けます。'.slice(0, index === 1 ? Math.max(0, Math.floor((time - 900) / 100)) : 25);
  const playing = index === 0 ? mode === 'tts' && time > 3900 : index === 1 && time >= 5100 && time < 7900;
  const strength = index === 2 ? (time < 3800 ? '3.0' : '5.0') : '3.0';
  const expressive = index === 2 && time > 2300;
  const state = mode === 'mute' ? 'ミュート中' : playing ? '変換音声を出力中' : mode === 'raw' ? '生声モード' : 'Irodori音声モード';
  return <div className={`mic-ui scene-${index}`}>
    <div className="mic-header"><span className="mic-logo">{[12, 23, 30, 19, 26].map((height, i) => <i key={i} style={{ height }} />)}</span><div><strong>Irodori Mic Bridge</strong><small>LIVE VOICE ROUTER</small></div><span className="mic-services">Irodori　Whisper</span><Settings size={17} /><Power size={17} /></div>
    <div className="mic-columns"><div className="mic-left">
      <section className="mic-panel"><div className="mic-panel-label">OUTPUT MODE <b>{playing ? 'PLAYING' : mode === 'mute' ? 'MUTED' : 'READY'}</b></div><div className="mic-modes">{[[Mic, 'raw', '生声', 'そのまま送る'], [Activity, 'tts', 'Irodori音声', 'AI音声で送る'], [MicOff, 'mute', 'ミュート', '送信しない']].map(([Icon, value, title, detail]) => { const Symbol = Icon as typeof Activity; return <div key={String(value)} className={`mic-mode mode-${String(value)} ${mode === value ? 'is-selected' : ''}`}><Symbol size={24} /><div><strong>{String(title)}</strong><small>{String(detail)}</small></div></div>; })}</div><strong className="mic-state-title">{state}</strong><Meter active={mode !== 'mute' && (index === 0 || playing)} time={time} /></section>
      <section className="mic-panel mic-recognition"><div className="mic-panel-label">LAST RECOGNITION</div><strong>{index === 0 && time > 3300 ? '星の郵便局へ、手紙を届けます。' : '認識した文章がここに表示されます。'}</strong><small>マイク入力 → IrodoriTTS → マイク出力</small></section>
      <section className="mic-panel mic-text-player"><div className="mic-panel-label">TEXT PLAYER <b>{index === 1 ? time > 7900 ? 'DONE' : time > 5100 ? 'PLAYING' : time > 4500 ? 'GENERATING' : 'READY' : 'READY'}</b></div><div className="mic-editor-row"><div className={'mic-text-input ' + (index === 1 && time < 4500 ? 'is-focused' : '')}>{typed}{index === 1 && time > 900 && time < 4000 && <i className="mic-text-caret" />}</div><span className={index === 1 && time > 4200 && time < 4750 ? 'is-pressed' : ''}><Play size={14} fill="currentColor" />再生</span></div><div className="mic-text-choices"><div><small>話者</small><span>ソラ <ChevronDown size={11} /></span></div><div><small>Caption</small><span>穏やかな朗読 <ChevronDown size={11} /></span></div></div><div className="mic-strength"><small>表現</small><span><i style={{ left: '30%' }} /></span><b>3.0</b></div></section>
    </div><div className="mic-right">
      <section className="mic-panel mic-voice"><div className="mic-panel-label">VOICE <span>↻</span></div><small>TTSモデル</small><div className="mic-select">irodori-tts <ChevronDown size={12} /></div><small>ボイス</small><div className="mic-select">ソラ <ChevronDown size={12} /></div></section>
      <section className="mic-panel mic-expression"><div className="mic-panel-label">EXPRESSION</div><div className={'mic-select ' + (expressive ? 'is-emphasis' : '')}>{expressive ? '明るい案内' : '穏やかな朗読'} <ChevronDown size={12} /></div>{index === 2 && time > 1400 && time < 2300 && <div className="mic-select-list"><span>穏やかな朗読</span><span>明るい案内</span></div>}<p>{expressive ? '明るく、軽やかに話す。' : '穏やかに、はっきり話す。'}</p><div className="mic-strength"><small>表現の強さ</small><span><i style={{ left: strength === '5.0' ? '50%' : '30%' }} /></span><b>{strength}</b></div><div className="mic-reference"><small>REFERENCE VOICE</small><span>クリックして音声ファイルを選択</span></div></section>
      <section className="mic-panel mic-monitor"><div className="mic-panel-label">LOCAL MONITOR</div><span>□ 自分にも変換音声を流す</span><small>OFF</small></section>
    </div></div>
    <div className="mic-footer"><span>モード切替・文章入力・表現調整</span><span>診断ログ</span></div>
    {index === 0 && time > 1700 && time < 2400 && <DemoPointer className="mic-mode-pointer" />}
    {index === 1 && time > 4000 && time < 4900 && <DemoPointer className="mic-play-pointer" />}
    {index === 2 && time > 3100 && time < 4200 && <DemoPointer className="mic-strength-pointer" />}
  </div>;
}
export function MicMotionDemo() { return <FeatureDemo id="micbridge" name="IrodoriMicBridge" scenes={micScenes} className="mic-stage" description="生声・Irodori音声・ミュートの出力モードを切り替える。文章を入力して再生する。話し方のプリセットと表現の強さを調整する。">{state => <MicWorkspace {...state} />}</FeatureDemo>; }
