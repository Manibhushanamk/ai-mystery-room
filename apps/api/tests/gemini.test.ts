import { describe, it, expect } from 'vitest';
import {
  AICaseOutlineSchema,
  AICaseEvidencePacketSchema,
} from '../src/services/ai/aiSchemas.js';
import { PromptTemplates } from '../src/services/ai/promptTemplates.js';
import { EvidenceAssetService } from '../src/services/evidence-assets/evidenceAssetService.js';
import { GeminiService } from '../src/services/ai/geminiService.js';

describe('Gemini AI Pipeline & Schemas', () => {
  it('correctly parses a structured AI case outline fixture', () => {
    const fixture = {
      title: 'The Stolen Ledger',
      premise: 'A financial ledger vanished during a power outage.',
      incidentSummary: 'Vault door was forced open at 21:00.',
      incidentTime: '2026-10-24T21:00:00.000Z',
      briefing: 'Analyze suspect logs and testimonies to find who took the ledger.',
      setting: 'Financial District Office',
      genre: 'workplace',
      difficulty: 'medium',
      suspects: [
        {
          id: 'suspect_01',
          name: 'Alice Croft',
          role: 'Head Accountant',
          bio: 'In charge of the records.',
          relationshipToIncident: 'Had vault key.',
          publicMotive: 'Facing audit scrutiny.',
          statedAlibi: 'In conference room.',
        },
        {
          id: 'suspect_02',
          name: 'Bob Ross',
          role: 'Building Janitor',
          bio: 'Has access to master keycards.',
          relationshipToIncident: 'Found on floor 4.',
          publicMotive: 'Gambling debts.',
          statedAlibi: 'Cleaning basement.',
        },
        {
          id: 'suspect_03',
          name: 'Charlie Day',
          role: 'Security Guard',
          bio: 'Monitored camera feed.',
          relationshipToIncident: 'On duty.',
          publicMotive: 'Overdue salary.',
          statedAlibi: 'At desk.',
        },
      ],
      privateSolution: {
        culpritSuspectId: 'suspect_01',
        motive: 'Embezzlement coverup.',
        method: 'Staged blackout using breaker timer.',
        canonicalTimeline: [
          { time: '20:45', event: 'Timer set on breaker.', involvedSuspectIds: ['suspect_01'] },
          { time: '21:00', event: 'Vault opened and ledger removed.', involvedSuspectIds: ['suspect_01'] },
          { time: '21:15', event: 'Ledger concealed in car.', involvedSuspectIds: ['suspect_01'] },
        ],
      },
    };

    const parsed = AICaseOutlineSchema.parse(fixture);
    expect(parsed.title).toBe('The Stolen Ledger');
    expect(parsed.privateSolution.culpritSuspectId).toBe('suspect_01');
    expect(parsed.suspects.length).toBe(3);
  });

  it('rejects an invalid AI outline missing a culprit', () => {
    const invalidFixture = {
      title: 'Bad Outline',
      premise: 'No culprit outline.',
      incidentSummary: 'Missing details.',
      incidentTime: '2026-10-24T21:00:00.000Z',
      briefing: 'Missing details.',
      setting: 'Nowhere',
      genre: 'classic_mystery',
      difficulty: 'easy',
      suspects: [],
      privateSolution: {},
    };

    expect(() => AICaseOutlineSchema.parse(invalidFixture)).toThrow();
  });

  it('correctly parses an AI evidence packet fixture', () => {
    const fixture = {
      evidence: [
        {
          id: 'evidence_01',
          type: 'chat',
          title: 'Intercepted text',
          description: 'Text message recovered.',
          createdAtInStory: '2026-10-24T20:50:00.000Z',
          sourceLabel: 'Phone Export',
          reliability: 'high',
          content: { messages: [] },
        },
        {
          id: 'evidence_02',
          type: 'camera_log',
          title: 'Hallway CCTV',
          description: 'Camera transcript.',
          createdAtInStory: '2026-10-24T21:00:00.000Z',
          sourceLabel: 'CCTV Logs',
          reliability: 'high',
          content: { cameraCode: 'CAM-01' },
        },
        {
          id: 'evidence_03',
          type: 'document',
          title: 'Turnstile Audit',
          description: 'Gate log.',
          createdAtInStory: '2026-10-24T21:15:00.000Z',
          sourceLabel: 'Building Gate',
          reliability: 'high',
          content: { rows: [] },
        },
        {
          id: 'evidence_04',
          type: 'witness_statement',
          title: 'Witness Statement',
          description: 'Interview transcript.',
          createdAtInStory: '2026-10-24T21:30:00.000Z',
          sourceLabel: 'Detective Interview',
          reliability: 'medium',
          content: { statement: 'I saw someone run.' },
        },
      ],
      publicTimeline: [
        { id: 't1', time: '20:45', description: 'Lights flickered.', verified: true },
        { id: 't2', time: '21:00', description: 'Alarm tripped.', verified: true },
        { id: 't3', time: '21:15', description: 'Patrol dispatched.', verified: true },
      ],
      solutionExplanation: 'Evidence 01 and Evidence 02 directly show Alice Croft committed the theft.',
      evidenceReasoning: [
        {
          evidenceId: 'evidence_01',
          explanation: 'Proves motive and premeditation.',
          supports: ['suspect_01'],
          effect: 'supports_culprit' as const,
        },
        {
          evidenceId: 'evidence_02',
          explanation: 'Captures keycard swipe.',
          supports: ['suspect_01'],
          effect: 'supports_culprit' as const,
        },
      ],
    };

    const parsed = AICaseEvidencePacketSchema.parse(fixture);
    expect(parsed.evidence.length).toBe(4);
    expect(parsed.evidenceReasoning.length).toBe(2);
  });

  it('builds valid prompts from templates', () => {
    const prompt = PromptTemplates.buildOutlinePrompt({
      scenario: 'A priceless sapphire vanished from a museum vault during a gala.',
      genre: 'heist',
      difficulty: 'hard',
      setting: 'Metropolitan Museum',
    });

    expect(prompt).toContain('FAIR-PLAY DETECTIVE RULES');
    expect(prompt).toContain('Metropolitan Museum');
    expect(prompt).toContain('sapphire vanished');
  });

  it('generates placeholder and simulated CCTV SVG assets', () => {
    const placeholder = EvidenceAssetService.createPlaceholder({
      type: 'witness interview',
      title: 'Interview with Guard',
      description: 'Transcript of questions.',
    });
    expect(placeholder.kind).toBe('placeholder');
    expect(placeholder.altText).toContain('witness interview');

    const svgData = EvidenceAssetService.createCCTVSnapshotSVG('CAM-04', '22:42', 'Vault Corridor');
    expect(svgData).toContain('data:image/svg+xml');
    expect(svgData).toContain('CAM-04');
  });

  it('detects Gemini availability status safely without throwing', () => {
    const available = GeminiService.isAvailable();
    expect(typeof available).toBe('boolean');
  });
});
