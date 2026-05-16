"use client";

import { Pill } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

type FlagTone = "crit" | "warn" | "info";

export function FlagRow({
  tone,
  label,
  detail,
}: {
  tone: FlagTone;
  label: string;
  detail: string;
}) {
  const style = {
    crit: { bg: "var(--danger-soft)", border: "#F4C0C0", fg: "var(--danger)", ico: "warn" },
    warn: { bg: "var(--hivis-soft)", border: "var(--hivis-line)", fg: "var(--hivis-ink)", ico: "warn" },
    info: { bg: "var(--primary-soft)", border: "var(--primary-line)", fg: "var(--primary)", ico: "check" },
  }[tone];
  return (
    <div
      style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--line)",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        background: style.bg + "33", // tint
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          background: style.bg,
          color: style.fg,
          border: `1px solid ${style.border}`,
          display: "grid",
          placeItems: "center",
        }}
      >
        <Icon name={style.ico} size={13} />
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: style.fg }}>{label}</div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{detail}</div>
      </div>
      <Pill variant={tone === "crit" ? "danger" : tone === "warn" ? "modified" : "info"}>
        {tone}
      </Pill>
    </div>
  );
}

export function FlagList({ flags }: { flags: { tone: FlagTone; label: string; detail: string }[] }) {
  if (flags.length === 0) {
    return (
      <div style={{ padding: 18, fontSize: 12.5, color: "var(--ink-4)" }}>
        No flags raised. The MTO is ready for approval.
      </div>
    );
  }
  return (
    <div>
      {flags.map((f, i) => (
        <FlagRow key={i} {...f} />
      ))}
    </div>
  );
}
