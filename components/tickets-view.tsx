"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import useSWR from "swr";
import { browserJsonFetch } from "@/lib/browser-fetch";
import type { SubscriptionListPayload, TicketPayload } from "@/lib/types";

function getStatusChip(status: string) {
  switch (status.toLowerCase()) {
    case "open":
      return "ds-chip-open";
    case "pending":
    case "waiting_client":
      return "ds-chip-pending";
    case "resolved":
    case "closed":
      return "ds-chip-resolved";
    default:
      return "ds-chip-neutral";
  }
}

function getStatusLabel(status: string) {
  switch (status.toLowerCase()) {
    case "waiting_client":
      return "waiting client";
    case "in_progress":
      return "in progress";
    default:
      return status;
  }
}

function getPriorityColor(priority: string) {
  switch (priority.toLowerCase()) {
    case "high":
    case "urgent":
      return "var(--error)";
    case "normal":
      return "var(--tertiary)";
    default:
      return "var(--on-surface-variant)";
  }
}

export function TicketsView() {
  const { data: payload, mutate } = useSWR<TicketPayload>("/api/tickets", browserJsonFetch, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
  });
  const { data: subscriptionsPayload } = useSWR<SubscriptionListPayload>("/api/subscriptions", browserJsonFetch);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleCreateTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const subscriptionValue = String(formData.get("subscription_id") ?? "").trim();

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          subscription_id: subscriptionValue ? Number(subscriptionValue) : null,
          subject: String(formData.get("subject") ?? "").trim(),
          category: String(formData.get("category") ?? "technical").trim(),
          priority: String(formData.get("priority") ?? "normal").trim(),
          message: String(formData.get("message") ?? "").trim(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message || "Gagal membuat tiket.");
      }

      setFeedback({
        type: "success",
        message: result?.message || "Tiket berhasil dibuat.",
      });
      form.reset();
      await mutate();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Gagal membuat tiket.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!payload) {
    return <div className="ds-empty">Memuat tiket support...</div>;
  }

  const openCount = payload.data.filter((ticket) => ticket.status.toLowerCase() === "open").length;
  const pendingCount = payload.data.filter((ticket) =>
    ["pending", "waiting_client", "in_progress"].includes(ticket.status.toLowerCase()),
  ).length;
  const resolvedCount = payload.data.filter((ticket) =>
    ["resolved", "closed"].includes(ticket.status.toLowerCase()),
  ).length;

  return (
    <>
      <div className="ds-list-item" style={{ marginBottom: 12 }}>
        <div className="ds-list-item-head">
          <div>
            <h3 className="ds-title-sm" style={{ margin: 0 }}>
              Buat Ticket Baru
            </h3>
            <p className="ds-body-sm ds-text-muted" style={{ margin: "6px 0 0" }}>
              Laporkan gangguan koneksi, kebutuhan bantuan teknis, atau pertanyaan billing langsung dari portal.
            </p>
          </div>
        </div>

        {feedback ? (
          <div className={`ds-alert ${feedback.type === "success" ? "ds-alert-success" : "ds-alert-error"}`}>
            {feedback.message}
          </div>
        ) : null}

        <form onSubmit={handleCreateTicket} className="ds-stack" style={{ marginTop: 12 }}>
          <div className="ds-field-group">
            <label className="ds-field-label">Layanan Terkait</label>
            <select name="subscription_id" className="ds-input" defaultValue="">
              <option value="">Pilih jika terkait layanan tertentu</option>
              {(subscriptionsPayload?.data ?? []).map((subscription) => (
                <option key={subscription.id} value={subscription.id}>
                  {subscription.subscription_code}
                  {subscription.package_name ? ` | ${subscription.package_name}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="ds-grid-2">
            <div className="ds-field-group">
              <label className="ds-field-label">Kategori</label>
              <select name="category" className="ds-input" defaultValue="technical">
                <option value="connectivity">Connectivity</option>
                <option value="billing">Billing</option>
                <option value="technical">Technical</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="ds-field-group">
              <label className="ds-field-label">Priority</label>
              <select name="priority" className="ds-input" defaultValue="normal">
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="ds-field-group">
            <label className="ds-field-label">Subjek</label>
            <input
              type="text"
              name="subject"
              className="ds-input"
              placeholder="Contoh: Internet down sejak pagi"
              required
            />
          </div>

          <div className="ds-field-group">
            <label className="ds-field-label">Pesan</label>
            <textarea
              name="message"
              className="ds-input"
              rows={4}
              placeholder="Jelaskan kronologi, lokasi, dan detail kendala yang sedang Anda alami."
              required
              style={{ minHeight: 120, resize: "vertical", paddingTop: 14 }}
            />
          </div>

          <button type="submit" className="ds-btn ds-btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Mengirim..." : "Kirim Ticket"}
          </button>
        </form>
      </div>

      <div className="ds-grid-3">
        <div className="ds-stat-card" style={{ textAlign: "center" }}>
          <p className="ds-stat-caption" style={{ textAlign: "center" }}>
            Open
          </p>
          <p className="ds-stat-value ds-text-primary" style={{ textAlign: "center" }}>
            {openCount}
          </p>
        </div>
        <div className="ds-stat-card" style={{ textAlign: "center" }}>
          <p className="ds-stat-caption" style={{ textAlign: "center" }}>
            Pending
          </p>
          <p className="ds-stat-value ds-text-tertiary" style={{ textAlign: "center" }}>
            {pendingCount}
          </p>
        </div>
        <div className="ds-stat-card" style={{ textAlign: "center" }}>
          <p className="ds-stat-caption" style={{ textAlign: "center" }}>
            Resolved
          </p>
          <p className="ds-stat-value ds-text-secondary" style={{ textAlign: "center" }}>
            {resolvedCount}
          </p>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 className="ds-title-sm" style={{ margin: 0 }}>
            Thread Support
          </h3>
          <span className="ds-label-caps ds-text-muted">{payload.data.length} tiket</span>
        </div>

        {payload.data.length === 0 ? (
          <div className="ds-empty">Belum ada tiket support.</div>
        ) : (
          <div className="ds-stack-sm">
            {payload.data.map((ticket) => (
              <div key={ticket.id} className="ds-list-item">
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
                    <span className={`ds-chip ${getStatusChip(ticket.status)}`}>{getStatusLabel(ticket.status)}</span>
                  </div>
                  <span className="ds-body-sm ds-text-muted" style={{ flexShrink: 0 }}>
                    {ticket.created_at ?? "-"}
                  </span>
                </div>

                <h4 className="ds-title-sm" style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600 }}>
                  {ticket.subject}
                </h4>
                <p className="ds-body-sm ds-text-muted" style={{ margin: "0 0 10px" }}>
                  {ticket.category} | <span style={{ color: getPriorityColor(ticket.priority), fontWeight: 600 }}>
                    Priority: {ticket.priority}
                  </span>
                </p>

                {ticket.subscription ? (
                  <p className="ds-body-sm ds-text-muted" style={{ margin: "0 0 10px" }}>
                    {ticket.subscription.subscription_code}
                  </p>
                ) : null}

                <div className="ds-list-item-footer">
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="material-symbols-outlined ds-text-muted" style={{ fontSize: 16 }}>
                      update
                    </span>
                    <span className="ds-label-caps ds-text-muted" style={{ fontSize: 10 }}>
                      {ticket.created_at ?? "-"}
                    </span>
                  </div>
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="ds-label-caps ds-text-primary"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    Detail
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                      chevron_right
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
