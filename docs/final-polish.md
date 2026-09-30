# Final presentation polish

The original outlined Japanese headline, character artwork, tilted frames and
pink/yellow/purple palette stay in place. Japanese project prose is 16px at 1.95
line height; disclosure and playback notes are 12px. Existing local Japanese
sans-serif fallbacks remain, avoiding a large CJK font download.

The short decorative `＼ぬ／` accents use Mochiy Pop One at its real weight 400.
Only those three characters are included in a 1,064-byte WOFF2, served locally.
The SIL Open Font License is included in `public/fonts/`. The author describes
the face as a rounded POP/manga typeface:
https://github.com/fontdasu/Mochiypop
https://github.com/google/fonts/tree/main/ofl/mochiypopone

Each click sends 24 colored text particles from the button into a spread across
the viewport. An upward arc settles into a slower fall; a nested wrapper gives
the letters gentle alternating rotation. Only transform and opacity animate.
The fixed overlay does not block interaction or create page overflow. At most
72 particles remain, with animation-end cleanup and a 5.1-second fallback.
Reduced motion uses the static acknowledgment and disables automatic videos.

The motion follows the performance and accessibility principles in:
https://web.dev/articles/animations-guide
https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html

The four approved real-UI demos, fictional data and manual video controls are
unchanged. `scripts/verify-final-polish.mjs` measures viewport coverage, captures
desktop/mobile screenshots and checks the font, cleanup, keyboard activation,
reduced motion and public media responses. Set `SHOWCASE_URL` to verify the
deployed GitHub Pages version after the workflow succeeds.
