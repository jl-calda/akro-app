// Screen 12 — Admin Dashboard home
//
// Grid of attention cards. No notification bell — this IS the inbox.

function AdminHome({ density = 'default', collapsed = false, onToggleCollapse }) {
  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="dashboard" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Dashboard']} search="Search projects, materials, models, sub-assemblies, suppliers…" />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Tuesday · May 16 · Vertex Safety Solutions</div>
              <div className="pl-page-title">Good morning, Reuben</div>
            </div>
            <div className="pl-page-actions">
              <Btn ico="upload" variant="ghost">Bulk import</Btn>
              <Btn ico="plus">Quick add</Btn>
              <Btn variant="primary" ico="folder">New project</Btn>
            </div>
          </div>
        </div>

        {/* Top stats strip */}
        <div className="pl-meta" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          <Stat label="Awaiting approval" value="2" sub="3 lines flagged" link />
          <Stat label="Approved this week" value="11" sub="+2 vs last" />
          <Stat label="Active projects" value="24" sub="$284k committed" />
          <Stat label="Low-stock SKUs" value="14" sub="4 critical" warn />
          <Stat label="Expiring certs · 30d" value="7" sub="2 in 7 days" warn />
          <Stat label="Stock value" value="$1.42M" sub="across 4 locations" />
        </div>

        <div className="pl-scroll" style={{ padding: '18px 24px 24px' }}>
          {/* Card grid — 3 columns × 2 rows of attention cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>

            {/* CARD 1 — MTOs awaiting approval */}
            <AdminCard title="MTOs awaiting approval" count={2} tone="primary" ico="check" sub="Submitted by Project Managers · sorted by submission time">
              {[
                { code: 'PRJ-2026-043', name: 'Westgate Tower Façade BMU', client: 'Westgate REIT',  pm: 'A. Chen',     lines: 28, total: 18420, age: '2h ago',  flags: ['1 cert exp'] },
                { code: 'PRJ-2026-042', name: 'Pier 39 Maintenance Access', client: 'Port of SF',     pm: 'R. Mathers',  lines: 24, total: 14380, age: 'Yesterday', flags: ['2 substitutions'] },
              ].map(p => (
                <ListRow key={p.code}>
                  <Chip>{p.code}</Chip>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{p.client} · {p.pm} · {p.age}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono tnum" style={{ fontSize: 12.5, fontWeight: 600 }}>${p.total.toLocaleString()}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>{p.lines} lines</div>
                  </div>
                  <Btn size="sm" variant="primary">Review</Btn>
                </ListRow>
              ))}
            </AdminCard>

            {/* CARD 2 — Projects nearing 'needed by' with incomplete MTO */}
            <AdminCard title="Nearing due · incomplete MTO" count={3} tone="warn" ico="warn" sub="Issue rate vs days remaining">
              {[
                { code: 'PRJ-2026-038', name: 'Aurora Bridge — North Span', due: 'Today',  daysLeft: 0, pct: 64 },
                { code: 'PRJ-2026-044', name: 'Solis Logistics — Rooftop',  due: 'Jun 04', daysLeft: 4, pct: 0 },
                { code: 'PRJ-2026-040', name: 'Cypress Wind Farm — T-14',  due: 'Jul 12', daysLeft: 12, pct: 61 },
              ].map(p => (
                <ListRow key={p.code}>
                  <Chip>{p.code}</Chip>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>
                      Due <span style={{ color: p.daysLeft === 0 ? 'var(--hivis-ink)' : 'var(--ink-2)', fontWeight: 500 }} className="mono">{p.due}</span>
                      {p.daysLeft === 0 ? ' · TODAY' : ` · ${p.daysLeft}d left`}
                    </div>
                  </div>
                  <div style={{ width: 80 }}>
                    <ProgressBar value={p.pct} max={100} tone={p.daysLeft === 0 && p.pct < 100 ? 'warn' : ''} />
                    <div className="mono tnum" style={{ fontSize: 10, color: 'var(--ink-4)', textAlign: 'right', marginTop: 2 }}>{p.pct}% issued</div>
                  </div>
                </ListRow>
              ))}
            </AdminCard>

            {/* CARD 3 — Modified after approval */}
            <AdminCard title="Modified after approval" count={2} tone="hivis" ico="warn" sub="Need re-review · soft-locked after PM edits">
              {[
                { code: 'PRJ-2026-038', name: 'Aurora Bridge — North Span', changes: '+12.6 m cable · +20 bolts', who: 'A. Chen',    when: '2h ago' },
                { code: 'PRJ-2026-040', name: 'Cypress Wind Farm — T-14',  changes: 'Substitute LL-CBL-10 → 8', who: 'D. Khoury',  when: 'Yesterday' },
              ].map(p => (
                <ListRow key={p.code}>
                  <Chip>{p.code}</Chip>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--hivis-ink)' }}>{p.changes}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>{p.who} · {p.when}</div>
                  </div>
                  <Btn size="sm">Review diff</Btn>
                </ListRow>
              ))}
            </AdminCard>

            {/* CARD 4 — Low-stock */}
            <AdminCard title="Low-stock materials" count={14} tone="warn" ico="package" sub="Below reorder level · 4 critical">
              {[
                { th: '🔩', sku: 'BLT-BMET-14', name: 'Bi-metal Self-Drill, 14 mm', stock: 0,  reorder: 200, locs: 0, crit: true },
                { th: '🧷', sku: 'TRM-END-10-K', name: 'End Termination Kit, 10 mm', stock: 4,  reorder: 12,  locs: 1, crit: true },
                { th: '🔧', sku: 'INT-ANC-12',   name: 'Intermediate Anchor, 12 mm', stock: 14, reorder: 30,  locs: 2 },
                { th: '🛡️', sku: 'GR-RAIL-2M-G', name: 'Top Rail, 2.0 m, galv',       stock: 84, reorder: 120, locs: 2 },
              ].map(m => (
                <ListRow key={m.sku}>
                  <div className="pl-thumb" style={{ width: 26, height: 26, fontSize: 14 }}>{m.th}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                    <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>{m.sku} · {m.locs} loc</div>
                  </div>
                  <div style={{ textAlign: 'right', width: 90 }}>
                    <div className="mono tnum" style={{ fontSize: 13, fontWeight: 600, color: m.crit ? 'var(--danger)' : 'var(--hivis-ink)' }}>{m.stock}</div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--ink-5)' }}>reorder ≥ {m.reorder}</div>
                  </div>
                  {m.crit && <HiVis>critical</HiVis>}
                </ListRow>
              ))}
            </AdminCard>

            {/* CARD 5 — Expiring certifications */}
            <AdminCard title="Expiring certifications" count={7} tone="hivis" ico="cert" sub="Within 30 days · models flagged on save">
              {[
                { cert: 'OSHA 1926.502 attest',      model: 'Cable Lifeline 8mm SS316',  exp: '26 days', tone: 'warn' },
                { cert: 'EN 795:2012 Type B',         model: 'Type-A Swivel Anchor SS',   exp: '12 days', tone: 'crit' },
                { cert: 'AS/NZS 1891.4 issuance',     model: 'Modular Guardrail 1.1m',     exp: '4 days',  tone: 'crit' },
              ].map((c, i) => (
                <ListRow key={i}>
                  <I name="cert" size={14} style={{ color: c.tone === 'crit' ? 'var(--danger)' : 'var(--hivis-ink)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.cert}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{c.model}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 11.5, color: c.tone === 'crit' ? 'var(--danger)' : 'var(--hivis-ink)', fontWeight: 600 }}>{c.exp}</span>
                  <I name="upload" size={13} style={{ color: 'var(--ink-5)' }} />
                </ListRow>
              ))}
            </AdminCard>

            {/* CARD 6 — Recent stock movements */}
            <AdminCard title="Recent stock movements" count="last 24h" tone="ink" ico="history" sub="Filter by location · type · material" filter>
              {[
                { ico: 'arrowDown', tone: 'success', label: 'Receipt · 200 m CBL-SS-08-100',  meta: 'SF Yard A · R. Mathers · 09:14' },
                { ico: 'arrowUp',   tone: 'primary', label: 'Issuance · 250 m → Aurora Bridge', meta: 'SF Yard A · R. Mathers · 09:18' },
                { ico: 'fork',      tone: 'ink',     label: 'Transfer · 12 INT-ANC-12 → Oakland', meta: 'A. Chen · 10:02' },
                { ico: 'refresh',   tone: 'warn',    label: 'Return · 8 m GR-RAIL → Pier 39',   meta: 'D. Khoury · 11:24' },
                { ico: 'settings',  tone: 'ink',     label: 'Adjustment · −4 m CBL-SS-08-100',  meta: 'Annual count · admin · 14:05' },
              ].map((m, i) => (
                <ListRow key={i} compact>
                  <span style={{ width: 22, height: 22, borderRadius: 11, background: m.tone === 'success' ? 'var(--success-soft)' : m.tone === 'primary' ? 'var(--primary-soft)' : m.tone === 'warn' ? 'var(--hivis-soft)' : 'var(--surface-2)', display: 'grid', placeItems: 'center', color: m.tone === 'success' ? 'var(--success)' : m.tone === 'primary' ? 'var(--primary)' : m.tone === 'warn' ? 'var(--hivis-ink)' : 'var(--ink-3)' }}>
                    <I name={m.ico} size={11} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.label}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>{m.meta}</div>
                  </div>
                </ListRow>
              ))}
            </AdminCard>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────

function Stat({ label, value, sub, warn, link }) {
  return (
    <div className="pl-meta-cell" style={{ position: 'relative' }}>
      <div className="pl-meta-label">{label}</div>
      <div className="pl-meta-value mono tnum" style={{ fontSize: 22, color: warn ? 'var(--hivis-ink)' : 'var(--ink)' }}>{value}</div>
      {sub && <div style={{ fontSize: 10.5, color: 'var(--ink-5)', marginTop: 2 }}>{sub}</div>}
      {link && <I name="arrowR" size={12} style={{ position: 'absolute', top: 12, right: 12, color: 'var(--ink-5)' }} />}
    </div>
  );
}

function AdminCard({ title, count, tone = 'ink', ico, sub, filter, children }) {
  const toneStyle = {
    primary: { bg: 'var(--primary-soft)', fg: 'var(--primary)' },
    warn:    { bg: 'var(--hivis-soft)',  fg: 'var(--hivis-ink)' },
    hivis:   { bg: 'var(--hivis-soft)',  fg: 'var(--hivis-ink)' },
    ink:     { bg: 'var(--surface-2)',   fg: 'var(--ink-3)' },
  }[tone];
  return (
    <div className="pl-card">
      <div className="pl-card-head" style={{ alignItems: 'flex-start' }}>
        <div style={{ width: 30, height: 30, borderRadius: 6, background: toneStyle.bg, color: toneStyle.fg, display: 'grid', placeItems: 'center' }}>
          <I name={ico} size={14} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="pl-card-title">{title}</span>
            {typeof count === 'number' ? (
              <span className="mono tnum" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', color: toneStyle.fg }}>{count}</span>
            ) : (
              <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>{count}</span>
            )}
          </div>
          {sub && <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 1 }}>{sub}</div>}
        </div>
        {filter && <I name="filter" size={13} style={{ color: 'var(--ink-5)' }} />}
        <span className="pl-link" style={{ fontSize: 11.5 }}>View all</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function ListRow({ children, compact }) {
  return (
    <div style={{
      padding: compact ? '7px 14px' : '10px 14px',
      borderBottom: '1px solid var(--line)',
      display: 'flex', alignItems: 'center', gap: 10,
      minWidth: 0,
    }}>
      {children}
    </div>
  );
}

Object.assign(window, { AdminHome, AdminCard, ListRow });
