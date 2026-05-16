"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const TABS = [
  { label: "Overview", slug: "overview" },
  { label: "Quotes", slug: "quotes" },
  { label: "Working Set", slug: "working-set" },
  { label: "MTO", slug: "mto" },
  { label: "Schedule", slug: "schedule" },
  { label: "Photos", slug: "photos" },
  { label: "Activity", slug: "activity" },
];

export function ProjectTabs({ projectId }: { projectId: string }) {
  const pathname = usePathname() ?? "";

  return (
    <div className="pl-tabs">
      {TABS.map((t) => {
        const href = `/projects/${projectId}/${t.slug}`;
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link key={t.slug} href={href} className={clsx("pl-tab", active && "is-active")}>
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
