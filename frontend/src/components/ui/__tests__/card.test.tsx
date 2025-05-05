import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from '../card';

describe('Card component', () => {
  it('renders card with children', () => {
    render(<Card><div>Card Content</div></Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });
});
