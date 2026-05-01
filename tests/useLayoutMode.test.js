import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import {useLayoutMode, getLayoutMode} from '../src/hooks/useLayoutMode';

function setViewport(width, height) {
    Object.defineProperty(window, 'innerWidth',  {value: width,  configurable: true, writable: true});
    Object.defineProperty(window, 'innerHeight', {value: height, configurable: true, writable: true});
}

function setScreenOrientation(type) {
    if (type === undefined) {
        Object.defineProperty(globalThis, 'screen', {
            value: {...globalThis.screen, orientation: undefined},
            configurable: true,
        });
        return;
    }
    Object.defineProperty(globalThis, 'screen', {
        value: {
            ...globalThis.screen,
            orientation: {
                type,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
            },
        },
        configurable: true,
    });
}

const ORIGINAL_SCREEN = globalThis.screen;

beforeEach(() => {
    setScreenOrientation(undefined);
});

afterEach(() => {
    Object.defineProperty(globalThis, 'screen', {value: ORIGINAL_SCREEN, configurable: true});
});

describe('getLayoutMode', () => {
    it('returns phone-portrait for narrow taller-than-wide viewport', () => {
        setViewport(375, 667);
        expect(getLayoutMode()).toBe('phone-portrait');
    });

    it('returns phone-landscape for narrow wider-than-tall viewport', () => {
        setViewport(667, 375);
        expect(getLayoutMode()).toBe('phone-landscape');
    });

    it('returns tablet-portrait for medium taller-than-wide viewport', () => {
        setViewport(768, 1024);
        expect(getLayoutMode()).toBe('tablet-portrait');
    });

    it('returns tablet-landscape for medium wider-than-tall viewport', () => {
        setViewport(1023, 768);
        expect(getLayoutMode()).toBe('tablet-landscape');
    });

    it('returns desktop for viewports above the tablet threshold', () => {
        setViewport(1440, 900);
        expect(getLayoutMode()).toBe('desktop');
    });

    it('treats 767px wide landscape as phone-landscape (max phone boundary)', () => {
        setViewport(767, 430);
        expect(getLayoutMode()).toBe('phone-landscape');
    });

    it('treats 768px wide portrait as tablet-portrait (min tablet boundary)', () => {
        setViewport(768, 1024);
        expect(getLayoutMode()).toBe('tablet-portrait');
    });

    it('uses screen.orientation.type when API is available (landscape-primary)', () => {
        setScreenOrientation('landscape-primary');
        setViewport(600, 800); // taller than wide, but API says landscape
        expect(getLayoutMode()).toBe('phone-landscape');
    });

    it('uses screen.orientation.type when API is available (portrait-primary)', () => {
        setScreenOrientation('portrait-primary');
        setViewport(900, 600); // wider than tall, but API says portrait
        expect(getLayoutMode()).toBe('tablet-portrait');
    });

    it('falls back to innerWidth>innerHeight when screen.orientation is undefined', () => {
        setScreenOrientation(undefined);
        setViewport(800, 600);
        expect(getLayoutMode()).toBe('tablet-landscape');
    });
});

describe('useLayoutMode', () => {
    it('returns the initial layout mode on mount', () => {
        setViewport(375, 667);
        const {result} = renderHook(() => useLayoutMode());
        expect(result.current).toBe('phone-portrait');
    });

    it('re-evaluates on orientationchange event', () => {
        setViewport(375, 667);
        const {result} = renderHook(() => useLayoutMode());
        expect(result.current).toBe('phone-portrait');

        act(() => {
            setViewport(667, 375);
            window.dispatchEvent(new Event('orientationchange'));
        });
        expect(result.current).toBe('phone-landscape');
    });

    it('re-evaluates on resize event', () => {
        setViewport(1440, 900);
        const {result} = renderHook(() => useLayoutMode());
        expect(result.current).toBe('desktop');

        act(() => {
            setViewport(375, 667);
            window.dispatchEvent(new Event('resize'));
        });
        expect(result.current).toBe('phone-portrait');
    });
});
