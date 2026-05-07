import { PortalShell } from "@/components/portal-shell";
import { crmRequest } from "@/lib/crm-api";
import { requirePortalToken } from "@/lib/session";

type TicketPayload = {
  data: Array<{
    id: number;
    ticket_number: string;
    subject: string;
    category: string;
    priority: string;
    status: string;
    created_at: string | null;
  }>;
};

function getStatusChip(status: string) {
  switch (status.toLowerCase()) {
    case "open":     return "ds-chip-open";
    case "pending":  return "ds-chip-pending";
    case "resolved":
    case "closed":   return "ds-chip-resolved";
    default:         return "ds-chip-neutral";
  }
}

function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":   return "var(--error)";
    case "medium": return "var(--tertiary)";
    default:       return "var(--on-surface-variant)";
  }
}

export default async function TicketsPage() {
  const token = await requirePortalToken();
  const payload = await crmRequest<TicketPayload>("/tickets", { token });

  const openCount     = payload.data.filter((t) => t.status.toLowerCase() === "open").length;
  const pendingCount  = payload.data.filter((t) => t.status.toLowerCase() === "pending").length;
  const resolvedCount = payload.data.filter((t) =>
    ["resolved", "closed"].includes(t.status.toLowerCase())
  ).length;

  return (
    <PortalShell
      active="tickets"
      title="Tiket Support"
      subtitle="Keluhan dan tindak lanjut support yang sedang berjalan."
    >
      {/* Stats Strip */}
      <div className="ds-grid-3">
        <div className="ds-stat-card" style={{ textAlign: "center" }}>
          <p className="ds-stat-caption" style={{ textAlign: "center" }}>Open</p>
          <p className="ds-stat-value ds-text-primary" style={{ textAlign: "center" }}>
            {openCount}
          </p>
        </div>
        <div className="ds-stat-card" style={{ textAlign: "center" }}>
          <p className="ds-stat-caption" style={{ textAlign: "center" }}>Pending</p>
          <p className="ds-stat-value ds-text-tertiary" style={{ textAlign: "center" }}>
            {pendingCount}
          </p>
        </div>
        <div className="ds-stat-card" style={{ textAlign: "center" }}>
          <p className="ds-stat-caption" style={{ textAlign: "center" }}>Resolved</p>
          <p className="ds-stat-value ds-text-secondary" style={{ textAlign: "center" }}>
            {resolvedCount}
          </p>
        </div>
      </div>

      {/* Active Tickets */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h3 className="ds-title-sm" style={{ margin: 0 }}>Thread Support</h3>
          <span className="ds-label-caps ds-text-muted">{payload.data.length} tiket</span>
        </div>

        {payload.data.length === 0 ? (
          <div className="ds-empty">Belum ada tiket support.</div>
        ) : (
          <div className="ds-stack-sm">
            {payload.data.map((ticket) => (
              <div key={ticket.id} className="ds-list-item">
                {/* Head row */}
                <div className="ds-list-item-head">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span
                      className="ds-mono"
                      style={{
                        backgroundColor: "var(--surface-container)",
                        padding: "2px 8px",
                        borderRadius: "var(--radius)",
                        color: "var(--on-surface-variant)",
                      }}
                    >
                      {ticket.ticket_number}
                    </span>
                    <span className={`ds-chip ${getStatusChip(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <span className="ds-body-sm ds-text-muted" style={{ flexShrink: 0 }}>
                    {ticket.created_at ?? "-"}
                  </span>
                </div>

                {/* Subject */}
                <h4
                  className="ds-title-sm"
                  style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600 }}
                >
                  {ticket.subject}
                </h4>
                <p className="ds-body-sm ds-text-muted" style={{ margin: "0 0 10px" }}>
                  {ticket.category}
                  {" • "}
                  <span style={{ color: getPriorityColor(ticket.priority), fontWeight: 600 }}>
                    Priority: {ticket.priority}
                  </span>
                </p>

                {/* Footer */}
                <div className="ds-list-item-footer">
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                      className="material-symbols-outlined ds-text-muted"
                      style={{ fontSize: 16 }}
                    >
                      update
                    </span>
                    <span className="ds-label-caps ds-text-muted" style={{ fontSize: 10 }}>
                      {ticket.created_at ?? "-"}
                    </span>
                  </div>
                  <button
                    className="ds-label-caps ds-text-primary"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Detail
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 16 }}
                    >
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalShell>
  );
}
