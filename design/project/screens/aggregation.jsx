// Screen 6 — Multi-project aggregation / Combined MTO

function Aggregation({ density = 'default', collapsed = false, onToggleCollapse }) {
  const projects = [
    { code: 'PRJ-2026-038', name: 'Aurora Bridge — North Span', client: 'Caltrans D4',          lines: 44, sum: 38420 },
    { code: 'PRJ-2026-041', name: 'Bayport Refinery Catwalks',  client: 'Phillips 66',          lines: 31, sum: 24180 },
    { code: 'PRJ-2026-044', name: 'Solis Logistics — Rooftop',  client: 'Solis Logistics',      lines: 18, sum: 9210  },
  ];

  const materials = [
    {
      sup: 'Helmsmiths',
      total: 12 * 1380.4,
      poRef: 'PO-DRAFT-0291',
      rows: [
        { th: '🪢', sku: 'CBL-SS-08-100', name: 'Cable, 7×19 SS316, ⌀8 mm', unit: 'm', cost: 14.20, breakdown: [{ p: '038', q: 260 }, { p: '041', q: 180 }, { p: '044', q: 0 }] },
        { th: '⚓', sku: 'APT-A-SWV-SS', name: 'Type-A Anchor, swivel SS316', unit: 'pcs', cost: 184.00, breakdown: [{ p: '038', q: 6 }, { p: '041', q: 4 }, { p: '044', q: 2 }] },
        { th: '🔧', sku: 'INT-ANC-12', name: 'Intermediate Anchor, 12mm', unit: 'pcs', cost: 38.50, breakdown: [{ p: '038', q: 31 }, { p: '041', q: 18 }, { p: '044', q: 0 }] },
        { th: '🧷', sku: 'TRM-END-08-K', name: 'End Termination Kit, swaged', unit: 'kit', cost: 142.00, breakdown: [{ p: '038', q: 6 }, { p: '041', q: 4 }, { p: '044', q: 0 }] },
        { th: '⛓️', sku: 'SHK-ABS-22', name: 'Shock Absorber, in-line', unit: 'pcs', cost: 96.50, breakdown: [{ p: '038', q: 3 }, { p: '041', q: 2 }, { p: '044', q: 1 }] },
      ],
    },
    {
      sup: 'AluForm',
      total: 9 * 482,
      poRef: 'PO-DRAFT-0292',
      rows: [
        { th: '📐', sku: 'STN-AL-450', name: 'Stanchion, aluminium, 450 mm', unit: 'pcs', cost: 64.00, breakdown: [{ p: '038', q: 31 }, { p: '041', q: 22 }, { p: '044', q: 0 }], packed: { from: 53, to: 60, note: '3 pallets ×20' } },
        { th: '🛡️', sku: 'GR-POST-1100', name: 'Guardrail Post, 1100 mm', unit: 'pcs', cost: 28.00, breakdown: [{ p: '038', q: 94 }, { p: '041', q: 42 }, { p: '044', q: 28 }], packed: { from: 164, to: 168, note: '14 pallets ×12' } },
        { th: '🛡️', sku: 'GR-RAIL-2M-G', name: 'Top Rail, 2.0 m, galv', unit: 'pcs', cost: 22.50, breakdown: [{ p: '038', q: 93 }, { p: '041', q: 42 }, { p: '044', q: 28 }], packed: { from: 163, to: 180, note: '9 bundles ×20' } },
      ],
    },
    {
      sup: 'FastWorks',
      total: 6 * 264,
      poRef: 'PO-DRAFT-0293',
      rows: [
        { th: '🔩', sku: 'BLT-M12-80-S', name: 'M12×80 Bolt, SS316', unit: 'pcs', cost: 1.85, breakdown: [{ p: '038', q: 124 }, { p: '041', q: 86 }, { p: '044', q: 48 }], packed: { from: 258, to: 300, note: '6 bags ×50' } },
        { th: '🧪', sku: 'EPX-CHEM-300', name: 'Chemical Anchor Resin, 300ml', unit: 'cart', cost: 18.40, breakdown: [{ p: '038', q: 4 }, { p: '041', q: 2 }, { p: '044', q: 2 }] },
      ],
    },
  ];

  const savings = 18;

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="aggregate" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Combined MTO', '3 projects']} />
      <div className="pl-main" style={{ flexDirection: 'row' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div className="pl-page-head">
            <div className="pl-page-title-row">
              <div className="pl-page-title">Combined MTO</div>
              <Pill variant="info">3 projects</Pill>
              <Pill variant="approved" dot>Pack-rounded after sum</Pill>
              <div className="pl-page-actions">
                <Btn ico="share" variant="ghost">Share</Btn>
                <Btn ico="download">Export CSV</Btn>
                <Btn ico="download" variant="primary">Generate POs · 3</Btn>
              </div>
            </div>
            <div className="pl-page-sub">Sums identical materials across selected projects and re-applies pack rounding — saves boxes vs per-project rounding.</div>
          </div>

          {/* Selected projects strip */}
          <div style={{ padding: '14px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Selected projects</span>
              <Pill variant="info">{projects.length}</Pill>
              <span style={{ marginLeft: 'auto' }}>
                <Btn size="sm" ico="plus">Add project</Btn>
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 200px', gap: 10 }}>
              {projects.map(p => (
                <div key={p.code} className="pl-card" style={{ padding: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Chip>{p.code}</Chip>
                    <Pill variant="approved" dot>approved</Pill>
                    <I name="x" size={12} style={{ marginLeft: 'auto', color: 'var(--ink-5)' }} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{p.client}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 6, fontSize: 11.5 }}>
                    <span><span className="mono tnum" style={{ fontWeight: 500, color: 'var(--ink-2)' }}>{p.lines}</span> <span style={{ color: 'var(--ink-5)' }}>lines</span></span>
                    <span><span className="mono tnum" style={{ fontWeight: 500, color: 'var(--ink-2)' }}>${p.sum.toLocaleString()}</span></span>
                  </div>
                </div>
              ))}
              {/* Aggregate summary card */}
              <div style={{ padding: 12, background: 'var(--primary)', color: '#fff', borderRadius: 6 }}>
                <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.85, marginBottom: 4 }}>Combined total</div>
                <div className="mono tnum" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>${(projects.reduce((s, p) => s + p.sum, 0)).toLocaleString()}</div>
                <div style={{ marginTop: 6, fontSize: 11.5, opacity: 0.85, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <I name="check" size={11} />
                  Saved <span className="mono tnum" style={{ fontWeight: 600 }}>${(savings * 100).toLocaleString()}</span> vs sum of per-project rounding
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="pl-filterbar" style={{ gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Materials</span>
            <span className="tnum" style={{ fontSize: 12, color: 'var(--ink-4)' }}>{materials.reduce((s, g) => s + g.rows.length, 0)} unique SKUs · grouped by supplier</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>Group by</span>
              <Seg items={['Supplier', 'Category', 'Project', 'None']} active="Supplier" />
              <span className="pl-filter-chip is-active">Pack-rounded after sum <I name="check" size={11} /></span>
            </div>
          </div>

          {/* Combined table */}
          <div className="pl-scroll" style={{ background: 'var(--surface)' }}>
            <table className="pl-table">
              <thead>
                <tr>
                  <th style={{ width: 28 }}></th>
                  <th style={{ width: 40 }}></th>
                  <th style={{ width: 140 }}>SKU</th>
                  <th>Material</th>
                  <th style={{ width: 260 }}>Provenance · per-project</th>
                  <th className="num" style={{ width: 100 }}>Naïve sum</th>
                  <th className="num" style={{ width: 100 }}>Pack-rounded</th>
                  <th className="num" style={{ width: 60 }}>Δ</th>
                  <th className="num" style={{ width: 80 }}>Unit</th>
                  <th className="num" style={{ width: 110 }}>Line total</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((g, gi) => (
                  <React.Fragment key={gi}>
                    <tr className="group-row">
                      <td colSpan={4}>
                        <span style={{ marginRight: 10 }}>{g.sup}</span>
                        <span className="group-count">{g.rows.length} SKUs · 1 PO</span>
                      </td>
                      <td colSpan={5}></td>
                      <td className="num mono" style={{ fontWeight: 700 }}>${g.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    </tr>
                    {g.rows.map(r => {
                      const sum = r.breakdown.reduce((s, b) => s + b.q, 0);
                      const final = r.packed ? r.packed.to : sum;
                      const delta = final - sum;
                      return (
                        <tr key={r.sku}>
                          <td></td>
                          <td><div className="pl-thumb">{r.th}</div></td>
                          <td className="mono" style={{ color: 'var(--ink-3)' }}>{r.sku}</td>
                          <td><span style={{ fontWeight: 500 }}>{r.name}</span></td>
                          <td><Provenance breakdown={r.breakdown} unit={r.unit} /></td>
                          <td className="num mono">{sum}<span className="unit">{r.unit}</span></td>
                          <td className="num mono" style={{ fontWeight: 600 }}>
                            {final}<span className="unit">{r.unit}</span>
                            {r.packed && <div style={{ fontSize: 10, color: 'var(--ink-5)' }}>{r.packed.note}</div>}
                          </td>
                          <td className={'num pl-var ' + (delta > 0 ? 'up' : 'zero')}>{delta > 0 ? '+' + delta : '—'}</td>
                          <td className="num mono">${r.cost.toFixed(2)}</td>
                          <td className="num mono" style={{ fontWeight: 600 }}>${(final * r.cost).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right panel — provenance for highlighted line */}
        <div className="pl-panel" style={{ width: 320 }}>
          <div className="pl-panel-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Chip>CBL-SS-08-100</Chip>
              <Pill variant="info">selected</Pill>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Cable, 7×19 SS316, ⌀8 mm</div>
          </div>
          <div className="pl-panel-body">
            <div className="pl-label">Provenance</div>
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 4, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                <span className="mono tnum" style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>440</span>
                <span style={{ fontSize: 13, color: 'var(--ink-4)' }}>m total</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-5)' }}>(pack-rounded → 500 m)</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <ProvBar label="PRJ-2026-038 · Aurora Bridge" qty={260} total={500} color="#1E40AF" />
                <ProvBar label="PRJ-2026-041 · Bayport"        qty={180} total={500} color="#0EA5E9" />
                <ProvBar label="PRJ-2026-044 · Solis"          qty={0}   total={500} color="#94A3B8" />
                <ProvBar label="Pack rounding"                 qty={60}  total={500} color="#FACC15" rounding />
              </div>
            </div>

            <div style={{ height: 16 }} />
            <div className="pl-label">PO target</div>
            <div className="pl-card" style={{ padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Chip>PO-DRAFT-0291</Chip>
                <Pill variant="info">draft</Pill>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Helmsmiths</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2 }}>5 line items · 1 supplier</div>
            </div>

            <div style={{ height: 16 }} />
            <div style={{ padding: 12, background: 'var(--success-soft)', border: '1px solid #BFDDD8', borderRadius: 4, fontSize: 11.5, color: 'var(--success)' }}>
              <I name="check" size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Combined rounding avoided <span className="mono" style={{ fontWeight: 600 }}>+1 drum</span> vs per-project — saves <span className="mono">$1,420</span>.
            </div>
          </div>
          <div className="pl-panel-foot">
            <Btn variant="ghost">View raw</Btn>
            <Btn variant="primary">Send to PO draft</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function Provenance({ breakdown, unit }) {
  const total = breakdown.reduce((s, b) => s + b.q, 0);
  if (!total) return <span style={{ color: 'var(--ink-5)' }}>—</span>;
  const colors = ['#1E40AF', '#0EA5E9', '#94A3B8'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', height: 8, borderRadius: 2, overflow: 'hidden', background: 'var(--surface-2)' }}>
        {breakdown.map((b, i) => (
          <span key={i} style={{ width: ((b.q / total) * 100) + '%', background: colors[i] || 'var(--line)' }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, fontSize: 10.5, color: 'var(--ink-4)' }} className="mono tnum">
        {breakdown.map((b, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, background: colors[i] || 'var(--line)' }} />
            {b.p} · {b.q}{unit}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProvBar({ label, qty, total, color, rounding }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, marginBottom: 3 }}>
        <span style={{ width: 8, height: 8, background: color, borderRadius: 1 }} />
        <span style={{ flex: 1, color: rounding ? 'var(--hivis-ink)' : 'var(--ink-3)', fontStyle: rounding ? 'italic' : 'normal' }}>{label}</span>
        <span className="mono tnum" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{qty} m</span>
      </div>
      <span className="pl-bar" style={{ background: 'var(--surface)' }}>
        <span className="pl-bar-fill" style={{ width: ((qty / total) * 100) + '%', background: color }} />
      </span>
    </div>
  );
}

window.Aggregation = Aggregation;
