"use client";

import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { toFa } from "@/lib/format";

const SCENES = [
  "پدر برای قدم زدن از خانه خارج می‌شود.",
  "ردیاب روی میز جا مانده است.",
  "ایستگاه هوشمند کنار در متوجه می‌شود.",
  "یادآوری صوتی ملایم پخش می‌شود.",
  "خانواده مطلع می‌شوند.",
  "همه با آرامش به زندگی ادامه می‌دهند.",
];

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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Caption opacities — one per scene
  const cap0 = useSegOpacity(scrollYProgress, 0 / 6, 1 / 6);
  const cap1 = useSegOpacity(scrollYProgress, 1 / 6, 2 / 6);
  const cap2 = useSegOpacity(scrollYProgress, 2 / 6, 3 / 6);
  const cap3 = useSegOpacity(scrollYProgress, 3 / 6, 4 / 6);
  const cap4 = useSegOpacity(scrollYProgress, 4 / 6, 5 / 6);
  const cap5 = useSegOpacity(scrollYProgress, 5 / 6, 6 / 6);
  const caps = [cap0, cap1, cap2, cap3, cap4, cap5];

  // Active scene index (for dots)
  const activeScene = useTransform(scrollYProgress, (v) => {
    return Math.min(5, Math.floor(v * 6 + 0.0001));
  });

  // Figure (father) walks from inside (x=360) to the door (x=150) over scene 1,
  // then exits (x=40, fades out) during the transition into scene 2.
  const figureX = useTransform(
    scrollYProgress,
    [0, 0.1, 0.16, 0.21, 1],
    [360, 210, 150, 40, 40],
    { clamp: true }
  );
  const figureOpacity = useTransform(
    scrollYProgress,
    [0, 0.14, 0.18, 0.22, 1],
    [1, 1, 0.85, 0, 0],
    { clamp: true }
  );

  // Door station green glow — ramps up at scene 3
  const stationGlow = useTransform(
    scrollYProgress,
    [0.28, 0.34, 0.62, 0.7],
    [0, 1, 1, 0.55],
    { clamp: true }
  );

  // Sound waves — scene 4
  const waveOpacity = useTransform(
    scrollYProgress,
    [0.46, 0.52, 0.64, 0.68],
    [0, 1, 1, 0],
    { clamp: true }
  );
  const waveScale = useTransform(scrollYProgress, [0.5, 0.66], [0.6, 1.4], {
    clamp: true,
  });

  // Tracker highlight on the table — scene 2
  const trackerHighlight = useTransform(
    scrollYProgress,
    [0.14, 0.2, 0.3, 0.36],
    [0, 1, 1, 0.25],
    { clamp: true }
  );

  // Phone notification — scene 5 (the ONE terracotta flash moment)
  const notifOpacity = useTransform(
    scrollYProgress,
    [0.64, 0.7, 0.8, 0.84],
    [0, 1, 1, 0.7],
    { clamp: true }
  );
  // Brief warm flash over the whole scene at the notification moment
  const flashOpacity = useTransform(
    scrollYProgress,
    [0.66, 0.7, 0.74],
    [0, 0.22, 0],
    { clamp: true }
  );

  // Calm overlay — scene 6
  const calmOpacity = useTransform(
    scrollYProgress,
    [0.82, 0.88, 1],
    [0, 1, 1],
    { clamp: true }
  );

  // Replay button visible near end
  const replayOpacity = useTransform(
    scrollYProgress,
    [0.9, 0.97, 1],
    [0, 1, 1],
    { clamp: true }
  );

  function replay() {
    const el = ref.current;
    if (!el) return;
    const top = el.offsetTop;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <section
      id="story"
      ref={ref}
      className="relative bg-sand"
      style={{ height: "720vh" }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        {/* Scene illustration */}
        <div className="relative flex-1">
          {/* warm dusk interior gradient backdrop */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #f3ece1 0%, #efe6d6 45%, #e7dcc8 100%)",
            }}
          />
          {/* evening exterior glow beyond the door (left side) */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-0 w-[34%]"
            style={{
              background:
                "linear-gradient(90deg, rgba(28,62,58,0.92) 0%, rgba(28,62,58,0.55) 60%, rgba(28,62,58,0) 100%)",
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
              {/* Floor line */}
              <line
                x1="0"
                y1="400"
                x2="800"
                y2="400"
                stroke="#d8cdb8"
                strokeWidth="1.5"
              />

              {/* Door frame on the left */}
              <rect
                x="70"
                y="150"
                width="120"
                height="250"
                rx="8"
                fill="#1c3e3a"
                opacity="0.92"
              />
              <rect
                x="78"
                y="158"
                width="104"
                height="234"
                rx="5"
                fill="#0f2624"
              />
              {/* Door handle */}
              <circle cx="160" cy="285" r="3.5" fill="#de9862" />

              {/* Wall-mounted door station device (left of door) */}
              <g>
                <rect
                  x="40"
                  y="250"
                  width="22"
                  height="44"
                  rx="8"
                  fill="#1c3e3a"
                />
                {/* status light */}
                <motion.circle
                  cx="51"
                  cy="268"
                  r="4"
                  fill="#7c9473"
                  style={{ opacity: stationGlow }}
                />
                <motion.circle
                  cx="51"
                  cy="268"
                  r="9"
                  fill="#7c9473"
                  style={{ opacity: stationGlow }}
                  filter="url(#softblur)"
                />
              </g>

              {/* Table (right side) */}
              <g>
                <rect x="560" y="360" width="160" height="10" rx="3" fill="#9c8a6f" />
                <rect x="572" y="370" width="8" height="40" rx="2" fill="#8a7a61" />
                <rect x="700" y="370" width="8" height="40" rx="2" fill="#8a7a61" />
              </g>

              {/* Tracker on the table (highlighted in scene 2) */}
              <g>
                <motion.g style={{ opacity: trackerHighlight }}>
                  <ellipse
                    cx="640"
                    cy="352"
                    rx="34"
                    ry="8"
                    fill="#c97845"
                    opacity="0.25"
                  />
                </motion.g>
                <ellipse cx="640" cy="350" rx="20" ry="7" fill="#1c3e3a" />
                <ellipse cx="640" cy="347" rx="20" ry="7" fill="#2f5650" />
                <circle cx="640" cy="347" r="4" fill="#c97845" />
              </g>

              {/* Sound waves from the door station (scene 4) */}
              <motion.g style={{ opacity: waveOpacity }}>
                <motion.circle
                  cx="51"
                  cy="268"
                  r="14"
                  stroke="#7c9473"
                  strokeWidth="2"
                  style={{ scale: waveScale, transformOrigin: "51px 268px" }}
                />
                <motion.circle
                  cx="51"
                  cy="268"
                  r="24"
                  stroke="#7c9473"
                  strokeWidth="1.5"
                  style={{ scale: waveScale, opacity: 0.6, transformOrigin: "51px 268px" }}
                />
              </motion.g>

              {/* The father (abstract figure) */}
              <motion.g style={{ x: figureX, opacity: figureOpacity }}>
                {/* shadow */}
                <ellipse cx="0" cy="395" rx="26" ry="5" fill="#1c3e3a" opacity="0.18" />
                {/* body */}
                <path
                  d="M-14 360 q0 -34 14 -34 q14 0 14 34 v28 h-28 z"
                  fill="#3e6b62"
                />
                {/* head */}
                <circle cx="0" cy="312" r="13" fill="#c9a37a" />
                {/* gentle warm scarf hint */}
                <path d="M-9 322 q9 6 18 0" stroke="#c97845" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
              </motion.g>

              {/* Phone notification in corner (scene 5) */}
              <motion.g style={{ opacity: notifOpacity }}>
                <rect
                  x="610"
                  y="90"
                  width="150"
                  height="64"
                  rx="14"
                  fill="#fffdf8"
                  stroke="#e3d9c9"
                  strokeWidth="1.5"
                />
                <circle cx="634" cy="122" r="12" fill="#c97845" />
                <path
                  d="M629 122l4 4 7-8"
                  stroke="#fffdf8"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect x="654" y="108" width="86" height="6" rx="3" fill="#1c3e3a" />
                <rect x="654" y="122" width="64" height="5" rx="2.5" fill="#7c7167" />
                <rect x="654" y="132" width="48" height="5" rx="2.5" fill="#e3d9c9" />
              </motion.g>

              {/* Calm checkmark (scene 6) */}
              <motion.g style={{ opacity: calmOpacity }}>
                <circle cx="640" cy="200" r="40" fill="#7c9473" opacity="0.18" />
                <circle
                  cx="640"
                  cy="200"
                  r="26"
                  stroke="#7c9473"
                  strokeWidth="3"
                />
                <path
                  d="M628 201l8 8 16-16"
                  stroke="#7c9473"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.g>

              <defs>
                <filter id="softblur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>
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
        <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-14 text-center">
          {/* Caption stack */}
          <div className="relative h-20 sm:h-16">
            {SCENES.map((text, i) => (
              <motion.p
                key={i}
                style={{ opacity: caps[i] }}
                className="absolute inset-0 text-balance text-[1.15rem] font-medium leading-relaxed text-teal sm:text-[1.35rem]"
              >
                {text}
              </motion.p>
            ))}
          </div>

          {/* Scene dots */}
          <div className="mt-5 flex items-center justify-center gap-2.5">
            <SceneDots progress={scrollYProgress} active={activeScene} />
          </div>

          {/* Replay control — appears near the end */}
          <motion.div
            style={{ opacity: replayOpacity }}
            className="mt-6 flex justify-center"
          >
            <button
              onClick={replay}
              className="inline-flex items-center gap-2 rounded-full border border-divider bg-warmwhite/80 px-4 py-2 text-[0.88rem] font-medium text-teal backdrop-blur transition-all hover:-translate-y-0.5 hover:border-teal-light/40"
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
          </motion.div>
        </div>
      </div>
    </section>
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
      {/* show numeric progress like ۳/۶ */}
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
