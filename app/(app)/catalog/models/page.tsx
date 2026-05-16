import { PageShell } from "@/components/screens/page-shell";
import { EmptyState } from "@/components/screens/empty-state";
import { requireContext } from "@/lib/auth/session";

export default async function Page() {
  await requireContext();
  return (
    <PageShell crumbs={["Catalog","Models"]} title="Models" subtitle="Buildable Models with parts lists and labour rules.">
      <EmptyState
        ico="cube"
        title="This is a placeholder for Models"
        description="This route is wired and gated by auth. The full screen ships in a later batch."
      />
    </PageShell>
  );
}
