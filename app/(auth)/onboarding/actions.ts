"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_PHASES = [
  { key: "fabrication", label: "Fabrication", colour: "#A16B3B", display_order: 1 },
  { key: "installation", label: "Installation", colour: "#1E40AF", display_order: 2 },
  { key: "commissioning", label: "Commissioning", colour: "#0F766E", display_order: 3 },
  { key: "inspection", label: "Inspection", colour: "#6B5BB3", display_order: 4 },
];

const DEFAULT_SUBSTRATES = [
  "Steel I-beam",
  "Concrete deck",
  "Steel column",
  "Metal deck roof",
  "Timber rafter",
];

const DEFAULT_CATEGORIES = [
  "Cable",
  "Anchor",
  "Stanchion",
  "Fastener",
  "Rail",
  "Post",
  "Termination",
  "Adhesive",
  "PPE",
];

const DEFAULT_LOCATIONS = ["Main Yard"];

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

  // Create organization (RLS policy allows authenticated users to insert).
  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name: orgName,
      currency,
      slug: orgName.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40),
    })
    .select("id")
    .single();
  if (orgError || !org) {
    redirect(
      `/onboarding?error=${encodeURIComponent(
        orgError?.message ?? "Could not create organization",
      )}`,
    );
    return;
  }

  // Create the first membership: current user → tenant_owner
  await supabase.from("memberships").insert({
    user_id: user.id,
    organization_id: org.id,
    role: "tenant_owner",
  });

  // Seed defaults: tenant_settings + phases + substrates + categories + locations
  await supabase.from("tenant_settings").insert({ organization_id: org.id });

  await supabase.from("phases").insert(
    DEFAULT_PHASES.map((p) => ({
      organization_id: org.id,
      default_rate: 0,
      default_crew_size: 1,
      ...p,
    })),
  );

  await supabase
    .from("substrates")
    .insert(DEFAULT_SUBSTRATES.map((name) => ({ organization_id: org.id, name })));

  await supabase
    .from("material_categories")
    .insert(DEFAULT_CATEGORIES.map((name) => ({ organization_id: org.id, name })));

  await supabase
    .from("warehouse_locations")
    .insert(DEFAULT_LOCATIONS.map((name) => ({ organization_id: org.id, name })));

  // Activity event
  await supabase.from("activity_events").insert({
    organization_id: org.id,
    user_id: user.id,
    event_type: "tenant.created",
    payload: { name: orgName },
  });

  redirect("/dashboard");
}
