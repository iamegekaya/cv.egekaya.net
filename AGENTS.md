<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CV Site Workspace Instructions

This file is the binding project contract for Codex, Claude Code, OpenCode, and every delegated agent working in this repository.

## Repository identity and current sources

- Exact repository root: `/Users/egekaya/Documents/CV Sitesi`
- Codebase Memory project: `Users-egekaya-Documents-CV-Sitesi`
- Product: a Next.js App Router site that offers Turkish and English CV downloads in PDF and DOCX formats.
- Read `README.md` for current commands and structure, then read only the task-relevant source, configuration, or documentation discovered through the code graph.
- Do not create a parallel roadmap, changelog, or `PROJECT_CONTEXT.md` unless the user explicitly asks for one.

## Main-agent orchestration model

The main agent acts as project manager and tech lead, not as an unbounded implementation agent:

1. Clarify the requested outcome, constraints, and acceptance criteria.
2. Use Codebase Memory to identify the affected routes, symbols, dependencies, and files.
3. Split non-trivial work into bounded, non-overlapping slices and delegate each slice to the matching specialist.
4. Give every implementation agent explicit file ownership and tell it to preserve unrelated or concurrent edits.
5. Review all handoffs, reconcile cross-area effects, run the required validation, and report one coherent result.

Small, one-step edits may be handled directly when delegation adds no value, but the main agent must state that choice before editing. Never create multiple agents with overlapping file ownership.

## Mandatory fail-closed Codebase Memory workflow

Codebase Memory is required for every repository task, including delegated tasks. It is a local code-graph discovery aid, not a narrative memory store and not a substitute for repository documentation.

Before reading application source:

1. Run `list_projects`.
2. Select the project only when `root_path` exactly equals `/Users/egekaya/Documents/CV Sitesi`; do not trust the display name alone.
3. Run `index_status` for `Users-egekaya-Documents-CV-Sitesi`.
4. If the graph is missing or stale, run `index_repository` for the exact repository root with `persistence:false`, then require status `ready`.
5. Run at least one task-specific `get_architecture`, `search_graph`, `trace_path`, or `search_code` query.
6. Read only the directly relevant files revealed by that discovery.

After any source, test, documentation, configuration, Docker, or agent-file edit:

1. Run `index_repository` for `/Users/egekaya/Documents/CV Sitesi` with `persistence:false`.
2. Run `index_status` again and require `ready` before final reporting.

If MCP tools are not visible, use the portable CLI fallback, for example:

```bash
codebase-memory-mcp cli list_projects '{}'
codebase-memory-mcp cli index_status '{"project":"Users-egekaya-Documents-CV-Sitesi"}'
```

If neither MCP nor CLI is available, stop and report `BLOCKED`. Do not silently replace graph discovery with a broad `rg`, `find`, or file-by-file scan. No agent may call or be granted a graph-deletion operation.

## Specialist routing

- `cv-site-project-manager`: read-only scope analysis, task decomposition, handoff coordination, and final synthesis.
- `nextjs-ui-content-engineer`: App Router UI, Turkish/English flows, metadata, CSS/Tailwind, responsive behavior, and accessible content presentation.
- `visual-performance-accessibility-reviewer`: read-only WebGL/Three.js, animation, reduced-motion, mobile performance, and accessibility review.
- `deployment-security-engineer`: Docker, Compose, standalone Next runtime, security headers/CSP, and runtime hardening.
- `qa-browser-validator`: read-only lint/build and browser validation for TR/EN state, cookie/localStorage behavior, four download links, responsive layouts, and WebGL fallback.
- `github-release-manager`: the only role allowed to perform approved Git or GitHub mutations and related repository-hygiene checks.

For Codex, use the closest available specialist role or a bounded worker with explicit file ownership. For Claude and OpenCode, use the persistent agents defined under their project-local agent directories.

## Protected files, personal data, and generated content

- Never read, print, modify, move, index intentionally, or delete `.env*`, credentials, certificates or keys, database/dump/sql files, private runtime state, or deployment secrets.
- `public/cv/*` and personal profile media are content-protected by default. Do not open, extract, quote, summarize, transform, or replace them unless the user explicitly requests work on the exact asset. Filename/link-existence checks are allowed when needed for validation.
- Do not inspect or edit `.git/`, `.next/`, `node_modules/`, coverage output, dependency caches, or build artifacts.
- Narrow exception: after graph discovery, an implementation agent may read only task-relevant documentation under `node_modules/next/dist/docs/` as required by the managed Next.js block. It must not inspect other dependency source.
- Do not expose personal information from CV documents, page content, logs, screenshots, or command output beyond what the user explicitly places in scope.

## Product and implementation invariants

- Preserve the four downloadable assets and their Turkish/English mapping unless the user explicitly changes that product behavior.
- Preserve accessible language switching, metadata correctness, keyboard operation, visible focus, reduced-motion behavior, responsive layouts, and a usable fallback when WebGL is unavailable.
- Prefer existing components and styles before adding new abstractions or dependencies.
- Do not claim that automated tests exist when the repository only provides lint/build checks.
- Do not add external scripts, trackers, fonts, CDNs, or new data egress without explicit user approval and a privacy/security review.

## Git, deployment, and destructive-action gates

- Read-only Git inspection is allowed. Only `github-release-manager` may run `git add`, commit, push, branch mutations, PR actions, merges, tags, releases, or remote changes.
- Every push, PR publication, merge, tag, or release needs explicit approval for that exact action.
- Docker build/restart/recreate, service changes, deploys, DNS changes, hosting changes, environment changes, and production smoke tests require separate explicit approval.
- Never revert, overwrite, clean, or reformat unrelated worktree changes. Do not use destructive Git or filesystem commands.

## Validation and handoff

For application changes, the baseline is:

```bash
npm run lint
npm run build
```

Add focused browser checks when UI, language, downloads, persistence, animation, or WebGL behavior changes. If no automated test suite exists, report that limitation explicitly rather than implying coverage.

Every specialist handoff must include:

- Owned scope and files changed or reviewed.
- Behavior affected and assumptions made.
- Validation commands and exact results.
- Security, privacy, accessibility, and responsive considerations.
- Remaining risks, blockers, and operator-approval gates.

The main agent's final response must list changed files, validation performed, unresolved risks, and any next action requiring user approval.
