import { AppShellWithSession } from "@/components/chrome/app-shell-with-session";
import { Btn, Pill } from "@/components/ui/primitives";
import { createClient } from "@/lib/supabase/server";
import { requireContext } from "@/lib/auth/session";
import { updateCalendar } from "./actions";

const DAYS = [
  { iso: 1, label: "Mon" },
  { iso: 2, label: "Tue" },
  { iso: 3, label: "Wed" },
  { iso: 4, label: "Thu" },
  { iso: 5, label: "Fri" },
  { iso: 6, label: "Sat" },
  { iso: 7, label: "Sun" },
];

export default async function CalendarSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const ctx = await requireContext();
  const params = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("tenant_settings")
    .select("working_hours_per_day, working_days, holidays")
    .eq("organization_id", ctx.organizationId)
    .single();
  const workingDays = (data?.working_days ?? [1, 2, 3, 4, 5]) as number[];
  const hpd = data?.working_hours_per_day ?? 8;
  const holidays = (data?.holidays ?? []) as string[];

  return (
    <AppShellWithSession crumbs={["Settings", "Calendar"]}>
      <div className="pl-page-head">
        <div className="pl-page-title-row">
          <div>
            <div className="pl-page-title">Working calendar</div>
            <div className="pl-page-sub">
              Used to convert labour-hours into task durations on the Gantt.
            </div>
          </div>
          {params.saved && <Pill variant="approved" dot>Saved</Pill>}
        </div>
      </div>
      <div className="pl-scroll" style={{ padding: 24 }}>
        <div className="pl-card" style={{ padding: 24, maxWidth: 640 }}>
          <form action={updateCalendar} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div className="pl-label">Working hours per day</div>
              <input
                name="working_hours_per_day"
                type="number"
                min="1"
                max="24"
                step="0.5"
                defaultValue={hpd}
                className="pl-input num-input"
                style={{ width: 120 }}
              />
            </div>
            <div>
              <div className="pl-label">Working days</div>
              <div style={{ display: "flex", gap: 6 }}>
                {DAYS.map((d) => {
                  const checked = workingDays.includes(d.iso);
                  return (
                    <label
                      key={d.iso}
                      style={{
                        padding: "6px 10px",
                        background: checked ? "var(--primary-soft)" : "var(--surface)",
                        border: "1px solid " + (checked ? "var(--primary-line)" : "var(--line-2)"),
                        color: checked ? "var(--primary)" : "var(--ink-3)",
                        borderRadius: 4,
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <input
                        type="checkbox"
                        name={`day_${d.iso}`}
                        defaultChecked={checked}
                        style={{ display: "none" }}
                      />
                      {d.label}
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="pl-label">Holidays · {holidays.length}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-4)" }}>
                Holiday list edit UI coming in a later batch. Stored as <span className="mono">date[]</span>.
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Btn variant="primary" type="submit">Save</Btn>
            </div>
          </form>
        </div>
      </div>
    </AppShellWithSession>
  );
}
