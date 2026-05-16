// Screen 5 — Storeman mobile picking (post QR scan)

function Storeman() {
  return (
    <div className="pl-mobile" style={{ width: '100%', height: '100%' }}>
      {/* status bar */}
      <div className="pl-mobile-status">
        <span>09:42</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="#fff"><rect x="0" y="6" width="3" height="4" /><rect x="4" y="4" width="3" height="6" /><rect x="8" y="2" width="3" height="8" /><rect x="12" y="0" width="3" height="10" /></svg>
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="#fff" strokeWidth="1.4"><path d="M1 4a8 8 0 0 1 12 0M3 6a5 5 0 0 1 8 0M6 9h2" /></svg>
          <svg width="22" height="10" viewBox="0 0 22 10"><rect x="0.5" y="0.5" width="18" height="9" rx="2" fill="none" stroke="#fff" /><rect x="2" y="2" width="14" height="6" fill="#fff" /><rect x="19" y="3" width="2" height="4" fill="#fff" /></svg>
        </div>
      </div>

      {/* header */}
      <div className="pl-mobile-header">
        <div className="pl-mobile-back"><I name="chevL" size={16} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Picking · Issue</div>
          <h1 style={{ fontSize: 16 }}>SF Yard A</h1>
        </div>
        <button style={{ width: 38, height: 38, borderRadius: 8, background: 'var(--primary)', color: '#fff', border: 'none', display: 'grid', placeItems: 'center', boxShadow: '0 2px 8px rgba(30,64,175,0.3)' }}>
          <I name="qr" size={18} />
        </button>
      </div>

      {/* Scanned material card */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 14, boxShadow: '0 1px 3px rgba(15,23,42,0.06)', border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Pill variant="approved" dot>scanned</Pill>
            <Chip>CBL-SS-08-100</Chip>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-4)' }} className="mono">A-12-3</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 32, flex: '0 0 56px' }}>🪢</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.25 }}>Cable, 7×19 SS316, ⌀8 mm</div>
              <div style={{ fontSize: 12, color: 'var(--ink-4)', marginTop: 2 }}>100 m drum · Helmsmiths</div>
            </div>
          </div>

          <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <StatBlock label="MTO" value="260" unit="m" />
            <StatBlock label="In bin" value="412" unit="m" />
            <StatBlock label="Issued" value="0" unit="m" muted />
          </div>
        </div>
      </div>

      {/* Project context */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 12, border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }}><I name="folder" size={16} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>PRJ-2026-038</span>
              <Pill variant="approved" dot>approved</Pill>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Aurora Bridge — North Span</div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>Lifeline LL-01 · line 1 of 18</div>
          </div>
          <I name="chevR" size={16} style={{ color: 'var(--ink-5)' }} />
        </div>
      </div>

      {/* Actual issued — the hero input */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 8 }}>Actual issued</div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 10, padding: '18px 18px 16px', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8 }}>
            <button style={{ width: 36, height: 36, borderRadius: 18, background: 'var(--surface-2)', border: '1px solid var(--line)', color: 'var(--ink-3)', display: 'grid', placeItems: 'center' }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 7h10" /></svg></button>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 160, justifyContent: 'center' }}>
              <span className="mono tnum" style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>250</span>
              <span style={{ fontSize: 22, color: 'var(--ink-4)', fontWeight: 500 }}>m</span>
            </div>
            <button style={{ width: 36, height: 36, borderRadius: 18, background: 'var(--primary)', border: 'none', color: '#fff', display: 'grid', placeItems: 'center' }}><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M7 2v10M2 7h10" /></svg></button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
            {['+10', '+50', '−10', 'MTO'].map(q => (
              <span key={q} style={{ height: 30, padding: '0 12px', border: '1px solid var(--line-2)', borderRadius: 15, fontFamily: 'var(--font-mono)', fontSize: 13, display: 'inline-grid', placeItems: 'center', background: 'var(--surface-2)', color: 'var(--ink-2)' }}>{q}</span>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: '8px 10px', background: 'var(--hivis-soft)', borderRadius: 6, fontSize: 12, color: 'var(--hivis-ink)', display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <I name="warn" size={13} />
            <span><span className="mono">−10 m</span> below MTO · confirm short-pick</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding: '14px 16px' }}>
        <button style={{ width: '100%', height: 52, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 12, fontFamily: 'inherit', fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 12px rgba(30,64,175,0.25)' }}>
          <I name="check" size={18} />
          Confirm issue · 250 m
        </button>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
          <button style={{ height: 44, background: 'var(--surface)', color: 'var(--ink-2)', border: '1px solid var(--line-2)', borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <I name="arrowR" size={15} />
            Next line
          </button>
          <button style={{ height: 44, background: 'var(--surface)', color: 'var(--ink-3)', border: '1px solid var(--line-2)', borderRadius: 10, fontFamily: 'inherit', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <I name="x" size={15} />
            Skip
          </button>
        </div>
      </div>

      {/* offline / queue strip */}
      <div style={{ marginTop: 'auto', padding: '10px 16px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--ink-4)' }}>
        <span style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--hivis)', boxShadow: '0 0 0 3px var(--hivis-soft)' }} />
        Offline · <span className="mono tnum" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>4</span> issues queued
        <span style={{ marginLeft: 'auto' }} className="mono">A-12 · drum 03</span>
      </div>

      {/* tab bar */}
      <div style={{ height: 68, background: 'var(--surface)', borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', alignItems: 'center', justifyItems: 'center', paddingBottom: 12 }}>
        <TabBtn ico="scan" label="Scan" active />
        <TabBtn ico="list" label="Lists" />
        <TabBtn ico="store" label="Stock" />
        <TabBtn ico="user" label="Me" />
      </div>
    </div>
  );
}

function StatBlock({ label, value, unit, muted }) {
  return (
    <div style={{ padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 6, border: '1px solid var(--line)' }}>
      <div style={{ fontSize: 10, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 2 }}>
        <span className="mono tnum" style={{ fontSize: 18, fontWeight: 600, color: muted ? 'var(--ink-4)' : 'var(--ink)' }}>{value}</span>
        <span style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>{unit}</span>
      </div>
    </div>
  );
}

function TabBtn({ ico, label, active }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: active ? 'var(--primary)' : 'var(--ink-4)' }}>
      <I name={ico} size={20} />
      <span style={{ fontSize: 10.5, fontWeight: active ? 600 : 500 }}>{label}</span>
    </div>
  );
}

window.Storeman = Storeman;
