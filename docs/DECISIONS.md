# Architecture Decision Records (ADRs) — AI Mystery Room

## ADR 001: Monorepo Architecture with npm Workspaces
- **Date:** 2026-10-25
- **Context:** The project requires a React frontend, an Express backend, and shared TypeScript contracts/Zod schemas.
- **Decision:** Use npm workspaces (`apps/web`, `apps/api`, `packages/shared`) at the root repository level.
- **Consequences:** Ensures single source of truth for schemas, zero duplication of types, and fast local development.

## ADR 002: Dual Database Adapter (External MongoDB + In-Memory Fallback)
- **Date:** 2026-10-25
- **Context:** Local developer machines or CI environments may not always have a running MongoDB daemon or Docker.
- **Decision:** Use Mongoose with conditional initialization: if `MONGODB_URI` connects successfully, use it; otherwise automatically spin up `mongodb-memory-server` in development and testing.
- **Consequences:** Seamless developer onboarding with zero manual database configuration required, while fully production-compatible.

## ADR 003: High-Fidelity Simulated Evidence Asset Engine
- **Date:** 2026-10-25
- **Context:** The spec requires rich evidence cards (CCTV logs, chat transcripts, documents, witness statements) without depending on expensive, slow, or hallucinating video-generation models for the MVP.
- **Decision:** Implement dedicated SVG/HTML/CSS simulated evidence renderers with authentic timestamps, scanlines, chat bubbles, and classified police stamps.
- **Consequences:** Instant rendering, 100% reliable layout, zero external video generation billing, and adherence to the fair-play rule.

## ADR 004: Server-Authoritative Accusation & Zero Leakage DTO
- **Date:** 2026-10-25
- **Context:** Players should not be able to peek at the answer via browser developer tools or network payloads.
- **Decision:** `privateSolution` is never returned in public case endpoints. The client submits only `{ suspectId }` and the server compares it against the stored culprit and generates the reveal only after transitioning status to `completed`.
- **Consequences:** Cheat-proof game mechanics and strict separation between public and private case models.
