import { NextResponse } from "next/server";
import { crmRequest } from "@/lib/crm-api";
import { getPortalToken } from "@/lib/session";
import type { SubscriptionUsagePayload } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getPortalToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const payload = await crmRequest<SubscriptionUsagePayload>(`/subscriptions/${id}/usage`, { token });
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat usage langganan.";
    return NextResponse.json({ message }, { status: 422 });
  }
}
