// Storeman mobile suite — 5 screens (Picking Lists home, list detail, Scan, Stock, More)
//
// Shared mobile chrome helpers + screen components.

function MStatus() {
  return (
    <div className="pl-mobile-status">
      <span>09:42</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="#fff"><rect x="0" y="6" width="3" height="4" /><rect x="4" y="4" width="3" height="6" /><rect x="8" y="2" width="3" height="8" /><rect x="12" y="0" width="3" height="10" /></svg>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="#fff" strokeWidth="1.4"><path d="M1 4a8 8 0 0 1 12 0M3 6a5 5 0 0 1 8 0M6 9h2" /></svg>
        <svg width="22" height="10" viewBox="0 0 22 10"><rect x="0.5" y="0.5" width="18" height="9" rx="2" fill="none" stroke="#fff" /><rect x="2" y="2" width="14" height="6" fill="#fff" /><rect x="19" y="3" width="2" height="4" fill="#fff" /></svg>
      </div>
    </div>
  );
}

function MTabBar({ active = 'lists', dot = 'lists' }) {
  const tabs = [
    { key: 'lists', ico: 'list', label: 'Lists' },
    { key: 'scan',  ico: 'scan', label: 'Scan' },
    { key: 'stock', ico: 'store', label: 'Stock' },
    { key: 'more',  ico: 'dots',  label: 'More' },
  ];
  return (
    <div style={{ height: 68, background: 'var(--surface)', borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', alignItems: 'center', justifyItems: 'center', paddingBottom: 12 }}>
      {tabs.map(t => {
        const isActive = t.key === active;
        const isScan = t.key === 'scan';
        return (
          <div key={t.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: isActive ? 'var(--primary)' : 'var(--ink-4)', position: 'relative' }}>
            {isScan ? (
              <div style={{ width: 44, height: 44, borderRadius: 22, background: isActive ? 'var(--primary)' : 'var(--ink-2)', display: 'grid', placeItems: 'center', color: '#fff', boxShadow: isActive ? '0 4px 14px rgba(30,64,175,0.35)' : '0 2px 6px rgba(15,23,42,0.18)', marginTop: -8 }}>
                <I name="qr" size={20} />
              </div>
            ) : (
              <I name={t.ico} size={20} />
            )}
            <span style={{ fontSize: 10.5, fontWeight: isActive ? 600 : 500 }}>{t.label}</span>
            {dot === t.key && !isActive && (
              <span style={{ position: 'absolute', top: 2, right: 16, width: 8, height: 8, borderRadius: 4, background: 'var(--primary)', boxShadow: '0 0 0 2px var(--surface)' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function MStat({ value, label, tone }) {
  return (
    <div style={{ padding: '10px 11px', background: 'var(--surface)', borderRadius: 8, border: '1px solid var(--line)', minWidth: 0 }}>
      <div className="mono tnum" style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em', color: tone === 'warn' ? 'var(--hivis-ink)' : tone === 'success' ? 'var(--success)' : 'var(--ink)' }}>{value}</div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2, lineHeight: 1.2 }}>{label}</div>
    </div>
  );
}

// ─── 12 · Picking Lists home ───────────────────────────────────────────────

function StoremanHome() {
  const lists = [
    { code: 'PRJ-2026-038', name: 'Aurora Bridge — North Span', client: 'Caltrans D4',     due: 'Today',     issued: 28, total: 44, urgent: true },
    { code: 'PRJ-2026-042', name: 'Pier 39 Maintenance Access', client: 'Port of SF',      due: 'Tomorrow',  issued: 12, total: 24 },
    { code: 'PRJ-2026-040', name: 'Cypress Wind Farm · T-14',   client: 'Pacific Renew',   due: 'Jun 22',    issued: 24, total: 36 },
    { code: 'PRJ-2026-044', name: 'Solis Logistics · Rooftop',  client: 'Solis Logistics', due: 'Jun 04',    issued: 0,  total: 18, fresh: true },
    { code: 'PRJ-2026-037', name: 'Greenline Light Rail Depot', client: 'BART',            due: 'Jun 28',    issued: 14, total: 26 },
  ];

  return (
    <div className="pl-mobile" style={{ width: '100%', height: '100%' }}>
      <MStatus />
      {/* header */}
      <div style={{ padding: '14px 18px 12px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <PlumbMark size={26} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Storeman · SF Yard A</div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>Picking Lists</h1>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--success)', fontWeight: 500 }}>
            <span style={{ width: 7, height: 7, borderRadius: 4, background: 'var(--success)', boxShadow: '0 0 0 3px var(--success-soft)' }} />
            Online
          </span>
        </div>
        {/* Stats strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
          <MStat value="14" label="Receipts" />
          <MStat value="38" label="Issued" />
          <MStat value="3"  label="Returns" />
          <MStat value="5"  label="Open" />
          <MStat value="2"  label="Overdue" tone="warn" />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 14px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* Pinned: fully-issued awaiting closure */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'var(--success-soft)', border: '1px solid #BFDDD8', borderRadius: 10 }}>
          <I name="check" size={14} style={{ color: 'var(--success)' }} />
          <div style={{ flex: 1, fontSize: 12, color: 'var(--success)' }}>
            <div style={{ fontWeight: 600 }}><span className="mono tnum">3</span> lists fully issued</div>
            <div style={{ fontSize: 11, opacity: 0.8 }}>Awaiting project closure</div>
          </div>
          <I name="chevR" size={14} style={{ color: 'var(--success)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--ink-4)', padding: '6px 2px' }}>
          <span>Sorted by needed-by</span>
          <span style={{ flex: 1 }} />
          <I name="filter" size={12} />
          <span>Filter</span>
        </div>

        {lists.map(l => (
          <div key={l.code} style={{ padding: '11px 12px', background: 'var(--surface)', border: '1px solid ' + (l.urgent ? 'var(--hivis-line)' : 'var(--line)'), borderRadius: 10, position: 'relative' }}>
            {l.urgent && <span style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 3, background: 'var(--hivis)', borderRadius: '10px 0 0 10px' }} />}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Chip>{l.code}</Chip>
              <span style={{ fontSize: 11, color: l.urgent ? 'var(--hivis-ink)' : 'var(--ink-4)', fontWeight: 500 }}>{l.due}</span>
              {l.fresh && <Pill variant="info">new</Pill>}
              <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--ink-3)' }} className="mono tnum">{l.issued}/{l.total}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25, marginBottom: 2 }}>{l.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginBottom: 8 }}>{l.client}</div>
            <ProgressBar value={l.issued} max={l.total} tone={l.issued === l.total ? 'success' : l.urgent ? 'warn' : ''} />
          </div>
        ))}
      </div>

      <MTabBar active="lists" dot="lists" />
    </div>
  );
}

// ─── 13 · Picking list detail (with Issue bottom sheet) ────────────────────

function StoremanListDetail() {
  return (
    <div className="pl-mobile" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MStatus />

      {/* header */}
      <div className="pl-mobile-header">
        <div className="pl-mobile-back"><I name="chevL" size={16} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Chip>PRJ-2026-038</Chip>
            <Pill variant="approved" dot>approved</Pill>
          </div>
          <h1 style={{ fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Aurora Bridge — North Span</h1>
        </div>
        <button style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink-3)' }}>
          <I name="dots" size={14} />
        </button>
      </div>

      {/* progress summary */}
      <div style={{ padding: '12px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Progress</span>
          <span className="mono tnum" style={{ fontSize: 13, fontWeight: 600 }}>28 / 44 <span style={{ color: 'var(--ink-4)', fontWeight: 400 }}>lines</span></span>
        </div>
        <ProgressBar value={28} max={44} />
        <div style={{ marginTop: 6, display: 'flex', gap: 12, fontSize: 11, color: 'var(--ink-4)' }}>
          <span><span className="mono" style={{ color: 'var(--ink-2)' }}>14</span> issued today</span>
          <span><span className="mono" style={{ color: 'var(--ink-2)' }}>16</span> remaining</span>
          <span style={{ marginLeft: 'auto', color: 'var(--hivis-ink)' }}><I name="warn" size={11} style={{ verticalAlign: 'middle', marginRight: 2 }} />needed today</span>
        </div>
      </div>

      {/* groups */}
      <div style={{ flex: 1, overflow: 'auto', padding: '10px 14px 100px' }}>
        <GroupHeader name="Lifeline · LL-01" sub="Cable 8mm SS316" count="6 lines · 4 issued" />
        <MaterialCard thumb="🪢" code="CBL-SS-08-100" name="Cable, 7×19 SS316, ⌀8 mm" stock="412 m · A-12-3" mto="260 m" issued="250 m" highlight />
        <MaterialCard thumb="🧷" code="TRM-END-08-K" name="End Termination Kit, swaged" stock="32 kit · A-08-1" mto="6 kit" issued="6 kit" done />
        <MaterialCard thumb="🔧" code="INT-ANC-12"   name="Intermediate Anchor, 12mm" stock="14 pcs · A-09-2" mto="31 pcs" issued="28 pcs" low />
        <MaterialCard thumb="📐" code="STN-AL-450"   name="Stanchion, aluminium, 450 mm" stock="184 pcs · B-04-1" mto="31 pcs" issued="31 pcs" done />

        <GroupHeader name="Guardrail · GR-01" sub="Modular 1.1m Galv" count="4 lines · 1 issued" />
        <MaterialCard thumb="🛡️" code="GR-POST-1100"  name="Guardrail Post, 1100 mm" stock="312 pcs · B-12-1" mto="94 pcs" issued="80 pcs" />
        <MaterialCard thumb="🛡️" code="GR-RAIL-2M-G"  name="Top Rail, 2.0 m, galv"   stock="84 pcs · B-12-2" mto="93 pcs" issued="80 pcs" low />
      </div>

      {/* Toast */}
      <div style={{ position: 'absolute', top: 50, left: 16, right: 16, padding: '10px 12px', background: 'var(--ink)', color: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.22)', zIndex: 30, opacity: 0.95 }}>
        <I name="check" size={14} style={{ color: 'var(--success)' }} />
        <div style={{ flex: 1, fontSize: 12 }}>Issued <span className="mono tnum">31</span> stanchions · 2s ago</div>
        <button style={{ background: 'transparent', border: 'none', color: '#FACC15', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>UNDO</button>
      </div>

      {/* Bottom sheet — Issue */}
      <IssueBottomSheet />

      <MTabBar active="lists" />
    </div>
  );
}

function GroupHeader({ name, sub, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '14px 2px 8px' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{name}</div>
      <div style={{ fontSize: 11, color: 'var(--ink-5)' }}>{sub}</div>
      <span style={{ flex: 1 }} />
      <div style={{ fontSize: 11, color: 'var(--ink-4)' }} className="tnum">{count}</div>
    </div>
  );
}

function MaterialCard({ thumb, code, name, stock, mto, issued, done, low, highlight }) {
  const remaining = parseInt(mto) - parseInt(issued);
  const progress = (parseInt(issued) / parseInt(mto)) * 100;
  return (
    <div style={{ marginBottom: 6, padding: '10px 12px', background: 'var(--surface)', border: '1px solid ' + (highlight ? 'var(--primary-line)' : 'var(--line)'), borderRadius: 10, opacity: done ? 0.65 : 1, position: 'relative' }}>
      {highlight && <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--primary)', borderRadius: '10px 0 0 10px' }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 18, flex: '0 0 36px' }}>{thumb}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: done ? 'line-through' : 'none' }}>{name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-4)', marginTop: 1 }}>
            <span className="mono" style={{ fontSize: 10.5 }}>{code}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--ink-6)' }} />
            <span className="mono tnum">{stock}</span>
          </div>
        </div>
        {done ? (
          <Pill variant="approved" dot>all issued</Pill>
        ) : (
          <button style={{ height: 32, padding: '0 12px', borderRadius: 8, background: highlight ? 'var(--primary)' : 'var(--surface-2)', border: highlight ? '1px solid var(--primary)' : '1px solid var(--line-2)', color: highlight ? '#fff' : 'var(--ink-2)', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            Issue<span className="mono tnum">{remaining}</span>
          </button>
        )}
      </div>
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <ProgressBar value={parseInt(issued)} max={parseInt(mto)} tone={done ? 'success' : low ? 'warn' : ''} />
        <span className="mono tnum" style={{ fontSize: 10.5, color: 'var(--ink-4)', minWidth: 60, textAlign: 'right' }}>{issued} / {mto}</span>
      </div>
      {low && !done && (
        <div style={{ marginTop: 6, fontSize: 10.5, color: 'var(--hivis-ink)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <I name="warn" size={11} />
          Bin stock below required · 2 more locations have balance
        </div>
      )}
    </div>
  );
}

function IssueBottomSheet() {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--surface)', borderRadius: '16px 16px 0 0', boxShadow: '0 -8px 32px rgba(15,23,42,0.18)', borderTop: '1px solid var(--line)', padding: '10px 18px 76px', zIndex: 20 }}>
      <div style={{ width: 36, height: 4, background: 'var(--ink-6)', borderRadius: 2, margin: '4px auto 12px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 42, height: 42, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 22 }}>🪢</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>Cable, 7×19 SS316, ⌀8 mm</div>
          <div style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">CBL-SS-08-100</div>
        </div>
        <button style={{ width: 30, height: 30, borderRadius: 15, background: 'transparent', border: 'none', color: 'var(--ink-5)' }}><I name="x" /></button>
      </div>
      {/* qty stepper */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 10, marginBottom: 10 }}>
        <button style={{ width: 36, height: 36, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink-3)' }}>−</button>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span className="mono tnum" style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.03em' }}>10</span>
          <span style={{ fontSize: 14, color: 'var(--ink-4)' }}>m</span>
        </div>
        <button style={{ width: 36, height: 36, borderRadius: 18, background: 'var(--primary)', border: 'none', color: '#fff' }}>+</button>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {['+10', '+50', 'MTO 10'].map(q => (
          <span key={q} style={{ flex: 1, height: 30, padding: '0 8px', border: '1px solid var(--line-2)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 12, display: 'inline-grid', placeItems: 'center', background: 'var(--surface-2)' }}>{q}</span>
        ))}
      </div>
      {/* location list with balances */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: 4 }}>Issue from</div>
        <div style={{ border: '1px solid var(--line)', borderRadius: 8, overflow: 'hidden' }}>
          {[
            { loc: 'SF Yard A · A-12-3', stock: 412, primary: true, selected: true },
            { loc: 'Oakland Hub · O-04', stock: 120 },
            { loc: 'Mobile Van 03',      stock: 60 },
          ].map((s, i) => (
            <div key={i} style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, borderTop: i ? '1px solid var(--line)' : 'none', background: s.selected ? 'var(--primary-soft)' : 'transparent' }}>
              <span style={{ width: 16, height: 16, borderRadius: 8, border: '1.5px solid ' + (s.selected ? 'var(--primary)' : 'var(--line-strong)'), background: s.selected ? 'var(--primary)' : 'transparent', display: 'grid', placeItems: 'center' }}>{s.selected && <span style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }} />}</span>
              <span style={{ fontSize: 12.5, flex: 1, fontWeight: s.selected ? 600 : 500 }}>{s.loc}</span>
              {s.primary && <Pill variant="info">primary</Pill>}
              <span className="mono tnum" style={{ fontSize: 12, color: 'var(--ink-3)' }}>{s.stock} m</span>
            </div>
          ))}
        </div>
      </div>
      <button style={{ width: '100%', height: 50, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 12, fontFamily: 'inherit', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(30,64,175,0.3)' }}>
        <I name="check" size={16} />
        Confirm · issue 10 m
      </button>
    </div>
  );
}

// ─── 14 · Scan tab ─────────────────────────────────────────────────────────

function StoremanScan() {
  return (
    <div className="pl-mobile" style={{ width: '100%', height: '100%', background: '#0B1220', color: '#fff' }}>
      <MStatus />

      {/* viewfinder area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0B1220' }}>
        {/* simulated camera dark vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, #1F2937 0%, #0B1220 70%)' }} />
        {/* QR placeholder — gridded fake */}
        <div style={{ position: 'absolute', top: '32%', left: '50%', transform: 'translate(-50%, -50%)', width: 180, height: 180, display: 'grid', gridTemplateColumns: 'repeat(21, 1fr)', gap: 1, opacity: 0.85 }}>
          {Array.from({ length: 21 * 21 }).map((_, i) => {
            const r = ((i * 1103515245 + 12345) & 0x7fffffff) % 100;
            return <span key={i} style={{ background: r < 50 ? '#F8FAFC' : 'transparent', borderRadius: 0 }} />;
          })}
        </div>
        {/* corner brackets */}
        <div style={{ position: 'absolute', top: '32%', left: '50%', transform: 'translate(-50%, -50%)', width: 240, height: 240 }}>
          {[
            { top: -2, left: -2, b: ['top','left'] },
            { top: -2, right: -2, b: ['top','right'] },
            { bottom: -2, left: -2, b: ['bottom','left'] },
            { bottom: -2, right: -2, b: ['bottom','right'] },
          ].map((c, i) => (
            <span key={i} style={{ position: 'absolute', top: c.top, left: c.left, right: c.right, bottom: c.bottom, width: 28, height: 28, borderTop: c.b.includes('top') ? '3px solid #FACC15' : 'none', borderBottom: c.b.includes('bottom') ? '3px solid #FACC15' : 'none', borderLeft: c.b.includes('left') ? '3px solid #FACC15' : 'none', borderRight: c.b.includes('right') ? '3px solid #FACC15' : 'none', borderRadius: 4 }} />
          ))}
        </div>
        {/* scan line */}
        <div style={{ position: 'absolute', top: 'calc(32% - 0px)', left: 'calc(50% - 110px)', width: 220, height: 2, background: 'linear-gradient(90deg, transparent, #FACC15, transparent)', boxShadow: '0 0 12px #FACC15' }} />

        {/* status text */}
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', alignItems: 'center', gap: 8, color: '#F8FAFC', fontSize: 13 }}>
          <button style={{ width: 34, height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', display: 'grid', placeItems: 'center' }}><I name="x" /></button>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: 'rgba(255,255,255,0.12)', borderRadius: 16, fontSize: 11 }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: '#FACC15', boxShadow: '0 0 8px #FACC15' }} />
            Scanning…
          </span>
          <button style={{ width: 34, height: 34, borderRadius: 17, background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', display: 'grid', placeItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><circle cx="8" cy="8" r="2.5" /><path d="M8 1v2M8 13v2M15 8h-2M3 8H1M12.95 3.05l-1.41 1.41M4.46 11.54l-1.41 1.41M12.95 12.95l-1.41-1.41M4.46 4.46L3.05 3.05" /></svg>
          </button>
        </div>

        {/* hint pill */}
        <div style={{ position: 'absolute', top: 'calc(32% + 130px)', left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 12, letterSpacing: '0.01em' }}>
          Align QR within frame · material or picking-list
        </div>
      </div>

      {/* Smart-routing result sheet */}
      <div style={{ background: 'var(--surface)', color: 'var(--ink)', padding: '14px 18px 8px', borderRadius: '20px 20px 0 0', boxShadow: '0 -12px 32px rgba(0,0,0,0.4)' }}>
        <div style={{ width: 38, height: 4, background: 'var(--ink-6)', borderRadius: 2, margin: '0 auto 12px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ width: 42, height: 42, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 22 }}>🪢</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
              <Chip>CBL-SS-08-100</Chip>
              <Pill variant="approved" dot>matched</Pill>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Cable, 7×19 SS316, ⌀8 mm</div>
          </div>
        </div>

        <div style={{ padding: '8px 10px', background: 'var(--primary-soft)', borderRadius: 6, fontSize: 11.5, color: 'var(--primary)', marginBottom: 8 }}>
          <I name="check" size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          Found in <span className="mono tnum" style={{ fontWeight: 600 }}>2</span> open picking lists · default action is <span style={{ fontWeight: 600 }}>Issue</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 10, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textAlign: 'left' }}>
            <I name="arrowR" size={16} />
            <div style={{ flex: 1 }}>
              <div>Issue to project</div>
              <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 400 }}>Aurora Bridge · 10 m due</div>
            </div>
            <I name="chevR" size={14} />
          </button>
          {[
            { ico: 'list',  label: 'Issue to other project', sub: 'Pier 39 · 14 m due' },
            { ico: 'search', label: 'Lookup material',        sub: 'Stock-by-location, certs, history' },
            { ico: 'upload', label: 'Receive into stock',     sub: 'Add qty to a location' },
            { ico: 'refresh', label: 'Return from project',   sub: '3 recent issuances' },
          ].map((a, i) => (
            <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, fontFamily: 'inherit', textAlign: 'left' }}>
              <I name={a.ico} size={15} style={{ color: 'var(--ink-3)' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{a.label}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{a.sub}</div>
              </div>
              <I name="chevR" size={13} style={{ color: 'var(--ink-5)' }} />
            </button>
          ))}
        </div>
      </div>

      <MTabBar active="scan" />
    </div>
  );
}

// ─── 15 · Stock detail ────────────────────────────────────────────────────

function StoremanStock() {
  return (
    <div className="pl-mobile" style={{ width: '100%', height: '100%' }}>
      <MStatus />

      {/* header */}
      <div className="pl-mobile-header">
        <div className="pl-mobile-back"><I name="chevL" size={16} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Stock</div>
          <h1 style={{ fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Cable, 7×19 SS316, ⌀8 mm</h1>
        </div>
        <button style={{ width: 34, height: 34, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--line)' }}><I name="dots" size={14} /></button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 80px' }}>
        {/* Material summary card */}
        <div style={{ padding: 14, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 60, height: 60, borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 34, flex: '0 0 60px' }}>🪢</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Chip>CBL-SS-08-100</Chip>
                <Chip>v3</Chip>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span className="mono tnum" style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>592</span>
                <span style={{ fontSize: 14, color: 'var(--ink-4)' }}>m total</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>100 m drum · Helmsmiths</div>
            </div>
          </div>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            <button style={{ height: 38, borderRadius: 8, background: 'var(--primary)', color: '#fff', border: 'none', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><I name="upload" size={14} />Receive</button>
            <button style={{ height: 38, borderRadius: 8, background: 'var(--surface-2)', color: 'var(--ink-2)', border: '1px solid var(--line-2)', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><I name="fork" size={13} />Transfer</button>
            <button style={{ height: 38, borderRadius: 8, background: 'var(--surface-2)', color: 'var(--ink-2)', border: '1px solid var(--line-2)', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><I name="qr" size={13} />Print QR</button>
          </div>
        </div>

        {/* Stock by location */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '6px 2px 8px' }}>
          <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Stock by location</span>
          <span style={{ fontSize: 11, color: 'var(--ink-5)' }} className="tnum">3 locations</span>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
          {[
            { loc: 'SF Yard A',    bin: 'A-12-3', stock: 412, picked: 250, primary: true },
            { loc: 'Oakland Hub',  bin: 'O-04-2', stock: 120, picked: 0 },
            { loc: 'Mobile Van 03', bin: '—',     stock: 60,  picked: 0,  low: true },
          ].map((s, i) => (
            <div key={i} style={{ padding: '11px 12px', borderTop: i ? '1px solid var(--line)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{s.loc}</span>
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{s.bin}</span>
                {s.primary && <Pill variant="info">primary</Pill>}
                {s.low && <Pill variant="modified">low</Pill>}
                <span style={{ marginLeft: 'auto' }} className="mono tnum">
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{s.stock}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-5)', marginLeft: 2 }}>m</span>
                </span>
              </div>
              <ProgressBar value={s.picked} max={s.stock} />
            </div>
          ))}
        </div>

        {/* Movements */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '0 2px 8px' }}>
          <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Recent movements</span>
          <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 500 }}>View all</span>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
          {[
            { ico: 'arrowDown', tone: 'success', label: 'Receipt',   sub: 'SF Yard A · Helmsmiths PO-0291', qty: '+200 m', when: '2h ago', who: 'R. Mathers' },
            { ico: 'arrowUp',   tone: 'primary', label: 'Issuance',  sub: 'Aurora Bridge · LL-01',           qty: '−250 m', when: '4h ago', who: 'You' },
            { ico: 'refresh',   tone: 'warn',    label: 'Return',    sub: 'Pier 39 · GR-01',                 qty: '+8 m',   when: 'Yesterday', who: 'D. Khoury' },
            { ico: 'arrowUp',   tone: 'primary', label: 'Issuance',  sub: 'Bayport · LL-02',                 qty: '−180 m', when: '2d ago', who: 'You' },
            { ico: 'settings',  tone: 'ink-3',   label: 'Adjustment', sub: 'Annual count · admin',           qty: '−4 m',   when: '5d ago', who: 'A. Chen' },
          ].map((m, i) => (
            <div key={i} style={{ padding: '10px 12px', borderTop: i ? '1px solid var(--line)' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 28, height: 28, borderRadius: 14, background: m.tone === 'success' ? 'var(--success-soft)' : m.tone === 'primary' ? 'var(--primary-soft)' : m.tone === 'warn' ? 'var(--hivis-soft)' : 'var(--surface-2)', display: 'grid', placeItems: 'center', color: m.tone === 'success' ? 'var(--success)' : m.tone === 'primary' ? 'var(--primary)' : m.tone === 'warn' ? 'var(--hivis-ink)' : 'var(--ink-3)' }}>
                <I name={m.ico} size={13} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{m.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-5)' }} className="mono">{m.when}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--ink-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.sub} · {m.who}</div>
              </div>
              <span className="mono tnum" style={{ fontSize: 13, fontWeight: 600, color: m.qty.startsWith('+') ? 'var(--success)' : m.qty.startsWith('−') ? 'var(--ink-2)' : 'var(--ink-3)' }}>{m.qty}</span>
            </div>
          ))}
        </div>
      </div>

      <MTabBar active="stock" />
    </div>
  );
}

// ─── 16 · More tab ────────────────────────────────────────────────────────

function StoremanMore() {
  return (
    <div className="pl-mobile" style={{ width: '100%', height: '100%' }}>
      <MStatus />
      <div style={{ padding: '14px 18px 12px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>More</h1>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '14px 16px 80px' }}>
        {/* Profile card */}
        <div style={{ padding: 14, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: 26, background: 'linear-gradient(135deg, #475569, #1F2937)', color: '#F1F5F9', display: 'grid', placeItems: 'center', fontSize: 18, fontWeight: 600 }}>RM</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Reuben Mathers</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>Storeman · SF Yard A</div>
            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
              <Pill variant="approved" dot>storeman</Pill>
              <Pill variant="info">admin</Pill>
            </div>
          </div>
          <I name="chevR" size={14} style={{ color: 'var(--ink-5)' }} />
        </div>

        {/* My activity */}
        <SectionTitle text="My activity · today" right="13 actions" />
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: 12, marginBottom: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 10 }}>
            <ActivityStat value="9"  label="Issues" />
            <ActivityStat value="2"  label="Receipts" />
            <ActivityStat value="1"  label="Return" />
            <ActivityStat value="1"  label="Adj." />
          </div>
          {[
            { label: 'Issued 250 m cable',         meta: 'Aurora Bridge · 09:14' },
            { label: 'Received 200 m cable',       meta: 'PO-0291 · 08:52' },
            { label: 'Returned 8 m guardrail',     meta: 'Pier 39 · 08:11' },
          ].map((a, i, arr) => (
            <div key={i} style={{ padding: '8px 0', borderTop: i ? '1px solid var(--line)' : 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--primary)' }} />
              <span style={{ flex: 1, fontSize: 12.5, fontWeight: 500 }}>{a.label}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">{a.meta}</span>
            </div>
          ))}
          <button style={{ marginTop: 8, width: '100%', height: 32, background: 'transparent', border: '1px dashed var(--line-2)', borderRadius: 6, fontFamily: 'inherit', fontSize: 12, color: 'var(--ink-3)' }}>View full activity</button>
        </div>

        {/* Settings */}
        <SectionTitle text="Settings" />
        <SettingsGroup>
          <SettingRowM ico="bell"     label="Notifications"            sub="3 active" value="On" />
          <SettingRowM ico="scan"     label="Scanner sensitivity"      value="Auto" />
          <SettingRowM ico="user"     label="Biometric unlock"         value="On" toggle />
          <SettingRowM ico="settings" label="Default location"         value="SF Yard A" />
          <SettingRowM ico="package"  label="Default qty step"         value="10" />
        </SettingsGroup>

        <SectionTitle text="Help & support" />
        <SettingsGroup>
          <SettingRowM ico="cert"  label="Cert library"        sub="14 docs" />
          <SettingRowM ico="cube"  label="Stock count guide" />
          <SettingRowM ico="warn"  label="Report an issue" />
          <SettingRowM ico="link"  label="Open admin web"      sub="akro-app.com" />
        </SettingsGroup>

        <button style={{ width: '100%', height: 44, background: 'var(--surface)', color: 'var(--danger)', border: '1px solid var(--line)', borderRadius: 10, fontFamily: 'inherit', fontSize: 14, fontWeight: 500, marginTop: 14 }}>
          Log out
        </button>
        <div style={{ textAlign: 'center', marginTop: 10, fontSize: 10.5, color: 'var(--ink-5)' }} className="mono">akro-app 4.2 · build 2026.024</div>
      </div>

      <MTabBar active="more" />
    </div>
  );
}

function SectionTitle({ text, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '6px 2px 8px' }}>
      <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{text}</span>
      {right && <span style={{ fontSize: 11, color: 'var(--ink-5)' }} className="tnum">{right}</span>}
    </div>
  );
}

function ActivityStat({ value, label }) {
  return (
    <div style={{ padding: '8px 6px', background: 'var(--surface-2)', borderRadius: 6, textAlign: 'center' }}>
      <div className="mono tnum" style={{ fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
    </div>
  );
}

function SettingsGroup({ children }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
      {React.Children.map(children, (c, i) => (
        <div key={i} style={{ borderTop: i ? '1px solid var(--line)' : 'none' }}>{c}</div>
      ))}
    </div>
  );
}

function SettingRowM({ ico, label, sub, value, toggle }) {
  return (
    <div style={{ padding: '11px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--surface-2)', display: 'grid', placeItems: 'center', color: 'var(--ink-3)' }}>
        <I name={ico} size={14} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{sub}</div>}
      </div>
      {toggle ? (
        <span style={{ width: 36, height: 20, borderRadius: 10, background: 'var(--primary)', position: 'relative' }}>
          <span style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: 8, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
        </span>
      ) : (
        <>
          {value && <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{value}</span>}
          <I name="chevR" size={13} style={{ color: 'var(--ink-5)' }} />
        </>
      )}
    </div>
  );
}

Object.assign(window, { StoremanHome, StoremanListDetail, StoremanScan, StoremanStock, StoremanMore });
