"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

type Crumb = string | { label: string; href?: string };

type Density = "compact" | "default" | "comfortable";

export function AppShell({
  crumbs = [],
  search,
  children,
  defaultDensity = "default",
}: {
  crumbs?: Crumb[];
  search?: string;
  children: React.ReactNode;
  defaultDensity?: Density;
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
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <Topbar crumbs={crumbs} search={search} />
      <div className="pl-main">{children}</div>
    </div>
  );
}
