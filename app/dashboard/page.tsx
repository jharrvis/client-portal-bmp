import { DashboardView } from "@/components/dashboard-view";
import { PortalShell } from "@/components/portal-shell";
import { crmRequest } from "@/lib/crm-api";
import { requirePortalToken } from "@/lib/session";
import type { DashboardPayload } from "@/lib/types";

export default async function DashboardPage() {
  const token = await requirePortalToken();
  const payload = await crmRequest<DashboardPayload>("/dashboard", { token });

  const hasUnread = payload.summary.unread_notifications_count > 0;

  return (
    <PortalShell
      active="dashboard"
      title={payload.client.name}
      subtitle={`${payload.client.client_code} • Status ${payload.client.status}`}
      unreadAlerts={hasUnread}
    >
      <DashboardView initialData={payload} />
    </PortalShell>
  );
}
