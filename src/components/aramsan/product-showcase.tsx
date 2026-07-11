"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const USES = [
  {
    title: "گردنبند",
    desc: "روی گردن، ظریف و سبک برای استفاده روزمره.",
    w: "min-w-[300px] sm:min-w-[340px]",
    img: "/products/use-necklace.png",
    alt: "ردیاب سن یار به‌صورت گردنبند روی طناب مشکی مینیمال",
  },
  {
    title: "گیره کمربند",
    desc: "با یک گیره محکم روی کمربند یا لبه جیب.",
    w: "min-w-[260px] sm:min-w-[300px]",
    img: "/products/use-belt.png",
    alt: "ردیاب سن یار متصل به کمربند چرمی با گیره",
  },
  {
    title: "اتصال به عصا",
    desc: "برای والدینی که با عصا راه می‌روند.",
    w: "min-w-[280px] sm:min-w-[320px]",
    img: "/products/use-cane.png",
    alt: "ردیاب سن یار متصل به عصای چوبی با بند ظریف",
  },
  {
    title: "کیف کودک",
    desc: "روی کیف مدرسه یا کوله کوچک کودک.",
    w: "min-w-[260px] sm:min-w-[300px]",
    img: "/products/use-bag.png",
    alt: "ردیاب سن یار متصل به کیف کودک با گیره",
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
              ردیاب سن یار ماژولار است؛ هر عضو خانواده می‌تواند آن را به شکلی که
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
              className={`${u.w} snap-start shrink-0 overflow-hidden rounded-[1.5rem] border border-divider bg-warmwhite p-4 transition-shadow hover:shadow-[0_20px_45px_-25px_rgba(28,62,58,0.45)]`}
            >
              <div className="flex h-52 items-center justify-center overflow-hidden rounded-[1rem] bg-ivory">
                <img
                  src={u.img}
                  alt={u.alt}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>
              <div className="mt-4 px-1 pb-1">
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
