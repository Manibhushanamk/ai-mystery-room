import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.js';

describe('Web App Shell', () => {
  it('renders landing header and brand', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('AI Mystery Room')).toBeDefined();
    expect(screen.getByText('FICTIONAL SIMULATION')).toBeDefined();
    expect(screen.getByText('Step Into The Detective Desk')).toBeDefined();
  });
});
