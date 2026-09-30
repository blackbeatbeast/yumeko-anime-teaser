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
let selected: Player | null = null;
let observer: IntersectionObserver | null = null;
let motion: MediaQueryList | null = null;
let frame = 0;

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
  if (motion?.matches) {
    players.forEach(player => { if (player.automatic || player.autoIntent) pause(player); });
    return;
  }
  candidates.sort((a, b) => a.distance - b.distance);
  selected = candidates[0]?.player ?? null;
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
  if (!players.size) setup();
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
    if (players.size) schedule();
    else {
      observer?.disconnect(); observer = null;
      motion?.removeEventListener('change', schedule); motion = null;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', visibilityChanged);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}
