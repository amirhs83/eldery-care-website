"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { toFa } from "@/lib/format";

type Result = {
  position: number;
  referralCode: string;
  name: string;
};

export function Waitlist() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [referredBy, setReferredBy] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setReferredBy(ref);
  }, []);

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
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          feedback: feedback.trim(),
          referredBy,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "خطایی رخ داد.");
      setResult({
        position: data.position,
        referralCode: data.referralCode,
        name: data.name,
      });
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "خطایی رخ داد.");
    }
  }

  return (
    <section id="waitlist" className="relative overflow-hidden bg-teal py-20 text-ivory sm:py-28">
      {/* ambient warm glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(222,152,98,0.16) 0%, rgba(28,62,58,0) 55%), radial-gradient(circle at 80% 90%, rgba(124,148,115,0.12) 0%, rgba(28,62,58,0) 50%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-ivory/15 bg-ivory/5 px-3.5 py-1.5 text-[0.78rem] font-semibold text-terracotta-light"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-terracotta-light" />
          لیست انتظار آرامسن
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-5 font-extrabold leading-[1.12] tracking-tight"
          style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", fontFamily: "var(--font-vazirmatn)" }}
        >
          جزو اولین خانواده‌های آرامسن باشید.
        </motion.h2>
        <p className="mx-auto mt-4 max-w-xl text-[1.05rem] leading-[1.9] text-ivory/70">
          اعضای اولیه آرامسن برای همیشه ۵۰٪ تخفیف دریافت خواهند کرد.
        </p>

        {/* Form card */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mt-10 max-w-xl rounded-[1.75rem] border border-divider/40 bg-warmwhite p-6 text-right shadow-[0_40px_80px_-40px_rgba(0,0,0,0.55)] sm:p-8"
        >
          <div className="space-y-4">
            <Field
              id="wl-name"
              label="نام و نام خانوادگی"
              value={fullName}
              onChange={setFullName}
              placeholder="مثلاً مریم احمدی"
              required
            />
            <Field
              id="wl-phone"
              label="شماره موبایل"
              value={phone}
              onChange={setPhone}
              placeholder="0912 345 6789"
              type="tel"
              dir="ltr"
              required
            />
            <Field
              id="wl-email"
              label="ایمیل (اختیاری)"
              value={email}
              onChange={setEmail}
              placeholder="you@email.com"
              type="email"
              dir="ltr"
            />
            <TextArea
              id="wl-feedback"
              label="پیشنهاد، انتقاد یا نکته‌ای که دوست دارید (اختیاری)"
              value={feedback}
              onChange={setFeedback}
              placeholder="مثلاً: برای چه شرایطی بیشترین نیاز به آرامسن دارید؟"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-4 text-[1rem] font-semibold text-warmwhite shadow-[0_14px_34px_-12px_rgba(201,120,69,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-light disabled:opacity-60"
          >
            {status === "loading" ? "در حال ثبت..." : "دریافت تخفیف ۵۰٪ مادام‌العمر"}
          </button>

          {status === "error" && (
            <p className="mt-3 text-center text-[0.85rem] text-destructive">{error}</p>
          )}

          <p className="mt-4 text-center text-[0.78rem] text-muted-ink">
            با ثبت‌نام، در زودترین زمان عرضه مطلع می‌شوید. اطلاعات شما محرمانه می‌ماند.
          </p>
        </motion.form>
      </div>

      {/* Success modal — calm expanding glow */}
      <AnimatePresence>
        {result && (
          <SuccessModal result={result} onClose={() => setResult(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required,
  dir,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.85rem] font-semibold text-teal">
        {label}
      </label>
      <input
        id={id}
        type={type}
        dir={dir}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-divider bg-ivory px-4 py-3 text-[1rem] text-ink outline-none transition-colors placeholder:text-muted-ink/60 focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
      />
    </div>
  );
}

function TextArea({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.85rem] font-semibold text-teal">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        maxLength={1000}
        className="w-full resize-y rounded-xl border border-divider bg-ivory px-4 py-3 text-[1rem] leading-relaxed text-ink outline-none transition-colors placeholder:text-muted-ink/60 focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
      />
    </div>
  );
}

function SuccessModal({
  result,
  onClose,
}: {
  result: Result;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}?ref=${result.referralCode}`
      : `?ref=${result.referralCode}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const shareText = encodeURIComponent(
    "من جزو اولین خانواده‌های آرامسن شدم. تو هم عضو شو و ۵۰٪ تخفیف مادام‌العمر بگیر:"
  );
  const waUrl = `https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`;
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${shareText}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="ثبت‌نام موفق"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-te/70 backdrop-blur-md"
        style={{ background: "rgba(20,32,30,0.72)" }}
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[1.75rem] border border-divider bg-warmwhite p-7 text-center shadow-2xl sm:p-9"
      >
        {/* calm expanding glow ring */}
        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center">
          <motion.span
            initial={{ scale: 0.4, opacity: 0.6 }}
            animate={{ scale: [0.4, 1.6, 1.6], opacity: [0.6, 0, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-teal/20"
          />
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-teal text-ivory"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
              <path d="M5 13l4 4 10-10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.span>
        </div>

        <h3 className="text-[1.4rem] font-extrabold text-teal" style={{ fontFamily: "var(--font-vazirmatn)" }}>
          به خانواده آرامسن خوش آمدید 🌿
        </h3>
        <p className="mt-2 text-[0.95rem] text-muted-ink">
          {result.name} عزیز، شما{" "}
          <span className="font-bold text-terracotta nums-fa">
            {toFa(result.position)}مین
          </span>{" "}
          خانواده در لیست انتظار هستید.
        </p>

        {/* Referral */}
        <div className="mt-6 rounded-2xl border border-divider bg-sand/60 p-4 text-right">
          <div className="flex items-center gap-2 text-[0.9rem] font-semibold text-teal">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-terracotta" fill="none">
              <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            با معرفی هر خانواده، در صف جلوتر می‌روید
          </div>
          <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-ink">
            لینک اختصاصی خود را با عزیزانتان به اشتراک بگذارید.
          </p>

          <div className="mt-3 flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              dir="ltr"
              className="min-w-0 flex-1 rounded-lg border border-divider bg-warmwhite px-3 py-2 text-[0.78rem] text-ink outline-none"
              onFocus={(e) => e.currentTarget.select()}
            />
            <button
              onClick={copy}
              className="shrink-0 rounded-lg bg-teal px-3 py-2 text-[0.78rem] font-semibold text-ivory transition-colors hover:bg-teal-light"
            >
              {copied ? "کپی شد ✓" : "کپی"}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-divider bg-warmwhite px-3 py-1.5 text-[0.78rem] font-medium text-teal transition-colors hover:bg-sand"
            >
              واتساپ
            </a>
            <a
              href={tgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-divider bg-warmwhite px-3 py-1.5 text-[0.78rem] font-medium text-teal transition-colors hover:bg-sand"
            >
              تلگرام
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 text-[0.85rem] font-semibold text-muted-ink underline-offset-4 hover:text-teal hover:underline"
        >
          بستن
        </button>
      </motion.div>
    </motion.div>
  );
}
