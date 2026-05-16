/**
 * 2D rectangular bin packing for plate / sheet materials.
 *
 * MVP implementation uses a simple guillotine cut + shelf approach.
 * Not optimal, but deterministic and dependency-free. Swap in
 * `maxrects-packer` later if utilization needs to improve.
 */

export type PlatePiece = {
  width: number;
  height: number;
  qty: number;
  rotatable?: boolean;
};

export type PlateSheet = { width: number; height: number };

export type PlatePlan = {
  sheet_qty: number;
  placement_map: Array<{
    sheet_index: number;
    pieces: Array<{ x: number; y: number; w: number; h: number; rotated: boolean }>;
  }>;
  total_waste_area: number;
  utilization_pct: number;
};

type Placement = { x: number; y: number; w: number; h: number; rotated: boolean };

type Shelf = { y: number; height: number; cursor: number };

function tryPlaceOnSheet(
  shelves: Shelf[],
  pieces: { width: number; height: number; rotatable: boolean }[],
  sheet: PlateSheet,
  kerf: number,
): Placement[] {
  const placements: Placement[] = [];

  for (const p of pieces) {
    let placed = false;
    const candidates: { w: number; h: number; rotated: boolean }[] = [];
    candidates.push({ w: p.width, h: p.height, rotated: false });
    if (p.rotatable && p.width !== p.height) {
      candidates.push({ w: p.height, h: p.width, rotated: true });
    }
    // pick the orientation with the smallest "shelf height"
    candidates.sort((a, b) => a.h - b.h);

    for (const orient of candidates) {
      for (const shelf of shelves) {
        if (orient.h <= shelf.height && shelf.cursor + orient.w + kerf <= sheet.width) {
          placements.push({
            x: shelf.cursor,
            y: shelf.y,
            w: orient.w,
            h: orient.h,
            rotated: orient.rotated,
          });
          shelf.cursor += orient.w + kerf;
          placed = true;
          break;
        }
      }
      if (placed) break;
      // open a new shelf
      const lastShelf = shelves[shelves.length - 1];
      const nextY = lastShelf ? lastShelf.y + lastShelf.height + kerf : 0;
      if (nextY + orient.h <= sheet.height) {
        shelves.push({ y: nextY, height: orient.h, cursor: orient.w + kerf });
        placements.push({
          x: 0,
          y: nextY,
          w: orient.w,
          h: orient.h,
          rotated: orient.rotated,
        });
        placed = true;
        break;
      }
    }
    if (!placed) {
      // pieces array passed in must fit; caller controls; signal failure
      throw new Error("PIECE_DOES_NOT_FIT");
    }
  }

  return placements;
}

export function plateCut(
  required_pieces: PlatePiece[],
  stock_sheet: PlateSheet,
  kerf: number = 3,
  grain_constraint: "with_grain" | "across_grain" | null = null,
  edge_trim: number = 0,
): PlatePlan {
  const usable: PlateSheet = {
    width: stock_sheet.width - 2 * edge_trim,
    height: stock_sheet.height - 2 * edge_trim,
  };

  // expand qty
  const flat: { width: number; height: number; rotatable: boolean }[] = [];
  for (const p of required_pieces) {
    const rotatable = (p.rotatable ?? true) && grain_constraint == null;
    for (let i = 0; i < p.qty; i++) {
      flat.push({ width: p.width, height: p.height, rotatable });
    }
  }
  // sort largest first by area
  flat.sort((a, b) => b.width * b.height - a.width * a.height);

  const sheets: Placement[][] = [];

  while (flat.length > 0) {
    const shelves: Shelf[] = [];
    const placedOnThis: Placement[] = [];
    let i = 0;
    while (i < flat.length) {
      const piece = flat[i];
      try {
        const placed = tryPlaceOnSheet(shelves, [piece], usable, kerf);
        placedOnThis.push(...placed);
        flat.splice(i, 1);
      } catch {
        // doesn't fit on this sheet anymore, leave for next
        i++;
      }
    }
    if (placedOnThis.length === 0) {
      throw new Error("plateCut: piece does not fit on stock sheet at all");
    }
    sheets.push(placedOnThis);
  }

  const total_piece_area = required_pieces.reduce(
    (s, p) => s + p.width * p.height * p.qty,
    0,
  );
  const total_sheet_area = sheets.length * stock_sheet.width * stock_sheet.height;
  const total_waste_area = total_sheet_area - total_piece_area;
  const utilization_pct = total_sheet_area === 0 ? 0 : (total_piece_area / total_sheet_area) * 100;

  return {
    sheet_qty: sheets.length,
    placement_map: sheets.map((pieces, sheet_index) => ({ sheet_index, pieces })),
    total_waste_area,
    utilization_pct,
  };
}
