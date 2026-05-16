# akro-app

Multi-tenant Safety MTO (Material Take-Off) platform for fall-protection contractors. Built per `CLAUDE_CODE_PROMPT.md` and the Claude Design handoff under `./design/`.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Supabase (Postgres + Auth + RLS) — project `vyhdtxxhvdhgjtoyqgum`
- Tailwind CSS 3.4 — tokens declared as CSS variables in `app/globals.css`
- Geist Sans + Geist Mono (`next/font/google`)
- Vitest for unit tests

## Live deployment

The repo `jl-calda/akro-app` deploys to Vercel on every push to `claude/implement-design-mockup-EDoOm`. **Env vars must be set in the Vercel project before the deploy will boot** — otherwise the middleware redirects every route to `/setup`, which shows exactly what to add.

### Required env vars (Vercel → Settings → Environment Variables)

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vyhdtxxhvdhgjtoyqgum.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | from Supabase dashboard → API |
| `NEXT_PUBLIC_APP_URL` | your deployed `*.vercel.app` URL (for OAuth redirect) |

Optional (PWA push, not delivering yet):
- `WEB_PUSH_VAPID_PUBLIC_KEY`
- `WEB_PUSH_VAPID_PRIVATE_KEY`
- `WEB_PUSH_CONTACT`

### Google OAuth

In Supabase dashboard → Authentication → Providers, enable Google and provide a Google Cloud OAuth client ID + secret. Set the redirect URL to `https://<your-vercel-url>/auth/callback`.

## Running locally

```bash
cp .env.local.example .env.local      # then fill in values
npm install
npm run dev
```

Open `http://localhost:3000`. First-time users land in `/onboarding`, which seeds default phases / substrates / categories / a Main Yard location.

## Database

The full schema lives in Supabase. Migrations were applied via the Supabase MCP server; if you need to recreate the schema, the SQL is committed in the git history under commits prefixed `B1`. Re-generate types after schema changes:

```bash
# from a machine with Supabase CLI authenticated
supabase gen types typescript --project-id vyhdtxxhvdhgjtoyqgum > lib/supabase/types.ts
```

## Folder layout

```
app/
  (app)/               authenticated app routes (sidebar + topbar)
  (auth)/              login, signup, onboarding (no sidebar)
  (mobile)/            storeman + foreman mobile-first routes
  auth/callback/       OAuth callback handler
  setup/               appears when env vars are missing
components/
  ui/                  primitives (Btn, Pill, Chip, HiVis, Check, …)
  chrome/              Sidebar, Topbar, AppShell, MobileShell
  screens/             composite screen components
lib/
  supabase/            server + browser clients, generated types
  auth/                session + role helpers
  rules/               sandboxed formula engine (parser + evaluator + topo sort)
  cutting/             linear FFD + plate shelf packing
public/
  sw.js                PWA service worker (push delivery scaffolded)
  icon.svg             app icon
db/                    (reserved; migrations applied via Supabase MCP)
design/                read-only — Claude Design handoff for reference
```

## Roles

Seven roles enforced via Postgres RLS:

| Role | What they do |
|---|---|
| `tenant_owner` | Everything + billing/subscription |
| `tenant_admin` | Catalog authoring, MTO + PO approval, user management |
| `project_manager` | Projects, working sets, MTO submission, photos |
| `estimator` | Quotes, pricing, PO generation, material catalog adds |
| `project_viewer` | Read-only on assigned projects |
| `storeman` | Mobile warehouse — issue, receive, return stock |
| `site_foreman` | Mobile field — confirm handovers, capture photos |

RLS policies live in two migrations (`016_rls_enable_org_scoped`, `017_rls_catalog_and_workflow`) — every `public` table has SELECT scoped to membership and WRITE gated by allowed roles via the `user_has_role()` helper.

## Workflows wired

| Workflow | Status |
|---|---|
| Sign up + onboarding | ✅ real |
| Catalog: materials, suppliers, substrates, categories, phases | ✅ CRUD |
| Catalog: systems, models, sub-assemblies (JSON editor for now) | ✅ CRUD + publish |
| Projects: list + create | ✅ real |
| Project tabs: overview, working set, MTO, quotes, schedule, photos, activity | ✅ navigable |
| Quotes: list, detail, pricing, status transitions (incl. award snapshot) | ✅ real |
| MTO: submit / approve / reject + activity logging | ✅ real |
| Stock: balances + transactions feed | ✅ read (writes ship in storeman flow) |
| Procurement: PO list + detail with lifecycle rail | ✅ read |
| Schedule: Gantt + Kanban | ✅ read (auto-gen + status compute is a follow-up) |
| Storeman mobile: home / scan / stock / more / issue / list-detail | ✅ shell + nav |
| Foreman mobile: pending / scan / confirm / projects / task / more | ✅ shell + nav |
| Audit log | ✅ real |
| Users + role change | ✅ real |
| Tenant settings, labour, calendar | ✅ real |
| Billing | ⚠️ UI stub only — Stripe not wired |
| PWA push | ⚠️ scaffold only — sw.js + sendPush stub, no VAPID keys yet |
| Rule engine + cutting | ✅ libs implemented + tested (18 unit tests pass), preview UI in a follow-up |

## Tests

```bash
npm test
```

18 unit tests cover the rule engine (tokenizer, parser, evaluator, scope, gates, topo sort, cycle detection) and the cutting algorithms (linear FFD, plate shelf packing).

## What's left / next batches

In order of impact:

1. **Rule preview drawer + visual parts-list editor** on `/catalog/models/[id]` — JSON editor works today; design's inline editor is a follow-up.
2. **System Instance builder** at `/projects/[id]/working-set/[id]` with live MTO preview.
3. **Cut Plan visualization** at `/catalog/models/[id]/cut-plan`.
4. **Storeman issue + handover flow** wired to real `stock_transactions` writes.
5. **Aggregation → Generate PO** action.
6. **Schedule auto-generation** when a System Instance lands in the Working Set.
7. **PDF generation** (Quote, MTO, PO, Progress Report).
8. **PWA push delivery** once VAPID keys are configured.

Detailed plan: `/root/.claude/plans/cheerful-mixing-kay.md` in the session that created this branch.
