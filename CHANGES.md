# Changes Log

All changes made on top of `origin/main` (initial scaffold), in chronological order.
Covers 14 committed changes + current uncommitted local edits.
Date: 2026-09-20. Branch: `main` (14 commits ahead of `origin/main`).

## Quick index

| # | Commit | Area | Summary |
|---|--------|------|---------|
| 1 | `ab80604` | Toast / root layout | Added Sonner `Toaster` to root layout |
| 2 | `ab000f5` | Clerk auth setup | ClerkProvider, sign-in/up pages, `proxy.ts`, theme |
| 3 | `6e9d49f` | Test route | Added protected dummy `app/test/page.tsx` |
| 4 | `a29f943` | Home page | Simplified home to `UserButton` only |
| 5 | `7ae0b71` | Auth model | Default-deny routing + simplified test page + AGENTS.md rule |
| 6 | `0baad05` | Auth routes | Grouped sign-in/up under `app/(auth)` with shared layout |
| 7 | `dd19398` | Orgs | Added `create-organization` page |
| 8 | `a305118` | Orgs | Added `OrganizationSwitcher` on home page |
| 9 | `05b7ade` | Orgs / Docker | Moved `create-organization` into `(auth)`, added `.dockerignore` |
| 10 | `3cc0844` | Home UX | `Empty` state for no-workflow-selected |
| 11 | `d957053` | Dashboard split | Moved home page to `app/(dashboard)/page.tsx`, vendored Clerk skills |
| 12 | `16d9309` | Dashboard shell | Added `app/(dashboard)/layout.tsx` + `components/app-sidebar.tsx` |
| 13 | `2c34b7d` | Sidebar fix | Wrapped dashboard layout in `TooltipProvider` |
| 14 | `31a6a5e` | Sidebar UX | Sidebar collapses to icon rail instead of offcanvas |
| 15 | uncommitted | Your local edits | Inset sidebar variant + layout sizing + `devIndicators: false` |

---

## 1. `ab80604` — Toast component in root layout and page

**Files:**
- `app/layout.tsx` (modified)
- `app/page.tsx` (modified)
- `CLAUDE.md` (added, 3 lines)

**Exact change:**
- Imported `Toaster` from `@/components/ui/sonner` in `app/layout.tsx` and rendered `<Toaster />` inside `ThemeProvider`.
- Touched demo `app/page.tsx` (toast demo wiring).
- Added `CLAUDE.md` as a symbolic pointer to `AGENTS.md`.

**What it did:**
- Enabled app-wide toast notifications via Sonner. Any `toast()` call now renders.
- No auth or routing impact. Pure UI infra.

---

## 2. `ab000f5` — Clerk auth with shadcn theme and sign-in controls

**Files:**
- `package.json`, `bun.lock` — added `@clerk/nextjs@^7.9.4`, `@clerk/ui@1.33.1`
- `proxy.ts` (added, 14 lines)
- `app/layout.tsx` — wrapped app in `<ClerkProvider appearance={{ theme: shadcn }}>`
- `app/globals.css` — added `@import "@clerk/ui/themes/shadcn.css"`, re-themed radius/colors, added pointer-cursor rule for buttons
- `app/sign-in/[[...sign-in]]/page.tsx` (added) — renders `<SignIn />`
- `app/sign-up/[[...sign-up]]/page.tsx` (added) — renders `<SignUp />`
- `app/page.tsx` — sign-in controls added
- `.gitignore` — added `.clerk/`

**Exact change:**
- Installed Clerk packages and created Clerk middleware entrypoint `proxy.ts` (this repo uses `proxy.ts`, not `middleware.ts`).
- Root layout now provides Clerk context with shadcn appearance to match app theme.
- Added catch-all sign-in/sign-up routes.

**What it did:**
- Authentication works end-to-end. Unauthenticated users get redirected to sign-in for protected routes.
- Clerk UI inherits shadcn styling instead of default Clerk styling.
- `.clerk/` dev cache is no longer tracked by git.

---

## 3. `6e9d49f` — Protected dummy test page

**Files:**
- `app/test/page.tsx` (added, 8 lines)

**Exact change:**
- Added a static page at `/test` with heading “Protected test page” and dummy text.

**What it did:**
- Gave a route to verify `proxy.ts` protection: visiting `/test` signed-out forces sign-in; signed-in renders the page.

---

## 4. `a29f943` — Simplify home page to UserButton only

**Files:**
- `app/page.tsx` (modified)

**Exact change:**
- Replaced the starter “Project ready!” demo content with a minimal page rendering only Clerk `<UserButton />`.

**What it did:**
- Removed scaffold demo UI. Home became a minimal auth-state probe (avatar/account menu when signed in).

---

## 5. `7ae0b71` — Default-deny auth via public route list, simplify test page

**Files:**
- `proxy.ts` — `isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])`; all other requests run `await auth.protect()`
- `app/test/page.tsx` — simplified copy to state it requires sign-in via `proxy.ts`
- `AGENTS.md` — documented the default-deny rule

**Exact change:**
- Switched from allow-list-everything to deny-by-default: only sign-in/sign-up are public.
- Kept the standard Clerk `matcher` config (skips `_next`, static assets; always runs for `/api|/trpc`).
- Wrote the rule into `AGENTS.md` so future public pages (landing/pricing) and unauthenticated webhooks (Clerk/Stripe) are explicitly added to `isPublicRoute`.

**What it did:**
- Every new page is protected unless deliberately made public. Prevents accidentally shipping an open route.
- Important gotcha documented: API/webhook routes are also protected — future webhooks must be added to the public list or signature verification never runs (request 404s/redirects first).

---

## 6. `0baad05` — Group sign-in/sign-up under `(auth)` with shared layout

**Files:**
- `app/(auth)/layout.tsx` (added, 11 lines) — centered `min-h-screen` flex wrapper
- `app/(auth)/sign-in/[[...sign-in]]/page.tsx` (added)
- `app/(auth)/sign-up/[[...sign-up]]/page.tsx` (added)
- Deleted `app/sign-in/...` and `app/sign-up/...`

**Exact change:**
- Moved both auth pages under the `(auth)` route group (URL unchanged: `/sign-in`, `/sign-up`).
- Added a shared `AuthLayout` that centers auth forms.

**What it did:**
- Auth pages share one centered layout without affecting other routes. Route group is organizational only — no URL change.
- Prepares for more auth-scoped pages (e.g. create-organization) to reuse the same layout.

---

## 7. `dd19398` — Create-organization page with Clerk CreateOrganization

**Files:**
- `app/create-organization/page.tsx` (added, 5 lines)

**Exact change:**
- Added page rendering `<CreateOrganization afterCreateOrganizationUrl="/" />`.

**What it did:**
- Users can create a Clerk organization, then land back on `/`.

---

## 8. `a305118` — OrganizationSwitcher below UserButton on home page

**Files:**
- `app/page.tsx` (modified)

**Exact change:**
- Rendered Clerk `<OrganizationSwitcher />` under the existing `<UserButton />` on `/`.

**What it did:**
- Home page became the org-switching probe: sign in, create/switch orgs, verify Clerk org state before dashboard UI existed.

---

## 9. `05b7ade` — Move create-organization into `(auth)` group, add `.dockerignore`

**Files:**
- `app/(auth)/create-organization/page.tsx` (added)
- Deleted `app/create-organization/page.tsx`
- `.dockerignore` (added, 36 lines)

**Exact change:**
- Moved the page under `(auth)` so it uses the centered auth layout. URL unchanged (`/create-organization`).
- Added `.dockerignore` excluding `.git`, `node_modules`, `.next`/`out`/`build`, `.env*`, `.DS_Store`, `.clerk`, agent scratch dirs (`.agents`, `.grok`, `.hermes`, `.pi`, `.zencoder`), `skills-lock.json`.

**What it did:**
- Consistent centered UI for all auth/org-setup pages.
- Docker builds are smaller, faster, and never bake secrets (`.env*` excluded — pass at runtime).

---

## 10. `3cc0844` — Empty state for no-workflow-selected on home page

**Files:**
- `app/page.tsx` (rewritten)

**Exact change:**
- Replaced UserButton/OrgSwitcher probe with shadcn `Empty` composition: `Workflow` icon media (`size-16 rounded-2xl`), title “No workflow selected”, description “Select a workflow from the sidebar or create a new one”, large `<Button size="lg"><Plus /> New workflow</Button>`.

**What it did:**
- Established the “no selection” UX later reused by the dashboard page. Home temporarily acted as the empty-editor placeholder.

---

## 11. `d957053` — Move `page.tsx` into separate dashboard group

**Files:**
- Deleted root `app/page.tsx`
- Added `app/(dashboard)/page.tsx` (42 lines, same Empty state as above)
- Vendored Clerk agent skills under `.agents/skills/clerk*/`, plus `.grok/.hermes/.pi/.zencoder` symlinks and `skills-lock.json`
- Added `design/*.png` reference screenshots (sidebar, canvas, node states, logs panel, etc.)

**Exact change:**
- Root `/` no longer has its own page; the dashboard group owns it. This keeps root `app/layout.tsx` (ClerkProvider + ThemeProvider + Toaster) lean so sign-in/sign-up under `(auth)` don’t inherit dashboard chrome (sidebar).
- Bulk-added local Clerk skill docs and design reference images. No runtime code in this part.

**What it did:**
- Fixed layout leakage: sidebar and dashboard providers render only for dashboard routes, not for auth routes.
- Gave agents offline Clerk patterns and gave UI work pixel references in `design/`.

---

## 12. `16d9309` — Dashboard layout with app sidebar and workflow list

**Files:**
- `app/(dashboard)/layout.tsx` (added, 23 lines)
- `components/app-sidebar.tsx` (added, 84 lines)

**Exact change:**
- `DashboardLayout` (async server component): reads `sidebar_state` cookie via `next/headers` `cookies()`, passes `defaultOpen` to `<SidebarProvider>`, renders `<AppSidebar />` + `<SidebarInset>{children}</SidebarInset>`.
- `AppSidebar` (client component): shadcn `Sidebar` with header (`OrganizationSwitcher hidePersonal` + `SidebarTrigger`), content group “Workflows” with `Plus` group action and 9 hardcoded workflows (`dominant-wasp`, `honest-reindeer`, `expected-llama`, `essential-ocelot`, `creepy-echidna`, `eastern-silkworm`, `cultural-lion`, `proud-weasel`, `regional-bonobo`; first marked `isActive`), footer (`UserButton`), and `SidebarRail`.

**What it did:**
- Created the app shell: persistent sidebar + main content area, sidebar open/closed state persisted in a cookie.
- Workflow list is static placeholder data — clicking does nothing yet; backend wiring is still open.

---

## 13. `2c34b7d` — Wrap dashboard layout in TooltipProvider for sidebar tooltips

**Files:**
- `app/(dashboard)/layout.tsx` (modified)

**Exact change:**
- Wrapped `<AppSidebar />` + `<SidebarInset>` in `<TooltipProvider>` from `@/components/ui/tooltip`.

**What it did:**
- Fixed missing tooltip context: collapsed-icon sidebar buttons (each `SidebarMenuButton` passes `tooltip={workflow}`) now show hover tooltips instead of throwing/warning about missing provider.

---

## 14. `31a6a5e` — Collapse sidebar to icon rail instead of offcanvas

**Files:**
- `components/app-sidebar.tsx` — `<Sidebar collapsible="icon">` (was default offcanvas behavior)

**Exact change:**
- One-prop change: `collapsible="icon"`.

**What it did:**
- Collapsing the sidebar now shrinks it to a narrow icon rail (tooltips preserve labels) instead of sliding it off-canvas. Main content keeps its layout; org switcher hides via `group-data-[collapsible=icon]:hidden`, trigger centers via `group-data-[collapsible=icon]:justify-center`.

---

## 15. Uncommitted local edits (your manual changes — not yet committed)

These show in `git status` / `git diff` and are included here so nothing is lost.

### 15a. `components/app-sidebar.tsx` — `variant="inset"`

**Exact change (1 line):**
```diff
-    <Sidebar collapsible="icon">
+    <Sidebar variant="inset" collapsible="icon">
```

**What it did:**
- Switched sidebar to the floating “inset” style: sidebar sits inset from the viewport with rounded chrome, and pairs with the bordered `SidebarInset` content panel (see 15b). Pure visual style change; collapse behavior from #14 is preserved.

### 15b. `app/(dashboard)/layout.tsx` — full-height provider + contained content panel

**Exact change (2 lines):**
```diff
-    <SidebarProvider defaultOpen={defaultOpen}>
+    <SidebarProvider defaultOpen={defaultOpen} className="h-svh">
       <TooltipProvider>
         <AppSidebar />
-        <SidebarInset>{children}</SidebarInset>
+        <SidebarInset className="min-h-0 overflow-hidden border shadow-none!">{children}</SidebarInset>
       </TooltipProvider>
     </SidebarProvider>
```

**What it did:**
- `h-svh` on the provider pins the shell to viewport height so sidebar + content fill the screen without page-level scroll.
- `min-h-0 overflow-hidden` on the inset lets the inner canvas/editor scroll internally instead of pushing the shell.
- `border shadow-none!` gives the inset variant its framed card look and kills the default shadow.

### 15c. `next.config.ts` — disable dev indicator

**Exact change:**
```diff
-const nextConfig: NextConfig = {}
+const nextConfig: NextConfig = {
+    devIndicators:false,
+}
```

**What it did:**
- Hides the Next.js dev overlay/indicator in development for cleaner screenshots and demo. No production effect.

---

## File map (final state)

- Auth entry: `proxy.ts`, `app/(auth)/layout.tsx`, `app/(auth)/sign-in/[[...sign-in]]/page.tsx`, `app/(auth)/sign-up/[[...sign-up]]/page.tsx`, `app/(auth)/create-organization/page.tsx`
- Dashboard: `app/(dashboard)/layout.tsx`, `app/(dashboard)/page.tsx`, `components/app-sidebar.tsx`
- Global: `app/layout.tsx` (ClerkProvider + ThemeProvider + Toaster), `app/globals.css` (Clerk shadcn theme import), `app/test/page.tsx` (protected probe)
- Config/docs: `next.config.ts`, `.dockerignore`, `.gitignore`, `AGENTS.md`, `CLAUDE.md`

---

## 16. `a558b10` — 2026-09-20 — WorkflowNav with collapsed popover list

**Files:**
- `components/app-sidebar.tsx` (modified)

**Exact change:**
- Extracted workflow list into `WorkflowNav` in the same file, using `useSidebar()` `state` to own both states.
- Expanded: same `SidebarGroup` list as before, minus `<Workflow />` icons from items (`<span>{workflow}</span>` only, `tooltip` kept).
- Collapsed: no list; single `SidebarMenuButton tooltip="Workflows"` with `<Workflow />` icon inside uncontrolled `<Popover>` (`PopoverTrigger asChild`, no open-state tracking); `PopoverContent side="right" align="start"` holds a `Plus` "New workflow" `SidebarMenuButton`, a `SidebarSeparator`, and the text-only workflow list.
- No custom components or custom CSS — only default `Popover` + `Sidebar` primitives.

**What it did:**
- Expanded sidebar shows clean text-only workflow list; collapsed rail shows one workflow icon that pops the workflow list + create button, matching `design/collapsed-app-sidebar*.png`.
- `bunx tsc --noEmit` passes.

---

## 17. `71fa731` — 2026-09-20 — Move WorkflowNav to features/workflows

**Files:**
- `features/workflows/components/workflow-nav.tsx` (added — `WorkflowNav` + `workflows` list, `"use client"`)
- `components/app-sidebar.tsx` (modified — imports `WorkflowNav` from `@/features/workflows/components/workflow-nav`, drops moved code and now-unused `Plus`/`Workflow`/`Popover`/group imports)

**Exact change:**
- Pure move, no behavior change: same expanded text-only list and collapsed icon-button + uncontrolled `Popover` (`side="right" align="start"`, New-workflow button + `SidebarSeparator` + list).

**What it did:**
- Sidebar shell stays lean in `components/`; workflow nav now lives under `features/workflows/`, ready for future workflow feature work.
- `bunx tsc --noEmit` passes.

---

## 18. `1ec5e31` — 2026-09-20 — Sidebar rail stays visible on small screens

**Files:**
- `components/ui/sidebar.tsx` (modified)
- `components/app-sidebar.tsx` (modified — pre-existing local removal of the `"use client"` line rides along; harmless since all interactive children are client components)

**Exact change:**
- `Sidebar`: deleted the `if (isMobile)` Sheet-drawer branch (drawer defaulted to closed with its only trigger hidden inside it, so the sidebar vanished under 768px); the desktop rail now renders at every width.
- Dropped the `md:` gating (`hidden md:block` → always rendered wrapper, `hidden … md:flex` → always `flex` container).
- `toggleSidebar` now always flips desktop `open` instead of `openMobile` on mobile, so the header trigger keeps working on narrow windows and `WorkflowNav`'s `state`-driven expanded/collapsed UI stays correct.
- Removed now-unused `Sheet*` imports and `SIDEBAR_WIDTH_MOBILE`; context shape (`openMobile`, `isMobile`, …) kept for compatibility.

**What it did:**
- Narrowing the window (or any mobile viewport) keeps the collapsible icon sidebar on screen instead of hiding it with no way back.
- `bunx tsc --noEmit` passes. (`bunx eslint` crashes repo-wide on a pre-existing `eslint-plugin-react` incompatibility, unrelated to this change.)

---

## 19. `1507907` — 2026-09-20 — Neon project setup (flat-cake-92718317)

**Files:**
- `neon.ts` (added — `defineConfig({})`)
- `package.json`, `bun.lock` (added `@neon/config@1.7.2`, `@neon/env@1.4.3` via `neon config init`)
- `.gitignore` (added `.neon`)
- `skills-lock.json`, `.grok/skills/neon*/` (Neon skills installed)
- MCP configs installed for codex/cursor/gemini-cli/github-copilot-cli/grok-build/opencode/vscode/windsurf/zed
- `.env.local` (untracked, gitignored — holds `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `NEON_BRANCH` pulled by `neon link`)

**Exact change:**
- Installed `neon@5.0.0` via `bun install -g` (npm registry unreachable from this machine).
- `neon login` needs an interactive browser; link/deploy still succeeded on ambient auth.
- `neon link --project-id flat-cake-92718317 --branch production`, `neon config init`, trimmed `neon.ts` to `defineConfig({})`, `neon deploy` → "No changes — branch production already matches the policy."

**What it did:**
- Repo linked to Neon project `flat-cake-92718317` (`production` branch); deploy policy in place; DB URLs available locally via ignored `.env.local`, never committed.

---

## 20. `d2f0329` — 2026-09-20 — Symlink Neon skills into `.agents/skills`

**Files:**
- `.agents/skills/neon*/` (8 symlinks → `../../.grok/skills/neon*/`)

**Exact change:**
- `neon skills -y` only detects the `.grok/` project folder (its supported-agent list has no generic `.agents` target), so the 8 real skill dirs landed in `.grok/skills/` only. Added relative symlinks from `.agents/skills/`, same style as the existing clerk symlinks.

**What it did:**
- Neon skills now resolve from both `.agents/skills/` and `.grok/skills/`; `.grok/` stays canonical so `neon skills update` keeps working in place; `skills-lock.json` untouched (tracks source/hash, not path).

---

## 21. `b4c3fab` — 2026-09-20 — Drizzle ORM with Neon (HTTP driver)

**Files:**
- `package.json`, `bun.lock` — added `drizzle-orm@0.45.2`, `@neondatabase/serverless@1.1.0`, `dotenv@18.0.1`, `drizzle-kit@0.31.10` (dev)
- `package.json` scripts — added `db:generate`, `db:migrate`, `db:studio`, `db:check`
- `drizzle.config.ts` (added — schema `./db/schema.ts`, out `./drizzle`, `postgresql` dialect, direct `DATABASE_URL_UNPOOLED` from `.env.local`)
- `db/index.ts` (added — `drizzle-orm/neon-http` client over pooled `DATABASE_URL`)
- `db/schema.ts` (added — empty placeholder with commented `demo_users` example)

**Exact change:**
- Followed `neon` + `neon-postgres` skills and https://neon.com/docs/guides/drizzle: HTTP driver for Next.js serverless, pooled URL for app traffic, direct URL for Drizzle Kit migrations, schema-as-code in `db/`.
- No tables created yet; domain tables get added to `db/schema.ts` then `bun run db:generate && bun run db:migrate`.

**What it did:**
- `bun run typecheck` passes; `bunx drizzle-kit check` passes ("Everything's fine").
- Verified live: `select 1` via raw `neon()` and via `db.execute()` both return `{ok: 1}` against the linked Neon project (`flat-cake-92718317`, `production` branch).

---

## 22. `fc8b5c5` — 2026-09-20 — `workflows` table with `graph` jsonb

**Files:**
- `db/schema.ts` (modified — replaced placeholder with `workflows` table + `Workflow` select type)
- `drizzle/0000_mature_legion.sql` (added — `CREATE TABLE "workflows"`)

**Exact change:**
- `workflows`: `id uuid PK default gen_random_uuid()`, `org_id text not null` (Clerk org), `name text not null`, `graph jsonb` (nullable, canvas nodes/edges), `created_at` / `updated_at timestamp default now() not null`.
- `export type Workflow = typeof workflows.$inferSelect`.
- `bun run db:generate` → `bun run db:migrate` (direct `DATABASE_URL_UNPOOLED`).

**What it did:**
- Table live on Neon `production` branch. Verified round-trip via `db` client: insert scratch row (uuid default + jsonb graph round-trips) → select → delete, 0 rows left.
- `bun run typecheck` passes; `bunx drizzle-kit check` passes.
- `WorkflowNav` still hardcoded; swapping it to DB rows is a follow-up.

---

## 23. `b1f5e40` — 2026-09-20 — `listWorkflows` data function

**Files:**
- `features/workflows/data.ts` (added — `listWorkflows(orgId)`)

**Exact change:**
- `listWorkflows(orgId)`: `db.select().from(workflows).where(eq(workflows.orgId, orgId)).orderBy(desc(workflows.createdAt))`, modeled on drizzle select pattern.

**What it did:**
- Gives dashboard/sidebar a per-org, newest-first workflow query. No UI wiring yet.

---

## 24. `defbf95` — 2026-09-20 — `createWorkflow` data function

**Files:**
- `features/workflows/data.ts` (modified — added `createWorkflow(orgId, name)`)

**Exact change:**
- `createWorkflow(orgId: string, name: string)`: `db.insert(workflows).values({ orgId, name }).returning()`, destructures `[workflow]` and returns the single row.

**What it did:**
- Mirrors `listWorkflows` style for writes: inserts one `workflows` row (`id`/`createdAt`/`updatedAt` defaulted, `graph` left null) and returns it for redirect/toast use.
- `bun run typecheck` passes.

---

## 25. `fbc5c28` — 2026-09-20 — `generateSlug` util with adjective-animal names

**Files:**
- `features/workflows/lib/generateSlug.ts` (added — `generateSlug()`)
- `package.json`, `bun.lock` — added `unique-names-generator@4.7.1`

**Exact change:**
- `generateSlug(): string`: `uniqueNamesGenerator({ dictionaries: [adjectives, animals], separator: "-", style: "lowerCase" })`, e.g. `brave-otter`.
- Note: requested package name `unique-name-generator` does not exist on npm (404); used the real `unique-names-generator` (plural).

**What it did:**
- Gives workflows a random hyphenated slug for default names/URLs. Verified via `bun -e` import (e.g. `painful-basilisk`).
- `bunx tsc --noEmit` passes.

---

## 26. `edcc07f` — 2026-09-20 — `createWorkflowAction` server action

**Files:**
- `features/workflows/actions.ts` (added — `createWorkflowAction(name)`)

**Exact change:**
- `"use server"` action: `const { orgId } = await auth()` (`@clerk/nextjs/server`, async in this version), throws `No active organization` if missing, `createWorkflow(orgId, name)` from `@/features/workflows/data`, then `revalidatePath("/", "layout")` before `redirect(`/workflows/${workflow.id}`)` (revalidate-before-redirect per Next server-actions guide; redirect throws so it runs last).

**What it did:**
- Gives UI a single authed entry point for creating workflows: no org → hard error, success → layout cache purged + navigated to the new workflow page.
- `bunx tsc --noEmit` passes.

---

## 27. `8309aeb` — 2026-09-20 — `listWorkflows` wired into sidebar nav

**Files:**
- `components/app-sidebar.tsx` (modified — async server component, `auth()` + `listWorkflows`)
- `features/workflows/components/workflow-nav.tsx` (modified — `workflows` prop, dummy list removed)

**Exact change:**
- `AppSidebar` is now `async`: `const { orgId } = await auth()` (`@clerk/nextjs/server`), `const workflows = orgId ? await listWorkflows(orgId) : []`, passed as `<WorkflowNav workflows={workflows} />`.
- `WorkflowNav({ workflows }: { workflows: Workflow[] })` (type from `@/db/schema`): dummy string array deleted, both collapsed/popover and expanded branches map real rows with `key={workflow.id}`, label/tooltip `workflow.name`; `isActive={index === 0}` removed (active item deferred).
- Renamed lucide import to `Workflow as WorkflowIcon` to avoid collision with the `Workflow` DB type.

**What it did:**
- Sidebar nav renders real org-scoped workflows (newest first via `listWorkflows` ordering); no org → empty list, no hard error.
- `npm run typecheck` (`tsc --noEmit`) passes.

---

## 28. `8883d0b` — 2026-09-20 — Workflow creation from sidebar nav

**Files:**
- `components/app-sidebar.tsx` (modified — imports + passes `createWorkflowAction`)
- `features/workflows/components/workflow-nav.tsx` (modified — `createWorkflowAction` prop, `generateSlug` + `useTransition` create handler)

**Exact change:**
- `AppSidebar` (async server component) imports `createWorkflowAction` from `@/features/workflows/actions` and passes it as `<WorkflowNav workflows={workflows} createWorkflowAction={createWorkflowAction} />` (prop name ends in `Action` so the server-function reference crosses the server/client boundary per Next `server-and-client-boundary` guide).
- `WorkflowNav` (`"use client"`) accepts `createWorkflowAction: (name: string) => Promise<void>`, imports `generateSlug` from `@/features/workflows/lib/generateSlug`, and adds `handleCreate()` that generates a fresh `adjective-animal` slug then `startTransition(() => void createWorkflowAction(name))`.
- Both New-workflow triggers wired: collapsed-popover `SidebarMenuButton` and expanded `SidebarGroupAction`, each with `onClick={handleCreate}` + `disabled={isPending}`. No direct server-action import in the client component.
- Verified against `node_modules/next/dist/docs/01-app/02-guides/server-actions.md`, `server-and-client-boundary.md`, `forms.md`, `01-getting-started/07-mutating-data.md` (`Passing actions as props`, event-handler invocation).

**What it did:**
- Clicking New workflow creates a uniquely-named row via the existing authed `createWorkflowAction` (which `revalidatePath` + `redirect`s to `/workflows/[id]`).
- `npm run typecheck` (`tsc --noEmit`) passes.

---

## 29. `f700405` — 2026-09-20 — Individual workflow `[id]` route shell

**Files:**
- `app/(dashboard)/workflow/[id]/page.tsx` (added — async server component, `params: Promise<{ id: string }>`, displays `id`)
- `app/(dashboard)/workflow/[id]/loading.tsx` (added — centered `Spinner` from `@/components/ui/spinner`)
- `app/(dashboard)/workflow/[id]/error.tsx` (added — `"use client"`, `{ error, retry }` props, `Empty` composition + retry `Button`)
- `app/(dashboard)/workflow/[id]/not-found.tsx` (added — `Empty` composition + `Button asChild` `Link href="/"`)

**Exact change:**
- `page.tsx`: `export default async function Page({ params }: { params: Promise<{ id: string }> })`, `const { id } = await params`, renders `Workflow {id}` heading + `Workflow ID: {id}` line (per Next `page.md` / `dynamic-routes.md`: `params` is a promise, must `await`).
- `loading.tsx`: no props, returns centered `<Spinner className="size-8" />` (per Next `loading.md`: instant Suspense fallback, no params).
- `error.tsx`: `"use client"` first line, `useEffect(() => console.error(error), [error])`, `Empty > EmptyHeader(EmptyMedia icon TriangleAlert + EmptyTitle + EmptyDescription with digest) + EmptyContent(Button size="lg" onClick retry)` (per Next `error.md`: client boundary, `retry` stable in v16.3).
- `not-found.tsx`: no props, `Empty > EmptyHeader(EmptyMedia icon SearchX + EmptyTitle "Workflow not found" + EmptyDescription) + EmptyContent(Button asChild Link "/")` (per Next `not-found.md`).

**What it did:**
- `/workflow/[id]` renders the dynamic id, streams a centered spinner while loading, shows an `Empty`-styled retry card on runtime errors, and an `Empty`-styled back-to-workflows card on `notFound()`.
- `npm run typecheck` (`tsc --noEmit`) passes.

---

## 30. `5a5797f` — 2026-09-20 — Rename workflow route to plural `workflows`

**Files:**
- `app/(dashboard)/workflow/[id]/` → `app/(dashboard)/workflows/[id]/` (`page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` — content unchanged, pure `git mv` rename)

**Exact change:**
- `git mv "app/(dashboard)/workflow/[id]" "app/(dashboard)/workflows/[id]"` + removed the now-empty singular dir. Diff is 4 renames at 100% similarity, 0 insertions/deletions.

**What it did:**
- Fixes the 404 on workflow creation: `createWorkflowAction` (`features/workflows/actions.ts:14`) redirects to `/workflows/${workflow.id}` (plural), but the route only served singular `/workflow/<id>`, so every new workflow landed on the default Next 404 instead of the route's `Empty`-styled `not-found` card.
- `npm run typecheck` (`tsc --noEmit`) passes.

---

## 31. `cedb684` — 2026-09-20 — Link workflow nav items to pages with active highlight

**Files:**
- `features/workflows/components/workflow-nav.tsx` (modified — `Link` + `usePathname` wiring in both collapsed and expanded lists)

**Exact change:**
- Added `import Link from "next/link"` and `import { usePathname } from "next/navigation"`, plus `const pathname = usePathname()` in `WorkflowNav`.
- Both workflow lists (collapsed popover and expanded sidebar) now render `<SidebarMenuButton asChild isActive={pathname === \`/workflows/${workflow.id}\`}>` wrapping `<Link href={\`/workflows/${workflow.id}\`}><span>{workflow.name}</span></Link>`.

**What it did:**
- Each workflow in the sidebar links to its own `/workflows/{id}` page, and the currently open workflow shows as selected via `isActive`.
- `npx tsc --noEmit` passes.

---

## 32. `fb4b01e` — 2026-09-20 — WorkflowShell resizable editor layout

**Files:**
- `features/workflows/components/workflow-shell.tsx` (added — `WorkflowShell({ workflowId })`, `"use client"`)
- `app/(dashboard)/workflows/[id]/page.tsx` (modified — renders `<WorkflowShell workflowId={id}>`)

**Exact change:**
- `WorkflowShell` is a single-file layout shell with no sub-components and no data fetching: outer horizontal `ResizablePanelGroup` (`className="size-full"`, `data-workflow-id`) with two panels and a `ResizableHandle` between them.
- Left panel (`minSize="30rem"`) holds a vertical `ResizablePanelGroup` (`size-full`) with top canvas panel (`minSize="18rem"`, label `Canvas`) + handle + bottom logs panel (`defaultSize="8rem" minSize="6rem"`, label `Logs`).
- Right inspector panel (`defaultSize="16rem" minSize="14rem" maxSize="36rem"`, label `Inspector`).
- All panel sizes are rem strings (react-resizable-panels v4 CSS-unit mode), imported from `@/components/ui/resizable`.
- `[id]/page.tsx` stays an async server component, awaits `params`, and returns only `<WorkflowShell workflowId={id} />` (previous centered `Workflow {id}` placeholder removed).

**What it did:**
- `/workflows/[id]` now renders the editor shell: resizable canvas/logs column + inspector, with placeholder labels until real canvas/logs/inspector components land.
- `npm run typecheck` (`tsc --noEmit`) passes.

---

## 33. `6414d71` — 2026-09-20 — Trigger.dev setup (proj_kxwhzprencmwzpqaxxdy)

**Files:**
- `package.json`, `bun.lock` — added `@trigger.dev/sdk@^4.6.3`, `@trigger.dev/build@^4.6.3` (dev)
- `trigger.config.ts` (added — `defineConfig` with `project: "proj_kxwhzprencmwzpqaxxdy"`, `dirs: ["./src/trigger"]`, `maxDuration: 3600`)
- `src/trigger/hello.ts` (added — exported `helloWorld` task via `task()` from `@trigger.dev/sdk`)
- `tsconfig.json` (modified — added `trigger.config.ts` to `include`)
- `.gitignore` (modified — added `.trigger`)

**Exact change:**
- Manual setup per https://trigger.dev/docs/manual-setup (no MCP server available, `init` CLI needs interactive login so config was written by hand).
- `helloWorld` task id `hello-world` takes optional `{ name }`, logs and returns greeting + timestamp. Imports only from `@trigger.dev/sdk`, exported, no `node-fetch`, no `Promise.all` around wait/trigger APIs.
- `**/*.ts` already covered new files; `trigger.config.ts` added explicitly to `include` per spec.

**What it did:**
- `bun run typecheck` (`tsc --noEmit`) passes.
- Verified end-to-end 2026-09-20: user completed `npx trigger.dev@latest login` (acct `sparamveer1001@gmail.com`, project `autobro` / `proj_kxwhzprencmwzpqaxxdy`), dev `TRIGGER_SECRET_KEY` stored in gitignored `.env.local` (never committed), `npx trigger.dev@latest dev` → `Local worker ready on branch: default [node] -> 20260920.1`, triggered `hello-world` (`{ name: "dev-check" }`) → `run_06gbtoi17emi0oudm7kltc0q01`, worker logged `Hello dev-check!` → Success (32ms). Confirm `hello-world` in dashboard: https://cloud.trigger.dev/orgs/param-f363/projects/autobro-tfla .

---

## 34. `0b69a1e` — 2026-09-20 — Extract inspector into RightSidebar with Run button

**Files:**
- `features/workflows/components/right-sidebar.tsx` (added — `RightSidebar()`, `"use client"`)
- `features/workflows/components/workflow-shell.tsx` (modified — right panel renders `<RightSidebar />`)

**Exact change:**
- Moved the right inspector panel content out of `WorkflowShell` into new `RightSidebar` component.
- Replaced centered `Inspector` placeholder div with centered `@/components/ui/button.tsx` `<Button>` containing lucide `Play` icon + `Run` text.
- `WorkflowShell` imports `RightSidebar` from `./right-sidebar` and renders it inside the right `ResizablePanel` (`defaultSize="16rem" minSize="14rem" maxSize="36rem"`).

**What it did:**
- `/workflows/[id]` right panel now shows a Run button instead of Inspector text, with inspector UI isolated for future work.
- `npm run typecheck` (`tsc --noEmit`) passes.

---

## 35. `d3b87a4` — 2026-09-20 — Trigger hello-world from Run button via server action

**Files:**
- `features/workflows/actions.ts` (modified — added `runWorkflowAction`)
- `features/workflows/components/right-sidebar.tsx` (modified — Run button calls `runWorkflowAction`)

**Exact change:**
- Added `runWorkflowAction(name?: string)` server action per `trigger-authoring-tasks` / `trigger-getting-started` skills: type-only `import type { helloWorld } from "@/src/trigger/hello"` plus `tasks.trigger<typeof helloWorld>("hello-world", { name })` from `@trigger.dev/sdk` (task instance never bundled into the app), returns `{ id: handle.id }`.
- `RightSidebar` (client) calls the action inside `useTransition` on click, disables the button with `Running...` label while pending, and toasts success (`Workflow run triggered: <run id>`) or failure via app-wide Sonner `Toaster`.

**What it did:**
- Clicking Run in `/workflows/[id]` triggers the `hello-world` Trigger.dev task (requires `TRIGGER_SECRET_KEY` + `trigger dev` running).
- `npx tsc --noEmit` passes. (`npx eslint` on touched files fails on pre-existing `eslint-plugin-react` / ESLint 10 incompatibility, unrelated to this change.)

---

## 36. `74fb8ac` — 2026-09-20 — Live run feedback in RightSidebar via useRealtimeRun

**Files:**
- `package.json`, `bun.lock` — added `@trigger.dev/react-hooks@4.6.3` (matches `@trigger.dev/sdk@4.6.3`)
- `features/workflows/actions.ts` (modified — `runWorkflowAction` also returns `handle.publicAccessToken`)
- `features/workflows/components/right-sidebar.tsx` (modified — `RunFeedback` panel with `useRealtimeRun`)

**Exact change:**
- Per `trigger-realtime-and-frontend` skill (and the version-pinned SDK skill + `docs/realtime/`): no new token minting needed — the `RunHandle` from `tasks.trigger()` already carries an auto-generated `publicAccessToken` scoped to the triggered run (15-min expiry), so the server action returns `{ id, publicAccessToken }`.
- New `RunFeedback` client component subscribes with `useRealtimeRun<typeof helloWorld>(runId, { accessToken })` (type-only task import, so typed `run.output.message`/`timestamp`) and renders live `run.status` (green COMPLETED / red terminal-failure / blue in-flight), the run id, and the task output message + timestamp. It only mounts after the trigger returns a handle (never subscribes before the handle exists), and keeps the `"use client"` boundary the hooks require.
- Success toast removed (the panel now shows the run id + status); error toast kept for trigger failures.

**What it did:**
- Clicking Run now shows live status/output of the `hello-world` run updating in the right sidebar without polling.
- `npx tsc --noEmit` passes.

---

## 37. `d6e5767` — 2026-09-20 — Extract canvas div into WorkflowCanvas component

**Files:**
- `features/workflows/components/workflow-canvas.tsx` (added — `WorkflowCanvas()`, `"use client"`)
- `features/workflows/components/workflow-shell.tsx` (modified — renders `<WorkflowCanvas />`)

**Exact change:**
- Moved the top canvas panel content out of `WorkflowShell` into new `WorkflowCanvas` component, mirroring the `RightSidebar` extraction pattern.
- Canvas div contents unaltered: `<div className="flex size-full items-center justify-center">Canvas</div>`.
- `WorkflowShell` imports `WorkflowCanvas` from `./workflow-canvas` and renders it inside the top `ResizablePanel` (`minSize="18rem"`).

**What it did:**
- `/workflows/[id]` canvas panel renders identically, with canvas UI isolated for future work.
- `npm run typecheck` (`tsc --noEmit`) passes.

---

## 38. `d5bffbe` — 2026-09-20 — Basic interactive React Flow canvas

**Files:**
- `package.json`, `bun.lock` — added `@xyflow/react@12.11.6` (`bun add @xyflow/react`)
- `app/globals.css` (modified — `@import "@xyflow/react/dist/style.css"` after the tailwind/clerk imports)
- `features/workflows/components/workflow-canvas.tsx` (modified — controlled `<ReactFlow>` flow)

**Exact change:**
- Per https://reactflow.dev/learn (Quick Start) + `building-a-flow` + `adding-interactivity` guides: `WorkflowCanvas` (still `"use client"`) holds `nodes`/`edges` in `useState`, wires `onNodesChange`/`onEdgesChange` via `applyNodeChanges`/`applyEdgeChanges` and `onConnect` via `addEdge` (all `useCallback`), renders `<ReactFlow nodes edges … fitView>` with `<Background />` + `<Controls />` inside a `size-full` div (React Flow requires a sized parent; the resizable panel provides it).
- Seed graph: `n1` (`input` type, label `Node 1`) → `n2` (label `Node 2`) via edge `n1-n2`.
- Flow stylesheet imported in `globals.css`, not the component, because the docs require it to load after the `tailwindcss` import under Tailwind v4.
- Next `server-and-client-boundary` guide checked: canvas state lives entirely in the client graph (`WorkflowShell` → `WorkflowCanvas`, both `"use client"`); `[id]/page.tsx` still passes only the serializable `workflowId` string.

**What it did:**
- `/workflows/[id]` top panel now shows a pannable/zoomable flow with two connected nodes: drag/select/delete nodes and draw new edges by dragging between handles.
- `npm run typecheck` (`tsc --noEmit`) passes.

---

## 39. `7760f23` — 2026-09-20 — React Flow connection line type set to step

**Files:**
- `features/workflows/components/workflow-canvas.tsx` (modified — `connectionLineType` prop)

**Exact change:**
- Per https://reactflow.dev/api-reference/types/connection-line-type: imported `ConnectionLineType` from `@xyflow/react` and set `connectionLineType={ConnectionLineType.Step}` on `<ReactFlow>` (orthogonal stepped preview with sharp corners).

**What it did:**
- Dragging a new connection between handles now previews a stepped line; existing edges (default bezier) unchanged — the prop only affects the drag preview.
- `npm run typecheck` (`tsc --noEmit`) passes.

---

## 40. `408a651` — 2026-09-20 — Connection/edge lines switched to smoothstep

**Files:**
- `features/workflows/components/workflow-canvas.tsx` (modified — `connectionLineType`, `defaultEdgeOptions`, edge styling)

**Exact change:**
- Changed `connectionLineType` from `ConnectionLineType.Step` to `ConnectionLineType.SmoothStep`, set `defaultEdgeOptions` type to `"smoothstep"`, and styled edges/connection line with `var(--border)`.

**What it did:**
- New and existing edges render as rounded orthogonal smoothstep lines matching the app border token.
- `npm run typecheck` (`tsc --noEmit`) passes.

---

## 41. `a5715ca` — 2026-09-21 — Sync React Flow colorMode with app theme

**Files:**
- `features/workflows/components/workflow-canvas.tsx` (modified — `useTheme` + `colorMode` prop)

**Exact change:**
- Imported `useTheme` from `next-themes`, read `resolvedTheme`, and passed `colorMode={resolvedTheme === "dark" ? "dark" : "light"}` to `<ReactFlow>`.

**What it did:**
- Canvas, edges, and controls switch between light and dark along with the rest of the app (including `system` theme, via `resolvedTheme`).
- `bunx tsc --noEmit` passes.

---

## 42. `75f276a` — 2026-09-21 — Require reactflow.dev llms.txt for React Flow usage

**Files:**
- `AGENTS.md` (modified — added React Flow docs rule)

**Exact change:**
- Added `# React Flow — never rely on training data` section: fetch `https://reactflow.dev/llms.txt` first, follow linked pages for exact API, heed versioned props/handlers/deprecations.

**What it did:**
- Agents no longer rely on stale training data for React Flow API/components/usage; they resolve current docs before writing code.

---

## 43. `7c74c8f` — 2026-09-21 — Add open-url node to initial canvas nodes

**Files:**
- `features/workflows/components/workflow-canvas.tsx` (modified — appended `open-url-1` to `initialNodes`)

**Exact change:**
- Added `{ id: "open-url-1", type: "step", position: { x: 0, y: 150 }, data: { type: "open-url", kind: "action", title: "Open URL", values: {} } }` below the `start` node. Same `x`, `y: 150` stacks it vertically. `initialEdges` left empty.

**What it did:**
- Canvas now renders Start + Open URL on load; the `open-url` registry entry resolves its Globe icon/accent via the existing `StepNode`, with target + source handles since `kind` is `action`.
- `npm run typecheck` (`tsc --noEmit`) passes.

---

## 44. `9bb343c` — 2026-09-21 — Custom StepNode design with node registry

**Files:**
- `features/workflows/nodes/node-registry.ts` (added — `nodeRegistry`, `StepNodeData`, `StepNodeType`)
- `features/workflows/components/step-node.tsx` (added — memoized `StepNode`)
- `features/workflows/components/workflow-canvas.tsx` (modified — `nodeTypes`, `start`-only seed)
- `templates/node-registry.ts`, `templates/step-node.tsx` (added — mirrors)

**Exact change:**
- `nodeRegistry`: `start` (trigger, `MousePointerClick`, blue, no fields) + `open-url` (action, `Globe`, emerald, `url` field); `StepNodeData` is plain JSON (`type/kind/title/values`, `kind`/`title` denormalized for server reads).
- `StepNode`: icon chip + title card, left `target` handle hidden when `kind === "trigger"`, right `source` handle always; selected ring via `ring-ring`.
- Canvas: `nodeTypes={{ step: StepNode }}`, seed replaced (`n1/n2` → single `start`), edges emptied.

**What it did:**
- Canvas renders designed trigger cards instead of generic React Flow defaults; adding a node type is now a one-entry registry change.
- `npm run typecheck` (`tsc --noEmit`) passes.

---

## 45. `07823ef` — 2026-09-21 — Revert: remove open-url node from initial canvas

**Files:**
- `features/workflows/components/workflow-canvas.tsx` (modified — removed `open-url-1`)

**Exact change:**
- Deleted the `open-url-1` entry (`y: 150`) added in `7c74c8f`; seed back to single `start` node.

**What it did:**
- Canvas loads with Start only; `open-url` stays available in the registry but is not seeded.
- `npm run typecheck` (`tsc --noEmit`) passes.

---

## 46. `f274793` — 2026-09-21 — `PROMPTS.md` prompt log

**Files:**
- `PROMPTS.md` (added — prompt/why/change/learn log reconstructed from `git log` + `CHANGES.md` up to `07823ef`)

**Exact change:**
- One entry per user intent (scaffold → auth → dashboard → Neon/Drizzle → workflows → Trigger.dev → React Flow → StepNode system), each with Prompt / Why / Change / Learn plus a beginner glossary. Companion to commit-level `CHANGES.md`.

**What it did:**
- Anyone new can learn the project history (intent + effect) without reading every diff; technical but beginner-friendly.

---

## 47. `ed99093` — 2026-09-21 — `PROMPTS2.md` full flat verbatim prompt log

**Files:**
- `PROMPTS2.md` (added — all 66 user prompts verbatim, flat chronological order, Why/Change/Learn per entry)

**Exact change:**
- Extracted all user prompts read-only from `~/.local/share/opencode/opencode.db` (23 sessions, `part` table user `text` parts, `2026-09-20` → `2026-09-21`).
- Same Prompt → Why → Change → Learn structure as `PROMPTS.md`, plus beginner glossary. Secrets in 2 prompts redacted (Clerk keys, Trigger dev key) — never logged verbatim.
- `PROMPTS.md` left untouched (curated/intent-grouped); `PROMPTS2.md` is the complete archive (every prompt, flat, verbatim).

**What it did:**
- Full prompt history preserved verbatim for learning/audit; anyone can trace each change back to the exact words that caused it.

---

## 48. `960ffc6` — 2026-09-21 — `getWorkflow(orgId, id)` scoped single-row lookup

**Files:**
- `features/workflows/data.ts` (modified — added `getWorkflow`)

**Exact change:**
- Added `export async function getWorkflow(orgId: string, id: string)` using `db.select().from(workflows).where(and(eq(workflows.orgId, orgId), eq(workflows.id, id))).limit(1)` and returning the first row (destructured `[workflow]`).

**What it did:**
- Single-workflow fetch scoped to both `orgId` and `id`; returns `undefined` when no row matches.
- `bun run typecheck` (`tsc --noEmit`) passes.

---

## 49. `9ec8054` — 2026-09-21 — Liveblocks Sync for React Flow (ID-token auth via Clerk)

**Files:**
- `package.json`, `bun.lock` (modified — added `@liveblocks/client`, `@liveblocks/react`, `@liveblocks/react-ui`, `@liveblocks/react-flow`, `@liveblocks/node`, all pinned `3.24.1`)
- `liveblocks.config.ts` (added — `UserMeta` info `{ name, avatar, color }`, empty Presence/Storage/RoomEvent/ThreadMetadata/RoomInfo/GroupInfo/ActivitiesData)
- `lib/liveblocks.ts` (added — shared `roomIdForWorkflow()` → `workflow-${id}`, client-safe)
- `lib/liveblocks-server.ts` (added — `getLiveblocksClient()` singleton, `colorForUserId()` deterministic palette hash, `ensureWorkflowRoom()` via `getOrCreateRoom` with `defaultAccesses: ["room:write"]` + Clerk `organizationId`)
- `app/api/liveblocks-auth/route.ts` (added — `POST` ID-token endpoint: Clerk `auth()` + `currentUser()` → `liveblocks.identifyUser({ userId, organizationId, groupIds: [] }, { userInfo })`)
- `app/api/liveblocks-users/route.ts` (added — `POST { userIds }` → Clerk `getUserList`, returns `UserMeta["info"]` in request order; backs `resolveUsers`)
- `features/workflows/components/workflow-room.tsx` (added — `LiveblocksProvider authEndpoint="/api/liveblocks-auth"` + `resolveUsers`, `RoomProvider id=workflow-${id}`, `ClientSideSuspense` fallback)
- `features/workflows/components/workflow-canvas.tsx` (modified — `useState` + `applyNodeChanges/applyEdgeChanges/addEdge` replaced with `useLiveblocksFlow<StepNodeType, Edge>({ suspense: true })`; added `onDelete` + `<Cursors />`; kept custom `step` nodeTypes, theme `colorMode`, smoothstep edges)
- `app/(dashboard)/workflows/[id]/page.tsx` (modified — server `ensureWorkflowRoom(id, orgId)` before render, wrapped in `<WorkflowRoom>`; failures caught so page renders and Room surfaces the error)
- `app/globals.css` (modified — `@import` Liveblocks `react-ui` + `react-flow` styles)
- `.env.local` (modified, gitignored — added empty `LIVEBLOCKS_SECRET_KEY=` placeholder)

**Exact change:**
- Followed `nextjs-react-flow` get-started guide adapted to ID tokens (no `publicApiKey` anywhere) + `authenticating-with-id-tokens`, `add-user-information`, `create-rooms-manually`, `type-liveblocks-correctly` skill references. Room-per-workflow isolation (`workflow-${id}`), org-compartmentalized via Clerk `organizationId`.

**What it did:**
- Workflow diagrams sync across clients with multiplayer cursors; users authenticated as their Clerk identity (name/avatar/color). `bun run typecheck` passes; `next build` succeeds (`/api/liveblocks-auth`, `/api/liveblocks-users`, `/workflows/[id]` all registered). Repo-wide `bun run lint` crashes on a pre-existing `eslint-plugin-react`/ESLint-10 incompatibility (fails on untouched files too). Still required: paste real `LIVEBLOCKS_SECRET_KEY` from https://liveblocks.io/dashboard into `.env.local`.

## 50. `50eb3af` — 2026-09-21 — Liveblocks avatar panel in workflow canvas

**Files:**
- `features/workflows/components/collaborators-panel.tsx` (added — `CollaboratorsPanel` wrapping `AvatarStack max={4} size={28}` from `@liveblocks/react-ui` in a `bg-background/80 backdrop-blur` pill)
- `features/workflows/components/workflow-canvas.tsx` (modified — imports `Panel` from `@xyflow/react` + `CollaboratorsPanel`; renders `<Panel position="top-right" className="m-4"><CollaboratorsPanel /></Panel>` inside `<ReactFlow>` after `<Cursors />`; prettier reflow of the `useLiveblocksFlow` destructure)
- `liveblocks.config.ts` (modified — added missing `color: string` to `UserMeta.info` to match `identifyUser`/`resolveUsers` payloads; prettier semicolon style)

**Exact change:**
- Presence stack pinned to the canvas viewport via React Flow's native `<Panel>`, so it survives pan/zoom without touching the `WorkflowShell` resizable layout. `AvatarStack` resolves names/avatars through the existing `resolveUsers` endpoint with `+N` overflow past 4 users.

**What it did:**
- Every collaborator in the workflow room now sees who else is present (self + others, tooltip names, color rings) top-right of the canvas. `bun run typecheck` passes; prettier clean; repo-wide `bun run lint` still crashes on the pre-existing `eslint-plugin-react`/ESLint-10 incompatibility (untouched files fail identically).

---

## 51. `275c486` — 2026-09-21 — Palette click adds node at viewport center (single trigger)

**Files:**
- `features/workflows/components/right-sidebar.tsx` (modified — `Palette` uses `useReactFlow<StepNodeType>()`: `getNodes`/`addNodes`/`screenToFlowPosition`; `crypto.randomUUID()` id; trigger-singleton guard with Sonner `toast.error`; action titles numbered `${label} ${n}`)
- `app/(dashboard)/workflows/[id]/page.tsx` (modified — `<WorkflowShell>` wrapped in `<ReactFlowProvider>` inside `<WorkflowRoom>` so canvas + sidebar share one store)

**Exact change:**
- Per [Hooks and Providers](https://reactflow.dev/learn/advanced-use/hooks-providers) + [`useReactFlow`](https://reactflow.dev/api-reference/hooks/use-react-flow) + [`<ReactFlowProvider />`](https://reactflow.dev/api-reference/react-flow-provider): provider sits above both `<WorkflowCanvas>` and `<RightSidebar>`, so `Palette` (outside `<ReactFlow>`) can call the shared store. Click position is the `.react-flow` pane center in screen pixels converted via `screenToFlowPosition` (window-center fallback). New node is `{ id: crypto.randomUUID(), type: "step", position, data: { type, kind, title, values: {} } }` added via `addNodes`, which flows through the Liveblocks `onNodesChange` mutation. Same-type actions count existing `data.type` matches for the suffix; triggers keep the base label and a second trigger shows `toast.error("Only one trigger node is allowed")` instead of adding.

**What it did:**
- Clicking a palette entry drops that node in the middle of the current view with a unique id, numbered action titles (`Open URL 1`, `Open URL 2`, …), and at most one trigger on the canvas. `bun run typecheck` (`tsc --noEmit`) passes.
