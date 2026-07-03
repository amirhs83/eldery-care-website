import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function makeReferralCode(): string {
  // Short, human-friendly, unambiguous code (no O/0/I/1)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function normalizePhone(raw: string): string {
  // Keep digits and leading +
  return raw.replace(/[^\d+]/g, "");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "درخواست نامعتبر است." },
        { status: 400 }
      );
    }

    const fullName = String(body.fullName || "").trim();
    const phone = normalizePhone(String(body.phone || "").trim());
    const email =
      String(body.email || "").trim() === ""
        ? null
        : String(body.email).trim().toLowerCase();
    const feedbackRaw = String(body.feedback || "").trim();
    const feedback = feedbackRaw === "" ? null : feedbackRaw.slice(0, 1000);
    const referredBy = String(body.referredBy || "").trim() || null;

    if (fullName.length < 3) {
      return NextResponse.json(
        { ok: false, error: "نام و نام خانوادگی را وارد کنید." },
        { status: 400 }
      );
    }
    // Iranian mobile: +989xxxxxxxxx or 09xxxxxxxxx
    const phoneOk = /^(?:\+?989\d{9}|09\d{9})$/.test(phone);
    if (!phoneOk) {
      return NextResponse.json(
        { ok: false, error: "شماره موبایل معتبر نیست." },
        { status: 400 }
      );
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "ایمیل معتبر نیست." },
        { status: 400 }
      );
    }

    // Unique referral code (retry on collision)
    let referralCode = makeReferralCode();
    for (let i = 0; i < 5; i++) {
      const exists = await db.waitlistEntry.findUnique({
        where: { referralCode },
      });
      if (!exists) break;
      referralCode = makeReferralCode();
    }

    // Validate referredBy if provided
    let referrerValid = null;
    if (referredBy) {
      referrerValid = await db.waitlistEntry.findUnique({
        where: { referralCode: referredBy },
      });
    }

    const entry = await db.waitlistEntry.create({
      data: {
        fullName,
        phone,
        email,
        feedback,
        referralCode,
        referredBy: referrerValid ? referralCode : null,
      },
    });

    // Position = number of entries created strictly before this one + 1
    const beforeCount = await db.waitlistEntry.count({
      where: { createdAt: { lt: entry.createdAt } },
    });
    const position = beforeCount + 1;

    const referredCount = 0;

    return NextResponse.json({
      ok: true,
      position,
      referralCode: entry.referralCode,
      referredCount,
      name: entry.fullName,
    });
  } catch (e) {
    console.error("waitlist error", e);
    return NextResponse.json(
      { ok: false, error: "خطایی رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const total = await db.waitlistEntry.count();
    return NextResponse.json({ ok: true, total });
  } catch {
    return NextResponse.json({ ok: true, total: 0 });
  }
}
