import { NextResponse } from "next/server";
import { crmRequest } from "@/lib/crm-api";
import { CRM_API_BASE_URL } from "@/lib/config";
import { getPortalToken } from "@/lib/session";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const token = await getPortalToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.formData();

  try {
    const response = await fetch(`${CRM_API_BASE_URL}/tickets/${id}/replies`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.message || "Gagal mengirim balasan tiket.");
    }

    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengirim balasan tiket.";
    return NextResponse.json({ message }, { status: 422 });
  }
}
