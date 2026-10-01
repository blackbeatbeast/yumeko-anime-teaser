# Local responsive and finale follow-up

Baseline: approved public commit 9a004ca03be77a445b91dd0b19883fd928bdd9df.
This follow-up is local review only; it has not been pushed or deployed.

The baby-log opening explicitly uses two unbroken title lines: 育児 / ログ.
Opening type scales against the demo frame width. The heavy outline, existing
colors and project-specific opening stories are retained.

The closing message now enters in two gently staggered phrases with a short
rise and settling motion. The handwritten cue follows and the existing nu
burst starts after the words begin appearing. The entrance runs once per page
visit and never changes scroll position. With reduced motion, words are
immediately visible and static. Server-rendered text also stays visible when
JavaScript is unavailable.

The slogan strip measures one unit, repeats it until a group exceeds the
viewport, and renders two identical groups. Translating by one exact group
makes the loop continuous. Resizing and font readiness recalculate length and
duration. It pauses outside view or in a hidden document, and remains static
with reduced motion. The original words, nu text and palette remain intact.

The hero's lower text and scroll link have a shared area with space for the
fixed nu button. Both the nu card and rotated portrait stay above that area.
Short desktop heights previously caused the portrait to overlap the label at
1000x320, 1280x360 and 1440x360; responsive minimum heights reserve space for its
rotated bounds. At intermediate widths the portrait scales inside its column.
Decorative circles can retain their intentional edge crop; content is not
hidden to conceal overflow. Footer padding is smaller on short screens.

The centered demo selection accounts for viewport height so a tall native UI
can still animate when centered in a low-height window. Manual pause, chapter
selection, free scrolling and a single selected demonstration remain intact.

Local preview: http://127.0.0.1:4382/yumeko-anime-teaser/

Verification: scripts/verify-responsive-followup.mjs covers 33 normal-motion
configurations across widths 320-3440, breakpoint-adjacent widths, heights down
to 195, and 125/150/200-percent zoom-equivalent layouts. Zoom coverage uses the
corresponding CSS viewport and device scale, not operating-system settings or
the user's browser. It checks title groups, ticker coverage at five cycle
phases, card/portrait/label intersections, footer entry, cleanup and no overflow.
Reduced motion is checked separately in a 320x360 viewport. Outputs and
screenshots are under outputs/responsive-followup. Build, type and targeted
lint checks and the existing four-width/13-chapter presentation regression are
also used. Final results are recorded with the handoff checkpoint.

The final 33-case matrix passes, including reduced motion, with no JavaScript
errors or failed local assets. Six live resizes in one page pass (320 through
3440 pixels), as do a runtime reduced-motion preference change and the
JavaScript-disabled footer. The three reproduced short-height collisions now
have no intersections. The final Pages build, TypeScript check and targeted
lint also pass. Screenshots include baby-title-320.png, hero-641.png,
ticker-wide-short.png, thanks-entering-mobile.png and footer-2048-328.png.
The final built client also passes all thirteen chapter controls at 1440, 768,
390 and 320 pixels: manual play/pause/replay, viewport switching, hidden-tab
pause, no forced page movement, one selected demo, reduced motion and particle
cleanup. Those results are in outputs/final-controls/verification.json.
Matched before/after captures from public 9a004ca and the local follow-up are
before/after-ticker-2048-195.png and before/after-footer-2048-328.png in the
responsive output folder.

Original app sources, data, accounts, services and microphone/device settings
are untouched. The known live BOOKWALKER trial-runtime limitation remains in
docs/concept-polish-local.md. No Downloads files were read for this follow-up.

Rollback: checkpoint-before-responsive-footer-followup (9a004ca).
