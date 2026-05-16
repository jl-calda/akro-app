import { Btn } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/icon";

export function EmptyState({
  ico = "package",
  title,
  description,
  actionLabel,
  actionHref,
}: {
  ico?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div
      style={{
        margin: "40px auto",
        maxWidth: 520,
        padding: 32,
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 8,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          margin: "0 auto 14px",
          borderRadius: 8,
          background: "var(--primary-soft)",
          color: "var(--primary)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Icon name={ico} size={20} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</div>
      {description && (
        <div style={{ fontSize: 12.5, color: "var(--ink-4)", marginTop: 6, lineHeight: 1.5 }}>
          {description}
        </div>
      )}
      {actionLabel && actionHref && (
        <div style={{ marginTop: 16 }}>
          <a href={actionHref}>
            <Btn variant="primary" ico="plus">
              {actionLabel}
            </Btn>
          </a>
        </div>
      )}
    </div>
  );
}
