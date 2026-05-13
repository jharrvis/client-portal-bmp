import { TicketsView } from "@/components/tickets-view";
import { PortalShell } from "@/components/portal-shell";
import { requirePortalToken } from "@/lib/session";

export default async function TicketsPage() {
  await requirePortalToken();

  return (
    <PortalShell
      active="tickets"
      title="Tiket Support"
      subtitle="Keluhan dan tindak lanjut support yang sedang berjalan."
    >
      <TicketsView />
    </PortalShell>
  );
}
