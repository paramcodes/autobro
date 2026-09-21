# PROMPTS.md — Prompt Log: What We Asked, Why, and What Changed

> How to read this file: each entry is one **user prompt / intent** (reconstructed
> from `git log` + `CHANGES.md` up to `07823ef`, 2026-09-21 — verbatim chat text
> is not stored in the repo, so prompts below are the *intent* behind each change).
> Format per entry: **Prompt** → **Why** → **Change** → **Learn** (beginner concept).

**Stack in one line:** Next.js App Router + Clerk (auth/orgs) + Neon Postgres +
Drizzle ORM + Trigger.dev (background jobs) + React Flow (canvas) + shadcn/ui.

**Repo conventions to know first:**

- `proxy.ts` (not `middleware.ts`) is the Clerk auth entrypoint. Default-deny:
  only `/sign-in` + `/sign-up` are public; everything else calls `auth.protect()`.
- `(auth)` and `(dashboard)` are **route groups** — they organize layouts without
  changing URLs. `(auth)` = centered pages, `(dashboard)` = sidebar shell.
- `AGENTS.md` rule: every code change gets a commit **and** a `CHANGES.md` entry
  in the same iteration. That is why git history alternates `feat:` / `docs:`.

---

## 1. Scaffold the app + install shadcn/ui

**Prompt:** "Create a fresh Next.js app and add all shadcn/ui components."

**Why:** Need a typed App Router base plus a copy-paste component library so later
UI (sidebar, empty states, resizable panels, tooltips) is assembled, not hand-built.

**Change:**

- `50265b5 feat: initial commit` — Next.js scaffold.
- `6bceb53 feature: added all shadcn/ui components` — `components/ui/*`,
  `components.json`, Tailwind + `app/globals.css` theme tokens.

**Learn:** shadcn/ui is *not* an npm UI kit — components live in your repo under
`components/ui/` so you own and edit them. `components.json` records style choices.

---

## 2. Add app-wide toasts

**Prompt:** "Add a toast component to layout and page."

**Why:** Server actions and background jobs (workflow create, Run button) need
non-blocking success/error feedback. Toast infra must exist before those features.

**Change (`ab80604`):**

- `app/layout.tsx` renders `<Toaster />` from `@/components/ui/sonner` inside
  `ThemeProvider`.
- Demo wiring in `app/page.tsx`.

**Learn:** Sonner renders from one `<Toaster />` at the root. Any client component
can then call `toast.success(...)` / `toast.error(...)` without prop drilling.

---

## 3. Add Clerk auth (provider, middleware, sign-in/up)

**Prompt:** "Add Clerk auth with shadcn theme and sign-in controls."

**Why:** App needs real users + organizations before workflows can be org-scoped.
Clerk UI must match the shadcn theme instead of default Clerk styling.

**Change (`ab000f5`):**

- Installed `@clerk/nextjs`, `@clerk/ui`.
- Added `proxy.ts` — Clerk middleware (this repo's name for it).
- `app/layout.tsx` wraps app in `<ClerkProvider appearance={{ theme: shadcn }}>`.
- `app/globals.css` imports `@clerk/ui/themes/shadcn.css`, re-themes radius/colors.
- Added catch-all `app/sign-in/[[...sign-in]]/page.tsx` (`<SignIn />`) and
  `app/sign-up/[[...sign-up]]/page.tsx` (`<SignUp />`).
- `.gitignore` adds `.clerk/` (local dev cache).

**Learn:** `ClerkProvider` gives every component auth state (`<UserButton />`,
`auth()` on server). Catch-all `[[...sign-in]]` lets Clerk own sub-routes
(factor selection, verification) under one page file.

---

## 4. Prove auth works with a protected probe page

**Prompt:** "Add a protected dummy test page."

**Why:** Before building product UI, verify `proxy.ts` actually redirects
signed-out users. A throwaway route is the cheapest test harness.

**Change (`6e9d49f`):**

- `app/test/page.tsx` — static "Protected test page".

**Learn:** Visit `/test` signed-out → redirected to sign-in; signed-in → renders.
If this fails, the auth layer is broken — no point building on top of it.

---

## 5. Strip home to an auth probe

**Prompt:** "Simplify home page to UserButton only."

**Why:** Starter template demo content is noise. A minimal page shows only auth
state (avatar menu when signed in).

**Change (`a29f943`):** `app/page.tsx` rewritten to render only `<UserButton />`.

**Learn:** `<UserButton />` is Clerk's account menu. If you see it, the whole
chain (provider → middleware → session) works.

---

## 6. Switch to default-deny auth

**Prompt:** "Make every route protected except sign-in/sign-up."

**Why:** Allow-listing each new page is error-prone — one forgotten page ships
open. Deny-by-default means new pages are safe unless explicitly made public.

**Change (`7ae0b71`):**

- `proxy.ts`: `isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])`,
  everything else runs `await auth.protect()`.
- Documented the rule in `AGENTS.md`.

**Learn — gotcha:** API/webhook routes under `/api|/trpc` are *also* protected.
A future Clerk/Stripe webhook must be added to `isPublicRoute`, or signature
verification never runs (request is redirected/404'd first).

---

## 7. Group auth pages under `(auth)` with shared layout

**Prompt:** "Group sign-in/sign-up under `(auth)` with a shared layout."

**Why:** Auth pages should share one centered layout without affecting other
routes. Route groups do exactly that.

**Change (`0baad05`):**

- Added `app/(auth)/layout.tsx` — centered `min-h-screen` flex wrapper.
- Moved both pages under `app/(auth)/...`. URLs unchanged (`/sign-in`, `/sign-up`).

**Learn:** Parentheses = invisible to URL. `(auth)/sign-in/page.tsx` still serves
`/sign-in`, but now inherits `(auth)/layout.tsx`. Use groups to scope layouts.

---

## 8–9. Add organizations (create + switch)

**Prompt:** "Add a create-organization page" → "Show OrganizationSwitcher on home."

**Why:** Workflows will be scoped per Clerk `orgId`. Need UI to create/switch
orgs before any per-org data query makes sense.

**Change:**

- `dd19398`: `app/create-organization/page.tsx` renders
  `<CreateOrganization afterCreateOrganizationUrl="/" />`.
- `a305118`: `app/page.tsx` renders `<OrganizationSwitcher />` under `<UserButton />`.

**Learn:** Clerk orgs = tenants. `orgId` (from server `auth()`) becomes the
foreign key every workflow row carries. Switcher lets one user test multi-tenancy.

---

## 10. Polish org setup route + Docker hygiene

**Prompt:** "Move create-organization into `(auth)` and add a `.dockerignore`."

**Why:** Org-setup page deserves the same centered layout as sign-in. Docker
builds should be small and never bake secrets.

**Change (`05b7ade`):**

- Moved page to `app/(auth)/create-organization/page.tsx` (URL unchanged).
- Added `.dockerignore` excluding `.git`, `node_modules`, `.next/out/build`,
  `.env*`, `.DS_Store`, `.clerk`, agent scratch dirs.

**Learn:** `.env*` excluded = secrets passed at runtime, not baked into images.
Same reason `.env.local` stays gitignored later for `DATABASE_URL`.

---

## 11. Empty state for "no workflow selected"

**Prompt:** "Show an Empty state when no workflow is selected."

**Why:** Establishes the editor's idle UX before the dashboard exists: icon,
title, description, big "New workflow" button.

**Change (`3cc0844`):** `app/page.tsx` rewritten to shadcn `Empty` composition
(`Workflow` icon, "No workflow selected", `<Button size="lg"><Plus /> New workflow</Button>`).

**Learn:** `Empty` is a composition (`EmptyHeader` + `EmptyMedia` + `EmptyTitle` +
`EmptyDescription` + `EmptyContent`), reused later for loading/error/not-found.

---

## 12. Split dashboard into its own group

**Prompt:** "Move page.tsx into a separate dashboard group so root layout doesn't leak into sign-in/up."

**Why:** Root `app/layout.tsx` holds `ClerkProvider + ThemeProvider + Toaster`.
Dashboard chrome (sidebar) must *not* render on auth routes. A `(dashboard)`
group scopes it.

**Change (`d957053`):**

- Deleted root `app/page.tsx`, added `app/(dashboard)/page.tsx` (same Empty state).
- Vendored Clerk agent skills (`.agents/skills/clerk*/`) + `design/*.png` references.

**Learn:** Layouts nest: `app/layout.tsx` (global) → `app/(dashboard)/layout.tsx`
(sidebar) → page. Auth routes skip the middle layer entirely.

---

## 13–16. Dashboard shell: sidebar, tooltips, collapse, inset polish

**Prompts:**

- "Add dashboard layout with app sidebar and workflow list."
- "Fix sidebar tooltips." → "Collapse sidebar to icon rail." → "Fix overflow/look."

**Why:** Need persistent app shell: org switcher, workflow list, user footer,
collapsible nav, viewport-height content panel.

**Change:**

- `16d9309`: `app/(dashboard)/layout.tsx` (async server component reads
  `sidebar_state` cookie via `next/headers`, passes `defaultOpen` to
  `<SidebarProvider>`, renders `<AppSidebar />` + `<SidebarInset>`).
  `components/app-sidebar.tsx` (client): header (`OrganizationSwitcher
  hidePersonal` + `SidebarTrigger`), "Workflows" group with 9 hardcoded names,
  footer (`UserButton`), `SidebarRail`.
- `2c34b7d`: wrap in `<TooltipProvider>` — collapsed icon buttons pass
  `tooltip={workflow}` and need the context.
- `31a6a5e`: `<Sidebar collapsible="icon">` — collapse shrinks to icon rail
  (tooltips preserve labels) instead of offcanvas drawer.
- `f310b37` + uncommitted polish: `variant="inset"`, `SidebarProvider
  className="h-svh"`, `SidebarInset className="min-h-0 overflow-hidden border
  shadow-none!"`, `next.config.ts devIndicators: false`.

**Learn:** `SidebarProvider` state persists via cookie (server reads, client
toggles). `h-svh` pins shell to viewport; `min-h-0 overflow-hidden` lets the
inner editor scroll without pushing the shell. `group-data-[collapsible=icon]:`
utilities restyle children when collapsed.

---

## 17–18. Extract + relocate WorkflowNav

**Prompt:** "Extract the workflow list into WorkflowNav" → "Move it to features/workflows."

**Why:** Sidebar shell (`components/`) should stay lean; workflow nav is domain
code that will soon take DB props and a create handler. `features/workflows/`
is its home.

**Change:**

- `a558b10`: `WorkflowNav` in same file — expanded text-only list; collapsed
  single `<Workflow />` icon button opening an uncontrolled `<Popover>`
  (`side="right" align="start"`) with New-workflow button + separator + list.
  No custom CSS, only `Popover` + `Sidebar` primitives.
- `71fa731`: pure move to `features/workflows/components/workflow-nav.tsx`;
  `app-sidebar.tsx` imports it. No behavior change.

**Learn:** Feature-folder pattern: `features/<domain>/{components,data.ts,
actions.ts,lib/}` keeps domain code together as it grows from static → DB-backed.

---

## 19. Keep sidebar visible on small screens

**Prompt:** "Sidebar vanishes under 768px with no way back — keep the rail visible."

**Why:** shadcn `Sidebar` renders a `Sheet` drawer on mobile whose only trigger
lived *inside* the drawer — so under 768px the sidebar disappeared entirely.

**Change (`1ec5e31`):**

- `components/ui/sidebar.tsx`: deleted the `if (isMobile)` Sheet branch; desktop
  rail renders at every width; dropped `md:` gating.
- `toggleSidebar` always flips desktop `open` so header trigger works on narrow
  windows; `WorkflowNav`'s `state`-driven UI stays correct.

**Learn:** Responsive defaults can fight app needs. An editor shell wants a
persistent rail; a marketing site wants a drawer. Know which one you are.

---

## 20–21. Neon Postgres project + skills

**Prompt:** "Set up a Neon project and link the repo" → "Make Neon skills visible to all agents."

**Why:** Need a serverless Postgres with branching for dev/test isolation, plus
offline skill docs so agents follow Neon conventions.

**Change:**

- `1507907`: `neon link --project-id flat-cake-92718317 --branch production`,
  `neon config init` → `neon.ts` (`defineConfig({})`), `neon deploy` ("No changes").
  `DATABASE_URL` + `DATABASE_URL_UNPOOLED` pulled into gitignored `.env.local`.
- `d2f0329`: `neon skills` only writes `.grok/skills/`; added relative symlinks
  from `.agents/skills/` (same style as Clerk symlinks).

**Learn:** Pooled URL = app traffic; direct/unpooled URL = migrations. `.neon/`
and `.env.local` are never committed. `neon deploy` enforces branch policy.

---

## 22. Drizzle ORM with Neon HTTP driver

**Prompt:** "Add Drizzle ORM with Neon."

**Why:** Type-safe SQL without a running DB server in the app process — the HTTP
driver fits Next.js serverless (no persistent TCP pool per lambda).

**Change (`b4c3fab`):**

- Installed `drizzle-orm`, `@neondatabase/serverless`, `drizzle-kit` (dev).
- `drizzle.config.ts` (schema `./db/schema.ts`, out `./drizzle`, dialect
  `postgresql`, direct URL for migrations).
- `db/index.ts` (`drizzle-orm/neon-http` over pooled URL), `db/schema.ts`
  placeholder.
- Scripts: `db:generate`, `db:migrate`, `db:studio`, `db:check`.
- Verified: `select 1` via raw `neon()` and `db.execute()` both return `{ok: 1}`.

**Learn:** Schema-as-code: edit `db/schema.ts` → `db:generate` (SQL file) →
`db:migrate` (apply). App reads via pooled URL; Kit migrates via direct URL.

---

## 23. `workflows` table

**Prompt:** "Create the workflows table with a jsonb graph column."

**Why:** Workflows need identity + tenancy + a flexible canvas payload. `jsonb`
stores nodes/edges without a migration per canvas feature.

**Change (`fc8b5c5`):**

- `db/schema.ts`: `workflows` — `id uuid PK default gen_random_uuid()`,
  `org_id text not null` (Clerk org), `name text not null`, `graph jsonb`
  (nullable), `created_at/updated_at timestamp default now() not null`.
  Exports `Workflow = typeof workflows.$inferSelect`.
- `drizzle/0000_mature_legion.sql` + migrate. Round-trip verified
  (insert → select → delete, 0 rows left).

**Learn:** `org_id text` (not uuid) because Clerk org IDs are strings like
`org_xxx`. `$inferSelect` derives TS types from schema — never hand-write row
shapes (see `AGENTS.md` database rule).

---

## 24–25. Data functions: `listWorkflows` + `createWorkflow`

**Prompt:** "Add listWorkflows" → "Add createWorkflow."

**Why:** UI needs one read path (sidebar, newest-first, per-org) and one write
path (insert + return row for redirect/toast).

**Change:**

- `b1f5e40` (`features/workflows/data.ts`): `listWorkflows(orgId)` —
  `db.select().from(workflows).where(eq(orgId)).orderBy(desc(createdAt))`.
- `defbf95`: `createWorkflow(orgId, name)` —
  `db.insert(workflows).values({ orgId, name }).returning()`, returns single row.

**Learn:** Keep SQL in `data.ts` (server-only), UI in components, mutations in
`actions.ts`. Small named functions beat inline queries scattered in JSX.

---

## 26. `generateSlug` util

**Prompt:** "Add a slug generator for default workflow names."

**Why:** "Untitled" everywhere is bad UX. Random `adjective-animal` slugs
(`brave-otter`) are unique-ish, readable, URL-safe defaults.

**Change (`fbc5c28`):** `features/workflows/lib/generateSlug.ts` using
`unique-names-generator` (plural — singular name 404s on npm). Verified via `bun -e`.

**Learn:** Gotcha logged in CHANGES.md: requested package `unique-name-generator`
does not exist; real package is `unique-names-generator`.

---

## 27. `createWorkflowAction` server action

**Prompt:** "Add a server action to create workflows for the active org."

**Why:** Client components cannot call `db` directly or read Clerk server auth.
A `"use server"` action is the authed entry point: check org → insert →
purge cache → navigate.

**Change (`edcc07f`):** `features/workflows/actions.ts` —
`createWorkflowAction(name)`: `await auth()` (`@clerk/nextjs/server`), throw
`No active organization` if missing, `createWorkflow(orgId, name)`,
`revalidatePath("/", "layout")` *before* `redirect(`/workflows/${id}`)`
(redirect throws, so it runs last).

**Learn:** `revalidate-before-redirect` per Next docs: purge layout cache first,
then `redirect()` (which never returns). Server actions run on the server even
when called from client event handlers.

---

## 28–29. Wire sidebar to real data + creation

**Prompt:** "Show real workflows in the sidebar" → "Let users create workflows from the sidebar."

**Why:** Replace the 9 hardcoded names with org-scoped DB rows; wire both
New-workflow buttons (expanded group action + collapsed popover) to the action.

**Change:**

- `8309aeb`: `AppSidebar` becomes `async` — `await auth()`, `await
  listWorkflows(orgId)` (empty list when no org, no hard error), passes
  `<WorkflowNav workflows={workflows} />`. `WorkflowNav` takes
  `{ workflows: Workflow[] }` (DB type), maps `key={id}`, label/tooltip `name`.
  Lucide import renamed to `WorkflowIcon` to avoid colliding with DB `Workflow` type.
- `8883d0b`: `AppSidebar` passes `createWorkflowAction` as a prop (name ends in
  `Action` so the server-function reference crosses the server/client boundary).
  `WorkflowNav` (`"use client"`) adds `handleCreate()` — fresh `generateSlug()`
  then `startTransition(() => createWorkflowAction(name))`. Both triggers use
  `onClick={handleCreate}` + `disabled={isPending}`. Client never imports the
  action directly.

**Learn:** Server Components fetch (`async` + `auth()` + `db`); client components
interact (`useTransition` pending state). Passing actions as props is the
Next-endorsed bridge (`server-and-client-boundary` guide).

---

## 30–32. Workflow `[id]` route: shell, rename, links

**Prompts:**

- "Add a workflow detail route with loading/error/not-found states."
- "Fix 404 after creating a workflow." → "Link sidebar items to their pages."

**Why:** Creation redirects to `/workflows/[id]` — that route must exist, handle
bad IDs gracefully, and highlight the active item.

**Change:**

- `f700405`: `app/(dashboard)/workflow/[id]/` — `page.tsx` (async, `params`
  is a `Promise`, must `await`), `loading.tsx` (centered `Spinner`, no props),
  `error.tsx` (`"use client"`, `{ error, retry }`, `Empty` + retry button),
  `not-found.tsx` (`Empty` + back link).
- `5a5797f`: `git mv workflow/[id] → workflows/[id]`. The action redirected to
  plural `/workflows/...` but only singular existed → every new workflow 404'd.
  Pure rename, 0 insertions.
- `cedb684`: both nav lists render `<SidebarMenuButton asChild
  isActive={pathname === `/workflows/${id}`}>` wrapping `<Link href=...>`,
  using `usePathname()`.

**Learn:** `params` is async in current Next — `await params`. `loading.tsx` =
Suspense fallback; `error.tsx` must be a client boundary; `not-found.tsx` renders
on `notFound()`. `isActive` + `usePathname()` = selected-row highlight.

---

## 33. `WorkflowShell` resizable editor layout

**Prompt:** "Add a resizable editor shell: canvas + logs + inspector."

**Why:** Editor needs three resizable zones before real canvas/logs/inspector
components exist. Labels first, functionality later.

**Change (`fb4b01e`):**

- `features/workflows/components/workflow-shell.tsx` (`"use client"`):
  horizontal `ResizablePanelGroup` (canvas/logs column + inspector) with
  `ResizableHandle`; left column nests a vertical group (canvas `minSize 18rem`
  + logs `defaultSize 8rem`); right panel `defaultSize 16rem`. Sizes are `rem`
  strings (react-resizable-panels v4 CSS-unit mode). No data fetching.
- `[id]/page.tsx` stays async server, returns only `<WorkflowShell workflowId={id} />`.

**Learn:** Page (server) passes only serializable `workflowId`; all resize state
lives in client components. `size-full` parents are required for panels to fill.

---

## 34–36. Trigger.dev: setup, Run button, trigger action

**Prompts:**

- "Set up Trigger.dev with a hello-world task."
- "Add a Run button to the inspector." → "Trigger hello-world from Run."

**Why:** Workflows must *execute* somewhere durable (retries, waits, >lambda
timeouts). `hello-world` proves the full loop: app → Trigger.dev → worker →
result.

**Change:**

- `6414d71`: `@trigger.dev/sdk` + `@trigger.dev/build`, `trigger.config.ts`
  (`project: proj_kxwhzprencmwzpqaxxdy`, `dirs: ["./src/trigger"]`),
  `src/trigger/hello.ts` (`helloWorld`, id `hello-world`, optional `{ name }`).
  Manual setup (no MCP; `init` needs interactive login). Verified end-to-end:
  `trigger dev` → trigger `{ name: "dev-check" }` → Success in 32ms.
- `0b69a1e`: `RightSidebar` extracted from `WorkflowShell`; right panel shows
  `<Button><Play /> Run</Button>` instead of "Inspector" text.
- `d3b87a4`: `runWorkflowAction(name?)` — type-only `import type { helloWorld }`
  + `tasks.trigger<typeof helloWorld>("hello-world", { name })` (task instance
  never bundled into app), returns `{ id }`. `RightSidebar` calls it in
  `useTransition`, disables with `Running...`, toasts run id or error via Sonner.

**Learn:** `tasks.trigger<typeof task>(id, payload)` from a server action —
type-only import keeps the task out of the client bundle. Requires
`TRIGGER_SECRET_KEY` + `trigger dev` running locally.

---

## 37. Live run feedback with `useRealtimeRun`

**Prompt:** "Show live run status/output in the sidebar instead of just a toast."

**Why:** Polling is wasteful. Trigger.dev streams run status over realtime —
subscribe once the handle exists and render status + output as it lands.

**Change (`74fb8ac`):**

- Added `@trigger.dev/react-hooks` (pinned to SDK version).
- `runWorkflowAction` also returns `handle.publicAccessToken` (auto-generated,
  scoped to that run, ~15-min expiry — no manual minting per realtime skill).
- New `RunFeedback` client component: `useRealtimeRun<typeof helloWorld>(runId,
  { accessToken })`, renders `run.status` (green COMPLETED / red failure / blue
  in-flight), run id, typed `run.output.message` + timestamp. Mounts only after
  handle exists. Success toast removed (panel shows it); error toast kept.

**Learn:** Never subscribe before the handle exists. `"use client"` boundary is
required for hooks. Typed task import gives typed `run.output` for free.

---

## 38–41. React Flow canvas: interactive flow, line style, theme

**Prompts:**

- "Add a basic interactive React Flow canvas."
- "Make connection previews stepped, then smoothstep." → "Sync canvas with app theme."

**Why:** Canvas is the core editor: pannable/zoomable graph, drag nodes, draw
edges. Edges should match app border tokens; canvas must follow light/dark mode.

**Change:**

- `d5bffbe`: `@xyflow/react`, `@import "@xyflow/react/dist/style.css"` in
  `globals.css` *after* Tailwind/Clerk imports (Tailwind v4 requirement).
  `WorkflowCanvas` (`"use client"`): `useState` nodes/edges,
  `onNodesChange/onEdgesChange` via `applyNodeChanges/applyEdgeChanges`,
  `onConnect` via `addEdge` (all `useCallback`), `<ReactFlow fitView>` +
  `<Background />` + `<Controls />` in `size-full` div. Seed: `n1 (input)` →
  `n2` via `n1-n2`.
- `7760f23`: `connectionLineType={ConnectionLineType.Step}` (drag preview only).
- `408a651`: preview → `SmoothStep` + `defaultEdgeOptions` type `smoothstep`,
  edges/connection line styled with `var(--border)`.
- `a5715ca`: `useTheme()` (`next-themes`) `resolvedTheme` →
  `colorMode={resolvedTheme === "dark" ? "dark" : "light"}` (handles `system`).

**Learn:** React Flow is *controlled* — you own `nodes`/`edges` state and apply
changes via helpers. Flow needs a sized parent (`size-full` from resizable panel).
`connectionLineType` = drag preview; `defaultEdgeOptions` = committed edges.

---

## 42. Repo rule: never trust training data for React Flow

**Prompt:** "Agents keep writing stale React Flow code — pin the docs rule."

**Why:** React Flow API drifts faster than model knowledge. Wrong props/handlers
waste iterations.

**Change (`75f276a`):** `AGENTS.md` section — fetch
`https://reactflow.dev/llms.txt` first, follow linked pages, heed versioned
props/deprecations. (Same spirit as the existing Next.js docs rule.)

**Learn:** Versioned-docs-first beats memory for fast-moving libs. `llms.txt` is
the index; linked pages are the source of truth.

---

## 43–44. Custom `StepNode` system + open-url experiment + revert

**Prompts:**

- "Replace generic nodes with designed step nodes backed by a registry."
- "Add an open-url node to the canvas." → "Revert that — keep Start only."

**Why:** Generic `input/default` nodes cannot represent workflow semantics
(trigger vs action, icons, inspector fields, server-readable payloads). A
registry makes "add a node type" a one-entry change. The open-url add was a
live test of that registry, reverted to keep the seed minimal.

**Change:**

- `9bb343c`: `features/workflows/nodes/node-registry.ts` — `nodeRegistry`
  (`start`: trigger, `MousePointerClick`, blue, no fields; `open-url`: action,
  `Globe`, emerald, `url` field), `StepNodeData` (plain JSON: `type/kind/title/
  values` — `kind`/`title` denormalized so server reads without registry),
  `StepNodeType = Node<StepNodeData, "step">`.
  `features/workflows/components/step-node.tsx` — memoized custom node: icon
  chip + title, left `target` handle hidden when `kind === "trigger"`
  (triggers start flows, take no input), right `source` handle always.
  `workflow-canvas.tsx` — `nodeTypes={{ step: StepNode }}`, seed becomes single
  `start` node, edges emptied. (`templates/` mirrors added alongside.)
- `7c74c8f`: appended `open-url-1` (`y: 150`, same `x`) to `initialNodes`.
- `07823ef`: reverted `open-url-1` — canvas back to Start-only.

**Learn:** Custom `nodeTypes` map a string (`"step"`) to a component. Handles are
the connection points (`target` = input, `source` = output). Denormalizing
`kind/title` into node `data` keeps payloads server-readable and Liveblocks-safe
(plain JSON, no functions/class instances).

---

## 45. Process prompts (docs + conventions)

**Prompts:** "Log this change in CHANGES.md" (every iteration) · "Update AGENTS.md
for Drizzle conventions" · "Create this PROMPTS.md log."

**Why:** Future agents (and humans) need to know *why* the code looks this way
without reading every diff. Conventions prevent repeat mistakes.

**Change:**

- `8b8c61f` + `9abf205`: created `changes.md` → renamed `CHANGES.md`, added
  AGENTS.md rule (date, hash, files, exact change, effect; update same iteration).
- `0fed21c`: AGENTS.md Drizzle rule — derive types via `$inferSelect`, narrow
  with `Pick/Omit`, no hand-written row shapes.
- This file (`PROMPTS.md`) — the prompt-level companion to the commit-level
  `CHANGES.md`. Read both: prompts for *intent*, changes for *diffs*.

**Learn:** Two logs, two questions: `PROMPTS.md` = "what did we ask and why?",
`CHANGES.md` = "what exactly changed?" Keep both updated per iteration; commit
with Conventional Commits (`feat/fix/refactor/docs/chore/revert`).

---

## Quick glossary (beginner)

| Term | Meaning here |
|------|--------------|
| Route group `(...)` | Folder that scopes layouts without changing URLs |
| `proxy.ts` | Clerk auth middleware; default-deny gate for all routes |
| Server Component | Renders on server; can `await auth()`, query `db` directly |
| Client Component (`"use client"`) | Renders in browser; hooks, events, `useTransition` |
| Server Action (`"use server"`) | Async fn called from client but executed on server |
| `revalidatePath` | Purges Next cache so sidebar shows fresh DB rows |
| Drizzle `jsonb` | Postgres JSON column; flexible canvas graph storage |
| Trigger.dev task | Durable background job with retries/streaming |
| `publicAccessToken` | Short-lived token scoped to one Trigger run for realtime |
| React Flow controlled state | You hold `nodes/edges` in `useState`, apply edits via helpers |
| `nodeTypes` | Maps a node `type` string to your custom React component |
| Handle | Connection port on a node (`target` in, `source` out) |
