import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.js';

describe('Web App Shell', () => {
  it('renders landing header, brand, and hero banner', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByText('AI Mystery Room')).toBeDefined();
    expect(screen.getAllByText('FICTIONAL SIMULATION').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('The Truth is Fixed.')).toBeDefined();
    expect(screen.getByText('Canonical Truth First')).toBeDefined();
  });
});
