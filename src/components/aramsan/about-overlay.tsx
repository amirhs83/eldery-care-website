"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { AramsanMark } from "./logo";

/**
 * About / Founder-story overlay — driven by URL hash:
 *   #about → founder's story page
 *   (none) → closed
 *
 * Renders as a full-screen overlay on top of the landing page (same pattern
 * as the blog overlay) so the user gets a real "separate page" experience
 * while staying on the single `/` route the sandbox exposes.
 */

export function AboutOverlay() {
  const [open, setOpen] = useState(false);

  const parseHash = useCallback(() => {
    return window.location.hash.replace(/^#/, "") === "about";
  }, []);

  useEffect(() => {
    const onHash = () => setOpen(parseHash());
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [parseHash]);

  // Lock body scroll while overlay is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const close = useCallback(() => {
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );
    setOpen(false);
  }, []);

  const scrollToWaitlist = useCallback(() => {
    // Close the overlay first, then scroll to the waitlist on the landing page
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );
    setOpen(false);
    setTimeout(() => {
      document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] bg-ivory"
          role="dialog"
          aria-modal="true"
          aria-label="درباره آرامسن"
        >
          {/* top bar */}
          <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-divider bg-ivory/90 px-5 backdrop-blur-xl sm:px-8">
            <button
              onClick={close}
              className="inline-flex items-center gap-2 rounded-full border border-divider bg-warmwhite px-3.5 py-2 text-[0.88rem] font-semibold text-teal transition-all hover:-translate-y-0.5 hover:border-teal-light/40"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path
                  d="M9 6l-6 6 6 6M3 12h18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              بازگشت به خانه
            </button>

            <div className="flex items-center gap-2">
              <AramsanMark className="h-6 w-6" />
              <span
                className="text-[1.1rem] font-extrabold text-teal"
                style={{ fontFamily: "var(--font-vazirmatn)" }}
              >
                آرامسن
              </span>
            </div>

            <button
              onClick={close}
              aria-label="بستن"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-divider bg-warmwhite text-muted-ink transition-colors hover:text-teal"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* scrollable content */}
          <div className="h-[calc(100vh-4rem)] overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16"
            >
              {/* Two-column on desktop: text right (RTL start), image left */}
              <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                {/* Text column (right in RTL) */}
                <div className="order-2 lg:order-1">
                  <span className="inline-block text-[0.82rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
                    داستان آرامسن
                  </span>
                  <motion.h1
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="mt-3 text-teal font-extrabold leading-[1.15] tracking-tight"
                    style={{
                      fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
                      fontFamily: "var(--font-vazirmatn)",
                    }}
                  >
                    چرا آرامسن رو ساختم
                  </motion.h1>

                  <div className="mt-7 space-y-5">
                    {[
                      "پدربزرگم رو خیلی دوست دارم، ولی نگهداری ازش برای خانواده‌مون همیشه ساده نبود. توی چند سال اخیر، دو بار لگنش شکست و یک بار هم سرش؛ یک بار هم بیهوش شد.",
                      "بچه‌هاش هر کاری از دستشون برمی‌اومد می‌کردن، ولی نمی‌شد همیشه و همه‌جا کنارش بود. این نگرانی همیشگی - این حس که شاید همین الان یه اتفاقی بیفته و کسی نفهمه - چیزیه که خیلی از خانواده‌ها باهاش زندگی می‌کنن.",
                      "به‌جای اینکه فقط نگران بمونم، تصمیم گرفتم آرامسن رو بسازم: راهی برای اینکه وقتی نمی‌تونیم کنارشون باشیم، لااقل زودتر از افتادن یا بی‌حرکتی غیرعادی باخبر بشیم. خوشحالم بگم پدربزرگم الان تحت مراقبته و حالش خوبه؛ آرامسن رو می‌سازم برای هر خانواده‌ای که همین آرامش خاطر رو می‌خواد.",
                    ].map((p, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                        className="text-[1.05rem] leading-[2] text-ink"
                      >
                        {p}
                      </motion.p>
                    ))}
                  </div>

                  {/* Signature */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-6 text-[0.9rem] font-semibold text-muted-ink"
                  >
                    امیر حصاری، بنیان‌گذار آرامسن
                  </motion.p>

                  {/* CTA — same style as the waitlist section's primary button */}
                  <button
                    onClick={scrollToWaitlist}
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-4 text-[1rem] font-semibold text-warmwhite shadow-[0_14px_34px_-12px_rgba(201,120,69,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-light"
                  >
                    دریافت تخفیف ۵۰٪ مادام‌العمر
                  </button>
                </div>

                {/* Image column (left in RTL) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                  className="order-1 lg:order-2"
                >
                  <div className="relative mx-auto flex aspect-[4/5] w-full max-w-sm items-center justify-center overflow-hidden rounded-[2rem] border border-divider bg-warmwhite shadow-[0_30px_60px_-35px_rgba(28,62,58,0.45)]">
                    {/* اینجا عکس واقعی بنیان‌گذار یا پدربزرگ جایگزین بشه */}
                    <img
                      src="/founder/founder.png"
                      alt="بنیان‌گذار آرامسن"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    {/* warm ambient glow corner */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full opacity-60 blur-2xl"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(240,228,206,0.7) 0%, rgba(250,246,239,0) 70%)",
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
