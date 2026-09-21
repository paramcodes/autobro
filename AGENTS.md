<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Git — commit each iteration

Commit every time after each iteration / working change. Inspect `git status`, `git diff`, stage only intended files, write concise Conventional Commit message. Never commit secrets. Do not push unless explicitly asked.

# Changes log — keep CHANGES.md updated

After each working change / commit, append an entry to `CHANGES.md`: date, commit hash, files touched, exact change, and what that change did. Keep it chronological and structured. Update it in the same iteration as the code change — never batch it later. Never record secrets.

# Auth — Clerk default-deny (proxy.ts)

- Routing model is default-deny: only `/sign-in(.*)` and `/sign-up(.*)` are
  public via `isPublicRoute`; every other page is auth-protected. New public
  pages (landing, pricing, etc.) must be added to that list or login is required.
- API/webhook routes under `(api|trpc)(.*)` are also auth-required. Future
  unauthenticated webhooks (Clerk, Stripe, …) must have their path added to
  `isPublicRoute`, otherwise signature verification never runs (requests 404).

# Database types

Derive database types from the Drizzle schema — never hand-write custom or partial
shapes for table rows. Export `typeof table.$inferSelect` (and `$inferInsert` when
needed) from `lib/schema.ts` and import it. When a consumer needs only some
columns, narrow with `Pick<Row, ...>` / `Omit<Row, ...>` rather than redeclaring a
literal type. Don't add an insert type where `db.insert(...).values()` already
enforces the shape.

# React Flow — never rely on training data

Whenever touching React Flow API / components / usage in general, do not rely on
training data — it is stale. Fetch `https://reactflow.dev/llms.txt` first to find
the relevant docs, then follow the linked pages for the exact API before writing
any code. Heed versioned props, handlers, and deprecation notices.

<!-- TRIGGER.DEV SKILLS START -->
## Trigger.dev agent skills

This project has Trigger.dev agent skills installed in `.agents/skills/`. Before writing or changing Trigger.dev code (background tasks, scheduled tasks, realtime, or chat.agent AI agents), load the most relevant skill: `trigger-authoring-chat-agent`, `trigger-authoring-tasks`, `trigger-chat-agent-advanced`, `trigger-cost-savings`, `trigger-getting-started`, `trigger-realtime-and-frontend`.
<!-- TRIGGER.DEV SKILLS END -->
