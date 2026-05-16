// Project · Schedule tab (Gantt view + slide-in progress side panel)

function ProjectSchedule({ density = 'default', collapsed = false, onToggleCollapse, view = 'gantt' }) {
  // 6-week window, columns are days
  const days = Array.from({ length: 42 }).map((_, i) => i); // day index 0..41
  const startMonday = 7;   // index of the "first Monday" we label
  const todayIdx = 16;     // today marker at day 16

  // helper: build status pill from status key
  const statusMeta = {
    not_started: { label: 'Not Started', bg: '#E2E8F0', fg: '#475569', bar: '#CBD5E1' },
    ready:       { label: 'Ready',       bg: '#DDF1EE', fg: '#0F766E', bar: '#0F766E' },
    blocked:     { label: 'Blocked',     bg: '#FCE2E2', fg: '#B91C1C', bar: '#B91C1C' },
    in_progress: { label: 'In Progress', bg: '#EAF0FB', fg: '#1E40AF', bar: '#1E40AF' },
    done:        { label: 'Done',        bg: '#E4E8EE', fg: '#475569', bar: '#475569' },
    on_hold:     { label: 'On Hold',     bg: '#F1E7D9', fg: '#A16B3B', bar: '#A16B3B' },
    overdue:     { label: 'Overdue',     bg: '#FEF6C7', fg: '#713F12', bar: '#FACC15' },
  };

  const tasks = [
    { id: 'LL', umbrella: true, instance: 'Lifeline · LL-01', name: 'Lifeline #1 · Cable 8mm SS316', start: 4,  end: 30, phase: null,            assignee: null,        status: 'in_progress', progress: 42, photos: 11 },
    { id: 'LL-fab',  parent: 'LL', name: 'Termination kits · fabrication',         start: 4,  end: 7,  phase: 'fabrication',   assignee: 'RM',     status: 'done',        progress: 100, photos: 3 },
    { id: 'LL-inst', parent: 'LL', name: 'On-site cable + stanchion install',      start: 9,  end: 24, phase: 'installation',  assignee: 'JS',     status: 'in_progress', progress: 56,  photos: 8, ms: false },
    { id: 'LL-mid',  parent: 'LL', name: 'Mid-span anchor inspection', milestone: true, start: 18, end: 18, phase: 'inspection',   assignee: 'AC',     status: 'ready',       progress: 0,  photos: 0 },
    { id: 'LL-com',  parent: 'LL', name: 'Commissioning + load test',              start: 26, end: 30, phase: 'commissioning', assignee: 'AC',     status: 'not_started', progress: 0,   photos: 0 },

    { id: 'GR', umbrella: true, instance: 'Guardrail · GR-01', name: 'Guardrail #1 · Modular 1.1m', start: 9, end: 26, phase: null, assignee: null, status: 'ready', progress: 14, photos: 4 },
    { id: 'GR-prep', parent: 'GR', name: 'Site prep · survey + drilling',          start: 9,  end: 13, phase: 'fabrication',   assignee: 'JS',     status: 'in_progress', progress: 60, photos: 4 },
    { id: 'GR-inst', parent: 'GR', name: 'Post + rail install',                    start: 14, end: 22, phase: 'installation',  assignee: 'JS',     status: 'blocked',     progress: 8,  photos: 0, blockReason: 'short 14 GR-RAIL · ETA May 22' },
    { id: 'GR-com',  parent: 'GR', name: 'Hand-over inspection',                   start: 23, end: 26, phase: 'commissioning', assignee: 'AC',     status: 'not_started', progress: 0,  photos: 0 },

    { id: 'AP', umbrella: true, instance: 'Anchor Point · AP-01', name: 'Anchor Point #1 · variation', start: 22, end: 36, phase: null, assignee: null, status: 'on_hold', progress: 0, photos: 1 },
    { id: 'AP-inst', parent: 'AP', name: 'Type-A anchor install',                  start: 22, end: 28, phase: 'installation',  assignee: 'JS',     status: 'on_hold',     progress: 0,  photos: 1, onHoldReason: 'awaiting structural sign-off' },
    { id: 'AP-com',  parent: 'AP', name: 'Pull-test + cert',                       start: 30, end: 36, phase: 'commissioning', assignee: 'AC',     status: 'not_started', progress: 0,  photos: 0 },
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

        {/* Toolbar */}
        <div className="pl-filterbar" style={{ gap: 10 }}>
          <Seg items={['Gantt', 'Kanban', 'List']} active={view === 'kanban' ? 'Kanban' : view === 'list' ? 'List' : 'Gantt'} />
          <span style={{ color: 'var(--ink-5)' }}>·</span>
          <Seg items={['Day', 'Week', 'Month']} active="Day" />
          <button className="pl-filter-chip is-active">Apply working calendar <I name="check" size={11} /></button>
          <button className="pl-filter-chip">Phase <span className="pl-filter-val">All</span> <I name="chev" size={11} /></button>
          <button className="pl-filter-chip">Assignee <span className="pl-filter-val">Any</span> <I name="chev" size={11} /></button>
          <button className="pl-filter-chip">Status <span className="pl-filter-val">Active</span> <I name="chev" size={11} /></button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: 'var(--ink-4)' }}>
            <ScheduleLegend />
          </div>
        </div>

        {/* Gantt + side panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: 0, flex: 1, overflow: 'hidden' }}>
          {/* Gantt */}
          <div style={{ overflow: 'auto', background: 'var(--surface)' }}>
            <GanttChart days={days} startMonday={startMonday} todayIdx={todayIdx} tasks={tasks} statusMeta={statusMeta} />
          </div>

          {/* Side panel — for selected task LL-inst */}
          <ProgressSidePanel statusMeta={statusMeta} />
        </div>
      </div>
    </div>
  );
}

function ScheduleLegend() {
  const entries = [
    ['Ready',       '#0F766E'],
    ['In Progress', '#1E40AF'],
    ['Blocked',     '#B91C1C'],
    ['On Hold',     '#A16B3B'],
    ['Done',        '#475569'],
  ];
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {entries.map(([l, c]) => (
        <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 10, height: 6, background: c, borderRadius: 1 }} />
          <span>{l}</span>
        </span>
      ))}
    </div>
  );
}

function GanttChart({ days, startMonday, todayIdx, tasks, statusMeta }) {
  const colW = 32; // px per day
  const labelW = 320;
  const rowH = 36;
  const total = days.length;
  const chartW = total * colW;
  const isWeekend = (i) => ((i - startMonday) % 7 === 5) || ((i - startMonday) % 7 === 6);

  // Week header — group days into weeks; label every Monday
  const weeks = [];
  for (let i = 0; i < total; i += 7) {
    const monday = i + ((startMonday - i % 7 + 7) % 7) - (i === 0 ? 0 : 0);
    weeks.push({ start: i, label: `Week of May ${4 + Math.floor(i / 7) * 7 - (startMonday % 7)}`.replace('May 4', 'May 04') });
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: `${labelW}px 1fr`, minWidth: labelW + chartW }}>
      {/* Sticky header row */}
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--surface)', borderBottom: '1px solid var(--line-2)', borderRight: '1px solid var(--line-2)', padding: '10px 14px' }}>
        <div style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Task</div>
      </div>
      <div style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--surface)', borderBottom: '1px solid var(--line-2)' }}>
        {/* week strip */}
        <div style={{ display: 'flex', height: 22, borderBottom: '1px solid var(--line)' }}>
          {Array.from({ length: 6 }).map((_, w) => (
            <div key={w} style={{ width: colW * 7, padding: '0 10px', fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, display: 'flex', alignItems: 'center', borderRight: '1px solid var(--line)' }}>
              May {String(11 + w * 7).padStart(2, '0')}
            </div>
          ))}
        </div>
        {/* day strip */}
        <div style={{ display: 'flex', height: 26, position: 'relative' }}>
          {days.map(d => (
            <div key={d} style={{ width: colW, borderRight: '1px solid var(--line)', background: isWeekend(d) ? 'var(--bg-2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10.5, color: isWeekend(d) ? 'var(--ink-5)' : 'var(--ink-4)', fontFamily: 'var(--font-mono)' }}>
              {(((d - startMonday + 70) % 31) + 1)}
            </div>
          ))}
        </div>
      </div>

      {/* Rows */}
      {tasks.map(t => (
        <React.Fragment key={t.id}>
          {/* Label cell */}
          <div style={{ borderBottom: '1px solid var(--line)', borderRight: '1px solid var(--line-2)', padding: '6px 14px 6px ' + (t.parent ? 28 : 14) + 'px', height: rowH, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            {t.umbrella && <I name="cube" size={12} style={{ color: 'var(--ink-3)' }} />}
            {t.parent && <span style={{ fontSize: 11.5, color: 'var(--ink-5)' }} className="mono">└</span>}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: t.umbrella ? 13 : 12.5, fontWeight: t.umbrella ? 600 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
              {t.parent && t.phase && (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 1 }}>
                  <LabourPill phase={t.phase} />
                  {t.photos > 0 && <span style={{ fontSize: 10.5, color: 'var(--ink-5)', display: 'inline-flex', alignItems: 'center', gap: 2 }}>📷 {t.photos}</span>}
                </div>
              )}
            </div>
            {t.assignee && <span style={{ width: 22, height: 22, borderRadius: 11, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 600, color: 'var(--ink-3)' }}>{t.assignee}</span>}
          </div>
          {/* Bar cell */}
          <div style={{ position: 'relative', borderBottom: '1px solid var(--line)', height: rowH, background: 'transparent' }}>
            {/* day-column grid */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', pointerEvents: 'none' }}>
              {days.map(d => (
                <span key={d} style={{ width: colW, borderRight: '1px solid var(--line)', background: isWeekend(d) ? 'var(--bg-2)' : 'transparent' }} />
              ))}
            </div>
            {/* today marker */}
            <span style={{ position: 'absolute', left: todayIdx * colW + colW / 2, top: 0, bottom: 0, width: 2, background: 'var(--primary)', opacity: 0.7, zIndex: 1 }} />
            {/* the bar */}
            <TaskBar task={t} colW={colW} rowH={rowH} todayIdx={todayIdx} statusMeta={statusMeta} />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function TaskBar({ task, colW, rowH, todayIdx, statusMeta }) {
  const s = statusMeta[task.status];
  const x = task.start * colW;
  const w = Math.max(colW * 0.6, (task.end - task.start + 1) * colW - 2);
  const top = 6;
  const h = rowH - 12;

  if (task.milestone) {
    return (
      <span style={{ position: 'absolute', left: x + colW / 2 - 8, top: top + 1, width: 16, height: 16, transform: 'rotate(45deg)', background: task.status === 'done' ? '#475569' : 'transparent', border: '1.5px solid #475569', zIndex: 2 }} title={task.name} />
    );
  }

  return (
    <div style={{ position: 'absolute', left: x + 1, top, width: w, height: h, background: s.bar, color: '#fff', borderRadius: 3, fontSize: 10.5, padding: '0 6px', display: 'flex', alignItems: 'center', gap: 6, zIndex: 2, overflow: 'hidden', opacity: task.status === 'on_hold' ? 0.75 : 1 }}>
      {task.status === 'on_hold' && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><rect x="2" y="1" width="2" height="8" /><rect x="6" y="1" width="2" height="8" /></svg>
      )}
      <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{Math.round(task.progress)}%</span>
      {/* progress overlay */}
      <span style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: (task.progress / 100) * w, background: 'rgba(255,255,255,0.18)', pointerEvents: 'none' }} />
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', opacity: 0.92 }}>{task.umbrella ? task.instance : ''}</span>
      {task.photos > 0 && <span style={{ fontSize: 9.5, fontWeight: 500 }}>📷 {task.photos}</span>}
      {task.status === 'blocked' && <span style={{ background: 'var(--hivis)', color: '#1E1B0B', fontSize: 9, padding: '1px 5px', borderRadius: 2, fontWeight: 600 }}>SHORT</span>}
    </div>
  );
}

function ProgressSidePanel({ statusMeta }) {
  return (
    <div style={{ background: 'var(--surface)', borderLeft: '1px solid var(--line-2)', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div style={{ padding: '16px 18px 14px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Chip>LL-inst</Chip>
          <Pill variant="info" dot>In Progress</Pill>
          <button style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--ink-5)', cursor: 'pointer' }}><I name="x" /></button>
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>On-site cable + stanchion install</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
          <LabourPill phase="installation" />
          <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>Lifeline · LL-01 · J. Sanchez</span>
        </div>
        <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 4, fontSize: 11.5, color: 'var(--ink-3)' }}>
          May 13 → May 28 · 12 working days · <span className="mono tnum" style={{ fontWeight: 600, color: 'var(--ink-2)' }}>56%</span> complete
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
          <Btn size="sm" ico="edit" variant="ghost">Edit task</Btn>
          <Btn size="sm" ico="upload">Add reference photo</Btn>
          <span style={{ marginLeft: 'auto' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 8px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 5, fontSize: 11.5 }}>
              <I name="warn" size={11} style={{ color: 'var(--hivis-ink)' }} />
              On hold
              <span style={{ width: 24, height: 14, borderRadius: 7, background: 'var(--ink-6)', position: 'relative' }}>
                <span style={{ position: 'absolute', top: 2, left: 2, width: 10, height: 10, borderRadius: 5, background: '#fff' }} />
              </span>
            </span>
          </span>
        </div>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
        {/* Progress chart */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--line)' }}>
          <div className="pl-label">Progress over time</div>
          <div style={{ position: 'relative', height: 100, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 4, padding: '8px 10px' }}>
            <svg width="100%" height="100%" viewBox="0 0 340 84" preserveAspectRatio="none">
              <defs>
                <linearGradient id="prgFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* grid */}
              {[0, 21, 42, 63, 84].map((y, i) => <line key={i} x1="0" x2="340" y1={y} y2={y} stroke="#E4E8EE" strokeWidth="1" />)}
              {/* today */}
              <line x1="240" x2="240" y1="0" y2="84" stroke="#1E40AF" strokeOpacity="0.4" strokeDasharray="3 3" />
              {/* area */}
              <path d="M0,80 L40,72 L90,60 L150,46 L210,30 L240,22 L240,84 L0,84 Z" fill="url(#prgFill)" />
              <path d="M0,80 L40,72 L90,60 L150,46 L210,30 L240,22" stroke="#1E40AF" strokeWidth="1.6" fill="none" />
              {/* markers at photo capture */}
              {[
                { x: 40,  y: 72, l: '12%' },
                { x: 90,  y: 60, l: '28%' },
                { x: 150, y: 46, l: '40%' },
                { x: 210, y: 30, l: '52%' },
                { x: 240, y: 22, l: '56%' },
              ].map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#1E40AF" stroke="#fff" strokeWidth="1.5" />)}
              {/* due-date marker (right side) */}
              <line x1="310" x2="310" y1="0" y2="84" stroke="#94A3B8" strokeDasharray="2 2" />
            </svg>
            <div style={{ position: 'absolute', top: 4, left: 8, fontSize: 9.5, color: 'var(--ink-5)' }}>100%</div>
            <div style={{ position: 'absolute', bottom: 4, left: 8, fontSize: 9.5, color: 'var(--ink-5)' }}>0%</div>
            <div style={{ position: 'absolute', bottom: 4, right: 8, fontSize: 9.5, color: 'var(--ink-5)' }} className="mono">May 28 · due</div>
          </div>
        </div>

        {/* photos chronological */}
        <div style={{ padding: '14px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="pl-label" style={{ margin: 0 }}>Progress photos · 8</span>
            <Pill variant="info">newest first</Pill>
            <span style={{ marginLeft: 'auto' }}><I name="filter" size={12} style={{ color: 'var(--ink-5)' }} /></span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { progress: 56, day: 'Today · 13:42', who: 'J. Sanchez', cap: 'Mid-span anchor torque check complete' },
              { progress: 52, day: 'Today · 09:14', who: 'J. Sanchez', cap: 'Segment 2 cable run pulled · pre-tension' },
              { progress: 40, day: 'Yesterday', who: 'J. Sanchez', cap: 'North abutment end termination swaged' },
              { progress: 28, day: 'May 14',    who: 'J. Sanchez', cap: 'Stanchions 5–12 mounted to purlins' },
              { progress: 12, day: 'May 13',    who: 'J. Sanchez', cap: 'Layout marking from survey' },
            ].map((p, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '88px 1fr', gap: 10, alignItems: 'flex-start' }}>
                <div className="pl-img-ph" style={{ width: 88, height: 60, fontSize: 10 }}>photo</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span className="mono tnum" style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 600 }}>{p.progress}%</span>
                    <span style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">{p.day}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.35 }}>{p.cap}</div>
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

window.ProjectSchedule = ProjectSchedule;
