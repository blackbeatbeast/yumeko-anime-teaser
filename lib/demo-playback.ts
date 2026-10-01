type Player = {
  video: HTMLVideoElement;
  manualPause: boolean;
  completed: boolean;
  blocked: boolean;
  autoIntent: boolean;
  automatic: boolean;
  pending: boolean;
  policyPauses: number;
  request: number;
};
const players = new Map<HTMLVideoElement, Player>();
export type MotionPresence = { active: boolean; inView: boolean; reduced: boolean };
type MotionPlayer = { element: HTMLElement; notify: (presence: MotionPresence) => void; presence: MotionPresence | null };
const motions = new Map<HTMLElement, MotionPlayer>();
let selected: Player | null = null;
let observer: IntersectionObserver | null = null;
let motion: MediaQueryList | null = null;
let frame = 0;

function notifyMotion(player: MotionPlayer, presence: MotionPresence) {
  const previous = player.presence;
  if (previous && previous.active === presence.active && previous.inView === presence.inView && previous.reduced === presence.reduced) return;
  player.presence = presence;
  player.notify(presence);
}

function motionPresence(player: MotionPlayer, active = false): MotionPresence {
  const rect = player.element.getBoundingClientRect();
  return { active, inView: rect.bottom > 0 && rect.top < innerHeight && rect.width > 0, reduced: Boolean(motion?.matches) };
}

function pause(player: Player) {
  player.request++;
  player.pending = false;
  player.autoIntent = false;
  player.automatic = false;
  if (!player.video.paused) {
    player.policyPauses++;
    player.video.pause();
  }
}

function update() {
  frame = 0;
  if (document.hidden) {
    players.forEach(pause);
    selected = null;
    motions.forEach(player => notifyMotion(player, motionPresence(player)));
    return;
  }
  const height = window.innerHeight;
  const candidates: { player: Player; distance: number }[] = [];
  players.forEach(player => {
    const rect = player.video.getBoundingClientRect();
    const inView = rect.bottom > 0 && rect.top < height && rect.width > 0;
    if (!inView) {
      pause(player);
      // A complete exit permits a deliberate new visit after a manual pause.
      player.manualPause = false;
      player.completed = false;
      player.blocked = false;
      return;
    }
    const overlap = Math.min(rect.bottom, height * .77) - Math.max(rect.top, height * .23);
    if (overlap >= Math.min(rect.height * .2, 80)) {
      candidates.push({ player, distance: Math.abs(rect.top + rect.height / 2 - height / 2) });
    }
  });
  const motionCandidates = [...motions.values()].filter(player => {
    const rect = player.element.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const overlap = Math.min(rect.bottom, height * .85) - Math.max(rect.top, height * .15);
    return rect.width > 0 && center >= height * .2 && center <= height * .8 && overlap >= Math.min(rect.height * .5, 200);
  }).sort((a, b) => {
    const distance = (player: MotionPlayer) => Math.abs(player.element.getBoundingClientRect().top + player.element.offsetHeight / 2 - height / 2);
    return distance(a) - distance(b);
  });
  if (motion?.matches) {
    players.forEach(player => { if (player.automatic || player.autoIntent) pause(player); });
    motions.forEach(player => notifyMotion(player, motionPresence(player)));
    return;
  }
  candidates.sort((a, b) => a.distance - b.distance);
  const nearestMotion = motionCandidates[0];
  const motionRect = nearestMotion?.element.getBoundingClientRect();
  const motionDistance = motionRect ? Math.abs(motionRect.top + motionRect.height / 2 - height / 2) : Infinity;
  const activeMotion = motionDistance < (candidates[0]?.distance ?? Infinity) ? nearestMotion : undefined;
  selected = activeMotion ? null : candidates[0]?.player ?? null;
  motions.forEach(player => notifyMotion(player, motionPresence(player, player === activeMotion)));
  players.forEach(player => { if (player !== selected) pause(player); });
  const player = selected;
  if (!player || player.manualPause || player.completed || player.blocked || player.pending || !player.video.paused) return;
  if (player.video.ended) player.video.currentTime = 0;
  player.video.muted = true;
  player.autoIntent = true;
  player.pending = true;
  const request = ++player.request;
  void player.video.play().then(() => {
    if (request !== player.request) return;
    if (selected !== player || document.hidden || motion?.matches || player.manualPause) pause(player);
  }).catch((error: unknown) => {
    if (request !== player.request) return;
    player.autoIntent = false;
    if (!(error instanceof DOMException && error.name === 'AbortError')) player.blocked = true;
  }).finally(() => {
    if (request === player.request) player.pending = false;
  });
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(update);
}

function visibilityChanged() {
  // Background tabs can suspend animation frames; pause synchronously.
  if (document.hidden) {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    players.forEach(pause);
    selected = null;
    motions.forEach(player => notifyMotion(player, motionPresence(player)));
  } else schedule();
}

function setup() {
  motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  motion.addEventListener('change', schedule);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', visibilityChanged);
  if ('IntersectionObserver' in window) observer = new IntersectionObserver(schedule, { threshold: [0, .2, .5, 1] });
}

/** Shared coordination gives each page one silent, viewport-selected clip. */
export function registerDemoPlayback(video: HTMLVideoElement): () => void {
  if (!players.size && !motions.size) setup();
  const player: Player = { video, manualPause: false, completed: false, blocked: false, autoIntent: false, automatic: false, pending: false, policyPauses: 0, request: 0 };
  players.set(video, player);
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  const onPlay = () => {
    if (video.paused) return;
    const automatic = player.autoIntent;
    player.autoIntent = false;
    if (automatic && (selected !== player || document.hidden || motion?.matches)) {
      pause(player);
      return;
    }
    if (!automatic) {
      player.request++;
      player.pending = false;
      player.manualPause = false;
      player.completed = false;
      player.blocked = false;
      selected = player;
    }
    player.automatic = automatic;
    players.forEach(other => { if (other !== player) pause(other); });
    motions.forEach(other => notifyMotion(other, motionPresence(other)));
  };
  const onPause = () => {
    player.automatic = false;
    if (player.policyPauses) { player.policyPauses--; return; }
    if (video.ended) { player.completed = true; return; }
    player.manualPause = true;
  };
  const onEnded = () => { player.completed = true; player.automatic = false; };
  video.addEventListener('play', onPlay);
  video.addEventListener('pause', onPause);
  video.addEventListener('ended', onEnded);
  observer?.observe(video);
  schedule();
  return () => {
    observer?.unobserve(video);
    video.removeEventListener('play', onPlay);
    video.removeEventListener('pause', onPause);
    video.removeEventListener('ended', onEnded);
    pause(player);
    players.delete(video);
    if (selected === player) selected = null;
    teardownIfEmpty();
  };
}

function teardownIfEmpty() {
  if (players.size || motions.size) { schedule(); return; }
  observer?.disconnect(); observer = null;
  motion?.removeEventListener('change', schedule); motion = null;
  window.removeEventListener('scroll', schedule);
  window.removeEventListener('resize', schedule);
  document.removeEventListener('visibilitychange', visibilityChanged);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
}

/** HTML demonstrations and videos share the same viewport selection. */
export function registerMotionDemo(element: HTMLElement, notify: MotionPlayer['notify']): () => void {
  if (!players.size && !motions.size) setup();
  const player: MotionPlayer = { element, notify, presence: null };
  motions.set(element, player);
  observer?.observe(element);
  schedule();
  return () => { observer?.unobserve(element); motions.delete(element); teardownIfEmpty(); };
}

export function requestMotionPlayback(element: HTMLElement) {
  players.forEach(pause);
  motions.forEach(player => notifyMotion(player, motionPresence(player, player.element === element)));
}
