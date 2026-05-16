// Screen 3 — System Instance configuration

function SystemConfig({ density = 'default', collapsed = false, onToggleCollapse }) {
  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="projects" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Projects', 'Aurora Bridge — North Span', 'System Instances', 'LL-01 · Lifeline']} />
      <div className="pl-main" style={{ flexDirection: 'row' }}>
        {/* Main config area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <div className="pl-page-head">
            <div className="pl-page-title-row">
              <Chip>LL-01</Chip>
              <div className="pl-page-title">Configure Lifeline</div>
              <Pill variant="info">Draft</Pill>
              <div className="pl-page-actions">
                <Btn variant="ghost">Cancel</Btn>
                <Btn>Save draft</Btn>
                <Btn variant="primary" ico="check">Compute MTO</Btn>
              </div>
            </div>
            <div className="pl-page-sub">Pick a shape, dimensions, substrate, and model. Required parameters update live as you choose.</div>
          </div>

          {/* Step rail */}
          <div style={{ padding: '14px 24px 0', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              {['Shape', 'Dimensions', 'Substrate', 'Model', 'Parameters', 'Preview'].map((s, i) => (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: 9,
                      display: 'grid', placeItems: 'center',
                      fontSize: 10.5, fontWeight: 600, fontFamily: 'var(--font-mono)',
                      background: i < 4 ? 'var(--primary)' : i === 4 ? 'var(--primary-soft)' : 'var(--surface-2)',
                      color: i < 4 ? '#fff' : i === 4 ? 'var(--primary)' : 'var(--ink-4)',
                      border: i === 4 ? '1px solid var(--primary)' : '1px solid var(--line)',
                    }}>{i < 4 ? <I name="check" size={10} style={{ stroke: '#fff', strokeWidth: 2.4 }} /> : i + 1}</span>
                    <span style={{ fontSize: 12.5, fontWeight: i === 4 ? 600 : 500, color: i === 4 ? 'var(--ink)' : i < 4 ? 'var(--ink-3)' : 'var(--ink-5)' }}>{s}</span>
                  </div>
                  {i < 5 && <I name="chevR" size={12} style={{ color: 'var(--ink-5)' }} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="pl-scroll" style={{ padding: '20px 24px 24px' }}>
            {/* SECTION: Shape */}
            <Section title="Shape" sub="Defines the dimension schema. Lifeline supports two shapes.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                <ShapeCard shape="straight" label="Straight" desc="Single linear run · 1 length input" />
                <ShapeCard shape="segmented" label="Segmented" desc="Multiple legs with corners · variable inputs" active />
              </div>
            </Section>

            {/* SECTION: Dimensions */}
            <Section title="Dimensions" sub="Segmented shape: enter each leg's length and the angle at each corner.">
              <div className="pl-card">
                <div className="pl-card-head" style={{ background: 'var(--surface-2)' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                    <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Segments</span>
                    <span className="mono tnum" style={{ fontSize: 12, color: 'var(--ink-3)' }}>3 of 8 max</span>
                    <span style={{ flex: 1 }} />
                    <Btn size="sm" ico="plus">Add segment</Btn>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 18, padding: 18, alignItems: 'center' }}>
                  {/* Inputs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { seg: 1, len: '82.0', corner: '102°' },
                      { seg: 2, len: '94.4', corner: '178° (≈ straight)' },
                      { seg: 3, len: '71.0', corner: null },
                    ].map(s => (
                      <div key={s.seg} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 28px', gap: 8, alignItems: 'center' }}>
                        <Chip style={{ justifyContent: 'center' }}>{s.seg}</Chip>
                        <NumInput value={s.len} unit="m" width="100%" />
                        {s.corner ? <NumInput value={s.corner.replace('°', '').split(' ')[0]} unit="°" width="100%" /> : <span style={{ fontSize: 11, color: 'var(--ink-5)' }}>end</span>}
                        <I name="trash" size={13} style={{ color: 'var(--ink-5)' }} />
                      </div>
                    ))}
                    <div style={{ marginTop: 4, padding: '8px 10px', background: 'var(--primary-soft)', borderRadius: 4, fontSize: 11.5, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <I name="check" size={12} />
                      Total cable length <span className="mono tnum" style={{ fontWeight: 600 }}>247.4 m</span> · spans <span className="mono tnum" style={{ fontWeight: 600 }}>3</span> segments
                    </div>
                  </div>

                  {/* Diagram */}
                  <ShapeDiagram />
                </div>
              </div>
            </Section>

            {/* SECTION: Substrate */}
            <Section title="Substrate" sub="Drives conditional inclusions in the rule engine (e.g. bi-metal screws on metal deck).">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Select value="Steel I-beam · purlin connection" width={320} />
                <Pill variant="info">8 rules apply</Pill>
                <Pill variant="approved" dot>EN 795 type C compatible</Pill>
                <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--ink-4)' }}>11 substrates configured for this tenant · <span className="pl-link">manage</span></span>
              </div>
            </Section>

            {/* SECTION: Model */}
            <Section title="Model" sub="Pinned at instance creation — admin can manually upgrade later.">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                <ModelCard active code="LL-CBL-08-SS316" name="Cable Lifeline 8mm SS316" v="v3" certs={['EN 795:2012-C', 'OSHA 1926.502']} subs="Steel · Concrete · Timber" />
                <ModelCard code="LL-CBL-10-SS316" name="Cable Lifeline 10mm SS316" v="v2" certs={['EN 795:2012-C']} subs="Steel · Concrete" />
                <ModelCard code="LL-RAL-AL-2M"    name="Rail Lifeline, Aluminium 2m" v="v4" certs={['EN 795:2012-D']} subs="Steel · Concrete" />
              </div>
            </Section>

            {/* SECTION: Parameters */}
            <Section title="Parameters" sub="Unioned from all rules used by Cable Lifeline 8mm SS316. Missing values block compute.">
              <div className="pl-card">
                <table className="pl-table">
                  <thead>
                    <tr>
                      <th style={{ width: 220 }}>Parameter</th>
                      <th style={{ width: 110 }}>Used by</th>
                      <th>Value</th>
                      <th style={{ width: 100 }}>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td><span className="mono">spacing.intermediate</span><div style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>distance between intermediate anchors</div></td><td><Chip>3 rules</Chip></td><td><NumInput value="8.0" unit="m" width={120} /></td><td><Pill variant="info">model default</Pill></td></tr>
                    <tr><td><span className="mono">spacing.stanchion</span><div style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>distance between stanchions</div></td><td><Chip>2 rules</Chip></td><td><NumInput value="8.0" unit="m" width={120} /></td><td><Pill variant="info">model default</Pill></td></tr>
                    <tr><td><span className="mono">corner.deflection_max</span></td><td><Chip>1 rule</Chip></td><td><NumInput value="120" unit="°" width={120} /></td><td><Pill variant="approved">project</Pill></td></tr>
                    <tr className="is-warning"><td><span className="mono">user.count</span><div style={{ fontSize: 10.5, color: 'var(--hivis-ink)' }}>simultaneous user count</div></td><td><Chip>1 rule</Chip></td><td><NumInput value="" unit="users" width={120} /></td><td><HiVis>missing</HiVis></td></tr>
                    <tr><td><span className="mono">edge.distance</span></td><td><Chip>1 rule</Chip></td><td><NumInput value="0.5" unit="m" width={120} /></td><td><Pill variant="info">model default</Pill></td></tr>
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
        </div>

        {/* Live preview panel */}
        <div className="pl-panel" style={{ width: 320 }}>
          <div className="pl-panel-head">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <I name="cube" size={14} style={{ color: 'var(--primary)' }} />
              <div style={{ fontSize: 13, fontWeight: 600 }}>Live preview</div>
              <Pill variant="info">recompute</Pill>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>Updates as you change inputs. Resolves on Compute.</div>
          </div>
          <div className="pl-panel-body" style={{ padding: 0 }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Estimated lines</span>
                <span className="mono tnum" style={{ fontSize: 18, fontWeight: 600 }}>18</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Estimated cost</span>
                <span className="mono tnum" style={{ fontSize: 18, fontWeight: 600 }}>$8,224</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--ink-5)' }}>pre-wastage · 1 parameter missing</div>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 500 }}>Top contributors</div>
              {[
                { name: 'Cable, 7×19 SS316', qty: '260 m', cost: 3692 },
                { name: 'Intermediate Anchor', qty: '31 pcs', cost: 1194 },
                { name: 'Stanchion, alu, 450', qty: '31 pcs', cost: 1984 },
                { name: 'End Termination Kit', qty: '6 kit', cost: 852 },
                { name: 'Bolt M12×80 SS316', qty: '124 pcs', cost: 229 },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < 4 ? '1px dashed var(--line)' : 'none' }}>
                  <span style={{ fontSize: 12, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
                  <span className="mono tnum" style={{ fontSize: 11, color: 'var(--ink-4)', width: 60, textAlign: 'right' }}>{r.qty}</span>
                  <span className="mono tnum" style={{ fontSize: 12, fontWeight: 500, width: 56, textAlign: 'right' }}>${r.cost}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'flex-start', gap: 8, background: 'var(--hivis-soft)' }}>
              <I name="warn" size={13} style={{ color: 'var(--hivis-ink)', marginTop: 2 }} />
              <div style={{ fontSize: 11.5, color: 'var(--hivis-ink)' }}>
                <span className="mono">user.count</span> required — affects energy-absorber rule. Compute is blocked until provided.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, sub, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</div>
        {sub && <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function ShapeCard({ shape, label, desc, active }) {
  return (
    <div style={{ padding: 14, border: active ? '1.5px solid var(--primary)' : '1px solid var(--line)', borderRadius: 6, background: active ? 'var(--primary-soft)' : 'var(--surface)', display: 'flex', gap: 14, alignItems: 'center', cursor: 'pointer' }}>
      <div style={{ width: 90, height: 60, background: '#fff', border: '1px solid var(--line)', borderRadius: 4, display: 'grid', placeItems: 'center' }}>
        <svg width="76" height="44" viewBox="0 0 76 44" fill="none" stroke="#0F172A" strokeWidth="1.6" strokeLinecap="round">
          {shape === 'straight' ? <>
            <circle cx="8" cy="22" r="2.5" fill="#0F172A" />
            <circle cx="68" cy="22" r="2.5" fill="#0F172A" />
            <path d="M10 22 H66" />
            {[20,32,44,56].map(x => <circle key={x} cx={x} cy="22" r="1.4" fill="#fff" />)}
          </> : <>
            <circle cx="6" cy="32" r="2.5" fill="#0F172A" />
            <circle cx="32" cy="10" r="2" fill="#0F172A" />
            <circle cx="52" cy="22" r="2" fill="#0F172A" />
            <circle cx="70" cy="34" r="2.5" fill="#0F172A" />
            <path d="M8 32 L32 10 L52 22 L70 34" />
            {[14,21,40,46,60,66].map((x,i) => <circle key={i} cx={x} cy={[28,21,15,18,28,32][i]} r="1.2" fill="#fff" />)}
          </>}
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
          {active && <Pill variant="info">selected</Pill>}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{desc}</div>
      </div>
    </div>
  );
}

function ShapeDiagram() {
  return (
    <div style={{ height: 200, border: '1px solid var(--line)', background: 'var(--surface-2)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
      {/* grid */}
      <svg width="100%" height="100%" viewBox="0 0 480 200" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="diag-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 L0 0 0 20" fill="none" stroke="#E4E8EE" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="480" height="200" fill="url(#diag-grid)" />
        {/* lifeline path */}
        <path d="M50 150 L210 50 L350 100 L440 170" stroke="#1E40AF" strokeWidth="2" fill="none" />
        {/* end anchors */}
        <circle cx="50"  cy="150" r="5" fill="#1E40AF" />
        <circle cx="440" cy="170" r="5" fill="#1E40AF" />
        {/* corner anchors */}
        <rect x="204" y="44" width="12" height="12" fill="#FACC15" stroke="#1E1B0B" strokeWidth="1" />
        <rect x="344" y="94" width="12" height="12" fill="#FACC15" stroke="#1E1B0B" strokeWidth="1" />
        {/* intermediates dots */}
        {[80,110,140,170,250,290,330,370,400].map(x => {
          const y = x <= 210 ? 150 - ((x - 50) / 160) * 100 : x <= 350 ? 50 + ((x - 210) / 140) * 50 : 100 + ((x - 350) / 90) * 70;
          return <circle key={x} cx={x} cy={y} r="2.4" fill="#fff" stroke="#1E40AF" strokeWidth="1.4" />;
        })}
        {/* segment labels */}
        <g fontFamily="Geist Mono, monospace" fontSize="10" fill="#475569">
          <text x="120" y="105" textAnchor="middle">82.0 m</text>
          <text x="280" y="70" textAnchor="middle">94.4 m</text>
          <text x="395" y="125" textAnchor="middle">71.0 m</text>
        </g>
        {/* angle labels */}
        <g fontFamily="Geist Mono, monospace" fontSize="9" fill="#713F12">
          <text x="226" y="36">102°</text>
          <text x="365" y="86">178°</text>
        </g>
      </svg>
      <div style={{ position: 'absolute', bottom: 8, left: 10, display: 'flex', gap: 12, fontSize: 10.5, color: 'var(--ink-4)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#1E40AF', borderRadius: '50%' }} />end</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: '#FACC15', border: '1px solid #1E1B0B' }} />corner</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, border: '1.4px solid #1E40AF', borderRadius: '50%', background: '#fff' }} />intermediate</span>
        <span style={{ marginLeft: 'auto' }}>scale 1 : 200</span>
      </div>
    </div>
  );
}

function ModelCard({ code, name, v, certs, subs, active }) {
  return (
    <div style={{ padding: 12, border: active ? '1.5px solid var(--primary)' : '1px solid var(--line)', borderRadius: 6, background: active ? 'var(--primary-soft)' : 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{code}</span>
        <Chip>{v}</Chip>
        {active && <span style={{ marginLeft: 'auto' }}><Pill variant="info">pinned</Pill></span>}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{name}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
        {certs.map(c => <Pill key={c} variant="approved" dot>{c}</Pill>)}
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{subs}</div>
    </div>
  );
}

window.SystemConfig = SystemConfig;
