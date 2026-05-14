import { NextResponse } from "next/server";
import { CRM_API_BASE_URL } from "@/lib/config";
import { getPortalToken } from "@/lib/session";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const token = await getPortalToken();

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const response = await fetch(`${CRM_API_BASE_URL}/tickets/${id}/reopen`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload?.message || "Gagal membuka kembali tiket.");
    }

    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal membuka kembali tiket.";
    return NextResponse.json({ message }, { status: 422 });
  }
}
