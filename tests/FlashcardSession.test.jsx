import {describe, it, expect} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {FlashcardSession} from '../src/components/FlashcardSession';

const TERMS = [
    {term: 'Banana', code: 'https://example.com/banana.mp4'},
    {term: 'Apple', code: 'https://example.com/apple.mp4'},
    {term: 'Cherry', code: ''},
];

const COLORS = ['#F6C992', '#30525C', '#ACC0D3'];

function renderSession(terms = TERMS, colors = COLORS) {
    render(<FlashcardSession terms={terms} cardColors={colors} onBack={() => {}} />);
}

// Returns the text currently shown on the flashcard card (not the listbox)
function displayedTerm() {
    return document.querySelector('.flashcard-term').textContent;
}

describe('FlashcardSession', () => {
    it('renders the first term on mount', () => {
        renderSession();
        expect(displayedTerm()).toBe('Banana');
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('Next button advances the index', () => {
        renderSession();
        fireEvent.click(screen.getByText('Next →'));
        expect(displayedTerm()).toBe('Apple');
        expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });

    it('Next button wraps from last to first', () => {
        renderSession();
        fireEvent.click(screen.getByText('Next →'));
        fireEvent.click(screen.getByText('Next →'));
        fireEvent.click(screen.getByText('Next →'));
        expect(displayedTerm()).toBe('Banana');
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    it('Prev button decrements the index', () => {
        renderSession();
        fireEvent.click(screen.getByText('Next →'));
        fireEvent.click(screen.getByText('← Prev'));
        expect(displayedTerm()).toBe('Banana');
    });

    it('Prev button wraps from first to last', () => {
        renderSession();
        fireEvent.click(screen.getByText('← Prev'));
        expect(displayedTerm()).toBe('Cherry');
        expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });

    it('ArrowRight key navigates forward', () => {
        renderSession();
        fireEvent.keyDown(window, {key: 'ArrowRight'});
        expect(displayedTerm()).toBe('Apple');
    });

    it('ArrowLeft key navigates backward', () => {
        renderSession();
        fireEvent.keyDown(window, {key: 'ArrowLeft'});
        expect(displayedTerm()).toBe('Cherry');
    });

    it('arrow keys do not navigate when listbox is focused', () => {
        renderSession();
        const listbox = screen.getByRole('listbox');
        listbox.focus();
        fireEvent.keyDown(window, {key: 'ArrowRight'});
        expect(displayedTerm()).toBe('Banana');
    });

    it('listbox is always visible without a toggle', () => {
        renderSession();
        expect(screen.getByRole('listbox')).toBeInTheDocument();
        expect(screen.queryByText('List')).not.toBeInTheDocument();
    });

    it('listbox is sorted alphabetically', () => {
        renderSession();
        const options = screen.getAllByRole('option');
        const labels = options.map(o => o.textContent);
        expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b)));
    });

    it('selecting a listbox option updates the displayed term', () => {
        renderSession();
        const listbox = screen.getByRole('listbox');
        // Apple is at index 1 in localTerms
        fireEvent.change(listbox, {target: {value: '1'}});
        expect(displayedTerm()).toBe('Apple');
    });

    it('listbox value stays in sync after button navigation', () => {
        renderSession();
        fireEvent.click(screen.getByText('Next →'));
        expect(screen.getByRole('listbox').value).toBe('1');
    });

    it('shows a placeholder when a term has an empty code field', () => {
        renderSession([{term: 'NoVideo', code: ''}], ['#F6C992']);
        expect(screen.getByText('No video available')).toBeInTheDocument();
        expect(screen.queryByTitle('ASL sign video')).not.toBeInTheDocument();
    });

    it('shows an iframe when a term has a non-empty code field', () => {
        renderSession([{term: 'HasVideo', code: 'https://example.com/video.mp4'}], ['#F6C992']);
        expect(screen.getByTitle('ASL sign video')).toBeInTheDocument();
        expect(screen.queryByText('No video available')).not.toBeInTheDocument();
    });

    it('Shuffle resets to index 0', () => {
        renderSession();
        fireEvent.click(screen.getByText('Next →'));
        fireEvent.click(screen.getByText('⇄ Shuffle'));
        expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });
});
