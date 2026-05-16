"use client";

import { Chip, Pill } from "@/components/ui/primitives";

export type GanttTask = {
  id: string;
  name: string;
  group?: string; // project name or instance name
  phaseColour?: string | null;
  phaseLabel?: string | null;
  startDate: string | null;
  endDate: string | null;
  progressPercent?: number | null;
  isMilestone?: boolean;
  isOnHold?: boolean;
  status?: "not_started" | "ready" | "blocked" | "in_progress" | "done" | "on_hold";
  href?: string;
};

const STATUS_COLOR: Record<NonNullable<GanttTask["status"]>, string> = {
  not_started: "#94A3B8",
  ready: "#1E40AF",
  blocked: "#B91C1C",
  in_progress: "#0F766E",
  done: "#0F766E",
  on_hold: "#FACC15",
};

function parseDate(d: string | null): Date | null {
  if (!d) return null;
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return null;
  dt.setHours(0, 0, 0, 0);
  return dt;
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export function GanttGrid({
  tasks,
  today = new Date(),
  daysToShow = 56,
  labelWidth = 320,
  dayWidth = 22,
}: {
  tasks: GanttTask[];
  today?: Date;
  daysToShow?: number;
  labelWidth?: number;
  dayWidth?: number;
}) {
  today = new Date(today);
  today.setHours(0, 0, 0, 0);

  // Anchor window: earliest task start (or today − 7) → daysToShow
  let earliest = new Date(today);
  earliest.setDate(today.getDate() - 7);
  for (const t of tasks) {
    const s = parseDate(t.startDate);
    if (s && s < earliest) earliest = s;
  }
  // Round to Monday
  while (earliest.getDay() !== 1) {
    earliest.setDate(earliest.getDate() - 1);
  }

  const totalWidth = daysToShow * dayWidth;

  // Build week labels
  const weeks: { x: number; label: string }[] = [];
  for (let i = 0; i < daysToShow; i += 7) {
    const d = new Date(earliest);
    d.setDate(earliest.getDate() + i);
    weeks.push({
      x: i * dayWidth,
      label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    });
  }

  const todayOffset = daysBetween(earliest, today) * dayWidth;

  // Group tasks by `group`
  const groups = new Map<string, GanttTask[]>();
  for (const t of tasks) {
    const key = t.group ?? "—";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(t);
  }

  return (
    <div style={{ display: "flex", border: "1px solid var(--line)", borderRadius: 6, background: "var(--surface)", overflow: "hidden" }}>
      {/* Left column: task labels */}
      <div style={{ flex: "0 0 " + labelWidth + "px", borderRight: "1px solid var(--line-2)" }}>
        {/* sticky header */}
        <div
          style={{
            height: 38,
            background: "var(--surface-2)",
            borderBottom: "1px solid var(--line-2)",
            padding: "0 14px",
            display: "flex",
            alignItems: "center",
            fontSize: 11,
            color: "var(--ink-3)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            fontWeight: 500,
          }}
        >
          Tasks
        </div>
        {Array.from(groups.entries()).map(([groupName, ts]) => (
          <div key={groupName}>
            <div
              style={{
                padding: "8px 14px",
                background: "var(--bg-2)",
                borderBottom: "1px solid var(--line)",
                fontSize: 11.5,
                fontWeight: 600,
                color: "var(--ink-2)",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              {groupName}
              <span
                className="mono"
                style={{ marginLeft: 8, fontSize: 10.5, color: "var(--ink-4)", fontWeight: 500, textTransform: "none" }}
              >
                · {ts.length}
              </span>
            </div>
            {ts.map((t) => (
              <a
                key={t.id}
                href={t.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0 14px",
                  height: 32,
                  borderBottom: "1px solid var(--line)",
                  fontSize: 12,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                {t.isMilestone && <span style={{ fontSize: 11, color: "var(--ink-3)" }}>◆</span>}
                {t.phaseColour && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      background: t.phaseColour,
                      flex: "0 0 6px",
                    }}
                  />
                )}
                <span
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                  }}
                >
                  {t.name}
                </span>
                {t.isOnHold && <Pill variant="modified">hold</Pill>}
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* Right column: gantt bars */}
      <div style={{ flex: 1, overflowX: "auto", position: "relative" }}>
        <div style={{ width: totalWidth, position: "relative" }}>
          {/* Week-label header */}
          <div
            style={{
              height: 38,
              background: "var(--surface-2)",
              borderBottom: "1px solid var(--line-2)",
              position: "sticky",
              top: 0,
              zIndex: 2,
            }}
          >
            {weeks.map((w, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: w.x,
                  top: 0,
                  bottom: 0,
                  padding: "0 8px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: 11,
                  color: "var(--ink-3)",
                  borderLeft: i === 0 ? "none" : "1px solid var(--line)",
                  width: 7 * dayWidth,
                  whiteSpace: "nowrap",
                }}
                className="mono"
              >
                {w.label}
              </span>
            ))}
            {/* day grid */}
            {Array.from({ length: daysToShow }).map((_, i) => (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: i * dayWidth,
                  top: 30,
                  bottom: 0,
                  width: 1,
                  background: i % 7 === 0 ? "var(--line-2)" : "transparent",
                }}
              />
            ))}
          </div>

          {/* Today line */}
          {todayOffset >= 0 && todayOffset <= totalWidth && (
            <div
              style={{
                position: "absolute",
                left: todayOffset,
                top: 38,
                bottom: 0,
                width: 2,
                background: "#1E40AF",
                zIndex: 1,
                opacity: 0.6,
              }}
            />
          )}

          {/* Group blocks */}
          {Array.from(groups.entries()).map(([groupName, ts]) => (
            <div key={groupName}>
              <div
                style={{
                  height: 32,
                  background: "var(--bg-2)",
                  borderBottom: "1px solid var(--line)",
                }}
              />
              {ts.map((t) => {
                const s = parseDate(t.startDate);
                const e = parseDate(t.endDate);
                if (!s || !e) {
                  return (
                    <div
                      key={t.id}
                      style={{ height: 32, borderBottom: "1px solid var(--line)", position: "relative" }}
                    >
                      <span style={{ position: "absolute", left: 14, top: 8, fontSize: 11, color: "var(--ink-5)" }} className="mono">
                        no dates
                      </span>
                    </div>
                  );
                }
                const startDays = daysBetween(earliest, s);
                const lengthDays = Math.max(1, daysBetween(s, e) + 1);
                const left = startDays * dayWidth;
                const width = lengthDays * dayWidth;
                const status = t.isOnHold ? "on_hold" : t.status ?? "ready";
                const colour = STATUS_COLOR[status];
                return (
                  <div
                    key={t.id}
                    style={{ height: 32, borderBottom: "1px solid var(--line)", position: "relative" }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left,
                        top: 6,
                        height: 20,
                        width,
                        background: colour,
                        borderRadius: 4,
                        opacity: status === "not_started" ? 0.45 : 0.9,
                        display: "flex",
                        alignItems: "center",
                        padding: "0 6px",
                        color: "#fff",
                        fontSize: 10.5,
                        fontWeight: 600,
                        boxShadow: "0 1px 2px rgba(15,23,42,0.1)",
                      }}
                    >
                      {(t.progressPercent ?? 0) > 0 && (
                        <span
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: `${Math.min(100, t.progressPercent ?? 0)}%`,
                            background: "rgba(255,255,255,0.25)",
                            borderRadius: "4px 0 0 4px",
                          }}
                        />
                      )}
                      {width > 80 && (
                        <span
                          className="mono"
                          style={{ position: "relative", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                        >
                          {(t.progressPercent ?? 0) > 0 ? `${t.progressPercent}%` : t.phaseLabel ?? ""}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function GanttLegend() {
  return (
    <div style={{ display: "flex", gap: 14, fontSize: 11, color: "var(--ink-4)", alignItems: "center" }}>
      {(["not_started", "ready", "in_progress", "blocked", "on_hold", "done"] as const).map((s) => (
        <span key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 10, height: 10, background: STATUS_COLOR[s], borderRadius: 2 }} />
          {s.replace(/_/g, " ")}
        </span>
      ))}
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <span style={{ width: 2, height: 14, background: "#1E40AF", opacity: 0.6 }} />
        today
      </span>
    </div>
  );
}
