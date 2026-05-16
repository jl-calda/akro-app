// Cross-project Schedule (top-level nav · PM/Admin/Estimator)

function CrossSchedule({ density = 'default', collapsed = false, onToggleCollapse }) {
  const projects = [
    {
      code: 'PRJ-2026-038', name: 'Aurora Bridge — North Span', tasks: [
        { name: 'Lifeline · install',      start: 9,  end: 24, status: 'in_progress', progress: 56, photos: 8 },
        { name: 'Guardrail · prep',        start: 9,  end: 13, status: 'in_progress', progress: 60, photos: 4 },
        { name: 'Guardrail · install',     start: 14, end: 22, status: 'blocked',     progress: 8,  photos: 0 },
        { name: 'Commissioning',           start: 26, end: 30, status: 'not_started', progress: 0,  photos: 0 },
      ],
    },
    {
      code: 'PRJ-2026-041', name: 'Bayport Refinery Catwalks', tasks: [
        { name: 'Anchor install · west',   start: 6,  end: 12, status: 'done',        progress: 100, photos: 7 },
        { name: 'Anchor install · east',   start: 13, end: 19, status: 'in_progress', progress: 38, photos: 5 },
        { name: 'Commissioning',           start: 20, end: 24, status: 'ready',       progress: 0,  photos: 0 },
      ],
    },
    {
      code: 'PRJ-2026-040', name: 'Cypress Wind Farm — Tower 14', tasks: [
        { name: 'Tower lifeline · top',    start: 10, end: 16, status: 'on_hold',     progress: 0,  photos: 1 },
        { name: 'Ladder fall arrest',      start: 14, end: 22, status: 'ready',       progress: 0,  photos: 0 },
      ],
    },
    {
      code: 'PRJ-2026-042', name: 'Pier 39 Maintenance Access', tasks: [
        { name: 'Ladder install',          start: 18, end: 28, status: 'not_started', progress: 0,  photos: 0 },
        { name: 'Guardrail · install',     start: 22, end: 33, status: 'not_started', progress: 0,  photos: 0 },
      ],
    },
    {
      code: 'PRJ-2026-037', name: 'Greenline Light Rail Depot', tasks: [
        { name: 'Rigid lifeline install',  start: 24, end: 36, status: 'not_started', progress: 0,  photos: 0 },
      ],
    },
  ];

  const statusMeta = {
    not_started: { bar: '#CBD5E1' },
    ready:       { bar: '#0F766E' },
    blocked:     { bar: '#B91C1C' },
    in_progress: { bar: '#1E40AF' },
    done:        { bar: '#475569' },
    on_hold:     { bar: '#A16B3B' },
  };

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="schedule" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Schedule']} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <div className="pl-page-title">Schedule</div>
            <Pill variant="info">5 projects · 14 tasks</Pill>
            <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>May 11 → Jun 22 · 6 weeks</span>
            <div className="pl-page-actions">
              <Btn ico="download" variant="ghost">Export</Btn>
              <Btn ico="filter">Save view</Btn>
            </div>
          </div>
        </div>

        <div className="pl-filterbar" style={{ gap: 10 }}>
          <Seg items={['Calendar', 'Gantt', 'List']} active="Gantt" />
          <Seg items={['Week', 'Month']} active="Month" />
          <button className="pl-filter-chip is-active">Active projects only <I name="check" size={11} /></button>
          <button className="pl-filter-chip">Assignee <span className="pl-filter-val">Any</span> <I name="chev" size={11} /></button>
          <button className="pl-filter-chip">Phase <span className="pl-filter-val">All</span> <I name="chev" size={11} /></button>
          <button className="pl-filter-chip">Status <span className="pl-filter-val">Active</span> <I name="chev" size={11} /></button>
          <div style={{ marginLeft: 'auto' }}><ScheduleLegend /></div>
        </div>

        <div style={{ overflow: 'auto', flex: 1, background: 'var(--surface)' }}>
          <CrossGantt projects={projects} statusMeta={statusMeta} />
        </div>
      </div>
    </div>
  );
}

function CrossGantt({ projects, statusMeta }) {
  const days = Array.from({ length: 42 }).map((_, i) => i);
  const colW = 30;
  const labelW = 320;
  const rowH = 30;
  const todayIdx = 16;
  const startMonday = 7;
  const isWeekend = (i) => ((i - startMonday) % 7 === 5) || ((i - startMonday) % 7 === 6);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `${labelW}px 1fr`, minWidth: labelW + days.length * colW }}>
      {/* Header sticky */}
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--surface)', borderBottom: '1px solid var(--line-2)', borderRight: '1px solid var(--line-2)', padding: '10px 14px' }}>
        <div style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Project · Task</div>
      </div>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--surface)', borderBottom: '1px solid var(--line-2)' }}>
        <div style={{ display: 'flex', height: 22, borderBottom: '1px solid var(--line)' }}>
          {Array.from({ length: 6 }).map((_, w) => (
            <div key={w} style={{ width: colW * 7, padding: '0 10px', fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, display: 'flex', alignItems: 'center', borderRight: '1px solid var(--line)' }}>
              May {String(11 + w * 7).padStart(2, '0')}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', height: 22 }}>
          {days.map(d => (
            <div key={d} style={{ width: colW, borderRight: '1px solid var(--line)', background: isWeekend(d) ? 'var(--bg-2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'var(--ink-5)', fontFamily: 'var(--font-mono)' }}>
              {(((d - startMonday + 70) % 31) + 1)}
            </div>
          ))}
        </div>
      </div>

      {projects.map(p => (
        <React.Fragment key={p.code}>
          {/* project header row */}
          <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--line-2)', borderRight: '1px solid var(--line-2)', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Chip>{p.code}</Chip>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
          </div>
          <div style={{ background: 'var(--bg-2)', borderBottom: '1px solid var(--line-2)', position: 'relative' }}>
            <span style={{ position: 'absolute', left: todayIdx * colW + colW / 2, top: 0, bottom: 0, width: 2, background: 'var(--primary)', opacity: 0.7 }} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none' }}>
              {days.map(d => <span key={d} style={{ width: colW, borderRight: '1px solid var(--line)', background: isWeekend(d) ? 'rgba(0,0,0,0.02)' : 'transparent' }} />)}
            </div>
          </div>

          {p.tasks.map((t, i) => (
            <React.Fragment key={i}>
              <div style={{ padding: '6px 14px 6px 28px', borderBottom: '1px solid var(--line)', borderRight: '1px solid var(--line-2)', height: rowH, display: 'flex', alignItems: 'center', minWidth: 0 }}>
                <span style={{ fontSize: 12, color: 'var(--ink-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                {t.photos > 0 && <span style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--ink-5)' }}>📷 {t.photos}</span>}
              </div>
              <div style={{ position: 'relative', borderBottom: '1px solid var(--line)', height: rowH }}>
                <span style={{ position: 'absolute', left: todayIdx * colW + colW / 2, top: 0, bottom: 0, width: 2, background: 'var(--primary)', opacity: 0.6, zIndex: 1 }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none' }}>
                  {days.map(d => <span key={d} style={{ width: colW, borderRight: '1px solid var(--line)', background: isWeekend(d) ? 'var(--bg-2)' : 'transparent' }} />)}
                </div>
                <div style={{ position: 'absolute', left: t.start * colW + 1, top: 5, width: (t.end - t.start + 1) * colW - 2, height: rowH - 10, background: statusMeta[t.status].bar, borderRadius: 3, fontSize: 10, color: '#fff', display: 'flex', alignItems: 'center', padding: '0 6px', gap: 4, opacity: t.status === 'on_hold' ? 0.75 : 1, zIndex: 2 }}>
                  <span className="mono tnum" style={{ fontWeight: 600 }}>{t.progress}%</span>
                  {t.photos > 0 && <span style={{ marginLeft: 'auto', fontSize: 9 }}>📷 {t.photos}</span>}
                </div>
              </div>
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

window.CrossSchedule = CrossSchedule;
