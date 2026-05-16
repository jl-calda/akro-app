// Project page · Working Set + Quotes tabs (post-award view)

function ProjectWorkingSet({ density = 'default', collapsed = false, onToggleCollapse }) {
  const instances = [
    { id: 'LL-01', sys: 'Lifeline',   model: 'Cable 8mm SS316', shape: 'Segmented · 3 segments', dim: '186 m', subs: 'Steel I-beam', mat: 5760, lab: 4080, lines: 14, state: 'approved' },
    { id: 'GR-01', sys: 'Guardrail',  model: 'Modular 1.1m Galv', shape: 'Straight', dim: '186 m', subs: 'Steel I-beam', mat: 4724, lab: 1057, lines: 11, state: 'approved' },
    { id: 'AP-01', sys: 'Anchor Point', model: 'Type-A Swivel SS316', shape: '—', dim: '14 anchors', subs: 'Concrete deck', mat: 2576, lab: 720, lines: 7, state: 'draft', variation: true },
  ];

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="projects" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Projects', 'Aurora Bridge — North Span', 'Working Set']} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <Chip>PRJ-2026-038</Chip>
            <div className="pl-page-title">Aurora Bridge — North Span</div>
            <Pill variant="approved" dot>Awarded</Pill>
            <span className="pl-chip" style={{ background: 'var(--surface-2)' }}>working set from <span className="mono" style={{ fontWeight: 600, marginLeft: 4 }}>Q-2026-074</span></span>
            <div className="pl-page-actions">
              <Btn ico="copy" variant="ghost">Compare to Quote</Btn>
              <Btn ico="download">Export BoQ</Btn>
              <Btn variant="primary" ico="upload">Submit MTO for approval</Btn>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pl-tabs">
          <div className="pl-tab">Overview</div>
          <div className="pl-tab">Quotes<span className="pl-tab-count">2</span></div>
          <div className="pl-tab is-active">Working Set<span className="pl-tab-count">3</span></div>
          <div className="pl-tab">MTO<span className="pl-tab-count">32</span></div>
          <div className="pl-tab">Photos<span className="pl-tab-count">14</span></div>
          <div className="pl-tab">Activity<span className="pl-tab-count">86</span></div>
        </div>

        {/* award snapshot strip */}
        <div className="pl-meta" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          <div className="pl-meta-cell"><div className="pl-meta-label">Awarded quote</div><div className="pl-meta-value mono">Q-2026-074 · v3</div></div>
          <div className="pl-meta-cell"><div className="pl-meta-label">Awarded value</div><div className="pl-meta-value mono">$184,200</div></div>
          <div className="pl-meta-cell"><div className="pl-meta-label">Award date</div><div className="pl-meta-value">May 13 · 14:02</div></div>
          <div className="pl-meta-cell"><div className="pl-meta-label">PM · Foreman</div><div className="pl-meta-value">A. Chen · J. Sanchez</div></div>
          <div className="pl-meta-cell"><div className="pl-meta-label">Working Set cost</div><div className="pl-meta-value mono">$18,917 <span style={{ color: 'var(--hivis-ink)', fontSize: 11 }}>+1 variation</span></div></div>
        </div>

        <div className="pl-scroll" style={{ padding: '18px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>System Instances · {instances.length}</span>
            <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>2 from awarded quote · 1 variation added by PM</span>
            <span style={{ marginLeft: 'auto' }}><Btn size="sm" ico="plus">Add System Instance · variation</Btn></span>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            {instances.map(ins => (
              <div key={ins.id} className="pl-card" style={{ padding: 0, overflow: 'hidden', borderColor: ins.variation ? 'var(--hivis-line)' : 'var(--line)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '64px 1.4fr 1fr 220px auto', alignItems: 'center', padding: '14px 18px', gap: 16 }}>
                  <SystemGlyph kind={ins.sys} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <Chip>{ins.id}</Chip>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{ins.sys}</span>
                      {ins.variation && <HiVis>variation</HiVis>}
                      {ins.state === 'draft' && <Pill variant="info" dot>draft</Pill>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{ins.model} · {ins.shape}</div>
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5 }}>
                      <span className="mono tnum" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{ins.dim}</span>
                      <span style={{ color: 'var(--ink-5)' }}>·</span>
                      <span style={{ color: 'var(--ink-4)' }}>{ins.subs}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Materials</div>
                      <div className="mono tnum" style={{ fontSize: 16, fontWeight: 600 }}>${ins.mat.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Labour</div>
                      <div className="mono tnum" style={{ fontSize: 16, fontWeight: 600, color: 'var(--labour-ink)' }}>${ins.lab.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Lines</div>
                      <div className="mono tnum" style={{ fontSize: 16, fontWeight: 600 }}>{ins.lines}</div>
                    </div>
                  </div>
                  <div>
                    {ins.state === 'approved' ? <Pill variant="approved" dot>approved</Pill> : <Pill variant="info" dot>draft</Pill>}
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <Btn size="sm" variant="ghost" ico="edit">Edit</Btn>
                    <Btn size="sm" variant="ghost" ico="dots" />
                  </div>
                </div>
                {ins.variation && (
                  <div style={{ padding: '8px 18px', background: 'var(--hivis-soft)', borderTop: '1px solid var(--hivis-line)', fontSize: 11.5, color: 'var(--hivis-ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <I name="warn" size={12} />
                    Added by A. Chen on May 15 · not in awarded Quote · will show in Activity feed and on re-submission diff
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quotes sub-block — small list cross-reference */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Quotes under this project</span>
              <Pill variant="info">2</Pill>
              <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--ink-4)' }}>Read access · full edit lives with Estimator</span>
            </div>
            <div className="pl-card" style={{ overflow: 'hidden' }}>
              <table className="pl-table">
                <thead>
                  <tr>
                    <th style={{ width: 130 }}>Quote</th>
                    <th>Variant</th>
                    <th>Estimator</th>
                    <th className="num">Subtotal</th>
                    <th className="num">Margin</th>
                    <th className="num">Total</th>
                    <th>Status</th>
                    <th style={{ width: 28 }}></th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="mono">Q-2026-074</td><td><span style={{ fontWeight: 500 }}>Cable lifeline (awarded)</span></td><td>D. Khoury</td><td className="num mono">$142,180</td><td className="num mono">24%</td><td className="num mono" style={{ fontWeight: 600 }}>$184,200</td><td><Pill variant="approved" dot>awarded</Pill></td><td><I name="dots" size={13} style={{ color: 'var(--ink-5)' }} /></td></tr>
                  <tr><td className="mono">Q-2026-073</td><td>Rail lifeline alternative</td><td>D. Khoury</td><td className="num mono">$168,940</td><td className="num mono">22%</td><td className="num mono">$210,800</td><td><Pill variant="" dot>not selected</Pill></td><td><I name="dots" size={13} style={{ color: 'var(--ink-5)' }} /></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ProjectWorkingSet = ProjectWorkingSet;
