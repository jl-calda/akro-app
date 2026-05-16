import { Btn } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import React from "react";

type Crumb = string | { label: string; href?: string };

export function Topbar({
  crumbs = [],
  search = "Search materials, projects, rules…",
}: {
  crumbs?: Crumb[];
  search?: string;
}) {
  return (
    <div className="pl-top">
      <div className="pl-crumbs">
        {crumbs.map((c, i) => {
          const label = typeof c === "string" ? c : c.label;
          return (
            <React.Fragment key={i}>
              {i > 0 && <Icon name="chevR" size={12} className="pl-crumb-sep" />}
              <span className={i === crumbs.length - 1 ? "pl-crumb-cur" : ""}>{label}</span>
            </React.Fragment>
          );
        })}
      </div>
      <div className="pl-top-right">
        <div className="pl-search" title={search}>
          <Icon name="search" size={13} />
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {search}
          </span>
          <span className="kbd">⌘K</span>
        </div>
        <Btn
          variant="ghost"
          style={{ width: 30, padding: 0, justifyContent: "center" }}
          ico="bell"
        />
      </div>
    </div>
  );
}
