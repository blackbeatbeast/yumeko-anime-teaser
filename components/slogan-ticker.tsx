'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';

export default function SloganTicker() {
  const root = useRef<HTMLDivElement>(null);
  const unit = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState({ repeats: 4, duration: 60 });
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const element = root.current, sample = unit.current;
    if (!element || !sample) return;
    let inView = false, alive = true;
    const measure = () => {
      const width = sample.getBoundingClientRect().width;
      if (!width) return;
      const repeats = Math.max(2, Math.ceil(element.clientWidth / width) + 1);
      setLayout(previous => previous.repeats === repeats && previous.duration === repeats * width / 45 ? previous : { repeats, duration: repeats * width / 45 });
    };
    const visibility = () => setRunning(inView && !document.hidden);
    const resize = new ResizeObserver(measure);
    resize.observe(element); resize.observe(sample); measure();
    const observer = new IntersectionObserver(entries => { inView = entries.some(entry => entry.isIntersecting); visibility(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', visibility);
    void document.fonts.ready.then(() => { if (alive) measure(); });
    return () => { alive = false; resize.disconnect(); observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  return <div ref={root} className={`ticker ${running ? 'is-running' : ''}`} aria-hidden="true">
    <div className="ticker-track" style={{ '--ticker-duration': `${layout.duration}s` } as CSSProperties}>
      {[0, 1].map(group => <div className="ticker-group" key={group}>{Array.from({ length: layout.repeats }, (_, index) => <div className="ticker-unit" ref={group === 0 && index === 0 ? unit : undefined} key={index}>
        MAKE IT. <span>＼ぬ／</span> TRY IT. <span>YUMEKO!</span> FIX IT. <span>＼ぬ／</span>
      </div>)}</div>)}
    </div>
  </div>;
}
