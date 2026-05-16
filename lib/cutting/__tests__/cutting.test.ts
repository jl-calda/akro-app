import { describe, it, expect } from "vitest";
import { linearCut } from "../linear";
import { plateCut } from "../plate";

describe("linearCut (First Fit Decreasing)", () => {
  it("handles empty input", () => {
    const r = linearCut([], [6000]);
    expect(r.total_purchase_length).toBe(0);
    expect(r.cut_plan).toEqual([]);
  });

  it("packs cuts into stock pieces with kerf", () => {
    const r = linearCut([2400, 2400, 1200], [6000], 3);
    // Two 2400s + one 1200 with two 3mm kerfs = 6006 which exceeds 6000 → need 2 sheets
    expect(r.cut_plan.length).toBe(2);
    expect(r.stock_qty_by_length[6000]).toBe(2);
  });

  it("uses smallest fitting stock for solo cut", () => {
    const r = linearCut([500], [6000, 3000, 1000], 3);
    expect(r.cut_plan).toHaveLength(1);
    expect(r.cut_plan[0].stock_length).toBe(1000);
  });

  it("identifies reusable offcuts above the threshold", () => {
    const r = linearCut([2000, 1000], [6000], 3, 2000);
    // used: 2000 + 3 + 1000 = 3003; offcut = 2997 → reusable
    expect(r.reusable_offcuts).toContain(2997);
    expect(r.total_waste).toBe(0);
  });

  it("throws if no stock fits a cut", () => {
    expect(() => linearCut([7000], [6000])).toThrow();
  });
});

describe("plateCut (2D shelf packing)", () => {
  it("packs simple pieces onto a single sheet", () => {
    const r = plateCut(
      [{ width: 600, height: 400, qty: 2 }],
      { width: 2400, height: 1200 },
      3,
    );
    expect(r.sheet_qty).toBe(1);
    expect(r.placement_map[0].pieces).toHaveLength(2);
  });

  it("spills to multiple sheets when needed", () => {
    const r = plateCut(
      [{ width: 1200, height: 1200, qty: 5 }],
      { width: 2400, height: 1200 },
      3,
    );
    expect(r.sheet_qty).toBeGreaterThanOrEqual(3);
  });

  it("computes utilization", () => {
    const r = plateCut(
      [{ width: 1200, height: 600, qty: 1 }],
      { width: 2400, height: 1200 },
      0,
    );
    // 720000 / 2880000 = 25%
    expect(r.utilization_pct).toBeCloseTo(25, 0);
  });
});
