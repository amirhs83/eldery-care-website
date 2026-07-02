"use client";

import { motion } from "framer-motion";
import { toFa } from "@/lib/format";

const QUOTES = [
  {
    text: "پدرم رفت دنبال نان و یادش رفت ردیاب رو برداره؛ ده دقیقه بعد پیام گرفتم که از خونه بیرون رفته.",
    name: "مریم",
    city: "تهران",
  },
  {
    text: "شب که مامانم دیر برگشت، دیگه هزار بار زنگ نزدم. نقشه نشونم داد کجاست.",
    name: "سارا",
    city: "اصفهان",
  },
  {
    text: "وقتی پدرم زمین خورد، قبل از اینکه خودم بفهمم، تماس گرفتن بهم.",
    name: "رضا",
    city: "شیراز",
  },
  {
    text: "ایستگاه درب واقعاً کار می‌کنه. یه بار یادش رفت ردیاب، ایستگاه با صدای ملایم بهش یادآوری کرد.",
    name: "نگار",
    city: "کرج",
  },
  {
    text: "گزارش هفتگی بهم نشون داد فعالیتمون پایداره. دیگه نگران نیستم.",
    name: "علی",
    city: "مشهد",
  },
  {
    text: "دکمه SOS رو بچه‌ها بلدن. حس می‌کنم امن‌ترن.",
    name: "فاطمه",
    city: "تبریز",
  },
];

const SMALL_STATS = [
  { value: 500, suffix: "+", label: "ثبت‌نام اولیه" },
  { value: 38, label: "خانواده آزمایشی" },
  { value: 12, label: "شهر تحت پوشش" },
];

export function WallOfLove() {
  return (
    <section className="bg-ivory py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <span className="inline-block text-[0.82rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
            صدای خانواده‌ها
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-3 text-teal font-extrabold leading-[1.15] tracking-tight"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", fontFamily: "var(--font-vazirmatn)" }}
          >
            خانواده‌هایی که آرامش را پیدا کرده‌اند.
          </motion.h2>
        </div>

        {/* Small stats row */}
        <div className="mb-8 grid grid-cols-3 gap-3 sm:max-w-md">
          {SMALL_STATS.map((s, i) => (
            <SmallStat key={i} {...s} delay={i * 0.08} />
          ))}
        </div>

        {/* Masonry wall of quotes */}
        <div className="gap-5 [column-fill:_balance] sm:columns-2 lg:columns-3">
          {QUOTES.map((q, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: "easeOut" }}
              className="mb-5 break-inside-avoid rounded-[1.4rem] border border-divider bg-warmwhite p-5 transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(28,62,58,0.4)]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-terracotta/40" fill="currentColor" aria-hidden>
                <path d="M9 7H6a3 3 0 0 0-3 3v7h7v-7H6c0-1.1.9-2 2-2h1V7zm12 0h-3a3 3 0 0 0-3 3v7h7v-7h-4c0-1.1.9-2 2-2h1V7z" />
              </svg>
              <blockquote className="mt-2 text-[0.98rem] leading-[1.95] text-ink">
                {q.text}
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal/10 text-[0.82rem] font-bold text-teal">
                  {q.name[0]}
                </span>
                <span className="text-[0.85rem] font-semibold text-teal">{q.name}</span>
                <span className="text-[0.8rem] text-muted-ink">· {q.city}</span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function SmallStat({
  value,
  suffix = "",
  label,
  delay,
}: {
  value: number;
  suffix?: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="rounded-2xl border border-divider bg-warmwhite px-4 py-3 text-center"
    >
      <div className="text-teal font-extrabold leading-none nums-fa" style={{ fontSize: "1.6rem", fontFamily: "var(--font-vazirmatn)" }}>
        {toFa(value)}{suffix}
      </div>
      <div className="mt-1 text-[0.72rem] text-muted-ink">{label}</div>
    </motion.div>
  );
}
