// Screen 13 — MTO Approval view
//
// Reached from Admin Home → "Review" on a pending MTO.
// Tabs: Summary | Full MTO. Sticky Approve / Reject bar at the bottom.

function MtoApproval({ density = 'default', collapsed = false, onToggleCollapse, tab = 'summary' }) {
  const project = {
    code: 'PRJ-2026-043',
    name: 'Westgate Tower Façade BMU',
    client: 'Westgate REIT',
    pm: 'A. Chen',
    submitted: '2h ago',
    submittedFull: 'May 16 · 07:42 UTC',
    location: 'San Francisco, CA',
    due: 'Jun 18, 2026',
    substrate: 'Steel I-beam',
    matCost: 12180,
    labourCost: 6240,
    total: 18420,
    lines: 28,
    instances: 2,
  };

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="projects" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Dashboard', 'Awaiting approval', project.code]} />
      <div className="pl-main">
        {/* Page head */}
        <div className="pl-page-head">
          <div className="pl-page-title-row">
            <Chip>{project.code}</Chip>
            <div className="pl-page-title">{project.name}</div>
            <Pill variant="info" dot>Pending approval</Pill>
            <span className="pl-chip" style={{ background: 'var(--surface-2)' }}>submitted by <span style={{ fontWeight: 600, marginLeft: 4 }}>{project.pm}</span> · {project.submitted}</span>
            <div className="pl-page-actions">
              <Btn ico="history" variant="ghost">Compare to last approved</Btn>
              <Btn ico="link" variant="ghost">Open project page</Btn>
              <Btn variant="ghost">Request changes</Btn>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pl-tabs">
          <div className={'pl-tab' + (tab === 'summary' ? ' is-active' : '')}>Summary</div>
          <div className={'pl-tab' + (tab === 'full' ? ' is-active' : '')}>Full MTO<span className="pl-tab-count">{project.lines}</span></div>
          <div className="pl-tab">Flags<span className="pl-tab-count">5</span></div>
          <div className="pl-tab">Diff from last approved</div>
          <div className="pl-tab">Comments<span className="pl-tab-count">3</span></div>
        </div>

        {/* Body — Summary tab content */}
        <div className="pl-scroll" style={{ padding: '18px 24px 96px' }}>
          {/* Two-column hero: project / cost summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 14 }}>
            <div className="pl-card">
              <div className="pl-card-head"><div className="pl-card-title">Project details</div></div>
              <div className="pl-meta" style={{ gridTemplateColumns: 'repeat(3, 1fr)', borderTop: 'none' }}>
                <div className="pl-meta-cell"><div className="pl-meta-label">Client</div><div className="pl-meta-value">{project.client}</div></div>
                <div className="pl-meta-cell"><div className="pl-meta-label">Location</div><div className="pl-meta-value">{project.location}</div></div>
                <div className="pl-meta-cell"><div className="pl-meta-label">Substrate</div><div className="pl-meta-value">{project.substrate}</div></div>
                <div className="pl-meta-cell"><div className="pl-meta-label">Project Manager</div><div className="pl-meta-value">{project.pm}</div></div>
                <div className="pl-meta-cell"><div className="pl-meta-label">Due</div><div className="pl-meta-value mono">{project.due}</div></div>
                <div className="pl-meta-cell"><div className="pl-meta-label">Submitted</div><div className="pl-meta-value">{project.submittedFull}</div></div>
              </div>
            </div>
            <div className="pl-card">
              <div className="pl-card-head"><div className="pl-card-title">Costs</div><span style={{ marginLeft: 'auto' }}><Pill variant="info">USD</Pill></span></div>
              <div style={{ padding: '14px 16px' }}>
                <CostRow label="Materials"   value={project.matCost}     color="var(--primary)" />
                <CostRow label="Labour"      value={project.labourCost}  color="var(--labour-ink)" sub="32.2 h across 3 phases" />
                <div style={{ height: 1, background: 'var(--line)', margin: '10px 0' }} />
                <CostRow label="Project total" value={project.total} bold large />
                <div className="pl-stack" style={{ marginTop: 12 }}>
                  <span style={{ width: ((project.matCost / project.total) * 100) + '%', background: 'var(--primary)' }} />
                  <span style={{ width: ((project.labourCost / project.total) * 100) + '%', background: 'var(--labour-ink)' }} />
                </div>
                <div style={{ marginTop: 6, fontSize: 11, color: 'var(--ink-4)', display: 'flex', justifyContent: 'space-between' }}>
                  <span><span style={{ width: 6, height: 6, background: 'var(--primary)', display: 'inline-block', marginRight: 4 }} />Materials <span className="mono tnum">{((project.matCost / project.total) * 100).toFixed(0)}%</span></span>
                  <span><span style={{ width: 6, height: 6, background: 'var(--labour-ink)', display: 'inline-block', marginRight: 4 }} />Labour <span className="mono tnum">{((project.labourCost / project.total) * 100).toFixed(0)}%</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Flags panel */}
          <div className="pl-card" style={{ marginBottom: 14 }}>
            <div className="pl-card-head">
              <I name="warn" size={14} style={{ color: 'var(--hivis-ink)' }} />
              <div className="pl-card-title">Flags · 5</div>
              <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>auto-detected · review before approval</span>
              <span style={{ marginLeft: 'auto' }}><Btn size="sm" variant="ghost">Dismiss all reviewed</Btn></span>
            </div>
            <div>
              <FlagRow tone="crit"  label="Cert expiring soon" detail="AS/NZS 1891.4 attestation on Modular Guardrail expires in 4 days · used on GR-01" />
              <FlagRow tone="warn"  label="2 material substitutions" detail="PM swapped CBL-SS-10 → CBL-SS-08 on LL-01 · same category, different MBL" />
              <FlagRow tone="warn"  label="Quantity override > 15%" detail="Stanchion qty raised from 22 → 28 (+27%) by PM" />
              <FlagRow tone="info"  label="New material introduced" detail="EPX-CHEM-300 first use on this tenant · 1 cert verified" />
              <FlagRow tone="info"  label="Project nearing due"     detail="32 days to needed-by · normal lead time for Helmsmiths is 14d" />
            </div>
          </div>

          {/* System instances summary */}
          <div className="pl-card" style={{ marginBottom: 14 }}>
            <div className="pl-card-head">
              <div className="pl-card-title">System instances · {project.instances}</div>
              <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--ink-4)' }}>Snapshot of Model versions pinned at submit</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--line)' }}>
              <InstanceMini sys="Anchor Point" code="AP-01" model="Type-A Swivel SS316" mv="v4" dim="14 anchors" subs="Steel I-beam" mat="$6,420" lab="$2,160" />
              <InstanceMini sys="Lifeline"     code="LL-01" model="Cable 8mm SS316"      mv="v3" dim="186 m segmented" subs="Steel I-beam" mat="$5,760" lab="$4,080" />
            </div>
          </div>

          {/* Mini preview of MTO */}
          <div className="pl-card">
            <div className="pl-card-head">
              <div className="pl-card-title">MTO preview · top contributors</div>
              <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--ink-4)' }}>5 of 28 lines · switch to Full MTO tab for all</span>
            </div>
            <table className="pl-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}></th>
                  <th style={{ width: 120 }}>SKU</th>
                  <th>Material</th>
                  <th style={{ width: 90 }}>System</th>
                  <th className="num" style={{ width: 80 }}>Qty</th>
                  <th className="num" style={{ width: 90 }}>Line total</th>
                  <th style={{ width: 100 }}>Flag</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div className="pl-thumb" style={{ width: 24, height: 24, fontSize: 13 }}>⚓</div></td>
                  <td className="mono" style={{ color: 'var(--ink-3)' }}>APT-A-SWV-SS</td>
                  <td><span style={{ fontWeight: 500 }}>Type-A Anchor, swivel SS316</span></td>
                  <td><Chip>AP-01</Chip></td>
                  <td className="num mono">14 <span className="unit">pcs</span></td>
                  <td className="num mono" style={{ fontWeight: 600 }}>$2,576.00</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td><div className="pl-thumb" style={{ width: 24, height: 24, fontSize: 13 }}>🪢</div></td>
                  <td className="mono" style={{ color: 'var(--ink-3)' }}>CBL-SS-08-100</td>
                  <td>
                    <span style={{ fontWeight: 500 }}>Cable, 7×19 SS316, ⌀8 mm</span>
                    <span style={{ marginLeft: 6 }}><Pill variant="modified">substituted</Pill></span>
                  </td>
                  <td><Chip>LL-01</Chip></td>
                  <td className="num mono">196 <span className="unit">m</span></td>
                  <td className="num mono" style={{ fontWeight: 600 }}>$2,783.20</td>
                  <td><HiVis>substitution</HiVis></td>
                </tr>
                <tr>
                  <td><div className="pl-thumb" style={{ width: 24, height: 24, fontSize: 13 }}>📐</div></td>
                  <td className="mono" style={{ color: 'var(--ink-3)' }}>STN-AL-450</td>
                  <td>
                    <span style={{ fontWeight: 500 }}>Stanchion, aluminium, 450 mm</span>
                    <span style={{ marginLeft: 6 }}><Pill variant="modified">qty +27%</Pill></span>
                  </td>
                  <td><Chip>LL-01</Chip></td>
                  <td className="num mono">28 <span className="unit">pcs</span></td>
                  <td className="num mono" style={{ fontWeight: 600 }}>$1,792.00</td>
                  <td><HiVis>override</HiVis></td>
                </tr>
                <tr>
                  <td><div className="pl-thumb" style={{ width: 24, height: 24, fontSize: 13 }}>🧷</div></td>
                  <td className="mono" style={{ color: 'var(--ink-3)' }}>TRM-END-08-K</td>
                  <td><span style={{ fontWeight: 500 }}>End Termination Kit, swaged</span></td>
                  <td><Chip>LL-01</Chip></td>
                  <td className="num mono">4 <span className="unit">kit</span></td>
                  <td className="num mono" style={{ fontWeight: 600 }}>$568.00</td>
                  <td>—</td>
                </tr>
                <tr>
                  <td><I name="cube" size={14} style={{ color: 'var(--labour-ink)' }} /></td>
                  <td className="mono" style={{ color: 'var(--labour-ink)' }}>walk</td>
                  <td className="pl-labour-cell"><span style={{ fontWeight: 500 }}>Cable run · install walk-time</span></td>
                  <td><LabourPill phase="installation" /></td>
                  <td className="num mono pl-labour-cell">18.6 h</td>
                  <td className="num mono pl-labour-cell" style={{ fontWeight: 600 }}>$837.00</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sticky Approve / Reject bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 232, right: 0,
          background: 'var(--surface)',
          borderTop: '1px solid var(--line-2)',
          padding: '12px 24px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: '0 -6px 18px rgba(15,23,42,0.06)',
          zIndex: 5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <I name="warn" size={14} style={{ color: 'var(--hivis-ink)' }} />
            <span style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>5 flags</span> · review before approval
            </span>
            <span style={{ width: 1, height: 16, background: 'var(--line)', margin: '0 6px' }} />
            <span style={{ fontSize: 12, color: 'var(--ink-4)' }}>Approving issues this MTO to <span style={{ color: 'var(--ink-2)', fontWeight: 500 }}>SF Yard A</span> for storeman pick.</span>
          </div>
          <span style={{ flex: 1 }} />
          <div style={{ fontSize: 12, color: 'var(--ink-4)', textAlign: 'right' }}>
            <div>Project total</div>
            <div className="mono tnum" style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)' }}>${project.total.toLocaleString()}</div>
          </div>
          <Btn>Request changes</Btn>
          <button className="pl-btn" style={{ background: 'var(--danger)', borderColor: 'var(--danger)', color: '#fff', height: 38, padding: '0 14px' }}>
            <I name="x" />Reject
          </button>
          <button className="pl-btn primary" style={{ height: 38, padding: '0 18px', fontSize: 13.5 }}>
            <I name="check" />Approve & issue to storeman
          </button>
        </div>
      </div>
    </div>
  );
}

function CostRow({ label, value, color, sub, bold, large }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: bold ? '6px 0 2px' : '4px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {color && <span style={{ width: 8, height: 8, background: color, borderRadius: 2 }} />}
        <span style={{ fontSize: bold ? 13 : 12.5, fontWeight: bold ? 600 : 500, color: bold ? 'var(--ink)' : 'var(--ink-2)' }}>{label}</span>
        {sub && <span style={{ fontSize: 11, color: 'var(--ink-5)', marginLeft: 4 }}>· {sub}</span>}
      </div>
      <span className="mono tnum" style={{ fontSize: large ? 22 : 14, fontWeight: bold ? 700 : 500, color: bold ? 'var(--ink)' : color || 'var(--ink-2)', letterSpacing: large ? '-0.02em' : 0 }}>${value.toLocaleString()}</span>
    </div>
  );
}

function FlagRow({ tone, label, detail }) {
  const ic = { crit: 'warn', warn: 'warn', info: 'check' }[tone] || 'warn';
  const fg = { crit: 'var(--danger)', warn: 'var(--hivis-ink)', info: 'var(--primary)' }[tone];
  const bg = { crit: 'var(--danger-soft)', warn: 'var(--hivis-soft)', info: 'var(--primary-soft)' }[tone];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr auto', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
      <span style={{ width: 26, height: 26, borderRadius: 13, background: bg, color: fg, display: 'grid', placeItems: 'center' }}>
        <I name={ic} size={13} />
      </span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{detail}</div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Btn size="sm" variant="ghost">Dismiss</Btn>
        <Btn size="sm">Open</Btn>
      </div>
    </div>
  );
}

function InstanceMini({ sys, code, model, mv, dim, subs, mat, lab }) {
  return (
    <div style={{ padding: 14, background: 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Chip>{code}</Chip>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{sys}</span>
        <Chip>{mv}</Chip>
      </div>
      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 6 }}>{model}</div>
      <div style={{ display: 'flex', gap: 12, fontSize: 11.5, color: 'var(--ink-4)' }}>
        <span><span className="mono tnum" style={{ color: 'var(--ink-2)', fontWeight: 500 }}>{dim}</span></span>
        <span style={{ width: 1, height: 14, background: 'var(--line)' }} />
        <span>{subs}</span>
      </div>
      <div style={{ marginTop: 10, display: 'flex', gap: 14, fontSize: 11 }}>
        <div>
          <div style={{ color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>Materials</div>
          <div className="mono tnum" style={{ fontSize: 14, fontWeight: 600 }}>{mat}</div>
        </div>
        <div>
          <div style={{ color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 10 }}>Labour</div>
          <div className="mono tnum" style={{ fontSize: 14, fontWeight: 600, color: 'var(--labour-ink)' }}>{lab}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MtoApproval });
