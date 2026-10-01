'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowUp, BookOpen, Camera, ChevronDown, ChevronLeft, MessageCircle, MousePointer2, Phone, Search, SlidersHorizontal, Square, VolumeX, Mic, Volume2, PhoneOff, GitBranch, Clock, MapPin, X, Expand, FolderOpen, RotateCcw } from 'lucide-react';
import { assetPath } from '@/lib/assets';
import { AINE_AVATAR, AINE_SELFIE } from '@/lib/character-assets';
import FeatureDemo, { type FeatureState } from './feature-demo';
const QUESTION = '星の切手で、どこへ手紙を届けよう？';
const ANSWER = '月の裏側の、小さな郵便局へ。\n封筒には「まだ見ぬ友だちへ」と書こう。';
const scenes = [
  { label: 'メッセージ', title: 'ことばから、つながる。', detail: 'ひとこと送る。返事が届く。', duration: 11800 },
  { label: '通話', title: '声で、つづきを。', detail: AINE_SELFIE ? '通話しながら、写真を見よう。' : '通話しながら、文字でも。', duration: AINE_SELFIE ? 23000 : 15500 },
  { label: '分岐', title: 'もうひとつの、つづき。', detail: 'このひとことから、別の会話へ。', duration: 10500 },
];
function Avatar() { return <Image unoptimized className="aine-avatar" src={assetPath(AINE_AVATAR)} alt="" width={42} height={42} loading="lazy" />; }
function MessageScene({ time, revision }: FeatureState) {
  const elapsed = time;
  const history = useRef<HTMLDivElement>(null);
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

  return (<div key={revision} className="aine-workspace" aria-hidden="true">
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
        </div>);
}

function CallScene({ time }: FeatureState) {
  const dialog = time < 2600;
  const sent = time >= 7900;
  const on = time >= 4300 && !sent;
  const talking = time >= 9500 && time < 13400;
  const question = AINE_SELFIE ? '出先の自撮り、送ってくれる？' : '今、そっちはどんな景色？';
  const reply = AINE_SELFIE ? 'カフェのテラスにいるよ。\n今の写真、送るね。' : '郵便局の窓から、青い屋根が見えるよ。\n今度、一緒に歩こうね。';
  const draft = !sent ? question.slice(0, Math.max(0, Math.floor((time - 5300) / 85))) : '';
  if (AINE_SELFIE && time >= 14000) return <CallPhotoMessages time={time} />;
  return <div className="aine-call-scene">
    {dialog ? <><div className="aine-call-backdrop"><Avatar /><strong>ソラ</strong><Phone size={30} /></div><div className="aine-dialog aine-call-start">
      <div className="aine-dialog-heading"><strong>新しい通話</strong><X size={16} /></div>
      <div className="aine-session-switch"><div><strong>メッセージを引き継ぐ</strong><small>ここまでのメッセージを使って話します。</small></div><i className={time >= 900 ? 'is-on' : ''} /></div>
      <p>通話用の会話・出力ルールを使います。<br />マイクは開始後にオンにできます。</p>
      <div className="aine-dialog-actions"><span>キャンセル</span><span className={time >= 2150 ? 'is-pressed' : ''}><Phone size={14} />通話を始める</span></div>
    </div></> : <div className="aine-call-view">
      <div className="aine-call-top"><span><ChevronLeft size={13} />トークへ戻る</span><span><i />通話中 <b>00:{String(Math.max(0, Math.floor((time - 2600) / 1000))).padStart(2, '0')}</b></span><span><SlidersHorizontal size={13} />声の設定</span></div>
      <div className="aine-call-layout">
        <div className="aine-call-person">
          <span className="aine-call-world">風の郵便屋さん</span>
          <div className={'aine-call-ring ' + (talking ? 'is-speaking' : on ? 'is-listening' : '')}><Avatar /></div>
          <strong>ソラ</strong>
          <span className="aine-call-status"><span className="aine-wave">{[0, 1, 2, 3, 4].map(i => <i key={i} />)}</span>{talking ? 'ソラが話しています' : on ? 'あなたの声を聞いています' : 'マイクをオンにするか、文字を入力'}</span>
          <div className="aine-call-scene-info"><span><Clock size={12} />星の切手の旅</span><span><MapPin size={12} />郵便局</span></div>
          <p>開始時までのメッセージを<br />引き継いでいます。</p>
          <div className="aine-call-controls"><div><span className={on ? 'is-on' : ''}><Mic size={21} /></span><small>マイク {on ? 'オン' : 'オフ'}</small></div><div><span><Volume2 size={21} /></span><small>読み上げ オン</small></div><div><span className="is-end"><PhoneOff size={23} /></span><small>終了</small></div></div>
        </div>
        <div className="aine-call-transcript"><div><strong>会話のテキスト</strong><span>いつでも見返して、直せます。</span></div>
          <div className="aine-call-turns">
            {!sent ? <p className="aine-call-welcome">音声または文字で話せます</p> : <div className="aine-message aine-outgoing"><div className="aine-bubble">{question}</div></div>}
            {time >= 9400 && <div className="aine-message aine-response"><Avatar /><div className="aine-bubble">{reply.slice(0, Math.max(1, Math.floor((time - 9400) / 80)))}</div></div>}
          </div><div className={'aine-call-composer ' + (draft ? 'is-focused' : '')}><div>{draft || '話したいことを文字で送る…'}{draft && <i />}</div><span className={time >= 7550 && time < 8150 ? 'is-pressed' : ''}>{sent && time < 12900 ? <Square size={12} fill="currentColor" /> : <ArrowUp size={18} />}</span></div>
        </div>
      </div>
    </div>}
    {time >= 2050 && time < 2550 && <MousePointer2 className="pv-pointer aine-start-pointer" fill="#ed65aa" size={25} />}
    {time >= 3450 && time < 4700 && <MousePointer2 className="pv-pointer aine-mic-pointer" fill="#ed65aa" size={25} />}
    {time >= 7200 && time < 8200 && <MousePointer2 className="pv-pointer aine-call-send-pointer" fill="#ed65aa" size={25} />}
  </div>;
}

function CallPhotoMessages({ time }: { time: number }) {
  const history = useRef<HTMLDivElement>(null);
  const ready = time >= 16900;
  const expanded = time >= 19300 && time < 21600;
  useEffect(() => { if (history.current) history.current.scrollTop = history.current.scrollHeight; }, [ready]);
  return <div className="aine-photo-workspace">
    <div className="aine-mini-call"><Avatar /><div><strong>ソラと通話中 <b>00:{String(Math.floor((time - 2600) / 1000)).padStart(2, '0')}</b></strong><small>{ready ? 'ソラが話しています' : '画像を生成中 · 音声の処理はこのあと再開'}</small></div><span><Mic size={15} /></span><span className="mini-end"><PhoneOff size={16} /></span></div>
    <div className="aine-header"><ChevronLeft size={18} /><Avatar /><div className="aine-heading"><strong>ソラ <ChevronDown size={12} /></strong><span>風の郵便屋さん</span></div><Phone size={17} /></div>
    <div className="aine-tabs"><span><MessageCircle size={14} />メッセージ</span><span><Phone size={13} />通話履歴 <i>0</i></span></div>
    <div className="aine-photo-history" ref={history}><div className="aine-message"><Avatar /><div><span className="aine-author">ソラ</span><div className="aine-bubble">今、カフェのテラスにいるよ。</div></div></div>
      <div className="aine-session-photos"><strong><ChevronDown size={12} />通話の写真 <span>1</span></strong><div><small>9/15 14:21</small><div className="aine-photo-card">
        {ready && AINE_SELFIE ? <div className="aine-photo-preview"><Image unoptimized src={assetPath(AINE_SELFIE)} alt="" width={360} height={480} loading="lazy" /><span><Expand size={15} /></span></div> : <><div className="aine-photo-placeholder"><Camera size={30} /></div><div className="aine-photo-generating">写真を作っています <Square size={10} fill="currentColor" /></div><i className="aine-photo-progress" /></>}
        {ready && <div className="aine-photo-actions"><span><RotateCcw size={12} />別の写真</span><span><FolderOpen size={12} />保存先</span></div>}
      </div>{ready && <p className="aine-photo-caption">テラスから、こんにちは。風が気持ちいいよ。</p>}</div></div>
    </div>
    <div className="aine-bottom"><div className="aine-tools"><span><Camera size={12} />写真 おまかせ</span><span>Anima</span><span><VolumeX size={12} />音声 OFF</span></div><div className="aine-composer"><div className="aine-input">ソラにメッセージを送る...</div><span className="aine-send"><ArrowUp size={21} /></span></div></div>
    {time >= 18300 && time < 19500 && <MousePointer2 className="pv-pointer aine-photo-pointer" fill="#ed65aa" size={25} />}
    {expanded && AINE_SELFIE && <div className="aine-photo-lightbox"><div><strong>写真</strong><span><Expand size={17} />拡大 <X size={21} /></span></div><Image unoptimized src={assetPath(AINE_SELFIE)} alt="" width={360} height={480} /><p>テラスから、こんにちは。風が気持ちいいよ。</p></div>}
  </div>;
}

function BranchScene({ time }: FeatureState) {
  const opened = time >= 1650 && time < 6600;
  const created = time >= 6600;
  const title = '風の郵便屋さん · 星を探す道';
  return <div className="aine-branch-scene">
    <div className="aine-header"><ChevronLeft size={18} /><Avatar /><div className="aine-heading"><strong>ソラ</strong><span>{created ? title : '風の郵便屋さん'}</span></div><GitBranch size={18} /></div>
    <div className="aine-world" style={{ backgroundImage: 'url(' + assetPath('/demos/aine-world.webp') + ')' }}><div><span>この世界線の世界観</span><strong>{created ? '星を探す道' : '風の郵便屋さん'}</strong><p>星の切手を探す、小さな旅。</p></div></div>
    <div className="aine-branch-history"><div className="aine-message"><Avatar /><div><span className="aine-author">ソラ</span><div className="aine-bubble">星の切手を一枚、持っていこう。</div><span className={'aine-branch-action ' + (time > 1000 ? 'is-selected' : '')}><GitBranch size={14} />分岐</span></div></div>
      {created && <><div className="aine-story-divider"><GitBranch size={14} />分岐した会話</div><div className="aine-message aine-outgoing"><div className="aine-bubble">先に、星の切手を探してみよう。</div></div></>}
    </div>
    {opened && <div className="aine-modal-layer"><div className="aine-dialog aine-branch-dialog"><div className="aine-dialog-heading"><strong>このメッセージから会話を分岐</strong><X size={16} /></div><p>このメッセージまでの出来事を引き継ぎます。</p>
      <div className="aine-branch-preview"><GitBranch size={24} /><div><strong>風の郵便屋さん</strong><p>星の切手を一枚、持っていこう。</p></div></div>
      <label>分岐した会話の名前<span>{time < 2600 ? '風の郵便屋さん · もうひとつの続き' : title.slice(0, Math.max(1, Math.floor((time - 2600) / 80)))}</span></label>
      <p>同じ世界線の中に、別の会話を作ります。<br />元の会話はそのまま残ります。</p><div className="aine-dialog-actions"><span>キャンセル</span><span className={time > 6050 ? 'is-pressed' : ''}><GitBranch size={14} />分岐して開く</span></div>
    </div></div>}
  </div>;
}
export default function AineMotionDemo() {
  return <FeatureDemo id="aine" name="AINE" scenes={scenes} className="aine-stage" description="ソラへのメッセージを送信して返事を読む。メッセージを引き継いで音声通話を始め、会話のテキストを確認する。メッセージから別の会話を分岐する流れ。">
    {state => state.index === 0 ? <MessageScene {...state} /> : state.index === 1 ? <CallScene {...state} /> : <BranchScene {...state} />}
  </FeatureDemo>;
}
