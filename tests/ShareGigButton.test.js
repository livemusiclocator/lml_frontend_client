/**
 * @jest-environment jsdom
 */

import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import ShareGigButton from '../src/components/ShareGigButton';

beforeEach(() => {
  Object.assign(navigator, { clipboard: { writeText: jest.fn(() => Promise.resolve()) } });
});

test('copies the gig short link', async () => {
  render(<ShareGigButton gig={{ short_url: 'https://lml.live/g/QpjpmD1L' }} />);

  await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Copy link to this gig' })));

  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('https://lml.live/g/QpjpmD1L');
  expect(screen.getByRole('button', { name: 'Link copied' })).toBeInTheDocument();
});

test('falls back to the page address without a short link', async () => {
  render(<ShareGigButton gig={{}} />);

  await act(async () => fireEvent.click(screen.getByRole('button')));

  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
});
