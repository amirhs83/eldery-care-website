"use client";

import { motion } from "framer-motion";
import { toFa } from "@/lib/format";

type Cell = { aramsan: string; watch: string };
type Row = { label: string; cell: Cell; note?: string };

const ROWS: Row[] = [
  { label: "باتری چند روزه", cell: { aramsan: "۳ روز", watch: "حدود ۱ روز" } },
  { label: "یادآوری صوتی هنگام خروج", cell: { aramsan: "دارد", watch: "ندارد" } },
  { label: "دکمه اضطراری فیزیکی SOS", cell: { aramsan: "دارد", watch: "نرم‌افزاری" } },
  { label: "مناسب برای آلزایمر و فراموشی", cell: { aramsan: "ویژه", watch: "محدود" } },
  { label: "تماس بدون نیاز به گوشی هوشمند", cell: { aramsan: "دارد", watch: "ندارد" } },
  { label: "ایستگاه درب هوشمند", cell: { aramsan: "دارد", watch: "ندارد" } },
  { label: "هزینه اشتراک سالیانه", cell: { aramsan: "پایین", watch: "بالا" } },
];

export function Comparison() {
  return (
    <section className="bg-sand py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <span className="inline-block text-[0.82rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
            مقایسه
          </span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-3 text-teal font-extrabold leading-[1.15] tracking-tight"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", fontFamily: "var(--font-vazirmatn)" }}
          >
            سن یار در برابر ساعت‌های هوشمند رایج
          </motion.h2>
        </div>

        {/* Linear table */}
        <div className="overflow-hidden rounded-[1.5rem] border border-divider bg-warmwhite">
          {/* header */}
          <div className="grid grid-cols-12 bg-ivory px-5 py-4 text-[0.82rem] font-bold sm:px-7">
            <div className="col-span-6 text-muted-ink">ویژگی</div>
            <div className="col-span-3 text-center text-teal">سن یار</div>
            <div className="col-span-3 text-center text-muted-ink">ساعت هوشمند</div>
          </div>

          {/* body — سن یار column has a relative wrapper for the sweep */}
          <div className="relative">
            {/* sweep highlight on سن یار column */}
            <motion.div
              aria-hidden
              initial={{ y: "-100%" }}
              whileInView={{ y: "120%" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 col-span-3 left-1/2 ml-[1%] w-[20%] rounded-2xl"
              style={{
                background:
                  "linear-gradient(180deg, rgba(28,62,58,0) 0%, rgba(28,62,58,0.06) 50%, rgba(28,62,58,0) 100%)",
              }}
            />

            {ROWS.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                className={`grid grid-cols-12 items-center px-5 py-4 text-[0.9rem] sm:px-7 ${
                  i > 0 ? "border-t border-divider" : ""
                }`}
              >
                <div className="col-span-6 font-medium text-ink">{r.label}</div>
                <div className="col-span-3 text-center">
                  <span className="inline-flex items-center gap-1.5 font-bold text-teal">
                    <CheckIcon className="h-3.5 w-3.5" />
                    {r.cell.aramsan}
                  </span>
                </div>
                <div className="col-span-3 text-center text-muted-ink">
                  {r.cell.watch === "ندارد" ? (
                    <span className="inline-flex items-center gap-1.5">
                      <CrossIcon className="h-3.5 w-3.5" />
                      {r.cell.watch}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 opacity-80">
                      <MinusIcon className="h-3.5 w-3.5" />
                      {r.cell.watch}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <p className="mt-4 text-center text-[0.8rem] text-muted-ink">
          بر اساس مدل‌های رایج بازار تا {toFa(1405)}.
        </p>
      </div>
    </section>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CrossIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
function MinusIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M6 12h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
