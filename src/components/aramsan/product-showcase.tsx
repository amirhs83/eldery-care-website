"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const USES = [
  {
    title: "گردنبند",
    desc: "روی گردن، ظریف و سبک برای استفاده روزمره.",
    w: "min-w-[300px] sm:min-w-[360px]",
    illu: <NecklaceIllustration />,
  },
  {
    title: "گیره کمربند",
    desc: "با یک گیره محکم روی کمربند یا لبه جیب.",
    w: "min-w-[260px] sm:min-w-[300px]",
    illu: <BeltIllustration />,
  },
  {
    title: "اتصال به عصا",
    desc: "برای والدینی که با عصا راه می‌روند.",
    w: "min-w-[280px] sm:min-w-[320px]",
    illu: <CaneIllustration />,
  },
  {
    title: "کیف کودک",
    desc: "روی کیف مدرسه یا کوله کوچک کودک.",
    w: "min-w-[260px] sm:min-w-[300px]",
    illu: <BagIllustration />,
  },
];

export function ProductShowcase() {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    // RTL: positive dir scrolls toward start (right). We flip sign.
    el.scrollBy({ left: dir * -320, behavior: "smooth" });
  };

  return (
    <section className="bg-sand py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-teal font-extrabold leading-[1.15] tracking-tight"
              style={{
                fontSize: "clamp(1.9rem, 4vw, 3rem)",
                fontFamily: "var(--font-vazirmatn)",
              }}
            >
              یک دستگاه، کاربردهای بی‌شمار
            </motion.h2>
            <p className="mt-3 max-w-xl text-[1rem] leading-[1.9] text-muted-ink">
              ردیاب آرامسن ماژولار است؛ هر عضو خانواده می‌تواند آن را به شکلی که
              برایش راحت‌تر است همراه داشته باشد.
            </p>
          </div>
          {/* drag arrows (desktop) */}
          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              onClick={() => scrollBy(1)}
              aria-label="قبلی"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-divider bg-warmwhite text-teal transition-all hover:-translate-y-0.5 hover:border-teal-light/40"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => scrollBy(-1)}
              aria-label="بعدی"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-divider bg-warmwhite text-teal transition-all hover:-translate-y-0.5 hover:border-teal-light/40"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* asymmetric horizontal drag-scroll */}
        <div
          ref={scroller}
          className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
        >
          {USES.map((u, i) => (
            <motion.article
              key={u.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
              className={`${u.w} snap-start shrink-0 overflow-hidden rounded-[1.5rem] border border-divider bg-warmwhite p-6 transition-shadow hover:shadow-[0_20px_45px_-25px_rgba(28,62,58,0.45)]`}
            >
              <div className="flex h-44 items-end justify-center">
                {u.illu}
              </div>
              <div className="mt-5 border-t border-divider pt-4">
                <h3 className="text-[1.1rem] font-bold text-teal">{u.title}</h3>
                <p className="mt-1.5 text-[0.9rem] leading-relaxed text-muted-ink">
                  {u.desc}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
        <p className="mt-4 text-center text-[0.8rem] text-muted-ink sm:hidden">
          برای دیدن همه، بکشید ←
        </p>
      </div>
    </section>
  );
}

/* --- Custom mini illustrations (consistent teal stroke, warm accents) --- */

function Pebble({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="0" rx="22" ry="16" fill="#1c3e3a" />
      <ellipse cx="0" cy="-2" rx="22" ry="16" fill="#2f5650" />
      <circle cx="0" cy="-2" r="5" fill="#c97845" />
    </g>
  );
}

function NecklaceIllustration() {
  return (
    <svg viewBox="0 0 200 150" className="h-40 w-auto" fill="none">
      {/* chain */}
      <path
        d="M40 30 Q100 110 160 30"
        stroke="#9c8a6f"
        strokeWidth="2"
        strokeDasharray="2 4"
        strokeLinecap="round"
      />
      <Pebble x={100} y={100} />
    </svg>
  );
}

function BeltIllustration() {
  return (
    <svg viewBox="0 0 200 150" className="h-40 w-auto" fill="none">
      {/* belt */}
      <rect x="20" y="60" width="160" height="22" rx="4" fill="#8a7a61" />
      <rect x="20" y="60" width="160" height="22" rx="4" fill="#000" opacity="0.05" />
      {/* buckle */}
      <rect x="150" y="56" width="22" height="30" rx="3" fill="#c4a06a" />
      {/* clip + pebble */}
      <rect x="78" y="50" width="10" height="14" rx="2" fill="#1c3e3a" />
      <Pebble x={83} y={96} />
    </svg>
  );
}

function CaneIllustration() {
  return (
    <svg viewBox="0 0 200 150" className="h-40 w-auto" fill="none">
      {/* cane handle */}
      <path
        d="M70 30 Q40 30 40 60 L40 140"
        stroke="#8a7a61"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      {/* strap attaching pebble */}
      <path
        d="M40 70 q20 0 22 16"
        stroke="#1c3e3a"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <Pebble x={70} y={92} />
    </svg>
  );
}

function BagIllustration() {
  return (
    <svg viewBox="0 0 200 150" className="h-40 w-auto" fill="none">
      {/* backpack */}
      <rect x="60" y="40" width="90" height="95" rx="16" fill="#3e6b62" />
      <rect x="72" y="54" width="66" height="40" rx="8" fill="#2f5650" />
      {/* strap */}
      <path d="M78 40 Q100 20 132 40" stroke="#2f5650" strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* pebble clipped to side */}
      <Pebble x={150} y={104} />
    </svg>
  );
}
