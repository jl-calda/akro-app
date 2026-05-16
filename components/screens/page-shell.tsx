import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn } from "@/components/ui/primitives";

type Crumb = string | { label: string; href?: string };

export function PageShell({
  crumbs,
  title,
  subtitle,
  actions,
  search,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  search?: string;
  children: React.ReactNode;
}) {
  return (
    <AppShellWithSession crumbs={crumbs} search={search}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">{title}</div>
            {subtitle && <div className="pl-page-sub">{subtitle}</div>}
          </div>
          {actions && <div className="pl-page-actions">{actions}</div>}
        </div>
      </div>
      <div className="pl-scroll">{children}</div>
    </AppShellWithSession>
  );
}

export function PageDefaultActions({
  primaryLabel = "New",
  primaryIco = "plus",
}: {
  primaryLabel?: string;
  primaryIco?: string;
}) {
  return (
    <>
      <Btn ico="download" variant="ghost">
        Export
      </Btn>
      <Btn variant="primary" ico={primaryIco}>
        {primaryLabel}
      </Btn>
    </>
  );
}
