import { PageShell, PageDefaultActions } from "@/components/screens/page-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function ProjectsPage() {
  await requireContext();
  return (
    <PageShell
      crumbs={["Projects"]}
      title="Projects"
      subtitle="All projects across your workspace."
      actions={<PageDefaultActions primaryLabel="New project" primaryIco="folder" />}
    >
      <EmptyState
        ico="folder"
        title="No projects yet"
        description="Create your first project to begin tracking quotes, MTOs, stock and schedule."
        actionLabel="New project"
        actionHref="/projects/new"
      />
    </PageShell>
  );
}
