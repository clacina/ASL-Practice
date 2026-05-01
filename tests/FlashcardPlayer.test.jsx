import {describe, it, expect, vi, beforeEach} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {FlashcardPlayer} from '../src/components/FlashcardPlayer';

vi.mock('react-player', () => {
    const MockPlayer = vi.fn(({src, playing, loop, controls, playbackRate, onPlay, onPause, onEnded, onError}) => (
        <div
            data-testid="react-player"
            data-src={src}
            data-playing={String(playing)}
            data-loop={String(loop)}
            data-controls={String(controls)}
            data-playback-rate={String(playbackRate)}
        >
            <button data-testid="trigger-play" onClick={onPlay} />
            <button data-testid="trigger-pause" onClick={onPause} />
            <button data-testid="trigger-ended" onClick={onEnded} />
            <button data-testid="trigger-error" onClick={() => onError && onError(new Error('test error'))} />
        </div>
    ));
    return {default: MockPlayer};
});

const TEST_URL = 'https://example.com/sign.mp4';

function baseProps(overrides = {}) {
    return {
        url: TEST_URL,
        playing: false,
        loop: false,
        autoPlay: false,
        controls: true,
        playbackRate: 1,
        onPlay: vi.fn(),
        onPause: vi.fn(),
        onEnded: vi.fn(),
        onError: vi.fn(),
        ...overrides,
    };
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('FlashcardPlayer', () => {
    it('renders the flashcard-video container', () => {
        const {container} = render(<FlashcardPlayer {...baseProps()} />);
        expect(container.firstChild).toHaveClass('flashcard-video');
    });

    it('renders the player when url is provided', () => {
        render(<FlashcardPlayer {...baseProps()} />);
        expect(screen.getByTestId('react-player')).toBeInTheDocument();
        expect(screen.queryByText('No video available')).not.toBeInTheDocument();
    });

    it('renders the placeholder when url is empty string', () => {
        render(<FlashcardPlayer {...baseProps({url: ''})} />);
        expect(screen.getByText('No video available')).toBeInTheDocument();
        expect(screen.queryByTestId('react-player')).not.toBeInTheDocument();
    });

    it('renders the placeholder when url is null', () => {
        render(<FlashcardPlayer {...baseProps({url: null})} />);
        expect(screen.getByText('No video available')).toBeInTheDocument();
        expect(screen.queryByTestId('react-player')).not.toBeInTheDocument();
    });

    it('passes url as src to the player', () => {
        render(<FlashcardPlayer {...baseProps({url: TEST_URL})} />);
        expect(screen.getByTestId('react-player')).toHaveAttribute('data-src', TEST_URL);
    });

    it('passes playing=true to the player', () => {
        render(<FlashcardPlayer {...baseProps({playing: true})} />);
        expect(screen.getByTestId('react-player')).toHaveAttribute('data-playing', 'true');
    });

    it('passes playing=false to the player', () => {
        render(<FlashcardPlayer {...baseProps({playing: false})} />);
        expect(screen.getByTestId('react-player')).toHaveAttribute('data-playing', 'false');
    });

    it('passes loop=true to the player', () => {
        render(<FlashcardPlayer {...baseProps({loop: true})} />);
        expect(screen.getByTestId('react-player')).toHaveAttribute('data-loop', 'true');
    });

    it('passes loop=false to the player', () => {
        render(<FlashcardPlayer {...baseProps({loop: false})} />);
        expect(screen.getByTestId('react-player')).toHaveAttribute('data-loop', 'false');
    });

    it('passes controls=true to the player', () => {
        render(<FlashcardPlayer {...baseProps({controls: true})} />);
        expect(screen.getByTestId('react-player')).toHaveAttribute('data-controls', 'true');
    });

    it('passes controls=false to the player', () => {
        render(<FlashcardPlayer {...baseProps({controls: false})} />);
        expect(screen.getByTestId('react-player')).toHaveAttribute('data-controls', 'false');
    });

    it('passes playbackRate to the player', () => {
        render(<FlashcardPlayer {...baseProps({playbackRate: 0.5})} />);
        expect(screen.getByTestId('react-player')).toHaveAttribute('data-playback-rate', '0.5');
    });

    it('calls onPlay when the player fires play', () => {
        const onPlay = vi.fn();
        render(<FlashcardPlayer {...baseProps({onPlay})} />);
        fireEvent.click(screen.getByTestId('trigger-play'));
        expect(onPlay).toHaveBeenCalledOnce();
    });

    it('calls onPause when the player fires pause', () => {
        const onPause = vi.fn();
        render(<FlashcardPlayer {...baseProps({onPause})} />);
        fireEvent.click(screen.getByTestId('trigger-pause'));
        expect(onPause).toHaveBeenCalledOnce();
    });

    it('calls onEnded when the player fires ended', () => {
        const onEnded = vi.fn();
        render(<FlashcardPlayer {...baseProps({onEnded})} />);
        fireEvent.click(screen.getByTestId('trigger-ended'));
        expect(onEnded).toHaveBeenCalledOnce();
    });

    it('calls onError when the player fires an error', () => {
        const onError = vi.fn();
        render(<FlashcardPlayer {...baseProps({onError})} />);
        fireEvent.click(screen.getByTestId('trigger-error'));
        expect(onError).toHaveBeenCalledOnce();
    });
});
