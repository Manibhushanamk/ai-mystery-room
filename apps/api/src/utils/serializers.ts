import type {
  PublicCaseResponse,
  CaseStatusResponse,
  SolutionReveal,
  CaseSummaryItem,
} from '@ai-mystery-room/shared';
import type { IMysteryCase } from '../models/MysteryCase.js';

/**
 * Converts a database MysteryCase into a safe PublicCaseResponse DTO.
 * Explicitly strips out privateSolution, prompt artifacts, and internal details.
 */
export function toPublicCaseDTO(caseDoc: any): PublicCaseResponse {
  const caseId = caseDoc.id || (caseDoc._id as any)?.toString();
  return {
    id: caseId,
    ownerId: caseDoc.ownerId,
    title: caseDoc.title,
    scenarioSeed: caseDoc.scenarioSeed,
    genre: caseDoc.genre,
    difficulty: caseDoc.difficulty,
    setting: caseDoc.setting,
    status: caseDoc.status,
    publicCase: {
      premise: caseDoc.publicCase?.premise || '',
      incidentSummary: caseDoc.publicCase?.incidentSummary || '',
      incidentTime: caseDoc.publicCase?.incidentTime || '',
      briefing: caseDoc.publicCase?.briefing || '',
      suspects: (caseDoc.publicCase?.suspects || []).map((s: any) => ({
        id: s.id,
        name: s.name,
        role: s.role,
        bio: s.bio,
        relationshipToIncident: s.relationshipToIncident,
        publicMotive: s.publicMotive,
        statedAlibi: s.statedAlibi,
        portraitAsset: s.portraitAsset,
      })),
      evidence: (caseDoc.publicCase?.evidence || []).map((e: any) => ({
        id: e.id,
        type: e.type,
        title: e.title,
        description: e.description,
        createdAtInStory: e.createdAtInStory,
        sourceLabel: e.sourceLabel,
        reliability: e.reliability,
        content: e.content,
        asset: e.asset,
        fictionalLabel: 'FICTIONAL_SIMULATION',
      })),
      timeline: (caseDoc.publicCase?.timeline || []).map((t: any) => ({
        id: t.id,
        time: t.time,
        description: t.description,
        verified: t.verified,
        relatedSuspectIds: t.relatedSuspectIds,
        relatedEvidenceIds: t.relatedEvidenceIds,
      })),
    },
    playerState: {
      markedEvidenceIds: caseDoc.playerState?.markedEvidenceIds || [],
      notes: (caseDoc.playerState?.notes || []).map((n: any) => ({
        id: n.id,
        evidenceId: n.evidenceId,
        text: n.text,
        updatedAt: n.updatedAt instanceof Date ? n.updatedAt.toISOString() : new Date(n.updatedAt || Date.now()).toISOString(),
      })),
      accusation: caseDoc.playerState?.accusation
        ? {
            suspectId: caseDoc.playerState.accusation.suspectId,
            submittedAt:
              caseDoc.playerState.accusation.submittedAt instanceof Date
                ? caseDoc.playerState.accusation.submittedAt.toISOString()
                : new Date(caseDoc.playerState.accusation.submittedAt || Date.now()).toISOString(),
            correct: caseDoc.playerState.accusation.correct,
          }
        : undefined,
    },
    createdAt: caseDoc.createdAt instanceof Date ? caseDoc.createdAt.toISOString() : new Date(caseDoc.createdAt || Date.now()).toISOString(),
    updatedAt: caseDoc.updatedAt instanceof Date ? caseDoc.updatedAt.toISOString() : new Date(caseDoc.updatedAt || Date.now()).toISOString(),
  };
}

/**
 * Returns case generation status for polling.
 */
export function toCaseStatusDTO(caseDoc: any): CaseStatusResponse {
  const caseId = caseDoc.id || (caseDoc._id as any)?.toString();
  return {
    caseId,
    status: caseDoc.status,
    stage: caseDoc.generation?.stage || 'Processing',
    progress: caseDoc.generation?.progress || 0,
    error: caseDoc.generation?.lastErrorCode || null,
  };
}

/**
 * Summary view for case archive / history lists.
 */
export function toCaseSummaryDTO(caseDoc: any): CaseSummaryItem {
  const caseId = caseDoc.id || (caseDoc._id as any)?.toString();
  const createdAt = caseDoc.createdAt instanceof Date ? caseDoc.createdAt.toISOString() : new Date(caseDoc.createdAt || Date.now()).toISOString();
  const updatedAt = caseDoc.updatedAt instanceof Date ? caseDoc.updatedAt.toISOString() : new Date(caseDoc.updatedAt || Date.now()).toISOString();

  return {
    id: caseId,
    title: caseDoc.title || 'Untitled Case',
    genre: caseDoc.genre,
    difficulty: caseDoc.difficulty,
    setting: caseDoc.setting,
    status: caseDoc.status,
    createdAt,
    updatedAt,
    isSolved: caseDoc.playerState?.accusation?.isCorrect || false,
  };
}

/**
 * Builds the official solution reveal DTO strictly when status transitions to completed.
 */
export function toSolutionDTO(caseDoc: any, selectedSuspectId: string): SolutionReveal {
  const culpritId = caseDoc.privateSolution.culpritSuspectId;
  const culpritSuspect = caseDoc.publicCase.suspects.find((s: any) => s.id === culpritId);
  const isCorrect = culpritId === selectedSuspectId;

  return {
    result: isCorrect ? 'correct' : 'incorrect',
    selectedSuspectId,
    culprit: {
      suspectId: culpritId,
      name: culpritSuspect?.name || 'Unknown Culprit',
      role: culpritSuspect?.role,
    },
    motive: caseDoc.privateSolution.motive,
    method: caseDoc.privateSolution.method,
    solutionExplanation: caseDoc.privateSolution.solutionExplanation,
    evidenceReasoning: (caseDoc.privateSolution.evidenceReasoning || []).map((er: any) => ({
      evidenceId: er.evidenceId,
      explanation: er.explanation,
    })),
    debunkedRedHerrings: caseDoc.privateSolution.debunkedRedHerrings?.map((rh: any) => ({
      suspectId: rh.suspectId,
      explanation: rh.explanation,
    })),
  };
}
