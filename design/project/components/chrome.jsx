// Shared chrome: Sidebar, Topbar, atoms, icons.

const Ico = ({ d, size = 14, strokeWidth, style }) => (
  <svg className={size === 16 ? 'ico ico-lg' : 'ico'} width={size} height={size} viewBox="0 0 24 24" style={style} strokeWidth={strokeWidth}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

// minimal feather-ish icon set
const icons = {
  layout:    'M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 14h7v7H3z',
  package:   'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
  cube:      'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  folder:    'M3 5a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z',
  list:      'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  grid:      'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  store:     'M3 9l2-5h14l2 5M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9M3 9h18M9 21V12h6v9',
  scan:      'M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 8h10M7 12h10M7 16h6',
  cert:      'M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  settings:  'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  chev:      'M6 9l6 6 6-6',
  chevR:     'M9 6l6 6-6 6',
  chevL:     'M15 6l-9 6 9 6',
  chevUp:    'M6 15l6-6 6 6',
  search:    'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35',
  plus:      'M12 5v14M5 12h14',
  filter:    'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  download:  'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  upload:    'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  share:     'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
  warn:      'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01',
  check:     'M20 6L9 17l-5-5',
  x:         'M18 6L6 18M6 6l12 12',
  dots:      'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  bell:      'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
  user:      'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  edit:      'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  trash:     'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
  arrowUp:   'M12 19V5M5 12l7-7 7 7',
  arrowDown: 'M12 5v14M5 12l7 7 7-7',
  arrowR:    'M5 12h14M13 5l7 7-7 7',
  expand:    'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7',
  history:   'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 3',
  fork:      'M6 3v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  qr:        'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h2v2h-2zM18 14h3M21 18v3M14 18h2v3M18 21h3',
  pin:       'M12 2l2.39 4.84L20 8l-4 3.9.94 5.5L12 14.77l-4.94 2.6L8 11.9 4 8l5.61-1.16L12 2z',
  link:      'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  refresh:   'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  diamond:   'M12 2l9 9-9 11-9-11 9-9z',
  copy:      'M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
};

const I = ({ name, ...rest }) => <Ico d={icons[name]} {...rest} />;

const PlumbMark = ({ size = 22, color = '#1E1B0B', bg = '#FACC15' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d="M0 0 H20 L24 4 V20 L20 24 H4 L0 20 Z" fill={bg} />
    <g fill={color}>
      <rect x="11" y="3" width="2" height="13" />
      <path d="M7 16 L17 16 L12 22 Z" />
    </g>
  </svg>
);

// SIDEBAR
function Sidebar({ active = 'dashboard', org = 'Vertex Safety Solutions', collapsed = false, onToggle }) {
  const items = [
    { group: 'Workspace' },
    { key: 'projects',  label: 'Projects',   ico: 'folder', badge: '24' },
    { key: 'dashboard', label: 'Dashboard',  ico: 'layout' },
    { key: 'aggregate', label: 'Combined MTO', ico: 'fork' },
    { group: 'Catalog' },
    { key: 'systems',   label: 'Systems',    ico: 'cube' },
    { key: 'materials', label: 'Materials',  ico: 'package', badge: '847' },
    { key: 'rules',     label: 'Rules',      ico: 'list' },
    { key: 'suppliers', label: 'Suppliers',  ico: 'store' },
    { group: 'Warehouse' },
    { key: 'stock',     label: 'Stock',      ico: 'package' },
    { key: 'picking',   label: 'Pick & Issue', ico: 'scan' },
    { key: 'transfers', label: 'Transfers',  ico: 'fork' },
    { key: 'audit',     label: 'Audit Log',  ico: 'history' },
  ];
  return (
    <aside className="pl-side">
      <div className="pl-brand">
        <PlumbMark />
        <span className="pl-brand-text">akro-app</span>
        <span className="pl-chip mono" style={{ background: '#FFFFFF', borderColor: '#DCE1EA', color: '#64748B' }}>v4.2</span>
        <button className="pl-collapse-btn" onClick={onToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-label="Toggle sidebar">
          {collapsed ? <I name="chevR" size={13} /> : <I name="chevL" size={13} />}
        </button>
      </div>
      <div className="pl-org">
        <div className="pl-org-avatar">VS</div>
        <div className="pl-org-name">{org}</div>
        <I name="chev" size={12} className="pl-org-chev" />
      </div>
      <nav className="pl-nav">
        {items.map((it, i) => it.group ? (
          <div key={'g' + i} className="pl-nav-group">{it.group}</div>
        ) : (
          <div key={it.key} className={'pl-nav-item' + (it.key === active ? ' is-active' : '')}
               title={collapsed ? it.label : undefined}>
            <I name={it.ico} size={14} />
            <span className="pl-nav-label">{it.label}</span>
            {it.badge && <span className={'pl-nav-badge' + (it.warn ? ' warn' : '')}>{it.badge}</span>}
          </div>
        ))}
      </nav>
      <div className="pl-side-foot">
        <div className="pl-avatar">RM</div>
        <div className="pl-foot-text">
          <div style={{ color: '#1F2937', fontWeight: 500 }}>Reuben Mathers</div>
          <div style={{ fontSize: 10.5, color: '#64748B' }}>Admin · Vertex</div>
        </div>
        <I name="settings" size={14} />
      </div>
    </aside>
  );
}

function Topbar({ crumbs = [], search = 'Search materials, projects, rules…' }) {
  return (
    <div className="pl-top">
      <div className="pl-crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <I name="chevR" size={12} className="pl-crumb-sep" />}
            <span className={i === crumbs.length - 1 ? 'pl-crumb-cur' : ''}>{c}</span>
          </React.Fragment>
        ))}
      </div>
      <div className="pl-top-right">
        <div className="pl-search" title={search}>
          <I name="search" size={13} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{search}</span>
          <span className="kbd">⌘K</span>
        </div>
        <button className="pl-btn ghost" style={{ width: 30, padding: 0, justifyContent: 'center' }}><I name="bell" /></button>
      </div>
    </div>
  );
}

// Buttons
const Btn = ({ children, variant = 'default', size, ico, suffix, style, onClick }) => (
  <button className={'pl-btn ' + (variant === 'default' ? '' : variant) + (size ? ' ' + size : '')} style={style} onClick={onClick}>
    {ico && <I name={ico} />}
    <span>{children}</span>
    {suffix && <I name={suffix} size={12} />}
  </button>
);

const Pill = ({ children, variant = '', dot }) => (
  <span className={'pl-pill ' + variant + (dot ? ' dot' : '')}>{children}</span>
);

const Chip = ({ children, style }) => <span className="pl-chip" style={style}>{children}</span>;

const HiVis = ({ children }) => <span className="pl-hivis">{children}</span>;

const Check = ({ state = false }) => (
  <span className={'pl-check' + (state === true ? ' is-checked' : state === 'mid' ? ' is-indeterminate' : '')}>
    {state === true && <I name="check" size={10} />}
    {state === 'mid' && <svg viewBox="0 0 10 10"><path d="M2 5h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /></svg>}
  </span>
);

const NumInput = ({ value, unit, width = 90, style }) => (
  <span className="pl-input-group" style={{ width, ...style }}>
    <input className="pl-input num-input" defaultValue={value} style={{ width: '100%' }} />
    <span className="pl-input-suffix">{unit}</span>
  </span>
);

const Select = ({ value, width = 180, style }) => (
  <span className="pl-select" style={{ width, ...style }}>
    <span>{value}</span>
    <I name="chev" size={12} />
  </span>
);

const Seg = ({ items, active }) => (
  <div className="pl-seg">
    {items.map(it => (
      <span key={it} className={'pl-seg-item' + (it === active ? ' is-active' : '')}>{it}</span>
    ))}
  </div>
);

const ProgressBar = ({ value, max = 100, tone }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <span className="pl-bar">
      <span className={'pl-bar-fill' + (tone ? ' ' + tone : '')} style={{ width: pct + '%' }} />
    </span>
  );
};

Object.assign(window, { Ico, I, icons, PlumbMark, Sidebar, Topbar, Btn, Pill, Chip, HiVis, Check, NumInput, Select, Seg, ProgressBar });
