"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { toFa } from "@/lib/format";

const STATS = [
  { value: 3, suffix: " روز", label: "شارژدهی" },
  { value: 30, prefix: "کمتر از ", suffix: " گرم", label: "وزن دستگاه" },
  { value: 24, suffix: " ساعته", label: "پایش موقعیت" },
  { value: 10, prefix: "کمتر از ", suffix: " ثانیه", label: "زمان هشدار" },
];

export function Statistics() {
  return (
    <section className="relative overflow-hidden bg-teal py-16 text-ivory sm:py-20">
      {/* ambient warm glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 75% 30%, rgba(222,152,98,0.16) 0%, rgba(28,62,58,0) 55%), radial-gradient(circle at 15% 80%, rgba(124,148,115,0.14) 0%, rgba(28,62,58,0) 50%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-14">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6">
            {STATS.map((s, i) => (
              <StatItem key={i} {...s} delay={i * 0.1} />
            ))}
          </div>

          {/* Device on charging dock image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto flex w-full max-w-[260px] items-center justify-center"
          >
            {/* warm glow behind device */}
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="h-52 w-52 rounded-full blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(124,148,115,0.3) 0%, rgba(124,148,115,0.06) 45%, rgba(28,62,58,0) 70%)",
                }}
              />
            </div>
            <motion.img
              src="/products/custom-device.png"
              alt="ردیاب هوشمند سن یار روی ایستگاه شارژ کنار در با نور سبز شارژ"
              className="relative z-10 w-full rounded-[1.75rem] object-cover shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              loading="lazy"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatItem({
  value,
  prefix = "",
  suffix = "",
  label,
  delay,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => toFa(Math.round(v)));

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, {
        duration: 1.6,
        delay,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [inView, count, value, delay]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-baseline justify-center text-ivory font-extrabold leading-none nums-fa"
        style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)", fontFamily: "var(--font-vazirmatn)", letterSpacing: "-0.02em" }}
      >
        {prefix && <span className="text-[0.46em] font-semibold text-ivory/60">{prefix}</span>}
        <motion.span>{display}</motion.span>
        <span className="text-[0.4em] font-semibold text-ivory/60">{suffix}</span>
      </motion.div>
      <div className="mt-3 text-[0.9rem] text-ivory/65">{label}</div>
    </div>
  );
}
