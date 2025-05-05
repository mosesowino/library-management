import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropdownMenu } from '../dropdown-menu';

describe('DropdownMenu component', () => {
  it('renders dropdown menu button', () => {
    render(<DropdownMenu><button>Menu</button></DropdownMenu>);
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('toggles menu visibility on button click', () => {
    render(
      <DropdownMenu>
        <button>Menu</button>
        <div data-testid="menu-content">Content</div>
      </DropdownMenu>
    );
    const button = screen.getByText('Menu');
    fireEvent.click(button);
    expect(screen.getByTestId('menu-content')).toBeVisible();
    fireEvent.click(button);
    expect(screen.getByTestId('menu-content')).not.toBeVisible();
  });
});
