"use client";

import useSWR from "swr";
import { browserJsonFetch } from "@/lib/browser-fetch";
import type { InvoicePayload } from "@/lib/types";

export function InvoicesView({ initialData }: { initialData: InvoicePayload }) {
  const { data } = useSWR<InvoicePayload>("/api/invoices", browserJsonFetch, {
    fallbackData: initialData,
  });

  const payload = data ?? initialData;
  const unpaid = payload.data.filter((i) => i.status !== "paid");
  const totalUnpaid = unpaid.reduce((sum, i) => sum + i.total_amount, 0);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--gutter)" }}>
        <div className="ds-card ds-card-pad">
          <p className="ds-label-caps ds-text-muted" style={{ margin: "0 0 4px" }}>Total Belum Lunas</p>
          <p className="ds-display-lg ds-text-primary" style={{ margin: "0 0 12px" }}>
            Rp {totalUnpaid.toLocaleString("id-ID")}
          </p>
          {unpaid.length > 0 && <span className="ds-chip ds-chip-unpaid">{unpaid.length} tagihan</span>}
        </div>
        <div className="ds-card ds-card-pad">
          <p className="ds-label-caps ds-text-muted" style={{ margin: "0 0 4px" }}>Total Invoice</p>
          <p className="ds-display-lg" style={{ margin: "0 0 8px" }}>{payload.data.length}</p>
          <span className="ds-chip ds-chip-paid">{payload.data.filter((i) => i.status === "paid").length} lunas</span>
        </div>
      </div>

      <div className="ds-card">
        <div className="ds-card-header">
          <span className="ds-title-sm">Daftar Tagihan</span>
          <span className="ds-label-caps ds-text-muted">{payload.data.length} total</span>
        </div>

        {payload.data.length === 0 ? (
          <div className="ds-empty" style={{ margin: 16 }}>Belum ada invoice.</div>
        ) : (
          <div className="ds-table-wrap">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Tanggal</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payload.data.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <span className="ds-mono">{invoice.invoice_number}</span>
                      <br />
                      <span className="ds-body-sm ds-text-muted">{invoice.items_count} item</span>
                    </td>
                    <td>
                      <div className="ds-body-sm">{invoice.invoice_date ?? "-"}</div>
                      <div className="ds-body-sm ds-text-muted">Due: {invoice.due_date ?? "-"}</div>
                    </td>
                    <td>
                      <strong style={{ fontWeight: 600 }}>Rp {invoice.total_amount.toLocaleString("id-ID")}</strong>
                      {invoice.paid_at && <div className="ds-body-sm ds-text-muted">{invoice.paid_at}</div>}
                    </td>
                    <td>
                      <span className={`ds-chip ${invoice.status === "paid" ? "ds-chip-paid" : "ds-chip-unpaid"}`}>
                        {invoice.status === "paid" ? "Lunas" : "Belum Lunas"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
