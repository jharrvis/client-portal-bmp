"use client";

import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import { SubscriptionsMonitoringPanel } from "@/components/subscriptions-monitoring-panel";
import { browserJsonFetch } from "@/lib/browser-fetch";
import type {
  SubscriptionChartPayload,
  SubscriptionListPayload,
  SubscriptionUsageInterface,
  SubscriptionUsagePayload,
} from "@/lib/types";

export function SubscriptionsView() {
  const searchParams = useSearchParams();
  const selectedPeriod = searchParams.get("period")?.trim() || "24h";
  const subscriptionIdParam = searchParams.get("subscription_id");
  const graphIdParam = searchParams.get("graphid");
  const itemInParam = searchParams.get("itemin");
  const itemOutParam = searchParams.get("itemout");

  const { data: listPayload } = useSWR<SubscriptionListPayload>("/api/subscriptions", browserJsonFetch);
  const subscriptions = listPayload?.data ?? [];

  const usageReadySubscriptions = subscriptions.filter((subscription) => subscription.has_usage);
  const selectedSubscription =
    usageReadySubscriptions.find((subscription) => String(subscription.id) === subscriptionIdParam) ??
    usageReadySubscriptions[0] ??
    subscriptions[0] ??
    null;

  const usageKey = selectedSubscription?.has_usage ? `/api/subscriptions/${selectedSubscription.id}/usage` : null;
  const { data: usagePayload } = useSWR<SubscriptionUsagePayload>(usageKey, browserJsonFetch);

  const selectedInterface =
    usagePayload?.interfaces.find((item) => {
      const graphMatches = graphIdParam && item.graphid === graphIdParam;
      const itemMatches =
        itemInParam &&
        itemOutParam &&
        item.itemIn === itemInParam &&
        item.itemOut === itemOutParam;

      return graphMatches || itemMatches;
    }) ??
    usagePayload?.interfaces[0] ??
    null;

  const chartKey =
    selectedSubscription && selectedInterface
      ? `/api/subscriptions/monitoring?${new URLSearchParams({
          subscription_id: String(selectedSubscription.id),
          period: selectedPeriod,
          graphid: selectedInterface.graphid ?? "",
          itemin: selectedInterface.itemIn,
          itemout: selectedInterface.itemOut,
        }).toString()}`
      : null;

  const { data: initialChart, error: chartError } = useSWR<SubscriptionChartPayload>(chartKey, browserJsonFetch);

  if (!listPayload) {
    return <div className="ds-empty">Memuat data langganan...</div>;
  }

  return (
    <SubscriptionsMonitoringPanel
      key={`${selectedSubscription?.id ?? "none"}:${selectedInterface?.itemIn ?? "none"}:${selectedInterface?.itemOut ?? "none"}:${selectedPeriod}`}
      subscriptions={subscriptions}
      selectedSubscription={selectedSubscription}
      usagePayload={usagePayload ?? null}
      initialInterface={selectedInterface as SubscriptionUsageInterface | null}
      initialChart={initialChart ?? null}
      initialChartError={chartError instanceof Error ? chartError.message : null}
      initialPeriod={selectedPeriod}
    />
  );
}
