"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

export async function updateQuotePricing(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const margin_pct = Number(formData.get("margin_pct") ?? 0);
  const contingency_pct = Number(formData.get("contingency_pct") ?? 0);
  const tax_pct = Number(formData.get("tax_pct") ?? 0);
  const total_cost = Number(formData.get("total_cost") ?? 0);

  await supabase
    .from("quotes")
    .update({ margin_pct, contingency_pct, tax_pct, total_cost })
    .eq("id", id)
    .eq("organization_id", ctx.organizationId);
  revalidatePath(`/quotes/${id}`);
}

export async function transitionQuote(formData: FormData) {
  const ctx = await requireContext();
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));

  const update: { status: string; awarded_at?: string } = { status };
  if (status === "awarded") update.awarded_at = new Date().toISOString();
  await supabase
    .from("quotes")
    .update(update)
    .eq("id", id)
    .eq("organization_id", ctx.organizationId);

  await supabase.from("activity_events").insert({
    organization_id: ctx.organizationId,
    user_id: ctx.user.id,
    event_type: `quote.${status}`,
    payload: { quote_id: id },
  });

  if (status === "awarded") {
    // Snapshot system_instances from this quote into the working set of the project.
    const { data: q } = await supabase.from("quotes").select("project_id").eq("id", id).single();
    if (q) {
      const { data: instances } = await supabase
        .from("system_instances")
        .select(
          "system_version_id, shape_version_id, model_version_id, substrate_id, dimensions, variant_selections, user_input_parameters, name",
        )
        .eq("quote_id", id);
      if (instances && instances.length > 0) {
        await supabase.from("system_instances").insert(
          instances.map((i) => ({
            organization_id: ctx.organizationId,
            project_id: q.project_id,
            quote_id: null,
            system_version_id: i.system_version_id,
            shape_version_id: i.shape_version_id,
            model_version_id: i.model_version_id,
            substrate_id: i.substrate_id,
            dimensions: i.dimensions,
            variant_selections: i.variant_selections,
            user_input_parameters: i.user_input_parameters,
            name: i.name,
          })),
        );
      }
    }
  }

  revalidatePath(`/quotes/${id}`);
  revalidatePath("/quotes");
  redirect(`/quotes/${id}`);
}
