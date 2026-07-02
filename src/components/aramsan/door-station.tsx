"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import { toFa } from "@/lib/format";

type Step = "idle" | "detect" | "notify" | "confirm";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function DoorStation() {
  const [step, setStep] = useState<Step>("idle");
  const [playing, setPlaying] = useState(false);

  const simulate = useCallback(async () => {
    if (playing) return;
    setPlaying(true);
    setStep("detect");
    await sleep(1500);
    setStep("notify");
    await sleep(1700);
    setStep("confirm");
    await sleep(1400);
    setPlaying(false);
  }, [playing]);

  const reset = useCallback(() => {
    setStep("idle");
    setPlaying(false);
  }, []);

  const lightOn = step !== "idle";
  const wavesOn = step === "detect";
  const notifOn = step === "notify" || step === "confirm";
  const confirmed = step === "confirm";

  return (
    <section
      id="door"
      className="relative overflow-hidden bg-teal py-20 text-ivory sm:py-28"
    >
      {/* ambient dusk glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(222,152,98,0.18) 0%, rgba(28,62,58,0) 55%), radial-gradient(circle at 10% 90%, rgba(124,148,115,0.14) 0%, rgba(28,62,58,0) 50%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* Text side */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-ivory/15 bg-ivory/5 px-3.5 py-1.5 text-[0.78rem] font-semibold text-terracotta-light">
            <span className="h-1.5 w-1.5 rounded-full bg-terracotta-light" />
            ایستگاه درب هوشمند
          </span>
          <h2
            className="mt-5 font-extrabold leading-[1.1] tracking-tight"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)", fontFamily: "var(--font-vazirmatn)" }}
          >
            خروج بدون ردیاب؟
            <br />
            دیگر نه.
          </h2>
          <p className="mt-4 max-w-md text-[1.05rem] leading-[1.9] text-ivory/70">
            راهکاری که برای فراموشی طراحی شده است. ایستگاه آرامسن کنار در،
            خروج بدون ردیاب را تشخیص می‌دهد و با یک یادآوری ملایم، فراموشی را به
            آرامش تبدیل می‌کند.
          </p>

          <ul className="mt-8 space-y-3.5">
            {[
              "تشخیص خروج بدون ردیاب",
              "یادآوری صوتی ملایم",
              "هشدار برای خانواده",
              "دکمه تأیید خروج برای سایر اعضای خانواده",
            ].map((t, i) => (
              <motion.li
                key={t}
                initial={{ opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
                className="flex items-center gap-3 text-[1rem] text-ivory/90"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-safe/20 text-safe">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
                    <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {t}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Interactive simulation side */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-[2rem] border border-ivory/10 bg-[#0f2624] p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] sm:p-8">
            {/* stage label */}
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[0.82rem] font-medium text-ivory/50">
                شبیه‌سازی زنده
              </span>
              <StepBadge step={step} />
            </div>

            {/* the scene */}
            <div className="relative mx-auto flex h-64 items-end justify-center sm:h-72">
              {/* door station device */}
              <div className="relative">
                {/* device body */}
                <div className="relative h-40 w-24 rounded-2xl bg-gradient-to-b from-[#2f5650] to-[#1c3e3a] shadow-inner">
                  {/* speaker grille */}
                  <div className="absolute left-1/2 top-4 h-1 w-10 -translate-x-1/2 rounded-full bg-ivory/15" />
                  <div className="absolute left-1/2 top-7 h-1 w-10 -translate-x-1/2 rounded-full bg-ivory/15" />
                  {/* status light */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className="h-4 w-4 rounded-full"
                      animate={
                        lightOn
                          ? { backgroundColor: "#7c9473", boxShadow: "0 0 18px 4px rgba(124,148,115,0.8)" }
                          : { backgroundColor: "#2f5650", boxShadow: "0 0 0px 0px rgba(124,148,115,0)" }
                      }
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  {/* brand dot */}
                  <div className="absolute bottom-4 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-terracotta/70" />
                </div>

                {/* sound waves */}
                <AnimatePresence>
                  {wavesOn && (
                    <motion.div
                      key="waves"
                      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-safe"
                          initial={{ scale: 0.4, opacity: 0.8 }}
                          animate={{ scale: 1.6 + i * 0.4, opacity: 0 }}
                          transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            delay: i * 0.4,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* phone notification */}
              <AnimatePresence>
                {notifOn && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, x: -10 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute bottom-2 left-2 w-44 rounded-2xl border border-ivory/15 bg-warmwhite p-3 text-ink shadow-xl sm:w-52"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          confirmed ? "bg-safe/15 text-safe" : "bg-terracotta/15 text-terracotta"
                        }`}
                      >
                        {confirmed ? (
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                            <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                            <path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <div className="text-[0.72rem] font-semibold text-muted-ink">
                        آرامسن
                      </div>
                    </div>
                    <div className="mt-1.5 text-[0.85rem] font-bold leading-snug text-teal">
                      {confirmed
                        ? "خروج تأیید شد"
                        : "پدر بدون ردیاب از خانه خارج شد"}
                    </div>
                    <div className="mt-0.5 text-[0.72rem] text-muted-ink">
                      {confirmed ? "همه چیز زیر کنترل است." : "یادآوری صوتی پخش شد."}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* confirm button for family */}
              <AnimatePresence>
                {step === "confirm" && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={reset}
                    className="absolute bottom-2 right-2 rounded-full border border-safe/40 bg-safe/15 px-3.5 py-2 text-[0.78rem] font-semibold text-safe transition-colors hover:bg-safe/25"
                  >
                    تأیید خروج
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* controls */}
            <div className="mt-6 flex items-center justify-center gap-3">
              {step === "idle" ? (
                <button
                  onClick={simulate}
                  className="inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-[0.95rem] font-semibold text-warmwhite transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-light"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  شبیه‌سازی کن
                </button>
              ) : (
                <button
                  onClick={reset}
                  disabled={playing}
                  className="inline-flex items-center gap-2 rounded-full border border-ivory/20 px-5 py-2.5 text-[0.88rem] font-medium text-ivory/80 transition-colors hover:bg-ivory/5 disabled:opacity-50"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                    <path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  از نو
                </button>
              )}
            </div>
          </div>

          {/* caption */}
          <p className="mt-4 text-center text-[0.82rem] text-ivory/50">
            برای دیدن جریان کامل، «شبیه‌سازی کن» را بزنید.
          </p>
        </div>
      </div>
    </section>
  );
}

function StepBadge({ step }: { step: Step }) {
  const map: Record<Step, { label: string; color: string }> = {
    idle: { label: "آماده", color: "bg-ivory/10 text-ivory/60" },
    detect: { label: "در حال تشخیص", color: "bg-safe/15 text-safe" },
    notify: { label: "اعلام به خانواده", color: "bg-terracotta/20 text-terracotta-light" },
    confirm: { label: "تأیید شد", color: "bg-safe/20 text-safe" },
  };
  const { label, color } = map[step];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] font-semibold ${color}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
}
