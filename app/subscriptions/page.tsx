import { SubscriptionsView } from "@/components/subscriptions-view";
import { PortalShell } from "@/components/portal-shell";
import { requirePortalToken } from "@/lib/session";

export default async function SubscriptionsPage() {
  await requirePortalToken();

  return (
    <PortalShell
      active="subscriptions"
      title="Network Monitoring"
      subtitle="Daftar langganan dan status usage real-time."
    >
      <SubscriptionsView />
    </PortalShell>
  );
}
