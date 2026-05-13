"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import useSWR from "swr";
import { browserJsonFetch } from "@/lib/browser-fetch";
import type { TicketDetailPayload } from "@/lib/types";

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

function getReplyBubbleStyle(authorType: string) {
  if (authorType === "client") {
    return {
      backgroundColor: "var(--primary-fixed)",
      borderColor: "var(--primary-fixed-dim)",
    };
  }

  return {
    backgroundColor: "var(--surface-container-low)",
    borderColor: "var(--outline-variant)",
  };
}

export function TicketDetailView({ ticketId }: { ticketId: string }) {
  const { data: payload, mutate } = useSWR<TicketDetailPayload>(
    `/api/tickets/${ticketId}`,
    browserJsonFetch,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch(`/api/tickets/${ticketId}/replies`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          message: String(formData.get("message") ?? "").trim(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message || "Gagal mengirim balasan.");
      }

      setFeedback({
        type: "success",
        message: result?.message || "Balasan berhasil dikirim.",
      });
      form.reset();
      await mutate();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Gagal mengirim balasan.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!payload) {
    return <div className="ds-empty">Memuat detail ticket...</div>;
  }

  const ticket = payload.data;
  const replyDisabled = ["resolved", "closed"].includes(ticket.status.toLowerCase());

  return (
    <div className="ds-stack">
      <div className="ds-row-between" style={{ alignItems: "center" }}>
        <Link href="/tickets" className="ds-btn ds-btn-outline" style={{ width: "auto" }}>
          Kembali ke Daftar Ticket
        </Link>
        <span className={`ds-chip ${getStatusChip(ticket.status)}`}>{ticket.status}</span>
      </div>

      <div className="ds-list-item">
        <div className="ds-list-item-head">
          <div>
            <div className="ds-row" style={{ marginBottom: 8, flexWrap: "wrap" }}>
              <span className="ds-mono">{ticket.ticket_number}</span>
              <span className={`ds-chip ${getStatusChip(ticket.status)}`}>{ticket.status}</span>
            </div>
            <h3 className="ds-title-sm" style={{ margin: 0 }}>
              {ticket.subject}
            </h3>
            <p className="ds-body-sm ds-text-muted" style={{ margin: "8px 0 0" }}>
              {ticket.category} | Priority {ticket.priority}
            </p>
          </div>
        </div>

        <div className="ds-stack-sm">
          {ticket.subscription ? (
            <p className="ds-body-sm ds-text-muted" style={{ margin: 0 }}>
              Layanan: {ticket.subscription.subscription_code}
              {ticket.subscription.package_name ? ` | ${ticket.subscription.package_name}` : ""}
            </p>
          ) : null}
          {ticket.assigned_to ? (
            <p className="ds-body-sm ds-text-muted" style={{ margin: 0 }}>
              Assigned: {ticket.assigned_to.name}
            </p>
          ) : null}
          <p className="ds-body-sm ds-text-muted" style={{ margin: 0 }}>
            Dibuat: {ticket.created_at ?? "-"}
          </p>
        </div>
      </div>

      <div className="ds-list-item">
        <div className="ds-list-item-head">
          <h3 className="ds-title-sm" style={{ margin: 0 }}>
            Percakapan
          </h3>
        </div>

        <div className="ds-stack-sm">
          {ticket.replies.map((reply) => (
            <div
              key={reply.id}
              style={{
                padding: 14,
                borderRadius: 16,
                border: "1px solid",
                ...getReplyBubbleStyle(reply.author_type),
              }}
            >
              <div className="ds-row-between" style={{ marginBottom: 8, alignItems: "flex-start" }}>
                <div>
                  <strong>{reply.author_name}</strong>
                  <p className="ds-body-sm ds-text-muted" style={{ margin: "4px 0 0" }}>
                    {reply.author_type === "client" ? "Client" : "Support"}
                  </p>
                </div>
                <span className="ds-body-sm ds-text-muted">{reply.created_at ?? "-"}</span>
              </div>
              <p style={{ margin: 0, lineHeight: 1.65, whiteSpace: "pre-line" }}>{reply.message}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="ds-list-item">
        <div className="ds-list-item-head">
          <div>
            <h3 className="ds-title-sm" style={{ margin: 0 }}>
              Balas Ticket
            </h3>
            <p className="ds-body-sm ds-text-muted" style={{ margin: "6px 0 0" }}>
              Tambahkan informasi baru atau tanggapan untuk tim support.
            </p>
          </div>
        </div>

        {feedback ? (
          <div className={`ds-alert ${feedback.type === "success" ? "ds-alert-success" : "ds-alert-error"}`}>
            {feedback.message}
          </div>
        ) : null}

        {replyDisabled ? (
          <div className="ds-alert ds-alert-error">
            Ticket dengan status resolved atau closed tidak dapat dibalas dari portal client.
          </div>
        ) : (
          <form onSubmit={handleReply} className="ds-stack" style={{ marginTop: 12 }}>
            <div className="ds-field-group">
              <label className="ds-field-label">Pesan Balasan</label>
              <textarea
                name="message"
                className="ds-input"
                rows={4}
                placeholder="Tulis balasan atau update terbaru dari sisi Anda."
                required
                style={{ minHeight: 120, resize: "vertical", paddingTop: 14 }}
              />
            </div>

            <button type="submit" className="ds-btn ds-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Mengirim..." : "Kirim Balasan"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
