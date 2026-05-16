import React from "react";
import clsx from "clsx";
import { Icon } from "./icon";

/* ─────────── Button ─────────── */
type BtnProps = {
  children?: React.ReactNode;
  variant?: "default" | "primary" | "ghost" | "danger";
  size?: "sm" | "default" | "lg";
  ico?: string;
  suffix?: string;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
};

export function Btn({
  children,
  variant = "default",
  size,
  ico,
  suffix,
  type = "button",
  style,
  className,
  onClick,
  title,
}: BtnProps) {
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      style={style}
      className={clsx(
        "pl-btn",
        variant !== "default" && variant,
        size && size,
        className,
      )}
    >
      {ico && <Icon name={ico} />}
      {children && <span>{children}</span>}
      {suffix && <Icon name={suffix} size={12} />}
    </button>
  );
}

/* ─────────── Pill ─────────── */
type PillProps = {
  children: React.ReactNode;
  variant?: "" | "draft" | "approved" | "modified" | "danger" | "info" | "mono";
  dot?: boolean;
};
export function Pill({ children, variant = "", dot }: PillProps) {
  return (
    <span className={clsx("pl-pill", variant, dot && "dot")}>{children}</span>
  );
}

/* ─────────── Chip ─────────── */
export function Chip({
  children,
  style,
  className,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <span className={clsx("pl-chip", className)} style={style}>
      {children}
    </span>
  );
}

/* ─────────── HiVis tag (warnings only) ─────────── */
export function HiVis({ children }: { children: React.ReactNode }) {
  return <span className="pl-hivis">{children}</span>;
}

/* ─────────── Checkbox ─────────── */
type CheckProps = { state?: boolean | "mid" };
export function Check({ state = false }: CheckProps) {
  return (
    <span
      className={clsx(
        "pl-check",
        state === true && "is-checked",
        state === "mid" && "is-indeterminate",
      )}
    >
      {state === true && <Icon name="check" size={10} />}
      {state === "mid" && (
        <svg viewBox="0 0 10 10">
          <path d="M2 5h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
}

/* ─────────── NumInput ─────────── */
export function NumInput({
  value,
  unit,
  width = 90,
  style,
}: {
  value?: string | number;
  unit?: string;
  width?: number | string;
  style?: React.CSSProperties;
}) {
  return (
    <span className="pl-input-group" style={{ width, ...style }}>
      <input
        className="pl-input num-input"
        defaultValue={value as string}
        style={{ width: "100%" }}
      />
      {unit && <span className="pl-input-suffix">{unit}</span>}
    </span>
  );
}

/* ─────────── Select (visual only) ─────────── */
export function Select({
  value,
  width = 180,
  style,
  placeholder,
}: {
  value?: string;
  width?: number | string;
  style?: React.CSSProperties;
  placeholder?: string;
}) {
  return (
    <span className="pl-select" style={{ width, ...style }}>
      <span
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          color: value ? undefined : "var(--ink-4)",
        }}
      >
        {value ?? placeholder}
      </span>
      <Icon name="chev" size={12} />
    </span>
  );
}

/* ─────────── Segmented control ─────────── */
export function Seg({ items, active }: { items: string[]; active?: string }) {
  return (
    <div className="pl-seg">
      {items.map((it) => (
        <span
          key={it}
          className={clsx("pl-seg-item", it === active && "is-active")}
        >
          {it}
        </span>
      ))}
    </div>
  );
}

/* ─────────── Progress bar ─────────── */
export function ProgressBar({
  value,
  max = 100,
  tone,
}: {
  value: number;
  max?: number;
  tone?: "warn" | "danger" | "success" | "";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <span className="pl-bar">
      <span
        className={clsx("pl-bar-fill", tone)}
        style={{ width: pct + "%" }}
      />
    </span>
  );
}

/* ─────────── Variance text ─────────── */
export function Var({ value }: { value: number }) {
  const tone = value === 0 ? "zero" : value > 0 ? "up" : "down";
  return (
    <span className={clsx("pl-var", tone)}>
      {value === 0 ? "—" : `${value > 0 ? "+" : ""}${value}`}
    </span>
  );
}

/* ─────────── Phase chip ─────────── */
type PhaseKind = "fab" | "inst" | "comm" | "insp";
export function Phase({ kind, children }: { kind: PhaseKind; children: React.ReactNode }) {
  return <span className={clsx("pl-phase", kind)}>{children}</span>;
}

/* ─────────── Stacked Phase bar ─────────── */
export function PhaseStack({
  segments,
}: {
  segments: { kind: PhaseKind; value: number }[];
}) {
  const total = segments.reduce((s, sg) => s + sg.value, 0) || 1;
  return (
    <span className="pl-stack">
      {segments.map((s, i) => (
        <span
          key={i}
          style={{
            width: `${(s.value / total) * 100}%`,
            background:
              s.kind === "fab"
                ? "var(--phase-fab)"
                : s.kind === "inst"
                ? "var(--phase-inst)"
                : s.kind === "comm"
                ? "var(--phase-comm)"
                : "var(--phase-insp)",
          }}
        />
      ))}
    </span>
  );
}

/* ─────────── Card ─────────── */
export function Card({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={clsx("pl-card", className)} style={style}>
      {children}
    </div>
  );
}
export function CardHead({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={clsx("pl-card-head", className)} style={style}>
      {children}
    </div>
  );
}
export function CardTitle({ children }: { children: React.ReactNode }) {
  return <div className="pl-card-title">{children}</div>;
}

/* ─────────── PlumbMark logo ─────────── */
export function PlumbMark({
  size = 22,
  color = "#1E1B0B",
  bg = "#FACC15",
}: {
  size?: number;
  color?: string;
  bg?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "block", flex: `0 0 ${size}px` }}
      aria-hidden
    >
      <path d="M0 0 H20 L24 4 V20 L20 24 H4 L0 20 Z" fill={bg} />
      <g fill={color}>
        <rect x="11" y="3" width="2" height="13" />
        <path d="M7 16 L17 16 L12 22 Z" />
      </g>
    </svg>
  );
}

/* ─────────── Filter Chip ─────────── */
export function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={clsx("pl-filter-chip", active && "is-active")}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
