import { describe, it, expect } from "vitest";
import {
  deriveDimensions,
  deriveLinear,
  deriveSegmented,
  patternToSchema,
  type LinearPattern,
  type SegmentedPattern,
} from "../dim-derive";

describe("deriveLinear", () => {
  it("computes intermediate count with default spacing", () => {
    const pattern: LinearPattern = {
      primitive: "linear",
      modifiers: { spacing: { source: "user_input", default: 2 } },
    };
    const r = deriveLinear(pattern, { length: 20 });
    expect(r.spacing).toBe(2);
    expect(r.intermediate_count).toBe(10);
    expect(r.total_node_count).toBe(12);
    expect(r.usable_length).toBe(20);
  });

  it("subtracts start + end offsets from usable length", () => {
    const pattern: LinearPattern = {
      primitive: "linear",
      modifiers: {
        spacing: { source: "hardcoded", value: 2 },
        start_offset: { source: "hardcoded", value: 1 },
        end_offset: { source: "hardcoded", value: 1 },
      },
    };
    const r = deriveLinear(pattern, { length: 20 });
    expect(r.usable_length).toBe(18);
    expect(r.intermediate_count).toBe(9);
    expect(r.total_node_count).toBe(11);
  });

  it("returns zero intermediate count when spacing is zero", () => {
    const r = deriveLinear(
      { primitive: "linear", modifiers: { spacing: { source: "user_input", default: 0 } } },
      { length: 50 },
    );
    expect(r.intermediate_count).toBe(0);
    expect(r.total_node_count).toBe(2);
  });

  it("clamps usable_length at zero when offsets exceed length", () => {
    const r = deriveLinear(
      {
        primitive: "linear",
        modifiers: {
          spacing: { source: "hardcoded", value: 2 },
          start_offset: { source: "hardcoded", value: 50 },
        },
      },
      { length: 20 },
    );
    expect(r.usable_length).toBe(0);
    expect(r.intermediate_count).toBe(0);
  });

  it("user input overrides hardcoded for user_input source", () => {
    const r = deriveLinear(
      { primitive: "linear", modifiers: { spacing: { source: "user_input", default: 2 } } },
      { length: 30, spacing: 5 },
    );
    expect(r.spacing).toBe(5);
    expect(r.intermediate_count).toBe(6);
  });
});

describe("deriveSegmented", () => {
  const pattern: SegmentedPattern = {
    primitive: "segmented",
    modifiers: {
      spacing: { source: "user_input", default: 2.4 },
      corner_offset: { source: "hardcoded", value: 0.5 },
      brackets_per_corner: { source: "hardcoded", value: 2 },
    },
  };

  it("sums segment lengths into total_length", () => {
    const r = deriveSegmented(pattern, {
      segments: [{ len: 60 }, { len: 72 }, { len: 54 }],
    });
    expect(r.total_length).toBe(186);
    expect(r.length).toBe(186);
  });

  it("counts corners (segments with a non-null angle)", () => {
    const r = deriveSegmented(pattern, {
      segments: [
        { len: 60, corner_angle: 95 },
        { len: 72, corner_angle: 174 },
        { len: 54, corner_angle: null },
      ],
    });
    expect(r.corner_count).toBe(2);
    expect(r.corner_bracket_count).toBe(4); // 2 corners * 2 brackets
  });

  it("computes per-leg intermediate counts with corner offsets", () => {
    const r = deriveSegmented(pattern, {
      segments: [
        { len: 60, corner_angle: 90 },
        { len: 72, corner_angle: 90 },
        { len: 54 },
      ],
      spacing: 2.4,
    });
    // Leg 0: 60 - start_offset(0) - corner_offset(0.5) = 59.5 → floor(59.5/2.4) = 24
    // Leg 1: 72 - 0.5 - 0.5 = 71.0 → floor(71/2.4) = 29
    // Leg 2: 54 - 0.5 - end_offset(0) = 53.5 → floor(53.5/2.4) = 22
    const perLeg = r.intermediate_count_per_leg as number[];
    expect(perLeg).toEqual([24, 29, 22]);
    expect(r.intermediate_count_total).toBe(75);
    expect(r.intermediate_count).toBe(75); // flat alias
    // total_node_count = 75 + 4 + 2 = 81
    expect(r.total_node_count).toBe(81);
  });

  it("returns zero corner counts when no corners present", () => {
    const r = deriveSegmented(pattern, {
      segments: [{ len: 50 }],
    });
    expect(r.corner_count).toBe(0);
    expect(r.corner_bracket_count).toBe(0);
  });

  it("clamps per-leg usable_len at zero when offsets exceed the leg", () => {
    const r = deriveSegmented(pattern, {
      segments: [{ len: 0.2, corner_angle: 90 }, { len: 30 }],
    });
    const perLeg = r.intermediate_count_per_leg as number[];
    expect(perLeg[0]).toBe(0); // leg too short for any intermediate
    expect(perLeg[1]).toBeGreaterThan(0);
  });

  it("handles empty segments array", () => {
    const r = deriveSegmented(pattern, { segments: [] });
    expect(r.total_length).toBe(0);
    expect(r.corner_count).toBe(0);
    expect(r.intermediate_count_total).toBe(0);
    expect(r.total_node_count).toBe(2);
  });
});

describe("deriveDimensions dispatch", () => {
  it("routes by primitive", () => {
    const lin = deriveDimensions({ primitive: "linear" }, { length: 10 });
    expect(lin.length).toBe(10);
    const seg = deriveDimensions({ primitive: "segmented" }, { segments: [{ len: 5 }, { len: 7 }] });
    expect(seg.total_length).toBe(12);
  });
});

describe("patternToSchema", () => {
  it("emits a length row for linear", () => {
    const schema = patternToSchema({ primitive: "linear", modifiers: {} });
    expect(schema.find((r) => r.key === "length")).toBeDefined();
  });

  it("emits a segments row for segmented", () => {
    const schema = patternToSchema({ primitive: "segmented", modifiers: {} });
    expect(schema.find((r) => r.key === "segments")).toBeDefined();
  });

  it("only emits user_input modifiers (not hardcoded)", () => {
    const schema = patternToSchema({
      primitive: "linear",
      modifiers: {
        spacing: { source: "user_input", default: 2 },
        start_offset: { source: "hardcoded", value: 1 },
      },
    });
    expect(schema.find((r) => r.key === "spacing")).toBeDefined();
    expect(schema.find((r) => r.key === "start_offset")).toBeUndefined();
  });
});
