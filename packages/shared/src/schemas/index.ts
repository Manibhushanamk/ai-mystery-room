import { z } from 'zod';
import {
  GENRES,
  DIFFICULTIES,
  EVIDENCE_TYPES,
  RELIABILITY_LEVELS,
  FICTIONAL_LABEL,
  CASE_STATUSES,
} from '../constants/index.js';

export const CreateCaseSchema = z.object({
  scenario: z
    .string()
    .min(20, 'Scenario seed must be at least 20 characters long.')
    .max(2000, 'Scenario seed cannot exceed 2000 characters.')
    .trim(),
  genre: z.enum(GENRES).optional().default('classic_mystery'),
  difficulty: z.enum(DIFFICULTIES).optional().default('medium'),
  setting: z.string().max(120, 'Setting cannot exceed 120 characters.').trim().optional().default(''),
  evidencePreferences: z.array(z.enum(EVIDENCE_TYPES)).optional().default([...EVIDENCE_TYPES]),
});

export const AccusationRequestSchema = z.object({
  suspectId: z.string().min(1, 'Suspect ID is required.').trim(),
});

export const PlayerNoteInputSchema = z.object({
  id: z.string().optional(),
  evidenceId: z.string().optional(),
  text: z.string().max(2000, 'Note text cannot exceed 2000 characters.'),
  updatedAt: z.string().optional(),
});

export const UpdatePlayerStateSchema = z.object({
  markedEvidenceIds: z.array(z.string()).optional(),
  notes: z.array(PlayerNoteInputSchema).optional(),
});

export const EvidenceAssetSchema = z.object({
  kind: z.enum(['generated_image', 'placeholder']),
  url: z.string().url().optional(),
  altText: z.string(),
  mimeType: z.string().optional(),
  status: z.enum(['ready', 'pending', 'failed', 'placeholder']),
});

export const PublicSuspectSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  relationshipToIncident: z.string(),
  publicMotive: z.string(),
  statedAlibi: z.string(),
  portraitAsset: EvidenceAssetSchema.optional(),
});

export const PublicEvidenceSchema = z.object({
  id: z.string(),
  type: z.enum(EVIDENCE_TYPES),
  title: z.string(),
  description: z.string(),
  createdAtInStory: z.string(),
  sourceLabel: z.string(),
  reliability: z.enum(RELIABILITY_LEVELS),
  content: z.record(z.any()),
  asset: EvidenceAssetSchema.optional(),
  fictionalLabel: z.literal(FICTIONAL_LABEL),
});

export const PublicTimelineEventSchema = z.object({
  id: z.string(),
  time: z.string(),
  description: z.string(),
  verified: z.boolean(),
  relatedSuspectIds: z.array(z.string()).optional(),
  relatedEvidenceIds: z.array(z.string()).optional(),
});

export const PublicCaseDataSchema = z.object({
  premise: z.string(),
  incidentSummary: z.string(),
  incidentTime: z.string(),
  briefing: z.string(),
  suspects: z.array(PublicSuspectSchema).min(3).max(6),
  evidence: z.array(PublicEvidenceSchema).min(4).max(16),
  timeline: z.array(PublicTimelineEventSchema).min(2),
});

export const CaseStatusSchema = z.enum(CASE_STATUSES);
