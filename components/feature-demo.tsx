'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowRight, Pause, Play, RotateCcw } from 'lucide-react';
import { registerMotionDemo, requestMotionPlayback, type MotionPresence } from '@/lib/demo-playback';
import ProjectOpening from './project-opening';

export type FeatureScene = { label: string; title: string; detail: string; duration: number };
export type FeatureState = { time: number; index: number; playing: boolean; revision: number; reduced: boolean };
function timing(scenes: FeatureScene[]) {
  const starts: number[] = [];
  let duration = 2000;
  for (const scene of scenes) { starts.push(duration); duration += scene.duration; }
  return { starts, duration };
}

/** A presentation clock only. It never imports application stores or services. */
export default function FeatureDemo({ id, name, scenes, phone = false, className = '', children, description }: {
  id: string; name: string; scenes: FeatureScene[]; phone?: boolean; className?: string;
  children: (state: FeatureState) => ReactNode; description: string;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const clock = useRef(0);
  const manual = useRef(false);
  const visited = useRef(false);
  const [elapsed, setElapsed] = useState(0);
  const [revision, setRevision] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [presence, setPresence] = useState<MotionPresence>({ active: false, inView: false, reduced: false });
  const { starts, duration } = timing(scenes);
  let index = 0;
  for (let position = 1; position < starts.length; position++) { if (starts[position] <= elapsed) index = position; }
  const time = elapsed - starts[index];
  const scene = scenes[index];
  const opening = !presence.reduced && (playing || elapsed > 0) && elapsed < 2000;
  const reset = useCallback((value = 0) => {
    clock.current = value;
    setElapsed(value);
    setRevision(previous => previous + 1);
  }, []);

  useEffect(() => {
    if (!stage.current) return;
    return registerMotionDemo(stage.current, next => {
      setPresence(next);
      if (!next.inView) {
        manual.current = false; visited.current = false; setPlaying(false); return;
      }
      if (next.reduced) { setPlaying(false); return; }
      if (!next.active) { setPlaying(false); return; }
      if (manual.current) return;
      if (!visited.current) { reset(); visited.current = true; }
      if (clock.current < duration) setPlaying(true);
    });
  }, [duration, reset]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let previous = performance.now();
    let rendered = clock.current;
    function tick(now: number) {
      clock.current = Math.min(duration, clock.current + Math.min(now - previous, 80));
      previous = now;
      if (clock.current - rendered >= 40 || clock.current === duration) {
        rendered = clock.current; setElapsed(clock.current);
      }
      if (clock.current === duration) { setPlaying(false); return; }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, playing, revision]);

  function seek(value: number) {
    manual.current = false; visited.current = true; reset(value);
    // Chapter controls can sit below a tall phone workspace. Bring the chosen
    // operation back into view so the viewport policy can keep it playing.
    stage.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
    if (presence.reduced || document.hidden) { setPlaying(false); return; }
    if (stage.current) requestMotionPlayback(stage.current);
    setPlaying(true);
  }
  function toggle() {
    if (playing) { manual.current = true; setPlaying(false); return; }
    if (clock.current >= duration) { seek(0); return; }
    manual.current = false; visited.current = true;
    stage.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
    if (stage.current) requestMotionPlayback(stage.current);
    if (!document.hidden) setPlaying(true);
  }

  return <figure className={`project-demo feature-demo ${phone ? 'project-demo-phone' : ''}`} id={`${id}-motion-demo`} aria-label={`${name}の機能紹介アニメーション`}>
    <div className="demo-chrome"><span><i /><i /><i /></span><span>{name}</span><span aria-hidden="true">↗</span></div>
    <div className={`pv-caption ${!opening && (time < 4000 || presence.reduced) ? 'words-on' : ''}`} aria-hidden="true">
      <span className="pv-caption-index">0{index + 1}<i /></span>
      <div key={`copy-${index}`}><strong>{scene.title}</strong><span>{scene.detail}</span></div>
      <span className="pv-caption-mark">✦</span>
    </div>
    <div ref={stage} className={`feature-stage ${className} ${playing ? 'is-running' : ''} ${presence.reduced ? 'is-reduced' : ''}`}
      data-demo={id} data-scene={index} data-playing={playing} data-elapsed={Math.round(elapsed)} data-duration={duration}>
      <div key={`${index}-${revision}`} className="feature-scene" aria-hidden="true" style={opening ? { opacity: Math.max(0, Math.min(1, (elapsed - 1550) / 450)) } : undefined}>
        {children({ time: presence.reduced ? Math.max(0, scene.duration - 600) : Math.max(0, time), index, playing, revision, reduced: presence.reduced })}
      </div>
      {opening && <ProjectOpening id={id} running={playing} />}
    </div>
    <progress className="aine-progress" aria-label={`${name}の紹介の進行`} value={elapsed} max={duration} />
    <figcaption className="feature-controls">
      <div className="feature-transport">
        {presence.reduced ? <button type="button" onClick={() => seek(starts[(index + 1) % scenes.length])} aria-label={`${name}の次の機能を見る`}>次へ <ArrowRight size={15} /></button>
          : <button type="button" onClick={toggle} aria-label={`${name}のアニメーションを${playing ? '停止' : '再生'}`}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? '止める' : '再生'}</button>}
        <button type="button" onClick={() => seek(0)} aria-label={`${name}のアニメーションを最初から見る`}><RotateCcw size={15} />もう一度</button>
      </div>
      <div className="feature-chapters" aria-label={`${name}の紹介する機能`}>
        {scenes.map((chapter, position) => <button key={chapter.label} type="button" onClick={() => seek(starts[position])} aria-pressed={index === position}>
          <span>0{position + 1}</span>{chapter.label}
        </button>)}
      </div>
    </figcaption>
    <p className="sr-only">{description}</p>
  </figure>;
}
