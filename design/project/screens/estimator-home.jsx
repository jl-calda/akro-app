// Estimator · Dashboard (cost-focused attention cards)

function EstimatorHome({ density = 'default', collapsed = false, onToggleCollapse }) {
  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="quotes" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Estimator', 'Quotes']} search="Search quotes, projects, materials, suppliers…" />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500 }}>Estimator · Vertex Safety</div>
              <div className="pl-page-title">Quotes</div>
            </div>
            <div className="pl-page-actions">
              <Btn ico="fork" variant="ghost">Procurement</Btn>
              <Btn ico="package">New PO</Btn>
              <Btn variant="primary" ico="plus">New Quote</Btn>
            </div>
          </div>
        </div>

        <div className="pl-meta" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          <Stat label="Win rate · 90d" value="62%" sub="13 of 21 awarded" />
          <Stat label="Awarded value · MTD" value="$284k" sub="$1.8M YTD" />
          <Stat label="Pipeline · sent" value="$412k" sub="6 quotes" />
          <Stat label="Avg margin" value="24.3%" sub="materials + labour" />
          <Stat label="POs awaiting approval" value="3" sub="2 over threshold" warn link />
          <Stat label="Quote SLA breach" value="2" sub="needs-pricing &gt; 48h" warn />
        </div>

        <div className="pl-scroll" style={{ padding: '18px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            <AdminCard title="Needs pricing" count={5} tone="primary" ico="edit" sub="Draft quotes with Instances but no pricing yet">
              {[
                { q: 'Q-2026-094', proj: 'Aurora Bridge — North Span',   client: 'Caltrans D4',   age: 'submitted 12h ago', lines: 28 },
                { q: 'Q-2026-093', proj: 'Riverside Bus Depot',           client: 'AC Transit',   age: '1d ago',           lines: 22 },
                { q: 'Q-2026-092', proj: 'Lakefront Wind Farm Phase 2',   client: 'Pacific Renew', age: '2d ago',           lines: 44 },
              ].map(q => (
                <ListRow key={q.q}>
                  <Chip>{q.q}</Chip>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.proj}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{q.client} · {q.age}</div>
                  </div>
                  <div className="mono tnum" style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{q.lines} lines</div>
                  <Btn size="sm" variant="primary">Price</Btn>
                </ListRow>
              ))}
            </AdminCard>

            <AdminCard title="Internal review" count={3} tone="warn" ico="warn" sub="Waiting on admin sign-off · sent after approval">
              {[
                { q: 'Q-2026-091', proj: 'Westgate Tower Façade BMU', val: 184200, age: '3h', margin: 22 },
                { q: 'Q-2026-088', proj: 'Pier 39 Maintenance Access', val: 96420, age: '1d', margin: 18, low: true },
                { q: 'Q-2026-086', proj: 'Sutter Hospital · Helipad',   val: 64800, age: '2d', margin: 26 },
              ].map(q => (
                <ListRow key={q.q}>
                  <Chip>{q.q}</Chip>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.proj}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{q.age} ago · margin <span className="mono tnum" style={{ color: q.low ? 'var(--hivis-ink)' : 'var(--ink-2)' }}>{q.margin}%</span> {q.low && <span style={{ color: 'var(--hivis-ink)' }}>· below floor</span>}</div>
                  </div>
                  <span className="mono tnum" style={{ fontSize: 13, fontWeight: 600 }}>${q.val.toLocaleString()}</span>
                </ListRow>
              ))}
            </AdminCard>

            <AdminCard title="Sent · nearing expiry" count={4} tone="hivis" ico="history" sub="Auto-expires unless awarded · client follow-ups">
              {[
                { q: 'Q-2026-079', proj: 'Greenline Light Rail Depot',  val: 144000, exp: 'expires today', tone: 'crit' },
                { q: 'Q-2026-076', proj: 'Bayport Refinery Catwalks',   val: 218400, exp: '3 days',       tone: 'warn' },
                { q: 'Q-2026-072', proj: 'Vega Cold Storage · Mezz',    val: 92000,  exp: '8 days' },
              ].map(q => (
                <ListRow key={q.q}>
                  <Chip>{q.q}</Chip>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.proj}</div>
                    <div style={{ fontSize: 11, color: q.tone === 'crit' ? 'var(--danger)' : q.tone === 'warn' ? 'var(--hivis-ink)' : 'var(--ink-4)' }} className="mono">{q.exp}</div>
                  </div>
                  <span className="mono tnum" style={{ fontSize: 13, fontWeight: 600 }}>${q.val.toLocaleString()}</span>
                </ListRow>
              ))}
            </AdminCard>

            <AdminCard title="Recently awarded" count="this month" tone="primary" ico="check" sub="Working Sets auto-created · ready for PM">
              {[
                { q: 'Q-2026-074', proj: 'Aurora Bridge — North Span',  val: 184200, when: '3 days ago', who: 'A. Chen' },
                { q: 'Q-2026-068', proj: 'Tideline DC · Phase 2',        val: 76400, when: 'May 09',    who: 'D. Khoury' },
                { q: 'Q-2026-064', proj: 'Bay Bridge Service Platforms', val: 134800, when: 'May 02',    who: 'A. Chen' },
              ].map(q => (
                <ListRow key={q.q}>
                  <Chip>{q.q}</Chip>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.proj}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>{q.when} · PM {q.who}</div>
                  </div>
                  <span className="mono tnum" style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)' }}>+${q.val.toLocaleString()}</span>
                </ListRow>
              ))}
            </AdminCard>

            <AdminCard title="POs in flight" count={9} tone="ink" ico="package" sub="Pending approval · sent · partially received">
              {[
                { po: 'PO-2026-0291', sup: 'Helmsmiths', val: 18420, state: 'sent',  proj: 'Aurora Bridge · stock_repl' },
                { po: 'PO-2026-0289', sup: 'AluForm',    val: 9840,  state: 'pending', proj: 'Aurora + Bayport (combined)', flag: 'admin approval' },
                { po: 'PO-2026-0286', sup: 'FastWorks',  val: 4280,  state: 'partial', proj: 'replenishment' },
              ].map(p => (
                <ListRow key={p.po}>
                  <Chip>{p.po}</Chip>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{p.sup}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.proj}</div>
                  </div>
                  {p.state === 'sent'    && <Pill variant="info">sent</Pill>}
                  {p.state === 'pending' && <Pill variant="modified">pending</Pill>}
                  {p.state === 'partial' && <Pill variant="approved" dot>partial</Pill>}
                  <span className="mono tnum" style={{ fontSize: 13, fontWeight: 600 }}>${p.val.toLocaleString()}</span>
                </ListRow>
              ))}
            </AdminCard>

            <AdminCard title="Recent activity · 7d" count="42 events" tone="ink" ico="history" sub="Quotes · POs · awards" filter>
              {[
                { ico: 'check',  tone: 'success', label: 'Q-2026-074 awarded',           meta: 'Aurora Bridge · $184,200 · A. Chen' },
                { ico: 'upload', tone: 'primary', label: 'Q-2026-091 submitted for review', meta: 'Westgate · $184k · 3h ago' },
                { ico: 'package', tone: 'primary', label: 'PO-2026-0291 sent',           meta: 'Helmsmiths · $18,420' },
                { ico: 'edit',   tone: 'ink',     label: 'Q-2026-093 priced',            meta: 'Riverside Bus Depot · margin 22%' },
                { ico: 'warn',   tone: 'warn',    label: 'Q-2026-079 nearing expiry',    meta: 'Greenline · today' },
              ].map((a, i) => (
                <ListRow key={i} compact>
                  <span style={{ width: 22, height: 22, borderRadius: 11, background: a.tone === 'success' ? 'var(--success-soft)' : a.tone === 'primary' ? 'var(--primary-soft)' : a.tone === 'warn' ? 'var(--hivis-soft)' : 'var(--surface-2)', display: 'grid', placeItems: 'center', color: a.tone === 'success' ? 'var(--success)' : a.tone === 'primary' ? 'var(--primary)' : a.tone === 'warn' ? 'var(--hivis-ink)' : 'var(--ink-3)' }}>
                    <I name={a.ico} size={11} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.label}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>{a.meta}</div>
                  </div>
                </ListRow>
              ))}
            </AdminCard>
          </div>
        </div>
      </div>
    </div>
  );
}

window.EstimatorHome = EstimatorHome;
