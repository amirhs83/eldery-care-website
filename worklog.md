---
Task ID: 1
Agent: main (Z.ai Code)
Task: Build premium pre-launch waitlist landing page for آرامسن (Aramsan) — Persian RTL, Vazirmatn, deep-teal/terracotta/warm-ivory palette, full section architecture, scrollytelling, interactive door-station sim, waitlist with referral mechanics.

Work Log:
- Set up foundation: Vazirmatn font (weights 300–900) via next/font, `lang="fa" dir="rtl"`, Persian SEO metadata.
- Rewrote globals.css with the revised palette (ivory #FAF6EF, sand #F3ECE1, teal #1C3E3A, terracotta #C97845, safe green #7C9473), warm custom scrollbar, reduced-motion support.
- Prisma schema: `WaitlistEntry` (fullName, phone, email?, referralCode unique, referredBy?) + `db:push`.
- API `/api/waitlist` (POST): validates Iranian phone, generates unique 6-char referral code, records referral, returns position + referralCode. GET returns total count.
- Generated 2 product images via z-ai image-generation (hero tracker, door station) → public/products/.
- Built 16 sections as composable components in src/components/aramsan/:
  - Navbar (sticky, blur-on-scroll, 1px terracotta scroll-progress line via useScroll+useSpring)
  - Hero (asymmetric 7+5 grid, floating product with ambient warm glow, trust indicator)
  - StoryScrollytelling (pinned 720vh section, scroll-scrubbed 6-scene SVG sequence with figure walk-out, door-station green glow, sound waves, terracotta notification flash, calm checkmark, scene dots + "دوباره ببین" replay)
  - MidScrollCta (slim inline phone capture right after story)
  - ProductShowcase (asymmetric horizontal drag-scroll with custom SVG use-case illustrations)
  - Features (flagship تشخیص سقوط spotlight + 3 icon-forward cards + 4 text-forward divided rows — no uniform 8-grid)
  - DoorStation (dark teal cinematic, interactive "شبیه‌سازی کن" sequence: detect→notify→confirm with green light, sound waves, terracotta phone notification)
  - AiSection (Family Peace Score animated gauge centerpiece + flowing timeline, distinct from Features)
  - AppPreview (5 realistic HTML/CSS phone mockups: Live Map, Safe Zones, Alerts, Activity, Dashboard)
  - Statistics (animated counters, once-on-view, tabular Persian nums)
  - Comparison (linear table, terracotta-free, highlight sweep down آرامسن column)
  - WallOfLove (masonry of pilot-family quotes with specific details + small stats)
  - Waitlist (form → API → calm expanding-glow success modal with position + referral share link + WhatsApp/Telegram/copy)
  - Faq (accordion, first item expanded by default)
  - StickyMobileCta (mobile-only bar appears after hero, safe-area aware)
  - Footer (deep teal, links, copyright)
- Composed page.tsx with min-h-screen flex-col + flex-1 main + footer (sticky-footer rule).
- Fixed SSR bug: navbar useTransform accessed `document` during render → 500; replaced with useScroll() (SSR-safe) + scaleX progress bar.
- Fixed hooks-rules lint error (renamed segOpacity→useSegOpacity) and JSX `transform-origin`→`transformOrigin`.
- Lint passes clean.

Stage Summary:
- Dev server runs on :3000, GET / 200, no runtime errors.
- Agent-browser verified end-to-end:
  • All 16 sections render in correct order (9 H2s + hero H1 confirmed).
  • Waitlist form → API 200 → success modal shows "شما ۱مین خانواده" + referral link `?ref=KGTL29` + WhatsApp/Telegram share.
  • Door-station simulation progresses detect→notify→confirm (button becomes "تأیید خروج").
  • Story scrollytelling responds to scroll (۲/۶ at 25%, ۴/۶ at 50%).
  • Mobile: no horizontal overflow; sticky CTA bar appears after hero.
  • Footer present at bottom; sticky-footer layout intact.
- Self-audit checklist (no AI-template tells): Vazirmatn only, no purple/blue gradients, no two consecutive same grid, varied card radii, terracotta <5% viewport, specific hero headline, mid-scroll + sticky mobile CTAs, true scroll-scrubbed story.

---
Task ID: 2
Agent: main (Z.ai Code)
Task: Improve the story (scrollytelling) section — (1) tracker must sit on a charging station next to the door (plot-critical), (2) the elderly father figure must look clearly human, (3) general polish.

Work Log:
- Rewrote src/components/aramsan/story-scrollytelling.tsx scene SVG entirely:
  - Removed the old "table with tracker on the right" — tracker no longer sits on a table.
  - Added a wall-mounted CHARGING DOCK just to the right of the door (x≈210): mounting plate, cradle with back lip, interior shadow, the tracker pebble sitting in the cradle, a green charging LED that gently pulses (framer animate), and a subtle power cable running up the wall.
  - Tracker highlight (terracotta glow + ring) now targets the dock location and ramps at scroll 0.15→0.20 (right as the father passes the dock and exits without it).
  - Updated scene-2 caption to "ردیاب روی ایستگاه شارژ کنار در جا مانده است." to match the new visual.
- Rebuilt the father figure as a detailed ElderFigure component (clearly human, clearly elderly):
  - Head with gray receding hair, ear, glasses (two lenses + bridge + temple), nose, mustache, short beard.
  - Teal coat (hunched-forward silhouette) with center seam + hem shadow.
  - Two distinct legs with shoes (walking pose, one stepping forward).
  - Front arm (sleeve) reaching to a cane; back arm swinging.
  - Cane with curved handle in the front hand, tip on the ground ahead.
  - Ground shadow.
  - Figure is ~130px tall so detail (glasses/cane/hair) reads at display scale.
  - Added a subtle vertical "walking bob" (±3px, 0.7s) via framer animate so he walks instead of sliding.
  - Walk path adjusted: x 560→400→250(past dock)→140(door)→30(exit); fades out by scene 3.
- Scene polish:
  - Added a window on the right wall with warm dusk-light gradient + mullions + sheer curtain hint.
  - Added a doormat at the threshold and a warm lamp-glow radial in the interior.
  - Door now reads as an open doorway (frame + dark exterior with faint teal porch-light radial).
  - Door station device refined (speaker grille lines, brand dot, green status light with blur glow).
  - Added a third, larger/fainter sound-wave ring for a richer scene-4 moment.
  - Calm checkmark (scene 6) repositioned to center as a resolution mark.
- Kept all scroll mechanics (6 scenes, 720vh, useSegOpacity, SceneDots/SceneDot/ProgressNumber, replay button) intact; only adjusted a few motion-value timings to align with the new figure walk + tracker-highlight moments.

Stage Summary:
- Lint clean; dev server GET / 200, no runtime errors.
- VLM (glm-4.6v) verified all three fixes from screenshots:
  • Scene 1: "elderly person with head (white hair), glasses, body (teal shirt, dark pants), arms, legs… clearly depicts an elderly individual" + "charging station/dock with a small device (tracker) next to the door".
  • Scene 2: tracker "highlighted with a glow… orange" + "charging dock is next to the door (right of it)".
  • Scene 5: phone notification with terracotta circle + checkmark visible; father figure correctly absent (exited).
- Scene indicators correctly advance with scroll (۱/۶ → ۲/۶ → ۴/۶ → ۵/۶).

---
Task ID: 3
Agent: main (Z.ai Code)
Task: Make the story section auto-play (independent of scroll), medium speed, and enlarge the caption with a background.

Work Log:
- src/components/aramsan/story-scrollytelling.tsx — converted from scroll-scrubbed to time-driven auto-play:
  - Replaced `useScroll()` + `scrollYProgress` with a `useMotionValue(0)` named `progress`, animated 0→1 over `DURATION = 25`s (≈4.2s/scene — not too fast, not too slow) via framer-motion `animate(progress, 1, { duration, ease: "linear" })`.
  - Auto-starts when the section enters the viewport (`useInView(ref, { amount: 0.45 })`); the effect re-runs on inView toggle or replay.
  - Replay: `runId` state; clicking "دوباره ببین" increments it → effect cleanup stops the old animation and starts a fresh 0→1 run.
  - Replaced every `scrollYProgress` reference with `progress` (figure walk, tracker highlight, door-station glow, sound waves, phone notification, terracotta flash, calm checkmark, scene dots, progress number).
  - Removed the 720vh height + sticky wrapper — section is now a single `h-screen min-h-[640px]` viewport. Page dropped from ~20 viewports to 12.
  - Replay button is now always visible (removed the late-fade-in) so users can restart anytime.
- Caption redesign:
  - Wrapped the caption stack in a warm panel: `rounded-2xl bg-warmwhite/85 backdrop-blur-md border border-divider/60 shadow-…` with `px-6 py-4 sm:px-8 sm:py-5`.
  - Enlarged text from `text-[1.15rem] sm:text-[1.35rem] font-medium` → `text-[1.35rem] sm:text-[1.7rem] font-semibold`.
  - Caption now centers vertically in the panel (`flex items-center justify-center`), min-height 4.5rem / 5rem.

Stage Summary:
- Lint clean; dev server GET / 200, no errors.
- Agent-browser verified the full auto-play timeline without scrolling: 3s→۱/۶, 9s→۳/۶, 17s→۵/۶, 26s→۶/۶ (story completes on its own).
- Replay verified: ۶/۶ → click → ۲s: ۱/۶ → ۷s: ۲/۶ → ۱۲s: ۳/۶ (clean restart).
- VLM confirmed caption: "sits on a visible background panel/card… light-colored (off-white/cream) box behind the text… large and highly readable… bold".
- Scrolling past the story still flows naturally into the Product Showcase section.
