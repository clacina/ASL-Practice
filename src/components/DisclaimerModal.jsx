import {useEffect, useRef} from "react";

export function DisclaimerModal({onClose}) {
  const closeButtonRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    function handleKey(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const panel = panelRef.current;
        if (!panel) return;
        const focusable = Array.from(panel.querySelectorAll('button, a[href]'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="disclaimer-modal">
      <div
        className="disclaimer-modal__backdrop"
        onClick={onClose}
        onKeyDown={onClose}
        role="button"
        aria-label="Close disclaimer"
        tabIndex="-1"
      />
      <div
        ref={panelRef}
        className="disclaimer-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="disclaimer-title"
      >
        <button
          ref={closeButtonRef}
          className="disclaimer-modal__close"
          aria-label="Close disclaimer"
          onClick={onClose}
        >✕</button>
        <div className="disclaimer-modal__body">
          <h4 id="disclaimer-title">Welcome to my ASL training playground.</h4>
          <p><em>The content on this site is taken from several different resources.</em></p>
          <p>I do NOT own any of the content shown.</p>
          <p>This site is not for professional use and is only for helping study ASL.</p>
          <p>I cannot promise that the signs provided are the most recent versions of ASL, but they were
            taken from self-proclaimed ASL websites.</p>
          <p>I have made attempts to restrict signs to ASL vs other sign languages (BSL, etc.).</p>
          <hr/>
          <p>If you have questions or find errors, please email me at <a href='mailto:clacina@mindspring.com'>clacina@mindspring.com</a></p>
        </div>
      </div>
    </div>
  );
}
