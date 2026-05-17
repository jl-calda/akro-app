/**
 * Pure derivation of dimensions from a primitive Pattern + user inputs.
 * No side effects; safe to run client-side for live previews and server-side
 * during MTO compute.
 */

export type ModifierSource =
  | { source: "user_input"; default?: number }
  | { source: "hardcoded"; value: number };

export type LinearPattern = {
  primitive: "linear";
  modifiers?: {
    spacing?: ModifierSource;
    start_offset?: ModifierSource;
    end_offset?: ModifierSource;
  };
};

export type SegmentedPattern = {
  primitive: "segmented";
  modifiers?: {
    spacing?: ModifierSource;
    start_offset?: ModifierSource;
    end_offset?: ModifierSource;
    corner_offset?: ModifierSource;
    brackets_per_corner?: { source: "hardcoded"; value: 1 | 2 | 3 };
    max_segments?: { source: "hardcoded"; value: number };
  };
};

export type DimensionPattern = LinearPattern | SegmentedPattern;

export type Segment = { len: number; corner_angle?: number | null };

export type LinearUserInputs = {
  length?: number;
  spacing?: number;
  start_offset?: number;
  end_offset?: number;
};

export type SegmentedUserInputs = {
  segments?: Segment[];
  spacing?: number;
  start_offset?: number;
  end_offset?: number;
  corner_offset?: number;
};

export type DerivedScope = Record<string, number | unknown>;

/** Resolve a modifier value: prefer user-supplied input, else hardcoded value, else user_input default, else fallback. */
function resolve(
  mod: ModifierSource | undefined,
  userValue: number | undefined,
  fallback: number,
): number {
  if (mod && mod.source === "hardcoded") return mod.value;
  if (userValue != null && !Number.isNaN(userValue)) return userValue;
  if (mod && mod.source === "user_input" && mod.default != null) return mod.default;
  return fallback;
}

export function deriveLinear(
  pattern: LinearPattern,
  inputs: LinearUserInputs,
): DerivedScope {
  const length = Number(inputs.length ?? 0);
  const spacing = resolve(pattern.modifiers?.spacing, inputs.spacing, 0);
  const start_offset = resolve(pattern.modifiers?.start_offset, inputs.start_offset, 0);
  const end_offset = resolve(pattern.modifiers?.end_offset, inputs.end_offset, 0);

  const usable_length = Math.max(0, length - start_offset - end_offset);
  const intermediate_count =
    spacing > 0 ? Math.floor(usable_length / spacing) : 0;
  const total_node_count = intermediate_count + 2;

  return {
    length,
    spacing,
    start_offset,
    end_offset,
    usable_length,
    intermediate_count,
    total_node_count,
  };
}

export function deriveSegmented(
  pattern: SegmentedPattern,
  inputs: SegmentedUserInputs,
): DerivedScope {
  const segments = (inputs.segments ?? []).map((s) => ({
    len: Number(s.len ?? 0),
    corner_angle: s.corner_angle ?? null,
  }));
  const spacing = resolve(pattern.modifiers?.spacing, inputs.spacing, 0);
  const start_offset = resolve(pattern.modifiers?.start_offset, inputs.start_offset, 0);
  const end_offset = resolve(pattern.modifiers?.end_offset, inputs.end_offset, 0);
  const corner_offset = resolve(pattern.modifiers?.corner_offset, inputs.corner_offset, 0);
  const brackets_per_corner = pattern.modifiers?.brackets_per_corner?.value ?? 2;

  const total_length = segments.reduce((s, x) => s + x.len, 0);
  const corner_count = segments.filter((s) => s.corner_angle != null).length;
  const corner_bracket_count = corner_count * brackets_per_corner;

  const intermediate_count_per_leg = segments.map((seg, i) => {
    // Subtract: leg-start corner offset (or start_offset for the first leg) +
    //           leg-end corner offset (or end_offset for the last leg)
    const isFirst = i === 0;
    const isLast = i === segments.length - 1;
    const head = isFirst ? start_offset : corner_offset;
    const tail = isLast ? end_offset : corner_offset;
    const usable = Math.max(0, seg.len - head - tail);
    return spacing > 0 ? Math.floor(usable / spacing) : 0;
  });

  const intermediate_count_total = intermediate_count_per_leg.reduce((s, n) => s + n, 0);
  const total_node_count = intermediate_count_total + corner_bracket_count + 2;

  return {
    length: total_length, // alias for compatibility with linear-style formulas
    segments,
    total_length,
    corner_count,
    corner_bracket_count,
    brackets_per_corner,
    spacing,
    start_offset,
    end_offset,
    corner_offset,
    intermediate_count_per_leg,
    intermediate_count_total,
    intermediate_count: intermediate_count_total, // flat-name alias
    total_node_count,
  };
}

export function deriveDimensions(
  pattern: DimensionPattern,
  inputs: LinearUserInputs | SegmentedUserInputs,
): DerivedScope {
  if (pattern.primitive === "linear") {
    return deriveLinear(pattern, inputs as LinearUserInputs);
  }
  if (pattern.primitive === "segmented") {
    return deriveSegmented(pattern, inputs as SegmentedUserInputs);
  }
  return {};
}

/**
 * Generate a flat dimension_schema (the old shape) from a pattern.
 * Used to keep the back-compat column in sync when a pattern is the source of
 * truth. Only emits rows for user-input primitives + modifiers.
 */
export function patternToSchema(pattern: DimensionPattern): Array<{
  key: string;
  label: string;
  type: "number" | "integer" | "string" | "boolean";
  unit?: string;
  required?: boolean;
  default?: number;
}> {
  const out: Array<{
    key: string;
    label: string;
    type: "number" | "integer" | "string" | "boolean";
    unit?: string;
    required?: boolean;
    default?: number;
  }> = [];
  if (pattern.primitive === "linear") {
    out.push({ key: "length", label: "Total run length", type: "number", unit: "m", required: true });
  } else {
    out.push({
      key: "segments",
      label: "Segments (length + corner angle per leg)",
      type: "string", // array of objects; UI renders custom
      required: true,
    });
  }
  const mods = pattern.modifiers ?? {};
  const mod = (mods as Record<string, ModifierSource | undefined>);
  const addIfUserInput = (key: string, label: string, unit: string) => {
    const m = mod[key];
    if (m && m.source === "user_input") {
      out.push({ key, label, type: "number", unit, default: m.default });
    }
  };
  addIfUserInput("spacing", "Spacing", "m");
  addIfUserInput("start_offset", "Start offset", "m");
  addIfUserInput("end_offset", "End offset", "m");
  addIfUserInput("corner_offset", "Corner offset", "m");
  return out;
}
