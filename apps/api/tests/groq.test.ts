import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GroqService } from '../src/services/ai/groqService.js';
import { env } from '../src/config/env.js';

describe('GroqService Integration & Schema Validation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('correctly reports availability based on GROQ_API_KEY', () => {
    const original = env.GROQ_API_KEY;
    try {
      (env as any).GROQ_API_KEY = '';
      expect(GroqService.isAvailable()).toBe(false);

      (env as any).GROQ_API_KEY = 'gsk_test123456789';
      expect(GroqService.isAvailable()).toBe(true);

      (env as any).GROQ_API_KEY = 'placeholder_key';
      expect(GroqService.isAvailable()).toBe(false);
    } finally {
      (env as any).GROQ_API_KEY = original;
    }
  });

  it('validates structured JSON outline generation from Groq response', async () => {
    const mockOutline = {
      title: 'The Stolen Chronometer',
      premise: 'A rare prototype timepiece disappeared from an inventor’s safe.',
      incidentSummary: 'At midnight, the vault alarm was deactivated without force.',
      incidentTime: '2026-10-25T00:00:00Z',
      briefing: 'You are tasked with uncovering who had the security clearance.',
      suspects: [
        {
          id: 'suspect_01',
          name: 'Arthur Pendelton',
          role: 'Chief Engineer',
          bio: 'Longtime associate with gambling debts.',
          relationshipToIncident: 'Had the master keycard.',
          publicMotive: 'Facing bankruptcy from failed investments.',
          statedAlibi: 'Claimed to be calibrating the observatory telescope.',
        },
        {
          id: 'suspect_02',
          name: 'Beatrice Chen',
          role: 'Security Director',
          bio: 'Former intelligence analyst.',
          relationshipToIncident: 'Controlled camera feeds.',
          publicMotive: 'Recently passed over for promotion.',
          statedAlibi: 'Reviewing patrol logs in control room.',
        },
      ],
      privateSolution: {
        culpritSuspectId: 'suspect_01',
        motive: 'Need for immediate liquid capital to settle private debts.',
        method: 'Used forged override cipher to open the safe before the night shift.',
        canonicalTimeline: [
          {
            time: '23:45',
            description: 'Arthur entered the vault corridor.',
            isCriticalToSolution: true,
          },
        ],
      },
    };

    const generateSpy = vi.spyOn(GroqService, 'generateJSON').mockResolvedValue(mockOutline as any);

    const result = await GroqService.generateOutline({
      scenario: 'A rare prototype timepiece disappeared from an inventor’s safe.',
      genre: 'classic_mystery',
      difficulty: 'medium',
    });

    expect(generateSpy).toHaveBeenCalledOnce();
    expect(result.title).toBe('The Stolen Chronometer');
    expect(result.privateSolution.culpritSuspectId).toBe('suspect_01');
    expect(result.suspects.length).toBe(2);
  });
});
