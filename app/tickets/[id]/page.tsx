import { PortalShell } from "@/components/portal-shell";
import { TicketDetailView } from "@/components/ticket-detail-view";
import { requirePortalToken } from "@/lib/session";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePortalToken();
  const { id } = await params;

  return (
    <PortalShell
      active="tickets"
      title="Detail Ticket"
      subtitle="Lihat percakapan dan kirim balasan ke tim support."
    >
      <TicketDetailView ticketId={id} />
    </PortalShell>
  );
}
