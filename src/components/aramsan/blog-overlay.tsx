"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { POSTS, getPostBySlug, type BlogPost } from "./blog-data";
import { AramsanMark } from "./logo";

/**
 * Blog overlay — driven by URL hash:
 *   #blog        → list of posts
 *   #blog/<slug> → single article view
 *   (none)       → closed
 *
 * Renders as a full-screen overlay on top of the landing page, so the user
 * gets a real "separate page" experience (full viewport, scrollable, back
 * button, shareable URL) while staying on the single / route the sandbox
 * exposes.
 */
export function BlogOverlay() {
  const [view, setView] = useState<{ kind: "list" } | { kind: "post"; slug: string } | null>(null);

  const parseHash = useCallback(() => {
    const h = window.location.hash.replace(/^#/, "");
    if (h === "blog") return { kind: "list" as const };
    if (h.startsWith("blog/")) {
      const slug = h.slice("blog/".length);
      if (getPostBySlug(slug)) return { kind: "post" as const, slug };
      return { kind: "list" as const };
    }
    return null;
  }, []);

  useEffect(() => {
    const onHash = () => setView(parseHash());
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [parseHash]);

  // Lock body scroll while overlay is open
  useEffect(() => {
    if (view) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [view]);

  // Scroll overlay to top whenever the view changes
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (scrollRef) scrollRef.scrollTo({ top: 0 });
  }, [view, scrollRef]);

  const close = useCallback(() => {
    // Clear the hash without leaving a trailing #
    history.pushState("", document.title, window.location.pathname + window.location.search);
    setView(null);
  }, []);

  const openPost = (slug: string) => {
    window.location.hash = `blog/${slug}`;
  };

  const backToList = () => {
    window.location.hash = "blog";
  };

  return (
    <AnimatePresence>
      {view && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[90] bg-ivory"
          role="dialog"
          aria-modal="true"
          aria-label="وبلاگ آرامسن"
        >
          {/* top bar */}
          <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-divider bg-ivory/90 px-5 backdrop-blur-xl sm:px-8">
            <button
              onClick={view.kind === "post" ? backToList : close}
              className="inline-flex items-center gap-2 rounded-full border border-divider bg-warmwhite px-3.5 py-2 text-[0.88rem] font-semibold text-teal transition-all hover:-translate-y-0.5 hover:border-teal-light/40"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path d="M9 6l-6 6 6 6M3 12h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {view.kind === "post" ? "همه‌ی نوشته‌ها" : "بازگشت به خانه"}
            </button>

            <div className="flex items-center gap-2">
              <AramsanMark className="h-6 w-6" />
              <span className="text-[1.1rem] font-extrabold text-teal" style={{ fontFamily: "var(--font-vazirmatn)" }}>
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
          <div ref={setScrollRef} className="h-[calc(100vh-4rem)] overflow-y-auto">
            <AnimatePresence mode="wait">
              {view.kind === "list" ? (
                <BlogList key="list" onOpen={openPost} />
              ) : (
                <BlogArticle key={`post-${view.slug}`} slug={view.slug} onOpen={openPost} />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------- List view ----------------------------- */

function BlogList({ onOpen }: { onOpen: (slug: string) => void }) {
  const featured = POSTS.find((p) => p.featured) ?? POSTS[0];
  const rest = POSTS.filter((p) => p !== featured);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14"
    >
      <span className="inline-block text-[0.82rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
        وبلاگ آرامسن
      </span>
      <h1
        className="mt-3 text-teal font-extrabold leading-[1.15] tracking-tight"
        style={{ fontSize: "clamp(2rem, 5vw, 3.4rem)", fontFamily: "var(--font-vazirmatn)" }}
      >
        نوشته‌هایی برای آرامش خانواده
      </h1>
      <p className="mt-3 max-w-2xl text-[1.05rem] leading-[1.9] text-muted-ink">
        راهنما، داستان و نکته‌هایی درباره‌ی مراقبت از عزیزان؛ برای روزهایی که
        می‌خواهیم با خیال راحت کنارشان باشیم.
      </p>

      {/* Featured */}
      <FeaturedRow post={featured} onOpen={onOpen} />

      {/* Rest */}
      <h2 className="mt-14 mb-6 text-[1.3rem] font-bold text-teal">آخرین نوشته‌ها</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p, i) => (
          <PostCard key={p.slug} post={p} onOpen={onOpen} delay={i * 0.08} />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 overflow-hidden rounded-[1.75rem] border border-divider bg-sand/60 px-6 py-8 text-center sm:px-10">
        <h3 className="text-[1.3rem] font-extrabold text-teal sm:text-[1.5rem]">
          نوشته‌های جدید آرامسن را از دست ندهید.
        </h3>
        <p className="mx-auto mt-2 max-w-md text-[0.95rem] leading-relaxed text-muted-ink">
          با عضویت در لیست انتظار، علاوه بر تخفیف ۵۰٪، از جدیدترین نوشته‌ها هم
          مطلع می‌شوید.
        </p>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            history.pushState("", document.title, window.location.pathname + window.location.search);
            window.dispatchEvent(new HashChangeEvent("hashchange"));
            setTimeout(() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" }), 50);
          }}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-[0.95rem] font-semibold text-warmwhite shadow-[0_10px_26px_-10px_rgba(201,120,69,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-light"
        >
          عضویت در لیست انتظار
        </a>
      </div>
    </motion.div>
  );
}

function FeaturedRow({ post, onOpen }: { post: BlogPost; onOpen: (slug: string) => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      className="group mt-10 grid grid-cols-1 overflow-hidden rounded-[2rem] border border-divider bg-warmwhite shadow-[0_30px_60px_-40px_rgba(28,62,58,0.45)] lg:grid-cols-2"
    >
      <button
        onClick={() => onOpen(post.slug)}
        className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[24rem]"
        aria-label={`خواندن مقاله: ${post.title}`}
      >
        <img
          src={post.img}
          alt={post.alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <span className="absolute right-4 top-4 rounded-full bg-terracotta px-3 py-1 text-[0.72rem] font-semibold text-warmwhite shadow-md">
          مقاله‌ی ویژه
        </span>
      </button>
      <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-10">
        <div className="flex flex-wrap items-center gap-3 text-[0.8rem] text-muted-ink">
          <span className="inline-flex items-center rounded-full bg-teal/10 px-2.5 py-0.5 text-[0.72rem] font-semibold text-teal">
            {post.category}
          </span>
          <span>·</span>
          <span>{post.readTime} مطالعه</span>
          <span>·</span>
          <span>{post.date}</span>
        </div>
        <h2
          className="mt-4 text-teal font-extrabold leading-[1.25] tracking-tight"
          style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontFamily: "var(--font-vazirmatn)" }}
        >
          {post.title}
        </h2>
        <p className="mt-4 text-[1rem] leading-[1.95] text-muted-ink">{post.excerpt}</p>
        <button
          onClick={() => onOpen(post.slug)}
          className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-teal/30 px-5 py-2.5 text-[0.9rem] font-semibold text-teal transition-all hover:-translate-y-0.5 hover:border-teal hover:bg-teal hover:text-warmwhite"
        >
          ادامه‌ی مطلب
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </motion.article>
  );
}

function PostCard({
  post,
  onOpen,
  delay,
}: {
  post: BlogPost;
  onOpen: (slug: string) => void;
  delay: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-divider bg-warmwhite transition-shadow hover:shadow-[0_24px_50px_-30px_rgba(28,62,58,0.45)]"
    >
      <button
        onClick={() => onOpen(post.slug)}
        className="relative aspect-[16/10] overflow-hidden"
        aria-label={`خواندن مقاله: ${post.title}`}
      >
        <img
          src={post.img}
          alt={post.alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          loading="lazy"
        />
        <span className="absolute right-3 top-3 rounded-full bg-warmwhite/90 px-2.5 py-1 text-[0.68rem] font-semibold text-teal backdrop-blur">
          {post.category}
        </span>
      </button>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[0.72rem] text-muted-ink">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime} مطالعه</span>
        </div>
        <h3 className="mt-2.5 text-[1.1rem] font-bold leading-snug text-teal">{post.title}</h3>
        <p className="mt-2 flex-1 text-[0.9rem] leading-relaxed text-muted-ink">{post.excerpt}</p>
        <button
          onClick={() => onOpen(post.slug)}
          className="mt-4 inline-flex items-center gap-1.5 self-start text-[0.85rem] font-semibold text-terracotta transition-colors hover:text-terracotta-light"
        >
          ادامه‌ی مطلب
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </motion.article>
  );
}

/* --------------------------- Article view --------------------------- */

function BlogArticle({
  slug,
  onOpen,
}: {
  slug: string;
  onOpen: (slug: string) => void;
}) {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const related = POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14"
    >
      {/* header */}
      <div className="flex flex-wrap items-center gap-3 text-[0.82rem] text-muted-ink">
        <span className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-[0.74rem] font-semibold text-teal">
          {post.category}
        </span>
        <span>·</span>
        <span>{post.readTime} مطالعه</span>
        <span>·</span>
        <span>{post.date}</span>
      </div>

      <h1
        className="mt-5 text-teal font-extrabold leading-[1.2] tracking-tight"
        style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontFamily: "var(--font-vazirmatn)" }}
      >
        {post.title}
      </h1>

      <p className="mt-5 text-[1.15rem] leading-[1.95] text-muted-ink">{post.excerpt}</p>

      {/* cover image */}
      <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-divider">
        <img src={post.img} alt={post.alt} className="aspect-[16/9] w-full object-cover" />
      </div>

      {/* body */}
      <div className="mt-10 space-y-6">
        {post.content.map((para, i) => (
          <p
            key={i}
            className="text-[1.08rem] leading-[2.1] text-ink"
            style={{ textIndent: i === 0 ? 0 : undefined }}
          >
            {i === 0 ? (
              <>
                <span className="float-right mr-2 mt-2 text-[2.6rem] leading-none font-extrabold text-teal" style={{ fontFamily: "var(--font-vazirmatn)" }}>
                  {para[0]}
                </span>
                {para.slice(1)}
              </>
            ) : (
              para
            )}
          </p>
        ))}
      </div>

      {/* author / share row */}
      <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl border border-divider bg-sand/50 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-teal text-warmwhite">
            <AramsanMark className="h-6 w-6" tone="ivory" />
          </span>
          <div>
            <div className="text-[0.95rem] font-bold text-teal">تیم آرامسن</div>
            <div className="text-[0.8rem] text-muted-ink">نوشته‌ی تیم تحریریه‌ی آرامسن</div>
          </div>
        </div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (navigator.share) {
              navigator.share({ title: post.title, url: window.location.href }).catch(() => {});
            } else if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
          className="inline-flex items-center gap-2 rounded-full border border-divider bg-warmwhite px-4 py-2 text-[0.85rem] font-semibold text-teal transition-all hover:-translate-y-0.5 hover:border-teal-light/40"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path
              d="M16 6l-4-4-4 4M12 2v14M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          اشتراک‌گذاری
        </a>
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="mb-5 text-[1.3rem] font-bold text-teal">نوشته‌های مرتبط</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {related.map((p) => (
              <button
                key={p.slug}
                onClick={() => onOpen(p.slug)}
                className="group flex items-stretch overflow-hidden rounded-[1.25rem] border border-divider bg-warmwhite text-right transition-shadow hover:shadow-[0_20px_45px_-25px_rgba(28,62,58,0.45)]"
              >
                <div className="relative aspect-square w-28 shrink-0 overflow-hidden sm:w-32">
                  <img
                    src={p.img}
                    alt={p.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-4">
                  <div className="text-[0.7rem] font-semibold text-terracotta">{p.category}</div>
                  <h3 className="mt-1 text-[0.95rem] font-bold leading-snug text-teal">{p.title}</h3>
                  <div className="mt-1.5 text-[0.72rem] text-muted-ink">{p.readTime} مطالعه</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.article>
  );
}
