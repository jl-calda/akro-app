// Project · Schedule tab · Kanban view (sibling of Gantt screen)

function ProjectScheduleKanban({ density = 'default', collapsed = false, onToggleCollapse }) {
  const cols = [
    { key: 'not_started', label: 'Not Started', tone: '#94A3B8', bg: 'transparent' },
    { key: 'ready',       label: 'Ready',       tone: '#0F766E', bg: 'rgba(15,118,110,0.04)' },
    { key: 'blocked',     label: 'Blocked',     tone: '#B91C1C', bg: 'rgba(185,28,28,0.04)' },
    { key: 'in_progress', label: 'In Progress', tone: '#1E40AF', bg: 'rgba(30,64,175,0.04)' },
    { key: 'on_hold',     label: 'On Hold',     tone: '#A16B3B', bg: 'rgba(161,107,59,0.05)' },
    { key: 'done',        label: 'Done',        tone: '#475569', bg: 'rgba(71,85,105,0.05)' },
  ];

  const cards = [
    // Not Started
    { col: 'not_started', name: 'Commissioning + load test',  inst: 'Lifeline · LL-01', phase: 'commissioning', due: 'May 30', assignee: 'AC', photos: 0, progress: 0 },
    { col: 'not_started', name: 'Hand-over inspection',       inst: 'Guardrail · GR-01', phase: 'commissioning', due: 'May 26', assignee: 'AC', photos: 0, progress: 0 },
    { col: 'not_started', name: 'Pull-test + cert',           inst: 'Anchor Point · AP-01', phase: 'commissioning', due: 'Jun 05', assignee: 'AC', photos: 0, progress: 0 },

    // Ready
    { col: 'ready', name: 'Mid-span anchor inspection', milestone: true, inst: 'Lifeline · LL-01', phase: 'inspection', due: 'May 21', assignee: 'AC', photos: 0, progress: 0 },
    { col: 'ready', name: 'Anchor install · east',      inst: 'Bayport (other project)', phase: 'installation', due: 'May 22', assignee: 'JS', photos: 0, progress: 0, foreign: true },

    // Blocked
    { col: 'blocked', name: 'Post + rail install', inst: 'Guardrail · GR-01', phase: 'installation', due: 'May 22', assignee: 'JS', photos: 0, progress: 8, blockReason: 'short 14 × GR-RAIL-2M-G · ETA May 22' },

    // In Progress
    { col: 'in_progress', name: 'On-site cable + stanchion install', inst: 'Lifeline · LL-01', phase: 'installation', due: 'May 28', assignee: 'JS', photos: 8, progress: 56 },
    { col: 'in_progress', name: 'Site prep · survey + drilling',     inst: 'Guardrail · GR-01', phase: 'fabrication', due: 'May 16', assignee: 'JS', photos: 4, progress: 60 },

    // On Hold
    { col: 'on_hold', name: 'Type-A anchor install', inst: 'Anchor Point · AP-01', phase: 'installation', due: 'May 28', assignee: 'JS', photos: 1, progress: 0, onHoldReason: 'awaiting structural sign-off' },

    // Done
    { col: 'done', name: 'Termination kits · fabrication', inst: 'Lifeline · LL-01', phase: 'fabrication', due: 'May 13', assignee: 'RM', photos: 3, progress: 100 },
  ];

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="projects" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Projects', 'Aurora Bridge — North Span', 'Schedule']} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <Chip>PRJ-2026-038</Chip>
            <div className="pl-page-title">Aurora Bridge — North Span</div>
            <Pill variant="approved" dot>Awarded</Pill>
            <div className="pl-page-actions">
              <Btn ico="download" variant="ghost">Export schedule</Btn>
              <Btn ico="plus">New task</Btn>
              <Btn variant="primary" ico="refresh">Re-apply template</Btn>
            </div>
          </div>
        </div>

        <div className="pl-tabs">
          <div className="pl-tab">Overview</div>
          <div className="pl-tab">Quotes<span className="pl-tab-count">2</span></div>
          <div className="pl-tab">Working Set<span className="pl-tab-count">3</span></div>
          <div className="pl-tab">MTO<span className="pl-tab-count">32</span></div>
          <div className="pl-tab is-active">Schedule<span className="pl-tab-count">12</span></div>
          <div className="pl-tab">Photos<span className="pl-tab-count">28</span></div>
          <div className="pl-tab">Activity<span className="pl-tab-count">86</span></div>
        </div>

        <div className="pl-filterbar" style={{ gap: 10 }}>
          <Seg items={['Gantt', 'Kanban', 'List']} active="Kanban" />
          <span style={{ color: 'var(--ink-5)' }}>·</span>
          <button className="pl-filter-chip">Phase <span className="pl-filter-val">All</span> <I name="chev" size={11} /></button>
          <button className="pl-filter-chip">Assignee <span className="pl-filter-val">Any</span> <I name="chev" size={11} /></button>
          <button className="pl-filter-chip">Instance <span className="pl-filter-val">All</span> <I name="chev" size={11} /></button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--ink-4)' }}>
            <span style={{ fontSize: 11.5 }}>Cards are auto-derived · use the menu to flip Done or toggle On Hold</span>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: '14px 14px 18px', background: 'var(--bg)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(260px, 1fr))', gap: 12, minWidth: 1600 }}>
            {cols.map(c => {
              const colCards = cards.filter(card => card.col === c.key);
              return (
                <div key={c.key} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px 10px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: c.tone }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{c.label}</span>
                    <span className="mono tnum" style={{ fontSize: 11, color: 'var(--ink-4)', background: 'var(--surface-2)', border: '1px solid var(--line)', padding: '1px 6px', borderRadius: 9 }}>{colCards.length}</span>
                    <span style={{ marginLeft: 'auto' }}><I name="plus" size={12} style={{ color: 'var(--ink-5)' }} /></span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, padding: 8, background: c.bg, borderRadius: 6, border: '1px dashed var(--line)' }}>
                    {colCards.map((card, i) => (
                      <KanbanCard key={i} card={card} columnTone={c.tone} />
                    ))}
                    {colCards.length === 0 && (
                      <div style={{ padding: 16, textAlign: 'center', fontSize: 11.5, color: 'var(--ink-5)' }}>No tasks</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function KanbanCard({ card, columnTone }) {
  return (
    <div className="pl-card" style={{ padding: 10, background: 'var(--surface)', borderColor: 'var(--line)', cursor: 'pointer', borderLeft: '3px solid ' + columnTone, borderRadius: 4 }}>
      {/* Top: phase + foreign / milestone / menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        {card.phase && <LabourPill phase={card.phase} />}
        {card.milestone && <Pill variant="info">milestone</Pill>}
        {card.foreign && <Pill variant="modified">other project</Pill>}
        <span style={{ marginLeft: 'auto' }}><I name="dots" size={12} style={{ color: 'var(--ink-5)' }} /></span>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, color: 'var(--ink), letterSpacing: -0.005em' }}>{card.name}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>{card.inst}</div>

      {/* Progress bar */}
      {card.col !== 'done' && card.col !== 'not_started' && (
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <ProgressBar value={card.progress} max={100} tone={card.col === 'in_progress' ? '' : card.col === 'blocked' ? 'danger' : card.col === 'on_hold' ? 'warn' : ''} />
          <span className="mono tnum" style={{ fontSize: 10.5, color: 'var(--ink-4)', width: 30, textAlign: 'right' }}>{card.progress}%</span>
        </div>
      )}

      {/* Block / on-hold note */}
      {card.blockReason && (
        <div style={{ marginTop: 8, padding: '6px 8px', background: 'var(--danger-soft)', border: '1px solid #F4C0C0', borderRadius: 4, fontSize: 10.5, color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <I name="warn" size={11} />
          {card.blockReason}
        </div>
      )}
      {card.onHoldReason && (
        <div style={{ marginTop: 8, padding: '6px 8px', background: 'var(--hivis-soft)', border: '1px solid var(--hivis-line)', borderRadius: 4, fontSize: 10.5, color: 'var(--hivis-ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="2" y="1" width="2" height="8" /><rect x="6" y="1" width="2" height="8" /></svg>
          {card.onHoldReason}
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--ink-4)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
          <span className="mono">{card.due}</span>
        </span>
        {card.photos > 0 && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>📷 <span className="mono tnum">{card.photos}</span></span>
        )}
        <span style={{ marginLeft: 'auto', width: 22, height: 22, borderRadius: 11, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 600, color: 'var(--ink-3)' }}>{card.assignee}</span>
        {card.col === 'in_progress' && (
          <button style={{ height: 22, padding: '0 8px', borderRadius: 4, background: 'var(--success)', color: '#fff', border: 'none', fontFamily: 'inherit', fontSize: 10.5, fontWeight: 600 }}>Done</button>
        )}
      </div>
    </div>
  );
}

window.ProjectScheduleKanban = ProjectScheduleKanban;
