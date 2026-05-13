import { NextResponse } from "next/server";
import { crmRequest } from "@/lib/crm-api";
import { getPortalToken } from "@/lib/session";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const token = await getPortalToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));

  try {
    const payload = await crmRequest(`/tickets/${id}/replies`, {
      method: "POST",
      token,
      body,
    });

    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengirim balasan tiket.";
    return NextResponse.json({ message }, { status: 422 });
  }
}
