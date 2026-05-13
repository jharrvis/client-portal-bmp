import { NextResponse } from "next/server";
import { crmRequest } from "@/lib/crm-api";
import { getPortalToken } from "@/lib/session";
import type { TicketPayload } from "@/lib/types";

export async function GET() {
  const token = await getPortalToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  try {
    const payload = await crmRequest<TicketPayload>("/tickets", { token });
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memuat tiket.";
    return NextResponse.json({ message }, { status: 422 });
  }
}

export async function POST(request: Request) {
  const token = await getPortalToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));

  try {
    const payload = await crmRequest("/tickets", {
      method: "POST",
      token,
      body,
    });

    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal membuat tiket.";
    return NextResponse.json({ message }, { status: 422 });
  }
}
