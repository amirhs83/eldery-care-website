import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import type { Prisma } from "@prisma/client";
import type { BlogPost } from "@prisma/client";
import { toPublicPost } from "@/app/api/blog/route";

export const dynamic = "force-dynamic";

const persianDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Convert digits in a string to Persian digits. */
function toFaDigits(s: string | number): string {
  const map = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(s).replace(/[0-9]/g, (d) => map[Number(d)]);
}

/**
 * Persian slug generator.
 *  - trims
 *  - collapses whitespace to single dashes
 *  - keeps alphanumerics, Persian/Arabic letters, and dashes
 *  - lowercases Latin letters
 *  - collapses repeated dashes
 */
export function slugifyFa(title: string): string {
  return String(title || "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

/** Rough reading-time estimate (180 wpm) → "N دقیقه" with Persian digits. */
export function estimateReadTime(content: string): string {
  const words = (content.trim().match(/\S+/g) || []).length;
  const minutes = Math.max(1, Math.round(words / 180));
  return `${toFaDigits(minutes)} دقیقه`;
}

function toAdmin(p: BlogPost) {
  return {
    ...toPublicPost(p),
    status: p.status,
    publishedAtIso: p.publishedAt ? p.publishedAt.toISOString() : null,
    publishedAtFa: p.publishedAt ? persianDateFormatter.format(p.publishedAt) : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

/** GET /api/admin/blog — list all posts (incl. drafts). q, status filters. */
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const status = searchParams.get("status");

    const where: Prisma.BlogPostWhereInput = {};
    if (q) {
      where.OR = [
        { title: { contains: q } },
        { slug: { contains: q } },
        { category: { contains: q } },
      ];
    }
    if (status === "draft" || status === "published") {
      where.status = status;
    }

    const posts = await db.blogPost.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
    });
    return NextResponse.json({
      ok: true,
      posts: posts.map(toAdmin),
      count: posts.length,
    });
  } catch (e) {
    console.error("admin blog GET error", e);
    return NextResponse.json(
      { ok: false, error: "خطا در بارگیری مقاله‌ها." },
      { status: 500 }
    );
  }
}

/** POST /api/admin/blog — create a new post. */
export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "درخواست نامعتبر است." },
        { status: 400 }
      );
    }

    const title = String(body.title || "").trim();
    if (!title) {
      return NextResponse.json(
        { ok: false, error: "عنوان لازم است." },
        { status: 400 }
      );
    }
    const excerpt = String(body.excerpt || "").trim();
    const content = String(body.content || "").trim();
    const category = String(body.category || "").trim();
    const tags = String(body.tags || "").trim();
    const status =
      body.status === "published" ? "published" : "draft";
    const featured = Boolean(body.featured);
    const coverImage = body.coverImage ? String(body.coverImage).trim() : null;
    const coverAlt = body.coverAlt ? String(body.coverAlt).trim() : null;

    // Slug — auto-generate if missing.
    let slug = String(body.slug || "").trim();
    if (!slug) slug = slugifyFa(title);
    if (!slug) {
      return NextResponse.json(
        { ok: false, error: "نامک (slug) معتبر نیست." },
        { status: 400 }
      );
    }

    // Ensure slug uniqueness.
    const existing = await db.blogPost.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "این نامک قبلاً استفاده شده است." },
        { status: 400 }
      );
    }

    // readTime — auto-compute if not provided.
    let readTime = String(body.readTime || "").trim();
    if (!readTime) readTime = estimateReadTime(content);

    // publishedAt — set to now if publishing and no publishedAt given.
    let publishedAt: Date | null = null;
    if (body.publishedAt) {
      const d = new Date(body.publishedAt);
      if (!isNaN(d.getTime())) publishedAt = d;
    }
    if (status === "published" && !publishedAt) publishedAt = new Date();

    // SEO fields
    const metaTitle = body.metaTitle ? String(body.metaTitle).trim() : null;
    const metaDescription = body.metaDescription
      ? String(body.metaDescription).trim()
      : null;
    const canonical = body.canonical ? String(body.canonical).trim() : null;
    const ogImage = body.ogImage ? String(body.ogImage).trim() : null;
    const focusKeyword = body.focusKeyword
      ? String(body.focusKeyword).trim()
      : null;
    const schemaType =
      body.schemaType === "Article" ? "Article" : "BlogPosting";

    const post = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        category,
        tags,
        status,
        featured,
        coverImage,
        coverAlt,
        readTime,
        publishedAt,
        metaTitle,
        metaDescription,
        canonical,
        ogImage,
        focusKeyword,
        schemaType,
      },
    });
    return NextResponse.json({ ok: true, post: toAdmin(post) });
  } catch (e) {
    console.error("admin blog POST error", e);
    return NextResponse.json(
      { ok: false, error: "خطا در ساخت مقاله." },
      { status: 500 }
    );
  }
}
