# Memory.md — Active Session & Working Context

> **Living Context:** Initialized during Phase 0. Updated continuously across development sessions so context is never lost and work proceeds with zero drift.

---

## 1. Current State & Immediate Focus
- **Current Phase:** Phase 0 — Inspection, Governance & Work Breakdown
- **Current Task:** Finalizing baseline documentation files (`PRD.md`, `Architecture.md`, `Rules.md`, `Phases.md`, `Design.md`, `Memory.md`, `.gsd/SPEC.md`, `.gsd/ROADMAP.md`, `docs/SPEC.md`, `docs/DECISIONS.md`) and committing Phase 0.
- **Status:** In Progress (Documentation initialized, ready to commit and unlock Phase 1).

---

## 2. Recent Implementation Decisions & Architectural Changes
- **Architecture Locked:** Approved npm monorepo workspaces structure with `apps/web` (React 18 + Vite + Tailwind), `apps/api` (Express + TypeScript + Mongoose), and `packages/shared` (Zod schemas, DTOs, constants).
- **Embedded Database Strategy:** Configured Mongoose to support both external MongoDB via `MONGODB_URI` and automatic fallback to `mongodb-memory-server` in local development/tests so the project runs out of the box on any machine.
- **Zero Answer Leakage Guarantee:** `privateSolution` is isolated in Mongoose schema with `select: false` where appropriate, excluded from public DTO mapping, and only returned upon authoritative accusation submission.
- **Simulated Evidence Asset Engine:** Implemented high-fidelity SVG/HTML card generators for CCTV, chats, documents, and witness statements to provide an atmospheric experience without requiring expensive video generation APIs.

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
