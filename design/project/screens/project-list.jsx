// Screen 7 — Project list with bulk-select + filters

function ProjectList({ density = 'default', collapsed = false, onToggleCollapse }) {
  const projects = [
    { code: 'PRJ-2026-044', name: 'Solis Logistics — Rooftop Walkway', client: 'Solis Logistics',     status: 'draft',    systems: ['Walkway', 'Guardrail'], lines: 18, mto: 9210,  due: 'Jun 04', issued: 0,    pm: 'A. Chen' },
    { code: 'PRJ-2026-043', name: 'Westgate Tower Façade BMU',        client: 'Westgate REIT',       status: 'draft',    systems: ['Anchor Point', 'Lifeline'], lines: 28, mto: 18420, due: 'Jun 18', issued: 0,   pm: 'A. Chen' },
    { code: 'PRJ-2026-042', name: 'Pier 39 Maintenance Access',       client: 'Port of SF',          status: 'pending',  systems: ['Ladder', 'Guardrail'],     lines: 24, mto: 14380, due: 'Jun 22', issued: 0,   pm: 'R. Mathers' },
    { code: 'PRJ-2026-041', name: 'Bayport Refinery Catwalks',        client: 'Phillips 66',         status: 'approved', systems: ['Lifeline', 'Anchor Point', 'Guardrail'], lines: 31, mto: 24180, due: 'Jul 04', issued: 18, pm: 'A. Chen', selected: true },
    { code: 'PRJ-2026-040', name: 'Cypress Wind Farm — Tower 14',     client: 'Pacific Renew',       status: 'modified', systems: ['Lifeline', 'Ladder', 'Anchor Point'], lines: 36, mto: 42820, due: 'Jul 12', issued: 22, pm: 'D. Khoury' },
    { code: 'PRJ-2026-039', name: 'Tideline DC — Phase 2',            client: 'Tideline Cloud',      status: 'approved', systems: ['Guardrail', 'Walkway'], lines: 22, mto: 16400, due: 'Jul 22', issued: 18, pm: 'R. Mathers' },
    { code: 'PRJ-2026-038', name: 'Aurora Bridge — North Span',       client: 'Caltrans D4',         status: 'modified', systems: ['Lifeline', 'Guardrail', 'Anchor Point', 'Ladder'], lines: 44, mto: 38420, due: 'Aug 14', issued: 28, pm: 'R. Mathers', selected: true },
    { code: 'PRJ-2026-037', name: 'Greenline Light Rail Depot',       client: 'BART',                status: 'approved', systems: ['Rigid Lifeline', 'Guardrail'], lines: 26, mto: 19840, due: 'Aug 28', issued: 14, pm: 'D. Khoury' },
    { code: 'PRJ-2026-036', name: 'Sutter Hospital — Helipad',        client: 'Sutter Health',       status: 'approved', systems: ['Anchor Point', 'Lifeline'], lines: 16, mto: 11240, due: 'Sep 03', issued: 16, pm: 'A. Chen' },
    { code: 'PRJ-2026-035', name: 'Northshore Distillery Storage',    client: 'Northshore Spirits',  status: 'archived', systems: ['Guardrail'], lines: 8,  mto: 4280,  due: 'May 10', issued: 8, pm: 'R. Mathers' },
    { code: 'PRJ-2026-034', name: 'Bay Bridge Service Platforms',     client: 'Caltrans D4',         status: 'approved', systems: ['Stepwalkway', 'Guardrail'], lines: 19, mto: 13420, due: 'May 28', issued: 19, pm: 'D. Khoury' },
    { code: 'PRJ-2026-033', name: 'Vega Cold Storage — Mech Mezz',    client: 'Vega Foods',          status: 'approved', systems: ['Guardrail', 'Anchor Point'], lines: 14, mto: 7920, due: 'May 14', issued: 14, pm: 'A. Chen' },
  ];

  const statusVariant = (s) => ({
    draft: 'draft', pending: 'info', approved: 'approved', modified: 'modified', archived: 'draft',
  })[s] || '';
  const statusLabel = (s) => ({
    draft: 'Draft', pending: 'Pending', approved: 'Approved', modified: 'Modified', archived: 'Archived',
  })[s];

  const selectedCount = projects.filter(p => p.selected).length;

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="projects" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Projects']} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <div className="pl-page-title">Projects</div>
            <Pill variant="info">24 active</Pill>
            <span style={{ fontSize: 12, color: 'var(--ink-4)' }} className="tnum">$284,420 total committed</span>
            <div className="pl-page-actions">
              <Btn ico="download" variant="ghost">Export list</Btn>
              <Btn ico="upload" variant="ghost">Import</Btn>
              <Btn variant="primary" ico="plus">New project</Btn>
            </div>
          </div>
        </div>

        {/* Tabs by status */}
        <div className="pl-tabs">
          <div className="pl-tab is-active">All<span className="pl-tab-count">24</span></div>
          <div className="pl-tab">Draft<span className="pl-tab-count">3</span></div>
          <div className="pl-tab">Pending approval<span className="pl-tab-count">2</span></div>
          <div className="pl-tab">Approved<span className="pl-tab-count">11</span></div>
          <div className="pl-tab">Modified<span className="pl-tab-count">2</span></div>
          <div className="pl-tab">Archived<span className="pl-tab-count">6</span></div>
        </div>

        {/* Filter row */}
        <div className="pl-filterbar">
          <div className="pl-search" style={{ width: 280, height: 30 }}>
            <I name="search" size={13} />
            <span style={{ color: 'var(--ink-4)' }}>Search by name, client, or PRJ code…</span>
          </div>
          <button className="pl-filter-chip">Client <span className="pl-filter-val">All</span> <I name="chev" size={11} /></button>
          <button className="pl-filter-chip">System <span className="pl-filter-val">Any</span> <I name="chev" size={11} /></button>
          <button className="pl-filter-chip">PM <span className="pl-filter-val">Any</span> <I name="chev" size={11} /></button>
          <button className="pl-filter-chip is-active">Due <span className="pl-filter-val">Next 60 days</span> <I name="x" size={11} /></button>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>Sort</span>
            <Select value="Due date" width={140} />
          </div>
        </div>

        {/* Bulk action bar (visible because 2 are selected) */}
        <div style={{ padding: '10px 24px', background: 'var(--primary-soft)', borderBottom: '1px solid var(--primary-line)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Check state="mid" />
          <span style={{ fontSize: 12.5, color: 'var(--primary)', fontWeight: 600 }} className="tnum">{selectedCount} projects selected</span>
          <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
            <span className="mono tnum">{projects.filter(p => p.selected).reduce((s, p) => s + p.lines, 0)} lines</span>
            ·
            <span className="mono tnum" style={{ marginLeft: 6 }}>${projects.filter(p => p.selected).reduce((s, p) => s + p.mto, 0).toLocaleString()}</span>
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <Btn size="sm" ico="fork" variant="primary">Combined MTO</Btn>
            <Btn size="sm" ico="download">Export selected</Btn>
            <Btn size="sm" ico="copy">Duplicate</Btn>
            <Btn size="sm">Archive</Btn>
            <span style={{ width: 1, background: 'var(--primary-line)', margin: '0 2px' }} />
            <Btn size="sm" variant="ghost">Clear</Btn>
          </div>
        </div>

        {/* Table */}
        <div className="pl-scroll" style={{ background: 'var(--surface)' }}>
          <table className="pl-table">
            <thead>
              <tr>
                <th style={{ width: 28 }}><Check state="mid" /></th>
                <th style={{ width: 130 }}>Code</th>
                <th>Project</th>
                <th style={{ width: 140 }}>Client</th>
                <th style={{ width: 110 }}>Status</th>
                <th>Systems</th>
                <th className="num" style={{ width: 70 }}>Lines</th>
                <th style={{ width: 120 }}>Pick progress</th>
                <th className="num" style={{ width: 100 }}>MTO total</th>
                <th style={{ width: 90 }}>Due</th>
                <th style={{ width: 100 }}>PM</th>
                <th style={{ width: 28 }}></th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.code} className={p.selected ? 'is-selected' : ''}>
                  <td><Check state={p.selected || false} /></td>
                  <td className="mono" style={{ color: 'var(--ink-3)' }}>{p.code}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 500 }}>{p.name}</span>
                      {p.status === 'modified' && <HiVis>modified</HiVis>}
                    </div>
                  </td>
                  <td style={{ color: 'var(--ink-3)' }}>{p.client}</td>
                  <td>
                    {p.status === 'modified' ? (
                      <Pill variant="modified">Modified</Pill>
                    ) : (
                      <Pill variant={statusVariant(p.status)} dot>{statusLabel(p.status)}</Pill>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {p.systems.slice(0, 3).map(s => <SystemBadge key={s} system={s} />)}
                      {p.systems.length > 3 && <Chip>+{p.systems.length - 3}</Chip>}
                    </div>
                  </td>
                  <td className="num mono">{p.lines}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ProgressBar value={p.issued} max={p.lines} tone={p.issued === p.lines ? 'success' : p.issued === 0 ? '' : ''} />
                      <span className="mono tnum" style={{ fontSize: 10.5, color: 'var(--ink-4)', width: 36, textAlign: 'right' }}>{Math.round((p.issued / p.lines) * 100)}%</span>
                    </div>
                  </td>
                  <td className="num mono">${p.mto.toLocaleString()}</td>
                  <td className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{p.due}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 20, height: 20, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 600, color: 'var(--ink-3)' }}>{p.pm.split(' ').map(s => s[0]).join('').replace('.', '')}</span>
                      <span style={{ fontSize: 11.5 }}>{p.pm}</span>
                    </div>
                  </td>
                  <td><I name="dots" size={14} style={{ color: 'var(--ink-5)' }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination strip */}
        <div style={{ padding: '10px 24px', background: 'var(--surface)', borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-4)' }}>
          <span className="tnum">Showing 1–12 of 24</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11.5 }}>Rows per page</span>
            <Select value="12" width={70} />
            <span style={{ width: 1, height: 16, background: 'var(--line)', margin: '0 6px' }} />
            <button className="pl-btn ghost sm" style={{ width: 28, padding: 0, justifyContent: 'center' }}><I name="chevL" size={12} /></button>
            <span className="mono tnum" style={{ fontSize: 12 }}>1 / 2</span>
            <button className="pl-btn ghost sm" style={{ width: 28, padding: 0, justifyContent: 'center' }}><I name="chevR" size={12} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SystemBadge({ system }) {
  // tiny glyph + name
  const colors = {
    'Lifeline':       { bg: '#EAF0FB', fg: '#1E40AF' },
    'Guardrail':      { bg: '#E8F0EE', fg: '#0F766E' },
    'Anchor Point':   { bg: '#F4ECEB', fg: '#7C2D12' },
    'Ladder':         { bg: '#F0EDEA', fg: '#5B4F3F' },
    'Walkway':        { bg: '#EFEEF6', fg: '#3F3A7A' },
    'Stepwalkway':    { bg: '#EFEEF6', fg: '#3F3A7A' },
    'Rigid Lifeline': { bg: '#EAF0FB', fg: '#1E40AF' },
  };
  const c = colors[system] || { bg: 'var(--surface-2)', fg: 'var(--ink-3)' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', height: 18, padding: '0 7px', background: c.bg, color: c.fg, fontSize: 10.5, fontWeight: 500, borderRadius: 3, letterSpacing: '0.005em' }}>
      {system}
    </span>
  );
}

window.ProjectList = ProjectList;
