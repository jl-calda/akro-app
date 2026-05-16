// Screen 4 — Rule Builder with live preview

function RuleBuilder({ density = 'default', collapsed = false, onToggleCollapse }) {
  // Color-coded formula tokens. We mock a real-looking formula and tokenize manually
  // to keep things presentational.
  const tokens = [
    { t: 'fn',   v: 'ceil' },
    { t: 'paren', v: '(' },
    {   t: 'param', v: 'length' },
    {   t: 'op', v: ' / ' },
    {   t: 'param', v: 'spacing.intermediate' },
    { t: 'paren', v: ')' },
    { t: 'op', v: ' + ' },
    { t: 'num', v: '1' },
  ];

  const palette = {
    fn:    '#7C2D12',
    param: '#1E40AF',
    op:    '#475569',
    num:   '#0F766E',
    paren: '#94A3B8',
    str:   '#B91C1C',
  };

  return (
    <div className="pl-app" data-density={density} data-sidebar={collapsed ? 'collapsed' : 'expanded'}>
      <Sidebar active="rules" collapsed={collapsed} onToggle={onToggleCollapse} />
      <Topbar crumbs={['Catalog', 'Rules', 'Lifeline', 'Intermediate Anchor Quantity']} />
      <div className="pl-main" style={{ flexDirection: 'row' }}>
        {/* LEFT: editor */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, borderRight: '1px solid var(--line)' }}>
          <div className="pl-page-head">
            <div className="pl-page-title-row">
              <Chip>RULE-LL-014</Chip>
              <div className="pl-page-title">Intermediate Anchor Quantity</div>
              <Pill variant="info">v4 draft</Pill>
              <Pill variant="" dot>unsaved</Pill>
              <div className="pl-page-actions">
                <Btn ico="history" variant="ghost">History</Btn>
                <Btn variant="ghost">Discard</Btn>
                <Btn variant="primary" ico="check">Publish v4</Btn>
              </div>
            </div>
            <div className="pl-page-sub">Quantity formula · attached to <span className="mono">Cable Lifeline 8mm SS316</span> · runs when an instance is computed.</div>
          </div>

          {/* Meta strip for rule */}
          <div className="pl-meta" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <div className="pl-meta-cell"><div className="pl-meta-label">Kind</div><div className="pl-meta-value">Quantity formula</div></div>
            <div className="pl-meta-cell"><div className="pl-meta-label">Attached to</div><div className="pl-meta-value mono">Sub-assembly · INT-ANC-KIT</div></div>
            <div className="pl-meta-cell"><div className="pl-meta-label">Scope</div><div className="pl-meta-value">Model-only (override of system rule v2)</div></div>
            <div className="pl-meta-cell"><div className="pl-meta-label">Last edited</div><div className="pl-meta-value">2h ago · R. Mathers</div></div>
          </div>

          {/* Tabs for rule kinds */}
          <div className="pl-tabs">
            <div className="pl-tab is-active">Formula<span className="pl-tab-count">1</span></div>
            <div className="pl-tab">Conditions<span className="pl-tab-count">2</span></div>
            <div className="pl-tab">Aggregations<span className="pl-tab-count">0</span></div>
            <div className="pl-tab">Tests<span className="pl-tab-count">4</span></div>
          </div>

          <div className="pl-scroll" style={{ padding: 24 }}>
            <div className="pl-label">Quantity output</div>
            <div style={{ background: '#0B1220', borderRadius: 6, padding: '16px 18px', fontFamily: 'var(--font-mono)', fontSize: 16, lineHeight: 1.5, color: '#CBD5E1', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 10.5, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>quantity</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: '#64748B', marginRight: 14 }}>qty =</span>
                {tokens.map((tok, i) => (
                  <span key={i} style={{ color: palette[tok.t], whiteSpace: 'pre' }}>{tok.v}</span>
                ))}
                <span style={{ marginLeft: 14, color: '#64748B', fontSize: 12, fontStyle: 'italic' }}>// one anchor per spacing + 1 closing</span>
              </div>
            </div>

            {/* Suggestion bar */}
            <div style={{ marginTop: 8, padding: '6px 10px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: 'var(--ink-3)' }}>
              <I name="check" size={12} style={{ color: 'var(--success)' }} />
              Parses cleanly · <span className="mono">2 params · 1 helper</span>
              <span style={{ marginLeft: 'auto', color: 'var(--ink-4)' }}>⌘+Enter to run · ⌘+/ to comment</span>
            </div>

            {/* Helpers */}
            <div style={{ marginTop: 18 }}>
              <div className="pl-label">Available helpers <span style={{ textTransform: 'none', fontWeight: 400, letterSpacing: 0, color: 'var(--ink-5)' }}>· click to insert</span></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[
                  { f: 'ceil(x)',       d: 'round up' },
                  { f: 'floor(x)',      d: 'round down' },
                  { f: 'round(x, n?)',  d: 'half-even' },
                  { f: 'if(c, a, b)',   d: 'conditional' },
                  { f: 'min(…)',        d: 'minimum' },
                  { f: 'max(…)',        d: 'maximum' },
                  { f: 'spacingCount(L, gap)', d: 'admin · stanchions' },
                  { f: 'cornerCount(segments)', d: 'admin' },
                ].map((h, i) => (
                  <div key={i} style={{ padding: '6px 10px', background: 'var(--surface)', border: '1px solid var(--line-2)', borderRadius: 4, fontSize: 12 }}>
                    <span className="mono" style={{ fontWeight: 500 }}>{h.f}</span>
                    <span style={{ color: 'var(--ink-5)', marginLeft: 6, fontSize: 11 }}>· {h.d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conditions strip */}
            <div style={{ marginTop: 22 }}>
              <div className="pl-label">Conditional inclusions <span style={{ textTransform: 'none', fontWeight: 400, letterSpacing: 0, color: 'var(--ink-5)' }}>· also fire for this sub-assembly</span></div>
              <div className="pl-card" style={{ overflow: 'hidden' }}>
                <ConditionRow when="substrate" op="=" val="metal_deck" then="include BLT-BMET-14" qty="4 per anchor" />
                <ConditionRow when="user.count" op=">" val="1" then="include SHK-ABS-22" qty="1 per anchor" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: live preview */}
        <div style={{ width: 540, background: 'var(--surface)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <I name="refresh" size={14} style={{ color: 'var(--primary)' }} />
            <div style={{ fontSize: 13, fontWeight: 600 }}>Live preview</div>
            <Pill variant="info">recomputed 32ms ago</Pill>
            <div style={{ marginLeft: 'auto' }}><Seg items={['Inputs', 'Tests', 'AST']} active="Inputs" /></div>
          </div>

          <div className="pl-scroll">
            {/* Inputs */}
            <div style={{ padding: '16px 22px' }}>
              <div className="pl-label">Sample inputs <span style={{ textTransform: 'none', fontWeight: 400, letterSpacing: 0, color: 'var(--ink-5)' }}>· auto-detected from formula</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <InputRow param="length" hint="from Shape dimensions" unit="m" value="247.4" mono />
                <InputRow param="spacing.intermediate" hint="from Model defaults" unit="m" value="8.0" mono />
              </div>
            </div>

            {/* Output card */}
            <div style={{ padding: '0 22px 16px' }}>
              <div style={{ background: 'var(--primary-soft)', borderLeft: '3px solid var(--primary)', borderRadius: '0 4px 4px 0', padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 11, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Output</span>
                  <span style={{ fontSize: 11, color: 'var(--ink-4)' }} className="mono">qty = </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
                  <span className="mono tnum" style={{ fontSize: 32, fontWeight: 600, color: 'var(--ink)', letterSpacing: '-0.02em' }}>31</span>
                  <span style={{ color: 'var(--ink-3)', fontSize: 13 }}>intermediate anchors</span>
                </div>
                <div style={{ marginTop: 8, fontSize: 11.5, color: 'var(--ink-3)' }} className="mono">
                  ceil(247.4 / 8.0) + 1  =  ceil(30.925) + 1  =  31 + 1  =  32 <span style={{ color: 'var(--danger)' }}>← was 32, hand-traced</span>
                </div>
                <div style={{ marginTop: 8, padding: '6px 8px', background: 'var(--hivis-soft)', borderRadius: 3, fontSize: 11, color: 'var(--hivis-ink)' }}>
                  <I name="warn" size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Result drifted from previous version — verify rule before publish.
                </div>
              </div>
            </div>

            {/* AST / Trace */}
            <div style={{ padding: '0 22px 16px' }}>
              <div className="pl-label">Evaluation trace</div>
              <div style={{ background: '#0B1220', borderRadius: 4, padding: 14, fontFamily: 'var(--font-mono)', fontSize: 11.5, color: '#94A3B8', lineHeight: 1.7 }}>
                <div><span style={{ color: '#64748B' }}>1 │ </span>resolve <span style={{ color: '#60A5FA' }}>length</span> = <span style={{ color: '#34D399' }}>247.4</span></div>
                <div><span style={{ color: '#64748B' }}>2 │ </span>resolve <span style={{ color: '#60A5FA' }}>spacing.intermediate</span> = <span style={{ color: '#34D399' }}>8.0</span></div>
                <div><span style={{ color: '#64748B' }}>3 │ </span><span style={{ color: '#F87171' }}>div </span><span style={{ color: '#34D399' }}>247.4 / 8.0</span> → <span style={{ color: '#34D399' }}>30.925</span></div>
                <div><span style={{ color: '#64748B' }}>4 │ </span><span style={{ color: '#F87171' }}>ceil</span>(30.925) → <span style={{ color: '#34D399' }}>31</span></div>
                <div><span style={{ color: '#64748B' }}>5 │ </span><span style={{ color: '#F87171' }}>add</span>  31 + 1 → <span style={{ color: '#F8FAFC', fontWeight: 600 }}>32</span></div>
                <div style={{ marginTop: 4, color: '#64748B' }}>──── done · 0.4 ms · pure</div>
              </div>
            </div>

            {/* Tests */}
            <div style={{ padding: '0 22px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className="pl-label" style={{ margin: 0 }}>Saved tests</span>
                <Pill variant="approved" dot>3 pass</Pill>
                <Pill variant="danger" dot>1 fail</Pill>
                <span style={{ marginLeft: 'auto' }}><Btn size="sm" ico="plus">Add test</Btn></span>
              </div>
              <div className="pl-card" style={{ overflow: 'hidden' }}>
                <TestRow ok inputs="length=12, spacing=8" expect="3" got="3" />
                <TestRow ok inputs="length=80, spacing=8" expect="11" got="11" />
                <TestRow ok inputs="length=247.4, spacing=8" expect="32" got="32" />
                <TestRow fail inputs="length=0.5, spacing=8" expect="1" got="2" note="edge: shorter than one spacing" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputRow({ param, hint, unit, value, mono }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 12, alignItems: 'center', padding: '8px 10px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 4 }}>
      <div>
        <div className="mono" style={{ fontSize: 12, fontWeight: 500 }}>{param}</div>
        <div style={{ fontSize: 10.5, color: 'var(--ink-5)' }}>{hint}</div>
      </div>
      <NumInput value={value} unit={unit} width="100%" />
    </div>
  );
}

function ConditionRow({ when, op, val, then, qty }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: '1px solid var(--line)' }}>
      <span style={{ fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>IF</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="mono" style={{ fontSize: 12, color: 'var(--primary)' }}>{when}</span>
        <span className="mono" style={{ fontSize: 12, color: 'var(--ink-4)' }}>{op}</span>
        <span className="mono" style={{ fontSize: 12, color: 'var(--ink)', background: 'var(--surface-2)', padding: '1px 6px', borderRadius: 3 }}>{val}</span>
        <span style={{ marginLeft: 12, fontSize: 11, color: 'var(--ink-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>THEN</span>
        <span className="mono" style={{ fontSize: 12, color: 'var(--ink-2)' }}>{then}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{qty}</span>
        <I name="edit" size={13} style={{ color: 'var(--ink-5)' }} />
        <I name="trash" size={13} style={{ color: 'var(--ink-5)' }} />
      </div>
    </div>
  );
}

function TestRow({ inputs, expect, got, ok, fail, note }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr auto auto', alignItems: 'center', gap: 12, padding: '8px 14px', borderBottom: '1px solid var(--line)', background: fail ? 'var(--danger-soft)' : 'transparent' }}>
      <span style={{ width: 16, height: 16, borderRadius: 8, background: ok ? 'var(--success)' : 'var(--danger)', display: 'grid', placeItems: 'center' }}>
        {ok ? <I name="check" size={10} style={{ stroke: '#fff', strokeWidth: 2.6 }} /> : <I name="x" size={10} style={{ stroke: '#fff', strokeWidth: 2.6 }} />}
      </span>
      <div>
        <div className="mono" style={{ fontSize: 12 }}>{inputs}</div>
        {note && <div style={{ fontSize: 11, color: 'var(--danger)', marginTop: 2 }}>{note}</div>}
      </div>
      <div className="mono tnum" style={{ fontSize: 12, color: 'var(--ink-4)' }}>expect <span style={{ color: 'var(--ink)' }}>{expect}</span></div>
      <div className="mono tnum" style={{ fontSize: 12, color: 'var(--ink-4)' }}>got <span style={{ color: ok ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{got}</span></div>
    </div>
  );
}

window.RuleBuilder = RuleBuilder;
