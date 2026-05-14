import { NotificationsView } from "@/components/notifications-view";
import { PortalShell } from "@/components/portal-shell";
import { crmRequest } from "@/lib/crm-api";
import { requirePortalToken } from "@/lib/session";
import type { NotificationPayload } from "@/lib/types";

export default async function NotificationsPage() {
  const token = await requirePortalToken();
  const payload = await crmRequest<NotificationPayload>("/notifications", { token });

  const unread = payload.data.filter((n) => !n.read_at);

  return (
    <PortalShell
      active="notifications"
      title="System Alerts"
      subtitle="Pusat notifikasi update invoice, tiket, dan layanan."
      unreadAlerts={unread.length > 0}
    >
      <NotificationsView initialData={payload} />
    </PortalShell>
  );
}
