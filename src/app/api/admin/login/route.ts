import { NextRequest, NextResponse } from "next/server";
import { ADMIN_TOKEN, ADMIN_COOKIE, safeEqual } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/login  body: { password }
 * Sets an httpOnly admin-token cookie on success.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { ok: false, error: "درخواست نامعتبر است." },
        { status: 400 }
      );
    }
    const password = String(body.password || "");
    if (!password) {
      return NextResponse.json(
        { ok: false, error: "رمز عبور را وارد کنید." },
        { status: 400 }
      );
    }
    if (!safeEqual(password, ADMIN_TOKEN)) {
      return NextResponse.json(
        { ok: false, error: "رمز عبور نادرست است." },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE, ADMIN_TOKEN, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24h
    });
    return res;
  } catch (e) {
    console.error("admin login error", e);
    return NextResponse.json(
      { ok: false, error: "خطایی رخ داد." },
      { status: 500 }
    );
  }
}
