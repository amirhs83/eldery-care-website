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
