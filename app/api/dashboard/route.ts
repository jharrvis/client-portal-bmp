import { NextResponse } from "next/server";
import { crmRequest } from "@/lib/crm-api";
import { getPortalToken } from "@/lib/session";
import type { DashboardPayload } from "@/lib/types";

export async function GET() {
  const token = await getPortalToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  try {
    const payload = await crmRequest<DashboardPayload>("/dashboard", { token });
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat dashboard.";
    return NextResponse.json({ message }, { status: 422 });
  }
}
