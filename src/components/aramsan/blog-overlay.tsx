"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { AramsanMark } from "./logo";

/**
 * Public blog overlay — driven by URL hash:
 *   #blog        → list of posts
 *   #blog/<slug> → single article view
 *   (none)       → closed
 *
 * Posts are fetched from the DB-backed public API (/api/blog).
 *
 * Renders as a full-screen overlay on top of the landing page, so the user
 * gets a real "separate page" experience (full viewport, scrollable, back
 * button, shareable URL) while staying on the single `/` route the sandbox
 * exposes. When an article is open, document.title + meta tags are updated
 * for SEO (the best we can do given the single-route constraint) and
 * restored on close.
 */

type PublicPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown
  category: string;
  tags: string;
  readTime: string;
  date: string | null;
  img: string | null;
  alt: string | null;
  featured: boolean;
  publishedAt: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonical: string | null;
  ogImage: string | null;
  focusKeyword: string | null;
  schemaType: string;
};

export function BlogOverlay() {
  const [view, setView] = useState<
    | { kind: "list" }
    | { kind: "post"; slug: string }
    | null
  >(null);

  const parseHash = useCallback(() => {
    const h = window.location.hash.replace(/^#/, "");
    if (h === "blog") return { kind: "list" as const };
    if (h.startsWith("blog/")) {
      const slug = h.slice("blog/".length);
      if (slug) return { kind: "post" as const, slug };
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
    history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search
    );
    setView(null);
  }, []);

  const openPost = useCallback((slug: string) => {
    window.location.hash = `blog/${slug}`;
  }, []);

  const backToList = useCallback(() => {
    window.location.hash = "blog";
  }, []);

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
                <path
                  d="M9 6l-6 6 6 6M3 12h18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {view.kind === "post" ? "همه‌ی نوشته‌ها" : "بازگشت به خانه"}
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
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* scrollable content */}
          <div ref={setScrollRef} className="h-[calc(100vh-4rem)] overflow-y-auto">
            <AnimatePresence mode="wait">
              {view.kind === "list" ? (
                <BlogList key="list" onOpen={openPost} />
              ) : (
                <BlogArticle
                  key={`post-${view.slug}`}
                  slug={view.slug}
                  onOpen={openPost}
                />
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
  const [posts, setPosts] = useState<PublicPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data || !data.ok) {
          setPosts(null);
          setError(data?.error || "خطا در بارگیری نوشته‌ها.");
          return;
        }
        setError(null);
        setPosts(data.posts as PublicPost[]);
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
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
        <p className="text-[1.1rem] text-destructive">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 rounded-full border border-divider bg-warmwhite px-5 py-2 text-[0.9rem] font-semibold text-teal"
        >
          تلاش دوباره
        </button>
      </div>
    );
  }

  if (!posts) {
    return <ListSkeleton />;
  }

  if (posts.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
        <p className="text-[1.1rem] text-muted-ink">هنوز نوشته‌ای منتشر نشده است.</p>
      </div>
    );
  }

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.id !== featured.id);

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

      <FeaturedRow post={featured} onOpen={onOpen} />

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
            history.pushState(
              "",
              document.title,
              window.location.pathname + window.location.search
            );
            window.dispatchEvent(new HashChangeEvent("hashchange"));
            setTimeout(
              () =>
                document
                  .getElementById("waitlist")
                  ?.scrollIntoView({ behavior: "smooth" }),
              50
            );
          }}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-[0.95rem] font-semibold text-warmwhite shadow-[0_10px_26px_-10px_rgba(201,120,69,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-light"
        >
          عضویت در لیست انتظار
        </a>
      </div>
    </motion.div>
  );
}

function ListSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="h-5 w-32 rounded bg-divider/60" />
      <div className="mt-3 h-10 w-3/4 rounded bg-divider/60" />
      <div className="mt-3 h-5 w-2/3 rounded bg-divider/40" />
      <div className="mt-10 grid grid-cols-1 overflow-hidden rounded-[2rem] border border-divider bg-warmwhite lg:grid-cols-2">
        <div className="aspect-[4/3] bg-divider/40 lg:aspect-auto lg:min-h-[24rem]" />
        <div className="space-y-4 p-9">
          <div className="h-5 w-1/3 rounded bg-divider/60" />
          <div className="h-8 w-5/6 rounded bg-divider/60" />
          <div className="h-5 w-full rounded bg-divider/40" />
          <div className="h-5 w-4/5 rounded bg-divider/40" />
        </div>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-[1.5rem] border border-divider bg-warmwhite"
          >
            <div className="aspect-[16/10] bg-divider/40" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-2/3 rounded bg-divider/60" />
              <div className="h-4 w-1/2 rounded bg-divider/40" />
              <div className="h-3 w-3/4 rounded bg-divider/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedRow({
  post,
  onOpen,
}: {
  post: PublicPost;
  onOpen: (slug: string) => void;
}) {
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
        {post.img && (
          <img
            src={post.img}
            alt={post.alt || post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            loading="lazy"
          />
        )}
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
          {post.date && (
            <>
              <span>·</span>
              <span>{post.date}</span>
            </>
          )}
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
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
  post: PublicPost;
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
        {post.img && (
          <img
            src={post.img}
            alt={post.alt || post.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            loading="lazy"
          />
        )}
        <span className="absolute right-3 top-3 rounded-full bg-warmwhite/90 px-2.5 py-1 text-[0.68rem] font-semibold text-teal backdrop-blur">
          {post.category}
        </span>
      </button>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[0.72rem] text-muted-ink">
          {post.date && <span>{post.date}</span>}
          {post.date && <span>·</span>}
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
            <path
              d="M15 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
  const [post, setPost] = useState<PublicPost | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allPosts, setAllPosts] = useState<PublicPost[]>([]);

  // Fetch this post + the full list (for related posts).
  useEffect(() => {
    let cancelled = false;
    // Reset via async fetch results, not synchronously here.
    fetch(`/api/blog?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setPost(null);
        setError(null);
        if (!r_ok(data)) {
          setError(data?.error || "مقاله پیدا نشد.");
          return;
        }
        setPost(data.post as PublicPost);
      })
      .catch(() => {
        if (!cancelled) {
          setPost(null);
          setError("خطا در اتصال به سرور.");
        }
      });

    // Fetch the list once for related posts.
    fetch("/api/blog")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.ok) setAllPosts(data.posts as PublicPost[]);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Compute related posts from the fetched list + current post.
  const related = useMemo(
    () => (post ? allPosts.filter((p) => p.slug !== post.slug).slice(0, 2) : []),
    [post, allPosts]
  );

  // Manage document head — set SEO meta when post loads, restore on close.
  useArticleMeta(post);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
        <p className="text-[1.1rem] text-destructive">{error}</p>
        <button
          onClick={() => {
            window.location.hash = "blog";
          }}
          className="mt-4 rounded-full border border-divider bg-warmwhite px-5 py-2 text-[0.9rem] font-semibold text-teal"
        >
          بازگشت به فهرست
        </button>
      </div>
    );
  }

  if (!post) {
    return <ArticleSkeleton />;
  }

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
        {post.date && (
          <>
            <span>·</span>
            <span>{post.date}</span>
          </>
        )}
      </div>

      <h1
        className="mt-5 text-teal font-extrabold leading-[1.2] tracking-tight"
        style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontFamily: "var(--font-vazirmatn)" }}
      >
        {post.title}
      </h1>

      <p className="mt-5 text-[1.15rem] leading-[1.95] text-muted-ink">{post.excerpt}</p>

      {/* cover image */}
      {post.img && (
        <div className="mt-8 overflow-hidden rounded-[1.5rem] border border-divider">
          <img
            src={post.img}
            alt={post.alt || post.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      )}

      {/* body — markdown */}
      <ArticleBody content={post.content} />

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
        <ShareButton title={post.title} />
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
                  {p.img && (
                    <img
                      src={p.img}
                      alt={p.alt || p.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
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

function r_ok(data: unknown): data is { ok: true } {
  return !!data && typeof data === "object" && (data as { ok?: boolean }).ok === true;
}

function ArticleBody({ content }: { content: string }) {
  const firstParaRendered = useRef(false);

  return (
    <div className="mt-10">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="mt-10 mb-3 text-[1.4rem] font-extrabold text-teal" style={{ fontFamily: "var(--font-vazirmatn)" }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-8 mb-2 text-[1.2rem] font-bold text-teal">{children}</h3>
          ),
          p: ({ children }) => {
            const isFirst = !firstParaRendered.current;
            firstParaRendered.current = true;
            if (isFirst && typeof children === "string" && children.length > 0) {
              return (
                <p className="mb-6 text-[1.08rem] leading-[2.1] text-ink">
                  <span
                    className="float-right mr-2 mt-2 text-[2.6rem] leading-none font-extrabold text-teal"
                    style={{ fontFamily: "var(--font-vazirmatn)" }}
                  >
                    {children[0]}
                  </span>
                  {children.slice(1)}
                </p>
              );
            }
            return <p className="mb-6 text-[1.08rem] leading-[2.1] text-ink">{children}</p>;
          },
          ul: ({ children }) => (
            <ul className="mb-6 list-disc space-y-2 pr-6 text-[1.08rem] leading-[2.1] text-ink">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 list-decimal space-y-2 pr-6 text-[1.08rem] leading-[2.1] text-ink">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-6 border-r-4 border-terracotta/60 bg-sand/50 px-5 py-3 text-[1.05rem] italic leading-[2] text-muted-ink">
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-terracotta underline underline-offset-4 hover:text-terracotta-light"
            >
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-bold text-ink">{children}</strong>,
          code: ({ children }) => (
            <code className="rounded bg-sand px-1.5 py-0.5 text-[0.95em] text-teal" dir="ltr">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function ArticleSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="h-5 w-1/4 rounded bg-divider/60" />
      <div className="mt-5 h-10 w-5/6 rounded bg-divider/60" />
      <div className="mt-5 h-5 w-full rounded bg-divider/40" />
      <div className="mt-8 aspect-[16/9] w-full rounded-[1.5rem] bg-divider/40" />
      <div className="mt-10 space-y-4">
        <div className="h-5 w-full rounded bg-divider/40" />
        <div className="h-5 w-11/12 rounded bg-divider/40" />
        <div className="h-5 w-4/5 rounded bg-divider/40" />
        <div className="h-5 w-full rounded bg-divider/40" />
        <div className="h-5 w-3/4 rounded bg-divider/40" />
      </div>
    </div>
  );
}

/* --------------------- Document head / SEO manager --------------------- */

/**
 * While a post is open, set document.title + meta tags. Restore the originals
 * on close (or unmount). This is the best SEO achievable given the single-route
 * sandbox constraint — crawlers that execute JS will see the correct tags per
 * article.
 */
function useArticleMeta(post: PublicPost | null) {
  const snapshot = useRef<{
    title: string;
    metas: { el: HTMLMetaElement; attr: "name" | "property"; key: string }[];
    links: HTMLLinkElement[];
  } | null>(null);

  useEffect(() => {
    if (!post) return;

    // Snapshot current head state we'll mutate.
    const previousTitle = document.title;
    const managedKeys = [
      "name:description",
      "property:og:title",
      "property:og:description",
      "property:og:image",
      "property:og:type",
      "name:twitter:card",
      "name:twitter:title",
      "name:twitter:description",
      "name:twitter:image",
    ];
    const prevMetas: { el: HTMLMetaElement; attr: "name" | "property"; key: string }[] = [];
    for (const k of managedKeys) {
      const [attr, value] = k.split(":") as ["name" | "property", string];
      const el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${value}"]`);
      if (el) prevMetas.push({ el, attr, key: value });
    }
    const prevLinks = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')
    );
    snapshot.current = { title: previousTitle, metas: prevMetas, links: prevLinks };

    // Apply new values.
    const metaTitle = post.metaTitle || post.title;
    const metaDescription = post.metaDescription || post.excerpt;
    const ogImage = post.ogImage || post.img;

    document.title = metaTitle;

    setMeta("name", "description", metaDescription);
    setMeta("property", "og:title", metaTitle);
    setMeta("property", "og:description", metaDescription);
    setMeta("property", "og:type", "article");
    if (ogImage) setMeta("property", "og:image", ogImage);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", metaTitle);
    setMeta("name", "twitter:description", metaDescription);
    if (ogImage) setMeta("name", "twitter:image", ogImage);

    if (post.canonical) {
      setCanonical(post.canonical, true);
    } else {
      // Use the current article hash URL as a self-referential canonical.
      setCanonical(window.location.href, true);
    }

    return () => {
      // Restore.
      if (!snapshot.current) return;
      document.title = snapshot.current.title;
      // We can't easily restore prior meta content reliably; instead, set them
      // back to the page defaults from <head>. Since the original landing-page
      // metadata is static and known, we restore to those values so the home
      // page meta is correct again.
      const HOME_TITLE = "آرامسن | آرامش خاطر برای خانواده‌ها";
      const HOME_DESC =
        "ردیاب هوشمند با هوش مصنوعی و ایستگاه درب اختصاصی آرامسن برای مراقبت از سالمندان، کودکان و عزیزان شما. مجهز به هوش مصنوعی با تحلیل اختصاصی رفتار و فعالیت. جزو اولین خانواده‌های آرامسن باشید و ۵۰٪ تخفیف مادام‌العمر دریافت کنید.";
      setMeta("name", "description", HOME_DESC);
      setMeta("property", "og:title", HOME_TITLE);
      setMeta("property", "og:description", HOME_DESC);
      setMeta("property", "og:type", "website");
      setMeta("name", "twitter:card", "summary_large_image");
      setMeta("name", "twitter:title", HOME_TITLE);
      setMeta("name", "twitter:description", HOME_DESC);
      // Remove og:image / twitter:image if we added them (only when we created
      // them ourselves). For safety, leave them — they'll be replaced on next
      // article open or stay as a sensible image.
      removeDynamicCanonical();
      snapshot.current = null;
    };
  }, [post]);
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute("data-aramsan-dynamic", "1");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string, dynamic: boolean) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    if (dynamic) el.setAttribute("data-aramsan-dynamic", "1");
    document.head.appendChild(el);
  } else if (dynamic) {
    el.setAttribute("data-aramsan-dynamic", "1");
  }
  el.setAttribute("href", href);
}

function removeDynamicCanonical() {
  const el = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"][data-aramsan-dynamic="1"]'
  );
  if (el) el.remove();
}

/* --------------------------- Share button --------------------------- */

function ShareButton({ title }: { title: string }) {
  const [state, setState] = useState<"idle" | "copied" | "shared" | "error">("idle");

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      // Try the native share sheet first (mobile / supported browsers)
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        await navigator.share({ title, url });
        setState("shared");
        setTimeout(() => setState("idle"), 2500);
        return;
      }
      // Fallback: copy to clipboard with a clear confirmation
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setState("copied");
        setTimeout(() => setState("idle"), 2500);
        return;
      }
      // Last-resort: select a hidden input
      setState("error");
      setTimeout(() => setState("idle"), 2500);
    } catch {
      // User cancelled the native sheet, or clipboard denied — try clipboard copy
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(url);
          setState("copied");
          setTimeout(() => setState("idle"), 2500);
        } else {
          setState("error");
          setTimeout(() => setState("idle"), 2500);
        }
      } catch {
        setState("error");
        setTimeout(() => setState("idle"), 2500);
      }
    }
  }

  const label =
    state === "copied"
      ? "لینک کپی شد ✓"
      : state === "shared"
      ? "اشتراک‌گذاری شد ✓"
      : state === "error"
      ? "لینک را دستی کپی کنید"
      : "اشتراک‌گذاری";

  return (
    <button
      type="button"
      onClick={share}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[0.85rem] font-semibold transition-all hover:-translate-y-0.5 ${
        state === "copied" || state === "shared"
          ? "border-safe/40 bg-safe/10 text-safe"
          : state === "error"
          ? "border-terracotta/40 bg-terracotta/10 text-terracotta"
          : "border-divider bg-warmwhite text-teal hover:border-teal-light/40"
      }`}
    >
      {state === "copied" || state === "shared" ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <path
            d="M5 13l4 4 10-10"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
          <path
            d="M16 6l-4-4-4 4M12 2v14M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {label}
    </button>
  );
}
