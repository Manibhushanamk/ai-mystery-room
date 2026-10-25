export class PromptTemplates {
  public static buildOutlinePrompt(params: {
    scenario: string;
    genre: string;
    difficulty: string;
    setting?: string;
  }): string {
    return `You are the lead architect for AI Mystery Room, a fair-play detective investigation engine.
Task: Create a strictly fictional, logically sound case outline based on the user's scenario.

SCENARIO SEED:
"${params.scenario}"

PARAMETERS:
- Genre: ${params.genre}
- Difficulty: ${params.difficulty}
- Setting: ${params.setting || 'Auto-inferred from scenario'}

FAIR-PLAY DETECTIVE RULES:
1. CANONICAL TRUTH FIRST: Determine one single, specific culprit from the suspect roster, their exact motive, and their physical method.
2. SUSPECT ROSTER: Create ${params.difficulty === 'hard' ? '5-6' : params.difficulty === 'easy' ? '3-4' : '4-5'} fictional suspects. Give each a stable ID (e.g. "suspect_01", "suspect_02"), distinct profession/role, personal connection to the scene, public motive, and a plausible stated alibi.
3. SPOILER ISOLATION: The public fields (premise, briefing, suspects, stated alibis) MUST NEVER reveal who the true culprit is, nor accuse them directly.
4. FICTIONAL SAFETY: All characters and institutions must be completely fictional. No real people or defamatory claims.

OUTPUT FORMAT:
Return pure JSON conforming to this structure:
{
  "title": "Evocative Case Title",
  "premise": "Atmospheric premise hook",
  "incidentSummary": "Key factual details known when the investigation begins",
  "incidentTime": "ISO 8601 timestamp (e.g. 2026-10-24T22:30:00.000Z)",
  "briefing": "Senior investigator memo outlining the situation and instructions",
  "setting": "Specific physical setting description",
  "genre": "${params.genre}",
  "difficulty": "${params.difficulty}",
  "suspects": [
    {
      "id": "suspect_01",
      "name": "Full Fictional Name",
      "role": "Role / Occupation",
      "bio": "Brief background",
      "relationshipToIncident": "Why they are relevant",
      "publicMotive": "Surface suspicion",
      "statedAlibi": "What they claim they were doing"
    }
  ],
  "privateSolution": {
    "culpritSuspectId": "suspect_0X",
    "motive": "True secret motive",
    "method": "Exact step-by-step mechanical method of the crime",
    "canonicalTimeline": [
      {
        "time": "HH:MM",
        "event": "What really happened at this moment",
        "involvedSuspectIds": ["suspect_0X"]
      }
    ]
  }
}`;
  }

  public static buildEvidencePrompt(outlineJson: string): string {
    return `You are the forensic and clue designer for AI Mystery Room.
You have the canonical outline and secret solution. Now synthesize the player-facing evidence packet and public timeline.

CANONICAL OUTLINE:
${outlineJson}

FAIR-PLAY EVIDENCE RULES:
1. AT LEAST 2 INDEPENDENT CLUES MUST INCRIMINATE THE CULPRIT: E.g., digital logs, CCTV access card records, forensic analysis, timestamps, or intercepted communications.
2. AT LEAST 1 CLUE MUST WEAKEN AN ALTERNATIVE SUSPECT OR DEBUNK A RED HERRING: Show verifiable alibi data (e.g., flight ticket, entrance badge, store receipt) for innocent suspects.
3. EVIDENCE VARIETY: Include a mix of evidence types:
   - "chat": Fictional text exports with participants, timestamps, and messages.
   - "camera_log": CCTV transcripts with cameraCode, location, eventTime, and observations.
   - "document": Official records with documentTitle, issuer, dateIssued, and bodySections.
   - "witness_statement": Interviews with witnessName, interviewTime, interviewer, and statementTranscript.
4. CONSISTENCY: Every clue must strictly align with the canonical timeline.
5. EVIDENCE IDS: Use stable IDs ("evidence_01", "evidence_02", etc.).
6. SOLUTION EXPLANATION: Write a comprehensive, cited reveal that explicitly references the evidence IDs to demonstrate how the player could deductively solve the case.

OUTPUT FORMAT:
Return pure JSON conforming to this structure:
{
  "evidence": [
    {
      "id": "evidence_01",
      "type": "chat" | "camera_log" | "witness_statement" | "document" | "image",
      "title": "Title of clue",
      "description": "What this piece of evidence is and where it was found",
      "createdAtInStory": "ISO 8601 or story time",
      "sourceLabel": "Source label (e.g. Server Logs / Police Interview)",
      "reliability": "high" | "medium" | "low" | "unknown",
      "content": { ...type-specific structure... }
    }
  ],
  "publicTimeline": [
    {
      "id": "time_01",
      "time": "HH:MM",
      "description": "Event known to investigators",
      "verified": true | false,
      "relatedSuspectIds": ["suspect_01"],
      "relatedEvidenceIds": ["evidence_01"]
    }
  ],
  "solutionExplanation": "Grand reveal text citing specific evidence IDs (e.g. Evidence 01, Evidence 04) that prove the culprit did it and exonerate others.",
  "evidenceReasoning": [
    {
      "evidenceId": "evidence_01",
      "explanation": "How this clue supports the conclusion",
      "supports": ["suspect_0X"],
      "effect": "supports_culprit" | "weakens_alternative" | "red_herring" | "context"
    }
  ],
  "debunkedRedHerrings": [
    {
      "suspectId": "suspect_0Y",
      "explanation": "Why this innocent suspect appeared suspicious but is innocent"
    }
  ]
}`;
  }
}
