import mongoose, { Schema, type Document, type Model } from 'mongoose';
import type {
  CaseStatus,
  Difficulty,
  EvidenceType,
  Genre,
  ReliabilityLevel,
} from '@ai-mystery-room/shared';

export interface IMysteryCase extends Document {
  ownerId: string;
  title: string;
  scenarioSeed: string;
  genre: Genre;
  difficulty: Difficulty;
  setting: string;
  status: CaseStatus;
  publicCase: {
    premise: string;
    incidentSummary: string;
    incidentTime: string;
    briefing: string;
    suspects: Array<{
      id: string;
      name: string;
      role: string;
      bio: string;
      relationshipToIncident: string;
      publicMotive: string;
      statedAlibi: string;
      portraitAsset?: {
        kind: 'generated_image' | 'placeholder';
        url?: string;
        altText: string;
        mimeType?: string;
        status: 'ready' | 'pending' | 'failed' | 'placeholder';
      };
    }>;
    evidence: Array<{
      id: string;
      type: EvidenceType;
      title: string;
      description: string;
      createdAtInStory: string;
      sourceLabel: string;
      reliability: ReliabilityLevel;
      content: Record<string, any>;
      asset?: {
        kind: 'generated_image' | 'placeholder';
        url?: string;
        altText: string;
        mimeType?: string;
        status: 'ready' | 'pending' | 'failed' | 'placeholder';
      };
      fictionalLabel: 'FICTIONAL_SIMULATION';
    }>;
    timeline: Array<{
      id: string;
      time: string;
      description: string;
      verified: boolean;
      relatedSuspectIds?: string[];
      relatedEvidenceIds?: string[];
    }>;
  };
  privateSolution: {
    culpritSuspectId: string;
    motive: string;
    method: string;
    canonicalTimeline: Array<{
      time: string;
      event: string;
      involvedSuspectIds: string[];
    }>;
    solutionExplanation: string;
    evidenceReasoning: Array<{
      evidenceId: string;
      explanation: string;
      supports: string[];
      effect: 'supports_culprit' | 'weakens_alternative' | 'red_herring' | 'context';
    }>;
    debunkedRedHerrings?: Array<{
      suspectId?: string;
      explanation: string;
    }>;
  };
  generation: {
    stage: string;
    progress: number;
    attempts: number;
    lastErrorCode?: string | null;
    model?: string;
    startedAt?: Date;
    completedAt?: Date;
  };
  playerState: {
    markedEvidenceIds: string[];
    notes: Array<{
      id: string;
      evidenceId?: string;
      text: string;
      updatedAt: Date;
    }>;
    accusation?: {
      suspectId: string;
      submittedAt: Date;
      correct: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const EvidenceAssetSchema = new Schema(
  {
    kind: { type: String, enum: ['generated_image', 'placeholder'], default: 'placeholder' },
    url: { type: String },
    altText: { type: String, default: 'Simulated evidence asset' },
    mimeType: { type: String },
    status: { type: String, enum: ['ready', 'pending', 'failed', 'placeholder'], default: 'placeholder' },
  },
  { _id: false },
);

const SuspectSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, required: true },
    relationshipToIncident: { type: String, required: true },
    publicMotive: { type: String, required: true },
    statedAlibi: { type: String, required: true },
    portraitAsset: { type: EvidenceAssetSchema },
  },
  { _id: false },
);

const EvidenceItemSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ['chat', 'image', 'camera_log', 'witness_statement', 'document', 'timeline'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAtInStory: { type: String, required: true },
    sourceLabel: { type: String, required: true },
    reliability: { type: String, enum: ['high', 'medium', 'low', 'unknown'], default: 'medium' },
    content: { type: Schema.Types.Mixed, default: {} },
    asset: { type: EvidenceAssetSchema },
    fictionalLabel: { type: String, default: 'FICTIONAL_SIMULATION' },
  },
  { _id: false },
);

const TimelineEventSchema = new Schema(
  {
    id: { type: String, required: true },
    time: { type: String, required: true },
    description: { type: String, required: true },
    verified: { type: Boolean, default: false },
    relatedSuspectIds: [{ type: String }],
    relatedEvidenceIds: [{ type: String }],
  },
  { _id: false },
);

const MysteryCaseSchema = new Schema<IMysteryCase>(
  {
    ownerId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    scenarioSeed: { type: String, required: true },
    genre: {
      type: String,
      enum: ['classic_mystery', 'locked_room', 'campus', 'workplace', 'heist', 'sci_fi', 'thriller'],
      default: 'classic_mystery',
    },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    setting: { type: String, default: '' },
    status: {
      type: String,
      enum: [
        'queued',
        'generating_outline',
        'generating_evidence',
        'validating',
        'ready',
        'failed',
        'completed',
      ],
      default: 'queued',
      index: true,
    },
    publicCase: {
      premise: { type: String, default: '' },
      incidentSummary: { type: String, default: '' },
      incidentTime: { type: String, default: '' },
      briefing: { type: String, default: '' },
      suspects: [SuspectSchema],
      evidence: [EvidenceItemSchema],
      timeline: [TimelineEventSchema],
    },
    privateSolution: {
      culpritSuspectId: { type: String, default: '' },
      motive: { type: String, default: '' },
      method: { type: String, default: '' },
      canonicalTimeline: [
        {
          time: { type: String },
          event: { type: String },
          involvedSuspectIds: [{ type: String }],
        },
      ],
      solutionExplanation: { type: String, default: '' },
      evidenceReasoning: [
        {
          evidenceId: { type: String },
          explanation: { type: String },
          supports: [{ type: String }],
          effect: {
            type: String,
            enum: ['supports_culprit', 'weakens_alternative', 'red_herring', 'context'],
          },
        },
      ],
      debunkedRedHerrings: [
        {
          suspectId: { type: String },
          explanation: { type: String },
        },
      ],
    },
    generation: {
      stage: { type: String, default: 'Queued' },
      progress: { type: Number, default: 0 },
      attempts: { type: Number, default: 0 },
      lastErrorCode: { type: String, default: null },
      model: { type: String },
      startedAt: { type: Date },
      completedAt: { type: Date },
    },
    playerState: {
      markedEvidenceIds: [{ type: String }],
      notes: [
        {
          id: { type: String, required: true },
          evidenceId: { type: String },
          text: { type: String, required: true },
          updatedAt: { type: Date, default: Date.now },
        },
      ],
      accusation: {
        suspectId: { type: String },
        submittedAt: { type: Date },
        correct: { type: Boolean },
      },
    },
  },
  {
    timestamps: true,
  },
);

MysteryCaseSchema.index({ ownerId: 1, createdAt: -1 });

export const MysteryCase: Model<IMysteryCase> =
  mongoose.models.MysteryCase || mongoose.model<IMysteryCase>('MysteryCase', MysteryCaseSchema);
