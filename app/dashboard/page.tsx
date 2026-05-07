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
      action={
        <form action="/api/auth/logout" method="POST">
          <button className="ds-btn ds-btn-ghost" type="submit">Logout</button>
        </form>
      }
    >
      {/* Service Status Hero */}
      <div className="ds-hero-card">
        <div>
          <p className="ds-label-caps ds-text-muted" style={{ margin: "0 0 4px" }}>
            Status Layanan
          </p>
          <h2 className="ds-headline-md" style={{ margin: 0 }}>
            {payload.client.status === "active" ? "Koneksi Aktif" : payload.client.status}
          </h2>
          <p className="ds-body-sm ds-text-muted" style={{ margin: "4px 0 0" }}>
            {payload.client.client_code}
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
          <span
            className={`ds-chip ds-chip-dot ${
              payload.client.status === "active" ? "ds-chip-online" : "ds-chip-unpaid"
            }`}
          >
            {payload.client.status === "active" ? "Online" : payload.client.status}
          </span>
          <span className="ds-mono ds-text-muted">Portal Client BMPnet</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="ds-grid-auto">
        <StatCard
          icon="wifi"
          label="Langganan"
          value={payload.summary.active_subscriptions_count}
          color="var(--primary)"
        />
        <StatCard
          icon="receipt_long"
          label="Invoice"
          value={payload.summary.unpaid_invoices_count}
          color="var(--error)"
          caption="Belum lunas"
        />
        <StatCard
          icon="confirmation_number"
          label="Tiket"
          value={payload.summary.open_tickets_count}
          color="var(--tertiary)"
          caption="Terbuka"
        />
        <StatCard
          icon="notifications"
          label="Notif"
          value={payload.summary.unread_notifications_count}
          color="var(--secondary)"
          caption="Belum dibaca"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="ds-title-sm" style={{ margin: "0 0 12px" }}>Aksi Cepat</h3>
        <div className="ds-grid-auto">
          <a href="/invoices" className="ds-quick-action">
            <span className="material-symbols-outlined">payments</span>
            <span className="ds-label-caps">Bayar Tagihan</span>
          </a>
          <a href="/tickets" className="ds-quick-action">
            <span className="material-symbols-outlined">confirmation_number</span>
            <span className="ds-label-caps">Buat Tiket</span>
          </a>
          <a href="/subscriptions" className="ds-quick-action">
            <span className="material-symbols-outlined">speed</span>
            <span className="ds-label-caps">Monitoring</span>
          </a>
          <a href="/notifications" className="ds-quick-action">
            <span className="material-symbols-outlined">notifications</span>
            <span className="ds-label-caps">Alerts</span>
          </a>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="ds-card">
        <div className="ds-card-header">
          <span className="ds-title-sm">Invoice Terbaru</span>
          <a href="/invoices" className="ds-label-caps ds-text-primary">Lihat Semua</a>
        </div>
        <div style={{ padding: "0 var(--space-lg)" }}>
          {payload.recent_invoices.length === 0 ? (
            <div className="ds-empty" style={{ margin: "16px 0" }}>Belum ada invoice.</div>
          ) : (
            payload.recent_invoices.map((invoice, i) => (
              <div key={invoice.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 0",
                    gap: 12,
                  }}
                >
                  <div>
                    <p className="ds-body-md" style={{ margin: 0, fontWeight: 600 }}>
                      {invoice.invoice_number}
                    </p>
                    <p className="ds-body-sm ds-text-muted" style={{ margin: "2px 0 0" }}>
                      Tgl: {invoice.invoice_date ?? "-"} • Due: {invoice.due_date ?? "-"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p className="ds-title-sm" style={{ margin: "0 0 4px" }}>
                      Rp {invoice.total_amount.toLocaleString("id-ID")}
                    </p>
                    <span className={`ds-chip ${invoice.status === "paid" ? "ds-chip-paid" : "ds-chip-unpaid"}`}>
                      {invoice.status === "paid" ? "Lunas" : "Belum Lunas"}
                    </span>
                  </div>
                </div>
                {i < payload.recent_invoices.length - 1 && <div className="ds-divider" />}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Notifications */}
      <div className="ds-card">
        <div className="ds-card-header">
          <span className="ds-title-sm">Notifikasi Terbaru</span>
          <a href="/notifications" className="ds-label-caps ds-text-primary">Lihat Semua</a>
        </div>
        <div className="ds-stack-sm" style={{ padding: "var(--space-md) var(--space-lg)" }}>
          {payload.recent_notifications.length === 0 ? (
            <div className="ds-empty">Belum ada notifikasi.</div>
          ) : (
            payload.recent_notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "12px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: notif.read_at
                    ? "var(--surface-container)"
                    : "var(--primary-fixed)",
                  border: "1px solid var(--outline-variant)",
                }}
              >
                <span
                  className="material-symbols-outlined ds-text-primary"
                  style={{ fontSize: 20, flexShrink: 0 }}
                >
                  {notif.read_at ? "notifications" : "notifications_active"}
                </span>
                <div>
                  <p className="ds-body-sm" style={{ margin: 0, fontWeight: 600 }}>
                    {notif.title}
                  </p>
                  <p className="ds-body-sm ds-text-muted" style={{ margin: "2px 0 0" }}>
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PortalShell>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  caption,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
  caption?: string;
}) {
  return (
    <div className="ds-stat-card">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="ds-stat-caption">{label}</span>
        <span className="material-symbols-outlined" style={{ color, fontSize: 20 }}>{icon}</span>
      </div>
      <div className="ds-stat-value" style={{ color }}>{value}</div>
      {caption && <div className="ds-stat-caption">{caption}</div>}
    </div>
  );
}
