"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  img: string;
  alt: string;
};

const FEATURED: Post = {
  slug: "aramesh-khater-khanevade",
  title: "چگونه آرامش خاطر را به خانواده‌ای با والدین سالمند بازگردانیم؟",
  excerpt:
    "وقتی پدر یا مادرمان سالمند می‌شوند، نگرانی قسمت بزرگی از روزمان را پر می‌کند. در این نوشته می‌خوانیم چطور با چند عادت ساده و یک ابزار هوشمند، آرامش را به خانواده بازگردانیم؛ بدون آنکه استقلال عزیزانمان را زیر سؤال ببریم.",
  category: "مراقبت خانواده",
  readTime: "۶ دقیقه",
  date: "۱۲ خرداد ۱۴۰۴",
  img: "/blog/featured.png",
  alt: "پدر سالمند و دخترش در غروب کنار پنجره با نور چراغ گرم",
};

const POSTS: Post[] = [
  {
    slug: "alzheimer-va-faramoushi",
    title: "آلزایمر و فراموشی: چطور بدون ایجاد نگرانی کمک کنیم؟",
    excerpt:
      "فراموشی بخشی از سالمندی است، نه پایان استقلال. روش‌هایی برای همراهی عزیزانی که گاه فراموش می‌کنند — با احترام و آرامش.",
    category: "آلزایمر",
    readTime: "۵ دقیقه",
    date: "۵ خرداد ۱۴۰۴",
    img: "/blog/alzheimer.png",
    alt: "دستِ مهربان که دستِ یک سالمند را گرفته",
  },
  {
    slug: "sos-dokme-ezterari",
    title: "دکمه‌ی اضطراری SOS: یک فاصله تا آرامش",
    excerpt:
      "وقتی یک دکمه‌ی ساده می‌تواند فاصله‌ی میان نگرانی و آرامش باشد. کاربرد واقعی دکمه‌ی SOS در لحظاتی که شمارش ثانیه‌ها مهم است.",
    category: "امکانات سن یار",
    readTime: "۴ دقیقه",
    date: "۲۸ اردیبهشت ۱۴۰۴",
    img: "/blog/sos.png",
    alt: "ردیاب هوشمند سن یار با دکمه‌ی اضطراری تراکوتا",
  },
  {
    slug: "charge-va-rog'bat",
    title: "شارژدهی و عادات روزانه: چطور ردیاب را فراموش نکنیم؟",
    excerpt:
      "بهترین ابزارها هم اگر یادتان برود بی‌فایده‌اند. چند عادت ساده برای اینکه ردیاب همیشه شارژ و آماده باشد — و ایستگاه درب چطور کمک می‌کند.",
    category: "راهنمای استفاده",
    readTime: "۳ دقیقه",
    date: "۲۰ اردیبهشت ۱۴۰۴",
    img: "/blog/battery.png",
    alt: "ردیاب سن یار روی ایستگاه شارژ کنار در با نور سبز",
  },
];

export function Blog() {
  return (
    <section id="blog" className="bg-ivory py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="inline-block text-[0.82rem] font-semibold uppercase tracking-[0.2em] text-terracotta">
              وبلاگ سن یار
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-3 text-teal font-extrabold leading-[1.15] tracking-tight"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", fontFamily: "var(--font-vazirmatn)" }}
            >
              نوشته‌هایی برای آرامش خانواده
            </motion.h2>
            <p className="mt-3 text-[1rem] leading-[1.9] text-muted-ink">
              راهنما، داستان و نکته‌هایی درباره‌ی مراقبت از عزیزان؛ برای روزهایی
              که می‌خواهیم با خیال راحت کنارشان باشیم.
            </p>
          </div>
          <a
            href="#blog"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-divider bg-warmwhite px-5 py-2.5 text-[0.9rem] font-semibold text-teal transition-all hover:-translate-y-0.5 hover:border-teal-light/40"
          >
            همه‌ی نوشته‌ها
            <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        {/* featured post — large, distinct treatment */}
        <FeaturedPost post={FEATURED} />

        {/* grid of 3 — different treatment than featured (no overlap with other sections) */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p, i) => (
            <PostCard key={p.slug} post={p} delay={i * 0.08} />
          ))}
        </div>

        {/* newsletter-ish gentle CTA */}
        <div className="mt-14 overflow-hidden rounded-[1.75rem] border border-divider bg-sand/60 px-6 py-8 text-center sm:px-10">
          <h3 className="text-[1.3rem] font-extrabold text-teal sm:text-[1.5rem]">
            نوشته‌های جدید سن یار را از دست ندهید.
          </h3>
          <p className="mx-auto mt-2 max-w-md text-[0.95rem] leading-relaxed text-muted-ink">
            با عضویت در لیست انتظار، علاوه بر تخفیف ۵۰٪، از新しい نوشته‌ها هم
            مطلع می‌شوید.
          </p>
          <button
            onClick={() =>
              document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })
            }
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-[0.95rem] font-semibold text-warmwhite shadow-[0_10px_26px_-10px_rgba(201,120,69,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-terracotta-light"
          >
            عضویت در لیست انتظار
          </button>
        </div>
      </div>
    </section>
  );
}

function FeaturedPost({ post }: { post: Post }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="group grid grid-cols-1 overflow-hidden rounded-[2rem] border border-divider bg-warmwhite shadow-[0_30px_60px_-40px_rgba(28,62,58,0.45)] lg:grid-cols-2"
    >
      {/* image */}
      <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
        <img
          src={post.img}
          alt={post.alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
        <span className="absolute right-4 top-4 rounded-full bg-terracotta px-3 py-1 text-[0.72rem] font-semibold text-warmwhite shadow-md">
          مقاله‌ی ویژه
        </span>
      </div>
      {/* body */}
      <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-10">
        <div className="flex items-center gap-3 text-[0.8rem] text-muted-ink">
          <CategoryPill>{post.category}</CategoryPill>
          <span>·</span>
          <span>{post.readTime} مطالعه</span>
          <span>·</span>
          <span>{post.date}</span>
        </div>
        <h3
          className="mt-4 text-teal font-extrabold leading-[1.25] tracking-tight"
          style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontFamily: "var(--font-vazirmatn)" }}
        >
          {post.title}
        </h3>
        <p className="mt-4 text-[1rem] leading-[1.95] text-muted-ink">
          {post.excerpt}
        </p>
        <a
          href={`#blog-${post.slug}`}
          className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-teal/30 px-5 py-2.5 text-[0.9rem] font-semibold text-teal transition-all hover:-translate-y-0.5 hover:border-teal hover:bg-teal hover:text-warmwhite"
        >
          ادامه‌ی مطلب
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </motion.article>
  );
}

function PostCard({ post, delay }: { post: Post; delay: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className="group flex flex-col overflow-hidden rounded-[1.5rem] border border-divider bg-warmwhite transition-shadow hover:shadow-[0_24px_50px_-30px_rgba(28,62,58,0.45)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={post.img}
          alt={post.alt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          loading="lazy"
        />
        <span className="absolute right-3 top-3 rounded-full bg-warmwhite/90 px-2.5 py-1 text-[0.68rem] font-semibold text-teal backdrop-blur">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 text-[0.72rem] text-muted-ink">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime} مطالعه</span>
        </div>
        <h3 className="mt-2.5 text-[1.1rem] font-bold leading-snug text-teal">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-[0.9rem] leading-relaxed text-muted-ink">
          {post.excerpt}
        </p>
        <a
          href={`#blog-${post.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 self-start text-[0.85rem] font-semibold text-terracotta transition-colors hover:text-terracotta-light"
        >
          ادامه‌ی مطلب
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </motion.article>
  );
}

function CategoryPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-teal/10 px-2.5 py-0.5 text-[0.72rem] font-semibold text-teal">
      {children}
    </span>
  );
}
