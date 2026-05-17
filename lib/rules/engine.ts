import type { Expr } from "./ast";
import { parse } from "./parser";
import { evaluate, type Scope } from "./evaluator";
import {
  deriveDimensions,
  type DimensionPattern,
  type LinearUserInputs,
  type SegmentedUserInputs,
} from "./dim-derive";

export type PartsListRow = {
  row_id: string;
  item_kind: "material" | "sub_assembly";
  item_id: string;
  item_version: number;
  count_or_qty_formula: string;
  criteria_gate?: string | null;
  wastage_pct?: number;
  notes?: string;
  parameter_bindings?: Array<{
    param_key: string;
    binding_kind: "variant" | "user_input" | "hardcoded" | "system_dimension" | "model_dimension";
    value?: unknown;
  }>;
  cut_plan_enabled?: boolean;
};

export type EngineInput = {
  system_dimensions: Record<string, unknown>;
  /**
   * Optional pattern recipe (Linear / Segmented). When present, the engine
   * runs deriveDimensions(pattern, system_dimensions) BEFORE evaluating any
   * parts-list rows, and merges the derived dims (intermediate_count,
   * corner_bracket_count, total_node_count, …) into scope so formulas can
   * reference them by name.
   */
  dimension_pattern?: DimensionPattern;
  model_custom_dimensions?: Record<string, unknown>;
  variants?: Record<string, unknown>;
  substrate?: string;
  user_inputs?: Record<string, unknown>;
  parts_list: PartsListRow[];
};

export type EvaluatedRow = {
  row_id: string;
  item_kind: "material" | "sub_assembly";
  item_id: string;
  item_version: number;
  qty: number | null;
  cut_plan: unknown | null;
  wastage_pct?: number;
  skipped: boolean;
  reason?: string;
  error?: string;
};

/**
 * Find all identifier references in an Expr that look like row aliases
 * (i.e. members of the form `someAlias.qty` or just `someAlias`).
 */
function collectRowRefs(expr: Expr, knownAliases: Set<string>, out: Set<string>) {
  if (expr.kind === "member") {
    // root identifier
    if (expr.object.kind === "identifier" && knownAliases.has(expr.object.name)) {
      out.add(expr.object.name);
    } else {
      collectRowRefs(expr.object, knownAliases, out);
    }
  } else if (expr.kind === "identifier") {
    if (knownAliases.has(expr.name)) out.add(expr.name);
  } else if (expr.kind === "binary") {
    collectRowRefs(expr.left, knownAliases, out);
    collectRowRefs(expr.right, knownAliases, out);
  } else if (expr.kind === "unary") {
    collectRowRefs(expr.arg, knownAliases, out);
  } else if (expr.kind === "call") {
    for (const a of expr.args) collectRowRefs(a, knownAliases, out);
  }
}

function topoSort(rows: PartsListRow[]): PartsListRow[] {
  const aliases = new Set(rows.map((r) => r.row_id));
  const deps = new Map<string, Set<string>>();
  for (const r of rows) {
    const set = new Set<string>();
    if (r.count_or_qty_formula) {
      try {
        const ast = parse(r.count_or_qty_formula);
        collectRowRefs(ast, aliases, set);
      } catch {
        // formula parse error — handled later in evaluate; treat as no deps
      }
    }
    if (r.criteria_gate) {
      try {
        const ast = parse(r.criteria_gate);
        collectRowRefs(ast, aliases, set);
      } catch {
        // ignore
      }
    }
    set.delete(r.row_id); // ignore self-references
    deps.set(r.row_id, set);
  }
  // Kahn's algorithm
  const indeg = new Map<string, number>();
  for (const r of rows) indeg.set(r.row_id, 0);
  for (const [, ds] of deps) for (const d of ds) indeg.set(d, (indeg.get(d) ?? 0) + 1);
  // Note: we want rows in order where dependencies are processed FIRST.
  // Recompute reverse: row's indegree = number of rows that depend on it... no,
  // that's wrong. Reset.
  const dependedOnBy = new Map<string, Set<string>>();
  for (const r of rows) dependedOnBy.set(r.row_id, new Set());
  for (const [row, ds] of deps) {
    for (const d of ds) dependedOnBy.get(d)!.add(row);
  }
  const indegree = new Map<string, number>();
  for (const r of rows) indegree.set(r.row_id, deps.get(r.row_id)?.size ?? 0);

  const ordered: PartsListRow[] = [];
  const queue: string[] = [];
  for (const r of rows) if ((indegree.get(r.row_id) ?? 0) === 0) queue.push(r.row_id);
  const byId = new Map(rows.map((r) => [r.row_id, r]));
  while (queue.length) {
    const id = queue.shift()!;
    ordered.push(byId.get(id)!);
    for (const dependent of dependedOnBy.get(id) ?? []) {
      indegree.set(dependent, (indegree.get(dependent) ?? 0) - 1);
      if ((indegree.get(dependent) ?? 0) === 0) queue.push(dependent);
    }
  }
  if (ordered.length !== rows.length) {
    throw new Error("Cycle detected in parts list formulas");
  }
  return ordered;
}

export function evaluateModelInstance(input: EngineInput): {
  rows: EvaluatedRow[];
  totals: { qty_by_alias: Record<string, number> };
  errors: string[];
} {
  const errors: string[] = [];
  const evaluated: EvaluatedRow[] = [];

  let ordered: PartsListRow[];
  try {
    ordered = topoSort(input.parts_list);
  } catch (err) {
    errors.push((err as Error).message);
    ordered = input.parts_list;
  }

  // Derive pattern-driven dimensions first so formulas can reference
  // intermediate_count, corner_bracket_count, total_node_count, etc.
  let derived: Record<string, unknown> = {};
  if (input.dimension_pattern) {
    try {
      const userInputs = input.system_dimensions as
        | LinearUserInputs
        | SegmentedUserInputs;
      derived = deriveDimensions(input.dimension_pattern, userInputs);
    } catch (err) {
      errors.push(`Pattern derivation error: ${(err as Error).message}`);
    }
  }

  // Build base scope: derived dims go in first, then system_dimensions can
  // override (so explicit user values trump derivations of the same key).
  const scope: Scope = {
    ...derived,
    ...input.system_dimensions,
    ...(input.model_custom_dimensions ?? {}),
    substrate: input.substrate,
    variant: input.variants ?? {},
    ...(input.user_inputs ?? {}),
  };

  // Row aliases will be added to scope as `<alias>` (number) and `<alias>.qty`.
  for (const row of ordered) {
    let skipped = false;
    let reason: string | undefined;
    if (row.criteria_gate) {
      try {
        const gate = evaluate(parse(row.criteria_gate), scope);
        if (!gate) {
          skipped = true;
          reason = "criteria_gate=false";
        }
      } catch (err) {
        errors.push(`Row ${row.row_id} gate error: ${(err as Error).message}`);
        skipped = true;
        reason = "gate evaluation error";
      }
    }

    if (skipped) {
      evaluated.push({
        row_id: row.row_id,
        item_kind: row.item_kind,
        item_id: row.item_id,
        item_version: row.item_version,
        qty: null,
        cut_plan: null,
        wastage_pct: row.wastage_pct,
        skipped: true,
        reason,
      });
      continue;
    }

    let qty: number | null = null;
    let cut_plan: unknown = null;
    try {
      const result = evaluate(parse(row.count_or_qty_formula), scope);
      if (row.cut_plan_enabled) {
        cut_plan = result;
        if (typeof result === "object" && result && "total_purchase_length" in (result as object)) {
          qty = (result as { total_purchase_length: number }).total_purchase_length;
        } else if (typeof result === "object" && result && "sheet_qty" in (result as object)) {
          qty = (result as { sheet_qty: number }).sheet_qty;
        } else {
          qty = Number(result);
        }
      } else {
        qty = Number(result);
      }
      scope[row.row_id] = { qty };
    } catch (err) {
      errors.push(`Row ${row.row_id} formula error: ${(err as Error).message}`);
    }

    evaluated.push({
      row_id: row.row_id,
      item_kind: row.item_kind,
      item_id: row.item_id,
      item_version: row.item_version,
      qty,
      cut_plan,
      wastage_pct: row.wastage_pct,
      skipped: false,
    });
  }

  const totals: { qty_by_alias: Record<string, number> } = { qty_by_alias: {} };
  for (const r of evaluated) {
    if (r.qty != null) totals.qty_by_alias[r.row_id] = r.qty;
  }
  return { rows: evaluated, totals, errors };
}
