// Screen 10 — Project Dashboard · Combined view (Materials + Labour)
//
// Top-level seg: Materials | Labour | Combined.
// Adds a cost summary card with phase stacked bar + total project cost.
// Labour rows interleave with material rows; labour-cost cells use slate ink.

function DashboardCombined({ density = 'compact', collapsed = false, onToggleCollapse, view = 'combined' }) {
  // sample data — mirrors dashboard's project + a per-phase labour breakdown
  const matLines  = 44;
  const matCost   = 38420;
  const labour = [
    { phase: 'fabrication',   hours: 12.0,  rate: 45 },
    { phase: 'installation',  hours: 64.8,  rate: 45 },
    { phase: 'commissioning', hours: 5.0,   rate: 60 },
    { phase: 'inspection',    hours: 0,     rate: 55, excluded: true },
  ];
  const labourCost  = labour.reduce((s, p) => s + p.hours * p.rate, 0);
  const labourHours = labour.reduce((s, p) => s + p.hours, 0);
  const projectCost = matCost + labourCost;
  const stack = labour.map(p => ({ phase: p.phase, cost: p.hours * p.rate, pct: labourCost ? (p.hours * p.rate / labourCost) * 100 : 0 }));

  // Combined line items — both materials and labour, grouped by System Instance.
  const combined = [
    {
      group: 'Lifeline · LL-01 · Cable 8mm SS316',
      sub: '247.4 m segmented · 6 materials · 5 labour rows',
      rows: [
        { kind: 'mat', sku: 'CBL-SS-08-100', name: 'Cable, 7×19 SS316, ⌀8 mm',   qty: 260, unit: 'm',   cost: 14.20 },
        { kind: 'mat', sku: 'STN-AL-450',    name: 'Stanchion, aluminium 450 mm', qty: 31,  unit: 'pcs', cost: 64.00 },
        { kind: 'mat', sku: 'INT-ANC-12',    name: 'Intermediate Anchor, 12mm',   qty: 31,  unit: 'pcs', cost: 38.50 },
        { kind: 'mat', sku: 'TRM-END-08-K',  name: 'End Termination Kit, swaged', qty: 6,   unit: 'kit', cost: 142.00 },
        { kind: 'lab', source: 'sub-assembly · term', name: 'Term. Kit · Fabrication',   phase: 'fabrication',   qty: 3.0,  unit: 'h', cost: 45 },
        { kind: 'lab', source: 'sub-assembly · term', name: 'Term. Kit · Installation',  phase: 'installation',  qty: 4.5,  unit: 'h', cost: 45 },
        { kind: 'lab', source: 'Model rule · walk',   name: 'Cable run · install walk-time', phase: 'installation', qty: 24.74, unit: 'h', cost: 45, formula: '0.1 * length' },
        { kind: 'lab', source: 'Model rule · seg_lab', name: 'Per-segment install premium', phase: 'installation', qty: 4.5, unit: 'h', cost: 45, formula: '1.5 * segments.count' },
        { kind: 'lab', source: 'Model rule · comm',   name: 'Commissioning + load test',   phase: 'commissioning', qty: 2,   unit: 'h', cost: 60 },
      ],
    },
    {
      group: 'Guardrail · GR-01 · Modular 1.1m Galv',
      sub: '186.0 m straight · 4 materials · 3 labour rows',
      rows: [
        { kind: 'mat', sku: 'GR-POST-1100',  name: 'Guardrail Post, 1100 mm',     qty: 94, unit: 'pcs', cost: 28.00 },
        { kind: 'mat', sku: 'GR-RAIL-2M-G',  name: 'Top Rail, 2.0 m, galv',       qty: 93, unit: 'pcs', cost: 22.50 },
        { kind: 'lab', source: 'Model rule', name: 'Modular install · per post', phase: 'installation', qty: 23.5, unit: 'h', cost: 45, formula: '0.25 * post.qty' },
        { kind: 'lab', source: 'Model rule', name: 'Site prep + survey',           phase: 'fabrication',   qty: 4,    unit: 'h', cost: 45 },
        { kind: 'lab', source: 'Model rule', name: 'Hand-over inspection',         phase: 'commissioning', qty: 1.5,  unit: 'h', cost: 60 },
      ],
    },
  ];

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="projects" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Projects', 'Aurora Bridge — North Span', 'MTO']} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <Chip>PRJ-2026-038</Chip>
            <div className="pl-page-title">Aurora Bridge — North Span · MTO</div>
            <HiVis>Modified · 2h ago</HiVis>
            <div className="pl-page-actions">
              <Btn ico="share" variant="ghost">Share link</Btn>
              <Btn ico="download">Export · BoQ</Btn>
              <Btn variant="primary" ico="refresh">Re-issue to storeman</Btn>
            </div>
          </div>
        </div>

        {/* Cost summary card */}
        <div style={{ padding: '14px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.4fr 2fr', gap: 18, alignItems: 'center' }}>
            {/* Materials */}
            <div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Materials</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span className="mono tnum" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em' }}>${matCost.toLocaleString()}</span>
                <span style={{ fontSize: 12, color: 'var(--ink-4)' }}><span className="mono tnum">{matLines}</span> line items</span>
              </div>
              <div style={{ marginTop: 6 }}><ProgressBar value={28} max={44} tone="" /></div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 4 }}><span className="mono tnum" style={{ color: 'var(--ink-2)' }}>28</span> issued · <span className="mono tnum">16</span> remaining</div>
            </div>
            {/* Labour */}
            <div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Labour</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span className="mono tnum" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--labour-ink)' }}>${labourCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span style={{ fontSize: 12, color: 'var(--ink-4)' }}><span className="mono tnum">{labourHours.toFixed(1)}</span> h</span>
              </div>
              <div className="pl-stack" style={{ marginTop: 6 }}>
                {stack.map(s => s.pct > 0 && <span key={s.phase} style={{ width: s.pct + '%', background: PHASE_COLOR[s.phase] }} title={s.phase} />)}
              </div>
              <div style={{ marginTop: 4, display: 'flex', gap: 8, fontSize: 10.5, color: 'var(--ink-4)', flexWrap: 'wrap' }}>
                {labour.map(p => (
                  <span key={p.phase} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, opacity: p.excluded ? 0.4 : 1 }}>
                    <span style={{ width: 6, height: 6, background: PHASE_COLOR[p.phase], borderRadius: 1 }} />
                    <span style={{ color: 'var(--ink-3)' }}>{p.phase}</span>
                    <span className="mono tnum" style={{ color: 'var(--ink-2)' }}>{p.hours.toFixed(1)}h</span>
                  </span>
                ))}
              </div>
            </div>
            {/* Project total */}
            <div style={{ padding: 14, background: 'var(--primary)', color: '#fff', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 18 }}>
              <div>
                <div style={{ fontSize: 10.5, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Project total</div>
                <div className="mono tnum" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>${projectCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div style={{ fontSize: 11.5, opacity: 0.85, marginTop: 2 }}>Materials + labour · pre-tax · USD</div>
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.12)', borderRadius: 4 }}>
                  <div style={{ fontSize: 10, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Materials</div>
                  <div className="mono tnum" style={{ fontSize: 14, fontWeight: 600 }}>{((matCost / projectCost) * 100).toFixed(0)}%</div>
                </div>
                <div style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.12)', borderRadius: 4 }}>
                  <div style={{ fontSize: 10, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Labour</div>
                  <div className="mono tnum" style={{ fontSize: 14, fontWeight: 600 }}>{((labourCost / projectCost) * 100).toFixed(0)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="pl-filterbar" style={{ gap: 10 }}>
          <Seg items={['Materials', 'Labour', 'Combined']} active={view === 'labour' ? 'Labour' : view === 'materials' ? 'Materials' : 'Combined'} />
          <span style={{ color: 'var(--ink-5)' }}>·</span>
          <span style={{ fontSize: 12, color: 'var(--ink-4)' }} className="tnum">{combined.reduce((s, g) => s + g.rows.length, 0)} lines</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>Group by</span>
            <Seg items={['System', 'Phase', 'Source']} active="System" />
            <button className="pl-filter-chip">Phase <span className="pl-filter-val">All</span> <I name="chev" size={11} /></button>
          </div>
        </div>

        {/* Combined table */}
        <div className="pl-scroll" style={{ background: 'var(--surface)' }}>
          <table className="pl-table">
            <thead>
              <tr>
                <th style={{ width: 70 }}>Type</th>
                <th style={{ width: 130 }}>SKU / Alias</th>
                <th>Description</th>
                <th style={{ width: 130 }}>Phase</th>
                <th style={{ width: 200 }}>Source / Formula</th>
                <th className="num" style={{ width: 90 }}>Qty / Hours</th>
                <th className="num" style={{ width: 80 }}>Unit cost</th>
                <th className="num" style={{ width: 100 }}>Line total</th>
                <th style={{ width: 28 }}></th>
              </tr>
            </thead>
            <tbody>
              {combined.map((g, gi) => (
                <React.Fragment key={gi}>
                  <tr className="group-row">
                    <td colSpan={9}>
                      <span style={{ marginRight: 10 }}>{g.group}</span>
                      <span className="group-count">{g.sub}</span>
                    </td>
                  </tr>
                  {g.rows.map((r, ri) => r.kind === 'mat' ? (
                    <tr key={ri}>
                      <td><Pill>material</Pill></td>
                      <td className="mono" style={{ color: 'var(--ink-3)' }}>{r.sku}</td>
                      <td><span style={{ fontWeight: 500 }}>{r.name}</span></td>
                      <td><span style={{ fontSize: 11, color: 'var(--ink-5)' }}>—</span></td>
                      <td><span style={{ fontSize: 11, color: 'var(--ink-5)' }}>rule output</span></td>
                      <td className="num mono">{r.qty.toLocaleString()}<span className="unit">{r.unit}</span></td>
                      <td className="num mono">${r.cost.toFixed(2)}</td>
                      <td className="num mono" style={{ fontWeight: 600 }}>${(r.qty * r.cost).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td><I name="dots" size={14} style={{ color: 'var(--ink-5)' }} /></td>
                    </tr>
                  ) : (
                    <tr key={ri}>
                      <td><Pill variant="info">labour</Pill></td>
                      <td className="mono" style={{ color: 'var(--labour-ink)' }}>{r.source.split(' · ').pop().replace('Model rule', 'rule')}</td>
                      <td className="pl-labour-cell"><span style={{ fontWeight: 500 }}>{r.name}</span></td>
                      <td><LabourPill phase={r.phase} /></td>
                      <td className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>
                        {r.formula ? <span style={{ color: 'var(--primary)' }}>{r.formula}</span> : r.source}
                      </td>
                      <td className="num mono pl-labour-cell">{r.qty.toFixed(r.qty % 1 ? 2 : 1)}<span className="unit">{r.unit}</span></td>
                      <td className="num mono pl-labour-cell">${r.cost}/h</td>
                      <td className="num mono pl-labour-cell" style={{ fontWeight: 600 }}>${(r.qty * r.cost).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                      <td><I name="dots" size={14} style={{ color: 'var(--ink-5)' }} /></td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--bg-2)' }}>
                <td colSpan={5} style={{ padding: '10px 14px', fontWeight: 600 }}>Totals · materials + labour</td>
                <td className="num mono" style={{ padding: '10px 14px', fontWeight: 600 }} colSpan={2}>{labourHours.toFixed(1)} h labour</td>
                <td className="num mono" style={{ padding: '10px 14px', fontWeight: 700 }}>${projectCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

window.DashboardCombined = DashboardCombined;
