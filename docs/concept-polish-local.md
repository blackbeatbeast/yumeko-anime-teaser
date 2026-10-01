# Local concept and feature demonstration revision

This revision is local only. It has not been pushed or deployed.

The original character artwork, hero composition, black outlines, tilted frames,
pink/yellow/purple palette, author identity and four selected works are retained.

Each opening lasts 3.6 seconds. A small app name is visible from the start,
meaningful elements appear in sequence, and a large title lands for about 1.2
seconds before the application UI appears:

- BookVoice: an open book, paragraphs moving toward a voice waveform, and AI.
- AINE: one familiar portrait linking a message bubble and a call ring.
- 育児ログ: milk and sleep records landing on a paper record.
- IrodoriMicBridge: microphone, recognized words, generated voice, call recipient.

All four demonstrations have viewport-selected silent animation, pause, replay
and chapter selection. Controls do not call scrollIntoView or scrollTo. Leaving
the viewport pauses playback; only one work is selected at a time. Reduced motion
shows static feature states with chapter navigation.

## Source and fictional content

BookVoice screenshots use its copied HTML, CSS, icons and UI script in a
disposable fixture. The public BOOK☆WALKER shop component and viewer HTML/CSS
shell are used as visual references. The book, cover, author and all prose are
authored fiction. Original publisher text, covers and marketing figures are
removed and checked before capture. Reading preparation uses an inert command
adapter and an inert AudioContext; no voice engine or real audio runs.

The actual public trial viewer navigated successfully, but its live runtime did
not finish rendering in this environment. The viewer screenshots are therefore
a source-backed isolated UI recreation, not proof of a real book being read.
Paragraph highlighting and audio playback are not shown as verified operations.

AINE, 育児ログ and MicBridge use presentation components based on inspected app
components and styles. They are UI demonstrations, not live sessions. AINE's
call photo follows the image-beta source: the continuing call is minimized into
a mini-call bar and the image is shown in the normal message history. Photo
generation is explicitly a beta feature. Microphone capture, live AI, Firebase,
messages to others, accounts and model downloads are not used.

Sora's portrait and terrace selfie are newly generated illustrations of one
fictional adult woman. The user-provided picture was used only as a drawing-touch
reference; that picture is not embedded. Avatar and selfie are local WebP files
(about 81 KB and 147 KB). No app avatar, private photo or reference voice is used.

## Nu and the closing message

The literal text ＼ぬ／ flies in a fixed, nonblocking layer directly under body.
Each particle has its own trajectory, launch delay, duration, rotation, flutter,
size and color. A few larger pieces mix with smaller ones. One click produces
28; the footer produces 42 once; repeated clicks are capped at 72. Animations
are canceled when particles are removed, and completed particles are removed.
Each particle also has a bounded lifetime timer so suspended browser animation
completion cannot leave particles or infinite flutter animations behind.
Reduced motion uses a static acknowledgment.

The closing message is “ここまで見てくれてありがとう！” with a small drawn cue
toward the existing lower-right button. It uses a local 3.46 KB Hachi Maru Pop
subset at the real weight 400. Its SIL Open Font License is included. JK Gothic
font data is not redistributed because the reviewed FAQ does not clearly permit
that webfont delivery route.

Font source:
https://github.com/google/fonts/tree/main/ofl/hachimarupop

## Review and rollback

Local URL: http://127.0.0.1:4382/yumeko-anime-teaser/

Before this revision: checkpoint-before-concept-pv-polish (b09bef1).
Saved implementation: checkpoint-20261001-214811 (cabdfeb).
Final controls, cleanup and verification are saved by the handoff checkpoint
labelled "after concept PV, fictional data and presentation checks passed".

Browser verification outputs are kept locally under outputs/concept-polish and
outputs/concept-polish-visible. The final built client passes
scripts/verify-presentation-controls.mjs at 1440, 768, 390 and 320 pixels. All four
players and all thirteen chapters were checked for manual play/pause, visible
manual activation, viewport exit/reentry, hidden-tab pause, caption fit, 44-pixel
controls, no page movement, and one active player. The final test also checks the
AINE photo sequence, mobile BookVoice frame, repeated nu bursts capped at 72,
cleanup even when animations are artificially stalled, footer firing once,
reduced motion, and no horizontal overflow. It records no JavaScript errors,
failed local assets, external requests, microphone calls or localStorage writes.
Final screenshots and the test report are under outputs/final-controls.

The Pages build, TypeScript check, targeted lint and Git whitespace check pass.
A dedicated normal Chrome session also verified the desktop openings, titles,
actual UI sequence and full-screen nu coverage. The last normal-Chrome mobile
recheck was interrupted after that dedicated window became minimized and its
viewport/scroll position changed; it is not reported as a completed pass. Final
responsive verification uses an isolated headless browser and does not bring
the user's browser to the foreground.

Ignored work and output directories are not
included in the site source checkpoint.

No original app repository, database, account, setting, running service, device
configuration, user data or power setting is changed by this revision.
