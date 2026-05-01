import {useState, useEffect} from 'react';
import {PHONE_MAX_WIDTH, TABLET_MAX_WIDTH} from '../constants/breakpoints';

function isLandscapeOrientation(width, height) {
    if (typeof screen !== 'undefined' && screen.orientation && typeof screen.orientation.type === 'string') {
        const t = screen.orientation.type;
        return t === 'landscape-primary' || t === 'landscape-secondary';
    }
    return width > height;
}

export function getLayoutMode() {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const h = typeof window !== 'undefined' ? window.innerHeight : 768;
    const landscape = isLandscapeOrientation(w, h);
    if (w <= PHONE_MAX_WIDTH) return landscape ? 'phone-landscape' : 'phone-portrait';
    if (w <= TABLET_MAX_WIDTH) return landscape ? 'tablet-landscape' : 'tablet-portrait';
    return 'desktop';
}

export function useLayoutMode() {
    const [mode, setMode] = useState(getLayoutMode);

    useEffect(() => {
        function check() { setMode(getLayoutMode()); }
        window.addEventListener('resize', check);
        window.addEventListener('orientationchange', check);
        const so = typeof screen !== 'undefined' ? screen.orientation : null;
        if (so && typeof so.addEventListener === 'function') {
            so.addEventListener('change', check);
        }
        return () => {
            window.removeEventListener('resize', check);
            window.removeEventListener('orientationchange', check);
            if (so && typeof so.removeEventListener === 'function') {
                so.removeEventListener('change', check);
            }
        };
    }, []);

    return mode;
}
