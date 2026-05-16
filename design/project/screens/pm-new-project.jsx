// PM · New Project wizard (multi-step: Info → System Instance → Done)

function NewProjectWizard({ density = 'default', collapsed = false, onToggleCollapse, step = 2 }) {
  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="projects" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Projects', 'New project']} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Step {step} of 3</div>
              <div className="pl-page-title">{step === 1 ? 'Project details' : step === 2 ? 'Add first System Instance' : 'Done'}</div>
            </div>
            <div className="pl-page-actions">
              <Btn variant="ghost">Save &amp; close</Btn>
              <Btn ico="chevL">Back</Btn>
              <Btn variant="primary" ico="arrowR" suffix="arrowR">{step === 3 ? 'Open project' : step === 2 ? 'Finish' : 'Continue'}</Btn>
            </div>
          </div>
        </div>

        {/* progress rail */}
        <div style={{ padding: '14px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {['Project info', 'First System Instance', 'Confirm'].map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 20, height: 20, borderRadius: 10, background: i + 1 < step ? 'var(--success)' : i + 1 === step ? 'var(--primary)' : 'var(--surface-2)', color: i + 1 <= step ? '#fff' : 'var(--ink-4)', border: i + 1 === step ? '0' : i + 1 > step ? '1px solid var(--line)' : '0', display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                    {i + 1 < step ? <I name="check" size={11} style={{ stroke: '#fff', strokeWidth: 2.6 }} /> : i + 1}
                  </span>
                  <span style={{ fontSize: 12.5, fontWeight: i + 1 === step ? 600 : 500, color: i + 1 === step ? 'var(--ink)' : i + 1 < step ? 'var(--ink-3)' : 'var(--ink-5)' }}>{s}</span>
                </div>
                {i < 2 && <span style={{ flex: 0, width: 60, height: 1, background: 'var(--line)' }} />}
              </React.Fragment>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--ink-4)' }}>You can skip the System Instance and add later.</span>
          </div>
        </div>

        <div className="pl-scroll" style={{ padding: '22px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {/* Project info recap (filled) */}
            <div className="pl-card">
              <div className="pl-card-head">
                <div className="pl-card-title">Project info</div>
                <Pill variant="approved" dot>complete</Pill>
                <span style={{ marginLeft: 'auto' }}><I name="edit" size={13} style={{ color: 'var(--ink-5)' }} /></span>
              </div>
              <div className="pl-meta" style={{ gridTemplateColumns: '1fr 1fr', borderTop: 'none', borderBottom: 'none' }}>
                <div className="pl-meta-cell"><div className="pl-meta-label">Name</div><div className="pl-meta-value">Aurora Bridge — North Span</div></div>
                <div className="pl-meta-cell"><div className="pl-meta-label">Code</div><div className="pl-meta-value mono">PRJ-2026-046</div></div>
                <div className="pl-meta-cell"><div className="pl-meta-label">Client</div><div className="pl-meta-value">Caltrans D4</div></div>
                <div className="pl-meta-cell"><div className="pl-meta-label">Location</div><div className="pl-meta-value">San Francisco, CA</div></div>
                <div className="pl-meta-cell"><div className="pl-meta-label">Site contact</div><div className="pl-meta-value">M. Ortega · +1 415 555 0142</div></div>
                <div className="pl-meta-cell"><div className="pl-meta-label">Needed by</div><div className="pl-meta-value mono">Aug 14, 2026</div></div>
                <div className="pl-meta-cell"><div className="pl-meta-label">Status</div><div><Pill variant="draft" dot>Draft</Pill></div></div>
                <div className="pl-meta-cell">
                  <div className="pl-meta-label">Assignments</div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5 }}>
                      <span style={{ width: 18, height: 18, borderRadius: 9, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 600 }}>AC</span>
                      A. Chen <span style={{ color: 'var(--ink-5)' }}>(PM)</span>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5 }}>
                      <span style={{ width: 18, height: 18, borderRadius: 9, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 600 }}>JS</span>
                      J. Sanchez <span style={{ color: 'var(--ink-5)' }}>(foreman)</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick-start prompt */}
            <div className="pl-card" style={{ background: 'var(--primary-soft)', borderColor: 'var(--primary-line)' }}>
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <I name="cube" size={14} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>Add your first System Instance</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-3)', lineHeight: 1.5 }}>
                  A project usually starts with one System (e.g. Lifeline). You can add more later from the project's <span className="mono">Systems</span> tab. Use the form below or skip and add later.
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                  <Btn size="sm" variant="ghost">Skip · I'll add later</Btn>
                  <Btn size="sm">Duplicate from existing instance</Btn>
                </div>
              </div>
            </div>
          </div>

          {/* Inline System Instance form (compact subset of full builder) */}
          <div style={{ marginTop: 18 }}>
            <div className="pl-card">
              <div className="pl-card-head">
                <Chip>LL-01</Chip>
                <div className="pl-card-title">System Instance · #1</div>
                <Pill variant="info">draft</Pill>
                <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  <span className="pl-link" style={{ fontSize: 11.5 }}>Open in full builder</span>
                  <I name="x" size={14} style={{ color: 'var(--ink-5)' }} />
                </span>
              </div>
              <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                <div>
                  <div className="pl-label">System</div>
                  <Select value="Lifeline" width="100%" />
                </div>
                <div>
                  <div className="pl-label">Shape</div>
                  <Select value="Segmented · 3 segments" width="100%" />
                </div>
                <div>
                  <div className="pl-label">Substrate</div>
                  <Select value="Steel I-beam" width="100%" />
                </div>
                <div>
                  <div className="pl-label">Model</div>
                  <Select value="Cable 8mm SS316 · v3" width="100%" />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div className="pl-label">Total length (sum of segments)</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <NumInput value="247.4" unit="m" width={140} />
                    <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>3 segments · 82 + 94.4 + 71 m · 2 corners 102° / 178°</span>
                    <span style={{ marginLeft: 'auto' }}><Pill variant="info">parameters · 4 of 5</Pill></span>
                  </div>
                </div>
              </div>
              <div style={{ padding: '10px 16px', borderTop: '1px solid var(--line)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--ink-3)' }}>
                <I name="refresh" size={13} style={{ color: 'var(--primary)' }} />
                <span><span className="mono tnum" style={{ fontWeight: 600 }}>$9,840</span> est · <span className="mono tnum">14</span> material lines · <span className="mono tnum">24.6 h</span> labour</span>
                <span style={{ marginLeft: 'auto' }}><HiVis>user.count missing</HiVis></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.NewProjectWizard = NewProjectWizard;
