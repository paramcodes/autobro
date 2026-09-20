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
