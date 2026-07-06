"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";
import { toast, Toaster as SonnerToaster } from "sonner";
import { AramsanMark } from "./logo";
import { computeSeoScore, type SeoScoreResult } from "@/lib/seo-score";

/**
 * Admin overlay — hash-routed like the blog overlay:
 *
 *   #admin                       → dashboard (defaults to waitlist)
 *   #admin/waitlist              → waitlist management
 *   #admin/blog                  → blog list
 *   #admin/blog/new              → blog editor (new post)
 *   #admin/blog/<id>/edit        → blog editor (existing post)
 *
 * Auth gate: checks GET /api/admin/session. If not authed, shows a login
 * screen that POSTs to /api/admin/login. On success, the dashboard mounts.
 */

type AdminView =
  | { kind: "waitlist" }
  | { kind: "blog-list" }
  | { kind: "blog-new" }
  | { kind: "blog-edit"; id: string };

export function AdminOverlay() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<AdminView>({ kind: "waitlist" });
  const [authed, setAuthed] = useState<boolean | null>(null);

  const parseHash = useCallback((): { open: boolean; view: AdminView } => {
    const h = window.location.hash.replace(/^#/, "");
    if (!h.startsWith("admin")) return { open: false, view: { kind: "waitlist" } };
    const sub = h.replace(/^admin\/?/, ""); // strip "admin" + optional "/"
    if (sub === "" || sub === "waitlist")
      return { open: true, view: { kind: "waitlist" } };
    if (sub === "blog") return { open: true, view: { kind: "blog-list" } };
    if (sub === "blog/new") return { open: true, view: { kind: "blog-new" } };
    const editMatch = sub.match(/^blog\/([^/]+)\/edit$/);
    if (editMatch) {
      return { open: true, view: { kind: "blog-edit", id: editMatch[1] } };
    }
    return { open: true, view: { kind: "waitlist" } };
  }, []);

  useEffect(() => {
    const onHash = () => {
      const { open: o, view: v } = parseHash();
      setOpen(o);
      setView(v);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [parseHash]);

  // Check session whenever the overlay opens.
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setAuthed(!!data?.authed);
      })
      .catch(() => {
        if (!cancelled) setAuthed(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  // Body scroll lock while open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  // Reset scroll to top when view changes.
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (scrollRef) scrollRef.scrollTo({ top: 0 });
  }, [view, scrollRef]);

  const close = useCallback(() => {
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );
    setOpen(false);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    toast.success("از حساب مدیریت خارج شدید.");
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[95] bg-ivory"
          role="dialog"
          aria-modal="true"
          aria-label="پنل مدیریت آرامسن"
        >
          <SonnerToaster position="top-center" richColors closeButton />

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
              بازگشت به سایت
            </button>

            <div className="flex items-center gap-2">
              <AramsanMark className="h-6 w-6" />
              <span
                className="text-[1.1rem] font-extrabold text-teal"
                style={{ fontFamily: "var(--font-vazirmatn)" }}
              >
                آرامسن
              </span>
              <span className="ms-2 hidden text-[0.78rem] text-muted-ink sm:inline">
                / پنل مدیریت
              </span>
            </div>

            {authed && (
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full border border-divider bg-warmwhite px-3.5 py-2 text-[0.85rem] font-semibold text-muted-ink transition-all hover:-translate-y-0.5 hover:border-terracotta/40 hover:text-terracotta"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                خروج
              </button>
            )}
          </div>

          {/* scrollable content */}
          <div
            ref={setScrollRef}
            className="h-[calc(100vh-4rem)] overflow-y-auto"
          >
            <AnimatePresence mode="wait">
              {authed === null ? (
                <LoadingScreen key="loading" />
              ) : !authed ? (
                <AdminLogin
                  key="login"
                  onSuccess={() => setAuthed(true)}
                />
              ) : view.kind === "waitlist" ? (
                <WaitlistSection key="waitlist" />
              ) : view.kind === "blog-list" ? (
                <BlogListSection key="blog-list" />
              ) : view.kind === "blog-new" ? (
                <BlogEditor key="blog-new" mode="new" />
              ) : (
                <BlogEditor
                  key={`blog-edit-${view.id}`}
                  mode="edit"
                  id={view.id}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------- Loading ----------------------------- */

function LoadingScreen() {
  return (
    <div className="flex h-full min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-ink">
        <span className="h-9 w-9 animate-spin rounded-full border-2 border-divider border-t-teal" />
        <span className="text-[0.9rem]">در حال بارگیری...</span>
      </div>
    </div>
  );
}

/* ----------------------------- Login ----------------------------- */

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) {
        setError(data?.error || "ورود ناموفق بود.");
        setLoading(false);
        return;
      }
      onSuccess();
    } catch {
      setError("خطا در اتصال به سرور.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-5 py-10">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-[1.5rem] border border-divider bg-warmwhite p-7 shadow-[0_30px_60px_-40px_rgba(28,62,58,0.45)] sm:p-9"
      >
        <div className="flex items-center justify-center gap-2">
          <AramsanMark className="h-9 w-9" />
          <span
            className="text-[1.3rem] font-extrabold text-teal"
            style={{ fontFamily: "var(--font-vazirmatn)" }}
          >
            آرامسن
          </span>
        </div>
        <h1 className="mt-5 text-center text-[1.4rem] font-extrabold text-teal">
          ورود به پنل مدیریت
        </h1>
        <p className="mt-2 text-center text-[0.88rem] text-muted-ink">
          برای ادامه رمز عبور مدیریت را وارد کنید.
        </p>

        <div className="mt-6 space-y-2">
          <label
            htmlFor="admin-password"
            className="block text-[0.85rem] font-semibold text-teal"
          >
            رمز عبور
          </label>
          <input
            id="admin-password"
            type="password"
            dir="ltr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
            className="w-full rounded-xl border border-divider bg-ivory px-4 py-3 text-[1rem] text-ink outline-none transition-colors placeholder:text-muted-ink/60 focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
          />
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-center text-[0.85rem] text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !password}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-3.5 text-[1rem] font-semibold text-warmwhite shadow-[0_14px_34px_-12px_rgba(201,120,69,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-light disabled:opacity-60"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </motion.form>
    </div>
  );
}

/* ------------------------- Section router ------------------------- */

function SectionLayout({
  active,
  children,
}: {
  active: "waitlist" | "blog";
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
      {/* Sidebar (right side in RTL because it appears first) */}
      <aside className="lg:w-56 lg:shrink-0">
        <div className="rounded-2xl border border-divider bg-warmwhite p-3 lg:sticky lg:top-4">
          <nav className="flex gap-2 lg:flex-col">
            <NavItem
              active={active === "waitlist"}
              href="#admin/waitlist"
              label="لیست انتظار"
              icon={
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M4 6h16M4 12h16M4 18h10"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
            <NavItem
              active={active === "blog"}
              href="#admin/blog"
              label="وبلاگ"
              icon={
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M4 5a2 2 0 0 1 2-2h8l6 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 3v6h6M8 13h8M8 17h6"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              }
            />
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

function NavItem({
  active,
  href,
  label,
  icon,
}: {
  active: boolean;
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-[0.92rem] font-semibold transition-colors ${
        active
          ? "bg-teal text-warmwhite"
          : "text-muted-ink hover:bg-sand hover:text-teal"
      }`}
    >
      <span>{icon}</span>
      {label}
    </a>
  );
}

/* ------------------------- Waitlist section ------------------------- */

type WaitlistEntry = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  feedback: string | null;
  referralCode: string;
  referredBy: string | null;
  archived: boolean;
  createdAt: string;
  createdAtFa: string;
};

function WaitlistSection() {
  const [entries, setEntries] = useState<WaitlistEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [showArchived, setShowArchived] = useState(false);

  const [searchTick, setSearchTick] = useState(0);
  // Debounce search field.
  useEffect(() => {
    const t = setTimeout(() => setSearchTick((n) => n + 1), 350);
    return () => clearTimeout(t);
  }, [q]);

  // Build query string for fetch + CSV export.
  const buildQuery = useCallback(
    (opts: { csv?: boolean } = {}) => {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      params.set("sort", sort);
      params.set("archived", showArchived ? "true" : "false");
      return params;
    },
    [q, from, to, sort, showArchived]
  );

  const reload = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/admin/waitlist?${buildQuery().toString()}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!data?.ok) {
        setError(data?.error || "خطا در بارگیری.");
        setEntries([]);
        return;
      }
      setError(null);
      setEntries(data.entries);
    } catch {
      setError("خطا در اتصال به سرور.");
      setEntries([]);
    }
  }, [buildQuery]);

  // Reload on filter change (debounced via searchTick for q).
  useEffect(() => {
    // reload() is async — setState calls happen after `await`, not synchronously.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
  }, [searchTick, from, to, sort, showArchived, reload]);

  async function exportCsv() {
    try {
      const res = await fetch(
        `/api/admin/waitlist/export?${buildQuery().toString()}`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        toast.error("خطا در ساخت فایل CSV.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "waitlist.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("فایل CSV آماده شد.");
    } catch {
      toast.error("خطا در ارتباط با سرور.");
    }
  }

  async function archive(id: string, archived: boolean) {
    const prev = entries;
    // Optimistic update.
    setEntries(
      (cur) => cur?.map((e) => (e.id === id ? { ...e, archived } : e)) ?? null
    );
    try {
      const res = await fetch("/api/admin/waitlist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, archived }),
      });
      const data = await res.json();
      if (!data?.ok) {
        setEntries(prev);
        toast.error(data?.error || "خطا در به‌روزرسانی.");
      } else {
        toast.success(archived ? "آرشیو شد." : "بازگردانده شد.");
      }
    } catch {
      setEntries(prev);
      toast.error("خطا در ارتباط با سرور.");
    }
  }

  async function remove(id: string) {
    if (!window.confirm("این ثبت‌نام برای همیشه حذف می‌شود. مطمئن هستید؟")) return;
    const prev = entries;
    setEntries((cur) => cur?.filter((e) => e.id !== id) ?? null);
    try {
      const res = await fetch("/api/admin/waitlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!data?.ok) {
        setEntries(prev);
        toast.error(data?.error || "خطا در حذف.");
      } else {
        toast.success("حذف شد.");
      }
    } catch {
      setEntries(prev);
      toast.error("خطا در ارتباط با سرور.");
    }
  }

  return (
    <SectionLayout active="waitlist">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[1.5rem] font-extrabold text-teal">
            لیست انتظار
          </h1>
          {entries && (
            <span className="text-[0.85rem] text-muted-ink">
              تعداد:{" "}
              <span className="font-bold text-teal nums-fa">
                {toFaDigits(entries.length)}
              </span>
            </span>
          )}
        </div>

        {/* Toolbar */}
        <div className="rounded-2xl border border-divider bg-warmwhite p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <label className="mb-1 block text-[0.78rem] font-semibold text-teal">
                جستجو (نام / موبایل / ایمیل / پیشنهاد)
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="مثلاً مریم یا 0912..."
                className="w-full rounded-lg border border-divider bg-ivory px-3 py-2 text-[0.92rem] outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
              />
            </div>
            <div>
              <label className="mb-1 block text-[0.78rem] font-semibold text-teal">
                از تاریخ
              </label>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-lg border border-divider bg-ivory px-3 py-2 text-[0.92rem] outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                dir="ltr"
              />
            </div>
            <div>
              <label className="mb-1 block text-[0.78rem] font-semibold text-teal">
                تا تاریخ
              </label>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-lg border border-divider bg-ivory px-3 py-2 text-[0.92rem] outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                dir="ltr"
              />
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value as "newest" | "oldest")
              }
              className="rounded-lg border border-divider bg-ivory px-3 py-2 text-[0.9rem] outline-none focus:border-teal-light"
            >
              <option value="newest">جدیدترین</option>
              <option value="oldest">قدیمی‌ترین</option>
            </select>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-divider bg-ivory px-3 py-2 text-[0.9rem]">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="accent-teal"
              />
              نمایش آرشیو شده‌ها
            </label>

            <div className="ms-auto flex items-center gap-2">
              <button
                onClick={exportCsv}
                className="inline-flex items-center gap-2 rounded-full border border-divider bg-warmwhite px-3.5 py-2 text-[0.85rem] font-semibold text-teal transition-all hover:-translate-y-0.5 hover:border-teal-light/40"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                خروجی CSV
              </button>
              <button
                onClick={reload}
                className="inline-flex items-center gap-2 rounded-full border border-divider bg-warmwhite px-3.5 py-2 text-[0.85rem] font-semibold text-teal transition-all hover:-translate-y-0.5 hover:border-teal-light/40"
                aria-label="به‌روزرسانی"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path
                    d="M21 12a9 9 0 1 1-2.64-6.36M21 4v5h-5"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                به‌روزرسانی
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {error ? (
          <div className="rounded-2xl border border-divider bg-warmwhite p-6 text-center text-[0.95rem] text-destructive">
            {error}
          </div>
        ) : !entries ? (
          <div className="rounded-2xl border border-divider bg-warmwhite p-10 text-center text-[0.9rem] text-muted-ink">
            <span className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-divider border-t-teal align-middle" />{" "}
            در حال بارگیری...
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl border border-divider bg-warmwhite p-10 text-center text-[0.95rem] text-muted-ink">
            هیچ ثبت‌نامی یافت نشد.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-divider bg-warmwhite">
            <div className="max-h-[60vh] overflow-y-auto">
              <table className="w-full border-collapse text-[0.88rem]">
                <thead className="sticky top-0 z-10 bg-sand/80 text-teal backdrop-blur">
                  <tr className="text-right">
                    <th className="border-b border-divider px-4 py-3 font-bold">نام</th>
                    <th className="border-b border-divider px-4 py-3 font-bold">موبایل</th>
                    <th className="hidden border-b border-divider px-4 py-3 font-bold sm:table-cell">ایمیل</th>
                    <th className="hidden border-b border-divider px-4 py-3 font-bold md:table-cell">پیشنهاد/انتقاد</th>
                    <th className="border-b border-divider px-4 py-3 font-bold">تاریخ ثبت‌نام</th>
                    <th className="border-b border-divider px-4 py-3 font-bold">وضعیت</th>
                    <th className="border-b border-divider px-4 py-3 font-bold">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-divider/60 align-top transition-colors hover:bg-sand/40"
                    >
                      <td className="px-4 py-3 font-semibold text-ink">
                        {e.fullName}
                      </td>
                      <td className="px-4 py-3 text-ink" dir="ltr">
                        {e.phone}
                      </td>
                      <td
                        className="hidden px-4 py-3 text-muted-ink sm:table-cell"
                        dir="ltr"
                      >
                        {e.email || "—"}
                      </td>
                      <td
                        className="hidden max-w-[18rem] px-4 py-3 text-muted-ink md:table-cell"
                        title={e.feedback || ""}
                      >
                        <span className="line-clamp-2">
                          {e.feedback || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-ink">
                        {e.createdAtFa}
                      </td>
                      <td className="px-4 py-3">
                        {e.archived ? (
                          <span className="inline-flex items-center rounded-full bg-divider/60 px-2.5 py-0.5 text-[0.74rem] font-semibold text-muted-ink">
                            آرشیو
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-safe/15 px-2.5 py-0.5 text-[0.74rem] font-semibold text-safe">
                            فعال
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => archive(e.id, !e.archived)}
                            className="rounded-md border border-divider bg-ivory px-2.5 py-1 text-[0.78rem] font-medium text-teal transition-colors hover:border-teal-light/50"
                          >
                            {e.archived ? "بازگردانی" : "آرشیو"}
                          </button>
                          <button
                            onClick={() => remove(e.id)}
                            className="rounded-md border border-destructive/30 bg-ivory px-2.5 py-1 text-[0.78rem] font-medium text-destructive transition-colors hover:bg-destructive/10"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SectionLayout>
  );
}

/* ------------------------- Blog list section ------------------------- */

type AdminBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  status: string;
  readTime: string;
  featured: boolean;
  publishedAtFa: string | null;
  updatedAt: string;
};

function BlogListSection() {
  const [posts, setPosts] = useState<AdminBlogPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [searchTick, setSearchTick] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setSearchTick((n) => n + 1), 350);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (status !== "all") params.set("status", status);
    fetch(`/api/admin/blog?${params.toString()}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data?.ok) {
          setPosts(null);
          setError(data?.error || "خطا در بارگیری.");
          return;
        }
        setError(null);
        setPosts(data.posts);
      })
      .catch(() => {
        if (!cancelled) {
          setPosts(null);
          setError("خطا در اتصال به سرور.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [searchTick, status, q]);

  async function remove(id: string, title: string) {
    if (!window.confirm(`مقاله «${title}» حذف شود؟`)) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data?.ok) {
        toast.error(data?.error || "خطا در حذف.");
        return;
      }
      toast.success("مقاله حذف شد.");
      setPosts((cur) => cur?.filter((p) => p.id !== id) ?? null);
    } catch {
      toast.error("خطا در ارتباط با سرور.");
    }
  }

  return (
    <SectionLayout active="blog">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[1.5rem] font-extrabold text-teal">وبلاگ</h1>
          <a
            href="#admin/blog/new"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-[0.9rem] font-semibold text-warmwhite shadow-[0_10px_26px_-10px_rgba(201,120,69,0.7)] transition-all hover:-translate-y-0.5 hover:bg-terracotta-light"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            مقاله‌ی جدید
          </a>
        </div>

        <div className="rounded-2xl border border-divider bg-warmwhite p-4">
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="جستجو در عنوان / نامک / دسته‌بندی..."
              className="min-w-[14rem] flex-1 rounded-lg border border-divider bg-ivory px-3 py-2 text-[0.92rem] outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
            />
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "all" | "draft" | "published")
              }
              className="rounded-lg border border-divider bg-ivory px-3 py-2 text-[0.9rem] outline-none focus:border-teal-light"
            >
              <option value="all">همه</option>
              <option value="published">منتشر شده</option>
              <option value="draft">پیش‌نویس</option>
            </select>
          </div>
        </div>

        {error ? (
          <div className="rounded-2xl border border-divider bg-warmwhite p-6 text-center text-[0.95rem] text-destructive">
            {error}
          </div>
        ) : !posts ? (
          <div className="rounded-2xl border border-divider bg-warmwhite p-10 text-center text-[0.9rem] text-muted-ink">
            <span className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-divider border-t-teal align-middle" />{" "}
            در حال بارگیری...
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-divider bg-warmwhite p-10 text-center text-[0.95rem] text-muted-ink">
            هیچ مقاله‌ای یافت نشد.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-divider bg-warmwhite">
            <div className="max-h-[65vh] overflow-y-auto">
              <table className="w-full border-collapse text-[0.88rem]">
                <thead className="sticky top-0 z-10 bg-sand/80 text-teal backdrop-blur">
                  <tr className="text-right">
                    <th className="border-b border-divider px-4 py-3 font-bold">عنوان</th>
                    <th className="border-b border-divider px-4 py-3 font-bold">دسته‌بندی</th>
                    <th className="border-b border-divider px-4 py-3 font-bold">وضعیت</th>
                    <th className="hidden border-b border-divider px-4 py-3 font-bold sm:table-cell">تاریخ انتشار</th>
                    <th className="border-b border-divider px-4 py-3 font-bold">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-divider/60 align-top transition-colors hover:bg-sand/40"
                    >
                      <td className="px-4 py-3 font-semibold text-ink">
                        <div className="flex items-center gap-2">
                          {p.featured && (
                            <span className="inline-flex items-center rounded-full bg-terracotta/15 px-2 py-0.5 text-[0.68rem] font-semibold text-terracotta">
                              ویژه
                            </span>
                          )}
                          {p.title}
                        </div>
                        <div className="mt-0.5 text-[0.74rem] text-muted-ink" dir="ltr">
                          {p.slug}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-ink">{p.category || "—"}</td>
                      <td className="px-4 py-3">
                        {p.status === "published" ? (
                          <span className="inline-flex items-center rounded-full bg-safe/15 px-2.5 py-0.5 text-[0.74rem] font-semibold text-safe">
                            منتشر شده
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-divider/60 px-2.5 py-0.5 text-[0.74rem] font-semibold text-muted-ink">
                            پیش‌نویس
                          </span>
                        )}
                      </td>
                      <td className="hidden px-4 py-3 text-muted-ink sm:table-cell">
                        {p.publishedAtFa || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <a
                            href={`#admin/blog/${p.id}/edit`}
                            className="rounded-md border border-divider bg-ivory px-2.5 py-1 text-[0.78rem] font-medium text-teal transition-colors hover:border-teal-light/50"
                          >
                            ویرایش
                          </a>
                          <button
                            onClick={() => remove(p.id, p.title)}
                            className="rounded-md border border-destructive/30 bg-ivory px-2.5 py-1 text-[0.78rem] font-medium text-destructive transition-colors hover:bg-destructive/10"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SectionLayout>
  );
}

/* ------------------------- Blog editor ------------------------- */

type BlogEditorState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  status: "draft" | "published";
  publishedAt: string; // datetime-local value
  coverImage: string;
  coverAlt: string;
  readTime: string;
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  ogImage: string;
  focusKeyword: string;
  schemaType: "Article" | "BlogPosting";
};

const EMPTY_STATE: BlogEditorState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  tags: "",
  status: "draft",
  publishedAt: "",
  coverImage: "",
  coverAlt: "",
  readTime: "",
  featured: false,
  metaTitle: "",
  metaDescription: "",
  canonical: "",
  ogImage: "",
  focusKeyword: "",
  schemaType: "BlogPosting",
};

function BlogEditor({ mode, id }: { mode: "new" | "edit"; id?: string }) {
  const [state, setState] = useState<BlogEditorState>(EMPTY_STATE);
  const [loading, setLoading] = useState(mode === "edit");
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Load existing post when editing.
  useEffect(() => {
    if (mode !== "edit" || !id) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/admin/blog/${id}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data?.ok) {
          setNotFound(true);
          return;
        }
        const p = data.post;
        setState({
          title: p.title || "",
          slug: p.slug || "",
          excerpt: p.excerpt || "",
          content: p.content || "",
          category: p.category || "",
          tags: p.tags || "",
          status: p.status === "published" ? "published" : "draft",
          publishedAt: p.publishedAtIso
            ? toDatetimeLocal(p.publishedAtIso)
            : "",
          coverImage: p.img || "",
          coverAlt: p.alt || "",
          readTime: p.readTime || "",
          featured: !!p.featured,
          metaTitle: p.metaTitle || "",
          metaDescription: p.metaDescription || "",
          canonical: p.canonical || "",
          ogImage: p.ogImage || "",
          focusKeyword: p.focusKeyword || "",
          schemaType: p.schemaType === "Article" ? "Article" : "BlogPosting",
        });
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, id]);

  // SEO score (recomputes live as the user types).
  const seo: SeoScoreResult = useMemo(
    () =>
      computeSeoScore({
        title: state.title,
        slug: state.slug,
        excerpt: state.excerpt,
        content: state.content,
        metaTitle: state.metaTitle,
        metaDescription: state.metaDescription,
        focusKeyword: state.focusKeyword,
        coverImage: state.coverImage,
        coverAlt: state.coverAlt,
      }),
    [state]
  );

  function set<K extends keyof BlogEditorState>(
    key: K,
    value: BlogEditorState[K]
  ) {
    setState((cur) => ({ ...cur, [key]: value }));
  }

  function autoSlug() {
    // Generate locally (mirrors the server-side slugifyFa).
    const slug = slugifyFaLocal(state.title);
    set("slug", slug);
  }

  async function save(targetStatus: "draft" | "published") {
    if (saving) return;
    if (!state.title.trim()) {
      toast.error("عنوان مقاله را وارد کنید.");
      return;
    }
    setSaving(true);
    const body = {
      ...state,
      status: targetStatus,
      coverImage: state.coverImage || null,
      coverAlt: state.coverAlt || null,
      metaTitle: state.metaTitle || null,
      metaDescription: state.metaDescription || null,
      canonical: state.canonical || null,
      ogImage: state.ogImage || null,
      focusKeyword: state.focusKeyword || null,
      publishedAt: state.publishedAt
        ? new Date(state.publishedAt).toISOString()
        : null,
    };
    try {
      const url =
        mode === "new"
          ? "/api/admin/blog"
          : `/api/admin/blog/${id}`;
      const method = mode === "new" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data?.ok) {
        toast.error(data?.error || "خطا در ذخیره.");
        setSaving(false);
        return;
      }
      toast.success(
        targetStatus === "published" ? "مقاله منتشر شد." : "پیش‌نویس ذخیره شد."
      );
      // Navigate to the edit view for the saved post.
      const newId = data.post.id;
      if (mode === "new") {
        window.location.hash = `admin/blog/${newId}/edit`;
      } else {
        // Update local state with returned post.
        const p = data.post;
        setState((cur) => ({
          ...cur,
          status: p.status === "published" ? "published" : "draft",
          slug: p.slug || cur.slug,
          readTime: p.readTime || cur.readTime,
          publishedAt: p.publishedAtIso
            ? toDatetimeLocal(p.publishedAtIso)
            : cur.publishedAt,
        }));
      }
    } catch {
      toast.error("خطا در ارتباط با سرور.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 text-muted-ink">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-divider border-t-teal" />
          در حال بارگیری مقاله...
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-[1.05rem] text-destructive">مقاله پیدا نشد.</p>
        <a
          href="#admin/blog"
          className="mt-3 inline-flex rounded-full border border-divider bg-warmwhite px-4 py-2 text-[0.9rem] font-semibold text-teal"
        >
          بازگشت به فهرست
        </a>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Action bar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <a
            href="#admin/blog"
            className="inline-flex items-center gap-2 rounded-full border border-divider bg-warmwhite px-3.5 py-2 text-[0.85rem] font-semibold text-teal transition-all hover:-translate-y-0.5 hover:border-teal-light/40"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            بازگشت
          </a>
          <h1 className="text-[1.3rem] font-extrabold text-teal">
            {mode === "new" ? "مقاله‌ی جدید" : "ویرایش مقاله"}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-divider bg-warmwhite px-3.5 py-2 text-[0.85rem] font-semibold text-teal transition-all hover:-translate-y-0.5 hover:border-teal-light/40"
          >
            {showPreview ? "ویرایش" : "پیش‌نمایش"}
          </button>
          <button
            onClick={() => save("draft")}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-warmwhite px-4 py-2 text-[0.85rem] font-semibold text-teal transition-all hover:-translate-y-0.5 hover:bg-teal hover:text-warmwhite disabled:opacity-60"
          >
            ذخیره پیش‌نویس
          </button>
          <button
            onClick={() => save("published")}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-4 py-2 text-[0.85rem] font-semibold text-warmwhite shadow-[0_10px_26px_-10px_rgba(201,120,69,0.7)] transition-all hover:-translate-y-0.5 hover:bg-terracotta-light disabled:opacity-60"
          >
            انتشار
          </button>
        </div>
      </div>

      {showPreview ? (
        <ArticlePreview state={state} />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]">
          {/* Main column */}
          <div className="space-y-5">
            <Field label="عنوان" required>
              <input
                value={state.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="عنوان مقاله..."
                className="w-full rounded-xl border border-divider bg-warmwhite px-4 py-2.5 text-[1rem] font-semibold text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
              />
            </Field>

            <Field label="نامک (slug)">
              <div className="flex items-stretch gap-2">
                <input
                  value={state.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  dir="ltr"
                  placeholder="auto-or-custom-slug"
                  className="min-w-0 flex-1 rounded-xl border border-divider bg-warmwhite px-4 py-2.5 text-[0.95rem] text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                />
                <button
                  type="button"
                  onClick={autoSlug}
                  className="shrink-0 rounded-xl border border-divider bg-ivory px-3 text-[0.8rem] font-semibold text-teal transition-colors hover:border-teal-light/50"
                >
                  خودکار
                </button>
              </div>
            </Field>

            <Field label="خلاصه (excerpt)">
              <textarea
                value={state.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={3}
                placeholder="خلاصه‌ی کوتاه مقاله..."
                className="w-full resize-y rounded-xl border border-divider bg-warmwhite px-4 py-2.5 text-[0.95rem] leading-relaxed text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
              />
            </Field>

            <Field label="متن (Markdown)">
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <textarea
                  value={state.content}
                  onChange={(e) => set("content", e.target.value)}
                  rows={18}
                  placeholder="متن مقاله با فرمت Markdown..."
                  className="w-full resize-y rounded-xl border border-divider bg-warmwhite px-4 py-2.5 font-mono text-[0.9rem] leading-relaxed text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                  dir="rtl"
                  style={{ fontFamily: "var(--font-vazirmatn), monospace" }}
                />
                <div className="hidden xl:block">
                  <div className="mb-1.5 text-[0.78rem] font-semibold text-muted-ink">
                    پیش‌نمایش زنده
                  </div>
                  <div className="max-h-[28rem] overflow-y-auto rounded-xl border border-divider bg-ivory p-4">
                    <MarkdownPreview content={state.content} />
                  </div>
                </div>
              </div>
            </Field>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="دسته‌بندی">
                <input
                  value={state.category}
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="مثلاً مراقبت خانواده"
                  className="w-full rounded-xl border border-divider bg-warmwhite px-4 py-2.5 text-[0.95rem] text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                />
              </Field>
              <Field label="برچسب‌ها (با ویرگول)">
                <input
                  value={state.tags}
                  onChange={(e) => set("tags", e.target.value)}
                  placeholder="سالمندان، آلزایمر، مراقبت"
                  className="w-full rounded-xl border border-divider bg-warmwhite px-4 py-2.5 text-[0.95rem] text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="آدرس تصویر کاور">
                <input
                  value={state.coverImage}
                  onChange={(e) => set("coverImage", e.target.value)}
                  dir="ltr"
                  placeholder="/blog/featured.png"
                  className="w-full rounded-xl border border-divider bg-warmwhite px-4 py-2.5 text-[0.9rem] text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                />
              </Field>
              <Field label="متن جایگزین تصویر (alt)">
                <input
                  value={state.coverAlt}
                  onChange={(e) => set("coverAlt", e.target.value)}
                  placeholder="توضیح تصویر برای دسترسی‌پذیری"
                  className="w-full rounded-xl border border-divider bg-warmwhite px-4 py-2.5 text-[0.95rem] text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <Field label="زمان مطالعه">
                <input
                  value={state.readTime}
                  onChange={(e) => set("readTime", e.target.value)}
                  placeholder="خودکار"
                  className="w-full rounded-xl border border-divider bg-warmwhite px-4 py-2.5 text-[0.95rem] text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                />
              </Field>
              <Field label="وضعیت">
                <select
                  value={state.status}
                  onChange={(e) =>
                    set("status", e.target.value as "draft" | "published")
                  }
                  className="w-full rounded-xl border border-divider bg-warmwhite px-3 py-2.5 text-[0.95rem] text-ink outline-none focus:border-teal-light"
                >
                  <option value="draft">پیش‌نویس</option>
                  <option value="published">منتشر شده</option>
                </select>
              </Field>
              <Field label="تاریخ انتشار">
                <input
                  type="datetime-local"
                  value={state.publishedAt}
                  onChange={(e) => set("publishedAt", e.target.value)}
                  className="w-full rounded-xl border border-divider bg-warmwhite px-3 py-2.5 text-[0.9rem] text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                  dir="ltr"
                />
              </Field>
            </div>

            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={state.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="accent-terracotta"
              />
              <span className="text-[0.92rem] font-semibold text-teal">
                مقاله‌ی ویژه (در فهرست وبلاگ برجسته نمایش داده شود)
              </span>
            </label>
          </div>

          {/* SEO sidebar */}
          <aside className="lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-2xl border border-divider bg-warmwhite p-5">
              <h2 className="text-[1.1rem] font-extrabold text-teal">سئو</h2>
              <p className="mt-1 text-[0.78rem] text-muted-ink">
                تنظیمات سئو و امتیاز مقاله.
              </p>

              <div className="mt-4 space-y-4">
                <Field label={`عنوان سئو (${toFaDigits(state.metaTitle.length)} / ۶۰)`}>
                  <input
                    value={state.metaTitle}
                    onChange={(e) => set("metaTitle", e.target.value)}
                    placeholder="خودکار از عنوان"
                    className="w-full rounded-lg border border-divider bg-ivory px-3 py-2 text-[0.9rem] text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                  />
                </Field>

                <Field
                  label={`توضیحات متا (${toFaDigits(state.metaDescription.length)} / ۱۶۰)`}
                >
                  <textarea
                    value={state.metaDescription}
                    onChange={(e) => set("metaDescription", e.target.value)}
                    rows={3}
                    placeholder="خلاصه‌ی متا برای موتورهای جستجو"
                    className="w-full resize-y rounded-lg border border-divider bg-ivory px-3 py-2 text-[0.9rem] leading-relaxed text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                  />
                </Field>

                <Field label="کلمه‌ی کلیدی هدف">
                  <input
                    value={state.focusKeyword}
                    onChange={(e) => set("focusKeyword", e.target.value)}
                    placeholder="مثلاً مراقبت از سالمندان"
                    className="w-full rounded-lg border border-divider bg-ivory px-3 py-2 text-[0.9rem] text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                  />
                </Field>

                <Field label="URL کانونیکال">
                  <input
                    value={state.canonical}
                    onChange={(e) => set("canonical", e.target.value)}
                    dir="ltr"
                    placeholder="https://..."
                    className="w-full rounded-lg border border-divider bg-ivory px-3 py-2 text-[0.9rem] text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                  />
                </Field>

                <Field label="تصویر Open Graph">
                  <input
                    value={state.ogImage}
                    onChange={(e) => set("ogImage", e.target.value)}
                    dir="ltr"
                    placeholder="خودکار از کاور"
                    className="w-full rounded-lg border border-divider bg-ivory px-3 py-2 text-[0.9rem] text-ink outline-none focus:border-teal-light focus:ring-2 focus:ring-teal-light/15"
                  />
                </Field>

                <Field label="نوع Schema">
                  <select
                    value={state.schemaType}
                    onChange={(e) =>
                      set(
                        "schemaType",
                        e.target.value as "Article" | "BlogPosting"
                      )
                    }
                    className="w-full rounded-lg border border-divider bg-ivory px-3 py-2 text-[0.9rem] text-ink outline-none focus:border-teal-light"
                  >
                    <option value="BlogPosting">BlogPosting</option>
                    <option value="Article">Article</option>
                  </select>
                </Field>

                <SeoScoreGauge score={seo} />
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

/* ------------------------- Editor helpers ------------------------- */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[0.82rem] font-semibold text-teal">
        {label}
        {required && <span className="text-terracotta"> *</span>}
      </label>
      {children}
    </div>
  );
}

function SeoScoreGauge({ score }: { score: SeoScoreResult }) {
  const passed = score.checks.filter((c) => c.passed).length;
  const total = score.checks.length;
  const color =
    score.score >= 70
      ? "text-safe"
      : score.score >= 40
      ? "text-terracotta"
      : "text-destructive";
  const ringColor =
    score.score >= 70
      ? "#7c9473"
      : score.score >= 40
      ? "#c97845"
      : "#b54848";

  return (
    <div className="mt-5 rounded-xl border border-divider bg-ivory p-4">
      <div className="flex items-center gap-4">
        <ScoreCircle score={score.score} color={ringColor} />
        <div>
          <div className={`text-[1.6rem] font-extrabold ${color}`}>
            {toFaDigits(score.score)}
            <span className="text-[0.95rem] text-muted-ink"> / ۱۰۰</span>
          </div>
          <div className="text-[0.78rem] text-muted-ink">
            {toFaDigits(passed)} از {toFaDigits(total)} بررسی موفق
          </div>
        </div>
      </div>
      <ul className="mt-4 space-y-1.5">
        {score.checks.map((c) => (
          <li
            key={c.id}
            className="flex items-center gap-2 text-[0.85rem] text-ink"
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                c.passed ? "bg-safe/20 text-safe" : "bg-divider/60 text-muted-ink"
              }`}
            >
              {c.passed ? (
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
                  <path
                    d="M5 13l4 4 10-10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
            <span className={c.passed ? "" : "text-muted-ink"}>{c.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScoreCircle({
  score,
  color,
}: {
  score: number;
  color: string;
}) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16">
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke="#e3d9c9"
        strokeWidth="6"
      />
      <circle
        cx="32"
        cy="32"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        transform="rotate(-90 32 32)"
        style={{ transition: "stroke-dasharray 0.4s ease" }}
      />
    </svg>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  if (!content.trim()) {
    return <p className="text-[0.85rem] text-muted-ink">پیش‌نمایش اینجا نمایش داده می‌شود...</p>;
  }
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="mt-4 mb-2 text-[1.2rem] font-extrabold text-teal">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mt-3 mb-1.5 text-[1.05rem] font-bold text-teal">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="mb-3 text-[0.95rem] leading-[1.9] text-ink">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="mb-3 list-disc space-y-1 pr-5 text-[0.95rem] leading-[1.9] text-ink">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-3 list-decimal space-y-1 pr-5 text-[0.95rem] leading-[1.9] text-ink">
            {children}
          </ol>
        ),
        blockquote: ({ children }) => (
          <blockquote className="my-3 border-r-4 border-terracotta/60 bg-sand/50 px-4 py-2 text-[0.92rem] italic text-muted-ink">
            {children}
          </blockquote>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-ink">{children}</strong>
        ),
        code: ({ children }) => (
          <code className="rounded bg-sand px-1.5 py-0.5 text-[0.92em] text-teal" dir="ltr">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function ArticlePreview({ state }: { state: BlogEditorState }) {
  return (
    <article className="mx-auto max-w-2xl rounded-[1.5rem] border border-divider bg-warmwhite p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3 text-[0.78rem] text-muted-ink">
        {state.category && (
          <span className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-[0.72rem] font-semibold text-teal">
            {state.category}
          </span>
        )}
        {state.readTime && <span>{state.readTime} مطالعه</span>}
        {state.featured && (
          <span className="rounded-full bg-terracotta/15 px-2 py-0.5 text-[0.7rem] font-semibold text-terracotta">
            ویژه
          </span>
        )}
      </div>
      <h1 className="mt-4 text-[1.7rem] font-extrabold leading-[1.25] text-teal">
        {state.title || "بدون عنوان"}
      </h1>
      {state.excerpt && (
        <p className="mt-4 text-[1.05rem] leading-[1.9] text-muted-ink">
          {state.excerpt}
        </p>
      )}
      {state.coverImage && (
        <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-divider">
          <img
            src={state.coverImage}
            alt={state.coverAlt || state.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      )}
      <div className="mt-6">
        <MarkdownPreview content={state.content} />
      </div>
    </article>
  );
}

/* ------------------------- Pure helpers ------------------------- */

function toFaDigits(s: string | number): string {
  const map = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(s).replace(/[0-9]/g, (d) => map[Number(d)]);
}

function toDatetimeLocal(iso: string): string {
  // Format an ISO date as `yyyy-MM-ddTHH:mm` in local time for <input type="datetime-local">.
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

/** Local Persian slugifier (mirrors server-side slugifyFa). */
function slugifyFaLocal(title: string): string {
  return String(title || "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
