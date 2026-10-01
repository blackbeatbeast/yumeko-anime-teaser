'use client';
import Image from 'next/image';
import { BookOpen, Volume2, Sparkles, MessageCircle, Phone, Milk, Moon, MousePointer2, Mic, Headphones } from 'lucide-react';
import { assetPath } from '@/lib/assets';
import { AINE_AVATAR } from '@/lib/character-assets';
export const OPENING_DURATION = 3600;
const copy: Record<string, { title: string; line: string; small: string }> = {
  bookvoice: { title: 'BOOKVOICE', line: '本に、声を。', small: 'BOOK + VOICE + AI' },
  aine: { title: 'AINE', line: 'ことばも、声も。同じ相手と。', small: 'MESSAGE / CALL' },
  babylog: { title: '育児ログ', line: '小さな毎日を、一枚に。', small: 'A LITTLE RECORD, EVERY DAY' },
  micbridge: { title: 'Irodori\nMicBridge', line: '自分のことばを、選んだ声へ。', small: 'YOUR WORDS → ANOTHER VOICE' },
};
function Wave({ type = '' }: { type?: string }) {
  return <span className={`op-wave ${type}`}>{[.3, .55, .9, .45, 1, .7, .4, .85, .5].map((scale, i) => <i key={i} style={{ height: `${scale * 42}px` }} />)}</span>;
}
/** Meaningful editorial opening; actual application UI follows. */
export default function ProjectOpening({ id, running }: { id: string; running: boolean }) {
  const text = copy[id];
  return <div className={`pv-opening opening-${id} ${running ? 'is-running' : ''}`} aria-hidden="true">
    <div className="op-grain" /><span className="op-corner-label">{text.title.replace('\n', '')}<i /> FEATURE FILM</span>
    <div className="op-story">
      {id === 'bookvoice' && <div className="op-book-story">
        <div className="op-open-book"><BookOpen size={125} strokeWidth={1.3} /><span className="op-paragraph"><i /><i /><i /><i /></span><b>本</b></div>
        <div className="op-book-voice"><Wave /><b>声</b></div>
        <div className="op-ai-seal"><Sparkles size={30} /><b>AI</b></div>
        <span className="op-book-join">＋</span><span className="op-book-join second">＋</span>
      </div>}
      {id === 'aine' && <div className="op-aine-story">
        <span className="op-chat-note"><MessageCircle size={34} /><b>おかえり。</b></span>
        <div className="op-person-ring"><Image unoptimized src={assetPath(AINE_AVATAR)} width={160} height={160} alt="" /><span /><span /></div>
        <span className="op-call-note"><Phone size={26} /><Wave /><b>声で、つづきを。</b></span>
        <svg className="op-conversation-line" viewBox="0 0 400 190"><path d="M40 75C90 18 110 125 190 90S300 55 363 106" /></svg>
      </div>}
      {id === 'babylog' && <div className="op-baby-story">
        <span className="op-milk-stamp"><Milk size={42} /><b>08:30</b><small>ミルク 80 ml</small></span>
        <span className="op-sleep-stamp"><Moon size={38} /><b>09:10</b><small>おやすみ</small></span>
        <MousePointer2 className="op-record-finger" size={32} fill="#ffd34a" />
        <div className="op-record-paper"><span>きょうの記録</span><div><time>08</time><i /><i /><i /></div><div><time>09</time><i /><i /><i /></div><div><time>10</time><i /><i /><i /></div><b className="op-paper-milk">80 ml</b><b className="op-paper-sleep">ねんね</b></div>
      </div>}
      {id === 'micbridge' && <div className="op-mic-story">
        <span className="op-mic-input"><Mic size={38} /><Wave /><b>自分の声</b></span>
        <span className="op-mic-words">こんにちは。<small>認識 → 声の生成</small></span>
        <span className="op-mic-output"><Wave type="output" /><Volume2 size={28} /><b>選んだ声</b></span>
        <span className="op-call-partner"><Headphones size={32} /><b>通話相手へ</b></span>
        <svg className="op-mic-path" viewBox="0 0 440 190"><path d="M55 82C100 22 150 155 208 90S310 25 385 106" /></svg>
      </div>}
    </div>
    <div className="op-title"><small>{text.small}</small><strong>{text.title}</strong><p>{text.line}</p><span className="op-title-tick" /></div>
  </div>;
}
