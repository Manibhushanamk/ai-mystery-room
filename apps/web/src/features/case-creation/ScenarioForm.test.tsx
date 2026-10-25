import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ScenarioForm } from './ScenarioForm.js';

describe('ScenarioForm Component', () => {
  it('renders presets and input controls', () => {
    render(
      <MemoryRouter>
        <ScenarioForm />
      </MemoryRouter>,
    );

    expect(screen.getByText('Commission a New Investigation')).toBeDefined();
    expect(screen.getByText('Quick Investigation Presets')).toBeDefined();
    expect(screen.getByText('The Quantum Core Breach')).toBeDefined();
    expect(screen.getByText('Generate Case')).toBeDefined();
  });
});
