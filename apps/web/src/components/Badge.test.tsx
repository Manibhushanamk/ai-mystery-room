import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FictionalBadge, ReliabilityBadge, DifficultyBadge } from './Badge.js';

describe('Badges', () => {
  it('renders fictional badge disclaimer', () => {
    render(<FictionalBadge />);
    expect(screen.getByText('FICTIONAL SIMULATION')).toBeDefined();
  });

  it('renders reliability badge with level', () => {
    render(<ReliabilityBadge level="high" />);
    expect(screen.getByText('Reliability: high')).toBeDefined();
  });

  it('renders difficulty badge', () => {
    render(<DifficultyBadge difficulty="hard" />);
    expect(screen.getByText('hard')).toBeDefined();
  });
});
