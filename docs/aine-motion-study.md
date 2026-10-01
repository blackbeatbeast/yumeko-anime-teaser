# AINE operation animation study

Local review only. The published GitHub Pages version remains `9cc75a1`.
The current local draft expands AINE, the childcare log and IrodoriMicBridge
into three feature chapters per work. BookVoice still uses the previously
approved video while its current BOOK☆WALKER reader reference is investigated.
The new draft has not been pushed or deployed.

## Source and scope

The conversation workspace follows AINE's existing `App.tsx`, `ConversationView.tsx`,
`styles.css` and `controls.css`: composer, message bubbles, streaming draft and
typing indicator. The world banner
uses the same existing cafe artwork. The layout is a readable crop of the
conversation pane; sidebar and operating-system chrome are outside the crop.
Colors, Japanese UI font, bubble radii, green send button and message composer
follow the source. The sending state changes to a stop square, as in Composer.
`useConversation.ts` verifies incremental draft text through `acceptDelta`.

The names, story, times and replies are newly authored. The new component has
no app imports, bridge, store, authentication, persistence or service calls.
Original application files, settings and data are untouched. The operation
animation is a presentation script, not a live AI response or backend test.
Source fixtures remain in ignored `work/real-ui/`; they are not bundled.

## Presentation

The first 11.8-second scene follows a visible sequence: focus the field, type the
question, move the pointer to Send, press, show the outgoing bubble and waiting
indicator, reveal the reply, then hold the result. It runs once per visit.
Message arrival uses a restrained spring; typing and reply pace give the
result time to read. No screenshot pan, zoom or fade slideshow is used.
The original teaser frame, purple header, black outline and tilted composition
are retained. No production notes or fictional-data labels appear below it.

Videos and the HTML animation share viewport selection. Only the nearest
eligible presentation runs. Manual pause persists nearby; complete exit allows
a new visit. A hidden document pauses the scene. Replay resets its DOM clock.
Reduced motion shows a finished static conversation and offers instant steps.

## Review

Run `npm run build:pages`, then the existing local Pages preview. Open:
`http://127.0.0.1:4382/yumeko-anime-teaser/#aine-motion-demo`

`node scripts/verify-aine-motion.mjs` checks desktop and touch/mobile widths,
typed input, waiting state, partial/full reply, layout stability, manual pause,
reentry, repeated replay, reduced-motion steps and video coordination. Evidence
is kept in ignored `outputs/aine-motion/`. Browser checks use a separate
headless Chrome profile on this Windows PC, without touching the user's tabs.
Physical iPhone/Safari and original application engines are not tested.

## Current feature draft

`FeatureDemo` supplies a shared presentation clock and accessible chapter,
pause and replay controls. AINE now also shows the existing audio-call start
dialog, microphone toggle and transcript, plus the existing branch dialog.
Its character image is a static original illustration; this does not add
camera, video-call or animated facial capabilities to AINE.

The childcare chapters follow the existing quick-log grid and milk sheet,
sleep-start/end controls and paper view. MicBridge follows the existing dark
Tk interface: raw/converted/muted modes, text player, expression preset and
strength controls. Meter, synthesis and playback states are presentation
fixtures. No device or model runs.

All names, conversation text, log records and book passages are invented.
Only isolated source copies were read. BookVoice's original control/style
files still match the capture copies. AINE's current repository is clean but
its App.tsx has subsequently changed in a separate committed revision, so a
blanket claim that all current original hashes match the older copies would
be incorrect. This site task has not written any original application file.

`node scripts/verify-feature-pv.mjs` checks all three chapter presentations at
1440, 768, 390 and 320 pixels. The mobile chapter-selection scroll issue was
fixed by centering the selected workspace. TypeScript and targeted lint pass.
Screenshots and detailed checks remain in ignored `outputs/feature-pv/`.

## Pending source and artwork references

BOOK☆WALKER's public product page and trial link positions were captured.
The trial navigation reaches the official viewer, but current viewer DOM and
screenshot reads time out in both isolated headless and normal Chrome. No
account, purchase, protected book text or production app session was used.
An isolated copy of the public viewer HTML/CSS, with its runtime removed and
newly authored book pages, can render the native toolbar. It is a UI-only
reference, not evidence of a live reader or successful audio generation.

The user supplied a Library image as an illustration-style reference.
The official materialization helper currently fails on Windows because
Python's os.setxattr is unavailable. No final image file was installed and
its pixels have not been inspected. Image generation is available, but the
reference-based redraw is pending a working supported materialization path.
The current local `sora-avatar.webp` is the earlier generated placeholder,
not the requested final artwork. The reference itself must not be published.
