/**
 * First Fit Decreasing (1D bin packing) for linear materials such as cable,
 * tubing, rail. Stock pieces have known fixed lengths; cuts must be placed
 * with a kerf between adjacent cuts on the same stock piece.
 *
 * Pure: no external deps.
 */

export type LinearCutPlan = {
  stock_qty_by_length: Record<number, number>;
  total_purchase_length: number;
  total_waste: number;
  cut_plan: Array<{
    stock_index: number;
    stock_length: number;
    cuts: number[];
    offcut: number;
  }>;
  reusable_offcuts: number[];
};

export function linearCut(
  required_cuts: number[],
  stock_lengths: number[],
  kerf: number = 3,
  min_offcut_reusable?: number,
): LinearCutPlan {
  if (required_cuts.length === 0) {
    return {
      stock_qty_by_length: {},
      total_purchase_length: 0,
      total_waste: 0,
      cut_plan: [],
      reusable_offcuts: [],
    };
  }

  if (stock_lengths.length === 0) {
    throw new Error("linearCut: at least one stock length required");
  }

  // sort cuts descending (largest first)
  const cuts = [...required_cuts].sort((a, b) => b - a);
  const stocks = [...stock_lengths].sort((a, b) => b - a);

  type Bin = { stock_length: number; used: number; cuts: number[] };
  const bins: Bin[] = [];

  for (const cut of cuts) {
    // try existing bins (first fit)
    let placed = false;
    for (const bin of bins) {
      const need = bin.cuts.length === 0 ? cut : cut + kerf;
      if (bin.used + need <= bin.stock_length) {
        bin.used += need;
        bin.cuts.push(cut);
        placed = true;
        break;
      }
    }
    if (!placed) {
      // open a new bin: pick the smallest stock length that fits
      const fittingStocks = stocks.filter((s) => s >= cut).sort((a, b) => a - b);
      if (fittingStocks.length === 0) {
        throw new Error(`linearCut: no stock length fits cut ${cut} (largest stock ${stocks[0]})`);
      }
      const stock_length = fittingStocks[0];
      bins.push({ stock_length, used: cut, cuts: [cut] });
    }
  }

  const stock_qty_by_length: Record<number, number> = {};
  const cut_plan: LinearCutPlan["cut_plan"] = [];
  const reusable_offcuts: number[] = [];
  let total_waste = 0;
  let total_purchase_length = 0;

  bins.forEach((bin, idx) => {
    const offcut = bin.stock_length - bin.used;
    stock_qty_by_length[bin.stock_length] = (stock_qty_by_length[bin.stock_length] ?? 0) + 1;
    total_purchase_length += bin.stock_length;
    cut_plan.push({
      stock_index: idx,
      stock_length: bin.stock_length,
      cuts: bin.cuts,
      offcut,
    });
    if (min_offcut_reusable != null && offcut >= min_offcut_reusable) {
      reusable_offcuts.push(offcut);
    } else {
      total_waste += offcut;
    }
  });

  return {
    stock_qty_by_length,
    total_purchase_length,
    total_waste,
    cut_plan,
    reusable_offcuts,
  };
}
