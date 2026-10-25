# PRD — Project Requirements Document: AI Mystery Room

> **Project Name:** AI Mystery Room  
> **Status:** FINALIZED  
> **Target Delivery:** Production-Ready MVP  
> **Specification Reference:** `AI_Mystery_Room_Spec.md` / `docs/SPEC.md`  

---

## 1. Executive Summary

**AI Mystery Room** is a web application that transforms a user-provided short scenario or story seed into a coherent, fair-play, AI-generated fictional detective investigation. The AI generates a structured mystery with a single predetermined culprit, a roster of 3–6 suspects, a timeline, and an evidence packet (fictional chat exports, simulated camera logs/images, witness statements, official documents, timeline records).

The player steps into an immersive investigation workspace to examine clues, take private investigator notes, cross-reference alibis, and submit a single, one-shot accusation. Once submitted, the backend server authoritatively reveals whether the player was correct and delivers an evidence-cited breakdown explaining the motive, method, sequence of events, and red herrings.

The system enforces strict fair-play deduction rules, deterministic consistency validation, and zero answer leakage before final submission.

---

## 2. Target Users & Problem Statement

- **Primary Audience:** Fans of detective stories, puzzle games, escape rooms, murder mystery games, deduction mechanics, and interactive fiction.
- **User Pain Points:** 
  - Standard AI story generation feels like reading passive text or a generic essay without engaging gameplay mechanics.
  - "Vibecoded" AI mysteries frequently suffer from hallucinated contradictions, shifting culprits, impossible timelines, and unsolvable logic leaps.
  - Lack of tactile, immersive investigative artifacts (chats, CCTV logs, transcripts, documents).
- **Value Proposition:** 
  - A deterministic, fair-play mystery engine where canonical truth is established *before* evidence is generated.
  - Evidence-led reveals that cite specific clues seen by the player.
  - An atmospheric detective workspace designed for deduction, note-taking, and discovery.

---

## 3. Core Features & Functional Requirements

### Feature 1: Landing & Case Creation
- **Description:** Entry portal where players learn how the room works and seed a new investigation with custom or default parameters.
- **User Story:** As an investigator, I want to provide a short story prompt and choose genre and difficulty so that I can generate a custom mystery tailored to my taste.
- **Acceptance Criteria:**
  - [x] Clear product introduction, how it works, and conspicuous fictional-content disclaimer (**FR-001**).
  - [x] Scenario seed input supporting 50–1,000 characters recommended, hard cap at 2,000 characters (**FR-002**).
  - [x] Optional configurations: Genre (`classic_mystery`, `locked_room`, `campus`, `workplace`, `heist`, `sci_fi`, `thriller`), Difficulty (`easy`, `medium`, `hard`), Setting prompt (max 120 chars), Evidence preferences (`chat`, `image`, `camera_log`, `witness_statement`, `document`, `timeline`) (**FR-003**, **FR-004**).
  - [x] Client and server-side Zod validation with friendly error states (**FR-005**, **FR-006**).
  - [x] Asynchronous creation pipeline returning `202 Accepted` with a case status polling URL (**FR-007**, **FR-008**).

### Feature 2: Multi-Stage Case Generation Pipeline
- **Description:** A coordinated backend pipeline powered by Gemini API that generates canonical outline, suspects, evidence, and public/private projections.
- **User Story:** As a player, I want cases to be logically consistent and fair so that the mystery can actually be solved through deduction.
- **Acceptance Criteria:**
  - [x] Establishes private canonical truth (culprit, motive, method, master timeline) *before* public evidence is created (**FR-012**, **FR-014**).
  - [x] Generates 3–6 suspects with distinct roles, public motives, and stated alibis without revealing hidden truths (**FR-010**, **FR-011**).
  - [x] Generates 6–12 evidence items based on difficulty with a mixture of incriminating, exculpatory, neutral, and fair red herring clues (**FR-013**, **FR-015**, **FR-016**).
  - [x] Generation status lifecycle: `queued` → `generating_outline` → `generating_evidence` → `validating` → `ready` (or `failed`) (**FR-020**).
  - [x] Strict schema validation, bounded retries on model errors, and graceful fallbacks for image/media assets (**FR-018**, **FR-019**).
  - [x] Strict isolation: Private solution fields (`culpritSuspectId`, `solutionExplanation`, etc.) are never returned to client during generation or investigation (**FR-017**, **FR-021**).

### Feature 3: Immersive Detective Investigation Room
- **Description:** Desktop 3-column / Mobile responsive workspace featuring case briefing, suspect roster, evidence docket, timeline, and notebook.
- **User Story:** As an investigator, I want to organize evidence, cross-check suspect statements, and take notes so that I can assemble my case theory.
- **Acceptance Criteria:**
  - [x] Workspace presents briefing, suspects, evidence cards, master timeline, and player notebook (**FR-030**).
  - [x] Specialized visual renderers for Chat Exports, Camera Logs, Image Clues, Witness Statements, and Documents (**FR-031**, **FR-032**, **FR-033**, **FR-034**).
  - [x] Interactive evidence marking (starred/flagged clues) and persistent investigator notes synced to backend (**FR-035**).
  - [x] Filter evidence by category/type and sort by chronology (**FR-036**).
  - [x] Resilient asset handling with descriptive placeholders if media fails to load (**FR-038**).
  - [x] Clear visual distinction between confirmed facts, witness claims, and investigator notes (**FR-039**).

### Feature 4: Server-Authoritative Accusation & Reveal
- **Description:** A high-stakes accusation dialog followed by a cited breakdown of the crime.
- **User Story:** As an investigator, I want to submit my accusation and receive immediate, proof-backed feedback explaining why the culprit did it and how the clues pointed to them.
- **Acceptance Criteria:**
  - [x] User selects exactly one suspect; requires explicit confirmation dialog before final submission (**FR-040**, **FR-042**).
  - [x] Accusation is one-shot; server authoritatively verifies suspect ID against private culprit ID (**FR-041**).
  - [x] On submission, state atomically transitions to `completed` and returns the reveal payload (**FR-043**, **FR-047**).
  - [x] Solution reveal explicitly cites evidence IDs, explains motive and method, details chronological event sequence, and debunks red herrings (**FR-044**, **FR-045**).

### Feature 5: Case History & Persistence
- **Description:** Local guest session tracking and MongoDB persistence allowing users to resume open cases, review solved cases, or delete records.
- **User Story:** As a user, I want my active cases and solved mysteries saved so that I can resume investigations anytime.
- **Acceptance Criteria:**
  - [x] Server-issued cryptographically secure guest session identifier stored in secure HTTP-only cookie or authorization header (**FR-050**).
  - [x] List user's active and completed cases with pagination (**FR-052**, **FR-053**).
  - [x] Owner authorization checked on every read, update, accusation, and deletion (**FR-053**, **FR-054**).

---

## 4. Non-Functional Requirements

- **Fairness & Consistency:** Deterministic validation guarantees at least 2 independent clues point to culprit, at least 1 clue weakens an alternative suspect, all timestamps are chronologically valid, and no solutions rely on unmentioned facts.
- **Security & Privacy:** 
  - Zero answer leakage: `privateSolution` is never present in public DTOs or client bundles.
  - Secret protection: `GEMINI_API_KEY` and session secrets reside strictly on server.
  - Input sanitization & safe rendering: Zero raw HTML injection.
  - Rate limiting & request timeout safeguards (e.g. 90s generation timeout, max cases per hour).
- **Accessibility & UX:** WCAG 2.2 AA compliance, visible focus states, full keyboard navigation, screen reader alt-texts, restrained cinematic detective aesthetics without eye-straining clutter.
- **Performance:** Sub-100ms response times for static and database queries; continuous progress polling updates for generation.

---

## 5. Out of Scope for MVP

- Real-world investigations or allegations involving real people.
- Live integration with real WhatsApp accounts, physical CCTV cameras, or phone surveillance.
- Multiplayer co-op or competitive leaderboards.
- Photorealistic video generation (simulated camera stills and event logs are used instead).
- Public case sharing or user marketplace.
