import {describe, it, expect} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
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

  it('shows a Disclaimer trigger button', () => {
    render(<Footer />);
    expect(screen.getByText('Disclaimer')).toBeInTheDocument();
    expect(document.querySelector('.disclaimer-modal')).not.toBeInTheDocument();
  });

  it('opens the modal when Disclaimer is clicked', () => {
    render(<Footer />);
    fireEvent.click(screen.getByText('Disclaimer'));
    expect(document.querySelector('.disclaimer-modal')).toBeInTheDocument();
  });

  it('contains disclaimer content when modal is open', () => {
    render(<Footer />);
    fireEvent.click(screen.getByText('Disclaimer'));
    expect(screen.getByText(/not for professional use/i)).toBeInTheDocument();
    expect(screen.getByText(/do not own/i)).toBeInTheDocument();
    expect(screen.getByText(/most recent versions of ASL/i)).toBeInTheDocument();
    expect(screen.getByText(/BSL/i)).toBeInTheDocument();
  });

  it('closes the modal when the close button is clicked', () => {
    render(<Footer />);
    fireEvent.click(screen.getByText('Disclaimer'));
    fireEvent.click(document.querySelector('.disclaimer-modal__close'));
    expect(document.querySelector('.disclaimer-modal')).not.toBeInTheDocument();
  });

  it('closes the modal when the backdrop is clicked', () => {
    render(<Footer />);
    fireEvent.click(screen.getByText('Disclaimer'));
    fireEvent.click(document.querySelector('.disclaimer-modal__backdrop'));
    expect(document.querySelector('.disclaimer-modal')).not.toBeInTheDocument();
  });

  it('closes the modal on Escape key', () => {
    render(<Footer />);
    fireEvent.click(screen.getByText('Disclaimer'));
    fireEvent.keyDown(window, {key: 'Escape'});
    expect(document.querySelector('.disclaimer-modal')).not.toBeInTheDocument();
  });
});
