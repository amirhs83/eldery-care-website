"use client";

import { motion } from "framer-motion";

export function DoorStation() {
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

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
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

          {/* Visual side — the door-station device image, ambient glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative mx-auto flex w-full max-w-sm items-center justify-center"
          >
            {/* warm glow behind the device */}
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className="h-72 w-72 rounded-full blur-2xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(124,148,115,0.32) 0%, rgba(124,148,115,0.08) 45%, rgba(28,62,58,0) 70%)",
                }}
              />
            </div>
            <motion.img
              src="/products/door-station.png"
              alt="ایستگاه درب هوشمند آرامسن — دستگاهی ظریف کنار در با نور سبز"
              className="relative z-10 w-full max-w-xs rounded-[2rem] object-cover shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)]"
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
