import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import InputForm from '../src/pages/InputForm';
import Dashboard from '../src/pages/Dashboard';

describe('EcoTrack UI', () => {
  it('renders the activity logger with accessible labels and preset buttons', () => {
    render(<InputForm onSaveLog={() => {}} />);

    expect(screen.getByRole('heading', { name: /log daily activities/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/logging date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /eco day/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /commuter/i })).toBeInTheDocument();
  });

  it('renders dashboard sustainability insights for evaluators', () => {
    render(
      <Dashboard
        logs={[]}
        settings={{ userName: 'Eco Explorer', dailyTarget: 12 }}
        completedSuggestions={[]}
        suggestions={[]}
        onClaimSuggestion={() => {}}
        ecoPoints={150}
        setActivePage={() => {}}
      />
    );

    expect(screen.getByText(/sustainability score/i)).toBeInTheDocument();
    expect(screen.getByText(/weekly progress/i)).toBeInTheDocument();
  });

  it('allows the user to switch categories and save a log entry', async () => {
    const user = userEvent.setup();
    const handleSave = vi.fn();

    render(<InputForm onSaveLog={handleSave} />);

    await user.click(screen.getByRole('button', { name: /eco day/i }));
    await user.click(screen.getByRole('button', { name: /save log/i }));

    expect(handleSave).toHaveBeenCalled();
  });
});
