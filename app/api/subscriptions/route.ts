import { NextResponse } from "next/server";
import { crmRequest } from "@/lib/crm-api";
import { getPortalToken } from "@/lib/session";
import type { SubscriptionListPayload } from "@/lib/types";

export async function GET() {
  const token = await getPortalToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  try {
    const payload = await crmRequest<SubscriptionListPayload>("/subscriptions", { token });
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat langganan.";
    return NextResponse.json({ message }, { status: 422 });
  }
}
