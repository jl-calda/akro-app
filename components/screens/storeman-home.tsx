import Link from "next/link";
import { Chip, Pill, PlumbMark, ProgressBar } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { MStat } from "@/components/chrome/mobile-shell";

export type StoremanList = {
  id: string;
  code: string | null;
  name: string;
  client: string | null;
  dueLabel: string;
  issued: number;
  total: number;
  urgent?: boolean;
  fresh?: boolean;
};

export function StoremanHomeScreen({
  stats,
  lists,
  locationName,
}: {
  stats: { receipts: number; issued: number; returns: number; open: number; overdue: number };
  lists: StoremanList[];
  locationName: string;
}) {
  return (
    <>
      <div style={{ padding: "14px 18px 12px", background: "var(--surface)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <PlumbMark size={26} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 11,
                color: "var(--ink-4)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 500,
              }}
            >
              Storeman · {locationName}
            </div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>
              Picking Lists
            </h1>
          </div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: "var(--success)",
              fontWeight: 500,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                background: "var(--success)",
                boxShadow: "0 0 0 3px var(--success-soft)",
              }}
            />
            Online
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
          <MStat value={stats.receipts} label="Receipts" />
          <MStat value={stats.issued} label="Issued" />
          <MStat value={stats.returns} label="Returns" />
          <MStat value={stats.open} label="Open" />
          <MStat value={stats.overdue} label="Overdue" tone={stats.overdue > 0 ? "warn" : undefined} />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: "12px 14px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          overflow: "auto",
        }}
      >
        {lists.length === 0 ? (
          <div
            style={{
              margin: "40px auto",
              maxWidth: 300,
              padding: 28,
              background: "var(--surface)",
              border: "1px solid var(--line)",
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                margin: "0 auto 12px",
                borderRadius: 22,
                background: "var(--primary-soft)",
                color: "var(--primary)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon name="list" size={20} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>No picking lists yet</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginTop: 4 }}>
              Approved MTOs from project managers will appear here.
            </div>
          </div>
        ) : (
          lists.map((l) => (
            <Link
              key={l.id}
              href={`/storeman/list/${l.id}`}
              style={{
                padding: "11px 12px",
                background: "var(--surface)",
                border: "1px solid " + (l.urgent ? "var(--hivis-line)" : "var(--line)"),
                borderRadius: 10,
                position: "relative",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              {l.urgent && (
                <span
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: 3,
                    background: "var(--hivis)",
                    borderRadius: "10px 0 0 10px",
                  }}
                />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                {l.code && <Chip>{l.code}</Chip>}
                <span
                  style={{
                    fontSize: 11,
                    color: l.urgent ? "var(--hivis-ink)" : "var(--ink-4)",
                    fontWeight: 500,
                  }}
                >
                  {l.dueLabel}
                </span>
                {l.fresh && <Pill variant="info">new</Pill>}
                <span
                  style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--ink-3)" }}
                  className="mono tnum"
                >
                  {l.issued}/{l.total}
                </span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25, marginBottom: 2 }}>
                {l.name}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--ink-4)", marginBottom: 8 }}>{l.client ?? "—"}</div>
              <ProgressBar
                value={l.issued}
                max={l.total || 1}
                tone={l.issued >= l.total ? "success" : l.urgent ? "warn" : ""}
              />
            </Link>
          ))
        )}
      </div>
    </>
  );
}
