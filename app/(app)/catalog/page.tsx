import Link from "next/link";
import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";

type Entity = {
  key: string;
  title: string;
  ico: string;
  href: string;
  description: string;
  count: number;
};

export default async function CatalogHubPage() {
  const ctx = await requireContext();
  const supabase = await createClient();

  const tables = [
    "systems",
    "models",
    "sub_assemblies",
    "materials",
    "material_categories",
    "suppliers",
    "substrates",
    "phases",
  ] as const;

  const counts: Record<string, number> = {};
  await Promise.all(
    tables.map(async (t) => {
      const { count } = await supabase
        .from(t)
        .select("*", { count: "exact", head: true })
        .eq("organization_id", ctx.organizationId);
      counts[t] = count ?? 0;
    }),
  );

  const entities: Entity[] = [
    { key: "systems", title: "Systems", ico: "diamond", href: "/catalog/systems", description: "Safety systems with rules + dimension contracts.", count: counts.systems },
    { key: "models", title: "Models", ico: "cube", href: "/catalog/models", description: "Buildable Models with parts lists and labour rules.", count: counts.models },
    { key: "sub_assemblies", title: "Sub-assemblies", ico: "fork", href: "/catalog/sub-assemblies", description: "Parametric sub-assemblies referenced from Models.", count: counts.sub_assemblies },
    { key: "materials", title: "Materials", ico: "package", href: "/catalog/materials", description: "SKU catalog. Versioned with parameter values.", count: counts.materials },
    { key: "material_categories", title: "Categories", ico: "list", href: "/catalog/categories", description: "Material categories and their parameter schemas.", count: counts.material_categories },
    { key: "suppliers", title: "Suppliers", ico: "store", href: "/catalog/suppliers", description: "Suppliers and contact details.", count: counts.suppliers },
    { key: "substrates", title: "Substrates", ico: "grid", href: "/catalog/substrates", description: "Substrates such as steel I-beam, concrete deck.", count: counts.substrates },
    { key: "phases", title: "Labour phases", ico: "user", href: "/settings/labour", description: "Phases with default rate and crew size.", count: counts.phases },
  ];

  return (
    <AppShellWithSession crumbs={["Catalog"]} search="Search systems, models, materials, suppliers…">
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Catalog</div>
            <div className="pl-page-sub">All re-usable entities for your tenant.</div>
          </div>
          <div className="pl-page-actions">
            <Btn ico="upload" variant="ghost">Bulk import</Btn>
            <Btn variant="primary" ico="plus">Quick add</Btn>
          </div>
        </div>
      </div>

      <div className="pl-scroll" style={{ padding: "18px 24px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {entities.map((e) => (
            <Link
              key={e.key}
              href={e.href}
              className="pl-card"
              style={{ padding: 16, textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: 8 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: "var(--primary-soft)",
                    color: "var(--primary)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon name={e.ico} size={16} />
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.01em" }}>{e.title}</div>
                </div>
                <span
                  className="mono tnum"
                  style={{ fontSize: 18, fontWeight: 600, color: "var(--ink-2)" }}
                >
                  {e.count}
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--ink-4)", lineHeight: 1.45 }}>{e.description}</div>
            </Link>
          ))}
        </div>
      </div>
    </AppShellWithSession>
  );
}
