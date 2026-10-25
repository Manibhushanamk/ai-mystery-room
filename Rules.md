# Rules.md — AI Boundaries & Operational Constraints

> **Project Rules & Governance:** Mandatory boundaries, coding conventions, and testing protocols for AI Mystery Room.

---

## 1. AI Boundaries & Do's / Don'ts

- **DO:**
  - Strictly observe the core protocol: **SPEC → PLAN → EXECUTE → VERIFY → COMMIT**.
  - Plan lock: Do not write implementation code until specification and plan are finalized.
  - Search first (`grep`, `find`) before reading whole files; read targeted ranges.
  - Execute commands individually; never chain with `&&` or `||`.
  - Maintain atomic commits: One task = one verified commit (`type(scope): description`), verified with `git log -1 --oneline`.
  - Continuously update `Memory.md` as soon as coding begins to preserve session context.
  - Guard the solution: `privateSolution` must never be sent to the client, logged in logs, or imported in frontend bundles.
  - Enforce the fictional disclaimer: All cases and generated media must be visibly labeled `FICTIONAL_SIMULATION`.
  - Run empirical validation (tests, API curls, Playwright screenshots) before claiming a task is done.

- **DON'T:**
  - Never fake or mock image/video generation without explicit labeling. If no image provider is configured, generate a high-fidelity placeholder asset.
  - Never leave any button or UI control as an unclickable or non-functional placeholder.
  - Never let the client validate the accusation; the server is the sole authority for matching `suspectId === culpritSuspectId`.
  - Never commit secrets or raw API keys to Git or `.env.example`.
  - Never display raw AI provider stack traces, prompt dumps, or internal error messages to users.
  - Never allow arbitrary user-supplied `ownerId` in request bodies.

---

## 2. Allowed vs Prohibited Dependencies

| Allowed Libraries & Tools | Prohibited / Anti-Pattern Libraries |
|---------------------------|-------------------------------------|
| Node.js 20+, Express, TypeScript | Plain JavaScript without types |
| React 18, Vite, React Router v6 | Ad-hoc frontend routing without React Router |
| Tailwind CSS v3, PostCSS, Lucide React | Mixing random CSS-in-JS libraries or conflicting CSS frameworks |
| MongoDB, Mongoose, `mongodb-memory-server` | In-memory raw objects without persistence schema |
| `@google/genai` (Official Google Gen AI SDK) | Direct unofficial scraping or unverified Gemini endpoints |
| Zod (v3) | Unvalidated `any` casting of model JSON outputs |
| Vitest, Supertest, Playwright CLI | Untested code or fake test claims |

---

## 3. Fair-Play Mystery Rules

1. **Canonical Truth First:**
   - The generation pipeline establishes the hidden solution (culprit, motive, method, master timeline) *before* public evidence is generated.
2. **Deterministic Evidence Consistency:**
   - Minimum 2 independent pieces of evidence must materially incriminate the culprit.
   - Minimum 1 piece of evidence must challenge or weaken an alternative suspect.
   - All red herrings must have an explainable innocent or misleading cause.
   - Chronology must be internally consistent.
3. **No Solution Leakage:**
   - Public DTOs must strictly omit `privateSolution`.
   - The culprit must remain completely hidden until the player submits a final accusation.
4. **One-Shot Accusation:**
   - Players confirm their choice via a modal warning.
   - Once submitted, the case transitions to `completed` and the result is immutable.

---

## 4. Error Handling & Recovery Protocols

- **AI Provider Failures:**
  - Bounded retries (maximum 3 attempts with exponential backoff).
  - On persistent failure, transition case to `failed` with a sanitized, friendly user message allowing retry or deletion.
  - Never leave cases in an infinite loading state.
- **Validation Failures:**
  - If AI-generated case output fails Zod validation or consistency checks, trigger bounded regeneration.
  - Fall back to a guaranteed coherent baseline case if the AI fails all retry attempts.
- **Database & Network Errors:**
  - Handled via centralized Express error-handling middleware.
  - Consistent error envelope: `{ error: { code, message, requestId } }`.

---

## 5. Testing & Verification Standards

- **Unit & Integration:**
  - Zod schemas tested against valid and invalid payloads.
  - Consistency validator tested with compliant and contradictory mystery fixtures.
  - Supertest verifies ownership checks, no-leak guarantees, and accusation state transitions.
- **End-to-End Browser Testing:**
  - Playwright CLI verifies scenario submission, generation status polling, evidence inspection, note taking, and accusation reveal.
- **Empirical Proof Mandate:**
  - Every commit must be backed by tangible terminal test output or Playwright screenshots.
