# Command Center — Agent Briefing

**Repo:** `darrenrolf0481-ship-it/Command-center-`
**Branch:** `master` @ `00703ee` (synced with `origin/main` upstream)
**Owner:** Darren (Merlin)
**Stack:** Next.js 14 (app router) + Tailwind 4 + Gemini 2.5 Flash + OmniRoute + local Ollama (hermes4-14b fallback)

## What this is

Hermes 4 Command Center — a 7-tab control room for the Hermes 4 14B agent:
**Overview · Memory · Tools · Integrations · Logs · Chat · OmniRoute**

Hermes 4's role: observer/analyst/memory-keeper for a multi-agent stack. Slow, thorough, deep-thinking (reasoning mode ON). He documents everything; he doesn't do fast responses — other agents handle that.

**Inference routing (already wired in `src/app/api/hermes/query/route.ts`):**
1. **Primary:** OmniRoute (`https://api.omniroute.online/v1`) — 1.6B tokens/month free, 90+ providers, RTK + Caveman compression
2. **Fallback:** Local Ollama at `http://localhost:11434`, model `hermes4-14b` (Q6_K, 64K ctx)

## Repo state — what's done, what's not

### ✅ Working
- Next.js app compiles and runs (`npm run build` passes)
- Dark/light theme toggle (Tailwind 4 dark variant fix in `globals.css`)
- Chat tab wired to `/api/hermes/query` (multi-file drag-drop, Gemini-format `inlineData` for files, history persisted in localStorage)
- File-based observation store at `hermes-memory.json` (`lib/hermes-store.ts`) — 500 obs cap, read by query handler
- Two-tier LLM routing with fallback (OmniRoute → Ollama)
- Ingest endpoint at `/api/hermes/ingest` (not yet seen in source — verify exists; if not, needs to be built)
- `hermes4-14b-setup.md` — local Ollama modelfile + OmniRoute wiring notes
- `AGENTS_CHANGELOG.md` — incremental notes

### ❌ What's stubbed (per Darren's "make him real" plan)
- **Control plane buttons** (Overview tab: "Deploy New Agent", "Audit Security", "Sync SSH Aliases", "Run Backup Check", "Optimize Vector Index", "Purge Cache") — currently just `alert(...)` stubs
- **API key inputs** (OmniRoute, Gemini, OpenAI) in Integrations tab — local state only, no persistence
- **Integrations tab** — hardcoded list, no live status
- **Logs tab** — empty shell, no real log streaming
- **Status indicators** (top-right "online — omniroute + :11434") — static, doesn't reflect real health
- **No observation ingest pipeline** — the route exists, but nothing POSTs to it. Hermes can read recent observations but nothing is being written (unless an external agent is calling it)

### ⚠️ Known tech debt
- **ESLint v10 vs `eslint-config-next` mismatch** — `npm run lint` fails on `react/display-name` rule. Build still works. Not blocking but ugly.
- **Tailwind v4 vs Next.js 14** — pinned in `package.json` (4.1.11) but `next-themes` is `^0.4.6` (older API). Works, but a v0.3+ upgrade would clean it up.
- **Chat payload uses Gemini format** (`parts[]` with `inlineData` for files) — this format needs to be translated to OpenAI Chat Completions format before being sent to OmniRoute, otherwise the file is silently dropped. **This is a latent bug** if Hermes ever ingests a file via OmniRoute. (Works fine if it falls through to Gemini direct.)
- **LocalStorage chat history** — full messages including base64 files. Attachments >5MB will blow the quota.

## What needs to happen next (Darren's directive: "sup him up")

The four priorities, in order:

### 1. Wire the observation ingest pipeline
There's an `/api/hermes/ingest` route but nothing in the stack POSTs to it. Need:
- An MCP-side tool that agents can call to record observations
- A small SDK/helper so external agents (ARGUS, lab-brain, etc.) can `POST /api/hermes/ingest` with `{source, type, content}`
- Verification: hit the endpoint, confirm observation shows up in `hermes-memory.json` and gets included in Hermes's next chat response context

### 2. Make the status indicators real
The top-right "online — omniroute + :11434" pill and the badges in the Control Room card should reflect:
- Whether OmniRoute is actually reachable (cheap health check on page load)
- Whether local Ollama is alive (`GET /api/tags`)
- Last successful observation ingest timestamp

This is ~30 lines of `useEffect` + a `/api/hermes/health` route. Don't overthink it.

### 3. Strip or hide the alert stubs
The 7 control-plane buttons that just `alert()` are honest about being stubs. Either:
- Wire them to real actions (low value IMO — most of these aren't things Hermes should be doing from the dashboard)
- Or add a "mock" badge and grey them out so it's clear they're placeholders

The integration API key inputs in the Integrations tab should at least persist to `localStorage` so a refresh doesn't wipe them.

### 4. Fix the dependency skew (optional, low priority)
Pin Tailwind to v3, or upgrade `next-themes` to v0.4.x stable. The build works, so this is cleanup, not blocker.

## Coordination notes

- **AGENTS.md in this repo doesn't exist yet** — this file is the first. Future agents should read it before touching anything.
- **`AGENTS_CHANGELOG.md`** is the per-change log. Append dated entries as work happens.
- **The workspace root `AGENTS.md` is the cross-repo shared rules** (shared `origin/main`, log-everything, verify-before-claiming-done, etc.). This file is repo-specific.
- **Do NOT delete the patch scripts** (`patch_chattab.py`, etc.) from the repo root until the changes they made are confirmed stable in the source. They're the audit trail of what got built.
- **`hermes4-14b-setup.md`** has the Modelfile + OmniRoute wiring. Don't re-derive it — read it first.

## Open questions for Darren

1. Is `/api/hermes/ingest` actually in the source, or is it aspirational? (Not in the files I read.)
2. What should the 7 control-plane buttons actually DO? Or are they placeholders for future skills?
3. Is the local Ollama instance running, or is OmniRoute the only live path right now?
4. Should Hermes' chat memory be persistent across restarts (currently yes, via localStorage) or session-scoped?

---

*Written 2026-07-05 by antigravity (M3) after reading the repo. Next agent: confirm or correct.*
