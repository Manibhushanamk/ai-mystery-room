# AI Mystery Room --- Product & Engineering Specification (docs/SPEC.md)

> This document is the project copy of `AI_Mystery_Room_Spec.md`, which is the Single Source of Truth (SSOT).
> For the full 1194-line specification, see the root `AI_Mystery_Room_Spec.md`.

## Summary
AI Mystery Room is a web application that turns a user-provided short scenario or story seed into a fictional, AI-generated investigation. The AI creates a coherent mystery with a hidden culprit, a cast of characters, a timeline, and an evidence packet.

Key Rules:
1. Canonical truth first.
2. Fair-play deduction rules enforced deterministically.
3. Zero answer leakage before accusation.
4. One-shot accusation verified on server.
5. Evidence-cited solution reveal.
