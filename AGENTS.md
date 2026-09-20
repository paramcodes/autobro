<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Git — commit each iteration

Commit every time after each iteration / working change. Inspect `git status`, `git diff`, stage only intended files, write concise Conventional Commit message. Never commit secrets. Do not push unless explicitly asked.

# Auth — Clerk default-deny (proxy.ts)

- Routing model is default-deny: only `/sign-in(.*)` and `/sign-up(.*)` are
  public via `isPublicRoute`; every other page is auth-protected. New public
  pages (landing, pricing, etc.) must be added to that list or login is required.
- API/webhook routes under `(api|trpc)(.*)` are also auth-required. Future
  unauthenticated webhooks (Clerk, Stripe, …) must have their path added to
  `isPublicRoute`, otherwise signature verification never runs (requests 404).
