import { PortalShell } from "@/components/portal-shell";
import { crmRequest } from "@/lib/crm-api";
import { requirePortalToken } from "@/lib/session";

type SubscriptionListPayload = {
  data: Array<{
    id: number;
    subscription_code: string;
    status: string;
    package_name: string | null;
    service_name: string | null;
    next_billing_date: string | null;
    effective_price: number;
    has_usage: boolean;
  }>;
};

export default async function SubscriptionsPage() {
  const token = await requirePortalToken();
  const payload = await crmRequest<SubscriptionListPayload>("/subscriptions", { token });

  const active = payload.data.filter((s) => s.status === "active").length;
  const withUsage = payload.data.filter((s) => s.has_usage).length;

  return (
    <PortalShell
      active="subscriptions"
      title="Network Monitoring"
      subtitle="Daftar langganan dan status usage real-time."
    >
      {/* Metric strip */}
      <div className="ds-grid-3">
        <div className="ds-stat-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="ds-stat-caption">Aktif</span>
            <span
              className="material-symbols-outlined"
              style={{ color: "var(--secondary)", fontSize: 20 }}
            >
              wifi
            </span>
          </div>
          <div className="ds-stat-value ds-text-secondary">{active}</div>
        </div>
        <div className="ds-stat-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="ds-stat-caption">Total</span>
            <span
              className="material-symbols-outlined"
              style={{ color: "var(--primary)", fontSize: 20 }}
            >
              lan
            </span>
          </div>
          <div className="ds-stat-value ds-text-primary">{payload.data.length}</div>
        </div>
        <div className="ds-stat-card">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span className="ds-stat-caption">Usage Ready</span>
            <span
              className="material-symbols-outlined"
              style={{ color: "var(--tertiary)", fontSize: 20 }}
            >
              monitoring
            </span>
          </div>
          <div className="ds-stat-value ds-text-tertiary">{withUsage}</div>
        </div>
      </div>

      {/* Subscription List */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h3 className="ds-title-sm" style={{ margin: 0 }}>
            Daftar Langganan
          </h3>
          <span className="ds-label-caps ds-text-muted">{payload.data.length} layanan</span>
        </div>

        {payload.data.length === 0 ? (
          <div className="ds-empty">Belum ada data langganan.</div>
        ) : (
          <div className="ds-stack-sm">
            {payload.data.map((sub) => (
              <div key={sub.id} className="ds-list-item">
                <div className="ds-list-item-head">
                  <div>
                    <p className="ds-mono ds-text-on-surface" style={{ margin: 0 }}>
                      {sub.subscription_code}
                    </p>
                    <p className="ds-body-sm ds-text-muted" style={{ margin: "4px 0 0" }}>
                      {sub.service_name ?? "-"} • {sub.package_name ?? "-"}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <span
                      className={`ds-chip ${
                        sub.status === "active" ? "ds-chip-online" : "ds-chip-neutral"
                      }`}
                    >
                      {sub.status}
                    </span>
                    <span
                      className={`ds-chip ${sub.has_usage ? "ds-chip-info" : "ds-chip-neutral"}`}
                    >
                      {sub.has_usage ? "Usage Ready" : "Pending"}
                    </span>
                  </div>
                </div>
                <div className="ds-list-item-footer">
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      className="material-symbols-outlined ds-text-muted"
                      style={{ fontSize: 16 }}
                    >
                      calendar_today
                    </span>
                    <span className="ds-body-sm ds-text-muted">
                      Next billing: {sub.next_billing_date ?? "-"}
                    </span>
                  </div>
                  <span className="ds-body-sm" style={{ fontWeight: 600 }}>
                    Rp {sub.effective_price.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info banner */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          padding: "var(--space-md)",
          backgroundColor: "rgba(130, 249, 190, 0.15)",
          border: "1px solid var(--secondary-container)",
          borderRadius: "var(--radius-xl)",
        }}
      >
        <span className="material-symbols-outlined ds-text-secondary" style={{ flexShrink: 0 }}>
          info
        </span>
        <div>
          <p className="ds-body-sm" style={{ margin: 0, fontWeight: 600, color: "var(--secondary)" }}>
            Bandwidth Monitoring
          </p>
          <p className="ds-body-sm ds-text-muted" style={{ margin: "4px 0 0" }}>
            Langganan dengan status "Usage Ready" dapat dipantau secara real-time melalui sistem MRTG.
          </p>
        </div>
      </div>
    </PortalShell>
  );
}
