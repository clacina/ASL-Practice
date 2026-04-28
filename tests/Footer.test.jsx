import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {Footer} from '../src/components/Footer';

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    expect(document.querySelector('.site-footer')).toBeInTheDocument();
  });

  it('includes an ASL icon with accessible label', () => {
    render(<Footer />);
    expect(screen.getByLabelText('ASL hand sign')).toBeInTheDocument();
  });

  it('contains all four disclaimer items', () => {
    render(<Footer />);
    expect(screen.getByText(/not for professional use/i)).toBeInTheDocument();
    expect(screen.getByText(/public domain videos/i)).toBeInTheDocument();
    expect(screen.getByText(/most recent versions of ASL/i)).toBeInTheDocument();
    expect(screen.getByText(/BSL/i)).toBeInTheDocument();
  });

  it('renders disclaimer inside a details element', () => {
    render(<Footer />);
    const details = document.querySelector('.site-footer__disclaimer');
    expect(details.tagName.toLowerCase()).toBe('details');
  });
});
