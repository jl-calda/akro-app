// Admin · Settings Hub (index page)

function SettingsHub({ density = 'default', collapsed = false, onToggleCollapse }) {
  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="settings" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Settings']} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <div className="pl-page-title">Settings</div>
            <Pill variant="info">tenant-wide</Pill>
            <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>Vertex Safety Solutions · plan Pro · 14 seats</span>
            <div className="pl-page-actions">
              <Btn ico="history" variant="ghost">Audit log</Btn>
              <Btn ico="user">Manage users</Btn>
            </div>
          </div>
        </div>

        <div className="pl-scroll" style={{ padding: '18px 24px 24px' }}>
          {/* Tenant profile mini-strip */}
          <div className="pl-card" style={{ marginBottom: 18 }}>
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 52, height: 52, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 8, display: 'grid', placeItems: 'center' }}>
                <div className="pl-img-ph" style={{ width: 36, height: 36, fontSize: 9, padding: 0 }}>logo</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Vertex Safety Solutions</div>
                <div style={{ fontSize: 12, color: 'var(--ink-4)' }}>Tenant · USD · 4 locations · 14 active users</div>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 11.5, color: 'var(--ink-4)' }}>
                <div><div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Plan</div><div style={{ fontWeight: 500, color: 'var(--ink-2)' }}>Pro</div></div>
                <div><div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Renews</div><div style={{ fontWeight: 500, color: 'var(--ink-2)' }} className="mono">Sep 30</div></div>
                <div><div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Seat usage</div><div style={{ fontWeight: 500, color: 'var(--ink-2)' }} className="mono tnum">14 / 25</div></div>
              </div>
            </div>
          </div>

          {/* Sections grouped */}
          <SettingsSection label="Operations">
            <SettingsCard ico="cube" title="Tenant profile" desc="Name, logo, currency, address, contact." />
            <SettingsCard ico="store" title="Stock locations" desc="Warehouses, satellites, mobile vans · primary location per material." count={4} />
            <SettingsCard ico="list" title="Substrates" desc="Tenant's controlled substrate list · referenced by rules." count={11} />
            <SettingsCard ico="package" title="Wastage defaults" desc="Global default · per-category overrides · project can override." />
          </SettingsSection>

          <SettingsSection label="Catalog">
            <SettingsCard ico="settings" title="Material code patterns" desc="Auto-generation rules · [CAT]-[MAT]-[Ø]-[LEN]." />
            <SettingsCard ico="grid" title="Category parameters" desc="Per-category fields available to rules." count={23} />
            <SettingsCard ico="cert" title="Cert templates" desc="Body, expiry rules, attachment formats." count={9} />
          </SettingsSection>

          <SettingsSection label="Costing">
            <SettingsCard ico="history" title="Labour phases & rates" desc="Phases · default rates · crew sizes · round-up." count={4} active />
            <SettingsCard ico="check" title="Approval rules" desc="Margin floors · qty override thresholds · auto-flag policies." />
            <SettingsCard ico="package" title="Pricing defaults" desc="Default margin, contingency, tax rates · per-project overridable." />
          </SettingsSection>

          <SettingsSection label="Documents & branding">
            <SettingsCard ico="download" title="PDF branding" desc="Header, footer, fonts, accent color · client-facing exports." />
            <SettingsCard ico="link" title="Public sharing" desc="Read-only share links · cert PDF visibility." />
          </SettingsSection>

          <SettingsSection label="Account">
            <SettingsCard ico="user" title="Users &amp; roles" desc="14 users · invite, deactivate, role assignment." count={14} />
            <SettingsCard ico="cert" title="Single sign-on" desc="Okta / Google Workspace · enforce 2FA." />
            <SettingsCard ico="history" title="Audit log" desc="Stock transactions + admin actions · 90-day retention." />
            <SettingsCard ico="warn" title="Billing &amp; subscription" desc="Plan, invoices, payment method." owner sub="Tenant Owner only" />
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ label, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</span>
        <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>{children}</div>
    </div>
  );
}

function SettingsCard({ ico, title, desc, count, active, owner, sub }) {
  return (
    <div className="pl-card" style={{ padding: 12, cursor: 'pointer', borderColor: active ? 'var(--primary-line)' : owner ? 'var(--hivis-line)' : 'var(--line)', background: active ? 'var(--primary-soft)' : owner ? 'var(--hivis-soft)' : 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <I name={ico} size={14} style={{ color: active ? 'var(--primary)' : owner ? 'var(--hivis-ink)' : 'var(--ink-3)' }} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
        {typeof count === 'number' && <Chip style={{ marginLeft: 'auto' }}>{count}</Chip>}
        {owner && <Pill variant="modified">owner</Pill>}
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--ink-4)', lineHeight: 1.4 }}>{desc}</div>
      {sub && <div style={{ marginTop: 4, fontSize: 10.5, color: 'var(--hivis-ink)', fontWeight: 500 }}>{sub}</div>}
    </div>
  );
}

window.SettingsHub = SettingsHub;
