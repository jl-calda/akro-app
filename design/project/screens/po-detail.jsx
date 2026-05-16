// Estimator · PO detail

function PoDetail({ density = 'default', collapsed = false, onToggleCollapse }) {
  const lines = [
    { th: '🪢', sku: 'CBL-SS-08-100', name: 'Cable, 7×19 SS316, ⌀8 mm',     pack: '100 m drum',  ord: 500, recv: 200, unit: 'm',   cost: 14.20 },
    { th: '⚓', sku: 'APT-A-SWV-SS',  name: 'Type-A Anchor, swivel SS316', pack: '10 / box',    ord: 20,  recv: 0,   unit: 'pcs', cost: 184.00 },
    { th: '🧷', sku: 'TRM-END-08-K',  name: 'End Termination Kit, swaged', pack: '5 / case',    ord: 10,  recv: 5,   unit: 'kit', cost: 142.00 },
    { th: '🔧', sku: 'INT-ANC-12',    name: 'Intermediate Anchor, 12 mm',   pack: '25 / box',    ord: 50,  recv: 0,   unit: 'pcs', cost: 38.50 },
    { th: '⛓️', sku: 'SHK-ABS-22',   name: 'Shock Absorber, in-line',     pack: '10 / box',    ord: 10,  recv: 0,   unit: 'pcs', cost: 96.50, varianceFlag: true },
  ];
  const subtotal = lines.reduce((s, l) => s + l.ord * l.cost, 0);
  const recvPct  = Math.round(lines.reduce((s, l) => s + l.recv * l.cost, 0) / subtotal * 100);

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="suppliers" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Procurement', 'Purchase Orders', 'PO-2026-0291']} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <Chip>PO-2026-0291</Chip>
            <div className="pl-page-title">Helmsmiths · Cable + anchors</div>
            <Pill variant="approved" dot>Partially received</Pill>
            <span className="pl-chip" style={{ background: 'var(--surface-2)' }}>source <span className="mono" style={{ fontWeight: 600, marginLeft: 4 }}>project_demand · combined</span></span>
            <div className="pl-page-actions">
              <Btn ico="qr" variant="ghost">Print PO (with QR)</Btn>
              <Btn ico="download" variant="ghost">PDF</Btn>
              <Btn variant="primary" ico="upload">Send revision to supplier</Btn>
            </div>
          </div>
        </div>

        {/* Header meta + lifecycle */}
        <div className="pl-meta" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          <div className="pl-meta-cell"><div className="pl-meta-label">Supplier</div><div className="pl-meta-value">Helmsmiths · OH</div></div>
          <div className="pl-meta-cell"><div className="pl-meta-label">Created</div><div className="pl-meta-value">May 12 · D. Khoury</div></div>
          <div className="pl-meta-cell"><div className="pl-meta-label">Sent</div><div className="pl-meta-value">May 12 · 16:08</div></div>
          <div className="pl-meta-cell"><div className="pl-meta-label">Expected delivery</div><div className="pl-meta-value mono">May 22</div></div>
          <div className="pl-meta-cell"><div className="pl-meta-label">PO value</div><div className="pl-meta-value mono">${subtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div></div>
          <div className="pl-meta-cell"><div className="pl-meta-label">Received</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="pl-meta-value mono" style={{ fontSize: 13 }}>{recvPct}%</span>
              <span style={{ flex: 1 }}><ProgressBar value={recvPct} max={100} /></span>
            </div>
          </div>
        </div>

        {/* Lifecycle rail */}
        <div style={{ padding: '14px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {['Draft', 'Pending Approval', 'Sent', 'Partially Received', 'Fully Received', 'Closed'].map((s, i) => {
              const done = i < 3;
              const active = i === 3;
              return (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 18, height: 18, borderRadius: 9, background: active ? 'var(--primary)' : done ? 'var(--success)' : 'var(--surface-2)', color: done || active ? '#fff' : 'var(--ink-4)', border: !done && !active ? '1px solid var(--line)' : '0', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                      {done ? <I name="check" size={10} style={{ stroke: '#fff', strokeWidth: 2.6 }} /> : i + 1}
                    </span>
                    <span style={{ fontSize: 11.5, fontWeight: active ? 600 : 500, color: active ? 'var(--ink)' : done ? 'var(--ink-3)' : 'var(--ink-5)' }}>{s}</span>
                  </div>
                  {i < 5 && <span style={{ flex: 0, width: 36, height: 1, background: done ? 'var(--success)' : 'var(--line)' }} />}
                </React.Fragment>
              );
            })}
            <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--ink-4)' }}>Sent May 12 · est. delivery <span className="mono">May 22</span></span>
          </div>
        </div>

        <div className="pl-scroll" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', alignItems: 'flex-start' }}>
          {/* LEFT — line items */}
          <div style={{ padding: '18px 24px 24px', minWidth: 0 }}>
            <div className="pl-card" style={{ overflow: 'hidden' }}>
              <div className="pl-card-head">
                <div className="pl-card-title">Line items · {lines.length}</div>
                <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--ink-4)' }}>Pack-rounded · variance allowed on receipt</span>
              </div>
              <table className="pl-table">
                <thead>
                  <tr>
                    <th style={{ width: 36 }}></th>
                    <th style={{ width: 130 }}>SKU</th>
                    <th>Material</th>
                    <th style={{ width: 110 }}>Pack</th>
                    <th className="num" style={{ width: 80 }}>Ordered</th>
                    <th className="num" style={{ width: 80 }}>Received</th>
                    <th style={{ width: 110 }}>Progress</th>
                    <th className="num" style={{ width: 80 }}>Unit</th>
                    <th className="num" style={{ width: 100 }}>Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map(l => (
                    <tr key={l.sku} className={l.varianceFlag ? 'is-warning' : ''}>
                      <td><div className="pl-thumb" style={{ width: 24, height: 24, fontSize: 13 }}>{l.th}</div></td>
                      <td className="mono" style={{ color: 'var(--ink-3)' }}>{l.sku}</td>
                      <td><span style={{ fontWeight: 500 }}>{l.name}</span>{l.varianceFlag && <span style={{ marginLeft: 6 }}><HiVis>variance</HiVis></span>}</td>
                      <td style={{ color: 'var(--ink-4)', fontSize: 12 }}>{l.pack}</td>
                      <td className="num mono">{l.ord}<span className="unit">{l.unit}</span></td>
                      <td className="num mono">{l.recv}<span className="unit">{l.unit}</span></td>
                      <td><ProgressBar value={l.recv} max={l.ord} tone={l.recv === l.ord ? 'success' : ''} /></td>
                      <td className="num mono">${l.cost.toFixed(2)}</td>
                      <td className="num mono" style={{ fontWeight: 600 }}>${(l.ord * l.cost).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--bg-2)' }}>
                    <td colSpan={4} style={{ padding: '10px 14px', fontWeight: 600 }}>Subtotal · PO value</td>
                    <td className="num mono" style={{ padding: '10px 14px', fontWeight: 600 }} colSpan={4}>—</td>
                    <td className="num mono" style={{ padding: '10px 14px', fontWeight: 700 }}>${subtotal.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* RIGHT — source, provenance, audit */}
          <div style={{ background: 'var(--surface)', borderLeft: '1px solid var(--line)', padding: '18px 18px', position: 'sticky', top: 0, alignSelf: 'flex-start' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Source · project demand</div>
            <div className="pl-card" style={{ marginBottom: 12 }}>
              {[
                { code: 'PRJ-2026-038', name: 'Aurora Bridge — North Span', val: 7420 },
                { code: 'PRJ-2026-041', name: 'Bayport Refinery Catwalks',  val: 5180 },
                { code: 'PRJ-2026-044', name: 'Solis Logistics — Rooftop',  val: 1820 },
                { code: '—',            name: 'Pack rounding · stock topup', val: 1400, top: true },
              ].map((s, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr auto', alignItems: 'center', gap: 8, padding: '8px 12px', borderTop: i ? '1px solid var(--line)' : 'none', fontSize: 12 }}>
                  <Chip>{s.code}</Chip>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: s.top ? 'var(--hivis-ink)' : 'var(--ink-2)', fontStyle: s.top ? 'italic' : 'normal' }}>{s.name}</span>
                  <span className="mono tnum" style={{ fontWeight: 500 }}>${s.val.toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Audit log</div>
            <div className="pl-card" style={{ overflow: 'hidden' }}>
              {[
                { ico: 'check', tone: 'success', who: 'R. Mathers',  what: 'Approved', when: 'May 12 · 15:14' },
                { ico: 'upload', tone: 'primary', who: 'D. Khoury',   what: 'Submitted for approval', when: 'May 12 · 13:02' },
                { ico: 'edit',  tone: 'ink',     who: 'D. Khoury',    what: 'Updated qty CBL-SS-08-100 → 500', when: 'May 12 · 12:54' },
                { ico: 'fork',  tone: 'primary', who: 'D. Khoury',    what: 'Generated from Aggregation · 3 projects', when: 'May 12 · 12:40' },
              ].map((a, i) => (
                <div key={i} style={{ padding: '8px 12px', borderTop: i ? '1px solid var(--line)' : 'none', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5 }}>
                  <span style={{ width: 20, height: 20, borderRadius: 10, background: a.tone === 'success' ? 'var(--success-soft)' : 'var(--primary-soft)', color: a.tone === 'success' ? 'var(--success)' : a.tone === 'ink' ? 'var(--ink-3)' : 'var(--primary)', display: 'grid', placeItems: 'center' }}>
                    <I name={a.ico} size={11} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 500 }}>{a.what}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>{a.who} · <span className="mono">{a.when}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.PoDetail = PoDetail;
