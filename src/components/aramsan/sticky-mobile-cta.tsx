"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useScrolled } from "@/lib/use-scroll";

function scrollToWaitlist() {
  document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
}

export function StickyMobileCta() {
  // Appears after the hero (~80vh) is scrolled past
  const show = useScrolled(560);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-40 sm:hidden"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <div className="border-t border-divider/70 bg-ivory/90 px-4 py-3 backdrop-blur-xl">
            <button
              onClick={scrollToWaitlist}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-5 py-3 text-[0.92rem] font-semibold text-warmwhite shadow-[0_10px_24px_-10px_rgba(201,120,69,0.8)] transition-colors active:bg-terracotta-light"
            >
              دریافت ۵۰٪ تخفیف مادام‌العمر
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
