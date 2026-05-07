import { PortalShell } from "@/components/portal-shell";
import { crmRequest } from "@/lib/crm-api";
import { requirePortalToken } from "@/lib/session";

type NotificationPayload = {
  data: Array<{
    id: number;
    type: string;
    title: string;
    message: string;
    read_at: string | null;
    created_at: string | null;
  }>;
};

function getTypeIcon(type: string): string {
  switch (type.toLowerCase()) {
    case "billing":      return "receipt_long";
    case "maintenance":  return "build";
    case "ticket":       return "confirmation_number";
    case "alert":        return "warning";
    default:             return "info";
  }
}

function getTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case "billing":      return "var(--secondary)";
    case "maintenance":  return "var(--tertiary)";
    case "alert":        return "var(--error)";
    default:             return "var(--primary)";
  }
}

export default async function NotificationsPage() {
  const token = await requirePortalToken();
  const payload = await crmRequest<NotificationPayload>("/notifications", { token });

  const unread = payload.data.filter((n) => !n.read_at);
  const read   = payload.data.filter((n) => n.read_at);

  return (
    <PortalShell
      active="notifications"
      title="System Alerts"
      subtitle="Pusat notifikasi update invoice, tiket, dan layanan."
      unreadAlerts={unread.length > 0}
    >
      {/* Header badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          className="ds-label-caps ds-text-muted"
          style={{
            backgroundColor: "var(--surface-container)",
            padding: "4px 10px",
            borderRadius: "var(--radius)",
          }}
        >
          Live Monitoring
        </span>
        {unread.length > 0 && (
          <span className="ds-chip ds-chip-info">
            {unread.length} baru
          </span>
        )}
      </div>

      {payload.data.length === 0 ? (
        <div className="ds-empty">Belum ada notifikasi.</div>
      ) : (
        <>
          {/* Unread section */}
          {unread.length > 0 && (
            <div>
              <div className="ds-category-header">
                <span className="ds-title-sm ds-text-primary" style={{ fontSize: 14, flexShrink: 0 }}>
                  Belum Dibaca
                </span>
                <div className="ds-category-line" />
              </div>
              <div className="ds-stack-sm">
                {unread.map((notif) => (
                  <NotifCard key={notif.id} notif={notif} isUnread />
                ))}
              </div>
            </div>
          )}

          {/* Read section */}
          {read.length > 0 && (
            <div>
              <div className="ds-category-header">
                <span
                  className="ds-title-sm ds-text-muted"
                  style={{ fontSize: 14, flexShrink: 0 }}
                >
                  Sudah Dibaca
                </span>
                <div className="ds-category-line" />
              </div>
              <div className="ds-stack-sm">
                {read.map((notif) => (
                  <NotifCard key={notif.id} notif={notif} isUnread={false} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </PortalShell>
  );
}

function NotifCard({
  notif,
  isUnread,
}: {
  notif: {
    id: number;
    type: string;
    title: string;
    message: string;
    read_at: string | null;
    created_at: string | null;
  };
  isUnread: boolean;
}) {
  return (
    <div
      className="ds-list-item"
      style={{
        display: "flex",
        gap: 12,
        padding: "var(--space-md)",
        borderColor: isUnread ? "var(--primary)" : "var(--outline-variant)",
        backgroundColor: isUnread
          ? "var(--primary-fixed)"
          : "var(--surface-container-lowest)",
        transition: "background-color 0.15s, border-color 0.15s",
      }}
    >
      {/* Icon */}
      <div style={{ flexShrink: 0 }}>
        <span
          className="material-symbols-outlined"
          style={{ color: getTypeColor(notif.type), fontSize: 22 }}
        >
          {getTypeIcon(notif.type)}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <h4
            className="ds-body-md"
            style={{ margin: 0, fontWeight: 600, color: "var(--on-surface)" }}
          >
            {notif.title}
          </h4>
          <time className="ds-mono ds-text-muted" style={{ fontSize: 11, flexShrink: 0 }}>
            {notif.created_at ?? "-"}
          </time>
        </div>
        <p className="ds-body-sm ds-text-muted" style={{ margin: 0 }}>
          {notif.message}
        </p>
      </div>
    </div>
  );
}
