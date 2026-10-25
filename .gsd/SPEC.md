# AI Mystery Room — Specification (.gsd/SPEC.md)

> **Status:** FINALIZED  
> **Source of Truth:** `AI_Mystery_Room_Spec.md` / `PRD.md` / `Architecture.md`  

## 1. Overview
AI Mystery Room is a web application that turns a user-provided short scenario or story seed into a fictional, AI-generated investigation. The AI creates a coherent mystery with a hidden culprit, a cast of characters, a timeline, and an evidence packet. The player examines the evidence and selects who they believe committed the crime or caused the incident.

## 2. Core Protocol Rules
- Canonical truth first: culprit, motive, method, and timeline established before evidence.
- Fair-play deduction: at least 2 clues support culprit; at least 1 clue weakens alternative suspect.
- Zero answer leakage: no culprit or solution data returned to frontend before accusation.
- One-shot accusation: checked authoritatively by the server.
- All evidence and cases labeled FICTIONAL_SIMULATION.

Refer to `AI_Mystery_Room_Spec.md` for complete technical details.
