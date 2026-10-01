# AINE operation animation study

This earlier study is superseded by [the current concept revision](concept-polish-local.md).
The current local draft includes newly generated character art, call photos,
BookVoice UI screenshots, concept openings, organic Nu and the closing message.

Local review only. The published GitHub Pages version remains `9cc75a1`.
The current local draft expands AINE and the childcare log into three feature
chapters per work, and IrodoriMicBridge into four. BookVoice still uses the previously
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

`node scripts/verify-feature-pv.mjs` checks all ten feature chapters at
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

The Library materialization helper fails on Windows because Python's
os.setxattr is unavailable. The user then explicitly supplied one local image
path. Only that file was read and its pixels were inspected. It is the style
reference, not either new generated character asset. The reference itself is
not copied into the site. The parent generated an avatar and a matching outing
selfie; their exact local save paths are still pending. The current local
`sora-avatar.webp` is the earlier generated placeholder, not the final artwork.

## Call story and abstract openings

MicBridge's fourth chapter is an editorial use-case diagram, using the native
dark interface at its center. A speaker's amber waveform becomes recognized
text; a distinct teal waveform starts after a generation phase, then the
virtual microphone delivers it to a fictional call partner. Discord is a
possible receiving app, not an integration session or endorsed partner.
The sequence does not assert instantaneous conversion or measured latency.
No Discord account, service, setting or real person is involved.

Each of the four exhibits has an approximately two-second, independently
drawn abstract opening. Conversation shapes, paper fragments, rounded record
shapes and changing waveforms use the site's existing palette and outlines.
Openings pause with the presentation, reveal the UI without changing its
height, and are skipped for reduced motion. Chapter selection goes directly
to the selected operation; Replay includes the opening.
`node scripts/verify-openings.mjs` verifies all four at 1440, 390 and 320 pixels.

The audio-call text composer follows CallView's existing send path with the
same call ID. AINE Beta's separate source reference verifies the requested
photo linkage: minimizing retains the call component; the message timeline
renders `SessionPhotos` from call transcripts under “通話の写真”. Photos do
not appear directly inside the audio-call transcript. Native mini-call bar,
photo card and image lightbox styles are reproduced in a separate scene.
`lib/character-assets.ts` keeps this scene disabled until the requested
fictional selfie is actually available. This pending branch has not yet been
visually tested with final assets; the current preview runs the verified
text-call sequence. Native image generation also pauses audio processing;
the planned presentation includes this state instead of implying simultaneous
GPU generation and uninterrupted speech. No original Beta app is launched.

## Review state

The original normal and Beta AINE repositories are clean in read-only Git
checks. Original BookVoice controls/styles match their previously captured
copies. App repository revisions may move independently of this site task.
The task-owned preview serves HTTP 200 at port 4382 on loopback. A dedicated
normal Chrome profile was verified visible (Chrome 154, 2560×1305); evidence
is in ignored `outputs/feature-pv-visible/`. No new remote operation occurred.

The missing BookVoice material is a current, fully rendered BOOK☆WALKER book
page and its actual page/toolbar transitions inside the embedded reader.
Public product/trial-link geometry and the public interface shell are known;
they do not prove that body-viewer operation. The old BookVoice video remains
until that source reference is resolved. It must not be described as an
updated faithful BOOK☆WALKER operation demo or audio-engine verification.
