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
    <section className="bg-ivory py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-2 divide-divider sm:grid-cols-4 sm:divide-x sm:divide-x-reverse">
          {STATS.map((s, i) => (
            <StatItem key={i} {...s} delay={i * 0.1} />
          ))}
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
    <div
      ref={ref}
      className="flex flex-col items-center px-4 py-8 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-baseline justify-center text-teal font-extrabold leading-none nums-fa"
        style={{ fontSize: "clamp(2.4rem, 5vw, 3.6rem)", fontFamily: "var(--font-vazirmatn)", letterSpacing: "-0.02em" }}
      >
        {prefix && <span className="text-[0.5em] font-semibold text-muted-ink">{prefix}</span>}
        <motion.span>{display}</motion.span>
        <span className="text-[0.42em] font-semibold text-muted-ink">{suffix}</span>
      </motion.div>
      <div className="mt-3 text-[0.92rem] text-muted-ink">{label}</div>
    </div>
  );
}
