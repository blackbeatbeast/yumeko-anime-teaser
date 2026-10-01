'use client';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

type Particle = { id: number; size: number; color: string; frames: Keyframe[]; duration: number; delay: number; flutter: number; tilt: number; swing: number };
const COLORS = ['#f16dab', '#ffd34a', '#b79aff', '#7bdfca', '#ff9878', '#fff3bd'];
const subscribeClient = () => () => {};
const clientReady = () => true;
const serverReady = () => false;
function NuParticle({ particle, done }: { particle: Particle; done: (id: number) => void }) {
  const element = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = element.current; if (!el) return;
    const flight = el.animate(particle.frames, { duration: particle.duration, delay: particle.delay, fill: 'both' });
    const flutter = el.firstElementChild?.animate([
      { transform: `translate(-50%,-50%) rotate(${particle.tilt - particle.swing}deg) scaleX(.93)` },
      { transform: `translate(-50%,-50%) rotate(${particle.tilt + particle.swing}deg) scaleX(1)` },
    ], { duration: particle.flutter, delay: -particle.flutter * Math.random(), direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
    void flight.finished.then(() => done(particle.id)).catch(() => {});
    const cutoff = setTimeout(() => done(particle.id), particle.duration + particle.delay + 150);
    return () => { clearTimeout(cutoff); flight.cancel(); flutter?.cancel(); };
  }, [particle, done]);
  return <span ref={element} className="nu-particle" style={{ color: particle.color, fontSize: particle.size } as CSSProperties}><b>＼ぬ／</b></span>;
}

export function ThankYouFinale() {
  const mounted = useSyncExternalStore(subscribeClient, clientReady, serverReady);
  const marker = useRef<HTMLDivElement>(null);
  const once = useRef(false);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (!marker.current) return;
    let burstTimer: ReturnType<typeof setTimeout> | undefined;
    const enter = () => {
      if (once.current || document.hidden || !marker.current) return;
      const rect = marker.current.getBoundingClientRect();
      const overlap = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
      if (overlap < Math.min(rect.height * .4, innerHeight * .35, 120)) return;
      once.current = true;
      setEntered(true);
      burstTimer = setTimeout(() => window.dispatchEvent(new Event('yumeko:nu-finale')), 460);
    };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) enter();
    }, { threshold: [0, .1, .2, .3, .4, .5, .7] });
    observer.observe(marker.current);
    document.addEventListener('visibilitychange', enter);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', enter); if (burstTimer) clearTimeout(burstTimer); };
  }, []);
  return <div className={`thank-you-finale ${mounted ? 'is-armed' : ''} ${entered ? 'has-entered' : ''}`} ref={marker} data-entered={entered}>
    <div className="thank-you-stamps" aria-hidden="true"><span>＼ぬ／</span><span>＼ぬ／</span><span>＼ぬ／</span></div>
    <p><span className="thanks-line">ここまで見てくれて</span><span className="thanks-line">ありがとう<span className="thanks-heart">！</span></span></p>
    <span className="thank-you-cue">もう一回、ぬ？<svg viewBox="0 0 120 70" aria-hidden="true"><path d="M4 8C50-1 23 53 82 44S112 39 112 62M101 53l12 10 4-14" /></svg></span>
  </div>;
}

export default function NuWidget() {
  const mounted = useSyncExternalStore(subscribeClient, clientReady, serverReady);
  const [nu, setNu] = useState(0);
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const serial = useRef(0);
  const button = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastBurst = useRef(0);
  const done = useCallback((id: number) => setParticles(previous => previous.filter(item => item.id !== id)), []);
  const burst = useCallback((finale = false) => {
    if (finale && lastBurst.current > 0 && performance.now() - lastBurst.current < 1800) return;
    lastBurst.current = performance.now();
    setNu(n => n + 1); setVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 1700);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !button.current) return;
    const rect = button.current.getBoundingClientRect();
    const ox = rect.left + rect.width / 2, oy = rect.top + rect.height / 2;
    const width = innerWidth, height = innerHeight, count = finale ? 42 : 28;
    const cells = Array.from({ length: count }, (_, i) => i).sort(() => Math.random() - .5);
    const batch = cells.map((cell, i): Particle => {
      const large = i < 3;
      const size = large ? (width < 640 ? 32 : 42) + Math.random() * 14 : (width < 640 ? 14 : 17) + Math.random() * 14;
      const tx = size * 1.1 + (width - size * 2.2) * ((cell % 7 + .12 + Math.random() * .65) / 7);
      const ty = height * (.035 + Math.floor(cell / 7) / Math.ceil(count / 7) * .70 + Math.random() * .13);
      const peak = .19 + Math.random() * .19;
      const direction = Math.random() < .5 ? -1 : 1, sway = 12 + Math.random() * Math.min(60, width * .1);
      const turn = (Math.random() - .5) * (large ? 80 : 300);
      const points: [number, number, number, number, number][] = [
        [0, ox, oy, -turn * .3, .2],
        [.045, ox + (tx - ox) * .18, oy - (oy - ty) * .28 - 20, turn * .15, .72],
        [peak, tx, ty, turn, 1],
        [peak + (1 - peak) * .26, tx + sway * direction, ty + (height - ty) * .14, turn + direction * 35, 1],
        [peak + (1 - peak) * .53, tx - sway * direction * (.25 + Math.random() * .6), ty + (height - ty) * .42, turn - direction * 24, 1],
        [.88, tx + sway * direction * .45, height * .92, turn + direction * 65, 1],
        [1, tx - sway * direction * .15, height + size * 3, turn + direction * (large ? 90 : 180), .9],
      ];
      return { id: ++serial.current, size, color: COLORS[Math.floor(Math.random() * COLORS.length)],
        frames: points.map(([offset, x, y, rotation, scale], position) => ({ offset, transform: `translate(${x}px,${y}px) rotate(${rotation}deg) scale(${scale})`, opacity: position === 0 || position === points.length - 1 ? 0 : 1, easing: position < 2 ? 'cubic-bezier(.16,.7,.35,1)' : 'linear' })),
        duration: 3500 + Math.random() * 3000, delay: Math.random() * 430, flutter: 750 + Math.random() * 1500, tilt: (Math.random() - .5) * 20, swing: 5 + Math.random() * 20,
      };
    });
    setParticles(previous => [...previous, ...batch].slice(-72));
  }, []);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const calm = () => { if (media.matches) setParticles([]); };
    const finale = () => burst(true);
    media.addEventListener('change', calm); window.addEventListener('yumeko:nu-finale', finale);
    return () => { if (timer.current) clearTimeout(timer.current); media.removeEventListener('change', calm); window.removeEventListener('yumeko:nu-finale', finale); };
  }, [burst]);
  return <>
    {mounted && createPortal(<div className="nu-confetti nu-organic" aria-hidden="true">{particles.map(particle => <NuParticle key={particle.id} particle={particle} done={done} />)}</div>, document.body)}
    <div className="nu-widget"><output className={`nu-pop ${visible ? 'is-visible' : ''}`} key={nu} aria-live="polite">{visible ? '＼ぬ／' : ''}</output><button ref={button} type="button" className="nu-button" onClick={() => burst()} aria-label="カラフルな、ぬを飛ばす">ぬ</button></div>
  </>;
}
