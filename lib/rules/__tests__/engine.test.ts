// Vitest unit tests for the rule engine.
// Run with: npx vitest

import { describe, it, expect } from "vitest";
import { evaluateExpression } from "../evaluator";
import { evaluateModelInstance } from "../engine";

describe("rule engine — expression evaluator", () => {
  it("evaluates arithmetic", () => {
    expect(evaluateExpression("1 + 2 * 3", {})).toBe(7);
    expect(evaluateExpression("(1 + 2) * 3", {})).toBe(9);
    expect(evaluateExpression("10 / 4", {})).toBe(2.5);
    expect(evaluateExpression("10 % 3", {})).toBe(1);
    expect(evaluateExpression("2 ** 5", {})).toBe(32);
  });

  it("evaluates comparisons and boolean ops", () => {
    expect(evaluateExpression("1 < 2", {})).toBe(true);
    expect(evaluateExpression("1 == 2", {})).toBe(false);
    expect(evaluateExpression("true && false", {})).toBe(false);
    expect(evaluateExpression("true || false", {})).toBe(true);
    expect(evaluateExpression("not false", {})).toBe(true);
  });

  it("evaluates built-ins", () => {
    expect(evaluateExpression("ceil(7 / 2)", {})).toBe(4);
    expect(evaluateExpression("floor(7 / 2)", {})).toBe(3);
    expect(evaluateExpression("min(3, 1, 2)", {})).toBe(1);
    expect(evaluateExpression("max(3, 1, 2)", {})).toBe(3);
    expect(evaluateExpression("abs(-5)", {})).toBe(5);
    expect(evaluateExpression("if(true, 'a', 'b')", {})).toBe("a");
    expect(evaluateExpression("if(1 < 0, 1, 99)", {})).toBe(99);
  });

  it("evaluates scoped identifiers", () => {
    expect(evaluateExpression("length / 2.4", { length: 24 })).toBe(10);
    expect(evaluateExpression("ceil(length / 2.4) + 1", { length: 12 })).toBe(6);
  });

  it("evaluates member access", () => {
    expect(evaluateExpression("variant.cable_diameter", { variant: { cable_diameter: 8 } })).toBe(8);
  });

  it("throws on unknown identifier", () => {
    expect(() => evaluateExpression("zz + 1", {})).toThrow(/Unknown identifier/);
  });
});

describe("rule engine — model instance evaluation", () => {
  it("evaluates a simple parts list", () => {
    const out = evaluateModelInstance({
      system_dimensions: { length: 24 },
      parts_list: [
        {
          row_id: "stanchion",
          item_kind: "material",
          item_id: "mat-stn",
          item_version: 1,
          count_or_qty_formula: "ceil(length / 2.4) + 1",
        },
        {
          row_id: "cable",
          item_kind: "material",
          item_id: "mat-cbl",
          item_version: 1,
          count_or_qty_formula: "length",
        },
      ],
    });

    expect(out.rows[0].qty).toBe(11);
    expect(out.rows[1].qty).toBe(24);
    expect(out.errors).toEqual([]);
  });

  it("respects criteria gate", () => {
    const out = evaluateModelInstance({
      system_dimensions: { length: 24 },
      substrate: "metal_deck",
      parts_list: [
        {
          row_id: "deck_fastener",
          item_kind: "material",
          item_id: "mat-1",
          item_version: 1,
          criteria_gate: "substrate == 'metal_deck'",
          count_or_qty_formula: "length",
        },
        {
          row_id: "concrete_anchor",
          item_kind: "material",
          item_id: "mat-2",
          item_version: 1,
          criteria_gate: "substrate == 'concrete'",
          count_or_qty_formula: "length",
        },
      ],
    });

    expect(out.rows[0].skipped).toBe(false);
    expect(out.rows[1].skipped).toBe(true);
  });

  it("topo-sorts dependent rows", () => {
    const out = evaluateModelInstance({
      system_dimensions: { length: 12 },
      parts_list: [
        {
          row_id: "bolt",
          item_kind: "material",
          item_id: "mat-b",
          item_version: 1,
          count_or_qty_formula: "stanchion.qty * 4",
        },
        {
          row_id: "stanchion",
          item_kind: "material",
          item_id: "mat-s",
          item_version: 1,
          count_or_qty_formula: "ceil(length / 2.4)",
        },
      ],
    });
    const stanch = out.rows.find((r) => r.row_id === "stanchion");
    const bolt = out.rows.find((r) => r.row_id === "bolt");
    expect(stanch?.qty).toBe(5);
    expect(bolt?.qty).toBe(20);
  });

  it("detects cycles", () => {
    const out = evaluateModelInstance({
      system_dimensions: {},
      parts_list: [
        {
          row_id: "a",
          item_kind: "material",
          item_id: "1",
          item_version: 1,
          count_or_qty_formula: "b.qty + 1",
        },
        {
          row_id: "b",
          item_kind: "material",
          item_id: "2",
          item_version: 1,
          count_or_qty_formula: "a.qty + 1",
        },
      ],
    });
    expect(out.errors.some((e) => /Cycle/.test(e))).toBe(true);
  });

  it("merges pattern-derived dims into scope so formulas can reference them", () => {
    const out = evaluateModelInstance({
      system_dimensions: { length: 20 },
      dimension_pattern: {
        primitive: "linear",
        modifiers: { spacing: { source: "user_input", default: 2 } },
      },
      parts_list: [
        {
          row_id: "stanchion",
          item_kind: "material",
          item_id: "m1",
          item_version: 1,
          // Uses derived dim directly — no need to write ceil(length/spacing)
          count_or_qty_formula: "total_node_count",
        },
        {
          row_id: "bolt",
          item_kind: "material",
          item_id: "m2",
          item_version: 1,
          count_or_qty_formula: "stanchion.qty * 4",
        },
      ],
    });
    const stanch = out.rows.find((r) => r.row_id === "stanchion");
    const bolt = out.rows.find((r) => r.row_id === "bolt");
    // length=20, spacing=2 → intermediate_count=10 → total_node_count=12
    expect(stanch?.qty).toBe(12);
    expect(bolt?.qty).toBe(48);
  });

  it("derives segmented dims for cable-lifeline-style parts list", () => {
    const out = evaluateModelInstance({
      system_dimensions: {
        segments: [
          { len: 60, corner_angle: 90 },
          { len: 72, corner_angle: 90 },
          { len: 54 },
        ],
        spacing: 2.4,
      },
      dimension_pattern: {
        primitive: "segmented",
        modifiers: {
          spacing: { source: "user_input", default: 2.4 },
          corner_offset: { source: "hardcoded", value: 0.5 },
          brackets_per_corner: { source: "hardcoded", value: 2 },
        },
      },
      parts_list: [
        {
          row_id: "cable",
          item_kind: "material",
          item_id: "m1",
          item_version: 1,
          count_or_qty_formula: "total_length",
        },
        {
          row_id: "corner_brackets",
          item_kind: "material",
          item_id: "m2",
          item_version: 1,
          count_or_qty_formula: "corner_bracket_count",
        },
      ],
    });
    const cable = out.rows.find((r) => r.row_id === "cable");
    const corners = out.rows.find((r) => r.row_id === "corner_brackets");
    expect(cable?.qty).toBe(186); // 60+72+54
    expect(corners?.qty).toBe(4); // 2 corners × 2 brackets
  });
});
