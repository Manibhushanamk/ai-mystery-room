# Design.md — Visual Identity & Design System: AI Mystery Room

> **Aesthetic Guidelines:** Atmospheric, restrained cinematic detective workspace ("Noir Modern"). High contrast, immersive case dockets, legible typography, and zero gimmicky clutter.

---

## 1. Visual Theme & Personality

- **Style Archetype:** Modern Noir Investigation Desk. Evokes late-night case boards, cold briefing rooms, dossier folders, and glowing surveillance terminals.
- **Theme Support:** Dark-Mode First (`#0a0d14` deep midnight canvas) with amber/warm gold highlights and slate gray card surfaces.
- **Surface Elevation & Borders:** Subtle translucent borders (`border-slate-800/80`), delicate grain textures, and restrained shadows (`shadow-2xl shadow-black/80`).
- **Corner Radius:** Precision radii (`rounded-lg` / 8px for cards, `rounded-md` / 6px for buttons/badges, `rounded-xl` / 12px for modal dockets).

---

## 2. Color Palette & Design Tokens

| Token Name | Hex Code | Purpose & Application |
|------------|----------|-----------------------|
| `bg-canvas` | `#080b11` | Primary screen canvas / workspace background |
| `bg-surface` | `#0f141f` | Cards, panels, suspect dockets, evidence inspect panes |
| `bg-surface-elevated` | `#161e2e` | Modals, floating dialogs, active evidence tabs |
| `border-subtle` | `#1e293b` | Dividers, card boundaries, table rules |
| `border-highlight` | `#334155` | Hover borders, focused inputs, active dossier tabs |
| `accent-gold` | `#d97706` / `#f59e0b` | Primary detective highlight, badges, solve CTAs, star icons |
| `accent-crimson` | `#ef4444` | High-stakes accusation warning, culprit badge, urgent clues |
| `accent-emerald` | `#10b981` | Correct verdict, verified timeline facts, high reliability |
| `accent-cyan` | `#06b6d4` | Surveillance cameras, technical logs, digital metadata |
| `text-primary` | `#f8fafc` | Case titles, briefing headings, high-contrast evidence text |
| `text-secondary` | `#94a3b8` | Suspect bios, timeline timestamps, source labels |
| `text-muted` | `#64748b` | Secondary clues, helper hints, footer disclaimers |

---

## 3. Typography & Hierarchy

- **Primary Headings & UI:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif` (Crisp, modern, high legibility).
- **Dossier & Evidence Data:** `JetBrains Mono`, `ui-monospace`, `Courier New`, `monospace` (Used for timestamps, case IDs, CCTV camera coordinates, transcripts, and classified badges).
- **Editorial / Case Titles:** Bold tracking with uppercase accents (`tracking-wider`, `uppercase text-xs font-semibold`).

### Type Scale
- **Display / Hero H1:** `text-3xl` / `text-4xl` (32px–36px), Bold, tracking-tight.
- **Section / Docket H2:** `text-xl` / `text-2xl` (20px–24px), SemiBold.
- **Card Title / Suspect H3:** `text-base` / `text-lg` (16px–18px), Medium/SemiBold.
- **Body / Briefing Text:** `text-sm` (14px), leading-relaxed (1.6 line height) for comfortable long-form reading.
- **Evidence Microcopy / Metadata:** `text-xs` (12px), `font-mono`.

---

## 4. Evidence Card Formats & Visual Distinctions

Each evidence type must have immediate, recognizable visual personality:

1. **Simulated Chat Export (`chat`):**
   - Instant messaging conversation style with sender bubbles, timestamps, read receipts, and simulated messenger headers.
2. **CCTV / Camera Log (`camera_log`):**
   - Surveillance camera HUD overlay: timestamp overlay in top-right, camera identifier (e.g. `CAM-04 (WEST CORRIDOR)`), scanline effect, and transcript log.
3. **Official Police / Forensic Document (`document`):**
   - Stamped dossier format: header seal, reference number, redacted text simulation, tabular findings, and signature line.
4. **Witness Statement (`witness_statement`):**
   - Interview transcript format: audio-recorder waveform header, interviewer/witness turn quotes, credibility indicator.
5. **Photo Clue / Visual Evidence (`image`):**
   - Polaroid / evidence tag layout: photo preview or high-fidelity simulated clue graphic, physical evidence ruler scale, date-stamped label, and clue notes.

---

## 5. UI Feedback & Component States

- **Fictional Content Badge:** Every screen and piece of evidence must feature an unambiguous badge: `[ FICTIONAL SIMULATION - NOT REAL EVIDENCE ]`.
- **Loading & Generation States:** Multi-phase forensic progress radar with honest stage descriptions:
  - Phase 1: Analyzing scenario seed...
  - Phase 2: Formulating suspect motives and secret timeline...
  - Phase 3: Synthesizing evidence artifacts...
  - Phase 4: Verifying logical consistency...
- **Empty States:** Atmospheric briefcase illustration with clear call-to-action ("No active cases. Open a new investigation.").
- **Accusation Dialog:** High-friction modal with dramatic dark crimson border, selected suspect dossier recap, and confirmation prompt.
- **Reveal Screen:** Dramatic verdict banner (Correct / Incorrect), suspect confession / true motive summary, and evidence citation cards that visually highlight matching clues from the room.
