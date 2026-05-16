// PM · System Instance Builder (revised)
// Full-page two-panel: free-form input sections on the left (any order),
// live MTO preview + validation on the right.

function SystemBuilder({ density = 'default', collapsed = false, onToggleCollapse }) {
  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="projects" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Projects', 'Aurora Bridge — North Span', 'Systems', 'New System Instance']} />
      <div className="pl-main" style={{ flexDirection: 'row' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div className="pl-page-head">
            <div className="pl-page-title-row">
              <Chip>LL-02</Chip>
              <div className="pl-page-title">Configure System Instance</div>
              <Pill variant="info">draft · validate on save</Pill>
              <div className="pl-page-actions">
                <Btn variant="ghost">Discard</Btn>
                <Btn>Save draft</Btn>
                <Btn variant="primary" ico="check">Save &amp; recompute</Btn>
              </div>
            </div>
            <div className="pl-page-sub">Fill sections in any order. The right pane updates live; validation highlights what's missing.</div>
          </div>

          <div className="pl-scroll" style={{ padding: '20px 24px' }}>
            <BuilderSection num="01" title="System & Shape" status="ok">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <div className="pl-label">System</div>
                  <Select value="Lifeline" width="100%" />
                </div>
                <div>
                  <div className="pl-label">Shape</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <ShapeBtn label="Straight" />
                    <ShapeBtn label="Segmented" active />
                  </div>
                </div>
              </div>
            </BuilderSection>

            <BuilderSection num="02" title="Dimensions" status="ok" hint="Segmented shape · enter each leg.">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { i: 1, len: '60.0', corner: '95°' },
                  { i: 2, len: '72.0', corner: '174°' },
                  { i: 3, len: '54.0', corner: null },
                ].map(s => (
                  <div key={s.i} style={{ display: 'grid', gridTemplateColumns: '24px 1fr 1fr 24px', gap: 8, alignItems: 'center' }}>
                    <Chip style={{ justifyContent: 'center' }}>{s.i}</Chip>
                    <NumInput value={s.len} unit="m" width="100%" />
                    {s.corner ? <NumInput value={s.corner.replace('°', '')} unit="°" width="100%" /> : <span style={{ fontSize: 11, color: 'var(--ink-5)' }}>end</span>}
                    <I name="trash" size={13} style={{ color: 'var(--ink-5)' }} />
                  </div>
                ))}
                <button className="pl-btn ghost sm" style={{ alignSelf: 'flex-start', marginTop: 4 }}><I name="plus" size={11} />Add segment</button>
                <div style={{ marginTop: 6, padding: '8px 10px', background: 'var(--primary-soft)', borderRadius: 4, fontSize: 11.5, color: 'var(--primary)' }}>
                  <I name="check" size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Total <span className="mono tnum" style={{ fontWeight: 600 }}>186.0 m</span> · 3 segments · longest leg 72 m
                </div>
              </div>
            </BuilderSection>

            <BuilderSection num="03" title="Substrate" status="ok">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Select value="Steel I-beam · purlin connection" width={320} />
                <Pill variant="approved" dot>compatible with picked Model</Pill>
              </div>
            </BuilderSection>

            <BuilderSection num="04" title="Model" status="ok">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                <ModelMini active code="LL-CBL-08-SS316" name="Cable Lifeline 8mm SS316" v="v3" certs={2} />
                <ModelMini code="LL-CBL-10-SS316" name="Cable Lifeline 10mm SS316" v="v2" certs={2} />
              </div>
            </BuilderSection>

            <BuilderSection num="05" title="Variants" status="ok">
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <VariantPick label="cable_diameter" value="8 mm" />
                <VariantPick label="finish" value="SS316" />
                <VariantPick label="include_shock_absorber" value="yes" toggle />
              </div>
            </BuilderSection>

            <BuilderSection num="06" title="Model parameters" status="warn" hint="1 required value missing — won't block save, but blocks recompute.">
              <div className="pl-card" style={{ overflow: 'hidden' }}>
                <table className="pl-table">
                  <tbody>
                    <tr><td style={{ width: 180 }}><span className="mono">spacing.intermediate</span></td><td><NumInput value="8.0" unit="m" width={120} /></td><td><Pill variant="info">model default</Pill></td></tr>
                    <tr><td><span className="mono">spacing.stanchion</span></td><td><NumInput value="6.0" unit="m" width={120} /></td><td><Pill variant="approved">project</Pill></td></tr>
                    <tr className="is-warning"><td><span className="mono">user.count</span></td><td><NumInput value="" unit="users" width={120} /></td><td><HiVis>required</HiVis></td></tr>
                  </tbody>
                </table>
              </div>
            </BuilderSection>
          </div>
        </div>

        {/* Right — live MTO preview */}
        <div className="pl-panel" style={{ width: 380 }}>
          <div className="pl-panel-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <I name="refresh" size={13} style={{ color: 'var(--primary)' }} />
              <div style={{ fontSize: 13, fontWeight: 600 }}>Live MTO preview</div>
              <Pill variant="info">recomputed 0.4s ago</Pill>
            </div>
          </div>
          <div className="pl-panel-body" style={{ padding: 0 }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Materials</div>
                <div className="mono tnum" style={{ fontSize: 22, fontWeight: 600 }}>$5,760</div>
                <div style={{ fontSize: 11, color: 'var(--ink-5)' }}>14 lines</div>
              </div>
              <div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Labour</div>
                <div className="mono tnum" style={{ fontSize: 22, fontWeight: 600, color: 'var(--labour-ink)' }}>$4,080</div>
                <div style={{ fontSize: 11, color: 'var(--ink-5)' }}>24.6 h · 3 phases</div>
              </div>
            </div>

            <div style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 8 }}>Top contributors</div>
              {[
                { name: 'Cable, 7×19 SS316', qty: '196 m',  cost: 2783 },
                { name: 'Intermediate Anchor', qty: '24 pcs', cost: 924 },
                { name: 'Stanchion alu 450', qty: '31 pcs', cost: 1984 },
                { name: 'Termination Kit', qty: '4 kit',  cost: 568 },
                { name: 'Labour · install walk', qty: '18.6 h', cost: 837, labour: true },
              ].map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 64px', gap: 8, padding: '5px 0', borderBottom: i < 4 ? '1px dashed var(--line)' : 'none', fontSize: 12 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: r.labour ? 'var(--labour-ink)' : 'inherit' }}>{r.name}</span>
                  <span className="mono tnum" style={{ fontSize: 11, color: 'var(--ink-4)', textAlign: 'right' }}>{r.qty}</span>
                  <span className="mono tnum" style={{ fontWeight: 500, textAlign: 'right', color: r.labour ? 'var(--labour-ink)' : 'inherit' }}>${r.cost}</span>
                </div>
              ))}
            </div>

            {/* Validation */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', background: 'var(--hivis-soft)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <I name="warn" size={13} style={{ color: 'var(--hivis-ink)' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--hivis-ink)' }}>1 issue · blocks recompute</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--surface)', border: '1px solid var(--hivis-line)', borderRadius: 4 }}>
                <span style={{ fontSize: 11.5, flex: 1 }}>
                  <span className="mono">user.count</span> required · affects energy-absorber rule
                </span>
                <span className="pl-link" style={{ fontSize: 11.5 }}>Jump to §06</span>
              </div>
            </div>

            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)' }}>
              <div style={{ fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>Flags</div>
              <Pill variant="approved" dot>EN 795 type C compatible</Pill>
              <span style={{ marginLeft: 4 }}><Pill variant="info">1 cert &lt; 30 days</Pill></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BuilderSection({ num, title, status, hint, children }) {
  const dot = { ok: 'var(--success)', warn: 'var(--hivis)' , empty: 'var(--ink-6)' }[status] || 'var(--ink-6)';
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-5)', fontWeight: 600 }}>§{num}</span>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{title}</span>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: dot }} />
        {hint && <span style={{ fontSize: 11.5, color: 'var(--ink-4)', marginLeft: 4 }}>{hint}</span>}
      </div>
      <div className="pl-card" style={{ padding: 14 }}>{children}</div>
    </div>
  );
}

function ShapeBtn({ label, active }) {
  return (
    <button className="pl-btn" style={{ flex: 1, height: 36, background: active ? 'var(--primary-soft)' : 'var(--surface)', borderColor: active ? 'var(--primary)' : 'var(--line-2)', color: active ? 'var(--primary)' : 'var(--ink-2)', fontWeight: active ? 600 : 500 }}>{label}</button>
  );
}

function ModelMini({ code, name, v, certs, active }) {
  return (
    <div style={{ padding: 10, border: active ? '1.5px solid var(--primary)' : '1px solid var(--line)', background: active ? 'var(--primary-soft)' : 'var(--surface)', borderRadius: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{code}</span>
        <Chip>{v}</Chip>
        {active && <span style={{ marginLeft: 'auto' }}><Pill variant="info">pinned</Pill></span>}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{name}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>
        <I name="cert" size={11} style={{ verticalAlign: 'middle', marginRight: 3, color: 'var(--success)' }} />
        {certs} certs
      </div>
    </div>
  );
}

function VariantPick({ label, value, toggle }) {
  return (
    <div>
      <div className="pl-label" style={{ marginBottom: 4 }}>{label}</div>
      {toggle ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 32, height: 18, borderRadius: 9, background: 'var(--primary)', position: 'relative' }}>
            <span style={{ position: 'absolute', top: 2, right: 2, width: 14, height: 14, borderRadius: 7, background: '#fff' }} />
          </span>
          <span style={{ fontSize: 12, fontWeight: 500 }}>{value}</span>
        </span>
      ) : <Select value={value} width={140} />}
    </div>
  );
}

window.SystemBuilder = SystemBuilder;
