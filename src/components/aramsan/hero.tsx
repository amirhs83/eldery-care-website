"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { toFa } from "@/lib/format";

function scrollToWaitlist() {
  document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
}
function scrollToStory() {
  document.getElementById("story")?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Subtle parallax + ambient drift for the product
  const y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative overflow-hidden bg-ivory pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24"
    >
      {/* Ambient warm glow — barely perceptible, evokes lamplight */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(240,228,206,0.9) 0%, rgba(240,228,206,0.35) 40%, rgba(250,246,239,0) 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(62,107,98,0.18) 0%, rgba(62,107,98,0.05) 50%, rgba(250,246,239,0) 75%)",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8">
        {/* Text block — RTL start (right) */}
        <div className="order-2 lg:order-1 lg:col-span-7">
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-divider bg-warmwhite/70 px-3.5 py-1.5 text-[0.8rem] text-muted-ink backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terracotta opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-terracotta" />
            </span>
            عرضه اولیه با تخفیف ویژه اعضای لیست انتظار
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.05 }}
            className="text-teal font-extrabold leading-[1.12] tracking-tight"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              fontFamily: "var(--font-vazirmatn)",
            }}
          >
            آرامش خاطر،
            <br />
            حتی وقتی کنارشان نیستید.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="mt-6 max-w-xl text-[1.05rem] leading-[1.9] text-muted-ink sm:text-[1.15rem]"
          >
            ردیاب هوشمند و ایستگاه درب اختصاصی برای مراقبت از سالمندان، کودکان و
            عزیزان شما.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <button
              onClick={scrollToWaitlist}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-[0.98rem] font-semibold text-warmwhite shadow-[0_10px_30px_-10px_rgba(201,120,69,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-light hover:shadow-[0_16px_40px_-12px_rgba(201,120,69,0.85)]"
            >
              دریافت ۵۰٪ تخفیف مادام‌العمر
            </button>
            <button
              onClick={scrollToStory}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-divider bg-warmwhite/60 px-6 py-3.5 text-[0.98rem] font-medium text-teal backdrop-blur transition-all duration-300 hover:border-teal-light/40 hover:bg-warmwhite"
            >
              <span className="relative flex h-5 w-5 items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.4"
                  />
                  <path
                    d="M10 9l5 3-5 3V9z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              مشاهده نحوه عملکرد
            </button>
          </motion.div>

          {/* Trust indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-8 flex items-center gap-3 text-[0.9rem] text-muted-ink"
          >
            <div className="flex -space-x-2 -space-x-reverse">
              {[
                "bg-teal",
                "bg-teal-light",
                "bg-terracotta",
                "bg-safe",
              ].map((c, i) => (
                <span
                  key={i}
                  className={`inline-block h-7 w-7 rounded-full ring-2 ring-ivory ${c} opacity-90`}
                />
              ))}
            </div>
            <span>
              بیش از{" "}
              <span className="font-semibold text-teal nums-fa">
                {toFa(500)}
              </span>{" "}
              خانواده در انتظار عرضه آرامسن هستند.
            </span>
          </motion.div>
        </div>

        {/* Product visual — RTL end (left) */}
        <div className="order-1 lg:order-2 lg:col-span-5">
          <div className="relative mx-auto flex aspect-square w-full max-w-[440px] items-center justify-center">
            {/* Warm radial glow behind product */}
            <motion.div
              aria-hidden
              style={{ scale: glowScale }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 rounded-full blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, rgba(240,228,206,0.95) 0%, rgba(240,228,206,0.5) 35%, rgba(250,246,239,0) 70%)",
                }}
              />
            </motion.div>

            {/* Floating product */}
            <motion.div
              style={{ y }}
              animate={{ y: [0, -14, 0] }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-[78%] drop-shadow-[0_30px_50px_rgba(28,62,58,0.18)]"
            >
              <img
                src="/products/hero-tracker.png"
                alt="ردیاب هوشمند آرامسن — دستگاهی ظریف با روکش سرامیک فیروزه‌ای تیره و حلقهaccent تراکوتا"
                className="h-full w-full rounded-[2rem] object-cover"
                loading="eager"
              />
            </motion.div>

            {/* Floating spec chip — calm, editorial */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-2 right-2 z-20 rounded-2xl border border-divider bg-warmwhite/90 px-4 py-2.5 shadow-[0_12px_30px_-12px_rgba(28,62,58,0.25)] backdrop-blur sm:right-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                    <path
                      d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <div className="leading-tight">
                  <div className="text-[0.72rem] text-muted-ink">شارژدهی</div>
                  <div className="text-[0.95rem] font-bold text-teal nums-fa">
                    تا ۳ روز
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
