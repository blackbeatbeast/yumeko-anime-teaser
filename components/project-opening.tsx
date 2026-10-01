'use client';

import type { CSSProperties } from 'react';

/** Abstract editorial opening; it does not imitate an application feature. */
export default function ProjectOpening({ id, running }: { id: string; running: boolean }) {
  return <div className={`pv-opening opening-${id} ${running ? 'is-running' : ''}`} aria-hidden="true">
    <div className="opening-paper-texture" />
    <div className="opening-orbit orbit-one" /><div className="opening-orbit orbit-two" />
    <span className="opening-spark spark-one">✦</span><span className="opening-spark spark-two">✦</span>
    {id === 'aine' && <div className="opening-conversation"><i className="conversation-orb orb-left"><b /><b /><b /></i><i className="conversation-orb orb-right"><b /><b /><b /></i><span className="conversation-thread" /></div>}
    {id === 'bookvoice' && <div className="opening-book"><i className="paper-fragment fragment-one" /><i className="paper-fragment fragment-two" /><i className="paper-fragment fragment-three" /><div className="opening-pages"><i>{[0, 1, 2, 3, 4].map(i => <b key={i} />)}</i><i>{[0, 1, 2, 3, 4].map(i => <b key={i} />)}</i></div><span className="type-fragment type-one">あ</span><span className="type-fragment type-two">の</span></div>}
    {id === 'babylog' && <div className="opening-record">{Array.from({ length: 6 }, (_, i) => <i className={`record-shape record-${i}`} key={i}><b /></i>)}<span className="record-page" /></div>}
    {id === 'micbridge' && <div className="opening-voice"><div>{[19, 41, 72, 38, 94, 62, 110, 51, 82, 32, 60, 23, 45].map((height, i) => <i key={i} style={{ '--bar-height': `${height}px`, '--bar-delay': `${i * .018}s` } as CSSProperties} />)}</div><span className="voice-frame" /><i className="voice-dot" /></div>}
    <div className="opening-iris" />
  </div>;
}
