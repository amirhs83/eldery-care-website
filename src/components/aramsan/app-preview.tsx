"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { toFa } from "@/lib/format";

export function AppPreview() {
  const screens = [
    { key: "map", label: "نقشه زنده", node: <LiveMapScreen /> },
    { key: "zones", label: "محدوده امن", node: <SafeZonesScreen /> },
    { key: "alerts", label: "هشدارها", node: <AlertsScreen /> },
    { key: "activity", label: "گزارش فعالیت", node: <ActivityScreen /> },
    { key: "dashboard", label: "داشبورد خانواده", node: <DashboardScreen /> },
  ];

  return (
    <section className="bg-sand py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-12 max-w-2xl">
          <span className="inline-block text-[0.82rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
            اپلیکیشن آرامسن
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-3 text-teal font-extrabold leading-[1.15] tracking-tight"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", fontFamily: "var(--font-vazirmatn)" }}
          >
            همه چیز، یک لمس دور از شما.
          </motion.h2>
          <p className="mt-4 text-[1.02rem] leading-[1.9] text-muted-ink">
            اپلیکیشن آرامسن، خانه‌ی مشترک خانواده؛ از موقعیت زنده تا گزارش روزانه
            و داشبورد آرامش.
          </p>
        </div>

        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-4 sm:mx-0 sm:px-0">
          {screens.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              className="shrink-0 snap-center"
            >
              <PhoneFrame label={s.label} floatDelay={i * 0.6}>
                {s.node}
              </PhoneFrame>
            </motion.div>
          ))}
        </div>
        <p className="mt-4 text-center text-[0.8rem] text-muted-ink sm:hidden">
          برای دیدن همه، بکشید ←
        </p>
      </div>
    </section>
  );
}

function PhoneFrame({
  children,
  label,
  floatDelay = 0,
}: {
  children: ReactNode;
  label: string;
  floatDelay?: number;
}) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay,
        }}
        className="relative h-[520px] w-[252px] rounded-[2.6rem] border-[10px] border-[#1c3e3a] bg-[#1c3e3a] shadow-[0_40px_70px_-35px_rgba(28,62,58,0.6)]"
      >
        {/* notch */}
        <div className="absolute left-1/2 top-0 z-20 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-[#1c3e3a]" />
        {/* screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-ivory">
          {children}
        </div>
      </motion.div>
      <span className="mt-4 text-[0.85rem] font-semibold text-teal">{label}</span>
    </div>
  );
}

/* ---- status bar shared ---- */
function StatusBar({ dark = false }: { dark?: boolean }) {
  const c = dark ? "text-ivory" : "text-ink";
  return (
    <div className={`flex items-center justify-between px-4 pt-3 text-[0.6rem] font-semibold ${c}`}>
      <span className="nums-fa">۹:۴۱</span>
      <span className="flex items-center gap-1">
        <span className="inline-block h-2 w-3 rounded-[2px] border border-current opacity-70" />
        <span className="nums-fa">۱۰۰٪</span>
      </span>
    </div>
  );
}

function AppHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="px-4 pt-2 pb-3">
      <div className="text-[0.95rem] font-extrabold text-teal">{title}</div>
      {sub && <div className="text-[0.62rem] text-muted-ink">{sub}</div>}
    </div>
  );
}

/* ---- screens ---- */

function LiveMapScreen() {
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <AppHeader title="نقشه زنده" sub="موقعیت لحظه‌ای پدر" />
      <div className="relative mx-3 flex-1 overflow-hidden rounded-xl">
        {/* stylized map */}
        <div className="absolute inset-0 bg-[#eef0e7]" />
        <svg viewBox="0 0 240 360" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          {/* roads */}
          <path d="M0 80 H240 M0 200 H240 M0 300 H240" stroke="#fff" strokeWidth="10" />
          <path d="M60 0 V360 M160 0 V360" stroke="#fff" strokeWidth="10" />
          <path d="M0 80 H240 M0 200 H240" stroke="#dfe3d3" strokeWidth="2" />
          {/* blocks */}
          <rect x="70" y="90" width="80" height="100" fill="#e2e6d6" rx="3" />
          <rect x="170" y="210" width="60" height="80" fill="#e2e6d6" rx="3" />
          {/* route */}
          <path d="M120 320 Q90 240 130 180 Q170 120 140 70" stroke="#c97845" strokeWidth="3" strokeDasharray="1 6" strokeLinecap="round" fill="none" />
        </svg>
        {/* current pin */}
        <div className="absolute left-1/2 top-[18%] -translate-x-1/2">
          <div className="relative">
            <span className="absolute -inset-3 animate-ping rounded-full bg-terracotta/30" />
            <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-terracotta ring-4 ring-warmwhite">
              <span className="h-1.5 w-1.5 rounded-full bg-warmwhite" />
            </span>
          </div>
        </div>
        {/* home pin */}
        <div className="absolute left-[60%] top-[78%]">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal ring-2 ring-warmwhite">
            <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 text-ivory" fill="none">
              <path d="M4 11l8-7 8 7v9H4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
      <div className="m-3 rounded-xl border border-divider bg-warmwhite p-3">
        <div className="flex items-center justify-between">
          <span className="text-[0.7rem] text-muted-ink">فاصله تا خانه</span>
          <span className="text-[0.8rem] font-bold text-teal nums-fa">{toFa(412)} متر</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[0.7rem] text-muted-ink">آخرین به‌روزرسانی</span>
          <span className="text-[0.7rem] font-semibold text-safe nums-fa">الان</span>
        </div>
      </div>
    </div>
  );
}

function SafeZonesScreen() {
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <AppHeader title="محدوده‌های امن" sub="۳ منطقه تعریف‌شده" />
      <div className="relative mx-3 flex-1 overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-[#eef0e7]" />
        <svg viewBox="0 0 240 360" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <path d="M0 120 H240 M0 260 H240" stroke="#fff" strokeWidth="10" />
          <path d="M100 0 V360" stroke="#fff" strokeWidth="10" />
        </svg>
        {/* geofence circles */}
        <div className="absolute left-[40%] top-[20%]">
          <div className="h-24 w-24 rounded-full border-2 border-dashed border-safe/60 bg-safe/10" />
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-safe/15 px-2 py-0.5 text-[0.55rem] font-semibold text-safe">خانه</span>
        </div>
        <div className="absolute left-[65%] top-[55%]">
          <div className="h-16 w-16 rounded-full border-2 border-dashed border-teal/60 bg-teal/10" />
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-teal/15 px-2 py-0.5 text-[0.55rem] font-semibold text-teal">پارک</span>
        </div>
      </div>
      <div className="m-3 space-y-2">
        {[
          { n: "خانه", s: "فعال", c: "text-safe" },
          { n: "پارک محله", s: "فعال", c: "text-safe" },
          { n: "مسجد", s: "خارج از محدوده", c: "text-muted-ink" },
        ].map((z) => (
          <div key={z.n} className="flex items-center justify-between rounded-lg border border-divider bg-warmwhite px-3 py-2">
            <span className="text-[0.72rem] font-medium text-ink">{z.n}</span>
            <span className={`text-[0.66rem] font-semibold ${z.c}`}>{z.s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertsScreen() {
  const alerts = [
    { t: "خروج از محدوده خانه", time: "۱۰ دقیقه پیش", tone: "terracotta", icon: "exit" },
    { t: "یادآوری صوتی پخش شد", time: "۱۰ دقیقه پیش", tone: "teal", icon: "sound" },
    { t: "تشخیص سقوط — بررسی شد", time: "دیروز، ۱۸:۲۰", tone: "safe", icon: "check" },
    { t: "شارژ ردیاب: ۳۰٪", time: "دیروز، ۰۹:۰۰", tone: "muted", icon: "battery" },
  ];
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <AppHeader title="هشدارها" sub="۴ رویداد اخیر" />
      <div className="flex-1 space-y-2 overflow-hidden px-3 pb-3">
        {alerts.map((a, i) => (
          <div key={i} className="flex items-start gap-2.5 rounded-xl border border-divider bg-warmwhite p-2.5">
            <span
              className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                a.tone === "terracotta"
                  ? "bg-terracotta/12 text-terracotta"
                  : a.tone === "teal"
                  ? "bg-teal/10 text-teal"
                  : a.tone === "safe"
                  ? "bg-safe/15 text-safe"
                  : "bg-muted-ink/10 text-muted-ink"
              }`}
            >
              <AlertGlyph name={a.icon} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[0.72rem] font-semibold leading-snug text-ink">{a.t}</div>
              <div className="mt-0.5 text-[0.6rem] text-muted-ink">{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertGlyph({ name }: { name: string }) {
  const c = "h-3.5 w-3.5";
  if (name === "exit")
    return (
      <svg viewBox="0 0 24 24" className={c} fill="none">
        <path d="M14 5h5v5M19 5l-7 7M10 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (name === "sound")
    return (
      <svg viewBox="0 0 24 24" className={c} fill="none">
        <path d="M4 9v6h4l5 4V5L8 9H4z M17 9a4 4 0 0 1 0 6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    );
  if (name === "check")
    return (
      <svg viewBox="0 0 24 24" className={c} fill="none">
        <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" className={c} fill="none">
      <rect x="3" y="8" width="15" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M21 11v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ActivityScreen() {
  const bars = [40, 65, 30, 80, 55, 90, 45];
  const days = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <AppHeader title="گزارش فعالیت" sub="هفته اخیر" />
      <div className="mx-3 rounded-xl border border-divider bg-warmwhite p-3">
        <div className="flex items-end justify-between gap-1.5 h-28">
          {bars.map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end">
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.07, ease: "easeOut" }}
                  className={`w-full rounded-t-md ${i === 5 ? "bg-terracotta" : "bg-teal/70"}`}
                />
              </div>
              <span className="text-[0.55rem] text-muted-ink">{days[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-3 mt-3 grid grid-cols-2 gap-2">
        {[
          { k: "میانگین قدم روزانه", v: `${toFa(3200)} قدم` },
          { k: "زمان بی‌حرکتی", v: `${toFa(6)} ساعت` },
          { k: "خروج از خانه", v: `${toFa(2)} بار` },
          { k: "امتیاز آرامش", v: `${toFa(92)}` },
        ].map((s) => (
          <div key={s.k} className="rounded-xl border border-divider bg-warmwhite p-2.5">
            <div className="text-[0.58rem] text-muted-ink">{s.k}</div>
            <div className="mt-0.5 text-[0.82rem] font-bold text-teal nums-fa">{s.v}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 px-3">
        <div className="rounded-xl bg-teal p-3 text-ivory">
          <div className="text-[0.62rem] opacity-70">جمع‌بندی هفته</div>
          <div className="mt-1 text-[0.72rem] leading-relaxed">
            روند فعالیت پدر نسبت به هفته قبل پایدار است. هیچ رفتار غیرعادی ثبت نشد.
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div className="flex h-full flex-col">
      <StatusBar />
      <AppHeader title="خانواده" sub="۳ عضو زیر پایش" />
      <div className="flex-1 space-y-2.5 overflow-hidden px-3 pb-3">
        {[
          { n: "پدر", st: "در خانه", tone: "safe", place: "محله امیریه" },
          { n: "مادر", st: "در راه خانه", tone: "teal", place: "۱۲ دقیقه فاصله" },
          { n: "آرتا (کودک)", st: "در مدرسه", tone: "safe", place: "محدوده امن" },
        ].map((m, i) => (
          <div key={i} className="rounded-xl border border-divider bg-warmwhite p-3">
            <div className="flex items-center gap-2.5">
              <span className={`flex h-9 w-9 items-center justify-center rounded-full text-[0.8rem] font-bold ${i === 0 ? "bg-teal/15 text-teal" : i === 1 ? "bg-terracotta/15 text-terracotta" : "bg-safe/15 text-safe"}`}>
                {m.n[0]}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[0.78rem] font-bold text-ink">{m.n}</span>
                  <span className={`text-[0.6rem] font-semibold ${m.tone === "safe" ? "text-safe" : m.tone === "teal" ? "text-teal" : "text-terracotta"}`}>
                    {m.st}
                  </span>
                </div>
                <div className="text-[0.6rem] text-muted-ink">{m.place}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="rounded-xl bg-teal p-3 text-ivory">
          <div className="flex items-center justify-between">
            <span className="text-[0.62rem] opacity-70">Family Peace Score</span>
            <span className="text-[0.62rem] opacity-70">این هفته</span>
          </div>
          <div className="mt-1 flex items-end justify-between">
            <span className="text-[1.6rem] font-extrabold leading-none nums-fa">{toFa(92)}</span>
            <span className="text-[0.6rem] text-safe">▲ {toFa(4)} نسبت به هفته قبل</span>
          </div>
        </div>
      </div>
    </div>
  );
}
