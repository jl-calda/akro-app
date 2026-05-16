import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, HiVis, Pill } from "@/components/ui/primitives";
import { ProjectTabs } from "@/components/screens/project-tabs";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { approveMto, rejectMto } from "../actions";

export default async function MtoApprovalPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const ctx = await requireContext();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, code, name, client_name")
    .eq("id", projectId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!project) notFound();

  const { data: mtoState } = await supabase
    .from("mto_states")
    .select("state, submitted_at")
    .eq("project_id", projectId)
    .maybeSingle();

  const { data: lines } = await supabase
    .from("mto_lines")
    .select("id, quantity, unit, unit_cost")
    .eq("organization_id", ctx.organizationId)
    .in(
      "system_instance_id",
      (
        await supabase
          .from("system_instances")
          .select("id")
          .eq("project_id", projectId)
      ).data?.map((i) => i.id) ?? [],
    );

  const total = (lines ?? []).reduce(
    (s, l) => s + Number(l.quantity) * Number(l.unit_cost),
    0,
  );
  const state = mtoState?.state ?? "draft";

  return (
    <AppShellWithSession crumbs={["Projects", project.name, "MTO", "Approve"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          {project.code && <Chip>{project.code}</Chip>}
          <div className="pl-page-title">{project.name}</div>
          {state === "pending_approval" ? (
            <Pill variant="info" dot>pending approval</Pill>
          ) : (
            <Pill variant={state === "approved" ? "approved" : "draft"} dot>
              {state.replace(/_/g, " ")}
            </Pill>
          )}
        </div>
      </div>
      <ProjectTabs projectId={projectId} />

      <div className="pl-scroll" style={{ padding: "24px 24px 100px" }}>
        <div className="pl-card" style={{ padding: 18, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Summary</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <Stat label="Client" value={project.client_name ?? "—"} />
            <Stat label="MTO lines" value={(lines ?? []).length.toString()} />
            <Stat label="Total value" value={`$${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
            <Stat
              label="Submitted"
              value={mtoState?.submitted_at ? new Date(mtoState.submitted_at).toLocaleString() : "—"}
            />
          </div>
        </div>

        {state !== "pending_approval" && (
          <div
            style={{
              padding: 14,
              background: "var(--surface-2)",
              borderRadius: 6,
              fontSize: 12,
              color: "var(--ink-3)",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <HiVis>info</HiVis>
            <span>
              This MTO is in <span className="mono">{state}</span> state. Approval / rejection is only available when the
              MTO is pending approval.
            </span>
          </div>
        )}
      </div>

      {state === "pending_approval" && (
        <div
          style={{
            position: "sticky",
            bottom: 0,
            background: "var(--surface)",
            borderTop: "1px solid var(--line-2)",
            padding: "12px 24px",
            display: "flex",
            gap: 8,
            alignItems: "center",
            boxShadow: "0 -8px 24px rgba(15,23,42,0.05)",
          }}
        >
          <div style={{ fontSize: 12, color: "var(--ink-4)", marginRight: "auto" }}>
            Approving makes the MTO visible to the storeman immediately.
          </div>
          <form action={rejectMto} style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input type="hidden" name="projectId" value={projectId} />
            <input
              name="reason"
              placeholder="Rejection reason (optional)"
              className="pl-input"
              style={{ width: 220, height: 30 }}
            />
            <Btn variant="danger" type="submit">Reject</Btn>
          </form>
          <form action={approveMto}>
            <input type="hidden" name="projectId" value={projectId} />
            <Btn variant="primary" ico="check" type="submit">
              Approve MTO
            </Btn>
          </form>
        </div>
      )}
    </AppShellWithSession>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          color: "var(--ink-4)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontWeight: 500,
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
    </div>
  );
}
