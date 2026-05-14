"use client";

import useSWR from "swr";
import { browserJsonFetch } from "@/lib/browser-fetch";
import type { NotificationPayload } from "@/lib/types";

export function NotificationsView({ initialData }: { initialData: NotificationPayload }) {
  const { data } = useSWR<NotificationPayload>("/api/notifications", browserJsonFetch, {
    fallbackData: initialData,
  });

  const payload = data ?? initialData;
  const unread = payload.data.filter((n) => !n.read_at);
  const read = payload.data.filter((n) => n.read_at);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          className="ds-label-caps ds-text-muted"
          style={{ backgroundColor: "var(--surface-container)", padding: "4px 10px", borderRadius: "var(--radius)" }}
        >
          Live Monitoring
        </span>
        {unread.length > 0 && <span className="ds-chip ds-chip-info">{unread.length} baru</span>}
      </div>

      {payload.data.length === 0 ? (
        <div className="ds-empty">Belum ada notifikasi.</div>
      ) : (
        <>
          {unread.length > 0 && (
            <div>
              <div className="ds-category-header">
                <span className="ds-title-sm ds-text-primary" style={{ fontSize: 14, flexShrink: 0 }}>Belum Dibaca</span>
                <div className="ds-category-line" />
              </div>
              <div className="ds-stack-sm">
                {unread.map((notif) => (
                  <NotifCard key={notif.id} notif={notif} isUnread />
                ))}
              </div>
            </div>
          )}

          {read.length > 0 && (
            <div>
              <div className="ds-category-header">
                <span className="ds-title-sm ds-text-muted" style={{ fontSize: 14, flexShrink: 0 }}>Sudah Dibaca</span>
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
    </>
  );
}

function getTypeIcon(type: string): string {
  switch (type.toLowerCase()) {
    case "billing": return "receipt_long";
    case "maintenance": return "build";
    case "ticket": return "confirmation_number";
    case "alert": return "warning";
    default: return "info";
  }
}

function getTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case "billing": return "var(--secondary)";
    case "maintenance": return "var(--tertiary)";
    case "alert": return "var(--error)";
    default: return "var(--primary)";
  }
}

function NotifCard({ notif, isUnread }: { notif: NotificationPayload["data"][number]; isUnread: boolean }) {
  return (
    <div
      className="ds-list-item"
      style={{
        display: "flex",
        gap: 12,
        padding: "var(--space-md)",
        borderColor: isUnread ? "var(--primary)" : "var(--outline-variant)",
        backgroundColor: isUnread ? "var(--primary-fixed)" : "var(--surface-container-lowest)",
        transition: "background-color 0.15s, border-color 0.15s",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        <span className="material-symbols-outlined" style={{ color: getTypeColor(notif.type), fontSize: 22 }}>
          {getTypeIcon(notif.type)}
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
          <h4 className="ds-body-md" style={{ margin: 0, fontWeight: 600, color: "var(--on-surface)" }}>{notif.title}</h4>
          <time className="ds-mono ds-text-muted" style={{ fontSize: 11, flexShrink: 0 }}>{notif.created_at ?? "-"}</time>
        </div>
        <p className="ds-body-sm ds-text-muted" style={{ margin: 0 }}>{notif.message}</p>
      </div>
    </div>
  );
}
