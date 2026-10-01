'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowUp,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  MessageCircle,
  MousePointer2,
  Pause,
  Phone,
  Play,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Square,
  VolumeX,
} from 'lucide-react';
import { assetPath } from '@/lib/assets';
import {
  registerMotionDemo,
  requestMotionPlayback,
  type MotionPresence,
} from '@/lib/demo-playback';

// Authored story and scripted replies; no application store, bridge or service.
const QUESTION = '星の切手で、どこへ手紙を届けよう？';
const ANSWER =
  '月の裏側の、小さな郵便局へ。\n封筒には「まだ見ぬ友だちへ」と書こう。';
const DURATION = 11800;
const STATIC_STEPS = [0, 3300, 4800, DURATION];

function Avatar() {
  return (
    <svg className="aine-avatar" viewBox="0 0 42 42" aria-hidden="true">
      <circle cx="21" cy="21" r="21" fill="#b9ccbd" />
      <circle cx="21" cy="16" r="7" fill="#faf4df" />
      <path d="M8 38v-5c0-13 26-13 26 0v5" fill="#faf4df" />
    </svg>
  );
}

export default function AineMotionDemo() {
  const stage = useRef<HTMLDivElement>(null);
  const history = useRef<HTMLDivElement>(null);
  const clock = useRef(0);
  const manualPause = useRef(false);
  const visited = useRef(false);
  const [elapsed, setElapsed] = useState(0);
  const [revision, setRevision] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [presence, setPresence] = useState<MotionPresence>({
    active: false,
    inView: false,
    reduced: false,
  });

  const reset = useCallback(() => {
    clock.current = 0;
    setElapsed(0);
    setRevision((value) => value + 1);
  }, []);

  useEffect(() => {
    if (!stage.current) return;
    return registerMotionDemo(stage.current, (next) => {
      setPresence(next);
      if (!next.inView) {
        manualPause.current = false;
        visited.current = false;
        setPlaying(false);
        return;
      }
      if (next.reduced) {
        setPlaying(false);
        clock.current = DURATION;
        setElapsed(DURATION);
        return;
      }
      if (!next.active) {
        setPlaying(false);
        return;
      }
      if (manualPause.current) return;
      if (!visited.current) {
        reset();
        visited.current = true;
      }
      if (clock.current < DURATION) setPlaying(true);
    });
  }, [reset]);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let previous = performance.now();
    let rendered = clock.current;
    function tick(now: number) {
      clock.current = Math.min(
        DURATION,
        clock.current + Math.min(now - previous, 80),
      );
      previous = now;
      if (clock.current - rendered >= 40 || clock.current === DURATION) {
        rendered = clock.current;
        setElapsed(clock.current);
      }
      if (clock.current === DURATION) {
        setPlaying(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, revision]);

  const sent = elapsed >= 3800;
  const typing = elapsed >= 4300 && elapsed < 5550;
  const responding = elapsed >= 5550;
  const busy = sent && elapsed < 5550 + ANSWER.length * 66;
  const draft = sent
    ? ''
    : QUESTION.slice(0, Math.max(0, Math.floor((elapsed - 1050) / 85)));
  const response = responding
    ? ANSWER.slice(0, Math.max(1, Math.floor((elapsed - 5550) / 66)))
    : '';
  const phase =
    elapsed < 1050
      ? 'ready'
      : elapsed < 3800
        ? 'write'
        : elapsed < 5550
          ? 'send'
          : elapsed < 8200
            ? 'reply'
            : 'result';

  useEffect(() => {
    const element = history.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [response, sent, typing, revision]);

  function replay() {
    manualPause.current = false;
    visited.current = true;
    reset();
    if (presence.reduced) return;
    if (stage.current) requestMotionPlayback(stage.current);
    setPlaying(true);
  }
  function toggle() {
    if (playing) {
      manualPause.current = true;
      setPlaying(false);
      return;
    }
    if (clock.current >= DURATION) {
      replay();
      return;
    }
    manualPause.current = false;
    visited.current = true;
    if (stage.current) requestMotionPlayback(stage.current);
    setPlaying(true);
  }
  function nextStep() {
    const next = STATIC_STEPS.find((value) => value > clock.current) ?? 0;
    clock.current = next;
    setElapsed(next);
  }

  return (
    <figure
      className="project-demo aine-motion"
      id="aine-motion-demo"
      aria-label="AINEのメッセージ送信の操作アニメーション"
    >
      <div className="demo-chrome">
        <span>
          <i />
          <i />
          <i />
        </span>
        <span>AINE</span>
        <span aria-hidden="true">↗</span>
      </div>
      <div
        ref={stage}
        className={`aine-stage ${playing ? 'is-running' : ''} ${presence.reduced ? 'is-reduced' : ''}`}
        data-phase={phase}
        data-playing={playing}
        data-elapsed={Math.round(elapsed)}
      >
        <div key={revision} className="aine-workspace" aria-hidden="true">
          <div className="aine-header">
            <ChevronLeft size={18} />
            <Avatar />
            <div className="aine-heading">
              <strong>
                ソラ <ChevronDown size={12} />
              </strong>
              <span>風の郵便屋さん</span>
            </div>
            <div className="aine-header-actions">
              <Search size={17} />
              <span className="aine-phone">
                <Phone size={17} fill="currentColor" />
              </span>
            </div>
          </div>
          <div className="aine-tabs">
            <span>
              <MessageCircle size={14} />
              メッセージ
            </span>
            <span>
              <Phone size={13} />
              通話履歴 <i>0</i>
            </span>
          </div>
          <div
            className="aine-world"
            style={{
              backgroundImage: `url(${assetPath('/demos/aine-world.webp')})`,
            }}
          >
            <div>
              <span>この世界線の世界観</span>
              <strong>
                <BookOpen size={15} />
                風の郵便屋さん
              </strong>
              <p>星の切手を探す、小さな旅。</p>
            </div>
          </div>
          <div className="aine-settings">
            <SlidersHorizontal size={12} />
            会話設定 <span>API・声・喋り方</span>
            <ChevronDown size={13} />
          </div>
          <div className="aine-history" ref={history}>
            <div className="aine-message aine-greeting">
              <Avatar />
              <div className="aine-message-group">
                <span className="aine-author">ソラ</span>
                <div className="aine-bubble">今日は、どんな物語にしよう？</div>
                <span className="aine-time">14:20</span>
              </div>
            </div>
            {sent && (
              <div className="aine-message aine-outgoing">
                <div className="aine-message-group">
                  <div className="aine-bubble">{QUESTION}</div>
                  <span className="aine-time">14:21</span>
                </div>
              </div>
            )}
            {typing && (
              <div className="aine-message aine-thinking">
                <Avatar />
                <div className="aine-dots">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="aine-thinking-label">返事を考えています</span>
              </div>
            )}
            {responding &&
              (busy ? (
                <div className="aine-response aine-streaming-response">
                  <div className="aine-bubble aine-streaming-bubble">
                    {response}
                    <span className="aine-stream-caret is-visible" />
                    <span className="aine-streaming-label">返答を受信中</span>
                  </div>
                </div>
              ) : (
                <div className="aine-message aine-response">
                  <Avatar />
                  <div className="aine-message-group">
                    <span className="aine-author">ソラ</span>
                    <div className="aine-bubble">{response}</div>
                    <span className="aine-time">14:21</span>
                  </div>
                </div>
              ))}
          </div>
          <div className="aine-bottom">
            <div className="aine-tools">
              <span>
                <Search size={12} />
                調べる
              </span>
              <span>
                <VolumeX size={12} />
                音声 OFF
              </span>
            </div>
            <div
              className={`aine-composer ${phase === 'write' ? 'is-focused' : ''}`}
            >
              <div className={`aine-input ${draft ? 'has-text' : ''}`}>
                {draft || 'ソラにメッセージを送る...'}
                {phase === 'write' && <i className="aine-input-caret" />}
              </div>
              <span
                className={`aine-send ${draft ? 'is-ready' : ''} ${busy ? 'is-busy' : ''} ${elapsed >= 3580 && elapsed < 3880 ? 'is-pressed' : ''}`}
              >
                {busy ? (
                  <Square size={13} fill="currentColor" />
                ) : (
                  <ArrowUp size={22} strokeWidth={2.6} />
                )}
              </span>
            </div>
            <div className="aine-hint">Enterで送信・Shift + Enterで改行</div>
          </div>
          <MousePointer2
            className="aine-cursor"
            size={27}
            fill="#ed65aa"
            strokeWidth={1.8}
          />
        </div>
      </div>
      <progress
        className="aine-progress"
        aria-label="操作アニメーションの進行"
        value={elapsed}
        max={DURATION}
      />
      <figcaption className="aine-motion-controls">
        {presence.reduced ? (
          <button
            type="button"
            onClick={nextStep}
            aria-label="AINEの操作を次の場面へ進める"
          >
            次へ{' '}
            <ArrowUp size={15} className="aine-next-arrow" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={toggle}
            aria-label={
              playing
                ? 'AINEのアニメーションを停止'
                : 'AINEのアニメーションを再生'
            }
          >
            {playing ? (
              <Pause size={16} aria-hidden="true" />
            ) : (
              <Play size={16} aria-hidden="true" />
            )}
            {playing ? '止める' : '再生'}
          </button>
        )}
        <button
          type="button"
          onClick={replay}
          aria-label="AINEのアニメーションを最初から見る"
        >
          <RotateCcw size={15} aria-hidden="true" />
          もう一度
        </button>
      </figcaption>
      <p className="sr-only">
        ソラに「{QUESTION}」と送ると、「{ANSWER}
        」と返答が届く流れを表示しています。
      </p>
    </figure>
  );
}
