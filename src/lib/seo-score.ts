/**
 * SEO scoring for blog posts.
 *
 * `computeSeoScore` runs a fixed list of checks against a post draft and
 * returns a 0–100 score plus the per-check breakdown for the CMS UI.
 *
 * The input is intentionally a plain object (not the Prisma type) so the
 * admin editor can pass the live draft state directly.
 */

export type SeoPostInput = {
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  content?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  coverImage?: string | null;
  coverAlt?: string | null;
};

export type SeoCheck = {
  id: string;
  label: string;
  passed: boolean;
};

export type SeoScoreResult = {
  score: number; // 0–100
  checks: SeoCheck[];
};

function countWords(text: string): number {
  // Split on any whitespace; counts both Persian and Latin words.
  const matches = text.trim().match(/\S+/g);
  return matches ? matches.length : 0;
}

export function computeSeoScore(post: SeoPostInput): SeoScoreResult {
  const title = (post.title ?? "").trim();
  const slug = (post.slug ?? "").trim();
  const excerpt = (post.excerpt ?? "").trim();
  const content = (post.content ?? "").trim();
  const metaTitle = (post.metaTitle ?? "").trim();
  const metaDescription = (post.metaDescription ?? "").trim();
  const focusKeyword = (post.focusKeyword ?? "").trim();
  const coverImage = (post.coverImage ?? "").trim();
  const coverAlt = (post.coverAlt ?? "").trim();

  const fk = focusKeyword.toLowerCase();
  const titleHasFk = fk !== "" && title.toLowerCase().includes(fk);
  const descHasFk =
    fk !== "" && metaDescription.toLowerCase().includes(fk);

  // First ~10% of content (by characters) — the lead paragraphs.
  const leadLen = Math.max(80, Math.floor(content.length * 0.1));
  const contentLead = content.slice(0, leadLen).toLowerCase();
  const contentHasFk = fk !== "" && contentLead.includes(fk);

  const contentWords = countWords(content);
  const hasH2 = /^##\s/m.test(content);

  const checks: SeoCheck[] = [
    {
      id: "meta-title",
      label: "عنوان سئو بین ۳۰ تا ۶۰ کاراکتر",
      passed: metaTitle.length >= 30 && metaTitle.length <= 60,
    },
    {
      id: "meta-description",
      label: "توضیحات متا بین ۷۰ تا ۱۶۰ کاراکتر",
      passed: metaDescription.length >= 70 && metaDescription.length <= 160,
    },
    {
      id: "fk-in-title",
      label: "کلمه‌ی کلیدی در عنوان",
      passed: titleHasFk,
    },
    {
      id: "fk-in-desc",
      label: "کلمه‌ی کلیدی در توضیحات متا",
      passed: descHasFk,
    },
    {
      id: "fk-in-content",
      label: "کلمه‌ی کلیدی در ابتدای متن",
      passed: contentHasFk,
    },
    {
      id: "slug",
      label: "نامک (slug) کوتاه و مناسب",
      passed: slug.length > 0 && slug.length < 75,
    },
    {
      id: "cover-image",
      label: "تصویر کاور موجود است",
      passed: coverImage.length > 0,
    },
    {
      id: "cover-alt",
      label: "متن جایگزین (alt) تصویر",
      passed: coverAlt.length > 0,
    },
    {
      id: "content-length",
      label: "متن حداقل ۳۰۰ کلمه",
      passed: contentWords >= 300,
    },
    {
      id: "h2",
      label: "حداقل یک زیرعنوان (H2)",
      passed: hasH2,
    },
  ];

  const passed = checks.filter((c) => c.passed).length;
  const score = Math.round((passed / checks.length) * 100);
  return { score, checks };
}
