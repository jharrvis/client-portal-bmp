import { NextResponse } from "next/server";
import { crmRequest } from "@/lib/crm-api";
import { getPortalToken } from "@/lib/session";
import type { TicketDetailPayload } from "@/lib/types";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const token = await getPortalToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const payload = await crmRequest<TicketDetailPayload>(`/tickets/${id}`, { token });
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat detail tiket.";
    return NextResponse.json({ message }, { status: 422 });
  }
}
