import {useState, useEffect, useRef} from "react";
import {DisclaimerModal} from "./DisclaimerModal";

export function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  function handleClose() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  useEffect(() => {
    document.body.classList.toggle('modal-open', isOpen);
    return () => document.body.classList.remove('modal-open');
  }, [isOpen]);

  return (
    <footer className="site-footer">
      <p className="site-footer__icon">
        <span aria-label="ASL hand sign">🤟</span> ASL Flashcards
      </p>
      <button
        ref={triggerRef}
        className="site-footer__disclaimer-btn"
        onClick={() => setIsOpen(true)}
      >
        Disclaimer
      </button>

      {isOpen && <DisclaimerModal onClose={handleClose} />}
    </footer>
  );
}
