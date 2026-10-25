import type { IMysteryCase } from '../../models/MysteryCase.js';

export interface ConsistencyValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class MysteryConsistencyValidator {
  public static validate(caseData: {
    difficulty: 'easy' | 'medium' | 'hard';
    publicCase: IMysteryCase['publicCase'];
    privateSolution: IMysteryCase['privateSolution'];
  }): ConsistencyValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const { publicCase, privateSolution, difficulty } = caseData;

    // 1. Check suspect count and unique IDs
    if (!publicCase.suspects || publicCase.suspects.length < 3) {
      errors.push('Case must contain at least 3 suspects.');
    }
    const suspectIds = new Set<string>();
    for (const suspect of publicCase.suspects || []) {
      if (!suspect.id) {
        errors.push('All suspects must have a stable id.');
      } else if (suspectIds.has(suspect.id)) {
        errors.push(`Duplicate suspect ID found: ${suspect.id}`);
      } else {
        suspectIds.add(suspect.id);
      }
    }

    // 2. Check evidence count and unique IDs
    if (!publicCase.evidence || publicCase.evidence.length < 4) {
      errors.push('Case must contain at least 4 evidence items.');
    }
    const evidenceIds = new Set<string>();
    for (const evidence of publicCase.evidence || []) {
      if (!evidence.id) {
        errors.push('All evidence items must have a stable id.');
      } else if (evidenceIds.has(evidence.id)) {
        errors.push(`Duplicate evidence ID found: ${evidence.id}`);
      } else {
        evidenceIds.add(evidence.id);
      }

      if (evidence.fictionalLabel !== 'FICTIONAL_SIMULATION') {
        errors.push(`Evidence ${evidence.id} missing mandatory FICTIONAL_SIMULATION badge.`);
      }
    }

    // 3. Culprit existence and uniqueness
    const culpritId = privateSolution?.culpritSuspectId;
    if (!culpritId) {
      errors.push('A canonical culprit suspect ID must be defined.');
    } else if (!suspectIds.has(culpritId)) {
      errors.push(`Culprit ID "${culpritId}" is not present in the suspects list.`);
    }

    // 4. Fair-play checks: at least 2 independent pieces of evidence support culprit
    const reasoning = privateSolution?.evidenceReasoning || [];
    const supportingCulpritClues = reasoning.filter(
      (r) => r.effect === 'supports_culprit' && evidenceIds.has(r.evidenceId),
    );

    if (supportingCulpritClues.length < 2) {
      errors.push(
        `Fair-play violation: At least 2 independent evidence items must support the culprit. Found ${supportingCulpritClues.length}.`,
      );
    }

    // 5. Fair-play checks: at least 1 clue weakens an alternative suspect or red herring
    const weakeningAlternativeClues = reasoning.filter(
      (r) =>
        (r.effect === 'weakens_alternative' || r.effect === 'red_herring') &&
        evidenceIds.has(r.evidenceId),
    );

    if (weakeningAlternativeClues.length < 1) {
      warnings.push(
        'Fair-play recommendation: At least 1 clue should challenge an alternative suspect or explain a red herring.',
      );
    }

    // 6. Check that all evidence items referenced in reasoning actually exist
    for (const r of reasoning) {
      if (!evidenceIds.has(r.evidenceId)) {
        errors.push(
          `Solution evidenceReasoning references non-existent evidenceId: "${r.evidenceId}".`,
        );
      }
    }

    // 7. Check timeline references
    for (const event of publicCase.timeline || []) {
      for (const sId of event.relatedSuspectIds || []) {
        if (!suspectIds.has(sId)) {
          warnings.push(`Timeline event "${event.id}" references unknown suspectId "${sId}".`);
        }
      }
      for (const eId of event.relatedEvidenceIds || []) {
        if (!evidenceIds.has(eId)) {
          warnings.push(`Timeline event "${event.id}" references unknown evidenceId "${eId}".`);
        }
      }
    }

    // 8. Leakage check: public fields must not contain direct culprit giveaways
    const culpritSuspect = publicCase.suspects.find((s) => s.id === culpritId);
    if (culpritSuspect) {
      const publicText = [
        publicCase.premise,
        publicCase.incidentSummary,
        publicCase.briefing,
        ...publicCase.suspects.map((s) => `${s.role} ${s.bio} ${s.publicMotive} ${s.statedAlibi}`),
        ...publicCase.evidence.map((e) => `${e.title} ${e.description}`),
      ].join(' ').toLowerCase();

      // Ensure public briefing doesn't say "X is the killer / thief"
      if (
        publicText.includes(`${culpritSuspect.name.toLowerCase()} is the culprit`) ||
        publicText.includes(`${culpritSuspect.name.toLowerCase()} committed the crime`) ||
        publicText.includes(`${culpritSuspect.name.toLowerCase()} stole the`)
      ) {
        errors.push('Solution leakage detected: Public briefing or description explicitly names culprit as guilty.');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
