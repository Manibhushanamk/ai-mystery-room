export const GENRES = [
  'classic_mystery',
  'locked_room',
  'campus',
  'workplace',
  'heist',
  'sci_fi',
  'thriller',
] as const;

export type Genre = (typeof GENRES)[number];

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const EVIDENCE_TYPES = [
  'chat',
  'image',
  'camera_log',
  'witness_statement',
  'document',
  'timeline',
] as const;
export type EvidenceType = (typeof EVIDENCE_TYPES)[number];

export const CASE_STATUSES = [
  'queued',
  'generating_outline',
  'generating_evidence',
  'validating',
  'ready',
  'failed',
  'completed',
] as const;
export type CaseStatus = (typeof CASE_STATUSES)[number];

export const RELIABILITY_LEVELS = ['high', 'medium', 'low', 'unknown'] as const;
export type ReliabilityLevel = (typeof RELIABILITY_LEVELS)[number];

export const FICTIONAL_LABEL = 'FICTIONAL_SIMULATION' as const;
