import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import { toPublicPost } from "@/app/api/blog/route";
import { slugifyFa, estimateReadTime } from "../route";
import type { BlogPost } from "@prisma/client";

export const dynamic = "force-dynamic";

const persianDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function toAdmin(p: BlogPost) {
  return {
    ...toPublicPost(p),
    status: p.status,
    publishedAtIso: p.publishedAt ? p.publishedAt.toISOString() : null,
    publishedAtFa: p.publishedAt
      ? persianDateFormatter.format(p.publishedAt)
      : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

function notFound() {
  return NextResponse.json(
    { ok: false, error: "مقاله پیدا نشد." },
    { status: 404 }
  );
}

/** GET /api/admin/blog/[id] — single post (any status). */
export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const { id } = await ctx.params;
    const post = await db.blogPost.findUnique({ where: { id } });
    if (!post) return notFound();
    return NextResponse.json({ ok: true, post: toAdmin(post) });
  } catch (e) {
    console.error("admin blog GET [id] error", e);
    return NextResponse.json(
      { ok: false, error: "خطا در بارگیری مقاله." },
      { status: 500 }
    );
  }
}

/** PATCH /api/admin/blog/[id] — update. */
export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const { id } = await ctx.params;
    const existing = await db.blogPost.findUnique({ where: { id } });
    if (!existing) return notFound();

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "درخواست نامعتبر است." },
        { status: 400 }
      );
    }

    // Build update payload — only fields that are explicitly provided.
    const data: Record<string, unknown> = {};

    if (typeof body.title === "string") data.title = body.title.trim();
    if (typeof body.slug === "string") {
      const slug = body.slug.trim();
      data.slug = slug || slugifyFa(String(data.title ?? existing.title));
    }
    if (typeof body.excerpt === "string") data.excerpt = body.excerpt.trim();
    if (typeof body.content === "string") data.content = body.content;
    if (typeof body.category === "string") data.category = body.category.trim();
    if (typeof body.tags === "string") data.tags = body.tags.trim();
    if (typeof body.featured === "boolean") data.featured = body.featured;
    if (body.coverImage !== undefined) {
      data.coverImage = body.coverImage ? String(body.coverImage).trim() : null;
    }
    if (body.coverAlt !== undefined) {
      data.coverAlt = body.coverAlt ? String(body.coverAlt).trim() : null;
    }
    if (typeof body.readTime === "string" && body.readTime.trim()) {
      data.readTime = body.readTime.trim();
    } else if (typeof body.content === "string" && !("readTime" in body)) {
      // leave readTime as-is
    }
    if (body.metaTitle !== undefined) {
      data.metaTitle = body.metaTitle ? String(body.metaTitle).trim() : null;
    }
    if (body.metaDescription !== undefined) {
      data.metaDescription = body.metaDescription
        ? String(body.metaDescription).trim()
        : null;
    }
    if (body.canonical !== undefined) {
      data.canonical = body.canonical ? String(body.canonical).trim() : null;
    }
    if (body.ogImage !== undefined) {
      data.ogImage = body.ogImage ? String(body.ogImage).trim() : null;
    }
    if (body.focusKeyword !== undefined) {
      data.focusKeyword = body.focusKeyword
        ? String(body.focusKeyword).trim()
        : null;
    }
    if (typeof body.schemaType === "string") {
      data.schemaType = body.schemaType === "Article" ? "Article" : "BlogPosting";
    }

    // Status + publishedAt handling
    const newStatus =
      body.status === "published"
        ? "published"
        : body.status === "draft"
        ? "draft"
        : null;

    // Recompute readTime when content changed and readTime wasn't explicitly set.
    if (
      typeof body.content === "string" &&
      (typeof body.readTime !== "string" || !body.readTime.trim())
    ) {
      data.readTime = estimateReadTime(String(body.content));
    }

    // If transitioning to published and publishedAt is null, set it to now.
    if (newStatus === "published") {
      data.status = "published";
      if (body.publishedAt !== undefined && body.publishedAt) {
        const d = new Date(body.publishedAt);
        if (!isNaN(d.getTime())) data.publishedAt = d;
      } else if (!existing.publishedAt) {
        data.publishedAt = new Date();
      }
    } else if (newStatus === "draft") {
      data.status = "draft";
    } else if (body.publishedAt !== undefined) {
      if (body.publishedAt) {
        const d = new Date(body.publishedAt);
        if (!isNaN(d.getTime())) data.publishedAt = d;
      } else {
        data.publishedAt = null;
      }
    }

    // Validate unique slug if it changed.
    if (typeof data.slug === "string" && data.slug !== existing.slug) {
      const slugOwner = await db.blogPost.findUnique({
        where: { slug: data.slug },
      });
      if (slugOwner && slugOwner.id !== existing.id) {
        return NextResponse.json(
          { ok: false, error: "این نامک قبلاً استفاده شده است." },
          { status: 400 }
        );
      }
    }

    const updated = await db.blogPost.update({
      where: { id },
      data,
    });
    return NextResponse.json({ ok: true, post: toAdmin(updated) });
  } catch (e) {
    console.error("admin blog PATCH [id] error", e);
    return NextResponse.json(
      { ok: false, error: "خطا در به‌روزرسانی مقاله." },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/blog/[id] — hard delete. */
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const { id } = await ctx.params;
    const existing = await db.blogPost.findUnique({ where: { id } });
    if (!existing) return notFound();
    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin blog DELETE [id] error", e);
    return NextResponse.json(
      { ok: false, error: "خطا در حذف مقاله." },
      { status: 500 }
    );
  }
}
