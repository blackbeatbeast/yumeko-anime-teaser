# AINE operation animation study

Local review only. The published GitHub Pages version remains `9cc75a1`.
This study replaces only AINE's screenshot video. The other three demos stay
in place; surrounding production captions have been removed from the exhibit.

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

The 11.8-second scene follows a visible sequence: focus the field, type the
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
