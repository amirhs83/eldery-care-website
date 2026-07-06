import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest, unauthorized } from "@/lib/admin-auth";
import type { Prisma } from "@prisma/client";
import type { WaitlistEntry } from "@prisma/client";

export const dynamic = "force-dynamic";

const persianDateFormatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function toAdmin(e: WaitlistEntry) {
  return {
    id: e.id,
    fullName: e.fullName,
    phone: e.phone,
    email: e.email,
    feedback: e.feedback,
    referralCode: e.referralCode,
    referredBy: e.referredBy,
    archived: e.archived,
    createdAt: e.createdAt.toISOString(),
    createdAtFa: persianDateFormatter.format(e.createdAt),
  };
}

/** Build the Prisma `where` clause shared by the list + CSV export routes. */
export function buildWaitlistWhere(
  searchParams: URLSearchParams
): Prisma.WaitlistEntryWhereInput {
  const where: Prisma.WaitlistEntryWhereInput = {};
  const q = searchParams.get("q")?.trim();
  if (q) {
    where.OR = [
      { fullName: { contains: q } },
      { phone: { contains: q } },
      { email: { contains: q } },
      { feedback: { contains: q } },
    ];
  }
  const archived = searchParams.get("archived");
  if (archived === "true") where.archived = true;
  else if (archived === "false") where.archived = false;

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const created: Prisma.DateTimeFilter = {};
  if (from) created.gte = new Date(from);
  if (to) {
    const toDate = new Date(to);
    // Include the whole end day.
    toDate.setUTCHours(23, 59, 59, 999);
    created.lte = toDate;
  }
  if (from || to) where.createdAt = created;

  return where;
}

/** GET /api/admin/waitlist — list entries. */
export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const { searchParams } = new URL(req.url);
    const where = buildWaitlistWhere(searchParams);
    const sort = searchParams.get("sort");
    const orderBy: Prisma.WaitlistEntryOrderByWithRelationInput[] =
      sort === "oldest"
        ? [{ createdAt: "asc" }]
        : [{ createdAt: "desc" }];
    const entries = await db.waitlistEntry.findMany({ where, orderBy });
    return NextResponse.json({
      ok: true,
      entries: entries.map(toAdmin),
      count: entries.length,
    });
  } catch (e) {
    console.error("admin waitlist GET error", e);
    return NextResponse.json(
      { ok: false, error: "خطا در بارگیری ثبت‌نام‌ها." },
      { status: 500 }
    );
  }
}

/** PATCH /api/admin/waitlist — body { id, archived } */
export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "درخواست نامعتبر است." },
        { status: 400 }
      );
    }
    const id = String(body.id || "");
    const archived = Boolean(body.archived);
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "شناسه لازم است." },
        { status: 400 }
      );
    }
    const updated = await db.waitlistEntry.update({
      where: { id },
      data: { archived },
    });
    return NextResponse.json({ ok: true, entry: toAdmin(updated) });
  } catch (e) {
    console.error("admin waitlist PATCH error", e);
    return NextResponse.json(
      { ok: false, error: "خطا در به‌روزرسانی." },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/waitlist — body { id } */
export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "درخواست نامعتبر است." },
        { status: 400 }
      );
    }
    const id = String(body.id || "");
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "شناسه لازم است." },
        { status: 400 }
      );
    }
    await db.waitlistEntry.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin waitlist DELETE error", e);
    return NextResponse.json(
      { ok: false, error: "خطا در حذف." },
      { status: 500 }
    );
  }
}
