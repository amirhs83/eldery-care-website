"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { toFa } from "@/lib/format";

const FEATURES = [
  { title: "تشخیص سرگردانی", desc: "الگوهای حرکتی مبهم را شناسایی می‌کند." },
  { title: "تشخیص رفتار غیرعادی", desc: "تغییرات ناگهانی روزمره را گزارش می‌دهد." },
  { title: "تحلیل روند فعالیت روزانه", desc: "روند حرکت و استراحت را می‌فهمد." },
  { title: "پیش‌بینی خروج غیرمعمول", desc: "قبل از وقوع، شما را آماده می‌کند." },
  { title: "گزارش هفتگی هوشمند", desc: "هر هفته یک خلاصه روشن از وضعیت." },
];

export function AiSection() {
  return (
    <section className="bg-ivory py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="inline-block text-[0.82rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
            هوش مصنوعی
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-3 text-teal font-extrabold leading-[1.15] tracking-tight"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", fontFamily: "var(--font-vazirmatn)" }}
          >
            هوش مصنوعی در خدمت آرامش خانواده
          </motion.h2>
          <p className="mt-4 text-[1.02rem] leading-[1.9] text-muted-ink">
            آرامسن فقط موقعیت را ثبت نمی‌کند؛ رفتارها را می‌فهمد. الگوریتم‌های
            هوش مصنوعی، روزمره‌ی عزیزتان را یاد می‌گیرند و تنها وقتی چیزی خارج از
            روال عادی است، شما را مطلع می‌کنند.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Family Peace Score gauge — the centerpiece */}
          <PeaceScoreGauge />

          {/* Flowing timeline of AI features */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute bottom-2 top-2 right-[11px] w-px bg-gradient-to-b from-divider via-divider to-transparent"
            />
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.09, ease: "easeOut" }}
                className="relative mb-7 flex items-start gap-4 last:mb-0"
              >
                <span className="relative z-10 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-terracotta bg-ivory">
                  <span className="h-2 w-2 rounded-full bg-terracotta" />
                </span>
                <div>
                  <h3 className="text-[1.08rem] font-bold text-teal">{f.title}</h3>
                  <p className="mt-1 text-[0.92rem] leading-relaxed text-muted-ink">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PeaceScoreGauge() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const score = 92;

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => toFa(Math.round(v)));

  // arc geometry
  const R = 90;
  const C = 2 * Math.PI * R;
  const arcLen = 0.75 * C; // 270deg arc
  const targetOffset = arcLen * (1 - score / 100);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, score, {
        duration: 1.8,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [inView, count, score]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative mx-auto flex w-full max-w-sm flex-col items-center rounded-[2rem] border border-divider bg-warmwhite p-8 shadow-[0_30px_60px_-40px_rgba(28,62,58,0.4)]"
    >
      <span className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-muted-ink">
        Family Peace Score
      </span>
      <div className="relative mt-4 h-56 w-56">
        <svg viewBox="0 0 240 240" className="h-full w-full -rotate-[135deg]">
          {/* track */}
          <circle
            cx="120"
            cy="120"
            r={R}
            fill="none"
            stroke="#e3d9c9"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${C}`}
          />
          {/* progress */}
          <motion.circle
            cx="120"
            cy="120"
            r={R}
            fill="none"
            stroke="#1c3e3a"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${C}`}
            initial={{ strokeDashoffset: arcLen }}
            animate={inView ? { strokeDashoffset: targetOffset } : {}}
            transition={{ duration: 1.8, ease: "easeOut" }}
          />
        </svg>
        {/* center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-teal font-extrabold leading-none nums-fa"
            style={{ fontSize: "3.4rem", fontFamily: "var(--font-vazirmatn)" }}
          >
            {rounded}
          </motion.span>
          <span className="mt-1 text-[0.78rem] text-muted-ink">از ۱۰۰</span>
        </div>
      </div>
      <p className="mt-5 max-w-xs text-center text-[0.92rem] leading-relaxed text-muted-ink">
        امتیاز آرامش خانواده، محاسبه‌شده از ترکیب پایش، رفتار و روال روزانه.
      </p>
    </motion.div>
  );
}
