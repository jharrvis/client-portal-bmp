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

function formatBytes(bytes: number) {
  if (!bytes) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;

  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function isImageAttachment(mimeType: string | null) {
  return Boolean(mimeType && mimeType.startsWith("image/"));
}

export function TicketDetailView({ ticketId }: { ticketId: string }) {
  const { data: payload, mutate } = useSWR<TicketDetailPayload>(
    `/api/tickets/${ticketId}`,
    browserJsonFetch,
    {
      refreshInterval: 15000,
      revalidateOnFocus: true,
    },
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReopening, setIsReopening] = useState(false);
  const [reopenReason, setReopenReason] = useState("");
  const [lightboxImage, setLightboxImage] = useState<{ url: string; name: string } | null>(null);
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
        },
        credentials: "same-origin",
        body: formData,
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

  async function handleReopenTicket() {
    setFeedback(null);
    setIsReopening(true);

    const trimmedReason = reopenReason.trim();

    if (!trimmedReason) {
      setFeedback({
        type: "error",
        message: "Alasan reopen wajib diisi.",
      });
      setIsReopening(false);
      return;
    }

    try {
      const response = await fetch(`/api/tickets/${ticketId}/reopen`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          reason: trimmedReason,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result?.message || "Gagal membuka kembali tiket.");
      }

      setFeedback({
        type: "success",
        message: result?.message || "Tiket berhasil dibuka kembali.",
      });
      setReopenReason("");
      await mutate();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Gagal membuka kembali tiket.",
      });
    } finally {
      setIsReopening(false);
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
        <span className={`ds-chip ${getStatusChip(ticket.status)}`}>{getStatusLabel(ticket.status)}</span>
      </div>

      <div className="ds-list-item">
        <div className="ds-list-item-head">
          <div>
            <div className="ds-row" style={{ marginBottom: 8, flexWrap: "wrap" }}>
              <span className="ds-mono">{ticket.ticket_number}</span>
              <span className={`ds-chip ${getStatusChip(ticket.status)}`}>{getStatusLabel(ticket.status)}</span>
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
              {reply.attachments.length > 0 ? (
                <div style={{ marginTop: 10 }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: 10,
                    }}
                  >
                    {reply.attachments
                      .filter((attachment) => isImageAttachment(attachment.mime_type))
                      .map((attachment) => (
                        <button
                          key={attachment.id}
                          type="button"
                          onClick={() => setLightboxImage({ url: attachment.url, name: attachment.name })}
                          style={{
                            display: "block",
                            overflow: "hidden",
                            borderRadius: 16,
                            border: "1px solid var(--outline-variant)",
                            backgroundColor: "var(--surface)",
                            textDecoration: "none",
                            padding: 0,
                            cursor: "pointer",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={attachment.url}
                            alt={attachment.name}
                            style={{
                              width: "100%",
                              height: 120,
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                          <div
                            style={{
                              padding: "8px 10px",
                              fontSize: 12,
                              color: "var(--on-surface-variant)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {attachment.name}
                          </div>
                        </button>
                      ))}
                  </div>

                  <div className="ds-row" style={{ flexWrap: "wrap", marginTop: 10 }}>
                    {reply.attachments
                      .filter((attachment) => !isImageAttachment(attachment.mime_type))
                      .map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="ds-chip ds-chip-neutral"
                          style={{ textTransform: "none", gap: 8 }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                            attach_file
                          </span>
                          <span>{attachment.name}</span>
                          <span className="ds-text-muted">({formatBytes(attachment.size_bytes)})</span>
                        </a>
                      ))}
                  </div>
                </div>
              ) : null}
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
          <div className="ds-stack-sm" style={{ marginTop: 12 }}>
            <div className="ds-alert ds-alert-error">
              Ticket dengan status resolved atau closed tidak dapat dibalas dari portal client.
            </div>
            <div className="ds-field-group">
              <label className="ds-field-label">Alasan Reopen</label>
              <textarea
                className="ds-input"
                rows={4}
                value={reopenReason}
                onChange={(event) => setReopenReason(event.target.value)}
                placeholder="Jelaskan kenapa ticket perlu dibuka kembali."
                style={{ minHeight: 110, resize: "vertical", paddingTop: 14 }}
              />
            </div>
            <button
              type="button"
              className="ds-btn ds-btn-outline"
              onClick={handleReopenTicket}
              disabled={isReopening}
            >
              {isReopening ? "Membuka kembali..." : "Reopen Ticket"}
            </button>
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

            <div className="ds-field-group">
              <label className="ds-field-label">Lampiran</label>
              <input type="file" name="attachments[]" multiple className="ds-input" />
              <p className="ds-body-sm ds-text-muted" style={{ margin: 0 }}>
                Maksimal 5MB per file. Format: JPG, PNG, PDF, DOC, DOCX, XLS, XLSX, ZIP, TXT.
              </p>
            </div>

            <button type="submit" className="ds-btn ds-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Mengirim..." : "Kirim Balasan"}
            </button>
          </form>
        )}
      </div>

      {lightboxImage ? (
        <div
          onClick={() => setLightboxImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 120,
            backgroundColor: "rgba(2, 6, 23, 0.82)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 960,
              borderRadius: 24,
              overflow: "hidden",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--outline-variant)",
              boxShadow: "0 24px 64px rgba(15, 23, 42, 0.35)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "14px 16px",
                borderBottom: "1px solid var(--outline-variant)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--on-surface)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {lightboxImage.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <a
                  href={lightboxImage.url}
                  target="_blank"
                  rel="noreferrer"
                  className="ds-btn ds-btn-outline"
                  style={{ width: "auto" }}
                >
                  Buka File
                </a>
                <button
                  type="button"
                  className="ds-btn ds-btn-outline"
                  style={{ width: "auto" }}
                  onClick={() => setLightboxImage(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxImage.url}
              alt={lightboxImage.name}
              style={{
                width: "100%",
                maxHeight: "78vh",
                objectFit: "contain",
                backgroundColor: "rgb(2, 6, 23)",
                display: "block",
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
