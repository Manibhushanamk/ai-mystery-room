import { v4 as uuidv4 } from 'uuid';
import { CaseRepository, type ICaseRecord } from '../../repositories/caseRepository.js';
import { MysteryConsistencyValidator } from '../mystery-validation/consistencyValidator.js';
import { MockCaseGenerator } from './mockCaseGenerator.js';
import { GeminiService } from '../ai/geminiService.js';
import { GroqService } from '../ai/groqService.js';
import { EvidenceAssetService } from '../evidence-assets/evidenceAssetService.js';
import { env } from '../../config/env.js';
import {
  toPublicCaseDTO,
  toCaseStatusDTO,
  toCaseSummaryDTO,
  toSolutionDTO,
} from '../../utils/serializers.js';
import type {
  CreateCaseRequest,
  CreateCaseResponse,
  PublicCaseResponse,
  CaseStatusResponse,
  ListCasesResponse,
  SolutionReveal,
  UpdatePlayerStateRequest,
} from '@ai-mystery-room/shared';

export class CaseService {
  /**
   * Starts a new case generation request.
   */
  public static async createCase(
    ownerId: string,
    input: CreateCaseRequest,
  ): Promise<CreateCaseResponse> {
    const caseDoc = await CaseRepository.create({
      ownerId,
      scenarioSeed: input.scenario,
      genre: input.genre || 'classic_mystery',
      difficulty: input.difficulty || 'medium',
      setting: input.setting || '',
    });

    // Trigger generation asynchronously in background
    this.runGenerationPipeline(caseDoc.id).catch((err) => {
      console.error(`[CaseService] Background generation failed for case ${caseDoc.id}:`, err);
    });

    return {
      caseId: caseDoc.id,
      status: caseDoc.status,
      statusUrl: `/api/v1/cases/${caseDoc.id}/status`,
    };
  }

  /**
   * Background generation pipeline coordinating Groq AI, Gemini AI, or Mock Engine.
   */
  public static async runGenerationPipeline(caseId: string): Promise<void> {
    const caseDoc = await CaseRepository.findById(caseId);
    if (!caseDoc) return;

    try {
      const useGroq = (env.LLM_PROVIDER === 'groq' || env.LLM_PROVIDER === 'auto') && GroqService.isAvailable();
      const useGemini = (env.LLM_PROVIDER === 'gemini' || env.LLM_PROVIDER === 'auto') && GeminiService.isAvailable();

      if (useGroq) {
        console.log(`[CaseService] Launching Groq generation for case ${caseId} (model: ${env.GROQ_MODEL})`);

        // Stage 1: Generate Outline
        caseDoc.status = 'generating_outline';
        caseDoc.generation.stage = `Synthesizing scenario outline and canonical truth via Groq (${env.GROQ_MODEL})`;
        caseDoc.generation.progress = 30;
        await caseDoc.save();

        const outline = await GroqService.generateOutline({
          scenario: caseDoc.scenarioSeed,
          genre: caseDoc.genre,
          difficulty: caseDoc.difficulty,
          setting: caseDoc.setting,
        });

        // Stage 2: Generate Evidence
        caseDoc.status = 'generating_evidence';
        caseDoc.generation.stage = 'Synthesizing evidence docket and witness testimonies via Groq';
        caseDoc.generation.progress = 65;
        await caseDoc.save();

        const evidencePacket = await GroqService.generateEvidence(outline);

        (caseDoc as any).title = outline.title;
        caseDoc.publicCase = {
          title: outline.title,
          summary: outline.incidentSummary,
          premise: outline.premise,
          incidentSummary: outline.incidentSummary,
          incidentTime: outline.incidentTime,
          briefing: outline.briefing,
          suspects: outline.suspects.map((s) => ({
            ...s,
            portraitAsset: EvidenceAssetService.createPlaceholder({
              type: 'suspect portrait',
              title: s.name,
              description: s.role,
            }),
          })),
          evidence: evidencePacket.evidence.map((e) => ({
            ...e,
            asset:
              e.type === 'camera_log'
                ? {
                    kind: 'placeholder',
                    url: EvidenceAssetService.createCCTVSnapshotSVG(
                      (e.content as any)?.cameraCode || 'CAM-01',
                      (e.content as any)?.eventTime || '22:00',
                      (e.content as any)?.location || 'Secured Area',
                    ),
                    altText: `CCTV simulation frame for ${e.title}`,
                    status: 'ready',
                  }
                : EvidenceAssetService.createPlaceholder({
                    type: e.type,
                    title: e.title,
                    description: e.description,
                  }),
            fictionalLabel: 'FICTIONAL_SIMULATION',
          })),
          timeline: evidencePacket.publicTimeline,
        };

        caseDoc.privateSolution = {
          culpritSuspectId: outline.privateSolution.culpritSuspectId,
          motive: outline.privateSolution.motive,
          method: outline.privateSolution.method,
          canonicalTimeline: outline.privateSolution.canonicalTimeline,
          solutionExplanation: evidencePacket.solutionExplanation,
          evidenceReasoning: evidencePacket.evidenceReasoning,
          debunkedRedHerrings: evidencePacket.debunkedRedHerrings || [],
        };
      } else if (useGemini) {
        console.log(`[CaseService] Launching Gemini generation for case ${caseId}`);

        // Stage 1: Generate Outline
        caseDoc.status = 'generating_outline';
        caseDoc.generation.stage = 'Synthesizing scenario outline and canonical truth via Gemini';
        caseDoc.generation.progress = 30;
        await caseDoc.save();

        const outline = await GeminiService.generateOutline({
          scenario: caseDoc.scenarioSeed,
          genre: caseDoc.genre,
          difficulty: caseDoc.difficulty,
          setting: caseDoc.setting,
        });

        // Stage 2: Generate Evidence
        caseDoc.status = 'generating_evidence';
        caseDoc.generation.stage = 'Synthesizing evidence docket and witness testimonies';
        caseDoc.generation.progress = 65;
        await caseDoc.save();

        const evidencePacket = await GeminiService.generateEvidence(outline);

        (caseDoc as any).title = outline.title;
        caseDoc.publicCase = {
          title: outline.title,
          summary: outline.incidentSummary,
          premise: outline.premise,
          incidentSummary: outline.incidentSummary,
          incidentTime: outline.incidentTime,
          briefing: outline.briefing,
          suspects: outline.suspects.map((s) => ({
            ...s,
            portraitAsset: EvidenceAssetService.createPlaceholder({
              type: 'suspect portrait',
              title: s.name,
              description: s.role,
            }),
          })),
          evidence: evidencePacket.evidence.map((e) => ({
            ...e,
            asset:
              e.type === 'camera_log'
                ? {
                    kind: 'placeholder',
                    url: EvidenceAssetService.createCCTVSnapshotSVG(
                      (e.content as any)?.cameraCode || 'CAM-01',
                      (e.content as any)?.eventTime || '22:00',
                      (e.content as any)?.location || 'Secured Area',
                    ),
                    altText: `CCTV simulation frame for ${e.title}`,
                    status: 'ready',
                  }
                : EvidenceAssetService.createPlaceholder({
                    type: e.type,
                    title: e.title,
                    description: e.description,
                  }),
            fictionalLabel: 'FICTIONAL_SIMULATION',
          })),
          timeline: evidencePacket.publicTimeline,
        };

        caseDoc.privateSolution = {
          culpritSuspectId: outline.privateSolution.culpritSuspectId,
          motive: outline.privateSolution.motive,
          method: outline.privateSolution.method,
          canonicalTimeline: outline.privateSolution.canonicalTimeline,
          solutionExplanation: evidencePacket.solutionExplanation,
          evidenceReasoning: evidencePacket.evidenceReasoning,
          debunkedRedHerrings: evidencePacket.debunkedRedHerrings || [],
        };
      } else {
        // Fallback to high-fidelity deterministic Mock Engine
        caseDoc.status = 'generating_outline';
        caseDoc.generation.stage = 'Synthesizing scenario outline and canonical truth';
        caseDoc.generation.progress = 30;
        await caseDoc.save();

        const mockData = MockCaseGenerator.generate({
          ownerId: caseDoc.ownerId,
          scenario: caseDoc.scenarioSeed,
          genre: caseDoc.genre,
          difficulty: (caseDoc.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
          setting: caseDoc.setting,
        });

        caseDoc.status = 'generating_evidence';
        caseDoc.generation.stage = 'Creating evidence artifacts and witness dossiers';
        caseDoc.generation.progress = 60;
        await caseDoc.save();

        (caseDoc as any).title = mockData.title || 'Case Investigation';
        caseDoc.publicCase = mockData.publicCase as any;
        caseDoc.privateSolution = mockData.privateSolution as any;
      }

      // Stage 3: Consistency Validation
      caseDoc.status = 'validating';
      caseDoc.generation.stage = 'Performing fair-play consistency validation';
      caseDoc.generation.progress = 85;
      await caseDoc.save();

      const validation = MysteryConsistencyValidator.validate({
        difficulty: (caseDoc.difficulty as 'easy' | 'medium' | 'hard') || 'medium',
        publicCase: caseDoc.publicCase as any,
        privateSolution: caseDoc.privateSolution as any,
      });

      if (!validation.valid) {
        console.error('[CaseService] Consistency validation failed:', validation.errors);
        caseDoc.status = 'failed';
        caseDoc.generation.stage = 'Failed consistency validation';
        caseDoc.generation.lastErrorCode = 'CONSISTENCY_CHECK_FAILED';
        await caseDoc.save();
        return;
      }

      // Stage 4: Mark Ready
      caseDoc.status = 'ready';
      caseDoc.generation.stage = 'Investigation dossier compiled and ready';
      caseDoc.generation.progress = 100;
      await caseDoc.save();

      console.log(`[CaseService] Case ${caseId} is now ready for investigation.`);
    } catch (err: any) {
      console.error(`[CaseService] Pipeline execution error for case ${caseId}:`, err);
      caseDoc.status = 'failed';
      caseDoc.generation.stage = 'Internal generation error';
      caseDoc.generation.lastErrorCode = 'GENERATION_ERROR';
      await caseDoc.save();
    }
  }

  /**
   * Retrieves case generation status for polling.
   */
  public static async getCaseStatus(caseId: string, ownerId: string): Promise<CaseStatusResponse> {
    const caseDoc = await CaseRepository.findById(caseId);
    if (!caseDoc) {
      const error: any = new Error('Case not found');
      error.statusCode = 404;
      error.code = 'CASE_NOT_FOUND';
      throw error;
    }

    if (caseDoc.ownerId !== ownerId) {
      const error: any = new Error('Unauthorized to view this case status');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    return toCaseStatusDTO(caseDoc);
  }

  /**
   * Retrieves the public case for the investigation room (strictly no private solution!).
   */
  public static async getPublicCase(caseId: string, ownerId: string): Promise<PublicCaseResponse> {
    const caseDoc = await CaseRepository.findById(caseId);
    if (!caseDoc) {
      const error: any = new Error('Case not found');
      error.statusCode = 404;
      error.code = 'CASE_NOT_FOUND';
      throw error;
    }

    if (caseDoc.ownerId !== ownerId) {
      const error: any = new Error('Unauthorized to access this case');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    return toPublicCaseDTO(caseDoc);
  }

  /**
   * Updates player notes and starred evidence.
   */
  public static async updatePlayerState(
    caseId: string,
    ownerId: string,
    input: UpdatePlayerStateRequest,
  ): Promise<PublicCaseResponse> {
    const caseDoc = await CaseRepository.findById(caseId);
    if (!caseDoc) {
      const error: any = new Error('Case not found');
      error.statusCode = 404;
      error.code = 'CASE_NOT_FOUND';
      throw error;
    }

    if (caseDoc.ownerId !== ownerId) {
      const error: any = new Error('Unauthorized to modify this case');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    if (input.markedEvidenceIds !== undefined) {
      caseDoc.playerState.markedEvidenceIds = input.markedEvidenceIds;
    }

    if (input.notes !== undefined) {
      caseDoc.playerState.notes = input.notes.map((n) => ({
        id: n.id || uuidv4(),
        evidenceId: n.evidenceId,
        text: n.text,
        updatedAt: n.updatedAt ? new Date(n.updatedAt) : new Date(),
      }));
    }

    await caseDoc.save();
    return toPublicCaseDTO(caseDoc);
  }

  /**
   * Authoritatively submits the final accusation and transitions to completed.
   */
  public static async submitAccusation(
    caseId: string,
    ownerId: string,
    suspectId: string,
  ): Promise<SolutionReveal> {
    const caseDoc = await CaseRepository.findById(caseId);
    if (!caseDoc) {
      const error: any = new Error('Case not found');
      error.statusCode = 404;
      error.code = 'CASE_NOT_FOUND';
      throw error;
    }

    if (caseDoc.ownerId !== ownerId) {
      const error: any = new Error('Unauthorized to submit accusation for this case');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    if (caseDoc.status === 'completed') {
      const error: any = new Error('Accusation already submitted for this case');
      error.statusCode = 400;
      error.code = 'ALREADY_SUBMITTED';
      throw error;
    }

    if (caseDoc.status !== 'ready') {
      const error: any = new Error('Case is not ready for accusation');
      error.statusCode = 400;
      error.code = 'CASE_NOT_READY';
      throw error;
    }

    // Verify suspect belongs to case
    const suspectExists = caseDoc.publicCase.suspects.some((s: any) => s.id === suspectId);
    if (!suspectExists) {
      const error: any = new Error(`Suspect ID "${suspectId}" is not in this case`);
      error.statusCode = 400;
      error.code = 'INVALID_SUSPECT';
      throw error;
    }

    // Server-authoritative check
    const isCorrect = caseDoc.privateSolution.culpritSuspectId === suspectId;

    caseDoc.status = 'completed';
    caseDoc.playerState.accusation = {
      suspectId,
      submittedAt: new Date(),
      isCorrect,
    };

    await caseDoc.save();

    return toSolutionDTO(caseDoc, suspectId);
  }

  /**
   * Retrieves the solution reveal for a completed case.
   */
  public static async getCaseReveal(caseId: string, ownerId: string): Promise<SolutionReveal> {
    const caseDoc = await CaseRepository.findById(caseId);
    if (!caseDoc) {
      const error: any = new Error('Case not found');
      error.statusCode = 404;
      error.code = 'CASE_NOT_FOUND';
      throw error;
    }

    if (caseDoc.ownerId !== ownerId) {
      const error: any = new Error('Unauthorized to view solution for this case');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    if (caseDoc.status !== 'completed' || !caseDoc.playerState?.accusation) {
      const error: any = new Error('Case solution is not available until accusation is submitted');
      error.statusCode = 403;
      error.code = 'CASE_NOT_COMPLETED';
      throw error;
    }

    return toSolutionDTO(caseDoc, caseDoc.playerState.accusation.suspectId);
  }

  /**
   * Lists cases owned by the current session.
   */
  public static async listUserCases(
    ownerId: string,
    limit = 20,
  ): Promise<ListCasesResponse> {
    const safeLimit = Math.min(Math.max(limit, 1), 50);
    const { cases, total } = await CaseRepository.findUserCases(ownerId, safeLimit);

    return {
      cases: cases.map((c) => toCaseSummaryDTO(c)),
      total,
    };
  }

  /**
   * Deletes a case owned by the user.
   */
  public static async deleteCase(caseId: string, ownerId: string): Promise<void> {
    const caseDoc = await CaseRepository.findById(caseId);
    if (!caseDoc) {
      const error: any = new Error('Case not found');
      error.statusCode = 404;
      error.code = 'CASE_NOT_FOUND';
      throw error;
    }

    if (caseDoc.ownerId !== ownerId) {
      const error: any = new Error('Unauthorized to delete this case');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    await CaseRepository.deleteById(caseId);
  }
}
