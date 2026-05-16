"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Icon } from "@/components/ui/icon";
import { PlumbMark } from "@/components/ui/primitives";

type NavItem =
  | { group: string }
  | {
      key: string;
      label: string;
      ico: string;
      href: string;
      badge?: string;
      warn?: boolean;
    };

const NAV: NavItem[] = [
  { group: "Workspace" },
  { key: "dashboard", label: "Dashboard", ico: "layout", href: "/dashboard" },
  { key: "projects", label: "Projects", ico: "folder", href: "/projects", badge: "24" },
  { key: "aggregate", label: "Combined MTO", ico: "fork", href: "/procurement/aggregation" },
  { key: "schedule", label: "Schedule", ico: "calendar", href: "/schedule" },
  { group: "Sales" },
  { key: "quotes", label: "Quotes", ico: "edit", href: "/quotes" },
  { key: "pos", label: "Purchase Orders", ico: "list", href: "/procurement" },
  { group: "Catalog" },
  { key: "catalog", label: "Catalog", ico: "cube", href: "/catalog" },
  { key: "materials", label: "Materials", ico: "package", href: "/catalog/materials", badge: "847" },
  { key: "systems", label: "Systems", ico: "diamond", href: "/catalog/systems" },
  { key: "suppliers", label: "Suppliers", ico: "store", href: "/catalog/suppliers" },
  { group: "Warehouse" },
  { key: "stock", label: "Stock", ico: "package", href: "/stock" },
  { key: "picking", label: "Pick & Issue", ico: "scan", href: "/storeman" },
  { key: "audit", label: "Audit Log", ico: "history", href: "/audit" },
  { group: "Workspace settings" },
  { key: "users", label: "Users", ico: "user", href: "/users" },
  { key: "settings", label: "Settings", ico: "settings", href: "/settings" },
];

export type SidebarUser = { name: string; role: string };

type Props = {
  collapsed: boolean;
  onToggle: () => void;
  org?: string;
  user?: SidebarUser;
  onSignOut?: () => void;
};

export function Sidebar({
  collapsed,
  onToggle,
  org = "Workspace",
  user = { name: "—", role: "—" },
  onSignOut,
}: Props) {
  const pathname = usePathname() ?? "/";

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard" || pathname === "/";
    // longest-prefix match
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className="pl-side">
      <div className="pl-brand">
        <PlumbMark />
        <span className="pl-brand-text">akro-app</span>
        <span
          className="pl-chip mono"
          style={{ background: "#FFFFFF", borderColor: "#DCE1EA", color: "#64748B" }}
        >
          v4.2
        </span>
        <button
          className="pl-collapse-btn"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <Icon name="chevR" size={13} /> : <Icon name="chevL" size={13} />}
        </button>
      </div>
      <div className="pl-org">
        <div className="pl-org-avatar">VS</div>
        <div className="pl-org-name">{org}</div>
        <Icon name="chev" size={12} className="pl-org-chev" />
      </div>
      <nav className="pl-nav">
        {NAV.map((it, i) =>
          "group" in it ? (
            <div key={"g" + i} className="pl-nav-group">
              {it.group}
            </div>
          ) : (
            <Link
              key={it.key}
              href={it.href}
              className={clsx("pl-nav-item", isActive(it.href) && "is-active")}
              title={collapsed ? it.label : undefined}
            >
              <Icon name={it.ico} size={14} />
              <span className="pl-nav-label">{it.label}</span>
              {it.badge && (
                <span className={clsx("pl-nav-badge", it.warn && "warn")}>{it.badge}</span>
              )}
            </Link>
          ),
        )}
      </nav>
      <div className="pl-side-foot">
        <div className="pl-avatar">{user.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase() || "U"}</div>
        <div className="pl-foot-text">
          <div style={{ color: "#1F2937", fontWeight: 500 }}>{user.name}</div>
          <div style={{ fontSize: 10.5, color: "#64748B" }}>{user.role}</div>
        </div>
        {onSignOut ? (
          <button
            onClick={onSignOut}
            className="pl-collapse-btn"
            title="Sign out"
            aria-label="Sign out"
          >
            <Icon name="arrowR" size={13} />
          </button>
        ) : (
          <Icon name="settings" size={14} />
        )}
      </div>
    </aside>
  );
}
