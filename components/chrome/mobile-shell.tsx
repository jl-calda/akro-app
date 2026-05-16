"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Icon } from "@/components/ui/icon";

export function MStatus() {
  // Fixed time for prototype; in real use this is the device status bar (not in PWA)
  return (
    <div className="pl-mobile-status">
      <span>09:42</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="#fff" aria-hidden>
          <rect x="0" y="6" width="3" height="4" />
          <rect x="4" y="4" width="3" height="6" />
          <rect x="8" y="2" width="3" height="8" />
          <rect x="12" y="0" width="3" height="10" />
        </svg>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="#fff" strokeWidth="1.4" aria-hidden>
          <path d="M1 4a8 8 0 0 1 12 0M3 6a5 5 0 0 1 8 0M6 9h2" />
        </svg>
        <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden>
          <rect x="0.5" y="0.5" width="18" height="9" rx="2" fill="none" stroke="#fff" />
          <rect x="2" y="2" width="14" height="6" fill="#fff" />
          <rect x="19" y="3" width="2" height="4" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}

export function MobileHeader({
  title,
  subtitle,
  back,
  right,
}: {
  title: string;
  subtitle?: React.ReactNode;
  back?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="pl-mobile-header">
      {back && (
        <Link href={back} className="pl-mobile-back" aria-label="Back">
          <Icon name="chevL" size={16} />
        </Link>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {subtitle && (
          <div style={{ fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
            {subtitle}
          </div>
        )}
        <h1>{title}</h1>
      </div>
      {right}
    </div>
  );
}

export function MStat({
  value,
  label,
  tone,
}: {
  value: string | number;
  label: string;
  tone?: "warn" | "success";
}) {
  return (
    <div style={{ padding: "10px 11px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--line)", minWidth: 0 }}>
      <div
        className="mono tnum"
        style={{
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: tone === "warn" ? "var(--hivis-ink)" : tone === "success" ? "var(--success)" : "var(--ink)",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 10.5, color: "var(--ink-4)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2, lineHeight: 1.2 }}>
        {label}
      </div>
    </div>
  );
}

type TabKey = "lists" | "scan" | "stock" | "more";
type ForemanTabKey = "pending" | "scan" | "projects" | "more";

function isActive(pathname: string, key: string, base: string) {
  if (key === "lists" || key === "pending") return pathname === base || pathname.startsWith(base + "/list");
  if (key === "scan") return pathname.startsWith(base + "/scan") || pathname.startsWith(base + "/confirm");
  if (key === "stock") return pathname.startsWith(base + "/stock");
  if (key === "projects") return pathname.startsWith(base + "/projects");
  if (key === "more") return pathname.startsWith(base + "/more");
  return false;
}

export function MTabBar({ which = "storeman" }: { which?: "storeman" | "foreman" }) {
  const pathname = usePathname() ?? "";
  const base = which === "storeman" ? "/storeman" : "/foreman";

  const tabs =
    which === "storeman"
      ? ([
          { key: "lists", label: "Lists", ico: "list", href: `${base}` },
          { key: "scan", label: "Scan", ico: "qr", href: `${base}/scan` },
          { key: "stock", label: "Stock", ico: "store", href: `${base}/stock/_` },
          { key: "more", label: "More", ico: "dots", href: `${base}/more` },
        ] as { key: TabKey; label: string; ico: string; href: string }[])
      : ([
          { key: "pending", label: "Pending", ico: "list", href: `${base}` },
          { key: "scan", label: "Scan", ico: "qr", href: `${base}/scan` },
          { key: "projects", label: "Projects", ico: "folder", href: `${base}/projects` },
          { key: "more", label: "More", ico: "dots", href: `${base}/more` },
        ] as { key: ForemanTabKey; label: string; ico: string; href: string }[]);

  return (
    <div
      style={{
        height: 68,
        background: "var(--surface)",
        borderTop: "1px solid var(--line)",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        alignItems: "center",
        justifyItems: "center",
        paddingBottom: 12,
        flex: "0 0 68px",
      }}
    >
      {tabs.map((t) => {
        const active = isActive(pathname, t.key, base);
        const isScan = t.key === "scan";
        return (
          <Link
            key={t.key}
            href={t.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              color: active ? "var(--primary)" : "var(--ink-4)",
              textDecoration: "none",
              position: "relative",
            }}
          >
            {isScan ? (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  background: active ? "var(--primary)" : "var(--ink-2)",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  boxShadow: active
                    ? "0 4px 14px rgba(30,64,175,0.35)"
                    : "0 2px 6px rgba(15,23,42,0.18)",
                  marginTop: -8,
                }}
              >
                <Icon name="qr" size={20} />
              </div>
            ) : (
              <Icon name={t.ico} size={20} />
            )}
            <span style={{ fontSize: 10.5, fontWeight: active ? 600 : 500 }}>{t.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export function ConnectionGuard() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    update();
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (online) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(11,18,32,0.86)",
        color: "#fff",
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
        fontSize: 14,
        padding: 32,
        textAlign: "center",
      }}
    >
      <div>
        <div className="pl-hivis" style={{ marginBottom: 12, display: "inline-flex" }}>
          OFFLINE
        </div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>Connection lost</div>
        <div style={{ opacity: 0.7, marginTop: 6 }}>
          Please reconnect to continue. Writes are paused.
        </div>
      </div>
    </div>
  );
}

export function MobileShell({
  children,
  which = "storeman",
  showStatus = true,
  showTabBar = true,
}: {
  children: React.ReactNode;
  which?: "storeman" | "foreman";
  showStatus?: boolean;
  showTabBar?: boolean;
}) {
  return (
    <div className="mobile-frame">
      <div className="pl-mobile">
        {showStatus && <MStatus />}
        <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", minHeight: 0 }}>
          {children}
        </div>
        {showTabBar && <MTabBar which={which} />}
      </div>
      <ConnectionGuard />
    </div>
  );
}
