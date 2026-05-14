"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

type NavKey = "dashboard" | "subscriptions" | "invoices" | "tickets" | "notifications";

const navItems: Array<{ key: NavKey; href: string; label: string; icon: string }> = [
  { key: "dashboard",     href: "/dashboard",     label: "Dashboard", icon: "dashboard" },
  { key: "subscriptions", href: "/subscriptions", label: "Network",   icon: "monitoring" },
  { key: "invoices",      href: "/invoices",      label: "Billing",   icon: "receipt_long" },
  { key: "tickets",       href: "/tickets",       label: "Tickets",   icon: "confirmation_number" },
  { key: "notifications", href: "/notifications", label: "Alerts",    icon: "notifications" },
];

export function PortalShell({
  active,
  title,
  subtitle,
  children,
  unreadAlerts = false,
}: {
  active: NavKey;
  title: string;
  subtitle?: string;
  children: ReactNode;
  unreadAlerts?: boolean;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isDrawerOpen]);

  return (
    <div className="ds-root">
      <div
        className={`ds-drawer-backdrop${isDrawerOpen ? " is-open" : ""}`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      <aside className={`ds-drawer${isDrawerOpen ? " is-open" : ""}`} aria-hidden={!isDrawerOpen}>
        <div className="ds-drawer-head">
          <div className="ds-drawer-brand">
            <div className="ds-drawer-brand-icon">
              <span className="material-symbols-outlined">signal_cellular_alt</span>
            </div>
            <div>
              <div className="ds-drawer-eyebrow">Portal Client</div>
              <div className="ds-drawer-title">
                BMP<span style={{ color: "var(--primary-container)" }}>net</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="ds-icon-btn"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Tutup menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="ds-drawer-body">
          <div className="ds-drawer-section-label">Menu</div>
          <nav className="ds-drawer-nav">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`ds-drawer-link${item.key === active ? " active" : ""}`}
                onClick={() => setIsDrawerOpen(false)}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: item.key === active
                      ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                      : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.key === "notifications" && unreadAlerts ? (
                  <span className="ds-drawer-badge">Baru</span>
                ) : null}
              </Link>
            ))}
          </nav>
        </div>

        <div className="ds-drawer-foot">
          <form action="/api/auth/logout" method="POST">
            <button className="ds-btn ds-btn-outline ds-drawer-logout" type="submit">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                logout
              </span>
              Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Top App Bar */}
      <header className="ds-top-bar">
        <div className="ds-top-bar-brand">
          <button
            type="button"
            className="ds-icon-btn"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Buka menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="material-symbols-outlined ds-text-primary" style={{ fontSize: 26 }}>
            signal_cellular_alt
          </span>
          <span className="ds-top-bar-title">
            BMP<span style={{ color: "var(--primary-container)" }}>net</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="ds-top-bar-avatar">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>person</span>
          </div>
        </div>
      </header>

      {/* Page Title Row */}
      <div style={{
        padding: "16px var(--container-margin) 0",
        maxWidth: 900,
        margin: "0 auto",
        width: "100%",
      }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--on-surface)" }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "var(--on-surface-variant)" }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Main Content */}
      <main className="ds-screen">{children}</main>

      {/* Bottom Nav */}
      <nav className="ds-bottom-nav">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`ds-nav-item${item.key === active ? " active" : ""}`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontVariationSettings: item.key === active
                  ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
                  : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
              }}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
            {item.key === "notifications" && unreadAlerts && (
              <span style={{
                position: "absolute",
                top: 6,
                right: 10,
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "var(--error)",
              }} />
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
