"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function completeOnboarding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const orgName = String(formData.get("orgName") ?? "").trim();
  const currency = String(formData.get("currency") ?? "USD");

  if (!orgName) {
    redirect("/onboarding?error=Please+enter+your+company+name");
  }

  // SECURITY DEFINER RPC: creates organizations + memberships (tenant_owner) +
  // tenant_settings atomically, bypassing the chicken-and-egg RLS where the
  // user can't write into the org until they have a membership and vice versa.
  const { data: orgId, error: rpcError } = await supabase.rpc("bootstrap_tenant", {
    _name: orgName,
    _currency: currency,
  });

  if (rpcError || !orgId) {
    redirect(
      `/onboarding?error=${encodeURIComponent(
        rpcError?.message ?? "Could not create organization",
      )}`,
    );
    return;
  }

  // Seed defaults (phases, substrates, categories, location, activity event).
  // Also a SECURITY DEFINER RPC so we don't depend on user_has_role() resolving
  // the new membership in the same request.
  const { error: seedError } = await supabase.rpc("seed_tenant_defaults", {
    _org_id: orgId as unknown as string,
  });
  if (seedError) {
    console.error("Seed defaults failed:", seedError.message);
  }

  redirect("/dashboard");
}
