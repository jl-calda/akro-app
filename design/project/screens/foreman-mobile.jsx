// Site Foreman mobile · Pending Receipts (home) + Handover ticket confirm.

function ForemanHome() {
  const tickets = [
    { id: 'HOT-2026-0834', proj: 'Aurora Bridge — North Span', code: 'PRJ-2026-038', issued: '09:18', items: 2, qty: '250 m + 6 kit', urgent: true },
    { id: 'HOT-2026-0833', proj: 'Aurora Bridge — North Span', code: 'PRJ-2026-038', issued: 'Yesterday', items: 4, qty: '94 + 93 + 124 + …' },
    { id: 'HOT-2026-0829', proj: 'Pier 39 Maintenance Access', code: 'PRJ-2026-042', issued: 'May 14', items: 3, qty: '22 stanchions + …', delivered: true },
  ];
  return (
    <div className="pl-mobile" style={{ width: '100%', height: '100%' }}>
      <MStatus />
      <div style={{ padding: '14px 18px 12px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <PlumbMark size={26} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Foreman · J. Sanchez</div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>Pending Receipts</h1>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--success)', fontWeight: 500 }}>
            <span style={{ width: 7, height: 7, borderRadius: 4, background: 'var(--success)', boxShadow: '0 0 0 3px var(--success-soft)' }} />
            Online
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          <MStat value="2" label="Awaiting receipt" tone="warn" />
          <MStat value="1" label="Confirmed today" tone="success" />
          <MStat value="3" label="Projects assigned" />
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--ink-4)', padding: '4px 2px 8px' }}>
          <span style={{ fontWeight: 600, color: 'var(--ink-3)' }}>Handover tickets</span>
          <span style={{ flex: 1 }} />
          <I name="filter" size={12} />
          <span>Filter</span>
        </div>

        {tickets.map(t => (
          <div key={t.id} style={{ marginBottom: 8, padding: '12px 12px', background: 'var(--surface)', border: '1px solid ' + (t.urgent ? 'var(--hivis-line)' : 'var(--line)'), borderRadius: 10, position: 'relative', opacity: t.delivered ? 0.65 : 1 }}>
            {t.urgent && <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--hivis)', borderRadius: '10px 0 0 10px' }} />}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Chip>{t.id}</Chip>
              {t.delivered ? <Pill variant="approved" dot>received</Pill> : <Pill variant="info">in-transit</Pill>}
              <span style={{ marginLeft: 'auto', fontSize: 11, color: t.urgent ? 'var(--hivis-ink)' : 'var(--ink-4)', fontWeight: 500 }}>issued {t.issued}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25, marginBottom: 2 }}>{t.proj}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginBottom: 8 }} className="mono">{t.code} · {t.items} items · {t.qty}</div>
            {!t.delivered && (
              <button style={{ width: '100%', height: 38, borderRadius: 8, background: 'var(--primary)', color: '#fff', border: 'none', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <I name="qr" size={14} />Scan ticket to confirm
              </button>
            )}
          </div>
        ))}
      </div>

      <ForemanTabBar active="receipts" />
    </div>
  );
}

function ForemanConfirm() {
  const items = [
    { th: '🪢', code: 'CBL-SS-08-100', name: 'Cable, 7×19 SS316, ⌀8 mm', issued: 250, actual: 250, unit: 'm' },
    { th: '🧷', code: 'TRM-END-08-K',  name: 'End Termination Kit, swaged', issued: 6, actual: 6, unit: 'kit' },
    { th: '🔧', code: 'INT-ANC-12',    name: 'Intermediate Anchor, 12mm', issued: 28, actual: 26, unit: 'pcs', diff: true },
  ];
  return (
    <div className="pl-mobile" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MStatus />
      <div className="pl-mobile-header">
        <div className="pl-mobile-back"><I name="chevL" size={16} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Pill variant="approved" dot>scanned</Pill>
            <Chip>HOT-2026-0834</Chip>
          </div>
          <h1 style={{ fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Confirm receipt</h1>
        </div>
      </div>

      {/* Project context */}
      <div style={{ padding: '12px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ padding: 12, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ width: 32, height: 32, borderRadius: 6, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center' }}><I name="folder" size={16} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>PRJ-2026-038</span>
              <Pill variant="approved" dot>approved</Pill>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Aurora Bridge — North Span</div>
            <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>Issued by R. Mathers · SF Yard A · 09:18 today</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '10px 14px 110px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 2px', fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          <span>Items · {items.length}</span>
          <span style={{ marginLeft: 'auto', textTransform: 'none', fontWeight: 500, color: 'var(--ink-4)', letterSpacing: 0 }}>edit qty if short</span>
        </div>

        {items.map(it => (
          <div key={it.code} style={{ marginBottom: 6, padding: '10px 12px', background: 'var(--surface)', border: '1px solid ' + (it.diff ? 'var(--hivis-line)' : 'var(--line)'), borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--line)', display: 'grid', placeItems: 'center', fontSize: 18 }}>{it.th}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">{it.code}</div>
              </div>
            </div>
            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, fontSize: 11, color: 'var(--ink-4)' }}>
                Ticket qty <span className="mono tnum" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{it.issued} {it.unit}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button style={{ width: 28, height: 28, borderRadius: 14, background: 'var(--surface-2)', border: '1px solid var(--line)' }}>−</button>
                <span className="mono tnum" style={{ fontSize: 18, fontWeight: 600, minWidth: 50, textAlign: 'center', color: it.diff ? 'var(--hivis-ink)' : 'var(--ink)' }}>{it.actual}</span>
                <button style={{ width: 28, height: 28, borderRadius: 14, background: 'var(--primary)', color: '#fff', border: 'none' }}>+</button>
              </div>
            </div>
            {it.diff && (
              <div style={{ marginTop: 8, padding: '6px 8px', background: 'var(--hivis-soft)', borderRadius: 6, fontSize: 11, color: 'var(--hivis-ink)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <I name="warn" size={11} />
                <span>Short by <span className="mono tnum" style={{ fontWeight: 600 }}>2 pcs</span> · discrepancy will be flagged in audit log</span>
              </div>
            )}
          </div>
        ))}

        <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--success-soft)', border: '1px solid #BFDDD8', borderRadius: 10, display: 'flex', gap: 8, alignItems: 'center', fontSize: 11.5, color: 'var(--success)' }}>
          <I name="check" size={13} />
          <span>Tap <span style={{ fontWeight: 600 }}>Confirm</span> to mark these items as received on-site. PM &amp; admin will see this in the project activity feed.</span>
        </div>
      </div>

      {/* sticky bottom action */}
      <div style={{ position: 'absolute', bottom: 68, left: 16, right: 16 }}>
        <button style={{ width: '100%', height: 52, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 12, fontFamily: 'inherit', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 14px rgba(30,64,175,0.3)' }}>
          <I name="check" size={16} />
          Confirm receipt · 3 items
        </button>
      </div>

      <ForemanTabBar active="receipts" />
    </div>
  );
}

function ForemanTabBar({ active = 'receipts' }) {
  const tabs = [
    { key: 'receipts', ico: 'list', label: 'Receipts' },
    { key: 'scan',     ico: 'scan', label: 'Scan' },
    { key: 'projects', ico: 'folder', label: 'Projects' },
    { key: 'more',     ico: 'dots',  label: 'More' },
  ];
  return (
    <div style={{ height: 68, background: 'var(--surface)', borderTop: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', alignItems: 'center', justifyItems: 'center', paddingBottom: 12 }}>
      {tabs.map(t => {
        const isActive = t.key === active;
        const isScan = t.key === 'scan';
        return (
          <div key={t.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, color: isActive ? 'var(--primary)' : 'var(--ink-4)' }}>
            {isScan ? (
              <div style={{ width: 44, height: 44, borderRadius: 22, background: 'var(--ink-2)', display: 'grid', placeItems: 'center', color: '#fff', boxShadow: '0 2px 6px rgba(15,23,42,0.18)', marginTop: -8 }}>
                <I name="qr" size={20} />
              </div>
            ) : (
              <I name={t.ico} size={20} />
            )}
            <span style={{ fontSize: 10.5, fontWeight: isActive ? 600 : 500 }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { ForemanHome, ForemanConfirm });
