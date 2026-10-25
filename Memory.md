# Memory.md — Active Session & Working Context

> **Living Context:** Initialized during Phase 0. Updated continuously across development sessions so context is never lost and work proceeds with zero drift.

---

## 1. Current State & Immediate Focus
- **Current Phase:** Production Cloud Deployment & Verified Live Release (COMPLETED)
- **Current Task:** Full deployment to Vercel via Vercel CLI, Neon Serverless Postgres integration, Groq AI LLM inference with user-key in-browser management, and GitHub synchronization.
- **Status:** Production live on Vercel at `https://ai-mystery-room-ten.vercel.app`, GitHub synchronized at `https://github.com/Manibhushanamk/ai-mystery-room.git`. All 26 unit/integration tests passing.

---

## 2. Recent Implementation Decisions & Architectural Changes
- **Vercel Serverless Architecture:** Configured root serverless entry point `api/index.ts` with ESM dynamic loading and `vercel.json` rewrites for the Vite SPA frontend.
- **Neon Serverless Postgres Database:** Integrated Neon Postgres connection pool with SSL and automated table creation (`mystery_cases` with JSONB columns). Live database connected and verified on Vercel production.
- **Groq AI Engine & Model Progression:** Implemented `GroqService` supporting candidate model sequence (`openai/gpt-oss-120b`, `openai/gpt-oss-20b`, `llama-3.3-70b-versatile`, `llama-3.1-8b-instant`), strict JSON schema outputs, and seamless fallback to deterministic mock engine.
- **User Custom Groq API Key & Guide:** Added collapsible Groq API key configuration in `ScenarioForm.tsx` with localStorage caching, `X-Groq-API-Key` header injection, and a direct tutorial on acquiring a free Groq key from `https://console.groq.com/keys`.
- **Serverless Background Resilience:** Handled serverless execution suspension by proactively advancing generation in `createCase` and `getCaseStatus`.
- **Complete Investigation Workspace:** Delivered 3-column desktop layout (`SuspectList`, `EvidenceDocket`, `TimelineView`, `NotebookView`) with responsive mobile tabs.
- **Rich Specialized Evidence Viewers:** Implemented `ChatViewer` (encrypted messaging thread), `CameraLogViewer` (CCTV telemetry + simulated SVG snapshot), `DocumentViewer` (stamped official report), and `WitnessStatementViewer` (deposition transcript with key assertions).
- **High-Friction Accusation UX:** Built `AccusationDialog` modal with explicit one-shot warning, followed by cited `RevealScreen` that ties together motive, method, evidence chain, and debunked red herrings.
- **Full Client Integration:** Connected `lib/api.ts` with transparent session management, optimistic notebook/clue marking updates, and case history dashboard.
- **Persistence & Solved Case Recovery:** Added `GET /api/v1/cases/:caseId/reveal` allowing detectives who solved a case to reload and inspect the solution breakdown without re-triggering the one-shot accusation.
- **Playwright Test Suite:** Automated headless Chromium user journey verification with 6 visual screenshot captures stored in artifacts.

---

## 3. Active Working Files & Touchpoints
- `AI_Mystery_Room_Spec.md` — Authoritative SSOT product & engineering specification.
- `PRD.md` — Core requirements and user stories.
- `Architecture.md` — Architecture diagrams, data models, and boundaries.
- `Rules.md` — AI operational constraints and fair-play mystery rules.
- `Phases.md` — 7-phase step-by-step roadmap (all 7 phases marked Completed).
- `Design.md` — Visual system and evidence card specifications.
- `Memory.md` — Active working context tracking.
- `README.md` — Comprehensive production guide and setup documentation.

---

## 4. Known Blockers, Bugs, or Technical Debt
- Zero blockers. All 24 unit/integration tests and 2 Playwright E2E browser tests pass cleanly.
- Dual-mode database cleanly connects to live MongoDB when present or boots an in-memory replica via `mongodb-memory-server` without external dependencies.

---

## 5. Next Immediate Steps
1. Final atomic git commit for Phase 6 and final project documentation.
2. Confirm commit with `git log -1 --oneline`.
3. Provide full completion debrief and verification walkthrough to user.
