# AI Mystery Room 🔍

> An atmospheric, fair-play detective investigation engine that transforms story seeds into playable, evidence-led deduction games.

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-v18-cyan.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3-blueviolet.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-emerald.svg)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-API-orange.svg)](https://ai.google.dev/)

---

## 1. Product Summary

**AI Mystery Room** turns a short scenario seed into a coherent, fair-play criminal investigation. The AI generates a predetermined culprit, an alibi-checked roster of suspects, a chronological timeline, and an evidence packet. Evidence spans fictional chat message exports, CCTV surveillance transcripts and snapshots, witness interviews, and stamped police/audit reports.

The player steps into an authentic detective desk, filters clues, marks important evidence, records personal deductions in an auto-saved notebook, and submits a high-stakes, **one-shot accusation**. Upon submission, the server authoritatively evaluates the accusation and reveals an evidence-cited breakdown detailing motive, method, sequence of events, and debunked red herrings.

### Core Principles
1. **Fiction is Explicit:** Every case, clue, and transcript is prominently stamped `FICTIONAL_SIMULATION`.
2. **Canonical Truth First:** Culprit, motive, method, and master timeline are established *before* public clues are created.
3. **Evidence-Led Reveal:** The resolution cites specific evidence IDs the player actually saw.
4. **Zero Answer Leakage:** Hidden solution fields are never sent across the wire before an accusation is finalized.
5. **Deterministic Consistency:** Verified by an automated engine requiring at least 2 independent clues supporting the culprit and at least 1 clue weakening alternative suspects.

---

## 2. Architecture & Monorepo Layout

```text
ai-mystery-room/
├── apps/
│   ├── web/                         # React 18 + Vite + Tailwind CSS Frontend
│   │   ├── src/
│   │   │   ├── app/                 # AppShell and React Router v6 setup
│   │   │   ├── components/          # Badges, accessible Modals, LoadingRadar
│   │   │   ├── features/
│   │   │   │   ├── case-creation/   # ScenarioForm with quick investigation presets
│   │   │   │   ├── generation/      # GenerationScreen with stage progression
│   │   │   │   ├── investigation/   # InvestigationWorkspace (3-column detective desk)
│   │   │   │   ├── evidence/        # Specialized viewers (Chat, CCTV, Doc, Witness)
│   │   │   │   ├── accusation/      # High-friction AccusationDialog & RevealScreen
│   │   │   │   └── case-history/    # Case Archives & history manager
│   │   │   └── lib/                 # API client with transparent guest session handling
│   │
│   └── api/                         # Express + Node.js + TypeScript Backend
│       ├── src/
│       │   ├── config/              # Zod environment validation & dual-mode DB adapter
│       │   ├── middleware/          # Guest session cookie/header & error formatting
│       │   ├── routes/              # Express routes (/api/v1/health, /api/v1/cases)
│       │   ├── controllers/         # CaseController
│       │   ├── services/
│       │   │   ├── ai/              # Google Gen AI SDK adapter & prompt templates
│       │   │   ├── case-generation/ # CaseService & MockCaseGenerator
│       │   │   ├── mystery-validation/ # Deterministic ConsistencyValidator
│       │   │   └── evidence-assets/ # Simulated CCTV and clue graphic synthesizer
│       │   ├── models/              # Mongoose MysteryCase schema
│       │   └── utils/               # DTO serializers (No secret leakage)
│
├── packages/
│   └── shared/                      # Shared contracts, types, and Zod schemas
│
├── e2e/                             # Playwright browser end-to-end tests
├── docs/
│   ├── SPEC.md                      # Authoritative product specification
│   └── DECISIONS.md                 # Architecture Decision Records (ADRs)
├── PRD.md                           # Project Requirements Document
├── Architecture.md                  # System Flow & Diagrams
├── Rules.md                         # Operational Constraints & Fair-Play Rules
├── Phases.md                        # Step-by-Step Implementation Roadmap
├── Design.md                        # Visual Design System & Evidence Specs
├── Memory.md                        # Active Working Context
└── .env.example                     # Environment template
```

---

## 3. Environment Configuration

Copy `.env.example` to `.env` in the root directory:

```bash
cp .env.example .env
```

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `development` | Runtime environment (`development`, `production`, `test`) |
| `PORT` | `4000` | Backend API HTTP server port |
| `WEB_ORIGIN` | `http://localhost:5173` | Allowed CORS origin for the Vite frontend |
| `API_BASE_URL` | `http://localhost:4000/api/v1` | Public API base path |
| `DATABASE_URL` | *(Optional)* | Neon Serverless Postgres connection string (`postgresql://...`). When set, automatically creates the schema on Neon and uses Neon for all persistence. |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/ai_mystery_room` | MongoDB connection string. Used when `DATABASE_URL` is omitted (falls back to in-memory MongoDB automatically). |
| `GROQ_API_KEY` | *(Optional)* | Groq Cloud API key for ultra-fast mystery generation using `llama-3.3-70b-versatile`. |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | Groq LLM model name. |
| `GEMINI_API_KEY` | *(Optional)* | Google Gemini API key. Used when Groq is not configured. |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Gemini model for outline and evidence synthesis |
| `SESSION_SECRET` | `dev_session_secret` | Secret key used for signing session cookies |
| `COOKIE_SECURE` | `false` | Set to `true` when serving behind HTTPS in production |
| `LOG_LEVEL` | `info` | Logging verbosity (`debug`, `info`, `warn`, `error`) |
| `CASE_GENERATION_TIMEOUT_MS` | `90000` | Maximum timeout in milliseconds for case generation |
| `MAX_CASES_PER_HOUR` | `10` | Rate limit for case creation requests per IP/session |

---

## 4. Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run In Development Mode
Start both the Express API and Vite React frontend concurrently:
```bash
# Terminal 1: Run Backend API (Port 4000)
npm run dev:api

# Terminal 2: Run Frontend (Port 5173)
npm run dev:web
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 5. Testing & Verification

### Run All Unit & Integration Tests (Vitest)
```bash
npm run test
```
Runs:
- `packages/shared`: Schema validation and constants verification.
- `apps/api`: Health checks, MongoDB lifecycle, case CRUD, zero-leakage security, accusation mechanics, and Gemini structured output fixtures.
- `apps/web`: Component rendering, Badges, ScenarioForm, and AppShell layout tests.

### Run End-to-End Browser Tests (Playwright)
```bash
npm run test:e2e
```
Executes the full automated player journey:
1. Scenario commissioning from presets
2. Generation progress polling
3. Multi-format evidence inspection (chat, CCTV, documents)
4. Marking key clues and recording notes
5. Submitting an accusation against the culprit
6. Verification of the cited solution reveal screen
7. Page reload persistence validation

---

## 6. API Reference

Base URL: `/api/v1`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | API and Database health check |
| `POST` | `/cases` | Create and enqueue a new investigation (`202 Accepted`) |
| `GET` | `/cases` | List investigations owned by the current session |
| `GET` | `/cases/:id/status`| Poll generation progress and stage |
| `GET` | `/cases/:id` | Fetch public case dossier (Zero secret leakage) |
| `PATCH`| `/cases/:id/player-state` | Update marked clues and investigator notebook |
| `POST` | `/cases/:id/accusation` | Submit final one-shot accusation and receive reveal |
| `DELETE`| `/cases/:id` | Permanently remove case from archives |

---

## 7. Fictional Content & Legal Notice

All cases, names, organizations, chat records, transcripts, and media generated by AI Mystery Room are **100% fictional simulations**. Any resemblance to real persons, living or dead, or actual events is purely coincidental.
