"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toFa } from "@/lib/format";

export function MidScrollCta() {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [position, setPosition] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "عضو لیست انتظار",
          phone: phone.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "خطایی رخ داد.");
      }
      setPosition(data.position);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "خطایی رخ داد.");
    }
  }

  return (
    <section className="bg-ivory py-14 sm:py-16">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="overflow-hidden rounded-[1.75rem] border border-divider bg-warmwhite p-6 shadow-[0_20px_50px_-30px_rgba(28,62,58,0.4)] sm:p-8"
        >
          <AnimatePresence mode="wait">
            {status === "done" ? (
              <motion.div
                key="done"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 text-teal">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                    <path
                      d="M5 13l4 4 10-10"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-[1.05rem] font-semibold text-teal">
                  به خانواده آرامسن خوش آمدید 🌿
                </p>
                <p className="text-[0.92rem] text-muted-ink">
                  شما{" "}
                  <span className="font-bold text-terracotta nums-fa">
                    {toFa(position ?? 0)}مین
                  </span>{" "}
                  خانواده هستید. برای دریافت لینک دعوت، به فرم کامل پایین صفحه
                  بروید.
                </p>
                <button
                  onClick={() =>
                    document
                      .getElementById("waitlist")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-1 text-[0.9rem] font-semibold text-terracotta underline-offset-4 hover:underline"
                >
                  مشاهده لینک دعوت ↓
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-end"
              >
                <div className="flex-1">
                  <label
                    htmlFor="mid-phone"
                    className="mb-2 block text-[1.05rem] font-semibold text-teal"
                  >
                    همین الان جزو اولین خانواده‌ها باش.
                  </label>
                  <p className="mb-3 text-[0.85rem] text-muted-ink">
                    فقط شماره موبایلت رو وارد کن — چند ثانیه طول می‌کشه.
                  </p>
                  <input
                    id="mid-phone"
                    type="tel"
                    inputMode="tel"
                    dir="ltr"
                    placeholder="0912 345 6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-divider bg-ivory px-4 py-3 text-[1rem] text-ink outline-none transition-colors placeholder:text-muted-ink/60 focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-terracotta px-6 py-3 text-[0.95rem] font-semibold text-warmwhite transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-light disabled:opacity-60 sm:py-3.5"
                >
                  {status === "loading" ? "در حال ثبت..." : "ثبت‌نام سریع"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {status === "error" && (
            <p className="mt-3 text-[0.85rem] text-destructive">{error}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
