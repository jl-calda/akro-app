import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Chip, Pill, Seg } from "@/components/ui/primitives";
import { ProjectTabs } from "@/components/screens/project-tabs";
import { EmptyState } from "@/components/screens/empty-state";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export default async function ProjectPhotosPage({
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

  const { data: photos } = await supabase
    .from("photos")
    .select("id, storage_path, caption, photo_type, progress_percent_at_capture, uploaded_at")
    .eq("project_id", projectId)
    .eq("organization_id", ctx.organizationId)
    .is("deleted_at", null)
    .order("uploaded_at", { ascending: false });

  return (
    <AppShellWithSession crumbs={["Projects", project.name, "Photos"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          {project.code && <Chip>{project.code}</Chip>}
          <div className="pl-page-title">{project.name}</div>
          <Pill variant="info">Photos</Pill>
          <div className="pl-page-actions">
            <Seg items={["Progress", "Reference", "Daily"]} active="Progress" />
            <Btn variant="primary" ico="upload">Upload</Btn>
          </div>
        </div>
      </div>
      <ProjectTabs projectId={projectId} />

      <div className="pl-scroll" style={{ padding: 24 }}>
        {(photos ?? []).length === 0 ? (
          <EmptyState
            ico="camera"
            title="No photos yet"
            description="Site foremen upload photos from the mobile app. They flow into this archive grouped by day + task."
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {(photos ?? []).map((p) => (
              <div key={p.id} className="pl-card" style={{ padding: 0, overflow: "hidden" }}>
                <div className="pl-img-ph" style={{ aspectRatio: "4 / 3" }}>
                  photo
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontSize: 11, color: "var(--ink-4)" }}>
                    {p.photo_type} · {new Date(p.uploaded_at).toLocaleDateString()}
                  </div>
                  {p.caption && (
                    <div style={{ fontSize: 12, marginTop: 4 }}>{p.caption}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShellWithSession>
  );
}
