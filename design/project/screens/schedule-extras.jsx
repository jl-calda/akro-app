// Site Foreman · Task detail (mobile) + Project Photos tab (desktop)

function ForemanTask() {
  return (
    <div className="pl-mobile" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MStatus />
      <div className="pl-mobile-header">
        <div className="pl-mobile-back"><I name="chevL" size={16} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Chip>LL-inst</Chip>
            <Pill variant="info" dot>In Progress</Pill>
          </div>
          <h1 style={{ fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Cable + stanchion install</h1>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 200px' }}>
        {/* meta */}
        <div style={{ padding: 12, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, marginBottom: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11.5 }}>
            <div><div style={{ color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>Project</div><div style={{ fontWeight: 600 }}>Aurora Bridge</div></div>
            <div><div style={{ color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>Phase</div><div><LabourPill phase="installation" /></div></div>
            <div><div style={{ color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>Due</div><div className="mono" style={{ fontWeight: 600 }}>May 28 · 12 wd left</div></div>
            <div><div style={{ color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>Progress</div><div className="mono tnum" style={{ fontWeight: 700, fontSize: 16, color: 'var(--primary)' }}>56%</div></div>
          </div>
          <div style={{ marginTop: 10 }}>
            <ProgressBar value={56} max={100} />
          </div>
        </div>

        {/* CTA cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          <button style={{ height: 70, borderRadius: 10, background: 'var(--surface)', border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--ink-2)' }}>
            <I name="cert" size={18} style={{ color: 'var(--ink-3)' }} />
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>View instructions</span>
            <span style={{ fontSize: 10, color: 'var(--ink-5)' }}>3 reference photos</span>
          </button>
          <button style={{ height: 70, borderRadius: 10, background: 'var(--primary)', border: 'none', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, boxShadow: '0 4px 12px rgba(30,64,175,0.25)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="13" r="4" /></svg>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>Add photo</span>
            <span style={{ fontSize: 10, opacity: 0.85 }}>camera or library</span>
          </button>
        </div>

        {/* Attached materials (just info for installer) */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '4px 2px 6px' }}>
          <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Attached materials</span>
          <span style={{ fontSize: 11, color: 'var(--ink-5)' }} className="tnum">4 lines</span>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
          {[
            { th: '🪢', name: 'Cable, 7×19 SS316 ⌀8mm', need: '260 m', delivered: '250 m', short: true },
            { th: '📐', name: 'Stanchion, alu 450mm',  need: '31 pcs', delivered: '31 pcs' },
            { th: '🔧', name: 'Intermediate Anchor 12mm', need: '31 pcs', delivered: '28 pcs', short: true },
            { th: '🧷', name: 'End Termination Kit',  need: '6 kit',  delivered: '6 kit' },
          ].map((m, i) => (
            <div key={i} style={{ padding: '10px 12px', borderTop: i ? '1px solid var(--line)' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 16 }}>{m.th}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-4)' }} className="mono">need {m.need} · delivered <span style={{ color: m.short ? 'var(--hivis-ink)' : 'var(--success)' }}>{m.delivered}</span></div>
              </div>
              {m.short && <HiVis>short</HiVis>}
            </div>
          ))}
        </div>

        {/* My photos */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '4px 2px 6px' }}>
          <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>My progress photos · 8</span>
          <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 500 }}>See all</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[
            { p: 56, t: '13:42' },
            { p: 52, t: '09:14' },
            { p: 40, t: 'Yest' },
            { p: 28, t: 'May 14' },
            { p: 12, t: 'May 13' },
            { p: null, t: '+ add' },
          ].map((p, i) => (
            <div key={i} className="pl-img-ph" style={{ height: 90, position: 'relative' }}>
              {p.p !== null ? (
                <>
                  <span style={{ position: 'absolute', top: 4, left: 4, padding: '2px 6px', borderRadius: 3, background: 'rgba(15,23,42,0.7)', color: '#fff', fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{p.p}%</span>
                  <span style={{ position: 'absolute', bottom: 4, left: 4, fontSize: 10, color: 'var(--ink-3)' }} className="mono">{p.t}</span>
                </>
              ) : (
                <I name="plus" size={18} style={{ color: 'var(--ink-5)' }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky bottom: Mark done */}
      <div style={{ position: 'absolute', bottom: 68, left: 16, right: 16, display: 'flex', gap: 8 }}>
        <button style={{ flex: 1, height: 52, background: 'var(--surface)', color: 'var(--ink-2)', border: '1px solid var(--line-2)', borderRadius: 12, fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}>
          Quick update
        </button>
        <button style={{ flex: 1.4, height: 52, background: 'var(--success)', color: '#fff', border: 'none', borderRadius: 12, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 4px 14px rgba(15,118,110,0.3)' }}>
          <I name="check" size={16} />Mark task done
        </button>
      </div>

      <ForemanTabBar active="receipts" />
    </div>
  );
}

function ProjectPhotos({ density = 'default', collapsed = false, onToggleCollapse }) {
  const photos = [
    { id: 1, type: 'progress', task: 'LL · install', who: 'J. Sanchez', when: 'Today 13:42', cap: 'Mid-span anchor torque check', progress: 56 },
    { id: 2, type: 'progress', task: 'LL · install', who: 'J. Sanchez', when: 'Today 09:14', cap: 'Segment 2 cable pulled, pre-tension', progress: 52 },
    { id: 3, type: 'daily', task: null, who: 'M. Ortega', when: 'Today 08:02', cap: 'North abutment cable layout · weather clear' },
    { id: 4, type: 'progress', task: 'GR · prep', who: 'J. Sanchez', when: 'Today 07:48', cap: 'Drill rig in position, posts marked', progress: 60 },
    { id: 5, type: 'reference', task: 'LL · install', who: 'A. Chen', when: 'May 13', cap: 'Approved cable layout drawing (CAD-014)' },
    { id: 6, type: 'progress', task: 'LL · install', who: 'J. Sanchez', when: 'Yesterday', cap: 'North abutment end termination swaged', progress: 40 },
    { id: 7, type: 'daily', task: null, who: 'M. Ortega', when: 'Yesterday', cap: 'Site morning brief · 11 trades on site' },
    { id: 8, type: 'progress', task: 'GR · prep', who: 'J. Sanchez', when: 'May 14', cap: 'Trial drill on test purlin · 12 mm pilot' },
    { id: 9, type: 'progress', task: 'LL · install', who: 'J. Sanchez', when: 'May 14', cap: 'Stanchions 5–12 mounted', progress: 28 },
    { id: 10, type: 'reference', task: 'GR · install', who: 'A. Chen', when: 'May 12', cap: 'Reference: similar install Bayport' },
    { id: 11, type: 'progress', task: 'LL · install', who: 'J. Sanchez', when: 'May 13', cap: 'Layout marking from survey', progress: 12 },
    { id: 12, type: 'daily', task: null, who: 'M. Ortega', when: 'May 13', cap: 'Site survey crew arrival' },
  ];

  const typeChip = (t) => {
    if (t === 'progress')  return <Pill variant="info">progress</Pill>;
    if (t === 'reference') return <Pill variant="approved" dot>reference</Pill>;
    return <Pill>daily</Pill>;
  };

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="projects" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Projects', 'Aurora Bridge — North Span', 'Photos']} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <Chip>PRJ-2026-038</Chip>
            <div className="pl-page-title">Aurora Bridge — North Span</div>
            <Pill variant="approved" dot>Awarded</Pill>
            <div className="pl-page-actions">
              <Btn ico="download" variant="ghost">Download .zip</Btn>
              <Btn ico="upload">Add reference photo</Btn>
              <Btn variant="primary" ico="plus">Add daily photos</Btn>
            </div>
          </div>
        </div>

        <div className="pl-tabs">
          <div className="pl-tab">Overview</div>
          <div className="pl-tab">Quotes<span className="pl-tab-count">2</span></div>
          <div className="pl-tab">Working Set<span className="pl-tab-count">3</span></div>
          <div className="pl-tab">MTO<span className="pl-tab-count">32</span></div>
          <div className="pl-tab">Schedule<span className="pl-tab-count">12</span></div>
          <div className="pl-tab is-active">Photos<span className="pl-tab-count">28</span></div>
          <div className="pl-tab">Activity<span className="pl-tab-count">86</span></div>
        </div>

        {/* Filter bar */}
        <div className="pl-filterbar" style={{ gap: 10 }}>
          <Seg items={['All', 'Progress', 'Daily', 'Reference']} active="All" />
          <button className="pl-filter-chip">Task <span className="pl-filter-val">Any</span> <I name="chev" size={11} /></button>
          <button className="pl-filter-chip">Uploader <span className="pl-filter-val">Anyone</span> <I name="chev" size={11} /></button>
          <button className="pl-filter-chip is-active">Last 7 days <I name="x" size={11} /></button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>28 photos · 14 progress · 8 daily · 6 reference</span>
            <Seg items={['Grid', 'Timeline']} active="Grid" />
          </div>
        </div>

        <div className="pl-scroll" style={{ padding: '18px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {photos.map(p => (
              <div key={p.id} className="pl-card" style={{ overflow: 'hidden', cursor: 'pointer' }}>
                <div className="pl-img-ph" style={{ height: 150, borderRadius: 0, border: 'none', borderBottom: '1px solid var(--line)', position: 'relative' }}>
                  <span style={{ position: 'absolute', top: 6, left: 6 }}>{typeChip(p.type)}</span>
                  {p.progress != null && (
                    <span style={{ position: 'absolute', top: 6, right: 6, padding: '3px 7px', borderRadius: 3, background: 'rgba(15,23,42,0.78)', color: '#fff', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{p.progress}%</span>
                  )}
                </div>
                <div style={{ padding: '8px 10px' }}>
                  <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.cap}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 10.5, color: 'var(--ink-4)' }}>
                    {p.task && <Chip>{p.task}</Chip>}
                    <span style={{ marginLeft: p.task ? 'auto' : 0, fontFamily: 'var(--font-mono)' }}>{p.when}</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: 'var(--ink-5)', marginTop: 2 }}>{p.who}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ForemanTask, ProjectPhotos });
