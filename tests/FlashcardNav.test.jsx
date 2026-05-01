import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {FlashcardNav} from '../src/components/FlashcardNav';

function baseProps(overrides = {}) {
    return {
        onPrev: vi.fn(),
        onNext: vi.fn(),
        onShuffle: vi.fn(),
        autoPlay: false,
        onToggleAutoPlay: vi.fn(),
        autoPlayActiveLabel: '🔁 Auto',
        autoPlayInactiveLabel: '⏸ Wait',
        showPlayerControls: true,
        onTogglePlayerControls: vi.fn(),
        playing: false,
        onTogglePlaying: vi.fn(),
        playbackRate: 1,
        onTogglePlaybackRate: vi.fn(),
        repeat: false,
        onToggleRepeat: vi.fn(),
        ...overrides,
    };
}

describe('FlashcardNav', () => {
    it('renders Prev, Next and Shuffle buttons', () => {
        render(<FlashcardNav {...baseProps()} />);
        expect(screen.getByText('← Prev')).toBeInTheDocument();
        expect(screen.getByText('Next →')).toBeInTheDocument();
        expect(screen.getByText('⇄ Shuffle')).toBeInTheDocument();
    });

    it('calls onPrev when Prev is clicked', () => {
        const onPrev = vi.fn();
        render(<FlashcardNav {...baseProps({onPrev})} />);
        fireEvent.click(screen.getByText('← Prev'));
        expect(onPrev).toHaveBeenCalledOnce();
    });

    it('calls onNext when Next is clicked', () => {
        const onNext = vi.fn();
        render(<FlashcardNav {...baseProps({onNext})} />);
        fireEvent.click(screen.getByText('Next →'));
        expect(onNext).toHaveBeenCalledOnce();
    });

    it('calls onShuffle when Shuffle is clicked', () => {
        const onShuffle = vi.fn();
        render(<FlashcardNav {...baseProps({onShuffle})} />);
        fireEvent.click(screen.getByText('⇄ Shuffle'));
        expect(onShuffle).toHaveBeenCalledOnce();
    });

    it('does not render Terms button when onOpenTerms is not provided', () => {
        render(<FlashcardNav {...baseProps()} />);
        expect(screen.queryByText('📋 Terms')).not.toBeInTheDocument();
    });

    it('renders Terms button when onOpenTerms is provided', () => {
        render(<FlashcardNav {...baseProps({onOpenTerms: vi.fn()})} />);
        expect(screen.getByText('📋 Terms')).toBeInTheDocument();
    });

    it('calls onOpenTerms when Terms is clicked', () => {
        const onOpenTerms = vi.fn();
        render(<FlashcardNav {...baseProps({onOpenTerms})} />);
        fireEvent.click(screen.getByText('📋 Terms'));
        expect(onOpenTerms).toHaveBeenCalledOnce();
    });

    it('shows inactive auto-play label when autoPlay is false', () => {
        render(<FlashcardNav {...baseProps({autoPlay: false, autoPlayInactiveLabel: '⏸ Wait'})} />);
        expect(screen.getByText('⏸ Wait')).toBeInTheDocument();
    });

    it('shows active auto-play label when autoPlay is true', () => {
        render(<FlashcardNav {...baseProps({autoPlay: true, autoPlayActiveLabel: '🔁 Auto'})} />);
        expect(screen.getByText('🔁 Auto')).toBeInTheDocument();
    });

    it('auto-play button has active class when autoPlay is true', () => {
        render(<FlashcardNav {...baseProps({autoPlay: true, autoPlayActiveLabel: '🔁 Auto'})} />);
        expect(screen.getByText('🔁 Auto')).toHaveClass('btn-nav--active');
    });

    it('calls onToggleAutoPlay when auto-play button is clicked', () => {
        const onToggleAutoPlay = vi.fn();
        render(<FlashcardNav {...baseProps({onToggleAutoPlay})} />);
        fireEvent.click(screen.getByText('⏸ Wait'));
        expect(onToggleAutoPlay).toHaveBeenCalledOnce();
    });

    it('controls button has active class when showPlayerControls is true', () => {
        render(<FlashcardNav {...baseProps({showPlayerControls: true})} />);
        expect(screen.getByText('🎛️ Controls')).toHaveClass('btn-nav--active');
    });

    it('controls button lacks active class when showPlayerControls is false', () => {
        render(<FlashcardNav {...baseProps({showPlayerControls: false})} />);
        expect(screen.getByText('🎛️ Controls')).not.toHaveClass('btn-nav--active');
    });

    it('calls onTogglePlayerControls when controls button is clicked', () => {
        const onTogglePlayerControls = vi.fn();
        render(<FlashcardNav {...baseProps({onTogglePlayerControls})} />);
        fireEvent.click(screen.getByText('🎛️ Controls'));
        expect(onTogglePlayerControls).toHaveBeenCalledOnce();
    });

    it('shows ▶ play icon when not playing', () => {
        render(<FlashcardNav {...baseProps({playing: false})} />);
        expect(screen.getByText('▶')).toBeInTheDocument();
    });

    it('shows ⏸ pause icon when playing', () => {
        render(<FlashcardNav {...baseProps({playing: true})} />);
        expect(screen.getByText('⏸')).toBeInTheDocument();
    });

    it('play button has active class when playing', () => {
        render(<FlashcardNav {...baseProps({playing: true})} />);
        expect(screen.getByText('⏸')).toHaveClass('btn-nav--active');
    });

    it('calls onTogglePlaying when play/pause button is clicked', () => {
        const onTogglePlaying = vi.fn();
        render(<FlashcardNav {...baseProps({onTogglePlaying})} />);
        fireEvent.click(screen.getByText('▶'));
        expect(onTogglePlaying).toHaveBeenCalledOnce();
    });

    it('shows 1× speed label at normal rate', () => {
        render(<FlashcardNav {...baseProps({playbackRate: 1})} />);
        expect(screen.getByText(/🐢\s*1×/)).toBeInTheDocument();
    });

    it('shows ½× speed label at half rate and applies active class', () => {
        render(<FlashcardNav {...baseProps({playbackRate: 0.5})} />);
        const btn = screen.getByText(/🐢\s*½×/);
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveClass('btn-nav--active');
    });

    it('calls onTogglePlaybackRate when speed button is clicked', () => {
        const onTogglePlaybackRate = vi.fn();
        render(<FlashcardNav {...baseProps({onTogglePlaybackRate})} />);
        fireEvent.click(screen.getByText(/🐢\s*1×/));
        expect(onTogglePlaybackRate).toHaveBeenCalledOnce();
    });

    it('applies extra className to the nav container', () => {
        const {container} = render(<FlashcardNav {...baseProps({className: 'fcs-landscape__nav'})} />);
        expect(container.firstChild).toHaveClass('flashcard-nav', 'fcs-landscape__nav');
    });

    it('container has only flashcard-nav class when no extra className is given', () => {
        const {container} = render(<FlashcardNav {...baseProps()} />);
        expect(container.firstChild).toHaveClass('flashcard-nav');
        expect(container.firstChild.className).toBe('flashcard-nav');
    });

    it('renders Loop button', () => {
        render(<FlashcardNav {...baseProps()} />);
        expect(screen.getByText('🔁 Loop')).toBeInTheDocument();
    });

    it('Loop button lacks active class when repeat is false', () => {
        render(<FlashcardNav {...baseProps({repeat: false})} />);
        expect(screen.getByText('🔁 Loop')).not.toHaveClass('btn-nav--active');
    });

    it('Loop button has active class when repeat is true', () => {
        render(<FlashcardNav {...baseProps({repeat: true})} />);
        expect(screen.getByText('🔁 Loop')).toHaveClass('btn-nav--active');
    });

    it('calls onToggleRepeat when Loop button is clicked', () => {
        const onToggleRepeat = vi.fn();
        render(<FlashcardNav {...baseProps({onToggleRepeat})} />);
        fireEvent.click(screen.getByText('🔁 Loop'));
        expect(onToggleRepeat).toHaveBeenCalledOnce();
    });
});