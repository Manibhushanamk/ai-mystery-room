import type {
  CaseStatus,
  Difficulty,
  EvidenceType,
  Genre,
  ReliabilityLevel,
  FICTIONAL_LABEL,
} from '../constants/index.js';

export * from '../constants/index.js';

export interface EvidenceAsset {
  kind: 'generated_image' | 'placeholder';
  url?: string;
  altText: string;
  mimeType?: string;
  status: 'ready' | 'pending' | 'failed' | 'placeholder';
}

export interface PublicSuspect {
  id: string; // e.g. "suspect_01"
  name: string;
  role: string;
  bio: string;
  relationshipToIncident: string;
  publicMotive: string;
  statedAlibi: string;
  portraitAsset?: EvidenceAsset;
}

export interface ChatMessage {
  senderId: string;
  senderName: string;
  timestamp: string;
  text: string;
}

export interface ChatContent {
  participants: Array<{ id: string; name: string }>;
  messages: ChatMessage[];
}

export interface CameraLogContent {
  cameraCode: string;
  location: string;
  eventTime: string;
  observations: string[];
  stillSnapshotSummary?: string;
}

export interface WitnessStatementContent {
  witnessName: string;
  interviewTime: string;
  interviewer: string;
  statementTranscript: string;
  keyClaims: string[];
}

export interface DocumentContent {
  documentTitle: string;
  issuer: string;
  dateIssued: string;
  bodySections: Array<{ header: string; content: string }>;
  redactedNotes?: string;
}

export interface ImageClueContent {
  sceneDescription: string;
  visualClues: string[];
  captureTime?: string;
}

export type EvidenceContent =
  | ChatContent
  | CameraLogContent
  | WitnessStatementContent
  | DocumentContent
  | ImageClueContent
  | Record<string, unknown>;

export interface PublicEvidence {
  id: string; // e.g. "evidence_01"
  type: EvidenceType;
  title: string;
  description: string;
  createdAtInStory: string;
  sourceLabel: string;
  reliability: ReliabilityLevel;
  content: EvidenceContent;
  asset?: EvidenceAsset;
  fictionalLabel: typeof FICTIONAL_LABEL;
}

export interface PublicTimelineEvent {
  id: string;
  time: string;
  description: string;
  verified: boolean;
  relatedSuspectIds?: string[];
  relatedEvidenceIds?: string[];
}

export interface PlayerNote {
  id: string;
  evidenceId?: string;
  text: string;
  updatedAt: string;
}

export interface PlayerAccusation {
  suspectId: string;
  submittedAt: string;
  correct: boolean;
}

export interface PlayerState {
  markedEvidenceIds: string[];
  notes: PlayerNote[];
  accusation?: PlayerAccusation;
}

export interface PublicCaseData {
  premise: string;
  incidentSummary: string;
  incidentTime: string;
  briefing: string;
  suspects: PublicSuspect[];
  evidence: PublicEvidence[];
  timeline: PublicTimelineEvent[];
}

export interface PublicCaseResponse {
  id: string;
  ownerId: string;
  title: string;
  scenarioSeed: string;
  genre: Genre;
  difficulty: Difficulty;
  setting: string;
  status: CaseStatus;
  publicCase: PublicCaseData;
  playerState: PlayerState;
  createdAt: string;
  updatedAt: string;
}

export interface CaseStatusResponse {
  caseId: string;
  status: CaseStatus;
  stage: string;
  progress: number;
  error?: string | null;
}

export interface CreateCaseRequest {
  scenario: string;
  genre?: Genre;
  difficulty?: Difficulty;
  setting?: string;
  evidencePreferences?: EvidenceType[];
}

export interface CreateCaseResponse {
  caseId: string;
  status: CaseStatus;
  statusUrl: string;
}

export interface UpdatePlayerStateRequest {
  markedEvidenceIds?: string[];
  notes?: Array<{ id?: string; evidenceId?: string; text: string; updatedAt?: string }>;
}

export interface AccusationRequest {
  suspectId: string;
}

export interface SolutionEvidenceReasoning {
  evidenceId: string;
  explanation: string;
}

export interface SolutionReveal {
  result: 'correct' | 'incorrect';
  selectedSuspectId: string;
  culprit: {
    suspectId: string;
    name: string;
    role?: string;
  };
  motive: string;
  method: string;
  solutionExplanation: string;
  evidenceReasoning: SolutionEvidenceReasoning[];
  debunkedRedHerrings?: Array<{
    suspectId?: string;
    explanation: string;
  }>;
}

export interface CaseSummaryItem {
  id: string;
  title: string;
  genre: Genre;
  difficulty: Difficulty;
  setting: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  isSolved?: boolean;
}

export interface ListCasesResponse {
  cases: CaseSummaryItem[];
  nextCursor?: string | null;
  total?: number;
}
