import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { BlogPost } from "@prisma/client";

/**
 * Public blog API.
 *   GET /api/blog            → list of published posts (newest first)
 *   GET /api/blog?slug=<s>   → a single published post (404 if not found)
 */
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// Serialization
// ---------------------------------------------------------------------------

const persianDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function persianDate(d: Date | null): string | null {
  if (!d) return null;
  try {
    return persianDateFormatter.format(d);
  } catch {
    return null;
  }
}

export type PublicBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown
  category: string;
  tags: string;
  readTime: string;
  date: string | null; // Persian display date
  img: string | null; // coverImage
  alt: string | null; // coverAlt
  featured: boolean;
  publishedAt: string | null; // ISO
  // SEO
  metaTitle: string | null;
  metaDescription: string | null;
  canonical: string | null;
  ogImage: string | null;
  focusKeyword: string | null;
  schemaType: string;
};

export function toPublicPost(p: BlogPost): PublicBlogPost {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    category: p.category,
    tags: p.tags,
    readTime: p.readTime,
    date: persianDate(p.publishedAt),
    img: p.coverImage,
    alt: p.coverAlt,
    featured: p.featured,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    canonical: p.canonical,
    ogImage: p.ogImage,
    focusKeyword: p.focusKeyword,
    schemaType: p.schemaType,
  };
}

// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const post = await db.blogPost.findUnique({
        where: { slug },
      });
      if (!post || post.status !== "published") {
        return NextResponse.json(
          { ok: false, error: "مقاله پیدا نشد." },
          { status: 404 }
        );
      }
      return NextResponse.json({ ok: true, post: toPublicPost(post) });
    }

    const posts = await db.blogPost.findMany({
      where: { status: "published" },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    });
    return NextResponse.json({ ok: true, posts: posts.map(toPublicPost) });
  } catch (e) {
    console.error("blog GET error", e);
    return NextResponse.json(
      { ok: false, error: "خطا در بارگیری مقاله‌ها." },
      { status: 500 }
    );
  }
}
