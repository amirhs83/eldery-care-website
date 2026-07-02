"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* ---------- Custom icon set (consistent teal stroke, hand-drawn feel) ---------- */
type IconProps = { className?: string };

function GpsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function CallIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function SosIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 13.5a1.5 1.5 0 0 0 1.5 1.5h1a1.5 1.5 0 0 0 0-3h-1a1.5 1.5 0 0 1 0-3h1A1.5 1.5 0 0 1 15 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function InactivityIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="12" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 9v6M9 21l3-6 3 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M18.5 5.2v1.3l.9.6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function BatteryIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="3" y="8" width="15" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M21 11v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="5.5" y="10.5" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
function SafeZoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M4 9V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function ReportIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <rect x="4" y="4" width="16" height="17" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 14v3M12 11v6M16 8v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Flagship illustration: fall detection ---------- */
function FallDetectionIllustration() {
  return (
    <svg viewBox="0 0 260 200" className="h-full w-full" fill="none">
      {/* pulse ring */}
      <circle cx="130" cy="100" r="70" stroke="#c97845" strokeWidth="1.4" opacity="0.4" />
      <circle cx="130" cy="100" r="50" stroke="#c97845" strokeWidth="1.4" opacity="0.6" />
      {/* shield */}
      <path
        d="M130 55l34 12v28c0 22-14 36-34 46-20-10-34-24-34-46V67l34-12z"
        fill="#1c3e3a"
        opacity="0.95"
      />
      {/* pulse line */}
      <path
        d="M104 104h12l6-12 8 22 6-10h16"
        stroke="#de9862"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/* ---------- Section ---------- */

export function Features() {
  return (
    <section id="features" className="bg-ivory py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionLabel>امکانات</SectionLabel>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-3 max-w-2xl text-teal font-extrabold leading-[1.15] tracking-tight"
          style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", fontFamily: "var(--font-vazirmatn)" }}
        >
          مراقبتی که حتی وقتی خوابید، بیدار است.
        </motion.h2>

        {/* Flagship spotlight — bigger, distinct treatment */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mt-12 overflow-hidden rounded-[2rem] border border-divider bg-warmwhite shadow-[0_30px_60px_-40px_rgba(28,62,58,0.5)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="flex items-center justify-center bg-sand p-8 lg:col-span-5 lg:p-10">
              <div className="h-48 w-48 sm:h-56 sm:w-56">
                <FallDetectionIllustration />
              </div>
            </div>
            <div className="p-7 lg:col-span-7 lg:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-terracotta/10 px-3 py-1 text-[0.78rem] font-semibold text-terracotta">
                <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />
                امکان محوری
              </span>
              <h3
                className="mt-4 text-teal font-extrabold leading-tight"
                style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.1rem)", fontFamily: "var(--font-vazirmatn)" }}
              >
                تشخیص سقوط
              </h3>
              <p className="mt-3 text-[1.02rem] leading-[1.9] text-muted-ink">
                اگر عزیزتان تعادلش را از دست داد و زمین خورد، آرامسن در کمتر از ۱۰
                ثانیه وضعیت را تشخیص می‌دهد و به شما هشدار می‌دهد؛ حتی اگر خودش
                نتواند کمک بخواهد.
              </p>
              <ul className="mt-5 space-y-2.5 text-[0.93rem] text-ink">
                {[
                  "تشخیص خودکار با سنسورهای حرکتی دقیق",
                  "تماس خودکار با اعضای خانواده",
                  "ثبت محل دقیق لحظه وقوع",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-safe" fill="none">
                      <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Cluster A — icon-forward cards (3) */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            { icon: <GpsIcon className="h-7 w-7" />, title: "ردیابی زنده GPS", desc: "موقعیت لحظه‌ای عزیزتان روی نقشه، در هر لحظه از روز." },
            { icon: <CallIcon className="h-7 w-7" />, title: "تماس دوطرفه", desc: "تماس صوتی یک‌لمسی، بدون نیاز به گوشی هوشمند." },
            { icon: <SosIcon className="h-7 w-7" />, title: "دکمه اضطراری SOS", desc: "با یک فشار، همه اعضای خانواده مطلع می‌شوند." },
          ].map((f, i) => (
            <FeatureCardA key={f.title} {...f} delay={i * 0.08} />
          ))}
        </div>

        {/* Cluster B — text-forward list (4), different treatment: divided rows */}
        <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-divider bg-sand/60">
          {[
            { icon: <InactivityIcon className="h-6 w-6" />, title: "تشخیص بی‌حرکتی غیرعادی", desc: "اگر مدت غیرمعمولی بی‌حرکت ماند، هشدار می‌دهیم." },
            { icon: <BatteryIcon className="h-6 w-6" />, title: "هشدار کمبود شارژ", desc: "قبل از تمام شدن شارژ، شما و عزیزتان را مطلع می‌کند." },
            { icon: <SafeZoneIcon className="h-6 w-6" />, title: "محدوده امن هوشمند", desc: "هر زمان از محدوده تعریف‌شده خارج شد، به شما خبر می‌رسد." },
            { icon: <ReportIcon className="h-6 w-6" />, title: "گزارش فعالیت روزانه", desc: "خلاصه‌ای آرام از روز عزیزتان، هر شب در گوشی شما." },
          ].map((f, i) => (
            <FeatureRow key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block text-[0.82rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
      {children}
    </span>
  );
}

function FeatureCardA({
  icon,
  title,
  desc,
  delay,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="group rounded-[1.25rem] border border-divider bg-warmwhite p-6 transition-shadow hover:shadow-[0_20px_45px_-25px_rgba(28,62,58,0.4)]"
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal/8 text-teal transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </span>
      <h3 className="mt-4 text-[1.15rem] font-bold text-teal">{title}</h3>
      <p className="mt-2 text-[0.92rem] leading-relaxed text-muted-ink">{desc}</p>
    </motion.article>
  );
}

function FeatureRow({
  icon,
  title,
  desc,
  index,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      className={`flex items-center gap-4 px-5 py-5 sm:px-7 ${
        index > 0 ? "border-t border-divider" : ""
      }`}
    >
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-divider bg-warmwhite text-teal-light">
        {icon}
      </span>
      <div className="flex-1">
        <h3 className="text-[1.05rem] font-semibold text-teal">{title}</h3>
        <p className="mt-0.5 text-[0.9rem] leading-relaxed text-muted-ink">{desc}</p>
      </div>
    </motion.div>
  );
}
