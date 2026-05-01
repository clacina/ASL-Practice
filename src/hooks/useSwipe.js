import {useRef} from 'react';

export function useSwipe({onSwipeLeft, onSwipeRight, minDistance = 50}) {
    const startX = useRef(null);

    function onTouchStart(e) {
        const touch = e.changedTouches && e.changedTouches[0];
        startX.current = touch ? touch.clientX : null;
    }

    function onTouchEnd(e) {
        if (startX.current === null) return;
        const touch = e.changedTouches && e.changedTouches[0];
        if (!touch) { startX.current = null; return; }
        const deltaX = touch.clientX - startX.current;
        startX.current = null;
        if (Math.abs(deltaX) < minDistance) return;
        if (deltaX < 0) {
            if (typeof onSwipeLeft === 'function') onSwipeLeft();
        } else {
            if (typeof onSwipeRight === 'function') onSwipeRight();
        }
    }

    return {onTouchStart, onTouchEnd};
}
