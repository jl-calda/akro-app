// Screen 8 — Model Edit Workbench
//
// 4 zones: Header · Custom dimensions · Variants · Parts list (inline rules)
// One parts row shows an expanded inline-formula drawer (live preview).
// One row is a sub-assembly with parameter bindings + expansion preview.
// One row is a cutting-algorithm row with a "View cut plan" affordance.

function ModelEdit({ density = 'compact', collapsed = false, onToggleCollapse }) {
  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="systems" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Catalog', 'Systems', 'Lifeline', 'Models', 'Cable Lifeline 8mm SS316']} />
      <div className="pl-main">
        {/* sticky header / version bar */}
        <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
          <div style={{ padding: '14px 24px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Chip>LL-CBL-08-SS316</Chip>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em' }}>Cable Lifeline 8mm SS316</div>
            <Pill variant="info">v3 · draft</Pill>
            <Pill variant="" dot>unsaved · 2 changes</Pill>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <Btn ico="history" variant="ghost">History</Btn>
              <Btn ico="copy" variant="ghost">Duplicate</Btn>
              <Btn>Test with sample project</Btn>
              <Btn>Save draft</Btn>
              <Btn variant="primary" ico="check">Publish v3</Btn>
            </div>
          </div>
          {/* Compact tab strip — zones nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '0 24px 10px', fontSize: 11.5 }}>
            {[
              ['Header',           '5 fields'],
              ['Custom dimensions', '2 added'],
              ['Variants',          '3 defined'],
              ['Parts list',        '11 rows · 2 sub-assemblies'],
              ['Tests',             '7 saved · all pass'],
            ].map(([z, sub], i) => (
              <div key={z} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="mono" style={{ color: 'var(--ink-5)' }}>0{i + 1}</span>
                <span style={{ color: 'var(--ink-2)', fontWeight: 600 }}>{z}</span>
                <span style={{ color: 'var(--ink-5)' }}>· {sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pl-scroll" style={{ display: 'grid', gridTemplateColumns: '1fr 540px', alignItems: 'flex-start' }}>
          {/* LEFT: zones */}
          <div style={{ padding: '18px 22px', minWidth: 0 }}>
            {/* ZONE 1 — Header */}
            <ZoneHeader idx="01" title="Header" sub="Constraints that decide when this Model is selectable in a project." />
            <div className="pl-card" style={{ overflow: 'hidden', marginBottom: 18 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 0 }}>
                <FieldRow label="Supported Shapes">
                  <Pill variant="info">Straight</Pill>
                  <Pill variant="info">Segmented</Pill>
                  <button className="pl-btn ghost sm"><I name="plus" size={11} />Add</button>
                </FieldRow>
                <FieldRow label="Substrates">
                  <Pill variant="approved" dot>Steel I-beam</Pill>
                  <Pill variant="approved" dot>Steel purlin</Pill>
                  <Pill variant="approved" dot>Concrete deck</Pill>
                  <Pill variant="approved" dot>Metal deck</Pill>
                  <Pill variant="approved" dot>Timber</Pill>
                  <button className="pl-btn ghost sm"><I name="plus" size={11} />Add</button>
                </FieldRow>
                <FieldRow label="Certifications">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                    <CertChip name="EN 795:2012 Type C" exp="2027-04-12" attached />
                    <CertChip name="OSHA 1926.502" exp="2026-06-11" attached warn="exp 26 days" />
                    <CertChip name="AS/NZS 1891.2:2001" exp="2027-09-30" attached />
                    <button className="pl-btn ghost sm" style={{ alignSelf: 'flex-start' }}><I name="plus" size={11} />Attach cert PDF</button>
                  </div>
                </FieldRow>
                <FieldRow label="Selectable when" hint="Model-level gates · greys out the Model if not satisfied">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                    <GateRow expr="length <= 60" hint="m, total path length" />
                    <GateRow expr="user.count <= 2" hint="simultaneous users" />
                    <button className="pl-btn ghost sm" style={{ alignSelf: 'flex-start' }}><I name="plus" size={11} />Add gate</button>
                  </div>
                </FieldRow>
                <FieldRow label="Pinned material versions">
                  <span style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>14 materials · 2 sub-assemblies · latest snapshot taken on save</span>
                  <button className="pl-btn ghost sm" style={{ marginLeft: 'auto' }}>Review pins</button>
                </FieldRow>
              </div>
            </div>

            {/* ZONE 2 — Custom dimensions */}
            <ZoneHeader idx="02" title="Custom dimensions" sub="Extend the System's dimension schema. Unioned with System dims at project time." actions={<Btn size="sm" ico="plus">Add custom dimension</Btn>} />
            <div className="pl-card" style={{ overflow: 'hidden', marginBottom: 18 }}>
              <table className="pl-table">
                <thead>
                  <tr>
                    <th style={{ width: 22 }}></th>
                    <th style={{ width: 160 }}>Key</th>
                    <th style={{ width: 160 }}>Label</th>
                    <th style={{ width: 110 }}>Type</th>
                    <th style={{ width: 60 }}>Unit</th>
                    <th style={{ width: 70 }}>Required</th>
                    <th style={{ width: 90 }}>Default</th>
                    <th style={{ width: 110 }}>Min · Max</th>
                    <th>Help text</th>
                    <th style={{ width: 24 }}></th>
                  </tr>
                </thead>
                <tbody>
                  <DimRow drag mkey="curve_radius" label="Curve radius" type="number" unit="mm" required={false} def="—" minmax="≥ 300" help="Min bend radius at any corner. Drives the cornerCount() helper." />
                  <DimRow drag mkey="user.count"   label="Simultaneous users" type="integer" unit="users" required def="1" minmax="1 · 4" help="Drives energy-absorber sub-assembly inclusion." />
                </tbody>
              </table>
            </div>

            {/* ZONE 3 — Variants */}
            <ZoneHeader idx="03" title="Variants" sub="User-picked options that change which materials or quantities are included." actions={<Btn size="sm" ico="plus">Add variant</Btn>} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 18 }}>
              <VariantCard mkey="cable_diameter" kind="enum" options={['8mm', '10mm', '12mm']} dflt="8mm" usedBy={3} />
              <VariantCard mkey="finish" kind="enum" options={['Galvanized', 'SS316']} dflt="SS316" usedBy={2} />
              <VariantCard mkey="include_shock_absorber" kind="boolean" options={['yes', 'no']} dflt="yes" usedBy={1} />
            </div>

            {/* ZONE 4 — Parts list */}
            <ZoneHeader idx="04" title="Parts list" sub="Materials and sub-assemblies. Each row carries its own rules inline. Order = drag; evaluation = dependency-sorted." actions={
              <div style={{ display: 'flex', gap: 6 }}>
                <Btn size="sm" ico="plus">Add row</Btn>
                <Btn size="sm" ico="copy">Bulk duplicate</Btn>
              </div>
            } />
            <div className="pl-card" style={{ overflow: 'visible' }}>
              <PartsListTable />
            </div>

            {/* ZONE 5 — Labour */}
            <div style={{ height: 22 }} />
            <ZoneHeader idx="05" title="Labour" sub="Manhour rules · phased + costed. Same formula language as parts. Aliases shared with parts list — you can reference rows across both." actions={
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="pl-link" style={{ fontSize: 11.5 }}>Manage phases</span>
                <Btn size="sm" ico="plus">Add labour row</Btn>
              </div>
            } />
            <div className="pl-card" style={{ overflow: 'hidden' }}>
              <LabourTable />
            </div>

            {/* Sample totals card */}
            <div className="pl-card" style={{ marginTop: 10, padding: '14px 16px', background: 'var(--surface-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <I name="refresh" size={13} style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>Sample totals</span>
                <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>with current preview inputs · length 247.4 m · segmented · SS316</span>
                <span style={{ marginLeft: 'auto' }}><Btn size="sm" ico="refresh">Re-run preview</Btn></span>
              </div>
              <LabourTotals />
            </div>
          </div>

          {/* RIGHT: inline live-preview drawer for the active row */}
          <RowPreviewDrawer />
        </div>
      </div>
    </div>
  );
}

function ZoneHeader({ idx, title, sub, actions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 10 }}>
      <span className="mono" style={{ fontSize: 11, color: 'var(--ink-5)', fontWeight: 600, letterSpacing: '0.04em' }}>{idx}</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{sub}</div>
      </div>
      {actions && <div style={{ marginLeft: 'auto' }}>{actions}</div>}
    </div>
  );
}

function FieldRow({ label, hint, children }) {
  return (
    <>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', borderRight: '1px solid var(--line)', background: 'var(--surface-2)' }}>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, letterSpacing: '0.02em' }}>{label}</div>
        {hint && <div style={{ fontSize: 10.5, color: 'var(--ink-5)', marginTop: 2 }}>{hint}</div>}
      </div>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {children}
      </div>
    </>
  );
}

function CertChip({ name, exp, attached, warn }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 4 }}>
      <I name="cert" size={13} style={{ color: warn ? 'var(--hivis-ink)' : 'var(--success)' }} />
      <span style={{ fontSize: 12, fontWeight: 500 }}>{name}</span>
      <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>{exp}</span>
      {warn && <Pill variant="modified">{warn}</Pill>}
      {attached && <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--ink-3)' }}><I name="link" size={11} />cert.pdf</span>}
    </div>
  );
}

function GateRow({ expr, hint }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 4 }}>
      <Pill variant="info" dot>gate</Pill>
      <span className="mono" style={{ fontSize: 12 }}>{expr}</span>
      <span style={{ fontSize: 11, color: 'var(--ink-5)' }}>· {hint}</span>
      <span style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
        <I name="edit" size={12} style={{ color: 'var(--ink-5)' }} />
        <I name="trash" size={12} style={{ color: 'var(--ink-5)' }} />
      </span>
    </div>
  );
}

function DimRow({ drag, mkey, label, type, unit, required, def, minmax, help }) {
  return (
    <tr>
      <td><svg width="9" height="13" viewBox="0 0 9 13" style={{ color: 'var(--ink-5)' }}><g fill="currentColor"><circle cx="2" cy="2" r="1.1"/><circle cx="7" cy="2" r="1.1"/><circle cx="2" cy="6.5" r="1.1"/><circle cx="7" cy="6.5" r="1.1"/><circle cx="2" cy="11" r="1.1"/><circle cx="7" cy="11" r="1.1"/></g></svg></td>
      <td className="mono" style={{ color: 'var(--primary)' }}>{mkey}</td>
      <td>{label}</td>
      <td><Chip>{type}</Chip></td>
      <td className="mono" style={{ color: 'var(--ink-4)' }}>{unit}</td>
      <td>{required ? <Pill variant="modified">required</Pill> : <span style={{ fontSize: 11.5, color: 'var(--ink-5)' }}>optional</span>}</td>
      <td className="mono">{def}</td>
      <td className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{minmax}</td>
      <td style={{ fontSize: 11.5, color: 'var(--ink-4)' }}>{help}</td>
      <td><I name="dots" size={12} style={{ color: 'var(--ink-5)' }} /></td>
    </tr>
  );
}

function VariantCard({ mkey, kind, options, dflt, usedBy }) {
  return (
    <div className="pl-card" style={{ padding: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span className="mono" style={{ fontSize: 12, fontWeight: 500, color: 'var(--primary)' }}>{mkey}</span>
        <Chip>{kind}</Chip>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-4)' }}>used by <span className="pl-link mono">{usedBy} parts</span></span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
        {options.map(o => <span key={o} className={'pl-pill' + (o === dflt ? ' info' : '')}>{o}{o === dflt ? ' · default' : ''}</span>)}
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-5)' }}>Referenceable as <span className="mono">variant.{mkey}</span></div>
    </div>
  );
}

function PartsListTable() {
  // The five marquee rows: a material with simple formula, a sub-assembly with bindings (expanded),
  // a cutting-algorithm row, a gated material, and an aggregating row.
  return (
    <table className="pl-table">
      <thead>
        <tr>
          <th style={{ width: 22 }}></th>
          <th style={{ width: 22 }}><Check /></th>
          <th style={{ width: 90 }}>Alias</th>
          <th style={{ width: 36 }}></th>
          <th>Item</th>
          <th style={{ width: 110 }}>Type</th>
          <th>Quantity</th>
          <th>Gate</th>
          <th style={{ width: 70 }}>Waste</th>
          <th style={{ width: 22 }}></th>
        </tr>
      </thead>
      <tbody>
        {/* Row 1 — simple material with active inline formula */}
        <PartsRow active alias="stanch" sku="STN-AL-450" thumb="📐" name="Stanchion, aluminium 450 mm" type="material" qty={<FormulaCell tokens={[
            { t: 'fn', v: 'ceil' }, { t: 'paren', v: '(' },
            { t: 'param', v: 'length' }, { t: 'op', v: ' / ' }, { t: 'param', v: 'spacing.stanchion' },
            { t: 'paren', v: ')' }, { t: 'op', v: ' + ' }, { t: 'num', v: '1' },
          ]} preview="= 31" />} gate="—" waste="0%" />

        {/* Row 2 — Sub-assembly (selected), with parameter bindings shown in the right-hand drawer */}
        <PartsRow active alias="term" sku="(END-TERM-KIT)" thumb={<I name="cube" size={16} />} name="End Termination Kit" type="sub-assembly" subScope="system · v2 → v3 available" qty={<FormulaCell tokens={[
            { t: 'num', v: '2' },
          ]} preview="= 2" inline />} gate="—" waste="0%" />

        {/* Row 3 — Cable, cutting algorithm */}
        <PartsRow alias="cable" sku="CBL-SS-08-100" thumb="🪢" name="Cable, 7×19 SS316, ⌀8 mm" type="material" cut qty={<CutFormulaCell />} gate="—" waste="—" />

        {/* Row 4 — Gated material (metal deck) */}
        <PartsRow alias="bm_scr" sku="BLT-BMET-14" thumb="🔩" name="Bi-metal Self-Drill 14 mm" type="material" qty={<FormulaCell tokens={[
          { t: 'param', v: 'stanch' }, { t: 'op', v: '.qty * ' }, { t: 'num', v: '4' },
        ]} preview="= 124" inline />} gate={<GateCell when="substrate" op="==" val="'metal_deck'" />} waste="10%" />

        {/* Row 5 — Aggregating row (one termination per 12 m cable, references cable cut plan) */}
        <PartsRow alias="ss_scr" sku="BLT-M12-80-S" thumb="🔩" name="M12×80 Bolt, SS316" type="material" qty={<FormulaCell tokens={[
          { t: 'param', v: 'stanch' }, { t: 'op', v: '.qty * ' }, { t: 'num', v: '4' },
        ]} preview="= 124" inline />} gate={<GateCell when="substrate" op="==" val="'steel_purlin'" />} waste="10%" />

        {/* Row 6 — Sub-assembly intermediate anchors, collapsed */}
        <PartsRow alias="int_anc" sku="(INT-ANC-KIT)" thumb={<I name="cube" size={16} />} name="Intermediate Anchor Kit" type="sub-assembly" subScope="system" qty={<FormulaCell tokens={[
            { t: 'fn', v: 'ceil' }, { t: 'paren', v: '(' }, { t: 'param', v: 'length' }, { t: 'op', v: ' / ' }, { t: 'param', v: 'spacing.intermediate' }, { t: 'paren', v: ')' },
          ]} preview="= 31" inline />} gate="—" waste="0%" />

        {/* Row 7 — Shock absorber, gated by variant */}
        <PartsRow alias="shock" sku="SHK-ABS-22" thumb="⛓️" name="Shock Absorber, in-line" type="material" qty={<FormulaCell tokens={[
            { t: 'num', v: '2' },
          ]} preview="= 2" inline />} gate={<GateCell when="variant.include_shock_absorber" op="==" val="true" />} waste="0%" />

        {/* Row 8 — Disabled placeholder */}
        <PartsRow alias="rope_grab" sku="—" thumb={<I name="cube" size={16} />} name="Rope Grab (Type-D)" type="sub-assembly" disabled qty={<span style={{ color: 'var(--ink-5)' }}>—</span>} gate="—" waste="—" />
      </tbody>
    </table>
  );
}

function PartsRow({ active, disabled, drag = true, alias, sku, thumb, name, type, subScope, cut, qty, gate, waste }) {
  return (
    <tr style={{ background: active ? 'var(--primary-soft)' : 'transparent', opacity: disabled ? 0.5 : 1 }}>
      <td><svg width="9" height="13" viewBox="0 0 9 13" style={{ color: 'var(--ink-5)' }}><g fill="currentColor"><circle cx="2" cy="2" r="1.1"/><circle cx="7" cy="2" r="1.1"/><circle cx="2" cy="6.5" r="1.1"/><circle cx="7" cy="6.5" r="1.1"/><circle cx="2" cy="11" r="1.1"/><circle cx="7" cy="11" r="1.1"/></g></svg></td>
      <td><Check state={active} /></td>
      <td className="mono" style={{ fontWeight: 500, color: 'var(--primary)' }}>{alias}</td>
      <td>{typeof thumb === 'string' ? <div className="pl-thumb" style={{ width: 24, height: 24, fontSize: 14 }}>{thumb}</div> : <div className="pl-thumb" style={{ width: 24, height: 24, color: 'var(--ink-3)' }}>{thumb}</div>}</td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontWeight: 500 }}>{name}</span>
          {cut && <Pill variant="info">cut plan</Pill>}
        </div>
        <div style={{ fontSize: 10.5, color: 'var(--ink-5)', marginTop: 1 }}>
          <span className="mono">{sku}</span>
          {subScope && <span style={{ marginLeft: 8 }}>· scope <span className="mono">{subScope}</span></span>}
        </div>
      </td>
      <td>
        {type === 'sub-assembly' ? <Pill variant="info">sub-assembly</Pill> : <Pill>material</Pill>}
      </td>
      <td style={{ paddingTop: 6, paddingBottom: 6 }}>{qty}</td>
      <td style={{ paddingTop: 6, paddingBottom: 6 }}>{typeof gate === 'string' ? <span style={{ fontSize: 11.5, color: 'var(--ink-5)' }}>{gate}</span> : gate}</td>
      <td className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{waste}</td>
      <td><I name="dots" size={12} style={{ color: 'var(--ink-5)' }} /></td>
    </tr>
  );
}

const tokenColor = { fn: '#7C2D12', param: '#1E40AF', op: '#475569', num: '#0F766E', paren: '#94A3B8', str: '#B91C1C' };

function FormulaCell({ tokens, preview, inline }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="mono" style={{ fontSize: 11.5, background: 'var(--surface-2)', border: '1px solid var(--line)', padding: '3px 7px', borderRadius: 3, minWidth: 0 }}>
        {tokens.map((tok, i) => <span key={i} style={{ color: tokenColor[tok.t], whiteSpace: 'pre' }}>{tok.v}</span>)}
      </span>
      <span className="mono tnum" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{preview}</span>
    </div>
  );
}

function CutFormulaCell() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="mono" style={{ fontSize: 11.5, background: 'var(--surface-2)', border: '1px solid var(--line)', padding: '3px 7px', borderRadius: 3 }}>
        <span style={{ color: tokenColor.fn }}>linearCut</span><span style={{ color: tokenColor.paren }}>(</span><span style={{ color: tokenColor.param }}>segments</span>, <span style={{ color: tokenColor.param }}>material.stock_lengths</span>, <span style={{ color: tokenColor.num }}>3mm</span><span style={{ color: tokenColor.paren }}>)</span>
      </span>
      <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>plan · <span className="mono">2×12m + 1×6m</span></span>
      <button className="pl-btn ghost sm" style={{ marginLeft: 4 }}><I name="expand" size={11} />View cut plan</button>
    </div>
  );
}

function GateCell({ when, op, val }) {
  return (
    <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>
      <span style={{ color: tokenColor.param }}>{when}</span> <span style={{ color: tokenColor.op }}>{op}</span> <span style={{ color: tokenColor.str }}>{val}</span>
    </span>
  );
}

function RowPreviewDrawer() {
  return (
    <div style={{ borderLeft: '1px solid var(--line)', background: 'var(--surface)', position: 'sticky', top: 0, alignSelf: 'flex-start', height: '100%' }}>
      {/* Selected row: term (End Termination Kit) — sub-assembly bindings + expansion */}
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Chip>row · term</Chip>
          <Pill variant="info">sub-assembly</Pill>
          <Pill variant="modified">v2 → v3 available</Pill>
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>End Termination Kit</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-4)', marginTop: 2 }}>system-scoped · 4 parameters · returns 3 materials</div>
      </div>

      {/* Count formula */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)' }}>
        <div className="pl-label">Count formula</div>
        <div style={{ background: '#0B1220', padding: '10px 12px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 13, color: '#CBD5E1' }}>
          <span style={{ color: '#64748B' }}>count =</span> <span style={{ color: '#34D399' }}>2</span>
          <span style={{ color: '#64748B', marginLeft: 10, fontSize: 11, fontStyle: 'italic' }}>// one per end of segmented run</span>
        </div>
      </div>

      {/* Parameter bindings */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)' }}>
        <div className="pl-label">Parameter bindings</div>
        <div className="pl-card" style={{ overflow: 'hidden' }}>
          <BindingRow param="cable_diameter" kind="variant"      value="variant.cable_diameter" sample="8mm" />
          <BindingRow param="substrate"       kind="system"       value="substrate"              sample="steel_purlin" />
          <BindingRow param="corner_count"    kind="user"         value="prompted at project time" sample="2" />
          <BindingRow param="kerf"            kind="hardcoded"    value="3 mm" />
        </div>
      </div>

      {/* Expansion preview */}
      <div style={{ padding: '14px 20px 18px' }}>
        <div className="pl-label">Expands to <span style={{ textTransform: 'none', fontWeight: 400, color: 'var(--ink-5)', letterSpacing: 0 }}>· with sample inputs</span></div>
        <div className="pl-card" style={{ overflow: 'hidden' }}>
          {[
            { sku: 'SS-THIM-08',   name: 'SS Thimble, ⌀8 mm',       qty: 2,  unit: 'pcs', cost: 4.20 },
            { sku: 'SS-SWG-T-08',  name: 'Swageless Terminal, 8 mm', qty: 2,  unit: 'pcs', cost: 38.40 },
            { sku: 'BLT-M10-50-S', name: 'M10×50 Bolt, SS316',       qty: 4,  unit: 'pcs', cost: 1.10 },
          ].map((r, i) => (
            <div key={r.sku} style={{ display: 'grid', gridTemplateColumns: '24px 110px 1fr 70px 70px', alignItems: 'center', gap: 8, padding: '8px 12px', borderBottom: i < 2 ? '1px solid var(--line)' : 'none', fontSize: 12 }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--primary)' }} />
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-3)' }}>{r.sku}</span>
              <span>{r.name}</span>
              <span className="num mono tnum" style={{ fontWeight: 500 }}>{r.qty} <span style={{ color: 'var(--ink-5)', fontSize: 10.5 }}>{r.unit}</span></span>
              <span className="num mono">${r.cost.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--primary-soft)', borderRadius: 4, fontSize: 11.5, color: 'var(--primary)', display: 'flex', gap: 8, alignItems: 'center' }}>
          <I name="check" size={12} />
          Scaled by count · <span className="mono tnum" style={{ fontWeight: 600 }}>2 instances</span> → 16 fasteners, 4 terminals, 4 thimbles
        </div>
      </div>

      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--line)', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <I name="warn" size={13} style={{ color: 'var(--hivis-ink)' }} />
        <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>v3 adds <span className="mono">edge_distance</span> param. Review diff before bumping pin.</span>
        <span style={{ marginLeft: 'auto' }}><Btn size="sm" variant="primary">Review v3 diff</Btn></span>
      </div>
    </div>
  );
}

function BindingRow({ param, kind, value, sample }) {
  const kindMeta = {
    variant:   { label: 'variant',         color: 'var(--primary)' },
    system:    { label: 'system input',    color: 'var(--success)' },
    user:      { label: 'user @ project',  color: 'var(--hivis-ink)' },
    hardcoded: { label: 'hardcoded',       color: 'var(--ink-3)' },
    formula:   { label: 'formula',         color: 'var(--primary)' },
  }[kind];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 90px 1fr 70px', gap: 10, alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid var(--line)' }}>
      <span className="mono" style={{ fontSize: 12 }}>{param}</span>
      <span style={{ fontSize: 10.5, color: kindMeta.color, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>← {kindMeta.label}</span>
      <span className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{value}</span>
      {sample && <span className="mono tnum" style={{ fontSize: 11, color: 'var(--ink)', background: 'var(--surface-2)', padding: '1px 6px', borderRadius: 3 }}>= {sample}</span>}
    </div>
  );
}

window.ModelEdit = ModelEdit;

// ── Labour zone components ───────────────────────────────────────

const PHASE = {
  fabrication:    { key: 'fab',  label: 'Fabrication',    rate: 45 },
  installation:   { key: 'inst', label: 'Installation',   rate: 45 },
  commissioning:  { key: 'comm', label: 'Commissioning',  rate: 60 },
  inspection:     { key: 'insp', label: 'Inspection',     rate: 55 },
};
const PHASE_COLOR = { fabrication: 'var(--phase-fab)', installation: 'var(--phase-inst)', commissioning: 'var(--phase-comm)', inspection: 'var(--phase-insp)' };

function LabourPill({ phase }) {
  const p = PHASE[phase];
  return <span className={'pl-phase ' + p.key}>{p.label}</span>;
}

function LabourTable() {
  const rows = [
    { alias: 'term_fab',  phase: 'fabrication',  tokens: [{t:'num',v:'0.5'}], preview: '× 2 → 1.0 h', gate: '—',                                rate: '—', source: 'sub-assembly · term' },
    { alias: 'term_inst', phase: 'installation', tokens: [{t:'num',v:'0.75'}], preview: '× 2 → 1.5 h', gate: '—',                                rate: '—', source: 'sub-assembly · term' },
    { alias: 'walk',      phase: 'installation', tokens: [{t:'num',v:'0.1'}, {t:'op',v:' * '}, {t:'param',v:'length'}],   preview: '= 24.74 h', gate: '—',          rate: '—', source: 'Model rule' },
    { alias: 'seg_lab',   phase: 'installation', tokens: [{t:'num',v:'1.5'}, {t:'op',v:' * '}, {t:'param',v:'segments.count'}], preview: '= 4.5 h', gate: <GateCell when="shape" op="==" val="'segmented'" />, rate: '—', source: 'Model rule' },
    { alias: 'comm_base', phase: 'commissioning', tokens: [{t:'num',v:'2'}], preview: '= 2.0 h', gate: '—',                                  rate: '—', source: 'Model rule' },
    { alias: 'cert_load', phase: 'commissioning', tokens: [{t:'fn',v:'max'}, {t:'paren',v:'('}, {t:'num',v:'1'}, {t:'op',v:', '}, {t:'param',v:'walk'}, {t:'op',v:' * '}, {t:'num',v:'0.05'}, {t:'paren',v:')'}], preview: '= 1.24 h', gate: '—', rate: '—', source: 'Model rule · cross-refs walk' },
    { alias: 'rope',      phase: 'installation', tokens: [{t:'num',v:'2'}, {t:'op',v:' * '}, {t:'param',v:'segments.count'}], preview: '= 6 h', gate: <GateCell when="variant.access" op="==" val="'rope_access'" />, rate: 'override 75/h', source: 'Model rule' },
  ];
  return (
    <table className="pl-table">
      <thead>
        <tr>
          <th style={{ width: 22 }}></th>
          <th style={{ width: 22 }}><Check /></th>
          <th style={{ width: 110 }}>Alias</th>
          <th style={{ width: 130 }}>Phase</th>
          <th>Hours formula</th>
          <th>Gate</th>
          <th style={{ width: 80 }}>Crew</th>
          <th style={{ width: 110 }}>Rate</th>
          <th style={{ width: 22 }}></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.alias} className={i === 2 ? 'is-selected' : ''}>
            <td><svg width="9" height="13" viewBox="0 0 9 13" style={{ color: 'var(--ink-5)' }}><g fill="currentColor"><circle cx="2" cy="2" r="1.1"/><circle cx="7" cy="2" r="1.1"/><circle cx="2" cy="6.5" r="1.1"/><circle cx="7" cy="6.5" r="1.1"/><circle cx="2" cy="11" r="1.1"/><circle cx="7" cy="11" r="1.1"/></g></svg></td>
            <td><Check /></td>
            <td>
              <div className="mono" style={{ fontSize: 11.5, color: 'var(--primary)', fontWeight: 500 }}>{r.alias}</div>
              <div style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>{r.source}</div>
            </td>
            <td><LabourPill phase={r.phase} /></td>
            <td><FormulaCell tokens={r.tokens} preview={r.preview} /></td>
            <td>{typeof r.gate === 'string' ? <span style={{ fontSize: 11.5, color: 'var(--ink-5)' }}>{r.gate}</span> : r.gate}</td>
            <td className="mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>2 · default</td>
            <td className="mono" style={{ fontSize: 11.5, color: r.rate === '—' ? 'var(--ink-5)' : 'var(--hivis-ink)' }}>{r.rate}</td>
            <td><I name="dots" size={12} style={{ color: 'var(--ink-5)' }} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LabourTotals() {
  const data = [
    { phase: 'fabrication',   hours: 4.5,   rate: 45 },
    { phase: 'installation',  hours: 35.24, rate: 45 },
    { phase: 'commissioning', hours: 3.24,  rate: 60 },
    { phase: 'inspection',    hours: 0,     rate: 55, excluded: true },
  ];
  const totalHours = data.reduce((s, p) => s + p.hours, 0);
  const totalCost  = data.reduce((s, p) => s + p.hours * p.rate, 0);
  const maxCost    = Math.max(...data.map(p => p.hours * p.rate));
  const stack = data.map(p => ({ phase: p.phase, pct: totalCost ? (p.hours * p.rate / totalCost) * 100 : 0 }));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 24, alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {data.map(p => {
          const cost = p.hours * p.rate;
          return (
            <div key={p.phase} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 110px 100px', gap: 12, alignItems: 'center', opacity: p.excluded ? 0.45 : 1 }}>
              <LabourPill phase={p.phase} />
              <span className="pl-bar" style={{ background: 'var(--surface)' }}>
                <span className="pl-bar-fill" style={{ width: ((cost / (maxCost || 1)) * 100) + '%', background: PHASE_COLOR[p.phase] }} />
              </span>
              <span className="mono tnum" style={{ fontSize: 12, color: 'var(--labour-ink)', fontWeight: 500, textAlign: 'right' }}>
                {p.hours.toFixed(p.hours % 1 ? 2 : 1)} h
                <span style={{ fontSize: 10.5, color: 'var(--ink-5)', marginLeft: 4 }}>× ${p.rate}</span>
              </span>
              <span className="mono tnum" style={{ fontSize: 13, fontWeight: 600, textAlign: 'right' }}>
                ${cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                {p.excluded && <div style={{ fontSize: 10, color: 'var(--ink-5)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>excluded</div>}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ padding: 14, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 6 }}>
        <div style={{ fontSize: 10.5, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Model total</div>
        <div className="mono tnum" style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ink)' }}>${totalCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        <div className="mono tnum" style={{ fontSize: 12, color: 'var(--labour-ink)' }}>{totalHours.toFixed(1)} h labour</div>
        <div className="pl-stack" style={{ marginTop: 10 }}>
          {stack.map(s => s.pct > 0 && <span key={s.phase} style={{ width: s.pct + '%', background: PHASE_COLOR[s.phase] }} />)}
        </div>
        <div style={{ marginTop: 8, fontSize: 10.5, color: 'var(--ink-4)' }}>phase mix · cost-weighted</div>
      </div>
    </div>
  );
}

Object.assign(window, { PHASE, PHASE_COLOR, LabourPill, LabourTable, LabourTotals });
