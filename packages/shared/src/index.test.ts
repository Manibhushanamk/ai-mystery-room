import { describe, it, expect } from 'vitest';
import { CreateCaseSchema, AccusationRequestSchema, GENRES } from './index.js';

describe('Shared Schemas', () => {
  it('validates a correct CreateCase input', () => {
    const input = {
      scenario: 'A rare painting was stolen from the gallery during a blackout.',
      genre: 'heist',
      difficulty: 'hard',
      setting: 'National Art Gallery, London',
    };
    const parsed = CreateCaseSchema.parse(input);
    expect(parsed.genre).toBe('heist');
    expect(parsed.difficulty).toBe('hard');
    expect(parsed.scenario).toContain('painting was stolen');
  });

  it('rejects an empty or too short scenario seed', () => {
    const input = {
      scenario: 'Too short',
    };
    expect(() => CreateCaseSchema.parse(input)).toThrow();
  });

  it('validates an accusation request', () => {
    const input = { suspectId: 'suspect_01' };
    const parsed = AccusationRequestSchema.parse(input);
    expect(parsed.suspectId).toBe('suspect_01');
  });

  it('has valid genres defined', () => {
    expect(GENRES).toContain('classic_mystery');
    expect(GENRES).toContain('locked_room');
  });
});
