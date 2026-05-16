// Admin · Catalog Hub (index of all catalog entities)

function CatalogHub({ density = 'default', collapsed = false, onToggleCollapse }) {
  const cards = [
    { key: 'systems',   ico: 'cube',     title: 'Systems',       count: 7,   sub: 'Lifeline · Guardrail · …',          edited: 'May 12 · A. Chen',     locked: false },
    { key: 'models',    ico: 'package',  title: 'Models',         count: 32,  sub: 'Parametric · versioned',             edited: 'Today · R. Mathers',   locked: false },
    { key: 'subs',      ico: 'fork',     title: 'Sub-assemblies', count: 64,  sub: 'Reusable parametric units',          edited: 'Yesterday · R. Mathers' },
    { key: 'materials', ico: 'package',  title: 'Materials',      count: 847, sub: 'Leaf SKUs · cuttable + sheet',       edited: '2h ago · D. Khoury' },
    { key: 'cats',      ico: 'grid',     title: 'Categories',     count: 23,  sub: 'Define category parameters',         edited: 'May 09 · A. Chen' },
    { key: 'suppliers', ico: 'store',    title: 'Suppliers',      count: 14,  sub: 'One per material',                    edited: 'May 13 · D. Khoury' },
    { key: 'substrate', ico: 'list',     title: 'Substrates',     count: 11,  sub: 'Steel · Concrete · Timber · …',      edited: 'May 02 · R. Mathers' },
    { key: 'phases',    ico: 'history',  title: 'Phases',         count: 4,   sub: 'Labour · rates configured here',      edited: 'Apr 28 · R. Mathers' },
  ];

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="systems" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Catalog']} search="Search across all catalog entities…" />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <div className="pl-page-title">Catalog</div>
            <Pill variant="info">8 entity types</Pill>
            <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>Everything that flows into MTOs</span>
            <div className="pl-page-actions">
              <Btn ico="upload">Bulk import</Btn>
              <Btn ico="download" variant="ghost">Export catalog</Btn>
              <Btn variant="primary" ico="plus" suffix="chev">New…</Btn>
            </div>
          </div>
        </div>

        <div className="pl-scroll" style={{ padding: '18px 24px 24px' }}>
          {/* Recently edited */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Recently edited</span>
            <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 22 }}>
            {[
              { ico: 'cube',    type: 'Model',         name: 'Cable Lifeline 8mm SS316', v: 'v3', who: 'R. Mathers', when: '2h ago' },
              { ico: 'package', type: 'Material',      name: 'M12×80 Bolt, SS316',       v: 'v1', who: 'D. Khoury', when: 'Today' },
              { ico: 'fork',    type: 'Sub-assembly',  name: 'End Termination Kit',      v: 'v2', who: 'R. Mathers', when: 'Yesterday' },
              { ico: 'grid',    type: 'Category',      name: 'Fastener · added length_mm', v: '—', who: 'A. Chen', when: 'May 13' },
            ].map((r, i) => (
              <div key={i} className="pl-card" style={{ padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <I name={r.ico} size={13} style={{ color: 'var(--ink-3)' }} />
                  <span style={{ fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{r.type}</span>
                  {r.v !== '—' && <Chip>{r.v}</Chip>}
                  <span style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--ink-5)' }}>{r.when}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>{r.who}</div>
              </div>
            ))}
          </div>

          {/* Entity grid */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Entities</span>
            <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            <span style={{ fontSize: 11, color: 'var(--ink-5)' }}>Bulk import: <span className="mono" style={{ color: 'var(--ink-3)' }}>Materials · Suppliers · Substrates · Categories</span> · others v1.5</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {cards.map(c => (
              <div key={c.key} className="pl-card" style={{ padding: 16, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }}>
                    <I name={c.ico} size={16} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{c.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{c.sub}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                  <span className="mono tnum" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>{c.count}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-5)' }}>records</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--line)', paddingTop: 10, marginTop: 4 }}>
                  <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>edited {c.edited}</div>
                  <Btn size="sm" ico="plus" variant="ghost">New</Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

window.CatalogHub = CatalogHub;
