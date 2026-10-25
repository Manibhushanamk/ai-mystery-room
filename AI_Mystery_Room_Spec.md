# AI Mystery Room --- Product & Engineering Specification

**Document type:** Single Source of Truth (SSOT) for spec-driven
development\
**Status:** Initial implementation specification\
**Version:** 1.0\
**Primary implementation agent:** OpenAI Codex\
**Product name:** AI Mystery Room

> This document is authoritative for product behavior, architecture,
> data contracts, acceptance criteria, and implementation boundaries. If
> code, UI, or secondary notes conflict with this document, follow this
> specification. Record material changes here before implementing them.

------------------------------------------------------------------------

## 1. Product Summary

AI Mystery Room is a web application that turns a user-provided short
scenario or story seed into a fictional, AI-generated investigation. The
AI creates a coherent mystery with a hidden culprit, a cast of
characters, a timeline, and an evidence packet. Evidence may include
fictional chat messages, images, CCTV-style recordings or transcripts,
witness statements, reports, and other clues. The player examines the
evidence and selects who they believe committed the crime or caused the
incident.

The experience should feel like solving a case, not reading an AI essay.
Evidence must be discoverable, internally consistent, and sufficient to
reach a defensible answer. The culprit and solution must remain hidden
until the player submits a final accusation or explicitly reveals the
solution.

### 1.1 Product goals

-   Let a user create a mystery from a short prompt with minimal
    friction.
-   Generate a playable, internally consistent case with a predetermined
    culprit and evidence.
-   Present evidence in an immersive, readable investigation workspace.
-   Let the user inspect evidence, take notes, review suspects, and
    submit one final accusation.
-   Explain the solution after submission, citing specific evidence.
-   Persist cases and player progress for signed-in users; allow guest
    play if practical.
-   Handle AI failures, malformed model output, and unsafe or unsuitable
    prompts gracefully.

### 1.2 Non-goals for the initial release

-   Real-world investigations, real accusations, or claims about actual
    people.
-   Live access to real WhatsApp accounts, CCTV systems, private
    messages, or devices.
-   User-uploaded real surveillance footage analysis.
-   Multiplayer, competitive rankings, public case sharing,
    user-generated marketplace, or payments.
-   Autonomous browser/device actions.
-   Perfect photorealistic video generation. The first version may use
    AI-generated still images, fictional text transcripts, and clearly
    labeled simulated recording assets.

### 1.3 Core product principles

1.  **Fiction is explicit:** every case and generated artifact is
    labeled fictional/simulated.
2.  **Fair mystery:** the solution is established before evidence is
    shown; evidence cannot be retroactively changed to fit the user's
    guess.
3.  **Evidence-led reveal:** the final explanation cites evidence IDs
    and explains both incriminating and exculpatory clues.
4.  **No answer leakage:** the culprit, solution rationale, or hidden
    fields must never be sent to the client before submission.
5.  **Reliable over flashy:** if an asset cannot be generated, use a
    labeled fallback rather than blocking the whole case.
6.  **Provider abstraction:** Gemini is the initial AI provider, but AI
    calls must be isolated behind a service layer.

------------------------------------------------------------------------

## 2. Users and Primary Journey

### 2.1 Primary user

A person who enjoys detective stories, puzzle games, escape rooms,
deduction games, or interactive fiction.

### 2.2 Main user journey

1.  Open the landing page.
2.  Select **Create a Mystery**.
3.  Enter a short scenario/story seed and optionally configure genre,
    difficulty, setting, and evidence types.
4.  Submit the request.
5.  See a generation/progress screen with honest status updates.
6.  The backend generates and validates the case package.
7.  Enter the investigation room and inspect the case briefing,
    suspects, timeline, and evidence.
8.  Compare evidence, add notes, and optionally mark clues as important.
9.  Choose a suspect and submit the final accusation.
10. Receive a result: correct/incorrect, a spoiler-safe explanation,
    evidence references, and a replay/new-case action.

### 2.3 Secondary journey

A returning user opens **My Cases**, resumes an unfinished case, reviews
a completed case, or starts a new one.

------------------------------------------------------------------------

## 3. Functional Requirements

Requirements use IDs so they can be referenced in issues and tests.

### 3.1 Landing and case creation

-   **FR-001:** Show the product name, concise explanation, primary CTA,
    and a visible fictional-content notice.
-   **FR-002:** Provide a scenario input with a recommended length of
    50--1,000 characters and a hard maximum of 2,000 characters.
-   **FR-003:** Provide optional settings:
    -   Genre: `classic_mystery`, `locked_room`, `campus`, `workplace`,
        `heist`, `sci_fi`, `thriller`.
    -   Difficulty: `easy`, `medium`, `hard`.
    -   Setting: free text, optional, max 120 characters.
    -   Evidence preferences: `chat`, `image`, `camera_log`,
        `witness_statement`, `document`, `timeline`.
-   **FR-004:** Defaults: genre `classic_mystery`, difficulty `medium`,
    setting inferred by AI, and all evidence types available.
-   **FR-005:** Validate input in the browser and again on the server.
    Do not rely on client-side validation alone.
-   **FR-006:** Show a clear error if the prompt is empty, exceeds
    limits, or cannot be processed.
-   **FR-007:** A case creation request must be idempotent where
    practical, so retries do not accidentally create multiple cases.
-   **FR-008:** Never claim generation is complete until the case has
    passed server-side validation and is persisted.

### 3.2 Case generation

-   **FR-010:** Generate a case title, short premise, incident summary,
    setting, incident time, case briefing, and 3--6 suspects.
-   **FR-011:** Each suspect has a stable ID, display name, role, short
    bio, public motive/relationship, and initial alibi. Do not reveal
    hidden truth in public fields.
-   **FR-012:** The backend must establish the culprit, motive, method,
    timeline, and solution before generating player-visible evidence.
-   **FR-013:** Generate 6--12 evidence items by default. The count may
    be adjusted by difficulty.
-   **FR-014:** Evidence must be internally consistent with the
    canonical hidden solution and master timeline.
-   **FR-015:** Include a mixture of supporting, misleading-but-fair,
    neutral, and exculpatory clues. Red herrings must be explainable and
    must not depend on arbitrary facts revealed only after the answer.
-   **FR-016:** The evidence set must contain enough clues to
    distinguish the culprit from other suspects.
-   **FR-017:** Generate a solution explanation with evidence
    references, but store it in a private server-only field until the
    player submits.
-   **FR-018:** Validate model output against a strict schema. Retry a
    bounded number of times on schema failure; then return a recoverable
    error or use a safe fallback.
-   **FR-019:** If a preferred evidence asset cannot be generated, keep
    the case playable using a text-based simulation clearly labeled as
    such.
-   **FR-020:** Generation status must be represented by explicit
    states: `queued`, `generating_outline`, `generating_evidence`,
    `validating`, `ready`, `failed`.
-   **FR-021:** Do not stream or return hidden solution fields in
    progress messages, logs exposed to the client, or error payloads.

### 3.3 Investigation room

-   **FR-030:** Show the case title, briefing, incident details,
    suspects, evidence library, timeline, notes, and accusation action.
-   **FR-031:** Evidence can be opened in a detail view with
    type-specific layout.
-   **FR-032:** Chat evidence appears as a fictional conversation with
    timestamps and sender labels; it must not imitate access to a real
    account.
-   **FR-033:** Camera evidence appears as a simulated recording card,
    optionally with a generated still image, timestamps, camera
    location, and a transcript/event log. Do not imply a real video was
    captured.
-   **FR-034:** Image evidence includes a caption and clue description
    without automatically spelling out the solution.
-   **FR-035:** Users can mark evidence as important and add/edit
    personal notes.
-   **FR-036:** Evidence can be filtered by type and sorted by
    chronology.
-   **FR-037:** Users can revisit evidence and suspects before final
    submission.
-   **FR-038:** A case must remain usable if optional images fail to
    load; provide an accessible placeholder and descriptive alt text.
-   **FR-039:** Clearly distinguish confirmed facts, witness claims, and
    investigator interpretations.

### 3.4 Accusation and reveal

-   **FR-040:** User selects exactly one suspect and submits a final
    accusation.
-   **FR-041:** The server compares the submitted suspect ID with the
    stored culprit ID. The client must never perform the authoritative
    comparison.
-   **FR-042:** For the initial release, a final accusation is one-shot.
    Confirm with a dialog before submission. Do not allow changing the
    answer after reveal.
-   **FR-043:** After submission, reveal whether the accusation was
    correct, the culprit, motive, method, event sequence, and
    explanation.
-   **FR-044:** The solution must cite evidence IDs and explain how
    those clues support the conclusion.
-   **FR-045:** Explain significant red herrings and why alternative
    suspects are less likely.
-   **FR-046:** Do not award points for guessing before inspecting
    evidence unless a later product decision explicitly adds that
    mechanic.
-   **FR-047:** Store the result and submission timestamp so the
    completed case can be reviewed.

### 3.5 Accounts and case history

-   **FR-050:** The app may support guest play in the MVP. Guest
    sessions must use a secure server-issued identifier, not a trusted
    arbitrary user ID from the client.
-   **FR-051:** If authentication is implemented, use established
    authentication/session practices and never store raw passwords.
-   **FR-052:** Signed-in users can list their own cases and resume
    unfinished cases.
-   **FR-053:** A user may only read, update, or submit an accusation
    for a case they own or are authorized to access.
-   **FR-054:** Define retention and deletion behavior before public
    launch. Provide a way to delete user-associated cases if accounts
    are supported.

### 3.6 Errors and empty states

-   **FR-060:** Provide clear states for no cases, loading, generation
    failure, unavailable evidence asset, network failure, and
    unauthorized access.
-   **FR-061:** Retry actions must be explicit and safe.
-   **FR-062:** Never display raw provider errors, API keys, stack
    traces, database details, or internal prompts to the user.
-   **FR-063:** If generation fails after a case record is created, mark
    it failed and allow retry or deletion; do not leave it permanently
    loading.

------------------------------------------------------------------------

## 4. Mystery Quality Rules

These rules are product-critical, not optional polish.

### 4.1 Canonical truth first

The generation pipeline must create a private canonical case solution
before creating any public evidence. All evidence is generated from that
canonical case. The model must not independently invent a different
truth for each evidence item.

### 4.2 Fair-play constraints

-   At least 2 independent evidence items should materially support the
    culprit's identification.
-   At least 1 clue should challenge or weaken a plausible alternative
    suspect.
-   Each suspect should have a plausible reason to be investigated, but
    only the culprit should fit the full evidence set.
-   All times must be chronologically possible, accounting for time
    zones only if the case explicitly uses them.
-   No critical clue may rely on an unexplained coincidence or on
    information absent from the case.
-   The reveal must cite existing evidence IDs only.
-   Evidence must not contradict canonical facts unless the
    contradiction is explicitly a witness lie, faulty clock, unreliable
    record, or deliberate deception that is explained in the solution.
-   A case that fails consistency validation must not be published as
    `ready`.

### 4.3 Difficulty guidance

-   **Easy:** 3--4 suspects, 6--8 evidence items, explicit clues, few
    red herrings.
-   **Medium:** 4--5 suspects, 8--10 evidence items, moderate inference,
    1--2 fair red herrings.
-   **Hard:** 5--6 suspects, 10--12 evidence items, subtler links, more
    ambiguous testimony, but still logically solvable.

### 4.4 Fiction and sensitive content

-   The product is for fictional entertainment, not a tool for accusing
    real people.
-   Do not use real personal details supplied in prompts to create
    defamatory allegations about identifiable people.
-   If the user requests a case targeting a real person, redirect toward
    fictional characters and invented details.
-   Avoid graphic violence by default. Keep the default tone suitable
    for a broad audience.
-   Clearly label generated chat logs, images, and camera logs as
    fictional/simulated.
-   Do not claim that a generated image or recording is authentic
    evidence.

------------------------------------------------------------------------

## 5. Technical Architecture

### 5.1 Stack

-   **Frontend:** React, Vite, TypeScript, React Router.
-   **Styling:** Tailwind CSS or CSS Modules. Pick one styling approach
    at project initialization and use it consistently; do not mix ad hoc
    styling systems.
-   **Backend:** Node.js, Express, TypeScript.
-   **Database:** MongoDB with Mongoose.
-   **AI provider:** Google Gemini API, called only from the backend.
-   **Validation:** Zod for request and AI response schemas.
-   **Testing:** Vitest for frontend/unit tests, Supertest for API
    tests, and Playwright for critical end-to-end flows.
-   **Package manager:** npm workspaces unless the repository already
    establishes another convention.
-   **Deployment:** Frontend and API can be deployed separately; use
    environment-specific configuration.

If the repository already exists, inspect it before scaffolding.
Preserve working conventions unless they conflict with this
specification; document any necessary deviation.

### 5.2 High-level architecture

1.  React client submits a case request to Express.
2.  Express validates and authorizes the request.
3.  A case-generation service creates a database record and coordinates
    the generation pipeline.
4.  A Gemini adapter produces structured content.
5.  Server-side validators check schema, chronology, suspect/evidence
    references, and solution consistency.
6.  Validated public fields and private solution fields are stored
    separately within a case document or related documents.
7.  The client polls a status endpoint until the case is ready, then
    fetches only public case data.
8.  Accusation submission is checked on the server and the solution is
    returned only after the state transition to completed.

### 5.3 Suggested repository layout

``` text
ai-mystery-room/
  apps/
    web/
      src/
        app/
        components/
        features/
          case-creation/
          investigation/
          evidence/
          accusation/
          case-history/
        hooks/
        lib/
        routes/
        styles/
      public/
      tests/
    api/
      src/
        config/
        middleware/
        routes/
        controllers/
        services/
          case-generation/
          mystery-validation/
          evidence-assets/
          ai/
        models/
        schemas/
        utils/
        app.ts
        server.ts
      tests/
  packages/
    shared/
      src/
        schemas/
        types/
        constants/
  docs/
    SPEC.md
  .env.example
  package.json
  README.md
```

### 5.4 Backend boundaries

-   Routes handle HTTP wiring only.
-   Controllers translate request/response data and call services.
-   Services contain business logic.
-   Models define persistence only.
-   AI adapters handle Gemini-specific API interaction and response
    parsing.
-   Shared schemas/types are reused where safe, but private solution
    types must not be imported into frontend bundles.
-   Never put Gemini API calls in React components or expose the API key
    to the browser.

------------------------------------------------------------------------

## 6. Data Model

Use Mongoose schemas with timestamps, indexes, explicit enums, and
validation. Names below describe the logical contract; implementation
may normalize into multiple collections if needed.

### 6.1 MysteryCase

``` ts
type CaseStatus =
  | "queued"
  | "generating_outline"
  | "generating_evidence"
  | "validating"
  | "ready"
  | "failed"
  | "completed";

interface MysteryCase {
  _id: ObjectId;
  ownerId: string;                 // authenticated user or server-issued guest owner
  title: string;
  scenarioSeed: string;
  genre: string;
  difficulty: "easy" | "medium" | "hard";
  setting: string;
  status: CaseStatus;
  publicCase: {
    premise: string;
    incidentSummary: string;
    incidentTime: string;          // ISO 8601
    briefing: string;
    suspects: PublicSuspect[];
    evidence: PublicEvidence[];
    timeline: PublicTimelineEvent[];
  };
  privateSolution: {
    culpritSuspectId: string;
    motive: string;
    method: string;
    canonicalTimeline: CanonicalTimelineEvent[];
    solutionExplanation: string;
    evidenceReasoning: Array<{
      evidenceId: string;
      explanation: string;
      supports: string[];           // suspect IDs or propositions
      effect: "supports_culprit" | "weakens_alternative" | "red_herring" | "context";
    }>;
  };
  generation: {
    stage: string;
    attempts: number;
    lastErrorCode?: string;         // sanitized, no secret/provider payload
    model?: string;
    startedAt?: Date;
    completedAt?: Date;
  };
  playerState: {
    markedEvidenceIds: string[];
    notes: Array<{ evidenceId?: string; text: string; updatedAt: Date }>;
    accusation?: {
      suspectId: string;
      submittedAt: Date;
      correct: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**Security boundary:** `privateSolution` must never be included in
ordinary case API responses, populated into frontend-facing serializers,
or logged in plaintext application logs. Prefer separate private fields
with explicit DTO mapping, or a separate private solution collection if
that reduces accidental exposure.

### 6.2 PublicSuspect

``` ts
interface PublicSuspect {
  id: string;                       // stable case-local ID, e.g. "suspect_01"
  name: string;                     // fictional name
  role: string;
  bio: string;
  relationshipToIncident: string;
  publicMotive: string;
  statedAlibi: string;
  portraitAsset?: EvidenceAsset;
}
```

### 6.3 PublicEvidence

``` ts
type EvidenceType =
  | "chat"
  | "image"
  | "camera_log"
  | "witness_statement"
  | "document"
  | "timeline";

interface PublicEvidence {
  id: string;                       // stable case-local ID, e.g. "evidence_01"
  type: EvidenceType;
  title: string;
  description: string;
  createdAtInStory: string;         // ISO 8601 or explicit story-local time
  sourceLabel: string;              // e.g. "Simulated chat export"
  reliability: "high" | "medium" | "low" | "unknown";
  content: Record<string, unknown>; // validate by evidence type
  asset?: EvidenceAsset;
  fictionalLabel: "FICTIONAL_SIMULATION";
}
```

Evidence `content` must use a discriminated union in code;
`Record<string, unknown>` above is only a simplified overview.

### 6.4 Evidence asset

``` ts
interface EvidenceAsset {
  kind: "generated_image" | "placeholder";
  url?: string;
  altText: string;
  mimeType?: string;
  status: "ready" | "pending" | "failed" | "placeholder";
}
```

### 6.5 Data integrity

-   Add indexes for `ownerId`, `status`, and `createdAt`.
-   Ensure all suspect IDs referenced by solution/evidence exist in the
    case.
-   Ensure all evidence IDs referenced by the solution exist.
-   Validate all story timestamps and event ordering.
-   Enforce one final accusation per case at the service/database level.
-   Do not trust IDs or owner IDs supplied by the browser without
    server-side ownership checks.

------------------------------------------------------------------------

## 7. AI Generation Pipeline

### 7.1 Pipeline stages

1.  **Normalize input:** trim whitespace, enforce length, normalize
    option values.
2.  **Create job record:** save a `queued` case with owner and settings.
3.  **Generate canonical outline:** title, setting, incident, suspects,
    culprit, motive, method, and full timeline.
4.  **Validate outline:** schema checks, unique suspect IDs, plausible
    timeline, one culprit, non-identifying fictional characters.
5.  **Generate evidence plan:** define evidence IDs, types, timestamps,
    clue purpose, source reliability, and expected inference.
6.  **Generate evidence content:** generate each item from the same
    canonical outline and evidence plan.
7.  **Generate public timeline and solution explanation:** maintain
    consistent timestamps and references.
8.  **Run consistency checks:** verify IDs, facts, timeline, suspect
    references, and sufficient evidence.
9.  **Optional asset generation:** generate images only if a supported
    image-generation endpoint is configured. Otherwise create
    placeholders. Gemini text generation alone must not be represented
    as image generation.
10. **Persist validated case:** mark `ready` only after all required
    checks pass.
11. **Serve public DTO:** exclude private solution and internal prompts.
12. **Reveal after accusation:** atomically store the answer and return
    the solution.

### 7.2 Gemini integration

-   Use the official Google Gen AI SDK supported by the selected Node.js
    runtime.
-   Read the API key from `GEMINI_API_KEY` on the server only.
-   Configure the model name using `GEMINI_MODEL`; do not scatter a
    hard-coded model ID across the codebase.
-   Request structured JSON output where supported, but still parse and
    validate the returned content.
-   Add timeout, bounded retries with backoff, cancellation where
    possible, and clear error mapping.
-   Do not retry non-retryable validation or safety errors indefinitely.
-   Log request IDs, durations, stages, and sanitized error codes; do
    not log API keys, full private solution prompts, or sensitive user
    content unnecessarily.
-   Keep system instructions and prompt templates in version-controlled
    server files.
-   Treat user story text as untrusted input. It must not override
    system instructions or request secrets.
-   Apply token/output limits and avoid excessive model calls. Prefer a
    small number of coherent structured generations over one call per
    tiny clue.

### 7.3 Output schemas

Use Zod schemas for: - `CaseOutlineSchema` - `EvidencePlanSchema` -
`GeneratedEvidenceSchema` - `MysteryValidationReportSchema` -
`PublicCaseResponseSchema` - `SolutionRevealSchema`

The model's response is untrusted until validated. Never cast raw model
output directly to a TypeScript interface.

### 7.4 Consistency validator

Implement deterministic checks first: - required fields present; -
suspect and evidence IDs unique; - exactly one culprit; - all referenced
IDs exist; - timestamps parse and meet ordering rules; - evidence
timestamps align with canonical timeline; - every key solution claim
references at least one evidence item; - no public field contains
private solution keys or an obvious culprit/motive spoiler; - evidence
count is within configured limits; - every evidence item has the
fictional label.

Use a second AI critique pass only as an additional quality check, not
as the sole validator. If validation fails after bounded regeneration,
fail gracefully instead of publishing a broken mystery.

### 7.5 Image and camera assets

For MVP, image and camera items can be rendered as convincing but
explicitly simulated evidence cards. Actual generated images require a
configured image-capable provider/endpoint, storage destination, and
moderation policy. Keep asset generation behind `EvidenceAssetService`;
do not assume the text model returns image files. Do not generate or
imply real CCTV video unless a real video-generation provider is
explicitly selected and configured.

------------------------------------------------------------------------

## 8. API Contract

Base path: `/api/v1`. All responses use JSON. Use a consistent error
shape.

### 8.1 Create a case

`POST /api/v1/cases`

Request:

``` json
{
  "scenario": "A valuable prototype disappears from a locked university lab the night before a demo.",
  "genre": "campus",
  "difficulty": "medium",
  "setting": "A fictional engineering college",
  "evidencePreferences": ["chat", "image", "camera_log", "witness_statement", "document", "timeline"]
}
```

Response: `202 Accepted`

``` json
{
  "caseId": "CASE_ID",
  "status": "queued",
  "statusUrl": "/api/v1/cases/CASE_ID/status"
}
```

The actual ID is generated by the server. Do not use the placeholder in
production.

### 8.2 Get generation status

`GET /api/v1/cases/:caseId/status`

Response:

``` json
{
  "caseId": "CASE_ID",
  "status": "generating_evidence",
  "stage": "Creating evidence packet",
  "progress": 55,
  "error": null
}
```

Progress is approximate and must not imply precise certainty. `error`
contains only a safe user-facing message/code.

### 8.3 Get public case

`GET /api/v1/cases/:caseId`

Returns case metadata, public briefing, public suspects, public
evidence, public timeline, and player's own progress. It must not return
`privateSolution`, culprit IDs, hidden motive/method, internal prompts,
validation notes, or secret answer keys.

### 8.4 Update player notes/marked evidence

`PATCH /api/v1/cases/:caseId/player-state`

Request:

``` json
{
  "markedEvidenceIds": ["evidence_02"],
  "notes": [
    { "evidenceId": "evidence_02", "text": "The timestamp conflicts with the witness statement." }
  ]
}
```

Validate evidence IDs against the case. Enforce ownership and reasonable
limits on note length/count.

### 8.5 Submit accusation

`POST /api/v1/cases/:caseId/accusation`

Request:

``` json
{
  "suspectId": "suspect_03"
}
```

Behavior: - Authenticate/authorize owner. - Verify case status is
`ready`. - Verify suspect belongs to the case. - Reject if an accusation
has already been submitted. - Compare answer on server. - Atomically
transition case to `completed` and save result. - Return the reveal only
after successful submission.

Response:

``` json
{
  "result": "correct",
  "selectedSuspectId": "suspect_03",
  "culprit": {
    "suspectId": "suspect_03",
    "name": "Fictional Character"
  },
  "motive": "...",
  "method": "...",
  "solutionExplanation": "...",
  "evidenceReasoning": [
    {
      "evidenceId": "evidence_02",
      "explanation": "..."
    }
  ]
}
```

### 8.6 List user's cases

`GET /api/v1/cases?cursor=...&limit=20`

Return only cases the current user/session may access. Enforce `limit`
between 1 and 50. Use cursor pagination for larger lists.

### 8.7 Delete a case

`DELETE /api/v1/cases/:caseId`

Authorize ownership. Define whether deletion is soft or hard and clean
up owned assets if applicable. Return `204 No Content` on success.

### 8.8 Error response

``` json
{
  "error": {
    "code": "CASE_NOT_READY",
    "message": "This mystery is not ready yet. Please try again shortly.",
    "requestId": "server-generated-request-id"
  }
}
```

Suggested codes: `VALIDATION_ERROR`, `UNAUTHENTICATED`, `FORBIDDEN`,
`CASE_NOT_FOUND`, `CASE_NOT_READY`, `ALREADY_SUBMITTED`,
`AI_PROVIDER_UNAVAILABLE`, `AI_OUTPUT_INVALID`, `RATE_LIMITED`,
`INTERNAL_ERROR`.

------------------------------------------------------------------------

## 9. Frontend UX and Visual Direction

### 9.1 Design goal

Create a polished detective-workspace experience: atmospheric, focused,
readable, and responsive. Use restrained cinematic styling rather than
cluttered "hacker" visuals. Evidence must remain easy to read.

### 9.2 Main screens

1.  **Landing page:** product introduction, how it works, sample
    evidence preview, create CTA, fictional-content notice.
2.  **Create case:** scenario textarea, settings controls, input limits,
    generate button.
3.  **Generation screen:** current stage, progress indicator,
    cancel/leave behavior, recoverable error state.
4.  **Investigation room:** briefing panel, suspect list, evidence
    library, timeline, notes, filters, accusation CTA.
5.  **Evidence detail:** readable content based on type, timestamp,
    source, reliability, fictional label, mark-as-important control.
6.  **Accusation confirmation:** selected suspect, clear warning that
    this is final, confirm/cancel.
7.  **Reveal screen:** result, culprit profile, motive/method, ordered
    explanation, referenced evidence, new mystery/replay actions.
8.  **My cases:** case cards, status, created date, resume/review/delete
    actions.
9.  **Not found/error states:** consistent navigation and recovery.

### 9.3 Layout behavior

-   Desktop: investigation workspace may use a three-column layout
    (suspects / evidence / case notes or timeline).
-   Tablet: collapse to two columns with accessible panels.
-   Mobile: single-column layout with tabs or drawers; no essential
    functionality may depend on hover.
-   Preserve reading order and keyboard navigation.
-   Use clear visual differences between a suspect's claim, a recorded
    artifact, and an investigator note.
-   Provide loading skeletons only when useful; avoid fake progress
    precision.

### 9.4 Accessibility

-   Aim for WCAG 2.2 AA.
-   Semantic HTML, visible focus, keyboard-operable controls, sufficient
    contrast, form labels, and accessible dialogs.
-   Images need meaningful alt text; decorative images use empty alt
    text.
-   Do not convey reliability or result using color alone.
-   Respect reduced-motion preferences.
-   Keep body text comfortable to read and timestamps unambiguous.

### 9.5 Suggested reusable components

`AppShell`, `CaseCard`, `ScenarioForm`, `GenerationProgress`,
`CaseBriefing`, `SuspectCard`, `SuspectList`, `EvidenceCard`,
`EvidenceViewer`, `ChatTranscript`, `CameraLogViewer`, `Timeline`,
`EvidenceFilters`, `InvestigatorNotes`, `AccusationDialog`,
`SolutionReveal`, `EmptyState`, `ErrorState`, `FictionalContentBadge`.

------------------------------------------------------------------------

## 10. Security, Privacy, and Reliability

-   Keep `GEMINI_API_KEY`, MongoDB credentials, session secrets, and
    storage credentials server-side.
-   Use HTTPS in production and secure, HTTP-only, same-site cookies if
    cookie-based sessions are used.
-   Add rate limiting to case creation and AI-backed endpoints.
-   Apply request size limits, schema validation, safe error handling,
    and security headers.
-   Sanitize or safely render user-provided text. Never render
    generated/user content as raw HTML.
-   Enforce authorization on every case read/write endpoint.
-   Prevent IDOR by checking case ownership in the service layer.
-   Avoid storing more personal data than needed.
-   Add a privacy notice describing AI processing and retention before
    public release.
-   Set generation timeouts and per-user limits to control cost and
    abuse.
-   Handle Gemini quota/rate limits and MongoDB/network failures.
-   Use structured logs with request IDs and no secrets.
-   Store generated assets in a controlled storage service if assets
    need persistence; do not assume local disk is durable in serverless
    deployments.
-   Do not expose private solution data through API responses, error
    logs, browser bundles, source maps, analytics, or client-side state.
-   Use a server-issued guest session or authentication; never accept
    arbitrary `ownerId` from a request body.
-   Add a content-safety step for prompts and generated content, and
    provide a friendly refusal/rewrite path for requests targeting real
    people or requesting disallowed content.

------------------------------------------------------------------------

## 11. Environment Configuration

Create `.env.example` with placeholders only; never commit real secrets.

``` dotenv
NODE_ENV=development
PORT=4000
WEB_ORIGIN=http://localhost:5173
API_BASE_URL=http://localhost:4000/api/v1

MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room

GEMINI_API_KEY=
GEMINI_MODEL=

SESSION_SECRET=
COOKIE_SECURE=false

# Optional: only if a persistent asset store is implemented
ASSET_STORAGE_PROVIDER=local
ASSET_STORAGE_BUCKET=
ASSET_STORAGE_ACCESS_KEY=
ASSET_STORAGE_SECRET_KEY=

LOG_LEVEL=info
CASE_GENERATION_TIMEOUT_MS=90000
MAX_CASES_PER_HOUR=5
```

Validate required variables at API startup and fail fast with a clear
developer-facing error if a required production value is missing. Do not
print secret values. Document each variable in the README.

------------------------------------------------------------------------

## 12. Testing Strategy

### 12.1 Unit tests

-   Request and AI-output schema validation.
-   Mystery consistency validator.
-   Public DTO serializer excludes all private solution fields.
-   Difficulty configuration maps to expected suspect/evidence counts.
-   Accusation scoring logic.
-   Ownership and state-transition helpers.

### 12.2 API integration tests

-   Valid case creation returns `202`.
-   Invalid scenario is rejected.
-   Status endpoint returns sanitized progress.
-   Public case endpoint never returns culprit or solution before
    submission.
-   Non-owner cannot read, mutate, or submit on a case.
-   Invalid suspect ID is rejected.
-   Duplicate accusation is rejected.
-   Accusation returns solution only after a valid final submission.
-   AI provider timeout and malformed output are handled.
-   Failed generation can be retried or deleted.
-   Notes cannot reference evidence from another case.

### 12.3 Frontend tests

-   Create form validation and submission.
-   Generation loading, ready, and failure states.
-   Evidence filters and detail viewer.
-   Notes and marked evidence.
-   Final accusation confirmation.
-   Correct and incorrect reveal screens.
-   Responsive navigation and keyboard-accessible dialogs.

### 12.4 End-to-end acceptance path

Using a mocked Gemini adapter by default in CI: 1. Create a case from a
scenario. 2. Wait for `ready`. 3. Inspect at least two evidence items.
4. Mark evidence and save a note. 5. Submit a suspect. 6. Verify the
reveal appears and cites valid evidence. 7. Reload the page and verify
completion persists.

A separate opt-in smoke test may use a real Gemini API key. CI must not
depend on paid API access.

------------------------------------------------------------------------

## 13. Acceptance Criteria for MVP

The MVP is complete only when all of the following are true:

-   [ ] A user can submit a scenario and configure genre/difficulty.
-   [ ] The backend creates a case and exposes a reliable generation
    status.
-   [ ] A ready case contains 3--6 suspects and 6--12 evidence items
    according to difficulty.
-   [ ] Every case has one predetermined culprit and a coherent private
    solution.
-   [ ] Public endpoints do not reveal the culprit before final
    accusation.
-   [ ] Evidence items are labeled fictional/simulated and have readable
    type-specific layouts.
-   [ ] The investigation room supports evidence inspection, filtering,
    notes, and important markers.
-   [ ] The user can submit one final accusation.
-   [ ] The backend validates the answer and reveals a cited
    explanation.
-   [ ] Cases and progress persist in MongoDB.
-   [ ] AI failure, invalid output, quota limits, and missing assets
    produce recoverable states.
-   [ ] Server secrets are never exposed to the client.
-   [ ] Ownership is enforced for all case operations.
-   [ ] Automated tests cover critical security and game flows.
-   [ ] README includes setup, environment variables, scripts,
    architecture, and troubleshooting.
-   [ ] `.env.example` exists and contains no real credentials.
-   [ ] No button or visible UI control is left as a nonfunctional
    placeholder.

------------------------------------------------------------------------

## 14. Implementation Plan for Codex

Implement in small, testable phases. Do not attempt a giant one-shot
build without verification.

### Phase 0 --- Repository inspection and plan

-   Inspect existing files, scripts, dependencies, and conventions.
-   Identify existing implementation before replacing anything.
-   Create/update `docs/SPEC.md` with this document as the authoritative
    spec.
-   Produce a concise implementation checklist and note any conflicts
    with the existing repository.

**Exit gate:** repo structure and implementation plan are clear; no
existing work has been overwritten without cause.

### Phase 1 --- Foundation

-   Set up workspaces, TypeScript, linting/formatting, Vite React app,
    Express app, shared schemas, environment validation, health
    endpoint, MongoDB connection, and README.
-   Add mocked AI adapter and test harness.

**Exit gate:** both apps start locally, `/api/v1/health` works, and
tests run without Gemini credentials.

### Phase 2 --- Case domain and mock generation

-   Implement Mongoose models, case services, state machine, public DTO
    mapping, and mock case generator.
-   Implement creation, status, get-case, list-cases, player-state,
    delete-case endpoints.
-   Add consistency validation and API tests.

**Exit gate:** a complete playable mock case can be created and
persisted without calling an external AI service.

### Phase 3 --- Gemini integration

-   Implement the provider adapter, prompt templates, structured-output
    parsing, bounded retries, error mapping, and output validation.
-   Generate canonical truth before evidence.
-   Ensure no private solution fields leak in API responses.
-   Test with fixtures and an optional live API smoke test.

**Exit gate:** valid Gemini output produces a ready case; malformed
output fails safely.

### Phase 4 --- Investigation UX

-   Build landing, creation, generation, investigation, evidence
    details, timeline, notes, and case-history screens.
-   Implement responsive layouts and accessibility basics.
-   Connect screens to the API.

**Exit gate:** the full investigation workflow works with mock data and
with backend-generated cases.

### Phase 5 --- Accusation, reveal, and hardening

-   Implement one-shot accusation and server-authoritative reveal.
-   Add security/rate limits, failure states, end-to-end tests, and
    persistence checks.
-   Review API payloads for solution leakage.

**Exit gate:** critical acceptance path passes and the hidden answer
cannot be retrieved before accusation.

### Phase 6 --- Production readiness

-   Document deployment, production environment variables, logging,
    privacy/retention, and asset-storage setup.
-   Run lint, typecheck, unit, integration, and E2E tests.
-   Fix failures; do not claim success for tests that were not run.

**Exit gate:** documented, reproducible build and test process; no known
critical security or correctness failures.

------------------------------------------------------------------------

## 15. Definition of Done

A feature is done when: 1. Its acceptance criteria are met. 2.
Request/response and persistence contracts are documented where
relevant. 3. Loading, empty, success, and error states exist. 4.
Authorization and validation are implemented server-side. 5. Tests cover
normal behavior and meaningful failure cases. 6. TypeScript, lint, and
relevant tests pass. 7. No secrets, private solution fields, or
debugging artifacts leak. 8. The README/spec is updated for material
behavior changes. 9. The implementation is actually verified; do not
report unrun checks as passed.

------------------------------------------------------------------------

## 16. Rules for Codex

When using this specification, Codex must:

1.  Read `docs/SPEC.md` before making changes.
2.  Inspect the current repository before choosing or replacing
    dependencies.
3.  Treat this document as the product and engineering source of truth.
4.  Work phase by phase, keeping the app runnable after each phase.
5.  Prefer simple, maintainable implementations over unnecessary
    abstractions.
6.  Never expose the Gemini API key or hidden solution to the frontend.
7.  Never mark a case `ready` unless schema and consistency checks pass.
8.  Never fake image/video generation. Use a clearly labeled placeholder
    when no image/video provider is configured.
9.  Use mock AI fixtures in automated tests; do not require a live paid
    API for normal CI.
10. Run relevant tests and report exactly which commands passed or
    failed.
11. If a requirement is ambiguous, choose the safest minimal behavior
    and record the assumption in `docs/DECISIONS.md`.
12. If changing a requirement, update this spec first and explain the
    change.
13. Do not leave TODO buttons, hard-coded demo behavior in production
    paths, or silent failure handlers.
14. Do not claim that a feature is complete merely because the UI has
    been rendered.
15. At the end of each phase, summarize changed files, behavior
    delivered, tests run, and remaining risks.

------------------------------------------------------------------------

## 17. Decisions and Open Items

These choices should be resolved before or during implementation and
recorded in `docs/DECISIONS.md`.

  -----------------------------------------------------------------------
  Topic                   MVP default             Decision needed?
  ----------------------- ----------------------- -----------------------
  Authentication          Guest session first;    Yes, before production
                          account auth can follow 

  Video                   Simulated camera log +  No for MVP
                          still image; no real    
                          video generation        
                          assumed                 

  Image generation        Optional provider;      Yes, if generated
                          placeholder fallback    images are required

  Asset storage           Local in development;   Yes, before production
                          persistent object       
                          storage in production   

  Styling                 Choose Tailwind CSS or  Resolve at setup
                          CSS Modules, not both   
                          ad hoc                  

  Case generation         Background job/service  Resolve based on
  execution               abstraction; polling    deployment
                          API                     

  Deletion                Owner can delete own    Yes, before production
                          cases; define hard/soft 
                          deletion                

  Moderation              Validate user prompt    Yes, define provider
                          and generated output    and thresholds

  Cost controls           Per-session rate limits Set production limits
                          and bounded generation  
                          retries                 

  Public sharing          Out of scope for MVP    No
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 18. Final Product Standard

A successful AI Mystery Room case is not simply a story with a random
culprit. It is a deterministic, fair-play deduction puzzle: the hidden
truth is fixed, the evidence is consistent with that truth, alternative
suspects are plausible but distinguishable, and the reveal explains the
reasoning using evidence the player actually saw.

**Build the smallest complete version first:** a scenario form,
validated AI/mock generation, evidence room, one-shot accusation, and
evidence-cited reveal. Expand only after this loop is reliable.
