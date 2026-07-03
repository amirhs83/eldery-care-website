import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** GET /api/admin/session — returns { ok: true, authed: boolean } */
export async function GET(req: NextRequest) {
  const authed = isAdminRequest(req);
  return NextResponse.json({ ok: true, authed });
}
