import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '../page';

describe('Main Page component', () => {
  it('renders without crashing', () => {
    render(<Page />);
    // Add more specific tests here based on the page content
    expect(screen.getByText(/library/i)).toBeInTheDocument();
  });
});
