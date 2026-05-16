// Screen 1 — Project Dashboard with editable MTO table

function Dashboard({ density = 'default', state = 'modified', groupBy = 'system', collapsed = false, onToggleCollapse }) {
  const project = {
    code: 'PRJ-2026-038',
    name: 'Aurora Bridge — North Span',
    client: 'Caltrans District 4',
    location: 'San Francisco, CA',
    contact: 'M. Ortega · +1 415 555 0142',
    substrate: 'Steel I-beam',
    start: 'Jun 02, 2026',
    due: 'Aug 14, 2026',
  };

  const instances = [
    { id: 'LL-01', sys: 'Lifeline',   model: 'Cable 8mm SS316', shape: 'Segmented · 3 segments', dim: '247.4 m',  subs: 'Steel I-beam', items: 18 },
    { id: 'GR-01', sys: 'Guardrail',  model: 'Modular 1.1m Galv', shape: 'Straight', dim: '186.0 m', subs: 'Steel I-beam', items: 11 },
    { id: 'AP-01', sys: 'Anchor Point', model: 'Type-A Swivel', shape: '—', dim: '6 anchors', subs: 'Concrete deck', items: 6 },
    { id: 'LD-01', sys: 'Ladder',     model: 'Vertical w/ Rail', shape: 'Straight', dim: '14.2 m run', subs: 'Steel column', items: 9 },
  ];

  const mto = [
    {
      group: 'Lifeline · LL-01 · Cable 8mm SS316',
      sub: '247.4 m segmented · 18 line items',
      tone: state === 'modified' ? 'modified' : null,
      rows: [
        { sku: 'CBL-SS-08-100', name: 'Cable, 7×19 SS316, ⌀8 mm', cat: 'Cable',    sup: 'Helmsmiths', mto: 260, iss: 250, ret: 0, unit: 'm',  wast: '5%',  cost: 14.20, sel: true, mod: state === 'modified' },
        { sku: 'TRM-END-08-K', name: 'End Termination Kit, swaged',  cat: 'Termination', sup: 'Helmsmiths', mto: 6,   iss: 6,   ret: 0, unit: 'kit', wast: '0%', cost: 142.00 },
        { sku: 'INT-ANC-12',   name: 'Intermediate Anchor, 12mm',    cat: 'Anchor',  sup: 'Helmsmiths', mto: 31,  iss: 28,  ret: 0, unit: 'pcs', wast: '5%', cost: 38.50, low: true },
        { sku: 'STN-AL-450',   name: 'Stanchion, aluminium, 450 mm', cat: 'Stanchion', sup: 'AluForm', mto: 31,  iss: 31,  ret: 2, unit: 'pcs', wast: '0%', cost: 64.00 },
        { sku: 'SHK-ABS-22',   name: 'Shock Absorber, in-line',      cat: 'Energy abs.', sup: 'Helmsmiths', mto: 3,  iss: 3,  ret: 0, unit: 'pcs', wast: '0%', cost: 96.50 },
        { sku: 'BLT-M12-80-S', name: 'M12×80 Bolt, SS316',           cat: 'Fastener', sup: 'FastWorks', mto: 124, iss: 124, ret: 8, unit: 'pcs', wast: '10%', cost: 1.85, added: state === 'modified' },
      ],
    },
    {
      group: 'Guardrail · GR-01 · Modular 1.1m Galv',
      sub: '186.0 m straight · 11 line items',
      rows: [
        { sku: 'GR-POST-1100', name: 'Guardrail Post, 1100 mm',     cat: 'Post',     sup: 'AluForm',   mto: 94,  iss: 80, ret: 0, unit: 'pcs', wast: '0%', cost: 28.00 },
        { sku: 'GR-RAIL-2M-G', name: 'Top Rail, 2.0 m, galv',       cat: 'Rail',     sup: 'AluForm',   mto: 93,  iss: 80, ret: 0, unit: 'pcs', wast: '0%', cost: 22.50 },
        { sku: 'GR-CLAMP-BS',  name: 'Beam Shoe Clamp',             cat: 'Clamp',    sup: 'AluForm',   mto: 94,  iss: 80, ret: 0, unit: 'pcs', wast: '0%', cost: 12.40, low: true },
        { sku: 'GR-KICK-2M',   name: 'Toe-board, 2.0 m, galv',      cat: 'Toe',      sup: 'AluForm',   mto: 93,  iss: 80, ret: 0, unit: 'pcs', wast: '0%', cost: 11.20 },
      ],
    },
    {
      group: 'Anchor Point · AP-01 · Type-A Swivel',
      sub: '6 anchors · 6 line items',
      rows: [
        { sku: 'APT-A-SWV-SS', name: 'Type-A Anchor, swivel SS316', cat: 'Anchor',   sup: 'Helmsmiths', mto: 6, iss: 6, ret: 0, unit: 'pcs', wast: '0%', cost: 184.00 },
        { sku: 'EPX-CHEM-300', name: 'Chemical Anchor Resin, 300ml', cat: 'Adhesive', sup: 'FastWorks',  mto: 4, iss: 4, ret: 0, unit: 'cart', wast: '20%', cost: 18.40 },
      ],
    },
  ];

  // currently selected row for the right panel
  const selectedSku = 'CBL-SS-08-100';

  const totalMto    = mto.reduce((s, g) => s + g.rows.reduce((a,r) => a + r.mto * r.cost, 0), 0);
  const totalLines  = mto.reduce((s, g) => s + g.rows.length, 0);
  const totalIssued = mto.reduce((s, g) => s + g.rows.reduce((a,r) => a + r.iss * r.cost, 0), 0);

  const stateLabel = state === 'approved' ? 'Approved' : state === 'draft' ? 'Draft' : 'Modified after approval';
  const stateVariant = state === 'approved' ? 'approved' : state === 'draft' ? 'draft' : 'modified';

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="projects" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Projects', project.name]} />
      <div className="pl-main" style={{ flexDirection: 'row' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Page head */}
          <div className="pl-page-head">
            <div className="pl-page-title-row">
              <Chip style={{ height: 22, padding: '0 8px', fontSize: 11 }}>{project.code}</Chip>
              <div className="pl-page-title">{project.name}</div>
              {state === 'modified' && <HiVis>Modified · 2h ago</HiVis>}
              {state !== 'modified' && <Pill variant={stateVariant} dot>{stateLabel}</Pill>}
              <div className="pl-page-actions">
                <Btn ico="share" variant="ghost">Share link</Btn>
                <Btn ico="download">Export</Btn>
                {state === 'draft' ? <Btn variant="primary" ico="check">Submit for approval</Btn> : <Btn variant="primary" ico="refresh">Re-issue to storeman</Btn>}
                <Btn variant="ghost" style={{ width: 30, padding: 0, justifyContent: 'center' }}><I name="dots" /></Btn>
              </div>
            </div>
          </div>

          {/* Meta strip */}
          <div className="pl-meta" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
            <div className="pl-meta-cell"><div className="pl-meta-label">Client</div><div className="pl-meta-value">{project.client}</div></div>
            <div className="pl-meta-cell"><div className="pl-meta-label">Location</div><div className="pl-meta-value">{project.location}</div></div>
            <div className="pl-meta-cell"><div className="pl-meta-label">Site contact</div><div className="pl-meta-value">{project.contact}</div></div>
            <div className="pl-meta-cell"><div className="pl-meta-label">Substrate</div><div className="pl-meta-value">{project.substrate}</div></div>
            <div className="pl-meta-cell"><div className="pl-meta-label">Start · Due</div><div className="pl-meta-value mono">{project.start} → {project.due}</div></div>
            <div className="pl-meta-cell"><div className="pl-meta-label">MTO total</div><div className="pl-meta-value mono">${totalMto.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div></div>
          </div>

          {/* System instances row */}
          <div style={{ padding: '14px 24px 6px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>System Instances · {instances.length}</div>
              <button className="pl-btn ghost sm" style={{ marginLeft: 'auto' }}><I name="plus" size={12} />Add system</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {instances.map(ins => (
                <div key={ins.id} className="pl-card" style={{ padding: '10px 12px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 10, alignItems: 'center' }}>
                  <SystemGlyph kind={ins.sys} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <Chip style={{ flex: '0 0 auto' }}>{ins.id}</Chip>
                      <span style={{ fontWeight: 600, fontSize: 12.5 }}>{ins.sys}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ins.model} · {ins.shape}</div>
                    <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5 }}>
                      <span className="mono tnum" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{ins.dim}</span>
                      <span style={{ color: 'var(--ink-5)' }}>·</span>
                      <span style={{ color: 'var(--ink-4)' }}>{ins.subs}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono tnum" style={{ fontSize: 14, fontWeight: 600 }}>{ins.items}</div>
                    <div style={{ fontSize: 10, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>lines</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Toolbar for MTO table */}
          <div className="pl-filterbar" style={{ gap: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>MTO · Bill of Quantities</div>
            <span style={{ color: 'var(--ink-5)' }}>·</span>
            <span style={{ fontSize: 12, color: 'var(--ink-4)' }} className="tnum">{totalLines} lines</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>Group by</span>
              <Seg items={['System', 'Material', 'Category', 'Supplier']} active={groupBy === 'system' ? 'System' : groupBy === 'material' ? 'Material' : groupBy === 'category' ? 'Category' : 'Supplier'} />
              <div className="pl-divider v" style={{ height: 22 }} />
              <button className="pl-filter-chip"><I name="filter" size={12} />Filter <Chip style={{ marginLeft: 4 }}>2</Chip></button>
              <span className="pl-filter-chip is-active"><span>Show variances</span></span>
              <button className="pl-btn sm" style={{ marginLeft: 4 }}><I name="plus" size={12} />Add line</button>
            </div>
          </div>

          {/* MTO table */}
          <div className="pl-scroll" style={{ background: 'var(--surface)' }}>
            <table className="pl-table">
              <thead>
                <tr>
                  <th style={{ width: 28 }}><Check /></th>
                  <th style={{ width: 130 }}>SKU</th>
                  <th>Material</th>
                  <th style={{ width: 110 }}>Supplier</th>
                  <th className="num" style={{ width: 80 }}>MTO</th>
                  <th className="num" style={{ width: 80 }}>Issued</th>
                  <th className="num" style={{ width: 64 }}>Ret.</th>
                  <th style={{ width: 130 }}>Stock progress</th>
                  <th className="num" style={{ width: 80 }}>Variance</th>
                  <th className="num" style={{ width: 64 }}>Wastage</th>
                  <th className="num" style={{ width: 80 }}>Unit</th>
                  <th className="num" style={{ width: 90 }}>Line total</th>
                  <th style={{ width: 28 }}></th>
                </tr>
              </thead>
              <tbody>
                {mto.map((g, gi) => (
                  <React.Fragment key={gi}>
                    <tr className="group-row">
                      <td><I name="chev" size={12} /></td>
                      <td colSpan={11}>
                        <span style={{ marginRight: 10 }}>{g.group}</span>
                        <span className="group-count">{g.sub}</span>
                        {g.tone === 'modified' && <span style={{ marginLeft: 10 }}><HiVis>Modified</HiVis></span>}
                      </td>
                      <td></td>
                    </tr>
                    {g.rows.map((r, ri) => {
                      const issued = r.iss;
                      const variance = issued - r.mto;
                      const varTone = variance === 0 ? 'zero' : variance > 0 ? 'up' : 'down';
                      const lineTotal = r.mto * r.cost;
                      const progress = (issued / r.mto) * 100;
                      const isSel = r.sku === selectedSku;
                      return (
                        <tr key={r.sku} className={isSel ? 'is-selected' : ''}>
                          <td><Check state={isSel} /></td>
                          <td className="mono" style={{ color: 'var(--ink-3)' }}>{r.sku}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontWeight: 500 }}>{r.name}</span>
                              {r.low && <Pill variant="modified">low stock</Pill>}
                              {r.added && <Pill variant="info">added</Pill>}
                              {r.mod && <Pill variant="modified">qty +20</Pill>}
                            </div>
                            <div style={{ fontSize: 10.5, color: 'var(--ink-5)', marginTop: 1 }}>{r.cat}</div>
                          </td>
                          <td style={{ color: 'var(--ink-3)' }}>{r.sup}</td>
                          <td className="num mono">{r.mto.toLocaleString()}<span className="unit">{r.unit}</span></td>
                          <td className="num mono">{issued.toLocaleString()}</td>
                          <td className="num mono">{r.ret}</td>
                          <td>
                            <ProgressBar value={issued} max={r.mto} tone={progress >= 100 ? 'success' : progress < 90 ? (r.low ? 'warn' : '') : ''} />
                          </td>
                          <td className={'num pl-var ' + varTone}>{variance === 0 ? '—' : (variance > 0 ? '+' : '') + variance}</td>
                          <td className="num mono" style={{ color: 'var(--ink-4)' }}>{r.wast}</td>
                          <td className="num mono">${r.cost.toFixed(2)}</td>
                          <td className="num mono" style={{ fontWeight: 600 }}>${lineTotal.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                          <td><I name="dots" size={14} style={{ color: 'var(--ink-5)' }} /></td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: 'var(--bg-2)' }}>
                  <td colSpan={4} style={{ padding: '10px 14px', fontWeight: 600, fontSize: 12 }}>Totals</td>
                  <td className="num mono" style={{ padding: '10px 14px', fontWeight: 600 }}>—</td>
                  <td className="num mono" style={{ padding: '10px 14px', fontWeight: 600 }}>—</td>
                  <td className="num mono" style={{ padding: '10px 14px' }}>10</td>
                  <td colSpan={4}></td>
                  <td className="num mono" style={{ padding: '10px 14px', fontWeight: 700 }}>${totalMto.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right detail panel */}
        <DetailPanel state={state} />
      </div>
    </div>
  );
}

function SystemGlyph({ kind }) {
  const sw = 1.6;
  const common = { width: 36, height: 36, viewBox: '0 0 36 36', fill: 'none', stroke: '#0F172A', strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  let glyph;
  if (kind === 'Lifeline') glyph = <g><circle cx="6" cy="18" r="2" /><circle cx="30" cy="18" r="2" /><path d="M8 18 L14 16 L22 20 L28 18" /><circle cx="14" cy="16" r="1.2" /><circle cx="22" cy="20" r="1.2" /></g>;
  else if (kind === 'Guardrail') glyph = <g><path d="M4 12h28M4 22h28" /><path d="M8 12v15M18 12v15M28 12v15" /></g>;
  else if (kind === 'Anchor Point') glyph = <g><circle cx="18" cy="10" r="3" /><path d="M18 13v14M11 27h14M11 23h4M21 23h4" /></g>;
  else if (kind === 'Ladder') glyph = <g><path d="M11 4v28M25 4v28M11 10h14M11 16h14M11 22h14M11 28h14" /></g>;
  else glyph = <rect x="6" y="6" width="24" height="24" />;
  return (
    <div style={{ width: 40, height: 40, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 4, display: 'grid', placeItems: 'center', flex: '0 0 40px' }}>
      <svg {...common}>{glyph}</svg>
    </div>
  );
}

function DetailPanel({ state }) {
  return (
    <div className="pl-panel">
      <div className="pl-panel-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Chip>CBL-SS-08-100</Chip>
          <Pill variant="info">selected</Pill>
          <button style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--ink-5)', cursor: 'pointer' }}><I name="x" /></button>
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Cable, 7×19 SS316, ⌀8 mm</div>
        <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }}>Cable · Helmsmiths · v3 (pinned)</div>
      </div>
      <div className="pl-panel-body">
        <div className="pl-label">Override · Quantity</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NumInput value="260" unit="m" width={120} />
          <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>was <span className="mono tnum">247.4</span> + 5% wastage</span>
        </div>
        {state === 'modified' && (
          <div style={{ marginTop: 8, padding: '8px 10px', background: 'var(--hivis-soft)', border: '1px solid var(--hivis-line)', borderRadius: 4, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <I name="warn" size={13} style={{ color: 'var(--hivis-ink)', marginTop: 2 }} />
            <div style={{ fontSize: 11.5, color: 'var(--hivis-ink)', lineHeight: 1.45 }}>
              Quantity raised by <span className="mono">+12.6 m</span> after approval. Storeman will see the new total on re-issue.
            </div>
          </div>
        )}

        <div style={{ height: 14 }} />
        <div className="pl-label">Wastage · Per-line</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NumInput value="5" unit="%" width={90} />
          <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>project default 8%</span>
        </div>

        <div style={{ height: 14 }} />
        <div className="pl-label">Substitute</div>
        <div className="pl-select" style={{ width: '100%' }}>
          <span style={{ color: 'var(--ink-4)' }}>Pick a different material…</span>
          <I name="chev" size={12} />
        </div>
        <div style={{ marginTop: 6, fontSize: 11.5, color: 'var(--ink-4)' }}>Soft warning if category or substrate mismatch.</div>

        <div style={{ height: 18 }} />
        <div className="pl-label">Stock by location</div>
        <div style={{ border: '1px solid var(--line)', borderRadius: 4 }}>
          {[
            { loc: 'SF Yard A', stock: 412, picked: 250 },
            { loc: 'Oakland Hub', stock: 120, picked: 0 },
            { loc: 'Mobile Van 03', stock: 60, picked: 0 },
          ].map((s, i) => (
            <div key={s.loc} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', padding: '8px 10px', gap: 12, borderTop: i ? '1px solid var(--line)' : 'none', fontSize: 12 }}>
              <span>{s.loc}</span>
              <span className="mono tnum" style={{ color: 'var(--ink-3)' }}>{s.stock} m</span>
              <span style={{ width: 56 }}><ProgressBar value={s.picked} max={s.stock} /></span>
            </div>
          ))}
        </div>

        <div style={{ height: 18 }} />
        <div className="pl-label">Certifications</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', border: '1px solid var(--line)', borderRadius: 4 }}>
            <I name="cert" size={13} style={{ color: 'var(--success)' }} />
            <span style={{ fontSize: 12, flex: 1 }}>EN 795:2012 Type C</span>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>exp 2027-04</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', border: '1px solid var(--hivis-line)', background: 'var(--hivis-soft)', borderRadius: 4 }}>
            <I name="warn" size={13} style={{ color: 'var(--hivis-ink)' }} />
            <span style={{ fontSize: 12, flex: 1, color: 'var(--hivis-ink)' }}>OSHA 1926.502 attest</span>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--hivis-ink)' }}>exp 26 days</span>
          </div>
        </div>
      </div>
      <div className="pl-panel-foot">
        <Btn variant="ghost">Cancel</Btn>
        <Btn variant="primary">Apply override</Btn>
      </div>
    </div>
  );
}

window.Dashboard = Dashboard;
window.SystemGlyph = SystemGlyph;
