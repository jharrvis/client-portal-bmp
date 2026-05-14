import { NextResponse } from "next/server";
import { crmRequest } from "@/lib/crm-api";
import { CRM_API_BASE_URL } from "@/lib/config";
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

  const body = await request.formData();

  try {
    const response = await fetch(`${CRM_API_BASE_URL}/tickets`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.message || "Gagal membuat tiket.");
    }

    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal membuat tiket.";
    return NextResponse.json({ message }, { status: 422 });
  }
}
