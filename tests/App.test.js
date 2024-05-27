import { render, screen } from '@testing-library/react';
import React from 'react';

test('renders hello world', () => {
  render(<h1>Hello, World!</h1>);
  const linkElement = screen.getByText(/Hello, World!/i);
  expect(linkElement).toBeInTheDocument();
});
