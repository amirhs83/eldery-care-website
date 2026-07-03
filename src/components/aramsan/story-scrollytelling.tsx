"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toFa } from "@/lib/format";

const SCENES = [
  "پدر برای قدم زدن از خانه خارج می‌شود.",
  "ردیاب روی ایستگاه شارژ کنار در جا مانده است.",
  "ایستگاه هوشمند کنار در متوجه می‌شود.",
  "یادآوری صوتی ملایم پخش می‌شود.",
  "خانواده مطلع می‌شوند.",
  "همه با آرامش به زندگی ادامه می‌دهند.",
];

// Total auto-play duration (~2.1s per scene — 2× the previous speed)
const DURATION = 12.5;

/** Map a segment of progress to a fade-in/hold/fade-out opacity. */
function useSegOpacity(
  p: MotionValue<number>,
  start: number,
  end: number,
  fade = 0.035
) {
  return useTransform(
    p,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0],
    { clamp: true }
  );
}

export function StoryScrollytelling() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });

  // Time-driven progress (0..1) — auto-plays, independent of scroll.
  // Auto-plays when the section enters the viewport; replay restarts it.
  const progress = useMotionValue(0);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (!inView) return;
    progress.set(0);
    const controls = animate(progress, 1, {
      duration: DURATION,
      ease: "linear",
    });
    return () => controls.stop();
  }, [inView, runId, progress]);

  const replay = () => setRunId((n) => n + 1);

  // Caption opacities — one per scene
  const caps = [
    useSegOpacity(progress, 0 / 6, 1 / 6),
    useSegOpacity(progress, 1 / 6, 2 / 6),
    useSegOpacity(progress, 2 / 6, 3 / 6),
    useSegOpacity(progress, 3 / 6, 4 / 6),
    useSegOpacity(progress, 4 / 6, 5 / 6),
    useSegOpacity(progress, 5 / 6, 6 / 6),
  ];

  // Active scene index (for dots)
  const activeScene = useTransform(progress, (v) =>
    Math.min(5, Math.floor(v * 6 + 0.0001))
  );

  // Father walks from the interior (right) toward the door (left) and exits.
  // He passes right by the charging dock (~x=210) on his way out.
  const figureX = useTransform(
    progress,
    [0, 0.08, 0.14, 0.18, 0.22, 1],
    [560, 400, 250, 140, 30, 20],
    { clamp: true }
  );
  const figureOpacity = useTransform(
    progress,
    [0, 0.18, 0.22, 0.26, 1],
    [1, 1, 0.85, 0, 0],
    { clamp: true }
  );

  // Tracker on the charging dock gets highlighted the moment he exits without it.
  const trackerHighlight = useTransform(
    progress,
    [0.15, 0.20, 0.32, 0.42],
    [0, 1, 1, 0.3],
    { clamp: true }
  );
  // Scene-2 "forgotten tracker" alert (badge + rays) — visible only in scene 2
  const alert2Opacity = useSegOpacity(progress, 0.17, 0.34, 0.03);

  // Door station green light — ramps up at scene 3
  const stationGlow = useTransform(
    progress,
    [0.30, 0.36, 0.62, 0.70],
    [0, 1, 1, 0.55],
    { clamp: true }
  );
  // Scene-3 detection pings (radar-style) — visible only in scene 3
  const detect3Opacity = useSegOpacity(progress, 0.33, 0.50, 0.03);

  // Sound waves — scene 4 (continuous loop while visible)
  const waveOpacity = useTransform(
    progress,
    [0.48, 0.54, 0.64, 0.68],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // Phone notification — scene 5 (the ONE terracotta flash moment)
  const notifOpacity = useTransform(
    progress,
    [0.64, 0.70, 0.80, 0.84],
    [0, 1, 1, 0.7],
    { clamp: true }
  );
  const flashOpacity = useTransform(
    progress,
    [0.66, 0.70, 0.74],
    [0, 0.22, 0],
    { clamp: true }
  );

  // Calm overlay — scene 6
  const calmOpacity = useTransform(
    progress,
    [0.82, 0.88, 1],
    [0, 1, 1],
    { clamp: true }
  );

  return (
    <section
      id="story"
      ref={ref}
      className="relative flex h-screen min-h-[640px] flex-col overflow-hidden bg-sand pt-16"
    >
        {/* Heading above the animated scenario */}
        <div className="relative z-20 mx-auto w-full max-w-3xl px-5 pt-2 text-center sm:pt-4">
          <span className="inline-block text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
            آرامسن در یک نگاه
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-2 text-teal font-extrabold leading-[1.15] tracking-tight"
            style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)", fontFamily: "var(--font-vazirmatn)" }}
          >
            دیگر نگران خروج بدون ردیاب نباشید.
          </motion.h2>
        </div>

        {/* Scene illustration */}
        <div className="relative flex-1">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #f3ece1 0%, #efe6d6 45%, #e7dcc8 100%)",
            }}
          />

          {/* The scene SVG — stays centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 800 500"
              className="h-full w-full max-w-5xl"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* ---------- DEFS ---------- */}
              <defs>
                <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f3ece1" />
                  <stop offset="100%" stopColor="#eadec8" />
                </linearGradient>
                <linearGradient id="windowLight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f5e8cf" />
                  <stop offset="55%" stopColor="#ecc89c" />
                  <stop offset="100%" stopColor="#c97845" stopOpacity="0.55" />
                </linearGradient>
                <radialGradient id="exteriorGlow" cx="50%" cy="55%" r="65%">
                  <stop offset="0%" stopColor="#5a7a72" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#0a1f1d" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f0e4ce" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#f0e4ce" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="deviceShine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3e6b62" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#1c3e3a" stopOpacity="0" />
                </linearGradient>
                <filter id="softblur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>

              {/* ---------- BACKGROUND ---------- */}
              {/* wall */}
              <rect x="0" y="0" width="800" height="400" fill="url(#wallGrad)" />
              {/* floor */}
              <rect x="0" y="400" width="800" height="100" fill="#e0d3bc" />
              {/* floor edge */}
              <line x1="0" y1="400" x2="800" y2="400" stroke="#d3c5ab" strokeWidth="1.5" />
              {/* warm lamp glow in the interior */}
              <circle cx="500" cy="180" r="200" fill="url(#lampGlow)" />

              {/* ---------- WINDOW (right wall, dusk light) ---------- */}
              <g>
                <rect x="618" y="116" width="126" height="146" rx="6" fill="#8a7a61" />
                <rect x="626" y="124" width="110" height="130" rx="2" fill="url(#windowLight)" />
                <line x1="681" y1="124" x2="681" y2="254" stroke="#8a7a61" strokeWidth="3" />
                <line x1="626" y1="189" x2="736" y2="189" stroke="#8a7a61" strokeWidth="3" />
                {/* sheer curtain hint */}
                <path d="M626 124 Q656 165 626 254 L626 124 Z" fill="#fffdf8" opacity="0.18" />
              </g>

              {/* ---------- DOORMAT at threshold ---------- */}
              <ellipse cx="128" cy="397" rx="60" ry="6" fill="#a89376" opacity="0.4" />

              {/* ---------- DOOR (left, open — exit to night) ---------- */}
              <g>
                {/* frame */}
                <rect x="66" y="140" width="118" height="260" rx="7" fill="#1c3e3a" />
                <rect x="66" y="140" width="118" height="260" rx="7" fill="none" stroke="#0f2624" strokeWidth="1.5" />
                {/* opening — dark exterior */}
                <rect x="74" y="148" width="102" height="252" rx="3" fill="#0a1f1d" />
                <rect x="74" y="148" width="102" height="252" rx="3" fill="url(#exteriorGlow)" />
                {/* threshold step */}
                <rect x="66" y="396" width="118" height="5" rx="1.5" fill="#a89376" opacity="0.55" />
              </g>

              {/* ---------- DOOR STATION (wall-mounted, left of door) ---------- */}
              <g>
                <rect x="34" y="246" width="26" height="52" rx="10" fill="#1c3e3a" />
                <rect x="34" y="246" width="26" height="52" rx="10" fill="url(#deviceShine)" />
                {/* speaker grille */}
                <line x1="41" y1="257" x2="53" y2="257" stroke="#0f2624" strokeWidth="1.5" opacity="0.6" />
                <line x1="41" y1="262" x2="53" y2="262" stroke="#0f2624" strokeWidth="1.5" opacity="0.6" />
                {/* status light (green when active) */}
                <motion.circle cx="47" cy="272" r="9" fill="#7c9473" style={{ opacity: stationGlow }} filter="url(#softblur)" />
                <motion.circle cx="47" cy="272" r="4" fill="#7c9473" style={{ opacity: stationGlow }} />
                {/* brand dot */}
                <circle cx="47" cy="289" r="2" fill="#c97845" opacity="0.7" />
              </g>

              {/* ---------- CHARGING DOCK (wall-mounted, right of door) + TRACKER ---------- */}
              <g>
                {/* mounting plate */}
                <rect x="184" y="324" width="52" height="6" rx="2" fill="#9c8a6f" />
                {/* cradle back lip */}
                <path d="M184 324 L184 314 Q184 309 189 309 L231 309 Q236 309 236 314 L236 324 Z" fill="#8a7a61" />
                {/* cradle interior shadow */}
                <ellipse cx="210" cy="318" rx="20" ry="3" fill="#000" opacity="0.18" />

                {/* tracker highlight glow (scene 2 — he left it behind) */}
                <motion.ellipse cx="210" cy="306" rx="34" ry="18" fill="#c97845" style={{ opacity: trackerHighlight }} filter="url(#softblur)" />
                <motion.ellipse cx="210" cy="306" rx="24" ry="14" fill="none" stroke="#c97845" strokeWidth="2" style={{ opacity: trackerHighlight }} />

                {/* the tracker, sitting in the cradle — vibrates in scene 2 to signal it was left behind */}
                <motion.g
                  animate={{ x: [0, 1.5, -1.5, 1.5, 0] }}
                  transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ellipse cx="210" cy="306" rx="18" ry="10.5" fill="#1c3e3a" />
                  <ellipse cx="210" cy="303" rx="18" ry="10.5" fill="#2f5650" />
                  <circle cx="210" cy="303" r="4.5" fill="#c97845" />
                  <circle cx="210" cy="303" r="2" fill="#de9862" />
                </motion.g>

                {/* scene-2 alert: radiating rays + bouncing exclamation badge above the tracker */}
                <motion.g style={{ opacity: alert2Opacity }}>
                  {/* radiating alert rays */}
                  <motion.g
                    animate={{ opacity: [0.25, 1, 0.25] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <line x1="210" y1="288" x2="210" y2="278" stroke="#c97845" strokeWidth="2.6" strokeLinecap="round" />
                    <line x1="188" y1="294" x2="180" y2="288" stroke="#c97845" strokeWidth="2.6" strokeLinecap="round" />
                    <line x1="232" y1="294" x2="240" y2="288" stroke="#c97845" strokeWidth="2.6" strokeLinecap="round" />
                  </motion.g>
                  {/* bouncing exclamation badge */}
                  <motion.g
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.75, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <circle cx="210" cy="262" r="12" fill="#c97845" />
                    <circle cx="210" cy="262" r="12" fill="none" stroke="#fffdf8" strokeWidth="1.5" opacity="0.5" />
                    <line x1="210" y1="257" x2="210" y2="263" stroke="#fffdf8" strokeWidth="2.8" strokeLinecap="round" />
                    <circle cx="210" cy="267" r="1.4" fill="#fffdf8" />
                  </motion.g>
                </motion.g>

                {/* charging LED (green, gentle ambient pulse) */}
                <motion.circle
                  cx="230" cy="320" r="5.5" fill="#7c9473" opacity="0.22"
                  animate={{ opacity: [0.1, 0.32, 0.1] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.circle
                  cx="230" cy="320" r="2.3" fill="#7c9473"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* power cable up the wall (subtle) */}
                <path d="M210 312 Q210 292 215 278 L215 210" stroke="#8a7a61" strokeWidth="1.5" fill="none" opacity="0.35" />
              </g>

              {/* ---------- SOUND WAVES from door station (scene 4) — continuous looping rings + speaker pulse ---------- */}
              <motion.g style={{ opacity: waveOpacity }}>
                {[0, 1, 2, 3].map((i) => (
                  <motion.circle
                    key={i}
                    cx="47"
                    cy="272"
                    fill="none"
                    stroke="#7c9473"
                    animate={{ r: [8, 48], opacity: [0.95, 0.45, 0], strokeWidth: [3, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
                  />
                ))}
                {/* speaker pulse — the status light itself pulses as it "speaks" */}
                <motion.circle
                  cx="47" cy="272" r="5" fill="#7c9473"
                  animate={{ scale: [1, 1.45, 1], opacity: [1, 0.55, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "47px 272px" }}
                />
              </motion.g>

              {/* ---------- DETECTION PINGS from door station (scene 3) — radar-style ---------- */}
              <motion.g style={{ opacity: detect3Opacity }}>
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={i}
                    cx="47"
                    cy="272"
                    fill="none"
                    stroke="#7c9473"
                    strokeWidth="2"
                    animate={{ r: [8, 54], opacity: [0.85, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.47, ease: "easeOut" }}
                  />
                ))}
              </motion.g>

              {/* ---------- THE FATHER (detailed elderly figure, walks + exits) ---------- */}
              <motion.g
                style={{ x: figureX, opacity: figureOpacity }}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }}
              >
                <g transform="translate(0 395)">
                  <ElderFigure />
                </g>
              </motion.g>

              {/* ---------- PHONE NOTIFICATION (scene 5) ---------- */}
              <motion.g style={{ opacity: notifOpacity }}>
                <rect x="560" y="78" width="164" height="70" rx="17" fill="#fffdf8" stroke="#e3d9c9" strokeWidth="1.5" />
                <circle cx="587" cy="113" r="14" fill="#c97845" />
                <path d="M581 113l5 5 8-9" stroke="#fffdf8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="610" y="96" width="96" height="7" rx="3.5" fill="#1c3e3a" />
                <rect x="610" y="111" width="70" height="5.5" rx="2.5" fill="#7c7167" />
                <rect x="610" y="123" width="50" height="5.5" rx="2.5" fill="#e3d9c9" />
              </motion.g>

              {/* ---------- CALM CHECKMARK (scene 6) ---------- */}
              <motion.g style={{ opacity: calmOpacity }}>
                <circle cx="400" cy="190" r="48" fill="#7c9473" opacity="0.16" />
                <circle cx="400" cy="190" r="30" stroke="#7c9473" strokeWidth="3.5" fill="none" />
                <path d="M386 191l9 9 19-19" stroke="#7c9473" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </motion.g>
            </svg>
          </div>

          {/* Terracotta flash (the earned accent moment) */}
          <motion.div
            aria-hidden
            style={{ opacity: flashOpacity }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 78% 25%, rgba(201,120,69,0.5) 0%, rgba(201,120,69,0) 55%)",
              }}
            />
          </motion.div>
        </div>

        {/* Caption + controls */}
        <div className="relative z-20 mx-auto w-full max-w-3xl px-5 pb-10 text-center sm:pb-14">
          {/* Caption stack — bigger text on a soft warm panel */}
          <div className="relative mx-auto flex min-h-[4.5rem] items-center justify-center rounded-2xl border border-divider/60 bg-warmwhite/85 px-6 py-4 shadow-[0_14px_40px_-22px_rgba(28,62,58,0.45)] backdrop-blur-md sm:min-h-[5rem] sm:px-8 sm:py-5">
            {SCENES.map((text, i) => (
              <motion.p
                key={i}
                style={{ opacity: caps[i] }}
                className="absolute inset-0 flex items-center justify-center px-6 text-balance text-[1.35rem] font-semibold leading-snug text-teal sm:px-8 sm:text-[1.7rem]"
              >
                {text}
              </motion.p>
            ))}
          </div>

          {/* Scene dots */}
          <div className="mt-5 flex items-center justify-center gap-2.5">
            <SceneDots progress={progress} active={activeScene} />
          </div>

          {/* Replay control — always available so the story can be rewatched */}
          <div className="mt-5 flex justify-center">
            <button
              onClick={replay}
              className="inline-flex items-center gap-2 rounded-full border border-divider bg-warmwhite/90 px-4 py-2 text-[0.9rem] font-semibold text-teal backdrop-blur transition-all hover:-translate-y-0.5 hover:border-teal-light/40 hover:bg-warmwhite"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path
                  d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              دوباره ببین
            </button>
          </div>
        </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Elderly father figure — facing left, walking toward the door.       */
/* Detailed enough to read clearly as an older man: cane, glasses,      */
/* gray receding hair, short beard, teal coat, two legs + shoes.        */
/* Feet at local (0,0); the group is translated by the parent.          */
/* ------------------------------------------------------------------ */
function ElderFigure() {
  return (
    <g>
      {/* ground shadow */}
      <ellipse cx="0" cy="2" rx="30" ry="5" fill="#1c3e3a" opacity="0.18" />

      {/* cane — in front hand, tip on ground ahead */}
      <line x1="-24" y1="-44" x2="-33" y2="0" stroke="#8a7a61" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M-24 -44 Q-17 -48 -19 -39" stroke="#8a7a61" strokeWidth="3.5" fill="none" strokeLinecap="round" />

      {/* back leg (trailing) */}
      <path d="M5 -54 L2 -2" stroke="#2a231d" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="3" cy="0" rx="8" ry="3" fill="#1a1410" />

      {/* front leg (stepping forward) */}
      <path d="M-5 -54 L-12 -4" stroke="#2a231d" strokeWidth="9" strokeLinecap="round" />
      <ellipse cx="-12" cy="-2" rx="8" ry="3" fill="#1a1410" />

      {/* coat / body — slightly hunched forward */}
      <path d="M-14 -104 Q-17 -109 -5 -111 Q9 -111 14 -104 L18 -54 L-12 -54 Z" fill="#3e6b62" />
      {/* coat center seam */}
      <line x1="1" y1="-110" x2="2" y2="-54" stroke="#2f5650" strokeWidth="1.8" opacity="0.6" />
      {/* coat hem shadow */}
      <path d="M-12 -54 L18 -54 L17 -50 L-11 -50 Z" fill="#2f5650" opacity="0.5" />

      {/* back arm (swinging back slightly) */}
      <path d="M11 -100 Q16 -88 13 -72" stroke="#3e6b62" strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* front arm (sleeve reaching to cane) */}
      <path d="M-10 -102 Q-18 -78 -24 -46" stroke="#3e6b62" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* hand on cane */}
      <circle cx="-24" cy="-44" r="4" fill="#c9a37a" />

      {/* neck */}
      <rect x="-4" y="-117" width="8" height="7" fill="#c9a37a" />

      {/* head */}
      <circle cx="-1" cy="-128" r="14" fill="#c9a37a" />

      {/* hair — gray, receding hairline */}
      <path d="M-14 -130 Q-13 -140 -1 -141 Q10 -140 13 -132 Q9 -136 -1 -136 Q-11 -136 -14 -130 Z" fill="#b8b0a8" />

      {/* ear */}
      <circle cx="11" cy="-127" r="3" fill="#bc956e" />

      {/* glasses */}
      <circle cx="-6" cy="-127" r="4.5" fill="none" stroke="#2a231d" strokeWidth="1.5" />
      <circle cx="4" cy="-127" r="4.5" fill="none" stroke="#2a231d" strokeWidth="1.5" />
      <line x1="-1.5" y1="-127" x2="-0.5" y2="-127" stroke="#2a231d" strokeWidth="1.2" />
      <line x1="8.5" y1="-127" x2="13" y2="-126" stroke="#2a231d" strokeWidth="1.2" />

      {/* nose hint */}
      <path d="M-12 -127 Q-14 -124 -12 -123" stroke="#bc956e" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* mustache */}
      <path d="M-8 -120 Q-1 -116 5 -120" stroke="#b8b0a8" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* short beard */}
      <path d="M-9 -118 Q-1 -110 6 -118 Q3 -114 0 -114 Q-3 -114 -9 -118 Z" fill="#b8b0a8" opacity="0.85" />
    </g>
  );
}

function SceneDots({
  progress,
  active,
}: {
  progress: MotionValue<number>;
  active: MotionValue<number>;
}) {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <SceneDot key={i} index={i} active={active} />
      ))}
      <ProgressNumber progress={progress} />
    </>
  );
}

function SceneDot({
  index,
  active,
}: {
  index: number;
  active: MotionValue<number>;
}) {
  const opacity = useTransform(active, (v) => (v === index ? 1 : 0.3));
  const width = useTransform(active, (v) => (v === index ? 28 : 8));
  return (
    <motion.span
      style={{ opacity, width }}
      className="h-2 rounded-full bg-teal"
    />
  );
}

function ProgressNumber({ progress }: { progress: MotionValue<number> }) {
  const label = useTransform(progress, (v) => {
    const idx = Math.min(6, Math.max(1, Math.floor(v * 6) + 1));
    return `${toFa(idx)} / ${toFa(6)}`;
  });
  return (
    <motion.span className="ms-2 text-[0.78rem] font-semibold text-muted-ink nums-fa">
      {label}
    </motion.span>
  );
}
