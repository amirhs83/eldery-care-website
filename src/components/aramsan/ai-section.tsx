"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { toFa } from "@/lib/format";

const FEATURES = [
  { icon: "wander", title: "تشخیص سرگردانی" },
  { icon: "anomaly", title: "رفتار غیرعادی" },
  { icon: "activity", title: "تحلیل فعالیت روزانه" },
  { icon: "predict", title: "پیش‌بینی خروج غیرمعمول" },
  { icon: "report", title: "گزارش هفتگی هوشمند" },
];

export function AiSection() {
  return (
    <section className="relative overflow-hidden bg-ivory py-16 sm:py-20">
      {/* ambient warm glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(240,228,206,0.7) 0%, rgba(250,246,239,0) 55%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        {/* Compact header: title + gauge side by side */}
        <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-[1fr_auto] sm:gap-12">
          <div>
            <span className="inline-block text-[0.82rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
              هوش مصنوعی
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-3 text-teal font-extrabold leading-[1.1] tracking-tight"
              style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.6rem)", fontFamily: "var(--font-vazirmatn)" }}
            >
              روزمره‌ی عزیزتان را می‌فهمد،
              <br />
              نه فقط ثبت می‌کند.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 max-w-md text-[0.98rem] leading-[1.8] text-muted-ink"
            >
              تنها وقتی چیزی خارج از روال عادی است، شما را مطلع می‌کند.
            </motion.p>
          </div>

          {/* Compact gauge */}
          <PeaceScoreGauge />
        </div>

        {/* Capabilities — compact icon chips, single row on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-divider bg-warmwhite px-3 py-5 text-center transition-shadow hover:shadow-[0_16px_36px_-24px_rgba(28,62,58,0.45)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal/8 text-teal transition-transform duration-300 group-hover:scale-110">
                <FeatureIcon name={f.icon} />
              </span>
              <span className="text-[0.88rem] font-semibold leading-snug text-teal">
                {f.title}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* Compact circular gauge — small, sits beside the heading */
function PeaceScoreGauge() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const score = 92;

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => toFa(Math.round(v)));

  const R = 52;
  const C = 2 * Math.PI * R;
  const arcLen = 0.75 * C;
  const targetOffset = arcLen * (1 - score / 100);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, score, { duration: 1.6, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, count, score]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex shrink-0 flex-col items-center"
    >
      <span className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-ink">
        Family Peace Score
      </span>
      <div className="relative h-32 w-32 sm:h-36 sm:w-36">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-[135deg]">
          <circle
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke="#e3d9c9"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${C}`}
          />
          <motion.circle
            cx="70"
            cy="70"
            r={R}
            fill="none"
            stroke="#1c3e3a"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${C}`}
            initial={{ strokeDashoffset: arcLen }}
            animate={inView ? { strokeDashoffset: targetOffset } : {}}
            transition={{ duration: 1.6, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-teal font-extrabold leading-none nums-fa"
            style={{ fontSize: "2rem", fontFamily: "var(--font-vazirmatn)" }}
          >
            {rounded}
          </motion.span>
          <span className="text-[0.66rem] text-muted-ink">از ۱۰۰</span>
        </div>
      </div>
    </motion.div>
  );
}

/* Compact custom icons for each capability */
function FeatureIcon({ name }: { name: string }) {
  const c = "h-5 w-5";
  switch (name) {
    case "wander":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none">
          <path
            d="M3 18c3-2 4-8 7-8s3 6 6 6 4-4 5-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="18" cy="6" r="2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "anomaly":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none">
          <path
            d="M3 12h4l2-6 4 12 2-6h6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "activity":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none">
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M12 2v3M12 19v3M2 12h3M19 12h3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "predict":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none">
          <path
            d="M12 3a9 9 0 1 0 9 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M12 12l5-3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="1.4" fill="currentColor" />
        </svg>
      );
    case "report":
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none">
          <rect x="4" y="4" width="16" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M8 14v3M12 11v6M16 8v9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}
