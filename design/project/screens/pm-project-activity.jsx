// PM · Project page · Activity feed tab
// Chronological mixed feed: stock transactions, status changes, MTO edits, approvals, photo uploads, comments.

function ProjectActivity({ density = 'default', collapsed = false, onToggleCollapse }) {
  const groups = [
    {
      day: 'Today · May 16',
      items: [
        { t: '14:32', who: 'A. Chen',     ico: 'edit',   tone: 'primary', label: 'Edited MTO line', detail: 'Raised cable qty 247.4 → 260 m on LL-01' },
        { t: '14:18', who: 'System',      ico: 'warn',   tone: 'warn',    label: 'MTO marked Modified after approval', detail: '2 changes since last approval · re-review pending' },
        { t: '11:24', who: 'D. Khoury',   ico: 'refresh', tone: 'warn',   label: 'Return logged', detail: '+8 m Top Rail · Pier 39 · audit flagged 1 m discrepancy' },
        { t: '09:18', who: 'R. Mathers',  ico: 'arrowUp', tone: 'primary', label: 'Issued 250 m cable', detail: 'CBL-SS-08-100 · SF Yard A → site · ticket HOT-2026-0834' },
        { t: '09:14', who: 'R. Mathers',  ico: 'arrowDown', tone: 'success', label: 'Received 200 m cable', detail: 'PO-0291 Helmsmiths → SF Yard A' },
        { t: '08:02', who: 'M. Ortega',   ico: 'package', tone: 'ink',    label: 'Photo added', detail: '2 photos · Progress · "north abutment cable layout"', photo: true },
      ],
    },
    {
      day: 'Yesterday · May 15',
      items: [
        { t: '17:14', who: 'A. Chen',     ico: 'check', tone: 'success', label: 'MTO approved', detail: 'by R. Mathers (admin) · 44 lines · $38,420' },
        { t: '17:11', who: 'A. Chen',     ico: 'upload', tone: 'primary', label: 'Submitted for approval', detail: 'with 2 substitutions and 1 qty override flagged' },
        { t: '14:05', who: 'A. Chen',     ico: 'plus',  tone: 'primary', label: 'Added System Instance', detail: 'GR-01 · Modular Guardrail 1.1m · 186 m straight' },
        { t: '11:24', who: 'A. Chen',     ico: 'edit',  tone: 'ink',     label: 'Comment on LL-01', detail: '"Confirm substrate with site survey — possible mix of purlin and metal deck"' },
      ],
    },
    {
      day: 'May 13',
      items: [
        { t: '10:02', who: 'A. Chen',     ico: 'folder', tone: 'primary', label: 'Project created', detail: 'PRJ-2026-038 · Aurora Bridge — North Span · Caltrans D4 · due Aug 14' },
      ],
    },
  ];

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="projects" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Projects', 'Aurora Bridge — North Span', 'Activity']} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <Chip>PRJ-2026-038</Chip>
            <div className="pl-page-title">Aurora Bridge — North Span</div>
            <HiVis>Modified · 2h ago</HiVis>
          </div>
        </div>
        <div className="pl-tabs">
          <div className="pl-tab">Overview</div>
          <div className="pl-tab">Systems<span className="pl-tab-count">4</span></div>
          <div className="pl-tab">MTO<span className="pl-tab-count">44</span></div>
          <div className="pl-tab">Photos<span className="pl-tab-count">14</span></div>
          <div className="pl-tab is-active">Activity<span className="pl-tab-count">86</span></div>
        </div>

        <div className="pl-filterbar">
          <Seg items={['All', 'MTO', 'Stock', 'Approvals', 'Photos', 'Comments']} active="All" />
          <button className="pl-filter-chip">Who <span className="pl-filter-val">Everyone</span> <I name="chev" size={11} /></button>
          <button className="pl-filter-chip">Range <span className="pl-filter-val">Last 30 days</span> <I name="chev" size={11} /></button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
            <Btn size="sm" ico="download" variant="ghost">Export feed</Btn>
          </div>
        </div>

        <div className="pl-scroll" style={{ padding: '18px 24px 24px', background: 'var(--surface)' }}>
          {groups.map((g, gi) => (
            <div key={gi} style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{g.day}</span>
                <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                <span style={{ fontSize: 11, color: 'var(--ink-5)' }} className="tnum">{g.items.length} events</span>
              </div>
              <div style={{ position: 'relative' }}>
                {/* vertical rail */}
                <span style={{ position: 'absolute', left: 12, top: 8, bottom: 8, width: 1, background: 'var(--line)' }} />
                {g.items.map((it, i) => <ActivityRow key={i} {...it} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ t, who, ico, tone, label, detail, photo }) {
  const toneColor = { primary: 'var(--primary)', success: 'var(--success)', warn: 'var(--hivis-ink)', ink: 'var(--ink-3)' }[tone];
  const toneBg    = { primary: 'var(--primary-soft)', success: 'var(--success-soft)', warn: 'var(--hivis-soft)', ink: 'var(--surface-2)' }[tone];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '54px 24px 1fr auto', alignItems: 'flex-start', gap: 10, padding: '10px 0', position: 'relative' }}>
      <span className="mono tnum" style={{ fontSize: 11, color: 'var(--ink-4)', textAlign: 'right', paddingTop: 6 }}>{t}</span>
      <span style={{ width: 24, height: 24, borderRadius: 12, background: toneBg, color: toneColor, display: 'grid', placeItems: 'center', zIndex: 1, border: '2px solid var(--surface)' }}>
        <I name={ico} size={12} />
      </span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>
          <span style={{ color: 'var(--ink-2)' }}>{who}</span>
          <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}> · {label}</span>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 1 }}>{detail}</div>
        {photo && (
          <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
            <div className="pl-img-ph" style={{ width: 110, height: 70 }}>photo · 14:32</div>
            <div className="pl-img-ph" style={{ width: 110, height: 70 }}>photo · 14:33</div>
          </div>
        )}
      </div>
      <I name="dots" size={13} style={{ color: 'var(--ink-5)', marginTop: 8 }} />
    </div>
  );
}

window.ProjectActivity = ProjectActivity;
