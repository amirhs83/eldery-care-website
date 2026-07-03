import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Simple XML sitemap endpoint.
 *
 * A real `/sitemap.xml` route isn't possible because the sandbox only
 * exposes `/`, so this API endpoint serves the same purpose and can be
 * submitted to search engines directly.
 */
export const dynamic = "force-dynamic";

const BASE = "https://aramsan.example";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  try {
    const posts = await db.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      select: { slug: true, updatedAt: true },
    });

    const urls: string[] = [];
    urls.push(
      `  <url>
    <loc>${escapeXml(BASE + "/")}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`
    );
    for (const p of posts) {
      const lastmod = p.updatedAt.toISOString();
      urls.push(
        `  <url>
    <loc>${escapeXml(`${BASE}/#blog/${p.slug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
      );
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("sitemap error", e);
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>',
      { status: 500, headers: { "Content-Type": "application/xml" } }
    );
  }
}
