// Estimator · Quote detail (Build / Price / Document tabs)
// Shows Price tab with line-item costs + margin/contingency/tax inputs + running total.

function QuoteDetail({ density = 'default', collapsed = false, onToggleCollapse, tab = 'price' }) {
  const project = { code: 'PRJ-2026-046', name: 'Aurora Bridge — North Span', client: 'Caltrans D4' };
  const matCost = 142_180;
  const labCost = 28_640;
  const subtotal = matCost + labCost;
  const margin = 24;          // %
  const contingency = 5;      // %
  const tax = 8.625;          // %
  const marginAmt = subtotal * margin / 100;
  const contingencyAmt = (subtotal + marginAmt) * contingency / 100;
  const taxBase = subtotal + marginAmt + contingencyAmt;
  const taxAmt = taxBase * tax / 100;
  const total = taxBase + taxAmt;

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="quotes" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Quotes', 'Q-2026-094', project.name]} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <Chip>Q-2026-094</Chip>
            <div className="pl-page-title">{project.name}</div>
            <Pill variant="info" dot>Draft</Pill>
            <span className="pl-chip" style={{ background: 'var(--surface-2)' }}>under <span style={{ fontWeight: 600, marginLeft: 4 }}>{project.code}</span> · 1 of 2 quotes</span>
            <div className="pl-page-actions">
              <Btn ico="copy" variant="ghost">Duplicate</Btn>
              <Btn ico="download" variant="ghost">PDF preview</Btn>
              <Btn>Save draft</Btn>
              <Btn variant="primary" ico="upload">Submit for internal review</Btn>
            </div>
          </div>
        </div>

        <div className="pl-tabs">
          <div className={'pl-tab' + (tab === 'build' ? ' is-active' : '')}>Build<span className="pl-tab-count">2 inst.</span></div>
          <div className={'pl-tab' + (tab === 'price' ? ' is-active' : '')}>Price</div>
          <div className={'pl-tab' + (tab === 'doc' ? ' is-active' : '')}>Document</div>
          <div className="pl-tab">Versions<span className="pl-tab-count">3</span></div>
          <div className="pl-tab">Activity</div>
        </div>

        <div className="pl-scroll" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', alignItems: 'flex-start' }}>
          {/* LEFT — pricing table */}
          <div style={{ padding: '18px 24px 24px', minWidth: 0 }}>
            <div className="pl-card" style={{ marginBottom: 14, overflow: 'hidden' }}>
              <div className="pl-card-head">
                <div className="pl-card-title">Cost lines · materials + labour</div>
                <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--ink-4)' }}>27 lines · {`grouped by System Instance`}</span>
                <Seg items={['By System', 'By Phase', 'Flat']} active="By System" />
              </div>
              <table className="pl-table">
                <thead>
                  <tr>
                    <th style={{ width: 70 }}>Type</th>
                    <th>Description</th>
                    <th style={{ width: 110 }}>Source</th>
                    <th className="num" style={{ width: 80 }}>Qty / Hr</th>
                    <th className="num" style={{ width: 80 }}>Cost</th>
                    <th className="num" style={{ width: 100 }}>Line total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="group-row"><td colSpan={6}>Lifeline · LL-01 · Cable 8mm SS316<span className="group-count">186 m segmented · 14 lines</span></td></tr>
                  <tr><td><Pill>material</Pill></td><td><span style={{ fontWeight: 500 }}>Cable, 7×19 SS316, ⌀8 mm</span><span className="mono" style={{ marginLeft: 8, fontSize: 10.5, color: 'var(--ink-5)' }}>CBL-SS-08-100</span></td><td style={{ color: 'var(--ink-4)', fontSize: 11.5 }}>rule output</td><td className="num mono">196 <span className="unit">m</span></td><td className="num mono">$14.20</td><td className="num mono" style={{ fontWeight: 600 }}>$2,783.20</td></tr>
                  <tr><td><Pill>material</Pill></td><td><span style={{ fontWeight: 500 }}>Stanchion, aluminium 450 mm</span></td><td style={{ color: 'var(--ink-4)', fontSize: 11.5 }}>rule output</td><td className="num mono">31 <span className="unit">pcs</span></td><td className="num mono">$64.00</td><td className="num mono" style={{ fontWeight: 600 }}>$1,984.00</td></tr>
                  <tr><td><Pill variant="info">labour</Pill></td><td className="pl-labour-cell"><span style={{ fontWeight: 500 }}>Cable run · install walk-time</span></td><td><LabourPill phase="installation" /></td><td className="num mono pl-labour-cell">18.6 h</td><td className="num mono pl-labour-cell">$45/h</td><td className="num mono pl-labour-cell" style={{ fontWeight: 600 }}>$837.00</td></tr>
                  <tr><td><Pill variant="info">labour</Pill></td><td className="pl-labour-cell"><span style={{ fontWeight: 500 }}>Termination · fabrication</span></td><td><LabourPill phase="fabrication" /></td><td className="num mono pl-labour-cell">3.0 h</td><td className="num mono pl-labour-cell">$45/h</td><td className="num mono pl-labour-cell" style={{ fontWeight: 600 }}>$135.00</td></tr>
                  <tr><td><Pill variant="info">labour</Pill></td><td className="pl-labour-cell"><span style={{ fontWeight: 500 }}>Commissioning + load test</span></td><td><LabourPill phase="commissioning" /></td><td className="num mono pl-labour-cell">2.0 h</td><td className="num mono pl-labour-cell">$60/h</td><td className="num mono pl-labour-cell" style={{ fontWeight: 600 }}>$120.00</td></tr>

                  <tr className="group-row"><td colSpan={6}>Guardrail · GR-01 · Modular 1.1m Galv<span className="group-count">186 m straight · 11 lines</span></td></tr>
                  <tr><td><Pill>material</Pill></td><td><span style={{ fontWeight: 500 }}>Guardrail Post, 1100 mm</span></td><td style={{ color: 'var(--ink-4)', fontSize: 11.5 }}>rule output</td><td className="num mono">94 <span className="unit">pcs</span></td><td className="num mono">$28.00</td><td className="num mono" style={{ fontWeight: 600 }}>$2,632.00</td></tr>
                  <tr><td><Pill>material</Pill></td><td><span style={{ fontWeight: 500 }}>Top Rail, 2.0 m, galv</span></td><td style={{ color: 'var(--ink-4)', fontSize: 11.5 }}>rule output</td><td className="num mono">93 <span className="unit">pcs</span></td><td className="num mono">$22.50</td><td className="num mono" style={{ fontWeight: 600 }}>$2,092.50</td></tr>
                  <tr><td><Pill variant="info">labour</Pill></td><td className="pl-labour-cell"><span style={{ fontWeight: 500 }}>Modular install · per post</span></td><td><LabourPill phase="installation" /></td><td className="num mono pl-labour-cell">23.5 h</td><td className="num mono pl-labour-cell">$45/h</td><td className="num mono pl-labour-cell" style={{ fontWeight: 600 }}>$1,057.50</td></tr>
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--bg-2)' }}>
                    <td colSpan={5} style={{ padding: '10px 14px', fontWeight: 600 }}>Subtotal · cost</td>
                    <td className="num mono" style={{ padding: '10px 14px', fontWeight: 700 }}>${subtotal.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* RIGHT — pricing controls / running total */}
          <div style={{ background: 'var(--surface)', borderLeft: '1px solid var(--line)', padding: '18px 18px 18px' }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Pricing</div>
            <div className="pl-card" style={{ marginBottom: 12 }}>
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <PriceRow label="Materials" value={matCost} color="var(--primary)" />
                <PriceRow label="Labour"    value={labCost} color="var(--labour-ink)" />
                <div style={{ height: 1, background: 'var(--line)' }} />
                <PriceRow label="Subtotal · cost" value={subtotal} bold />
                <PriceRowInput label={`Margin · ${margin}%`}      add={marginAmt}      />
                <PriceRowInput label={`Contingency · ${contingency}%`} add={contingencyAmt} sub="on subtotal + margin" />
                <PriceRowInput label={`Tax · ${tax}%`}            add={taxAmt}         sub="on subtotal + margin + contingency" />
                <div style={{ height: 1, background: 'var(--line)' }} />
                <PriceRow label="Quote total" value={total} large bold />
                <div style={{ fontSize: 11, color: 'var(--ink-4)', textAlign: 'right' }}>effective markup <span className="mono tnum" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{((total / subtotal - 1) * 100).toFixed(1)}%</span></div>
              </div>
            </div>

            <div className="pl-card" style={{ marginBottom: 12 }}>
              <div className="pl-card-head"><div className="pl-card-title">Adjust</div></div>
              <div style={{ padding: '12px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><div className="pl-label">Margin</div><NumInput value="24" unit="%" width="100%" /></div>
                <div><div className="pl-label">Contingency</div><NumInput value="5" unit="%" width="100%" /></div>
                <div><div className="pl-label">Tax</div><NumInput value="8.625" unit="%" width="100%" /></div>
                <div><div className="pl-label">Currency</div><Select value="USD" width="100%" /></div>
                <div style={{ gridColumn: '1 / -1' }}><div className="pl-label">Terms</div><Select value="Net 30 · valid 60 days" width="100%" /></div>
              </div>
            </div>

            <div style={{ padding: '10px 12px', background: 'var(--hivis-soft)', borderRadius: 6, fontSize: 11.5, color: 'var(--hivis-ink)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <I name="warn" size={12} style={{ marginTop: 2 }} />
              <div>Margin <span className="mono">24%</span> is at tenant floor (24%). Lower values require admin approval before sending.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceRow({ label, value, color, bold, large }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: bold ? 13 : 12.5, fontWeight: bold ? 600 : 500, color: bold ? 'var(--ink)' : 'var(--ink-2)' }}>
        {color && <span style={{ width: 8, height: 8, background: color, borderRadius: 2 }} />}
        {label}
      </div>
      <span className="mono tnum" style={{ fontSize: large ? 22 : 14, fontWeight: bold ? 700 : 500, color: bold ? 'var(--ink)' : color || 'var(--ink-2)', letterSpacing: large ? '-0.02em' : 0 }}>${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
    </div>
  );
}

function PriceRowInput({ label, add, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>
        + {label}
        {sub && <div style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>{sub}</div>}
      </div>
      <span className="mono tnum" style={{ fontSize: 13, fontWeight: 500 }}>+${add.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
    </div>
  );
}

window.QuoteDetail = QuoteDetail;
