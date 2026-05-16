// Admin · Stock Overview (default view of Stock section)

function StockOverview({ density = 'default', collapsed = false, onToggleCollapse }) {
  const locations = [
    { code: 'sf-yard-a', name: 'SF Yard A',      role: 'primary', skus: 412, val: 684_200, lastActivity: '12m ago' },
    { code: 'oakland',   name: 'Oakland Hub',    role: 'satellite', skus: 184, val: 312_800, lastActivity: '2h ago' },
    { code: 'van-03',    name: 'Mobile Van 03',  role: 'mobile',    skus: 28,  val: 28_400,  lastActivity: 'Yesterday' },
    { code: 'sj-secure', name: 'San Jose Secure', role: 'secure',   skus: 96,  val: 392_800, lastActivity: '4d ago' },
  ];
  const totalVal = locations.reduce((s, l) => s + l.val, 0);

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="stock" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Stock', 'Overview']} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <div className="pl-page-title">Stock</div>
            <Pill variant="info">4 locations</Pill>
            <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>847 SKUs · 14 critically low</span>
            <div className="pl-page-actions">
              <Btn ico="fork" variant="ghost">New transfer</Btn>
              <Btn ico="upload">Receive stock</Btn>
              <Btn variant="primary" ico="plus">Adjustment</Btn>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pl-tabs">
          <div className="pl-tab is-active">Overview</div>
          <div className="pl-tab">Locations<span className="pl-tab-count">4</span></div>
          <div className="pl-tab">Movements<span className="pl-tab-count">last 24h</span></div>
          <div className="pl-tab">Adjustments<span className="pl-tab-count">2</span></div>
          <div className="pl-tab">Transfers<span className="pl-tab-count">1</span></div>
          <div className="pl-tab">Low stock<span className="pl-tab-count">14</span></div>
        </div>

        {/* Stat strip */}
        <div className="pl-meta" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          <Stat label="Total SKUs" value="847" sub="across all locations" />
          <Stat label="Stock value" value={`$${(totalVal / 1000).toFixed(0)}k`} sub="rolled-up at unit cost" />
          <Stat label="Receipts · 7d" value="42" sub={`$84k in`} />
          <Stat label="Issuances · 7d" value="118" sub={`$62k out`} />
          <Stat label="Low stock" value="14" sub="4 critical · 4 below reorder" warn link />
          <Stat label="Open transfers" value="1" sub="SF → Oakland" />
        </div>

        <div className="pl-scroll" style={{ padding: '18px 24px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
            {/* Locations card */}
            <div className="pl-card">
              <div className="pl-card-head">
                <div className="pl-card-title">Stock by location</div>
                <span style={{ marginLeft: 'auto' }}><Btn size="sm" ico="qr" variant="ghost">Print bin QRs</Btn></span>
              </div>
              <table className="pl-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>Role</th>
                    <th className="num">SKUs</th>
                    <th className="num">Value</th>
                    <th style={{ width: 140 }}>Share</th>
                    <th>Last activity</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map(l => (
                    <tr key={l.code}>
                      <td style={{ fontWeight: 500 }}>{l.name}</td>
                      <td>{l.role === 'primary' ? <Pill variant="info">primary</Pill> : <Chip>{l.role}</Chip>}</td>
                      <td className="num mono">{l.skus}</td>
                      <td className="num mono">${l.val.toLocaleString()}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <ProgressBar value={l.val} max={totalVal} />
                          <span className="mono tnum" style={{ fontSize: 10.5, color: 'var(--ink-4)', width: 36, textAlign: 'right' }}>{((l.val / totalVal) * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--ink-4)', fontSize: 12 }}>{l.lastActivity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Low-stock + movements stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <AdminCard title="Critically low" count={4} tone="warn" ico="warn" sub="≤ 25% of reorder threshold">
                {[
                  { th: '🔩', sku: 'BLT-BMET-14', name: 'Bi-metal Self-Drill 14 mm', stock: 0, reorder: 200, crit: true },
                  { th: '🧷', sku: 'TRM-END-10-K', name: 'End Termination Kit 10 mm', stock: 4, reorder: 12, crit: true },
                  { th: '⚓', sku: 'APT-A-FIX-SS', name: 'Type-A Anchor, fixed', stock: 6, reorder: 20 },
                ].map(m => (
                  <ListRow key={m.sku} compact>
                    <div className="pl-thumb" style={{ width: 22, height: 22, fontSize: 12 }}>{m.th}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                      <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>{m.sku}</div>
                    </div>
                    <span className="mono tnum" style={{ fontSize: 13, fontWeight: 600, color: m.crit ? 'var(--danger)' : 'var(--hivis-ink)' }}>{m.stock}</span>
                    <Btn size="sm">Order</Btn>
                  </ListRow>
                ))}
              </AdminCard>

              <AdminCard title="Recent movements" count="last 24h" tone="ink" ico="history" filter>
                {[
                  { ico: 'arrowDown', tone: 'success', label: 'Receipt · 200 m CBL-SS-08-100',   meta: 'SF Yard A · R. Mathers' },
                  { ico: 'arrowUp',   tone: 'primary', label: 'Issuance · 250 m → Aurora Bridge', meta: 'SF Yard A · R. Mathers' },
                  { ico: 'fork',      tone: 'ink',     label: 'Transfer · 12 INT-ANC-12 → Oakland', meta: 'A. Chen' },
                  { ico: 'refresh',   tone: 'warn',    label: 'Return · 8 m GR-RAIL → Pier 39',  meta: 'D. Khoury' },
                ].map((m, i) => (
                  <ListRow key={i} compact>
                    <span style={{ width: 20, height: 20, borderRadius: 10, background: m.tone === 'success' ? 'var(--success-soft)' : m.tone === 'primary' ? 'var(--primary-soft)' : m.tone === 'warn' ? 'var(--hivis-soft)' : 'var(--surface-2)', display: 'grid', placeItems: 'center', color: m.tone === 'success' ? 'var(--success)' : m.tone === 'primary' ? 'var(--primary)' : m.tone === 'warn' ? 'var(--hivis-ink)' : 'var(--ink-3)' }}>
                      <I name={m.ico} size={10} />
                    </span>
                    <div style={{ flex: 1, minWidth: 0, fontSize: 11.5 }}>
                      <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.label}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>{m.meta}</div>
                    </div>
                  </ListRow>
                ))}
              </AdminCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.StockOverview = StockOverview;
