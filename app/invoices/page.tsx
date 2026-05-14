import { InvoicesView } from "@/components/invoices-view";
import { PortalShell } from "@/components/portal-shell";
import { crmRequest } from "@/lib/crm-api";
import { requirePortalToken } from "@/lib/session";
import type { InvoicePayload } from "@/lib/types";

export default async function InvoicesPage() {
  const token = await requirePortalToken();
  const payload = await crmRequest<InvoicePayload>("/invoices", { token });

  return (
    <PortalShell
      active="invoices"
      title="Invoice & Tagihan"
      subtitle="Ringkasan invoice yang terhubung ke CRM."
    >
      <InvoicesView initialData={payload} />
    </PortalShell>
  );
}
