// Screen 9 — Cut Plan view
//
// Linear (1D bin packing) for cable + plate (2D rect packing) for grating.
// Reached by "View cut plan" on a parts row or MTO line item.

function CutPlan({ density = 'compact', collapsed = false, onToggleCollapse }) {
  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="projects" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Projects', 'Aurora Bridge — North Span', 'MTO', 'CBL-SS-08-100', 'Cut plan']} />
      <div className="pl-main">
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <Chip>CBL-SS-08-100</Chip>
            <div className="pl-page-title">Cut plan · Cable, 7×19 SS316, ⌀8 mm</div>
            <Pill variant="info">linearCut · FFD</Pill>
            <Pill variant="approved" dot>locked to MTO</Pill>
            <div className="pl-page-actions">
              <Btn ico="download" variant="ghost">Export DXF</Btn>
              <Btn ico="refresh">Re-solve</Btn>
              <Btn variant="primary" ico="check">Send to picking list</Btn>
            </div>
          </div>
          <div className="pl-page-sub">Generated from <span className="mono">linearCut(segments, stock_lengths=[6, 12, 25], kerf=3mm, min_offcut_reusable=2m)</span> · solved in 0.6 ms</div>
        </div>

        {/* Stats strip */}
        <div className="pl-meta" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          <Stat label="Total required" value="247.4 m" sub="4 cuts" />
          <Stat label="To purchase" value="2×12m + 2×6m" sub="3 pieces · pack 4" mono />
          <Stat label="Purchase length" value="36.0 m" sub="incl. kerf 12 mm" />
          <Stat label="Total waste" value="1.8 m" sub="5.0% scrap" warn />
          <Stat label="Reusable offcuts" value="2.4 m" sub="returns to bin" success />
          <Stat label="Utilization" value="93.3%" sub="cuts ÷ purchase" />
        </div>

        <div className="pl-scroll" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', alignItems: 'flex-start' }}>
          {/* Main visualization */}
          <div style={{ padding: '18px 24px 24px', minWidth: 0 }}>
            {/* Tabs to switch between linear and plate */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Seg items={['Linear · cable', 'Plate · grating', 'Picking list', 'Raw inputs']} active="Linear · cable" />
              <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--ink-4)' }}>algorithm <span className="mono">First-Fit Decreasing</span> · kerf <span className="mono">3 mm</span> · min reusable <span className="mono">2 m</span></span>
            </div>

            <div className="pl-card" style={{ padding: 18, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Linear cut plan</span>
                <span className="mono tnum" style={{ fontSize: 11, color: 'var(--ink-4)' }}>3 stock pieces · 4 cuts placed</span>
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, fontSize: 10.5, color: 'var(--ink-4)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, background: '#1E40AF', borderRadius: 1 }} />cut</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, background: '#0F766E', borderRadius: 1 }} />reusable offcut</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, background: 'repeating-linear-gradient(45deg, #FACC15 0 4px, #fff 4px 8px)', borderRadius: 1, border: '1px solid #F1C20E' }} />waste</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 1, height: 12, background: '#475569' }} />kerf</span>
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <LinearStock idx={1} length={12} cuts={[{ len: 8.6, label: 'Segment 1 · part A' }]} offcut={{ len: 3.4, reusable: true }} waste={0} kerfMm={3} />
                <LinearStock idx={2} length={12} cuts={[{ len: 4.2, label: 'Segment 2' }, { len: 4.2, label: 'Segment 3' }, { len: 3.2, label: 'Segment 1 · part B' }]} offcut={{ len: 0.4, reusable: false }} waste={0.4} kerfMm={3} />
                <LinearStock idx={3} length={6} cuts={[{ len: 5.6, label: 'Segment 4' }]} offcut={{ len: 0.4, reusable: false }} waste={0.4} kerfMm={3} />
                <LinearStock idx={4} length={6} cuts={[{ len: 4.0, label: 'Segment 5' }]} offcut={{ len: 2.0, reusable: true }} waste={0} kerfMm={3} />
              </div>
            </div>

            {/* Plate plan card */}
            <div className="pl-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Plate cut plan</span>
                <Chip>GRT-30-100-2412</Chip>
                <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>Walkway grating, 30×100, 2400×1200</span>
                <Pill variant="modified">grain locked</Pill>
                <span className="mono" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-4)' }}>maxRects · GUILLOTINE · BLSF</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <PlateSheet idx={1} util={88} pieces={[
                  { x: 0, y: 0, w: 1200, h: 800, label: 'A1 · 1200×800' },
                  { x: 1200, y: 0, w: 1100, h: 800, label: 'A2 · 1100×800' },
                  { x: 0, y: 800, w: 600, h: 400, label: 'B1' },
                  { x: 600, y: 800, w: 600, h: 400, label: 'B2' },
                  { x: 1200, y: 800, w: 1100, h: 400, label: 'C1 · 1100×400' },
                ]} sheetW={2400} sheetH={1200} kerf={3} />
                <PlateSheet idx={2} util={64} pieces={[
                  { x: 0, y: 0, w: 1200, h: 800, label: 'A3 · 1200×800' },
                  { x: 0, y: 800, w: 600, h: 400, label: 'B3' },
                ]} sheetW={2400} sheetH={1200} kerf={3} note="reusable: 1200×800 + 1800×400" />
              </div>
              <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--success-soft)', border: '1px solid #BFDDD8', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--success)' }}>
                <I name="check" size={13} />
                Sheet 2 has <span className="mono tnum" style={{ fontWeight: 600 }}>1.92 m²</span> reusable area · admin can return remnant to stock on issuance.
              </div>
            </div>
          </div>

          {/* Right — picking list + algo settings */}
          <div style={{ borderLeft: '1px solid var(--line)', background: 'var(--surface)', position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100%' }}>
            <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <I name="list" size={14} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Picking list · cut instructions</span>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2 }}>Storeman sees these as fabrication steps when issuing this line.</div>
            </div>
            <div style={{ padding: 0 }}>
              {[
                { piece: 1, len: '12 m', cuts: ['8.6 m → Segment 1 · part A'], offcut: '3.4 m → bin A-12 (reusable)' },
                { piece: 2, len: '12 m', cuts: ['4.2 m → Segment 2', '4.2 m → Segment 3', '3.2 m → Segment 1 · part B'] },
                { piece: 3, len: '6 m',  cuts: ['5.6 m → Segment 4'] },
                { piece: 4, len: '6 m',  cuts: ['4.0 m → Segment 5'], offcut: '2.0 m → bin A-12 (reusable)' },
              ].map((p, i) => (
                <div key={p.piece} style={{ padding: '12px 20px', borderBottom: i < 3 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Chip>roll {p.piece}</Chip>
                    <span className="mono tnum" style={{ fontWeight: 500 }}>{p.len}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--ink-5)' }}>cut order: longest first</span>
                  </div>
                  <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {p.cuts.map((c, ci) => (
                      <li key={ci} className="mono" style={{ fontSize: 11.5, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 16, height: 16, borderRadius: 8, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 600 }}>{ci + 1}</span>
                        {c}
                      </li>
                    ))}
                    {p.offcut && (
                      <li className="mono" style={{ fontSize: 11.5, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                        <I name="refresh" size={11} />{p.offcut}
                      </li>
                    )}
                  </ol>
                </div>
              ))}
            </div>

            <div style={{ padding: '14px 20px 16px', borderTop: '1px solid var(--line)' }}>
              <div className="pl-label">Algorithm</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                <SettingRow label="Linear" value="First-Fit Decreasing" />
                <SettingRow label="Plate"  value="MaxRects · BLSF" />
                <SettingRow label="Kerf"   value="3 mm" mono />
                <SettingRow label="Min reusable" value="2 m / 0.5 m²" mono />
                <SettingRow label="Edge trim" value="—" mono muted />
              </div>
              <div style={{ marginTop: 12, padding: '8px 10px', background: 'var(--hivis-soft)', border: '1px solid var(--hivis-line)', borderRadius: 4, fontSize: 11.5, color: 'var(--hivis-ink)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <I name="warn" size={12} style={{ marginTop: 2 }} />
                <span>Greedy offcut-first is off · v1.5 will prefer existing remnants in <span className="mono">bin A-12</span> before consuming new stock.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, warn, success, mono }) {
  return (
    <div className="pl-meta-cell">
      <div className="pl-meta-label">{label}</div>
      <div className={'pl-meta-value' + (mono ? ' mono' : '')} style={{ color: warn ? 'var(--hivis-ink)' : success ? 'var(--success)' : 'var(--ink)' }}>{value}</div>
      {sub && <div style={{ fontSize: 10.5, color: 'var(--ink-5)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function SettingRow({ label, value, mono, muted }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'var(--ink-4)', fontSize: 11.5 }}>{label}</span>
      <span className={mono ? 'mono' : ''} style={{ fontSize: 12, color: muted ? 'var(--ink-5)' : 'var(--ink-2)', fontWeight: muted ? 400 : 500 }}>{value}</span>
    </div>
  );
}

// LinearStock — one row visualization. Uses CSS grid based on millimeters for accuracy.
function LinearStock({ idx, length, cuts, offcut, waste, kerfMm }) {
  // total visual track is length in meters; we render proportionally
  const totalMm = length * 1000;
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
        <Chip>roll {idx}</Chip>
        <span className="mono tnum" style={{ fontSize: 12, fontWeight: 500 }}>{length} m stock</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono tnum">
          cuts: {cuts.length} · waste: {waste > 0 ? <span style={{ color: 'var(--hivis-ink)', fontWeight: 600 }}>{waste.toFixed(1)} m</span> : <span style={{ color: 'var(--success)' }}>0</span>}
          {offcut && offcut.reusable && <span style={{ color: 'var(--success)', marginLeft: 8 }}>· reusable {offcut.len} m →</span>}
        </span>
      </div>
      <div style={{ position: 'relative', height: 56, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 4, overflow: 'hidden' }}>
        {/* ruler — every 1m tick */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {Array.from({ length: length + 1 }).map((_, i) => (
            <span key={i} style={{ position: 'absolute', top: 0, bottom: 0, left: ((i / length) * 100) + '%', borderLeft: '1px dashed var(--line)' }} />
          ))}
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
          {cuts.map((c, i) => (
            <CutSegment key={i} pct={(c.len / length) * 100} label={c.label} sub={c.len + ' m'} />
          ))}
          {/* kerf for each cut (visual hint) */}
          {cuts.map((_, i) => i < cuts.length - 1 || offcut ? (
            <span key={'k' + i} style={{ width: '0.6%', background: 'repeating-linear-gradient(90deg, #475569 0 1px, transparent 1px 2px)', alignSelf: 'stretch' }} title={`kerf ${kerfMm}mm`} />
          ) : null)}
          {offcut && (
            <span style={{
              width: ((offcut.len / length) * 100) + '%',
              background: offcut.reusable
                ? '#E6F0EE'
                : 'repeating-linear-gradient(45deg, #FEF6C7 0 6px, #fff 6px 12px)',
              borderLeft: '1px solid ' + (offcut.reusable ? '#0F766E' : 'var(--hivis-line)'),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-mono)', fontSize: 10.5,
              color: offcut.reusable ? 'var(--success)' : 'var(--hivis-ink)',
            }}>
              {offcut.len} m {offcut.reusable ? '· reusable' : '· scrap'}
            </span>
          )}
        </div>
      </div>
      {/* dimension line below */}
      <div style={{ position: 'relative', height: 14, marginTop: 2 }}>
        <span style={{ position: 'absolute', left: 0, top: 4, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-5)' }}>0</span>
        <span style={{ position: 'absolute', right: 0, top: 4, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-5)' }}>{length} m</span>
      </div>
    </div>
  );
}

function CutSegment({ pct, label, sub }) {
  return (
    <span style={{
      width: pct + '%',
      background: '#1E40AF',
      color: '#fff',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '0 8px',
      borderRight: '1px solid rgba(255,255,255,0.15)',
      overflow: 'hidden',
    }}>
      <span style={{ fontSize: 10.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', opacity: 0.8 }}>{sub}</span>
    </span>
  );
}

// PlateSheet — top-down 2D view of placed pieces on a sheet.
function PlateSheet({ idx, util, pieces, sheetW, sheetH, kerf, note }) {
  const ratio = sheetH / sheetW;
  const colors = ['#1E40AF', '#0F766E', '#7C2D12', '#1E40AF', '#475569', '#0F766E'];
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
        <Chip>sheet {idx}</Chip>
        <span className="mono tnum" style={{ fontSize: 11.5, fontWeight: 500 }}>{sheetW}×{sheetH} mm</span>
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: 'var(--ink-4)' }} className="tnum">util <span className="mono" style={{ color: util > 80 ? 'var(--success)' : util > 60 ? 'var(--ink-2)' : 'var(--hivis-ink)' }}>{util}%</span></span>
      </div>
      <div style={{ position: 'relative', width: '100%', paddingTop: (ratio * 100) + '%', background: 'repeating-linear-gradient(45deg, #FEF6C7 0 6px, #fff 6px 12px)', border: '1px solid var(--line-2)', borderRadius: 4 }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          {pieces.map((p, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: (p.x / sheetW * 100) + '%',
              top:  (p.y / sheetH * 100) + '%',
              width:  (p.w / sheetW * 100) + '%',
              height: (p.h / sheetH * 100) + '%',
              background: colors[i % colors.length],
              border: '1px solid rgba(255,255,255,0.3)',
              boxSizing: 'border-box',
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontFamily: 'var(--font-mono)',
              padding: 4,
              textAlign: 'center',
              overflow: 'hidden',
            }}>
              {p.label}
            </div>
          ))}
        </div>
        {/* dimension labels */}
        <span style={{ position: 'absolute', top: -16, left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'var(--ink-5)' }}>{sheetW} mm</span>
      </div>
      {note && <div style={{ fontSize: 10.5, color: 'var(--success)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{note}</div>}
    </div>
  );
}

window.CutPlan = CutPlan;
