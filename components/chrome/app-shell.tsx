"use client";

import { useState, useEffect } from "react";
import { Sidebar, type SidebarUser } from "./sidebar";
import { Topbar } from "./topbar";

type Crumb = string | { label: string; href?: string };

type Density = "compact" | "default" | "comfortable";

export function AppShell({
  crumbs = [],
  search,
  children,
  defaultDensity = "default",
  user,
  org,
  onSignOut,
}: {
  crumbs?: Crumb[];
  search?: string;
  children: React.ReactNode;
  defaultDensity?: Density;
  user?: SidebarUser;
  org?: string;
  onSignOut?: () => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [density] = useState<Density>(defaultDensity);

  useEffect(() => {
    const v = localStorage.getItem("akro:sidebarCollapsed");
    if (v === "1") setCollapsed(true);
  }, []);

  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem("akro:sidebarCollapsed", next ? "1" : "0");
      } catch {}
      return next;
    });
  }

  return (
    <div
      className="pl-app"
      data-density={density}
      data-sidebar={collapsed ? "collapsed" : "expanded"}
    >
      <Sidebar collapsed={collapsed} onToggle={toggle} user={user} org={org} onSignOut={onSignOut} />
      <Topbar crumbs={crumbs} search={search} />
      <div className="pl-main">{children}</div>
    </div>
  );
}
