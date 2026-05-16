import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Chip } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { ProjectTabs } from "@/components/screens/project-tabs";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

const EVENT_ICON: Record<string, { ico: string; tone: string }> = {
  "tenant.created": { ico: "folder", tone: "primary" },
  "project.created": { ico: "folder", tone: "primary" },
  "material.created": { ico: "package", tone: "ink" },
  "mto.submitted": { ico: "upload", tone: "primary" },
  "mto.approved": { ico: "check", tone: "success" },
  "mto.rejected": { ico: "x", tone: "danger" },
  "stock.issuance": { ico: "arrowUp", tone: "primary" },
  "stock.receipt": { ico: "arrowDown", tone: "success" },
  "photo.uploaded": { ico: "camera", tone: "ink" },
};

const TONE_STYLE: Record<string, { bg: string; fg: string }> = {
  primary: { bg: "var(--primary-soft)", fg: "var(--primary)" },
  success: { bg: "var(--success-soft)", fg: "var(--success)" },
  warn: { bg: "var(--hivis-soft)", fg: "var(--hivis-ink)" },
  danger: { bg: "var(--danger-soft)", fg: "var(--danger)" },
  ink: { bg: "var(--surface-2)", fg: "var(--ink-3)" },
};

export default async function ProjectActivityPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, code, name")
    .eq("id", projectId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!project) notFound();

  const { data: events } = await supabase
    .from("activity_events")
    .select("id, event_type, payload, occurred_at, user_id")
    .eq("organization_id", ctx.organizationId)
    .eq("project_id", projectId)
    .order("occurred_at", { ascending: false })
    .limit(100);

  return (
    <AppShellWithSession crumbs={["Projects", project.name, "Activity"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          {project.code && <Chip>{project.code}</Chip>}
          <div className="pl-page-title">{project.name}</div>
        </div>
      </div>
      <ProjectTabs projectId={projectId} />
      <div className="pl-scroll" style={{ padding: 24 }}>
        <div style={{ position: "relative", paddingLeft: 24 }}>
          <div
            style={{
              position: "absolute",
              left: 11,
              top: 6,
              bottom: 6,
              width: 1,
              background: "var(--line)",
            }}
          />
          {(events ?? []).length === 0 ? (
            <div style={{ color: "var(--ink-4)", fontSize: 13, paddingLeft: 4 }}>
              No activity yet.
            </div>
          ) : (
            (events ?? []).map((e) => {
              const meta = EVENT_ICON[e.event_type] ?? { ico: "dots", tone: "ink" };
              const tone = TONE_STYLE[meta.tone];
              return (
                <div
                  key={e.id}
                  style={{
                    position: "relative",
                    paddingBottom: 14,
                    paddingLeft: 4,
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: -23,
                      top: 2,
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      background: tone.bg,
                      color: tone.fg,
                      display: "grid",
                      placeItems: "center",
                      border: "2px solid var(--bg)",
                    }}
                  >
                    <Icon name={meta.ico} size={11} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{e.event_type.replace(/\./g, " · ")}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-5)" }}>
                      {new Date(e.occurred_at).toLocaleString()}
                    </div>
                    {e.payload && Object.keys(e.payload).length > 0 && (
                      <div
                        className="mono"
                        style={{
                          marginTop: 4,
                          fontSize: 11,
                          color: "var(--ink-4)",
                          background: "var(--surface-2)",
                          padding: "4px 6px",
                          borderRadius: 4,
                          border: "1px solid var(--line)",
                          maxWidth: 600,
                          overflow: "auto",
                        }}
                      >
                        {JSON.stringify(e.payload)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppShellWithSession>
  );
}
