# Product Configuration Hierarchy

_Started 2026-05-16 09:45 UTC_

---

## User

System (e.g. "Lifeline")
  ├── owns: dimension schema, shared rules
  └── Shape (e.g. "Straight", "Segmented")
        ├── refines: dimension schema (straight = 1 length; segmented = list of segments with corners)
        └── Model (e.g. "Cable Lifeline 8mm SS316", "Rail Lifeline Aluminium")
              ├── owns: parts list, model-specific rules (can override System rules)
              ├── carries: certifications (cert name + PDF attachment + expiry date)
              └── Sub-assembly (parametric component, e.g. "End Termination Kit", "Intermediate Anchor")
                    ├── scope: model-only / system-wide / global (user picks per assembly)
                    └── Material (the leaf — actual SKU)
                          - code (auto pattern-based or manual)
                          - name
                          - emoji OR uploaded image OR pasted-from-clipboard image
                          - category (with category-defined parameters)
                          - supplier (one supplier per material)
                          - unit cost
                          - pack size (display only — exact qty is canonical)
                          - default wastage % (project can override globally)
                          - stock balance per warehouse location

## Assistant

_[tool: questions_v2]_

## User

Questions answered:
- screens: All seven, in priority order
- fidelity: Hi-fi pixel-mockups (closer to shippable)
- format: Decide for me
- variations: No — one strong direction is fine
- variation_axes: Density (compact vs roomy tables), Information architecture (sidebar vs top nav, panel placement), Editing UX (right panel vs inline vs modal), Mobile storeman: scan-first vs list-first, Color treatment (how much hi-vis amber shows up, accent strategy), Table style (gridded vs hairline, zebra vs flat)
- data_realism: Plausible safety-industry data (real-sounding system names, SKUs, suppliers)
- tweaks: Density toggle (compact / comfortable), MTO state toggle (Draft / Approved / Modified), Group-by selector on the MTO table
- brand: Make up something neutral and credible
- type: Geist Sans + Geist Mono (sharper, more modern)

## Assistant

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

Locked in: **Plumbline** as the wordmark, Geist Sans + Geist Mono, one strong direction, all 7 screens hi-fi on a design canvas with tweaks for density / MTO state / group-by.

Plan:
- Cool slate + off-white base, single industrial blue (`#1E40AF`-ish), amber `#FACC15` reserved strictly for warnings (low stock, variance, modified-after-approval, cert expiry).
- Sidebar nav, hairline tables, right-side detail panels, tabular figures everywhere, monospace SKUs.
- One file per screen; canvas presents them side-by-side.

_[tool: read_file]_

_[tool: write_file]_

Now I'll build. Starting with tokens, shared chrome, and the canvas shell.

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: read_file]_

_[tool: write_file]_

_[tool: show_html]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Built and shipped — **Plumbline**, a hi-fi exploration of the Safety MTO Platform.

**One direction, seven screens** on a design canvas (priority-ordered, click any artboard to focus, ←/→ to step):

1. **Project Dashboard** — meta strip, System Instances row, full MTO table grouped by instance with stock-progress bars and a right-side detail panel for overrides
2. **Material Catalog** — dense table with location dots, cert pills, version chips + the New Material modal (emoji/upload/paste thumbnail picker, category-driven parameters)
3. **System Instance configuration** — Shape picker with line drawings, segment inputs, live shape diagram, substrate dropdown, model cards, parameter union with one missing flagged hi-vis
4. **Rule Builder** — color-coded formula, evaluation trace, sample-input pane, saved tests with pass/fail, conditional inclusions strip
5. **Storeman mobile** (390×844) — post-QR-scan view with big tabular numpad, MTO/bin/issued stat blocks, offline queue indicator
6. **Multi-project aggregation** — selected-project cards, supplier-grouped table with per-project provenance bars and "pack-rounded after sum" callouts
7. **Project list** — bulk-select toolbar (live with 2 selected), system color badges, pick-progress bars, status pills including the chamfered Modified-after-approval

**Tweaks** (bottom-right): density (compact / default / comfortable), MTO state (draft / approved / modified) — flips the dashboard pill, override warnings, and the row marker — and group-by selector.

**System highlights**
- Geist Sans + Geist Mono; tabular figures throughout; mono for SKUs and quantities
- Industrial blue `#1E40AF` for primary action only; amber `#FACC15` reserved strictly for warnings (modified-after-approval, low stock, missing parameter, cert expiry, short-pick)
- Chamfered hi-vis tag and brand mark — the only places the corner detail appears
- Hairline tables, sticky uppercase column heads, right-side detail panels over modals (modal used only for create flows like New Material)

Open questions / next moves: certifications & substrates catalog, supplier detail, stock receipts / transfer flow, and admin-side approval queue — say the word and I'll add them as new artboards alongside.

## User

<system-info comment="Only acknowledge these if relevant">
User is viewing file: Plumbline Designs.html
User adjusted these values via the in-page Tweaks panel (already saved to disk):
Plumbline Designs.html:
  mtoState: "modified"
  groupBy: "material"
  density: "compact"
</system-info>

<pasted_text name="Pasted text (81 lines)">
Addendum — Cutting / nesting algorithms in rules
Beyond simple quantity formulas, the rule engine must support stock-cutting optimization for materials sold in fixed lengths or sheet sizes. This is critical for accurate MTO on linear stock (cable, rail, tubing, handrail, toe-board) and sheet stock (walkway grating, kickplate, deck plate).
Two algorithm primitives
1. Linear cutting (1D bin packing / cutting stock problem)
Used when a material is sold in fixed lengths and a project requires multiple shorter cuts.
Inputs the rule supplies:

required_cuts: list of cut lengths needed (e.g., [12.4, 8.6, 4.2, 4.2] meters)
stock_lengths: available standard lengths the material is sold in (e.g., [6, 12, 25] meters) — sourced from the material's metadata
kerf: blade/cut width allowance (e.g., 3mm) — material-level default, project can override
min_offcut_reusable: offcuts longer than this are returned to stock as usable remnants (optional)

Output the rule receives:

stock_qty_by_length: how many of each stock length to purchase (e.g., {12: 2, 6: 1})
total_purchase_length: sum
total_waste: unusable offcut length
cut_plan: which cuts come from which stock piece (for the picking list)
reusable_offcuts: pieces above min_offcut_reusable that should be returned to stock

2. Plate cutting (2D rectangular bin packing / guillotine cut)
Used when a material is a sheet (grating, kickplate, deck plate) and the project needs multiple rectangular pieces cut from it.
Inputs the rule supplies:

required_pieces: list of {width, height, qty} (e.g., [{w: 1200, h: 800, qty: 4}, {w: 600, h: 400, qty: 2}] in mm)
stock_sheet_size: standard sheet dimensions (e.g., {w: 2400, h: 1200}) — from material metadata
kerf: cut width
grain_constraint: optional flag (e.g., walkway grating bars run one direction; pieces can't be rotated)
edge_trim: mm to discard from each sheet edge (optional)

Output:

sheet_qty: number of full sheets to purchase
placement_map: which piece goes where on which sheet (for fabrication / picking list)
total_waste_area
utilization_%

How rules invoke them
Treat these as built-in helpers in the rule engine, callable like any other primitive:
linearCut(required_cuts, stock_lengths, kerf)
plateCut(required_pieces, stock_sheet_size, kerf, grain_constraint)
A Sub-assembly rule for a horizontal lifeline cable run might look like:
let cuts = segments.map(s => s.length)
let plan = linearCut(cuts, material('cable_ss316_8mm').stock_lengths, 3mm)
return plan.stock_qty_by_length
The rule engine resolves this server-side and feeds the result back into the MTO line items.
Algorithm choice
For MVP, ship pragmatic algorithms — not optimal solvers:

Linear: First Fit Decreasing (FFD) — sort cuts descending, place each into the first stock piece that fits. Fast, deterministic, near-optimal for typical project sizes. Library: roll your own (~30 lines) or use bin-packing-js.
Plate: MaxRects or Guillotine algorithm. Library: maxrects-packer (npm).

Add optional First Fit Increasing, Best Fit Decreasing, or column-generation solvers behind a feature flag if customers need tighter optimization later. Don't ship CPLEX/OR-Tools complexity for v1.
UI implications
When a material's MTO line is computed via a cutting algorithm, the MTO view should:

Show the purchase summary as the main line (e.g., "2 × 12m roll + 1 × 6m roll").
Expose a "View cut plan" drawer with:

Linear: a horizontal bar per stock piece with colored segments showing each cut + the offcut tail
Plate: a top-down sheet diagram with rectangles placed and labeled, dimensions annotated


Surface total waste and utilization % as small metrics on the line.
Allow the user to lock the cut plan so it appears on the storeman's picking list as fabrication instructions.

The cut plan is data, not a render — it's stored on the MTO line so the PDF/Excel exports can include it, and the storeman's mobile view can show "cut piece 1: 12.4m from roll #1" when issuing.
Material metadata required
For cutting algorithms to work, materials need extra fields:

is_cuttable: boolean (linear / plate / none)
stock_lengths (for linear): array of available lengths
stock_sheet_size (for plate): {width, height}
default_kerf: number (mm)
min_reusable_offcut: number (mm or m) — optional
grain_direction: enum (for grating/anisotropic sheet) — optional

These should appear as a collapsible "Cutting" section in the material edit modal, only shown when is_cuttable is set.
Stock integration
When a cut plan generates reusable offcuts above the min_reusable_offcut threshold, the storeman issuance flow should offer to register them as a new stock entry — same material, but a non-standard length recorded as a remnant. Future projects' cutting algorithm can then prefer remnants before consuming new stock (greedy offcut-first strategy).
This is a v1.5 feature, but the data model should anticipate it from day one.
</pasted_text>

<pasted_text name="Pasted text (209 lines)">
Addendum — Model edit page as the authoring workbench
This addendum specifies the interaction model and screen layout for the Model edit page, which is the primary place admins do real work. Treat this as authoritative over any earlier UI descriptions of the Model page.
Mental model
The Model edit page is a workbench, not a settings form. Admins build a Model by progressively adding pieces, each of which carries its own rules inline. The page has four authoring zones, arranged top-to-bottom:

Model header — name, code, version, supported Shapes (subset of System's allowed Shapes), supported substrates, certifications.
Custom dimensions — Model-specific inputs that extend the System's dimension schema.
Variants — configurable options the project user picks at instantiation.
Parts list — the materials and sub-assemblies, each line carrying its own rule(s) inline.

Zone 1 — Model header
Standard metadata + the constraints that determine when this Model is even selectable in a project:

Supported Shapes (multi-select from System's allowed Shapes)
Supported substrates (multi-select from System's allowed substrates)
Certifications (cert name + PDF attachment + expiry date; multiple)
Version (auto-incremented on save when rules/parts change; minor metadata edits don't bump)
"Start from existing Model" only available when the Model is brand new (zero parts).

Zone 2 — Custom dimensions
Admin can extend the System's dimension schema with Model-specific inputs. Each custom dimension declares:

key (machine name, used in formulas) — e.g. curve_radius
label (UI label) — e.g. "Curve radius"
type — number, integer, enum, boolean, length, count
unit (for number/length types) — mm, m, pcs, etc.
required — boolean
default — optional starter value
min / max — optional bounds
help_text — short admin-authored hint shown to project users

Custom dimensions are unioned with the System's dimension schema at project time. The project's System Instance form auto-renders all dimensions in order: System dimensions first, then Model's custom dimensions.
UI: a sortable list, with an "Add custom dimension" button opening a small inline editor. Drag to reorder (order = form field order at project time).
Zone 3 — Variants
Variants are user-picked options that change which materials or quantities are included. Two flavors:
Discrete variants — admin defines a set of named options, e.g.:

cable_diameter: 8mm | 10mm | 12mm
finish: galvanized | SS316

Each variant option can map to different material selections in the Parts list (e.g., the cable material swaps based on cable_diameter).
Boolean toggles — single switches, e.g.:

include_shock_absorber: yes | no (default yes)

Variants appear in the project's System Instance form below the dimensions. They're referenceable in any formula or gate (e.g., variant.cable_diameter == 10mm).
UI: a list of variant cards, each with its name, options, default, and a small "Used by N parts" badge linking to the affected Parts list lines.
Zone 4 — Parts list (with inline rules)
This is the core of the workbench. A table where each row = one material or sub-assembly included in the Model, with its rules expressed on the row.
Row structure
FieldNotesItemMaterial picker (search by code/name) or Sub-assembly picker. Shows thumbnail + code + name.TypeAuto-derived: material or sub_assembly (with its own parametric inputs).Quantity formulaExpression field. Free typing with autocomplete on available identifiers (System dimensions, Model custom dimensions, variants, other rows by alias, helper functions).Criteria gateOptional boolean expression. If empty → always include. If present → only include when expression evaluates true (e.g., substrate == 'metal_deck').Wastage overrideOptional per-line wastage % (overrides material default for this Model).AliasAuto-generated row ID (e.g., stanchion, cable_1), editable. Used by other rows' formulas for aggregation (ceil(stanchion.qty / 10)).NotesFree text, appears in MTO output.
Inline rule authoring
Clicking the quantity formula or criteria gate cell expands a live preview drawer beside the row:

Left: the expression editor with syntax highlighting, autocomplete for length, user_count, substrate, custom dimensions, variants, other row aliases, and helper functions (ceil, floor, if, linearCut, plateCut, admin-defined helpers).
Right: a scratchpad with sample inputs — every identifier the expression references appears as an editable field. Admin types sample values; the computed quantity (and the row's full effective inclusion) updates instantly.
A "Test with sample project" button loads inputs from a saved sample-project profile, so admin can re-run the full Model rule set against a realistic case before saving.

Cutting-algorithm rows
When the picked material has is_cuttable: linear or plate, the Parts list row offers a "Cut plan" toggle. Enabling it changes the quantity-formula slot from "return a number" to "return a cut plan":

The formula must return cuts (linear) or pieces (plate). Helper functions (linearCut, plateCut) are pre-templated based on the material's cutting metadata.
The row's MTO output is a cut plan, not a scalar count. The MTO view's cut-plan drawer (already specified) consumes this.

Aggregation across rows
Rows reference each other by alias. Order of evaluation is determined by the dependency graph (topologically sorted at evaluation time). The editor flags cycles inline ("cable.qty depends on stanchion.qty which depends on cable.qty — cycle detected").
Row state & UX

Rows can be reordered by drag (purely cosmetic — evaluation is by dependency).
Rows can be temporarily disabled (toggle) without deletion — useful when authoring variants.
Bulk select for delete/duplicate.
Inline validation: missing required fields, unknown identifiers in formulas, type mismatches (e.g., using a boolean variant where a number is expected) flagged immediately.

Criteria gates at the Model level
In addition to per-row gates in the Parts list, the Model header carries Model-level gates — preconditions for the entire Model to be selectable in a project:

"Selectable when: length <= 60"
"Selectable when: substrate in ['metal_deck', 'steel_purlin']"

If the user's System Instance dimensions don't satisfy the Model-level gates, the Model is greyed out in the Model picker with a tooltip explaining why ("Length must be ≤ 60m for this Model").
How this maps to the underlying rule engine
The user never sees the word "rule" as a separate noun. Internally:

Each Parts list row produces zero or more rule records at save time (one for quantity, optionally one for the criteria gate).
Model-level gates are stored as separate rule records with scope model_selectable.
The engine evaluates rules in the dependency-sorted order, computing the parts list. Output is the MTO.
Versioning snapshots the entire rule set at Model save time.

Suggested screen layout
┌───────────────────────────────────────────────────────────────┐
│ Model: Cable Lifeline 8mm SS316   v3 (draft)   [Save] [Test]  │
├───────────────────────────────────────────────────────────────┤
│ HEADER                                                        │
│ Supported Shapes: [Straight] [Segmented]                      │
│ Supported substrates: [Steel Purlin] [Metal Deck]             │
│ Selectable when: length <= 60                       [+ gate]  │
│ Certifications: EN 795 Class C (exp 2027-03)  [+ cert]        │
├───────────────────────────────────────────────────────────────┤
│ CUSTOM DIMENSIONS                                  [+ add]    │
│   curve_radius   number   mm   optional   min 300             │
├───────────────────────────────────────────────────────────────┤
│ VARIANTS                                           [+ add]    │
│   cable_diameter   enum   [8mm, 10mm, 12mm]   default 8mm     │
├───────────────────────────────────────────────────────────────┤
│ PARTS LIST                                         [+ add]    │
│ ┌─────────────────────────────────────────────────────────┐   │
│ │ alias    item              qty                gate     │   │
│ │ stanch.  Stanchion 500mm   ceil(length/2.4)+1  —       │   │
│ │ term.    End Termination   2                   —       │   │
│ │ cable    SS Cable 8mm      linearCut(...)      —       │   │
│ │ screws   Buildex 12-14×50  stanch.qty * 4      substrate=='metal_deck' │
│ │ ss_scr.  SS316 Bi-metal    stanch.qty * 4      substrate=='steel_purlin' │
│ └─────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
Clicking any cell with a formula opens the live preview drawer on the right; the table compresses to give it room.

This addendum gives you the full picture of how authoring feels. Combined with the previous addenda (cutting algorithms, rule-ownership correction), the design tool now has enough to mock the Model edit page as the centerpiece of the admin experience. Want me to also write a parallel addendum for the Sub-assembly edit page, since sub-assemblies have the same parametric/rule needs but at a finer scope?You said: models can add subassemblies toomodels can add subassemblies too6:46 PMClaude responded: Right — and that's actually already implicit in the Parts list (the "Item" picker accepts both materials and sub-assemblies), but it deserves to be made explic…Right — and that's actually already implicit in the Parts list (the "Item" picker accepts both materials and sub-assemblies), but it deserves to be made explicit because sub-assemblies behave differently from materials at instantiation time — they're parametric units that may need their own inputs collected.
Let me also flag a question this raises before writing the prompt: when a Model includes a sub-assembly, does the sub-assembly's parameters get filled by the Model (hardcoded by the admin), or by the project user at instantiation time, or a mix? I'll write the addendum assuming a mix (admin can pre-bind parameters or leave them as user-prompts), which is the most flexible and matches your earlier "app can detect if user needs input."
Here's the complementary block:

Addendum — Sub-assemblies in the Model Parts list
Models include both Materials and Sub-assemblies in their Parts list. Sub-assemblies are first-class line items, not a separate concept — but they behave differently from materials in three ways: they're parametric, they expand to multiple materials at MTO time, and they have their own scope (model-only / system-wide / global).
This addendum specifies how sub-assembly rows work in the Model edit page workbench.
Item picker accepts both Materials and Sub-assemblies
The Parts list "Item" cell shows a unified picker with two tabs:

Materials — search by code/name; shows thumbnail, code, supplier, unit cost.
Sub-assemblies — search by name; shows the assembly's parameter signature and a "scope" badge (model-only / system / global).

Filtering: when the admin is editing a Model in System "Lifeline," the Sub-assemblies tab shows:

All global sub-assemblies
All system-scoped sub-assemblies in the Lifeline System
All model-only sub-assemblies belonging to this Model (creatable inline)

A scope filter chip at the top of the picker lets admin narrow further.
Sub-assembly row structure
A Parts list row for a sub-assembly differs from a material row in three columns:
FieldMaterial rowSub-assembly rowItemMaterial pickerSub-assembly pickerQuantityQuantity formula (number)Count formula — how many instances of this sub-assembly to include (usually 1, but can be a formula like ceil(length / 12) for "one termination kit per 12m")Parameter bindings—New column: how this Model supplies inputs to the sub-assembly's parametersCriteria gateBoolean expressionBoolean expression (same)WastagePer-line overrideWastage applies to the sub-assembly's resolved materials at expansion timeAliasUsed by other rowsUsed by other rows. Aggregates like subassembly.alias.totals.fastener_qty are exposed for downstream formulas
Parameter bindings — the key mechanic
When admin picks a sub-assembly that has parameters (e.g., "End Termination Kit" expects cable_diameter and substrate), the row expands to show a parameter bindings table:
ParameterBindingValuecable_diameterBound to Model variantvariant.cable_diametersubstrateBound to System dimensionsubstratecorner_countUser input at project time(prompted in project form)kerfHardcoded3 mm
Each parameter has four binding options:

Bound to a Model/System input — picked from a dropdown of all available identifiers (System dimensions, Model custom dimensions, Model variants). Most common case — the Model "passes through" inputs to the sub-assembly.
Hardcoded value — admin sets a fixed value for this Model's use of the sub-assembly.
Computed from formula — small expression using available identifiers.
User input at project time — the parameter becomes a new field prompted in the project's System Instance form. The system unions these with the Model's own custom dimensions when rendering the project form.

The "binding kind" is per-parameter, so a single sub-assembly inclusion can mix all four styles.
Sub-assembly expansion at MTO time
When the rule engine evaluates a Model:

Sub-assembly rows are resolved first (dependency-sorted with material rows).
For each sub-assembly row, the engine:

Resolves parameter bindings (looks up Model/System/project values, evaluates formulas)
Multiplies by the count formula (how many instances)
Recursively evaluates the sub-assembly's own internal rules
Produces a set of material lines, scaled by instance count


Material lines from all sub-assemblies merge with the Model's direct material rows.
Aggregation across rows (referencing subassembly_alias.qty or subassembly_alias.totals.fastener_qty) works as expected — sub-assemblies expose computed totals to other rows.

MTO view — sub-assembly transparency
The default MTO view (grouped by System Instance) shows materials as flat lines, but with a sub-assembly attribution column so users can see which assembly contributed which materials:

"247 × Buildex 12-14×50 (from: 1 × End Termination Kit + Model direct)"

A toggle "Show as assemblies" collapses materials back under their parent sub-assembly nodes for a hierarchical view — useful for understanding the structure of an MTO during review/approval.
Authoring sub-assemblies — entry points
Two ways admins create sub-assemblies:

From the Catalog → Sub-assemblies page — full editor, define scope upfront, build the assembly's parameter signature and its own Parts list (which can include further sub-assemblies — nested, but limited to ~3 levels deep to keep things sane). Sub-assembly edit page has the same workbench structure as the Model edit page (header → parameters → variants → parts list with inline rules), minus the System/Shape constraints.
Inline from the Model edit page — when adding a Parts list row, the sub-assembly picker has a "+ Create new sub-assembly" action. Opens a side panel. The new sub-assembly defaults to scope: model-only (belongs to this Model). Admin can promote it to System or Global scope later from the Sub-assemblies catalog page.

Scope rules

model-only — visible/usable only by its parent Model. Listed under the Model's Parts list and on a "Local sub-assemblies" section of the Model edit page. Deleted with the Model.
system — visible to all Models in the same System. Listed on the System edit page under "System sub-assemblies" and in the Catalog → Sub-assemblies view filtered by System.
global — visible to all Models in all Systems. Listed in Catalog → Sub-assemblies with a "global" badge.

Scope can be promoted (model → system → global) but not demoted while in use by another Model — promotion requires admin confirmation; demotion requires no consumers exist.
Versioning interaction
Sub-assemblies version independently. A Model pins to a specific sub-assembly version (same versioning behavior as Models pin to Materials). When a sub-assembly publishes a new version, Models including it show a small "update available" indicator on the Parts list row — admin clicks to review the diff and decide whether to bump the Model's pinned version (which itself bumps the Model's version).
UI implications — Parts list row, expanded
┌───────────────────────────────────────────────────────────────────┐
│ ▼ alias: term   End Termination Kit   [system-scoped]   v2 ▲new   │
│   Count formula: 2                                                │
│   Gate: —                                                         │
│   Parameter bindings:                                             │
│     cable_diameter  ← variant.cable_diameter                      │
│     substrate       ← substrate                                   │
│     corner_count    ← user input at project time                  │
│     kerf            = 3 mm (hardcoded)                            │
│   Expands to (preview, with sample inputs):                       │
│     • 2× SS Thimble 8mm                                           │
│     • 2× Swageless Terminal                                       │
│     • 4× M10×50 SS Bolt                                           │
└───────────────────────────────────────────────────────────────────┘
Collapsed view is one line (alias, item, count, gate). Expanded view shows bindings and the live expansion preview using the row's sample inputs.

That covers sub-assemblies cleanly. The two open design decisions worth flagging for your design tool to acknowledge (not solve):

Nesting depth limit — I suggested ~3 levels of sub-assembly-within-sub-assembly. If you want unlimited, the engine handles it but the UI gets noisy.
Cross-version compatibility checks — when a sub-assembly version updates its parameter signature (adds a required param, removes one), Models pinned to the old version need a migration prompt. Worth showing this as a "needs attention" state in the Models list.

Hand this addendum alongside the previous three to the design tool. Want a parallel addendum for the Sub-assembly edit page itself, since it'll share most of the Model workbench but with different scope/parameter affordances?
</pasted_text>

## User

Verifier agent check completed

## User

Verifier agent check completed

## Assistant

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Fixed — the stray `SubAssemblyRow` reference is now a `PartsRow` with `active`, so it highlights as the selected sub-assembly whose drawer is open on the right. Workbench should render fully now.

## User

Verifier agent check completed

## Assistant

Verifier's clean — all 9 artboards rendering.

## User

make side bar, not too dark and collapsible

## Assistant

_[tool: str_replace_edit]_

Now update the Sidebar component to add the collapse button, wrap labels, and update the brand/foot markup, then thread state through:

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: run_script]_

_[tool: grep]_

Now wire the tweak into index.html:

_[tool: str_replace_edit]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Sidebar's now a light cool-slate `#EEF1F6` with ink text, an active row that pops with a white card + blue rail accent, and a collapse chevron at the brand row. Toggle it from the new **Layout · Collapse sidebar** tweak — the sidebar shrinks to 64 px with icons only and a floating handle on the right edge to expand again. State applies to every desktop screen at once.

## User

make the app name AkroCalc

## Assistant

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: copy_files]_

_[tool: set_project_title]_

_[tool: unregister_assets]_

_[tool: done]_

Renamed — wordmark is now **AkroCalc** everywhere (sidebar, page title, overview section). File moved to `AkroCalc Designs.html`. The amber chamfered mark stays; just the word changed.

## User

<system-info comment="Only acknowledge these if relevant">
User is viewing file: AkroCalc Designs.html
</system-info>

<pasted_text name="Pasted text (153 lines)">
Addendum — Manhours and labour estimation
Models and Sub-assemblies carry manhour rules alongside material rules. The output is a fully phased labour estimate that flows into the MTO/BoQ, project dashboard, and exports. This is not a separate module — it's the same rule engine, with manhours as an additional output dimension.
Phases
Labour is broken into phases — distinct stages of work that the user/estimator wants to see separately because they're scheduled, costed, or subcontracted differently.
Default phase set (tenant admin can customise):

Fabrication — off-site shop work (cutting cable, assembling termination kits, prepping stanchions)
Installation — on-site mounting and assembly
Commissioning — testing, load-testing, certification handover
Inspection — periodic re-inspection (sometimes used for recurring service contracts; can be excluded from initial project totals)

Phases are defined at tenant level (admin manages the list under Settings → Phases). Each phase has:

key — machine name (fabrication, installation, etc.)
label — display name
default_rate — manhour cost rate in tenant currency per hour (e.g., 45 SGD/hr)
default_crew_size — informational, used in duration calculations
colour — UI accent for charts and breakdowns

Phases are referenced by rules via their key.
Manhour rules live on Models and Sub-assemblies
Just like material rules, manhour rules can sit on either layer:

Sub-assembly manhour rules — the assembly's intrinsic labour cost. "An End Termination Kit takes 0.5h fabrication + 0.75h installation per unit." This is the most common and the most reusable.
Model manhour rules — labour that doesn't decompose cleanly to a sub-assembly. E.g., "Add 2h commissioning for any cable lifeline regardless of length" or "Add 0.1h per meter of cable for installation walk-time."

When a Model's MTO is computed, manhours from both layers sum.
Rule structure
A manhour rule is a Parts-list-style row, but its output goes to a separate "Labour" list on the Model/Sub-assembly edit page. Each row declares:
FieldNotesPhaseDropdown — tenant's phase listHours formulaExpression returning hours (number). Same formula language as material qty formulas — full access to dimensions, variants, other row aliases, helper functions.Criteria gateOptional boolean expression — only counts when trueCrew size overrideOptional; defaults to phase's default crew sizeRate overrideOptional; defaults to phase's default rate. Used when this specific work is more expensive (e.g., rope-access installation premium)AliasFor reference by other rowsNotesFree text
Examples
A Sub-assembly "End Termination Kit" might have:
phase: fabrication      hours: 0.5    gate: —
phase: installation     hours: 0.75   gate: —
A Model "Cable Lifeline 8mm SS316" might add Model-level rules:
phase: installation     hours: 0.1 * length             gate: —
phase: commissioning    hours: 2                        gate: —
phase: installation     hours: 1.5 * segments.count     gate: shape == 'segmented'
Per-unit hours on sub-assemblies are automatically multiplied by the sub-assembly's count formula when the Model is evaluated — same expansion mechanic as materials.
Live preview, same as material rules
The same inline live-preview drawer used for material formulas is used for manhour formulas. Sample inputs on the right, computed hours and computed cost (hours × rate) shown live.
Outputs
When a Model is evaluated, the engine produces:

Materials (existing, unchanged)
Labour summary — total hours and total cost per phase
Labour detail — line-by-line breakdown, each line showing source (which sub-assembly or Model rule), formula, computed hours, rate used, cost

Both are stored on the project's MTO record so exports can include them and aggregation views can sum across projects.
Aliases and cross-referencing
Manhour rows are aliased just like material rows, so other rows can reference them. Useful for derived calculations:
alias: site_hours
phase: installation
hours: 0.1 * length + 1.5 * segments.count
Then a commissioning rule can say:
phase: commissioning
hours: max(2, site_hours * 0.15)
Material rows can also reference labour aliases and vice versa — they share the dependency graph.
Project-level overrides
Same frictionless override model as materials. On the project's editable MTO view, the Labour tab lets the Project Manager / Estimator:

Adjust hours per line (up or down)
Override the rate on a line (or globally on the project — e.g., "this project uses overtime rates")
Add manual labour lines not generated by rules (e.g., "client requested extra walkthrough")
Remove generated lines
Override crew size

No reason note required (matches existing override policy). Modified-after-approval flag applies the same way.
Project-level labour settings
The project carries a few labour configuration knobs:

Phase rate overrides — override the tenant default rates for this project (e.g., a remote-site project with travel premium)
Phases to include in totals — checkboxes (e.g., exclude inspection from the upfront BoQ)
Round-up to nearest — admin/estimator can choose to round hours to nearest 0.25h, 0.5h, or 1h per phase for presentation cleanliness

MTO view integration
The MTO view gains a second top-level grouping toggle: Materials | Labour | Combined.

Materials — existing view (current default).
Labour — table grouped by phase, with sub-grouping by source (which sub-assembly or Model contributed). Each row: source, formula expression, computed hours, rate, cost.
Combined — single sortable table with both, columns: source, type (material/labour), description, qty/hours, unit, unit cost, line cost, phase (blank for materials). This is what most exports default to.

A summary card at the top of the MTO view shows:

Total materials cost
Total labour cost broken down by phase (small horizontal stacked bar, coloured per phase)
Total project cost
Total manhours

Exports

PDF (client-facing BoQ) — has a Labour Summary section showing total hours and cost per phase, plus a "Materials + Labour Combined" line-item table. Tenant admin can configure whether labour formulas are shown or only final hours (often client-facing exports hide the formulas).
Excel/CSV — separate sheets: Materials, Labour Detail, Labour Summary, Combined. The aggregation view across projects also gets phase-grouped labour totals.

Multi-project aggregation
When aggregating across projects, labour is summed by phase. Procurement people don't care about this, but project managers and operations planners absolutely do — "across our 5 active projects, how many installation hours do we have queued?" is a real scheduling question.
The combined view shows:

Total hours by phase across all selected projects
Provenance (e.g., "Installation: 240h total = 80h Project A + 95h Project B + ...")
Optionally exports as a load-planning CSV for ops

Storeman / issuance integration
Labour is not tracked by the storeman — it's an estimation/costing concept, not a stockable item. The storeman workflow ignores labour rows entirely.
However, the project dashboard's variance table (the one showing MTO qty / issued qty / returned qty / variance for materials) gains a parallel section: Labour planned vs Labour actual. Actuals can be:

Entered manually by project manager (lightweight — just a number against each phase)
Imported from an external timesheet system later (out of scope for MVP — but the data model should leave room: actual_hours per phase per project, with an optional source field)

So the v1 storyline is: planned manhours come from rules; actual manhours are typed in once at project close-out for variance reporting. Detailed timesheet capture is a later phase.
Authoring screen — Sub-assembly and Model edit pages
The Parts list workbench gains a second list below it: Labour.
┌───────────────────────────────────────────────────────────────────┐
│ PARTS LIST                                              [+ add]   │
│ … (materials and sub-assemblies as already specified)             │
├───────────────────────────────────────────────────────────────────┤
│ LABOUR                                                  [+ add]   │
│ ┌─────────────────────────────────────────────────────────────┐   │
│ │ alias    phase          hours formula            gate       │   │
│ │ instl_1  installation   0.1 * length             —          │   │
│ │ comm_1   commissioning  2                        —          │   │
│ │ seg_lab  installation   1.5 * segments.count     shape='segmented' │
│ └─────────────────────────────────────────────────────────────┘   │
│ Sample totals (with current preview inputs):                      │
│   Fabrication: 4.5h × 45/h = 202.50                               │
│   Installation: 14.2h × 45/h = 639.00                             │
│   Commissioning: 2h × 60/h = 120.00                               │
│   ─────────────────────────                                       │
│   Total labour: 20.7h, 961.50                                     │
└───────────────────────────────────────────────────────────────────┘
Same inline live-preview drawer for hour formulas as for material formulas. Same alias system. Same dependency-sorted evaluation.
Versioning
Manhour rules version with their parent (Sub-assembly or Model) — same scheme as material rules. A change to a labour formula bumps the parent's version. Projects pinned to old versions keep their old labour estimates until manually upgraded.
Tenant settings — labour configuration page
New admin page Settings → Labour:

Phase list (CRUD)
Default rates per phase
Default crew sizes
Currency (set at tenant level — applies to material costs too)
Default round-up behaviour for new projects

UI accents
Labour numbers in the UI use a distinct neutral colour (a warm slate, e.g. #475569) to differentiate from material cost (default text) and the hi-vis amber (reserved for warnings, unchanged). Phase chips use small coloured dots based on the phase's configured colour. Resist using the hi-vis amber on labour — it should remain reserved for genuine warnings (low stock, expiring certs, MTO variance).

That's the full labour addendum. Combined with the prior four (cutting algorithms, rule-ownership, Model workbench, sub-assemblies), you now have a coherent spec for a Model that produces:

Materials (with cutting plans where applicable)
Manhours (phased, costed, line-itemised)
Certifications
Versioned, parametric, with criteria gates and variants

Want a parallel addendum for the project costing / BoQ output — i.e., how all of this rolls up into the client-facing pricing document, margins, contingency, taxes, etc.? That's the natural next layer if you want this to become a full quotation tool, not just an MTO.
</pasted_text>

## Assistant

_[tool: update_todos]_

_[tool: str_replace_edit]_

Building the labour layer — workbench gets a Labour zone, a new Combined view artboard, and a Settings → Labour admin screen. Phase colors added to the tokens.

_[tool: grep]_

_[tool: str_replace_edit]_

Now add a Labour zone to the Model Edit Workbench:

_[tool: str_replace_edit]_

Now append the Labour table & totals components to model-edit.jsx:

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: write_file]_

_[tool: write_file]_

Now a new **Dashboard · Combined** artboard and the **Settings → Labour** admin screen:

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

_[tool: snip]_

Labour layer landed — two new artboards in a new **Labour & costing** section:

**10 · Project MTO · materials + labour combined**
- Top cost summary card: three columns — Materials total + remaining pick progress, Labour total + per-phase stacked bar with phase chips, and a primary-blue **Project total** card showing the mat/labour percentage split
- `Materials | Labour | Combined` segmented toggle (Combined active)
- `Group by · System | Phase | Source`
- Combined line items: material rows look familiar; **labour rows use slate ink** to differentiate, with phase chips and formulas shown inline (`0.1 * length`, `1.5 * segments.count`)
- Footer aggregates total hours + project cost

**11 · Settings → Labour**
- Tenant defaults strip: currency, hours round-up (`0.25h`), "show formulas in client PDF" toggle, inspection-in-totals toggle
- Phase CRUD table: color swatch + key + label + description + rate input (with `USD/h` suffix) + crew size + In-totals state + usage count
- Project-level rate overrides table with side-by-side default vs override and Δ%
- Side-effects card explaining stable keys, pinned rates, and the blocked-delete rule

**Model edit workbench (08)** also got a new **Zone 05 · Labour** below the parts list:
- Labour rule rows reusing the same formula language as parts, with phase chips, gates, and rate overrides
- **Sample totals** card with per-phase rows (hours × rate = cost), bars, an excluded "inspection" row at low opacity, and an aggregate Model-total card with cost-weighted phase mix

**Token additions:** `--labour-ink` (slate) for labour-cost text + four phase colors (`--phase-fab` terracotta, `--phase-inst` blue, `--phase-comm` teal, `--phase-insp` lavender). Hi-vis amber stays reserved for warnings (now also flagging rate overrides + excluded-but-referenced phases).Open items I'd love direction on next: parallel **Sub-assembly edit page** (same workbench shell, scope-aware), **storeman-mobile labour close-out** flow (typing actuals per phase against the plan), and the **project costing / quotation** layer (margins, contingency, taxes) — say which to take and I'll line it up.

## User

Verifier agent check completed

## Assistant

Clean across the board.

## User

Storeman dashboard — final shape
Bottom nav (4 tabs): Picking Lists · Scan · Stock · More
Picking Lists (home)

Top stats strip: today's receipts / today's issuances / today's returns / open picking lists count / overdue count
Compact MTO cards below: project name, client, needed-by date, % issued progress bar
Sort default: needed-by ascending; pinned compact card at top showing "X items fully issued, awaiting project closure" for completed-but-open MTOs
Real-time auto-update + small dot on the Picking Lists tab when a new approval lands

Picking list detail

Grouped by System Instance (Lifeline / Guardrail / etc.)
Two-line cards per material: line 1 = name + code + thumbnail; line 2 = stock info + Issue button
Fully issued lines = dimmed, strikethrough qty, green checkmark, "all issued" badge
Tap Issue → bottom sheet (qty pre-filled with MTO minus already-issued, location defaults to material's primary location, all locations shown with balances)
Toast confirmation with Undo

Scan tab

Camera-based QR scan (PWA, html5-qrcode/zxing)
Smart default: open picking lists → Issue (with project context); else → Lookup
Returns and Receive surfaced as secondary actions on material QR scan
Material QR + Return → list of projects that issued this material, storeman picks
Picking-list QR → jumps to that exact line with qty pre-filled

Stock tab

Search bar + material list
Material detail page: header + stock-by-location + recent movements; [Receive] action available

More tab

Profile, Settings, My Activity (today's transactions), Logout

Cross-cutting

Light theme only, high-contrast
Online-only (no offline mode); blocking overlay if connection drops
Returns auto-split: returning more than issued silently splits into Return + Receive
Stock cannot go negative on issuance — blocks with "stock at other locations" info shown
Storemen + admins can scan; guest scan mode is read-only and rate-limited

## Assistant

_[tool: read_file]_

Building the 5 mobile screens. Let me first check existing storeman.jsx for reusable bits:

_[tool: write_file]_

Now wire them in. I'll replace the existing Storeman section with a richer one showing all 5 screens:

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Storeman mobile suite now has 6 artboards in the **Field & roll-up** section:

- **05a · Picking Lists home** — top stats strip (Receipts / Issued / Returns / Open / Overdue), pinned "fully issued · awaiting closure" card, MTO cards sorted by needed-by with the overdue one wearing the hi-vis left rail
- **05b · List detail + Issue sheet** — System-Instance groups (Lifeline / Guardrail), two-line material cards with `Issue` buttons, fully-issued lines dimmed + strikethrough + "all issued" badge, the live Issue bottom sheet with qty stepper + location list showing balances, and an Undo toast at the top
- **05c · Scan tab** — dark camera viewfinder with yellow corner brackets, scan line, and a slide-up smart-routing result sheet: primary "Issue to project" CTA + secondary actions (Lookup / Receive / Return)
- **05d · Stock detail** — material card with three quick actions (Receive / Transfer / Print QR), stock-by-location with primary + low pills, recent movements (receipt / issuance / return / adjustment) color-coded
- **05e · More** — profile card with role pills, today's activity stats + recent actions, settings groups with toggles, log out, build tag
- **05f · Post-scan issue** (the original) — kept for the deep-link case

Cross-cutting touches reflected: light theme only, online status dot on the home, hi-vis used for overdue cards + low-bin warnings + the scan line (the "warning" semantic stretches a little here for the scanner attention beacon), primary-blue elevated Scan tab, and the bottom sheet defaults to the primary location with all locations' balances visible.

## User

Verifier agent check completed

## Assistant

Verifier clean — all five mobile screens render correctly.

## User

<pasted_text name="Pasted text (93 lines)">
Tenant Admin dashboard — final shape
Navigation (sidebar, left)

Dashboard
Projects
Catalog
Stock
Users
Settings

Top bar (every page)

Global search (searches everything — projects, materials, models, sub-assemblies, etc. — results grouped by entity type)
Admin profile with name/avatar (top-right)

Dashboard (home)

Grid of cards, 2-3 per row, sorted by importance
Each card: count + preview list of top 3 items + "view all" link
Cards (in priority order):

MTOs awaiting approval
Projects nearing 'needed by' with incomplete MTO
Modified-after-approval MTOs needing re-review
Low-stock materials (below reorder level)
Expiring certifications
Recent stock movements (filterable, all locations)



Projects page

Table with expandable rows showing System Instances inside
Sort/filter (status, dates, client, system type)
Bulk actions (multi-select for aggregation, export multiple, archive)

Project MTO approval view

Summary tab: project metadata, total cost (materials + labour), system instances count, key flags/warnings
Full MTO view tab: line-by-line, grouped by System Instance
Sticky [Approve] / [Reject (optional reason)] bar at the bottom

MTO lifecycle (updated)

Draft → (PM submits) → Pending Approval → Approved | Rejected (back to Draft) → Modified after approval (if edited post-approval)
Drafts invisible to admin until explicitly submitted

Catalog hub

Cards for: Systems, Models, Sub-assemblies, Materials, Categories, Suppliers, Substrates, Phases
Each card: icon + name + count + last-edited info
Above the cards:

Recently edited list
Quick-action buttons ("New System", "New Model", etc.)
Bulk import (Materials/Suppliers/Substrates/Categories in v1; Models/Sub-assemblies in v1.5)
Quick-jump shortcut


Catalog-wide search via global search bar

Stock page

Default view: Stock Overview — totals across locations, low-stock list, recent movements
Subsections accessible: Locations, Movements, Adjustments, Transfers, Low Stock

Users page

List view + "Add user" modal with role assignment

Settings page

Tenant profile (name, logo, currency)
Phases & rates (labour configuration)
Substrate list (controlled list per tenant)
Material code patterns (auto-generation rules)
Wastage defaults (global / per category)
Approval rules / thresholds
Branding (PDF header/footer, colors)
Billing & subscription

Cross-cutting

Light theme only
No notification bell / badges — dashboard cards are the only surface for "what needs attention"


That's a solid Admin dashboard plan. Now we can either:

Plan the Project Manager dashboard next (project-centric, MTO creation flow, overrides)
Move to writing the comprehensive design prompt for Claude Code, since admin + storeman are the two most differentiated views
Plan one of the remaining roles (Estimator, Project User, Tenant Owner)
You said: Q: What's the next step?
</pasted_text>

## Assistant

_[tool: update_todos]_

_[tool: write_file]_

Best next step: build the two **Admin** surfaces that aren't mocked yet — the **Admin Dashboard home** (attention-card grid is the whole product surface for admins) and the **MTO Approval view** (the workflow that connects PM-submit → storeman-issue). Everything else on your list (Catalog hub, Stock Overview, Users, Settings) is mostly composition of patterns we already have; the home + approval are the genuinely new shapes.

Building both now.

_[tool: write_file]_

Wire them into the canvas in a new **Admin** section, and update the topbar so the global-search affordance is in place:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Built — new **Tenant Admin** section, 2 artboards:

**12 · Admin Dashboard** — admin's whole inbox:
- Top stats strip: Awaiting approval / Approved this week / Active projects / Low-stock SKUs / Expiring certs / Stock value
- 3×2 attention-card grid sorted by importance:
  - MTOs awaiting approval (with **Review** primary CTA per row)
  - Nearing-due projects with incomplete MTO (overdue one shows TODAY in hi-vis)
  - Modified-after-approval (hi-vis tone, change diff inline)
  - Low-stock materials (`out` ones flagged critical with `HiVis`)
  - Expiring certifications (4-day expiry shown in danger red)
  - Recent stock movements (compact, color-coded receipt/issue/transfer/return/adjustment)

**13 · MTO Approval view** — the workflow:
- Header: project + chip + `Pending approval` pill + submitter strip
- Tabs: Summary / Full MTO / Flags / Diff from last approved / Comments
- Hero row: project details meta + cost card with materials/labour stacked bar and percentage split
- **Flags panel** with 5 auto-detected items (cert expiry crit / substitutions warn / qty override warn / new material info / lead time info)
- System Instances mini cards showing pinned Model versions + per-instance materials + labour costs
- MTO preview table (top contributors) with substitution + override pills inline + one labour row
- **Sticky bottom bar**: 5-flag reminder, project total, Request changes / Reject (red) / Approve & issue to storeman (primary)

**Topbar** now shows the global-search affordance with the spec'd hint text.

Next obvious admins-to-mock (each composes existing patterns):
- **Catalog hub** (cards for Systems/Models/Sub-assemblies/Materials/Categories/Suppliers/Substrates/Phases)
- **Stock Overview** (totals across locations + low-stock + movements)
- **Settings hub** index page (current Labour settings is one of its tabs)
- **Users** list + Add user modal

Or roll one of: Project Manager dashboard, the Sub-assembly edit page (parallel to Model workbench), or the costing/quotation layer (margins + tax). Say which.

## User

Verifier agent check completed

## Assistant

_[tool: snip]_

Clean verdict — both admin artboards are good.

## User

<pasted_text name="Pasted text (96 lines)">
Project Manager dashboard — final shape
Sidebar nav

Projects (default landing)
MTO Aggregation
Catalog (read-only)
Stock (read-only)

Top bar

Global search
Profile/avatar

Projects (home)

Big "+ New Project" button + project list below
Sees all projects in tenant (collaborative)
Same table as admin (expandable rows showing System Instances inside)

New project flow

Multi-step wizard: Info → Add first System Instance → Done
Info captures: name, client, location, site contact, needed-by, status (defaults to Draft)
Site Foreman assignment happens at project creation (or later in Settings)

Project page (tabs at top)

Overview — metadata, status, needed-by, stock variance summary table (MTO/issued/returned)
Systems — list of System Instances + "+ Add System" button
MTO — combined view across all System Instances (grouped by System Instance default)
Photos — drag-drop + categorization (Site Survey / Drawings / Progress / Reference) + comments per photo
Activity — chronological feed mixing stock transactions, status changes, MTO edits, approvals, photo uploads

System Instance builder (opened from Systems tab)

Full-page dedicated screen, two-panel layout
Left: free-form input sections (all visible, any order, validate on save) — System pick, Shape, dimensions, Substrate, Model, Model params, Variants
Right: live MTO preview pane — Materials list + cost total + manhours total + flags
Missing inputs: validation panel listing missing fields with jump links

Project MTO tab

Single combined view, grouped by System Instance by default
Inline cell editing for overrides (qty, substitution, wastage)
Top actions: [Submit for Approval] [Add manual line] [Recompute] [Export]
Pre-approval Export available (preview); post-approval Export is the formal BoQ

MTO Aggregation page

Simpler than admin: multi-select + combined view, no supplier-level features

Catalog (read-only)

Same catalog hub as admin, edit buttons hidden

Stock (read-only)

Same Stock Overview as admin, read-only

Cross-cutting

Mobile responsive (site reviews on tablet/phone)
No project duplication / templates — each project starts fresh
Sign-off model: system-recorded "Approved by X at Y" appears on PDF exports (no signature ceremony)

Site Foreman role (new) — app shape
Bottom nav (mobile-first)

Pending Receipts | Scan | Projects | More

Scope

Project-specific access (assigned by PM during project creation)
Can: scan handover tickets, confirm receipt with editable qty (discrepancies flagged in audit log), view assigned project's Overview tab (read-only), add photos to project

Handover ticket flow (cross-role workflow)

Storeman issues materials → system generates Issuance transaction + Handover Ticket (with QR)
Ticket printed/digital accompanies physical materials
Site Foreman or PM scans the ticket QR later
App shows "Confirm receipt of X for Project Y?" → confirm qty (defaults to ticket qty, editable)
System logs Site Receipt transaction
Discrepancies allowed and flagged in audit log
Admin can manually mark ticket as received if site person has no app

Stock transaction chain (updated to reflect handover)

Receipt (inbound from supplier)
Issuance (warehouse → project, generates Handover Ticket)
Site Receipt (handover ticket scanned, marks materials delivered to site)
Return (project → warehouse)
Adjustment (admin only)
Transfer (admin only, between locations)


That completes Project Manager + Site Foreman. The major roles now planned: Storeman, Tenant Admin, Project Manager, Site Foreman. Remaining if you want them: Estimator, Project User/Viewer, Tenant Owner.
</pasted_text>

## Assistant

_[tool: snip]_

_[tool: update_todos]_

_[tool: write_file]_

_[tool: write_file]_

Now the New Project wizard + Site Foreman mobile screens:

_[tool: write_file]_

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Built — 5 new artboards in a **Project Manager & Site Foreman** section:

**14 · New Project wizard (step 2 of 3)** — top progress rail with step states, recap of step-1 info on the left with assignments (PM + foreman), primary-blue prompt card with "skip" / "duplicate from existing" shortcuts, and a compact inline System Instance form (system / shape / substrate / model / total length) with a live cost strip + missing-param flag at the bottom.

**15 · System Instance builder · two-panel** — left has all 6 sections visible (System & Shape / Dimensions / Substrate / Model / Variants / Parameters) with status dots per section, free-form ordering; right pane is the live MTO preview (mat + labour totals, top contributors mixing material and labour rows, validation panel listing what blocks recompute with "Jump to §06" link, and compatibility flags).

**16 · Project · Activity feed** — chronological mixed feed with vertical timeline rail, day grouping, color-coded action icons (edit / approve / receipt / issuance / return / photo / comment), and inline photo thumbnails. Filter bar with Seg (`All / MTO / Stock / Approvals / Photos / Comments`), who, range.

**17 · Foreman Pending Receipts (mobile)** — stats strip (awaiting / confirmed today / projects assigned), tickets list with HOT-codes, in-transit vs received pills, urgent ones wearing the hi-vis left rail and a full-width primary CTA "Scan ticket to confirm".

**18 · Foreman Confirm receipt** — scanned-ticket header, project context card, item list with editable qty steppers; one item shows a short-pick (`28 → 26`) and gets a hi-vis warn strip "discrepancy will be flagged in audit log". Sticky bottom primary CTA "Confirm receipt · 3 items".

The handover-ticket chain is now visible end-to-end: storeman's existing Confirm-issue screen (05f) → site foreman's Confirm receipt (18) → project Activity feed (16) shows both events with their actor and discrepancy.

Open next moves: **Catalog hub** index, **Stock Overview**, **Settings hub** index, and the **Sub-assembly edit page** (parallel to Model workbench, scope-aware). Say which.

## User

Verifier agent check completed

## Assistant

_[tool: snip]_

Verifier clean — 18 artboards now on the canvas.

## User

<pasted_text name="Pasted text (380 lines)">
Addendum — Roles, dashboards, and operational workflows
This addendum specifies every role's experience in the app, plus the cross-cutting workflows (Quotes, Handover, Procurement) that emerged from role planning. Where this conflicts with earlier addenda, this is authoritative.
Updated entity model
Two new top-level entities and one refinement vs. the original prompt:
Project (real-world job: client, location, photos, activity)
  ├── Quote(s)                     ← NEW: proposal layer
  │     ├── System Instance(s)     ← MOVED: instances now live on Quotes
  │     ├── MTO (computed)
  │     └── Pricing (margin, contingency, tax, terms)
  └── Working Set                  ← NEW: snapshot of Awarded Quote's Instances, locked in at award
        ├── System Instance(s)     (copies of awarded Quote's)
        ├── MTO (live, approved by admin)
        └── Variations (PM edits tracked in activity feed)

PurchaseOrder                      ← NEW: procurement document
  ├── Supplier
  ├── Lines (material, qty, unit cost)
  ├── Source: project_demand | stock_replenishment
  └── Lifecycle states (below)

HandoverTicket                     ← NEW: chain-of-custody artifact
  ├── Generated by Issuance transaction
  ├── QR for site scan
  └── Confirmed by Site Receipt transaction
Project structure
A Project is the real-world job and a thin container of metadata: client, location, site contact, dates, status, photos, activity feed. The actual safety system configurations live one layer down on Quotes (during sales/estimation) or on the Working Set (after award).
A Project can be created in two paths:

From a Quote (new business): PM creates Project shell → Estimator creates Quote → adds System Instances → applies pricing → admin internal review → sends to client → client awards → Working Set is created as a snapshot of the awarded Quote's Instances.
Direct migration (legacy work): PM creates Project shell → System Instances added directly to a synthetic "as-built" Quote that is auto-awarded → Working Set populated. Used for projects pre-dating the system.

Quote lifecycle
Draft → Internal Review (admin signs off) → Sent → Awarded | Rejected | Expired
Multiple Quotes per project supported (alternative scenarios: cable vs rail lifeline, etc.). Each Quote owns its own System Instances. When a Quote is Awarded, its System Instances are snapshot-copied to the Project's Working Set, and that copy becomes the live document for MTO approval, stock issuance, and project execution. Non-awarded Quotes remain in the system as historical records.
Working Set after award
After award, the PM can freely edit System Instances on the Working Set or add new ones (variations). Changes appear in the project's chronological activity feed (no formal Variation Order entity in MVP). If the Working Set MTO was already approved by admin, edits flag it as "modified after approval" (soft lock).
MTO lifecycle (on Working Set)
Draft → (PM submits) → Pending Approval → Approved | Rejected (back to Draft) → Modified after approval (if edited post-approval)
Drafts invisible to admin until explicitly submitted. Admin rejection returns to Draft with optional reason. Approval is system-recorded (user + timestamp) — no signature ceremony. Approval timestamp + admin name appear on exported PDFs.
Role catalog
Seven roles in total:

Tenant Owner — top of the tenant hierarchy. Same as Tenant Admin plus billing/subscription management. UX is effectively Tenant Admin with one extra Settings section.
Tenant Admin — runs the catalog, approves MTOs, approves POs from estimators, manages users, handles stock transfers between locations.
Project Manager — creates projects, edits Working Set, submits MTOs for approval, captures photos, sees all projects in the tenant (collaborative).
Estimator — owns commercial/logistics. Builds Quotes, applies pricing, generates POs (needs admin approval), can add Materials/Suppliers/Categories to the catalog.
Project User / Viewer — read-only access to projects assigned to them (specifics below).
Storeman — mobile-first warehouse operator. Issues, receives, returns stock against approved MTOs. Full access across all warehouse locations.
Site Foreman — mobile-first field role. Project-scoped (assigned per project). Scans Handover Tickets to confirm site receipt; can add photos to assigned projects.

Storeman experience (mobile-first)
Bottom navigation (4 tabs): Picking Lists · Scan · Stock · More
Picking Lists (home)

Top stats strip: today's receipts / today's issuances / today's returns / open picking lists count / overdue count
Compact MTO cards below sorted by needed-by date ascending: project name, client, needed-by date, % issued progress bar
Pinned compact card at top: "X items fully issued, awaiting project closure" (for MTOs that are 100% issued but project still open)
Real-time auto-update + small dot on the Picking Lists tab when a new approval lands
Floating SCAN button (FAB) always visible

Picking list detail

Grouped by System Instance (Lifeline / Guardrail / Ladder, etc.)
Two-line material cards: line 1 = name + code + thumbnail; line 2 = stock info + Issue button
Fully-issued line state: dimmed row, strikethrough qty, green checkmark, "all issued" badge
Tap Issue → bottom sheet:

Qty input pre-filled with MTO_qty − already_issued
Location picker defaults to the material's primary location; all locations shown with their stock balances inline
Confirm button


Successful issuance: toast "Issued 50 → Buildex 12-14×50. Undo" for ~5 seconds

Issue rules

Stock cannot go negative on issuance — blocks with "Only 12 available at Warehouse A. Check other locations or record a Receive first."
Displays inline info "Other locations have stock: B (50), C (12)" but does not auto-switch — storeman exits and starts over if needed.

Scan tab

Phone camera + JS library (html5-qrcode or @zxing/browser)
Smart routing on scan:

Material QR + storeman has open picking lists → primary action Issue (against picking list line), secondary Return, Receive, Lookup
Material QR + no open picking lists → primary action Lookup, secondary Receive, Return
Picking-list QR (printed on MTO sheet) → jumps to picking list, scrolls/highlights the exact line, qty field pre-filled
PO QR (printed on PO sheet) → opens Receive against PO, line items pre-listed with PO qty default



Returns flow

Initiated from picking list line OR material QR scan
Material QR + Return → list of all open projects that issued this material, storeman picks
Auto-split mechanic: if return qty exceeds issued qty, system silently splits into Return (up to issued qty) + Receive (excess as new stock). Toast: "Returned 15 to Project A + Received 5 to stock."
Capture: qty only (no condition tracking)

Receive flow (when no PO involved)

Entered via Receive tab OR scan → Receive action
Scan-first: scan material QR → enter qty + location + date
No supplier PO/invoice reference required

Receive flow against PO

Scan PO QR → see PO line items
Tick off each line, qty defaults to PO line qty, editable
Variance allowed and logged as discrepancy
PO status auto-updates: Sent → Partially Received → Fully Received

Stock tab

Search bar + material list (search by code/name)
Material detail page: header (thumbnail + code + name) + stock-by-location table + recent movements list
Actions available: [Receive], [Adjust] (admin-only, hidden for storeman)

More tab

Profile, Settings, My Activity (today's transactions), Logout

Cross-cutting (storeman)

Light theme only, high contrast
Online-only (no offline mode); blocking overlay "Connection lost — please reconnect to continue" if signal drops
Login: standard email/password or magic link, no PIN/biometric layer

Site Foreman experience (mobile-first, NEW role)
Bottom navigation: Pending Receipts · Scan · Projects · More
Scope

Project-specific access; assigned by PM at project creation or later
Can: scan Handover Tickets, confirm site receipt (qty editable, discrepancies flagged in audit log), view Overview tab of assigned projects (read-only), add photos to assigned projects.

Handover Ticket workflow

Storeman issues materials → system creates Issuance transaction + Handover Ticket with QR
Ticket accompanies the physical materials (printed or digital)
Foreman/PM scans the ticket's QR later, on site
App shows "Confirm receipt of 50 × Material X for Project A?"
Confirm qty (default = ticket qty, editable for discrepancies)
System logs Site Receipt transaction
Admin can manually mark ticket as received as a fallback for foremen without app access

Stock transaction chain (full chain of custody):

Receipt (inbound from supplier, optionally PO-linked)
Issuance (warehouse → project, generates Handover Ticket)
Site Receipt (Handover Ticket scanned, materials confirmed delivered to site)
Return (project → warehouse)
Adjustment (admin only)
Transfer (admin only, between locations)

Tenant Admin experience (desktop)
Sidebar nav: Dashboard · Projects · Catalog · Stock · Users · Settings
Top bar (every page): Global search (universal, results grouped by entity type) · Profile/avatar (top-right)
Dashboard (home)

Grid layout, 2-3 cards per row, sorted by importance
Each card: count + preview list of top 3 items + "view all" link
Cards in priority order:

MTOs awaiting approval
Projects nearing 'needed by' with incomplete MTO
Modified-after-approval MTOs needing re-review
Low-stock materials (below reorder level)
Expiring certifications
Recent stock movements (filterable across all locations)


No notification bell, no sidebar badges — the dashboard is the only "needs attention" surface

Projects page

Table with expandable rows showing System Instances inside
Sort/filter (status, dates, client, system type)
Bulk actions: multi-select for aggregation, export multiple, archive

MTO approval view

Summary tab: project metadata, total cost (materials + labour), system instances count, key flags/warnings
Full MTO view tab: line-by-line, grouped by System Instance
Sticky [Approve] / [Reject (optional reason)] bar at the bottom

Catalog hub

Cards for each entity: Systems, Models, Sub-assemblies, Materials, Categories, Suppliers, Substrates, Phases
Each card: icon + name + count + last-edited info
Above the cards: recently edited list, quick-action buttons ("New System", "New Model", etc.), bulk import (Materials/Suppliers/Substrates/Categories in v1; Models/Sub-assemblies in v1.5), quick-jump shortcut

Stock page

Default view: Stock Overview — totals across locations, low-stock list, recent movements
Subsections: Locations, Movements, Adjustments, Transfers, Low Stock

Users page

List view + "Add user" modal with role assignment

Settings page

Tenant profile (name, logo, currency)
Phases & rates (labour configuration)
Substrate list (controlled list per tenant)
Material code patterns (auto-generation rules)
Wastage defaults (global / per category)
Approval rules / thresholds
Branding (PDF header/footer, colors)
Billing & subscription (Owner only — admin sees as read-only)

Project Manager experience (desktop primary, mobile responsive)
Sidebar nav: Projects · MTO Aggregation · Catalog (read-only) · Stock (read-only)
Top bar: Global search · Profile/avatar
Projects (home)

Big "+ New Project" button + project list below
Sees all projects in tenant (collaborative)
Same table layout as admin (expandable rows showing System Instances)

New project flow

Multi-step wizard: Info → Add first Quote (or skip) → Done
Info captures: name, client, location, site contact, needed-by, status (defaults to Draft)
Site Foreman assignment at project creation (or later)

Project page (tabs at top)

Overview — metadata, status, needed-by, stock variance summary table (MTO/issued/returned per material)
Quotes — list of quotes under the project with status and value (PM has read access; full edit lives with Estimator)
Working Set — appears after award; the live System Instances. "+ Add System" button. List of System Instances; tap one to open the Instance Builder.
MTO — combined view across all Working Set Instances (grouped by System Instance default)
Photos — drag-drop + categorization (Site Survey / Drawings / Progress / Reference) + comments per photo
Activity — chronological feed mixing stock transactions, status changes, MTO edits, approvals, photo uploads, variations

System Instance Builder (full-page, two-panel)

Left: free-form input sections (all visible, any order, validate on save) — System pick, Shape, dimensions, Substrate, Model, Model custom dimensions, Variants, Sub-assembly parameter bindings
Right: live MTO preview pane showing Materials list + cost total + manhours total + flags
Missing inputs: validation panel listing missing fields with jump links to fill them

MTO tab on project

Single combined view, grouped by System Instance by default; user can re-group by material/category/supplier at view time
Inline cell editing for overrides (qty, substitution, wastage)
Substitution shows soft warning if category/spec mismatch
Top actions: [Submit for Approval] · [Add manual line] · [Recompute] · [Export PDF/Excel/Link]
Pre-approval exports are previews; post-approval exports are formal BoQ

MTO Aggregation page

Simpler than admin/estimator: multi-select + combined view + provenance breakdown, no supplier-grouping or PO generation
Re-applies pack-size rounding after summing

Catalog (read-only): same catalog hub as admin, edit buttons hidden
Stock (read-only): same Stock Overview as admin, no action buttons
Cross-cutting (PM): mobile responsive (tablet site reviews supported), light theme only
Estimator experience (desktop primary, mobile responsive)
Sidebar nav: Quotes (default) · Projects · Procurement · Catalog · Stock
Top bar: Global search · Profile/avatar
Dashboard (home / Quotes default)

Cost-focused cards:

Quotes needing pricing (Draft with Instances but no pricing applied)
Quotes in Internal Review (waiting on admin sign-off)
Sent Quotes nearing expiry
Awarded Quotes (this week / month)
Recent activity (last 7 days)



Quotes list page

Table: client, project, quote number, value, status, expiry, last activity

Quote detail (single page with side-panel sections)

Build — System Instances list + Instance Builder (same full-page builder as PM uses, two-panel with live preview)
Price — line-item costs from materials + labour; margin %, contingency %, tax %; running total
Document — PDF preview + "Generate PDF" button (manual send to client, no in-app email)

Quote lifecycle actions

Draft → "Submit for Internal Review" (admin approves)
Internal Review → Approved by admin → "Send to client" (generates PDF, status moves to Sent)
Sent → Awarded | Rejected | Expired (estimator updates status manually)
Award triggers automatic snapshot of System Instances into Project's Working Set

Projects page

Same project list as PM, with cost columns added (current Quote value, awarded value)
Sees all projects in tenant

Procurement section

MTO Aggregation — full features: multi-select projects, combined view, provenance breakdown, supplier grouping, "Generate PO from supplier group" action
Purchase Orders — list with status, supplier, value, source (project_demand / stock_replenishment), related projects
PO detail

Header: PO number (auto-generated), supplier (single), status, dates (created, sent, expected delivery)
Source: project_demand (with related projects) OR stock_replenishment (standalone)
Line items table: material, ordered qty (rounded by pack size), unit cost, line total, received qty (running), variance
Actions: [Submit for Approval] (estimator) or [Send directly] (admin) · [Print/Export PDF for supplier]


PO lifecycle: Draft → Pending Approval (estimator path) → Sent → Partially Received → Fully Received → Closed

Admin can create POs directly without approval step
Storeman receives against PO by scanning PO QR; receive qty editable; variances logged



Catalog access (Estimator-specific)

Same catalog hub layout as admin
Editable: Materials, Suppliers, Categories
Read-only: Systems, Models, Sub-assemblies, Substrates, Phases

Stock: same Stock Overview as admin, read-only
Cross-cutting (Estimator): mobile responsive, light theme only
Project User / Viewer experience (read-only)
Sidebar nav: Projects (assigned) · Profile
Scope

Sees only projects they're assigned to (assigned by admin or PM in user management)
Read-only across Project tabs: Overview, Quotes, Working Set, MTO, Photos, Activity
Cannot trigger any state change (no Approve, no Submit, no Issue, no Edit)
Can export PDFs of approved MTOs (read-only operation)

Use cases

External stakeholders (consultants, building owners, sub-contractor reps)
Internal staff who need visibility without authority (junior staff, finance reviewers, ops planners)

Tenant Owner experience
Identical to Tenant Admin plus:

Billing & Subscription page in Settings (admin sees read-only; owner can change plan, payment method, view invoices)
User management permission includes ability to remove the Tenant Admin role from other users (an admin can't demote another admin without owner involvement)
Tenant deletion / closure (irreversible — confirmation flow)

Owner can act as admin day-to-day; the role differences only surface in the Settings/billing area and a few high-stakes governance actions.
Cross-cutting role behaviors
Scanning permissions

Storemen: full scan capability (Issue, Receive, Return, Lookup, PO receipts)
Admins: full scan capability (same as storemen) plus admin-only adjustments
Estimators, PMs: can scan, but actions are role-restricted (e.g., they can't issue stock)
Site Foremen: can scan Handover Tickets only; other QRs prompt "Action not available for your role"
Guest scan: anyone (including unauthenticated) can scan to view material info, rate-limited, read-only — used for clients/visitors

Light/dark mode: light theme only, all roles, for consistency
Search: every authenticated role has the global search bar, results scoped by their permissions
MTO approval flow (recap)

PM submits → admin reviews on Summary tab → Approve (auto-issues to storeman) or Reject (optional reason, returns to Draft)
Approval is system-recorded (admin name + timestamp on PDF exports)

Quote approval flow

Estimator → "Submit for Internal Review" → admin reviews → Approved → status moves to Sent → estimator generates PDF and sends manually
Similar admin-as-gatekeeper pattern as MTO

PO approval flow

Estimator drafts → "Submit for Approval" → admin reviews → Approved → status moves to Sent → estimator/admin generates PDF for supplier
Admin can skip approval step when creating POs directly

Aesthetic carry-forward
The "Clean industrial / safety" direction from the main prompt applies to all role experiences. Distinctives:

Storeman / Site Foreman (mobile): larger tap targets, big numeric input, prominent SCAN FAB, high contrast for warehouse lighting; otherwise same palette and typography as desktop
Hi-vis amber accent: used only for warnings (low stock, expiring certs, modified-after-approval, override mismatches, discrepancies, negative-stock blocks). Never decorative across any role.
Phase chips on labour rows: small coloured dots based on phase's configured colour
Cost figures: tabular monospace figures throughout
Status pills: consistent across roles (Draft/Pending/Approved/Rejected/Sent/Awarded/Closed/etc.) with semantic colours but muted (no neon)


That's the consolidated role and workflow addendum. Combined with the previous addenda — main prompt + cutting algorithms + rule ownership + Model workbench + sub-assemblies + manhours — the design tool now has the full picture: data model, rule engine, role experiences, workflows, and aesthetic direction.
If you want, the next natural step is a final consolidation pass: a single clean prompt that merges everything into one coherent document with no "this supersedes that" cross-references, ready to hand to a designer or Claude Code. That's a few thousand words of careful merging — say the word when you want it.
</pasted_text>

## Assistant

Reading the consolidated spec — biggest new shapes that aren't yet mocked:

- **Quote layer** — Quote list, Quote detail (Build / Price / Document tabs), Internal Review flow
- **Working Set** view on the Project page (post-award snapshot, with Quotes list as a sibling tab)
- **Purchase Orders** — PO list, PO detail with lifecycle, "Generate PO from supplier group" off Aggregation
- **Estimator dashboard** (cost-focused attention cards: needs-pricing / internal review / nearing expiry / awarded this period)
- Smaller composition pages: **Catalog hub** index, **Stock Overview** index, **Settings hub** index, **Users** page + Add-user modal

The Quote/Working-Set/PO triplet is the highest-leverage thing to design next — it introduces a new entity and changes how System Instances are reached. I'd build them in this order:

1. **Estimator dashboard** (anchors the role)
2. **Quote detail** (the Build/Price/Document workbench — the Estimator's primary tool)
3. **Project page · Working Set + Quotes tabs** (shows how the award snapshot lands on the Project)
4. **PO detail** (procurement output of the aggregation flow)
5. **Stock Overview** + **Catalog hub** + **Settings hub** (composition pages)

Want me to push through 1–4 as one batch and leave the index/composition pages for a final pass, or pick a different starting point? If you want the **consolidation prompt** instead (single clean spec for handoff), say the word and I'll write that.

## User

do all

## Assistant

_[tool: write_file]_

_[tool: write_file]_

Building all seven. Starting with the Estimator dashboard and Quote detail (the two biggest new shapes):

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: write_file]_

Now wire all 7 new artboards into the canvas in a new **Quotes, Procurement & Hubs** section:

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Done — 7 new artboards in a **Quotes, Procurement & Hubs** section:

**19 · Estimator dashboard** — cost-focused KPI strip (win rate / awarded MTD / pipeline / margin / POs awaiting / SLA breach) + 6-card attention grid: Needs pricing (with **Price** CTA), Internal review (with margin floor warnings), Sent · nearing expiry (today/3d/8d shown in escalating tones), Recently awarded (success green deltas), POs in flight, Recent activity.

**20 · Quote detail · Price tab** — Build/Price/Document tabs; cost lines grouped by System Instance, materials + labour interleaved with phase chips and slate ink for labour; right pane shows the pricing stack (Materials + Labour → Subtotal → +Margin% → +Contingency% → +Tax% → Quote Total) with editable inputs and an at-floor margin warning.

**21 · Project · Working Set + Quotes** — Award snapshot strip (awarded quote ref, award date, PM/foreman, current Working Set cost with `+1 variation`); System Instance cards (one wearing the hi-vis variation rail with explanatory strip), and a Quotes sub-table showing awarded vs not-selected variants.

**22 · PO detail** — 6-column meta + lifecycle rail (Draft → Pending → Sent → **Partially Received** → Fully Received → Closed) + line items table with received-progress per row and one variance row flagged; right rail breaks down provenance per project + audit log.

**23 · Stock Overview** — KPI strip, Stock-by-location table with role pills and percent-share bars, plus Critically low and Recent movements cards on the right.

**24 · Catalog hub** — Recently edited row of 4, then 8 entity cards in a 4-col grid (Systems / Models / Sub-assemblies / Materials / Categories / Suppliers / Substrates / Phases) each with count + last-edited + "New" affordance.

**25 · Settings hub** — Tenant profile strip, grouped section cards (Operations / Catalog / Costing / Documents / Account) with the Labour phases card highlighted active and Billing flagged Tenant-Owner-only in hi-vis.

The full canvas now covers all seven roles end-to-end: Tenant Owner (≈ Admin + billing), Tenant Admin, Project Manager, Estimator, Storeman, Site Foreman, Viewer-shaped read-only — across 25 artboards.

If you want the **consolidation prompt** next (single clean spec, no "supersedes" cross-refs, ready for handoff), say the word. Or pick a remaining shape: Users page + Add-user modal, Sub-assembly edit page (parallel to Model workbench), or a Project Overview tab variant.

## User

Verifier agent check completed

## Assistant

_[tool: snip]_

All 25 artboards pass verification — canvas covers the full seven-role spec.

## User

Task
  - id, project_id, parent_task_id (nullable — null = umbrella System Instance task)
  - system_instance_id (nullable — set only on umbrella tasks)
  - name
  - phase (nullable — references a labour phase: Fabrication / Installation / Commissioning / etc.)
  - start_date, end_date, duration_days (computed; respects working calendar when toggle is on)
  - is_milestone (boolean — renders as diamond on Gantt, zero-width)
  - is_on_hold (boolean — PM-toggle overlay flag)
  - status (computed: Not Started / Ready / Blocked / In Progress / Done — Done is manually set)
  - progress_percent (0-100 — updated by foreman photos with progress, or manually)
  - assignee_user_id (nullable — single user, must hold Storeman or Site Foreman role)
  - attached_mto_lines[] (FK to MTO line items — auto-attached for Installation tasks)
  - reference_photo_ids[] (FK to Photo — PM-uploaded instruction images)
  - dependencies[]: { predecessor_task_id, lag_days } — finish-to-start with lag/lead
  - notes (free text)
  - version (audit)

Photo
  - id, project_id
  - task_id (nullable — null = daily / project-level)
  - storage_path (Supabase Storage)
  - caption (free text, optional)
  - exif_metadata (JSONB — timestamp, geotag, device model, stored as-is, no active validation)
  - uploaded_by (user_id)
  - uploaded_at (timestamp)
  - progress_percent_at_capture (nullable — only set when foreman bumps progress alongside the photo)
  - photo_type ('progress' or 'reference' — set by uploader role and entry point)
  - deleted_at (soft delete)

ScheduleTemplate
  - id, system_id (FK — one default template per System)
  - name
  - template_tasks[]:
      - name, phase, default_assignee_role ('storeman' | 'site_foreman' | null),
        is_milestone, dependency_on (other template task index), lag_days

## Assistant

_[tool: write_file]_

_[tool: write_file]_

Building the four highest-impact additions from the scheduling spec — Gantt is the centerpiece.

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Done — 4 new artboards in a **Schedule & Photos** section:

**26 · Project · Schedule tab** (1680×1040) — full Gantt:
- Weekly + daily column headers, weekends shaded, today vertical line
- Umbrella System-Instance rows with sub-tasks indented; phase chips per sub-row
- Status bars in muted palette (Ready / In Progress / Blocked / On Hold / Done); hi-vis amber only flags `SHORT` on the blocked Guardrail row
- Diamond milestone marker (mid-span anchor inspection); progress overlay on each bar; photo count badges 📷
- Right slide-in **progress side panel**: task header with `On Hold` toggle, "Progress over time" SVG area chart with markers per photo capture + today/due reference lines, and chronological progress-photo strip (newest first, progress % chip + caption + uploader)

**27 · Cross-project Schedule** (1680×900) — full timeline:
- Project group headers (5 projects), sub-rows for individual tasks, today line + weekend shading consistent with project Gantt
- Status-coded bars with progress % + photo badges; legend at top

**28 · Project · Photos tab** — unified archive:
- Seg filter `All / Progress / Daily / Reference`, task / uploader / range chips
- 4-column grid of photo cards: type pill top-left, progress badge top-right, caption + task chip + timestamp + uploader

**29 · Foreman · Task detail (mobile)**:
- Task meta grid (project / phase chip / due / progress)
- Two-up CTAs: "View instructions" (3 reference photos) + primary **Add Photo** (camera/library)
- Attached materials with `short` hi-vis pills for under-delivered lines
- 3×2 grid of my progress photos with % badges + dates
- Sticky bottom: Quick update + green Mark task done

The schedule layer reads cleanly end-to-end now: PM views the Gantt + reviews photos, foreman drops a photo and bumps progress, Activity feed picks it up, MTO stock variance drives Blocked status, and the cross-project view rolls everything up for ops planning.

Remaining gaps from the spec (smaller, can wait): Kanban + List view variants of the schedule tab, Schedule Template authoring inside the System edit page, Users + Add-user modal, Calendar settings section, and the **consolidation prompt**. Say which.

## User

Verifier agent check completed

## Assistant

_[tool: snip]_

Clean across all 29 artboards.

## User

change name to akro-app

## Assistant

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: copy_files]_

_[tool: unregister_assets]_

_[tool: done]_

Renamed everywhere — sidebar wordmark, page title, canvas section title, mobile foreman build tag, and the file itself is now `akro-app Designs.html`. The amber chamfered mark stays as the brand icon.

## User

1) add the add the kanban view on the mockup

## Assistant

_[tool: snip]_

_[tool: write_file]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Kanban added as artboard **26b** in the Schedule & Photos section — sibling to the Gantt screen with the Seg toggled to `Kanban`.

Six columns (Not Started · Ready · Blocked · In Progress · On Hold · Done) each with a tone dot, count chip, and dashed drop-zone. Cards carry:
- Phase chip (top-left) + milestone / "other project" pills + dots menu
- Title + parent System Instance line
- Progress bar where applicable (in-progress / blocked / on-hold show it; not-started + done hide it)
- Block reason in danger red on the Guardrail row, on-hold reason in hi-vis on the Anchor Point row
- Footer with due date, photo badge, assignee bubble, and a small green "Done" button on in-progress cards (the only manual flip the spec allows non-PMs)

The left border of each card picks up the column tone so cards stay distinguishable even after the eye scrolls across columns. Drag between columns is intentionally absent — status is auto-derived; Done flips via the card button, On Hold via the menu (per spec).

## User

Verifier agent check completed

## Assistant

