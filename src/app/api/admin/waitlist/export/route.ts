import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import { buildWaitlistWhere } from "../route";

export const dynamic = "force-dynamic";

const persianDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function csvEscape(s: string | null | undefined): string {
  if (s === null || s === undefined) return "";
  const str = String(s);
  if (/[",\n\r]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * GET /api/admin/waitlist/export
 * Returns a CSV (with UTF-8 BOM so Excel reads Persian correctly) of all
 * entries matching the same query params as the list.
 */
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const { searchParams } = new URL(req.url);
    const where = buildWaitlistWhere(searchParams);
    const entries = await db.waitlistEntry.findMany({
      where,
      orderBy: [{ createdAt: "desc" }],
    });

    const header = [
      "نام",
      "موبایل",
      "ایمیل",
      "پیشنهاد",
      "تاریخ ثبت‌نام",
      "آرشیو",
    ];
    const rows = entries.map((e) =>
      [
        e.fullName,
        e.phone,
        e.email ?? "",
        e.feedback ?? "",
        persianDateFormatter.format(e.createdAt),
        e.archived ? "بله" : "خیر",
      ]
        .map(csvEscape)
        .join(",")
    );

    const csv = "\uFEFF" + header.join(",") + "\n" + rows.join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="waitlist.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("admin waitlist export error", e);
    return NextResponse.json(
      { ok: false, error: "خطا در ساخت فایل CSV." },
      { status: 500 }
    );
  }
}
