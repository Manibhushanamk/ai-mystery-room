import { z } from 'zod';
import { GENRES, DIFFICULTIES, EVIDENCE_TYPES, RELIABILITY_LEVELS } from '@ai-mystery-room/shared';

export const AIOutlineSuspectSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  relationshipToIncident: z.string(),
  publicMotive: z.string(),
  statedAlibi: z.string(),
});

export const AICanonicalTimelineItemSchema = z.object({
  time: z.string(),
  event: z.string(),
  involvedSuspectIds: z.array(z.string()),
});

export const AICaseOutlineSchema = z.object({
  title: z.string(),
  premise: z.string(),
  incidentSummary: z.string(),
  incidentTime: z.string(),
  briefing: z.string(),
  setting: z.string(),
  genre: z.enum(GENRES),
  difficulty: z.enum(DIFFICULTIES),
  suspects: z.array(AIOutlineSuspectSchema).min(3).max(6),
  privateSolution: z.object({
    culpritSuspectId: z.string(),
    motive: z.string(),
    method: z.string(),
    canonicalTimeline: z.array(AICanonicalTimelineItemSchema).min(3),
  }),
});

export type AICaseOutline = z.infer<typeof AICaseOutlineSchema>;

export const AIEvidenceItemSchema = z.object({
  id: z.string(),
  type: z.enum(EVIDENCE_TYPES),
  title: z.string(),
  description: z.string(),
  createdAtInStory: z.string(),
  sourceLabel: z.string(),
  reliability: z.enum(RELIABILITY_LEVELS),
  content: z.record(z.any()),
});

export const AITimelineEventSchema = z.object({
  id: z.string(),
  time: z.string(),
  description: z.string(),
  verified: z.boolean(),
  relatedSuspectIds: z.array(z.string()).optional(),
  relatedEvidenceIds: z.array(z.string()).optional(),
});

export const AIEvidenceReasoningSchema = z.object({
  evidenceId: z.string(),
  explanation: z.string(),
  supports: z.array(z.string()),
  effect: z.enum(['supports_culprit', 'weakens_alternative', 'red_herring', 'context']),
});

export const AIDebunkedRedHerringSchema = z.object({
  suspectId: z.string().optional(),
  explanation: z.string(),
});

export const AICaseEvidencePacketSchema = z.object({
  evidence: z.array(AIEvidenceItemSchema).min(4).max(14),
  publicTimeline: z.array(AITimelineEventSchema).min(3),
  solutionExplanation: z.string(),
  evidenceReasoning: z.array(AIEvidenceReasoningSchema).min(2),
  debunkedRedHerrings: z.array(AIDebunkedRedHerringSchema).optional(),
});

export type AICaseEvidencePacket = z.infer<typeof AICaseEvidencePacketSchema>;
