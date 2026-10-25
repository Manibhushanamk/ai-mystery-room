# Memory.md — Active Session & Working Context

> **Living Context:** Initialized during Phase 0. Updated continuously across development sessions so context is never lost and work proceeds with zero drift.

---

## 1. Current State & Immediate Focus
- **Current Phase:** Phase 4 — Detective Investigation UI & Workspace
- **Current Task:** Implementing frontend client library, scenario creation form, generation progress radar, 3-column detective workspace, specialized evidence card components, and investigator notebook.
- **Status:** Phase 3 completed and verified. 20/20 automated tests passing across workspaces.

---

## 2. Recent Implementation Decisions & Architectural Changes
- **Multi-Stage Gemini Pipeline:** Implemented `GeminiService` leveraging `@google/genai` with structured JSON parsing via Zod schemas, automated retries, and bounded fallback.
- **Simulated Evidence Asset Engine:** Added `EvidenceAssetService` generating dynamic SVG CCTV camera frames, timestamps, and metadata.
- **Dual AI Mode:** Seamless fallback ensures tests and local setups without live paid Gemini keys execute with 100% deterministic, fair-play mock case generation.

---

## 3. Active Working Files & Touchpoints
- `AI_Mystery_Room_Spec.md` — Authoritative SSOT product & engineering specification.
- `PRD.md` — Core requirements and user stories.
- `Architecture.md` — Architecture diagrams, data models, and boundaries.
- `Rules.md` — AI operational constraints and fair-play mystery rules.
- `Phases.md` — 7-phase step-by-step roadmap.
- `Design.md` — Visual system and evidence card specifications.
- `Memory.md` — Active working context tracking.

---

## 4. Known Blockers, Bugs, or Technical Debt
- None currently. Environment verified with Node v22.23.3 and npm v10.9.9.

---

## 5. Next Immediate Steps
1. Create `.gsd/SPEC.md`, `.gsd/ROADMAP.md`, `docs/SPEC.md`, and `docs/DECISIONS.md`.
2. Commit Phase 0 baseline with `chore(governance): initialize GSD documentation and project specification`.
3. Advance to Phase 1: Initialize workspaces root `package.json`, `packages/shared`, `apps/api`, and `apps/web`.
