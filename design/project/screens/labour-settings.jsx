// Screen 11 — Settings → Labour (admin · phase CRUD + rates + tenant currency)

function LabourSettings({ density = 'default', collapsed = false, onToggleCollapse }) {
  const phases = [
    { key: 'fabrication',   label: 'Fabrication',   rate: 45,  crew: 2, color: 'fab',  desc: 'Off-site shop work · cutting, assembly, prep', used: 124 },
    { key: 'installation',  label: 'Installation',  rate: 45,  crew: 2, color: 'inst', desc: 'On-site mounting and assembly',                  used: 312 },
    { key: 'commissioning', label: 'Commissioning', rate: 60,  crew: 1, color: 'comm', desc: 'Testing, load-testing, certification handover', used: 89 },
    { key: 'inspection',    label: 'Inspection',    rate: 55,  crew: 1, color: 'insp', desc: 'Periodic re-inspection · often excluded from initial BoQ', used: 14, excluded: true },
  ];

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="settings" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Settings', 'Labour']} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <div className="pl-page-title">Labour settings</div>
            <Pill variant="info">tenant-wide</Pill>
            <div className="pl-page-actions">
              <Btn ico="history" variant="ghost">Rate history</Btn>
              <Btn ico="upload" variant="ghost">Import rates</Btn>
              <Btn variant="primary" ico="check">Save changes</Btn>
            </div>
          </div>
          <div className="pl-page-sub">Phases, default rates, crew sizes, currency, and rounding. Affects new projects only · existing projects retain pinned settings.</div>
        </div>

        {/* Tabs */}
        <div className="pl-tabs">
          <div className="pl-tab">General</div>
          <div className="pl-tab">Catalog</div>
          <div className="pl-tab">Rules &amp; helpers</div>
          <div className="pl-tab is-active">Labour</div>
          <div className="pl-tab">Substrates</div>
          <div className="pl-tab">Stock locations</div>
          <div className="pl-tab">Users &amp; roles</div>
        </div>

        <div className="pl-scroll" style={{ padding: '20px 24px 24px' }}>
          {/* CURRENCY + ROUNDING */}
          <div className="pl-card" style={{ marginBottom: 18 }}>
            <div className="pl-card-head">
              <div className="pl-card-title">Tenant defaults</div>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-4)' }}>applies to all phases unless overridden</span>
            </div>
            <div className="pl-meta" style={{ gridTemplateColumns: 'repeat(4, 1fr)', borderTop: 'none' }}>
              <div className="pl-meta-cell"><div className="pl-meta-label">Currency</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Select value="USD · United States Dollar" width={220} />
                  <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>applies to materials too</span>
                </div>
              </div>
              <div className="pl-meta-cell"><div className="pl-meta-label">Hours round-up</div>
                <Seg items={['none', '0.25 h', '0.5 h', '1 h']} active="0.25 h" />
              </div>
              <div className="pl-meta-cell"><div className="pl-meta-label">Show formulas in client PDF</div>
                <Seg items={['hide', 'show']} active="hide" />
              </div>
              <div className="pl-meta-cell"><div className="pl-meta-label">Inspection in totals</div>
                <Seg items={['exclude', 'include']} active="exclude" />
              </div>
            </div>
          </div>

          {/* PHASES */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Phases</div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>Referenced by rules via their key. Renaming a phase doesn't break rules.</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <Btn size="sm" ico="history" variant="ghost">View change log</Btn>
              <Btn size="sm" ico="plus">Add phase</Btn>
            </div>
          </div>

          <div className="pl-card" style={{ overflow: 'hidden', marginBottom: 18 }}>
            <table className="pl-table">
              <thead>
                <tr>
                  <th style={{ width: 22 }}></th>
                  <th style={{ width: 40 }}>Color</th>
                  <th style={{ width: 130 }}>Key</th>
                  <th style={{ width: 160 }}>Label</th>
                  <th>Description</th>
                  <th className="num" style={{ width: 110 }}>Default rate</th>
                  <th className="num" style={{ width: 90 }}>Crew size</th>
                  <th style={{ width: 100 }}>In totals</th>
                  <th style={{ width: 110 }}>Used by</th>
                  <th style={{ width: 28 }}></th>
                </tr>
              </thead>
              <tbody>
                {phases.map(p => (
                  <tr key={p.key}>
                    <td><svg width="9" height="13" viewBox="0 0 9 13" style={{ color: 'var(--ink-5)' }}><g fill="currentColor"><circle cx="2" cy="2" r="1.1"/><circle cx="7" cy="2" r="1.1"/><circle cx="2" cy="6.5" r="1.1"/><circle cx="7" cy="6.5" r="1.1"/><circle cx="2" cy="11" r="1.1"/><circle cx="7" cy="11" r="1.1"/></g></svg></td>
                    <td><span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: 4, background: PHASE_COLOR[p.key], border: '1px solid rgba(0,0,0,0.08)' }} /></td>
                    <td className="mono" style={{ color: 'var(--primary)', fontSize: 12 }}>{p.key}</td>
                    <td><span style={{ fontWeight: 500 }}>{p.label}</span></td>
                    <td style={{ color: 'var(--ink-4)', fontSize: 12 }}>{p.desc}</td>
                    <td className="num">
                      <span className="pl-input-group" style={{ width: 90 }}>
                        <input className="pl-input num-input" defaultValue={p.rate.toFixed(2)} style={{ width: '100%' }} />
                        <span className="pl-input-suffix">USD/h</span>
                      </span>
                    </td>
                    <td className="num">
                      <span className="pl-input-group" style={{ width: 64 }}>
                        <input className="pl-input num-input" defaultValue={p.crew} style={{ width: '100%' }} />
                      </span>
                    </td>
                    <td>{p.excluded ? <Pill variant="modified">excluded</Pill> : <Pill variant="approved" dot>included</Pill>}</td>
                    <td>
                      <div style={{ fontSize: 11.5 }}>
                        <span className="mono tnum" style={{ fontWeight: 500 }}>{p.used}</span>
                        <span style={{ color: 'var(--ink-5)' }}> rules</span>
                      </div>
                    </td>
                    <td><I name="dots" size={14} style={{ color: 'var(--ink-5)' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RATE OVERRIDES */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18 }}>
            <div className="pl-card" style={{ overflow: 'hidden' }}>
              <div className="pl-card-head">
                <div className="pl-card-title">Project-level rate overrides</div>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-4)' }}>set per project · sample of 3</span>
              </div>
              <table className="pl-table">
                <thead>
                  <tr>
                    <th style={{ width: 140 }}>Project</th>
                    <th>Reason</th>
                    <th style={{ width: 130 }}>Phase</th>
                    <th className="num" style={{ width: 100 }}>Default</th>
                    <th className="num" style={{ width: 110 }}>Override</th>
                    <th className="num" style={{ width: 80 }}>Δ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="mono" style={{ color: 'var(--ink-3)' }}>PRJ-2026-040</td>
                    <td>Remote site · travel premium</td>
                    <td><LabourPill phase="installation" /></td>
                    <td className="num mono">$45/h</td>
                    <td className="num mono" style={{ color: 'var(--hivis-ink)', fontWeight: 600 }}>$58/h</td>
                    <td className="num pl-var up">+29%</td>
                  </tr>
                  <tr>
                    <td className="mono" style={{ color: 'var(--ink-3)' }}>PRJ-2026-040</td>
                    <td>Overtime tier</td>
                    <td><LabourPill phase="fabrication" /></td>
                    <td className="num mono">$45/h</td>
                    <td className="num mono" style={{ color: 'var(--hivis-ink)', fontWeight: 600 }}>$67.50/h</td>
                    <td className="num pl-var up">+50%</td>
                  </tr>
                  <tr>
                    <td className="mono" style={{ color: 'var(--ink-3)' }}>PRJ-2026-038</td>
                    <td>Rope-access install</td>
                    <td><LabourPill phase="installation" /></td>
                    <td className="num mono">$45/h</td>
                    <td className="num mono" style={{ color: 'var(--hivis-ink)', fontWeight: 600 }}>$75/h</td>
                    <td className="num pl-var up">+67%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pl-card">
              <div className="pl-card-head">
                <div className="pl-card-title">Side-effects</div>
              </div>
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                  <I name="check" size={13} style={{ color: 'var(--success)', marginTop: 1 }} />
                  <span style={{ color: 'var(--ink-3)' }}>Rate changes apply to <span className="mono" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>new projects only</span>. Existing projects pin their rates at creation.</span>
                </div>
                <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                  <I name="check" size={13} style={{ color: 'var(--success)', marginTop: 1 }} />
                  <span style={{ color: 'var(--ink-3)' }}>Renaming a phase keeps its <span className="mono" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>key</span> stable; rules continue to resolve.</span>
                </div>
                <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                  <I name="warn" size={13} style={{ color: 'var(--hivis-ink)', marginTop: 1 }} />
                  <span style={{ color: 'var(--ink-3)' }}>Deleting a phase that has <span className="mono">references &gt; 0</span> blocked · move rules first.</span>
                </div>
                <div className="pl-divider" />
                <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>Inspection currently excluded from totals — 14 rules reference it but its hours don't show in client BoQ. Toggle above to include.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.LabourSettings = LabourSettings;
