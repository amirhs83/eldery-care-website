"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useScrolled } from "@/lib/use-scroll";
import { AramsanWordmark } from "./logo";
import { cn } from "@/lib/utils";

function scrollToWaitlist() {
  const el = document.getElementById("waitlist");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar() {
  const scrolled = useScrolled(16);

  // SSR-safe scroll progress (0..1). useScroll() with no target tracks the
  // whole document and defaults to 0 on the server, so no `document` access
  // happens during render.
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-all duration-300",
          scrolled
            ? "bg-ivory/80 backdrop-blur-xl border-b border-divider/70"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* RTL: wordmark sits at the start (right) */}
          <a
            href="#top"
            className="group inline-flex items-center"
            aria-label="سن یار — خانه"
          >
            <AramsanWordmark className="transition-opacity group-hover:opacity-80" />
          </a>

          {/* Center nav (desktop only) — quiet, secondary */}
          <div className="hidden items-center gap-8 text-[0.92rem] text-muted-ink md:flex">
            <a href="#story" className="transition-colors hover:text-teal">
              داستان سن یار
            </a>
            <a href="#features" className="transition-colors hover:text-teal">
              امکانات
            </a>
            <a href="#blog" className="transition-colors hover:text-teal">
              وبلاگ
            </a>
            <a href="#faq" className="transition-colors hover:text-teal">
              سوالات
            </a>
          </div>

          {/* CTA at the end (left in RTL) */}
          <button
            onClick={scrollToWaitlist}
            className="group inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-[0.9rem] font-semibold text-warmwhite shadow-[0_6px_20px_-8px_rgba(201,120,69,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-light hover:shadow-[0_10px_26px_-8px_rgba(201,120,69,0.8)] sm:px-5"
          >
            <span>دریافت ۵۰٪ تخفیف مادام‌العمر</span>
          </button>
        </nav>
      </div>

      {/* 1px scroll progress line — terracotta, premium touch.
          A full-width bar scaled from the right (RTL start) for a smooth fill. */}
      <div className="h-px w-full bg-divider/40">
        <motion.div
          style={{ scaleX, transformOrigin: "right" }}
          className="h-full w-full bg-terracotta"
        />
      </div>
    </header>
  );
}
