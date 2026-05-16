import { notFound } from "next/navigation";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { CutPlanUi } from "@/components/screens/cut-plan/cut-plan-ui";

export default async function CutPlanPage({
  params,
}: {
  params: Promise<{ modelId: string }>;
}) {
  const { modelId } = await params;
  const ctx = await requireContext();
  const supabase = await createClient();
  const { data: model } = await supabase
    .from("models")
    .select("id, name, code")
    .eq("id", modelId)
    .eq("organization_id", ctx.organizationId)
    .maybeSingle();
  if (!model) notFound();

  return (
    <AppShellWithSession crumbs={["Catalog", "Models", model.name, "Cut plan"]}>
      <CutPlanUi modelName={model.name} />
    </AppShellWithSession>
  );
}
