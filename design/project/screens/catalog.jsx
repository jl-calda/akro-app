// Screen 2 — Material Catalog dense table + new-material modal

function Catalog({ density = 'default', collapsed = false, onToggleCollapse }) {
  const cats = [
    { name: 'All',           count: 847, active: true },
    { name: 'Cable',         count: 32 },
    { name: 'Anchor',        count: 64 },
    { name: 'Stanchion',     count: 28 },
    { name: 'Fastener',      count: 312 },
    { name: 'Rail',          count: 46 },
    { name: 'Post',          count: 38 },
    { name: 'Termination',   count: 24 },
    { name: 'Adhesive',      count: 12 },
    { name: 'PPE',           count: 184 },
  ];

  const mats = [
    { th: '🪢', code: 'CBL-SS-08-100',  name: 'Cable, 7×19 SS316, ⌀8 mm',         cat: 'Cable',       sup: 'Helmsmiths', cost: 14.20,  unit: 'm',   pack: '100 m drum',  stock: 592, locs: 3, low: false, certs: 2, v: 3 },
    { th: '🪢', code: 'CBL-SS-10-100',  name: 'Cable, 7×19 SS316, ⌀10 mm',        cat: 'Cable',       sup: 'Helmsmiths', cost: 18.40,  unit: 'm',   pack: '100 m drum',  stock: 248, locs: 2, low: false, certs: 2, v: 2 },
    { th: '⚓', code: 'APT-A-SWV-SS',   name: 'Type-A Anchor, swivel SS316',      cat: 'Anchor',      sup: 'Helmsmiths', cost: 184.00, unit: 'pcs', pack: '10 / box',    stock: 38,  locs: 2, low: false, certs: 3, v: 4 },
    { th: '⚓', code: 'APT-A-FIX-SS',   name: 'Type-A Anchor, fixed SS316',       cat: 'Anchor',      sup: 'Helmsmiths', cost: 142.50, unit: 'pcs', pack: '10 / box',    stock: 6,   locs: 1, low: true,  certs: 3, v: 3 },
    { th: '🔩', code: 'BLT-M12-80-S',   name: 'M12×80 Bolt, SS316',               cat: 'Fastener',    sup: 'FastWorks',  cost: 1.85,   unit: 'pcs', pack: '50 / bag',    stock: 4820, locs: 4, low: false, certs: 1, v: 1 },
    { th: '🔩', code: 'BLT-BMET-14',    name: 'Bi-metal Self-Drill, 14 mm',       cat: 'Fastener',    sup: 'FastWorks',  cost: 0.92,   unit: 'pcs', pack: '100 / bag',   stock: 0,   locs: 0, low: true,  certs: 0, v: 1 },
    { th: '📐', code: 'STN-AL-450',     name: 'Stanchion, aluminium, 450 mm',     cat: 'Stanchion',   sup: 'AluForm',    cost: 64.00,  unit: 'pcs', pack: '20 / pallet', stock: 184, locs: 3, low: false, certs: 2, v: 5 },
    { th: '📐', code: 'STN-AL-600',     name: 'Stanchion, aluminium, 600 mm',     cat: 'Stanchion',   sup: 'AluForm',    cost: 78.00,  unit: 'pcs', pack: '20 / pallet', stock: 96,  locs: 2, low: false, certs: 2, v: 4 },
    { th: '🛡️', code: 'GR-POST-1100',  name: 'Guardrail Post, 1100 mm',          cat: 'Post',        sup: 'AluForm',    cost: 28.00,  unit: 'pcs', pack: '12 / pallet', stock: 312, locs: 3, low: false, certs: 1, v: 2 },
    { th: '🛡️', code: 'GR-RAIL-2M-G',  name: 'Top Rail, 2.0 m, galv',            cat: 'Rail',        sup: 'AluForm',    cost: 22.50,  unit: 'pcs', pack: '20 / bundle', stock: 84,  locs: 2, low: true,  certs: 1, v: 2 },
    { th: '🧷', code: 'TRM-END-08-K',   name: 'End Termination Kit, swaged',      cat: 'Termination', sup: 'Helmsmiths', cost: 142.00, unit: 'kit', pack: '5 / case',    stock: 32,  locs: 3, low: false, certs: 2, v: 2 },
    { th: '🔧', code: 'INT-ANC-12',     name: 'Intermediate Anchor, 12mm',        cat: 'Anchor',      sup: 'Helmsmiths', cost: 38.50,  unit: 'pcs', pack: '25 / box',    stock: 14,  locs: 2, low: true,  certs: 1, v: 2 },
    { th: '🧪', code: 'EPX-CHEM-300',   name: 'Chemical Anchor Resin, 300ml',     cat: 'Adhesive',    sup: 'FastWorks',  cost: 18.40,  unit: 'cart', pack: '12 / box',   stock: 48,  locs: 2, low: false, certs: 1, v: 1 },
    { th: '⛓️', code: 'SHK-ABS-22',    name: 'Shock Absorber, in-line',          cat: 'Termination', sup: 'Helmsmiths', cost: 96.50,  unit: 'pcs', pack: '10 / box',    stock: 22,  locs: 2, low: false, certs: 2, v: 3 },
    { th: '🥾', code: 'PPE-HRN-FULL-L', name: 'Full Body Harness, Large',         cat: 'PPE',         sup: 'GearLine',   cost: 184.00, unit: 'pcs', pack: '1 / bag',     stock: 47,  locs: 3, low: false, certs: 3, v: 4 },
  ];

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'} style={{ position: 'relative' }}>
      <Sidebar active="materials" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Catalog', 'Materials']} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <div className="pl-page-title">Materials</div>
            <Pill variant="info">847 SKUs</Pill>
            <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>across 23 categories · 14 suppliers</span>
            <div className="pl-page-actions">
              <Btn ico="upload" variant="ghost">Import CSV</Btn>
              <Btn ico="download" variant="ghost">Export</Btn>
              <Btn variant="primary" ico="plus">New material</Btn>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pl-tabs">
          {cats.map(c => (
            <div key={c.name} className={'pl-tab' + (c.active ? ' is-active' : '')}>
              {c.name}<span className="pl-tab-count">{c.count}</span>
            </div>
          ))}
        </div>

        {/* Filter row */}
        <div className="pl-filterbar">
          <div className="pl-search" style={{ width: 280, height: 30 }}>
            <I name="search" size={13} />
            <span style={{ color: 'var(--ink-2)' }}>m12 ss316</span>
            <span style={{ marginLeft: 'auto' }}><I name="x" size={12} /></span>
          </div>
          <button className="pl-filter-chip">Supplier <span className="pl-filter-val">All</span> <I name="chev" size={11} /></button>
          <button className="pl-filter-chip is-active">Stock <span className="pl-filter-val">Low only</span> <I name="x" size={11} /></button>
          <button className="pl-filter-chip">Substrate <span className="pl-filter-val">Any</span> <I name="chev" size={11} /></button>
          <button className="pl-filter-chip">Version <span className="pl-filter-val">Latest</span> <I name="chev" size={11} /></button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}><span className="mono tnum">15</span> of 847</span>
            <Seg items={['Table', 'Cards']} active="Table" />
          </div>
        </div>

        {/* Table */}
        <div className="pl-scroll" style={{ background: 'var(--surface)' }}>
          <table className="pl-table">
            <thead>
              <tr>
                <th style={{ width: 28 }}><Check /></th>
                <th style={{ width: 44 }}></th>
                <th style={{ width: 140 }}>SKU</th>
                <th>Name</th>
                <th style={{ width: 110 }}>Category</th>
                <th style={{ width: 110 }}>Supplier</th>
                <th className="num" style={{ width: 80 }}>Unit cost</th>
                <th style={{ width: 130 }}>Pack</th>
                <th className="num" style={{ width: 90 }}>Stock</th>
                <th style={{ width: 130 }}>Locations</th>
                <th style={{ width: 80 }}>Certs</th>
                <th style={{ width: 60 }}>Ver</th>
                <th style={{ width: 28 }}></th>
              </tr>
            </thead>
            <tbody>
              {mats.map(m => (
                <tr key={m.code} className={m.low ? '' : ''}>
                  <td><Check /></td>
                  <td><div className="pl-thumb">{m.th}</div></td>
                  <td className="mono" style={{ color: 'var(--ink-3)' }}>{m.code}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 500 }}>{m.name}</span>
                      {m.low && m.stock === 0 && <Pill variant="danger">out of stock</Pill>}
                      {m.low && m.stock > 0 && <Pill variant="modified">low</Pill>}
                    </div>
                  </td>
                  <td><Chip>{m.cat}</Chip></td>
                  <td style={{ color: 'var(--ink-3)' }}>{m.sup}</td>
                  <td className="num mono">${m.cost.toFixed(2)}</td>
                  <td style={{ color: 'var(--ink-4)', fontSize: 12 }}>{m.pack}</td>
                  <td className="num mono" style={{ fontWeight: m.stock === 0 ? 500 : 400, color: m.stock === 0 ? 'var(--danger)' : 'inherit' }}>
                    {m.stock.toLocaleString()}<span className="unit">{m.unit}</span>
                  </td>
                  <td>
                    {m.locs > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <LocationDots count={m.locs} />
                        <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }} className="tnum">{m.locs} loc</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11.5, color: 'var(--ink-5)' }}>—</span>
                    )}
                  </td>
                  <td>
                    {m.certs > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <I name="cert" size={12} style={{ color: 'var(--success)' }} />
                        <span style={{ fontSize: 11.5 }} className="tnum">{m.certs}</span>
                      </div>
                    ) : <span style={{ fontSize: 11.5, color: 'var(--ink-5)' }}>—</span>}
                  </td>
                  <td><Chip>v{m.v}</Chip></td>
                  <td><I name="dots" size={14} style={{ color: 'var(--ink-5)' }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal overlay (preview) */}
      <NewMaterialModal />
    </div>
  );
}

function LocationDots({ count }) {
  const dots = Math.min(count, 5);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ width: 6, height: 10, background: i < dots ? 'var(--primary)' : 'var(--line)', borderRadius: 1 }} />
      ))}
    </div>
  );
}

function NewMaterialModal() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(11, 18, 32, 0.45)', display: 'grid', placeItems: 'center', zIndex: 30 }}>
      <div style={{ width: 720, background: 'var(--surface)', borderRadius: 8, boxShadow: '0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 14px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Chip>NEW</Chip>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Add material</div>
          <Pill variant="info">Cable category</Pill>
          <button style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--ink-5)', cursor: 'pointer' }}><I name="x" /></button>
        </div>
        <div style={{ padding: 18, display: 'grid', gridTemplateColumns: '160px 1fr', gap: 18 }}>
          {/* Thumbnail picker */}
          <div>
            <div className="pl-label">Thumbnail</div>
            <div style={{ width: 140, height: 140, border: '1px dashed var(--line-2)', borderRadius: 6, display: 'grid', placeItems: 'center', background: 'var(--surface-2)', position: 'relative' }}>
              <div style={{ fontSize: 64, lineHeight: 1 }}>🪢</div>
            </div>
            <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
              <button className="pl-btn sm" style={{ flex: 1 }}>Emoji</button>
              <button className="pl-btn sm" style={{ flex: 1 }}>Upload</button>
              <button className="pl-btn sm" style={{ flex: 1 }}>Paste</button>
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--ink-5)', marginTop: 6, textAlign: 'center' }}>⌘V to paste from clipboard</div>
          </div>

          {/* Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="pl-label">Name</div>
              <input className="pl-input" defaultValue="Cable, 7×19 SS316, ⌀8 mm" style={{ width: '100%', height: 34 }} />
            </div>
            <div>
              <div className="pl-label">SKU code</div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input className="pl-input mono" defaultValue="CBL-SS-08-100" style={{ flex: 1, height: 34 }} />
                <button className="pl-btn sm" title="Auto-generate"><I name="refresh" size={12} /></button>
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-5)', marginTop: 4 }}>pattern <span className="mono">[CAT]-[MAT]-[Ø]-[LEN]</span></div>
            </div>
            <div>
              <div className="pl-label">Supplier</div>
              <Select value="Helmsmiths" width="100%" />
            </div>
            <div>
              <div className="pl-label">Unit cost</div>
              <NumInput value="14.20" unit="$/m" width="100%" />
            </div>
            <div>
              <div className="pl-label">Pack size</div>
              <input className="pl-input" defaultValue="100 m drum" style={{ width: '100%' }} />
            </div>
            <div>
              <div className="pl-label">Default wastage</div>
              <NumInput value="5" unit="%" width="100%" />
            </div>
            <div>
              <div className="pl-label">Unit</div>
              <Select value="metres (m)" width="100%" />
            </div>

            {/* Category-defined parameters */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div className="pl-divider" />
              <div className="pl-label">Cable parameters <span style={{ color: 'var(--ink-5)', textTransform: 'none', letterSpacing: 0, fontWeight: 400 }}>· defined by category</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                <NumInput value="8" unit="mm" width="100%" />
                <Select value="7×19 strand" width="100%" />
                <Select value="SS316" width="100%" />
                <Select value="MBL 38.7 kN" width="100%" />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 10.5, color: 'var(--ink-5)' }}>
                <span>diameter</span><span style={{ marginLeft: 60 }}>construction</span><span style={{ marginLeft: 56 }}>material</span><span style={{ marginLeft: 72 }}>strength</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center' }}>
          <Pill variant="" dot><I name="check" size={11} style={{ color: 'var(--success)' }} />2 certifications attached</Pill>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <Btn variant="ghost">Cancel</Btn>
            <Btn>Save & add another</Btn>
            <Btn variant="primary">Save material</Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Catalog = Catalog;
